import { CTASection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';
import { Navigation } from '@/components/landing/navigation';
import { PackageComparison } from '@/components/landing/package-comparison';
import { PackagePageHero } from '@/components/landing/package-page-hero';
import { PackagesList } from '@/components/landing/packages-list';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

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

export default function PackagesPage() {
    const { packages, totalPackages, currentPage, totalPages } = usePage<
        SharedData & {
            packages: Package[];
            totalPackages: number;
            currentPage: number;
            perPage: number;
            totalPages: number;
        }
    >().props;
    return (
        <>
            <Head title="Packages - Barakah Travel" />
            <main className="min-h-screen bg-background">
                <Navigation />
                <PackagePageHero totalPackages={totalPackages} />
                <PackagesList
                    packages={packages}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
                <PackageComparison />
                <CTASection />
                <Footer />
            </main>
        </>
    );
}
