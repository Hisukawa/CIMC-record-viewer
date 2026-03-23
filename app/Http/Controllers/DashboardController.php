<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\patients;
use App\Models\patientsRecord;
use App\Models\patientsInfo;
use App\Models\PatientsRecordsFileModel;
use App\Models\RecordsPageModel;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Fetch monthly patient registrations for the current year
        $monthlyUploads = patients::select(
            DB::raw('count(*) as count'),
            DB::raw("FORMAT(created_at, 'MMM') as month"),
            DB::raw('MONTH(created_at) as month_num')
        )
            ->whereYear('created_at', date('Y'))
            ->groupBy(
                DB::raw("FORMAT(created_at, 'MMM')"),
                DB::raw('MONTH(created_at)')
            )
            ->orderBy('month_num')
            ->get()
            ->map(fn($item) => [
                'month' => $item->month,
                'patients' => $item->count
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'totalPatients' => patients::count() ?? 0,
                'totalRecords' => patientsRecord::count() ?? 0,
                'totalFiles' => PatientsRecordsFileModel::count() ?? 0,
                'totalPages' => (int) RecordsPageModel::sum('total_pages') ?? 0,
            ],
            'monthlyUploads' => $monthlyUploads, // Added this line
            'recentActivity' => patientsRecord::with(['patients', 'creator'])
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($record) => [
                    'patient_name' => $record->patients->firstname . ' ' . $record->patients->lastname,
                    'record_type' => $record->record_type,
                    'file_name' => $record->file_name,
                    'uploaded_by' => $record->creator->name ?? 'System',
                    'created_at' => $record->created_at->diffForHumans(),
                ]),
            'distribution' => [
                'bySex' => patientsInfo::select('sex as label', DB::raw('count(*) as value'))
                    ->groupBy('sex')->get(),
                'byStatus' => patientsInfo::select('civil_status as label', DB::raw('count(*) as value'))
                    ->groupBy('civil_status')->get(),
            ],
        ]);
    }
}
