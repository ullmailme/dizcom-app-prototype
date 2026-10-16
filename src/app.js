"use strict";
/* DizCom APP, прототип. Данные выдуманные, всё хранится только в памяти страницы: после перезагрузки возвращается как было. */

const TODAY_ISO = "2026-10-16";
const q$ = (s, r = document) => r.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = s => String(s || "").toLowerCase().replace(/ё/g, "е");

/* значки собраны из простых линий */
const ICONS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  tasks: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="M9 14l2 2 4-4"/>',
  building: '<path d="M4 21V5l8-2v18"/><path d="M12 9l8 2v10"/><path d="M3 21h18"/><path d="M8 8h.01M8 12h.01M8 16h.01M16 15h.01M16 18h.01"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chevR: '<path d="M9 6l6 6-6 6"/>',
  chevL: '<path d="M15 6l-6 6 6 6"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 6.1A9.6 9.6 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.6 7.6A16.5 16.5 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 4-.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  router: '<rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 17h.01M11 17h.01"/><path d="M8 11a6 6 0 0 1 8 0M5.5 8.5a10 10 0 0 1 13 0"/>',
  nas: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 12h6M17 12h.01"/>',
  printer: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><rect x="7" y="14" width="10" height="7" rx="1"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M14 9l2 2"/>',
  wifi: '<path d="M2.5 9a15 15 0 0 1 19 0M5.5 12.5a10.5 10.5 0 0 1 13 0M8.5 16a6 6 0 0 1 7 0"/><path d="M12 19.5h.01"/>',
  wifiOff: '<path d="M3 3l18 18"/><path d="M5.5 12.5a10.5 10.5 0 0 1 4-2.4M8.5 16a6 6 0 0 1 4.5-1.2M12 19.5h.01M2.5 9a15 15 0 0 1 4-2.6M17 6.4A15 15 0 0 1 21.5 9"/>',
  remote: '<path d="M3 8V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/><path d="M3 12a9 9 0 0 1 9 9M3 16a5 5 0 0 1 5 5M3 20h.01"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  db: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  badge: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h6M7 14h4"/><circle cx="17" cy="12" r="1.5"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  file: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14a5 5 0 0 1 4.5 5"/>',
  chat: '<path d="M4 4h16v12H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  fingerprint: '<path d="M6 11a6 6 0 0 1 12 0v2M9 21c-1-2-1.5-4-1.5-6.5a4.5 4.5 0 0 1 9 0c0 3 .5 5 1.5 7M12 12.5V16c0 2 .5 3.5 1.5 5"/>',
  send: '<path d="M3 11l18-8-8 18-2-8z"/>',
  logout: '<path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'
};
const ic = (n, cls = "") => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;

/* ---------- состояние ---------- */
const S = {
  role: "manager", online: true, queue: [], pin: "", q: "", stack: [], tab: "home",
  ui: { devCat: "all", accCat: "all", taskFilter: "all", rev: {}, files: {}, cq: "" },
  settings: { vat: true, rate: 22 },
  log: D.log.slice(), disputes: D.disputes, off: {}, chat: [], form: null
};
const ME = { manager: "u1", staff: "u2", contractor: "c1" };
const ROLE_NAME = { manager: "Руководитель", staff: "Сотрудник", contractor: "Подрядчик" };
const co = id => D.companies.find(c => c.id === id);
const dev = id => D.devices.find(d => d.id === id);
const acc = id => D.accesses.find(a => a.id === id);
const tsk = id => D.tasks.find(t => t.id === id);
const nameOf = id => (D.users.find(u => u.id === id) || D.contractors.find(c => c.id === id) || {}).name || "";
const meId = () => ME[S.role];
const myName = () => nameOf(meId());
const isC = () => S.role === "contractor";
const isOpen = t => t.status === "new" || t.status === "work" || t.status === "review";
const myTasks = () => D.tasks.filter(t => !isC() || t.exec === meId());
/* подрядчик получает данные только по своим незакрытым задачам */
const grantTasks = () => D.tasks.filter(t => t.exec === meId() && isOpen(t));
const grantedDevs = () => new Set(grantTasks().flatMap(t => t.devs));
const grantedAccs = () => new Set(grantTasks().flatMap(t => t.accs));
const visCompanies = () => isC() ? D.companies.filter(c => myTasks().some(t => t.co === c.id)) : D.companies;
const visDevs = id => D.devices.filter(d => d.co === id && (!isC() || grantedDevs().has(d.id)));
const visAccs = id => D.accesses.filter(a => a.co === id && (!isC() || grantedAccs().has(a.id)));
const canSeeCo = id => visCompanies().some(c => c.id === id);

const fmtD = iso => iso.split("-").reverse().join(".");
const fmtDue = iso => iso === TODAY_ISO ? "сегодня" : fmtD(iso);
const nowStr = () => { const d = new Date(); return "16.10.2026 " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); };
const rub = n => Math.round(n).toLocaleString("ru-RU") + " ₽";
const plural = (n, f) => { const m = n % 100, d = n % 10; return n + " " + (m > 10 && m < 15 ? f[2] : d === 1 ? f[0] : d > 1 && d < 5 ? f[1] : f[2]); };

const ST = { new: ["Новая", "p-new"], work: ["В работе", "p-work"], review: ["На проверке", "p-review"], done: ["Выполнена", "p-done"], cancel: ["Отменена", "p-cancel"] };
const FILTER = { new: "Новые", work: "В работе", review: "На проверке", done: "Выполнены", cancel: "Отменены" };
const PRIO = { high: "Высокий", mid: "Средний", low: "Низкий" };
const DEV_ICON = { srv: "server", pc: "monitor", net: "router", nas: "nas", prn: "printer", cam: "camera", tel: "phone", oth: "box" };
const ACC_ICON = { dev: "lock", inet: "globe", wifi: "wifi", remote: "remote", vpn: "shield", mail: "mail", web: "link", onec: "db", lic: "badge", oth: "key" };
const TYPE_ICON = { "Настройка серверов": "server", "Установка ПО": "monitor", "Сеть и Wi-Fi": "wifi", "Видеонаблюдение": "camera", "Ремонт и замена": "edit", "Прочее": "tasks" };

/* ---------- мелкие блоки разметки ---------- */
const pill = (cls, t) => `<span class="pill ${cls}">${esc(t)}</span>`;
const hdr = ({ title, sub = "", back = false, right = "" }) => `<header class="hd ${back ? "sub" : ""}">${back ? `<button class="icon-btn" data-act="back" aria-label="Назад">${ic("chevL")}</button>` : ""}<div class="hd-t"><h1>${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ""}</div>${right}</header>`;
const list = rows => `<div class="list">${rows.join("")}</div>`;
const sec = (title, right = "") => `<div class="sec-h"><h2>${esc(title)}</h2>${right}</div>`;
const row = ({ go, icon, cls = "", title, lines = [], right = "" }) => `<button class="row" data-go="${esc(go)}"><span class="ico ${cls}">${ic(icon)}</span><span class="row-m"><b>${esc(title)}</b>${lines.filter(Boolean).map(l => `<small>${l}</small>`).join("")}</span>${right}${ic("chevR", "chev")}</button>`;
const kv = rows => `<dl class="kv">${rows.filter(Boolean).map(r => `<div class="kv-r"><dt>${esc(r[0])}</dt><dd class="${r[2] ? "act" : ""}">${r[1]}</dd></div>`).join("")}</dl>`;
const copyRow = (k, v, mono = true) => [k, `<span class="${mono ? "mono" : ""}">${esc(v)}</span><button class="icon-btn sm" data-act="copy" data-v="${esc(v)}" aria-label="Копировать: ${esc(k)}">${ic("copy")}</button>`, true];
const empty = (t, s = "") => `<div class="empty"><b>${esc(t)}</b>${esc(s)}</div>`;
const notFound = () => hdr({ title: "Нет доступа", back: true }) + empty("Здесь пусто", "Эти данные вам не выданы или не существуют.");
const chipsBar = (items, cur, key) => `<div class="chips" role="group">${items.map(([k, l, n]) => `<button class="chip" aria-pressed="${k === cur}" data-act="ui" data-k="${key}" data-v="${k}">${esc(l)}${n != null ? ` <span class="n">${n}</span>` : ""}</button>`).join("")}</div>`;
const segBar = (items, cur, route) => `<div class="seg" role="tablist">${items.map(([k, l]) => `<button role="tab" aria-selected="${k === cur}" data-act="ctab" data-r="${route(k)}">${esc(l)}</button>`).join("")}</div>`;
const editBtn = () => `<button class="icon-btn" data-act="proto" aria-label="Редактировать">${ic("edit")}</button>`;

