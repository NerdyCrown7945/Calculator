# Math Workspace (Desktop)

Electron + React + TypeScript 기반의 **문서 중심 수학 워크스페이스** 앱입니다.  
한 문서 안에서 Calculator / CAS / Graph / Table / Notes 블록을 조합해 계산, 시각화, 기록을 함께 수행할 수 있습니다.

> 본 프로젝트는 상용 계산기 UI/OS/브랜드 리소스를 복제하지 않고 자체 구현으로 작성되었습니다.

## 핵심 기능
- 문서(Workspace) 생성/열기/저장/다른 이름으로 저장 (JSON)
- 블록 기반 편집
  - Calculator Block (수치 계산)
  - CAS Block (기호 연산)
  - Graph Block (2D Plot)
  - Table/Data Block (x 구간 표 생성 + CSV 내보내기)
  - Notes Block (메모)
- 문서 단위 공통 컨텍스트(변수/함수 공유)
- 각도 모드 토글(라디안/도)

## 기술 스택
- Electron + React + TypeScript (strict)
- 상태관리: Zustand
- 수치 엔진: mathjs
- CAS 엔진: nerdamer
- 그래프: plotly.js

## 프로젝트 구조
- `src/main` : Electron main/preload
- `src/renderer` : React UI 및 블록 컴포넌트
- `src/shared` : 문서 타입/직렬화
- `tests` : Vitest 단위 테스트
- `examples` : 샘플 워크스페이스 문서

## 단계별 구현 이력

### 1단계: Calculator + Notes + 공통 Context + 저장/불러오기 ✅
**실행 방법**
1. `npm install`
2. `npm run dev`
3. Calculator / Notes 블록 추가 후 입력

**검증 체크리스트**
- [ ] `a=3` 후 `sin(a)` 실행 가능
- [ ] Enter 실행 + ↑/↓ 히스토리 탐색
- [ ] 문서 저장 후 재열기 시 블록 복원

### 2단계: Graph Block 추가 ✅
**실행 방법**
1. `npm run dev`
2. Graph 블록 추가
3. `y1, y2, y3` 표현식 입력

**검증 체크리스트**
- [ ] 최대 3개 함수가 동시에 표시
- [ ] x/y 범위 변경 반영
- [ ] Plotly 줌/팬/hover 동작

### 3단계: CAS Block 추가(nerdamer) ✅
**실행 방법**
1. `npm run dev`
2. CAS 블록 추가
3. 아래 명령 실행
   - `simplify((x^2-1)/(x-1))`
   - `factor(x^2-1)`
   - `expand((x+1)^3)`
   - `solve(x^2-4, x)`
   - `derivative(x^3+2*x, x)`
   - `integral(2*x, x)`

**검증 체크리스트**
- [ ] 위 6개 명령 중 최소 4개 정상 동작
- [ ] 미지원 문법 시 "현재 엔진 제한" 메시지 출력

### 4단계: Table/Data + CSV Export + 테스트 보강 ✅
**실행 방법**
1. `npm run dev`
2. Table 블록에서 `f(x), xStart, xEnd, step` 입력
3. `Generate Table` 클릭
4. `Export CSV` 클릭하여 파일 저장

**검증 체크리스트**
- [ ] x, y 테이블이 구간/간격대로 생성
- [ ] CSV 파일 저장 가능
- [ ] 문서 저장/재열기 후 테이블 복원
- [ ] `npm test` 통과 (환경 의존성 충족 시)

## 스크립트
- `npm run dev` : 개발 실행
- `npm run build` : renderer/main 빌드
- `npm run test` : 단위 테스트
- `npm run lint` : ESLint
- `npm run format` : Prettier

## 문서 포맷
모든 워크스페이스 문서는 JSON이며 `version` 필드를 포함합니다.

```json
{
  "version": 1,
  "metadata": { "title": "...", "createdAt": "...", "updatedAt": "..." },
  "settings": { "angleMode": "rad" },
  "blocks": []
}
```

## 예제 문서
- `examples/trigonometry-demo.json`
- `examples/calculus-demo.json`

## 알려진 제한
- CAS는 고급 증명/복잡한 다변수/특수함수 전체를 지원하지 않습니다.
- Degree 모드에서 삼각함수 변환은 간단 치환 기반으로, 복합 표현식 일부에서 한계가 있습니다.
- 패키징(설치파일 생성) 자동화는 후속 작업에서 electron-builder 연동 예정입니다.

## 로드맵
- SymPy 브리지 플러그인 구조 추가
- 블록 간 의존성 그래프 및 자동 재계산 최적화
- 더 풍부한 마크다운 렌더러 및 수식(LaTeX) 미리보기
- 문서 버전 마이그레이션 유틸리티 추가
