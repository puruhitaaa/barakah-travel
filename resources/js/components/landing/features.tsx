import { Card, CardContent } from '@/components/ui/card';
import {
    Award,
    CheckCircle2,
    Compass,
    Headphones,
    Shield,
    Users,
} from 'lucide-react';

export function Features() {
    const features = [
        {
            icon: Compass,
            title: 'Expert Guidance',
            description:
                'Knowledgeable guides with deep spiritual and cultural expertise to enhance your journey.',
        },
        {
            icon: Users,
            title: 'Group Support',
            description:
                'Travel with like-minded pilgrims in well-organized groups for a shared spiritual experience.',
        },
        {
            icon: Award,
            title: 'Premium Quality',
            description:
                '5-star accommodations and transportation for maximum comfort during your pilgrimage.',
        },
        {
            icon: Shield,
            title: 'Complete Safety',
            description:
                'Full insurance coverage, 24/7 medical support, and emergency assistance throughout your trip.',
        },
        {
            icon: Headphones,
            title: '24/7 Support',
            description:
                'Round-the-clock customer support team available in multiple languages for your peace of mind.',
        },
        {
            icon: CheckCircle2,
            title: 'Hassle-Free Process',
            description:
                'Streamlined visa processing, documentation, and all logistics handled for you.',
        },
    ];

    return (
        <section
            id="features"
            className="bg-card/50 px-4 py-20 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="mb-16 space-y-4 text-center">
                    <h2 className="text-4xl font-bold text-foreground sm:text-5xl">
                        Why Choose{' '}
                        <span className="text-primary">Barakah Travel</span>?
                    </h2>
                    <p className="mx-auto max-w-2xl text-xl text-foreground/70">
                        Trusted by thousands of pilgrims for exceptional service
                        and spiritual fulfillment.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={index}
                                className="border-primary/20 transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
                            >
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                                            <Icon
                                                size={28}
                                                className="text-primary"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground">
                                                {feature.title}
                                            </h3>
                                            <p className="mt-2 leading-relaxed text-foreground/70">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
