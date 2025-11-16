<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Media\StoreMediaRequest;
use App\Http\Requests\Media\UpdateMediaRequest;
use App\Models\Media;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    public function index(Request $request): Response
    {
        $query = Media::query();

        $search = (string) $request->query('q', '');
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('path', 'like', "%$search%")
                    ->orWhere('mime_type', 'like', "%$search%")
                    ->orWhere('alt_text', 'like', "%$search%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }
        if ($request->filled('mediable_type')) {
            $query->where('mediable_type', $request->string('mediable_type'));
        }
        if ($request->filled('mediable_id')) {
            $query->where('mediable_id', (int) $request->query('mediable_id'));
        }

        $allowedSorts = ['ordering', 'created_at'];
        $sort = $request->string('sort');
        $direction = $request->string('direction', 'desc');
        $sort = in_array($sort, $allowedSorts, true) ? $sort : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sort, $direction);

        $perPage = max(1, min((int) $request->query('per_page', 15), 100));
        $items = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/media', [
            'items' => $items,
            'filters' => [
                'q' => $search,
                'type' => $request->string('type'),
                'mediable_type' => $request->string('mediable_type'),
                'mediable_id' => $request->string('mediable_id'),
            ],
            'sort' => [
                'by' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function store(StoreMediaRequest $request): RedirectResponse
    {
        Media::create($request->validated());

        return redirect()->route('admin.media.index')->with('success', 'Media created');
    }

    public function update(UpdateMediaRequest $request, Media $media): RedirectResponse
    {
        $media->update($request->validated());

        return redirect()->route('admin.media.index')->with('success', 'Media updated');
    }

    public function destroy(Media $media): RedirectResponse
    {
        $media->delete();

        return redirect()->route('admin.media.index')->with('success', 'Media deleted');
    }
}