/* пароли: на экране скрыты, в разметке лежат только когда показаны */
function getSecret(key) {
  if (key.startsWith("h:")) { const p = key.split(":"); return acc(p[1]).hist[+p[2]].val; }
  return acc(key).pass;
}
function secRow(key, label = "Пароль") {
  const shown = !!S.ui.rev[key];
  const lab = label.toLowerCase();
  return [label, `<span class="mono ${shown ? "" : "mask"}">${shown ? esc(getSecret(key)) : "••••••••"}</span><span class="btn-pair"><button class="icon-btn sm" data-act="reveal" data-k="${key}" aria-pressed="${shown}" aria-label="${shown ? "Скрыть" : "Показать"} ${lab}">${ic(shown ? "eyeOff" : "eye")}</button><button class="icon-btn sm" data-act="copysec" data-k="${key}" aria-label="Копировать ${lab}">${ic("copy")}</button></span>`, true];
}
function addLog(what, key) {
  const a = acc(key.startsWith("h:") ? key.split(":")[1] : key);
  S.log.unshift({ who: myName(), what: `${what} пароля «${a.title}»`, co: co(a.co).name, when: nowStr() });
}

/* ---------- уведомления на экране ---------- */
let toastT;
function toast(msg) {
  const t = q$("#toast");
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastT);
  toastT = setTimeout(() => { t.hidden = true; }, 3200);
}
function doCopy(text, ok) {
  const fallback = () => {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta); ta.select();
    let done = false;
    try { done = document.execCommand("copy"); } catch (e) { done = false; }
    ta.remove();
    toast(done ? ok : "Не удалось скопировать. Выделите текст и скопируйте вручную.");
  };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => toast(ok), fallback);
  else fallback();
}
function openSheet(html) {
  const w = q$("#sheet");
  w.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
  w.hidden = false;
  const first = w.querySelector("input, textarea, select");
  if (first) first.focus();
}
function closeSheet() { const w = q$("#sheet"); w.hidden = true; w.innerHTML = ""; }
/* любое изменение: без связи оно ждёт отправки на сервер */
function commit(label) { if (!S.online) S.queue.push(label); render(true); }

/* ---------- переходы ---------- */
const parse = r => { const p = r.split("."); return { name: p[0], args: p.slice(1), route: r }; };
const TAB_OF = { home: "home", tasks: "tasks", task: "tasks", newtask: "tasks", companies: "companies", company: "companies", device: "companies", access: "companies", alerts: "alerts", more: "more", assistant: "more", contractors: "more", contractor: "more", people: "more", settings: "more" };
const TAB_ROOT = { home: 1, tasks: 1, companies: 1, alerts: 1, more: 1 };
function formInit(coId) {
  S.form = { title: "", co: coId || "", desc: "", type: D.taskTypes[0], prio: "mid", due: "2026-10-20", exec: "u2", devs: [], accs: [], errs: {} };
}
function navigate(route, opt = {}) {
  const r = parse(route);
  if (opt.reset) S.stack = [r]; else if (opt.replace) S.stack[S.stack.length - 1] = r; else S.stack.push(r);
  if (TAB_OF[r.name]) S.tab = TAB_OF[r.name];
  if (r.name === "company" && !opt.replace) { S.ui.devCat = "all"; S.ui.accCat = "all"; }
  if (r.name === "newtask" && !opt.replace) formInit(r.args[0]);
  render(false);
  window.scrollTo(0, 0);
  q$("#view").focus({ preventScroll: true });
}
function back() { if (S.stack.length > 1) { S.stack.pop(); render(false); window.scrollTo(0, 0); } }

/* ---------- поиск ---------- */
function searchAll(q) {
  const toks = norm(q).split(/\s+/).filter(Boolean);
  if (!toks.length) return null;
  const ok = h => { const n = norm(h); const m = n + " " + n.replace(/[-\s]/g, ""); return toks.every(t => m.includes(t)); };
  const cos = visCompanies();
  const ids = new Set(cos.map(c => c.id));
  const cn = id => co(id).name + " " + co(id).short;
  return {
    companies: cos.filter(c => ok([c.name, c.sub, c.addr, c.inn, c.phone, c.email, c.contact].join(" "))),
    devices: D.devices.filter(d => ids.has(d.co) && (!isC() || grantedDevs().has(d.id)) && ok([d.name, d.model, d.role, d.ip, d.mac, d.where, d.note, D.cats[d.cat], cn(d.co), d.extra.map(e => e[1]).join(" ")].join(" "))),
    accesses: D.accesses.filter(a => ids.has(a.co) && (!isC() || grantedAccs().has(a.id)) && ok([a.title, a.login, a.note, D.acats[a.cat], cn(a.co), a.f.map(e => e[1]).join(" ")].join(" "))),
    tasks: myTasks().filter(t => ok([t.title, t.desc, t.type, cn(t.co)].join(" ")))
  };
}
const accCard = a => `<article class="res"><button class="res-h" data-go="access.${a.id}"><span class="ico">${ic(ACC_ICON[a.cat])}</span><span class="row-m"><b>${esc(a.title)}</b><small>${esc(co(a.co).name)}</small></span>${ic("chevR", "chev")}</button>${kv([a.f.length ? copyRow(a.f[0][0], a.f[0][1]) : null, a.login ? copyRow("Логин", a.login) : null, a.pass ? secRow(a.id) : null])}</article>`;
const devCard = d => `<article class="res"><button class="res-h" data-go="device.${d.id}"><span class="ico">${ic(DEV_ICON[d.cat])}</span><span class="row-m"><b>${esc(d.name)}</b><small>${esc(d.role)}, ${esc(co(d.co).name)}</small></span>${ic("chevR", "chev")}</button>${kv([d.ip !== "облако" ? copyRow("IP-адрес", d.ip) : null, d.mac ? copyRow("MAC-адрес", d.mac) : null])}</article>`;
function resultsHtml(r) {
  if (!r) return "";
  const n = r.companies.length + r.devices.length + r.accesses.length + r.tasks.length;
  if (!n) return empty("Ничего не нашли", "Попробуйте часть названия, IP-адрес или имя сети.");
  let h = "";
  if (r.accesses.length) h += sec("Доступы", `<span class="muted">${r.accesses.length}</span>`) + r.accesses.slice(0, 8).map(accCard).join("");
  if (r.devices.length) h += sec("Устройства", `<span class="muted">${r.devices.length}</span>`) + r.devices.slice(0, 8).map(devCard).join("");
  if (r.companies.length) h += sec("Компании", `<span class="muted">${r.companies.length}</span>`) + list(r.companies.slice(0, 6).map(companyRow));
  if (r.tasks.length) h += sec("Задачи", `<span class="muted">${r.tasks.length}</span>`) + list(r.tasks.slice(0, 6).map(taskRow));
  return h;
}

/* ---------- строки списков ---------- */
const companyRow = c => row({ go: "company." + c.id, icon: "building", title: c.name, lines: [esc(c.sub), `${plural(visDevs(c.id).length, ["устройство", "устройства", "устройств"])}, ${plural(visAccs(c.id).length, ["доступ", "доступа", "доступов"])}`] });
const devRow = d => row({ go: "device." + d.id, icon: DEV_ICON[d.cat], title: d.name, lines: [esc(d.role), `<span class="mono">${esc(d.ip)}</span>`] });
const accRow = a => row({ go: "access." + a.id, icon: ACC_ICON[a.cat], title: a.title, lines: [esc(a.login || (a.f[0] ? a.f[0][0] + ": " + a.f[0][1] : "")), esc(D.acats[a.cat])] });
const execName = t => nameOf(t.exec);
function taskRow(t) {
  const [sl, sc] = ST[t.status];
  const over = isOpen(t) && t.due < TODAY_ISO;
  return row({ go: "task." + t.id, icon: TYPE_ICON[t.type] || "tasks", cls: "t-" + t.status, title: t.title, lines: [`${pill(sc, sl)} <span class="${over ? "bad" : ""}">Срок: ${fmtDue(t.due)}${over ? ", просрочено" : ""}</span>`, `${esc(co(t.co).name)}, ${esc(execName(t))}`] });
}
const byDue = (a, b) => (isOpen(a) ? 0 : 1) - (isOpen(b) ? 0 : 1) || a.due.localeCompare(b.due);

