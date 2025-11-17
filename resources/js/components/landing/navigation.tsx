'use client';

import { Button } from '@/components/ui/button';
import { home } from '@/routes';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { label: 'Home', href: home.url() },
        { label: 'Packages', href: '#packages' },
        { label: 'Features', href: '#features' },
        { label: 'Contact', href: '#contact' },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-background shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <span className="text-lg font-bold text-primary-foreground">
                                ب
                            </span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-primary">
                                Barakah
                            </h1>
                            <p className="text-xs text-primary/80">Travel</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-8 md:flex">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="font-medium text-foreground/70 transition-colors hover:text-primary"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA Button & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <Button className="hidden bg-primary text-primary-foreground hover:bg-primary/90 sm:inline-flex">
                            Book Now
                        </Button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-foreground md:hidden"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="space-y-2 pb-4 md:hidden">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="block rounded-lg px-4 py-2 text-foreground transition-colors hover:bg-primary/10"
                            >
                                {item.label}
                            </a>
                        ))}
                        <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            Book Now
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
}
