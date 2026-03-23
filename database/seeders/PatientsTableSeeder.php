<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class PatientsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Get all user IDs to satisfy the foreign key
        $users = DB::table('users')->pluck('id')->toArray();

        if (empty($users)) {
            $this->command->info('No users found! Please seed users first.');
            return;
        }
        
        $value = 200; // Number of patients to seed
        for ($i = 1; $i <= $value; $i++) {
            // Generate 8 random digits after 7 zeros to make 15-digit HRN
            $randomDigits = str_pad($faker->unique()->numberBetween(0, 99999999), 8, '0', STR_PAD_LEFT);
            $hrn = '0000000' . $randomDigits; // 7 zeros + 8 digits = 15 digits
            
            DB::table('patients')->insert([
                'hrn' => $hrn,
                'firstname' => $faker->firstName,
                'middlename' => $faker->optional()->firstName,
                'lastname' => $faker->lastName,
                'created_by' => $faker->randomElement($users),
                'created_at' => $faker->dateTimeBetween('2026-05-01', '2026-05-31'),
                'updated_at' => $faker->dateTimeBetween('2026-05-01', '2026-05-31'),
            ]);
        }

        $this->command->info("{$value} patients seeded successfully!");
    }
}