/* ---------- экраны ---------- */
const SCREENS = {};

SCREENS.login = () => `<section class="login">
  <div class="logo">DizCom</div>
  <h1>Введите код</h1>
  <p>Данные на телефоне закрыты кодом. В прототипе подойдёт любой код из четырёх цифр.</p>
  <div class="dots" role="img" aria-label="Введено цифр: ${S.pin.length} из 4">${[0, 1, 2, 3].map(i => `<span class="dot ${i < S.pin.length ? "on" : ""}"></span>`).join("")}</div>
  <div class="keypad">
    ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="key" data-act="pin" data-a="${n}">${n}</button>`).join("")}
    <button class="key alt" data-act="bio" aria-label="Войти по отпечатку">${ic("fingerprint")}</button>
    <button class="key" data-act="pin" data-a="0">0</button>
    <button class="key alt" data-act="pindel" aria-label="Стереть цифру">${ic("chevL")}</button>
  </div>
</section>`;

function connChip() {
  return `<button class="chip-btn ${S.online ? "" : "warn"}" data-act="net" aria-label="${S.online ? "Связь есть. Нажмите, чтобы показать работу без связи" : "Связи нет. Нажмите, чтобы вернуть связь"}">${ic(S.online ? "wifi" : "wifiOff")}${S.online ? "На связи" : "Нет связи"}</button>`;
}
function donut(parts, total) {
  const r = 42, C = 2 * Math.PI * r;
  let off = 0;
  const segs = total ? parts.filter(p => p.n > 0).map(p => { const len = p.n / total * C; const s = `<circle cx="60" cy="60" r="${r}" fill="none" stroke-width="14" style="stroke:${p.color}" stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}"/>`; off += len; return s; }).join("") : "";
  return `<svg viewBox="0 0 120 120" class="donut" role="img" aria-label="Открытых задач: ${total}"><g transform="rotate(-90 60 60)"><circle cx="60" cy="60" r="${r}" fill="none" stroke-width="14" style="stroke:var(--grey-soft)"/>${segs}</g><text x="60" y="62" text-anchor="middle" class="d-n">${total}</text><text x="60" y="80" text-anchor="middle" class="d-l">открыто</text></svg>`;
}
function homeBody() {
  const all = myTasks();
  const n = s => all.filter(t => t.status === s).length;
  const open = n("new") + n("work") + n("review");
  const up = all.filter(isOpen).sort(byDue).slice(0, 3);
  return sec("Задачи") + `<div class="card donut-card">${donut([{ n: n("new"), color: "var(--accent)" }, { n: n("work"), color: "var(--amber)" }, { n: n("review"), color: "var(--violet)" }], open)}
    <ul class="legend"><li><i style="background:var(--accent)"></i>Новые<b>${n("new")}</b></li><li><i style="background:var(--amber)"></i>В работе<b>${n("work")}</b></li><li><i style="background:var(--violet)"></i>На проверке<b>${n("review")}</b></li><li class="done-l">Выполнено<b>${n("done")}</b></li></ul></div>`
    + sec("Ближайшие задачи", `<button data-go="tasks">Все задачи</button>`) + (up.length ? list(up.map(taskRow)) : empty("Открытых задач нет"))
    + sec("Компании", `<button data-go="companies">Все компании</button>`) + list(visCompanies().slice(0, 3).map(companyRow));
}
SCREENS.home = () => hdr({ title: "Главная", right: connChip() }) + `<div class="pad">
  <label class="search"><span class="sr-only">Поиск по данным</span>${ic("search")}<input id="q" type="search" placeholder="IP, логин, модель, компания" autocomplete="off" value="${esc(S.q)}"></label>
  <button class="btn soft wide stack-btn" style="margin:10px 0 0" data-go="assistant">${ic("chat")} Спросить помощника</button></div>
  <div id="home-body" ${S.q ? "hidden" : ""}>${homeBody()}</div>
  <div id="results" aria-live="polite" ${S.q ? "" : "hidden"}>${resultsHtml(searchAll(S.q))}</div>`;

SCREENS.tasks = () => {
  const all = myTasks();
  const f = S.ui.taskFilter;
  const items = [["all", "Все", all.length]].concat(Object.keys(ST).map(k => [k, FILTER[k], all.filter(t => t.status === k).length]));
  const rows = (f === "all" ? all : all.filter(t => t.status === f)).slice().sort(byDue);
  return hdr({ title: "Задачи", right: isC() ? "" : `<button class="icon-btn" data-go="newtask" aria-label="Создать задачу">${ic("plus")}</button>` }) + chipsBar(items, f, "taskFilter")
    + (rows.length ? list(rows.map(taskRow)) : empty("Задач нет", "В этом списке пока ничего нет."));
};

