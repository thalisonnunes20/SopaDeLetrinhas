(function () {
  'use strict';

  var STORAGE_KEY = 'cacapalavras:v1';
  var MARK_COUNT = 6;
  var SURPRISE = 'surpresa';

  var boardEl = document.getElementById('board');
  var listEl = document.getElementById('word-list');
  var progressEl = document.getElementById('progress');
  var themeEl = document.getElementById('theme');
  var levelEl = document.getElementById('level');
  var modeEl = document.getElementById('mode');
  var newBtn = document.getElementById('new-game');
  var winEl = document.getElementById('win');
  var winNewBtn = document.getElementById('win-new');
  var winCloseBtn = document.getElementById('win-close');

  var state = null;     // { theme, level, mode, size, grid, words }
  var cellEls = [];     // cellEls[linha][coluna]
  var wordEls = [];     // um <li> por palavra
  var drag = null;
  var anchor = null;    // primeira letra tocada (modo toque-toque)

  /* ---------- Temas ---------- */

  function fillThemeOptions() {
    Object.keys(window.THEMES).forEach(function (id) {
      var opt = document.createElement('option');
      opt.value = id;
      opt.textContent = window.THEMES[id].nome;
      themeEl.appendChild(opt);
    });
    var surprise = document.createElement('option');
    surprise.value = SURPRISE;
    surprise.textContent = 'Surpresa (mistura)';
    themeEl.appendChild(surprise);
  }

  function entriesFor(themeId) {
    if (themeId === SURPRISE) {
      var all = [];
      Object.keys(window.THEMES).forEach(function (id) {
        all = all.concat(window.THEMES[id].palavras);
      });
      return all;
    }
    return window.THEMES[themeId].palavras;
  }

  /* ---------- Estado e armazenamento local ---------- */

  function newGame(themeId, levelId, modeId) {
    var level = window.Puzzle.LEVELS[levelId];
    var mode = window.Puzzle.MODES[modeId];
    var puzzle = window.Puzzle.generate(entriesFor(themeId), level, mode);
    state = {
      theme: themeId,
      level: levelId,
      mode: modeId,
      size: puzzle.size,
      grid: puzzle.grid,
      words: puzzle.words
    };
    anchor = null;
    save();
    render();
  }

  function startFromControls() {
    newGame(themeEl.value, levelEl.value, modeEl.value);
  }

  function save() {
    try {
      var data = {
        v: 2,
        theme: state.theme,
        level: state.level,
        mode: state.mode,
        grid: state.grid.map(function (row) { return row.join(''); }),
        words: state.words
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* armazenamento indisponível: o jogo segue normalmente */ }
  }

  function spells(grid, cells, text) {
    if (!Array.isArray(cells) || cells.length !== text.length) return false;
    for (var i = 0; i < cells.length; i++) {
      var c = cells[i];
      if (!Array.isArray(c) || c.length !== 2) return false;
      if (!Number.isInteger(c[0]) || !Number.isInteger(c[1])) return false;
      if (!grid[c[0]] || grid[c[0]][c[1]] !== text.charAt(i)) return false;
    }
    return true;
  }

  // Os dados salvos podem ter sido alterados ou corrompidos, então tudo é validado.
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || (data.v !== 1 && data.v !== 2)) return null;
      var modeId = data.v === 2 ? data.mode : 'classico';
      if (!window.Puzzle.MODES[modeId]) return null;
      if (!window.Puzzle.LEVELS[data.level]) return null;
      if (data.theme !== SURPRISE && !window.THEMES[data.theme]) return null;

      var size = window.Puzzle.LEVELS[data.level].size;
      if (!Array.isArray(data.grid) || data.grid.length !== size) return null;
      var grid = [];
      for (var r = 0; r < size; r++) {
        var row = data.grid[r];
        if (typeof row !== 'string' || !/^[A-Z]+$/.test(row) || row.length !== size) return null;
        grid.push(row.split(''));
      }

      if (!Array.isArray(data.words) || data.words.length !== window.Puzzle.LEVELS[data.level].count) return null;
      var words = [];
      for (var i = 0; i < data.words.length; i++) {
        var w = data.words[i];
        if (!w || typeof w.display !== 'string' || typeof w.hint !== 'string' || typeof w.text !== 'string') return null;
        if (w.display.length > 40 || w.hint.length > 120) return null;
        if (!/^[A-Z]{3,15}$/.test(w.text)) return null;
        if (!spells(grid, w.cells, w.text)) return null;
        if (w.found !== null && !spells(grid, w.found, w.text) &&
            !spells(grid, (w.found || []).slice().reverse(), w.text)) return null;
        words.push({ display: w.display, hint: w.hint, text: w.text, cells: w.cells, found: w.found });
      }

      return { theme: data.theme, level: data.level, mode: modeId, size: size, grid: grid, words: words };
    } catch (e) {
      return null;
    }
  }

  /* ---------- Renderização ---------- */

  function render() {
    themeEl.value = state.theme;
    levelEl.value = state.level;
    modeEl.value = state.mode;

    boardEl.textContent = '';
    boardEl.style.setProperty('--n', state.size);
    cellEls = [];
    for (var r = 0; r < state.size; r++) {
      var rowEls = [];
      for (var c = 0; c < state.size; c++) {
        var cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('role', 'gridcell');
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.textContent = state.grid[r][c];
        boardEl.appendChild(cell);
        rowEls.push(cell);
      }
      cellEls.push(rowEls);
    }

    listEl.textContent = '';
    wordEls = state.words.map(function (w) {
      var li = document.createElement('li');
      li.className = 'word';
      var name = document.createElement('span');
      name.className = 'word__name';
      name.textContent = w.display;
      var hint = document.createElement('span');
      hint.className = 'word__hint';
      hint.textContent = w.hint + ' · ' + w.text.length + ' letras';
      li.appendChild(name);
      li.appendChild(hint);
      listEl.appendChild(li);
      return li;
    });

    var order = 0;
    state.words.forEach(function (w, i) {
      if (w.found) {
        markWord(i, order % MARK_COUNT);
        order++;
      }
    });
    updateProgress();
  }

  function markWord(index, color) {
    var w = state.words[index];
    w.found.forEach(function (pos) {
      var el = cellEls[pos[0]][pos[1]];
      el.classList.remove('m0', 'm1', 'm2', 'm3', 'm4', 'm5');
      el.classList.add('found', 'm' + color);
    });
    wordEls[index].classList.add('done', 'm' + color);
  }

  function foundCount() {
    return state.words.filter(function (w) { return w.found; }).length;
  }

  function updateProgress() {
    progressEl.textContent = foundCount() + ' de ' + state.words.length + ' encontradas';
  }

  /* ---------- Seleção de palavras ---------- */

  function lineBetween(a, b) {
    var dr = b.r - a.r;
    var dc = b.c - a.c;
    var straight = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
    if (!straight) return [[a.r, a.c]];
    var steps = Math.max(Math.abs(dr), Math.abs(dc));
    var sr = Math.sign(dr);
    var sc = Math.sign(dc);
    var cells = [];
    for (var i = 0; i <= steps; i++) {
      cells.push([a.r + sr * i, a.c + sc * i]);
    }
    return cells;
  }

  function posOf(el) {
    return { r: Number(el.dataset.r), c: Number(el.dataset.c) };
  }

  function clearPreview() {
    var list = boardEl.querySelectorAll('.sel');
    for (var i = 0; i < list.length; i++) list[i].classList.remove('sel');
  }

  function preview(startEl, endEl) {
    clearPreview();
    lineBetween(posOf(startEl), posOf(endEl)).forEach(function (p) {
      cellEls[p[0]][p[1]].classList.add('sel');
    });
  }

  function cellFromEvent(e) {
    var el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || !el.closest) return null;
    var cell = el.closest('.cell');
    return cell && boardEl.contains(cell) ? cell : null;
  }

  function attempt(startEl, endEl) {
    var cells = lineBetween(posOf(startEl), posOf(endEl));
    if (cells.length < 2) return;
    var text = cells.map(function (p) { return state.grid[p[0]][p[1]]; }).join('');
    var backwards = text.split('').reverse().join('');

    for (var i = 0; i < state.words.length; i++) {
      var w = state.words[i];
      if (w.found) continue;
      if (w.text === text || w.text === backwards) {
        w.found = w.text === text ? cells : cells.slice().reverse();
        markWord(i, (foundCount() - 1) % MARK_COUNT);
        updateProgress();
        save();
        if (foundCount() === state.words.length) {
          setTimeout(function () { showWin(); }, 450);
        }
        return;
      }
    }
    flashMiss(cells);
  }

  function flashMiss(cells) {
    cells.forEach(function (p) {
      var el = cellEls[p[0]][p[1]];
      el.classList.remove('miss');
      void el.offsetWidth; // reinicia a animação
      el.classList.add('miss');
      setTimeout(function () { el.classList.remove('miss'); }, 400);
    });
  }

  function showWin() {
    if (typeof winEl.showModal === 'function' && !winEl.open) winEl.showModal();
  }

  /* ---------- Eventos do tabuleiro (mouse, toque e caneta) ---------- */

  boardEl.addEventListener('pointerdown', function (e) {
    var cell = cellFromEvent(e);
    if (!cell) return;
    e.preventDefault();
    try { boardEl.setPointerCapture(e.pointerId); } catch (err) { /* ignora */ }
    var startEl = anchor || cell;
    drag = { start: startEl, last: cell, moved: false, hadAnchor: !!anchor };
    preview(startEl, cell);
  });

  boardEl.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var cell = cellFromEvent(e);
    if (!cell || cell === drag.last) return;
    drag.last = cell;
    if (cell !== drag.start) drag.moved = true;
    preview(drag.start, cell);
  });

  function finishDrag() {
    if (!drag) return;
    var d = drag;
    drag = null;

    if (d.last === d.start && !d.moved) {
      if (d.hadAnchor) {
        anchor = null;
        clearPreview();
      } else {
        anchor = d.start;
        preview(anchor, anchor);
      }
      return;
    }

    anchor = null;
    attempt(d.start, d.last);
    clearPreview();
  }

  boardEl.addEventListener('pointerup', finishDrag);
  boardEl.addEventListener('pointercancel', function () {
    drag = null;
    anchor = null;
    clearPreview();
  });
  boardEl.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  /* ---------- Controles ---------- */

  newBtn.addEventListener('click', startFromControls);
  themeEl.addEventListener('change', startFromControls);
  levelEl.addEventListener('change', startFromControls);
  modeEl.addEventListener('change', startFromControls);
  winNewBtn.addEventListener('click', function () {
    winEl.close();
    startFromControls();
  });
  winCloseBtn.addEventListener('click', function () { winEl.close(); });

  /* ---------- Início ---------- */

  fillThemeOptions();
  var saved = load();
  if (saved) {
    state = saved;
    render();
  } else {
    var themeIds = Object.keys(window.THEMES);
    newGame(themeIds[window.Puzzle.randInt(themeIds.length)], 'facil', 'classico');
  }
})();
