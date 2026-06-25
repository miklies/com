# Miklies Portfolio — Setup Guide

GitHub Pages + Supabase로 운영하는 포트폴리오 사이트입니다.

---

## 1. Supabase 프로젝트 만들기

1. [supabase.com](https://supabase.com) 접속 → 회원가입 (무료)
2. **New project** 클릭 → 프로젝트 이름, 비밀번호 설정
3. 프로젝트 생성 완료까지 1~2분 대기

---

## 2. 데이터베이스 테이블 만들기

Supabase 대시보드 → **SQL Editor** → 아래 쿼리 붙여넣기 후 실행:

```sql
CREATE TABLE projects (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  category    text,
  year        integer,
  description text,
  link        text,
  image_path  text,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- 퍼블릭 읽기 허용 (사이트에서 프로젝트 불러오기용)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Anon insert/update/delete" ON projects
  FOR ALL USING (true);
```

---

## 3. Storage 버킷 만들기 (이미지 업로드용)

1. Supabase 대시보드 → **Storage** → **New bucket**
2. 이름: `project-images`
3. **Public bucket** 체크 ✓ → Create

버킷 정책 설정 (SQL Editor에서):
```sql
CREATE POLICY "Public read storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Anon upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Anon delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'project-images');
```

---

## 4. API 키 복사하기

Supabase 대시보드 → **Project Settings** → **API**

- **Project URL** → `supabase-config.js`의 `SUPABASE_URL`에 붙여넣기
- **anon / public key** → `SUPABASE_ANON_KEY`에 붙여넣기

```js
// supabase-config.js
const SUPABASE_URL = 'https://abcdefgh.supabase.co';      // ← 여기
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1Ni...';       // ← 여기
const STORAGE_BUCKET = 'project-images';
```

---

## 5. GitHub Pages 배포

```bash
# 레포 생성 후
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

GitHub 레포 → **Settings** → **Pages** → Source: `main` branch → Save

배포 완료 후 `https://YOUR_USERNAME.github.io/portfolio/` 에서 확인

---

## 파일 구조

```
portfolio/
├── index.html          # 메인 (Hero)
├── about.html          # About 페이지
├── work.html           # Work 페이지 (Supabase에서 불러옴)
├── admin.html          # 어드민 (프로젝트 추가/수정/삭제)
├── style.css           # 공유 스타일
├── nav.js              # 내비게이션
├── supabase-config.js  # ← API 키 입력하는 파일
└── README.md
```

---

## 어드민 접속

`/admin.html`로 직접 접속합니다. 별도 로그인 없이 운영하거나,
나중에 Supabase Auth로 로그인을 추가할 수 있습니다.

> **팁:** 어드민 URL을 공개하지 않으면 사실상 비공개로 운영됩니다.
> 보안을 강화하려면 Supabase RLS 정책에 auth 조건을 추가하세요.
