'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Edit3,
  Filter,
  LayoutGrid,
  List,
  PieChart,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { Retrospective } from '@/types/retrospective';

export default function DashboardPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [retrospectives, setRetrospectives] = useState<Retrospective[]>([]);
  const [filteredRetrospectives, setFilteredRetrospectives] = useState<Retrospective[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});

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
        
        const heatmap: Record<string, number> = {};
        data.forEach((r: Retrospective) => {
          const dateKey = r.date.split('T')[0];
          heatmap[dateKey] = (heatmap[dateKey] || 0) + 1;
        });
        setHeatmapData(heatmap);
        
        applyFilters(data, activeFilter, searchQuery);
      }
    } catch (error) {
      console.error('Failed to fetch retrospectives:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data: Retrospective[], filter: string, search: string) => {
    let filtered = data;
    
    if (filter !== 'All') {
      filtered = filtered.filter((r) => r.category === filter);
    }
    
    if (search.trim()) {
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

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    applyFilters(retrospectives, filter, searchQuery);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    applyFilters(retrospectives, activeFilter, search);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const response = await fetch(`/api/retrospectives/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setRetrospectives((prev) => prev.filter((r) => r.id !== id));
        setFilteredRetrospectives((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      keep: 'bg-green-50 text-green-700 border-green-100',
      stop: 'bg-red-50 text-red-700 border-red-100',
      start: 'bg-blue-50 text-blue-700 border-blue-100',
      improve: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    };
    return colors[category] || 'bg-slate-50 text-slate-700 border-slate-100';
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      keep: 'Keep',
      stop: 'Stop',
      start: 'Start',
      improve: 'Improve',
    };
    return labels[category] || category;
  };

  const calculateStreak = () => {
    if (Object.keys(heatmapData).length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateKey = currentDate.toISOString().split('T')[0];
      if (heatmapData[dateKey]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const thisMonthCount = retrospectives.filter((r) => {
    const retroDate = new Date(r.date);
    const now = new Date();
    return retroDate.getMonth() === now.getMonth() && retroDate.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { label: '총 회고', value: retrospectives.length.toString(), icon: BookOpen, change: `+${thisMonthCount} 이번 달` },
    { label: '유지', value: retrospectives.filter((r) => r.category === 'keep').length.toString(), icon: TrendingUp, change: '계속 유지하세요!' },
    { label: '연속 기록', value: `${calculateStreak()}일`, icon: Sparkles, change: '오늘 기록하세요!' },
  ];

  const getHeatmapIntensity = (dateKey: string) => {
    const count = heatmapData[dateKey] || 0;
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4;
  };

  const generateHeatmap = () => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const startDate = new Date(oneYearAgo);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    const weeks: Date[][] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const week: Date[] = [];
      for (let j = 0; j < 7; j++) {
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
    }
    
    const colors = [
      'bg-slate-100',
      'bg-emerald-200',
      'bg-emerald-300',
      'bg-emerald-400',
      'bg-emerald-500',
    ];
    
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const monthLabels: { month: string; index: number }[] = [];
    let lastMonth = -1;
    
    return weeks.map((week, i) => (
      <div key={i} className="flex flex-col gap-1">
        {week.map((date, j) => {
          const dateKey = date.toISOString().split('T')[0];
          const intensity = date > today ? -1 : getHeatmapIntensity(dateKey);
          const currentMonth = date.getMonth();
          
          if (currentMonth !== lastMonth && date <= today) {
            monthLabels.push({ month: months[currentMonth], index: i });
            lastMonth = currentMonth;
          }
          
          return (
            <div
              key={`${i}-${j}`}
              className={`w-2.5 h-2.5 rounded-sm ${intensity === -1 ? 'bg-transparent' : colors[intensity]} transition-all hover:ring-2 hover:ring-slate-300 cursor-pointer`}
              title={`${dateKey}: ${heatmapData[dateKey] || 0}개`}
            />
          );
        })}
      </div>
    ));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-800 font-sans selection:bg-emerald-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-white md:sticky md:top-0 md:h-screen z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <span className="font-bold font-serif italic">R</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Record</h1>
          </div>

          <nav className="space-y-1">
            <NavItem icon={LayoutGrid} label="대시보드" active />
            <NavItem icon={List} label="모든 항목" />
            <NavItem icon={Calendar} label="캘린더" />
            <NavItem icon={PieChart} label="분석" />
            <NavItem icon={Tag} label="태그" />
          </nav>

          <div className="mt-10">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">컬렉션</h3>
            <div className="space-y-1">
              <CollectionItem color="bg-blue-500" label="월간 리뷰" count={12} />
              <CollectionItem color="bg-orange-500" label="프로젝트 로그" count={8} />
              <CollectionItem color="bg-purple-500" label="개인" count={22} />
            </div>
          </div>

          <div className="mt-auto pt-10 md:absolute md:bottom-8 md:w-[calc(100%-3rem)]">
            <Link
              href="/dashboard/new"
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl transition-all shadow-lg shadow-slate-200 hover:shadow-xl font-medium"
            >
              <Edit3 size={18} />
              <span>새 회고</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 mt-3 text-slate-500 hover:text-slate-900 py-2 px-4 rounded-lg hover:bg-slate-100 transition-all font-medium"
            >
              <LogOut size={18} />
              <span>로그아웃</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                환영합니다, {user?.name} 👋
              </h2>
              <p className="text-slate-500 text-sm">기록이 쌓일수록 성장은 선명해집니다.</p>
            </div>

            <div className="flex items-center gap-3 bg-white p-1 rounded-full border border-slate-200 shadow-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="회고 검색..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm bg-transparent outline-none w-48 md:w-64 placeholder:text-slate-400"
                />
              </div>
            </div>
          </header>

          {/* Stats Overview */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg ${idx === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                    <stat.icon size={20} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${idx === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                </div>
              </div>
            ))}
          </section>

          {/* Consistency Heatmap */}
          <section className="mb-12 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={18} className="text-emerald-500" />
                작성 일관성
              </h3>
              <div className="text-xs text-slate-400">최근 12개월</div>
            </div>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-1 min-w-max">
                {generateHeatmap()}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-slate-400">
              <span>적음</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-slate-100 rounded-sm"></div>
                <div className="w-3 h-3 bg-emerald-200 rounded-sm"></div>
                <div className="w-3 h-3 bg-emerald-300 rounded-sm"></div>
                <div className="w-3 h-3 bg-emerald-400 rounded-sm"></div>
                <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
              </div>
              <span>많음</span>
            </div>
          </section>

          {/* Recent Entries */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h3 className="font-bold text-lg text-slate-900">최근 기록</h3>
                <div className="hidden md:flex bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <Filter size={14} />
                  <span>필터</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {['All', 'keep', 'stop', 'start', 'improve'].map(filter => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeFilter === filter
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                    }`}
                >
                  {filter === 'All' ? '모두' : getCategoryLabel(filter)}
                </button>
              ))}
              {searchQuery && (
                <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                  "{searchQuery}" 검색 결과
                </span>
              )}
            </div>

            {/* Content Grid/List */}
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'flex flex-col gap-3'}`}>
              {filteredRetrospectives.length > 0 ? (
                filteredRetrospectives.map((retro) => (
                  <div
                    key={retro.id}
                    className={`group bg-white rounded-xl border border-slate-100 p-5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all cursor-pointer relative overflow-hidden ${viewMode === 'list' ? 'flex items-start md:items-center gap-4' : 'flex flex-col'
                      }`}
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full ${getCategoryColor(retro.category).split(' ')[0]}`}></div>

                    {/* List View Date Left */}
                    {viewMode === 'list' && (
                      <div className="hidden md:block min-w-[80px] text-center">
                        <span className="block text-xl font-bold text-slate-800">
                          {new Date(retro.date).getDate()}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(retro.date).getMonth() + 1}월
                        </span>
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryColor(retro.category)}`}
                          >
                            {getCategoryLabel(retro.category)}
                          </span>
                          {viewMode === 'grid' && (
                            <span className="text-xs text-slate-400">
                              {new Date(retro.date).toLocaleDateString('ko-KR')}
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {retro.title}
                      </h4>

                      <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                        {retro.content}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex gap-2 flex-wrap">
                          {retro.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/dashboard/${retro.id}/read`}
                            className="text-emerald-500 hover:text-emerald-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ChevronRight size={18} />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(retro.id);
                            }}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 min-h-[180px] hover:border-emerald-300 hover:bg-emerald-50/30 hover:text-emerald-600 transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-emerald-100 flex items-center justify-center mb-3 transition-colors">
                    <Edit3 size={20} />
                  </div>
                  <span className="font-medium">오늘의 생각을 기록하세요</span>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }: { icon: React.ComponentType<{ size: number }>; label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${active ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

function CollectionItem({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-slate-50 rounded-lg group">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <span className="text-sm text-slate-600 group-hover:text-slate-900">{label}</span>
      </div>
      <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md group-hover:bg-slate-200">
        {count}
      </span>
    </div>
  );
}
