(function () {
  'use strict';

  var input = document.getElementById('inputText');
  var output = document.getElementById('outputText');
  var mode = document.getElementById('mode');
  var inputCount = document.getElementById('inputCount');
  var outputCount = document.getElementById('outputCount');
  var duplicateCount = document.getElementById('duplicateCount');
  var charCount = document.getElementById('charCount');
  var message = document.getElementById('message');
  if (!input || !output) return;

  var sample = '1. 苹果, 香蕉, 橙子\n2. 苹果\n3. 草莓、香蕉\n4. 火龙果';

  function notify(text, type) {
    message.textContent = text || '';
    message.className = 'long-tool-message' + (type ? ' ' + type : '');
  }

  function splitText(text, force) {
    var value = String(text || '').replace(/\r\n?/g, '\n').trim();
    if (!value) return [];
    if (force) return value.split(/[\n\s、，,;；|]+/).map(function (item) {
      return item.trim();
    }).filter(Boolean);

    var lines = value.split('\n').map(function (item) { return item.trim(); }).filter(Boolean);
    if (lines.length > 1) {
      var hasPunctuation = lines.some(function (line) { return /[、，,;；|]/.test(line); });
      if (hasPunctuation) {
        return lines.reduce(function (all, line) {
          return all.concat(line.split(/[、，,;；|]+/));
        }, []).map(function (item) { return item.trim(); }).filter(Boolean);
      }
      return lines;
    }
    if (/[、，,;；|]/.test(value)) {
      return value.split(/[、，,;；|]+/).map(function (item) {
        return item.trim();
      }).filter(Boolean);
    }
    return [value];
  }

  function dedupe(items) {
    var seen = Object.create(null);
    var unique = [];
    items.forEach(function (item) {
      var key = item.trim();
      if (!key || seen[key]) return;
      seen[key] = true;
      unique.push(key);
    });
    return unique;
  }

  function removeLeadingNumber(line) {
    return line.replace(/^\s*(?:(?:\d+|[a-zA-Z]+)(?:\)\s*|[、。．:]\s*|\.\s+)|[一二三四五六七八九十百千万]+[、。．:]\s*)(.*)$/, '$1').trim();
  }

  function processText() {
    var text = input.value;
    var rawItems;
    var result;
    if (mode.value === 'number') {
      rawItems = text.replace(/\r\n?/g, '\n').split('\n').filter(function (line) {
        return line.trim();
      });
      result = rawItems.map(removeLeadingNumber);
    } else {
      rawItems = splitText(text, mode.value === 'universal');
      result = dedupe(rawItems.map(removeLeadingNumber));
    }
    output.value = result.join('\n');
    inputCount.textContent = String(rawItems.length);
    outputCount.textContent = String(result.length);
    duplicateCount.textContent = String(Math.max(0, rawItems.length - result.length));
    charCount.textContent = String(output.value.length);
    notify(result.length ? '处理完成，结果仅保留在当前浏览器页面中。' : '请输入需要处理的文本。', result.length ? 'success' : 'error');
  }

  function copyText(text) {
    if (!text) {
      notify('没有可复制的结果。', 'error');
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        notify('结果已复制。', 'success');
      }).catch(function () { fallbackCopy(text); });
      return;
    }
    fallbackCopy(text);
  }

  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand('copy');
      notify('结果已复制。', 'success');
    } catch (error) {
      notify('复制失败，请手动选择结果。', 'error');
    }
    area.remove();
  }

  document.getElementById('processBtn').addEventListener('click', processText);
  document.getElementById('sampleBtn').addEventListener('click', function () {
    input.value = sample;
    mode.value = 'smart';
    processText();
  });
  document.getElementById('copyBtn').addEventListener('click', function () {
    copyText(output.value);
  });
  document.getElementById('downloadBtn').addEventListener('click', function () {
    if (!output.value) {
      notify('没有可下载的结果。', 'error');
      return;
    }
    var blob = new Blob([output.value + '\n'], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'text-cleaned.txt';
    link.click();
    URL.revokeObjectURL(url);
    notify('TXT 文件已开始下载。', 'success');
  });
  document.getElementById('swapBtn').addEventListener('click', function () {
    input.value = output.value;
    notify('结果已回填到输入框。', 'success');
  });
  document.getElementById('clearBtn').addEventListener('click', function () {
    input.value = '';
    output.value = '';
    inputCount.textContent = '0';
    outputCount.textContent = '0';
    duplicateCount.textContent = '0';
    charCount.textContent = '0';
    notify('已清空。');
  });
  input.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') processText();
  });
})();
