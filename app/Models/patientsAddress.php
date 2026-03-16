<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class patientsAddress extends Model
{   
    protected $table = 'patient_address';

    protected $fillable = [
        'street', 'patient_info_id', 'barangay', 'municipality', 'province'
    ];
}
