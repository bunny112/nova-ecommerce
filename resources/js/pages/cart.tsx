import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type CartItem = {
    id: number;
    name: string;
    price: string;
    image: string | null;
    category: string | null;
    quantity: number;
};

export default function Cart() {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const cart = JSON.parse(
            localStorage.getItem('nova_cart') || '[]',
        );

        setItems(cart);
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) return;

        const updated = items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
        );

        setItems(updated);
        localStorage.setItem('nova_cart', JSON.stringify(updated));
    };

    const removeItem = (id: number) => {
        const updated = items.filter((item) => item.id !== id);

        setItems(updated);
        localStorage.setItem('nova_cart', JSON.stringify(updated));
    };

    const subtotal = items.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0,
    );

    return (
        <>
            <Head title="Your Cart — NOVA" />

            <div className="min-h-screen bg-[#f7f6f2] text-[#171717]">

                <header className="border-b border-black/10">
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
                        <a
                            href="/"
                            className="text-2xl font-black tracking-[-0.06em]"
                        >
                            NOVA<span className="text-[#8b5e3c]">.</span>
                        </a>

                        <a
                            href="/"
                            className="text-sm font-medium hover:opacity-50"
                        >
                            Continue Shopping →
                        </a>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
                    <div className="mb-10">
                        <p className="text-xs font-bold tracking-[0.25em] text-[#8b5e3c] uppercase">
                            Your selection
                        </p>

                        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                            Shopping Cart
                        </h1>
                    </div>

                    {items.length === 0 ? (
                        <div className="rounded-3xl bg-white px-6 py-24 text-center">
                            <div className="mx-auto max-w-md">
                                <p className="text-5xl">∅</p>

                                <h2 className="mt-5 text-2xl font-semibold">
                                    Your cart is empty
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-black/50">
                                    Discover something you love and add it to
                                    your collection.
                                </p>

                                <a
                                    href="/"
                                    className="mt-7 inline-block rounded-full bg-[#171717] px-7 py-3.5 text-sm font-semibold text-white"
                                >
                                    Explore Products
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-5 rounded-3xl bg-white p-4 sm:p-5"
                                    >
                                        <div className="h-32 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#eee] sm:h-40 sm:w-36">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                                            <div>
                                                <p className="text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase">
                                                    {item.category}
                                                </p>

                                                <h2 className="mt-1 text-lg font-semibold">
                                                    {item.name}
                                                </h2>

                                                <p className="mt-2 font-semibold">
                                                    ₹
                                                    {Number(
                                                        item.price,
                                                    ).toLocaleString('en-IN')}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center rounded-full border border-black/10">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity -
                                                                    1,
                                                            )
                                                        }
                                                        className="px-4 py-2 text-sm"
                                                    >
                                                        −
                                                    </button>

                                                    <span className="min-w-8 text-center text-sm">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity +
                                                                    1,
                                                            )
                                                        }
                                                        className="px-4 py-2 text-sm"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        removeItem(item.id)
                                                    }
                                                    className="text-xs text-black/40 hover:text-black"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <aside className="h-fit rounded-3xl bg-[#171717] p-7 text-white">
                                <h2 className="text-xl font-semibold">
                                    Order Summary
                                </h2>

                                <div className="mt-7 space-y-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/50">
                                            Subtotal
                                        </span>
                                        <span>
                                            ₹
                                            {subtotal.toLocaleString(
                                                'en-IN',
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-white/50">
                                            Shipping
                                        </span>
                                        <span>
                                            {subtotal >= 2000
                                                ? 'FREE'
                                                : '₹99'}
                                        </span>
                                    </div>

                                    <div className="border-t border-white/10 pt-4">
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total</span>
                                            <span>
                                                ₹
                                                {(
                                                    subtotal +
                                                    (subtotal >= 2000 ? 0 : 99)
                                                ).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href="/checkout"
                                    className="mt-7 block rounded-full bg-white py-4 text-center text-sm font-semibold text-black transition hover:bg-white/90"
                                >
                                    Proceed to Checkout
                                </a>
                            </aside>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}