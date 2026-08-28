<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        $orders = Order::with('items')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'shipping_address' => ['required', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $order = DB::transaction(function () use ($validated) {
            $subtotal = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::where('id', $item['product_id'])
                    ->where('is_active', true)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($product->stock < $item['quantity']) {
                    abort(
                        422,
                        "{$product->name} does not have enough stock."
                    );
                }

                $lineTotal = (float) $product->price * $item['quantity'];

                $subtotal += $lineTotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $item['quantity'],
                    'total' => $lineTotal,
                ];

                $product->decrement('stock', $item['quantity']);
            }

            $shipping = $subtotal >= 2000 ? 0 : 99;

            $order = Order::create([
                'order_number' => 'NOVA-' . strtoupper(Str::random(8)),
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'phone' => $validated['phone'],
                'shipping_address' => $validated['shipping_address'],
                'subtotal' => $subtotal,
                'shipping_amount' => $shipping,
                'total_amount' => $subtotal + $shipping,
                'status' => 'pending',
            ]);

            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            return $order->load('items');
        });

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully.',
            'order' => $order,
        ], 201);
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json([
            'success' => true,
            'order' => $order->load('items'),
        ]);
    }

    public function update(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,accepted,denied'],
        ]);

        $order->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully.',
            'order' => $order->fresh('items'),
        ]);
    }
}