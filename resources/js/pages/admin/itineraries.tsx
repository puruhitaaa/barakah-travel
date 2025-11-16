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
import itineraries from '@/routes/admin/itineraries';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { z } from 'zod';

type ItineraryRow = {
    id: number;
    day_number: number;
    title: string;
    location: string;
    description?: string;
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

    const [createOpen, setCreateOpen] = useState(false);

    const schema = useMemo(
        () =>
            z.object({
                day_number: z.preprocess(
                    (v) => Number(v),
                    z.number().int().min(1),
                ),
                title: z.string().min(1).max(255),
                location: z.string().max(255).optional(),
                description: z.string().optional(),
            }),
        [],
    );

    type FormValues = z.infer<typeof schema>;

    function ItineraryForm({
        initial,
        onSubmit,
        submitting,
    }: {
        initial?: Partial<FormValues>;
        onSubmit: (values: FormValues) => void;
        submitting: boolean;
    }) {
        const [values, setValues] = useState<FormValues>({
            day_number: Number(initial?.day_number ?? 1),
            title: initial?.title ?? '',
            location: initial?.location ?? '',
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
                        <Label htmlFor="day_number">Day</Label>
                        <Input
                            id="day_number"
                            type="number"
                            min={1}
                            value={values.day_number}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    day_number: Number(e.target.value),
                                })
                            }
                        />
                        <InputError message={errors.day_number} />
                    </div>
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={values.title}
                            onChange={(e) =>
                                setValues({ ...values, title: e.target.value })
                            }
                        />
                        <InputError message={errors.title} />
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

    function RowActions({ row }: { row: ItineraryRow }) {
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
                            <DialogTitle>Edit Itinerary</DialogTitle>
                        </DialogHeader>
                        <ItineraryForm
                            initial={{
                                day_number: row.day_number,
                                title: row.title,
                                location: row.location,
                                description: row.description,
                            }}
                            submitting={submitting}
                            onSubmit={(values) => {
                                setSubmitting(true);
                                router.put(
                                    itineraries.update.url(row.id),
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
                            <AlertDialogTitle>
                                Delete itinerary?
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() =>
                                    router.delete(
                                        itineraries.destroy.url(row.id),
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
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>Create Itinerary</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Itinerary</DialogTitle>
                            </DialogHeader>
                            <ItineraryForm
                                submitting={false}
                                onSubmit={(values) =>
                                    router.post(
                                        itineraries.store.url(),
                                        values,
                                        {
                                            preserveScroll: true,
                                            onSuccess: () =>
                                                setCreateOpen(false),
                                            onError: () => {},
                                        },
                                    )
                                }
                            />
                        </DialogContent>
                    </Dialog>
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
                    renderActions={(row) => <RowActions row={row} />}
                />
            </div>
        </AppLayout>
    );
}
