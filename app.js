/* =========================================================================
 *  화면 그리기 + 상호작용 + 관리자(설정) 모드
 * ========================================================================= */

const CATEGORIES = [
  { key: "학급경영", emoji: '<svg class="ico-board" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="3" width="20" height="15" rx="2" fill="#3B7A57" stroke="#8B5E3C" stroke-width="2"/><path d="M6.5 8.5h8M6.5 11.5h5.5" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><rect x="9" y="18" width="6" height="2.4" rx="1" fill="#8B5E3C"/></svg>', title: "학급경영 프로그램" },
  { key: "교과연계", emoji: "📚", title: "교과연계 프로그램" },
];

const ADMIN_PW = "majang2026!";
const LS_KEY = "vibecoding_overrides";

let adminMode = false;
let currentIdx = null;

const toolClass = (tool) => (tool === "캔바 AI" ? "canva" : "gemini");

/* ---------- 관리자 수정값: 로컬 임시저장 + GitHub 영구저장 ---------- */
const GH_CFG_KEY = "gh_config";
const GH_TOKEN_KEY = "gh_token";

function loadOverrides() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch (e) { return {}; }
}
function saveOverride(name, data) {
  const all = loadOverrides();
  all[name] = data;
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}
/* 페이지 로드 시: 로컬 임시저장 값을 메모리(PROGRAMS)에 반영 */
function applyOverrides() {
  const all = loadOverrides();
  PROGRAMS.forEach((p) => {
    const ov = all[p.name];
    if (ov) {
      p.site   = { ...p.site,   ...(ov.site   || {}) };
      p.prompt = { ...p.prompt, ...(ov.prompt || {}) };
    }
  });
}
function getProgram(idx) { return PROGRAMS[idx]; }

/* ----- GitHub 연결 정보 (이 기기에 보관) ----- */
function getGhConfig() {
  try { return JSON.parse(localStorage.getItem(GH_CFG_KEY)) || {}; }
  catch (e) { return {}; }
}
function saveGhConfig(cfg) { localStorage.setItem(GH_CFG_KEY, JSON.stringify(cfg)); }
function getToken() { return localStorage.getItem(GH_TOKEN_KEY) || ""; }
function saveToken(t) { localStorage.setItem(GH_TOKEN_KEY, t); }
function ghReady() {
  const c = getGhConfig();
  return !!(c.owner && c.repo && c.branch && getToken());
}

/* data.js 파일 내용을 현재 데이터로 새로 생성 */
function generateDataJs() {
  return "/* 이 파일은 사이트 관리자 모드에서 자동으로 생성·수정됩니다. */\n"
       + "const PROGRAMS = " + JSON.stringify(PROGRAMS, null, 2) + ";\n";
}
function toBase64Utf8(str) { return btoa(unescape(encodeURIComponent(str))); }

