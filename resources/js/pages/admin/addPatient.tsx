import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Patient } from '@/types/patient';

import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Add Patient',
        href: '/patients/create',
    },
];

// Skeleton loader for the table
const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-8 py-4"><div className="h-4 w-24 rounded bg-slate-200"></div></td>
        <td className="px-8 py-4"><div className="h-4 w-48 rounded bg-slate-200"></div></td>
        <td className="px-8 py-4 text-center"><div className="mx-auto h-5 w-12 rounded bg-slate-200"></div></td>
        <td className="px-8 py-4 text-right"><div className="ml-auto h-4 w-20 rounded bg-slate-200"></div></td>
    </tr>
);

type Props = {
    patients: Patient[];
    nationalities: string[]; // Received from Laravel Controller
};

export default function AddPatient({ patients = [], nationalities = [] }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const initialFormState = {
        firstname: '',
        lastname: '',
        middlename: '',
        sex: '',
        address: '',
        civil_status: '',
        nationality: 'Filipino', // Defaulting to Filipino for faster encoding
        birthdate: '',
        place_of_birth: '',
        phone_number: '',
        religion: '',
        hrn: '',
    };

    const [formData, setFormData] = useState(initialFormState);

    // Logic to check if any field is filled
    const isAnyInputFilled = Object.values(formData).some(val => val !== '' && val !== 'Filipino');

    // Validation for the "ADD" button
    const isAddDisabled =
        isLoading ||
        !formData.firstname ||
        !formData.lastname ||
        !formData.sex ||
        !formData.address ||
        !formData.nationality ||
        !formData.birthdate ||
        formData.hrn.length !== 15;

    const handleAddPatient = () => {
        if (isAddDisabled) return;
        setIsLoading(true);

        router.post('/patients', formData, {
            onSuccess: () => setFormData(initialFormState),
            onFinish: () => setIsLoading(false),
        });
    };

    const handleClear = () => setFormData(initialFormState);

    /*** PAGINATION LOGIC ***/
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(patients.length / itemsPerPage);
    const currentPatients = patients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getPagination = (current: number, total: number) => {
        const pages = [];
        if (total <= 7) for (let i = 1; i <= total; i++) pages.push(i);
        else {
            pages.push(1);
            if (current > 3) pages.push('...');
            for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
            if (current < total - 2) pages.push('...');
            pages.push(total);
        }
        return pages;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="relative min-h-screen bg-slate-100 font-sans text-slate-900">
                <Head title="Add Patient" />

                <main className="mx-auto max-w-6xl p-8">
                    {/* ADD PATIENT FORM */}
                    <section className="mb-8 rounded-xl border border-slate-400 bg-white p-8">
                        <div className="mb-6 border-b border-slate-200 pb-4">
                            <h2 className="font-montserrat text-sm font-semibold text-slate-600 uppercase">
                                Add New Patient
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                            {/* HRN (15 Digits) */}
                            <div>
                                <label className="mb-1.5 block font-montserrat text-[10px] font-semibold tracking-wider text-slate-500 uppercase">HRN</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="000000000000000"
                                    value={formData.hrn}
                                    onChange={(e) => setFormData({ ...formData, hrn: e.target.value.replace(/\D/g, '').slice(0, 15) })}
                                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 font-montserrat text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                />
                                <div className="mt-1 text-right">
                                    <span className={`text-[10px] font-semibold ${formData.hrn.length === 15 ? 'text-green-600' : 'text-slate-400'}`}>
                                        {formData.hrn.length} / 15
                                    </span>
                                </div>
                            </div>

                            {/* NAMES */}
                            <div>
                                <label className="mb-1.5 block font-montserrat text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Last Name</label>
                                <input type="text" value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 font-montserrat text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50" />
                            </div>
                            <div>
                                <label className="mb-1.5 block font-montserrat text-[10px] font-semibold tracking-wider text-slate-500 uppercase">First Name</label>
                                <input type="text" value={formData.firstname} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 font-montserrat text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50" />
                            </div>
                            <div>
                                <label className="mb-1.5 block font-montserrat text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Middle Name</label>
                                <input type="text" value={formData.middlename} onChange={(e) => setFormData({ ...formData, middlename: e.target.value })} className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 font-montserrat text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50" />
                            </div>

                            {/* SECOND ROW */}
                            <div>
                                <label className="mb-1.5 block font-montserrat text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Sex</label>
                                <select value={formData.sex} onChange={(e) => setFormData({ ...formData, sex: e.target.value })} className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 font-montserrat text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50">
                                    <option value="">Select Sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block font-montserrat text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Birthdate</label>
                                <input type="date" value={formData.birthdate} onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })} className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 font-montserrat text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50" />
                            </div>
                            
                            {/* DYNAMIC NATIONALITY INPUT */}
                            <div>
                                <label className="mb-1.5 block font-montserrat text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Nationality</label>
                                <input
                                    type="text"
                                    list="nationality-list"
                                    value={formData.nationality}
                                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 font-montserrat text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                    placeholder="Search nationality..."
                                />
                                <datalist id="nationality-list">
                                    {nationalities.map((nation) => (
                                        <option key={nation} value={nation} />
                                    ))}
                                </datalist>
                            </div>

                            <div>
                                <label className="mb-1.5 block font-montserrat text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Phone Number</label>
                                <input type="text" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 font-montserrat text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50" />
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="mt-6 flex items-center gap-3">
                            <button
                                onClick={handleAddPatient}
                                disabled={isAddDisabled}
                                className={`min-w-[160px] rounded-md px-6 py-3 font-montserrat text-xs text-white transition-all ${isAddDisabled ? 'bg-slate-300 opacity-60' : 'bg-blue-800 shadow-md hover:bg-blue-700 active:scale-95'}`}
                            >
                                {isLoading ? 'ADDING...' : 'ADD PATIENT'}
                            </button>
                            <button
                                onClick={handleClear}
                                className="rounded-md border border-slate-400 bg-white px-6 py-3 font-montserrat text-xs text-slate-500 hover:bg-slate-50"
                            >
                                CLEAR
                            </button>
                        </div>
                    </section>

                    {/* PATIENT LIST TABLE */}
                    <section className="overflow-hidden rounded-xl border border-slate-400 bg-white">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] tracking-widest text-slate-600 uppercase">
                                <tr>
                                    <th className="px-8 py-4">HRN</th>
                                    <th className="px-8 py-4">Patient Name</th>
                                    <th className="px-8 py-4 text-center">Files</th>
                                    <th className="px-8 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? <SkeletonRow /> : currentPatients.map((p) => (
                                    <tr key={p.id} className="transition-colors hover:bg-blue-50/30">
                                        <td className="px-8 py-5 font-mono text-sm text-blue-600">{p.hrn}</td>
                                        <td className="px-8 py-5 font-montserrat text-sm font-semibold text-slate-800 capitalize">
                                            {p.lastname}, {p.firstname} {p.middlename}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600">
                                                📄 {p.records_count ?? 0} PDF(s)
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <Link href={`/viewer/${p.hrn}/folder`} className="rounded bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-600 hover:text-white">
                                                VIEW FILE
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </main>
            </div>
        </AppLayout>
    );
}