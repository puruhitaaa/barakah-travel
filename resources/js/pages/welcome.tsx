import { CTASection } from '@/components/landing/cta-section';
import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { Navigation } from '@/components/landing/navigation';
import { PackagesShowcase } from '@/components/landing/packages-showcase';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    // const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <main className="min-h-screen bg-background">
                <Navigation />
                <Hero />
                <Features />
                <PackagesShowcase />
                <CTASection />
                <Footer />
            </main>
        </>
    );
}
