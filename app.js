/* Yorum Merkezi — demo (backend yok, veri: data/reviews.js + localStorage) */
(() => {
  const LS_KEY = 'yorum-merkezi-demo-v1';
  // logo: assets/logos/<key>.png (sitelerin kendi uygulama ikonları). Yüklenemezse renkli kısaltma görünür.
  // loc: "… üzerinde aç" bağlantısı için bulunma hâli.
  const PLAT = {
    yemeksepeti: { name: 'Yemeksepeti',    short: 'YS', loc: "Yemeksepeti'nde" },
    getir:       { name: 'Getir Yemek',    short: 'GT', loc: "Getir Yemek'te" },
    trendyol:    { name: 'Trendyol Yemek', short: 'TY', loc: "Trendyol Yemek'te" },
    google:      { name: 'Google',         short: 'G',  loc: "Google Haritalar'da" },
    tripadvisor: { name: 'TripAdvisor',    short: 'TA', loc: "TripAdvisor'da" },
    migros:      { name: 'Migros Yemek',   short: 'M',  loc: "Migros Yemek'te" },
  };
  const logoImg = p => `<img src="assets/logos/${p}.png" alt="" onerror="this.remove()">`;
  // Metin yanı küçük logo: "[logo] Yemeksepeti"
  const platMini = p => `<span class="plat-mini"><i class="plat ${p}">${logoImg(p)}${PLAT[p].short}</i>${PLAT[p].name}</span>`;
  const STATUS = {
    bekliyor:   { label: 'Müdahale bekliyor', short: 'Bekliyor' },
    ulasiliyor: { label: 'Arandı, ulaşılamadı', short: 'Ulaşılamadı' },
    baglanti:   { label: 'Müşteriyle görüşüldü', short: 'Görüşüldü' },
    cozuldu:    { label: 'Sorun çözüldü, müşteri memnun', short: 'Çözüldü' },
  };

  // ---------- İKONLAR (Lucide, 24px, stroke) ----------
  const ICON_PATHS = {
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
    chart: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    alertc: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    minus: '<path d="M5 12h14"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  };
  const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[n]}</svg>`;
  document.querySelectorAll('[data-icon]').forEach(e => { e.innerHTML = icon(e.dataset.icon); });

  // ---------- STATE ----------
  const base = window.DEMO_DATA;
  const state = {
    role: null, branchId: null,
    page: 'overview',           // overview | city | branch | pending | karne
    city: null, viewBranch: null,
    range: '30',                // today | 7 | 30 — tüm sayfalar bu dönemi kullanır
    branchView: 'cards',        // Şubeler sayfası: cards | table
    mapCity: null,              // haritada seçili il (il paneli bunu gösterir)
    filter: { platform: 'all', red: false, status: 'all' },
    karne: { key: 'score', dir: 'asc' },   // karne tablosu sıralaması, zayıf üstte
    branches: base.branches.slice(),
    reviews: [],
  };

  // ---------- DÖNEM ----------
  // Panelin tamamı tek bir dönem üzerinden hesaplanır. Üst çubuktaki seçici bunu değiştirir;
  // seçim localStorage'da kalır, böylece demo hep aynı yerden açılmaz.
  const RANGE_KEY = 'yorum-merkezi-range';
  const RANGES = [['today', 'Bugün', 1], ['7', '7 gün', 7], ['30', '30 gün', 30]];
  const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const rangeDef = () => RANGES.find(r => r[0] === state.range) || RANGES[2];
  const rangeDays = () => rangeDef()[2];
  const rangeStart = () => state.range === 'today' ? startOfToday() : Date.now() - rangeDays() * 86400000;
  const rangeLen = () => state.range === 'today' ? Date.now() - startOfToday() : rangeDays() * 86400000;
  const rangeTitle = () => state.range === 'today' ? 'Bugün' : `Son ${rangeDays()} gün`;
  // cümle içinde: "bugün 18 yorum geldi" / "son 30 günde 540 yorum geldi"
  const rangeIn = () => state.range === 'today' ? 'bugün' : `son ${rangeDays()} günde`;
  const rangeOf = () => state.range === 'today' ? 'bugünün' : `son ${rangeDays()} günün`;
  const prevLabel = () => state.range === 'today' ? 'dün' : `önceki ${rangeDays()} gün`;
  const cap = s => s.charAt(0).toLocaleUpperCase('tr') + s.slice(1);
  const inRange = r => new Date(r.date).getTime() >= rangeStart();

  const ranged = () => state.reviews.filter(inRange);
  // Karşılaştırma için bir önceki eşit uzunluktaki dönem.
  // "Bugün"de kıyas dünün aynı saatlerine yapılır; yoksa sabah 10'daki gün dünün tüm gecesiyle kıyaslanır.
  const prevRanged = () => {
    const pick = (a, b) => state.reviews.filter(r => { const t = new Date(r.date).getTime(); return t >= a && t < b; });
    if (state.range === 'today') { const y0 = startOfToday() - 86400000; return pick(y0, y0 + (Date.now() - startOfToday())); }
    const s = rangeStart(), len = rangeLen();
    return pick(s - len, s);
  };
  function setRange(r) {
    state.range = r;
    try { localStorage.setItem(RANGE_KEY, r); } catch (e) {}
    render();
  }

  function load() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) {}
    const over = saved?.overrides || {};
    const added = saved?.added || [];
    // Demo verisi üretildiği andan bugüne kaydırılır: demo ne zaman açılırsa açılsın "bugün" dolu görünür
    const shift = Date.now() - new Date(base.generatedAt).getTime();
    const mv = d => d ? new Date(new Date(d).getTime() + shift).toISOString() : d;
    // date, actionAt ve firstActionAt aynı kadar kaydırılmalı; biri kayıp diğeri kalırsa müdahale süreleri negatife düşer
    state.reviews = base.reviews.map(r => ({ ...r, date: mv(r.date), actionAt: mv(r.actionAt), firstActionAt: mv(r.firstActionAt), ...(over[r.id] || {}) })).concat(added.map(r => ({ ...r, ...(over[r.id] || {}) })));
    state.reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  function persist() {
    const baseIds = new Set(base.reviews.map(r => r.id));
    const overrides = {}, added = [];
    for (const r of state.reviews) {
      if (!baseIds.has(r.id)) added.push(r);
      const b = base.reviews.find(x => x.id === r.id);
      if (b && (b.status !== r.status || b.note !== r.note)) overrides[r.id] = { status: r.status, note: r.note, actionAt: r.actionAt, firstActionAt: r.firstActionAt };
    }
    try { localStorage.setItem(LS_KEY, JSON.stringify({ overrides, added })); } catch (e) {}
  }

  // ---------- HELPERS ----------
  const $ = s => document.querySelector(s);
  const el = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const branch = id => state.branches.find(b => b.id === id);
  const isRed = r => r.rating <= 2;
  const handled = r => r.status !== 'bekliyor';
  const fmtAvg = a => a.toFixed(1).replace('.', ',');
  // Sayıya iyelik eki: 1'i, 2'si, 3'ü, 6'sı, 10'u, 27'si, %40'ı
  const iyelik = n => { const ones = ['ı','i','si','ü','ü','i','sı','si','i','u'], tens = ['','u','si','u','ı','si','ı','i','i','ı'];
    if (n % 10) return `${n}'${ones[n % 10]}`; if (n % 100) return `${n}'${tens[Math.floor(n / 10) % 10]}`; if (n % 1000) return `${n}'ü`; return `${n}'i`; };
  const fmtDur = h => { if (h < 1) return `${Math.max(1, Math.round(h * 60))} dk`; if (h >= 48) return `${Math.round(h / 24)} gün`; const H = Math.floor(h), M = Math.round((h - H) * 60); return M ? `${H} sa ${M} dk` : `${H} sa`; };
  const fmtDate = d => new Date(d).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const ago = d => {
    const m = Math.round((Date.now() - new Date(d)) / 60000);
    if (m < 1) return 'az önce'; if (m < 60) return m + ' dk önce';
    const h = Math.round(m / 60); if (h < 24) return h + ' sa önce';
    return Math.round(h / 24) + ' gün önce';
  };
  // Boş yıldızlar soluk: 1★ ile 2★ göz taramasında ayrışsın
  const stars = n => `<span class="stars ${n <= 2 ? 'low' : ''}">${'★'.repeat(n)}<i>${'☆'.repeat(5 - n)}</i></span>`;
  // Yüzde değerine renk sınıfı: karne bantlarıyla aynı eşikler (80 iyi / 55 takip / altı zayıf)
  const pctCls = p => ({ good: 'v-good', warn: 'v-warn', bad: 'v-bad' })[band(p)];
  const avg = list => list.length ? list.reduce((a, r) => a + r.rating, 0) / list.length : 0;
  const todayCount = list => list.filter(r => Date.now() - new Date(r.date) < 86400000).length;

  function stats(list) {
    const red = list.filter(isRed);
    return {
      n: list.length, avg: avg(list), red: red.length,
      redPending: red.filter(r => !handled(r)).length,
      redHandled: red.filter(handled).length,
      today: todayCount(list),
      pos: list.filter(r => r.rating >= 4).length, neu: list.filter(r => r.rating === 3).length,
    };
  }
  function sparkline(list, days = 14) {
    const now = Date.now(); const arr = new Array(days).fill(0);
    for (const r of list) { const d = Math.floor((now - new Date(r.date)) / 86400000); if (d >= 0 && d < days) arr[days - 1 - d]++; }
    const max = Math.max(1, ...arr); const w = 90, h = 32;
    const pts = arr.map((v, i) => `${(i / (days - 1)) * w},${h - (v / max) * (h - 4) - 2}`).join(' ');
    return `<svg class="spark" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#7c5cff"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><polyline fill="none" stroke="url(#g)" stroke-width="2" stroke-linejoin="round" points="${pts}"/></svg>`;
  }
  function tick(r) {
    if (!isRed(r)) return `<span class="tick none" title="${r.status === 'cozuldu' ? 'Yanıtlandı' : 'Aksiyon gerekmiyor'}">${icon(r.status === 'cozuldu' ? 'check' : 'minus')}</span>`;
    if (r.status === 'cozuldu') return `<span class="tick ok" title="Müdahale edildi, çözüldü">${icon('check')}</span>`;
    if (r.status === 'bekliyor') return `<span class="tick no" title="Müdahale bekliyor">${icon('alertc')}</span>`;
    return `<span class="tick part" title="Müdahale sürüyor">${icon('clock')}</span>`;
  }
  function platBox(p) { return `<div class="plat ${p}" title="${PLAT[p].name}">${logoImg(p)}${PLAT[p].short}</div>`; }

  // ---------- SCOPE ----------
  function scopeReviews() {
    const l = ranged();
    if (state.role === 'manager') return l.filter(r => r.branchId === state.branchId);
    return l;
  }
  // Dönemde hiç yorum kalmadığında: boş ekran değil, çıkış yolu olan bir cümle
  const emptyBox = (msg, cls = '') => `<div class="empty ${cls}">${msg}${state.range !== '30'
    ? ` <button class="link" data-range="30">Son 30 güne bak</button>` : ''}</div>`;
  function applyFilter(list) {
    let l = list;
    if (state.filter.platform !== 'all') l = l.filter(r => r.platform === state.filter.platform);
    if (state.filter.red) l = l.filter(isRed);
    if (state.filter.status !== 'all') l = l.filter(r => r.status === state.filter.status);
    return l;
  }

  // ---------- RENDER ----------
  // ---------- GERİ ----------
  // Sayfa (page/il/şube/görünüm) her değiştiğinde önceki konum yığına atılır; "← Geri" son konumu geri yükler.
  // Kim nereden geldiyse oraya döner: haritadan Bursa'ya gelen Özet'e, il kartından gelen Şubeler'e.
  const NAV_PAGES = { admin: ['overview', 'branches', 'karne'], manager: ['branch', 'pending'] };
  const locKey = () => `${state.page}|${state.city || ''}|${state.viewBranch || ''}|${state.branchView}`;
  const snapshot = () => ({ page: state.page, city: state.city, viewBranch: state.viewBranch, branchView: state.branchView, mapCity: state.mapCity, filter: { ...state.filter } });
  let hist = [], lastKey = null, lastSnap = null, restoring = false;
  function goBack() {
    const s = hist.pop();
    if (s) Object.assign(state, s, { filter: { ...s.filter } });
    else { state.page = NAV_PAGES[state.role][0]; state.city = null; state.viewBranch = null; }
    restoring = true; render();
  }
  function goHome() { state.page = NAV_PAGES[state.role][0]; state.city = null; state.viewBranch = null; state.mapCity = null; render(); }

  function render() {
    // Eski "Sıralama" sayfası Şubeler'in tablo görünümüne taşındı; bağlantılar çalışmaya devam etsin
    if (state.page === 'ranking') { state.page = 'branches'; state.branchView = 'table'; }
    const key = locKey();
    if (lastKey !== null && key !== lastKey && !restoring) { hist.push(lastSnap); if (hist.length > 30) hist.shift(); }
    restoring = false; lastKey = key; lastSnap = snapshot();
    renderNav(); renderCrumbs(); renderRangePicker();
    const v = $('#view'); v.innerHTML = '';
    if (state.role === 'manager') renderBranch(v, state.branchId, true);
    else if (state.page === 'branches') renderOverview(v);
    else if (state.page === 'city') renderCity(v, state.city);
    else if (state.page === 'branch') renderBranch(v, state.viewBranch, false);
    else if (state.page === 'pending') renderPending(v);
    else if (state.page === 'karne') renderKarne(v);
    else renderToday(v);
    v.querySelectorAll('[data-range]').forEach(b => b.onclick = () => setRange(b.dataset.range));
  }

  function renderRangePicker() {
    const c = $('#range'); if (!c) return;
    c.innerHTML = RANGES.map(([k, l]) =>
      `<button class="${state.range === k ? 'on' : ''}" data-r="${k}" aria-pressed="${state.range === k}">${l}</button>`).join('');
    c.querySelectorAll('button').forEach(b => b.onclick = () => setRange(b.dataset.r));
  }

  function renderNav() {
    const all = scopeReviews(); const pend = all.filter(r => isRed(r) && !handled(r)).length;
    const items = state.role === 'admin'
      ? [['overview', 'sun', 'Özet', pend], ['branches', 'globe', 'Şubeler'], ['karne', 'users', 'Müdür karnesi']]
      : [['branch', 'building', 'Şubem'], ['pending', 'alert', 'Bekleyenler', pend]];
    $('#nav').innerHTML = items.map(([p, ic, t, c]) =>
      `<button class="nav-item ${state.page === p || (p === 'branches' && ['city', 'branch'].includes(state.page)) ? 'active' : ''}" data-page="${p}">${icon(ic)}<span>${t}</span>${c ? `<span class="cnt">${c}</span>` : ''}</button>`).join('');
    $('#nav').querySelectorAll('button').forEach(b => b.onclick = () => {
      state.page = b.dataset.page; if (state.page === 'overview' || state.page === 'branches') { state.city = null; state.viewBranch = null; }
      state.mapCity = null;   // menüden gelen kişi Türkiye'yi görsün, önceki il seçimi kalmasın
      if (state.role === 'manager' && state.page === 'pending') { state.filter.red = true; state.filter.status = 'bekliyor'; }
      else if (state.role === 'manager') { state.filter.red = false; state.filter.status = 'all'; }
      render();
    });
    const b = branch(state.branchId);
    $('#user-chip').innerHTML = state.role === 'admin' ? `<b>SushiCo Genel Müdürlük</b>Yönetici, tüm Türkiye` : `<b>${esc(b.manager)}</b>Şube müdürü, ${esc(b.name)}`;
  }

  function renderCrumbs() {
    const back = $('#back'); back.hidden = NAV_PAGES[state.role].includes(state.page); back.onclick = goBack;
    const c = $('#crumbs'); const parts = [];
    // Müdür tek şubede: il/şube adı zaten sayfa başlığında, kırıntı yalnızca "neredeyim" desin
    if (state.role === 'manager') parts.push(state.page === 'pending'
      ? `<button data-go="branch">Şubem</button><span class="sep">/</span><span>Bekleyenler</span>` : `<span>Şubem</span>`);
    else {
      if (state.page === 'pending') parts.push(`<button data-go="overview">Özet</button><span class="sep">/</span><span>Müdahale bekleyenler</span>`);
      else if (state.page === 'karne') parts.push(`<span>Müdür karnesi</span>`);
      else if (['branches', 'city', 'branch'].includes(state.page)) parts.push(`<button data-go="branches">Şubeler</button>`);
      else parts.push(`<span>Özet</span>`);
      if (state.page === 'city' || state.page === 'branch') parts.push(`<span class="sep">/</span><button data-go="city">${esc(state.city)}</button>`);
      if (state.page === 'branch') parts.push(`<span class="sep">/</span><span>${esc(branch(state.viewBranch).name)}</span>`);
    }
    c.innerHTML = parts.join('');
    c.querySelectorAll('button').forEach(b => b.onclick = () => {
      state.page = b.dataset.go; if (state.page === 'branches') state.city = null; state.viewBranch = null;
      if (state.role === 'manager') { state.filter.red = false; state.filter.status = 'all'; }
      render();
    });
  }

  function kpis(list, extraHtml = '') {
    const s = stats(list);
    const pct = s.red ? Math.round(s.redHandled / s.red * 100) : 100;
    const days = rangeDays();
    return `<div class="kpis">
      <div class="kpi"><div class="lbl">${cap(rangeIn())} gelen yorum</div><div class="val">${s.n}</div><div class="sub">${state.range === 'today' ? 'gün içi, anlık' : `bugün ${s.today} yeni`}</div>${days > 1 ? sparkline(list, days) : ''}</div>
      <div class="kpi"><div class="lbl">Ortalama puan</div><div class="val">${fmtAvg(s.avg)}<span class="star">${icon('star')}</span></div><div class="sub">${rangeIn()}, tüm platformlar</div></div>
      <div class="kpi"><div class="lbl">Kırmızı yorum</div><div class="val red">${s.red}</div><div class="sub">1 ve 2 yıldız, yorumların %${iyelik(s.n ? Math.round(s.red / s.n * 100) : 0)}</div></div>
      <div class="kpi"><div class="lbl">Müdahale bekleyen</div><div class="val ${s.redPending ? 'red' : 'green'}">${s.redPending}</div><div class="sub">${s.red ? `kırmızıların %${iyelik(pct)}ne müdahale edildi` : 'kırmızı yorum yok'}</div><div class="pbar kpi-bar"><i style="width:${pct}%"></i></div></div>
      ${extraHtml}
    </div>`;
  }

  function platformPanel(list) {
    const rows = Object.keys(PLAT).map(p => { const l = list.filter(r => r.platform === p); return { p, n: l.length, avg: avg(l), red: l.filter(isRed).length }; }).filter(x => x.n).sort((a, b) => b.n - a.n);
    const max = Math.max(1, ...rows.map(r => r.n));
    return `<div class="panel"><h3>Platform dağılımı</h3><div class="plist">${rows.map(r => `<div class="prow">${platBox(r.p)}<div><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span>${PLAT[r.p].name}</span><span class="num">${r.n} yorum, ${r.red} kırmızı</span></div><div class="pbar"><i style="width:${r.n / max * 100}%"></i></div></div><span class="num avgnum">${fmtAvg(r.avg)}</span><span></span></div>`).join('')}</div></div>`;
  }


  // ---------- BUGÜN (yönetici açılışı) ----------
  const ISSUE_RULES = [
    ['Eksik veya yanlış sipariş', /eksik|yanlış/i],
    ['Teslimat gecikmesi', /dakika sonra geldi|saat.*geldi|bekletildik|bekledik|yavaş|geç geldi/i],
    ['Bayat, soğuk veya kötü ürün', /bayat|koku|soğuk|ılık|sert|tuzlu|yağlı|saç|dağılmış/i],
    ['Personel ve kurye davranışı', /garson|ilgisiz|kaba|kurye|hesap/i],
    ['Paketleme', /paket|poşet|dökül|açık geldi|açılmış/i],
  ];
  const issueOf = r => (ISSUE_RULES.find(([, re]) => re.test(r.text)) || ['Diğer'])[0];
  const trDate = d => d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });


  // ---------- TÜRKİYE HARİTASI (basitleştirilmiş silüet, inline SVG) ----------
  const TR_ANATOLIA = [[29.15,41.2],[30.3,41.15],[31.4,41.3],[32.3,41.75],[33.3,42.0],[34.2,41.95],[35.1,42.05],[35.5,41.65],[36.2,41.3],[36.6,41.35],[37.6,41.05],[38.5,40.95],[39.8,41.0],[40.7,41.1],[41.5,41.55],[42.5,41.45],[43.4,41.15],[43.7,40.7],[44.3,40.2],[44.8,39.7],[44.3,39.4],[44.5,38.9],[44.2,38.4],[44.8,37.7],[44.3,37.1],[43.3,37.3],[42.4,37.1],[41.3,37.05],[40.6,37.1],[39.5,36.75],[38.4,36.85],[37.3,36.65],[36.7,36.85],[36.6,36.3],[36.2,35.85],[35.9,36.3],[36.2,36.6],[35.5,36.6],[34.9,36.75],[34.3,36.55],[33.7,36.15],[32.9,36.1],[32.2,36.35],[31.4,36.7],[30.6,36.85],[30.5,36.3],[29.8,36.15],[29.1,36.65],[28.2,36.75],[27.4,37.0],[27.3,37.4],[27.0,38.0],[26.4,38.3],[26.9,38.6],[26.7,39.1],[26.3,39.5],[26.8,39.7],[26.2,40.05],[26.5,40.3],[27.2,40.42],[28.2,40.4],[29.0,40.4],[29.7,40.7],[29.4,40.82],[29.05,41.0]];
  const TR_THRACE = [[26.0,41.8],[27.0,42.0],[28.0,41.98],[29.0,41.25],[29.0,41.0],[28.0,40.97],[27.3,40.95],[26.9,40.6],[26.3,40.05],[26.15,40.4],[26.6,40.65],[26.1,40.75],[26.3,41.2],[26.6,41.6]];
  const CITY_LL = { 'İstanbul': [29.0, 41.02], 'Ankara': [32.85, 39.93], 'İzmir': [27.14, 38.42], 'Bursa': [29.06, 40.19], 'Antalya': [30.7, 36.9], 'Kocaeli': [29.92, 40.77], 'Sakarya': [30.4, 40.77], 'Muğla': [27.43, 37.04], 'Eskişehir': [30.52, 39.78], 'Mersin': [34.63, 36.8], 'Gaziantep': [37.38, 37.07] };
  const MK = 50, MX0 = 25.6, MY0 = 42.25, MY = MK * 1.28;
  const mx = lon => (lon - MX0) * MK, my = lat => (MY0 - lat) * MY;
  const poly = pts => pts.map(([lo, la]) => `${mx(lo).toFixed(1)},${my(la).toFixed(1)}`).join(' ');

  function trMap(cityStats) {
    const max = Math.max(1, ...cityStats.map(c => c.s.n));
    const dots = cityStats.map(({ c, s }) => {
      const ll = CITY_LL[c]; if (!ll) return '';
      const r = 6 + Math.sqrt(s.n / max) * 16;
      const cls = s.redPending ? 'bad' : 'ok';
      const x = mx(ll[0]), y = my(ll[1]);
      // etiket konumu: batı kıyısındakiler sola, diğerleri sağa
      const left = ['İzmir', 'Muğla'].includes(c);
      const aboveC = ['İstanbul', 'Kocaeli'].includes(c), belowC = ['Sakarya', 'Bursa'].includes(c);
      let labelX = left ? x - r - 6 : x + r + 6, anchor = left ? 'end' : 'start', labelY = y + 4;
      if (aboveC) { labelX = x; anchor = 'middle'; labelY = y - r - 7; }
      if (belowC) { labelX = x; anchor = 'middle'; labelY = y + r + 14; }
      return `<g class="city ${cls}" data-city="${esc(c)}" tabindex="0" role="button" aria-label="${esc(c)}: ${s.n} yorum, ${s.redPending} bekleyen">
        <circle class="halo" cx="${x}" cy="${y}" r="${r + 6}"/>
        <circle class="dot" cx="${x}" cy="${y}" r="${r}"/>
        ${s.redPending ? `<text class="cnt" x="${x}" y="${y + 4}" text-anchor="middle">${s.redPending}</text>` : ''}
        <text class="lbl" x="${labelX}" y="${labelY}" text-anchor="${anchor}">${esc(c)}</text>
      </g>`;
    }).join('');
    return `<svg class="trmap" viewBox="0 15 975 405" role="img" aria-label="Türkiye haritası, illere göre yorum durumu">
      <polygon class="land" points="${poly(TR_ANATOLIA)}"/>
      <polygon class="land" points="${poly(TR_THRACE)}"/>
      ${dots}
    </svg>`;
  }
  // İl bazında istatistik: harita ve il kartları aynı listeyi kullanır
  function cityStatsOf(all) {
    return [...new Set(state.branches.map(b => b.city))].map(c => {
      const ids = state.branches.filter(b => b.city === c).map(b => b.id);
      const l = all.filter(r => ids.includes(r.branchId));
      return { c, l, s: stats(l), nb: ids.length };
    }).sort((a, b) => b.s.n - a.s.n);
  }
  const mapLegend = () => `<div class="map-legend"><span><i class="lg bad"></i>müdahale bekleyen var</span><span><i class="lg ok"></i>bekleyen yok</span><span class="muted">nokta büyüklüğü = yorum sayısı</span></div>`;

  // ---------- HARİTA BLOĞU: harita + il paneli ----------
  // Tıklama akışı: Türkiye (il listesi) → ile tıkla → il özeti panelde → "İzmir şubelerini aç" ya da
  // aynı noktaya ikinci tıklama → il sayfası → şube. Yalnız panel yeniden çizilir, kaydırma yerinde kalır.
  function mapBlock(cities) {
    return `<div class="map-block"><div class="map-block-map">${trMap(cities)}${mapLegend()}</div><div class="city-panel" id="city-panel"></div></div>`;
  }
  function cityPanel(cities, c) {
    const x = c && cities.find(y => y.c === c);
    if (!x) {
      const rows = cities.filter(y => y.s.n).sort((a, b) => b.s.redPending - a.s.redPending || b.s.n - a.s.n);
      const pend = rows.reduce((a, y) => a + y.s.redPending, 0);
      return `<div class="cp-head"><b>Türkiye</b><span class="muted">${cities.length} il, ${state.branches.length} şube</span></div>
        <div class="cp-hint">${pend ? `${pend} yorum müdahale bekliyor. ` : ''}Haritada ya da listede bir ile tıklayınca özeti burada açılır.</div>
        <div class="cp-list">${rows.map(y => `<button class="cp-row" data-sel="${esc(y.c)}"><span>${esc(y.c)}</span><span class="muted">${y.s.n} yorum, ${fmtAvg(y.s.avg)}★</span><span class="cp-pend ${y.s.redPending ? 'bad' : ''}">${y.s.redPending ? y.s.redPending + ' bekleyen' : '—'}</span></button>`).join('')}</div>`;
    }
    const bs = state.branches.filter(b => b.city === c).map(b => ({ b, s: stats(x.l.filter(r => r.branchId === b.id)) }))
      .sort((a, b) => b.s.redPending - a.s.redPending || b.s.red - a.s.red || a.s.avg - b.s.avg).slice(0, 4);
    const pct = x.s.red ? Math.round(x.s.redHandled / x.s.red * 100) : null;
    return `<div class="cp-head"><button class="cp-back" data-sel="">${icon('arrow')}Türkiye</button><span class="muted">${x.nb} şube</span></div>
      <h3 class="cp-title">${esc(c)}</h3>
      <div class="cp-facts">
        <div><b>${x.s.n ? fmtAvg(x.s.avg) : '–'}</b>ortalama</div>
        <div><b>${x.s.n}</b>yorum</div>
        <div><b class="${x.s.redPending ? 'v-bad' : 'v-good'}">${x.s.redPending}</b>bekleyen</div>
        <div><b class="${pct === null ? '' : pctCls(pct)}">${pct === null ? '–' : '%' + pct}</b>müdahale</div>
      </div>
      <div class="cp-sub">${x.s.redPending ? 'Dikkat isteyen şubeler' : 'Şubeler'}</div>
      <div class="cp-list">${bs.map(({ b, s }) => `<button class="cp-row" data-open-branch="${b.id}"><span>${esc(b.name)}</span><span class="muted">${s.n ? fmtAvg(s.avg) + '★' : 'yorum yok'}</span><span class="cp-pend ${s.redPending ? 'bad' : ''}">${s.redPending ? s.redPending + ' bekleyen' : s.n ? 'bekleyen yok' : ''}</span></button>`).join('')}</div>
      <button class="btn btn-solid btn-sm cp-open" data-open-city="${esc(c)}">${esc(c)} şubelerini aç ${icon('arrow')}</button>`;
  }
  function bindMapBlock(v, cities) {
    const panel = v.querySelector('#city-panel'); if (!panel) return;
    if (state.mapCity && !cities.some(y => y.c === state.mapCity)) state.mapCity = null;
    const goCity = c => { state.city = c; state.page = 'city'; render(); };
    const paint = () => {
      v.querySelectorAll('.trmap .city').forEach(g => g.classList.toggle('sel', g.dataset.city === state.mapCity));
      panel.innerHTML = cityPanel(cities, state.mapCity);
      panel.querySelectorAll('[data-sel]').forEach(b => b.onclick = () => { state.mapCity = b.dataset.sel || null; paint(); });
      panel.querySelectorAll('[data-open-city]').forEach(b => b.onclick = () => goCity(b.dataset.openCity));
      panel.querySelectorAll('[data-open-branch]').forEach(b => b.onclick = () => { const br = branch(b.dataset.openBranch); state.city = br.city; state.viewBranch = br.id; state.page = 'branch'; state.filter = { platform: 'all', red: false, status: 'all' }; render(); });
    };
    v.querySelectorAll('.trmap .city').forEach(g => {
      const go = () => { if (state.mapCity === g.dataset.city) goCity(g.dataset.city); else { state.mapCity = g.dataset.city; paint(); } };
      g.onclick = go; g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
    });
    paint();
  }

  // ---------- GRAFİKLER ----------
  // Günlük ortalama puan: tek seri, tek eksen, 2px çizgi; hover'da dikey kılavuz, nokta ve balon.
  function trendChart(days) {
    const start = startOfToday() - (days - 1) * 86400000;
    const buckets = Array.from({ length: days }, (_, i) => ({ day: start + i * 86400000, sum: 0, n: 0 }));
    for (const r of state.reviews) { const i = Math.floor((new Date(r.date).getTime() - start) / 86400000); if (i >= 0 && i < days) { buckets[i].sum += r.rating; buckets[i].n++; } }
    const pts = buckets.map((b, i) => ({ i, day: b.day, n: b.n, avg: b.n ? b.sum / b.n : null })).filter(p => p.avg !== null);
    const W = 640, H = 190, L = 34, R = 14, T = 14, B = 26;
    const lo = pts.length ? Math.max(1, Math.floor((Math.min(...pts.map(p => p.avg)) - 0.3) * 2) / 2) : 3, hi = 5;
    const X = i => L + i / Math.max(1, days - 1) * (W - L - R), Y = a => T + (hi - a) / (hi - lo) * (H - T - B);
    const fmtD = t => new Date(t).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    const grid = []; for (let g = lo; g <= hi + 1e-9; g += 0.5) grid.push(g);
    const xl = [...new Set([0, Math.floor((days - 1) / 2), days - 1])];
    const line = pts.map((p, k) => `${k ? 'L' : 'M'}${X(p.i).toFixed(1)},${Y(p.avg).toFixed(1)}`).join('');
    const area = pts.length ? `${line}L${X(pts[pts.length - 1].i).toFixed(1)},${Y(lo)}L${X(pts[0].i).toFixed(1)},${Y(lo)}Z` : '';
    const last = pts[pts.length - 1];
    const cw = (W - L - R) / Math.max(1, days - 1);
    return `<div class="trend"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Günlük ortalama puan, son ${days} gün">
      ${grid.map(g => `<line class="grid" x1="${L}" x2="${W - R}" y1="${Y(g)}" y2="${Y(g)}"/><text class="axis" x="${L - 6}" y="${Y(g) + 4}" text-anchor="end">${fmtAvg(g)}</text>`).join('')}
      ${xl.map(i => `<text class="axis" x="${X(i)}" y="${H - 8}" text-anchor="${i === 0 ? 'start' : i === days - 1 ? 'end' : 'middle'}">${i === days - 1 ? 'bugün' : fmtD(buckets[i].day)}</text>`).join('')}
      ${area ? `<path class="area" d="${area}"/>` : ''}<path class="line" d="${line}"/>
      ${pts.map(p => `<g class="col" data-tip="${fmtD(p.day)} · ${fmtAvg(p.avg)} ★ · ${p.n} yorum"><rect class="hit" x="${X(p.i) - cw / 2}" y="${T}" width="${cw}" height="${H - T - B}"/><line class="xh" x1="${X(p.i)}" x2="${X(p.i)}" y1="${T}" y2="${H - B}"/><circle class="pt ${p === last ? 'last' : ''}" cx="${X(p.i)}" cy="${Y(p.avg)}" r="4"/></g>`).join('')}
      ${last ? `<text class="lbl-last" x="${X(last.i) - 8}" y="${Y(last.avg) - 9}" text-anchor="end">${fmtAvg(last.avg)}</text>` : ''}
    </svg><div class="trend-tip" hidden></div></div>`;
  }
  function bindTrend(v) {
    v.querySelectorAll('.trend').forEach(t => {
      const tip = t.querySelector('.trend-tip'), svg = t.querySelector('svg');
      t.querySelectorAll('.col').forEach(col => {
        col.onmouseenter = () => { tip.textContent = col.dataset.tip; tip.hidden = false; tip.style.left = (col.querySelector('circle').cx.baseVal.value / svg.viewBox.baseVal.width * 100) + '%'; };
        col.onmouseleave = () => { tip.hidden = true; };
      });
    });
  }
  // Duygu dağılımı: üç durum rengi, 2px aralıklı yığın çubuk + etiketli açıklama (renk tek başına değil)
  function sentimentBar(s) {
    const p = n => s.n ? Math.round(n / s.n * 100) : 0;
    return `<div class="sent"><div class="sent-bar"><i class="pos" style="width:${p(s.pos)}%"></i><i class="neu" style="width:${p(s.neu)}%"></i><i class="neg" style="width:${p(s.red)}%"></i></div>
      <div class="sent-leg"><span><i class="lg pos"></i>Olumlu <b>${s.pos}</b> (%${p(s.pos)})</span><span><i class="lg neu"></i>Nötr <b>${s.neu}</b> (%${p(s.neu)})</span><span><i class="lg neg"></i>Olumsuz <b>${s.red}</b> (%${p(s.red)})</span></div></div>`;
  }

  // Brifing sayfalarının ilk satırı: bugünse tarih, değilse dönem ve aralığı
  function periodLine() {
    const fmtShort = d => d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    return state.range === 'today'
      ? `<div class="brief-date cap">${trDate(new Date())}</div>`
      : `<div class="brief-date">${rangeTitle()} · ${fmtShort(new Date(rangeStart()))} – ${fmtShort(new Date())}</div>`;
  }

  function renderToday(v) {
    const all = ranged();
    const prev = prevRanged();
    const now = Date.now();
    const t0 = startOfToday();
    const reds = all.filter(isRed);
    const handledReds = reds.filter(handled);
    const respRate = reds.length ? Math.round(handledReds.length / reds.length * 100) : 100;
    const withTime = handledReds.filter(r => r.firstActionAt || r.actionAt);
    const avgRespH = withTime.length ? withTime.reduce((a, r) => a + (new Date(r.firstActionAt || r.actionAt) - new Date(r.date)), 0) / withTime.length / 3600000 : 0;
    const fmtH = fmtDur;

    // Bekleyenler: en uzun bekleyen üstte, son bir saatte düşen yorum her zaman en başta.
    // Listede yalnızca ilk 5'i gösteriyoruz; gerisi "Tümünü gör"le ayrı sayfada. Özet sayfası liste değil, brifing.
    const pendingAll = reds.filter(r => !handled(r)).map(r => {
      const hrs = (now - new Date(r.date)) / 3600000;
      return { r, hrs, fresh: hrs < 1 };
    }).sort((a, b) => (b.fresh - a.fresh) || (b.hrs - a.hrs));
    const PEEK = 5;
    const pending = pendingAll.slice(0, PEEK);
    const overdue = pendingAll.filter(p => p.hrs >= 24).length;
    const inProgress = reds.filter(r => r.status === 'ulasiliyor' || r.status === 'baglanti');
    const resolvedToday = reds.filter(r => r.status === 'cozuldu' && r.actionAt && new Date(r.actionAt) >= t0);
    const resolvedTodayH = resolvedToday.length ? resolvedToday.reduce((a, r) => a + (new Date(r.actionAt) - new Date(r.date)), 0) / resolvedToday.length / 3600000 : 0;

    const posAll = all.filter(r => r.rating >= 4);
    const s = stats(all);
    // İlk müdahale süresi, önceki dönemle kıyas (kısalma iyi)
    const prevWT = prev.filter(r => isRed(r) && handled(r) && (r.firstActionAt || r.actionAt));
    const prevRespH = prevWT.length ? prevWT.reduce((a, r) => a + (new Date(r.firstActionAt || r.actionAt) - new Date(r.date)), 0) / prevWT.length / 3600000 : null;
    const days = Math.max(7, rangeDays());   // trend grafiği: "Bugün" seçiliyken bile 7 gün göster

    // Harita: il noktaları dönem içindeki yorum sayısına göre, bekleyeni olan il kırmızı ve sayılı
    const cityStats = cityStatsOf(all);

    // Uç şubeler: kısa dönemde 5 yorum şartı hiçbir şubeyi geçirmez, eşik döneme göre iner
    const minN = state.range === 'today' ? 2 : 5;
    const perBranch = state.branches.map(b => { const l = all.filter(r => r.branchId === b.id); return { b, n: l.length, a: avg(l) }; }).filter(x => x.n >= minN);
    const worst = perBranch.slice().sort((a, b) => a.a - b.a).slice(0, 3);
    const best = perBranch.slice().sort((a, b) => b.a - a.a).slice(0, 3);
    // Övgüler: dönem içindeki 5 yıldızlılardan, farklı şubelerden, dolu metinli ve yeni olanlar
    const pickHighlights = (minLen) => {
      const seen = new Set(), seenText = new Set(), out = [];
      all.filter(r => r.rating === 5 && r.text.length >= minLen).sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(r => { if (out.length < 2 && !seen.has(r.branchId) && !seenText.has(r.text)) { seen.add(r.branchId); seenText.add(r.text); out.push(r); } });
      return out;
    };
    let highlights = pickHighlights(60);
    if (!highlights.length) highlights = pickHighlights(0);
    const posShare = all.length ? Math.round(posAll.length / all.length * 100) : 0;

    // Ortalama puan, bir önceki eşit uzunluktaki dönemle kıyaslanır
    const avgNow = all.length ? avg(all) : null, avgPrev = prev.length ? avg(prev) : null;
    const r1 = x => Math.round(x * 10);
    const trend = avgNow !== null && avgPrev !== null && all.length >= 5 && prev.length >= 5
      ? (r1(avgNow) > r1(avgPrev) ? 'yukarı' : r1(avgNow) < r1(avgPrev) ? 'aşağı' : 'aynı') : null;
    // Karneye köprü: olumsuz yorumu olup hiçbirine dokunmamış şube sayısı
    const untouched = state.branches.map(b => karneRow(b, all)).filter(k => k.red && k.cover === 0).length;

    const dateLine = state.range === 'today' ? cap(trDate(new Date()))
      : `${rangeTitle()} · ${new Date(rangeStart()).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} – ${new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}`;
    const arrowOf = t => t === 'yukarı' ? '▲' : t === 'aşağı' ? '▼' : '=';
    const respTrend = prevRespH !== null && withTime.length ? (avgRespH < prevRespH * 0.95 ? 'up' : avgRespH > prevRespH * 1.05 ? 'down' : 'flat') : null;

    v.innerHTML = `
      <div class="dash">
        ${pageHead('Özet', `${dateLine} · tüm Türkiye, ${state.branches.length} şube`)}

        ${pendingAll.length
          ? `<div class="alertbar ${overdue ? 'bad' : 'warn'}">${icon('alert')}<span><b>${pendingAll.length} yorum</b> müdahale bekliyor${overdue ? `, <b>${iyelik(overdue)}</b> 24 saati aştı` : ''}.${untouched ? ` ${untouched} şubede olumsuz yorumlara hiç dokunulmamış.` : ''}</span>
              <span class="alert-links">${untouched ? `<button class="link" id="go-karne">Müdür karnesi</button>` : ''}<button class="link" id="go-pending">Bekleyenleri gör</button></span></div>`
          : `<div class="alertbar good">${icon('check')}<span>${all.length ? 'Bekleyen yorum yok, tüm olumsuz yorumlara müdahale edildi.' : `${cap(rangeIn())} henüz yorum gelmedi.`}</span>${!all.length && state.range !== '30' ? `<span class="alert-links"><button class="link" data-range="30">Son 30 güne bak</button></span>` : ''}</div>`}

        <div class="stat-grid">
          <div class="stat"><div class="stat-l">Ortalama puan</div><div class="stat-v">${avgNow !== null ? fmtAvg(avgNow) : '–'}<span class="star">${icon('star')}</span></div>
            <div class="stat-s">${trend ? `<span class="stat-trend ${trend === 'yukarı' ? 'up' : trend === 'aşağı' ? 'down' : ''}">${arrowOf(trend)} ${fmtAvg(avgPrev)}</span> ${prevLabel()}` : rangeIn()}</div></div>
          <div class="stat"><div class="stat-l">Gelen yorum</div><div class="stat-v">${all.length}</div>
            <div class="stat-s">${state.range === 'today' ? `${posAll.length} olumlu, ${reds.length} olumsuz` : `bugün ${s.today} yeni, ${reds.length} olumsuz`}</div></div>
          <div class="stat"><div class="stat-l">Müdahale bekleyen</div><div class="stat-v ${pendingAll.length ? 'v-bad' : 'v-good'}">${pendingAll.length}</div>
            <div class="stat-s">${pendingAll.length ? (overdue ? `<span class="stat-trend down">${overdue} tanesi 24 saati aştı</span>` : 'hepsi 24 saat içinde') : 'bekleyen yok'}</div></div>
          <div class="stat"><div class="stat-l">Olumsuzlara müdahale</div><div class="stat-v ${reds.length ? pctCls(respRate) : ''}">${reds.length ? '%' + respRate : '–'}</div>
            <div class="stat-s">${handledReds.length} / ${reds.length} olumsuz yorum</div><div class="pbar"><i class="${reds.length ? band(respRate) : ''}" style="width:${reds.length ? respRate : 0}%"></i></div></div>
          <div class="stat"><div class="stat-l">İlk müdahale süresi</div><div class="stat-v">${withTime.length ? fmtH(avgRespH) : '–'}</div>
            <div class="stat-s">${respTrend ? `<span class="stat-trend ${respTrend === 'flat' ? '' : respTrend}">${respTrend === 'up' ? '▼' : respTrend === 'down' ? '▲' : '='} ${fmtH(prevRespH)}</span> ${prevLabel()}` : 'ortalama, olumsuz yorumlar'}</div></div>
          <div class="stat"><div class="stat-l">Bugün çözülen</div><div class="stat-v ${resolvedToday.length ? 'v-good' : ''}">${resolvedToday.length}</div>
            <div class="stat-s">${resolvedToday.length ? `ort. ${fmtH(resolvedTodayH)} içinde` : 'henüz yok'}${inProgress.length ? `, ${inProgress.length} görüşme sürüyor` : ''}</div></div>
        </div>

        ${mapBlock(cityStats)}

        <div class="dash-cols">
          <div class="dash-main">
            <div class="panel"><div class="panel-head"><h3>Günlük ortalama puan</h3><span class="muted">son ${days} gün, tüm şubeler</span></div>${trendChart(days)}</div>
            <div class="panel"><div class="panel-head"><h3>Müdahale bekleyenler</h3><span class="muted">${pendingAll.length > PEEK ? `${pendingAll.length} yorumdan ilk ${PEEK}'i, en uzun bekleyen üstte` : pendingAll.length ? 'en uzun bekleyen üstte' : ''}</span></div>
              <div class="brief-list compact">
              ${pending.length ? pending.map(({ r, hrs, fresh }) => { const b = branch(r.branchId); return `
                <button class="brow ${fresh ? 'fresh' : ''} ${hrs >= 24 ? 'over' : ''}" data-id="${r.id}">
                  <div class="brow-top"><span class="brow-branch">${esc(b.name)}<span class="brow-city">, ${esc(b.city)}</span></span>
                    <span class="brow-right">${fresh ? '<span class="tag new">Yeni</span>' : ''}${hrs >= 24 ? '<span class="tag over">24 saati aştı</span>' : ''}<time class="brow-time">${ago(r.date)}</time></span></div>
                  <div class="brow-quote">“${esc(r.text)}”</div>
                  <div class="brow-meta">${stars(r.rating)}${platMini(r.platform)}<span>${esc(r.author)}</span><span class="brow-owner">Müdür: ${esc(b.manager)}</span></div>
                </button>`; }).join('')
              : `<div class="brow-empty">${all.length ? 'Bekleyen yorum yok.' : `${cap(rangeIn())} yorum gelmedi.`} Yeni bir olumsuz yorum düştüğünde burada görünür ve şube müdürüne anında bildirim gider.</div>`}
              </div>
              ${pendingAll.length > PEEK ? `<button class="more" id="go-pending-2">Bekleyenlerin tümünü gör (${pendingAll.length}) ${icon('arrow')}</button>` : ''}
            </div>
          </div>
          <aside class="dash-side">
            <div class="panel"><div class="panel-head"><h3>Yorum dağılımı</h3><span class="muted">${rangeIn()}</span></div>${sentimentBar(s)}</div>
            ${platformPanel(all)}
            ${perBranch.length ? `<div class="panel"><div class="panel-head"><h3>Şube uçları</h3><button class="link" id="go-ranking">Tüm şubeler</button></div>
              <p class="worst"><span class="where-l">En düşük</span>${worst.map(w => `<button class="where-pill soft" data-branch="${w.b.id}">${esc(w.b.name)}<b>${fmtAvg(w.a)}</b></button>`).join('')}</p>
              <p class="worst"><span class="where-l">En yüksek</span>${best.map(w => `<button class="where-pill soft good" data-branch="${w.b.id}">${esc(w.b.name)}<b>${fmtAvg(w.a)}</b></button>`).join('')}</p></div>` : ''}
            ${highlights.length ? `<div class="panel"><div class="panel-head"><h3>Övgü alanlar</h3><span class="muted">%${posShare} olumlu</span></div><div class="brief-list compact">
              ${highlights.map(r => { const b = branch(r.branchId); return `
                <button class="brow hl" data-id="${r.id}">
                  <div class="brow-top"><span class="brow-branch">${esc(b.name)}<span class="brow-city">, ${esc(b.city)}</span></span><time class="brow-time">${ago(r.date)}</time></div>
                  <div class="brow-quote">“${esc(r.text)}”</div>
                  <div class="brow-meta">${stars(r.rating)}${platMini(r.platform)}</div>
                </button>`; }).join('')}</div></div>` : ''}
          </aside>
        </div>
      </div>`;

    v.querySelectorAll('.brow[data-id]').forEach(b => b.onclick = () => openDrawer(b.dataset.id));
    bindMapBlock(v, cityStats); bindTrend(v);
    v.querySelectorAll('.where-pill[data-branch]').forEach(b => b.onclick = () => { const br = branch(b.dataset.branch); state.city = br.city; state.viewBranch = br.id; state.page = 'branch'; state.filter = { platform: 'all', red: false, status: 'all' }; render(); });
    v.querySelectorAll('#go-pending, #go-pending-2').forEach(b => b.onclick = () => { state.page = 'pending'; render(); });
    const gr = $('#go-ranking'); if (gr) gr.onclick = () => { state.page = 'branches'; state.branchView = 'table'; render(); };
    const gk = $('#go-karne'); if (gk) gk.onclick = () => { state.page = 'karne'; render(); };
  }

  // Her sayfanın aynı biçimde açılması için ortak başlık: ne bakıyorum + hangi dönem + görünüm seçimi
  function pageHead(title, sub, right = '') {
    return `<div class="page-head"><div><h1>${title}</h1><p class="page-sub">${sub}</p></div>${right}</div>`;
  }
  function viewTabs() {
    return `<div class="seg small" id="branch-view" role="group" aria-label="Görünüm">
      <button class="${state.branchView === 'cards' ? 'on' : ''}" data-v="cards">Kartlar</button>
      <button class="${state.branchView === 'table' ? 'on' : ''}" data-v="table">Tablo</button></div>`;
  }

  function renderOverview(v) {
    const all = ranged();
    const cities = cityStatsOf(all);
    const head = pageHead('Şubeler', `${cities.length} il, ${state.branches.length} şube · ${rangeTitle()}`, viewTabs());

    if (state.branchView === 'table') {
      v.innerHTML = head + branchTable(all);
    } else {
      v.innerHTML = head + `
        ${mapBlock(cities)}
        <div class="section"><div class="section-head"><h2>İller</h2><span class="muted">bir ile tıklayınca şubeleri açılır</span></div>
        <div class="grid">${cities.some(c => c.s.n) ? cities.map(({ c, s, nb }) => cityCard(c, s, nb)).join('') : ''}</div>
        ${cities.some(c => c.s.n) ? '' : emptyBox(`${cap(rangeIn())} hiçbir şubeye yorum gelmedi.`)}</div>
        ${platformPanel(all)}`;
    }
    v.querySelectorAll('.card[data-city]').forEach(b => b.onclick = () => { state.city = b.dataset.city; state.page = 'city'; render(); });
    v.querySelectorAll('tr[data-branch]').forEach(t => t.onclick = () => { const b = branch(t.dataset.branch); state.city = b.city; state.viewBranch = b.id; state.page = 'branch'; state.filter = { platform: 'all', red: false, status: 'all' }; render(); });
    v.querySelectorAll('#branch-view button').forEach(b => b.onclick = () => { state.branchView = b.dataset.v; render(); });
    bindMapBlock(v, cities); bindRows(v);
  }

  // Eski "Şube sıralaması" sayfası — artık Şubeler'in tablo görünümü
  function branchTable(all) {
    const rows = state.branches.map(b => ({ b, s: stats(all.filter(r => r.branchId === b.id)) })).filter(x => x.s.n).sort((a, b) => b.s.avg - a.s.avg);
    if (!rows.length) return emptyBox(`${cap(rangeIn())} hiçbir şubeye yorum gelmedi.`);
    return `<div class="panel" style="padding:0;overflow:auto"><table class="tbl"><thead><tr><th>#</th><th>Şube</th><th>İl</th><th class="num">Yorum</th><th class="num">Ortalama</th><th class="num">Kırmızı</th><th class="num">Müdahale</th><th>Müdür</th></tr></thead><tbody>
      ${rows.map(({ b, s }, i) => `<tr data-branch="${b.id}" style="cursor:pointer"><td class="muted">${i + 1}</td><td><b>${esc(b.name)}</b></td><td class="muted">${esc(b.city)}</td><td class="num">${s.n}</td><td class="num avgnum">${fmtAvg(s.avg)}</td><td class="num" style="color:${s.red ? 'var(--red)' : 'inherit'}">${s.red}</td><td class="num" style="color:${s.redPending ? 'var(--red)' : 'var(--green)'}">${s.red ? Math.round(s.redHandled / s.red * 100) : 100}%</td><td class="muted">${esc(b.manager)}</td></tr>`).join('')}
      </tbody></table></div>`;
  }
  function cityCard(c, s, nb) {
    return `<button class="card" data-city="${esc(c)}">${s.redPending ? '<span class="alert"></span>' : ''}
      <div class="title">${esc(c)}<span class="rating">${fmtAvg(s.avg)}${icon('star')}</span></div>
      <div class="meta"><div><b>${s.n}</b>yorum</div><div class="r"><b>${s.red}</b>kırmızı</div><div class="ok"><b>${s.redHandled}/${s.red}</b>müdahale</div></div>
      <div class="bar"><i style="width:${s.n ? s.pos / s.n * 100 : 0}%;background:var(--green)"></i><i style="width:${s.n ? s.neu / s.n * 100 : 0}%;background:var(--amber)"></i><i style="width:${s.n ? s.red / s.n * 100 : 0}%;background:var(--red)"></i></div>
      <div class="sub">${nb} şube, bugün ${s.today} yeni</div></button>`;
  }

  function renderCity(v, city) {
    const bs = state.branches.filter(b => b.city === city);
    const all = ranged().filter(r => bs.some(b => b.id === r.branchId));
    const rows = bs.map(b => ({ b, s: stats(all.filter(r => r.branchId === b.id)) })).sort((a, b) => b.s.redPending - a.s.redPending || b.s.red - a.s.red);
    const reds = all.filter(isRed);
    v.innerHTML = pageHead(esc(city), `${bs.length} şube · ${rangeTitle()}`) + kpis(all) + `
      <div class="section"><div class="section-head"><h2>Şubeler</h2><span class="muted">müdahale bekleyeni olan üstte</span></div>
      <div class="grid">${rows.map(({ b, s }) => `<button class="card" data-branch="${b.id}">${s.redPending ? '<span class="alert"></span>' : ''}
        <div class="title">${esc(b.name)}<span class="rating">${s.n ? fmtAvg(s.avg) : '–'}${icon('star')}</span></div>
        <div class="meta"><div><b>${s.n}</b>yorum</div><div class="r"><b>${s.red}</b>kırmızı</div><div class="ok"><b>${s.redHandled}/${s.red}</b>müdahale</div></div>
        <div class="bar"><i style="width:${s.n ? s.pos / s.n * 100 : 0}%;background:var(--green)"></i><i style="width:${s.n ? s.neu / s.n * 100 : 0}%;background:var(--amber)"></i><i style="width:${s.n ? s.red / s.n * 100 : 0}%;background:var(--red)"></i></div>
        <div class="sub">Müdür ${esc(b.manager)}</div></button>`).join('')}</div></div>
      <div class="section"><div class="section-head"><h2>${esc(city)} olumsuz yorumları <span class="muted" style="font-weight:400;font-size:13px">(${reds.length})</span></h2></div>
      <div class="list">${reds.length ? reds.slice(0, 8).map(r => revRow(r, true)).join('') : emptyBox(`${cap(rangeIn())} bu ilde olumsuz yorum yok.`)}</div></div>`;
    v.querySelectorAll('[data-branch]').forEach(b => b.onclick = () => { state.viewBranch = b.dataset.branch; state.page = 'branch'; state.filter = { platform: 'all', red: false, status: 'all' }; render(); });
    bindRows(v);
  }

  function filterBar(all) {
    const f = state.filter;
    // Yalnızca bu şubede yorumu olan platformlar çip olur; boş çip, boş tıklama demek
    const present = Object.keys(PLAT).filter(p => all.some(r => r.platform === p));
    return `<div class="filters">
      <button class="chip red ${f.red ? 'on' : ''}" data-f="red">Sadece kırmızı</button>
      <button class="chip ${f.status === 'bekliyor' ? 'on' : ''}" data-f="status" data-v="bekliyor">Bekleyen</button>
      <button class="chip ${f.status === 'cozuldu' ? 'on' : ''}" data-f="status" data-v="cozuldu">Çözülen</button>
      ${present.length > 1 ? `<span style="width:8px"></span>
      <button class="chip ${f.platform === 'all' ? 'on' : ''}" data-f="platform" data-v="all">Tümü</button>
      ${present.map(p => `<button class="chip ${f.platform === p ? 'on' : ''}" data-f="platform" data-v="${p}">${PLAT[p].name}</button>`).join('')}` : ''}
    </div>`;
  }
  function bindFilters(v) {
    v.querySelectorAll('.chip').forEach(c => c.onclick = () => {
      const f = c.dataset.f;
      if (f === 'red') state.filter.red = !state.filter.red;
      else if (f === 'status') state.filter.status = state.filter.status === c.dataset.v ? 'all' : c.dataset.v;
      else state.filter.platform = c.dataset.v;
      render();
    });
  }

  function renderBranch(v, id, isManager) {
    const b = branch(id);
    const all = ranged().filter(r => r.branchId === id);
    const list = applyFilter(all);
    const filtered = list.length !== all.length;
    v.innerHTML = pageHead(isManager ? esc(b.name) : esc(b.name), `${esc(b.city)} · Müdür ${esc(b.manager)} · ${rangeTitle()}`) + kpis(all) + `
      <div class="section"><div class="section-head"><h2>Yorumlar <span class="muted" style="font-weight:400;font-size:13px">(${list.length})</span></h2>${filterBar(all)}</div>
      <div class="list">${list.length ? list.map(r => revRow(r)).join('')
        : filtered ? '<div class="empty">Bu filtreye uyan yorum yok. <button class="link" id="clear-filters">Filtreleri temizle</button></div>'
        : emptyBox(`${cap(rangeIn())} bu şubeye yorum gelmedi.`)}</div></div>`;
    const cf = $('#clear-filters'); if (cf) cf.onclick = () => { state.filter = { platform: 'all', red: false, status: 'all' }; render(); };
    bindFilters(v); bindRows(v);
  }

  function renderPending(v) {
    const list = scopeReviews().filter(r => isRed(r) && !handled(r))
      .sort((a, b) => new Date(a.date) - new Date(b.date));   // en uzun bekleyen üstte
    v.innerHTML = pageHead('Müdahale bekleyenler', `${list.length} olumsuz yorum · ${rangeTitle()} · en uzun bekleyen üstte`) + `
      <div class="section"><div class="list">${list.length ? list.map(r => revRow(r, true)).join('')
        : emptyBox(`${cap(rangeIn())} müdahale bekleyen yorum yok.`)}</div></div>`;
    bindRows(v);
  }

  // ---------- MÜDÜR KARNESİ ----------
  // Zincirin ölçtüğü şey restoran değil, müdürün davranışı: olumsuz yoruma dokundu mu,
  // ne kadar sürede dokundu, kapattı mı. Puanlar yorumdan değil, müdahaleden gelir.
  const KARNE_W = { cover: 40, speed: 35, solve: 25 };   // 100 puanın dağılımı
  const band = s => s === null ? 'none' : s >= 80 ? 'good' : s >= 55 ? 'warn' : 'bad';
  const bandLabel = s => s === null ? 'Olumsuz yorum gelmedi' : s >= 80 ? 'İyi' : s >= 55 ? 'Takip gerekiyor' : 'Zayıf';
  const median = a => a.length ? a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)] : null;

  // pool: dönem süzgecinden geçmiş yorumlar. 41 şube için tek tek süzmemek adına dışarıdan verilir.
  function karneRow(b, pool) {
    const now = Date.now();
    const list = (pool || ranged()).filter(r => r.branchId === b.id);
    const reds = list.filter(isRed);
    const done = reds.filter(handled);
    const solved = reds.filter(r => r.status === 'cozuldu');
    const open = reds.filter(r => !handled(r));
    const overdue = open.filter(r => now - new Date(r.date) >= 86400000);
    const waitH = open.length ? Math.max(...open.map(r => (now - new Date(r.date)) / 3600000)) : 0;
    const medH = median(done.filter(r => r.firstActionAt || r.actionAt)
      .map(r => (new Date(r.firstActionAt || r.actionAt) - new Date(r.date)) / 3600000));
    const cover = reds.length ? done.length / reds.length : null;
    const solveRate = reds.length ? solved.length / reds.length : null;
    // Hız notu: 1 saat ve altı tam puan, 24 saatte sıfır (logaritmik, tek bir uç değer tabloyu bozmasın diye medyan)
    const speed = medH === null ? 0 : Math.max(0, 1 - Math.log10(Math.max(1, medH)) / Math.log10(24));
    // Açıkta bekleyen yorum puan düşürür; 24 saati aşan daha çok düşürür
    const penalty = Math.min(25, overdue.length * 8 + (open.length - overdue.length) * 2);
    const score = reds.length
      ? Math.max(0, Math.round(cover * KARNE_W.cover + speed * KARNE_W.speed + solveRate * KARNE_W.solve - penalty))
      : null;
    return { b, n: list.length, avg: avg(list), red: reds.length, done: done.length, solved: solved.length,
             open: open.length, overdue: overdue.length, waitH, medH, cover, solveRate, score };
  }

  // Tablodaki her satırın "neden zayıf" cümlesi. Sayı değil, cümle: patron bunu okuyup müdürü arayabilsin.
  function karneReason(k, chainMed) {
    if (k.cover === 0) return k.red === 1
      ? `Tek olumsuz yoruma dokunulmadı, ${fmtDur(k.waitH)} bekliyor.`
      : `${k.red} olumsuz yorumun hiçbirine dokunulmadı, en eskisi ${fmtDur(k.waitH)} bekliyor.`;
    if (k.overdue) return `${iyelik(k.overdue)} 24 saati aştı, en eskisi ${fmtDur(k.waitH)} bekliyor.`;
    if (k.medH !== null && chainMed && k.medH > chainMed * 2.5) return `Ortalama ${fmtDur(k.medH)} sonra dönüyor, zincir ortalaması ${fmtDur(chainMed)}.`;
    if (k.cover !== null && k.cover < 0.6) return `${k.red} olumsuz yorumdan ${k.done} tanesine dokunuldu, ${k.red - k.done} tanesi açıkta.`;
    if (k.solveRate !== null && k.solveRate < 0.3) return `Müşteriye ulaşılıyor ama ${k.red} sorunun yalnızca ${k.solved} tanesi çözüldü.`;
    return `${k.open} yorum müdahale bekliyor.`;
  }

  const KARNE_COLS = [
    ['mgr',    'Müdür',         k => k.b.manager,        'asc',  true],
    ['red',    'Olumsuz',       k => k.red,              'desc'],
    ['cover',  'Müdahale',      k => k.cover ?? -1,      'desc'],
    ['med',    'İlk müdahale',  k => k.medH ?? 1e9,      'asc'],
    ['solved', 'Çözülen',       k => k.solved,           'desc'],
    ['open',   'Bekleyen',      k => k.open,             'desc'],
    ['score',  'Karne',         k => k.score ?? -1,      'desc'],
  ];

  function renderKarne(v) {
    const pool = ranged();
    const rows = state.branches.map(b => karneRow(b, pool)).filter(k => k.n);
    const scored = rows.filter(k => k.score !== null);
    const chainMed = median(rows.map(k => k.medH).filter(x => x !== null));
    const zero = scored.filter(k => k.cover === 0);
    const weak = scored.filter(k => k.score < 55);
    const openTotal = rows.reduce((a, k) => a + k.open, 0);
    const solvedTotal = rows.reduce((a, k) => a + k.solved, 0);
    const timed = scored.filter(k => k.medH !== null).sort((a, b) => a.medH - b.medH);
    const fastest = timed[0], slowest = timed[timed.length - 1];

    const lateMgr = scored.filter(k => k.overdue);
    const mood = zero.length ? 'bad' : (weak.length || lateMgr.length) ? 'warn' : 'good';
    const headline = zero.length
      ? `${rows.length} müdürün ${iyelik(zero.length)} kendine gelen olumsuz yorumların hiçbirine dokunmadı.`
      : weak.length
        ? `${rows.length} müdürün ${iyelik(weak.length)} olumsuz yorumları geç kapatıyor.`
        : lateMgr.length
          ? `${lateMgr.length === 1 ? 'Bir şubede' : `${lateMgr.length} şubede`} olumsuz yorum 24 saatten uzun süredir müdahale bekliyor.`
          : 'Tüm müdürler olumsuz yorumlara zamanında dönüyor.';
    const sub = fastest && slowest && slowest.medH > fastest.medH
      ? `En hızlı müdür ortalama ${fmtDur(fastest.medH)} içinde müşteriye dönüyor (${esc(fastest.b.manager)}, ${esc(fastest.b.name)}), en yavaşı ${fmtDur(slowest.medH)} (${esc(slowest.b.manager)}, ${esc(slowest.b.name)}). Aynı marka, aynı menü, aynı yorum. Fark müdürde.`
      : 'Müdahale süreleri şubeler arasında yakın seyrediyor.';

    // Dikkat listesi: zayıf karne ya da 24 saati aşmış bekleyen
    const attnAll = scored.filter(k => k.score < 55 || k.overdue).sort((a, b) => a.score - b.score);
    const attn = attnAll.slice(0, 4);
    // Örnek gösterilecekler: tek bir olumsuz yorumu olan şube "100 aldı" diye örnek olamaz, hacim şartı var
    const top = scored.filter(k => k.score >= 80 && k.red >= 3).sort((a, b) => b.score - a.score).slice(0, 3);

    // sıralama
    const col = KARNE_COLS.find(c => c[0] === state.karne.key) || KARNE_COLS[6];
    const sgn = state.karne.dir === 'asc' ? 1 : -1;
    const sorted = rows.slice().sort((a, b) => {
      // olumsuz yorum gelmemiş şubeler her zaman altta: karnesi yok, sıralamayı bozmasın
      if ((a.score === null) !== (b.score === null)) return a.score === null ? 1 : -1;
      return col[4] ? sgn * String(col[2](a)).localeCompare(String(col[2](b)), 'tr') : sgn * (col[2](a) - col[2](b));
    });

    const arrow = state.karne.dir === 'asc' ? '↑' : '↓';
    const pctBar = (p, cls) => `<span class="mini"><i><b class="${cls}" style="width:${Math.round(p * 100)}%"></b></i><span class="num">%${Math.round(p * 100)}</span></span>`;

    if (!rows.length) {
      v.innerHTML = pageHead('Müdür karnesi', rangeTitle()) +
        emptyBox(`${cap(rangeIn())} hiçbir şubeye yorum gelmedi, karne hesaplanamıyor.`);
      return;
    }

    // Pano sayıları
    const overdueTotal = rows.reduce((a, k) => a + k.overdue, 0);
    const meanScore = scored.length ? Math.round(scored.reduce((a, k) => a + k.score, 0) / scored.length) : null;
    const dist = { good: scored.filter(k => k.score >= 80).length, warn: scored.filter(k => k.score >= 55 && k.score < 80).length, bad: scored.filter(k => k.score < 55).length, none: rows.length - scored.length };
    const dp = n => rows.length ? Math.round(n / rows.length * 100) : 0;
    const slow = timed.slice(-8).reverse();   // en yavaş 8 müdür, yavaştan hızlıya
    const maxH = Math.max(1, ...slow.map(k => k.medH));
    const dateLine = state.range === 'today' ? cap(trDate(new Date()))
      : `${rangeTitle()} · ${new Date(rangeStart()).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} – ${new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}`;
    const karneRowHtml = (k, reason) => `
      <button class="brow karne-row ${band(k.score)}" data-branch="${k.b.id}">
        <div class="brow-top"><span class="brow-branch">${esc(k.b.manager)}<span class="brow-city">, ${esc(k.b.name)}, ${esc(k.b.city)}</span></span>
          <span class="brow-right"><span class="grade ${band(k.score)}">${k.score}</span></span></div>
        <div class="karne-reason">${reason}</div>
        <div class="brow-meta"><span>${k.red} olumsuz</span><span>${k.medH !== null ? 'ilk müdahale ' + fmtDur(k.medH) : 'hiç müdahale yok'}</span><span>${k.solved} çözüldü</span></div>
      </button>`;

    v.innerHTML = `
      <div class="dash">
        ${pageHead('Müdür karnesi', `${dateLine} · ${rows.length} müdür · ölçülen şey yorum değil, müdahale`)}

        <div class="alertbar ${mood}">${icon(mood === 'good' ? 'check' : 'alert')}<span>${headline}</span></div>

        <div class="stat-grid">
          <div class="stat"><div class="stat-l">İlk müdahale süresi</div><div class="stat-v">${chainMed !== null ? fmtDur(chainMed) : '–'}</div><div class="stat-s">zincir ortancası, olumsuz yorumlar</div></div>
          <div class="stat"><div class="stat-l">Dokunulmamış olumsuz</div><div class="stat-v ${openTotal ? 'v-bad' : 'v-good'}">${openTotal}</div><div class="stat-s">${overdueTotal ? `<span class="stat-trend down">${overdueTotal} tanesi 24 saati aştı</span>` : openTotal ? 'hepsi 24 saat içinde' : 'açıkta yorum yok'}</div></div>
          <div class="stat"><div class="stat-l">Geri kazanılan müşteri</div><div class="stat-v v-good">${solvedTotal}</div><div class="stat-s">"çözüldü" işaretlenen</div></div>
          <div class="stat"><div class="stat-l">Takip gereken müdür</div><div class="stat-v ${attnAll.length ? 'v-bad' : 'v-good'}">${attnAll.length}<span class="stat-of">/ ${rows.length}</span></div><div class="stat-s">karnesi 55 altı ya da 24 saati aşan</div></div>
          <div class="stat"><div class="stat-l">Örnek müdür</div><div class="stat-v ${top.length ? 'v-good' : ''}">${top.length}</div><div class="stat-s">karnesi 80+, en az 3 olumsuz</div></div>
          <div class="stat"><div class="stat-l">Ortalama karne</div><div class="stat-v ${meanScore === null ? '' : pctCls(meanScore)}">${meanScore === null ? '–' : meanScore}</div><div class="stat-s">100 üzerinden, ${scored.length} müdür</div></div>
        </div>

        <div class="dash-cols">
          <div class="dash-main">
            ${attn.length ? `<div class="panel"><div class="panel-head"><h3>Konuşulması gerekenler</h3><span class="muted">${attnAll.length > attn.length ? `${attnAll.length} müdürden ilk ${attn.length}, ` : ''}en düşük karne üstte</span></div>
              <div class="brief-list compact">${attn.map(k => karneRowHtml(k, karneReason(k, chainMed))).join('')}</div></div>` : ''}
            ${slow.length > 1 ? `<div class="panel"><div class="panel-head"><h3>İlk müdahale süresi, en yavaş müdürler</h3><span class="muted">zincir ortancası ${chainMed !== null ? fmtDur(chainMed) : '–'}</span></div>
              <div class="hbars">${slow.map(k => `<button class="hbar" data-branch="${k.b.id}"><span class="hbar-l"><b>${esc(k.b.manager)}</b><span class="muted">${esc(k.b.name)}</span></span><span class="hbar-t"><i class="${chainMed && k.medH > chainMed * 2.5 ? 'bad' : ''}" style="width:${Math.round(k.medH / maxH * 100)}%"></i></span><span class="hbar-v">${fmtDur(k.medH)}</span></button>`).join('')}</div>
              <p class="chart-note">${sub}</p></div>` : ''}
          </div>
          <aside class="dash-side">
            <div class="panel"><div class="panel-head"><h3>Karne dağılımı</h3><span class="muted">${rows.length} müdür</span></div>
              <div class="sent"><div class="sent-bar"><i class="pos" style="width:${dp(dist.good)}%"></i><i class="neu" style="width:${dp(dist.warn)}%"></i><i class="neg" style="width:${dp(dist.bad)}%"></i></div>
              <div class="sent-leg"><span><i class="lg pos"></i>İyi (80+) <b>${dist.good}</b></span><span><i class="lg neu"></i>Takip (55–79) <b>${dist.warn}</b></span><span><i class="lg neg"></i>Zayıf <b>${dist.bad}</b></span>${dist.none ? `<span><i class="lg ok"></i>Olumsuz yorum yok <b>${dist.none}</b></span>` : ''}</div></div></div>
            ${top.length ? `<div class="panel"><div class="panel-head"><h3>Örnek gösterilecekler</h3><span class="muted">karnesi 80 ve üstü</span></div>
              <div class="brief-list compact">${top.map(k => karneRowHtml(k, `${k.red} olumsuz yorumun ${k.done} tanesine dokundu, ortalama ${k.medH !== null ? fmtDur(k.medH) : '–'} içinde. ${k.solved} müşteri geri kazanıldı.`)).join('')}</div></div>` : ''}
            <div class="panel"><div class="panel-head"><h3>Karne nasıl hesaplanır</h3><span class="muted">100 üzerinden</span></div>
              <div class="calc">
                <div><span>Olumsuz yorumların kaçına dokunuldu</span><i><b style="width:${KARNE_W.cover}%"></b></i><em>${KARNE_W.cover}</em></div>
                <div><span>İlk müdahale hızı (1 sa tam, 24 sa sıfır)</span><i><b style="width:${KARNE_W.speed}%"></b></i><em>${KARNE_W.speed}</em></div>
                <div><span>Kaçı çözüme bağlandı</span><i><b style="width:${KARNE_W.solve}%"></b></i><em>${KARNE_W.solve}</em></div>
              </div>
              <p class="karne-note">Açıkta bekleyen yorum −2, 24 saati aşan −8 (en fazla −25). Şubenin yıldız ortalaması karneye girmez: müdür yorumu değil, müdahaleyi yönetir.</p></div>
          </aside>
        </div>

        <div class="panel karne-table">
          <div class="panel-head"><h3>Tüm müdürler</h3><span class="muted">${rows.length} şube, başlığa tıklayarak sırala</span></div>
          <div style="overflow:auto;margin:0 -16px -16px">
          <table class="tbl karne-tbl"><thead><tr>
            ${KARNE_COLS.map(c => `<th class="s ${c[4] ? '' : 'num'} ${state.karne.key === c[0] ? 'on' : ''}" data-k="${c[0]}">${c[1]}${state.karne.key === c[0] ? `<span class="dir">${arrow}</span>` : ''}</th>`).join('')}
          </tr></thead><tbody>
          ${sorted.map(k => `<tr data-branch="${k.b.id}" style="cursor:pointer">
            <td><b>${esc(k.b.manager)}</b><div class="muted" style="font-size:12px">${esc(k.b.name)}, ${esc(k.b.city)}</div></td>
            <td class="num">${k.red}</td>
            <td class="num">${k.cover === null ? '<span class="muted">–</span>' : pctBar(k.cover, band(k.score))}</td>
            <td class="num ${k.medH !== null && chainMed && k.medH > chainMed * 2.5 ? 'v-bad' : ''}">${k.medH !== null ? fmtDur(k.medH) : '<span class="muted">–</span>'}</td>
            <td class="num">${k.red ? k.solved : '<span class="muted">–</span>'}</td>
            <td class="num ${k.overdue ? 'v-bad' : ''}">${k.open || '<span class="muted">0</span>'}${k.overdue ? `<span class="od" title="24 saati aşan">${k.overdue} geç</span>` : ''}</td>
            <td class="num"><span class="grade ${band(k.score)}" title="${bandLabel(k.score)}">${k.score === null ? '–' : k.score}</span></td>
          </tr>`).join('')}
          </tbody></table>
          </div>
        </div>
      </div>`;

    v.querySelectorAll('[data-branch]').forEach(t => t.onclick = () => {
      const b = branch(t.dataset.branch); state.city = b.city; state.viewBranch = b.id; state.page = 'branch';
      state.filter = { platform: 'all', red: false, status: 'all' }; render();
    });
    v.querySelectorAll('th.s').forEach(th => th.onclick = () => {
      const k = th.dataset.k;
      if (state.karne.key === k) state.karne.dir = state.karne.dir === 'asc' ? 'desc' : 'asc';
      else state.karne = { key: k, dir: KARNE_COLS.find(c => c[0] === k)[3] };
      render();
    });
  }

  function revRow(r, showBranch) {
    const b = branch(r.branchId);
    const cls = isRed(r) ? 'neg' : r.rating === 3 ? 'neu' : 'pos';
    const showB = showBranch || state.role === 'admin' && !['branch'].includes(state.page);
    return `<button class="rev ${cls}" data-id="${r.id}">
      ${platBox(r.platform)}
      <div><div class="head"><b>${esc(r.author)}</b>${stars(r.rating)}<span class="meta">${PLAT[r.platform].name}</span><time class="meta" title="${fmtDate(r.date)}">${ago(r.date)}</time>${showB ? `<span class="branch-tag">${esc(b.city)}, ${esc(b.name)}</span>` : ''}</div>
      <div class="text">${esc(r.text)}</div>
      ${r.note ? `<div class="note">${icon('pencil')}<span>${esc(r.note)}</span></div>` : ''}</div>
      <div class="side">${tick(r)}<span class="badge ${isRed(r) || r.status !== 'bekliyor' ? r.status : 'none'}">${isRed(r) || r.status !== 'bekliyor' ? STATUS[r.status].short : 'Müdahale gerekmiyor'}</span></div>
    </button>`;
  }
  function bindRows(v) { v.querySelectorAll('.rev[data-id]').forEach(b => b.onclick = () => openDrawer(b.dataset.id)); }

  // ---------- DRAWER ----------
  function openDrawer(id) {
    const r = state.reviews.find(x => x.id === id); const b = branch(r.branchId);
    const canEdit = state.role === 'manager';
    const d = $('#drawer'); d.hidden = false;
    $('#drawer-body').innerHTML = `
      <button class="close" id="drawer-close" aria-label="Kapat">${icon('x')}</button>
      <div class="muted" style="font-size:12px">${esc(b.city)}, ${esc(b.name)}</div>
      <h2>${esc(r.author)} ${stars(r.rating)}</h2>
      <div class="drawer-src">${platMini(r.platform)}<span class="muted">${fmtDate(r.date)} (${ago(r.date)})</span>
        <a class="link open-plat" href="#" title="Demo: gerçek üründe yorumun platformdaki sayfası açılır">${PLAT[r.platform].loc} aç ${icon('arrow')}</a></div>
      <div class="block"><div class="quote">“${esc(r.text)}”</div></div>
      ${canEdit ? `<div class="block"><h3>Müdahale durumu</h3>
        <div class="status-row">
          ${['ulasiliyor', 'baglanti', 'cozuldu'].map(s => `<button class="btn-status s-${s} ${r.status === s ? 'on' : ''}" data-s="${s}">${STATUS[s].short}<small>${STATUS[s].label}</small></button>`).join('')}
        </div>
        <div style="margin-top:12px"><label class="muted" style="font-size:12px" for="note">Ne yapıldı? (yönetim görür)</label>
        <textarea id="note" placeholder="Örn: Müşteri arandı, özür dilendi, yeniden gönderim yapıldı.">${esc(r.note || '')}</textarea></div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px">
          ${r.status !== 'bekliyor' ? '<button class="btn btn-ghost btn-sm" id="clear-status">Bekliyor durumuna al</button>' : ''}
          <button class="btn btn-solid" id="save-status" ${r.status === 'bekliyor' ? 'disabled' : ''}>Kaydet</button></div>
      </div>` : `<div class="block"><h3>Müdahale durumu</h3>
        <div class="ro-status"><span class="badge ${r.status}">${STATUS[r.status].short}</span><span class="muted">${STATUS[r.status].label}</span></div>
        ${r.note ? `<div class="ro-note">${icon('pencil')}<span>${esc(r.note)}</span></div>` : `<div class="muted" style="font-size:13px;margin-top:8px">Şube müdürü henüz not girmedi.</div>`}
        <div class="muted" style="font-size:12px;margin-top:10px">Durumu yalnızca şube müdürü değiştirir.</div>
      </div>`}
      <div class="block"><h3>Zaman çizelgesi</h3><div class="timeline">
        <div class="t on"><i></i><div>Yorum ${PLAT[r.platform].name} üzerinden geldi<small>${fmtDate(r.date)}</small></div></div>
        <div class="t on"><i></i><div>Bildirim ${esc(b.manager)} adlı müdüre gitti<small>${fmtDate(new Date(new Date(r.date).getTime() + 4000))}</small></div></div>
        <div class="t ${r.status !== 'bekliyor' ? 'on' : ''}"><i></i><div>${r.status !== 'bekliyor' ? STATUS[r.status].label : 'Müdahale bekleniyor'}<small>${r.actionAt ? fmtDate(r.actionAt) : '—'}</small></div></div>
      </div></div>
      <div class="block"><h3>Şube</h3><div class="kv"><div><span>Müdür</span>${esc(b.manager)}</div><div><span>Telefon</span>${esc(b.phone)}</div><div><span>Şube ortalaması (${rangeTitle().toLocaleLowerCase('tr')})</span>${fmtAvg(avg(ranged().filter(x => x.branchId === b.id)))} / 5</div><div><span>Kanal</span>${['google', 'tripadvisor'].includes(r.platform) ? 'Restoran içi' : 'Paket servis'}</div>${r.real ? `<div><span>Kaynak</span>${PLAT[r.platform].name} üzerinde yayımlanmış gerçek yorum</div>` : ''}${r.products ? `<div><span>Sipariş</span>${esc(r.products)}</div>` : ''}</div></div>`;
    let chosen = r.status;
    if (canEdit) {
      const save = $('#save-status');
      d.querySelectorAll('.btn-status').forEach(btn => btn.onclick = () => { chosen = btn.dataset.s; d.querySelectorAll('.btn-status').forEach(x => x.classList.toggle('on', x.dataset.s === chosen)); save.disabled = false; });
      save.onclick = () => { if (chosen === 'bekliyor') return; setStatus(r, chosen, $('#note').value.trim()); closeDrawer(); };
      const cs = $('#clear-status'); if (cs) cs.onclick = () => { setStatus(r, 'bekliyor', ''); closeDrawer(); };
      setTimeout(() => d.querySelector('.btn-status')?.focus(), 50);
    } else setTimeout(() => $('#drawer-close')?.focus(), 50);
    $('#drawer-close').onclick = closeDrawer;
    d.querySelector('.drawer-backdrop').onclick = closeDrawer;
    d.querySelector('.open-plat').onclick = e => e.preventDefault();   // demo: sahte bağlantı, sayfa zıplamasın
  }
  function closeDrawer() { $('#drawer').hidden = true; }
  function setStatus(r, s, note) {
    r.status = s; r.note = note || (s === 'bekliyor' ? '' : r.note); r.actionAt = s === 'bekliyor' ? null : new Date().toISOString();
    if (s === 'bekliyor') r.firstActionAt = null; else if (!r.firstActionAt) r.firstActionAt = r.actionAt;
    persist(); render();
    if (s !== 'bekliyor') notify(`<b>${esc(branch(r.branchId).name)}</b>, ${esc(r.author)} yorumu güncellendi:\n${STATUS[s].label}${note ? '\n“' + esc(note) + '”' : ''}`, 'Yönetim paneli');
  }

  // ---------- BİLDİRİM ----------
  // Panel içi bildirim kartı (sağ alt): müdür durum kaydedince yönetime düşer.
  // WhatsApp kanalı ve "yeni yorum simülasyonu" bu sürümde yok (kullanıcı kararı, 16 Eyl).
  function notify(msg, to) {
    const t = el(`<div class="wa"><button class="wa-close" aria-label="Kapat">${icon('x')}</button><div class="wa-head"><span class="wa-logo">${icon('zap')}</span>Bildirim · Yorum Takip Merkezi</div><div class="wa-msg">${msg}</div><div class="wa-time">${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div><div class="wa-to">Alıcı: ${esc(to)}</div></div>`);
    $('#wa-stack').appendChild(t);
    const dismiss = () => { t.style.transition = '.4s'; t.style.opacity = '0'; t.style.transform = 'translateY(10px)'; setTimeout(() => t.remove(), 400); };
    t.querySelector('.wa-close').onclick = dismiss;
    setTimeout(dismiss, 45000);
  }

  // ---------- LOGIN ----------
  let loginRole = 'admin';
  function fillBranchSelect() {
    $('#branch-select').innerHTML = state.branches.slice().sort((a, b) => a.city.localeCompare(b.city, 'tr') || a.name.localeCompare(b.name, 'tr')).map(b => `<option value="${b.id}" ${b.id === 'ist-nisantasi' ? 'selected' : ''}>${esc(b.city)} — ${esc(b.name)}</option>`).join('');
  }
  function setLoginRole(r) {
    loginRole = r;
    document.querySelectorAll('.role-card').forEach(x => x.classList.toggle('on', x.dataset.role === r));
    $('#branch-pick').hidden = r !== 'manager';
    // Hesap adı rolle ve şubeyle değişir: her şubenin kendi girişi olduğu görülsün
    $('#login-email').value = r === 'admin' ? 'yonetim@sushico.demo' : `${$('#branch-select').value}@sushico.demo`;
  }
  function initLogin() {
    const sel = $('#branch-select');
    fillBranchSelect();
    document.querySelectorAll('.role-card').forEach(c => c.onclick = () => setLoginRole(c.dataset.role));
    sel.onchange = () => setLoginRole(loginRole);
    $('#login-form').onsubmit = e => { e.preventDefault(); enter(loginRole, loginRole === 'manager' ? sel.value : null); };
    setLoginRole('admin');
    // Giriş öncesi ekranda şirket verisi yok; yalnız platform logoları
    $('#hero-plats').innerHTML = Object.keys(PLAT).map(p => `<div class="plat ${p}" title="${PLAT[p].name}">${logoImg(p)}${PLAT[p].short}</div>`).join('');
  }
  function enter(role, bid) {
    state.role = role; state.branchId = bid; state.page = role === 'admin' ? 'overview' : 'branch'; state.city = null; state.viewBranch = null; state.branchView = 'cards'; state.mapCity = null; state.filter = { platform: 'all', red: false, status: 'all' };
    hist = []; lastKey = null; lastSnap = null;   // yeni oturum, geri yığını boş
    $('#login').hidden = true; $('#app').hidden = false; render();
  }
  $('#logout').onclick = () => { $('#app').hidden = true; $('#login').hidden = false; setLoginRole('admin'); };
  $('#brand-home').onclick = goHome;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });


  // ---------- TEMA ----------
  const THEME_KEY = 'yorum-merkezi-theme';
  function applyTheme(t) { if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; const b = $('#theme-toggle'); if (b) { const dark = (t || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark'; b.innerHTML = icon(dark ? 'sun' : 'moon') + `<span>${dark ? 'Açık tema' : 'Koyu tema'}</span>`; } }
  (function initTheme() { let t = null; try { t = localStorage.getItem(THEME_KEY); } catch (e) {} applyTheme(t || 'dark'); })();
  $('#theme-toggle').onclick = () => { const cur = document.documentElement.dataset.theme || 'dark'; const next = cur === 'dark' ? 'light' : 'dark'; try { localStorage.setItem(THEME_KEY, next); } catch (e) {} applyTheme(next); };

  // Seçilen dönem oturumlar arasında hatırlanır
  (function initRange() {
    let r = null; try { r = localStorage.getItem(RANGE_KEY); } catch (e) {}
    if (RANGES.some(x => x[0] === r)) state.range = r;
  })();

  load(); initLogin();

  // URL kısayolları: #admin | #admin/city=İstanbul | #admin/branch=ist-nisantasi | #admin/pending | #manager=ist-nisantasi
  // Sonuna eklenebilenler: /today /7 /30 (dönem), /light, /sel=<il>, /open=<id>, /openfirst, /reset
  (function hashEnter() {
    const h = decodeURIComponent(location.hash.slice(1)); if (!h) return;
    const extra = h.split('/').slice(2);
    const rg = extra.find(x => RANGES.some(r => r[0] === x)); if (rg) state.range = rg;
    if (extra.includes('light')) applyTheme('light');
    // #admin//reset → girilen müdahale durumlarını sil, demoyu başa al (sunum öncesi; ekranda düğmesi yok)
    if (extra.includes('reset')) { try { localStorage.removeItem(LS_KEY); } catch (e) {} load(); }
    const sel = extra.find(x => x.startsWith('sel='));   // haritada il seçili açılsın (enter() sıfırladığı için ondan sonra uygulanır)

    if (h.startsWith('manager=')) {
      enter('manager', h.split('/')[0].split('=')[1]);
    } else if (h.startsWith('admin')) {
      enter('admin', null);
      if (sel) state.mapCity = sel.slice(4);
      const sub = h.split('/')[1] || '';
      if (sub.startsWith('city=')) { state.city = sub.slice(5); state.page = 'city'; }
      else if (sub.startsWith('branch=')) { state.viewBranch = sub.slice(7); state.city = branch(state.viewBranch)?.city; state.page = 'branch'; }
      else if (sub && ['branches', 'pending', 'ranking', 'karne', 'overview'].includes(sub)) state.page = sub;
      render();
    }
    const op = extra.find(x => x.startsWith('open=')); if (op) setTimeout(() => openDrawer(op.slice(5)), 400);
    const first = extra.find(x => x === 'openfirst'); if (first) setTimeout(() => { const r = scopeReviews().find(x => isRed(x) && !handled(x)); if (r) openDrawer(r.id); }, 400);
  })();
})();
