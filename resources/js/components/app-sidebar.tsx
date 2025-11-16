import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Bus,
    CalendarClock,
    ClipboardList,
    CreditCard,
    Images,
    LayoutGrid,
    Package,
    ReceiptText,
} from 'lucide-react';
import AppLogo from './app-logo';

function useMainNavItems(): NavItem[] {
    const { props } = usePage<
        SharedData & { auth: SharedData['auth'] & { roles: string[] } }
    >();
    const roles: string[] = props.auth?.roles ?? [];

    const items: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    if (roles.includes('admin')) {
        items.push(
            {
                title: 'Packages',
                href: admin.packages.index.url(),
                icon: Package,
            },
            {
                title: 'Accommodations',
                href: admin.accommodations.index.url(),
                icon: Building2,
            },
            {
                title: 'Transportations',
                href: admin.transportations.index.url(),
                icon: Bus,
            },
            {
                title: 'Itineraries',
                href: admin.itineraries.index.url(),
                icon: CalendarClock,
            },
            {
                title: 'Bookings',
                href: admin.bookings.index.url(),
                icon: ClipboardList,
            },
            {
                title: 'Payment Gateways',
                href: admin.paymentGateways.index.url(),
                icon: CreditCard,
            },
            {
                title: 'Transactions',
                href: admin.transactions.index.url(),
                icon: ReceiptText,
            },
            { title: 'Media', href: admin.media.index.url(), icon: Images },
        );
    }

    return items;
}

export function AppSidebar() {
    const mainNavItems = useMainNavItems();
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
