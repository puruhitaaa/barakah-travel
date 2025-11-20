<?php

namespace App\Jobs;

use App\Models\Package;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class StorePackageMedia implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $packageId,
        public string $tmpPath,
        public string $type = 'image',
        public ?string $altText = null,
        public string $disk = 'public'
    ) {}

    public function handle(): void
    {
        DB::transaction(function (): void {
            $package = Package::query()->findOrFail($this->packageId);

            $extension = pathinfo($this->tmpPath, PATHINFO_EXTENSION) ?: 'bin';
            $finalName = Str::uuid()->toString().'.'.$extension;
            $finalPath = 'media/packages/'.$finalName;

            Storage::disk($this->disk)->move($this->tmpPath, $finalPath);

            $absolute = Storage::disk($this->disk)->path($finalPath);
            $size = filesize($absolute) ?: null;
            $mime = mime_content_type($absolute) ?: null;

            // If Cloudinary PHP SDK is installed, upload to Cloudinary
            if (class_exists(\Cloudinary\Cloudinary::class)) {
                try {
                    $cloudName = config('services.cloudinary.cloud_name');
                    $apiKey = config('services.cloudinary.api_key');
                    $apiSecret = config('services.cloudinary.api_secret');

                    $cloudinary = new \Cloudinary\Cloudinary([
                        'cloud' => [
                            'cloud_name' => $cloudName,
                            'api_key' => $apiKey,
                            'api_secret' => $apiSecret,
                        ],
                    ]);

                    $uploadOptions = ['folder' => 'packages'];
                    if ($this->type === 'video') {
                        $uploadOptions['resource_type'] = 'video';
                    }

                    $result = $cloudinary->uploadApi()->upload($absolute, $uploadOptions);

                    $package->media()->create([
                        'type' => $this->type,
                        'disk' => 'cloudinary',
                        'path' => $result['secure_url'] ?? $result['url'] ?? $finalPath,
                        'external_id' => $result['public_id'] ?? null,
                        'mime_type' => $result['format'] ?? $mime,
                        'size' => $result['bytes'] ?? $size,
                        'alt_text' => $this->altText,
                        'ordering' => 0,
                    ]);

                    // Remove the local file we moved earlier
                    Storage::disk($this->disk)->delete($finalPath);
                } catch (Throwable $e) {
                    // Ensure local file is cleaned up if cloud upload fails
                    Storage::disk($this->disk)->delete($finalPath);
                    throw $e;
                }
            } else {
                $package->media()->create([
                    'type' => $this->type,
                    'disk' => $this->disk,
                    'path' => $finalPath,
                    'mime_type' => $mime,
                    'size' => $size,
                    'alt_text' => $this->altText,
                    'ordering' => 0,
                ]);
            }
        });
    }

    public function failed(\Throwable $e): void
    {
        Storage::disk($this->disk)->delete($this->tmpPath);
    }
}
