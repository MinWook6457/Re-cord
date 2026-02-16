# Record - 흩어지는 일상을 단단한 성장의 기록으로

**Record**는 매일의 회고가 모여 당신의 커리어가 되는 회고 아카이브입니다.  
단순한 일기장을 넘어, 데이터를 통해 나를 발견하는 성장의 기록을 시작하세요.

## 주요 기능

### 🎨 몰입을 돕는 에디터
복잡한 툴바 없이 오직 글쓰기에만 집중하세요.
- 마크다운 지원
- 이미지 드래그 앤 드롭
- 기분 태그로 감정 기록

### 📊 꾸준함의 시각화
잔디를 심듯 하루하루 채워가는 성취감.
- 52주 일관성 히트맵
- 당신의 성실함을 증명해보세요

### 📈 회고 분석 리포트
나도 몰랐던 나의 패턴을 발견하세요.
- 가장 많이 사용한 키워드 분석
- 감정 변화 추이
- 개인 맞춤 인사이트

### 🔒 나만의 프라이빗한 공간
모든 회고는 안전하게 암호화되어 저장됩니다.
- 종단간 암호화 적용
- 언제든지 데이터 내보내기 가능
- 솔직한 이야기를 담을 수 있는 프라이빗한 공간

## 기술 스택

- **프레임워크**: [Next.js 16.1](https://nextjs.org) - React 기반 풀스택 프레임워크
- **스타일링**: [TailwindCSS 4](https://tailwindcss.com) - 유틸리티 기반 CSS
- **아이콘**: [Lucide React](https://lucide.dev) - 깔끔한 아이콘 라이브러리
- **데이터베이스**: [Prisma](https://prisma.io) - ORM
- **인증**: JWT 기반 인증 시스템
- **언어**: TypeScript

## 시작하기

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인하세요.

### 빌드

```bash
npm run build
npm run start
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 홈페이지 (랜딩 페이지)
│   ├── login/             # 로그인 페이지
│   ├── register/          # 회원가입 페이지
│   ├── dashboard/         # 대시보드
│   └── api/               # API 라우트
├── components/            # React 컴포넌트
├── lib/                   # 유틸리티 함수
└── types/                 # TypeScript 타입 정의
```

## 환경 설정

`.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요.

```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

## 데이터베이스 마이그레이션

```bash
npx prisma migrate dev
```

## 더 알아보기

- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Prisma 문서](https://www.prisma.io/docs)

## 라이센스

MIT License - 자유롭게 사용, 수정, 배포할 수 있습니다.
