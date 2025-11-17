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
import transportations from '@/routes/admin/transportations';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

type TransportationRow = {
    id: number;
    type: string;
    company?: string;
    capacity?: number;
    description?: string;
    created_at: string;
};

type Sort = { by: string; direction: 'asc' | 'desc' };

export default function TransportationsPage() {
    const { items, filters, sort, transportationTypes } = usePage<
        SharedData & {
            items: {
                data: TransportationRow[];
                current_page: number;
                last_page: number;
                per_page: number;
                total: number;
                from?: number;
                to?: number;
            };
            filters: Record<string, unknown>;
            sort: Sort;
            transportationTypes: Array<{ value: string; label: string }>;
        }
    >().props;

    const [createOpen, setCreateOpen] = useState(false);

    const schema = useMemo(
        () =>
            z.object({
                type: z
                    .enum(['bus', 'flight', 'train', 'van'])
                    .refine(
                        (val) =>
                            ['bus', 'flight', 'train', 'van'].includes(val),
                        'Type must be bus, flight, train, or van',
                    ),
                company: z.string().max(255).optional(),
                capacity: z.preprocess(
                    (v) =>
                        v === '' || v === null || v === undefined
                            ? undefined
                            : Number(v),
                    z.number().int().min(1).optional(),
                ),
                description: z.string().optional(),
            }),
        [],
    );

    type FormValues = z.infer<typeof schema>;

    function TransportationForm({
        initial,
        onSubmit,
        submitting,
    }: {
        initial?: Partial<FormValues>;
        onSubmit: (values: FormValues) => void;
        submitting: boolean;
    }) {
        const [values, setValues] = useState<FormValues>({
            type:
                (initial?.type as 'bus' | 'flight' | 'train' | 'van') ??
                ('bus' as const),
            company: initial?.company ?? '',
            capacity: initial?.capacity ?? undefined,
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
                        <Label htmlFor="type">Type</Label>
                        <Select
                            value={values.type}
                            onValueChange={(value) =>
                                setValues({
                                    ...values,
                                    type: value as
                                        | 'bus'
                                        | 'flight'
                                        | 'train'
                                        | 'van',
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {transportationTypes.map((type) => (
                                    <SelectItem
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} />
                    </div>
                    <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                            id="company"
                            value={values.company ?? ''}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    company: e.target.value,
                                })
                            }
                        />
                        <InputError message={errors.company} />
                    </div>
                    <div>
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input
                            id="capacity"
                            type="number"
                            min={1}
                            value={values.capacity ?? ''}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    capacity:
                                        e.target.value === ''
                                            ? undefined
                                            : Number(e.target.value),
                                })
                            }
                        />
                        <InputError message={errors.capacity} />
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

    function RowActions({ row }: { row: TransportationRow }) {
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
                            <DialogTitle>Edit Transportation</DialogTitle>
                        </DialogHeader>
                        <TransportationForm
                            initial={{
                                type:
                                    (row.type as
                                        | 'bus'
                                        | 'flight'
                                        | 'train'
                                        | 'van') ?? ('bus' as const),
                                company: row.company,
                                capacity: row.capacity,
                                description: row.description,
                            }}
                            submitting={submitting}
                            onSubmit={(values) => {
                                setSubmitting(true);
                                router.put(
                                    transportations.update.url(row.id),
                                    values,
                                    {
                                        preserveScroll: true,
                                        onFinish: () => setSubmitting(false),
                                        onSuccess: () => {
                                            setOpen(false);
                                            toast.success(
                                                'Transportation updated successfully!',
                                            );
                                        },
                                        onError: () => {
                                            toast.error(
                                                'Something went wrong when updating transportation!',
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
                                Delete transportation?
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() =>
                                    router.delete(
                                        transportations.destroy.url(row.id),
                                        {
                                            preserveScroll: true,
                                            onSuccess: () =>
                                                toast.success(
                                                    'Transportation deleted successfully!',
                                                ),
                                            onError: () =>
                                                toast.error(
                                                    'Something went wrong when deleting transportation!',
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
                { title: 'Admin', href: transportations.index.url() },
                { title: 'Transportations', href: transportations.index.url() },
            ]}
        >
            <Head title="Transportations" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Transportations
                        </h1>
                        <p className="text-muted-foreground">
                            Manage transportations
                        </p>
                    </div>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>Create Transportation</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Transportation</DialogTitle>
                            </DialogHeader>
                            <TransportationForm
                                submitting={false}
                                onSubmit={(values) =>
                                    router.post(
                                        transportations.store.url(),
                                        values,
                                        {
                                            preserveScroll: true,
                                            onSuccess: () => {
                                                setCreateOpen(false);
                                                toast.success(
                                                    'Transportation created successfully!',
                                                );
                                            },
                                            onError: () => {
                                                toast.error(
                                                    'Something went wrong when creating transportation!',
                                                );
                                            },
                                        },
                                    )
                                }
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                <AdminDataTable<TransportationRow>
                    headers={[
                        { key: 'type', label: 'Type', sortable: true },
                        { key: 'company', label: 'Company', sortable: true },
                        { key: 'capacity', label: 'Capacity', sortable: true },
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
                    buildUrl={(options) => transportations.index.url(options)}
                    renderActions={(row) => <RowActions row={row} />}
                />
            </div>
        </AppLayout>
    );
}
