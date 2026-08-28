import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/register');
    };

    return (
        <>
            <Head title="Create Account — NOVA" />

            <div className="min-h-screen bg-[#f7f6f2] text-[#171717]">
                <header className="border-b border-black/10">
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
                        <Link
                            href="/"
                            className="text-2xl font-black tracking-[-0.06em]"
                        >
                            NOVA
                            <span className="text-[#8b5e3c]">.</span>
                        </Link>

                        <Link
                            href="/login"
                            className="text-sm text-black/50 transition hover:text-black"
                        >
                            Sign in →
                        </Link>
                    </div>
                </header>

                <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
                    <div className="w-full max-w-md">

                        <div className="mb-8 text-center">
                            <p className="text-xs font-bold tracking-[0.25em] text-[#8b5e3c] uppercase">
                                Join NOVA
                            </p>

                            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                                Create your account
                            </h1>

                            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-black/50">
                                Create an account to manage your
                                orders and enjoy a faster checkout.
                            </p>
                        </div>

                        <form
                            onSubmit={submit}
                            className="rounded-[1.5rem] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:rounded-[2rem] sm:p-7"
                        >

                            {errors.name && (
                                <p className="mb-4 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}

                            <div>
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium"
                                >
                                    Full name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Your name"
                                    autoComplete="name"
                                    required
                                    className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3.5 text-sm outline-none transition focus:border-black"
                                />
                            </div>

                            <div className="mt-5">
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

                                {errors.email && (
                                    <p className="mt-2 text-xs text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

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
                                    placeholder="Minimum 6 characters"
                                    autoComplete="new-password"
                                    required
                                    className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3.5 text-sm outline-none transition focus:border-black"
                                />

                                {errors.password && (
                                    <p className="mt-2 text-xs text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="mt-5">
                                <label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-medium"
                                >
                                    Confirm password
                                </label>

                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={
                                        data.password_confirmation
                                    }
                                    onChange={(event) =>
                                        setData(
                                            'password_confirmation',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Repeat your password"
                                    autoComplete="new-password"
                                    required
                                    className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f6f2] px-4 py-3.5 text-sm outline-none transition focus:border-black"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-7 w-full rounded-full bg-[#171717] py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Creating account...'
                                    : 'Create account'}
                            </button>

                            <p className="mt-6 text-center text-sm text-black/45">
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    className="font-semibold text-black underline underline-offset-4"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </form>

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