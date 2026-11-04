# 산행 자연 소리

음악 없이 풀벌레 환경음과 풀밭 발자국 녹음을 조합한다. 소리는 기본 ON으로 자동 재생을 시도한다. 브라우저가 자동 재생을 제한하면 대기 상태로 표시하고 첫 클릭·탭·키 입력에서 재생을 시작한다. 대기 또는 로딩 중에도 사용자가 OFF로 바꾸면 자동으로 다시 켜지지 않는다. 버튼은 1인칭·3인칭 토글 옆에 같은 높이로 배치한다. 소리 선택은 현재 방문에서만 유지한다.

## 동작

- 풀벌레: 은은한 반복 재생. 원본 일부에 2초 크로스페이드를 적용해 이음새를 줄였다.
- 발자국: 속도에 따라 달라지는 보폭(약 1.55~1.97m)마다 6개의 짧은 구간을 번갈아 재생한다. 같은 구간 연속 재생을 피하고 좌우·피치를 조금 다르게 적용한다.
- 종료/기록 미리보기: 발자국을 즉시 멈추고 풀벌레 볼륨을 부드럽게 낮춘다.
- 재시작: 켜둔 상태라면 발자국이 다시 이동에 맞춰 나온다.
- 숨겨진 탭: 오디오 컨텍스트를 중지한다. 돌아오면 켜둔 경우에만 다시 재생한다.
- 다운로드/재생 실패: OFF로 유지하고 다시 시도할 수 있는 안내를 표시한다.

## 원본과 이용 조건

두 원본 페이지는 Pixabay Content License 사용 가능으로 표시되어 있다. 원본 음원을 독립 판매/배포하는 대신 산행 인터랙션의 일부로 편집해 사용한다.

- Night Woods — widgetstudios (Freesound), Pixabay freesound_community
  - https://pixabay.com/sound-effects/nature-night-woods-7012/
  - 원본 3:27 중 30초부터 48초 구간을 잘라, 앞뒤 2초를 크로스페이드한 46초 루프. AAC로 압축.
  - 파일: `dist/assets/audio/crickets.m4a`
- Walking through grass — vgraham1 (Freesound), Pixabay freesound_community
  - https://pixabay.com/sound-effects/film-special-effects-walking-through-grass-80308/
  - 녹음의 6개 피크 주변을 각각 0.34초로 편집. 볼륨 보정과 페이드 적용.
  - 파일: `dist/assets/audio/step-1.wav` ~ `step-6.wav`
- License summary: https://pixabay.com/service/license-summary/

## 배포

검토용 ChatGPT 주소에 먼저 반영한다. Cloudflare 자동 배포 브랜치에는 공개 반영 요청 전까지 푸시하지 않는다.

발자국 믹스 게인은 0.48에서 0.22로 낮췄다. 풀벌레 게인은 유지한다.
