import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

type BookingPaymentModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    packageId: number;
    packageName: string;
    packagePrice: number;
};

const schema = z.object({
    package_id: z.number(),
    amount: z.number().min(0, 'Amount must be positive'),
    notes: z
        .string()
        .max(1000, 'Notes must not exceed 1000 characters')
        .optional(),
});

type FormValues = z.infer<typeof schema>;

declare global {
    interface Window {
        snap?: {
            pay: (
                snapToken: string,
                options: {
                    onSuccess: (result: unknown) => void;
                    onPending: (result: unknown) => void;
                    onError: (result: unknown) => void;
                    onClose: () => void;
                },
            ) => void;
        };
    }
}

export default function BookingPaymentModal({
    open,
    onOpenChange,
    packageId,
    packageName,
    packagePrice,
}: BookingPaymentModalProps) {
    const [values, setValues] = useState<FormValues>({
        package_id: packageId,
        amount: packagePrice,
        notes: '',
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof FormValues, string>>
    >({});

    const [loading, setLoading] = useState(false);
    const [snapLoaded, setSnapLoaded] = useState(false);

    // Load Midtrans Snap script
    useEffect(() => {
        const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
        if (!clientKey) {
            console.error('VITE_MIDTRANS_CLIENT_KEY not configured');
            return;
        }

        const scriptId = 'midtrans-snap-script';
        if (document.getElementById(scriptId)) {
            setSnapLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', clientKey);
        script.onload = () => setSnapLoaded(true);
        script.onerror = () =>
            console.error('Failed to load Midtrans Snap script');
        document.body.appendChild(script);

        return () => {
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, []);

    // Update form when package changes
    useEffect(() => {
        setValues({
            package_id: packageId,
            amount: packagePrice,
            notes: values.notes,
        });
    }, [packageId, packagePrice]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const parsed = schema.safeParse(values);
        if (!parsed.success) {
            const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
            parsed.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof FormValues;
                fieldErrors[key] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            // Get CSRF token from meta tag
            const csrfMeta = document.querySelector(
                'meta[name="csrf-token"]',
            ) as HTMLMetaElement;
            const csrfToken = csrfMeta?.content || '';

            // Use fetch for JSON response
            const response = await fetch('/booking/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: JSON.stringify(parsed.data),
            });

            const data = (await response.json()) as {
                snap_token?: string;
                booking_id?: number;
                error?: string;
            };

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create booking');
            }

            if (data.booking_id) {
                localStorage.setItem(
                    'current_booking_id',
                    String(data.booking_id),
                );
            }

            // Open Snap payment modal
            if (window.snap && data.snap_token) {
                window.snap.pay(data.snap_token, {
                    onSuccess: () => {
                        setTimeout(() => {
                            router.visit('/booking/payment/success');
                        }, 1500);
                    },
                    onPending: () => {
                        setTimeout(() => {
                            router.visit('/booking/payment/pending');
                        }, 1500);
                    },
                    onError: () => {
                        setTimeout(() => {
                            router.visit('/booking/payment/error');
                        }, 1500);
                    },
                    onClose: () => {
                        setLoading(false);
                    },
                });
            }
        } catch (error) {
            console.error('Payment initiation failed:', error);
            setErrors({
                amount:
                    error instanceof Error
                        ? error.message
                        : 'Failed to initiate payment',
            });
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Book Package: {packageName}</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="amount">Amount (IDR)</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={values.amount}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    amount: parseFloat(e.target.value) || 0,
                                })
                            }
                            disabled
                        />
                        <InputError message={errors.amount} />
                    </div>
                    <div>
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            value={values.notes}
                            onChange={(e) =>
                                setValues({ ...values, notes: e.target.value })
                            }
                            placeholder="Any special requests or notes..."
                            rows={3}
                        />
                        <InputError message={errors.notes} />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading || !snapLoaded}>
                            {loading
                                ? 'Processing...'
                                : !snapLoaded
                                  ? 'Loading...'
                                  : 'Proceed to Payment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
