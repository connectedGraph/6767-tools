(function () {
  'use strict';

  var fileInput = document.getElementById('fileInput');
  var dropZone = document.getElementById('dropZone');
  var fileListEl = document.getElementById('fileList');
  var mergeBtn = document.getElementById('mergeBtn');
  var downloadBtn = document.getElementById('downloadBtn');
  var clearBtn = document.getElementById('clearBtn');
  var copyBtn = document.getElementById('copyBtn');
  var resultEl = document.getElementById('result');
  var resultCount = document.getElementById('resultCount');
  var message = document.getElementById('message');
  if (!fileInput || !dropZone) return;

  var files = [];
  var merged = [];

  function notify(text, type) {
    message.textContent = text || '';
    message.className = 'long-tool-message' + (type ? ' ' + type : '');
  }

  function sizeText(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }

  function updateList() {
    fileListEl.innerHTML = '';
    if (!files.length) {
      fileListEl.innerHTML = '<div class="long-tool-file"><span>暂未选择文件</span></div>';
      mergeBtn.disabled = true;
      return;
    }
    files.forEach(function (file, index) {
      var row = document.createElement('div');
      row.className = 'long-tool-file';
      var name = document.createElement('span');
      name.textContent = (index + 1) + '. ' + file.name + ' (' + sizeText(file.size) + ')';
      var remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '删除';
      remove.addEventListener('click', function () {
        files.splice(index, 1);
        updateList();
      });
      row.appendChild(name);
      row.appendChild(remove);
      fileListEl.appendChild(row);
    });
    mergeBtn.disabled = false;
  }

  function addFiles(selected) {
    var skipped = [];
    Array.prototype.forEach.call(selected || [], function (file) {
      var isJson = file.type === 'application/json' || /\.json$/i.test(file.name);
      if (!isJson) {
        skipped.push(file.name);
        return;
      }
      if (files.some(function (existing) { return existing.name === file.name; })) {
        skipped.push(file.name);
        return;
      }
      files.push(file);
    });
    updateList();
    if (skipped.length) notify('已跳过非 JSON 或重复文件：' + skipped.join('、'), 'error');
    else if (files.length) notify('已加入 ' + files.length + ' 个文件。', 'success');
  }

  function readFile(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result || '')); };
      reader.onerror = function () { reject(new Error('读取文件失败：' + file.name)); };
      reader.readAsText(file, 'utf-8');
    });
  }

  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function extractObjects(value, output) {
    if (Array.isArray(value)) {
      value.forEach(function (item) {
        if (isPlainObject(item)) {
          output.push(item);
        } else if (Array.isArray(item) || isPlainObject(item)) {
          extractObjects(item, output);
        }
      });
      return;
    }
    if (!isPlainObject(value)) return;
    var values = Object.keys(value).map(function (key) { return value[key]; });
    var hasContainer = values.some(function (item) {
      return Array.isArray(item) || isPlainObject(item);
    });
    if (!hasContainer) {
      output.push(value);
      return;
    }
    values.forEach(function (item) {
      if (Array.isArray(item) || isPlainObject(item)) extractObjects(item, output);
    });
  }

  async function mergeFiles() {
    if (!files.length) return;
    var next = [];
    try {
      for (var i = 0; i < files.length; i += 1) {
        var parsed = JSON.parse(await readFile(files[i]));
        extractObjects(parsed, next);
      }
      merged = next;
      resultEl.value = JSON.stringify(merged, null, 2);
      resultCount.textContent = merged.length + ' 个对象';
      downloadBtn.disabled = merged.length === 0;
      notify('合并完成，共提取 ' + merged.length + ' 个对象。', 'success');
    } catch (error) {
      merged = [];
      resultEl.value = '';
      resultCount.textContent = '0 个对象';
      downloadBtn.disabled = true;
      notify('合并失败：' + error.message, 'error');
    }
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
    if (!resultEl.value) {
      notify('没有可复制的结果。', 'error');
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(resultEl.value).then(function () {
        notify('结果已复制。', 'success');
      }).catch(function () { fallbackCopy(resultEl.value); });
    } else {
      fallbackCopy(resultEl.value);
    }
  }

  function downloadResult() {
    if (!resultEl.value) return;
    var blob = new Blob([resultEl.value + '\n'], { type: 'application/json;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'merged.json';
    link.click();
    URL.revokeObjectURL(url);
    notify('merged.json 已开始下载。', 'success');
  }

  fileInput.addEventListener('change', function () {
    addFiles(fileInput.files);
    fileInput.value = '';
  });
  dropZone.addEventListener('click', function () { fileInput.click(); });
  dropZone.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') fileInput.click();
  });
  ['dragenter', 'dragover'].forEach(function (eventName) {
    dropZone.addEventListener(eventName, function (event) {
      event.preventDefault();
      dropZone.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(function (eventName) {
    dropZone.addEventListener(eventName, function (event) {
      event.preventDefault();
      dropZone.classList.remove('dragover');
    });
  });
  dropZone.addEventListener('drop', function (event) {
    addFiles(event.dataTransfer.files);
  });
  mergeBtn.addEventListener('click', mergeFiles);
  downloadBtn.addEventListener('click', downloadResult);
  copyBtn.addEventListener('click', copyResult);
  clearBtn.addEventListener('click', function () {
    files = [];
    merged = [];
    resultEl.value = '';
    resultCount.textContent = '0 个对象';
    downloadBtn.disabled = true;
    updateList();
    notify('已清空。');
  });
})();
