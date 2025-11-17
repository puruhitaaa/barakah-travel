<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Packages\StorePackageRequest;
use App\Http\Requests\Packages\UpdatePackageRequest;
use App\Jobs\StorePackageMedia;
use App\Models\Package;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class PackageController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
            new Middleware('role:admin'),
        ];
    }

    public function index(Request $request): Response
    {
        $query = Package::query();
        // Eager load media so the edit dialog can display existing media
        $query->with('media');

        $search = (string) $request->query('q', '');
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }
        if ($request->filled('is_featured')) {
            $query->where('is_featured', filter_var($request->string('is_featured'), FILTER_VALIDATE_BOOLEAN));
        }
        if ($request->filled('departure_from')) {
            $query->whereDate('departure_date', '>=', $request->date('departure_from'));
        }
        if ($request->filled('departure_to')) {
            $query->whereDate('departure_date', '<=', $request->date('departure_to'));
        }

        $allowedSorts = ['name', 'price', 'departure_date', 'available_slots', 'type', 'created_at'];
        $sort = $request->string('sort');
        $direction = $request->string('direction', 'desc');
        $sort = in_array($sort, $allowedSorts, true) ? $sort : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sort, $direction);

        $perPage = max(1, min((int) $request->query('per_page', 10), 100));
        $items = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/packages', [
            'items' => $items,
            'filters' => [
                'q' => $search,
                'type' => $request->string('type'),
                'is_featured' => $request->string('is_featured'),
                'departure_from' => $request->string('departure_from'),
                'departure_to' => $request->string('departure_to'),
            ],
            'sort' => [
                'by' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function store(StorePackageRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $tmpPaths = [];

        try {
            DB::beginTransaction();

            $package = Package::create($data);

            if ($request->has('media')) {
                $mediaItems = $request->input('media', []);
                $mediaFiles = $request->file('media', []);

                foreach ($mediaItems as $index => $mediaItem) {
                    if (isset($mediaFiles[$index]['file'])) {
                        $file = $mediaFiles[$index]['file'];
                        $tmpPath = $file->store('tmp/packages', 'public');
                        $tmpPaths[] = $tmpPath;

                        StorePackageMedia::dispatch(
                            packageId: $package->id,
                            tmpPath: $tmpPath,
                            type: $mediaItem['type'] ?? 'image',
                            altText: $mediaItem['alt_text'] ?? null,
                            disk: 'public',
                        )->afterCommit();
                    }
                }
            }

            DB::commit();

            return redirect()->route('admin.packages.index')->with('success', 'Package created');
        } catch (Throwable $e) {
            DB::rollBack();
            foreach ($tmpPaths as $path) {
                Storage::disk('public')->delete($path);
            }
            throw $e;
        }
    }

    public function update(UpdatePackageRequest $request, Package $package): RedirectResponse
    {
        $data = $request->validated();

        $tmpPaths = [];

        try {
            DB::beginTransaction();

            $package->update($data);

            if ($request->has('media')) {
                $mediaItems = $request->input('media', []);
                $mediaFiles = $request->file('media', []);

                foreach ($mediaItems as $index => $mediaItem) {
                    if (isset($mediaFiles[$index]['file'])) {
                        $file = $mediaFiles[$index]['file'];
                        $tmpPath = $file->store('tmp/packages', 'public');
                        $tmpPaths[] = $tmpPath;

                        StorePackageMedia::dispatch(
                            packageId: $package->id,
                            tmpPath: $tmpPath,
                            type: $mediaItem['type'] ?? 'image',
                            altText: $mediaItem['alt_text'] ?? null,
                            disk: 'public',
                        )->afterCommit();
                    }
                }
            }

            DB::commit();

            return redirect()->route('admin.packages.index')->with('success', 'Package updated');
        } catch (Throwable $e) {
            DB::rollBack();
            foreach ($tmpPaths as $path) {
                Storage::disk('public')->delete($path);
            }
            throw $e;
        }
    }

    public function destroy(Package $package): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $mediaItems = $package->media()->get();
            foreach ($mediaItems as $media) {
                $disk = $media->disk ?? 'public';
                $path = $media->path;

                if ($path) {
                    Storage::disk($disk)->delete($path);
                }

                $media->delete();
            }

            $package->delete();

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }

        return redirect()->route('admin.packages.index')->with('success', 'Package deleted');
    }
}