function estimateHtml(t) {
  const head = sec("Смета", `<button class="link-btn" data-act="estsheet" data-t="${t.id}">Добавить позицию</button>`);
  if (!t.est.length) return head + `<div class="card">${empty("Сметы пока нет", "Добавьте работы и цены, итог посчитается сам.")}</div>`;
  const sum = t.est.reduce((s, r) => s + r[1] * r[2], 0);
  const vat = Math.round(sum * S.settings.rate / 100);
  const foot = S.settings.vat
    ? `<tr><td colspan="3">Итого без НДС</td><td class="num">${rub(sum)}</td></tr><tr><td colspan="3">НДС ${S.settings.rate}%</td><td class="num">${rub(vat)}</td></tr><tr class="total"><td colspan="3">К оплате</td><td class="num">${rub(sum + vat)}</td></tr>`
    : `<tr class="total"><td colspan="3">К оплате, без НДС</td><td class="num">${rub(sum)}</td></tr>`;
  return head + `<div class="card"><div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Работа</th><th class="num">Кол.</th><th class="num">Цена</th><th class="num">Сумма</th></tr></thead><tbody>${t.est.map(r => `<tr><td>${esc(r[0])}</td><td class="num">${r[1]}</td><td class="num">${rub(r[2])}</td><td class="num">${rub(r[1] * r[2])}</td></tr>`).join("")}</tbody><tfoot>${foot}</tfoot></table></div></div>`;
}
function taskMain(t) {
  const ex = t.exec;
  const execVal = ex[0] === "c" && !isC() ? `<button class="link-btn" data-go="contractor.${ex}">${esc(nameOf(ex))}</button>` : esc(nameOf(ex));
  const dl = t.devs.map(dev), al = t.accs.map(acc);
  const grantTitle = ex[0] === "c" ? (isC() ? "Вам выдано для этой задачи" : "Выдано подрядчику") : "Оборудование и доступы";
  const granted = isC() && !isOpen(t) ? empty("Доступ закрыт", "Задача завершена, выданные данные сняты с вашего телефона.") : (dl.length || al.length) ? list([...dl.map(d => row({ go: "device." + d.id, icon: DEV_ICON[d.cat], title: d.name, lines: [esc(d.role)] })), ...al.map(a => row({ go: "access." + a.id, icon: ACC_ICON[a.cat], title: a.title, lines: [esc(D.acats[a.cat])] }))]) : `<div class="card">${empty("Ничего не выдано")}</div>`;
  const acts = isOpen(t)
    ? `<div class="btns"><button class="btn" data-act="finish" data-t="${t.id}">Завершить</button><button class="btn primary" data-act="status" data-t="${t.id}">Изменить статус</button></div>`
    : `<div class="btns"><button class="btn primary" data-act="reopen" data-t="${t.id}">Вернуть в работу</button></div>`;
  return sec("Основное") + `<div class="card">${kv([["Тип", esc(t.type)], ["Приоритет", PRIO[t.prio]], ["Срок", fmtDue(t.due)], ["Исполнитель", execVal], ["Создана", fmtD(t.created)]])}</div>`
    + (t.desc ? `<div class="card" style="margin-top:12px"><p>${esc(t.desc)}</p></div>` : "")
    + sec(grantTitle) + (ex[0] === "c" && !isC() ? `<p class="note" style="margin:0 16px 8px">Подрядчик получает на телефон только это. Остальное сервер ему не отправляет.</p>` : "") + granted
    + estimateHtml(t) + acts;
}
function taskCheck(t) {
  const done = t.check.filter(c => c.done).length, n = t.check.length;
  const pct = n ? Math.round(done / n * 100) : 0;
  return sec("Чек-лист") + `<div class="card"><div style="padding:14px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><b>Выполнено ${done} из ${n}</b><span class="muted">${pct}%</span></div><div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div></div>`
    + t.check.map((c, i) => `<button class="ck" role="checkbox" aria-checked="${c.done}" data-act="ck" data-t="${t.id}" data-i="${i}"><span class="ckb">${ic("check")}</span><span class="ck-t">${esc(c.t)}</span></button>`).join("")
    + `<form class="inline-form" data-form="check" data-t="${t.id}"><label class="sr-only" for="ck-new">Новый пункт</label><input id="ck-new" name="text" placeholder="Новый пункт" autocomplete="off"><button class="btn primary" type="submit">Добавить</button></form></div>`;
}
function taskFeed(t) {
  const items = t.feed.slice().reverse().map(e => `<li><span class="tl-i ${e.kind === "comment" ? "c" : ""}">${ic(e.kind === "comment" ? "chat" : "history")}</span><div><b>${esc(e.who)}</b><div class="tl-m">${esc(e.when)}</div><p>${esc(e.text)}</p></div></li>`).join("");
  return sec("Лента") + `<ul class="tl">${items}</ul><div class="card" style="margin-top:12px"><form class="inline-form" style="border-top:0" data-form="comment" data-t="${t.id}"><label class="sr-only" for="cm-new">Комментарий</label><input id="cm-new" name="text" placeholder="Написать комментарий" autocomplete="off"><button class="btn primary" type="submit" aria-label="Отправить комментарий">${ic("send")}</button></form></div>`;
}
SCREENS.task = ([id, tab = "main"]) => {
  const t = tsk(id);
  if (!t || !canSeeCo(t.co) || (isC() && t.exec !== meId())) return notFound();
  const [sl, sc] = ST[t.status];
  return hdr({ title: t.title, sub: co(t.co).name, back: true, right: pill(sc, sl) }) + segBar([["main", "Общая"], ["check", "Чек-лист"], ["feed", "Лента"]], tab, k => `task.${id}.${k}`)
    + `<div class="tab-body">${tab === "check" ? taskCheck(t) : tab === "feed" ? taskFeed(t) : taskMain(t)}</div>`;
};

const grantHint = F => F.exec[0] === "c" ? (F.devs.length + F.accs.length ? "Подрядчик получит на телефон только отмеченное." : "Ничего не отмечено: подрядчик не получит ни одного пароля.") : "Сотрудники видят все данные клиентов. Отметки нужны только как памятка.";
SCREENS.newtask = () => {
  if (isC()) return notFound();
  const F = S.form || (formInit(""), S.form);
  const cos = visCompanies();
  const opt = (v, l, cur) => `<option value="${v}" ${cur === v ? "selected" : ""}>${esc(l)}</option>`;
  const dl = F.co ? D.devices.filter(d => d.co === F.co) : [], al = F.co ? D.accesses.filter(a => a.co === F.co) : [];
  const toC = F.exec[0] === "c";
  const grants = !F.co ? `<p class="hint">Сначала выберите компанию.</p>`
    : `<details class="card dd"><summary>Устройства <span id="gs-dev" class="muted">${F.devs.length} из ${dl.length}</span></summary>${dl.map(d => `<label class="chk"><input type="checkbox" data-f="dev" value="${d.id}" ${F.devs.includes(d.id) ? "checked" : ""}><span>${esc(d.name)}<small>${esc(d.role)}</small></span></label>`).join("")}</details>
      <details class="card dd" style="margin-top:8px"><summary>Доступы <span id="gs-acc" class="muted">${F.accs.length} из ${al.length}</span></summary>${al.map(a => `<label class="chk"><input type="checkbox" data-f="acc" value="${a.id}" ${F.accs.includes(a.id) ? "checked" : ""}><span>${esc(a.title)}<small>${esc(D.acats[a.cat])}</small></span></label>`).join("")}</details>`;
  return hdr({ title: "Новая задача", sub: "Обязательно только название и компания", back: true })
    + `<div class="field"><label for="f-title">Название</label><input id="f-title" data-f="title" value="${esc(F.title)}" autocomplete="off">${F.errs.title ? `<span class="err" role="alert">${F.errs.title}</span>` : ""}</div>
    <div class="field"><label for="f-co">Компания</label><select id="f-co" data-f="co"><option value="">Выберите компанию</option>${cos.map(c => opt(c.id, c.name, F.co)).join("")}</select>${F.errs.co ? `<span class="err" role="alert">${F.errs.co}</span>` : ""}</div>
    <div class="field"><label for="f-desc">Описание</label><textarea id="f-desc" data-f="desc">${esc(F.desc)}</textarea></div>
    <div class="field"><label for="f-type">Тип задачи</label><select id="f-type" data-f="type">${D.taskTypes.map(t => opt(t, t, F.type)).join("")}</select></div>
    <div class="field"><span class="lbl" id="f-prio-l">Приоритет</span><div class="radios" role="radiogroup" aria-labelledby="f-prio-l">${Object.keys(PRIO).map(k => `<label class="opt"><input type="radio" name="prio" data-f="prio" value="${k}" ${F.prio === k ? "checked" : ""}><span>${PRIO[k]}</span></label>`).join("")}</div></div>
    <div class="field"><label for="f-due">Плановая дата</label><input id="f-due" type="date" data-f="due" value="${esc(F.due)}"></div>
    <div class="field"><label for="f-exec">Исполнитель</label><select id="f-exec" data-f="exec"><optgroup label="Сотрудники">${D.users.map(u => opt(u.id, u.name, F.exec)).join("")}</optgroup><optgroup label="Подрядчики">${D.contractors.map(c => opt(c.id, c.name, F.exec)).join("")}</optgroup></select></div>
    <div class="field"><span class="lbl">Что выдать исполнителю</span>${grants}<span class="hint" id="grant-hint">${grantHint(F)}</span></div>
    <div class="btns"><button class="btn" data-act="back">Отмена</button><button class="btn primary" data-act="createtask">Создать задачу</button></div>`;
};

SCREENS.companies = () => {
  const q = norm(S.ui.cq);
  const rows = visCompanies().filter(c => !q || norm(c.name + " " + c.sub + " " + c.addr).includes(q));
  return hdr({ title: "Компании", right: isC() ? "" : `<button class="icon-btn" data-act="proto" aria-label="Добавить компанию">${ic("plus")}</button>` })
    + `<div class="pad"><label class="search sm"><span class="sr-only">Поиск по компаниям</span>${ic("search")}<input id="cq" type="search" placeholder="Поиск по компаниям" autocomplete="off" value="${esc(S.ui.cq)}"></label></div><div style="height:12px"></div>`
    + `<div id="co-list">${rows.length ? list(rows.map(companyRow)) : empty("Компаний не найдено")}</div>`;
};

