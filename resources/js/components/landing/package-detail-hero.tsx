'use client';

import { ChevronLeft, ChevronRight, Clock, Star, Users } from 'lucide-react';
import { useState } from 'react';

type MediaItem = {
    id: number;
    path: string;
    type: 'image' | 'video';
    alt_text: string | null;
    mime_type: string | null;
};

type PackageHeroProps = {
    pkg: {
        name: string;
        media: MediaItem[];
        rating: number;
        reviews: number;
        duration: string;
        group: string;
    };
};

export function PackageDetailHero({ pkg }: PackageHeroProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const hasMedia = pkg.media && pkg.media.length > 0;
    const currentMedia = hasMedia ? pkg.media[activeIndex] : null;
    const isVideo = currentMedia?.type === 'video';

    const goToPrevious = () => {
        setActiveIndex((prev) =>
            prev === 0 ? pkg.media.length - 1 : prev - 1,
        );
        setIsPlaying(false);
    };

    const goToNext = () => {
        setActiveIndex((prev) =>
            prev === pkg.media.length - 1 ? 0 : prev + 1,
        );
        setIsPlaying(false);
    };

    // const handleMediaClick = () => {
    //     if (isVideo) {
    //         setIsPlaying(!isPlaying);
    //     }
    // };

    return (
        <div className="relative h-96 overflow-hidden bg-card sm:h-[500px]">
            {/* Media Content */}
            {currentMedia && (
                <>
                    {isVideo ? (
                        <video
                            key={currentMedia.id}
                            src={currentMedia.path}
                            autoPlay
                            controls={false}
                            className="absolute inset-0 h-full w-full object-cover"
                            muted
                        />
                    ) : (
                        <img
                            key={currentMedia.id}
                            src={currentMedia.path}
                            alt={currentMedia.alt_text || pkg.name}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    )}
                </>
            )}

            {/* Overlay Darkening */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Video Play Button Overlay */}
            {/* {isVideo && !isPlaying && (
                <div className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center">
                    <button
                        onClick={handleMediaClick}
                        className="rounded-full bg-white/20 p-4 backdrop-blur-sm transition-all hover:bg-white/30"
                        aria-label="Play video"
                    >
                        <Play size={32} className="fill-white text-white" />
                    </button>
                </div>
            )} */}

            {/* Navigation Arrows - Only show if multiple media items */}
            {hasMedia && pkg.media.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30 sm:left-6"
                        aria-label="Previous media"
                    >
                        <ChevronLeft size={24} className="text-white" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30 sm:right-6"
                        aria-label="Next media"
                    >
                        <ChevronRight size={24} className="text-white" />
                    </button>
                </>
            )}

            {/* Media Indicators */}
            {hasMedia && pkg.media.length > 1 && !isPlaying && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {pkg.media.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setActiveIndex(index);
                                setIsPlaying(false);
                            }}
                            className={`h-2 rounded-full transition-all ${
                                index === activeIndex
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/50 hover:bg-white/70'
                            }`}
                            aria-label={`Go to media ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Content Section */}
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
