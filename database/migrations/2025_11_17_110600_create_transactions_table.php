<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'success', 'failed'])->index();
            $table->string('payment_method', 64)->nullable();
            $table->string('reference_number')->unique();
            $table->foreignId('booking_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->string('gateway_type')->nullable();
            $table->unsignedBigInteger('gateway_id')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['gateway_type', 'gateway_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
