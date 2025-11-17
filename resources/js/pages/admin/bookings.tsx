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
import bookings from '@/routes/admin/bookings';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { z } from 'zod';

type BookingRow = {
    id: number;
    booking_reference: string;
    status: string;
    user?: { name: string };
    package?: { name: string };
    notes?: string;
    created_at: string;
};

type Sort = { by: string; direction: 'asc' | 'desc' };

export default function BookingsPage() {
    const { items, filters, sort, users, packages } = usePage<
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
            users: Array<{ id: number; name: string; email: string }>;
            packages: Array<{ id: number; name: string }>;
        }
    >().props;

    const [createOpen, setCreateOpen] = useState(false);

    const strOrUndefined = (v: unknown) =>
        typeof v === 'string' && v.trim() === '' ? undefined : v;

    const createSchema = useMemo(
        () =>
            z.object({
                booking_reference: z
                    .preprocess(strOrUndefined, z.string().max(64))
                    .optional(),
                status: z.string().min(1).max(32),
                notes: z.preprocess(strOrUndefined, z.string()).optional(),
                user_id: z.preprocess(
                    (v) => Number(v),
                    z.number().int().min(1),
                ),
                package_id: z.preprocess(
                    (v) => Number(v),
                    z.number().int().min(1),
                ),
            }),
        [],
    );

    const updateSchema = useMemo(
        () =>
            z.object({
                booking_reference: z
                    .preprocess(strOrUndefined, z.string().max(64))
                    .optional(),
                status: z.string().min(1).max(32).optional(),
                notes: z.preprocess(strOrUndefined, z.string()).optional(),
                user_id: z
                    .preprocess(
                        (v) =>
                            v === '' || v === null || v === undefined
                                ? undefined
                                : Number(v),
                        z.number().int().min(1),
                    )
                    .optional(),
                package_id: z
                    .preprocess(
                        (v) =>
                            v === '' || v === null || v === undefined
                                ? undefined
                                : Number(v),
                        z.number().int().min(1),
                    )
                    .optional(),
            }),
        [],
    );

    type FormValues = {
        booking_reference?: string;
        status?: string;
        notes?: string;
        user_id?: number;
        package_id?: number;
    };

    function BookingForm({
        initial,
        onSubmit,
        submitting,
        schema,
    }: {
        initial?: Partial<FormValues>;
        onSubmit: (values: FormValues) => void;
        submitting: boolean;
        schema: z.ZodType<FormValues>;
    }) {
        const [values, setValues] = useState<FormValues>({
            booking_reference: initial?.booking_reference ?? '',
            status: initial?.status ?? '',
            notes: initial?.notes ?? '',
            user_id: initial?.user_id ?? undefined,
            package_id: initial?.package_id ?? undefined,
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
            const cleaned = Object.fromEntries(
                Object.entries(parsed.data).filter(
                    ([, v]) =>
                        v !== undefined &&
                        !(typeof v === 'string' && v.trim() === ''),
                ),
            ) as FormValues;
            setErrors({});
            onSubmit(cleaned);
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
                        <Label htmlFor="status">Status</Label>
                        <Input
                            id="status"
                            value={values.status ?? ''}
                            onChange={(e) =>
                                setValues({ ...values, status: e.target.value })
                            }
                        />
                        <InputError message={errors.status} />
                    </div>
                    <div>
                        <Label htmlFor="booking_reference">Reference</Label>
                        <Input
                            id="booking_reference"
                            value={values.booking_reference ?? ''}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    booking_reference: e.target.value,
                                })
                            }
                        />
                        <InputError message={errors.booking_reference} />
                    </div>
                    <div>
                        <Label htmlFor="user_id">User</Label>
                        <Select
                            value={values.user_id?.toString() ?? ''}
                            onValueChange={(value) =>
                                setValues({
                                    ...values,
                                    user_id: value ? Number(value) : undefined,
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem
                                        key={user.id}
                                        value={user.id.toString()}
                                    >
                                        {user.name} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.user_id} />
                    </div>
                    <div>
                        <Label htmlFor="package_id">Package</Label>
                        <Select
                            value={values.package_id?.toString() ?? ''}
                            onValueChange={(value) =>
                                setValues({
                                    ...values,
                                    package_id: value
                                        ? Number(value)
                                        : undefined,
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select package" />
                            </SelectTrigger>
                            <SelectContent>
                                {packages.map((pkg) => (
                                    <SelectItem
                                        key={pkg.id}
                                        value={pkg.id.toString()}
                                    >
                                        {pkg.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.package_id} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                        id="notes"
                        value={values.notes ?? ''}
                        onChange={(e) =>
                            setValues({ ...values, notes: e.target.value })
                        }
                    />
                    <InputError message={errors.notes} />
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={submitting}>
                        Save
                    </Button>
                </DialogFooter>
            </form>
        );
    }

    function RowActions({ row }: { row: BookingRow }) {
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
                            <DialogTitle>Edit Booking</DialogTitle>
                        </DialogHeader>
                        <BookingForm
                            initial={{
                                booking_reference: row.booking_reference,
                                status: row.status,
                                notes: row.notes,
                            }}
                            submitting={submitting}
                            schema={updateSchema}
                            onSubmit={(values) => {
                                setSubmitting(true);
                                router.put(
                                    bookings.update.url(row.id),
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
                            <AlertDialogTitle>Delete booking?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() =>
                                    router.delete(bookings.destroy.url(row.id))
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
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>Create Booking</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Booking</DialogTitle>
                            </DialogHeader>
                            <BookingForm
                                submitting={false}
                                schema={createSchema}
                                onSubmit={(values) =>
                                    router.post(bookings.store.url(), values, {
                                        preserveScroll: true,
                                        onSuccess: () => setCreateOpen(false),
                                        onError: () => {},
                                    })
                                }
                            />
                        </DialogContent>
                    </Dialog>
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
                    renderActions={(row) => <RowActions row={row} />}
                />
            </div>
        </AppLayout>
    );
}
