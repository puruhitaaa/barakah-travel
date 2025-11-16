<?php

namespace App\Observers;

use App\Models\Package;

class PackageObserver
{
    public function saving(Package $package): void
    {
        if ($package->available_slots < 0) {
            $package->available_slots = 0;
        }
    }
}
