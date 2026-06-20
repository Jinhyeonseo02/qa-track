import React, { useState, useRef, useEffect } from "react";
import { Send, Bug, BookOpen, Award, Map, Loader2, Gamepad2, ChevronRight, Megaphone, Server, ArrowLeft, Sparkles } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// 게임 QA 데이터
// ─────────────────────────────────────────────────────────────
const QA_ROADMAP = [
  { phase: "01", title: "기초 다지기", period: "1~2학년", color: "#7C4DFF", items: ["컴퓨터 구조 · 운영체제 기본 이해", "프로그래밍 입문 (C / Python)", "게임을 '플레이어'가 아닌 '분석가'로 보는 습관 들이기", "버그 리포트 작성 연습 (재현 절차 기록)"] },
  { phase: "02", title: "테스트 역량 키우기", period: "2~3학년", color: "#536DFE", items: ["소프트웨어 공학 / 소프트웨어 테스팅 과목 수강", "테스트 케이스 설계 · 결함 관리 프로세스 학습", "Jira, TestRail 등 이슈 트래킹 툴 익히기", "SQL 기초 (로그·DB 데이터 확인용)"] },
  { phase: "03", title: "전문성 확보", period: "3~4학년", color: "#00BFA5", items: ["게임 엔진 (Unity / Unreal) 구조 이해", "자동화 테스트 입문 (Python + Selenium / Appium)", "네트워크 기초 (멀티플레이 QA 대비)", "토이 게임 프로젝트로 직접 QA 사이클 경험"] },
  { phase: "04", title: "취업 준비", period: "4학년~", color: "#FF6E40", items: ["QA 포트폴리오 (버그 리포트 · 테스트 계획서)", "관련 자격증 취득", "인턴 / 외주 QA 경험 쌓기", "도메인 지식 (장르별 게임 특성) 정리"] },
];
const QA_COURSES = [
  { name: "소프트웨어 공학", why: "컴퓨터공학과 전공. 테스트 프로세스와 SDLC의 핵심. QA의 뼈대.", tag: "필수" },
  { name: "자료구조", why: "컴퓨터공학과 기초 전공. 자동화 스크립트와 논리적 재현 절차의 토대.", tag: "필수" },
  { name: "운영체제", why: "크래시·메모리 누수 등 시스템 레벨 버그를 분석하는 기반 지식.", tag: "권장" },
  { name: "데이터베이스", why: "게임 로그·아이템·재화 데이터 검증(SQL)에 필수.", tag: "권장" },
  { name: "컴퓨터 네트워크", why: "멀티플레이·서버 QA, 패킷·지연 이슈 이해.", tag: "권장" },
  { name: "알고리즘", why: "테스트 케이스 설계와 자동화 로직 작성에 필요한 사고력.", tag: "권장" },
  { name: "게임 스토리텔링 (Game Storytelling)", why: "디지털콘텐츠학부 과목. 게임 구조·시나리오를 이해해 QA 시나리오 설계.", tag: "심화" },
  { name: "인터랙티브 콘텐츠 실습", why: "디지털콘텐츠학부 과목. 게임·인터랙션 제작 경험으로 버그 원인 추적이 빨라짐.", tag: "권장" },
];
const QA_CERTS = [
  { name: "ISTQB Foundation Level", org: "국제 SW 테스팅 자격", note: "QA의 글로벌 표준. 가장 추천되는 핵심 자격증.", level: "★★★" },
  { name: "정보처리기사", org: "한국산업인력공단", note: "전공자 기본 스펙. SW 전반 지식 증명.", level: "★★★" },
  { name: "SQLD (SQL 개발자)", org: "한국데이터산업진흥원", note: "데이터 검증 직무에서 가산점.", level: "★★" },
  { name: "리눅스마스터", org: "KAIT", note: "서버 환경 QA에 유리.", level: "★" },
];
const QA_SUGGESTED = ["게임 QA가 정확히 무슨 일을 하나요?", "ISTQB 자격증 꼭 따야 하나요?", "신입 QA 포트폴리오는 어떻게 만들죠?", "좋은 버그 리포트 작성법 알려줘", "QA 직무 연봉은 어느 정도예요?"];
const QA_SYSTEM = `# 당신의 정체성
당신은 "지우"라는 이름의 13년 차 시니어 게임 QA 엔지니어입니다. 대형 게임사(넥슨·엔씨 규모)에서 MMORPG와 모바일 게임의 출시 QA를 이끌었고, 지금은 QA 리드로 신입을 멘토링합니다. 컴퓨터공학 전공 후배들이 게임 QA로 진로를 잡도록 돕는 진로 멘토 역할을 맡고 있습니다.

# 페르소나 & 말투
- 자신을 "지우 멘토"라고 칭하며, 후배를 따뜻하게 챙기되 핵심은 직설적으로 짚는 현업 선배 톤.
- 실제 경험에서 우러난 말투를 씁니다. "내가 신입 때는…", "현업에서 보면…", "면접관 입장에서는…" 같은 표현을 자연스럽게 섞으세요.
- 막연한 격려보다 "그래서 이번 주에 뭘 하면 되는지"를 알려주는 실용주의자.

# 답변 규칙
- 한국어로, 따뜻하지만 핵심을 찌르는 멘토 말투. 적당히 친근한 반말 섞인 존댓말("~예요", "~해봐요") 톤.
- 너무 길지 않게. 보통 3~6문장. 단계나 항목이 있으면 짧은 '-' 목록 사용.
- 가능하면 구체적인 예시(실제 버그 사례, 리포트 양식, 면접 질문, 추천 학습 순서)를 들어 설명.
- 학생이 오늘·이번 주에 바로 실행할 수 있는 액션 한 가지를 답변 끝에 제안.
- 다루는 주제: 테스트 케이스 설계, 버그 리포트, 자동화/회귀/호환성/네트워크 테스트, 출시 전 QA 사이클, 필요 역량·과목·자격증·포트폴리오·연봉·커리어패스.
- 게임 QA와 전혀 무관한 질문이면, 자신은 게임 QA 진로 멘토라 그 주제는 돕기 어렵다고 정중히 안내하고 관련 질문으로 유도.
- 마크다운 헤더(#)는 쓰지 말고, 필요시 '-' 목록만 사용.`;

