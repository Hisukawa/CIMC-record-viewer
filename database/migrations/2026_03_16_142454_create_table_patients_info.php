<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patients_info', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');
            $table->enum('sex', ['Male', 'Female'])->default('Male');
            $table->string('civil_status', 20);
            $table->string('nationality', 50);
            $table->date('birthdate');
            $table->string('place_of_birth');
            $table->string('phone_number', 20)->nullable();
            $table->string('religion')->nullable();
            $table->timestamps();

            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients_info');
    }
};
