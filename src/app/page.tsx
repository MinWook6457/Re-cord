'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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
    // 인증된 사용자는 대시보드로 리다이렉트
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 50%, #F0F4F8 100%)' }}>
      {/* 네비게이션 */}
      <nav className="bg-white shadow-sm border-b" style={{ borderColor: 'var(--color-primary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/record_logo.jpg" alt="Re:Cord 로고" className="w-10 h-10 rounded" />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>회고 아카이브</h1>
          </div>
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-6 py-2 text-gray-700 hover:text-gray-900"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 text-white rounded-lg font-medium transition-colors"
              style={{ backgroundColor: 'var(--color-primary)', hover: 'var(--color-secondary)' }}
            >
              회원가입
            </Link>
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 왼쪽: SVG 일러스트 */}
          <div className="flex justify-center md:justify-start animate-float">
            <svg
              viewBox="0 0 400 400"
              className="w-full max-w-md h-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 배경 */}
              <rect width="400" height="400" fill="url(#bgGradient)" />

              {/* 그라데이션 */}
              <defs>
                <linearGradient
                  id="bgGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#F5F7FA" />
                  <stop offset="100%" stopColor="#F0F4F8" />
                </linearGradient>
                <linearGradient
                  id="keepGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#1A1B4B" />
                  <stop offset="100%" stopColor="#76B0A6" />
                </linearGradient>
                <linearGradient
                  id="stopGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#76B0A6" />
                  <stop offset="100%" stopColor="#6B7589" />
                </linearGradient>
                <linearGradient
                  id="startGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#1A1B4B" />
                  <stop offset="100%" stopColor="#6B7589" />
                </linearGradient>
                <linearGradient
                  id="improveGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#6B7589" />
                  <stop offset="100%" stopColor="#76B0A6" />
                </linearGradient>
                <style>{`
                  @keyframes pulse-ring {
                    0%, 100% { r: 115; opacity: 0.8; }
                    50% { r: 120; opacity: 0.4; }
                  }
                  @keyframes bounce-top { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                  @keyframes bounce-right { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(10px); } }
                  @keyframes bounce-bottom { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
                  @keyframes bounce-left { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-10px); } }
                  @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                  #pulseRing { animation: pulse-ring 2s ease-in-out infinite; }
                  #keepBox { animation: bounce-top 3s ease-in-out infinite; }
                  #stopBox { animation: bounce-right 3s ease-in-out infinite; animation-delay: 0.15s; }
                  #startBox { animation: bounce-bottom 3s ease-in-out infinite; animation-delay: 0.3s; }
                  #improveBox { animation: bounce-left 3s ease-in-out infinite; animation-delay: 0.45s; }
                  #centerCircle { animation: spin-slow 30s linear infinite; }
                `}</style>
              </defs>

              {/* 중앙 원 - 회전 애니메이션 */}
              <circle id="centerCircle" cx="200" cy="200" r="120" fill="#FFFFFF" opacity="0.9" />
              <circle id="pulseRing" cx="200" cy="200" r="115" fill="none" stroke="#1A1B4B" strokeWidth="2" opacity="0.2" />

              {/* Keep - 상단 */}
              <g id="keepBox" transform="translate(200, 100)">
                <rect
                  x="-35"
                  y="-20"
                  width="70"
                  height="40"
                  rx="8"
                  fill="url(#keepGradient)"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                />
                <text
                  x="0"
                  y="8"
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  Keep
                </text>
              </g>

              {/* Stop - 우측 */}
              <g id="stopBox" transform="translate(290, 200)">
                <rect
                  x="-35"
                  y="-20"
                  width="70"
                  height="40"
                  rx="8"
                  fill="url(#stopGradient)"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                />
                <text
                  x="0"
                  y="8"
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  Stop
                </text>
              </g>

              {/* Start - 하단 */}
              <g id="startBox" transform="translate(200, 300)">
                <rect
                  x="-35"
                  y="-20"
                  width="70"
                  height="40"
                  rx="8"
                  fill="url(#startGradient)"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                />
                <text
                  x="0"
                  y="8"
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  Start
                </text>
              </g>

              {/* Improve - 좌측 */}
              <g id="improveBox" transform="translate(110, 200)">
                <rect
                  x="-35"
                  y="-20"
                  width="70"
                  height="40"
                  rx="8"
                  fill="url(#improveGradient)"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                />
                <text
                  x="0"
                  y="8"
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  Improve
                </text>
              </g>

              {/* 중앙 텍스트 */}
              <text
                x="200"
                y="205"
                textAnchor="middle"
                fill="#1A1B4B"
                fontSize="16"
                fontWeight="bold"
              >
                Retrospective
              </text>
              <text
                x="200"
                y="225"
                textAnchor="middle"
                fill="#76B0A6"
                fontSize="12"
              >
                Archive
              </text>
            </svg>
          </div>

          {/* 오른쪽: 소개 텍스트 */}
          <div className="space-y-8 animate-slide-in-up">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                팀의 성장을 위한
                <span className="block text-transparent bg-clip-text gradient-primary mt-2"> 회고 아카이브</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Keep, Stop, Start, Improve를 통해 지속적인 개선을 추진하세요.
                모든 회고 내용을 한 곳에서 체계적으로 관리하고 분석하세요.
              </p>
            </div>

            {/* 기능 소개 */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-soft">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg gradient-success text-white font-bold text-lg">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Keep</h3>
                  <p className="text-gray-600">계속 유지해야 할 좋은 습관과 프로세스</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-soft">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg gradient-danger text-white font-bold text-lg">
                    ✕
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Stop</h3>
                  <p className="text-gray-600">중단해야 할 비효율적인 활동들</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-soft">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg gradient-info text-white font-bold text-lg">
                    +
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Start</h3>
                  <p className="text-gray-600">새로 시작해야 할 개선 사항들</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-soft">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg gradient-warning text-white font-bold text-lg">
                    ⚡
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Improve</h3>
                  <p className="text-gray-600">더 잘할 수 있는 부분들의 개선안</p>
                </div>
              </div>
            </div>

            {/* CTA 버튼 */}
            <div className="pt-4 space-y-3 sm:space-y-0 sm:flex sm:space-x-4">
              <Link
                href="/register"
                className="inline-block px-8 py-4 gradient-primary text-white font-semibold rounded-xl hover:shadow-lg-soft transition-all duration-300 text-center transform hover:scale-105 activate:scale-95"
              >
                🚀 지금 시작하기
              </Link>
              <Link
                href="/login"
                className="inline-block px-8 py-4 bg-white border-2 border-gray-300 text-gray-900 font-semibold rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-center transform hover:scale-105 activate:scale-95"
              >
                📝 로그인
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 mt-20 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">회고 아카이브</h3>
              <p className="text-gray-400">
                팀의 성장을 위한 지속적인 개선을 함께하세요
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">성능</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">빠른 속도</a></li>
                <li><a href="#" className="hover:text-white transition">안정성</a></li>
                <li><a href="#" className="hover:text-white transition">확장성</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">문서</a></li>
                <li><a href="#" className="hover:text-white transition">커뮤니티</a></li>
                <li><a href="#" className="hover:text-white transition">문의</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">법률</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">개인정보처리방침</a></li>
                <li><a href="#" className="hover:text-white transition">이용약관</a></li>
                <li><a href="#" className="hover:text-white transition">쿠키 정책</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2026 회고 아카이브. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition">트위터</a>
              <a href="#" className="text-gray-400 hover:text-white transition">깃헙</a>
              <a href="#" className="text-gray-400 hover:text-white transition">디스코드</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
