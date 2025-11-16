import AdminDataTable from '@/components/admin/data-table';
import AppLayout from '@/layouts/app-layout';
import transactions from '@/routes/admin/transactions';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

type TransactionRow = {
    id: number;
    reference_number: string;
    amount: number;
    status: string;
    booking?: { booking_reference: string };
    created_at: string;
};

type Sort = { by: string; direction: 'asc' | 'desc' };

export default function TransactionsPage() {
    const { items, filters, sort } = usePage<
        SharedData & {
            items: {
                data: TransactionRow[];
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
                { title: 'Admin', href: transactions.index.url() },
                { title: 'Transactions', href: transactions.index.url() },
            ]}
        >
            <Head title="Transactions" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Transactions
                        </h1>
                        <p className="text-muted-foreground">
                            Manage transactions
                        </p>
                    </div>
                    {/* <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button> */}
                </div>
                <AdminDataTable<TransactionRow>
                    headers={[
                        {
                            key: 'reference_number',
                            label: 'Reference',
                            sortable: false,
                        },
                        { key: 'amount', label: 'Amount', sortable: true },
                        { key: 'status', label: 'Status', sortable: true },
                        {
                            key: 'booking',
                            label: 'Booking',
                            sortable: false,
                            render: (row) =>
                                row.booking?.booking_reference ?? '',
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
                    buildUrl={(options) => transactions.index.url(options)}
                    onDelete={(row) =>
                        router.delete(transactions.destroy.url(row.id))
                    }
                />
            </div>
        </AppLayout>
    );
}
