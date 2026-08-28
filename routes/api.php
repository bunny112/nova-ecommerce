<?php

use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::apiResource('products', ProductController::class);

Route::apiResource('orders', OrderController::class)
    ->only(['index', 'store', 'show', 'update']);