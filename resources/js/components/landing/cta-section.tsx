'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

export function CTASection() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        setSubmitted(true);
        setEmail('');
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <section
            id="contact"
            className="bg-gradient-to-r from-primary to-primary/80 px-4 py-20 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-4xl">
                <Card className="border-0 bg-card shadow-2xl">
                    <CardContent className="px-6 pt-12 pb-12 sm:px-12">
                        <div className="space-y-8 text-center">
                            {/* Heading */}
                            <div className="space-y-4">
                                <h2 className="text-4xl font-bold text-foreground sm:text-5xl">
                                    Ready to Begin Your Journey?
                                </h2>
                                <p className="text-xl text-foreground/70">
                                    Join thousands of pilgrims who have
                                    experienced a transformative journey with
                                    Barakah Travel. Get exclusive offers and
                                    personalized recommendations.
                                </p>
                            </div>

                            {/* Contact Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row"
                            >
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="flex-1 rounded-lg border-2 border-primary/30 bg-input px-6 py-3 text-foreground transition-colors placeholder:text-foreground/50 focus:border-primary focus:outline-none"
                                />
                                <Button
                                    type="submit"
                                    className="rounded-lg bg-primary px-8 py-3 font-semibold whitespace-nowrap text-primary-foreground hover:bg-primary/90"
                                >
                                    Get Offers
                                </Button>
                            </form>

                            {/* Success Message */}
                            {submitted && (
                                <p className="animate-fade-in font-semibold text-primary">
                                    ✓ Thank you! Check your email for exclusive
                                    offers.
                                </p>
                            )}

                            {/* Bottom Text */}
                            <p className="text-sm text-foreground/60">
                                We respect your privacy. No spam, just exclusive
                                travel deals and spiritual inspiration.
                            </p>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap justify-center gap-6 pt-4">
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-foreground">
                                        100% Verified
                                    </p>
                                    <p className="text-xs text-foreground/60">
                                        Licensed & Certified
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-foreground">
                                        25K+ Reviews
                                    </p>
                                    <p className="text-xs text-foreground/60">
                                        ⭐⭐⭐⭐⭐
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-foreground">
                                        24/7 Support
                                    </p>
                                    <p className="text-xs text-foreground/60">
                                        Always Available
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
