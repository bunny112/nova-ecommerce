import { Head } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';

type Product = {
    id: number;
    name: string;
    description: string | null;
    price: string;
    compare_price: string | null;
    image: string | null;
    category: string | null;
    stock: number;
    is_active: boolean;
};

const emptyForm = {
    name: '',
    description: '',
    price: '',
    compare_price: '',
    image: '',
    category: '',
    stock: '',
};

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const loadProducts = async () => {
        const response = await fetch('/api/products');
        const data = await response.json();

        setProducts(data.products ?? []);
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        setLoading(true);
        setMessage('');

        const url = editingId
            ? `/api/products/${editingId}`
            : '/api/products';

        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    price: Number(form.price),
                    compare_price: form.compare_price
                        ? Number(form.compare_price)
                        : null,
                    image: form.image || null,
                    category: form.category,
                    stock: Number(form.stock),
                    is_active: true,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || 'Unable to save product.',
                );
                return;
            }

            setMessage(
                editingId
                    ? 'Product updated successfully.'
                    : 'Product added successfully.',
            );

            setForm(emptyForm);
            setEditingId(null);

            await loadProducts();
        } catch {
            setMessage('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const editProduct = (product: Product) => {
        setEditingId(product.id);

        setForm({
            name: product.name,
            description: product.description || '',
            price: product.price,
            compare_price: product.compare_price || '',
            image: product.image || '',
            category: product.category || '',
            stock: String(product.stock),
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const deleteProduct = async (id: number) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this product?',
        );

        if (!confirmed) return;

        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
            },
        });

        if (response.ok) {
            setMessage('Product deleted successfully.');
            await loadProducts();
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
    };

    return (
        <>
            <Head title="Admin — Products" />

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
                            className="block rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium"
                        >
                            Products
                        </a>

                        <a
                            href="/admin/orders"
                            className="mt-2 block rounded-2xl px-4 py-3 text-sm text-white/50 hover:bg-white/5 hover:text-white"
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
                                    Catalog
                                </p>

                                <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em]">
                                    Products
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
                        <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
                            <section className="h-fit rounded-3xl bg-white p-7">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">
                                        {editingId
                                            ? 'Edit Product'
                                            : 'Add Product'}
                                    </h2>

                                    {editingId && (
                                        <button
                                            onClick={cancelEdit}
                                            className="text-xs text-black/40"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>

                                {message && (
                                    <div className="mt-5 rounded-2xl bg-[#f1eee8] px-4 py-3 text-sm">
                                        {message}
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-6 space-y-4"
                                >
                                    <input
                                        required
                                        placeholder="Product name"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3 text-sm outline-none"
                                    />

                                    <textarea
                                        placeholder="Description"
                                        rows={3}
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full resize-none rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3 text-sm outline-none"
                                    />

                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            placeholder="Price"
                                            value={form.price}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    price: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3 text-sm outline-none"
                                        />

                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Compare price"
                                            value={form.compare_price}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    compare_price:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3 text-sm outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            placeholder="Category"
                                            value={form.category}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    category: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3 text-sm outline-none"
                                        />

                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            placeholder="Stock"
                                            value={form.stock}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    stock: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3 text-sm outline-none"
                                        />
                                    </div>

                                    <input
                                        placeholder="Image URL"
                                        value={form.image}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                image: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3 text-sm outline-none"
                                    />

                                    <button
                                        disabled={loading}
                                        className="w-full rounded-full bg-[#171717] py-3.5 text-sm font-semibold text-white disabled:opacity-50"
                                    >
                                        {loading
                                            ? 'Saving...'
                                            : editingId
                                              ? 'Update Product'
                                              : 'Add Product'}
                                    </button>
                                </form>
                            </section>

                            <section>
                                <div className="mb-5 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">
                                        Product Inventory
                                    </h2>

                                    <span className="text-sm text-black/40">
                                        {products.length} products
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center gap-4 rounded-3xl bg-white p-4"
                                        >
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#eee]">
                                                {product.image && (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] font-bold tracking-[0.15em] text-black/30 uppercase">
                                                    {product.category}
                                                </p>

                                                <h3 className="mt-1 truncate font-semibold">
                                                    {product.name}
                                                </h3>

                                                <p className="mt-1 text-sm text-black/50">
                                                    ₹
                                                    {Number(
                                                        product.price,
                                                    ).toLocaleString(
                                                        'en-IN',
                                                    )}{' '}
                                                    · Stock {product.stock}
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        editProduct(product)
                                                    }
                                                    className="rounded-full border border-black/10 px-4 py-2 text-xs font-medium"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteProduct(
                                                            product.id,
                                                        )
                                                    }
                                                    className="rounded-full bg-red-50 px-4 py-2 text-xs font-medium text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}