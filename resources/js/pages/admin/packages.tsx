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
import { Checkbox } from '@/components/ui/checkbox';
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
import packages from '@/routes/admin/packages';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { z } from 'zod';

type PackageRow = {
    id: number;
    name: string;
    type: string;
    price: number;
    departure_date: string;
    return_date: string;
    duration_days: number;
    available_slots: number;
    is_featured?: boolean;
    description?: string;
    created_at: string;
};

type Sort = { by: string; direction: 'asc' | 'desc' };

export default function PackagesPage() {
    const { items, filters, sort } = usePage<
        SharedData & {
            items: {
                data: PackageRow[];
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
            z
                .object({
                    name: z.string().min(1).max(255),
                    description: z.string().optional(),
                    type: z.enum(['hajj', 'umrah']),
                    duration_days: z.preprocess(
                        (v) => Number(v),
                        z.number().int().min(1).max(365),
                    ),
                    price: z.preprocess(
                        (v) => Number(v),
                        z.number().min(0).max(99999999.99),
                    ),
                    departure_date: z.string().min(1),
                    return_date: z.string().min(1),
                    available_slots: z.preprocess(
                        (v) => Number(v),
                        z.number().int().min(0),
                    ),
                    is_featured: z
                        .preprocess((v) => Boolean(v), z.boolean())
                        .optional(),
                })
                .refine(
                    (vals) =>
                        new Date(vals.return_date) >=
                        new Date(vals.departure_date),
                    {
                        message:
                            'Return date must be after or equal to departure date.',
                        path: ['return_date'],
                    },
                ),
        [],
    );

    type FormValues = z.infer<typeof schema>;

    function PackageForm({
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
            description: initial?.description ?? '',
            type: (initial?.type as 'hajj' | 'umrah') ?? 'hajj',
            duration_days: Number(initial?.duration_days ?? 1),
            price: Number(initial?.price ?? 0),
            departure_date: initial?.departure_date ?? '',
            return_date: initial?.return_date ?? '',
            available_slots: Number(initial?.available_slots ?? 0),
            is_featured: Boolean(initial?.is_featured ?? false),
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
                        <Select
                            value={values.type}
                            onValueChange={(v) =>
                                setValues({
                                    ...values,
                                    type: v as 'hajj' | 'umrah',
                                })
                            }
                        >
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hajj">Hajj</SelectItem>
                                <SelectItem value="umrah">Umrah</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} />
                    </div>
                    <div>
                        <Label htmlFor="duration_days">Duration (days)</Label>
                        <Input
                            id="duration_days"
                            type="number"
                            min={1}
                            value={values.duration_days}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    duration_days: Number(e.target.value),
                                })
                            }
                        />
                        <InputError message={errors.duration_days} />
                    </div>
                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            min={0}
                            max={99999999.99}
                            step="0.01"
                            value={values.price}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    price: Number(e.target.value),
                                })
                            }
                        />
                        <InputError message={errors.price} />
                    </div>
                    <div>
                        <Label htmlFor="departure_date">Departure</Label>
                        <Input
                            id="departure_date"
                            type="date"
                            value={values.departure_date}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    departure_date: e.target.value,
                                })
                            }
                        />
                        <InputError message={errors.departure_date} />
                    </div>
                    <div>
                        <Label htmlFor="return_date">Return</Label>
                        <Input
                            id="return_date"
                            type="date"
                            value={values.return_date}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    return_date: e.target.value,
                                })
                            }
                        />
                        <InputError message={errors.return_date} />
                    </div>
                    <div>
                        <Label htmlFor="available_slots">Available slots</Label>
                        <Input
                            id="available_slots"
                            type="number"
                            min={0}
                            value={values.available_slots}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    available_slots: Number(e.target.value),
                                })
                            }
                        />
                        <InputError message={errors.available_slots} />
                    </div>
                    <div>
                        <Label htmlFor="is_featured">Featured</Label>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_featured"
                                checked={values.is_featured}
                                onCheckedChange={(checked) =>
                                    setValues({
                                        ...values,
                                        is_featured: Boolean(checked),
                                    })
                                }
                            />
                        </div>
                        <InputError message={errors.is_featured} />
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

    function RowActions({ row }: { row: PackageRow }) {
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
                            <DialogTitle>Edit Package</DialogTitle>
                        </DialogHeader>
                        <PackageForm
                            initial={{
                                name: row.name,
                                description: row.description,
                                type: row.type as 'hajj' | 'umrah',
                                duration_days: row.duration_days,
                                price: row.price,
                                departure_date: row.departure_date,
                                return_date: row.return_date,
                                available_slots: row.available_slots,
                                is_featured: Boolean(row.is_featured ?? false),
                            }}
                            submitting={submitting}
                            onSubmit={(values) => {
                                setSubmitting(true);
                                router.put(
                                    packages.update.url(row.id),
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
                            <AlertDialogTitle>Delete package?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() =>
                                    router.delete(packages.destroy.url(row.id))
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
                { title: 'Admin', href: packages.index.url() },
                { title: 'Packages', href: packages.index.url() },
            ]}
        >
            <Head title="Packages" />

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Packages
                        </h1>
                        <p className="text-muted-foreground">
                            Manage travel packages
                        </p>
                    </div>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>Create Package</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Package</DialogTitle>
                            </DialogHeader>
                            <PackageForm
                                submitting={false}
                                onSubmit={(values) =>
                                    router.post(packages.store.url(), values, {
                                        preserveScroll: true,
                                        onSuccess: () => setCreateOpen(false),
                                        onError: () => {},
                                    })
                                }
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                <AdminDataTable<PackageRow>
                    headers={[
                        { key: 'name', label: 'Name', sortable: true },
                        { key: 'type', label: 'Type', sortable: true },
                        { key: 'price', label: 'Price', sortable: true },
                        {
                            key: 'departure_date',
                            label: 'Departure',
                            sortable: true,
                        },
                        {
                            key: 'available_slots',
                            label: 'Slots',
                            sortable: true,
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
                    buildUrl={(options) => packages.index.url(options)}
                    renderActions={(row) => <RowActions row={row} />}
                />
            </div>
        </AppLayout>
    );
}
