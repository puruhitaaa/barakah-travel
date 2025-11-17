import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { DollarSign, MoonStar, Package, Users } from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type DashboardStats = {
    total_packages: number;
    total_bookings: number;
    total_revenue: number;
    total_users: number;
};

type MonthlyRevenue = {
    month: string;
    revenue: number;
};

type StatusCount = {
    status: string;
    count: number;
};

type TypeCount = {
    type: string;
    count: number;
};

type DailyBooking = {
    date: string;
    bookings: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const {
        stats,
        monthlyRevenue,
        bookingsByStatus,
        packagesByType,
        recentBookings,
        transactionsByStatus,
    } = usePage<
        SharedData & {
            stats: DashboardStats;
            monthlyRevenue: MonthlyRevenue[];
            bookingsByStatus: StatusCount[];
            packagesByType: TypeCount[];
            recentBookings: DailyBooking[];
            transactionsByStatus: StatusCount[];
        }
    >().props;

    // Chart colors
    const COLORS = [
        'hsl(var(--chart-1))',
        'hsl(var(--chart-2))',
        'hsl(var(--chart-3))',
        'hsl(var(--chart-4))',
        'hsl(var(--chart-5))',
    ];

    const revenueChartConfig = {
        revenue: {
            label: 'Revenue',
            color: 'hsl(var(--chart-1))',
        },
    } satisfies ChartConfig;

    const bookingsChartConfig = {
        bookings: {
            label: 'Bookings',
            color: 'hsl(var(--chart-2))',
        },
    } satisfies ChartConfig;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Packages
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_packages}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Hajj & Umrah packages
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Bookings
                            </CardTitle>
                            <MoonStar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_bookings}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All time bookings
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_revenue.toLocaleString('id-ID', {
                                    currency: 'IDR',
                                    style: 'currency',
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                From successful transactions
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_users}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Registered users
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Monthly Revenue */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Revenue</CardTitle>
                            <CardDescription>
                                Last 6 months revenue trend
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={revenueChartConfig}>
                                <AreaChart
                                    data={monthlyRevenue}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                    />
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="var(--color-revenue)"
                                        fill="var(--color-revenue)"
                                        fillOpacity={0.2}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Recent Bookings Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Bookings</CardTitle>
                            <CardDescription>
                                Last 7 days booking activity
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={bookingsChartConfig}>
                                <BarChart
                                    data={recentBookings}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                    />
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                    />
                                    <Bar
                                        dataKey="bookings"
                                        fill="var(--color-bookings)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Bookings by Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Bookings by Status</CardTitle>
                            <CardDescription>
                                Distribution of booking statuses
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={bookingsByStatus}
                                        dataKey="count"
                                        nameKey="status"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={(entry) =>
                                            `${entry.status}: ${entry.count}`
                                        }
                                    >
                                        {bookingsByStatus.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            ),
                                        )}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Packages by Type */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Packages by Type</CardTitle>
                            <CardDescription>
                                Hajj vs Umrah packages
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={packagesByType}
                                        dataKey="count"
                                        nameKey="type"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={(entry) =>
                                            `${entry.type}: ${entry.count}`
                                        }
                                    >
                                        {packagesByType.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Transactions by Status */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Transaction Status</CardTitle>
                            <CardDescription>
                                Success, pending, and failed transactions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={transactionsByStatus}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="status" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                        {transactionsByStatus.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            ),
                                        )}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
