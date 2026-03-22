/* ===========================
   자격증 맛집 — app.js
=========================== */

// Firebase 설정 및 초기화
const firebaseConfig = {
  apiKey: "AIzaSyAG9FG8e27AZt2Q_z--H4cU03DnYHVjxLI",
  authDomain: "jakyeokjeung-matjip.firebaseapp.com",
  projectId: "jakyeokjeung-matjip",
  storageBucket: "jakyeokjeung-matjip.firebasestorage.app",
  messagingSenderId: "983617660339",
  appId: "1:983617660339:web:80179e2350e410cc33d7c6"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ====== MEMBERS ======
const membersData = [
  { name: '민지', emoji: '🐰', color: '#c050ff', cert: '컴활 1급 합격!' },
  { name: '준혁', emoji: '🐯', color: '#ff6b35', cert: '정처기 준비 중' },
  { name: '서연', emoji: '🦊', color: '#00c896', cert: '토익 895점!' },
  { name: '유나', emoji: '🐧', color: '#3b82f6', cert: '오픽 IH 합격!' },
  { name: '재원', emoji: '🐻', color: '#f59e0b', cert: '전공 스터디 중' },
  { name: '수진', emoji: '🌸', color: '#ec4899', cert: '컴활 2급 합격!' },
  { name: '도현', emoji: '🦁', color: '#8b5cf6', cert: 'SQLD 준비 중' },
  { name: '나은', emoji: '⭐', color: '#10b981', cert: '오픽 AL 목표!' },
];

function renderMembers() {
  const row = document.getElementById('membersRow');
  if (!row) return;
  row.innerHTML = membersData.map(m => `
    <div class="member-avatar" style="background:${m.color}22;border-color:${m.color}55">
      ${m.emoji}
      <span class="member-tooltip">${m.name} · ${m.cert}</span>
    </div>
  `).join('');
}

// ====== TOAST ======
function showToast(msg, duration = 2800) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ====== STATS COUNTER ======
const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNums.forEach(el => {
        const target = parseInt(el.dataset.target);
        animateCount(el, 0, target, 1800);
      });
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

function animateCount(el, start, end, duration) {
  const startTime = performance.now();
  const update = (timestamp) => {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (end - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ====== AOS (Scroll Animations) ======
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 120);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

// ============================
//   Q&A SYSTEM
// ============================

let qnaData = [
  {
    id: 1, cat: '컴활', title: '엑셀 VLOOKUP 함수 오류 해결방법이 궁금해요',
    author: '박서연', time: '2시간 전', content: '#N/A 오류가 계속 나는데 어떻게 해결하나요? 범위 설정을 제대로 했는데도 오류가 납니다.',
    views: 34, likes: 8, answered: true,
    answers: [{ author: '이준혁(선배)', content: 'VLOOKUP에서 #N/A 오류는 검색값이 범위에 없을 때 발생해요! IFERROR로 감싸주시면 깔끔하게 처리됩니다. =IFERROR(VLOOKUP(...),"없음") 이런 식으로요 😊', time: '1시간 전' }]
  },
  {
    id: 2, cat: '토익', title: 'Part 5 동사 시제 관련 질문',
    author: '최유나', time: '5시간 전', content: '현재완료(have+pp)와 과거시제 구분이 너무 어려워요. since와 ago의 차이를 쉽게 설명해주실 분 계신가요?',
    views: 47, likes: 12, answered: true,
    answers: [{ author: '김도현(합격자)', content: 'since는 "~이래로" 기간이 현재까지 이어질 때 현재완료와 함께, ago는 "~전에" 과거 특정 시점을 나타낼 때 과거시제와 씁니다! "I have worked here since 2020" vs "I started 3 years ago" 이런 차이예요!', time: '4시간 전' }]
  },
  {
    id: 3, cat: '기사', title: '정보처리기사 1과목 데이터베이스 공부 순서',
    author: '정민준', time: '1일 전', content: '정처기 준비 시작하려는데 데이터베이스 파트 어떻게 공부하셨나요? 추천 순서가 있을까요?',
    views: 89, likes: 21, answered: false, answers: []
  },
  {
    id: 4, cat: '오픽', title: 'OPIc IM2에서 IH로 올리는 팁',
    author: '한수진', time: '2일 전', content: '현재 IM2인데 IH로 올리고 싶어요. 특히 Unexpected Question 파트가 너무 힘든데 대비법 있을까요?',
    views: 62, likes: 15, answered: true,
    answers: [{ author: '이나은(IH 합격)', content: '예상치못한 질문은 STAR 구조(Situation-Task-Action-Result)로 답하면 자연스럽게 길게 말할 수 있어요! 미리 10가지 주제별로 스토리 2-3개씩 준비해두세요 💪', time: '1일 전' }]
  },
  {
    id: 5, cat: '전공', title: '운영체제 세마포어 vs 뮤텍스 차이',
    author: '오재원', time: '3일 전', content: '운영체제 시험 준비 중인데 세마포어와 뮤텍스 개념이 헷갈려요. 실무에서 어떻게 다른지도 알고 싶어요.',
    views: 41, likes: 9, answered: true,
    answers: [{ author: '김철수(선배)', content: '뮤텍스는 소유권이 있는 잠금장치(lock 건 쪽만 unlock 가능). 세마포어는 카운터 기반 신호장치로 여러 스레드 간 자원 개수 관리에 씁니다. 간단히: 뮤텍스=방 열쇠 1개, 세마포어=주차장 남은 자리 수!', time: '2일 전' }]
  },
];

let selectedQnACard = null;

function renderQnAList(filter = 'all') {
  const list = document.getElementById('qnaList');
  const filtered = filter === 'all' ? qnaData : qnaData.filter(q => q.cat === filter);

  if (filtered.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-dim)">아직 질문이 없어요. 첫 번째로 질문해보세요! 🙋</div>`;
    return;
  }

  list.innerHTML = filtered.map(q => `
    <div class="qna-card" onclick="toggleAnswer(${q.id})" id="qna-card-${q.id}">
      <div class="qna-card-header">
        <span class="qna-cat-badge">${q.cat}</span>
        <h4>${q.title}</h4>
      </div>
      <div class="qna-card-meta">
        <span>✍️ ${q.author}</span>
        <span>🕐 ${q.time}</span>
        <span>👁 ${q.views}</span>
      </div>
      <p>${q.content}</p>
      <div class="qna-card-footer">
        <span class="${q.answered ? 'answered-badge' : 'unanswered-badge'}">
          ${q.answered ? '✅ 답변 완료' : '⏳ 답변 대기 중'}
        </span>
        <button class="like-btn ${q._liked ? 'liked' : ''}" onclick="likeQnA(event, ${q.id})">
          ❤️ ${q.likes}
        </button>
      </div>
      ${q._showAnswers && q.answers.length > 0 ? renderAnswers(q.answers) : ''}
    </div>
  `).join('');
}

function renderAnswers(answers) {
  return `
    <div style="margin-top:16px;padding:16px;background:rgba(178,70,255,0.06);border-radius:10px;border:1px solid rgba(178,70,255,0.15)">
      ${answers.map(a => `
        <div style="margin-bottom:12px">
          <div style="font-size:0.8rem;font-weight:700;color:var(--primary-light);margin-bottom:6px">💬 ${a.author} · ${a.time}</div>
          <p style="font-size:0.88rem;color:var(--text-muted);line-height:1.6">${a.content}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function toggleAnswer(id) {
  const q = qnaData.find(q => q.id === id);
  if (!q) return;
  q._showAnswers = !q._showAnswers;
  renderQnAList(currentQnAFilter);
}

const MEMBER_CODE = '1234';

function verifyMemberCode() {
  const code = prompt('동아리원 전용 기능입니다.\\n회원코드를 입력해주세요: (기본 회원코드: 1234)');
  if (code !== MEMBER_CODE) {
    showToast('⚠️ 회원코드가 일치하지 않습니다.');
    return false;
  }
  return true;
}

let currentQnAFilter = 'all';

function filterQnA(cat) {
  currentQnAFilter = cat;
  document.querySelectorAll('.qna-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  renderQnAList(cat);
}

function likeQnA(e, id) {
  e.stopPropagation();
  if (!verifyMemberCode()) return;
  const q = qnaData.find(q => q.id === id);
  if (!q) return;
  q._liked = !q._liked;
  q.likes += q._liked ? 1 : -1;
  renderQnAList(currentQnAFilter);
}

function handleFileSelect(input) {
  const name = input.files[0] ? input.files[0].name : '';
  document.getElementById('fileName').textContent = name ? `📎 ${name}` : '';
}

function submitQnA() {
  if (!verifyMemberCode()) return;
  
  const cat = document.getElementById('qnaCategory').value;
  const title = document.getElementById('qnaTitle').value.trim();
  const content = document.getElementById('qnaContent').value.trim();

  if (!cat) { showToast('⚠️ 카테고리를 선택해주세요!'); return; }
  if (!title) { showToast('⚠️ 질문 제목을 입력해주세요!'); return; }
  if (!content) { showToast('⚠️ 질문 내용을 입력해주세요!'); return; }

  const newQ = {
    id: Date.now(), cat, title, author: '나', time: '방금 전',
    content, views: 1, likes: 0, answered: false, answers: [], _showAnswers: false
  };

  qnaData.unshift(newQ);

  document.getElementById('qnaCategory').value = '';
  document.getElementById('qnaTitle').value = '';
  document.getElementById('qnaContent').value = '';
  document.getElementById('fileName').textContent = '';

  showToast('✅ 질문이 등록되었습니다! 선배들이 곧 답변해드릴게요 😊');
  filterQnA('all');
}

// ============================
//   EXAM SYSTEM
// ============================

const examData = {
  '컴활': [
    { q: 'Excel에서 VLOOKUP 함수의 두 번째 인수가 의미하는 것은?', opts: ['찾을 값', '범위(테이블 배열)', '열 번호', '일치 유형'], ans: 1, exp: 'VLOOKUP(찾을값, 범위, 열번호, 일치유형) — 두 번째 인수는 검색할 데이터 범위입니다.' },
    { q: '셀 참조에서 $A$1과 같이 행과 열 모두 고정된 참조를 무엇이라 하나요?', opts: ['상대 참조', '혼합 참조', '절대 참조', '복합 참조'], ans: 2, exp: '$기호로 행과 열을 모두 고정하면 절대 참조입니다.' },
    { q: 'Excel에서 COUNT 함수는 어떤 셀의 개수를 세나요?', opts: ['모든 셀', '문자가 있는 셀', '숫자가 있는 셀', '빈 셀'], ans: 2, exp: 'COUNT는 숫자가 있는 셀만 셉니다. 문자 포함은 COUNTA를 사용합니다.' },
    { q: '매크로를 기록할 때 사용하는 언어는?', opts: ['C++', 'Python', 'VBA', 'JavaScript'], ans: 2, exp: 'Excel 매크로는 VBA(Visual Basic for Applications)로 기록 및 편집됩니다.' },
    { q: 'SUMIF 함수의 역할은 무엇인가요?', opts: ['조건에 맞는 셀 개수', '조건에 맞는 합계', '조건에 맞는 평균', '조건에 맞는 최대값'], ans: 1, exp: 'SUMIF는 조건을 만족하는 셀들의 합계를 구합니다.' },
    { q: '피벗 테이블에서 데이터를 요약할 때 기본 집계 함수는?', opts: ['AVERAGE', 'COUNT', 'SUM', 'MAX'], ans: 2, exp: '피벗 테이블의 기본 집계는 합계(SUM)입니다.' },
    { q: '셀 서식에서 "###"이 표시되는 이유는?', opts: ['수식 오류', '열 너비가 좁음', '잘못된 서식', '데이터 없음'], ans: 1, exp: '열 너비가 너무 좁아서 숫자를 표시하지 못할 때 ###이 표시됩니다.' },
    { q: 'IF 함수의 기본 구조는?', opts: ['IF(값,조건,결과)', 'IF(조건,참,거짓)', 'IF(참,거짓,조건)', 'IF(결과,값,조건)'], ans: 1, exp: 'IF(조건, 참일 때 값, 거짓일 때 값) 구조입니다.' },
    { q: 'CONCATENATE 함수의 역할은?', opts: ['문자열 길이', '문자열 연결', '문자열 검색', '문자열 변환'], ans: 1, exp: 'CONCATENATE(또는 & 연산자)는 여러 문자열을 하나로 연결합니다.' },
    { q: '컴활 1급 실기 시험 시간은?', opts: ['45분', '60분', '90분', '120분'], ans: 2, exp: '컴퓨터활용능력 1급 실기는 90분입니다.' },
  ],
  '토익': [
    { q: 'The project _____ by the end of next month.', opts: ['will complete', 'will be completed', 'completes', 'is completing'], ans: 1, exp: '수동태 미래형: will be + p.p. / 프로젝트는 "완료되는" 것이므로 수동태가 맞습니다.' },
    { q: 'Choose the correct preposition: "She has been working _____ 8 AM."', opts: ['for', 'since', 'during', 'until'], ans: 1, exp: 'since는 특정 시점(8 AM)부터 지금까지를 의미할 때 사용합니다.' },
    { q: '다음 중 동사 "acquire"와 의미가 가장 유사한 것은?', opts: ['lose', 'obtain', 'reject', 'avoid'], ans: 1, exp: 'acquire = obtain (습득하다, 얻다)' },
    { q: 'The manager asked his staff _____ the report by Friday.', opts: ['submit', 'submitting', 'to submit', 'submitted'], ans: 2, exp: 'ask + 목적어 + to부정사 구조입니다.' },
    { q: '"Preceding" is closest in meaning to:', opts: ['following', 'previous', 'current', 'recent'], ans: 1, exp: 'preceding = previous (이전의, 앞선)' },
    { q: 'Despite _____ budget cuts, the team completed the project.', opts: ['significantly', 'significant', 'significance', 'signify'], ans: 1, exp: 'despite 다음에는 명사/명사구가 와야 합니다. significant(형용사) + budget cuts(명사)' },
    { q: 'The conference room is _____ reserved for executive meetings.', opts: ['primarily', 'primary', 'prime', 'primitive'], ans: 0, exp: 'primarily = 주로, 주로 (부사로 동사 수식)' },
    { q: '빈칸에 들어갈 가장 적절한 단어: "The new policy will _____ next Monday."', opts: ['take effect', 'make effect', 'do effect', 'have effect'], ans: 0, exp: '"take effect" = 효력이 발생하다 (고정 표현)' },
    { q: 'Which sentence uses the correct article?', opts: ['She is a honest person.', 'He bought an umbrella.', 'I have the apple.', 'They saw a elephant.'], ans: 1, exp: '"an umbrella" — 모음으로 시작하는 단어 앞에 an을 씁니다.' },
    { q: 'TOEIC LC Part 3에서 주로 등장하는 장면이 아닌 것은?', opts: ['비즈니스 미팅', '고객 서비스', '일상 채팅', '과거 역사 설명'], ans: 3, exp: 'TOEIC은 직장/비즈니스 관련이 주 소재입니다. 역사 설명은 거의 나오지 않습니다.' },
  ],
  '오픽': [
    { q: '오픽(OPIc) 시험에서 가장 높은 등급은?', opts: ['AL', 'IH', 'IM3', 'NH'], ans: 0, exp: '오픽 등급: NL < NM < NH < IL < IM1 < IM2 < IM3 < IH < AL' },
    { q: 'IL 등급에서 IM으로 가려면 주로 어떤 능력을 향상해야 하나요?', opts: ['발음', '문장 길이와 복잡성', '단어 암기량', '속도'], ans: 1, exp: 'IM을 받으려면 단순 문장을 넘어서 복합 문장과 다양한 시제를 써야 합니다.' },
    { q: 'OPIc 시험에서 STAR 구조란?', opts: ['Study-Time-Action-Result', 'Situation-Task-Action-Result', 'Start-Think-Answer-Review', 'Subject-Tense-Adjective-Result'], ans: 1, exp: 'STAR = Situation(상황) - Task(과제) - Action(행동) - Result(결과). 스토리텔링 구조입니다.' },
    { q: '오픽에서 Background Survey 역할은?', opts: ['시험 시작 전 준비', '질문 주제 결정의 기반', '문법 체크', '발음 분석'], ans: 1, exp: 'Background Survey에서 선택한 취미, 직업 등을 기반으로 문제가 출제됩니다.' },
    { q: '"Unexpected Question"에 가장 적합한 대응 전략은?', opts: ['침묵으로 생각 정리', '짧게 Yes/No로 답변', '관련 경험 스토리 연결', '질문을 다시 물어보기'], ans: 2, exp: '예상치 못한 질문도 자신의 경험을 연결해 스토리 형식으로 답하면 고득점!' },
    { q: '오픽에서 Role-play 문항에서 좋은 점수를 받으려면?', opts: ['짧고 간결하게', '상황에 맞는 역할 충실히 수행', '영어만 사용', '빠른 속도로 말하기'], ans: 1, exp: '역할극에서는 상황을 이해하고 자연스럽게 역할을 수행하는 것이 핵심입니다.' },
    { q: '오픽 시험 시간은 어떻게 되나요?', opts: ['30분', '40분', '60분', '90분'], ans: 1, exp: 'OPIc은 총 40분이며, 오리엔테이션 20분 + 시험 20분으로 구성됩니다.' },
    { q: '활용할 수 있는 오픽 고득점 시제 전략은?', opts: ['현재 시제만 사용', '단순 과거시제만 사용', '다양한 시제 혼용', '미래 시제만 사용'], ans: 2, exp: '다양한 시제(현재완료, 과거진행, 미래완료 등)를 자연스럽게 혼용하면 고득점!' },
  ],
  '기사': [
    { q: '정보처리기사 시험 과목이 아닌 것은?', opts: ['소프트웨어 설계', '데이터베이스 구축', '회계 원리', 'NW구축관리'], ans: 2, exp: '정보처리기사 5과목: 소프트웨어 설계, 소프트웨어 개발, DB구축, 프로그래밍 언어 활용, 정보시스템 구축관리' },
    { q: '폭포수(Waterfall) 모델의 특징으로 틀린 것은?', opts: ['순차적 개발', '이전 단계로 돌아가기 쉬움', '문서화 중시', '대규모 프로젝트에 적합'], ans: 1, exp: '폭포수 모델은 이전 단계로 돌아가기 어려운 것이 단점입니다.' },
    { q: '애자일(Agile) 방법론의 핵심 가치가 아닌 것은?', opts: ['개인과 상호작용', '작동하는 소프트웨어', '포괄적인 문서', '고객 협력'], ans: 2, exp: '애자일은 포괄적인 문서보다 작동하는 소프트웨어를 우선시합니다.' },
    { q: '데이터베이스 정규화의 목적은?', opts: ['저장 공간 증가', '데이터 중복 최소화', '처리 속도 감소', '제약 조건 제거'], ans: 1, exp: '정규화(Normalization)는 데이터 중복을 줄이고 이상(Anomaly)을 방지합니다.' },
    { q: '트랜잭션(Transaction)의 ACID 속성 중 "A"에 해당하는 것은?', opts: ['Availability', 'Authorization', 'Atomicity', 'Accuracy'], ans: 2, exp: 'ACID: Atomicity(원자성), Consistency(일관성), Isolation(독립성), Durability(지속성)' },
    { q: 'TCP/IP 모델의 계층 수는?', opts: ['3계층', '4계층', '7계층', '5계층'], ans: 1, exp: 'TCP/IP는 4계층(응용-전송-인터넷-네트워크접근). OSI는 7계층입니다.' },
    { q: '백색 박스 테스트(White Box Testing)의 특징은?', opts: ['내부 로직을 모르고 테스트', '내부 구조와 코드를 보며 테스트', '사용자 관점 테스트', '랜덤 입력 테스트'], ans: 1, exp: '화이트박스 테스트는 소스 코드 내부 구조를 알고 수행하는 테스트입니다.' },
    { q: '소프트웨어 유지보수 유형 중 "適應(Adaptive) 유지보수"란?', opts: ['버그 수정', '성능 향상', '환경 변화에 적응', '기능 추가'], ans: 2, exp: '적응 유지보수는 OS, DB 등 환경 변화에 맞게 시스템을 수정하는 것입니다.' },
    { q: 'SQL에서 테이블의 모든 레코드를 삭제하는 명령은?', opts: ['DROP TABLE', 'DELETE FROM table', 'REMOVE TABLE', 'CLEAR TABLE'], ans: 1, exp: 'DELETE FROM table은 레코드를 삭제(구조 유지). DROP TABLE은 테이블 자체를 삭제합니다.' },
    { q: '객체지향 3대 특징이 아닌 것은?', opts: ['캡슐화', '상속성', '다형성', '정규화'], ans: 3, exp: '객체지향 3대 특징: 캡슐화(Encapsulation), 상속성(Inheritance), 다형성(Polymorphism)' },
    { q: '스택(Stack)의 동작 원리는?', opts: ['FIFO', 'LIFO', 'FILO', 'LILO'], ans: 1, exp: '스택은 LIFO(Last In First Out) — 마지막에 넣은 것이 먼저 나옵니다.' },
    { q: 'IP 주소 클래스 중 대규모 네트워크에서 사용하는 클래스는?', opts: ['Class C', 'Class B', 'Class A', 'Class D'], ans: 2, exp: 'Class A(0.0.0.0~127.255.255.255)는 가장 큰 규모의 네트워크를 지원합니다.' },
    { q: '소프트웨어 설계에서 결합도(Coupling)가 낮을수록?', opts: ['품질이 낮아진다', '유지보수가 어렵다', '모듈 독립성이 높아진다', '복잡도가 높아진다'], ans: 2, exp: '결합도가 낮을수록 각 모듈이 독립적으로 동작하여 유지보수가 쉬워집니다.' },
    { q: '클라우드 서비스 유형 중 IaaS란?', opts: ['인터넷 서비스', '인프라 서비스', '통합 서비스', '정보 서비스'], ans: 1, exp: 'IaaS(Infrastructure as a Service): 서버, 스토리지 등 인프라를 서비스로 제공합니다.' },
    { q: '정보처리기사 필기 합격 기준은?', opts: ['각 과목 40점 이상, 평균 60점', '각 과목 60점 이상', '평균 60점', '각 과목 60점 이상, 평균 70점'], ans: 0, exp: '각 과목 40점 이상, 전 과목 평균 60점 이상이면 합격입니다.' },
  ]
};

let currentExam = '컴활';
let currentQuestions = [];
let currentQIndex = 0;
let userAnswers = [];
let examTimer = null;
let timeLeft = 0;
let examStartTime = null;

const leaderboardData = [
  { name: '이준혁', exam: '정처기', score: 14, total: 15, emoji: '🥇' },
  { name: '박서연', exam: '컴활', score: 9, total: 10, emoji: '🥈' },
  { name: '최유나', exam: '토익', score: 9, total: 10, emoji: '🥉' },
  { name: '정민준', exam: '정처기', score: 12, total: 15, emoji: '4' },
  { name: '한수진', exam: '오픽', score: 7, total: 8, emoji: '5' },
];

function renderLeaderboard() {
  const lb = document.getElementById('leaderboard');
  if (!lb) return;
  lb.innerHTML = leaderboardData.map((p, i) => `
    <div class="leaderboard-item">
      <span class="lb-rank ${i===0?'gold':i===1?'silver':i===2?'bronze':''}">${i<3?['🥇','🥈','🥉'][i]:i+1}</span>
      <div class="lb-avatar">${p.name[0]}</div>
      <div style="flex:1">
        <div class="lb-name">${p.name}</div>
        <div class="lb-exam">${p.exam}</div>
      </div>
      <span class="lb-score">${p.score}/${p.total}</span>
    </div>
  `).join('');
}

function selectExam(type) {
  currentExam = type;
  document.querySelectorAll('.exam-cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.exam === type);
  });

  // Show start prompt in exam area
  const cats = document.querySelector('.exam-categories');
  const existingStart = document.getElementById('examStartBtn');
  if (existingStart) existingStart.remove();

  const startDiv = document.createElement('div');
  startDiv.id = 'examStartBtn';
  startDiv.style.cssText = 'margin-top:20px;text-align:center;padding:20px;background:rgba(178,70,255,0.06);border-radius:12px;border:1px dashed rgba(178,70,255,0.25)';
  startDiv.innerHTML = `
    <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:14px">
      <strong style="color:var(--text)">${type}</strong> 모의고사 (${examData[type].length}문제)를 시작하시겠어요?
    </p>
    <button class="btn-primary" onclick="startExam()" id="start-exam-btn">시험 시작 🚀</button>
  `;
  cats.appendChild(startDiv);
}

function startExam() {
  const pool = examData[currentExam];
  currentQuestions = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(pool.length, 10));
  currentQIndex = 0;
  userAnswers = new Array(currentQuestions.length).fill(-1);
  timeLeft = currentQuestions.length * 90;
  examStartTime = Date.now();

  document.getElementById('examLobby').classList.add('hidden');
  document.getElementById('examScreen').classList.remove('hidden');
  document.getElementById('resultScreen').classList.add('hidden');

  document.getElementById('examTitle').textContent = `${currentExam} 모의고사`;
  renderQuestion();
  startTimer();
}

function renderQuestion() {
  const q = currentQuestions[currentQIndex];
  const total = currentQuestions.length;

  document.getElementById('qNumber').textContent = `Q${currentQIndex + 1}`;
  document.getElementById('questionCounter').textContent = `${currentQIndex + 1} / ${total}`;
  document.getElementById('qText').textContent = q.q;

  const progress = ((currentQIndex) / total) * 100;
  document.getElementById('examProgress').style.width = `${progress}%`;

  const optLabels = ['A', 'B', 'C', 'D'];
  document.getElementById('qOptions').innerHTML = q.opts.map((opt, i) => `
    <button class="q-option ${userAnswers[currentQIndex] === i ? 'selected' : ''}" 
      onclick="selectOption(${i})" id="opt-${i}">
      <span class="option-marker">${optLabels[i]}</span>
      ${opt}
    </button>
  `).join('');

  document.getElementById('prevBtn').style.opacity = currentQIndex === 0 ? '0.3' : '1';
  document.getElementById('nextBtn').textContent = currentQIndex === total - 1 ? '제출 ✓' : '다음 →';
}

function selectOption(i) {
  userAnswers[currentQIndex] = i;
  document.querySelectorAll('.q-option').forEach((btn, idx) => {
    btn.classList.toggle('selected', idx === i);
  });
}

function prevQuestion() {
  if (currentQIndex > 0) { currentQIndex--; renderQuestion(); }
}

function nextQuestion() {
  if (currentQIndex < currentQuestions.length - 1) {
    currentQIndex++;
    renderQuestion();
  } else {
    finishExam();
  }
}

function startTimer() {
  clearInterval(examTimer);
  updateTimerDisplay();
  examTimer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) finishExam();
  }, 1000);
}

