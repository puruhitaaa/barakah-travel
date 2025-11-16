import AdminDataTable from '@/components/admin/data-table';
import InputError from '@/components/input-error';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import mediaRoutes from '@/routes/admin/media';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

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

const schema = z.object({
    mediable_type: z.string().min(1, 'Mediable type is required'),
    mediable_id: z.coerce
        .number()
        .int('Mediable ID must be an integer')
        .positive('Mediable ID must be a positive integer'),
    type: z
        .enum(['image', 'video'])
        .refine(
            (val) => ['image', 'video'].includes(val),
            'Type must be image or video',
        ),
    disk: z.string().max(255, 'Disk must not exceed 255 characters').optional(),
    path: z
        .string()
        .min(1, 'Path is required')
        .max(255, 'Path must not exceed 255 characters'),
    mime_type: z
        .string()
        .max(255, 'MIME type must not exceed 255 characters')
        .optional(),
    size: z.coerce
        .number()
        .int()
        .nonnegative('Size must be non-negative')
        .optional(),
    alt_text: z
        .string()
        .max(255, 'Alt text must not exceed 255 characters')
        .optional(),
    ordering: z.coerce
        .number()
        .int()
        .nonnegative('Ordering must be non-negative')
        .optional(),
});

type FormValues = z.infer<typeof schema>;

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

    function MediaForm({
        initial,
        onSubmit,
        submitting,
    }: {
        initial?: Partial<FormValues>;
        onSubmit: (values: FormValues) => void;
        submitting: boolean;
    }) {
        const [values, setValues] = useState<FormValues>({
            mediable_type: initial?.mediable_type ?? '',
            mediable_id: initial?.mediable_id ?? 0,
            type: initial?.type ?? 'image',
            disk: initial?.disk ?? '',
            path: initial?.path ?? '',
            mime_type: initial?.mime_type ?? '',
            size: initial?.size ?? undefined,
            alt_text: initial?.alt_text ?? '',
            ordering: initial?.ordering ?? 0,
        });

        const [errors, setErrors] = useState<
            Partial<Record<keyof FormValues, string>>
        >({});

        const submit = () => {
            const parsed = schema.safeParse(values);
            if (!parsed.success) {
                const fieldErrors: Partial<Record<keyof FormValues, string>> =
                    {};
                parsed.error.issues.forEach((issue) => {
                    const key = issue.path[0] as keyof FormValues;
                    fieldErrors[key] = issue.message;
                });
                setErrors(fieldErrors);
                return;
            }
            setErrors({});
            onSubmit(parsed.data);
        };

        return (
            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                }}
            >
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="mediable_type">Mediable Type</Label>
                        <Input
                            id="mediable_type"
                            value={values.mediable_type}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    mediable_type: e.target.value,
                                })
                            }
                        />
                        <InputError message={errors.mediable_type} />
                    </div>
                    <div>
                        <Label htmlFor="mediable_id">Mediable ID</Label>
                        <Input
                            id="mediable_id"
                            type="number"
                            min="1"
                            value={values.mediable_id || ''}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    mediable_id: Number(e.target.value),
                                })
                            }
                        />
                        <InputError message={errors.mediable_id} />
                    </div>
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                            value={values.type}
                            onValueChange={(value) =>
                                setValues({
                                    ...values,
                                    type: value as 'image' | 'video',
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="image">Image</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} />
                    </div>
                    <div>
                        <Label htmlFor="path">Path</Label>
                        <Input
                            id="path"
                            value={values.path}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    path: e.target.value,
                                })
                            }
                        />
                        <InputError message={errors.path} />
                    </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="disk">Disk</Label>
                        <Input
                            id="disk"
                            value={values.disk ?? ''}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    disk: e.target.value,
                                })
                            }
                        />
                        <InputError message={errors.disk} />
                    </div>
                    <div>
                        <Label htmlFor="mime_type">MIME Type</Label>
                        <Input
                            id="mime_type"
                            value={values.mime_type ?? ''}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    mime_type: e.target.value,
                                })
                            }
                        />
                        <InputError message={errors.mime_type} />
                    </div>
                    <div>
                        <Label htmlFor="size">Size (bytes)</Label>
                        <Input
                            id="size"
                            type="number"
                            min="0"
                            value={values.size ?? ''}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    size: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                })
                            }
                        />
                        <InputError message={errors.size} />
                    </div>
                    <div>
                        <Label htmlFor="ordering">Ordering</Label>
                        <Input
                            id="ordering"
                            type="number"
                            min="0"
                            value={values.ordering ?? ''}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    ordering: Number(e.target.value),
                                })
                            }
                        />
                        <InputError message={errors.ordering} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="alt_text">Alt Text</Label>
                    <Input
                        id="alt_text"
                        value={values.alt_text ?? ''}
                        onChange={(e) =>
                            setValues({
                                ...values,
                                alt_text: e.target.value,
                            })
                        }
                    />
                    <InputError message={errors.alt_text} />
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={submitting}>
                        Save
                    </Button>
                </DialogFooter>
            </form>
        );
    }

    function RowActions({ row }: { row: MediaRow }) {
        const [open, setOpen] = useState(false);
        const [submitting, setSubmitting] = useState(false);
        return (
            <div className="flex items-center justify-end gap-2">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            Edit
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Media</DialogTitle>
                        </DialogHeader>
                        <MediaForm
                            initial={{
                                mediable_type: row.mediable_type,
                                type: row.type as 'image' | 'video',
                                path: row.path,
                                mime_type: row.mime_type,
                                ordering: row.ordering,
                            }}
                            submitting={submitting}
                            onSubmit={(values) => {
                                setSubmitting(true);
                                router.put(
                                    mediaRoutes.update.url(row.id),
                                    values,
                                    {
                                        preserveScroll: true,
                                        onFinish: () => setSubmitting(false),
                                        onSuccess: () => setOpen(false),
                                    },
                                );
                            }}
                        />
                    </DialogContent>
                </Dialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete media?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() =>
                                    router.delete(
                                        mediaRoutes.destroy.url(row.id),
                                    )
                                }
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        );
    }

    const [createOpen, setCreateOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

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
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Media
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Media</DialogTitle>
                            </DialogHeader>
                            <MediaForm
                                submitting={submitting}
                                onSubmit={(values) => {
                                    setSubmitting(true);
                                    router.post(
                                        mediaRoutes.store.url(),
                                        values,
                                        {
                                            preserveScroll: true,
                                            onFinish: () =>
                                                setSubmitting(false),
                                            onSuccess: () =>
                                                setCreateOpen(false),
                                        },
                                    );
                                }}
                            />
                        </DialogContent>
                    </Dialog>
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
                    renderActions={(row) => <RowActions row={row} />}
                />
            </div>
        </AppLayout>
    );
}
