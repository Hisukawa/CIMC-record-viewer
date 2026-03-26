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
        Schema::table('patients_records', function (Blueprint $table) {
            // Drop the foreign key first
            $table->dropForeign(['patients_id']);

            // Then drop the column
            $table->dropColumn('patients_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients_records', function (Blueprint $table) {
            // Add the column back
            $table->unsignedBigInteger('patients_id');

            // Add the foreign key back
            $table->foreign('patients_id')->references('id')->on('patients')->onDelete('cascade');
        });
    }
};
