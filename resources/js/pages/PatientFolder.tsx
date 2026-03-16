import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/components/header';

// --- Interfaces ---
interface Address {
    id: number;
    street: string;
    barangay: string;
    municipality: string;
    province: string;
}

interface PatientInformation {
    id: number;
    civil_status: string;
    nationality: string;
    birthdate: string;
    place_of_birth: string;
    phone_number: string;
    religion: string;
    address?: Address | null;
}

interface FileRecord {
    id: number;
    file_name: string;
    pdf_url: string | null;
    created_at: string;
    updated_at: string;
    file_count?: number;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedRecords {
    data: FileRecord[];
    links: PaginationLinks[];
    total: number;
    current_page: number;
    last_page: number;
}

interface Patient {
    hrn: string;
    firstname: string;
    lastname: string;
    middlename: string;
    information?: PatientInformation | null;
}

export default function PatientFolder({
    patient,
    records,
}: {
    patient: Patient;
    records: PaginatedRecords;
}) {
    const [selectedRecord, setSelectedRecord] = useState<FileRecord | null>(
        null,
    );
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    // 1. Identify the latest file from the current paginated set
    const allFilesOnPage = records.data || [];

    const getLatestTime = (file: FileRecord) => {
        const created = new Date(file.created_at).getTime();
        const updated = new Date(file.updated_at).getTime();
        return Math.max(created, updated);
    };

    // We only show the "Latest" banner on the first page to avoid confusion
    const latestFile =
        records.current_page === 1 && allFilesOnPage.length > 0
            ? [...allFilesOnPage].sort(
                  (a, b) => getLatestTime(b) - getLatestTime(a),
              )[0]
            : null;

    // 2. Archive list (Files that aren't the "Latest" one)
    const otherFiles = latestFile
        ? allFilesOnPage.filter((file) => file.id !== latestFile.id)
        : allFilesOnPage;

    return (
        <div className="min-h-screen bg-slate-50">
            <Head title={`${patient.lastname}'s Records`} />
            <Header />

            <main className="mx-auto max-w-5xl p-8">
                {/* Navigation */}
                <Link
                    href={`/viewer/record-finder`}
                    className="mb-6 inline-flex items-center gap-2 rounded-md font-montserrat text-sm font-semibold text-slate-500 transition-colors hover:text-blue-700"
                >
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to Search
                </Link>

                {/* --- Unified Patient Section --- */}
                <div className="mb-10 overflow-hidden rounded-2xl border border-slate-400 bg-white">
                    <div className="bg-slate-900 p-8 text-white">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                            <div>
                                <div className="flex flex-wrap gap-x-8 gap-y-4">
                                    {[
                                        {
                                            label: 'Lastname',
                                            value: patient.lastname,
                                        },
                                        {
                                            label: 'Firstname',
                                            value: patient.firstname,
                                        },
                                        {
                                            label: 'Middlename',
                                            value: patient.middlename,
                                        },
                                    ].map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex flex-col"
                                        >
                                            <h1 className="font-montserrat text-3xl font-bold tracking-tight capitalize">
                                                {item.value || '---'}
                                            </h1>
                                            <div className="mt-1 h-0.5 w-full bg-blue-500/30" />
                                            <span className="mt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-4 font-montserrat text-xs tracking-[0.2em] text-slate-400 uppercase">
                                    Hospital Record Number:
                                    <span className="ml-2 font-mono font-bold text-blue-400">
                                        {' '}
                                        {patient.hrn}
                                    </span>
                                </p>
                            </div>

                            <div className="flex flex-col items-start gap-3 md:items-end">
                                <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 font-montserrat text-xs font-bold text-blue-300 ring-1 ring-white/20">
                                    {records.total} Total Documents
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsInfoOpen(!isInfoOpen)}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 border-y border-slate-100 bg-slate-50 py-3 font-montserrat text-[11px] font-bold tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-100 hover:text-blue-600"
                    >
                        {isInfoOpen
                            ? 'Hide Patient Information'
                            : 'View Patient Information'}
                        <svg
                            className={`h-4 w-4 transition-transform duration-300 ${isInfoOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {/* MAIN CONTAINER: Handles the expanding/collapsing animation and the 3-column grid layout */}
                    <div
                        className={`grid grid-cols-1 transition-all duration-300 ease-in-out md:grid-cols-3 ${isInfoOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}
                    >
                        {/* SECTION 1: CONTACT & STATUS 
        - Displays the phone number with 'tabular-nums' for better digit alignment.
        - Uses a badge-style layout for Civil Status and Nationality.
    */}
                        <div className="flex flex-col border-b border-slate-100 p-6 md:border-r md:border-b-0">
                            <div className="mb-3 flex items-center gap-2">
                                {/* Icon Wrapper: Blue theme */}
                                <div className="rounded-lg bg-blue-50 p-1.5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-blue-600"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                    Contact & Status
                                </span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[11px] font-medium text-slate-400">
                                        Phone Number
                                    </p>
                                    <p className="text-sm font-semibold text-slate-800 tabular-nums">
                                        {patient.information?.phone_number ||
                                            'Unlisted'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {/* Status Badges */}
                                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                                        {patient.information?.civil_status ||
                                            'Unknown'}
                                    </span>
                                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                                        {patient.information?.nationality ||
                                            'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: BIRTH & RELIGION 
        - Features a date formatter to turn ISO strings into "Month Day, Year" format.
        - Provides a fallback 'Not Provided' if the date is missing.
    */}
                        <div className="flex flex-col border-b border-slate-100 p-6 md:border-r md:border-b-0">
                            <div className="mb-3 flex items-center gap-2">
                                {/* Icon Wrapper: Purple theme */}
                                <div className="rounded-lg bg-purple-50 p-1.5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-purple-600"
                                    >
                                        <rect
                                            x="3"
                                            y="4"
                                            width="18"
                                            height="18"
                                            rx="2"
                                            ry="2"
                                        />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                    Birth & Religion
                                </span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[11px] font-medium text-slate-400">
                                        Date of Birth
                                    </p>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {patient.information?.birthdate
                                            ? new Date(
                                                  patient.information.birthdate,
                                              ).toLocaleDateString('en-US', {
                                                  month: 'long',
                                                  day: 'numeric',
                                                  year: 'numeric',
                                              })
                                            : 'Not Provided'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium text-slate-400">
                                        Religious Affiliation
                                    </p>
                                    <p className="text-sm font-medium text-slate-600">
                                        {patient.information?.religion ||
                                            'None specified'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: FULL ADDRESS 
        - Uses a conditional check to ensure the address object exists before rendering.
        - Displays address components in a "Label: Value" flex row for clarity.
    */}
                        <div className="flex flex-col p-6">
                            <div className="mb-3 flex items-center gap-2">
                                {/* Icon Wrapper: Emerald theme */}
                                <div className="rounded-lg bg-emerald-50 p-1.5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-emerald-600"
                                    >
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                    Full Address
                                </span>
                            </div>
                            {patient.information?.address ? (
                                <div className="space-y-1">
                                    {/* Street level address emphasized */}
                                    <p className="text-sm font-bold text-slate-800">
                                        {patient.information.address.street}
                                    </p>

                                    {/* Detailed Breakdown */}
                                    <div className="space-y-0.5 text-xs text-slate-600">
                                        <p className="flex justify-between border-b border-slate-50 pb-0.5">
                                            <span className="text-slate-400">
                                                Barangay:
                                            </span>
                                            <span className="font-medium">
                                                {
                                                    patient.information.address
                                                        .barangay
                                                }
                                            </span>
                                        </p>
                                        <p className="flex justify-between border-b border-slate-50 pb-0.5">
                                            <span className="text-slate-400">
                                                City/Mun:
                                            </span>
                                            <span className="font-medium">
                                                {
                                                    patient.information.address
                                                        .municipality
                                                }
                                            </span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="text-slate-400">
                                                Province:
                                            </span>
                                            <span className="font-medium">
                                                {
                                                    patient.information.address
                                                        .province
                                                }
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Fallback for missing address data */
                                <p className="text-[11px] text-slate-400 italic">
                                    No address data on file
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- LATEST UPDATE SECTION --- */}
                {latestFile && (
                    <section className="mb-12">
                        <h3 className="mb-4 font-montserrat text-[10px] font-semibold tracking-[0.2em] text-blue-600 uppercase">
                            Most Recently Updated
                        </h3>
                        <div className="flex items-center gap-6 rounded-2xl border border-blue-400 bg-white p-6 shadow-sm">
                            <img
                                src="/images/pdf.png"
                                alt="PDF"
                                className="h-16 w-16 flex-shrink-0"
                            />
                            <div className="flex-1">
                                <h4 className="font-montserrat text-lg font-bold text-slate-900">
                                    {latestFile.file_name}
                                </h4>
                                <div className="mt-2 flex flex-col gap-y-1 border-l-2 border-slate-100 pl-3">
                                    <div className="flex items-center gap-x-2 text-[10px] font-bold text-slate-400 uppercase">
                                        <span>Created:</span>
                                        <span className="font-mono">
                                            {new Date(
                                                latestFile.created_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-x-2 text-[10px] font-bold text-blue-600 uppercase">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                                        <span>Updated:</span>
                                        <span className="font-mono">
                                            {new Date(
                                                latestFile.updated_at,
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedRecord(latestFile)}
                                className="cursor-pointer rounded-md bg-blue-800 px-6 py-3 font-montserrat text-xs font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
                            >
                                VIEW PDF
                            </button>
                        </div>
                    </section>
                )}

                {/* --- ARCHIVE LIST --- */}
                <section className="pb-20">
                    <h3 className="mb-4 font-montserrat text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
                        Archive List{' '}
                        {records.last_page > 1 &&
                            `(Page ${records.current_page})`}
                    </h3>
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
                        {otherFiles.length > 0 ? (
                            otherFiles.map((file) => (
                                <div
                                    key={file.id}
                                    onClick={() => setSelectedRecord(file)}
                                    className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-300 bg-white p-6 text-center transition-all hover:border-blue-600"
                                >
                                    <img
                                        src="/images/pdf.png"
                                        alt="PDF"
                                        className="mb-4 h-12 w-12"
                                    />
                                    <h4 className="line-clamp-2 text-sm font-bold text-slate-700 group-hover:text-blue-600">
                                        {file.file_name}
                                    </h4>
                                    <div className="mt-3 flex w-full flex-col items-center gap-1 border-t border-slate-100 pt-3">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                            Created
                                        </span>
                                        <p className="font-mono text-[11px] font-semibold text-slate-600">
                                            {new Date(
                                                file.created_at,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 py-10 text-center font-bold tracking-widest text-slate-400 uppercase">
                                No archived records found
                            </div>
                        )}
                    </div>

                    {/* --- PAGINATION CONTROLS --- */}
                    {records.links.length > 3 && (
                        <div className="mt-12 flex items-center justify-center gap-1">
                            {records.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    className={`flex h-10 min-w-[40px] items-center justify-center rounded-lg px-3 text-[11px] font-bold transition-all ${
                                        link.active
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                            : link.url
                                              ? 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                                              : 'cursor-not-allowed text-slate-400 opacity-30'
                                    }`}
                                    preserveScroll
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* --- MODAL PDF VIEWER --- */}
            {selectedRecord && (
                <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-md">
                    <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-6 py-4 text-white">
                        <div>
                            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                PDF Viewer
                            </span>
                            <h2 className="font-montserrat text-lg font-bold">
                                {selectedRecord.file_name}
                            </h2>
                        </div>
                        <button
                            onClick={() => setSelectedRecord(null)}
                            className="cursor-pointer rounded bg-red-600 px-6 py-2 text-xs font-bold transition-colors hover:bg-red-700"
                        >
                            CLOSE VIEWER
                        </button>
                    </div>
                    <div className="flex-1 bg-slate-800">
                        {selectedRecord.pdf_url ? (
                            <iframe
                                src={`${selectedRecord.pdf_url}#toolbar=1&view=FitW`}
                                className="h-full w-full border-none"
                                title={selectedRecord.file_name}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400">
                                <p>No PDF file path found.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
