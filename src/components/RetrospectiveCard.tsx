'use client';

import { Retrospective } from '@/types/retrospective';
import Link from 'next/link';

interface RetrospectiveCardProps {
    retrospective: Retrospective;
}

const categoryColors: { [key: string]: { bg: string; border: string; text: string } } = {
    keep: {
        bg: 'rgba(16, 185, 129, 0.15)',
        border: '#10b981',
        text: '#10b981'
    },
    stop: {
        bg: 'rgba(239, 68, 68, 0.15)',
        border: '#ef4444',
        text: '#ef4444'
    },
    start: {
        bg: 'rgba(118, 176, 166, 0.15)',
        border: '#76B0A6',
        text: '#76B0A6'
    },
    improve: {
        bg: 'rgba(245, 158, 11, 0.15)',
        border: '#f59e0b',
        text: '#f59e0b'
    },
};

const categoryLabels = {
    keep: '유지',
    stop: '중단',
    start: '시작',
    improve: '개선',
};

export default function RetrospectiveCard({
    retrospective,
}: RetrospectiveCardProps) {
    return (
        <Link href={`/dashboard/${retrospective.id}/read`}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-gray-300 cursor-pointer hover:translate-y-[-2px]">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {retrospective.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {new Date(retrospective.date).toLocaleDateString('ko-KR')}
                        </p>
                    </div>
                    <span
                        className="px-3 py-1 rounded-full text-sm font-medium border"
                        style={{
                            backgroundColor: categoryColors[retrospective.category]?.bg,
                            borderColor: categoryColors[retrospective.category]?.border,
                            color: categoryColors[retrospective.category]?.text
                        }}
                    >
                        {categoryLabels[retrospective.category]}
                    </span>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">
                    {retrospective.content}
                </p>

                <div className="flex flex-wrap gap-2">
                    {retrospective.tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
