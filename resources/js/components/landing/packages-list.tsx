import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { CheckCircle2, Clock, MapPin, Users } from 'lucide-react';

export function PackagesList() {
    const packages = [
        {
            id: 1,
            name: 'Umrah Lite',
            duration: '7 Days',
            price: '$1,299',
            group: '10-20 Pilgrims',
            departure: 'Monthly',
            description:
                'Perfect for first-time pilgrims seeking an affordable and guided Umrah experience.',
            featured: false,
            features: [
                '3-star hotel in Makkah & Medina',
                'Guided Umrah tours',
                'All meals included',
                'Airport transfers',
                'Group prayers',
                'Basic support team',
            ],
            highlights: [
                'Budget-friendly',
                'Small groups',
                'Essential services',
            ],
        },
        {
            id: 2,
            name: 'Umrah Premium',
            duration: '10 Days',
            price: '$2,499',
            group: '20-30 Pilgrims',
            departure: 'Bi-weekly',
            description:
                'Our most popular choice with enhanced comfort and personalized guidance.',
            featured: true,
            features: [
                '4-star hotel accommodations',
                'Personal guides for groups',
                'Premium meals & dining',
                'VIP transportation',
                'Evening educational programs',
                'Shopping and leisure tours',
                '24/7 support hotline',
            ],
            highlights: ['Most popular', 'Enhanced comfort', 'VIP service'],
        },
        {
            id: 3,
            name: 'Umrah Plus',
            duration: '12 Days',
            price: '$3,299',
            group: '15-25 Pilgrims',
            departure: 'Weekly',
            description:
                'Extended Umrah with optional holy sites visits and cultural experiences.',
            featured: false,
            features: [
                '4-star premium hotels',
                'Experienced spiritual guides',
                'Gourmet meal experiences',
                'Luxury coach transportation',
                'Extended programs & lectures',
                'Holy sites (optional extras)',
                'Personal assistant service',
            ],
            highlights: [
                'Extended duration',
                'Spiritual focus',
                'Personal service',
            ],
        },
        {
            id: 4,
            name: 'Hajj Experience',
            duration: '14 Days',
            price: '$3,999',
            group: '30-50 Pilgrims',
            departure: 'Annual (Dhul-Hijjah)',
            description:
                'Complete Hajj pilgrimage with full rituals and comprehensive support throughout.',
            featured: false,
            features: [
                '5-star hotel accommodations',
                'Complete Hajj rituals guidance',
                'Dedicated support team',
                'All meals & special provisions',
                'Ihram provision & clothing',
                'Post-Hajj Umrah included',
                'Medical & emergency support',
            ],
            highlights: ['Full Hajj', 'Luxury comfort', 'Dedicated team'],
        },
        {
            id: 5,
            name: 'Hajj Deluxe',
            duration: '16 Days',
            price: '$4,999',
            group: '20-25 Pilgrims',
            departure: 'Annual (Dhul-Hijjah)',
            description:
                'Ultimate Hajj experience with luxury accommodations and personalized attention.',
            featured: false,
            features: [
                '5-star luxury hotels',
                'Private guides for each group',
                'Michelin-inspired cuisine',
                'Private transportation fleet',
                'Daily seminars & lectures',
                'Extended Umrah programs',
                'Concierge services',
                'Travel insurance included',
            ],
            highlights: [
                'Ultra-luxury',
                'Private guides',
                'Concierge included',
            ],
        },
        {
            id: 6,
            name: 'Corporate Hajj',
            duration: '15 Days',
            price: 'Custom Quote',
            group: 'Flexible Groups',
            departure: 'Custom Dates',
            description:
                'Tailored Hajj packages for organizations and corporate groups.',
            featured: false,
            features: [
                'Customizable duration',
                'Dedicated group leaders',
                'Corporate meal arrangements',
                'Fleet coordination',
                'Daily briefings',
                'Post-pilgrimage events',
                'Group photo services',
                'Customized itineraries',
            ],
            highlights: [
                'Fully customizable',
                'Group rates',
                'Dedicated leadership',
            ],
        },
    ];

    return (
        <section className="bg-background px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Filter Info */}
                <div className="mb-12">
                    <p className="text-sm font-semibold tracking-wider text-primary uppercase">
                        All Packages
                    </p>
                    <p className="mt-2 text-foreground/70">
                        Browse and compare all our carefully designed packages
                    </p>
                </div>

                {/* Packages Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {packages.map((pkg) => (
                        <Card
                            key={pkg.id}
                            className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
                                pkg.featured
                                    ? 'shadow-2xl ring-2 ring-primary'
                                    : 'hover:border-primary/50 hover:shadow-lg'
                            }`}
                        >
                            {pkg.featured && (
                                <div className="absolute top-4 right-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                                    Most Popular
                                </div>
                            )}

                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl text-foreground">
                                    {pkg.name}
                                </CardTitle>
                                <CardDescription className="mt-2 line-clamp-2 text-sm">
                                    {pkg.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1 space-y-6">
                                {/* Key Info */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-foreground/70">
                                        <Clock
                                            size={16}
                                            className="text-primary"
                                        />
                                        <span>{pkg.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-foreground/70">
                                        <Users
                                            size={16}
                                            className="text-primary"
                                        />
                                        <span>{pkg.group}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-foreground/70">
                                        <MapPin
                                            size={16}
                                            className="text-primary"
                                        />
                                        <span>Departures: {pkg.departure}</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="space-y-1 border-t border-border pt-4">
                                    <p className="text-xs tracking-wide text-foreground/60 uppercase">
                                        Starting from
                                    </p>
                                    <p className="text-3xl font-bold text-primary">
                                        {pkg.price}
                                    </p>
                                </div>

                                {/* Highlights */}
                                <div className="flex flex-wrap gap-2">
                                    {pkg.highlights.map((highlight, i) => (
                                        <span
                                            key={i}
                                            className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                                        >
                                            {highlight}
                                        </span>
                                    ))}
                                </div>

                                {/* Features */}
                                <div className="space-y-2">
                                    {pkg.features
                                        .slice(0, 3)
                                        .map((feature, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-2"
                                            >
                                                <CheckCircle2
                                                    size={16}
                                                    className="mt-0.5 flex-shrink-0 text-primary"
                                                />
                                                <span className="text-sm text-foreground/80">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    {pkg.features.length > 3 && (
                                        <p className="pt-1 text-xs font-medium text-primary/70">
                                            +{pkg.features.length - 3} more
                                            features
                                        </p>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <Button
                                    className={`mt-auto w-full py-5 font-semibold transition-all duration-300 ${
                                        pkg.featured
                                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                            : 'border-2 border-primary text-primary hover:bg-primary/10'
                                    }`}
                                    variant={
                                        pkg.featured ? 'default' : 'outline'
                                    }
                                >
                                    View Details
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
