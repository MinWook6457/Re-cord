import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// GET: 모든 회고 조회 (인증된 사용자)
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth();

    if (!auth) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const retrospectives = await prisma.retrospective.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = retrospectives.map((r: any) => ({
      ...r,
      tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : r.tags,
    }));

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    console.error('GET retrospectives error:', error);
    return NextResponse.json(
      { error: '회고 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새로운 회고 생성
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth();

    if (!auth) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const { date, title, category, content, tags } = await request.json();

    if (!date || !title || !category || !content) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const retrospective = await prisma.retrospective.create({
      data: {
        date,
        title,
        category,
        content,
        tags: JSON.stringify(tags || []),
        userId: auth.userId,
      },
    });

    const parsed = {
      ...retrospective,
      tags: typeof retrospective.tags === 'string' ? JSON.parse(retrospective.tags) : retrospective.tags,
    };

    return NextResponse.json(parsed, { status: 201 });
  } catch (error) {
    console.error('POST retrospective error:', error);
    return NextResponse.json(
      { error: '회고 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
