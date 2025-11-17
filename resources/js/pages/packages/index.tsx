import { CTASection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';
import { Navigation } from '@/components/landing/navigation';
import { PackageComparison } from '@/components/landing/package-comparison';
import { PackagePageHero } from '@/components/landing/package-page-hero';
import { PackagesList } from '@/components/landing/packages-list';
import { Head } from '@inertiajs/react';

export default function PackagesPage() {
    return (
        <>
            <Head title="Packages - Barakah Travel" />
            <main className="min-h-screen bg-background">
                <Navigation />
                <PackagePageHero />
                <PackagesList />
                <PackageComparison />
                <CTASection />
                <Footer />
            </main>
        </>
    );
}
