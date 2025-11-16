import AdminDataTable from '@/components/admin/data-table';
import AppLayout from '@/layouts/app-layout';
import mediaRoutes from '@/routes/admin/media';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

type MediaRow = {
    id: number;
    type: string;
    path: string;
    mime_type: string;
    mediable_type: string;
    ordering: number;
    created_at: string;
};

type Sort = { by: string; direction: 'asc' | 'desc' };

export default function MediaPage() {
    const { items, filters, sort } = usePage<
        SharedData & {
            items: {
                data: MediaRow[];
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
                { title: 'Admin', href: mediaRoutes.index.url() },
                { title: 'Media', href: mediaRoutes.index.url() },
            ]}
        >
            <Head title="Media" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Media
                        </h1>
                        <p className="text-muted-foreground">
                            Manage media files
                        </p>
                    </div>
                    {/* <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Media
                </Button> */}
                </div>
                <AdminDataTable<MediaRow>
                    headers={[
                        { key: 'type', label: 'Type', sortable: true },
                        { key: 'path', label: 'Path', sortable: false },
                        { key: 'mime_type', label: 'MIME', sortable: false },
                        {
                            key: 'mediable_type',
                            label: 'Attached To',
                            sortable: false,
                        },
                        { key: 'ordering', label: 'Order', sortable: true },
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
                    buildUrl={(options) => mediaRoutes.index.url(options)}
                    onDelete={(row) =>
                        router.delete(mediaRoutes.destroy.url(row.id))
                    }
                />
            </div>
        </AppLayout>
    );
}
