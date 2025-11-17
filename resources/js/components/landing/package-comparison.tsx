import { Check, X } from 'lucide-react';

export function PackageComparison() {
    const comparisonData = [
        {
            feature: 'Hotel Rating',
            lite: '3-star',
            premium: '4-star',
            plus: '4-star',
            hajj: '5-star',
        },
        {
            feature: 'Group Size',
            lite: '10-20',
            premium: '20-30',
            plus: '15-25',
            hajj: '30-50',
        },
        {
            feature: 'Personal Guide',
            lite: false,
            premium: true,
            plus: true,
            hajj: true,
        },
        {
            feature: '24/7 Support',
            lite: false,
            premium: true,
            plus: true,
            hajj: true,
        },
        {
            feature: 'Meal Plan',
            lite: 'Basic',
            premium: 'Premium',
            plus: 'Gourmet',
            hajj: 'All-Inclusive',
        },
        {
            feature: 'Special Programs',
            lite: false,
            premium: true,
            plus: true,
            hajj: true,
        },
        {
            feature: 'Airport Transfer',
            lite: true,
            premium: true,
            plus: true,
            hajj: true,
        },
        {
            feature: 'Travel Insurance',
            lite: false,
            premium: false,
            plus: false,
            hajj: true,
        },
    ];

    return (
        <section className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-12 space-y-4 text-center">
                    <h2 className="text-4xl font-bold text-foreground">
                        Compare <span className="text-primary">Packages</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-foreground/70">
                        Find the perfect package that matches your preferences
                        and budget
                    </p>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-border">
                                <th className="px-4 py-4 text-left font-semibold text-foreground">
                                    Features
                                </th>
                                <th className="px-4 py-4 text-center font-semibold text-foreground">
                                    Umrah Lite
                                </th>
                                <th className="bg-primary/5 px-4 py-4 text-center font-semibold text-primary">
                                    Umrah Premium
                                </th>
                                <th className="px-4 py-4 text-center font-semibold text-foreground">
                                    Umrah Plus
                                </th>
                                <th className="px-4 py-4 text-center font-semibold text-foreground">
                                    Hajj
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className={`border-b border-border ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                                >
                                    <td className="px-4 py-4 font-medium text-foreground">
                                        {row.feature}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {typeof row.lite === 'boolean' ? (
                                            row.lite ? (
                                                <Check
                                                    size={20}
                                                    className="mx-auto text-primary"
                                                />
                                            ) : (
                                                <X
                                                    size={20}
                                                    className="mx-auto text-muted-foreground"
                                                />
                                            )
                                        ) : (
                                            <span className="text-sm text-foreground/70">
                                                {row.lite}
                                            </span>
                                        )}
                                    </td>
                                    <td className="bg-primary/5 px-4 py-4 text-center">
                                        {typeof row.premium === 'boolean' ? (
                                            row.premium ? (
                                                <Check
                                                    size={20}
                                                    className="mx-auto text-primary"
                                                />
                                            ) : (
                                                <X
                                                    size={20}
                                                    className="mx-auto text-muted-foreground"
                                                />
                                            )
                                        ) : (
                                            <span className="text-sm font-semibold text-primary">
                                                {row.premium}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {typeof row.plus === 'boolean' ? (
                                            row.plus ? (
                                                <Check
                                                    size={20}
                                                    className="mx-auto text-primary"
                                                />
                                            ) : (
                                                <X
                                                    size={20}
                                                    className="mx-auto text-muted-foreground"
                                                />
                                            )
                                        ) : (
                                            <span className="text-sm text-foreground/70">
                                                {row.plus}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {typeof row.hajj === 'boolean' ? (
                                            row.hajj ? (
                                                <Check
                                                    size={20}
                                                    className="mx-auto text-primary"
                                                />
                                            ) : (
                                                <X
                                                    size={20}
                                                    className="mx-auto text-muted-foreground"
                                                />
                                            )
                                        ) : (
                                            <span className="text-sm text-foreground/70">
                                                {row.hajj}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
