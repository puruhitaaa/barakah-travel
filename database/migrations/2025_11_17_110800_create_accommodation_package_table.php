<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accommodation_package', function (Blueprint $table) {
            $table->id();
            $table->foreignId('accommodation_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('package_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['accommodation_id', 'package_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accommodation_package');
    }
};
