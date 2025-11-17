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
import AppLayout from '@/layouts/app-layout';
import accommodations from '@/routes/admin/accommodations';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

type AccommodationRow = {
    id: number;
    name: string;
    type: string;
    rating: number;
    location: string;
    description?: string;
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

    const [createOpen, setCreateOpen] = useState(false);

    const schema = useMemo(
        () =>
            z.object({
                name: z.string().min(1).max(255),
                type: z.string().min(1).max(255),
                location: z.string().max(255).optional(),
                rating: z.preprocess(
                    (v) => Number(v),
                    z.number().min(0).max(5),
                ),
                description: z.string().optional(),
            }),
        [],
    );

    type FormValues = z.infer<typeof schema>;

    function AccommodationForm({
        initial,
        onSubmit,
        submitting,
    }: {
        initial?: Partial<FormValues>;
        onSubmit: (values: FormValues) => void;
        submitting: boolean;
    }) {
        const [values, setValues] = useState<FormValues>({
            name: initial?.name ?? '',
            type: initial?.type ?? '',
            location: initial?.location ?? '',
            rating: Number(initial?.rating ?? 0),
            description: initial?.description ?? '',
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
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={values.name}
                            onChange={(e) =>
                                setValues({ ...values, name: e.target.value })
                            }
                        />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Input
                            id="type"
                            value={values.type}
                            onChange={(e) =>
                                setValues({ ...values, type: e.target.value })
                            }
                        />
                        <InputError message={errors.type} />
                    </div>
                    <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={values.location ?? ''}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    location: e.target.value,
                                })
                            }
                        />
                        <InputError message={errors.location} />
                    </div>
                    <div>
                        <Label htmlFor="rating">Rating</Label>
                        <Input
                            id="rating"
                            type="number"
                            min={0}
                            max={5}
                            step="0.1"
                            value={values.rating}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    rating: Number(e.target.value),
                                })
                            }
                        />
                        <InputError message={errors.rating} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        value={values.description ?? ''}
                        onChange={(e) =>
                            setValues({
                                ...values,
                                description: e.target.value,
                            })
                        }
                    />
                    <InputError message={errors.description} />
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={submitting}>
                        Save
                    </Button>
                </DialogFooter>
            </form>
        );
    }

    function RowActions({ row }: { row: AccommodationRow }) {
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
                            <DialogTitle>Edit Accommodation</DialogTitle>
                        </DialogHeader>
                        <AccommodationForm
                            initial={{
                                name: row.name,
                                type: row.type,
                                location: row.location,
                                rating: row.rating,
                                description: row.description,
                            }}
                            submitting={submitting}
                            onSubmit={(values) => {
                                setSubmitting(true);
                                router.put(
                                    accommodations.update.url(row.id),
                                    values,
                                    {
                                        preserveScroll: true,
                                        onFinish: () => setSubmitting(false),
                                        onSuccess: () => {
                                            setOpen(false);
                                            toast.success(
                                                'Accommodation updated successfully!',
                                            );
                                        },
                                        onError: () => {
                                            toast.error(
                                                'Something went wrong when updating accommodation!',
                                            );
                                        },
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
                            <AlertDialogTitle>
                                Delete accommodation?
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() =>
                                    router.delete(
                                        accommodations.destroy.url(row.id),
                                        {
                                            preserveScroll: true,
                                            onSuccess: () =>
                                                toast.success(
                                                    'Accommodation deleted successfully!',
                                                ),
                                            onError: () =>
                                                toast.error(
                                                    'Something went wrong when deleting accommodation!',
                                                ),
                                        },
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
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>Create Accommodation</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Accommodation</DialogTitle>
                            </DialogHeader>
                            <AccommodationForm
                                submitting={false}
                                onSubmit={(values) =>
                                    router.post(
                                        accommodations.store.url(),
                                        values,
                                        {
                                            preserveScroll: true,
                                            onSuccess: () => {
                                                setCreateOpen(false);
                                                toast.success(
                                                    'Accommodation created successfully!',
                                                );
                                            },
                                            onError: () => {
                                                toast.error(
                                                    'Something went wrong when creating accommodation!',
                                                );
                                            },
                                        },
                                    )
                                }
                            />
                        </DialogContent>
                    </Dialog>
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
                    renderActions={(row) => <RowActions row={row} />}
                />
            </div>
        </AppLayout>
    );
}
