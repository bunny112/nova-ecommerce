import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type OrderItem = {
    id: number;
    product_name: string;
    price: string;
    quantity: number;
    total: string;
};

type Order = {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    phone: string;
    shipping_address: string;
    subtotal: string;
    shipping_amount: string;
    total_amount: string;
    status: 'pending' | 'accepted' | 'denied';
    created_at: string;
    items: OrderItem[];
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const loadOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();

            setOrders(data.orders ?? []);
        } catch {
            setMessage('Unable to load orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const updateStatus = async (
        orderId: number,
        status: 'accepted' | 'denied',
    ) => {
        setUpdating(orderId);
        setMessage('');

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || 'Unable to update order.');
                return;
            }

            setMessage(
                status === 'accepted'
                    ? 'Order accepted successfully.'
                    : 'Order denied successfully.',
            );

            await loadOrders();
        } catch {
            setMessage('Something went wrong.');
        } finally {
            setUpdating(null);
        }
    };

    const statusClass = (status: Order['status']) => {
        if (status === 'accepted') {
            return 'bg-green-50 text-green-700';
        }

        if (status === 'denied') {
            return 'bg-red-50 text-red-600';
        }

        return 'bg-amber-50 text-amber-700';
    };

    return (
        <>
            <Head title="Admin — Orders" />

            <div className="min-h-screen bg-[#f5f5f2] text-[#171717]">
                <aside className="fixed hidden h-screen w-64 border-r border-black/10 bg-[#171717] text-white lg:block">
                    <div className="p-7">
                        <div className="text-2xl font-black tracking-[-0.06em]">
                            NOVA<span className="text-[#c29b7a]">.</span>
                        </div>

                        <p className="mt-1 text-[10px] tracking-[0.2em] text-white/30 uppercase">
                            Admin Console
                        </p>
                    </div>

                    <nav className="mt-8 px-4">
                        <a
                            href="/admin/products"
                            className="block rounded-2xl px-4 py-3 text-sm text-white/50 hover:bg-white/5 hover:text-white"
                        >
                            Products
                        </a>

                        <a
                            href="/admin/orders"
                            className="mt-2 block rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium"
                        >
                            Orders
                        </a>
                    </nav>

                    <a
                        href="/"
                        className="absolute bottom-7 left-7 text-xs text-white/40 hover:text-white"
                    >
                        ← View Store
                    </a>
                </aside>

                <main className="lg:ml-64">
                    <header className="border-b border-black/10 bg-white px-6 py-6 lg:px-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-[0.2em] text-[#8b5e3c] uppercase">
                                    Sales
                                </p>

                                <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em]">
                                    Orders
                                </h1>
                            </div>

                            <a
                                href="/"
                                className="rounded-full border border-black/10 px-5 py-2.5 text-sm"
                            >
                                Store →
                            </a>
                        </div>
                    </header>

                    <div className="p-6 lg:p-10">
                        {message && (
                            <div className="mb-6 rounded-2xl bg-white px-5 py-4 text-sm">
                                {message}
                            </div>
                        )}

                        {loading ? (
                            <div className="rounded-3xl bg-white py-20 text-center text-black/40">
                                Loading orders...
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="rounded-3xl bg-white py-20 text-center">
                                <p className="text-4xl">○</p>

                                <h2 className="mt-4 text-xl font-semibold">
                                    No orders yet
                                </h2>

                                <p className="mt-2 text-sm text-black/40">
                                    New customer orders will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {orders.map((order) => (
                                    <article
                                        key={order.id}
                                        className="overflow-hidden rounded-3xl bg-white"
                                    >
                                        <div className="flex flex-col justify-between gap-5 border-b border-black/5 p-6 md:flex-row md:items-center">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h2 className="font-semibold">
                                                        {order.order_number}
                                                    </h2>

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${statusClass(
                                                            order.status,
                                                        )}`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-sm text-black/50">
                                                    {order.customer_name} ·{' '}
                                                    {order.customer_email}
                                                </p>

                                                <p className="mt-1 text-xs text-black/35">
                                                    {new Date(
                                                        order.created_at,
                                                    ).toLocaleString('en-IN')}
                                                </p>
                                            </div>

                                            <div className="text-left md:text-right">
                                                <p className="text-xl font-semibold">
                                                    ₹
                                                    {Number(
                                                        order.total_amount,
                                                    ).toLocaleString(
                                                        'en-IN',
                                                    )}
                                                </p>

                                                <p className="mt-1 text-xs text-black/40">
                                                    {order.items.length}{' '}
                                                    {order.items.length === 1
                                                        ? 'item'
                                                        : 'items'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_280px]">
                                            <div>
                                                <h3 className="text-xs font-bold tracking-[0.15em] text-black/40 uppercase">
                                                    Items
                                                </h3>

                                                <div className="mt-4 space-y-3">
                                                    {order.items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center justify-between rounded-2xl bg-[#f7f6f2] px-4 py-3"
                                                        >
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        item.product_name
                                                                    }
                                                                </p>

                                                                <p className="mt-1 text-xs text-black/40">
                                                                    ₹
                                                                    {Number(
                                                                        item.price,
                                                                    ).toLocaleString(
                                                                        'en-IN',
                                                                    )}{' '}
                                                                    ×{' '}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </p>
                                                            </div>

                                                            <p className="text-sm font-semibold">
                                                                ₹
                                                                {Number(
                                                                    item.total,
                                                                ).toLocaleString(
                                                                    'en-IN',
                                                                )}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-xs font-bold tracking-[0.15em] text-black/40 uppercase">
                                                    Delivery
                                                </h3>

                                                <div className="mt-4 rounded-2xl bg-[#f7f6f2] p-4 text-sm">
                                                    <p className="font-medium">
                                                        {
                                                            order.customer_name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-black/50">
                                                        {order.phone}
                                                    </p>

                                                    <p className="mt-3 leading-6 text-black/50">
                                                        {
                                                            order.shipping_address
                                                        }
                                                    </p>
                                                </div>

                                                {order.status === 'pending' && (
                                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                                        <button
                                                            disabled={
                                                                updating ===
                                                                order.id
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    order.id,
                                                                    'accepted',
                                                                )
                                                            }
                                                            className="rounded-full bg-[#171717] py-3 text-xs font-semibold text-white disabled:opacity-50"
                                                        >
                                                            {updating ===
                                                            order.id
                                                                ? 'Updating...'
                                                                : 'Accept Order'}
                                                        </button>

                                                        <button
                                                            disabled={
                                                                updating ===
                                                                order.id
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    order.id,
                                                                    'denied',
                                                                )
                                                            }
                                                            className="rounded-full bg-red-50 py-3 text-xs font-semibold text-red-600 disabled:opacity-50"
                                                        >
                                                            Deny
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}