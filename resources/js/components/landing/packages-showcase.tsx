import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

type Package = {
    id: number;
    name: string;
    type: string;
    duration_days: number;
    price: string | number;
    description?: string;
    featured: boolean;
    booking_count: number;
};

export function PackagesShowcase({ packages }: { packages: Package[] }) {
    const getPackageFeatures = (type: string) => {
        if (type === 'hajj') {
            return [
                'Full Hajj rituals',
                'Luxury accommodation',
                'Dedicated support team',
                'All meals included',
            ];
        }
        return [
            'Hotel accommodation',
            'Guided tours',
            'Meals included',
            'Transportation',
        ];
    };

    // Reorder packages to put the featured one in the middle
    const orderedPackages =
        packages.length === 3
            ? [packages[1], packages[0], packages[2]]
            : packages;

    return (
        <section
            id="packages"
            className="bg-background px-4 py-20 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="mb-16 space-y-4 text-center">
                    <h2 className="text-4xl font-bold text-foreground sm:text-5xl">
                        Our{' '}
                        <span className="text-primary">Sacred Packages</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-xl text-foreground/70">
                        Choose the perfect pilgrimage package tailored to your
                        spiritual journey and preferences.
                    </p>
                </div>

                {/* Packages Grid */}
                <div className="grid gap-8 md:grid-cols-3">
                    {orderedPackages.map((pkg) => {
                        const features = getPackageFeatures(pkg.type);
                        return (
                            <Card
                                key={pkg.id}
                                className={`relative overflow-hidden transition-all duration-300 ${
                                    pkg.featured
                                        ? 'scale-105 shadow-2xl ring-2 ring-primary'
                                        : 'hover:shadow-lg'
                                }`}
                            >
                                <div
                                    className={`absolute inset-0 -z-10 bg-card/50`}
                                />

                                {pkg.featured && (
                                    <div className="absolute top-4 right-4 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                                        Most Popular
                                    </div>
                                )}

                                <CardHeader className="pb-4">
                                    <CardTitle className="text-2xl text-foreground">
                                        {pkg.name}
                                    </CardTitle>
                                    <CardDescription className="text-lg font-semibold text-primary">
                                        {pkg.duration_days} Days
                                    </CardDescription>
                                    <p className="mt-2 text-sm text-foreground/60">
                                        {pkg.description ||
                                            `Amazing ${pkg.type} package`}
                                    </p>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Price */}
                                    <div className="space-y-2">
                                        <p className="text-sm text-foreground/60">
                                            Starting from
                                        </p>
                                        <p className="text-4xl font-bold text-primary">
                                            {parseFloat(
                                                pkg.price.toString(),
                                            ).toLocaleString('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                currencyDisplay: 'code',
                                            })}
                                        </p>
                                    </div>

                                    {/* Features List */}
                                    <div className="space-y-3">
                                        {features.map((feature, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3"
                                            >
                                                <CheckCircle2
                                                    size={20}
                                                    className="flex-shrink-0 text-primary"
                                                />
                                                <span className="text-foreground/80">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2
                                                size={20}
                                                className="flex-shrink-0 text-primary"
                                            />
                                            <span className="text-foreground/80">
                                                {pkg.booking_count > 0
                                                    ? `${pkg.booking_count} pilgrims booked`
                                                    : 'Ready for booking'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <Button
                                        asChild
                                        className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
                                            pkg.featured
                                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                : 'border-2 border-primary text-primary hover:bg-primary/10'
                                        }`}
                                        variant={
                                            pkg.featured ? 'default' : 'outline'
                                        }
                                    >
                                        <Link href={`/packages/${pkg.id}`}>
                                            {pkg.featured
                                                ? 'Book Now'
                                                : 'View Details'}
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