// ─────────────────────────────────────────────────────────────
// 콘텐츠 마케터 데이터
// ─────────────────────────────────────────────────────────────
const MKT_ROADMAP = [
  { phase: "01", title: "기초 이해", period: "1~2학년", color: "#FF6B9D", items: ["마케팅 · 경영학 기초 개념 학습", "SNS 플랫폼별 특성 파악 (인스타그램, 유튜브, TikTok 등)", "카피라이팅 · 스토리텔링 기초 연습", "글쓰기 습관 만들기 (블로그, 브런치 운영)"] },
  { phase: "02", title: "콘텐츠 제작 역량", period: "2~3학년", color: "#FF9800", items: ["영상 편집 툴 익히기 (Premiere Pro / CapCut)", "디자인 기초 (Canva / Figma)", "SEO 개념 및 키워드 전략 학습", "콘텐츠 캘린더 기획 · 운영 경험"] },
  { phase: "03", title: "데이터 기반 마케팅", period: "3~4학년", color: "#4CAF50", items: ["Google Analytics · Meta Ads 데이터 분석", "A/B 테스트 기획 및 성과 측정", "브랜드 아이덴티티 · 타겟 페르소나 설정", "인플루언서 마케팅 · 바이럴 캠페인 기획"] },
  { phase: "04", title: "취업 준비", period: "4학년~", color: "#9C27B0", items: ["마케팅 포트폴리오 제작 (캠페인 성과 수치 포함)", "SNS 채널 직접 운영 · 팔로워 성장 사례 만들기", "관련 자격증 취득", "스타트업 / 브랜드 인턴 경험"] },
];
const MKT_COURSES = [
  { name: "콘텐츠 마케팅·브랜딩 실습", why: "디지털콘텐츠학부 핵심 실습. 실제 콘텐츠 마케팅 캠페인을 직접 기획·운영.", tag: "필수" },
  { name: "브랜드 전략 (브랜드의 이해)", why: "브랜드 아이덴티티 설계의 기초. 콘텐츠 일관성의 뼈대.", tag: "필수" },
  { name: "광고의 이해 / PR의 이해", why: "미디어커뮤니케이션학부 광고PR브랜딩 전필. 메시지 설계와 미디어 기획.", tag: "필수" },
  { name: "콘텐츠 데이터 분석·통계", why: "콘텐츠 성과 측정과 인사이트 도출. 데이터 기반 마케팅의 핵심.", tag: "권장" },
  { name: "시장조사 (Market Research)", why: "타겟 페르소나·시장 수요 파악. 콘텐츠 기획의 근거.", tag: "권장" },
  { name: "디지털 콘텐츠 산업과 플랫폼", why: "유튜브·인스타·틱톡 등 플랫폼별 생태계와 유통 구조 이해.", tag: "권장" },
  { name: "뉴미디어 테크놀로지", why: "방송영상뉴미디어 전공 과목. 숏폼·뉴미디어 콘텐츠 트렌드 이해.", tag: "권장" },
  { name: "AI for Content Business", why: "AI 도구를 활용한 콘텐츠 기획·제작 자동화. 차세대 필수 역량.", tag: "심화" },
];
const MKT_CERTS = [
  { name: "구글 애널리틱스 자격증 (GA4)", org: "Google", note: "디지털 마케터 필수. 데이터 기반 의사결정 증명.", level: "★★★" },
  { name: "메타 디지털 마케팅 자격증", org: "Meta Blueprint", note: "Facebook·Instagram 광고 실무 역량.", level: "★★★" },
  { name: "검색광고마케터", org: "한국인터넷진흥원", note: "네이버·구글 검색광고 운영 국가 자격.", level: "★★" },
  { name: "GTQ (그래픽기술자격)", org: "한국생산성본부", note: "디자인 툴 활용 능력 증명.", level: "★" },
];
const MKT_SUGGESTED = ["콘텐츠 마케터가 하루에 하는 일이 뭔가요?", "포트폴리오에 꼭 넣어야 할 게 뭐예요?", "SNS 채널 없이 취업 가능한가요?", "구글 애널리틱스 자격증 어떻게 준비해요?", "콘텐츠 마케터 연봉은 어느 정도예요?"];
const MKT_SYSTEM = `# 당신의 정체성
당신은 "서연"이라는 이름의 10년 차 콘텐츠 마케터입니다. 스타트업과 D2C 브랜드에서 시작해 지금은 IT 기업의 콘텐츠 마케팅 팀 리드로 일합니다. 인스타그램·유튜브·틱톡 채널을 0에서 수십만 팔로워까지 키운 경험이 있고, 퍼포먼스 광고와 브랜디드 콘텐츠를 모두 다룹니다. 마케터를 꿈꾸는 학생들의 진로 멘토 역할을 맡고 있습니다.

# 페르소나 & 말투
- 자신을 "서연 멘토"라고 칭하며, 트렌드에 밝고 에너지 있는 현업 선배 톤.
- 실전 경험을 녹여 말합니다. "내가 운영하던 채널에서는…", "이건 면접 포트폴리오에서 꼭 묻는 거예요", "요즘 알고리즘은…" 같은 표현을 자연스럽게.
- 추상적 이론보다 "어떤 콘텐츠를, 어떤 수치 목표로, 어떻게" 만드는지를 알려주는 실전형.

# 답변 규칙
- 한국어로, 따뜻하고 활기차되 핵심을 찌르는 멘토 말투("~예요", "~해봐요") 톤.
- 너무 길지 않게. 보통 3~6문장. 단계나 항목이 있으면 짧은 '-' 목록 사용.
- 가능하면 구체적인 예시(실제 캠페인 사례, 콘텐츠 포맷, 측정 지표, 포트폴리오 구성, 면접 질문)를 들어 설명.
- 학생이 오늘·이번 주에 바로 실행할 수 있는 액션 한 가지를 답변 끝에 제안(예: "이번 주에 릴스 3개 기획해서 올려봐요").
- 다루는 주제: SNS 운영, 카피라이팅, 영상/숏폼 제작, 데이터 분석, 캠페인·브랜딩 기획, 필요 역량·과목·자격증·포트폴리오·연봉·커리어패스.
- 콘텐츠 마케팅과 전혀 무관한 질문이면, 자신은 콘텐츠 마케터 진로 멘토라 그 주제는 돕기 어렵다고 정중히 안내하고 관련 질문으로 유도.
- 마크다운 헤더(#)는 쓰지 말고, 필요시 '-' 목록만 사용.`;

