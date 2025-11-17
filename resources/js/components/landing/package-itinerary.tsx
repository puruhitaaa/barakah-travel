'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

type Activity = string;

type ItineraryDay = {
    day: number;
    title: string;
    description: string;
    activities: Activity[];
};

type PackageItineraryProps = {
    pkg: {
        itinerary: ItineraryDay[];
    };
};

export function PackageItinerary({ pkg }: PackageItineraryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Day-by-Day Itinerary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {pkg.itinerary.map((day: ItineraryDay, index: number) => (
                        <div key={index} className="relative pl-8">
                            {/* Timeline dot */}
                            <div className="absolute top-1.5 left-0">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                                    <CheckCircle2
                                        size={20}
                                        className="text-primary-foreground"
                                    />
                                </div>
                            </div>

                            {/* Timeline line */}
                            {index !== pkg.itinerary.length - 1 && (
                                <div className="absolute top-7 left-3 h-20 w-0.5 bg-primary/20" />
                            )}

                            <div className="rounded-lg border border-border bg-card/50 p-4">
                                <h4 className="mb-1 text-lg font-semibold text-foreground">
                                    Day {day.day}: {day.title}
                                </h4>
                                <p className="mb-4 text-foreground/70">
                                    {day.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {day.activities.map(
                                        (activity: string, i: number) => (
                                            <span
                                                key={i}
                                                className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                                            >
                                                {activity}
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
