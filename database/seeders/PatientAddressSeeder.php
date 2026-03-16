<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class PatientAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Get all patients_info IDs (foreign key)
        $patientsInfo = DB::table('patients_info')->pluck('id')->toArray();

        if (empty($patientsInfo)) {
            $this->command->info('No patient info found! Please seed patients_info first.');
            return;
        }

        foreach ($patientsInfo as $infoId) {

            DB::table('patient_address')->insert([
                'patient_info_id' => $infoId,
                'street' => $faker->streetAddress,
                'barangay' => $faker->randomElement([
                    'San Antonio',
                    'San Jose',
                    'San Roque',
                    'Santa Cruz',
                    'Poblacion'
                ]),
                'municipality' => $faker->randomElement([
                    'Cavite City',
                    'Noveleta',
                    'Rosario',
                    'Bacoor',
                    'Kawit'
                ]),
                'province' => 'Cavite',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Patient addresses seeded successfully!');
    }
}