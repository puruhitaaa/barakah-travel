<?php

namespace App\Observers;

use App\Models\Booking;
use Illuminate\Support\Str;

class BookingObserver
{
    public function creating(Booking $booking): void
    {
        if (! $booking->booking_reference) {
            $booking->booking_reference = 'BK-'.Str::upper(Str::random(8));
        }
        if (! $booking->status) {
            $booking->status = 'pending';
        }
    }
}
