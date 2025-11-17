import { CTASection } from '@/components/landing/cta-section';
import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { Navigation } from '@/components/landing/navigation';
import { PackagesShowcase } from '@/components/landing/packages-showcase';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

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

export default function Welcome() {
    const { packages } = usePage<
        SharedData & {
            packages: Package[];
        }
    >().props;

    return (
        <>
            <Head title="Welcome" />
            <main className="min-h-screen bg-background">
                <Navigation />
                <Hero />
                <Features />
                <PackagesShowcase packages={packages} />
                <CTASection />
                <Footer />
            </main>
        </>
    );
}
