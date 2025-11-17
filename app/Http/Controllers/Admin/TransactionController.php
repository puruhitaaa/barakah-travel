<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transactions\StoreTransactionRequest;
use App\Http\Requests\Transactions\UpdateTransactionRequest;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller implements HasMiddleware
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
        $query = Transaction::query()->with(['booking:id,booking_reference']);

        $search = (string) $request->query('q', '');
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('reference_number', 'like', "%$search%")
                    ->orWhere('payment_method', 'like', "%$search%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }
        if ($request->filled('booking_id')) {
            $query->where('booking_id', (int) $request->query('booking_id'));
        }
        if ($request->filled('amount_min')) {
            $query->where('amount', '>=', (float) $request->query('amount_min'));
        }
        if ($request->filled('amount_max')) {
            $query->where('amount', '<=', (float) $request->query('amount_max'));
        }

        $allowedSorts = ['amount', 'status', 'created_at'];
        $sort = $request->string('sort');
        $direction = $request->string('direction', 'desc');
        $sort = in_array($sort, $allowedSorts, true) ? $sort : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sort, $direction);

        $perPage = max(1, min((int) $request->query('per_page', 10), 100));
        $items = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/transactions', [
            'items' => $items,
            'filters' => [
                'q' => $search,
                'status' => $request->string('status'),
                'booking_id' => $request->string('booking_id'),
                'amount_min' => $request->string('amount_min'),
                'amount_max' => $request->string('amount_max'),
            ],
            'sort' => [
                'by' => $sort,
                'direction' => $direction,
            ],
            'bookings' => \App\Models\Booking::select('id', 'booking_reference')->orderBy('booking_reference')->get(),
            'paymentGateways' => \App\Models\PaymentGateway::select('id', 'name')->where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    public function store(StoreTransactionRequest $request): RedirectResponse
    {
        Transaction::create($request->validated());

        return redirect()->route('admin.transactions.index')->with('success', 'Transaction created');
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        $transaction->update($request->validated());

        return redirect()->route('admin.transactions.index')->with('success', 'Transaction updated');
    }

    public function destroy(Transaction $transaction): RedirectResponse
    {
        $transaction->delete();

        return redirect()->route('admin.transactions.index')->with('success', 'Transaction deleted');
    }
}
