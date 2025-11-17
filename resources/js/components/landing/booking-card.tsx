'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

type BookingCardProps = {
    pkg: {
        price: number;
    };
};

export function BookingCard({ pkg }: BookingCardProps) {
    const [quantity, setQuantity] = useState(1);

    const totalPrice = pkg.price * quantity;

    return (
        <Card className="sticky top-8 overflow-hidden">
            <CardHeader className="border-b border-primary/10 bg-gradient-to-br from-primary/15 to-primary/5 px-6 py-8">
                <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                        Start Your Spiritual Journey
                    </p>
                    <CardTitle className="text-3xl leading-tight font-bold text-foreground">
                        Book Your Package
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {/* Price Section */}
                <div className="space-y-2">
                    <p className="text-sm tracking-wide text-foreground/60 uppercase">
                        Price Per Person
                    </p>
                    <p className="text-4xl font-bold text-primary">
                        {pkg.price.toLocaleString('id-ID', {
                            currency: 'IDR',
                            style: 'currency',
                            currencyDisplay: 'code',
                        })}
                    </p>
                </div>

                {/* Quantity Selector */}
                <div className="flex flex-col gap-y-3">
                    <label className="text-sm font-medium text-foreground">
                        Number of Pilgrims
                    </label>
                    <div className="flex items-center gap-3 rounded-lg border border-border p-2">
                        <button
                            onClick={() =>
                                setQuantity(Math.max(1, quantity - 1))
                            }
                            className="cursor-pointer rounded px-3 py-1 transition hover:bg-primary/10"
                        >
                            −
                        </button>
                        <span className="flex-1 text-center font-semibold">
                            {quantity}
                        </span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="cursor-pointer rounded px-3 py-1 transition hover:bg-primary/10"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Total Price */}
                <div className="space-y-1 rounded-lg bg-primary/10 p-4">
                    <p className="text-sm text-foreground/70">Total Price</p>
                    <p className="text-3xl font-bold text-primary">
                        {totalPrice.toLocaleString('id-ID', {
                            currency: 'IDR',
                            style: 'currency',
                            currencyDisplay: 'code',
                        })}
                    </p>
                </div>

                {/* Booking Buttons */}
                <div className="space-y-3">
                    <Button className="w-full bg-primary py-5 text-base font-semibold text-primary-foreground hover:bg-primary/90">
                        Reserve Now
                    </Button>
                    <Button variant="outline" className="w-full py-5">
                        Request Quote
                    </Button>
                </div>

                {/* Features */}
                <div className="space-y-2 border-t border-border pt-6">
                    <p className="mb-4 text-xs font-semibold tracking-wide text-foreground/60 uppercase">
                        Booking Benefits
                    </p>
                    {[
                        'Free cancellation up to 30 days',
                        'Flexible payment plans',
                        'Group discounts available',
                    ].map((benefit, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 text-sm"
                        >
                            <CheckCircle2
                                size={16}
                                className="flex-shrink-0 text-primary"
                            />
                            <span className="text-foreground/70">
                                {benefit}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Contact Support */}
                <div className="space-y-3 rounded-lg border border-border bg-card/50 p-4">
                    <p className="text-sm font-semibold text-foreground">
                        Need Help?
                    </p>
                    <div className="space-y-2">
                        <a
                            href="tel:+966123456789"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <Phone size={16} />
                            +966 (0) 123 456 789
                        </a>
                        <a
                            href="mailto:info@barakahtravel.com"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <Mail size={16} />
                            info@barakahtravel.com
                        </a>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
