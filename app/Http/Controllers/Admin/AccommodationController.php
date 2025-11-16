<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Accommodations\StoreAccommodationRequest;
use App\Http\Requests\Accommodations\UpdateAccommodationRequest;
use App\Models\Accommodation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class AccommodationController extends Controller implements HasMiddleware
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
        $query = Accommodation::query();

        $search = (string) $request->query('q', '');
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%")
                    ->orWhere('location', 'like', "%$search%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }
        if ($request->filled('location')) {
            $query->where('location', 'like', '%'.$request->string('location').'%');
        }
        if ($request->filled('rating_min')) {
            $query->where('rating', '>=', (float) $request->query('rating_min'));
        }
        if ($request->filled('rating_max')) {
            $query->where('rating', '<=', (float) $request->query('rating_max'));
        }

        $allowedSorts = ['name', 'rating', 'location', 'created_at'];
        $sort = $request->string('sort');
        $direction = $request->string('direction', 'desc');
        $sort = in_array($sort, $allowedSorts, true) ? $sort : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sort, $direction);

        $perPage = max(1, min((int) $request->query('per_page', 15), 100));
        $items = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/accommodations', [
            'items' => $items,
            'filters' => [
                'q' => $search,
                'type' => $request->string('type'),
                'location' => $request->string('location'),
                'rating_min' => $request->string('rating_min'),
                'rating_max' => $request->string('rating_max'),
            ],
            'sort' => [
                'by' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function store(StoreAccommodationRequest $request): RedirectResponse
    {
        Accommodation::create($request->validated());

        return redirect()->route('admin.accommodations.index')->with('success', 'Accommodation created');
    }

    public function update(UpdateAccommodationRequest $request, Accommodation $accommodation): RedirectResponse
    {
        $accommodation->update($request->validated());

        return redirect()->route('admin.accommodations.index')->with('success', 'Accommodation updated');
    }

    public function destroy(Accommodation $accommodation): RedirectResponse
    {
        $accommodation->delete();

        return redirect()->route('admin.accommodations.index')->with('success', 'Accommodation deleted');
    }
}
