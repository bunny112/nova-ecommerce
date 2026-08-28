import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Product = {
    id: number;
    name: string;
    description: string;
    price: string;
    compare_price: string | null;
    image: string | null;
    category: string | null;
    stock: number;
};

export default function Product() {
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (!id) {
            setLoading(false);
            return;
        }

        fetch(`/api/products/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setProduct(data.product);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const addToCart = () => {
        if (!product) return;

        const cart = JSON.parse(
            localStorage.getItem('nova_cart') || '[]',
        );

        const existing = cart.find(
            (item: Product & { quantity: number }) =>
                item.id === product.id,
        );

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                ...product,
                quantity,
            });
        }

        localStorage.setItem(
            'nova_cart',
            JSON.stringify(cart),
        );

        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 2000);
    };

    const buyNow = () => {
        if (!product) return;

        const cart = [
            {
                ...product,
                quantity,
            },
        ];

        localStorage.setItem(
            'nova_cart',
            JSON.stringify(cart),
        );

        window.location.href = '/checkout';
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f6f2]">
                <p className="text-sm text-black/40">
                    Loading product...
                </p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f6f2] px-6">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold">
                        Product not found
                    </h1>

                    <a
                        href="/"
                        className="mt-6 inline-block rounded-full bg-[#171717] px-7 py-3 text-sm font-semibold text-white"
                    >
                        Back to Store
                    </a>
                </div>
            </div>
        );
    }

    const discount =
        product.compare_price
            ? Math.round(
                  ((Number(product.compare_price) -
                      Number(product.price)) /
                      Number(product.compare_price)) *
                      100,
              )
            : null;

    return (
        <>
            <Head title={`${product.name} — NOVA`} />

            <div className="min-h-screen bg-[#f7f6f2] text-[#171717]">

                {/* Header */}
                <header className="border-b border-black/10 bg-[#f7f6f2]">
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
                        <a
                            href="/"
                            className="text-2xl font-black tracking-[-0.06em]"
                        >
                            NOVA
                            <span className="text-[#8b5e3c]">
                                .
                            </span>
                        </a>

                        <div className="flex items-center gap-5">
                            <a
                                href="/login"
                                className="text-sm hover:opacity-50"
                            >
                                Account
                            </a>

                            <a
                                href="/cart"
                                className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold"
                            >
                                Cart
                            </a>
                        </div>
                    </div>
                </header>

                {/* Product */}
                <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">

                    <a
                        href="/"
                        className="text-sm text-black/40 hover:text-black"
                    >
                        ← Back to collection
                    </a>

                    <div className="mt-8 grid gap-12 lg:grid-cols-2">

                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[#e8e5de]">
                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            )}

                            {discount && (
                                <span className="absolute left-6 top-6 rounded-full bg-white px-4 py-2 text-xs font-bold">
                                    SAVE {discount}%
                                </span>
                            )}
                        </div>

                        {/* Information */}
                        <div className="flex flex-col justify-center">

                            <p className="text-xs font-bold tracking-[0.25em] text-[#8b5e3c] uppercase">
                                {product.category}
                            </p>

                            <h1 className="mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl">
                                {product.name}
                            </h1>

                            <div className="mt-7 flex items-center gap-4">
                                <span className="text-2xl font-semibold">
                                    ₹
                                    {Number(
                                        product.price,
                                    ).toLocaleString('en-IN')}
                                </span>

                                {product.compare_price && (
                                    <span className="text-base text-black/30 line-through">
                                        ₹
                                        {Number(
                                            product.compare_price,
                                        ).toLocaleString('en-IN')}
                                    </span>
                                )}
                            </div>

                            <p className="mt-7 max-w-lg text-base leading-7 text-black/55">
                                {product.description}
                            </p>

                            {/* Stock */}
                            <div className="mt-7">
                                {product.stock > 0 ? (
                                    <p className="text-sm font-medium text-green-700">
                                        ● In stock — {product.stock}{' '}
                                        available
                                    </p>
                                ) : (
                                    <p className="text-sm font-medium text-red-600">
                                        Out of stock
                                    </p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div className="mt-8">
                                <p className="mb-3 text-xs font-bold tracking-[0.15em] text-black/40 uppercase">
                                    Quantity
                                </p>

                                <div className="flex w-fit items-center rounded-full border border-black/15 bg-white">
                                    <button
                                        onClick={() =>
                                            setQuantity(
                                                Math.max(
                                                    1,
                                                    quantity - 1,
                                                ),
                                            )
                                        }
                                        className="px-5 py-3 text-lg"
                                    >
                                        −
                                    </button>

                                    <span className="min-w-10 text-center text-sm font-medium">
                                        {quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            setQuantity(
                                                Math.min(
                                                    product.stock,
                                                    quantity + 1,
                                                ),
                                            )
                                        }
                                        disabled={
                                            quantity >=
                                            product.stock
                                        }
                                        className="px-5 py-3 text-lg disabled:opacity-30"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 grid gap-3 sm:grid-cols-2">

                                <button
                                    onClick={addToCart}
                                    disabled={product.stock === 0}
                                    className="rounded-full border border-black/20 bg-white py-4 text-sm font-semibold transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {added
                                        ? '✓ Added to Cart'
                                        : 'Add to Cart'}
                                </button>

                                <button
                                    onClick={buyNow}
                                    disabled={product.stock === 0}
                                    className="rounded-full bg-[#171717] py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Buy Now →
                                </button>
                            </div>

                            {/* Benefits */}
                            <div className="mt-10 grid grid-cols-3 border-t border-black/10 pt-7">
                                <div>
                                    <p className="text-sm font-semibold">
                                        Free delivery
                                    </p>
                                    <p className="mt-1 text-xs text-black/40">
                                        Orders ₹2,000+
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">
                                        Secure checkout
                                    </p>
                                    <p className="mt-1 text-xs text-black/40">
                                        Safe & protected
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">
                                        Easy returns
                                    </p>
                                    <p className="mt-1 text-xs text-black/40">
                                        Hassle-free
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}