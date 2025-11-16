<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Packages\StorePackageRequest;
use App\Http\Requests\Packages\UpdatePackageRequest;
use App\Models\Package;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    public function index(Request $request): Response
    {
        $query = Package::query();

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

        $allowedSorts = ['name', 'price', 'departure_date', 'available_slots', 'created_at'];
        $sort = $request->string('sort');
        $direction = $request->string('direction', 'desc');
        $sort = in_array($sort, $allowedSorts, true) ? $sort : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sort, $direction);

        $perPage = max(1, min((int) $request->query('per_page', 15), 100));
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
        Package::create($data);

        return redirect()->route('admin.packages.index')->with('success', 'Package created');
    }

    public function update(UpdatePackageRequest $request, Package $package): RedirectResponse
    {
        $data = $request->validated();
        $package->update($data);

        return redirect()->route('admin.packages.index')->with('success', 'Package updated');
    }

    public function destroy(Package $package): RedirectResponse
    {
        $package->delete();

        return redirect()->route('admin.packages.index')->with('success', 'Package deleted');
    }
}
