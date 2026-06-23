/* =========================================================================
 *  프로그램 데이터
 *  -------------------------------------------------------------------------
 *  여기에서 프로그램 정보를 수정/추가하면 사이트에 바로 반영됩니다.
 *
 *  각 프로그램 항목 설명:
 *    name      : 프로그램 이름 (화면에 보이는 제목)
 *    tool      : 만든 도구  ("제미나이" 또는 "캔바 AI")
 *    site      : 프로그램 사이트 링크
 *                  basic   - 기본 버전 주소 (없으면 "")
 *                  applied - 응용 버전 주소 (없으면 "")
 *    prompt    : 프롬프트 (※ 나중에 여기에 붙여넣으면 됩니다)
 *                  basic   - 기본 프롬프트
 *                  applied - 응용 프롬프트
 *
 *  category 는 화면 위쪽 분류입니다. (학급경영 / 교과연계)
 * ========================================================================= */

const PROGRAMS = [
  /* ===================== 1) 학급경영 프로그램 (1~20) ===================== */
  {
    category: "학급경영",
    name: "독서 기록",
    tool: "제미나이",
    site: { basic: "", applied: "" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "우정 네컷",
    tool: "제미나이",
    site: { basic: "", applied: "" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "1인 1역 랜덤뽑기",
    tool: "캔바 AI",
    site: { basic: "", applied: "https://majang2026.my.canva.site/c90ng62h66zxwkxm" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "아침 한자 쓰기",
    tool: "제미나이",
    site: { basic: "https://share.gemini.google/8LShJSUkagAG", applied: "https://share.gemini.google/gXE6v52AeRzW" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "학급 신문 자동 생성기",
    tool: "제미나이",
    site: { basic: "", applied: "https://gemini.google.com/share/681a1e228b60" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "마음을 전하는 라디오",
    tool: "캔바 AI",
    site: { basic: "https://classroom-radio.my.canva.site/on-air", applied: "https://classroom-radio.my.canva.site/version2" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "감정 출석부",
    tool: "제미나이",
    site: { basic: "https://share.gemini.google/vuFBBecPUGrI", applied: "https://share.gemini.google/MOtYVaSIlha3" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "롤링페이퍼 생성기",
    tool: "제미나이",
    site: { basic: "https://share.gemini.google/aUVrMDZAJPQS", applied: "https://share.gemini.google/ykyR85zDQxUW" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "학급 규칙 만들기",
    tool: "캔바 AI",
    site: { basic: "https://classroom-radio.my.canva.site/classrule-maker1", applied: "https://classroom-radio.my.canva.site/classrules-maker2" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "학급 달력 생성기",
    tool: "제미나이",
    site: { basic: "https://share.gemini.google/ezzB6H06Gv5M", applied: "https://share.gemini.google/gnQyWgpstfOb" },
    prompt: {
      basic: `<학급 달력 생성기 기본 프롬프트>

[역할 설정]
초등학교 교사이자 웹 개발자로서, 코딩을 모르는 교사도 즉시 쓸 수 있는 단일 HTML 파일(CSS·JS 내장) 기반 웹앱을 만들어 줘. 매달 학급 사진과 일정을 모아 교실 게시판에 붙일 '우리 반 추억 달력'을 만들고 이미지로 저장하는 도구야.

[웹 서비스 개요]
- 이름: 우리 반 추억 달력 만들기
- 목적: 매달 학급 단체 사진·활동 작품을 올리고 그달의 행사·일정을 예쁜 스티커와 함께 기록해, 교실 게시용 달력을 만들어 고해상도 이미지로 저장하는 프로그램
- 화면 구성: 칠판 느낌 헤더 + 가로 3단 대시보드(왼쪽: 월·일정 / 가운데: 꾸미기 도구 / 오른쪽: 최종 달력 미리보기). PC·태블릿 반응형.

[핵심 기능 1 - 헤더]
- 칠판 나무 테두리 보드 디자인에 '우리반추억' 분필 뱃지와 타이틀을 둬줘.
- 학급 이름 입력칸(기본 '4학년 4반')과 '전체 초기화' 버튼(확인 모달 후 초기화)을 둬줘. 학급 이름은 입력 즉시 달력에도 반영돼.

[핵심 기능 2 - 왼쪽 칸: 월 선택 & 일정]
- 1~12월 버튼 그리드로 월을 선택해줘. 사진·일정이 등록된 달에는 '완료' 표시를 띄워줘.
- 그달의 등록된 행사·일정을 요약 리스트로 보여주고, 그 아래 미니 달력(요일 헤더 포함)을 둬서 날짜를 클릭하면 일정 등록 모달이 열리게 해줘.

[핵심 기능 3 - 가운데 칸: 달력 꾸미기 도구]
- '파일 올리기 / 카메라 촬영' 두 개 탭으로 이달의 사진을 넣게 해줘. 파일 업로드 시 미리보기를 보여주고, 카메라 탭은 영상 미리보기 후 촬영해 캡처할 수 있게 해줘.
- 넣은 이미지를 달력 프레임에 맞춰 자동으로 잘라 채우고(object-cover), 크기 비율(Zoom 1~3배)·좌우(X)·상하(Y) 위치를 슬라이더로 미세조정 + '위치 초기화' 버튼을 둬줘.

[핵심 기능 4 - 오른쪽 칸: 최종 달력 미리보기 & 저장]
- 상단에 이달의 사진 영역, 하단에 날짜 그리드(연·월 표시, ◀▶ 월 이동 화살표)를 가진 달력 플레이트를 보여줘. 학급 슬로건 입력칸은 손글씨 폰트로, 입력 즉시 반영돼.
- 등록된 일정은 날짜 칸에 아이콘 스티커 + 메모로 표시해줘.
- 월마다 테두리·글자 색이 달라지는 12개월 테마 색상을 적용해줘.
- '달력 JPG 저장' 버튼: html2canvas로 달력 영역만 고해상도(2배 스케일)로 캡처해 '학급명_O월_학급달력.jpg'로 내려받게 해줘. 저장 시 입력창은 텍스트로, 월 이동 화살표는 잠깐 숨겨 깔끔하게 찍히게 해줘.

[핵심 기능 5 - 일정 등록 모달]
- 날짜 클릭 시 모달에서 일정·메모를 입력하고 아이콘 스티커를 고르게 해줘: ✏공부/수업, 축제/행사, 생일축하, 야외활동, 중요함, 사진촬영.
- 등록/취소 버튼과, 기존 일정이 있을 때만 보이는 삭제 버튼(확인 모달 후 삭제)을 둬줘.

[데이터 저장]
- 학급 이름, 슬로건, 월별 사진·이미지 조정값·일정/스티커를 모두 localStorage에 저장해 새로고침 후에도 유지해줘. '전체 초기화' 때만 비워줘.
- 기본값은 2026년, 4월, '4학년 4반'으로 시작해줘.

[디자인]
- 칠판 분위기: 딥그린 배경에 점 패턴, 나무색 테두리, 반투명 카드. 포인트는 노랑(분필) 계열.
- 폰트는 분필 타이틀 Gaegu, 손글씨 슬로건 Nanum Pen Script, 본문 Gowun Dodum을 사용해줘.
- 모든 alert·confirm은 브라우저 기본창 대신 커스텀 모달로 대체해줘.

[기술 요구사항]
- 단일 HTML 파일. Tailwind(CDN), Lucide 아이콘, Google Fonts, 이미지 저장용 html2canvas만 불러와 써줘.
- 화면 전환·팝업은 페이지 이동 없이 섹션·모달 show/hide로 구현해줘.`,
      applied: `[응용 프롬프트]
기존의 웹 애플리케이션에 학생들이 사진 대신 직접 그림을 그려 넣을 수 있는 직접 그리기 기능을 추가해줘. 꾸미기 보드 상단에 직접 그리기, 파일 올리기, 카메라 촬영 세 개의 탭을 만들고, 직접 그리기 탭에는 그림을 그릴 수 있는 캔버스를 넣어줘. 흰색・노랑・빨강・파랑・초록・주황의 추천 분필색 버튼과 색상 선택기, 붓 두께를 조절하는 슬라이더, 지우개와 비우기 버튼을 함께 제공해줘. 그림을 다 그린 뒤 [다 그린 작품 달력에 넣기] 버튼을 누르면 캔버스에 그린 그림이 해당 월 달력 상단 이미지 영역에 들어가도록 해줘. 모든 기능은 모바일에서도 잘 작동하도록 반응형으로 구성하고, 에러 없이 바로 실행 가능해야 해.`,
    },
  },
  {
    category: "학급경영",
    name: "폭탄 돌리기",
    tool: "캔바 AI",
    site: { basic: "https://kwi07.my.canva.site/bomb1", applied: "https://kwi07.my.canva.site/bomb2" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "우유 마시기 키오스크",
    tool: "캔바 AI",
    site: { basic: "https://kwi07.my.canva.site/milk1", applied: "https://kwi07.my.canva.site/milk2" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "발표 자막 생성기",
    tool: "제미나이",
    site: { basic: "https://share.gemini.google/cIGANn4PH6tQ", applied: "https://share.gemini.google/4UmEqDjP7Rcb" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "도전 골든벨 보드판",
    tool: "캔바 AI",
    site: { basic: "https://kwi07.my.canva.site/board1", applied: "https://kwi07.my.canva.site/board2" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "교실 화폐 통장과 거래소",
    tool: "캔바 AI",
    site: { basic: "https://kwi07.my.canva.site/reward1", applied: "https://kwi07.my.canva.site/reward2" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "학급 칭찬 샤워",
    tool: "제미나이",
    site: { basic: "https://gemini.google.com/share/20be5206ef7b", applied: "" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "마음을 다스리는 명상",
    tool: "제미나이",
    site: { basic: "https://gemini.google.com/share/b1584fd6a08e", applied: "https://gemini.google.com/share/ff77257c831e" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "학급 자리 배치",
    tool: "제미나이",
    site: { basic: "https://gemini.google.com/share/57fae35d59b3", applied: "https://gemini.google.com/share/2e06b947d250" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "마니또 미션 생성기",
    tool: "캔바 AI",
    site: { basic: "https://ddobagissem.my.canva.site/mission1", applied: "" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "학급경영",
    name: "학급 회의 보조 도구",
    tool: "캔바 AI",
    site: { basic: "https://ddobagissem.my.canva.site/meeting1", applied: "" },
    prompt: { basic: "", applied: "" },
  },

  /* ===================== 2) 교과연계 프로그램 (21~40) ===================== */
  {
    category: "교과연계",
    name: "[국어] 낱말찾기",
    tool: "제미나이",
    site: { basic: "", applied: "https://gemini.google.com/share/3c74cc40608c" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[국어] 끝말잇기",
    tool: "캔바 AI",
    site: { basic: "https://majang2026.my.canva.site/c9n1ax86xnddbmd8", applied: "" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[통합] 신비한 그림 세계",
    tool: "제미나이",
    site: { basic: "https://gemini.google.com/share/c1f014d8876a", applied: "https://gemini.google.com/share/fc7a1bf27b06" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[통합] 한국 전통 장신구 사진관",
    tool: "제미나이",
    site: { basic: "https://gemini.google.com/share/f530650461bf", applied: "" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[실과] 꿈 직업 탐색기",
    tool: "캔바 AI",
    site: { basic: "https://edupongpong.my.canva.site/camye5zjh4kt03sk", applied: "" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[과학] 초성 퀴즈 게임",
    tool: "제미나이",
    site: { basic: "https://share.gemini.google/ZEgkxCQZeOsK", applied: "https://share.gemini.google/Oh1gg3zXGZW0" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[국어] 발표 평가 프로그램",
    tool: "캔바 AI",
    site: { basic: "https://classroom-radio.my.canva.site/feedback1", applied: "https://classroom-radio.my.canva.site/feedback2" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[과학] 지레 이용하기 게임",
    tool: "제미나이",
    site: { basic: "https://gemini.google.com/share/cbdbded92801", applied: "https://share.gemini.google/wKT4GK0mfmbg" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[과학] 빛의 성질 게임",
    tool: "제미나이",
    site: { basic: "https://share.gemini.google/XSGdjd3GrkKE", applied: "https://share.gemini.google/LI02cq3L98fe" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[영어] Word puzzle 생성기",
    tool: "제미나이",
    site: { basic: "https://share.gemini.google/f1wVsB1AFWKc", applied: "https://share.gemini.google/bI3z4U0DqukR" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[국어] 포토 편지 쓰기",
    tool: "제미나이",
    site: { basic: "https://share.gemini.google/9pCeVYtQou41", applied: "https://share.gemini.google/J2N2X9i9h3NH" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[수학] AR 각도기",
    tool: "제미나이",
    site: { basic: "https://gemini.google.com/share/b2b7b55600cf", applied: "https://gemini.google.com/share/4348ca78d630" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[사회] 선택의 문제 월드컵",
    tool: "제미나이",
    site: { basic: "https://share.gemini.google/6v1ev9vpUOEg", applied: "https://share.gemini.google/uIXRkgq4njIa" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[미술] 어떤 사진일까 퀴즈",
    tool: "제미나이",
    site: { basic: "https://gemini.google.com/share/23e1d5df702e", applied: "https://gemini.google.com/share/927221bc48fc" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[과학] 나만의 별자리 만들기",
    tool: "제미나이",
    site: { basic: "https://gemini.google.com/share/9c4502543945", applied: "https://gemini.google.com/share/d3054863de60" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[국어] 질문 만들기 슬롯 머신",
    tool: "제미나이",
    site: { basic: "https://gemini.google.com/share/ccf2bfd11df6", applied: "" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[음악] 셈여림 시각화 도구",
    tool: "제미나이",
    site: { basic: "https://gemini.google.com/share/e80491b5c266", applied: "https://gemini.google.com/share/46ac6da9801e" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[실과] 우리 반 분리수거 마스터",
    tool: "캔바 AI",
    site: { basic: "https://ddobagissem.my.canva.site/trash1", applied: "" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[도덕] 예쁜 말 화분 만들기",
    tool: "제미나이",
    site: { basic: "https://gemini.google.com/share/763b5b9fedc0", applied: "https://gemini.google.com/share/7c14d93e3992" },
    prompt: { basic: "", applied: "" },
  },
  {
    category: "교과연계",
    name: "[사회] 역사 인물 비밀 일기장",
    tool: "캔바 AI",
    site: { basic: "https://ddobagissem.my.canva.site/history1", applied: "" },
    prompt: { basic: "", applied: "" },
  },
];
