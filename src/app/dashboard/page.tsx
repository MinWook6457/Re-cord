'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import RetrospectiveCard from '@/components/RetrospectiveCard';
import RetrospectiveFilter from '@/components/RetrospectiveFilter';
import RetrospectiveStatsComponent from '@/components/RetrospectiveStats';
import { Retrospective, RetrospectiveStats } from '@/types/retrospective';

export default function DashboardPage() {
  const router = useRouter();
  const [retrospectives, setRetrospectives] = useState<Retrospective[]>([]);
  const [filteredRetrospectives, setFilteredRetrospectives] = useState<Retrospective[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setUser(data.user);
      fetchRetrospectives();
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchRetrospectives = async () => {
    try {
      const response = await fetch('/api/retrospectives');
      if (response.ok) {
        const data = await response.json();
        setRetrospectives(data);
        setFilteredRetrospectives(data);
      }
    } catch (error) {
      console.error('Failed to fetch retrospectives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    filterRetrospectives(category, selectedDate, searchTerm);
  };

  const handleDateChange = (date: string | null) => {
    setSelectedDate(date);
    filterRetrospectives(selectedCategory, date, searchTerm);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    filterRetrospectives(selectedCategory, selectedDate, search);
  };

  const filterRetrospectives = (
    category: string | null,
    date: string | null,
    search: string
  ) => {
    let filtered = retrospectives;

    if (category) {
      filtered = filtered.filter((r) => r.category === category);
    }

    if (date) {
      filtered = filtered.filter((r) => r.date === date);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchLower) ||
          r.content.toLowerCase().includes(searchLower) ||
          r.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredRetrospectives(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/retrospectives/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRetrospectives((prev) => prev.filter((r) => r.id !== id));
        filterRetrospectives(selectedCategory, selectedDate, searchTerm);
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const stats: RetrospectiveStats = {
    total: retrospectives.length,
    byCategory: {
      keep: retrospectives.filter((r) => r.category === 'keep').length,
      stop: retrospectives.filter((r) => r.category === 'stop').length,
      start: retrospectives.filter((r) => r.category === 'start').length,
      improve: retrospectives.filter((r) => r.category === 'improve').length,
    },
    lastUpdated: new Date(),
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-light-bg)' }}>
      <DashboardHeader userName={user?.name} showNewButton={true} />

      {/* 메인 콘텐츠 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            회고 아카이브
          </h1>
          <p className="text-lg text-gray-600">
            모든 회고 내용을 한 곳에서 관리하고 추적하세요.
          </p>
        </div>

        {/* 통계 */}
        <RetrospectiveStatsComponent stats={stats} />

        {/* 필터 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                카테고리 필터
              </label>
              <div className="flex flex-wrap gap-2">
                {['keep', 'stop', 'start', 'improve'].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(selectedCategory === category ? null : category)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'keep' && '유지'}
                    {category === 'stop' && '중단'}
                    {category === 'start' && '시작'}
                    {category === 'improve' && '개선'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                날짜 선택
              </label>
              <input
                type="date"
                value={selectedDate || ''}
                onChange={(e) => handleDateChange(e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              검색
            </label>
            <input
              type="text"
              placeholder="제목, 태그로 검색..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(selectedCategory || selectedDate || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedDate(null);
                setSearchTerm('');
                setFilteredRetrospectives(retrospectives);
              }}
              className="mt-4 text-blue-600 hover:underline text-sm font-medium"
            >
              필터 초기화
            </button>
          )}
        </div>

        {/* 회고 목록 */}
        <div className="space-y-4">
          {filteredRetrospectives.length > 0 ? (
            filteredRetrospectives.map((retrospective) => (
              <div key={retrospective.id} className="relative group">
                <RetrospectiveCard retrospective={retrospective} />
                <div className="absolute top-6 right-6 space-x-2 flex opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <Link
                    href={`/dashboard/${retrospective.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm font-medium"
                  >
                    수정
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(retrospective.id);
                    }}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm font-medium"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">검색 결과가 없습니다.</p>
              <Link
                href="/dashboard/new"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                첫 번째 회고 작성하기
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