function explorer(c) {
  const path = S.ui.files[c.id] || [];
  let node = { k: filesFor(c.id) };
  for (const n of path) node = node.k.find(x => x.n === n) || node;
  const count = x => x.k ? x.k.reduce((s, y) => s + count(y), 0) : 1;
  const crumbs = [`<button class="link-btn" data-act="fpath" data-co="${c.id}" data-i="0">Файлы</button>`].concat(path.map((n, i) => `<button class="link-btn" data-act="fpath" data-co="${c.id}" data-i="${i + 1}">${esc(n)}</button>`)).join(`<span class="muted"> / </span>`);
  const folders = node.k.filter(x => x.k), files = node.k.filter(x => x.f);
  const rows = [...folders.map(x => `<button class="row" data-act="fopen" data-co="${c.id}" data-n="${esc(x.n)}"><span class="ico">${ic("folder")}</span><span class="row-m"><b>${esc(x.n)}</b><small>${plural(count(x), ["файл", "файла", "файлов"])}</small></span>${ic("chevR", "chev")}</button>`),
    ...files.map(x => `<button class="row" data-act="file"><span class="ico violet">${ic("file")}</span><span class="row-m"><b>${esc(x.f)}</b><small>${esc(x.size)}, ${esc(x.date)}</small></span></button>`)];
  return `<div class="pad" style="padding-bottom:10px">${crumbs}</div>` + (rows.length ? list(rows) : `<div class="card">${empty("Папка пуста", "Добавьте файл кнопкой ниже.")}</div>`)
    + `<div class="btns"><button class="btn wide" data-act="proto">${ic("plus")} Добавить файл</button></div>`;
}
function companyTab(c, tab) {
  if (tab === "devices") {
    const all = visDevs(c.id);
    const cats = Object.keys(D.cats).filter(k => all.some(d => d.cat === k));
    const cur = S.ui.devCat === "all" || cats.includes(S.ui.devCat) ? S.ui.devCat : "all";
    const rows = all.filter(d => cur === "all" || d.cat === cur);
    return chipsBar([["all", "Все", all.length]].concat(cats.map(k => [k, D.cats[k], all.filter(d => d.cat === k).length])), cur, "devCat") + (rows.length ? list(rows.map(devRow)) : empty("Устройств нет", isC() ? "Вам не выдано ни одного устройства." : "Добавьте первое устройство."));
  }
  if (tab === "access") {
    const all = visAccs(c.id);
    const cats = Object.keys(D.acats).filter(k => all.some(a => a.cat === k));
    const cur = S.ui.accCat === "all" || cats.includes(S.ui.accCat) ? S.ui.accCat : "all";
    const rows = all.filter(a => cur === "all" || a.cat === cur);
    return chipsBar([["all", "Все", all.length]].concat(cats.map(k => [k, D.acats[k], all.filter(a => a.cat === k).length])), cur, "accCat") + (rows.length ? list(rows.map(accRow)) : empty("Доступов нет", isC() ? "Вам не выдано ни одного пароля." : "Добавьте первый доступ."));
  }
  if (tab === "files" && !isC()) return explorer(c);
  if (tab === "tasks") {
    const ts = myTasks().filter(t => t.co === c.id).sort(byDue);
    return (ts.length ? list(ts.map(taskRow)) : empty("Задач нет")) + (isC() ? "" : `<div class="btns"><button class="btn primary wide" data-go="newtask.${c.id}">${ic("plus")} Создать задачу</button></div>`);
  }
  if (isC()) return `<div class="card">${kv([["Адрес", esc(c.addr)]])}</div><p class="note">Подрядчик видит только данные из своих задач.</p>`;
  const openN = myTasks().filter(t => t.co === c.id && isOpen(t)).length;
  return `<div class="card">${kv([["ИНН", esc(c.inn)], copyRow("Телефон", c.phone, false), copyRow("Email", c.email, false), ["Адрес", esc(c.addr)], ["Контакт клиента", esc(c.contact)], ["Открытых задач", String(openN)]])}</div>` + (c.note ? `<div class="card" style="margin-top:12px"><p>${esc(c.note)}</p></div>` : "");
}
SCREENS.company = ([id, tab = "overview"]) => {
  const c = co(id);
  if (!c || !canSeeCo(id)) return notFound();
  const tabs = [["overview", "Обзор"], ["devices", "Устройства"], ["access", "Доступы"]].concat(isC() ? [] : [["files", "Файлы"]]).concat([["tasks", "Задачи"]]);
  return hdr({ title: c.name, sub: c.addr, back: true }) + segBar(tabs, tab, k => `company.${id}.${k}`) + `<div class="tab-body">${companyTab(c, tab)}</div>`;
};

SCREENS.device = ([id]) => {
  const d = dev(id);
  if (!d || !canSeeCo(d.co) || (isC() && !grantedDevs().has(d.id))) return notFound();
  const accs = D.accesses.filter(a => a.dev === d.id && (!isC() || grantedAccs().has(a.id)));
  const works = D.tasks.filter(t => t.devs.includes(d.id) && (!isC() || t.exec === meId())).sort(byDue);
  return hdr({ title: d.name, sub: co(d.co).name + ", " + D.cats[d.cat].toLowerCase(), back: true, right: editBtn() })
    + sec("Основные данные") + `<div class="card">${kv([["Назначение", esc(d.role)], ["Модель", esc(d.model)], d.ip !== "облако" ? copyRow("IP-адрес", d.ip) : ["Адрес", "Облачный сервис"], d.mac ? copyRow("MAC-адрес", d.mac) : null, ["Где стоит", esc(d.where)]].concat(d.extra.map(e => [e[0], esc(e[1])])))}</div>`
    + (d.note ? `<div class="card" style="margin-top:12px"><p>${esc(d.note)}</p></div>` : "")
    + sec("Доступы к устройству") + (accs.length ? accs.map(accCard).join("") : `<div class="card">${empty("Доступов нет", "К этому устройству не привязано ни одного пароля.")}</div>`)
    + sec("Работы по устройству") + (works.length ? list(works.map(taskRow)) : `<div class="card">${empty("Работ не было")}</div>`);
};

SCREENS.access = ([id]) => {
  const a = acc(id);
  if (!a || !canSeeCo(a.co) || (isC() && !grantedAccs().has(a.id))) return notFound();
  const d = a.dev ? dev(a.dev) : null;
  const rows = [["Раздел", esc(D.acats[a.cat])]].concat(a.f.map(e => copyRow(e[0], e[1])), [a.login ? copyRow("Логин", a.login) : null, a.pass ? secRow(a.id) : null, d ? ["Устройство", `<button class="link-btn" data-go="device.${d.id}">${esc(d.name)}</button>`] : null]);
  const hist = a.hist.map((h, i) => {
    const key = `h:${a.id}:${i}`, shown = !!S.ui.rev[key];
    return `<li><span class="tl-i ${h.disputed ? "w" : ""}">${ic(h.disputed ? "alert" : "history")}</span><div><b>${esc(h.who)}${h.disputed ? pill("p-work", "спорно") : ""}</b><div class="tl-m">${esc(h.when)}</div><p>${h.disputed ? "Это значение не стало текущим: другой сотрудник менял пароль позже. Оно сохранено на случай ошибки." : "Старый пароль, до замены."}</p><div class="hline"><span class="mono ${shown ? "" : "mask"}">${shown ? esc(h.val) : "••••••••"}</span><span class="btn-pair"><button class="icon-btn sm" data-act="reveal" data-k="${key}" aria-pressed="${shown}" aria-label="${shown ? "Скрыть" : "Показать"} старый пароль">${ic(shown ? "eyeOff" : "eye")}</button><button class="icon-btn sm" data-act="copysec" data-k="${key}" aria-label="Копировать старый пароль">${ic("copy")}</button></span></div></div></li>`;
  }).join("");
  return hdr({ title: a.title, sub: co(a.co).name, back: true, right: editBtn() })
    + sec("Данные для входа") + `<div class="card">${kv(rows)}</div>`
    + (a.note ? `<div class="card" style="margin-top:12px"><p>${esc(a.note)}</p></div>` : "")
    + (a.pass ? `<div class="btns"><button class="btn primary" data-act="passsheet" data-a="${a.id}">${ic("key")} Сменить пароль</button></div>` : "")
    + (a.pass && !isC() ? sec("История паролей") + (hist ? `<ul class="tl">${hist}</ul>` : `<div class="card">${empty("Пароль не менялся", "Старые значения появятся здесь после первой замены.")}</div>`) : "");
};