// ─────────────────────────────────────────────────────────────
// 인프라 엔지니어 데이터
// ─────────────────────────────────────────────────────────────
const INFRA_ROADMAP = [
  { phase: "01", title: "기초 다지기", period: "1~2학년", color: "#00BCD4", items: ["컴퓨터 네트워크 · 운영체제 개념 탄탄히", "Linux 기본 명령어 · 쉘 스크립트 입문", "가상화 개념 이해 (VM, 컨테이너)", "클라우드 서비스 맛보기 (AWS Free Tier)"] },
  { phase: "02", title: "핵심 역량 구축", period: "2~3학년", color: "#3F51B5", items: ["Docker 컨테이너화 실습", "Linux 서버 관리 · Nginx / Apache 설정", "Git 버전 관리 · CI/CD 파이프라인 개념", "모니터링 툴 입문 (Grafana, Prometheus)"] },
  { phase: "03", title: "클라우드 · DevOps", period: "3~4학년", color: "#009688", items: ["AWS / GCP / Azure 주요 서비스 실습", "Kubernetes 오케스트레이션", "Terraform · IaC(Infrastructure as Code)", "보안 기초 · 네트워크 방화벽 · IAM 설정"] },
  { phase: "04", title: "취업 준비", period: "4학년~", color: "#FF5722", items: ["인프라 포트폴리오 (아키텍처 설계 문서 포함)", "클라우드 자격증 취득", "오픈소스 기여 · 사이드 프로젝트 배포 경험", "장애 대응 경험 (온콜, 포스트모템 작성)"] },
];
const INFRA_COURSES = [
  { name: "컴퓨터 네트워크", why: "TCP/IP, DNS, 라우팅 등 인프라 전 영역의 기반.", tag: "필수" },
  { name: "운영체제", why: "프로세스·메모리·파일시스템 이해. 서버 운영 핵심.", tag: "필수" },
  { name: "클라우드 컴퓨팅", why: "AWS·GCP·Azure 구조와 서비스 개념 직접 학습.", tag: "권장" },
  { name: "데이터베이스", why: "RDS·NoSQL 운영, 백업·복구 전략 수립에 필요.", tag: "권장" },
  { name: "시스템 프로그래밍", why: "저수준 이해로 성능 병목·크래시 원인 파악.", tag: "권장" },
  { name: "정보보안 / 네트워크 보안", why: "인프라 보안 설계와 침해 대응의 필수 기초.", tag: "심화" },
  { name: "소프트웨어 공학", why: "DevOps·CI/CD 파이프라인 설계에 필요한 SDLC 이해.", tag: "권장" },
];
const INFRA_CERTS = [
  { name: "AWS Solutions Architect Associate", org: "Amazon Web Services", note: "클라우드 인프라 설계 능력 글로벌 인증. 가장 수요 높음.", level: "★★★" },
  { name: "정보처리기사", org: "한국산업인력공단", note: "전공자 기본 스펙. 네트워크·운영체제 지식 증명.", level: "★★★" },
  { name: "리눅스마스터 1급", org: "KAIT", note: "Linux 서버 관리 실무 역량 증명.", level: "★★" },
  { name: "CCNA (Cisco 네트워킹)", org: "Cisco", note: "네트워크 설계·운영 역량. 인프라 전문가 인증.", level: "★★" },
];
const INFRA_SUGGESTED = ["인프라 엔지니어가 실제로 하는 일이 뭔가요?", "AWS 자격증 어디서부터 시작해야 해요?", "신입 인프라 포트폴리오는 어떻게 만들죠?", "DevOps랑 인프라 엔지니어 차이가 뭐예요?", "인프라 엔지니어 연봉은 어느 정도예요?"];
const INFRA_SYSTEM = `# 당신의 정체성
당신은 "준호"라는 이름의 12년 차 시니어 인프라 엔지니어입니다. 대형 IT 기업과 클라우드 기반 서비스에서 수백만 사용자 트래픽을 떠받치는 인프라를 설계·운영했습니다. AWS·Kubernetes·Terraform에 능하고, 새벽 장애 대응(온콜)과 포스트모템을 수없이 겪은 베테랑입니다. 인프라·DevOps로 진로를 잡으려는 컴퓨터공학 후배들의 진로 멘토 역할을 맡고 있습니다.

# 페르소나 & 말투
- 자신을 "준호 멘토"라고 칭하며, 침착하고 신뢰감 있는 현업 선배 톤.
- 실전 경험을 녹여 말합니다. "실제 운영에서는…", "장애 터지면 제일 먼저…", "면접에서 이건 꼭 물어봐요" 같은 표현을 자연스럽게.
- "왜 그렇게 하는지(원리)"와 "그래서 뭘 직접 만들어봐야 하는지(실습)"를 함께 짚는 스타일.

# 답변 규칙
- 한국어로, 차분하고 따뜻하되 핵심을 찌르는 멘토 말투("~예요", "~해봐요") 톤.
- 너무 길지 않게. 보통 3~6문장. 단계나 항목이 있으면 짧은 '-' 목록 사용.
- 가능하면 구체적인 예시(실제 아키텍처, 명령어/도구, 장애 사례, 자격증 학습 순서, 사이드 프로젝트 아이디어, 면접 질문)를 들어 설명.
- 학생이 오늘·이번 주에 바로 실행할 수 있는 액션 한 가지를 답변 끝에 제안(예: "이번 주말에 EC2에 간단한 웹서버 직접 띄워봐요").
- 다루는 주제: 서버 운영, 클라우드 아키텍처, 네트워크 설계, DevOps, CI/CD, 컨테이너/쿠버네티스, IaC, 모니터링, 필요 역량·과목·자격증·포트폴리오·연봉·커리어패스.
- 인프라/DevOps와 전혀 무관한 질문이면, 자신은 인프라 엔지니어 진로 멘토라 그 주제는 돕기 어렵다고 정중히 안내하고 관련 질문으로 유도.
- 마크다운 헤더(#)는 쓰지 말고, 필요시 '-' 목록만 사용.`;

