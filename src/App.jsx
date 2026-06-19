import React, { useState, useRef, useEffect } from "react";
import { Send, Bug, BookOpen, Award, Map, MessageSquare, Loader2, Gamepad2, ChevronRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// 게임 QA 직무 데이터
// ─────────────────────────────────────────────────────────────
const ROADMAP = [
  {
    phase: "01",
    title: "기초 다지기",
    period: "1~2학년",
    color: "#7C4DFF",
    items: [
      "컴퓨터 구조 · 운영체제 기본 이해",
      "프로그래밍 입문 (C / Python)",
      "게임을 '플레이어'가 아닌 '분석가'로 보는 습관 들이기",
      "버그 리포트 작성 연습 (재현 절차 기록)",
    ],
  },
  {
    phase: "02",
    title: "테스트 역량 키우기",
    period: "2~3학년",
    color: "#536DFE",
    items: [
      "소프트웨어 공학 / 소프트웨어 테스팅 과목 수강",
      "테스트 케이스 설계 · 결함 관리 프로세스 학습",
      "Jira, TestRail 등 이슈 트래킹 툴 익히기",
      "SQL 기초 (로그·DB 데이터 확인용)",
    ],
  },
  {
    phase: "03",
    title: "전문성 확보",
    period: "3~4학년",
    color: "#00BFA5",
    items: [
      "게임 엔진 (Unity / Unreal) 구조 이해",
      "자동화 테스트 입문 (Python + Selenium / Appium)",
      "네트워크 기초 (멀티플레이 QA 대비)",
      "토이 게임 프로젝트로 직접 QA 사이클 경험",
    ],
  },
  {
    phase: "04",
    title: "취업 준비",
    period: "4학년~",
    color: "#FF6E40",
    items: [
      "QA 포트폴리오 (버그 리포트 · 테스트 계획서)",
      "관련 자격증 취득",
      "인턴 / 외주 QA 경험 쌓기",
      "도메인 지식 (장르별 게임 특성) 정리",
    ],
  },
];

const COURSES = [
  { name: "소프트웨어 공학", why: "테스트 프로세스와 SDLC의 핵심. QA의 뼈대." , tag: "필수" },
  { name: "소프트웨어 테스팅 / 품질관리", why: "테스트 케이스 설계, 결함 분류, 커버리지 직접 학습.", tag: "필수" },
  { name: "운영체제 · 컴퓨터구조", why: "크래시·메모리 누수 등 시스템 레벨 버그 분석.", tag: "권장" },
  { name: "데이터베이스 (SQL)", why: "게임 로그·아이템·재화 데이터 검증에 필수.", tag: "권장" },
  { name: "컴퓨터 네트워크", why: "멀티플레이·서버 QA, 패킷·지연 이슈 이해.", tag: "권장" },
  { name: "게임 프로그래밍 / 게임 엔진", why: "Unity·Unreal 구조를 알면 버그 원인 추적이 빨라짐.", tag: "심화" },
  { name: "자료구조 · 알고리즘", why: "자동화 스크립트 작성과 논리적 재현 절차에 도움.", tag: "권장" },
];

const CERTS = [
  { name: "ISTQB Foundation Level", org: "국제 SW 테스팅 자격", note: "QA의 글로벌 표준. 가장 추천되는 핵심 자격증." , level: "★★★" },
  { name: "정보처리기사", org: "한국산업인력공단", note: "전공자 기본 스펙. SW 전반 지식 증명." , level: "★★★" },
  { name: "SQLD (SQL 개발자)", org: "한국데이터산업진흥원", note: "데이터 검증 직무에서 가산점." , level: "★★" },
  { name: "리눅스마스터", org: "KAIT", note: "서버 환경 QA에 유리." , level: "★" },
];

const SUGGESTED = [
  "게임 QA가 정확히 무슨 일을 하나요?",
  "ISTQB 자격증 꼭 따야 하나요?",
  "신입 QA 포트폴리오는 어떻게 만들죠?",
  "좋은 버그 리포트 작성법 알려줘",
  "QA 직무 연봉은 어느 정도예요?",
];

const SYSTEM_PROMPT = `당신은 한국 게임 회사의 시니어 게임 QA(품질보증) 엔지니어이자 컴퓨터공학 전공 학생들의 진로 멘토입니다.
'게임 QA' 직무에 대한 질문에 친절하고 실용적으로 답합니다.

답변 규칙:
- 한국어로, 따뜻하지만 핵심을 찌르는 멘토 말투.
- 너무 길지 않게. 보통 3~6문장, 필요하면 짧은 목록 사용.
- 게임 QA 직무(테스트 케이스 설계, 버그 리포트, 자동화 테스트, 회귀 테스트, 호환성/네트워크 테스트, 출시 전 QA 사이클, 필요 역량/과목/자격증/포트폴리오/연봉/커리어패스)에 집중.
- 학생이 실제로 행동할 수 있는 구체적 조언을 줄 것.
- 게임 QA와 전혀 관련 없는 질문이면, 자신은 게임 QA 진로 멘토라서 그 주제는 도와주기 어렵다고 정중히 안내하고 관련 질문을 유도.
- 마크다운 헤더(#)는 쓰지 말고, 필요시 간단한 '-' 목록만 사용.`;

export default function App() {
  const [tab, setTab] = useState("roadmap");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "안녕하세요! 게임 QA 진로 멘토예요. 게임 QA가 무슨 일을 하는지, 어떤 과목·자격증을 챙겨야 하는지, 포트폴리오는 어떻게 만드는지 무엇이든 물어보세요. 왼쪽 로드맵도 참고하시고요!",
    },
  ]);
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
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      setMessages((m) => [...m, { role: "assistant", content: reply || "음... 다시 한 번 물어봐 주실래요?" }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "응답을 가져오지 못했어요. 잠시 후 다시 시도해 주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      {/* Header */}
      <header style={S.header}>
        <div style={S.brand}>
          <div style={S.logoBox}>
            <Gamepad2 size={22} color="#0B0B14" />
          </div>
          <div>
            <div style={S.brandTitle}>QA TRACK</div>
            <div style={S.brandSub}>게임 QA 직무 가이드 · 컴공 진로</div>
          </div>
        </div>
        <div style={S.headerTag}>
          <Bug size={13} /> Game Quality Assurance
        </div>
      </header>

      <div style={S.body}>
        {/* ── Left: 직무 정보 ── */}
        <main style={S.left}>
          <div style={S.hero}>
            <div style={S.heroEyebrow}>COMPUTER SCIENCE · CAREER PATH</div>
            <h1 style={S.heroTitle}>
              게임 <span style={{ color: "#B388FF" }}>QA 엔지니어</span><br />가 되는 길
            </h1>
            <p style={S.heroDesc}>
              버그를 '발견'하는 사람을 넘어 게임의 품질을 '설계'하는 직무.
              아래 로드맵과 추천 과목·자격증을 따라가고, 궁금한 건 오른쪽 챗봇에게 물어보세요.
            </p>
          </div>

          <div style={S.tabs}>
            <Tab icon={<Map size={15} />} label="로드맵" active={tab === "roadmap"} onClick={() => setTab("roadmap")} />
            <Tab icon={<BookOpen size={15} />} label="추천 과목" active={tab === "courses"} onClick={() => setTab("courses")} />
            <Tab icon={<Award size={15} />} label="자격증" active={tab === "certs"} onClick={() => setTab("certs")} />
          </div>

          <div style={S.panel}>
            {tab === "roadmap" && (
              <div className="fade">
                {ROADMAP.map((p) => (
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
                {COURSES.map((c) => (
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
                {CERTS.map((c) => (
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

        {/* ── Right: 챗봇 ── */}
        <aside style={S.right}>
          <div style={S.chatHead}>
            <div style={S.chatHeadIcon}><MessageSquare size={16} color="#B388FF" /></div>
            <div>
              <div style={S.chatHeadTitle}>QA 멘토 봇</div>
              <div style={S.chatHeadSub}>게임 QA 무엇이든 물어보세요</div>
            </div>
          </div>

          <div ref={scrollRef} style={S.chatScroll}>
            {messages.map((m, i) => (
              <div key={i} style={{ ...S.msgRow, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={m.role === "user" ? S.msgUser : S.msgBot}>
                  {m.content.split("\n").map((line, j) => (
                    <p key={j} style={S.msgLine}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ ...S.msgRow, justifyContent: "flex-start" }}>
                <div style={S.msgBot}>
                  <Loader2 size={16} className="spin" color="#B388FF" />
                </div>
              </div>
            )}
          </div>

          {messages.length <= 2 && (
            <div style={S.suggestWrap}>
              {SUGGESTED.map((q) => (
                <button key={q} style={S.suggestBtn} onClick={() => send(q)} disabled={loading}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <div style={S.inputBar}>
            <input
              style={S.input}
              value={input}
              placeholder="게임 QA에 대해 물어보세요…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
            />
            <button style={S.sendBtn} onClick={() => send()} disabled={loading || !input.trim()}>
              <Send size={16} color="#0B0B14" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Tab({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ ...S.tab, ...(active ? S.tabActive : {}) }}>
      {icon}
      {label}
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
  logoBox: { width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#B388FF,#7C4DFF)", display: "grid", placeItems: "center", boxShadow: "0 0 22px rgba(124,77,255,.45)" },
  brandTitle: { fontFamily: mono, fontWeight: 700, fontSize: 16, letterSpacing: 2 },
  brandSub: { fontSize: 12, color: "#8B88A0" },
  headerTag: { display: "flex", alignItems: "center", gap: 7, fontFamily: mono, fontSize: 12, color: "#B388FF", border: "1px solid rgba(179,136,255,.3)", padding: "6px 12px", borderRadius: 999 },

  body: { display: "flex", flex: 1, minHeight: 0 },
  left: { flex: 1, padding: "30px 34px", overflowY: "auto", minWidth: 0 },

  hero: { marginBottom: 26 },
  heroEyebrow: { fontFamily: mono, fontSize: 11, letterSpacing: 3, color: "#6C6985", marginBottom: 14 },
  heroTitle: { fontSize: 38, lineHeight: 1.15, fontWeight: 800, margin: "0 0 14px", letterSpacing: -0.5 },
  heroDesc: { fontSize: 14.5, lineHeight: 1.7, color: "#A6A3BC", maxWidth: 620, margin: 0 },

  tabs: { display: "flex", gap: 8, marginBottom: 20 },
  tab: { display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,.09)", background: "transparent", color: "#9C99B3", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: sans, transition: "all .2s" },
  tabActive: { background: "rgba(124,77,255,.16)", borderColor: "rgba(179,136,255,.45)", color: "#E8E6F0" },

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
  chatHeadIcon: { width: 34, height: 34, borderRadius: 9, background: "rgba(124,77,255,.16)", display: "grid", placeItems: "center" },
  chatHeadTitle: { fontWeight: 700, fontSize: 14.5 },
  chatHeadSub: { fontSize: 11.5, color: "#7C798F" },

  chatScroll: { flex: 1, overflowY: "auto", padding: "18px 18px", display: "flex", flexDirection: "column", gap: 12, minHeight: 0 },
  msgRow: { display: "flex" },
  msgBot: { maxWidth: "85%", background: "#1C1A2A", border: "1px solid rgba(255,255,255,.06)", borderRadius: "4px 14px 14px 14px", padding: "11px 14px", fontSize: 13.6, lineHeight: 1.6, color: "#DBD8EC" },
  msgUser: { maxWidth: "85%", background: "linear-gradient(135deg,#7C4DFF,#9575FF)", borderRadius: "14px 4px 14px 14px", padding: "11px 14px", fontSize: 13.6, lineHeight: 1.6, color: "#fff" },
  msgLine: { margin: "0 0 4px" },

  suggestWrap: { display: "flex", flexWrap: "wrap", gap: 7, padding: "0 18px 12px" },
  suggestBtn: { fontSize: 12, color: "#B388FF", background: "rgba(124,77,255,.1)", border: "1px solid rgba(179,136,255,.28)", borderRadius: 999, padding: "6px 12px", cursor: "pointer", fontFamily: sans, transition: "all .2s" },

  inputBar: { display: "flex", gap: 8, padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,.07)" },
  input: { flex: 1, background: "#1C1A2A", border: "1px solid rgba(255,255,255,.1)", borderRadius: 11, padding: "11px 14px", color: "#E8E6F0", fontSize: 13.6, fontFamily: sans, outline: "none" },
  sendBtn: { width: 44, borderRadius: 11, border: "none", background: "linear-gradient(135deg,#B388FF,#7C4DFF)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 },
};