function updateTimerDisplay() {
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');
  const el = document.getElementById('examTimer');
  if (el) {
    el.textContent = `${mins}:${secs}`;
    el.classList.toggle('urgent', timeLeft <= 60);
  }
}

function endExam() {
  if (confirm('시험을 종료하시겠어요? (지금까지 답한 내용으로 채점됩니다)')) finishExam();
}

function finishExam() {
  clearInterval(examTimer);
  let correct = 0;
  currentQuestions.forEach((q, i) => { if (userAnswers[i] === q.ans) correct++; });

  const total = currentQuestions.length;
  const pct = Math.round((correct / total) * 100);

  document.getElementById('examScreen').classList.add('hidden');
  document.getElementById('resultScreen').classList.remove('hidden');

  document.getElementById('resultScore').textContent = correct;
  document.getElementById('resultTotal').textContent = total;

  const emojis = pct >= 90 ? '🏆' : pct >= 70 ? '😊' : pct >= 50 ? '💪' : '😅';
  const msgs = pct >= 90 ? '완벽합니다! 합격 확실! 🎉' : pct >= 70 ? '잘 하고 있어요! 조금만 더!' : pct >= 50 ? '아직 갈 길이 있어요. 다시 도전!' : '틀린 문제를 꼭 복습해보세요 📖';
  document.getElementById('resultEmoji').textContent = emojis;
  document.getElementById('resultTitle').textContent = `${pct}점 — ${pct >= 60 ? '합격권' : '불합격권'}`;
  document.getElementById('resultMsg').textContent = msgs;

  // Breakdown
  const breakdown = document.getElementById('resultBreakdown');
  breakdown.innerHTML = `
    <div class="breakdown-item"><span>정답 수</span><span class="correct-mark">✅ ${correct}문제</span></div>
    <div class="breakdown-item"><span>오답 수</span><span class="wrong-mark">❌ ${total - correct}문제</span></div>
    <div class="breakdown-item"><span>정답률</span><span>${pct}%</span></div>
    <div class="breakdown-item"><span>소요 시간</span><span>${formatTime(Date.now() - examStartTime)}</span></div>
  `;

  // Add to leaderboard
  leaderboardData.push({ name: '나', exam: currentExam, score: correct, total, emoji: '🆕' });
  leaderboardData.sort((a, b) => (b.score/b.total) - (a.score/a.total));
  leaderboardData.splice(8);
}