// ─────────────────────────────────────────────────────────────
// 직무별 설정 맵
// ─────────────────────────────────────────────────────────────
const CAREERS = {
  qa: {
    id: "qa",
    icon: <Gamepad2 size={28} />,
    accent: "#7C4DFF",
    accentLight: "#B388FF",
    label: "게임 QA 엔지니어",
    eyebrow: "GAME QUALITY ASSURANCE",
    titleLine1: "게임",
    titleHighlight: "QA 엔지니어",
    titleLine2: "가 되는 길",
    desc: "버그를 '발견'하는 사람을 넘어 게임의 품질을 '설계'하는 직무. 아래 로드맵과 추천 과목·자격증을 따라가고, 궁금한 건 오른쪽 챗봇에게 물어보세요.",
    mentorName: "지우 멘토",
    mentorTagline: "13년 차, MMORPG·모바일 출시 QA 리드",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Jiwoo&backgroundColor=b388ff",
    placeholder: "게임 QA에 대해 물어보세요…",
    initMsg: "안녕하세요! 게임 QA 진로 멘토예요. 게임 QA가 무슨 일을 하는지, 어떤 과목·자격증을 챙겨야 하는지, 포트폴리오는 어떻게 만드는지 무엇이든 물어보세요!",
    roadmap: QA_ROADMAP, courses: QA_COURSES, certs: QA_CERTS,
    suggested: QA_SUGGESTED, system: QA_SYSTEM,
  },
  marketer: {
    id: "marketer",
    icon: <Megaphone size={28} />,
    accent: "#FF6B9D",
    accentLight: "#FFB3D1",
    label: "콘텐츠 마케터",
    eyebrow: "CONTENT MARKETING · CAREER PATH",
    titleLine1: "콘텐츠",
    titleHighlight: "마케터",
    titleLine2: "가 되는 길",
    desc: "숫자로 증명하는 스토리텔러. 아래 로드맵과 추천 과목·자격증을 따라가고, 궁금한 건 오른쪽 챗봇에게 물어보세요.",
    mentorName: "서연 멘토",
    mentorTagline: "10년 차, 0→수십만 팔로워 키운 마케팅 팀 리드",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Seoyeon2&backgroundColor=ffb3d1",
    placeholder: "콘텐츠 마케팅에 대해 물어보세요…",
    initMsg: "안녕하세요! 콘텐츠 마케터 진로 멘토예요. 어떤 콘텐츠를 만들어야 하는지, 포트폴리오 구성법, 필요한 자격증까지 무엇이든 물어보세요!",
    roadmap: MKT_ROADMAP, courses: MKT_COURSES, certs: MKT_CERTS,
    suggested: MKT_SUGGESTED, system: MKT_SYSTEM,
  },
  infra: {
    id: "infra",
    icon: <Server size={28} />,
    accent: "#00BCD4",
    accentLight: "#80DEEA",
    label: "인프라 엔지니어",
    eyebrow: "INFRASTRUCTURE · DEVOPS · CAREER PATH",
    titleLine1: "인프라",
    titleHighlight: "엔지니어",
    titleLine2: "가 되는 길",
    desc: "서버·클라우드·네트워크로 서비스를 떠받치는 직무. 아래 로드맵과 추천 과목·자격증을 따라가고, 궁금한 건 오른쪽 챗봇에게 물어보세요.",
    mentorName: "준호 멘토",
    mentorTagline: "12년 차, 수백만 트래픽 운영·온콜 베테랑",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Junho&backgroundColor=80deea",
    placeholder: "인프라 엔지니어에 대해 물어보세요…",
    initMsg: "안녕하세요! 인프라 엔지니어 진로 멘토예요. 클라우드 시작법, 자격증 로드맵, 포트폴리오까지 무엇이든 물어보세요!",
    roadmap: INFRA_ROADMAP, courses: INFRA_COURSES, certs: INFRA_CERTS,
    suggested: INFRA_SUGGESTED, system: INFRA_SYSTEM,
  },
};

