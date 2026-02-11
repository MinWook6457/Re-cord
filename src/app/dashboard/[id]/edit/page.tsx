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

export default function EditRetrospectivePage() {
    const router = useRouter();
    const params = useParams();
    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('keep');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
            setDate(data.date);
            setTitle(data.title);
            setCategory(data.category);
            setContent(data.content);
            // tags는 이미 배열로 반환됨
            setTags(Array.isArray(data.tags) ? data.tags.join(', ') : '');
        } catch (err) {
            setError('회고 조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const response = await fetch(`/api/retrospectives/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date,
                    title,
                    category,
                    content,
                    tags: tags
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter((tag) => tag),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || '회고 업데이트 중 오류가 발생했습니다.');
                return;
            }

            router.push('/dashboard');
        } catch (err) {
            setError('네트워크 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-light-bg)' }}>
            {/* 헤더 */}
            <nav className="bg-white shadow-sm border-b" style={{ borderColor: 'var(--color-primary)' }}>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link href="/dashboard" className="flex items-center gap-3 text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                        <img src="/record_logo.jpg" alt="Re:Cord 로고" className="w-8 h-8 rounded" />
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">회고 수정</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    날짜
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    카테고리
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="keep">유지 (Keep)</option>
                                    <option value="stop">중단 (Stop)</option>
                                    <option value="start">시작 (Start)</option>
                                    <option value="improve">개선 (Improve)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                제목
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="회고 제목을 입력하세요"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                내용
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                placeholder="상세한 내용을 입력하세요"
                                rows={8}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                태그 (쉼표로 구분)
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="예: 개선, 성능, 팀협업"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                            >
                                {saving ? '저장 중...' : '회고 수정'}
                            </button>
                            <Link
                                href="/dashboard"
                                className="flex-1 text-center py-3 border-2 border-gray-300 text-gray-900 rounded-lg font-medium hover:border-gray-400"
                            >
                                취소
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
