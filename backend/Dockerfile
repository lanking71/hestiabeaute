FROM python:3.11-slim

WORKDIR /app

# 시스템 의존성
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 파이썬 패키지 설치
# passlib 1.7.x 와 호환되는 bcrypt 버전 고정
COPY requirements.txt .
RUN pip install --no-cache-dir "bcrypt<4.0" && \
    pip install --no-cache-dir -r requirements.txt

# 앱 코드 복사
COPY . .

# 업로드 디렉토리 생성 및 entrypoint 실행 권한 부여
RUN mkdir -p static/uploads/products && \
    chmod +x entrypoint.sh

EXPOSE 8000

# entrypoint: DB 초기화 + 카테고리 시드 + uvicorn 실행
ENTRYPOINT ["sh", "entrypoint.sh"]
