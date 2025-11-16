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
import AppLayout from '@/layouts/app-layout';
import paymentGateways from '@/routes/admin/payment-gateways';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

type GatewayRow = {
    id: number;
    name: string;
    is_active: boolean;
    created_at: string;
};

type Sort = { by: string; direction: 'asc' | 'desc' };

const schema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(255, 'Name must not exceed 255 characters'),
    is_active: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

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

    function GatewayForm({
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
            is_active: initial?.is_active ?? false,
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
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="is_active"
                        checked={values.is_active}
                        onCheckedChange={(checked) =>
                            setValues({
                                ...values,
                                is_active: Boolean(checked),
                            })
                        }
                    />
                    <Label htmlFor="is_active">Active</Label>
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={submitting}>
                        Save
                    </Button>
                </DialogFooter>
            </form>
        );
    }

    function RowActions({ row }: { row: GatewayRow }) {
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
                            <DialogTitle>Edit Payment Gateway</DialogTitle>
                        </DialogHeader>
                        <GatewayForm
                            initial={{
                                name: row.name,
                                is_active: row.is_active,
                            }}
                            submitting={submitting}
                            onSubmit={(values) => {
                                setSubmitting(true);
                                router.put(
                                    paymentGateways.update.url(row.id),
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
                                Delete payment gateway?
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() =>
                                    router.delete(
                                        paymentGateways.destroy.url(row.id),
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
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Payment Gateway
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Create Payment Gateway
                                </DialogTitle>
                            </DialogHeader>
                            <GatewayForm
                                submitting={submitting}
                                onSubmit={(values) => {
                                    setSubmitting(true);
                                    router.post(
                                        paymentGateways.store.url(),
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
                    renderActions={(row) => <RowActions row={row} />}
                />
            </div>
        </AppLayout>
    );
}
