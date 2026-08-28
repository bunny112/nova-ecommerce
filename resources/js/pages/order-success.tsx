import { Head } from '@inertiajs/react';

export default function OrderSuccess() {
    return (
        <>
            <Head title="Order Confirmed — NOVA" />

            <div className="flex min-h-screen items-center justify-center bg-[#f7f6f2] px-6 text-[#171717]">
                <div className="w-full max-w-lg text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#171717] text-3xl text-white">
                        ✓
                    </div>

                    <p className="mt-8 text-xs font-bold tracking-[0.25em] text-[#8b5e3c] uppercase">
                        Order confirmed
                    </p>

                    <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">
                        Thank you.
                    </h1>

                    <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-black/50">
                        Your order has been received successfully. We'll
                        process it shortly and keep you updated.
                    </p>

                    <div className="mt-9 flex justify-center gap-3">
                        <a
                            href="/"
                            className="rounded-full bg-[#171717] px-7 py-3.5 text-sm font-semibold text-white"
                        >
                            Continue Shopping
                        </a>

                        <a
                            href="/cart"
                            className="rounded-full border border-black/15 px-7 py-3.5 text-sm font-semibold"
                        >
                            View Cart
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}