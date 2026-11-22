/* Monster Money — a Halloween budget tracker.
   Vanilla JS, no dependencies. Data lives in localStorage only.
   Spec: .kiro/specs/monster-money/ */
(function () {
  'use strict';

  var STORE_KEY = 'monster-money-v1';

  var CATEGORIES = [
    { id: 'rent',      name: 'Rent Goblin',     emoji: '\u{1F3E0}', color: '#a78bfa' },
    { id: 'food',      name: 'Food Fiend',      emoji: '\u{1F354}', color: '#fb923c' },
    { id: 'transport', name: 'Transport Troll', emoji: '\u{1F697}', color: '#38bdf8' },
    { id: 'bills',     name: 'Bills Banshee',   emoji: '\u{1F4A1}', color: '#facc15' },
    { id: 'fun',       name: 'Fun Phantom',     emoji: '\u{1F3AE}', color: '#f472b6' },
    { id: 'shopping',  name: 'Shopping Specter',emoji: '\u{1F6CD}\uFE0F', color: '#4ade80' },
    { id: 'health',    name: 'Health Haunt',    emoji: '\u{1F48A}', color: '#f87171' },
    { id: 'other',     name: 'Other Ooze',      emoji: '\u{1F47B}', color: '#94a3b8' }
  ];

  var DEFAULT_BUDGETS = {
    rent: 800, food: 300, transport: 120, bills: 150,
    fun: 80, shopping: 100, health: 60, other: 50
  };

  var DEMO_RATE = { USD: 1, IDR: 15000, EUR: 0.92, GBP: 0.79 };

  function defaultState() {
    return {
      income: 2500,
      currency: 'USD',
      budgets: Object.assign({}, DEFAULT_BUDGETS),
      expenses: []
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultState();
      var s = JSON.parse(raw);
      if (!s || typeof s !== 'object' || !Array.isArray(s.expenses)) return defaultState();
      s.budgets = Object.assign({}, DEFAULT_BUDGETS, s.budgets || {});
      if (typeof s.income !== 'number' || !(s.income >= 0)) s.income = 2500;
      if (['USD', 'IDR', 'EUR', 'GBP'].indexOf(s.currency) === -1) s.currency = 'USD';
      return s;
    } catch (e) {
      return defaultState();
    }
  }

  var state = load();

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage full/blocked: app still works in-memory */ }
  }

  /* ---------- helpers ---------- */

  function $(id) { return document.getElementById(id); }

  function fmt(n) {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency', currency: state.currency,
        maximumFractionDigits: state.currency === 'IDR' ? 0 : 2
      }).format(n);
    } catch (e) { return state.currency + ' ' + n.toFixed(2); }
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function dateStr(offsetDays) {
    var d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function monthOf(dateStr) { return dateStr.slice(0, 7); }

  function currentMonth() { return todayStr().slice(0, 7); }

  function daysInMonth() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }

  function monthExpenses() {
    var m = currentMonth();
    return state.expenses.filter(function (e) { return monthOf(e.date) === m; });
  }

  function spentByCat(list) {
    var out = {};
    CATEGORIES.forEach(function (c) { out[c.id] = 0; });
    list.forEach(function (e) {
      if (out[e.cat] === undefined) out[e.cat] = 0;
      out[e.cat] += e.amount;
    });
    return out;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function newId() {
    return Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
  }

  /* ---------- renderers ---------- */

  function renderHeader() {
    var now = new Date();
    var label = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    $('monthLabel').textContent = label;
    var left = daysInMonth() - now.getDate();
    $('daysLeft').textContent = left === 0
      ? 'Last day of the month — final stand!'
      : left + (left === 1 ? ' day left' : ' days left') + ' in the month';
  }

  function renderStats() {
    var list = monthExpenses();
    var spent = list.reduce(function (a, e) { return a + e.amount; }, 0);
    var totalBudget = CATEGORIES.reduce(function (a, c) { return a + (state.budgets[c.id] || 0); }, 0);
    var left = state.income - spent;
    var elapsed = Math.max(1, new Date().getDate());
    var projected = (spent / elapsed) * daysInMonth();

    $('statIncome').textContent = fmt(state.income);
    $('statSpent').textContent = fmt(spent);
    var leftEl = $('statLeft');
    leftEl.textContent = fmt(left);
    leftEl.className = left < 0 ? 'bad' : 'good';
    var projEl = $('statProjected');
    projEl.textContent = fmt(projected);
    projEl.className = projected > state.income ? 'bad' : '';

    var warn = $('projectionWarning');
    if (list.length > 0 && projected > state.income) {
      warn.hidden = false;
      warn.textContent = '⚠️ At this pace you will spend ' + fmt(projected) +
        ' by month-end — that is ' + fmt(projected - state.income) +
        ' more than your income. A monster is getting fat. Feed it less.';
    } else {
      warn.hidden = true;
    }
  }

  function healthStatus(health) {
    if (health <= 0) return { key: 'slain', label: 'SLAIN', cls: 'status-slain', bar: 'health-red', note: 'This monster ate its whole budget.' };
    if (health < 0.25) return { key: 'critical', label: 'CRITICAL', cls: 'status-critical', bar: 'health-red', note: 'Almost devoured — feed it carefully!' };
    if (health < 0.5) return { key: 'wounded', label: 'WOUNDED', cls: 'status-wounded', bar: 'health-amber', note: 'Half its health is gone.' };
    return { key: 'healthy', label: 'HEALTHY', cls: 'status-healthy', bar: 'health-green', note: 'Doing fine. Keep it that way.' };
  }

  function renderMonsters() {
    var spent = spentByCat(monthExpenses());
    var grid = $('monsterGrid');
    grid.innerHTML = '';
    CATEGORIES.forEach(function (c) {
      var budget = state.budgets[c.id] || 0;
      var s = spent[c.id] || 0;
      var remaining = budget - s;
      var health = budget > 0 ? remaining / budget : 0;
      var st = healthStatus(health);

      var card = el('article', 'monster' + (st.key === 'slain' ? ' slain' : ''));
      var head = el('div', 'monster-head');
      head.appendChild(el('span', 'monster-emoji', c.emoji));
      head.appendChild(el('span', 'monster-name', c.name));
      head.appendChild(el('span', 'monster-status ' + st.cls, st.label));
      card.appendChild(head);

      var nums = el('div', 'monster-numbers');
      var spentSpan = el('span', null, 'Spent ');
      spentSpan.appendChild(el('b', null, fmt(s)));
      var remSpan = el('span', null, 'Left ');
      remSpan.appendChild(el('b', null, fmt(remaining)));
      nums.appendChild(spentSpan);
      nums.appendChild(remSpan);
      card.appendChild(nums);

      var bar = el('div', 'healthbar');
      var fill = el('div', st.bar);
      fill.style.width = Math.max(0, Math.min(100, health * 100)) + '%';
      bar.appendChild(fill);
      card.appendChild(bar);

      var note = el('p', 'monster-note' + (remaining < 0 ? ' over' : ''));
      note.textContent = remaining < 0
        ? 'Over budget by ' + fmt(-remaining) + '! The monster broke loose. 👹'
        : st.note + ' Budget ' + fmt(budget) + '.';
      card.appendChild(note);
      grid.appendChild(card);
    });
  }

  function fitCanvas(canvas, w, h) {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = '100%';
    canvas.style.maxWidth = w + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return ctx;
  }

  function renderDonut() {
    var spent = spentByCat(monthExpenses());
    var total = CATEGORIES.reduce(function (a, c) { return a + (spent[c.id] || 0); }, 0);
    var canvas = $('donutChart');
    var legend = $('donutLegend');
    legend.innerHTML = '';
    $('donutEmpty').hidden = total > 0;
    canvas.style.display = total > 0 ? '' : 'none';
    legend.style.display = total > 0 ? '' : 'none';
    if (total <= 0) return;

    var ctx = fitCanvas(canvas, 320, 320);
    var cx = 160, cy = 160, r = 120, inner = 72;
    var start = -Math.PI / 2;
    CATEGORIES.forEach(function (c) {
      var v = spent[c.id] || 0;
      if (v <= 0) return;
      var angle = (v / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.closePath();
      ctx.fillStyle = c.color;
      ctx.fill();
      start += angle;

      var item = el('span', null);
      var dot = el('span', 'dot');
      dot.style.background = c.color;
      item.appendChild(dot);
      item.appendChild(document.createTextNode(c.name + ' ' + Math.round((v / total) * 100) + '%'));
      legend.appendChild(item);
    });
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = '#1d1038';
    ctx.fill();
    ctx.fillStyle = '#f3efff';
    ctx.font = 'bold 20px Rubik, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(fmt(total), cx, cy - 10);
    ctx.fillStyle = '#b9a8d9';
    ctx.font = '13px Rubik, system-ui, sans-serif';
    ctx.fillText('spent', cx, cy + 14);
  }

  function renderBars() {
    var days = [];
    for (var i = 13; i >= 0; i--) days.push(dateStr(-i));
    var perDay = {};
    days.forEach(function (d) { perDay[d] = 0; });
    state.expenses.forEach(function (e) {
      if (perDay[e.date] !== undefined) perDay[e.date] += e.amount;
    });
    var vals = days.map(function (d) { return perDay[d]; });
    var max = Math.max.apply(null, vals.concat([1]));
    var total14 = vals.reduce(function (a, b) { return a + b; }, 0);
    var canvas = $('barChart');
    $('barEmpty').hidden = total14 > 0;
    canvas.style.display = total14 > 0 ? '' : 'none';
    if (total14 <= 0) return;

    var W = 520, H = 260, padL = 8, padB = 28, padT = 12;
    var ctx = fitCanvas(canvas, W, H);
    var bw = (W - padL * 2) / 14;
    days.forEach(function (d, i) {
      var v = vals[i];
      var bh = (v / max) * (H - padB - padT);
      var x = padL + i * bw + 4;
      var y = H - padB - bh;
      ctx.fillStyle = v > 0 ? '#ff7a1a' : '#3b2560';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, bw - 8, Math.max(bh, 2), 4);
      else ctx.rect(x, y, bw - 8, Math.max(bh, 2));
      ctx.fill();
      ctx.fillStyle = '#b9a8d9';
      ctx.font = '10px Rubik, system-ui, sans-serif';
      ctx.textAlign = 'center';
      var dd = new Date(d + 'T12:00:00');
      ctx.fillText(dd.getDate(), x + (bw - 8) / 2, H - 10);
    });
  }

  function renderAchievements() {
    var all = state.expenses;
    var monthList = monthExpenses();
    var income = state.income;
    var dailyAllowance = income / daysInMonth();

    function daySpend(d) {
      return all.filter(function (e) { return e.date === d; })
        .reduce(function (a, e) { return a + e.amount; }, 0);
    }

    var ghostBuster = false;
    if (monthList.length > 0) {
      var okDays = 0, hadSpend = false;
      for (var i = 1; i <= 3; i++) {
        var s = daySpend(dateStr(-i));
        if (s > 0) hadSpend = true;
        if (s <= dailyAllowance) okDays++;
      }
      ghostBuster = hadSpend && okDays === 3;
    }

    var pennyPumpkin = false;
    if (monthList.length > 0) {
      for (var j = 1; j <= 7; j++) {
        if (daySpend(dateStr(-j)) === 0) { pennyPumpkin = true; break; }
      }
    }

    var spent = spentByCat(monthList);
    var budgetKeeper = monthList.length > 0 && CATEGORIES.every(function (c) {
      return (spent[c.id] || 0) <= (state.budgets[c.id] || 0);
    });

    var defs = [
      { emoji: '\u{1F9DB}', name: 'First Bite', desc: 'Log your first expense.', earned: all.length >= 1 },
      { emoji: '\u{1F383}', name: 'Monster Tamer', desc: 'Log 10 expenses.', earned: all.length >= 10 },
      { emoji: '\u{1F47B}', name: 'Ghost Buster', desc: '3 straight days at or under your daily allowance.', earned: ghostBuster },
      { emoji: '\u{1F383}', name: 'Penny Pumpkin', desc: 'A full day with zero spending in the last week.', earned: pennyPumpkin },
      { emoji: '\u{1F6E1}\uFE0F', name: 'Budget Keeper', desc: 'Every monster still alive this month.', earned: budgetKeeper }
    ];
    // fix duplicate emoji: Penny Pumpkin should be a pumpkin
    defs[3].emoji = '\u{1F389}';

    var wrap = $('achievements');
    wrap.innerHTML = '';
    defs.forEach(function (a) {
      var card = el('div', 'achievement' + (a.earned ? ' earned' : ''));
      card.appendChild(el('span', 'ach-emoji', a.emoji));
      card.appendChild(el('b', null, (a.earned ? '✓ ' : '○ ') + a.name));
      card.appendChild(el('p', null, a.desc));
      wrap.appendChild(card);
    });
  }

  function renderList() {
    var list = state.expenses.slice().sort(function (a, b) {
      return b.date.localeCompare(a.date);
    }).slice(0, 20);
    var ul = $('expenseList');
    ul.innerHTML = '';
    $('expenseEmpty').hidden = state.expenses.length > 0;
    list.forEach(function (e) {
      var cat = CATEGORIES.find(function (c) { return c.id === e.cat; }) || CATEGORIES[7];
      var li = el('li', null);
      li.appendChild(el('span', 'exp-emoji', cat.emoji));
      li.appendChild(el('span', 'exp-note', e.note || cat.name));
      li.appendChild(el('span', 'exp-date', e.date));
      li.appendChild(el('span', 'exp-amount', fmt(e.amount)));
      var del = el('button', 'exp-delete', '✕');
      del.type = 'button';
      var delLabel = 'Delete expense: ' + (e.note || cat.name) + ', ' + fmt(e.amount) + ', ' + e.date;
      del.setAttribute('aria-label', delLabel);
      del.setAttribute('data-id', e.id);
      li.appendChild(del);
      ul.appendChild(li);
    });
  }

  function renderSettings() {
    $('setIncome').value = state.income;
    $('setCurrency').value = state.currency;
    var wrap = $('budgetInputs');
    wrap.innerHTML = '';
    CATEGORIES.forEach(function (c) {
      var lab = el('label', null, c.emoji + ' ' + c.name + ' budget');
      var inp = document.createElement('input');
      inp.type = 'number';
      inp.min = '0';
      inp.step = '1';
      inp.inputMode = 'decimal';
      inp.value = state.budgets[c.id] || 0;
      inp.setAttribute('data-cat', c.id);
      lab.appendChild(inp);
      wrap.appendChild(lab);
    });
  }

  function renderCategoryOptions() {
    var sel = $('expCategory');
    sel.innerHTML = '';
    CATEGORIES.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.emoji + ' ' + c.name;
      sel.appendChild(opt);
    });
  }

  function render() {
    renderHeader();
    renderStats();
    renderMonsters();
    renderDonut();
    renderBars();
    renderAchievements();
    renderList();
  }

  /* ---------- actions ---------- */

  function showMsg(id, text) {
    var n = $(id);
    n.textContent = text;
    n.hidden = false;
    setTimeout(function () { n.hidden = true; }, 5000);
  }

  function addExpense(amount, cat, note, date) {
    state.expenses.push({ id: newId(), amount: amount, cat: cat, note: note, date: date });
    save();
    render();
  }

  function summonDemo() {
    var rate = DEMO_RATE[state.currency] || 1;
    function amt(usd) {
      var v = usd * rate;
      return state.currency === 'IDR' ? Math.round(v / 1000) * 1000 : Math.round(v * 100) / 100;
    }
    var demo = [
      [-12, 'rent', 800, 'Monthly rent'], [-11, 'food', 64, 'Weekly groceries'],
      [-10, 'transport', 18, 'Bus pass top-up'], [-9, 'food', 22, 'Lunch with friends'],
      [-8, 'fun', 15, 'Movie night'], [-7, 'bills', 85, 'Electricity bill'],
      [-6, 'food', 41, 'Groceries'], [-5, 'shopping', 35, 'New hoodie'],
      [-4, 'transport', 12, 'Ride share'], [-3, 'food', 18, 'Takeaway tacos'],
      [-2, 'health', 24, 'Pharmacy'], [-1, 'food', 29, 'Groceries'],
      [-1, 'fun', 9, 'Arcade tokens'], [0, 'food', 14, 'Coffee & pastry'],
      [0, 'transport', 8, 'Bus fare']
    ];
    demo.forEach(function (d) {
      state.expenses.push({
        id: newId(), amount: amt(d[2]), cat: d[1], note: d[3], date: dateStr(d[0])
      });
    });
    save();
    render();
    showMsg('dataMsg', 'Demo data summoned! 15 sample expenses appeared. Reset the month to clear them.');
  }

  function exportData() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'monster-money-backup.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    showMsg('dataMsg', 'Backup downloaded. Keep it somewhere safe.');
  }

  function importData(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var s = JSON.parse(reader.result);
        if (!s || typeof s !== 'object' || !Array.isArray(s.expenses)) throw new Error('bad file');
        s.budgets = Object.assign({}, DEFAULT_BUDGETS, s.budgets || {});
        if (typeof s.income !== 'number') s.income = state.income;
        if (['USD', 'IDR', 'EUR', 'GBP'].indexOf(s.currency) === -1) s.currency = state.currency;
        state = s;
        save();
        renderSettings();
        render();
        showMsg('dataMsg', 'Backup imported. Welcome back, monster tamer.');
      } catch (e) {
        showMsg('dataMsg', 'That file could not be imported. Your current data was not touched.');
      }
    };
    reader.readAsText(file);
  }

  function resetMonth() {
    if (!window.confirm('Reset this month? All expenses from ' +
        new Date().toLocaleDateString('en-US', { month: 'long' }) +
        ' will be cleared. Budgets and income stay.')) return;
    var m = currentMonth();
    state.expenses = state.expenses.filter(function (e) { return monthOf(e.date) !== m; });
    save();
    render();
    showMsg('dataMsg', 'Fresh month, hungry monsters. Good luck!');
  }

  /* ---------- wire up ---------- */

  renderCategoryOptions();
  renderSettings();
  $('expDate').value = todayStr();

  $('expenseForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var err = $('formError');
    var amount = parseFloat($('expAmount').value);
    if (isNaN(amount) || amount <= 0) {
      err.hidden = false;
      err.textContent = 'Enter an amount above zero — monsters do not work for free.';
      return;
    }
    err.hidden = true;
    addExpense(
      Math.round(amount * 100) / 100,
      $('expCategory').value,
      $('expNote').value.trim(),
      $('expDate').value || todayStr()
    );
    $('expAmount').value = '';
    $('expNote').value = '';
    $('expDate').value = todayStr();
    $('expAmount').focus();
  });

  $('expenseList').addEventListener('click', function (ev) {
    var btn = ev.target.closest ? ev.target.closest('[data-id]') : null;
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    state.expenses = state.expenses.filter(function (e) { return e.id !== id; });
    save();
    render();
  });

  $('saveSettings').addEventListener('click', function () {
    var income = parseFloat($('setIncome').value);
    if (!isNaN(income) && income >= 0) state.income = Math.round(income * 100) / 100;
    state.currency = $('setCurrency').value;
    document.querySelectorAll('#budgetInputs input').forEach(function (inp) {
      var v = parseFloat(inp.value);
      if (!isNaN(v) && v >= 0) state.budgets[inp.getAttribute('data-cat')] = Math.round(v * 100) / 100;
    });
    save();
    render();
    showMsg('settingsSaved', 'Settings saved. The monsters approve. 🎃');
  });

  $('demoData').addEventListener('click', summonDemo);
  $('exportData').addEventListener('click', exportData);
  $('importData').addEventListener('click', function () { $('importFile').click(); });
  $('importFile').addEventListener('change', function (ev) {
    if (ev.target.files && ev.target.files[0]) importData(ev.target.files[0]);
    ev.target.value = '';
  });
  $('resetMonth').addEventListener('click', resetMonth);

  render();
})();
