<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentGateways\StorePaymentGatewayRequest;
use App\Http\Requests\PaymentGateways\UpdatePaymentGatewayRequest;
use App\Models\PaymentGateway;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class PaymentGatewayController extends Controller implements HasMiddleware
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
        $query = PaymentGateway::query();

        $search = (string) $request->query('q', '');
        if ($search !== '') {
            $query->where('name', 'like', "%$search%");
        }
        if ($request->filled('is_active')) {
            $query->where('is_active', filter_var($request->string('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        $allowedSorts = ['name', 'is_active', 'created_at'];
        $sort = $request->string('sort');
        $direction = $request->string('direction', 'desc');
        $sort = in_array($sort, $allowedSorts, true) ? $sort : 'created_at';
        $direction = $direction === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sort, $direction);

        $perPage = max(1, min((int) $request->query('per_page', 15), 100));
        $items = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/payment-gateways', [
            'items' => $items,
            'filters' => [
                'q' => $search,
                'is_active' => $request->string('is_active'),
            ],
            'sort' => [
                'by' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function store(StorePaymentGatewayRequest $request): RedirectResponse
    {
        PaymentGateway::create($request->validated());

        return redirect()->route('admin.payment-gateways.index')->with('success', 'Gateway created');
    }

    public function update(UpdatePaymentGatewayRequest $request, PaymentGateway $payment_gateway): RedirectResponse
    {
        $payment_gateway->update($request->validated());

        return redirect()->route('admin.payment-gateways.index')->with('success', 'Gateway updated');
    }

    public function destroy(PaymentGateway $payment_gateway): RedirectResponse
    {
        $payment_gateway->delete();

        return redirect()->route('admin.payment-gateways.index')->with('success', 'Gateway deleted');
    }
}