SCREENS.alerts = () => {
  const vis = D.alerts.filter(n => n.vis === "a" || (n.vis === "s" && !isC()) || (n.vis === "m" && S.role === "manager"));
  const icon = { task: ["tasks", ""], comment: ["chat", ""], warn: ["alert", "warn"], done: ["check", "good"], key: ["key", "violet"] };
  let h = hdr({ title: "Уведомления" });
  ["Сегодня", "Вчера", "Раньше"].forEach(g => {
    const rows = vis.filter(n => n.group === g);
    if (!rows.length) return;
    h += sec(g) + list(rows.map(n => `<button class="row" data-go="${n.go}"><span class="ico ${icon[n.type][1]}">${ic(icon[n.type][0])}</span><span class="row-m"><b>${esc(n.title)}</b><small>${esc(n.text)}</small></span><span class="muted" style="font-size:13px;align-self:flex-start">${esc(n.when)}</span></button>`));
  });
  return vis.length ? h : h + empty("Уведомлений нет");
};

SCREENS.more = () => hdr({ title: "Ещё" }) + list([
  row({ go: "assistant", icon: "chat", title: "Помощник", lines: ["Спросить обычными словами"] }),
  isC() ? "" : row({ go: "contractors", icon: "users", title: "Подрядчики", lines: [plural(D.contractors.length, ["подрядчик", "подрядчика", "подрядчиков"])] }),
  S.role === "manager" ? row({ go: "people", icon: "user", title: "Люди и права", lines: ["Журнал просмотров паролей, спорные изменения"] }) : "",
  S.role === "manager" ? row({ go: "settings", icon: "settings", title: "Настройки", lines: ["НДС в сметах"] }) : ""
].filter(Boolean))
  + sec("Как смотреть прототип") + `<div class="card"><p class="muted" style="padding-bottom:0">Выберите, под кем зайти. Подрядчик видит только свои задачи и то, что по ним выдано.</p><div class="chips" role="group" aria-label="Роль">${["manager", "staff", "contractor"].map(r => `<button class="chip" aria-pressed="${S.role === r}" data-act="role" data-v="${r}">${ROLE_NAME[r]}</button>`).join("")}</div>
  <div class="switch-row"><div><b>Связь с сервером</b><small>Выключите, чтобы увидеть работу без интернета</small></div><button class="switch" role="switch" aria-checked="${S.online}" aria-label="Связь с сервером" data-act="net"></button></div></div>`
  + `<div class="btns"><button class="btn wide" data-act="logout">${ic("logout")} Выйти</button></div>`;

