import AdminDataTable from '@/components/admin/data-table';
import AppLayout from '@/layouts/app-layout';
import packages from '@/routes/admin/packages';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

type PackageRow = {
    id: number;
    name: string;
    type: string;
    price: number;
    departure_date: string;
    available_slots: number;
    created_at: string;
};

type Sort = { by: string; direction: 'asc' | 'desc' };

export default function PackagesPage() {
    const { items, filters, sort } = usePage<
        SharedData & {
            items: {
                data: PackageRow[];
                current_page: number;
                last_page: number;
                per_page: number;
                total: number;
                from?: number;
                to?: number;
            };
            filters: Record<string, unknown>;
            sort: Sort;
        }
    >().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Admin', href: packages.index.url() },
                { title: 'Packages', href: packages.index.url() },
            ]}
        >
            <Head title="Packages" />

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Lessons
                        </h1>
                        <p className="text-muted-foreground">
                            Manage course lessons and content
                        </p>
                    </div>
                    {/* <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lesson
                </Button> */}
                </div>
                <AdminDataTable<PackageRow>
                    headers={[
                        { key: 'name', label: 'Name', sortable: true },
                        { key: 'type', label: 'Type', sortable: true },
                        { key: 'price', label: 'Price', sortable: true },
                        {
                            key: 'departure_date',
                            label: 'Departure',
                            sortable: true,
                        },
                        {
                            key: 'available_slots',
                            label: 'Slots',
                            sortable: true,
                        },
                        { key: 'created_at', label: 'Created', sortable: true },
                    ]}
                    rows={items.data}
                    sort={sort}
                    filters={filters}
                    pagination={{
                        current_page: items.current_page,
                        last_page: items.last_page,
                        per_page: items.per_page,
                        total: items.total,
                        from: items.from,
                        to: items.to,
                    }}
                    buildUrl={(options) => packages.index.url(options)}
                    onDelete={(row) =>
                        router.delete(packages.destroy.url(row.id))
                    }
                />
            </div>
        </AppLayout>
    );
}