function formatTime(ms) {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  return `${min}분 ${sec % 60}초`;
}

function reviewAnswers() {
  document.getElementById('resultScreen').classList.add('hidden');
  document.getElementById('examScreen').classList.remove('hidden');
  currentQIndex = 0;
  renderReview();
}

function renderReview() {
  const q = currentQuestions[currentQIndex];
  const total = currentQuestions.length;
  const userAns = userAnswers[currentQIndex];
  const correctAns = q.ans;

  document.getElementById('qNumber').textContent = `Q${currentQIndex + 1} 오답 확인`;
  document.getElementById('questionCounter').textContent = `${currentQIndex + 1} / ${total}`;
  document.getElementById('qText').textContent = q.q;
  document.getElementById('examProgress').style.width = `${((currentQIndex + 1) / total) * 100}%`;

  const optLabels = ['A', 'B', 'C', 'D'];
  document.getElementById('qOptions').innerHTML = q.opts.map((opt, i) => {
    let cls = '';
    if (i === correctAns) cls = 'correct';
    else if (i === userAns && userAns !== correctAns) cls = 'wrong';
    return `
      <button class="q-option ${cls}" disabled id="rev-opt-${i}">
        <span class="option-marker">${optLabels[i]}</span>
        ${opt} ${i === correctAns ? '✅' : ''} ${i === userAns && userAns !== correctAns ? '❌' : ''}
      </button>
    `;
  }).join('') + `<div style="margin-top:16px;padding:14px;background:rgba(0,229,160,0.06);border-radius:10px;border:1px solid rgba(0,229,160,0.2);font-size:0.88rem;color:var(--text-muted);line-height:1.6">
    💡 <strong style="color:var(--success)">해설:</strong> ${q.exp}
  </div>`;

  document.getElementById('prevBtn').style.opacity = currentQIndex === 0 ? '0.3' : '1';
  document.getElementById('nextBtn').textContent = currentQIndex === total - 1 ? '결과로 →' : '다음 →';
  document.getElementById('nextBtn').onclick = () => {
    if (currentQIndex < total - 1) { currentQIndex++; renderReview(); }
    else {
      document.getElementById('examScreen').classList.add('hidden');
      document.getElementById('resultScreen').classList.remove('hidden');
    }
  };
  document.getElementById('prevBtn').onclick = () => {
    if (currentQIndex > 0) { currentQIndex--; renderReview(); }
  };
}

