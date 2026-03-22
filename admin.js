// Firebase 설정 및 초기화
const firebaseConfig = {
  apiKey: "AIzaSyAG9FG8e27AZt2Q_z--H4cU03DnYHVjxLI",
  authDomain: "jakyeokjeung-matjip.firebaseapp.com",
  projectId: "jakyeokjeung-matjip",
  storageBucket: "jakyeokjeung-matjip.firebasestorage.app",
  messagingSenderId: "983617660339",
  appId: "1:983617660339:web:80179e2350e410cc33d7c6"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ====== TOAST ======
function showToast(msg, duration = 2800) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ============================
//   LOGIN LOGIC
// ============================
const ADMIN_PWD = "0314";
const loginOverlay = document.getElementById('loginOverlay');
const adminDashboard = document.getElementById('adminDashboard');
const loginBtn = document.getElementById('loginBtn');
const pwdInput = document.getElementById('adminPwd');

if (sessionStorage.getItem('adminLoggedIn') === 'true') {
  showDashboard();
}

loginBtn.addEventListener('click', attemptLogin);
pwdInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') attemptLogin();
});

function attemptLogin() {
  if (pwdInput.value === ADMIN_PWD) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    showDashboard();
  } else {
    document.getElementById('loginError').style.display = 'block';
    pwdInput.value = '';
    pwdInput.focus();
  }
}

function showDashboard() {
  loginOverlay.style.display = 'none';
  adminDashboard.classList.remove('hidden');
  fetchApplicants();
}

// ============================
//   DATA FETCHING & RENDER
// ============================

function fetchApplicants() {
  db.collection('applications').orderBy('timestamp', 'desc').get()
    .then((querySnapshot) => {
      const tbody = document.getElementById('applicantList');
      const countLabel = document.getElementById('totalCount');
      
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      countLabel.textContent = docs.length;

      if (docs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 40px; color: var(--text-muted);">아직 지원된 내역이 없습니다. 👀</td></tr>`;
        return;
      }

      tbody.innerHTML = docs.map(app => `
        <tr id="row-${app.id}">
          <td style="color:var(--text-muted); font-size:0.8rem;">
            ${formatDate(app.timestamp)}
          </td>
          <td style="font-weight:700;">${safeString(app.name)}</td>
          <td>${safeString(app.school)}</td>
          <td>${safeString(app.year)}</td>
          <td><span style="background:rgba(192,80,255,0.1);color:var(--primary-light);padding:3px 8px;border-radius:20px;font-size:0.75rem;font-weight:700;">${safeString(app.cls)}</span></td>
          <td>${safeString(app.phone)}</td>
          <td>${safeString(app.station)}</td>
          <td style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${safeString(app.msg)}</td>
          <td>
            <button class="delete-btn" onclick="deleteApplicant('${app.id}', '${safeString(app.name)}')">삭제 🗑</button>
          </td>
        </tr>
      `).join('');
    })
    .catch((error) => {
      console.error("Error getting applications: ", error);
      document.getElementById('applicantList').innerHTML = `<tr><td colspan="9" style="text-align:center; color: var(--error);">데이터를 불러오는 데 실패했습니다.</td></tr>`;
    });
}

function deleteApplicant(id, name) {
  if (!confirm(`정말로 ${name}님의 지원서를 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다.)`)) return;

  db.collection('applications').doc(id).delete()
    .then(() => {
      showToast('삭제 완료되었습니다.');
      document.getElementById(`row-${id}`).remove();
      const countLabel = document.getElementById('totalCount');
      countLabel.textContent = Math.max(0, parseInt(countLabel.textContent) - 1);
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
      showToast('삭제 실패. 다시 시도해 주세요.');
    });
}

function formatDate(timestamp) {
  if (!timestamp) return '알 수 없음';
  const d = timestamp.toDate();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function safeString(str) {
  return str ? str.replace(/</g, "&lt;").replace(/>/g, "&gt;") : '-';
}
