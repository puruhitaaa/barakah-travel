<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Itineraries\StoreItineraryRequest;
use App\Http\Requests\Itineraries\UpdateItineraryRequest;
use App\Models\Itinerary;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ItineraryController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    public function index(Request $request): Response
    {
        $query = Itinerary::query();

        $search = (string) $request->query('q', '');
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%")
                    ->orWhere('location', 'like', "%$search%");
            });
        }

        if ($request->filled('day_min')) {
            $query->where('day_number', '>=', (int) $request->query('day_min'));
        }
        if ($request->filled('day_max')) {
            $query->where('day_number', '<=', (int) $request->query('day_max'));
        }
        if ($request->filled('location')) {
            $query->where('location', 'like', '%'.$request->string('location').'%');
        }

        $allowedSorts = ['day_number', 'title', 'location', 'created_at'];
        $sort = $request->string('sort');
        $direction = $request->string('direction', 'desc');
        $sort = in_array($sort, $allowedSorts, true) ? $sort : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sort, $direction);

        $perPage = max(1, min((int) $request->query('per_page', 15), 100));
        $items = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/itineraries', [
            'items' => $items,
            'filters' => [
                'q' => $search,
                'day_min' => $request->string('day_min'),
                'day_max' => $request->string('day_max'),
                'location' => $request->string('location'),
            ],
            'sort' => [
                'by' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function store(StoreItineraryRequest $request): RedirectResponse
    {
        Itinerary::create($request->validated());

        return redirect()->route('admin.itineraries.index')->with('success', 'Itinerary created');
    }

    public function update(UpdateItineraryRequest $request, Itinerary $itinerary): RedirectResponse
    {
        $itinerary->update($request->validated());

        return redirect()->route('admin.itineraries.index')->with('success', 'Itinerary updated');
    }

    public function destroy(Itinerary $itinerary): RedirectResponse
    {
        $itinerary->delete();

        return redirect()->route('admin.itineraries.index')->with('success', 'Itinerary deleted');
    }
}
