import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border bg-card text-foreground">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-12 grid gap-12 md:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                <span className="font-bold text-primary-foreground">
                                    ب
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">
                                    Barakah
                                </h3>
                                <p className="text-xs text-primary">Travel</p>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/70">
                            Your trusted partner for a sacred and unforgettable
                            Hajj and Umrah journey.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-foreground">
                            Quick Links
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="text-foreground/70 transition-colors hover:text-primary"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#packages"
                                    className="text-foreground/70 transition-colors hover:text-primary"
                                >
                                    Packages
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-foreground/70 transition-colors hover:text-primary"
                                >
                                    Gallery
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-foreground/70 transition-colors hover:text-primary"
                                >
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-foreground">Policies</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="text-foreground/70 transition-colors hover:text-primary"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-foreground/70 transition-colors hover:text-primary"
                                >
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-foreground/70 transition-colors hover:text-primary"
                                >
                                    Refund Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-foreground/70 transition-colors hover:text-primary"
                                >
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-foreground">
                            Contact Us
                        </h4>
                        <div className="space-y-3 text-sm">
                            <a
                                href="tel:+1234567890"
                                className="flex items-center gap-3 text-foreground/70 transition-colors hover:text-primary"
                            >
                                <Phone size={18} />
                                <span>+1 (234) 567-890</span>
                            </a>
                            <a
                                href="mailto:info@barakahtravel.com"
                                className="flex items-center gap-3 text-foreground/70 transition-colors hover:text-primary"
                            >
                                <Mail size={18} />
                                <span>info@barakahtravel.com</span>
                            </a>
                            <div className="flex items-start gap-3 text-foreground/70">
                                <MapPin
                                    size={18}
                                    className="mt-1 flex-shrink-0"
                                />
                                <span>
                                    123 Hajj Street, East Java, Indonesia
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
                    <p className="text-sm text-foreground/60">
                        © 2025 Barakah Travel. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <a
                            href="#"
                            className="text-foreground/70 transition-colors hover:text-primary"
                        >
                            Facebook
                        </a>
                        <a
                            href="#"
                            className="text-foreground/70 transition-colors hover:text-primary"
                        >
                            Instagram
                        </a>
                        <a
                            href="#"
                            className="text-foreground/70 transition-colors hover:text-primary"
                        >
                            Twitter
                        </a>
                        <a
                            href="#"
                            className="text-foreground/70 transition-colors hover:text-primary"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
