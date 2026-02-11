'use client';

import { RetrospectiveStats } from '@/types/retrospective';

interface RetrospectiveStatsComponentProps {
    stats: RetrospectiveStats;
}

export default function RetrospectiveStatsComponent({
    stats,
}: RetrospectiveStatsComponentProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <p className="text-gray-600 text-sm font-medium">전체</p>
                <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <p className="text-gray-600 text-sm font-medium">유지</p>
                <p className="text-3xl font-bold text-green-700">
                    {stats.byCategory.keep}
                </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                <p className="text-gray-600 text-sm font-medium">중단</p>
                <p className="text-3xl font-bold text-red-700">
                    {stats.byCategory.stop}
                </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <p className="text-gray-600 text-sm font-medium">시작</p>
                <p className="text-3xl font-bold text-blue-700">
                    {stats.byCategory.start}
                </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                <p className="text-gray-600 text-sm font-medium">개선</p>
                <p className="text-3xl font-bold text-yellow-700">
                    {stats.byCategory.improve}
                </p>
            </div>
        </div>
    );
}
