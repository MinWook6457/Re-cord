import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// GET: 특정 회고 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await verifyAuth();

    if (!auth) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const retrospective = await prisma.retrospective.findUnique({
      where: { id },
    });

    if (!retrospective || retrospective.userId !== auth.userId) {
      return NextResponse.json(
        { error: '회고를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const parsed = {
      ...retrospective,
      tags: typeof retrospective.tags === 'string' ? JSON.parse(retrospective.tags) : retrospective.tags,
    };

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    console.error('GET retrospective error:', error);
    return NextResponse.json(
      { error: '회고 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 회고 업데이트
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await verifyAuth();

    if (!auth) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const retrospective = await prisma.retrospective.findUnique({
      where: { id },
    });

    if (!retrospective || retrospective.userId !== auth.userId) {
      return NextResponse.json(
        { error: '회고를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const { date, title, category, content, tags } = await request.json();

    const updated = await prisma.retrospective.update({
      where: { id },
      data: {
        date,
        title,
        category,
        content,
        tags: JSON.stringify(tags || []),
      },
    });

    const parsed = {
      ...updated,
      tags: typeof updated.tags === 'string' ? JSON.parse(updated.tags) : updated.tags,
    };

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    console.error('PUT retrospective error:', error);
    return NextResponse.json(
      { error: '회고 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 회고 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await verifyAuth();

    if (!auth) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const retrospective = await prisma.retrospective.findUnique({
      where: { id },
    });

    if (!retrospective || retrospective.userId !== auth.userId) {
      return NextResponse.json(
        { error: '회고를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await prisma.retrospective.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: '회고가 삭제되었습니다.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE retrospective error:', error);
    return NextResponse.json(
      { error: '회고 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
