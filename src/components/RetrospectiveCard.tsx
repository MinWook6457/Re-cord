'use client';

import { Retrospective } from '@/types/retrospective';
import Link from 'next/link';

interface RetrospectiveCardProps {
    retrospective: Retrospective;
}

const categoryColors = {
    keep: 'bg-green-100 border-green-300 text-green-800',
    stop: 'bg-red-100 border-red-300 text-red-800',
    start: 'bg-blue-100 border-blue-300 text-blue-800',
    improve: 'bg-yellow-100 border-yellow-300 text-yellow-800',
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
                        className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[retrospective.category]
                            }`}
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
