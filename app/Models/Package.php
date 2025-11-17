<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Package extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'type',
        'duration_days',
        'price',
        'departure_date',
        'return_date',
        'available_slots',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'departure_date' => 'date',
            'return_date' => 'date',
            'is_featured' => 'boolean',
            'price' => 'decimal:2',
        ];
    }

    public function accommodations(): BelongsToMany
    {
        return $this->belongsToMany(Accommodation::class)->withTimestamps();
    }

    public function transportations(): BelongsToMany
    {
        return $this->belongsToMany(Transportation::class)->withTimestamps();
    }

    public function itineraries(): BelongsToMany
    {
        return $this->belongsToMany(Itinerary::class)->withTimestamps();
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }
}
