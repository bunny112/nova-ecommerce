<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@nova.test'],
            [
                'name' => 'NOVA Admin',
                'password' => Hash::make('password'),
                'is_admin' => true,
            ]
        );

        $this->call(ProductSeeder::class);
    }
}