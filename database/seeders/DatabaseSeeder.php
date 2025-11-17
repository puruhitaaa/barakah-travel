<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create roles and permissions
        foreach (['package_manage', 'booking_manage', 'payment_process', 'content_manage'] as $name) {
            Permission::findOrCreate($name);
        }

        $admin = Role::findOrCreate('admin');
        $staff = Role::findOrCreate('staff');
        $customer = Role::findOrCreate('customer');

        $admin->givePermissionTo(['package_manage', 'booking_manage', 'payment_process', 'content_manage']);
        $staff->givePermissionTo(['package_manage', 'booking_manage', 'payment_process']);
        $customer->givePermissionTo(['booking_manage']);

        // Create test users
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $staffUser = User::firstOrCreate(
            ['email' => 'staff@example.com'],
            [
                'name' => 'Staff User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $customerUser = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Customer User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $user->assignRole('admin');
        $staffUser->assignRole('staff');
        $customerUser->assignRole('customer');

        // Call all seeders in proper dependency order
        $this->call([
            PackageSeeder::class,
            AccommodationSeeder::class,
            TransportationSeeder::class,
            ItinerarySeeder::class,
            BookingSeeder::class,
            PaymentGatewaySeeder::class,
            TransactionSeeder::class,
            MediaSeeder::class,
            AccommodationPackageSeeder::class,
            PackageTransportationSeeder::class,
            ItineraryPackageSeeder::class,
        ]);
    }
}
