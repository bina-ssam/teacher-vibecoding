/* =========================================================================
 *  화면 그리기 + 상호작용
 * ========================================================================= */

const CATEGORIES = [
  { key: "학급경영", emoji: '<svg class="ico-board" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="3" width="20" height="15" rx="2" fill="#3B7A57" stroke="#8B5E3C" stroke-width="2"/><path d="M6.5 8.5h8M6.5 11.5h5.5" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><rect x="9" y="18" width="6" height="2.4" rx="1" fill="#8B5E3C"/></svg>', title: "학급경영 프로그램" },
  { key: "교과연계", emoji: "📚", title: "교과연계 프로그램" },
];

const toolClass = (tool) => (tool === "캔바 AI" ? "canva" : "gemini");

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

/* ---------- 사이트 링크 한 칸 ---------- */
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

/* ---------- 프롬프트 한 칸 (제목 없음) ---------- */
function promptCell(text) {
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

/* ---------- 모달 열기 ---------- */
function openModal(idx) {
  const prog = PROGRAMS[idx];
  const overlay = document.getElementById("overlay");

  document.getElementById("modal-content").innerHTML = `
    <div class="modal-head">
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
        ${promptCell(prog.prompt.basic)}
        ${promptCell(prog.prompt.applied)}
      </div>
    </div>
  `;

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  bindCopyButtons(overlay);
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

function closeModal() {
  document.getElementById("overlay").classList.remove("open");
  document.body.style.overflow = "";
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
  renderSections();
  setupTabs();

  document.getElementById("overlay").addEventListener("click", (e) => {
    if (e.target.id === "overlay") closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});
