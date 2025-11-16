import AdminDataTable from '@/components/admin/data-table';
import AppLayout from '@/layouts/app-layout';
import accommodations from '@/routes/admin/accommodations';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

type AccommodationRow = {
    id: number;
    name: string;
    type: string;
    rating: number;
    location: string;
    created_at: string;
};

type Sort = { by: string; direction: 'asc' | 'desc' };

export default function AccommodationsPage() {
    const { items, filters, sort } = usePage<
        SharedData & {
            items: {
                data: AccommodationRow[];
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
                { title: 'Admin', href: accommodations.index.url() },
                { title: 'Accommodations', href: accommodations.index.url() },
            ]}
        >
            <Head title="Accommodations" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Accommodations
                        </h1>
                        <p className="text-muted-foreground">
                            Manage accommodations
                        </p>
                    </div>
                    {/* <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Accommodation
                </Button> */}
                </div>
                <AdminDataTable<AccommodationRow>
                    headers={[
                        { key: 'name', label: 'Name', sortable: true },
                        { key: 'type', label: 'Type', sortable: true },
                        { key: 'rating', label: 'Rating', sortable: true },
                        { key: 'location', label: 'Location', sortable: true },
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
                    buildUrl={(options) => accommodations.index.url(options)}
                    onDelete={(row) =>
                        router.delete(accommodations.destroy.url(row.id))
                    }
                />
            </div>
        </AppLayout>
    );
}
