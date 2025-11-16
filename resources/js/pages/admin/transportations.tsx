import AdminDataTable from '@/components/admin/data-table';
import AppLayout from '@/layouts/app-layout';
import transportations from '@/routes/admin/transportations';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

type TransportationRow = {
    id: number;
    type: string;
    company: string;
    capacity: number;
    created_at: string;
};

type Sort = { by: string; direction: 'asc' | 'desc' };

export default function TransportationsPage() {
    const { items, filters, sort } = usePage<
        SharedData & {
            items: {
                data: TransportationRow[];
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
                { title: 'Admin', href: transportations.index.url() },
                { title: 'Transportations', href: transportations.index.url() },
            ]}
        >
            <Head title="Transportations" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Transportations
                        </h1>
                        <p className="text-muted-foreground">
                            Manage transportations
                        </p>
                    </div>
                    {/* <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transportation
                </Button> */}
                </div>
                <AdminDataTable<TransportationRow>
                    headers={[
                        { key: 'type', label: 'Type', sortable: true },
                        { key: 'company', label: 'Company', sortable: true },
                        { key: 'capacity', label: 'Capacity', sortable: true },
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
                    buildUrl={(options) => transportations.index.url(options)}
                    onDelete={(row) =>
                        router.delete(transportations.destroy.url(row.id))
                    }
                />
            </div>
        </AppLayout>
    );
}