function retakeExam() {
  startExam();
}

// ============================
//   CAREER ALGORITHM
// ============================

const certOptions = [
  '토익 (700+)', '토익 (900+)', '오픽 IH', '오픽 AL',
  '컴활 1급', '컴활 2급', '정보처리기사', '정보처리산업기사',
  'ADSP', 'ADsP+SQLD', 'SQLD', 'AWS Cloud',
  '한국사능력검정', '한국어능력시험', '워드프로세서', '전산회계',
  '빅데이터분석기사', '데이터분석전문가', '사회조사분석사', '기술사(전공)'
];

const careerDB = {
  keywords: {
    IT개발자: ['정보처리기사', '컴활 1급', 'AWS Cloud', 'SQLD', '빅데이터분석기사'],
    데이터분석가: ['ADSP', 'SQLD', '빅데이터분석기사', '데이터분석전문가', '사회조사분석사', 'ADsP+SQLD'],
    IT기획PM: ['정보처리기사', '컴활 1급', '토익 (700+)', '토익 (900+)', 'ADSP'],
    해외영업: ['토익 (900+)', '토익 (700+)', '오픽 IH', '오픽 AL'],
    마케터: ['토익 (700+)', '오픽 IH', 'ADSP', '사회조사분석사', '컴활 1급'],
    경리회계: ['전산회계', '컴활 1급', '컴활 2급', '한국사능력검정'],
    공기업: ['한국사능력검정', '컴활 1급', '토익 (700+)', '한국어능력시험'],
    HR인사: ['사회조사분석사', '컴활 1급', '토익 (700+)', '한국어능력시험'],
    클라우드엔지니어: ['AWS Cloud', '정보처리기사', 'SQLD', '정보처리산업기사'],
  },
  companies: {
    IT개발자: ['삼성SDS', '카카오', '네이버', 'LG CNS', 'SK C&C', '쿠팡'],
    데이터분석가: ['카카오', '네이버', '당근마켓', 'LG전자', 'SK텔레콤', '빅데이터 스타트업'],
    IT기획PM: ['삼성전자', 'KT', 'LG전자', '롯데정보통신', '대기업 IT팀'],
    해외영업: ['대한무역투자진흥공사(KOTRA)', '삼성물산', 'LG상사', '현대무역', '외국계 기업'],
    마케터: ['CJ ENM', '카카오', '아모레퍼시픽', '현대백화점', '스타트업'],
    경리회계: ['대기업 재무팀', '회계법인', '중소기업 경리', 'ERP 관련 회사'],
    공기업: ['한전KPS', '국민건강보험공단', 'LH공사', '한국수자원공사', 'IBK기업은행'],
    HR인사: ['대기업 HR팀', '채용대행사', '헤드헌팅사', '공공기관 인사처'],
    클라우드엔지니어: ['AWS Korea', 'Microsoft', 'KT클라우드', '삼성SDS', 'NHN Cloud'],
  }
};

