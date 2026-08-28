import { Head } from '@inertiajs/react';
import { FormEvent, useEffect, useMemo, useState } from 'react';

type CartItem = {
    id: number;
    name: string;
    price: string;
    image: string | null;
    quantity: number;
};

export default function Checkout() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const cart = JSON.parse(
            localStorage.getItem('nova_cart') || '[]',
        );

        setItems(cart);
    }, []);

    const subtotal = useMemo(
        () =>
            items.reduce(
                (total, item) =>
                    total + Number(item.price) * item.quantity,
                0,
            ),
        [items],
    );

    const shipping = subtotal >= 2000 ? 0 : 99;
    const total = subtotal + shipping;

    const placeOrder = async (event: FormEvent) => {
        event.preventDefault();

        if (!items.length) {
            setError('Your cart is empty.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    customer_name: name,
                    customer_email: email,
                    phone,
                    shipping_address: address,
                    items: items.map((item) => ({
                        product_id: item.id,
                        quantity: item.quantity,
                    })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                        'Unable to place your order. Please try again.',
                );
                return;
            }

            localStorage.removeItem('nova_cart');

            window.location.href = `/order-success?order=${data.order.id}`;
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Checkout — NOVA" />

            <div className="min-h-screen bg-[#f7f6f2] text-[#171717]">
                <header className="border-b border-black/10 bg-[#f7f6f2]">
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
                        <a
                            href="/"
                            className="text-2xl font-black tracking-[-0.06em]"
                        >
                            NOVA<span className="text-[#8b5e3c]">.</span>
                        </a>

                        <a
                            href="/cart"
                            className="text-sm text-black/50 hover:text-black"
                        >
                            ← Back to cart
                        </a>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
                    <div className="mb-10">
                        <p className="text-xs font-bold tracking-[0.25em] text-[#8b5e3c] uppercase">
                            Almost there
                        </p>

                        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                            Checkout
                        </h1>
                    </div>

                    {items.length === 0 ? (
                        <div className="rounded-3xl bg-white px-6 py-20 text-center">
                            <h2 className="text-2xl font-semibold">
                                Your cart is empty
                            </h2>

                            <a
                                href="/"
                                className="mt-6 inline-block rounded-full bg-[#171717] px-7 py-3.5 text-sm font-semibold text-white"
                            >
                                Continue Shopping
                            </a>
                        </div>
                    ) : (
                        <form
                            onSubmit={placeOrder}
                            className="grid gap-8 lg:grid-cols-[1fr_380px]"
                        >
                            <section className="rounded-3xl bg-white p-7">
                                <h2 className="text-xl font-semibold">
                                    Delivery details
                                </h2>

                                <div className="mt-7 space-y-5">
                                    <div>
                                        <label className="text-sm font-medium">
                                            Full name
                                        </label>

                                        <input
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            required
                                            className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3.5 text-sm outline-none focus:border-black"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="text-sm font-medium">
                                                Email
                                            </label>

                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                required
                                                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3.5 text-sm outline-none focus:border-black"
                                                placeholder="you@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium">
                                                Phone
                                            </label>

                                            <input
                                                value={phone}
                                                onChange={(e) =>
                                                    setPhone(e.target.value)
                                                }
                                                required
                                                className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3.5 text-sm outline-none focus:border-black"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">
                                            Shipping address
                                        </label>

                                        <textarea
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(e.target.value)
                                            }
                                            required
                                            rows={5}
                                            className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3.5 text-sm outline-none focus:border-black"
                                            placeholder="House / flat, street, city, state, PIN"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-7 w-full rounded-full bg-[#171717] py-4 text-sm font-semibold text-white disabled:opacity-50"
                                >
                                    {loading
                                        ? 'Placing order...'
                                        : 'Place Order'}
                                </button>
                            </section>

                            <aside className="h-fit rounded-3xl bg-[#171717] p-7 text-white">
                                <h2 className="text-xl font-semibold">
                                    Your order
                                </h2>

                                <div className="mt-6 space-y-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-3"
                                        >
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/10">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {item.name}
                                                </p>

                                                <p className="mt-1 text-xs text-white/40">
                                                    Qty {item.quantity}
                                                </p>
                                            </div>

                                            <p className="text-sm">
                                                ₹
                                                {(
                                                    Number(item.price) *
                                                    item.quantity
                                                ).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-7 space-y-4 border-t border-white/10 pt-6 text-sm">
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
                                            {shipping === 0
                                                ? 'FREE'
                                                : `₹${shipping}`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-semibold">
                                        <span>Total</span>
                                        <span>
                                            ₹{total.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </aside>
                        </form>
                    )}
                </main>
            </div>
        </>
    );
}