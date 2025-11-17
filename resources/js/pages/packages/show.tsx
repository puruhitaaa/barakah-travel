import { BookingCard } from '@/components/landing/booking-card';
import { CTASection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';
import { Navigation } from '@/components/landing/navigation';
import { PackageDetailContent } from '@/components/landing/package-detail-content';
import { PackageDetailHero } from '@/components/landing/package-detail-hero';
import { PackageInclusions } from '@/components/landing/package-inclusions';
import { PackageItinerary } from '@/components/landing/package-itinerary';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

type Activity = string;

type ItineraryDay = {
    day: number;
    title: string;
    description: string;
    activities: Activity[];
};

type PackageData = {
    id: number;
    name: string;
    type: 'hajj' | 'umrah';
    duration: string;
    duration_days: number;
    price: number;
    description: string;
    full_description: string;
    group: string;
    departure: string;
    rating: number;
    reviews: number;
    image: string;
    includes: string[];
    excludes: string[];
    itinerary: ItineraryDay[];
};

export default function PackageDetailPage() {
    const { package: pkg } = usePage<
        SharedData & {
            package: PackageData;
        }
    >().props;

    return (
        <main className="min-h-screen bg-background">
            <Head title={`${pkg.name} - Barakah Travel`} />
            <Navigation />
            <PackageDetailHero pkg={pkg} />
            <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
                <div className="space-y-16 lg:col-span-2">
                    <PackageDetailContent pkg={pkg} />
                    <PackageInclusions pkg={pkg} />
                    <PackageItinerary pkg={pkg} />
                </div>
                <div className="lg:col-span-1">
                    <BookingCard pkg={pkg} />
                </div>
            </div>
            <CTASection />
            <Footer />
        </main>
    );
}
