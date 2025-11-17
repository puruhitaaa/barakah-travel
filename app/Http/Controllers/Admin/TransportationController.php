<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transportations\StoreTransportationRequest;
use App\Http\Requests\Transportations\UpdateTransportationRequest;
use App\Models\Transportation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class TransportationController extends Controller implements HasMiddleware
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
        $query = Transportation::query();

        $search = (string) $request->query('q', '');
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('type', 'like', "%$search%")
                    ->orWhere('company', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }
        if ($request->filled('company')) {
            $query->where('company', 'like', '%'.$request->string('company').'%');
        }
        if ($request->filled('capacity_min')) {
            $query->where('capacity', '>=', (int) $request->query('capacity_min'));
        }
        if ($request->filled('capacity_max')) {
            $query->where('capacity', '<=', (int) $request->query('capacity_max'));
        }

        $allowedSorts = ['type', 'company', 'capacity', 'created_at'];
        $sort = $request->string('sort');
        $direction = $request->string('direction', 'desc');
        $sort = in_array($sort, $allowedSorts, true) ? $sort : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sort, $direction);

        $perPage = max(1, min((int) $request->query('per_page', 15), 100));
        $items = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/transportations', [
            'items' => $items,
            'filters' => [
                'q' => $search,
                'type' => $request->string('type'),
                'company' => $request->string('company'),
                'capacity_min' => $request->string('capacity_min'),
                'capacity_max' => $request->string('capacity_max'),
            ],
            'sort' => [
                'by' => $sort,
                'direction' => $direction,
            ],
            'transportationTypes' => [
                ['value' => 'bus', 'label' => 'Bus'],
                ['value' => 'flight', 'label' => 'Flight'],
                ['value' => 'train', 'label' => 'Train'],
                ['value' => 'van', 'label' => 'Van'],
            ],
        ]);
    }

    public function store(StoreTransportationRequest $request): RedirectResponse
    {
        Transportation::create($request->validated());

        return redirect()->route('admin.transportations.index')->with('success', 'Transportation created');
    }

    public function update(UpdateTransportationRequest $request, Transportation $transportation): RedirectResponse
    {
        $transportation->update($request->validated());

        return redirect()->route('admin.transportations.index')->with('success', 'Transportation updated');
    }

    public function destroy(Transportation $transportation): RedirectResponse
    {
        $transportation->delete();

        return redirect()->route('admin.transportations.index')->with('success', 'Transportation deleted');
    }
}