SCREENS.assistant = () => {
  const msgs = S.chat.map(m => m.me ? `<div class="bub me">${esc(m.text)}</div>` : `<div class="bub bot">${m.html}</div>`).join("");
  const ex = ["Пароль от Wi-Fi у Альфы", "Что делали у Омеги в прошлый раз", "IP роутера КабельСтрой", "Камеры у Беты"];
  return hdr({ title: "Помощник", sub: "Ищет по компаниям, устройствам, доступам и задачам", back: true })
    + `<div class="chat"><div class="bub bot"><p style="padding:0">Спросите обычными словами. Пароли я не пишу в чат: нахожу запись, а пароль вы открываете сами внутри приложения.</p></div>${msgs}</div>`
    + (S.chat.length ? "" : `<div class="chips">${ex.map(t => `<button class="chip" data-act="ask" data-v="${esc(t)}">${esc(t)}</button>`).join("")}</div>`)
    + `<form class="chat-form" data-form="chat"><label class="sr-only" for="ask">Вопрос помощнику</label><input id="ask" name="text" placeholder="Что найти?" autocomplete="off"><button class="btn primary" type="submit" aria-label="Отправить">${ic("send")}</button></form>`;
};
const STOP = new Set(["какой", "какая", "какие", "покажи", "показать", "найди", "найти", "дай", "дайте", "где", "что", "как", "нужен", "нужна", "нужно", "пароль", "пароли", "логин", "доступ", "доступы", "для", "при", "про", "есть", "мне", "нас", "это", "все", "всех"]);
const stem = w => w.length >= 7 ? w.slice(0, -2) : w.length >= 4 ? w.slice(0, -1) : w;
function assistantAnswer(q) {
  const t = norm(q).replace(/вай-?фай\w*/g, "wifi");
  const mentioned = visCompanies().find(c => t.includes(stem(norm(c.short))));
  if (/прошл|делали|последн|истори|что было/.test(t)) {
    const ts = myTasks().filter(x => !mentioned || x.co === mentioned.id).sort((a, b) => b.created.localeCompare(a.created)).slice(0, 3);
    return ts.length ? `<p style="padding:0">${mentioned ? "Последние работы, " + esc(mentioned.name) : "Последние работы"}:</p>${list(ts.map(taskRow))}` : `<p style="padding:0">По этому запросу задач не нашёл.</p>`;
  }
  const words = t.replace(/[.,!?«»"()]/g, " ").split(/\s+/).filter(w => w.length > 2 && !STOP.has(w)).map(stem);
  if (!words.length) return `<p style="padding:0">Пока я умею искать по компаниям, устройствам, доступам и задачам. Например: «пароль от Wi-Fi у Альфы» или «что делали у Омеги в прошлый раз».</p>`;
  let r = searchAll(words.join(" "));
  let n = r.accesses.length + r.devices.length + r.companies.length + r.tasks.length;
  if (!n && mentioned) { r = searchAll(stem(norm(mentioned.short))); n = r.accesses.length + r.devices.length + r.companies.length + r.tasks.length; }
  if (!n) return `<p style="padding:0">Ничего не нашёл. Назовите компанию и что нужно: роутер, Wi-Fi, камеры, 1С.</p>`;
  const rows = [...r.accesses.slice(0, 3).map(accRow), ...r.devices.slice(0, 3).map(devRow), ...r.tasks.slice(0, 2).map(taskRow), ...r.companies.slice(0, 2).map(companyRow)].slice(0, 5);
  return `<p style="padding:0">Нашёл: ${n}. Откройте нужную запись, пароль показывается там.</p>${list(rows)}`;
}

SCREENS.contractors = () => hdr({ title: "Подрядчики", right: `<button class="icon-btn" data-act="proto" aria-label="Добавить подрядчика">${ic("plus")}</button>` })
  + list(D.contractors.map(c => row({ go: "contractor." + c.id, icon: "users", title: c.name, lines: [esc(c.spec), plural(D.tasks.filter(t => t.exec === c.id).length, ["задача", "задачи", "задач"])] })));
SCREENS.contractor = ([id]) => {
  const c = D.contractors.find(x => x.id === id);
  if (!c || isC()) return notFound();
  const ts = D.tasks.filter(t => t.exec === c.id).sort(byDue);
  return hdr({ title: c.name, sub: c.spec, back: true, right: editBtn() })
    + sec("Основная информация") + `<div class="card">${kv([["Контакт", esc(c.contact)], copyRow("Телефон", c.phone, false), copyRow("Email", c.email, false), ["Адрес", esc(c.addr)], ["ИНН", esc(c.inn)]])}</div>`
    + sec("Направления работ") + `<div class="card"><div class="tags">${c.tags.map(t => pill("p-new", t)).join("")}</div></div>`
    + sec("Задачи") + (ts.length ? list(ts.map(taskRow)) : `<div class="card">${empty("Задач нет")}</div>`);
};

SCREENS.people = ([tab = "people"]) => {
  if (S.role !== "manager") return notFound();
  let body = "";
  if (tab === "people") {
    const all = D.users.map(u => ({ id: u.id, name: u.name, role: u.role, phone: u.phone })).concat(D.contractors.map(c => ({ id: c.id, name: c.name, role: "Подрядчик", phone: c.phoneType })));
    body = list(all.map(p => `<div class="row"><span class="ico">${ic("user")}</span><span class="row-m"><b>${esc(p.name)}</b><small>${esc(p.role)}, ${esc(p.phone)}</small>${S.off[p.id] ? `<small class="bad">Отключён. Телефон сотрёт данные при следующем выходе в сеть.</small>` : ""}</span>${p.id === "u1" ? "" : `<button class="btn mini" data-act="person" data-id="${p.id}">${S.off[p.id] ? "Включить" : "Отключить"}</button>`}</div>`))
      + `<div class="btns"><button class="btn wide" data-act="proto">${ic("plus")} Добавить человека</button></div>`;
  } else if (tab === "log") {
    body = sec("Кто открывал пароли") + (S.log.length ? `<ul class="tl">${S.log.map(l => `<li><span class="tl-i c">${ic("eye")}</span><div><b>${esc(l.who)}</b><p>${esc(l.what)}</p><div class="tl-m">${esc(l.co)}, ${esc(l.when)}</div></div></li>`).join("")}</ul>` : empty("Пока никто не открывал"));
  } else {
    const open = S.disputes.filter(d => !d.reviewed);
    body = sec("Спорные изменения") + (open.length ? open.map(d => { const a = acc(d.acc); return `<div class="card pad-in" style="margin-bottom:12px"><b>${esc(a.title)}</b><div class="muted">${esc(co(a.co).name)}</div><p style="padding:10px 0 0">Двое поменяли пароль без связи. Оставлено более позднее изменение: ${esc(d.keptBy)}, ${esc(d.keptAt)}. Значение второго, ${esc(d.lostBy)}, ${esc(d.lostAt)}, сохранено в истории.</p><div class="btns" style="margin:12px 0 0"><button class="btn" data-go="access.${a.id}">Открыть доступ</button><button class="btn primary" data-act="dispute" data-a="${a.id}">Проверено</button></div></div>`; }).join("") : empty("Спорных изменений нет", "Когда двое поменяют одно значение без связи, оно появится здесь."));
  }
  return hdr({ title: "Люди и права", back: true }) + segBar([["people", "Люди"], ["log", "Журнал"], ["dispute", "Спорные" + (S.disputes.some(d => !d.reviewed) ? " (" + S.disputes.filter(d => !d.reviewed).length + ")" : "")]], tab, k => "people." + k) + `<div class="tab-body">${body}</div>`;
};

SCREENS.settings = () => {
  if (S.role !== "manager") return notFound();
  return hdr({ title: "Настройки", back: true }) + sec("Сметы") + `<div class="card"><div class="switch-row"><div><b>Работаем с НДС</b><small>Если выключить, в сметах не будет строк с НДС</small></div><button class="switch" role="switch" aria-checked="${S.settings.vat}" aria-label="Работаем с НДС" data-act="vat"></button></div>`
    + (S.settings.vat ? `<div class="field" style="margin:0 14px 14px"><label for="rate">Ставка НДС, %</label><input id="rate" type="number" min="0" max="30" step="1" value="${S.settings.rate}" data-act-input="rate"></div>` : "") + `</div>`
    + `<p class="note">Ставку можно поменять в любой момент. Смета пересчитается сразу.</p>`
    + sec("Телефоны сотрудников") + `<div class="card"><p>Когда вы отключаете человека, его телефон сотрёт все данные при первом выходе в интернет. Пока связи нет, данные закрыты кодом или отпечатком.</p></div>`;
};

/* ---------- сборка страницы ---------- */
const TABS = [["home", "Главная", "home"], ["tasks", "Задачи", "tasks"], ["companies", "Компании", "building"], ["alerts", "Уведомления", "bell"], ["more", "Ещё", "menu"]];
function render(keep = true) {
  const y = keep ? window.scrollY : 0;
  const cur = S.stack[S.stack.length - 1];
  const login = cur.name === "login";
  q$("#view").innerHTML = (SCREENS[cur.name] || SCREENS.home)(cur.args);
  q$("#app").classList.toggle("no-tabs", login);
  const off = q$("#offline");
  off.hidden = S.online || login;
  off.innerHTML = `${ic("wifiOff")}<span>Нет связи. Вы работаете с данными на телефоне.${S.queue.length ? " Ждут отправки: " + S.queue.length + "." : ""}</span><button class="btn mini" data-act="net">Связь появилась</button>`;
  const unread = D.alerts.filter(n => n.unread && (n.vis === "a" || (n.vis === "s" && !isC()) || (n.vis === "m" && S.role === "manager"))).length;
  const tabs = q$("#tabs");
  tabs.hidden = login;
  tabs.innerHTML = TABS.map(t => `<button class="tab" data-act="tab" data-a="${t[0]}" ${S.tab === t[0] ? 'aria-current="page"' : ""}>${ic(t[2])}<span>${t[1]}</span>${t[0] === "alerts" && unread ? `<span class="badge" aria-label="Непрочитанных: ${unread}">${unread}</span>` : ""}</button>`).join("");
  if (keep) window.scrollTo(0, y);
}

/* ---------- действия ---------- */
const setStatus = (t, st, note) => { t.status = st; t.feed.push(ev(myName(), nowStr(), note || "Статус изменён на «" + ST[st][0] + "»")); commit("Статус задачи «" + t.title + "»"); };
const ACTS = {
  back,
  tab: el => { S.tab = el.dataset.a; navigate(el.dataset.a, { reset: true }); },
  ctab: el => navigate(el.dataset.r, { replace: true }),
  ui: el => { S.ui[el.dataset.k] = el.dataset.v; render(true); },
  pin: el => { if (S.pin.length < 4) S.pin += el.dataset.a; if (S.pin.length === 4) { S.pin = ""; navigate("home", { reset: true }); } else render(false); },
  pindel: () => { S.pin = S.pin.slice(0, -1); render(false); },
  bio: () => { S.pin = ""; navigate("home", { reset: true }); },
  net: () => {
    S.online = !S.online;
    if (S.online && S.queue.length) { toast("Отправлено на сервер: " + plural(S.queue.length, ["изменение", "изменения", "изменений"]) + ". Чужие правки получены."); S.queue = []; }
    else toast(S.online ? "Связь есть." : "Связи нет. Все правки сохраняются на телефоне.");
    render(true);
  },
  role: el => { S.role = el.dataset.v; S.ui.rev = {}; S.q = ""; S.chat = []; S.ui.taskFilter = "all"; navigate("home", { reset: true }); toast("Вы смотрите как: " + ROLE_NAME[S.role]); },
  logout: () => { S.pin = ""; navigate("login", { reset: true }); },
  reveal: el => { const k = el.dataset.k; S.ui.rev[k] = !S.ui.rev[k]; if (S.ui.rev[k]) addLog("Просмотр", k); render(true); },
  copysec: el => { addLog("Копирование", el.dataset.k); doCopy(getSecret(el.dataset.k), "Пароль скопирован"); },
  copy: el => doCopy(el.dataset.v, "Скопировано"),
  proto: () => toast("В прототипе эта кнопка не работает. Здесь будет правка или добавление."),
  file: () => toast("Файл откроется в браузере или в программе на телефоне. В прототипе не работает."),
  fopen: el => { const c = el.dataset.co; S.ui.files[c] = (S.ui.files[c] || []).concat(el.dataset.n); render(true); },
  fpath: el => { const c = el.dataset.co; S.ui.files[c] = (S.ui.files[c] || []).slice(0, +el.dataset.i); render(true); },
  ck: el => { const t = tsk(el.dataset.t), c = t.check[+el.dataset.i]; c.done = !c.done; commit("Чек-лист «" + t.title + "»"); },
  finish: el => {
    const t = tsk(el.dataset.t);
    setStatus(t, "done");
    if (t.exec[0] === "c") { t.feed.push(ev("Система", nowStr(), "Выданные пароли сняты с телефона подрядчика. Рекомендуем поменять их.")); toast("Задача завершена. Пароли сняты с телефона подрядчика. Лучше поменять их."); render(true); }
  },
  reopen: el => setStatus(tsk(el.dataset.t), "work"),
  status: el => { const t = tsk(el.dataset.t); openSheet(`<h2>Статус задачи</h2>${list(Object.keys(ST).map(k => `<button class="row" data-act="setstatus" data-t="${t.id}" data-v="${k}" style="min-height:54px"><span class="row-m"><b>${ST[k][0]}</b></span>${t.status === k ? ic("check") : ""}</button>`))}<div class="btns"><button class="btn wide" data-act="close">Закрыть</button></div>`); },
  setstatus: el => { const t = tsk(el.dataset.t); closeSheet(); if (t.status !== el.dataset.v) setStatus(t, el.dataset.v); },
  close: closeSheet,
  passsheet: el => { const a = acc(el.dataset.a); openSheet(`<h2>Новый пароль</h2><form data-form="pass" data-a="${a.id}"><div class="field"><label for="np">Новый пароль для «${esc(a.title)}»</label><input id="np" name="pass" autocomplete="off" autocapitalize="off"><span class="err" role="alert"></span></div><p class="note">Старый пароль запишется в историю: кто и когда его менял.</p><div class="btns"><button class="btn" type="button" data-act="close">Отмена</button><button class="btn primary" type="submit">Сохранить</button></div></form>`); },
  estsheet: el => openSheet(`<h2>Позиция сметы</h2><form data-form="est" data-t="${el.dataset.t}"><div class="field"><label for="en">Работа</label><input id="en" name="name" autocomplete="off"></div><div class="field"><label for="eq">Количество</label><input id="eq" name="qty" type="number" min="1" value="1" inputmode="numeric"></div><div class="field"><label for="ep">Цена за единицу, ₽</label><input id="ep" name="price" type="number" min="0" inputmode="numeric"><span class="err" role="alert"></span></div><div class="btns"><button class="btn" type="button" data-act="close">Отмена</button><button class="btn primary" type="submit">Добавить</button></div></form>`),
  vat: () => { S.settings.vat = !S.settings.vat; render(true); },
  person: el => { const id = el.dataset.id; S.off[id] = !S.off[id]; if (S.off[id]) toast("Отключён. Телефон сотрёт данные при следующем выходе в сеть."); render(true); },
  dispute: el => { S.disputes.forEach(d => { if (d.acc === el.dataset.a) d.reviewed = true; }); commit("Спорное изменение проверено"); },
  ask: el => askAssistant(el.dataset.v),
  createtask: () => {
    const F = S.form;
    F.errs = {};
    if (!F.title.trim()) F.errs.title = "Укажите название задачи.";
    if (!F.co) F.errs.co = "Выберите компанию.";
    if (F.errs.title || F.errs.co) { render(true); return; }
    const id = "t" + (D.tasks.length + 1);
    const feed = [ev(myName(), nowStr(), "Задача создана, исполнитель " + nameOf(F.exec))];
    if (F.exec[0] === "c" && (F.devs.length || F.accs.length)) feed.push(ev(myName(), nowStr(), "Подрядчику выдано: " + plural(F.devs.length, ["устройство", "устройства", "устройств"]) + ", " + plural(F.accs.length, ["доступ", "доступа", "доступов"])));
    D.tasks.push({ id, co: F.co, title: F.title.trim(), status: "new", prio: F.prio, due: F.due || TODAY_ISO, created: TODAY_ISO, exec: F.exec, type: F.type, desc: F.desc.trim(), devs: F.devs.slice(), accs: F.accs.slice(), check: [], est: [], feed });
    if (!S.online) S.queue.push("Новая задача «" + F.title.trim() + "»");
    navigate("task." + id, { replace: true });
    toast("Задача создана.");
  }
};
function askAssistant(q) {
  S.chat.push({ me: true, text: q }, { html: assistantAnswer(q) });
  render(true);
  window.scrollTo(0, document.body.scrollHeight);
}
const FORMS = {
  check: (f, fd) => { const text = String(fd.get("text") || "").trim(); if (!text) return; const t = tsk(f.dataset.t); t.check.push({ t: text, done: false }); commit("Чек-лист «" + t.title + "»"); },
  comment: (f, fd) => { const text = String(fd.get("text") || "").trim(); if (!text) return; const t = tsk(f.dataset.t); t.feed.push(cm(myName(), nowStr(), text)); commit("Комментарий к «" + t.title + "»"); },
  chat: (f, fd) => { const text = String(fd.get("text") || "").trim(); if (text) askAssistant(text); },
  pass: (f, fd) => {
    const a = acc(f.dataset.a), v = String(fd.get("pass") || "").trim(), err = f.querySelector(".err");
    if (!v) { err.textContent = "Введите новый пароль."; return; }
    if (v === a.pass) { err.textContent = "Это тот же пароль, что сейчас."; return; }
    a.hist.unshift({ val: a.pass, who: myName(), when: nowStr() });
    a.pass = v; S.ui.rev = {};
    closeSheet(); commit("Новый пароль «" + a.title + "»");
    toast("Пароль сохранён. Старый записан в историю.");
  },
  est: (f, fd) => {
    const name = String(fd.get("name") || "").trim(), qty = Number(fd.get("qty")), price = Number(fd.get("price")), err = f.querySelector(".err");
    if (!name || !(qty > 0) || !(price >= 0) || fd.get("price") === "") { err.textContent = "Заполните работу, количество и цену."; return; }
    const t = tsk(f.dataset.t); t.est.push([name, qty, price]);
    closeSheet(); commit("Смета «" + t.title + "»");
  }
};

document.addEventListener("click", e => {
  if (e.target.id === "sheet") { closeSheet(); return; }
  const el = e.target.closest("[data-go],[data-act]");
  if (!el) return;
  if (el.dataset.go) { navigate(el.dataset.go); return; }
  const fn = ACTS[el.dataset.act];
  if (fn) fn(el, e);
});
document.addEventListener("submit", e => { e.preventDefault(); const f = e.target, fn = FORMS[f.dataset.form]; if (fn) fn(f, new FormData(f)); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !q$("#sheet").hidden) closeSheet(); });
document.addEventListener("input", e => {
  const el = e.target;
  if (el.id === "q") { S.q = el.value; q$("#home-body").hidden = !!S.q.trim(); const r = q$("#results"); r.hidden = !S.q.trim(); r.innerHTML = resultsHtml(searchAll(S.q)); }
  else if (el.id === "cq") { S.ui.cq = el.value; const q = norm(el.value); const rows = visCompanies().filter(c => !q || norm(c.name + " " + c.sub + " " + c.addr).includes(q)); q$("#co-list").innerHTML = rows.length ? list(rows.map(companyRow)) : empty("Компаний не найдено"); }
  else if (el.id === "rate") { const v = Number(el.value); if (v >= 0 && v <= 30) S.settings.rate = v; }
  else if (el.dataset.f && el.type !== "checkbox" && el.type !== "radio") { S.form[el.dataset.f] = el.value; if (S.form.errs) delete S.form.errs[el.dataset.f]; }
});
document.addEventListener("change", e => {
  const el = e.target, k = el.dataset.f;
  if (!k) return;
  const F = S.form;
  if (k === "dev" || k === "acc") { const arr = k === "dev" ? F.devs : F.accs, i = arr.indexOf(el.value); if (el.checked && i < 0) arr.push(el.value); if (!el.checked && i >= 0) arr.splice(i, 1); q$("#gs-dev").textContent = F.devs.length + " из " + document.querySelectorAll("input[data-f=dev]").length; q$("#gs-acc").textContent = F.accs.length + " из " + document.querySelectorAll("input[data-f=acc]").length; q$("#grant-hint").textContent = grantHint(F); return; }
  F[k] = el.value;
  if (F.errs) delete F.errs[k];
  if (k === "co") { F.devs = []; F.accs = []; render(true); }
  if (k === "exec") render(true);
});

/* ---------- запуск ---------- */
/* Шрифты подгружаются в фоне: нет сети, значит, страница не ждёт и показывает обычные шрифты. В настоящем приложении шрифты будут лежать на сервере. */
(function loadFonts() {
  try {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
  } catch (e) { /* без шрифтов тоже работает */ }
})();
(function boot() {
  const p = new URLSearchParams(location.search);
  if (p.get("role") && ME[p.get("role")]) S.role = p.get("role");
  if (p.get("offline")) S.online = false;
  const h = decodeURIComponent(location.hash.slice(1));
  if (h && h !== "login") {
    const r = parse(h);
    S.tab = TAB_OF[r.name] || "home";
    S.stack = TAB_ROOT[r.name] ? [r] : [parse(S.tab), r];
    if (r.name === "newtask") formInit(r.args[0]);
  } else S.stack = [parse("login")];
  render(false);
})();
