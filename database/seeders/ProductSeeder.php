<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Aero Wireless Headphones',
                'description' => 'Premium wireless headphones with immersive sound and all-day comfort.',
                'price' => 4999,
                'compare_price' => 6999,
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
                'category' => 'Audio',
                'stock' => 25,
            ],
            [
                'name' => 'Luna Smart Watch',
                'description' => 'Elegant smartwatch with fitness tracking, notifications and modern design.',
                'price' => 3499,
                'compare_price' => 4999,
                'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
                'category' => 'Wearables',
                'stock' => 18,
            ],
            [
                'name' => 'Orbit Backpack',
                'description' => 'Minimal everyday backpack designed for work, travel and urban adventures.',
                'price' => 1899,
                'compare_price' => 2499,
                'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
                'category' => 'Bags',
                'stock' => 32,
            ],
            [
                'name' => 'Nova Sneakers',
                'description' => 'Lightweight everyday sneakers combining comfort with a clean contemporary look.',
                'price' => 2799,
                'compare_price' => 3999,
                'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
                'category' => 'Footwear',
                'stock' => 20,
            ],
            [
                'name' => 'Pixel Mechanical Keyboard',
                'description' => 'Compact mechanical keyboard with tactile switches and a premium aluminum finish.',
                'price' => 4299,
                'compare_price' => 5499,
                'image' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
                'category' => 'Tech',
                'stock' => 15,
            ],
            [
                'name' => 'Aura Desk Lamp',
                'description' => 'Modern ambient desk lamp designed to elevate your workspace.',
                'price' => 1599,
                'compare_price' => 2199,
                'image' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
                'category' => 'Home',
                'stock' => 28,
            ],
        ];

        foreach ($products as $product) {
            Product::create([
                ...$product,
                'slug' => Str::slug($product['name']) . '-' . Str::lower(Str::random(6)),
                'is_active' => true,
            ]);
        }
    }
}