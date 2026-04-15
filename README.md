# Hestia Beaute

FastAPI 기반 화장품 웹사이트 프로토타입입니다.

## 실행 방법

1. 가상환경 활성화
   - PowerShell: `.\.venv\Scripts\Activate.ps1`
   - CMD: `\.venv\Scripts\activate.bat`
2. 패키지 설치
   - `pip install -r requirements.txt`
3. 서버 실행
   - `uvicorn app.main:app --reload`

## 기능
- `/` 접속 시 `지금 웹사이트 개발을 진행하고 있습니다.` 메시지가 표시됩니다.

## 문제 해결
- Windows에서 `gh copilot --help` 또는 Copilot CLI를 사용하려면 PowerShell 6+ (예: PowerShell 7)가 필요합니다. 설치: https://aka.ms/powershell 또는 `winget install PowerShell`. 시스템에 pwsh가 없으면 일부 CLI 명령이 실패할 수 있습니다.
- 이 저장소에 포함된 로컬 가상환경(.venv)은 일반적으로 깃에 커밋하지 않습니다. .venv를 제거하려면 저장소에서 해당 디렉터리를 삭제하고 `.gitignore`에 `.venv/`를 추가하세요.

