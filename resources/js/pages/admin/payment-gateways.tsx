import AdminDataTable from '@/components/admin/data-table';
import AppLayout from '@/layouts/app-layout';
import paymentGateways from '@/routes/admin/payment-gateways';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

type GatewayRow = {
    id: number;
    name: string;
    is_active: boolean;
    created_at: string;
};

type Sort = { by: string; direction: 'asc' | 'desc' };

export default function PaymentGatewaysPage() {
    const { items, filters, sort } = usePage<
        SharedData & {
            items: {
                data: GatewayRow[];
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
                { title: 'Admin', href: paymentGateways.index.url() },
                {
                    title: 'Payment Gateways',
                    href: paymentGateways.index.url(),
                },
            ]}
        >
            <Head title="Payment Gateways" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Payment Gateways
                        </h1>
                        <p className="text-muted-foreground">
                            Manage payment gateways
                        </p>
                    </div>
                    {/* <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment Gateway
                </Button> */}
                </div>
                <AdminDataTable<GatewayRow>
                    headers={[
                        { key: 'name', label: 'Name', sortable: true },
                        {
                            key: 'is_active',
                            label: 'Active',
                            sortable: true,
                            render: (row) => (row.is_active ? 'Yes' : 'No'),
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
                    buildUrl={(options) => paymentGateways.index.url(options)}
                    onDelete={(row) =>
                        router.delete(paymentGateways.destroy.url(row.id))
                    }
                />
            </div>
        </AppLayout>
    );
}
