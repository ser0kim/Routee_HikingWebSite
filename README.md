# Routee_HikingWebSite

루티의 산행 기록 경험을 웹에서 체험하는 인터랙티브 홍보 사이트입니다.

## 주요 기능

- 1인칭·3인칭 산행, 방향 전환과 갈림길 선택
- 시간대에 따른 하늘 변화, 경로와 산행 수치 기록
- 최대 5장 촬영과 기록 이미지 저장
- Figma 기반 앱 편집 체험: 배경·밝기·8색 팔레트·스티커 이동 및 크기 조절
- App Store 및 공식 Instagram 연결

## 로컬 실행

별도 패키지 설치나 빌드 없이 정적 웹 서버로 실행합니다.

```sh
python3 -m http.server 4173 --directory dist
```

브라우저에서 http://localhost:4173 을 엽니다.

## 검증

Node.js가 있는 환경에서 편집 상태 테스트를 실행할 수 있습니다.

```sh
node tests/editor-model.test.cjs
```

## 파일 구성

- `dist/`: 배포 가능한 HTML, CSS, JavaScript 및 자산
- `docs/record-editor.md`: 11개 Figma 화면 대응 및 편집 흐름
- `tests/`: 편집 상태 검증
- `.openai/hosting.json`: 기존 Sites 배포 설정
- `SELFIE-ASSET.md`: 게임 스타일 셀피 이미지 제작 기록

[웹사이트](https://routee-mountain-studio.ratedkid4.chatgpt.site)
