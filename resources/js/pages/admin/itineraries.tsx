import AdminDataTable from '@/components/admin/data-table';
import AppLayout from '@/layouts/app-layout';
import itineraries from '@/routes/admin/itineraries';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

type ItineraryRow = {
    id: number;
    day_number: number;
    title: string;
    location: string;
    created_at: string;
};

type Sort = { by: string; direction: 'asc' | 'desc' };

export default function ItinerariesPage() {
    const { items, filters, sort } = usePage<
        SharedData & {
            items: {
                data: ItineraryRow[];
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
                { title: 'Admin', href: itineraries.index.url() },
                { title: 'Itineraries', href: itineraries.index.url() },
            ]}
        >
            <Head title="Itineraries" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Itineraries
                        </h1>
                        <p className="text-muted-foreground">
                            Manage itineraries
                        </p>
                    </div>
                    {/* <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transportation
                </Button> */}
                </div>
                <AdminDataTable<ItineraryRow>
                    headers={[
                        { key: 'day_number', label: 'Day', sortable: true },
                        { key: 'title', label: 'Title', sortable: true },
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
                    buildUrl={(options) => itineraries.index.url(options)}
                    onDelete={(row) =>
                        router.delete(itineraries.destroy.url(row.id))
                    }
                />
            </div>
        </AppLayout>
    );
}
