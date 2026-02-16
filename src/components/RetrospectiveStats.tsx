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
            <div className="rounded-lg p-4 border" style={{
                background: `linear-gradient(135deg, ${hexToRgba('#1A1B4B', 0.1)}, ${hexToRgba('#1A1B4B', 0.15)})`,
                borderColor: '#1A1B4B',
                color: '#1A1B4B'
            }}>
                <p className="text-gray-600 text-sm font-medium">전체</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{stats.total}</p>
            </div>
            <div className="rounded-lg p-4 border" style={{
                background: `linear-gradient(135deg, ${hexToRgba('#10b981', 0.1)}, ${hexToRgba('#10b981', 0.15)})`,
                borderColor: '#10b981'
            }}>
                <p className="text-gray-600 text-sm font-medium">유지</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--color-success)' }}>
                    {stats.byCategory.keep}
                </p>
            </div>
            <div className="rounded-lg p-4 border" style={{
                background: `linear-gradient(135deg, ${hexToRgba('#ef4444', 0.1)}, ${hexToRgba('#ef4444', 0.15)})`,
                borderColor: '#ef4444'
            }}>
                <p className="text-gray-600 text-sm font-medium">중단</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--color-danger)' }}>
                    {stats.byCategory.stop}
                </p>
            </div>
            <div className="rounded-lg p-4 border" style={{
                background: `linear-gradient(135deg, ${hexToRgba('#76B0A6', 0.1)}, ${hexToRgba('#76B0A6', 0.15)})`,
                borderColor: '#76B0A6'
            }}>
                <p className="text-gray-600 text-sm font-medium">시작</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
                    {stats.byCategory.start}
                </p>
            </div>
            <div className="rounded-lg p-4 border" style={{
                background: `linear-gradient(135deg, ${hexToRgba('#f59e0b', 0.1)}, ${hexToRgba('#f59e0b', 0.15)})`,
                borderColor: '#f59e0b'
            }}>
                <p className="text-gray-600 text-sm font-medium">개선</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--color-warning)' }}>
                    {stats.byCategory.improve}
                </p>
            </div>
        </div>
    );
}

function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
