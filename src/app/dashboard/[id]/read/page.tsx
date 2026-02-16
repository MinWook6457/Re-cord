'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Retrospective {
  id: string;
  date: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const categoryLabels = {
  keep: '유지',
  stop: '중단',
  start: '시작',
  improve: '개선',
};

const categoryColors = {
  keep: 'bg-green-100 border-green-300 text-green-800',
  stop: 'bg-red-100 border-red-300 text-red-800',
  start: 'bg-blue-100 border-blue-300 text-blue-800',
  improve: 'bg-yellow-100 border-yellow-300 text-yellow-800',
};

export default function ReadRetrospectivePage() {
  const router = useRouter();
  const params = useParams();
  const [retrospective, setRetrospective] = useState<Retrospective | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const id = params.id as string;

  useEffect(() => {
    fetchRetrospective();
  }, [id]);

  const fetchRetrospective = async () => {
    try {
      const response = await fetch(`/api/retrospectives/${id}`);

      if (!response.ok) {
        setError('회고를 찾을 수 없습니다.');
        return;
      }

      const data: Retrospective = await response.json();
      setRetrospective(data);
    } catch (err) {
      setError('회고 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  if (error || !retrospective) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              회고 아카이브
            </Link>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ backgroundColor: 'var(--color-light-bg)' }}>
      {/* 헤더 */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b" style={{ borderColor: 'var(--color-primary)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            회고 아카이브
          </Link>
          <Link
            href="/dashboard"
            className="font-medium transition-colors"
            style={{ color: 'var(--color-secondary)' }}
          >
            ← 돌아가기
          </Link>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 제목 및 메타 정보 */}
          <div className="mb-8 pb-8 border-b-2 border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {retrospective.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${categoryColors[
                      retrospective.category as keyof typeof categoryColors
                      ]
                      }`}
                  >
                    {
                      categoryLabels[
                      retrospective.category as keyof typeof categoryLabels
                      ]
                    }
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(retrospective.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 콘텐츠 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">내용</h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {retrospective.content}
              </p>
            </div>
          </div>

          {/* 태그 */}
          {retrospective.tags && retrospective.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">태그</h2>
              <div className="flex flex-wrap gap-3">
                {retrospective.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 메타 정보 */}
          <div className="pt-8 border-t border-gray-200 text-sm text-gray-500">
            <p>
              작성일:{' '}
              {new Date(retrospective.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p>
              수정일:{' '}
              {new Date(retrospective.updatedAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* 버튼 */}
          <div className="mt-8 flex gap-4 pt-8 border-t border-gray-200">
            <Link
              href={`/dashboard/${retrospective.id}/edit`}
              className="px-6 py-3 text-white rounded-lg font-semibold transition-colors gradient-primary"
            >
              수정
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: 'var(--color-light-bg)', color: 'var(--color-primary)', border: '2px solid var(--color-secondary)' }}
            >
              목록으로
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
