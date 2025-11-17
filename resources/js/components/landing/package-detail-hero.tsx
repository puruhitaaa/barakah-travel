'use client';

import { Clock, Star, Users } from 'lucide-react';

type PackageHeroProps = {
    pkg: {
        name: string;
        image: string;
        rating: number;
        reviews: number;
        duration: string;
        group: string;
    };
};

export function PackageDetailHero({ pkg }: PackageHeroProps) {
    return (
        <div className="relative h-96 overflow-hidden bg-card sm:h-[500px]">
            <img
                src={pkg.image || 'https://rb.gy/8zqgim'}
                alt={pkg.name}
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 flex items-end">
                <div className="w-full px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
                            {pkg.name}
                        </h1>

                        {/* Rating and Stats */}
                        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={
                                                i < Math.floor(pkg.rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-white/30'
                                            }
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-white">
                                    {pkg.rating} ({pkg.reviews} reviews)
                                </span>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex items-center gap-2 text-white">
                                <Clock size={18} />
                                <span>{pkg.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white">
                                <Users size={18} />
                                <span>{pkg.group}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
