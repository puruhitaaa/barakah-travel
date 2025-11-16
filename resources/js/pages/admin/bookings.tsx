import AdminDataTable from '@/components/admin/data-table';
import AppLayout from '@/layouts/app-layout';
import bookings from '@/routes/admin/bookings';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

type BookingRow = {
    id: number;
    booking_reference: string;
    status: string;
    user?: { name: string };
    package?: { name: string };
    created_at: string;
};

type Sort = { by: string; direction: 'asc' | 'desc' };

export default function BookingsPage() {
    const { items, filters, sort } = usePage<
        SharedData & {
            items: {
                data: BookingRow[];
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
                { title: 'Admin', href: bookings.index.url() },
                { title: 'Bookings', href: bookings.index.url() },
            ]}
        >
            <Head title="Bookings" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Bookings
                        </h1>
                        <p className="text-muted-foreground">Manage bookings</p>
                    </div>
                    {/* <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Booking
                </Button> */}
                </div>
                <AdminDataTable<BookingRow>
                    headers={[
                        {
                            key: 'booking_reference',
                            label: 'Reference',
                            sortable: true,
                        },
                        { key: 'status', label: 'Status', sortable: true },
                        {
                            key: 'user',
                            label: 'User',
                            sortable: false,
                            render: (row) => row.user?.name ?? '',
                        },
                        {
                            key: 'package',
                            label: 'Package',
                            sortable: false,
                            render: (row) => row.package?.name ?? '',
                        },
                        {
                            key: 'created_at',
                            label: 'Created',
                            sortable: true,
                        },
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
                    buildUrl={(options) => bookings.index.url(options)}
                    onDelete={(row) =>
                        router.delete(bookings.destroy.url(row.id))
                    }
                />
            </div>
        </AppLayout>
    );
}
