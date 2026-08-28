import { Head, Link, usePage } from '@inertiajs/react';
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

type AuthUser = {
    id: number;
    name: string;
    email: string;
    is_admin: boolean | number;
};

type PageProps = {
    auth?: {
        user?: AuthUser | null;
    };
};

export default function Welcome() {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);

    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        fetch('/api/products')
            .then((response) => response.json())
            .then((data) => {
                setProducts(data.products ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));

        const cart = JSON.parse(
            localStorage.getItem('nova_cart') || '[]',
        );

        setCartCount(
            cart.reduce(
                (
                    total: number,
                    item: { quantity: number },
                ) => total + item.quantity,
                0,
            ),
        );
    }, []);

    const addToCart = (product: Product) => {
        const cart = JSON.parse(
            localStorage.getItem('nova_cart') || '[]',
        );

        const existing = cart.find(
            (item: Product & { quantity: number }) =>
                item.id === product.id,
        );

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1,
            });
        }

        localStorage.setItem(
            'nova_cart',
            JSON.stringify(cart),
        );

        setCartCount(
            cart.reduce(
                (
                    total: number,
                    item: { quantity: number },
                ) => total + item.quantity,
                0,
            ),
        );
    };

    const openProduct = (productId: number) => {
        window.location.href = `/product?id=${productId}`;
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const filteredProducts = products.filter((product) => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return true;
        }

        return (
            product.name.toLowerCase().includes(query) ||
            (product.category ?? '')
                .toLowerCase()
                .includes(query) ||
            product.description
                .toLowerCase()
                .includes(query)
        );
    });

    return (
        <>
            <Head title="NOVA — Modern Essentials" />

            <div className="min-h-screen bg-[#f7f6f2] text-[#171717]">

                {/* Announcement */}
                <div className="bg-[#171717] px-4 py-2.5 text-center text-[9px] font-medium tracking-[0.16em] text-white uppercase sm:text-[10px] sm:tracking-[0.2em]">
                    Free shipping on orders over ₹2,000
                </div>

                {/* Navbar */}
                <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f6f2]/95 backdrop-blur-xl">
                    <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10">

                        {/* Logo */}
                        <Link
                            href="/"
                            onClick={closeMobileMenu}
                            className="shrink-0 text-[22px] font-black tracking-[-0.06em] sm:text-2xl"
                        >
                            NOVA
                            <span className="text-[#8b5e3c]">.</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center gap-7 text-sm font-medium lg:flex xl:gap-10">
                            <a
                                href="#home"
                                className="transition hover:opacity-50"
                            >
                                Home
                            </a>

                            <a
                                href="#collection"
                                className="transition hover:opacity-50"
                            >
                                Collection
                            </a>

                            <a
                                href="#categories"
                                className="transition hover:opacity-50"
                            >
                                Categories
                            </a>

                            <a
                                href="#about"
                                className="transition hover:opacity-50"
                            >
                                About
                            </a>
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden items-center gap-4 lg:flex xl:gap-5">

                            <button
                                type="button"
                                onClick={() =>
                                    setSearchOpen(!searchOpen)
                                }
                                className="text-sm transition hover:opacity-50"
                            >
                                {searchOpen ? 'Close' : 'Search'}
                            </button>

                            <Link
                                href="/login"
                                className="text-sm transition hover:opacity-50"
                            >
                                Account
                            </Link>

                            {/* ADMIN ONLY */}
                            {Number(user?.is_admin) === 1 && (
                                <Link
                                    href="/admin/products"
                                    className="text-sm font-semibold text-[#8b5e3c] transition hover:opacity-50"
                                >
                                    Admin
                                </Link>
                            )}

                            <Link
                                href="/cart"
                                className="relative rounded-full border border-black/15 px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
                            >
                                Cart

                                {cartCount > 0 && (
                                    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8b5e3c] px-1 text-[10px] text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Mobile Actions */}
                        <div className="flex items-center gap-2 lg:hidden">

                            <Link
                                href="/cart"
                                className="relative flex h-10 items-center rounded-full border border-black/15 px-3 text-xs font-semibold sm:px-4 sm:text-sm"
                            >
                                Cart

                                {cartCount > 0 && (
                                    <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8b5e3c] px-1 text-[9px] text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <button
                                type="button"
                                aria-label={
                                    mobileMenuOpen
                                        ? 'Close menu'
                                        : 'Open menu'
                                }
                                aria-expanded={mobileMenuOpen}
                                onClick={() =>
                                    setMobileMenuOpen(
                                        !mobileMenuOpen,
                                    )
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 transition hover:bg-black hover:text-white"
                            >
                                {mobileMenuOpen ? (
                                    <span className="text-xl leading-none">
                                        ×
                                    </span>
                                ) : (
                                    <span className="flex flex-col gap-1">
                                        <span className="block h-[1.5px] w-4 bg-current" />
                                        <span className="block h-[1.5px] w-4 bg-current" />
                                        <span className="block h-[1.5px] w-4 bg-current" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="border-t border-black/10 bg-[#f7f6f2] lg:hidden">
                            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

                                <nav className="flex flex-col">

                                    <a
                                        href="#home"
                                        onClick={closeMobileMenu}
                                        className="border-b border-black/5 py-4 text-base font-medium"
                                    >
                                        Home
                                    </a>

                                    <a
                                        href="#collection"
                                        onClick={closeMobileMenu}
                                        className="border-b border-black/5 py-4 text-base font-medium"
                                    >
                                        Collection
                                    </a>

                                    <a
                                        href="#categories"
                                        onClick={closeMobileMenu}
                                        className="border-b border-black/5 py-4 text-base font-medium"
                                    >
                                        Categories
                                    </a>

                                    <a
                                        href="#about"
                                        onClick={closeMobileMenu}
                                        className="border-b border-black/5 py-4 text-base font-medium"
                                    >
                                        About
                                    </a>

                                    <Link
                                        href="/login"
                                        onClick={closeMobileMenu}
                                        className="border-b border-black/5 py-4 text-base font-medium"
                                    >
                                        Account
                                    </Link>

                                    {/* ADMIN ONLY */}
                                    {Number(user?.is_admin) === 1 && (
                                        <Link
                                            href="/admin/products"
                                            onClick={closeMobileMenu}
                                            className="border-b border-black/5 py-4 text-base font-semibold text-[#8b5e3c]"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                </nav>

                                {/* Mobile Search */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchOpen(!searchOpen);
                                        closeMobileMenu();
                                    }}
                                    className="mt-5 flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 text-sm font-semibold shadow-sm"
                                >
                                    <span>
                                        {searchOpen
                                            ? 'Close Search'
                                            : 'Search Products'}
                                    </span>

                                    <span className="text-lg">
                                        ⌕
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Search */}
                    {searchOpen && (
                        <div className="border-t border-black/10 px-4 py-4 sm:px-6 lg:px-10">
                            <div className="mx-auto max-w-7xl">

                                <div className="relative">
                                    <input
                                        autoFocus
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Search products, categories..."
                                        className="w-full rounded-full border border-black/10 bg-white px-5 py-3.5 pr-12 text-sm outline-none transition focus:border-black"
                                    />

                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSearchQuery('')
                                            }
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-black/40 hover:text-black"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>

                                {searchQuery && (
                                    <p className="mt-3 text-xs text-black/40">
                                        {filteredProducts.length}{' '}
                                        {filteredProducts.length === 1
                                            ? 'product'
                                            : 'products'}{' '}
                                        found
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                {/* Hero */}
                <section
                    id="home"
                    className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-16"
                >
                    <div className="grid overflow-hidden rounded-[1.5rem] bg-[#dedbd3] sm:rounded-[2rem] lg:min-h-[620px] lg:grid-cols-2">

                        <div className="flex flex-col justify-center px-6 py-12 sm:px-8 sm:py-16 lg:px-16">

                            <span className="mb-5 text-[10px] font-bold tracking-[0.25em] text-[#8b5e3c] uppercase sm:mb-6 sm:text-xs sm:tracking-[0.3em]">
                                Curated for modern living
                            </span>

                            <h1 className="max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                                Elevate
                                <br />
                                your everyday.
                            </h1>

                            <p className="mt-6 max-w-md text-sm leading-6 text-black/60 sm:mt-7 sm:text-base sm:leading-7">
                                Thoughtfully designed essentials
                                for people who appreciate simplicity,
                                quality and timeless style.
                            </p>

                            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
                                <a
                                    href="#collection"
                                    className="rounded-full bg-[#171717] px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:scale-[1.02]"
                                >
                                    Explore Collection
                                </a>

                                <a
                                    href="#categories"
                                    className="rounded-full border border-black/20 px-7 py-3.5 text-center text-sm font-semibold transition hover:bg-white"
                                >
                                    Browse Categories
                                </a>
                            </div>

                            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-black/10 pt-6 sm:mt-12 sm:flex sm:gap-10 sm:pt-7">

                                <div>
                                    <p className="text-lg font-semibold sm:text-xl">
                                        6+
                                    </p>

                                    <p className="mt-1 text-[10px] leading-4 text-black/50 sm:text-xs">
                                        Curated products
                                    </p>
                                </div>

                                <div>
                                    <p className="text-lg font-semibold sm:text-xl">
                                        24/7
                                    </p>

                                    <p className="mt-1 text-[10px] leading-4 text-black/50 sm:text-xs">
                                        Online shopping
                                    </p>
                                </div>

                                <div>
                                    <p className="text-lg font-semibold sm:text-xl">
                                        100%
                                    </p>

                                    <p className="mt-1 text-[10px] leading-4 text-black/50 sm:text-xs">
                                        Secure checkout
                                    </p>
                                </div>

                            </div>
                        </div>

                        <div className="relative min-h-[320px] overflow-hidden sm:min-h-[400px] lg:min-h-0">
                            <img
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400"
                                alt="NOVA collection"
                                className="absolute inset-0 h-full w-full object-cover"
                            />

                            <div className="absolute inset-0 bg-black/10" />

                            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 px-5 py-4 backdrop-blur sm:bottom-7 sm:left-7 sm:right-auto">
                                <p className="text-[10px] font-bold tracking-[0.2em] text-black/50 uppercase">
                                    NOVA EDIT
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    Designed to be noticed.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section
                    id="categories"
                    className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10"
                >
                    <div className="mb-8 sm:mb-10">
                        <p className="text-xs font-bold tracking-[0.25em] text-[#8b5e3c] uppercase">
                            Explore
                        </p>

                        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                            Shop by category
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            'Audio',
                            'Wearables',
                            'Tech',
                            'Home',
                        ].map((category, index) => (
                            <button
                                type="button"
                                key={category}
                                onClick={() => {
                                    setSearchQuery(category);
                                    setSearchOpen(true);

                                    setTimeout(() => {
                                        document
                                            .getElementById(
                                                'collection',
                                            )
                                            ?.scrollIntoView({
                                                behavior: 'smooth',
                                            });
                                    }, 100);
                                }}
                                className="group relative h-60 overflow-hidden rounded-3xl bg-[#e5e2da] text-left sm:h-64"
                            >
                                <img
                                    src={[
                                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700',
                                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700',
                                        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700',
                                        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700',
                                    ][index]}
                                    alt={category}
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-black/20" />

                                <div className="absolute bottom-5 left-5 text-white">
                                    <p className="text-xl font-semibold">
                                        {category}
                                    </p>

                                    <p className="mt-1 text-xs text-white/70">
                                        Discover collection →
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Products */}
                <section
                    id="collection"
                    className="bg-[#171717] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-10"
                >
                    <div className="mx-auto max-w-7xl">

                        <div className="mb-9 flex items-end justify-between gap-4 sm:mb-12">
                            <div>
                                <p className="text-[10px] font-bold tracking-[0.25em] text-[#c29b7a] uppercase sm:text-xs">
                                    The collection
                                </p>

                                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                                    {searchQuery
                                        ? `Results for "${searchQuery}"`
                                        : 'Featured essentials'}
                                </h2>
                            </div>

                            <span className="shrink-0 text-xs text-white/40 sm:text-sm">
                                {filteredProducts.length} products
                            </span>
                        </div>

                        {loading ? (
                            <div className="py-20 text-center text-white/50">
                                Loading collection...
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="rounded-3xl border border-white/10 px-5 py-20 text-center">
                                <p className="text-4xl">⌕</p>

                                <h3 className="mt-4 text-xl font-semibold">
                                    No products found
                                </h3>

                                <p className="mt-2 text-sm text-white/40">
                                    Try another product or category.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearchQuery('')
                                    }
                                    className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
                                >
                                    Show all products
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                                {filteredProducts.map(
                                    (product) => {
                                        const discount =
                                            product.compare_price &&
                                            Math.round(
                                                ((Number(
                                                    product.compare_price,
                                                ) -
                                                    Number(
                                                        product.price,
                                                    )) /
                                                    Number(
                                                        product.compare_price,
                                                    )) *
                                                    100,
                                            );

                                        return (
                                            <article
                                                key={product.id}
                                                className="group cursor-pointer"
                                                onClick={() =>
                                                    openProduct(
                                                        product.id,
                                                    )
                                                }
                                            >
                                                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#252525]">

                                                    {product.image && (
                                                        <img
                                                            src={
                                                                product.image
                                                            }
                                                            alt={
                                                                product.name
                                                            }
                                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                                        />
                                                    )}

                                                    {discount && (
                                                        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-black sm:left-4 sm:top-4">
                                                            -{discount}%
                                                        </span>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            addToCart(product);
                                                        }}
                                                        className="absolute bottom-4 left-4 right-4 translate-y-0 rounded-full bg-white py-3.5 text-sm font-semibold text-black opacity-100 transition-all duration-300 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
                                                    >
                                                        Add to cart
                                                    </button>
                                                </div>

                                                <div className="flex items-start justify-between gap-3 pt-4 sm:pt-5">
                                                    <div className="min-w-0">
                                                        <p className="mb-1 text-[9px] font-bold tracking-[0.2em] text-white/40 uppercase sm:text-[10px]">
                                                            {product.category}
                                                        </p>

                                                        <h3 className="truncate text-base font-medium sm:text-lg">
                                                            {product.name}
                                                        </h3>

                                                        <p className="mt-1 text-[11px] text-white/30 sm:text-xs">
                                                            View product →
                                                        </p>
                                                    </div>

                                                    <div className="shrink-0 text-right">
                                                        <p className="text-sm font-semibold sm:text-base">
                                                            ₹
                                                            {Number(
                                                                product.price,
                                                            ).toLocaleString(
                                                                'en-IN',
                                                            )}
                                                        </p>

                                                        {product.compare_price && (
                                                            <p className="text-[10px] text-white/30 line-through sm:text-xs">
                                                                ₹
                                                                {Number(
                                                                    product.compare_price,
                                                                ).toLocaleString(
                                                                    'en-IN',
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    },
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* About */}
                <section
                    id="about"
                    className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-10"
                >
                    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">

                        <div>
                            <p className="text-xs font-bold tracking-[0.25em] text-[#8b5e3c] uppercase">
                                Our philosophy
                            </p>

                            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">
                                Less noise.
                                <br />
                                More meaning.
                            </h2>

                            <p className="mt-6 max-w-lg text-sm leading-7 text-black/55 sm:text-base">
                                NOVA brings together practical
                                products with thoughtful design.
                                Every piece is selected to make
                                everyday moments feel a little
                                better.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-[#e5e2da] p-7 sm:p-12">
                            <div className="grid grid-cols-2 gap-7 sm:gap-8">

                                <div>
                                    <p className="text-3xl font-semibold sm:text-4xl">
                                        01
                                    </p>
                                    <p className="mt-3 text-sm font-medium">
                                        Quality first
                                    </p>
                                    <p className="mt-2 text-xs leading-5 text-black/50 sm:text-sm sm:leading-6">
                                        Products chosen for everyday
                                        use.
                                    </p>
                                </div>

                                <div>
                                    <p className="text-3xl font-semibold sm:text-4xl">
                                        02
                                    </p>
                                    <p className="mt-3 text-sm font-medium">
                                        Simple design
                                    </p>
                                    <p className="mt-2 text-xs leading-5 text-black/50 sm:text-sm sm:leading-6">
                                        Clean aesthetics without
                                        excess.
                                    </p>
                                </div>

                                <div>
                                    <p className="text-3xl font-semibold sm:text-4xl">
                                        03
                                    </p>
                                    <p className="mt-3 text-sm font-medium">
                                        Fair value
                                    </p>
                                    <p className="mt-2 text-xs leading-5 text-black/50 sm:text-sm sm:leading-6">
                                        Premium feel at accessible
                                        prices.
                                    </p>
                                </div>

                                <div>
                                    <p className="text-3xl font-semibold sm:text-4xl">
                                        04
                                    </p>
                                    <p className="mt-3 text-sm font-medium">
                                        Made for you
                                    </p>
                                    <p className="mt-2 text-xs leading-5 text-black/50 sm:text-sm sm:leading-6">
                                        Essentials that fit your
                                        lifestyle.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* Newsletter */}
                <section className="mx-4 mb-8 overflow-hidden rounded-[1.5rem] bg-[#cfc8bc] px-5 py-12 text-center sm:mx-6 sm:mb-10 sm:rounded-[2rem] sm:px-6 sm:py-16 lg:px-10">

                    <p className="text-xs font-bold tracking-[0.25em] text-black/50 uppercase">
                        Stay in the loop
                    </p>

                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                        Get the good stuff first.
                    </h2>

                    <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/55">
                        New collections, thoughtful finds and
                        occasional offers. No unnecessary noise.
                    </p>

                    <div className="mx-auto mt-7 flex max-w-md overflow-hidden rounded-full bg-white p-1">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="min-w-0 flex-1 bg-transparent px-4 text-xs outline-none sm:px-5 sm:text-sm"
                        />

                        <button
                            type="button"
                            className="shrink-0 rounded-full bg-[#171717] px-4 py-3 text-[11px] font-semibold text-white sm:px-5 sm:text-xs"
                        >
                            Subscribe
                        </button>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#171717] px-4 py-12 text-white sm:px-6 sm:py-14 lg:px-10">
                    <div className="mx-auto max-w-7xl">

                        <div className="flex flex-col justify-between gap-10 md:flex-row">

                            <div>
                                <div className="text-2xl font-black tracking-[-0.06em]">
                                    NOVA
                                    <span className="text-[#c29b7a]">
                                        .
                                    </span>
                                </div>

                                <p className="mt-4 max-w-xs text-sm leading-6 text-white/40">
                                    Modern essentials for a more
                                    considered everyday.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-12 text-sm sm:gap-16">

                                <div>
                                    <p className="mb-4 font-semibold">
                                        Shop
                                    </p>

                                    <div className="space-y-3 text-white/40">
                                        <a
                                            href="#collection"
                                            className="block hover:text-white"
                                        >
                                            Collection
                                        </a>

                                        <a
                                            href="#categories"
                                            className="block hover:text-white"
                                        >
                                            Categories
                                        </a>

                                        <a
                                            href="#collection"
                                            className="block hover:text-white"
                                        >
                                            New arrivals
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-4 font-semibold">
                                        Support
                                    </p>

                                    <div className="space-y-3 text-white/40">
                                        <p>Contact</p>
                                        <p>Shipping</p>
                                        <p>Returns</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/30 sm:mt-12">
                            © 2026 NOVA. All rights reserved.
                        </div>

                    </div>
                </footer>
            </div>
        </>
    );
}