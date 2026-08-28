<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterController;

Route::inertia('/', 'welcome')
    ->name('home');

Route::inertia('/cart', 'cart')
    ->name('cart');

Route::inertia('/login', 'login')
    ->name('login');
    
Route::inertia('/register', 'auth/register')
    ->name('register');

Route::post('/register', [RegisterController::class, 'register'])
    ->name('register.submit');

Route::inertia('/checkout', 'checkout')
    ->name('checkout');

Route::inertia('/order-success', 'order-success')
    ->name('order.success');

Route::inertia('/product', 'product')
    ->name('product');

Route::middleware('admin')->group(function () {
    Route::inertia('/admin/products', 'admin/products')
        ->name('admin.products');

    Route::inertia('/admin/orders', 'admin/orders')
        ->name('admin.orders');
});

Route::post('/login', [AuthController::class, 'login'])
    ->name('login.submit');

Route::post('/logout', [AuthController::class, 'logout'])
    ->name('logout');