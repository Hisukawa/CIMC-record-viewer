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
        Schema::create('patient_address', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_info_id');
            $table->string('street', 100);
            $table->string('barangay', 100);
            $table->string('municipality', 100);
            $table->string('province', 100);
            

            $table->foreign('patient_info_id')->references('id')->on('patients_info')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_address');
    }
};
