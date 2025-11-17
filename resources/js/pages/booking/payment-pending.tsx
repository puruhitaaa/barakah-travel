import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Clock } from 'lucide-react';

export default function PaymentPendingPage() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Payment Pending', href: '#' }]}>
            <Head title="Payment Pending" />
            <div className="flex min-h-[60vh] items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                            <Clock className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <CardTitle className="text-2xl">
                            Payment Pending
                        </CardTitle>
                        <CardDescription>
                            Your payment is being processed
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-center text-sm text-muted-foreground">
                            We are waiting for confirmation of your payment. You
                            will be notified once the payment is confirmed.
                        </p>
                        <div className="flex gap-2">
                            <Button asChild className="flex-1">
                                <Link href="/">Go Home</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
