# QA TRACK — 게임 QA 직무 가이드 챗봇

Vite + React 프론트엔드와, Anthropic API를 안전하게 호출하는 Vercel 서버리스 프록시(`api/chat.js`)로 구성된 시연용 사이트입니다.

## 폴더 구조
```
qa-track/
├─ api/chat.js        ← API 키를 쓰는 서버 함수 (브라우저에 키 노출 안 됨)
├─ src/App.jsx        ← 화면 + 챗봇 UI
├─ src/main.jsx
├─ index.html
├─ package.json
├─ vite.config.js
└─ .gitignore
```

## A. 로컬에서 먼저 확인 (선택)
```bash
npm install
npm install -g vercel        # 프록시 함수까지 로컬에서 돌리려면 필요
vercel dev                   # http://localhost:3000
```
- 로컬에서 챗봇까지 테스트하려면 프로젝트 루트에 `.env` 파일을 만들고
  `ANTHROPIC_API_KEY=sk-ant-...` 한 줄을 넣으세요. (`.env`는 깃에 안 올라갑니다)
- 화면만 보면 되면 `npm run dev` 로도 충분합니다(이 경우 챗봇 응답은 안 옴).

## B. Vercel로 배포 (추천 · 무료)

1. **GitHub에 올리기**
   - github.com 에서 새 저장소(repository) 생성 → 이 폴더를 push
   ```bash
   git init
   git add .
   git commit -m "init qa-track"
   git branch -M main
   git remote add origin https://github.com/본인계정/qa-track.git
   git push -u origin main
   ```

2. **Vercel 연결**
   - vercel.com 가입(깃허브로 로그인하면 편함)
   - **Add New → Project** → 방금 만든 저장소 선택 → **Import**
   - 프레임워크는 자동으로 Vite로 인식됩니다. 그대로 두세요.

3. **API 키 등록 (가장 중요)**
   - Import 화면 또는 프로젝트 **Settings → Environment Variables** 에서
     - Name: `ANTHROPIC_API_KEY`
     - Value: 발급받은 `sk-ant-...` 키
   - 저장 후 **Deploy** (이미 배포했다면 Deployments에서 Redeploy)

4. 끝나면 `https://qa-track-xxxx.vercel.app` 주소가 나옵니다. 그 주소로 시연하면 됩니다.

## 키를 안전하게 다루는 규칙
- API 키는 오직 Vercel 환경변수 / 로컬 `.env` 에만 둡니다.
- `App.jsx` 같은 프론트엔드 코드나 GitHub에는 절대 넣지 않습니다.
- 시연이 끝나면 console.anthropic.com 에서 키를 삭제(revoke)하면 가장 안전합니다.
