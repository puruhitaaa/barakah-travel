<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Package;
use App\Models\Transaction;
use App\Models\User;
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
            new Middleware('role:admin'),
        ];
    }

    public function index(Request $request): Response
    {
        // Overview statistics
        $stats = [
            'total_packages' => Package::count(),
            'total_bookings' => Booking::count(),
            'total_revenue' => Transaction::where('status', 'success')->sum('amount'),
            'total_users' => User::count(),
        ];

        // Monthly revenue for the last 6 months
        $monthlyRevenue = Transaction::where('status', 'success')
            ->where('created_at', '>=', now()->subMonths(6))
            ->select(
                DB::raw('to_char(created_at, \'YYYY-MM\') as month'),
                DB::raw('SUM(amount) as revenue')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($item) => [
                'month' => $item->month,
                'revenue' => (float) $item->revenue,
            ]);

        // Bookings by status
        $bookingsByStatus = Booking::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'count' => $item->count,
            ]);

        // Packages by type
        $packagesByType = Package::select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->get()
            ->map(fn ($item) => [
                'type' => $item->type,
                'count' => $item->count,
            ]);

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

        // Transaction status breakdown
        $transactionsByStatus = Transaction::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'count' => $item->count,
            ]);

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'monthlyRevenue' => $monthlyRevenue,
            'bookingsByStatus' => $bookingsByStatus,
            'packagesByType' => $packagesByType,
            'recentBookings' => $recentBookings,
            'transactionsByStatus' => $transactionsByStatus,
        ]);
    }
}
