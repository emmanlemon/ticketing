<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
         $this->call([
            DepartmentSeeder::class,
            SectionSeeder::class,
            CategorySeeder::class,
            DefaultAccountSeeder::class,
            RolePermissionSeeder::class,
            TicketHdrSeeder::class,
        ]);
    }
}
