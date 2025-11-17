<?php

namespace Database\Seeders;

use App\Models\PaymentGateway;
use Illuminate\Database\Seeder;

class PaymentGatewaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create active Midtrans gateway with test credentials
        PaymentGateway::create([
            'name' => 'Midtrans',
            'config' => [
                'server_key' => 'SB-Mid-server-key-placeholder',
                'client_key' => 'SB-Mid-client-key-placeholder',
                'is_production' => false,
                'is_sanitized' => true,
                'is_3ds' => true,
            ],
            'is_active' => true,
        ]);

        // Create other random payment gateways
        PaymentGateway::factory(8)->create();
    }
}
