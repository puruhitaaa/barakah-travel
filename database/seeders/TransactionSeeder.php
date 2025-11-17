<?php

namespace Database\Seeders;

use App\Models\Transaction;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create transactions with various statuses
        Transaction::factory(40)->success()->create();
        Transaction::factory(15)->pending()->create();
        Transaction::factory(10)->failed()->create();
    }
}
