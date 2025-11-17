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
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Payment Success', href: '#' }]}>
            <Head title="Payment Success" />
            <div className="flex min-h-[60vh] items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-2xl">
                            Payment Successful!
                        </CardTitle>
                        <CardDescription>
                            Your booking has been confirmed
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-center text-sm text-muted-foreground">
                            Thank you for your payment. You will receive a
                            confirmation email shortly with your booking
                            details.
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
