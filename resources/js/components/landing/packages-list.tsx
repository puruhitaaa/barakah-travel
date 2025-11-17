import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useDraggableScroll } from '@/hooks/useDraggableScroll';
import { Link } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Users,
} from 'lucide-react';
import { useEffect } from 'react';

type Package = {
    id: number;
    name: string;
    type: string;
    duration_days: number;
    duration: string;
    price: string | number;
    description?: string;
    featured: boolean;
    booking_count: number;
    departure_date?: string;
    available_slots?: number;
    group: string;
    departure: string;
    features: string[];
    highlights: string[];
};

export function PackagesList({
    packages,
    currentPage,
    totalPages,
}: {
    packages: Package[];
    currentPage?: number;
    totalPages?: number;
}) {
    const paginationScrollRef = useDraggableScroll();

    useEffect(() => {
        if (!paginationScrollRef.current || !currentPage) return;

        const container = paginationScrollRef.current;
        const activeButton = container.querySelector(
            `a[href="?page=${currentPage}"]`,
        );

        if (activeButton) {
            activeButton.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    }, [currentPage, paginationScrollRef]);
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

                {/* Pagination */}
                {totalPages && totalPages > 1 && (
                    <div className="mb-12 flex items-center justify-center gap-4">
                        <Link
                            href={
                                currentPage && currentPage > 1
                                    ? `?page=${currentPage - 1}`
                                    : '#'
                            }
                            preserveScroll
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!currentPage || currentPage === 1}
                            >
                                <ChevronLeft size={16} className="mr-1" />
                                Previous
                            </Button>
                        </Link>

                        <div
                            ref={paginationScrollRef}
                            className="scrollbar-hide flex max-w-xs items-center gap-1 overflow-x-auto"
                        >
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Link
                                    key={page}
                                    href={`?page=${page}`}
                                    preserveScroll
                                    className={`flex-shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        currentPage === page
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    }`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>

                        <Link
                            href={
                                currentPage && currentPage < totalPages
                                    ? `?page=${currentPage + 1}`
                                    : '#'
                            }
                            preserveScroll
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    !currentPage || currentPage === totalPages
                                }
                            >
                                Next
                                <ChevronRight size={16} className="ml-1" />
                            </Button>
                        </Link>
                    </div>
                )}

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
