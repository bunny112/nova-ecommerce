import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/login');
    };

    return (
        <>
            <Head title="Login — NOVA" />

            <div className="min-h-screen bg-[#f7f6f2] text-[#171717]">
                {/* Header */}
                <header className="border-b border-black/10 bg-[#f7f6f2]">
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
                        <Link
                            href="/"
                            className="text-2xl font-black tracking-[-0.06em]"
                        >
                            NOVA
                            <span className="text-[#8b5e3c]">.</span>
                        </Link>

                        <div className="flex items-center gap-4 sm:gap-6">
                            <Link
                                href="/register"
                                className="text-sm font-medium text-black/60 transition hover:text-black"
                            >
                                <span className="hidden sm:inline">
                                    Create account
                                </span>
                                <span className="sm:hidden">
                                    Register
                                </span>
                            </Link>

                            <Link
                                href="/cart"
                                className="text-sm text-black/50 transition hover:text-black"
                            >
                                Cart →
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
                    <div className="w-full max-w-md">
                        {/* Heading */}
                        <div className="mb-7 text-center sm:mb-8">
                            <p className="text-xs font-bold tracking-[0.25em] text-[#8b5e3c] uppercase">
                                Welcome back
                            </p>

                            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                                Sign in to NOVA
                            </h1>

                            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-black/50">
                                Access your account and manage your orders.
                            </p>
                        </div>

                        {/* Login Form */}
                        <form
                            onSubmit={submit}
                            className="rounded-[1.5rem] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:rounded-[2rem] sm:p-7"
                        >
                            {/* Errors */}
                            {errors.email && (
                                <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {errors.email}
                                </div>
                            )}

                            {errors.password && (
                                <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {errors.password}
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(event) =>
                                        setData(
                                            'email',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3.5 text-sm outline-none transition focus:border-black"
                                />
                            </div>

                            {/* Password */}
                            <div className="mt-5">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(event) =>
                                        setData(
                                            'password',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3.5 text-sm outline-none transition focus:border-black"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-7 w-full rounded-full bg-[#171717] py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Signing in...'
                                    : 'Sign in'}
                            </button>

                            {/* Register Link */}
                            <div className="mt-6 border-t border-black/5 pt-6 text-center">
                                <p className="text-sm text-black/45">
                                    Don't have an account?
                                </p>

                                <Link
                                    href="/register"
                                    className="mt-2 inline-block text-sm font-semibold text-[#8b5e3c] underline underline-offset-4 transition hover:text-black"
                                >
                                    Create account
                                </Link>
                            </div>

                            {/* Admin Demo */}
                            <div className="mt-6 rounded-2xl bg-[#f7f6f2] px-4 py-4 text-center">
                                <p className="text-xs font-medium text-black/40">
                                    Admin demo account
                                </p>

                                <p className="mt-1 break-all text-xs text-black/60">
                                    admin@nova.test / password
                                </p>
                            </div>
                        </form>

                        {/* Back */}
                        <Link
                            href="/"
                            className="mt-6 block text-center text-sm text-black/40 transition hover:text-black"
                        >
                            ← Back to store
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}