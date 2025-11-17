<?php

namespace App\Http\Controllers;

use App\Http\Requests\Bookings\StoreBookingPaymentRequest;
use App\Jobs\ProcessMidtransWebhook;
use App\Models\Booking;
use App\Models\PaymentGateway;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Midtrans\Config;
use Midtrans\Snap;

class BookingPaymentController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
            new Middleware('verified'),
        ];
    }

    /**
     * Create booking and initiate Midtrans Snap payment
     */
    public function store(StoreBookingPaymentRequest $request): JsonResponse
    {
        try {
            // Get Midtrans gateway configuration
            $gateway = PaymentGateway::where('name', 'Midtrans')
                ->where('is_active', true)
                ->firstOrFail();

            $config = $gateway->config ?? [];

            // Configure Midtrans
            Config::$serverKey = $config['server_key'] ?? '';
            Config::$clientKey = $config['client_key'] ?? '';
            Config::$isProduction = $config['is_production'] ?? false;
            Config::$isSanitized = $config['is_sanitized'] ?? true;
            Config::$is3ds = $config['is_3ds'] ?? true;

            $booking = null;
            $transaction = null;

            DB::beginTransaction();

            try {
                // Create booking
                $booking = Booking::create([
                    'booking_reference' => 'BK-'.strtoupper(uniqid()),
                    'status' => 'pending_payment',
                    'notes' => $request->input('notes'),
                    'user_id' => $request->user()->id,
                    'package_id' => $request->input('package_id'),
                ]);

                // Create transaction
                $transaction = Transaction::create([
                    'amount' => $request->input('amount'),
                    'status' => 'pending',
                    'payment_method' => 'midtrans',
                    'booking_id' => $booking->id,
                    'gateway_type' => PaymentGateway::class,
                    'gateway_id' => $gateway->id,
                ]);

                // Prepare Snap transaction parameters
                $params = [
                    'transaction_details' => [
                        'order_id' => $transaction->id.'-'.time(),
                        'gross_amount' => (int) $request->input('amount'),
                    ],
                    'customer_details' => [
                        'first_name' => $request->user()->name,
                        'email' => $request->user()->email,
                    ],
                    'item_details' => [
                        [
                            'id' => $request->input('package_id'),
                            'price' => (int) $request->input('amount'),
                            'quantity' => 1,
                            'name' => 'Package Booking',
                        ],
                    ],
                    'callbacks' => [
                        'finish' => route('booking.payment.success'),
                    ],
                ];

                // Get Snap token
                $snapToken = Snap::getSnapToken($params);

                DB::commit();

                return response()->json([
                    'snap_token' => $snapToken,
                    'booking_id' => $booking->id,
                ]);

            } catch (\Exception $e) {
                DB::rollBack();

                // Clean up created records
                if ($transaction) {
                    $transaction->forceDelete();
                }
                if ($booking) {
                    $booking->forceDelete();
                }

                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Midtrans Snap payment failed', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->id,
            ]);

            return response()->json([
                'error' => 'Failed to initiate payment. Please try again.',
            ], 500);
        }
    }

    /**
     * Handle Midtrans webhook notifications
     */
    public function webhook(Request $request): JsonResponse
    {
        // Dispatch job to process webhook asynchronously
        ProcessMidtransWebhook::dispatch($request->all());

        return response()->json(['status' => 'ok']);
    }

    /**
     * Payment success page
     */
    public function success(): Response
    {
        return Inertia::render('booking/payment-success');
    }

    /**
     * Payment error page
     */
    public function error(): Response
    {
        return Inertia::render('booking/payment-error');
    }

    /**
     * Payment pending page
     */
    public function pending(): Response
    {
        return Inertia::render('booking/payment-pending');
    }
}
