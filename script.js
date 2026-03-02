/**
 * Lightweight password gate (client-side).
 * IMPORTANT: This does NOT provide real security. Anyone can view source and bypass.
 * For real protection use an access gateway / reverse proxy / SSO in front of GitHub Pages.
 */
const PASSWORD = "emeasolution";
const STORAGE_KEY = "beldenMeetingAuth_v1";

const gate = document.getElementById("gate");
const gateForm = document.getElementById("gateForm");
const passwordInput = document.getElementById("password");
const gateError = document.getElementById("gateError");

function unlock() {
  localStorage.setItem(STORAGE_KEY, "ok");
  gate.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "auto";
  // Focus first section for accessibility
  const agenda = document.getElementById("agenda");
  if (agenda) agenda.scrollIntoView({ behavior: "smooth" });
}

function lock() {
  localStorage.removeItem(STORAGE_KEY);
  gate.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function isUnlocked() {
  return localStorage.getItem(STORAGE_KEY) === "ok";
}

// Init gate
if (isUnlocked()) {
  gate.setAttribute("aria-hidden", "true");
} else {
  document.body.style.overflow = "hidden";
  setTimeout(() => passwordInput?.focus(), 50);
}

gateForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  gateError.textContent = "";
  const v = (passwordInput.value || "").trim();
  if (v === PASSWORD) {
    unlock();
  } else {
    gateError.textContent = "Incorrect password. Please try again.";
    passwordInput.select();
  }
});

// Agenda rendering
function linkify(text) {
  if (!text) return "";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`);
}

function createDayCard(dayObj, openByDefault=false) {
  const day = document.createElement("div");
  day.className = "day" + (openByDefault ? " open" : "");

  const header = document.createElement("div");
  header.className = "day-header";

  const left = document.createElement("div");
  const title = document.createElement("div");
  title.className = "day-title";
  title.textContent = dayObj.day;

  const sub = document.createElement("div");
  sub.className = "day-sub";
  sub.textContent = `${dayObj.slots.length} sessions`;

  left.appendChild(title);
  left.appendChild(sub);

  const chev = document.createElement("div");
  chev.className = "chev";
  chev.innerHTML = "▾";

  header.appendChild(left);
  header.appendChild(chev);

  const body = document.createElement("div");
  body.className = "day-body";

  const inner = document.createElement("div");
  inner.className = "day-inner";

  if (dayObj.attendees && dayObj.attendees.length) {
    const pills = document.createElement("div");
    pills.className = "pills";
    dayObj.attendees.forEach(a => {
      const p = document.createElement("div");
      p.className = "pill";
      p.textContent = a;
      pills.appendChild(p);
    });
    inner.appendChild(pills);
  }

  const table = document.createElement("table");
  table.className = "table";
  table.innerHTML = `
    <thead>
      <tr>
        <th style="width: 150px;">Time</th>
        <th>Topic</th>
        <th style="width: 160px;">Who</th>
      </tr>
    </thead>
  `;
  const tbody = document.createElement("tbody");

  dayObj.slots.forEach(s => {
    const tr = document.createElement("tr");
    const tdTime = document.createElement("td");
    tdTime.textContent = s.time;

    const tdTopic = document.createElement("td");
    tdTopic.className = "topic";
    tdTopic.innerHTML = linkify(s.topic);

    const tdWho = document.createElement("td");
    tdWho.className = "who";
    tdWho.textContent = s.who || "";

    tr.appendChild(tdTime);
    tr.appendChild(tdTopic);
    tr.appendChild(tdWho);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  inner.appendChild(table);

  body.appendChild(inner);

  header.addEventListener("click", () => {
    day.classList.toggle("open");
  });

  day.appendChild(header);
  day.appendChild(body);
  return day;
}

async function loadAgenda() {
  const root = document.getElementById("agendaRoot");
  if (!root) return;

  try {
    const res = await fetch("agenda.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Agenda not found");
    const agenda = await res.json();

    agenda.days.forEach((d, idx) => {
      root.appendChild(createDayCard(d, idx === 0));
    });
  } catch (err) {
    root.innerHTML = `
      <div class="card">
        <h4>Agenda could not be loaded</h4>
        <p class="muted">If you are viewing this locally, serve the folder with a local web server (not via file://).</p>
      </div>
    `;
  }
}

loadAgenda();
