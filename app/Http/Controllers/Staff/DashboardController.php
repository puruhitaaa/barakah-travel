<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller implements HasMiddleware
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
        // Overview statistics (staff view - limited to operational data)
        $stats = [
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
            'total_revenue' => Transaction::where('status', 'success')->sum('amount'),
            'pending_transactions' => Transaction::where('status', 'pending')->count(),
        ];

        // Recent bookings trend (last 7 days)
        $recentBookings = Booking::where('created_at', '>=', now()->subDays(7))
            ->select(
                DB::raw('DATE(created_at)::text as date'),
                DB::raw('count(*) as bookings')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy(DB::raw('DATE(created_at)'))
            ->get()
            ->map(fn ($item) => [
                'date' => $item->date,
                'bookings' => $item->bookings,
            ]);

        // Bookings by status
        $bookingsByStatus = Booking::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'count' => $item->count,
            ]);

        // Transaction status breakdown
        $transactionsByStatus = Transaction::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'count' => $item->count,
            ]);

        return Inertia::render('staff/dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'bookingsByStatus' => $bookingsByStatus,
            'transactionsByStatus' => $transactionsByStatus,
        ]);
    }
}
