import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Check, X } from 'lucide-react';

type ComparisonPackage = {
    id: number;
    name: string;
    price: number | string;
};

type ComparisonRow = {
    feature: string;
    [key: string]: string | number | boolean;
};

export function PackageComparison() {
    const { comparisonPackages, comparisonData } = usePage<
        SharedData & {
            comparisonPackages: ComparisonPackage[];
            comparisonData: ComparisonRow[];
        }
    >().props;

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
                                {comparisonPackages.length > 0 ? (
                                    comparisonPackages.map((pkg, idx) => (
                                        <th
                                            key={pkg.id}
                                            className={`px-4 py-4 text-center font-semibold ${
                                                idx === 1
                                                    ? 'bg-primary/5 text-primary'
                                                    : 'text-foreground'
                                            }`}
                                        >
                                            {pkg.name}
                                        </th>
                                    ))
                                ) : (
                                    <>
                                        <th className="px-4 py-4 text-center font-semibold text-foreground">
                                            Package 1
                                        </th>
                                        <th className="bg-primary/5 px-4 py-4 text-center font-semibold text-primary">
                                            Package 2
                                        </th>
                                        <th className="px-4 py-4 text-center font-semibold text-foreground">
                                            Package 3
                                        </th>
                                        <th className="px-4 py-4 text-center font-semibold text-foreground">
                                            Package 4
                                        </th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData && comparisonData.length > 0 ? (
                                comparisonData.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className={`border-b border-border ${
                                            idx % 2 === 0
                                                ? 'bg-background'
                                                : 'bg-muted/20'
                                        }`}
                                    >
                                        <td className="px-4 py-4 font-medium text-foreground">
                                            {row.feature}
                                        </td>
                                        {comparisonPackages.map((pkg) => {
                                            const value = row['pkg_' + pkg.id];
                                            return (
                                                <td
                                                    key={pkg.id}
                                                    className={`px-4 py-4 text-center ${
                                                        comparisonPackages[1] &&
                                                        comparisonPackages[1]
                                                            .id === pkg.id
                                                            ? 'bg-primary/5'
                                                            : ''
                                                    }`}
                                                >
                                                    {typeof value ===
                                                    'boolean' ? (
                                                        value ? (
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
                                                            {value}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-4 text-center text-foreground/60"
                                    >
                                        No comparison data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