let selectedCerts = new Set();

function renderCertGrid() {
  const grid = document.getElementById('certGrid');
  grid.innerHTML = certOptions.map(c => `
    <button class="cert-btn ${selectedCerts.has(c) ? 'selected' : ''}" 
      onclick="toggleCert('${c}')" id="cert-btn-${c.replace(/[^a-zA-Z0-9가-힣]/g,'_')}">
      ${c}
    </button>
  `).join('');
}

function toggleCert(cert) {
  if (selectedCerts.has(cert)) selectedCerts.delete(cert);
  else selectedCerts.add(cert);
  renderCertGrid();
  renderSelectedCerts();
}

function renderSelectedCerts() {
  const container = document.getElementById('selectedCerts');
  if (selectedCerts.size === 0) {
    container.innerHTML = '<p class="no-selected">자격증을 선택하면 여기에 표시됩니다</p>';
    return;
  }
  container.innerHTML = [...selectedCerts].map(c => `
    <span class="selected-tag" onclick="toggleCert('${c}')">
      ${c} <span class="remove">×</span>
    </span>
  `).join('');
}

function addCustomCert() {
  const input = document.getElementById('customCert');
  const val = input.value.trim();
  if (!val) return;
  selectedCerts.add(val);
  input.value = '';
  renderCertGrid();
  renderSelectedCerts();
  showToast(`✅ "${val}" 추가되었습니다!`);
}

