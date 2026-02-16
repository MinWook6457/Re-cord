'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  userName?: string;
  showNewButton?: boolean;
}

export default function DashboardHeader({
  userName = '',
  showNewButton = true,
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b" style={{ borderColor: 'var(--color-primary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-3 text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
          <img src="/record_logo.jpg" alt="Re:Cord 로고" className="w-8 h-8 rounded" />
          회고 아카이브
        </Link>
        <div className="flex items-center space-x-6">
          {userName && <span className="text-gray-600">{userName}님 환영합니다</span>}
          {showNewButton && (
            <Link
              href="/dashboard/new"
              className="px-4 py-2 text-white rounded-lg font-medium transition-colors gradient-primary"
            >
              + 새 회고
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 transition-colors font-medium rounded-lg"
            style={{ color: 'var(--color-primary)', backgroundColor: 'rgba(118, 176, 166, 0.1)' }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
}
