'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Eye,
  Edit3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Link as LinkIcon,
  Quote,
  Heading2,
} from 'lucide-react';

export default function NewRetrospectivePage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('keep');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/retrospectives', {
        method: 'POST',
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
        setError(data.error || '회고 작성 중 오류가 발생했습니다.');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const markdownToolbar = [
    { icon: Heading2, action: () => insertMarkdown('## '), title: '제목' },
    { icon: Bold, action: () => insertMarkdown('**', '**'), title: '굵게' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), title: '기울임' },
    { icon: Code, action: () => insertMarkdown('`', '`'), title: '코드' },
    { icon: List, action: () => insertMarkdown('- '), title: '글머리 기호' },
    { icon: ListOrdered, action: () => insertMarkdown('1. '), title: '번호 목록' },
    { icon: Quote, action: () => insertMarkdown('> '), title: '인용구' },
    { icon: LinkIcon, action: () => insertMarkdown('[', '](url)'), title: '링크' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
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

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">새 회고 작성</h1>
          <p className="text-slate-500 text-sm mt-1">마크다운을 지원합니다. 미리보기를 활용하세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">날짜</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="keep">유지 (Keep)</option>
                <option value="stop">중단 (Stop)</option>
                <option value="start">시작 (Start)</option>
                <option value="improve">개선 (Improve)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="회고 제목을 입력하세요"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">내용</label>
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${!showPreview ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Edit3 size={14} />
                    편집
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${showPreview ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Eye size={14} />
                    미리보기
                  </button>
                </div>
              </div>
            </div>

            {!showPreview && (
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50">
                  {markdownToolbar.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={item.action}
                      title={item.title}
                      className="p-2 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <item.icon size={16} />
                    </button>
                  ))}
                </div>
                <textarea
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  placeholder="마크다운으로 내용을 작성하세요...

## 예시
**굵게**, *기울임*, `코드`

- 목록
- 목록

> 인용구"
                  rows={12}
                  className="w-full px-4 py-3 focus:outline-none resize-none font-mono text-sm"
                />
              </div>
            )}

            {showPreview && (
              <div className="border border-slate-200 rounded-lg p-6 bg-white min-h-[300px] prose prose-slate max-w-none">
                {content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                ) : (
                  <p className="text-slate-400 italic">미리볼 내용이 없습니다.</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">태그 (쉼표로 구분)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="예: 개선, 성능, 팀협업"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-400"
            >
              {loading ? '저장 중...' : '회고 저장'}
            </button>
            <Link
              href="/dashboard"
              className="flex-1 text-center py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              취소
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
