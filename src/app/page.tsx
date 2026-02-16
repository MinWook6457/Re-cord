'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Edit3,
  TrendingUp,
  Sparkles,
  Calendar,
  PieChart,
  Lock,
  CheckCircle2,
  ArrowRight,
  LayoutGrid,
} from 'lucide-react';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      setIsAuthenticated(response.ok);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  if (isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-emerald-100">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-slate-200">
            <span className="font-bold font-serif italic">R</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Record</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors hidden md:block"
          >
            로그인
          </Link>
          <Link
            href="/register"
            className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            무료로 시작하기 <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
          흩어지는 일상을 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            단단한 성장의 기록
          </span>
          으로.
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          매일의 회고가 모여 당신의 커리어가 됩니다. <br className="hidden md:block" />
          단순한 일기장을 넘어, 데이터를 통해 나를 발견하는 회고 아카이브.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <Edit3 size={20} />
            내 회고 시작하기
          </Link>
          <button className="w-full md:w-auto px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <TrendingUp size={20} />
            데모 둘러보기
          </button>
        </div>
      </section>

      {/* Feature Preview */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Writing Experience */}
          <div className="md:col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-100 relative overflow-hidden group hover:border-emerald-200 transition-all">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <Edit3 size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-emerald-600">
                <LayoutGrid size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">몰입을 돕는 에디터</h3>
              <p className="text-slate-500 leading-relaxed max-w-md">
                복잡한 툴바 없이 오직 글쓰기에만 집중하세요. <br />
                마크다운 지원, 이미지 드래그 앤 드롭, 그리고 기분 태그까지.
              </p>

              {/* Mock UI Card */}
              <div className="mt-8 bg-white rounded-xl p-5 shadow-sm border border-slate-200 max-w-lg transform group-hover:translate-y-[-5px] transition-transform">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
                  <div className="h-4 w-full bg-slate-100 rounded"></div>
                  <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Consistency Heatmap */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <Calendar size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">꾸준함의 시각화</h3>
              <p className="text-slate-400 text-sm mb-8">
                잔디를 심듯 하루하루 채워가는 성취감. <br />
                당신의 성실함을 증명해보세요.
              </p>
              <div className="mt-auto grid grid-cols-7 gap-1 opacity-80">
                {Array.from({ length: 49 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-sm ${Math.random() > 0.6 ? 'bg-emerald-500' : 'bg-white/10'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 3: Analytics */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-500">
              <PieChart size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">회고 분석 리포트</h3>
            <p className="text-slate-500 text-sm">
              가장 많이 사용한 키워드, 감정 변화 추이 등 <br />
              나도 몰랐던 나의 패턴을 발견하세요.
            </p>
          </div>

          {/* Feature 4: Security */}
          <div className="md:col-span-2 bg-emerald-50 rounded-3xl p-8 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="flex-1">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 text-emerald-600 shadow-sm">
                <Lock size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">나만의 프라이빗한 공간</h3>
              <p className="text-slate-600">
                모든 회고는 안전하게 암호화되어 저장됩니다. <br />
                오직 나만 볼 수 있는 솔직한 이야기를 담아보세요.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-600" /> 종단간 암호화 적용
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-600" /> 언제든지 데이터 내보내기 가능
                </li>
              </ul>
            </div>
            <div className="w-full md:w-64 bg-white rounded-2xl p-6 shadow-sm rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                <div className="h-3 w-20 bg-slate-100 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-100 rounded"></div>
                <div className="h-2 w-full bg-slate-100 rounded"></div>
                <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
              </div>
              <div className="mt-4 flex gap-2">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-600 text-[10px] rounded">#Private</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] rounded">#Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white text-xs">
              <span className="font-bold font-serif italic">R</span>
            </div>
            <span className="font-bold text-slate-900">Record</span>
            <span className="text-slate-400 text-sm ml-2">© 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900">Terms of Service</a>
            <a href="#" className="hover:text-slate-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
