import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Search,
    Trash2,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';

type Sort = { by: string; direction: 'asc' | 'desc' };

type Header<T> = {
    key: keyof T & string;
    label: string;
    sortable?: boolean;
    className?: string;
    render?: (row: T) => ReactNode;
};

type Pagination = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
};

interface AdminDataTableProps<T extends Record<string, unknown>> {
    headers: Header<T>[];
    rows: T[];
    sort: Sort;
    filters: Record<string, unknown>;
    pagination: Pagination;
    buildUrl: (params: Record<string, unknown>) => string;
    onDelete?: (row: T) => void;
    renderActions?: (row: T) => ReactNode;
}

export default function AdminDataTable<T extends Record<string, unknown>>({
    headers,
    rows,
    sort,
    filters,
    pagination,
    buildUrl,
    onDelete,
    renderActions,
}: AdminDataTableProps<T>) {
    const [q, setQ] = useState<string>(String(filters.q ?? ''));
    const [perPage, setPerPage] = useState<number>(
        Number(pagination.per_page ?? 15),
    );

    // Keep local state; rely on Inertia page reloads to refresh defaults

    const go = (params: Record<string, unknown>) => {
        const url = buildUrl({
            query: {
                ...filters,
                ...params,
            },
        });
        router.get(url, {}, { preserveScroll: true });
    };

    const toggleSort = (key: string) => {
        const nextDirection: 'asc' | 'desc' =
            sort.by === key && sort.direction === 'asc' ? 'desc' : 'asc';
        go({ sort: key, direction: nextDirection });
    };

    const prevDisabled = pagination.current_page <= 1;
    const nextDisabled = pagination.current_page >= pagination.last_page;

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between gap-2 pb-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                go({ q });
                            }
                        }}
                        placeholder="Search"
                        className="pl-9"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={String(perPage)}
                        onValueChange={(v) => {
                            const n = Number(v);
                            setPerPage(n);
                            go({ per_page: n, page: 1 });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="max-h-[60vh] overflow-x-auto overflow-y-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            {headers.map((h) => (
                                <th
                                    key={h.key}
                                    className={cn(
                                        'px-3 py-2 text-left font-medium',
                                        h.className,
                                    )}
                                >
                                    <button
                                        type="button"
                                        className={cn(
                                            'inline-flex items-center gap-1',
                                            h.sortable
                                                ? 'cursor-pointer'
                                                : 'cursor-default',
                                        )}
                                        onClick={
                                            h.sortable
                                                ? () => toggleSort(h.key)
                                                : undefined
                                        }
                                    >
                                        {h.label}
                                        {h.sortable && (
                                            <ArrowUpDown
                                                className={cn(
                                                    'size-3',
                                                    sort.by === h.key
                                                        ? 'opacity-100'
                                                        : 'opacity-30',
                                                )}
                                            />
                                        )}
                                    </button>
                                </th>
                            ))}
                            {(renderActions || onDelete) && (
                                <th className="px-3 py-2 text-right">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={String(
                                    (row as unknown as { id?: string | number })
                                        .id,
                                )}
                                className="border-b last:border-b-0"
                            >
                                {headers.map((h) => (
                                    <td key={h.key} className="px-3 py-2">
                                        {h.render
                                            ? h.render(row)
                                            : String(
                                                  (
                                                      row as Record<
                                                          string,
                                                          unknown
                                                      >
                                                  )[h.key] ?? '',
                                              )}
                                    </td>
                                ))}
                                {(renderActions || onDelete) && (
                                    <td className="px-3 py-2 text-right">
                                        {renderActions ? (
                                            renderActions(row)
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onDelete?.(row)}
                                            >
                                                <Trash2 className="size-4" />
                                                Delete
                                            </Button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td
                                    className="px-3 py-8 text-center text-muted-foreground"
                                    colSpan={
                                        headers.length + (onDelete ? 1 : 0)
                                    }
                                >
                                    No results
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between pt-4">
                <div className="text-xs text-muted-foreground">
                    Showing {pagination.from ?? 0}-{pagination.to ?? 0} of{' '}
                    {pagination.total}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={prevDisabled}
                        onClick={() =>
                            go({
                                page: Math.max(1, pagination.current_page - 1),
                            })
                        }
                    >
                        <ChevronLeft className="size-4" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={nextDisabled}
                        onClick={() =>
                            go({
                                page: Math.min(
                                    pagination.last_page,
                                    pagination.current_page + 1,
                                ),
                            })
                        }
                    >
                        Next
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
