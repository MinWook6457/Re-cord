'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                <span className="font-bold font-serif italic">R</span>
              </div>
              <span className="font-bold text-xl text-slate-900">Record</span>
            </Link>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <span className="font-bold font-serif italic">R</span>
            </div>
            <span className="font-bold text-xl text-slate-900">Record</span>
          </Link>
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium">
            ← 돌아가기
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="mb-8 pb-8 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  {retrospective.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold ${categoryColors[
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
                  <span className="text-slate-500 text-sm">
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

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">내용</h2>
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {retrospective.content}
              </ReactMarkdown>
            </div>
          </div>

          {retrospective.tags && retrospective.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">태그</h2>
              <div className="flex flex-wrap gap-2">
                {retrospective.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-slate-100 text-sm text-slate-400">
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

          <div className="mt-8 flex gap-4 pt-8 border-t border-slate-100">
            <Link
              href={`/dashboard/${retrospective.id}/edit`}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              수정
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              목록으로
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
