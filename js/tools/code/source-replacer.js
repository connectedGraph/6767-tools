(function () {
  'use strict';

  var sourceText = document.getElementById('sourceText');
  var ruleText = document.getElementById('ruleText');
  var ruleMode = document.getElementById('ruleMode');
  var resultText = document.getElementById('resultText');
  var fileInput = document.getElementById('fileInput');
  var fileName = document.getElementById('fileName');
  var message = document.getElementById('message');
  var ruleCount = document.getElementById('ruleCount');
  var replaceCount = document.getElementById('replaceCount');
  var charCount = document.getElementById('charCount');
  if (!sourceText || !ruleText) return;

  function notify(text, type) {
    message.textContent = text || '';
    message.className = 'long-tool-message' + (type ? ' ' + type : '');
  }

  function parseLineRules(text) {
    return text.split(/\r?\n/).map(function (line) {
      return line.trim();
    }).filter(Boolean).map(function (line) {
      var match = line.match(/^(.+?)\s*(?:→|=>|->|：|:|=|，|,)\s*(.+)$/);
      if (!match) match = line.match(/^(\S+)\s+(.+)$/);
      return match ? { key: match[1].trim(), value: match[2].trim() } : null;
    }).filter(function (item) {
      return item && item.key;
    });
  }

  function parseRules() {
    if (ruleMode.value === 'line') return parseLineRules(ruleText.value);
    var parsed = JSON.parse(ruleText.value);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
      throw new Error('JSON 规则必须是对象。');
    }
    return Object.keys(parsed).map(function (key) {
      return { key: key, value: String(parsed[key]) };
    });
  }

  function formatRuleJson() {
    if (ruleMode.value !== 'json') {
      ruleMode.value = 'json';
      ruleText.placeholder = '{"old": "new"}';
    }
    try {
      ruleText.value = JSON.stringify(JSON.parse(ruleText.value), null, 2);
      notify('JSON 规则已格式化。', 'success');
    } catch (error) {
      notify('JSON 规则格式错误：' + error.message, 'error');
    }
  }

  function replaceAll(text, search, replacement) {
    return text.split(search).join(replacement);
  }

  function applyRules() {
    if (!sourceText.value) {
      notify('请输入原文本或源码。', 'error');
      return;
    }
    var rules;
    try {
      rules = parseRules();
    } catch (error) {
      notify('规则解析失败：' + error.message, 'error');
      return;
    }
    if (!rules.length) {
      notify('没有找到有效规则。', 'error');
      return;
    }

    var result = sourceText.value;
    var count = 0;
    rules.forEach(function (rule) {
      if (!rule.key) return;
      var pieces = result.split(rule.key);
      count += pieces.length - 1;
      result = pieces.join(rule.value);
    });
    resultText.value = result;
    ruleCount.textContent = String(rules.length);
    replaceCount.textContent = String(count);
    charCount.textContent = String(result.length);
    notify('替换完成。', 'success');
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

  function copyResult() {
    if (!resultText.value) {
      notify('没有可复制的结果。', 'error');
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(resultText.value).then(function () {
        notify('结果已复制。', 'success');
      }).catch(function () { fallbackCopy(resultText.value); });
    } else {
      fallbackCopy(resultText.value);
    }
  }

  document.getElementById('loadFileBtn').addEventListener('click', function () {
    fileInput.click();
  });
  fileInput.addEventListener('change', function () {
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      sourceText.value = String(reader.result || '');
      fileName.textContent = file.name;
      notify('文件已载入。', 'success');
    };
    reader.onerror = function () {
      notify('文件读取失败。', 'error');
    };
    reader.readAsText(file, 'utf-8');
  });
  ruleMode.addEventListener('change', function () {
    ruleText.placeholder = ruleMode.value === 'json' ? '{"old": "new"}' : 'old → new';
  });
  document.getElementById('formatRuleBtn').addEventListener('click', formatRuleJson);
  document.getElementById('applyBtn').addEventListener('click', applyRules);
  document.getElementById('copyBtn').addEventListener('click', copyResult);
  document.getElementById('downloadBtn').addEventListener('click', function () {
    if (!resultText.value) {
      notify('没有可下载的结果。', 'error');
      return;
    }
    var blob = new Blob([resultText.value], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'replaced-source.txt';
    link.click();
    URL.revokeObjectURL(url);
    notify('结果文件已开始下载。', 'success');
  });
  document.getElementById('clearBtn').addEventListener('click', function () {
    sourceText.value = '';
    ruleText.value = '';
    resultText.value = '';
    fileInput.value = '';
    fileName.textContent = '未加载文件';
    ruleCount.textContent = '0';
    replaceCount.textContent = '0';
    charCount.textContent = '0';
    notify('已清空。');
  });
})();
