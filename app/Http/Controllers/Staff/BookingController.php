<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bookings\StoreBookingRequest;
use App\Http\Requests\Bookings\UpdateBookingRequest;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
            new Middleware('role:staff'),
        ];
    }

    public function index(Request $request): Response
    {
        $query = Booking::query()->with(['user:id,name,email', 'package:id,name']);

        $search = (string) $request->query('q', '');
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('booking_reference', 'like', "%$search%")
                    ->orWhere('notes', 'like', "%$search%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }
        if ($request->filled('package_id')) {
            $query->where('package_id', (int) $request->query('package_id'));
        }
        if ($request->filled('user_id')) {
            $query->where('user_id', (int) $request->query('user_id'));
        }

        $allowedSorts = ['booking_reference', 'status', 'created_at'];
        $sort = $request->string('sort');
        $direction = $request->string('direction', 'desc');
        $sort = in_array($sort, $allowedSorts, true) ? $sort : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sort, $direction);

        $perPage = max(1, min((int) $request->query('per_page', 10), 100));
        $items = $query->paginate($perPage)->withQueryString();

        return Inertia::render('staff/bookings', [
            'items' => $items,
            'filters' => [
                'q' => $search,
                'status' => $request->string('status'),
                'package_id' => $request->string('package_id'),
                'user_id' => $request->string('user_id'),
            ],
            'sort' => [
                'by' => $sort,
                'direction' => $direction,
            ],
            'users' => \App\Models\User::select('id', 'name', 'email')->orderBy('name')->get(),
            'packages' => \App\Models\Package::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function store(StoreBookingRequest $request): RedirectResponse
    {
        Booking::create($request->validated());

        return redirect()->route('staff.bookings.index')->with('success', 'Booking created');
    }

    public function update(UpdateBookingRequest $request, Booking $booking): RedirectResponse
    {
        $booking->update($request->validated());

        return redirect()->route('staff.bookings.index')->with('success', 'Booking updated');
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        $booking->delete();

        return redirect()->route('staff.bookings.index')->with('success', 'Booking deleted');
    }
}
