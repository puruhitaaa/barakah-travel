<?php

namespace App\Jobs;

use App\Models\Booking;
use App\Models\PaymentGateway;
use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Notification;

class ProcessMidtransWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public array $notificationData
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Get Midtrans gateway configuration
            $gateway = PaymentGateway::where('name', 'Midtrans')
                ->where('is_active', true)
                ->first();

            if (! $gateway) {
                Log::error('Midtrans gateway not found or inactive');

                return;
            }

            $config = $gateway->config ?? [];

            // Configure Midtrans
            Config::$serverKey = $config['server_key'] ?? '';
            Config::$isProduction = $config['is_production'] ?? false;

            // Create Notification instance
            $notification = new Notification;

            $transactionStatus = $notification->transaction_status;
            $fraudStatus = $notification->fraud_status;
            $orderId = $notification->order_id;
            $transactionId = $notification->transaction_id;

            // Extract transaction ID from order_id (format: transaction_id-timestamp)
            $txnId = (int) explode('-', $orderId)[0];

            // Find transaction
            $transaction = Transaction::find($txnId);

            if (! $transaction) {
                Log::error('Transaction not found', ['order_id' => $orderId]);

                return;
            }

            DB::beginTransaction();

            try {
                // Update transaction with payment details
                $transaction->reference_number = $orderId;
                $transaction->gateway_type = PaymentGateway::class;
                $transaction->gateway_id = $gateway->id;

                // Determine status based on Midtrans notification
                if ($transactionStatus === 'capture') {
                    if ($fraudStatus === 'accept') {
                        $this->updateStatus($transaction, 'success', 'confirmed');
                    }
                } elseif ($transactionStatus === 'settlement') {
                    $this->updateStatus($transaction, 'success', 'confirmed');
                } elseif ($transactionStatus === 'pending') {
                    $this->updateStatus($transaction, 'pending', 'pending_payment');
                } elseif (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
                    $this->updateStatus($transaction, 'failed', 'cancelled');
                }

                $transaction->save();

                DB::commit();

                Log::info('Midtrans webhook processed successfully', [
                    'order_id' => $orderId,
                    'midtrans_transaction_id' => $transactionId,
                    'transaction_status' => $transactionStatus,
                    'booking_id' => $transaction->booking_id,
                    'gateway_id' => $gateway->id,
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Midtrans webhook processing failed', [
                'error' => $e->getMessage(),
                'notification_data' => $this->notificationData,
            ]);
        }
    }

    /**
     * Update transaction and booking status
     */
    private function updateStatus(Transaction $transaction, string $transactionStatus, string $bookingStatus): void
    {
        $transaction->status = $transactionStatus;

        if ($transaction->booking) {
            $transaction->booking->status = $bookingStatus;
            $transaction->booking->save();

            Log::info('Booking status updated', [
                'booking_id' => $transaction->booking->id,
                'previous_status' => $transaction->booking->getOriginal('status'),
                'new_status' => $bookingStatus,
                'transaction_id' => $transaction->id,
                'transaction_status' => $transactionStatus,
            ]);
        }
    }
}
