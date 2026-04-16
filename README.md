# HESTIA Beauty

글루타치온 기반 프리미엄 화장품 브랜드 웹사이트 (Next.js 14 + FastAPI + SQLite)

---

## 아키텍처

```
브라우저
  └── :8082 (nginx)
        ├── /api/*      → backend:8000  (FastAPI + SQLite)
        ├── /static/*   → backend:8000  (업로드 이미지)
        └── /*          → frontend:3000 (Next.js 14)
```

---

## 로컬 개발 실행

```bash
# 백엔드 (터미널 1)
cd backend
PYTHONUTF8=1 /c/Python311/python.exe seed.py          # 최초 1회
PYTHONUTF8=1 /c/Python311/python.exe -m uvicorn app.main:app --reload --port 8000

# 프론트엔드 (터미널 2)
cd frontend
npm install
npm run dev    # http://localhost:3000
```

---

## Docker 배포 (포트 8082)

### 1. 환경변수 확인

`.env.docker` 파일에서 운영 전 반드시 변경:

```env
SECRET_KEY=<랜덤 64자 이상 문자열>
ADMIN_PASSWORD_HASH=<새 bcrypt 해시>
```

새 비밀번호 해시 생성:
```bash
docker run --rm python:3.11-slim sh -c \
  "pip install -q 'bcrypt<4.0' passlib && python -c \
  \"from passlib.context import CryptContext; print(CryptContext(schemes=['bcrypt']).hash('새비밀번호'))\""
```

### 2. 원격 서버 배포 시

`docker-compose.yml`의 `NEXT_PUBLIC_API_URL`을 서버 주소로 변경:
```yaml
args:
  NEXT_PUBLIC_API_URL: "http://서버IP:8082/api"
```

### 3. 빌드 및 실행

```bash
docker compose up -d --build
```

### 4. 접속

| URL | 설명 |
|-----|------|
| `http://localhost:8082` | 웹사이트 |
| `http://localhost:8082/admin/login` | 관리자 페이지 |
| `http://localhost:8082/docs` | FastAPI Swagger |

**관리자 계정:** `admin` / `hestia1234!` (운영 시 변경 필수)

### 5. 유지 관리

```bash
docker compose logs -f        # 로그 확인
docker compose ps             # 상태 확인
docker compose down           # 중지 (데이터 유지)
docker compose down -v        # 중지 + 데이터 삭제 (주의!)
docker compose up -d --build  # 재빌드 후 재시작
```

---

## 데이터 볼륨

| 볼륨 | 내용 |
|------|------|
| `hestia_db_data` | SQLite DB (`hestia.db`) |
| `hestia_uploads` | 업로드 제품 이미지 |