/* GitHub 저장소의 data.js 에 커밋 → 사이트 재배포 → 모두에게 반영 */
async function commitToGithub(message) {
  const c = getGhConfig();
  const token = getToken();
  const path = c.path || "data.js";
  const api = `https://api.github.com/repos/${c.owner}/${c.repo}/contents/${path}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" };

  // 현재 파일의 sha 조회 (수정 커밋에 필요)
  let sha;
  const getRes = await fetch(`${api}?ref=${encodeURIComponent(c.branch)}`, { headers });
  if (getRes.ok) { sha = (await getRes.json()).sha; }
  else if (getRes.status !== 404) {
    throw new Error(`파일 조회 실패 (${getRes.status}). 사용자명·저장소·브랜치·토큰 권한을 확인하세요.`);
  }

  const body = { message, content: toBase64Utf8(generateDataJs()), branch: c.branch };
  if (sha) body.sha = sha;

  const putRes = await fetch(api, { method: "PUT", headers, body: JSON.stringify(body) });
  if (!putRes.ok) {
    const txt = await putRes.text();
    throw new Error(`저장 실패 (${putRes.status}). ${txt.slice(0, 140)}`);
  }
  return true;
}

/* ---------- 카드 그리드 렌더 ---------- */
function renderSections() {
  const main = document.getElementById("content");
  main.innerHTML = "";

  CATEGORIES.forEach((cat) => {
    const items = PROGRAMS.filter((p) => p.category === cat.key);

    const section = document.createElement("section");
    section.className = "section";
    section.id = "sec-" + cat.key;

    section.innerHTML = `
      <div class="section-head">
        <span class="badge">${cat.emoji}</span>
        <h2>${cat.title}</h2>
        <span class="count">${items.length}개</span>
      </div>
      <div class="grid"></div>
    `;

    const grid = section.querySelector(".grid");
    items.forEach((prog) => {
      const idx = PROGRAMS.indexOf(prog);
      const card = document.createElement("div");
      card.className = "card";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.innerHTML = `
        <div class="card-name">${prog.name}</div>
        <div class="card-foot">
          <span class="tool-chip ${toolClass(prog.tool)}">${prog.tool}</span>
          <span class="go">열기 →</span>
        </div>
      `;
      card.addEventListener("click", () => openModal(idx));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(idx); }
      });
      grid.appendChild(card);
    });

    main.appendChild(section);
  });
}

/* ---------- 사이트 링크 한 칸 (보기 모드) ---------- */
function siteCell(level, url) {
  const cls = level === "기본" ? "basic" : "applied";
  if (url && url.trim()) {
    return `
      <div class="duo-item">
        <div class="lvl ${cls}">${level}</div>
        <a class="link-btn" href="${url.trim()}" target="_blank" rel="noopener">🔗 바로가기</a>
      </div>`;
  }
  return `
    <div class="duo-item">
      <div class="lvl ${cls}">${level}</div>
      <span class="empty-tag">준비 중</span>
    </div>`;
}

/* ---------- 프롬프트 한 칸 (보기 모드, 제목 없음) ---------- */
function promptCell(level, text) {
  if (text && text.trim()) {
    return `
      <div class="prompt-box">
        <div class="prompt-text">${escapeHtml(text.trim())}</div>
        <button class="copy-btn" data-copy="${encodeURIComponent(text.trim())}">📋 복사하기</button>
      </div>`;
  }
  return `
    <div class="prompt-box">
      <div class="prompt-text empty">아직 프롬프트가 등록되지 않았어요. 곧 채워질 예정이에요! ✏️</div>
    </div>`;
}

/* ---------- 보기 모드 화면 ---------- */
function renderView(prog) {
  return `
    <div class="modal-head">
      <button class="gear-btn" aria-label="관리자 설정" title="관리자 설정" onclick="onGearClick()">⚙️</button>
      <button class="close-btn" aria-label="닫기" onclick="closeModal()">✕</button>
      <h3>${prog.name}</h3>
      <span class="tool-chip ${toolClass(prog.tool)}">${prog.tool}</span>
    </div>
    <div class="modal-body">
      <div class="block">
        <div class="block-title"><span class="ic">🖥️</span> 프로그램 사이트</div>
        <div class="duo">
          ${siteCell("기본", prog.site.basic)}
          ${siteCell("응용", prog.site.applied)}
        </div>
      </div>
      <div class="block">
        <div class="block-title"><span class="ic">💬</span> 프롬프트</div>
        ${promptCell("기본", prog.prompt.basic)}
        ${promptCell("응용", prog.prompt.applied)}
      </div>
    </div>
  `;
}

/* ---------- 관리자 수정 화면 ---------- */
function renderEdit(prog) {
  return `
    <div class="modal-head admin">
      <button class="gear-btn active" aria-label="관리자 모드 종료" title="관리자 모드 종료" onclick="onGearClick()">⚙️</button>
      <button class="close-btn" aria-label="닫기" onclick="closeModal()">✕</button>
      <h3>${prog.name}</h3>
      <span class="admin-badge">관리자 모드 · 수정 중</span>
    </div>
    <div class="modal-body">
      <div class="block">
        <div class="block-title"><span class="ic">🖥️</span> 프로그램 사이트</div>
        <label class="edit-label">기본 사이트 주소</label>
        <input class="edit-input" id="ed-site-basic" type="text" value="${escapeHtml(prog.site.basic || "")}" placeholder="https://..." />
        <label class="edit-label">응용 사이트 주소</label>
        <input class="edit-input" id="ed-site-applied" type="text" value="${escapeHtml(prog.site.applied || "")}" placeholder="https://..." />
      </div>
      <div class="block">
        <div class="block-title"><span class="ic">💬</span> 프롬프트</div>
        <label class="edit-label">기본 프롬프트</label>
        <textarea class="edit-area" id="ed-prompt-basic" placeholder="기본 프롬프트를 입력하세요">${escapeHtml(prog.prompt.basic || "")}</textarea>
        <label class="edit-label">응용 프롬프트</label>
        <textarea class="edit-area" id="ed-prompt-applied" placeholder="응용 프롬프트를 입력하세요">${escapeHtml(prog.prompt.applied || "")}</textarea>
      </div>
      <div class="edit-actions">
        <button class="save-btn" id="ed-save">💾 저장하기</button>
        <button class="exit-admin-btn" onclick="onGearClick()">관리자 종료</button>
      </div>
      <button class="gh-link-btn" onclick="openGhModal()">🔗 GitHub 연결 설정</button>
      <p class="edit-note" id="gh-status"></p>
    </div>
  `;
}

/* ---------- 모달 열기 ---------- */
function openModal(idx) {
  currentIdx = idx;
  const prog = getProgram(idx);
  const overlay = document.getElementById("overlay");

  document.getElementById("modal-content").innerHTML =
    adminMode ? renderEdit(prog) : renderView(prog);

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";

  if (adminMode) bindEdit(idx);
  else bindCopyButtons(overlay);
}

function bindCopyButtons(overlay) {
  overlay.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = decodeURIComponent(btn.dataset.copy);
      try { await navigator.clipboard.writeText(text); }
      catch (e) {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); ta.remove();
      }
      const old = btn.textContent;
      btn.textContent = "✅ 복사 완료!";
      btn.disabled = true;
      setTimeout(() => { btn.textContent = old; btn.disabled = false; }, 1500);
    });
  });
}

function bindEdit(idx) {
  // 연결 상태 표시
  const status = document.getElementById("gh-status");
  if (ghReady()) {
    const c = getGhConfig();
    status.innerHTML = `🟢 GitHub 연결됨 · <b>${c.owner}/${c.repo}</b> → 저장 시 모두에게 영구 반영`;
  } else {
    status.textContent = "⚪ GitHub 미연결 · 저장 시 이 브라우저에만 보관됩니다";
  }

  document.getElementById("ed-save").addEventListener("click", async () => {
    const prog = PROGRAMS[idx];
    prog.site = {
      basic:   document.getElementById("ed-site-basic").value.trim(),
      applied: document.getElementById("ed-site-applied").value.trim(),
    };
    prog.prompt = {
      basic:   document.getElementById("ed-prompt-basic").value,
      applied: document.getElementById("ed-prompt-applied").value,
    };
    saveOverride(prog.name, { site: prog.site, prompt: prog.prompt });

    const btn = document.getElementById("ed-save");
    if (ghReady()) {
      btn.disabled = true;
      btn.textContent = "⏳ GitHub에 저장 중...";
      try {
        await commitToGithub(`Update "${prog.name}" via admin mode`);
        showToast("GitHub에 저장됨 · 약 1분 뒤 모두에게 반영돼요 ✅");
      } catch (e) {
        showToast("⚠️ " + e.message);
      } finally {
        btn.disabled = false;
        btn.textContent = "💾 저장하기";
      }
    } else {
      showToast("이 브라우저에만 임시 저장됨 (GitHub 미연결) 💾");
    }
  });
}

/* ---------- GitHub 연결 설정 모달 ---------- */
function openGhModal() {
  const c = getGhConfig();
  document.getElementById("gh-owner").value  = c.owner  || "bina-ssam";
  document.getElementById("gh-repo").value   = c.repo   || "teacher-vibecoding";
  document.getElementById("gh-branch").value = c.branch || "main";
  document.getElementById("gh-token").value  = getToken();
  document.getElementById("gh-msg").textContent = "";
  document.getElementById("gh-overlay").classList.add("open");
}
function closeGhModal() { document.getElementById("gh-overlay").classList.remove("open"); }
function saveGh() {
  const cfg = {
    owner:  document.getElementById("gh-owner").value.trim(),
    repo:   document.getElementById("gh-repo").value.trim(),
    branch: document.getElementById("gh-branch").value.trim() || "main",
    path:   "data.js",
  };
  saveGhConfig(cfg);
  saveToken(document.getElementById("gh-token").value.trim());
  document.getElementById("gh-msg").textContent = "저장되었습니다 ✅";
  showToast("GitHub 연결 정보 저장됨");
  setTimeout(closeGhModal, 600);
}
function clearGh() {
  localStorage.removeItem(GH_CFG_KEY);
  localStorage.removeItem(GH_TOKEN_KEY);
  openGhModal();
  document.getElementById("gh-msg").textContent = "연결 정보를 지웠습니다.";
}

function closeModal() {
  document.getElementById("overlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------- 관리자 게이트 ---------- */
function onGearClick() {
  if (adminMode) {
    adminMode = false;
    if (currentIdx !== null) openModal(currentIdx);   // 보기 모드로 다시 그림
  } else {
    openPwModal();
  }
}

function openPwModal() {
  const o = document.getElementById("pw-overlay");
  document.getElementById("pw-input").value = "";
  document.getElementById("pw-msg").textContent = "";
  o.classList.add("open");
  setTimeout(() => document.getElementById("pw-input").focus(), 50);
}
function closePwModal() {
  document.getElementById("pw-overlay").classList.remove("open");
}
function submitPw() {
  const v = document.getElementById("pw-input").value;
  if (v === ADMIN_PW) {
    adminMode = true;
    closePwModal();
    if (currentIdx !== null) openModal(currentIdx);   // 수정 모드로 다시 그림
  } else {
    document.getElementById("pw-msg").textContent = "비밀번호가 올바르지 않습니다.";
    document.getElementById("pw-input").select();
  }
}

/* ---------- 토스트 ---------- */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- 분류 탭 (스크롤 이동) ---------- */
function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = document.getElementById("sec-" + tab.dataset.cat);
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  const sections = CATEGORIES.map((c) => document.getElementById("sec-" + c.key));
  window.addEventListener("scroll", () => {
    let current = CATEGORIES[0].key;
    sections.forEach((sec, i) => {
      if (sec.getBoundingClientRect().top <= 120) current = CATEGORIES[i].key;
    });
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.cat === current));
  });
}

/* ---------- 유틸 ---------- */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

/* ---------- 시작 ---------- */
document.addEventListener("DOMContentLoaded", () => {
  applyOverrides();
  renderSections();
  setupTabs();

  document.getElementById("overlay").addEventListener("click", (e) => {
    if (e.target.id === "overlay") closeModal();
  });

  // 비밀번호 모달
  document.getElementById("pw-ok").addEventListener("click", submitPw);
  document.getElementById("pw-cancel").addEventListener("click", closePwModal);
  document.getElementById("pw-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitPw();
  });
  document.getElementById("pw-overlay").addEventListener("click", (e) => {
    if (e.target.id === "pw-overlay") closePwModal();
  });

  // GitHub 연결 설정 모달
  document.getElementById("gh-save").addEventListener("click", saveGh);
  document.getElementById("gh-cancel").addEventListener("click", closeGhModal);
  document.getElementById("gh-clear").addEventListener("click", clearGh);
  document.getElementById("gh-overlay").addEventListener("click", (e) => {
    if (e.target.id === "gh-overlay") closeGhModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (document.getElementById("gh-overlay").classList.contains("open")) closeGhModal();
      else if (document.getElementById("pw-overlay").classList.contains("open")) closePwModal();
      else closeModal();
    }
  });
});
