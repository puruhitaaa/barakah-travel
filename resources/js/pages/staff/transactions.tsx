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
import transactions from '@/routes/staff/transactions';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { z } from 'zod';

type TransactionRow = {
    id: number;
    reference_number: string;
    amount: number;
    status: string;
    booking?: { booking_reference: string };
    created_at: string;
};

type Sort = { by: string; direction: 'asc' | 'desc' };

const schema = z.object({
    amount: z.coerce
        .number()
        .min(0, 'Amount must be at least 0')
        .nonnegative('Amount must be a positive number'),
    status: z
        .enum(['pending', 'success', 'failed'])
        .refine(
            (val) => ['pending', 'success', 'failed'].includes(val),
            'Status must be pending, success, or failed',
        ),
    payment_method: z
        .string()
        .max(64, 'Payment method must not exceed 64 characters')
        .optional(),
    reference_number: z
        .string()
        .min(1, 'Reference number is required')
        .max(255, 'Reference number must not exceed 255 characters'),
    booking_id: z.coerce
        .number()
        .int('Booking ID must be an integer')
        .positive('Booking ID must be a positive integer'),
    gateway_type: z.string().optional(),
    gateway_id: z.coerce
        .number()
        .int()
        .nonnegative('Gateway ID must be a positive integer')
        .optional(),
});

type FormValues = z.infer<typeof schema>;

export default function TransactionsPage() {
    const { items, filters, sort, bookings, paymentGateways } = usePage<
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
            bookings: Array<{ id: number; booking_reference: string }>;
            paymentGateways: Array<{ id: number; name: string }>;
        }
    >().props;

    const [createOpen, setCreateOpen] = useState(false);

    function TransactionForm({
        initial,
        onSubmit,
        submitting,
    }: {
        initial?: Partial<FormValues>;
        onSubmit: (values: FormValues) => void;
        submitting: boolean;
    }) {
        const [values, setValues] = useState<FormValues>({
            amount: initial?.amount ?? 0,
            status: initial?.status ?? 'pending',
            payment_method: initial?.payment_method ?? '',
            reference_number: initial?.reference_number ?? '',
            booking_id: initial?.booking_id ?? 0,
            gateway_type: initial?.gateway_type ?? '',
            gateway_id: initial?.gateway_id ?? undefined,
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
                        <Label htmlFor="reference_number">
                            Reference Number
                        </Label>
                        <Input
                            id="reference_number"
                            value={values.reference_number}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    reference_number: e.target.value,
                                })
                            }
                        />
                        <InputError message={errors.reference_number} />
                    </div>
                    <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={values.amount}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    amount: Number(e.target.value),
                                })
                            }
                        />
                        <InputError message={errors.amount} />
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={values.status}
                            onValueChange={(value) =>
                                setValues({
                                    ...values,
                                    status: value as
                                        | 'pending'
                                        | 'success'
                                        | 'failed',
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                    <div>
                        <Label htmlFor="booking_id">Booking</Label>
                        <Select
                            value={values.booking_id?.toString() ?? ''}
                            onValueChange={(value) =>
                                setValues({
                                    ...values,
                                    booking_id: value ? Number(value) : 0,
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select booking" />
                            </SelectTrigger>
                            <SelectContent>
                                {bookings.map((booking) => (
                                    <SelectItem
                                        key={booking.id}
                                        value={booking.id.toString()}
                                    >
                                        {booking.booking_reference}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.booking_id} />
                    </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="payment_method">Payment Method</Label>
                        <Input
                            id="payment_method"
                            value={values.payment_method ?? ''}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    payment_method: e.target.value,
                                })
                            }
                        />
                        <InputError message={errors.payment_method} />
                    </div>
                    <div>
                        <Label htmlFor="gateway_id">Payment Gateway</Label>
                        <Select
                            value={values.gateway_id?.toString() ?? 'none'}
                            onValueChange={(value) =>
                                setValues({
                                    ...values,
                                    gateway_id:
                                        value === 'none'
                                            ? undefined
                                            : Number(value),
                                    gateway_type:
                                        value === 'none'
                                            ? ''
                                            : 'App\\Models\\PaymentGateway',
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select gateway (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {paymentGateways.map((gateway) => (
                                    <SelectItem
                                        key={gateway.id}
                                        value={gateway.id.toString()}
                                    >
                                        {gateway.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.gateway_id} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={submitting}>
                        Save
                    </Button>
                </DialogFooter>
            </form>
        );
    }

    function RowActions({ row }: { row: TransactionRow }) {
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
                            <DialogTitle>Edit Transaction</DialogTitle>
                        </DialogHeader>
                        <TransactionForm
                            initial={{
                                reference_number: row.reference_number,
                                amount: row.amount,
                                status: row.status as
                                    | 'pending'
                                    | 'success'
                                    | 'failed',
                            }}
                            submitting={submitting}
                            onSubmit={(values) => {
                                setSubmitting(true);
                                router.put(
                                    transactions.update.url(row.id),
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
                                Delete transaction?
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() =>
                                    router.delete(
                                        transactions.destroy.url(row.id),
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
                { title: 'Staff', href: transactions.index.url() },
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
                            Manage payment transactions
                        </p>
                    </div>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>Create Transaction</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Transaction</DialogTitle>
                            </DialogHeader>
                            <TransactionForm
                                submitting={false}
                                onSubmit={(values) =>
                                    router.post(
                                        transactions.store.url(),
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
                <AdminDataTable<TransactionRow>
                    headers={[
                        {
                            key: 'reference_number',
                            label: 'Reference',
                            sortable: true,
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
                    buildUrl={(options) => transactions.index.url(options)}
                    renderActions={(row) => <RowActions row={row} />}
                />
            </div>
        </AppLayout>
    );
}
