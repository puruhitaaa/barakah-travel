export function PackagePageHero({ totalPackages }: { totalPackages: number }) {
    return (
        <section className="bg-gradient-to-b from-primary/10 to-background px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-6 text-center">
                <h1 className="text-5xl font-bold text-foreground sm:text-6xl">
                    Choose Your{' '}
                    <span className="text-primary">Sacred Journey</span>
                </h1>
                <p className="mx-auto max-w-2xl text-xl leading-relaxed text-foreground/70">
                    Explore our carefully curated Hajj and Umrah packages
                    designed to provide you with a spiritually fulfilling and
                    comfortable pilgrimage experience.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-primary">
                            {totalPackages}+
                        </p>
                        <p className="text-sm text-foreground/60">
                            Packages Available
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-primary">15+</p>
                        <p className="text-sm text-foreground/60">
                            Years Experience
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-primary">5000+</p>
                        <p className="text-sm text-foreground/60">
                            Happy Pilgrims
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
