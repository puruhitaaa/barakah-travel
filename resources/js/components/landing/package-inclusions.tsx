'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, X } from 'lucide-react';

type PackageInclusionsProps = {
    pkg: {
        includes: string[];
        excludes: string[];
    };
};

export function PackageInclusions({ pkg }: PackageInclusionsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 size={24} className="text-primary" />
                        What's Included
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {pkg.includes.map((item: string, i: number) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle2
                                    size={18}
                                    className="mt-0.5 flex-shrink-0 text-primary"
                                />
                                <span className="text-foreground/80">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <X size={24} className="text-destructive" />
                        What's Not Included
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {pkg.excludes.map((item: string, i: number) => (
                            <div key={i} className="flex items-start gap-3">
                                <X
                                    size={18}
                                    className="mt-0.5 flex-shrink-0 text-destructive/60"
                                />
                                <span className="text-foreground/70">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
