'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PackageDetailContentProps = {
    pkg: {
        name: string;
        full_description: string;
        duration: string;
        group: string;
        departure: string;
        price: number;
    };
};

export function PackageDetailContent({ pkg }: PackageDetailContentProps) {
    return (
        <div className="space-y-8">
            {/* Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Package Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="leading-relaxed text-foreground/80">
                        {pkg.full_description}
                    </p>
                    <div className="grid gap-6 border-t border-border pt-4 sm:grid-cols-2">
                        <div>
                            <p className="mb-2 text-sm tracking-wide text-foreground/60 uppercase">
                                Duration
                            </p>
                            <p className="text-xl font-semibold text-primary">
                                {pkg.duration}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-sm tracking-wide text-foreground/60 uppercase">
                                Group Size
                            </p>
                            <p className="text-xl font-semibold text-primary">
                                {pkg.group}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-sm tracking-wide text-foreground/60 uppercase">
                                Departure Schedule
                            </p>
                            <p className="text-xl font-semibold text-primary">
                                {pkg.departure}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-sm tracking-wide text-foreground/60 uppercase">
                                Starting Price
                            </p>
                            <p className="text-xl font-semibold text-primary">
                                {pkg.price.toLocaleString('id-ID', {
                                    currency: 'IDR',
                                    style: 'currency',
                                    currencyDisplay: 'code',
                                })}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Features Highlight */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Why Choose This Package?
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">
                                Spiritual Experience
                            </h3>
                            <p className="text-foreground/70">
                                Guided by experienced spiritual leaders with
                                in-depth knowledge of Islamic traditions and
                                rituals.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">
                                Premium Comfort
                            </h3>
                            <p className="text-foreground/70">
                                Stay in carefully selected hotels with excellent
                                amenities and convenient locations.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">
                                24/7 Support
                            </h3>
                            <p className="text-foreground/70">
                                Round-the-clock assistance from our dedicated
                                team to ensure your peace of mind.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">
                                Community
                            </h3>
                            <p className="text-foreground/70">
                                Travel with like-minded pilgrims and create
                                lasting spiritual connections.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
