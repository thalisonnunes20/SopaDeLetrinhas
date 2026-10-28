/*
 * Gerador do caça-palavras: sorteia palavras, posiciona na grade e
 * completa os espaços vazios com letras aleatórias.
 * Não depende de nada externo e não faz nenhuma requisição de rede.
 */
(function (global) {
  'use strict';

  // Direções como [linha, coluna]
  var DIR_RIGHT = [0, 1];
  var DIR_DOWN = [1, 0];
  var DIR_DIAG_DOWN = [1, 1];
  var DIR_DIAG_UP = [-1, 1];
  var DIR_LEFT = [0, -1];
  var DIR_UP = [-1, 0];
  var DIR_DIAG_DOWN_BACK = [-1, -1];
  var DIR_DIAG_UP_BACK = [1, -1];

  // Dificuldade: tamanho da grade, quantidade de palavras e tamanho preferido delas
  var LEVELS = {
    facil: { nome: 'Fácil', size: 8, count: 6, minLen: 3 },
    medio: { nome: 'Médio', size: 10, count: 8, minLen: 4 },
    dificil: { nome: 'Difícil', size: 12, count: 10, minLen: 5 },
    experiente: { nome: 'Experiente', size: 15, count: 14, minLen: 7 }
  };

  // Modo: em que direções as palavras podem ser escritas
  var MODES = {
    // esquerda para a direita e de cima para baixo
    classico: {
      nome: 'Clássico',
      dirs: [DIR_RIGHT, DIR_DOWN]
    },
    // todas as 8 direções: diagonais e de trás para frente
    maluco: {
      nome: 'Maluco',
      dirs: [DIR_RIGHT, DIR_DOWN, DIR_DIAG_DOWN, DIR_DIAG_UP,
             DIR_LEFT, DIR_UP, DIR_DIAG_DOWN_BACK, DIR_DIAG_UP_BACK]
    }
  };

  // Mais vogais e letras comuns do português, para a grade parecer natural
  var FILLER = 'AAAAAAEEEEEIIIIOOOOOSSSSRRRNNNTTMMCCLLDDPPUUVVGBFHQZJXKYW';

  function randInt(max) {
    var buf = new Uint32Array(1);
    global.crypto.getRandomValues(buf);
    return buf[0] % max;
  }

  function shuffle(list) {
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = randInt(i + 1);
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function normalize(text) {
    return String(text)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z]/g, '')
      .toUpperCase();
  }

  function reverse(text) {
    return text.split('').reverse().join('');
  }

  // Evita sortear palavras que contêm outras (ex.: SOL dentro de ...SOL...),
  // o que geraria achados ambíguos na grade.
  function conflicts(a, b) {
    return a.indexOf(b) !== -1 || b.indexOf(a) !== -1 ||
           a.indexOf(reverse(b)) !== -1 || b.indexOf(reverse(a)) !== -1;
  }

  function conflictsWithAny(candidate, chosen) {
    for (var j = 0; j < chosen.length; j++) {
      if (conflicts(candidate.text, chosen[j].text)) return true;
    }
    return false;
  }

  // Sorteia palavras dando preferência às que têm o tamanho mínimo do nível.
  // Se o tema não tiver palavras longas suficientes, completa com as mais curtas.
  function pickWords(pool, count, minLen) {
    var chosen = [];
    var preferred = shuffle(pool.filter(function (e) { return e.text.length >= minLen; }));
    var others = shuffle(pool.filter(function (e) { return e.text.length < minLen; }));
    var ordered = preferred.concat(others);
    for (var i = 0; i < ordered.length && chosen.length < count; i++) {
      if (!conflictsWithAny(ordered[i], chosen)) chosen.push(ordered[i]);
    }
    return chosen;
  }

  function tryPlace(words, size, dirs) {
    var grid = [];
    for (var r = 0; r < size; r++) {
      grid.push(new Array(size).fill(''));
    }

    var ordered = words.slice().sort(function (a, b) {
      return b.text.length - a.text.length;
    });
    var placed = [];

    for (var w = 0; w < ordered.length; w++) {
      var word = ordered[w];
      var cells = null;

      for (var attempt = 0; attempt < 400 && !cells; attempt++) {
        var dir = dirs[randInt(dirs.length)];
        var row = randInt(size);
        var col = randInt(size);
        var candidate = [];
        var fits = true;

        for (var k = 0; k < word.text.length; k++) {
          var rr = row + dir[0] * k;
          var cc = col + dir[1] * k;
          if (rr < 0 || cc < 0 || rr >= size || cc >= size) { fits = false; break; }
          var current = grid[rr][cc];
          if (current !== '' && current !== word.text[k]) { fits = false; break; }
          candidate.push([rr, cc]);
        }
        if (fits) cells = candidate;
      }

      if (!cells) return null;

      for (var i = 0; i < cells.length; i++) {
        grid[cells[i][0]][cells[i][1]] = word.text[i];
      }
      placed.push({
        display: word.display,
        text: word.text,
        hint: word.hint,
        cells: cells,
        found: null
      });
    }

    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        if (grid[y][x] === '') grid[y][x] = FILLER.charAt(randInt(FILLER.length));
      }
    }

    // Ordem alfabética na lista, para o jogador achar rápido
    placed.sort(function (a, b) {
      return a.text.localeCompare(b.text, 'pt');
    });

    return { size: size, grid: grid, words: placed };
  }

  /**
   * entries: lista de [palavra, dica]
   * level: um item de LEVELS
   * mode: um item de MODES
   */
  function generate(entries, level, mode) {
    var seen = {};
    var pool = [];
    entries.forEach(function (entry) {
      var text = normalize(entry[0]);
      if (text.length < 3 || text.length > level.size || seen[text]) return;
      seen[text] = true;
      pool.push({ display: entry[0], hint: entry[1], text: text });
    });

    for (var attempt = 0; attempt < 80; attempt++) {
      var picked = pickWords(pool, level.count, level.minLen);
      if (picked.length < level.count) continue;
      var result = tryPlace(picked, level.size, mode.dirs);
      if (result) return result;
    }
    throw new Error('Não foi possível gerar o quebra-cabeça.');
  }

  global.Puzzle = {
    LEVELS: LEVELS,
    MODES: MODES,
    generate: generate,
    normalize: normalize,
    randInt: randInt
  };
})(window);