document.getElementById('customCert').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addCustomCert();
});

function analyzeCareer() {
  if (selectedCerts.size === 0) {
    showToast('⚠️ 자격증을 하나 이상 선택해주세요!');
    return;
  }

  const panel = document.getElementById('careerResult');
  panel.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:200px;color:var(--text-muted)">🔍 분석 중...</div>';

  setTimeout(() => {
    // Score matching
    const scores = {};
    Object.entries(careerDB.keywords).forEach(([job, certs]) => {
      const matches = [...selectedCerts].filter(c =>
        certs.some(kw => c.includes(kw) || kw.includes(c.split(' ')[0]))
      );
      scores[job] = { count: matches.length, total: certs.length };
    });

    const sorted = Object.entries(scores)
      .filter(([_, s]) => s.count > 0)
      .sort((a, b) => (b[1].count / b[1].total) - (a[1].count / a[1].total));

    if (sorted.length === 0) {
      panel.innerHTML = `
        <div class="career-placeholder">
          <div class="placeholder-icon">🤔</div>
          <p>매칭되는 직무가 없어요.<br/>더 많은 자격증을 추가해보세요!</p>
        </div>
      `;
      return;
    }

    const top3 = sorted.slice(0, 3);
    const topJob = top3[0][0];
    const matchPct = Math.round((top3[0][1].count / top3[0][1].total) * 100);

    // Find certs to recommend
    const topCerts = careerDB.keywords[topJob];
    const missing = topCerts.filter(c => ![...selectedCerts].some(s => s.includes(c)));
    const companies = careerDB.companies[topJob] || [];

    panel.innerHTML = `
      <div class="career-result-content">
        <div class="career-result-header">
          <span style="font-size:2rem">${getJobEmoji(topJob)}</span>
          <h3>추천 직무 분석 결과</h3>
          <span class="match-score">AI 분석 완료</span>
        </div>

        <p class="career-section-label">🎯 추천 직무 TOP ${top3.length}</p>
        <div class="job-cards">
          ${top3.map(([job, s], i) => {
            const pct = Math.round((s.count / s.total) * 100);
            return `
              <div class="job-card">
                <div class="job-card-top">
                  <span class="job-title">${getJobEmoji(job)} ${job}</span>
                  <span class="job-match ${pct >= 60 ? 'high' : 'med'}">${pct}% 매칭</span>
                </div>
                <p class="job-desc">${getJobDesc(job)}</p>
                <div style="margin-top:10px;height:4px;background:rgba(255,255,255,0.08);border-radius:2px">
                  <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,var(--primary),var(--accent));border-radius:2px;transition:width 0.8s ease"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <p class="career-section-label">🏢 지원 가능 기업/분야</p>
        <div class="company-chips">
          ${companies.map(c => `<span class="company-chip">${c}</span>`).join('')}
        </div>

        ${missing.length > 0 ? `
          <div class="cert-suggestion">
            <h4>💡 ${topJob} 점수를 올리려면?</h4>
            <p>다음 자격증을 추가로 취득하면 경쟁력이 올라가요:<br/>
              <strong style="color:var(--gold)">${missing.slice(0,3).join(', ')}</strong>
            </p>
          </div>
        ` : `
          <div class="cert-suggestion">
            <h4>🎯 이미 최고 수준의 조합입니다!</h4>
            <p>보유한 자격증 조합이 <strong style="color:var(--gold)">${topJob}</strong>에 완벽히 매칭됩니다. 포트폴리오 준비에 집중하세요!</p>
          </div>
        `}
      </div>
    `;

    // Animate progress bars
    setTimeout(() => {
      panel.querySelectorAll('[style*="width:"]').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => bar.style.width = w, 50);
      });
    }, 100);

  }, 900);
}

function getJobEmoji(job) {
  const map = { IT개발자:'💻', 데이터분석가:'📊', IT기획PM:'🗂️', 해외영업:'🌍', 마케터:'📢', 경리회계:'📑', 공기업:'🏛️', HR인사:'👥', 클라우드엔지니어:'☁️' };
  return map[job] || '💼';
}

function getJobDesc(job) {
  const map = {
    IT개발자: '소프트웨어 개발, API 설계, 시스템 구축 담당. 대기업부터 스타트업까지 수요 높음.',
    데이터분석가: '데이터 수집/분석/시각화로 비즈니스 인사이트를 도출하는 직무.',
    IT기획PM: '프로젝트 기획 및 관리, 비개발자와 개발팀의 브릿지 역할.',
    해외영업: '외국어 역량 기반 해외 시장 개척 및 바이어 관리.',
    마케터: '브랜드 전략, SNS/디지털 마케팅, 데이터 기반 캠페인 운영.',
    경리회계: '재무제표 작성, 세금 신고, ERP 시스템 운영 등 회사 재무 관리.',
    공기업: '안정적인 공공기관 취업. 필기 전형에서 자격증 가산점 활용.',
    HR인사: '채용, 교육, 조직문화 개선 등 인재 관리 담당.',
    클라우드엔지니어: 'AWS/Azure 등 클라우드 인프라 설계 및 운영 전문가.'
  };
  return map[job] || '다양한 분야에서 활약 가능한 직무입니다.';
}

// ============================
//   APPLY FORM
// ============================

function submitApply() {
  const name    = document.getElementById('applyName').value.trim();
  const school  = document.getElementById('applySchool').value.trim();
  const year    = document.getElementById('applyYear').value;
  const cls     = document.getElementById('applyClass').value;
  const phone   = document.getElementById('applyPhone').value.trim();
  const station = document.getElementById('applyStation').value.trim();

  if (!name)    { showToast('⚠️ 이름을 입력해주세요!'); return; }
  if (!school)  { showToast('⚠️ 학교/학과를 입력해주세요!'); return; }
  if (!year)    { showToast('⚠️ 출생연도를 선택해주세요!'); return; }
  if (!cls)     { showToast('⚠️ 희망 반을 선택해주세요!'); return; }
  if (!phone)   { showToast('⚠️ 연락처를 입력해주세요!'); return; }
  if (!station) { showToast('⚠️ 가까운 역을 입력해주세요!'); return; }

  // 전화번호 간단 형식 체크
  const phoneRegex = /^[0-9\-\s]{9,14}$/;
  if (!phoneRegex.test(phone.replace(/[^0-9]/g,''))) {
    showToast('⚠️ 연락처를 올바르게 입력해주세요 (예: 010-0000-0000)'); return;
  }

  const btn = document.getElementById('apply-submit-btn');
  btn.textContent = '제출 중... ⏳';
  btn.disabled = true;

  const msgText = document.getElementById('applyMsg') ? document.getElementById('applyMsg').value.trim() : '';

  db.collection('applications').add({
    name, school, year, cls, phone, station, msg: msgText,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    btn.textContent = '✅ 지원 완료!';
    showToast(`🎉 ${name}님 지원 완료! 24시간 내로 카카오 연락드려요 😊`, 4500);
    ['applyName','applySchool','applyYear','applyClass','applyPhone','applyStation','applyMsg']
      .forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    setTimeout(() => { btn.textContent = '지원 완료! 🚀'; btn.disabled = false; }, 3000);
  }).catch((error) => {
    console.error("Error adding document: ", error);
    showToast('⚠️ 지원 중 오류가 발생했습니다. 다시 시도해 주세요.');
    btn.textContent = '지원 완료! 🚀';
    btn.disabled = false;
  });
}

// ============================
//   INIT
// ============================

document.addEventListener('DOMContentLoaded', () => {
  renderQnAList();
  renderLeaderboard();
  renderCertGrid();
  renderSelectedCerts();
  selectExam('컴활');
  renderMembers();
});