// ─────────────────────────────────────────────────────────────
// 메인 App
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home"); // "home" | "qa" | "marketer" | "infra"

  if (page === "home") return <HomePage onSelect={setPage} />;
  return <CareerPage career={CAREERS[page]} onBack={() => setPage("home")} />;
}

// ─────────────────────────────────────────────────────────────
// 홈 (랜딩) 페이지
// ─────────────────────────────────────────────────────────────
function HomePage({ onSelect }) {
  return (
    <div style={S.root}>
      <style>{CSS}</style>

      <header style={S.header}>
        <div style={S.brand}>
          <div style={{ ...S.logoBox, background: "linear-gradient(135deg,#B388FF,#7C4DFF)" }}>
            <Sparkles size={20} color="#0B0B14" />
          </div>
          <div>
            <div style={S.brandTitle}>FIND YOUR QUALITY</div>
            <div style={S.brandSub}>IT 분야 취업을 희망하는 당신을 위한 직무 가이드</div>
          </div>
        </div>
      </header>

      <div style={S.homeBody}>
        <div style={S.homeHero}>
          <div style={S.homeEyebrow}>COMPUTER SCIENCE · CAREER GUIDE</div>
          <h1 style={S.homeTitle}>
            나에게 맞는<br />
            <span style={{ background: "linear-gradient(90deg,#B388FF,#80DEEA,#FFB3D1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              직무를 찾아보세요
            </span>
          </h1>
          <p style={S.homeDesc}>
            로드맵 · 추천 과목 · 자격증 · AI 멘토까지.<br />
            아래 직무 카드를 클릭해 탐색을 시작하세요.
          </p>
        </div>

        <div style={S.cardRow}>
          {[
            { id: "qa", icon: <Gamepad2 size={36} />, accent: "#7C4DFF", accentLight: "#B388FF", title: "게임 QA 엔지니어", desc: "버그를 발견하고 게임 품질을 설계하는 전문가. 테스트 케이스 설계부터 자동화 QA까지.", tags: ["테스팅", "버그 리포트", "자동화"] },
            { id: "marketer", icon: <Megaphone size={36} />, accent: "#FF6B9D", accentLight: "#FFB3D1", title: "콘텐츠 마케터", desc: "데이터로 증명하는 스토리텔러. SNS 운영부터 퍼포먼스 마케팅 캠페인 기획까지.", tags: ["SNS", "카피라이팅", "데이터 분석"] },
            { id: "infra", icon: <Server size={36} />, accent: "#00BCD4", accentLight: "#80DEEA", title: "인프라 엔지니어", desc: "서비스를 떠받치는 클라우드·서버·네트워크 전문가. AWS·Docker·Kubernetes까지.", tags: ["클라우드", "DevOps", "Linux"] },
          ].map((c) => (
            <button key={c.id} style={S.careerCard} className="career-card" onClick={() => onSelect(c.id)}>
              <div style={{ ...S.careerIconBox, background: `linear-gradient(135deg,${c.accentLight}33,${c.accent}22)`, border: `1px solid ${c.accent}44` }}>
                <span style={{ color: c.accentLight }}>{c.icon}</span>
              </div>
              <div style={{ ...S.careerAccentLine, background: `linear-gradient(90deg,${c.accent},${c.accentLight})` }} />
              <div style={S.careerTitle}>{c.title}</div>
              <p style={S.careerDesc}>{c.desc}</p>
              <div style={S.tagRow}>
                {c.tags.map((t) => (
                  <span key={t} style={{ ...S.tag, color: c.accentLight, borderColor: c.accent + "55", background: c.accent + "18" }}>{t}</span>
                ))}
              </div>
              <div style={{ ...S.careerArrow, color: c.accentLight }}>탐색 시작 →</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 직무 상세 페이지
// ─────────────────────────────────────────────────────────────
function CareerPage({ career, onBack }) {
  const [tab, setTab] = useState("roadmap");
  const [messages, setMessages] = useState([{ role: "assistant", content: career.initMsg }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: career.system, messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      setMessages((m) => [...m, { role: "assistant", content: reply || "음... 다시 한 번 물어봐 주실래요?" }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "응답을 가져오지 못했어요. 잠시 후 다시 시도해 주세요." }]);
    } finally {
      setLoading(false);
    }
  };

  const acc = career.accent;
  const accL = career.accentLight;

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      <header style={S.header}>
        <div style={S.brand}>
          <button onClick={onBack} style={{ ...S.backBtn, borderColor: acc + "55", color: accL }} className="back-btn">
            <ArrowLeft size={15} /> 홈으로
          </button>
          <div style={{ ...S.logoBox, background: `linear-gradient(135deg,${accL},${acc})` }}>
            <span style={{ color: "#0B0B14", display: "flex" }}>{React.cloneElement(career.icon, { size: 20 })}</span>
          </div>
          <div>
            <div style={S.brandTitle}>FIND YOUR QUALITY</div>
            <div style={S.brandSub}>{career.label} 직무 가이드</div>
          </div>
        </div>
        <div style={{ ...S.headerTag, color: accL, borderColor: acc + "55" }}>
          <Bug size={13} /> {career.label}
        </div>
      </header>

      <div style={S.body} className="qa-body">
        <main style={S.left}>
          <div style={S.hero}>
            <div style={S.heroEyebrow}>{career.eyebrow}</div>
            <h1 style={S.heroTitle}>
              {career.titleLine1} <span style={{ color: accL }}>{career.titleHighlight}</span><br />{career.titleLine2}
            </h1>
            <p style={S.heroDesc}>{career.desc}</p>
          </div>

          <div style={S.tabs}>
            <Tab icon={<Map size={15} />} label="로드맵" active={tab === "roadmap"} onClick={() => setTab("roadmap")} accent={acc} accentLight={accL} />
            <Tab icon={<BookOpen size={15} />} label="추천 과목" active={tab === "courses"} onClick={() => setTab("courses")} accent={acc} accentLight={accL} />
            <Tab icon={<Award size={15} />} label="자격증" active={tab === "certs"} onClick={() => setTab("certs")} accent={acc} accentLight={accL} />
          </div>

          <div style={S.panel}>
            {tab === "roadmap" && (
              <div className="fade">
                {career.roadmap.map((p) => (
                  <div key={p.phase} style={S.phaseRow}>
                    <div style={S.phaseRail}>
                      <div style={{ ...S.phaseNum, background: p.color }}>{p.phase}</div>
                      <div style={S.phaseLine} />
                    </div>
                    <div style={S.phaseCard}>
                      <div style={S.phaseHead}>
                        <span style={S.phaseTitle}>{p.title}</span>
                        <span style={{ ...S.phasePeriod, color: p.color, borderColor: p.color + "55" }}>{p.period}</span>
                      </div>
                      <ul style={S.phaseList}>
                        {p.items.map((it, i) => (
                          <li key={i} style={S.phaseItem}>
                            <ChevronRight size={13} color={p.color} style={{ flexShrink: 0, marginTop: 3 }} />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "courses" && (
              <div className="fade" style={S.cardGrid}>
                {career.courses.map((c) => (
                  <div key={c.name} style={S.courseCard}>
                    <div style={S.courseTop}>
                      <span style={S.courseName}>{c.name}</span>
                      <span style={{ ...S.pill, ...tagStyle(c.tag) }}>{c.tag}</span>
                    </div>
                    <p style={S.courseWhy}>{c.why}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === "certs" && (
              <div className="fade" style={S.cardGrid}>
                {career.certs.map((c) => (
                  <div key={c.name} style={S.certCard}>
                    <div style={S.courseTop}>
                      <span style={S.courseName}>{c.name}</span>
                      <span style={S.stars}>{c.level}</span>
                    </div>
                    <div style={S.certOrg}>{c.org}</div>
                    <p style={S.courseWhy}>{c.note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <aside style={S.right} className="qa-right">
          <div style={S.chatHead}>
            <img src={career.avatar} alt={career.mentorName} style={{ ...S.chatAvatar, border: `2px solid ${acc}66`, background: acc + "22" }} />
            <div>
              <div style={S.chatHeadTitle}>{career.mentorName}</div>
              <div style={S.chatHeadSub}>{career.mentorTagline}</div>
            </div>
          </div>

          <div ref={scrollRef} style={S.chatScroll}>
            {messages.map((m, i) => (
              <div key={i} style={{ ...S.msgRow, justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
                {m.role === "assistant" && (
                  <img src={career.avatar} alt={career.mentorName} style={{ ...S.msgAvatar, border: `1.5px solid ${acc}55` }} />
                )}
                <div style={m.role === "user" ? { ...S.msgUser, background: `linear-gradient(135deg,${acc},${accL})` } : S.msgBot}>
                  {m.content.split("\n").map((line, j) => <p key={j} style={S.msgLine}>{line}</p>)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ ...S.msgRow, justifyContent: "flex-start", alignItems: "flex-end", gap: 8 }}>
                <img src={career.avatar} alt={career.mentorName} style={{ ...S.msgAvatar, border: `1.5px solid ${acc}55` }} />
                <div style={S.msgBot}><Loader2 size={16} className="spin" color={accL} /></div>
              </div>
            )}

            {messages.length <= 2 && (
              <div style={S.suggestWrap}>
                {career.suggested.map((q) => (
                  <button key={q} style={{ ...S.suggestBtn, color: accL, borderColor: acc + "55", background: acc + "18" }} onClick={() => send(q)} disabled={loading}>{q}</button>
                ))}
              </div>
            )}
          </div>

          <div style={S.inputBar}>
            <input
              style={S.input}
              value={input}
              placeholder={career.placeholder}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
            />
            <button style={{ ...S.sendBtn, background: `linear-gradient(135deg,${accL},${acc})` }} onClick={() => send()} disabled={loading || !input.trim()}>
              <Send size={16} color="#0B0B14" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Tab({ icon, label, active, onClick, accent, accentLight }) {
  return (
    <button onClick={onClick} style={{ ...S.tab, ...(active ? { background: (accent || "#7C4DFF") + "28", borderColor: (accentLight || "#B388FF") + "77", color: "#E8E6F0" } : {}) }}>
      {icon}{label}
    </button>
  );
}

function tagStyle(tag) {
  if (tag === "필수") return { background: "rgba(255,110,64,.16)", color: "#FF8A65", borderColor: "rgba(255,110,64,.35)" };
  if (tag === "심화") return { background: "rgba(0,191,165,.16)", color: "#26C6A8", borderColor: "rgba(0,191,165,.35)" };
  return { background: "rgba(124,77,255,.16)", color: "#B388FF", borderColor: "rgba(124,77,255,.35)" };
}

// ─────────────────────────────────────────────────────────────
const CSS = `
  * { box-sizing: border-box; }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade { animation: fade .35s ease; }
  @keyframes fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-thumb { background: rgba(179,136,255,.25); border-radius: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  .career-card { transition: transform .2s, box-shadow .2s; }
  .career-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,.4); }
  .back-btn { transition: background .2s; }
  .back-btn:hover { background: rgba(255,255,255,.08) !important; }
  @media (max-width: 880px) {
    .qa-body { flex-direction: column !important; }
    .qa-right { width: 100% !important; border-left: none !important; border-top: 1px solid rgba(255,255,255,.08) !important; height: 520px !important; }
  }
`;

const mono = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
const sans = "'Inter', -apple-system, 'Pretendard', system-ui, sans-serif";

const S = {
  root: { fontFamily: sans, background: "#0B0B14", color: "#E8E6F0", minHeight: "100vh", display: "flex", flexDirection: "column" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 26px", borderBottom: "1px solid rgba(255,255,255,.07)", background: "linear-gradient(180deg,#13121F,#0B0B14)" },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  logoBox: { width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", boxShadow: "0 0 22px rgba(124,77,255,.45)" },
  brandTitle: { fontFamily: mono, fontWeight: 700, fontSize: 16, letterSpacing: 2 },
  brandSub: { fontSize: 12, color: "#8B88A0" },
  headerTag: { display: "flex", alignItems: "center", gap: 7, fontFamily: mono, fontSize: 12, border: "1px solid", padding: "6px 12px", borderRadius: 999 },
  backBtn: { display: "flex", alignItems: "center", gap: 6, fontFamily: sans, fontSize: 13, fontWeight: 600, background: "transparent", border: "1px solid", borderRadius: 8, padding: "7px 12px", cursor: "pointer" },

  // 홈
  homeBody: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px 80px" },
  homeHero: { textAlign: "center", marginBottom: 56, maxWidth: 600 },
  homeEyebrow: { fontFamily: mono, fontSize: 11, letterSpacing: 3, color: "#6C6985", marginBottom: 20 },
  homeTitle: { fontSize: 48, lineHeight: 1.15, fontWeight: 800, margin: "0 0 18px", letterSpacing: -1 },
  homeDesc: { fontSize: 15, lineHeight: 1.75, color: "#A6A3BC", margin: 0 },
  cardRow: { display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 1060, width: "100%" },
  careerCard: { flex: "1 1 290px", maxWidth: 340, background: "#15141F", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, padding: "28px 24px", textAlign: "left", cursor: "pointer", fontFamily: sans, color: "#E8E6F0" },
  careerIconBox: { width: 64, height: 64, borderRadius: 16, display: "grid", placeItems: "center", marginBottom: 20 },
  careerAccentLine: { height: 2, borderRadius: 2, marginBottom: 16, width: 40 },
  careerTitle: { fontSize: 18, fontWeight: 800, marginBottom: 10 },
  careerDesc: { fontSize: 13.5, color: "#A6A3BC", lineHeight: 1.65, margin: "0 0 16px" },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 },
  tag: { fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, border: "1px solid" },
  careerArrow: { fontSize: 13.5, fontWeight: 700 },

  // 직무 페이지
  body: { display: "flex", flex: 1, minHeight: 0 },
  left: { flex: 1, padding: "30px 34px", overflowY: "auto", minWidth: 0 },
  hero: { marginBottom: 26 },
  heroEyebrow: { fontFamily: mono, fontSize: 11, letterSpacing: 3, color: "#6C6985", marginBottom: 14 },
  heroTitle: { fontSize: 38, lineHeight: 1.15, fontWeight: 800, margin: "0 0 14px", letterSpacing: -0.5 },
  heroDesc: { fontSize: 14.5, lineHeight: 1.7, color: "#A6A3BC", maxWidth: 620, margin: 0 },
  tabs: { display: "flex", gap: 8, marginBottom: 20 },
  tab: { display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,.09)", background: "transparent", color: "#9C99B3", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: sans, transition: "all .2s" },
  panel: { paddingBottom: 30 },
  phaseRow: { display: "flex", gap: 16 },
  phaseRail: { display: "flex", flexDirection: "column", alignItems: "center", width: 40 },
  phaseNum: { width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center", fontFamily: mono, fontWeight: 700, fontSize: 14, color: "#0B0B14", flexShrink: 0 },
  phaseLine: { width: 2, flex: 1, background: "linear-gradient(180deg,rgba(255,255,255,.14),transparent)", marginTop: 4 },
  phaseCard: { flex: 1, background: "#15141F", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "16px 18px", marginBottom: 16 },
  phaseHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 },
  phaseTitle: { fontSize: 16.5, fontWeight: 700 },
  phasePeriod: { fontFamily: mono, fontSize: 11.5, padding: "3px 10px", borderRadius: 999, border: "1px solid" },
  phaseList: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 9 },
  phaseItem: { display: "flex", gap: 8, fontSize: 13.8, color: "#BFBCD2", lineHeight: 1.5 },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 },
  courseCard: { background: "#15141F", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "16px 18px" },
  certCard: { background: "#15141F", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "16px 18px" },
  courseTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 },
  courseName: { fontSize: 15.5, fontWeight: 700 },
  courseWhy: { fontSize: 13, color: "#A6A3BC", lineHeight: 1.6, margin: 0 },
  certOrg: { fontFamily: mono, fontSize: 11.5, color: "#7C798F", marginBottom: 8 },
  pill: { fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, border: "1px solid" },
  stars: { color: "#FFD54F", fontSize: 13, letterSpacing: 1 },
  right: { width: 400, display: "flex", flexDirection: "column", borderLeft: "1px solid rgba(255,255,255,.08)", background: "#0E0D17", minHeight: 0 },
  chatHead: { display: "flex", alignItems: "center", gap: 11, padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.07)" },
  chatHeadIcon: { width: 34, height: 34, borderRadius: 9, display: "grid", placeItems: "center" },
  chatAvatar: { width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 },
  msgAvatar: { width: 26, height: 26, borderRadius: "50%", objectFit: "cover", flexShrink: 0 },
  chatHeadTitle: { fontWeight: 700, fontSize: 14.5 },
  chatHeadSub: { fontSize: 11.5, color: "#7C798F" },
  chatScroll: { flex: 1, overflowY: "auto", padding: "18px 18px", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 },
  msgRow: { display: "flex" },
  msgBot: { maxWidth: "85%", background: "#1C1A2A", border: "1px solid rgba(255,255,255,.06)", borderRadius: "4px 14px 14px 14px", padding: "11px 14px", fontSize: 13.6, lineHeight: 1.6, color: "#DBD8EC" },
  msgUser: { maxWidth: "85%", borderRadius: "14px 4px 14px 14px", padding: "11px 14px", fontSize: 13.6, lineHeight: 1.6, color: "#fff" },
  msgLine: { margin: "0 0 4px" },
  suggestWrap: { display: "flex", flexWrap: "wrap", gap: 7, paddingTop: 4 },
  suggestBtn: { fontSize: 12, border: "1px solid", borderRadius: 999, padding: "6px 12px", cursor: "pointer", fontFamily: sans, transition: "all .2s", background: "transparent" },
  inputBar: { display: "flex", gap: 8, padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,.07)" },
  input: { flex: 1, background: "#1C1A2A", border: "1px solid rgba(255,255,255,.1)", borderRadius: 11, padding: "11px 14px", color: "#E8E6F0", fontSize: 13.6, fontFamily: sans, outline: "none" },
  sendBtn: { width: 44, borderRadius: 11, border: "none", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 },
};
