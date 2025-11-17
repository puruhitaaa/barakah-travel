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
import { XCircle } from 'lucide-react';

export default function PaymentErrorPage() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Payment Failed', href: '#' }]}>
            <Head title="Payment Failed" />
            <div className="flex min-h-[60vh] items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                        </div>
                        <CardTitle className="text-2xl">
                            Payment Failed
                        </CardTitle>
                        <CardDescription>
                            There was a problem processing your payment
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-center text-sm text-muted-foreground">
                            Your payment could not be processed. Please try
                            again or contact support if the problem persists.
                        </p>
                        <div className="flex gap-2">
                            <Button
                                asChild
                                variant="outline"
                                className="flex-1"
                            >
                                <Link href="/">Go Home</Link>
                            </Button>
                            <Button asChild className="flex-1">
                                <Link href="/packages">View Packages</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
