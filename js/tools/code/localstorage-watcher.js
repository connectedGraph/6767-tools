(function () {
  'use strict';

  var bookmarklet = document.getElementById('bookmarklet');
  var sourceCode = document.getElementById('sourceCode');
  var message = document.getElementById('message');
  if (!bookmarklet || !sourceCode) return;

  function notify(text, type) {
    message.textContent = text || '';
    message.className = 'long-tool-message' + (type ? ' ' + type : '');
  }

  function watcher() {
    (function () {
      var stateKey = '__6767_localstorage_watcher__';
      if (window[stateKey] && window[stateKey].restore) {
        window[stateKey].restore();
        return;
      }

      var events = [];
      var original = {
        setItem: Storage.prototype.setItem,
        removeItem: Storage.prototype.removeItem,
        clear: Storage.prototype.clear
      };
      var panel = document.createElement('div');
      var list = document.createElement('div');
      var count = document.createElement('span');
      var status = document.createElement('span');
      var maxEvents = 300;

      panel.style.cssText = 'position:fixed;z-index:2147483647;right:18px;bottom:18px;width:min(560px,calc(100vw - 36px));height:min(440px,calc(100vh - 36px));display:flex;flex-direction:column;background:#0d1117;color:#e6edf3;border:1px solid #30363d;border-radius:10px;box-shadow:0 18px 50px rgba(0,0,0,.45);font:12px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;';

      function button(label) {
        var item = document.createElement('button');
        item.type = 'button';
        item.textContent = label;
        item.style.cssText = 'border:1px solid #30363d;border-radius:5px;padding:5px 8px;color:#c9d1d9;background:#161b22;cursor:pointer;font:inherit;';
        return item;
      }

      function short(value) {
        if (value === null || typeof value === 'undefined') return '∅';
        var text = String(value);
        return text.length > 120 ? text.slice(0, 120) + '…' : text;
      }

      function render() {
        count.textContent = events.length + ' events';
        list.textContent = '';
        if (!events.length) {
          var empty = document.createElement('div');
          empty.textContent = 'No storage changes detected yet.';
          empty.style.cssText = 'padding:28px 16px;color:#8b949e;text-align:center;';
          list.appendChild(empty);
          return;
        }
        events.forEach(function (event) {
          var row = document.createElement('div');
          row.style.cssText = 'padding:8px 12px;border-bottom:1px solid #21262d;';
          var headline = document.createElement('div');
          headline.textContent = event.action + (event.key ? '  ' + event.key : '') + '  @ ' + event.time;
          headline.style.color = event.action === 'SET' ? '#3fb950' : event.action === 'REMOVE' ? '#f85149' : '#d29922';
          var detail = document.createElement('div');
          detail.textContent = event.action === 'SET' ? short(event.prev) + '  →  ' + short(event.next) : event.action === 'REMOVE' ? 'was: ' + short(event.prev) : 'removed keys: ' + event.keys;
          detail.style.color = '#8b949e';
          row.appendChild(headline);
          row.appendChild(detail);
          list.appendChild(row);
        });
      }

      function record(action, key, prev, next, keys) {
        events.unshift({
          action: action,
          key: key || '',
          prev: prev,
          next: next,
          keys: keys || 0,
          time: new Date().toTimeString().slice(0, 8)
        });
        if (events.length > maxEvents) events.pop();
        render();
      }

      function onStorage(event) {
        record(event.storageArea === localStorage ? 'CROSSTAB' : 'CROSSTAB', event.key, event.oldValue, event.newValue);
      }

      Storage.prototype.setItem = function (key, value) {
        var previous = this.getItem(key);
        original.setItem.apply(this, arguments);
        record('SET', key, previous, value);
      };
      Storage.prototype.removeItem = function (key) {
        var previous = this.getItem(key);
        original.removeItem.apply(this, arguments);
        record('REMOVE', key, previous, null);
      };
      Storage.prototype.clear = function () {
        var keys = this.length;
        original.clear.apply(this, arguments);
        record('CLEAR', '', null, null, keys);
      };
      window.addEventListener('storage', onStorage);

      var header = document.createElement('div');
      header.style.cssText = 'display:flex;align-items:center;gap:8px;padding:9px 12px;border-bottom:1px solid #30363d;cursor:grab;';
      var title = document.createElement('strong');
      title.textContent = 'localStorage WATCHER';
      title.style.flex = '1';
      count.style.color = '#8b949e';
      var copy = button('Copy log');
      var clear = button('Clear');
      var close = button('Close');
      copy.onclick = function () {
        navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(events, null, 2));
      };
      clear.onclick = function () {
        events.length = 0;
        render();
      };
      close.onclick = function () {
        window[stateKey].restore();
      };
      header.appendChild(title);
      header.appendChild(count);
      header.appendChild(copy);
      header.appendChild(clear);
      header.appendChild(close);
      list.style.cssText = 'flex:1;min-height:0;overflow:auto;';
      status.textContent = 'Watching current page';
      status.style.cssText = 'padding:7px 12px;color:#8b949e;border-top:1px solid #30363d;';
      panel.appendChild(header);
      panel.appendChild(list);
      panel.appendChild(status);
      document.body.appendChild(panel);

      var dragging = false;
      var offsetX = 0;
      var offsetY = 0;
      header.addEventListener('mousedown', function (event) {
        dragging = true;
        var rect = panel.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
      });
      document.addEventListener('mousemove', function (event) {
        if (!dragging) return;
        panel.style.left = (event.clientX - offsetX) + 'px';
        panel.style.top = (event.clientY - offsetY) + 'px';
      });
      document.addEventListener('mouseup', function () { dragging = false; });

      window[stateKey] = {
        restore: function () {
          Storage.prototype.setItem = original.setItem;
          Storage.prototype.removeItem = original.removeItem;
          Storage.prototype.clear = original.clear;
          window.removeEventListener('storage', onStorage);
          panel.remove();
          delete window[stateKey];
        }
      };
      render();
    }());
  }

  function build() {
    var source = '(' + watcher.toString() + ')();';
    sourceCode.value = source;
    bookmarklet.value = 'javascript:' + encodeURIComponent(source);
    notify('Bookmarklet 已生成。', 'success');
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        notify('已复制到剪贴板。', 'success');
      }).catch(function () { notify('复制失败，请手动选择文本。', 'error'); });
      return;
    }
    bookmarklet.select();
    notify('请按 Ctrl+C 复制。');
  }

  document.getElementById('copyBookmarkletBtn').addEventListener('click', function () {
    copy(bookmarklet.value);
  });
  document.getElementById('refreshBtn').addEventListener('click', build);
  build();
})();
