import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
    return (
        <section
            id="home"
            className="relative overflow-hidden px-4 pt-20 pb-32 sm:px-6 lg:px-8"
        >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary/5" />

            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
                {/* Left Content */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="inline-block">
                            <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                                ✨ Your Sacred Journey Awaits
                            </span>
                        </div>
                        <h1 className="text-5xl leading-tight font-bold text-pretty sm:text-6xl">
                            <span className="text-foreground">Begin Your</span>{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                Spiritual Journey
                            </span>
                        </h1>
                        <p className="text-xl leading-relaxed text-foreground/70">
                            Experience the most meaningful pilgrimage with
                            Barakah Travel. Our expert guides, premium
                            accommodations, and personalized itineraries ensure
                            your Hajj or Umrah is unforgettable and spiritually
                            fulfilling.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                        <Button className="flex items-center gap-2 rounded-lg bg-primary px-8 py-6 text-lg text-primary-foreground hover:bg-primary/90">
                            Explore Packages
                            <ArrowRight size={20} />
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-lg border-primary/30 px-8 py-6 text-lg text-primary hover:bg-primary/10"
                        >
                            Learn More
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 border-t border-border pt-8">
                        <div>
                            <p className="text-3xl font-bold text-primary">
                                5000+
                            </p>
                            <p className="mt-1 text-sm text-foreground/60">
                                Happy Pilgrims
                            </p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-primary">
                                15+
                            </p>
                            <p className="mt-1 text-sm text-foreground/60">
                                Years Experience
                            </p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-primary">
                                50+
                            </p>
                            <p className="mt-1 text-sm text-foreground/60">
                                Packages
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Visual */}
                <div className="relative h-96 lg:h-full">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5" />
                    <img
                        src="https://www.britishmuseum.org/sites/default/files/styles/uncropped_huge/public/2022-07/ka-ba-mecca-postcard.jpg?itok=SC3dFf93"
                        alt="Hajj pilgrimage experience"
                        className="relative h-full w-full rounded-3xl object-cover shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
}
