import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Users, FileText, Files, BookOpen, Clock, BarChart3, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { memo } from 'react'; // Added for performance

interface Props {
    stats: {
        totalPatients: number;
        totalRecords: number;
        totalFiles: number;
        totalPages: number;
    };
    monthlyUploads: { month: string; patients: number }[];
    recentActivity: any[];
    distribution: {
        bySex: any[];
        byStatus: any[];
    };
}

// 1. Memoized Row Component to prevent re-render lag
const ActivityRow = memo(({ item }: { item: any }) => (
    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
        <td className="p-3 font-medium">{item.patient_name}</td>
        <td className="p-3 uppercase text-xs font-bold text-[var(--patients-muted)]">{item.record_type}</td>
        <td className="p-3 text-[var(--patients-muted)]">{item.uploaded_by}</td>
        <td className="p-3 text-[var(--patients-muted)]">{item.created_at}</td>
    </tr>
));

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard({ stats, monthlyUploads, recentActivity, distribution }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patient Records Dashboard" />
            
            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* 1. Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Patients" value={stats.totalPatients} icon={<Users className="text-blue-600" />} />
                    <StatCard title="Total Records" value={stats.totalRecords} icon={<FileText className="text-purple-600" />} />
                    <StatCard title="Total Files" value={stats.totalFiles} icon={<Files className="text-amber-600" />}/>
                    <StatCard title="Total Pages" value={stats.totalPages} icon={<BookOpen className="text-emerald-600" />} />
                </div>

                {/* 2. Monthly Trend Graph */}
                <div className="rounded-xl border border-[var(--patients-section-border)] bg-[var(--patients-section-bg)] p-6">
                    <div className="mb-6 flex items-center gap-2 font-semibold">
                        <TrendingUp className="size-5 text-blue-500" />
                        Patient Uploaded Trend (Monthly)
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyUploads}>
                                <defs>
                                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 12, fill: '#71717a'}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 12, fill: '#71717a'}}
                                />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none'}} />
                                <Area 
                                    type="monotone" 
                                    dataKey="patients" 
                                    stroke="#3b82f6" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#colorPatients)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    {/* 3. Recent Activity - Added max-height scroll for performance */}
                    <div className="col-span-4 rounded-xl border border-[var(--patients-section-border)] bg-[var(--patients-section-bg)] p-4">
                        <div className="mb-4 flex items-center gap-2 font-semibold">
                            <Clock className="size-5 text-zinc-500" />
                            Recent Uploads
                        </div>
                        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left text-sm relative">
                                <thead className="sticky top-0 z-10 border-b border-[var(--patients-border)] bg-[var(--patients-section-bg)]">
                                    <tr>
                                        <th className="p-3 font-medium bg-black/5 dark:bg-zinc-800/50">Patient</th>
                                        <th className="p-3 font-medium bg-black/5 dark:bg-zinc-800/50">Record Type</th>
                                        <th className="p-3 font-medium bg-black/5 dark:bg-zinc-800/50">Uploaded By</th>
                                        <th className="p-3 font-medium bg-black/5 dark:bg-zinc-800/50">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentActivity.map((item) => (
                                        <ActivityRow key={item.id || item.created_at} item={item} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 4. Distribution */}
                    <div className="col-span-3 rounded-xl border border-[var(--patients-section-border)] bg-[var(--patients-section-bg)] p-4">
                        <div className="mb-4 flex items-center gap-2 font-semibold">
                            <BarChart3 className="size-5 text-[var(--patients-muted)]" />
                            Demographics
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-semibold text-[var(--patients-muted)] uppercase mb-2">Patient Sex</p>
                                {distribution.bySex.map((item, idx) => (
                                    <div key={idx} className="mb-2">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{item.label}</span>
                                            <span className="font-bold">{item.value}</span>
                                        </div>
                                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-blue-500" 
                                                style={{ width: `${(item.value / stats.totalPatients) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-[var(--patients-section-border)] bg-[var(--patients-section-bg)] p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-[var(--patients-muted)]">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value.toLocaleString()}</h3>
                </div>
                <div className="p-3">
                    {icon}
                </div>
            </div>
        </div>
    );
}