(function () {
  // Build flattened search index when toolData is available
  var searchIndex = [];
  var searchIndexLang = null;

  function buildSearchIndex() {
    var curLang = window.__i18n ? window.__i18n.getLang() : 'zh';
    if (searchIndex.length > 0 && searchIndexLang === curLang) return;
    searchIndex = [];
    searchIndexLang = curLang;

    var data = window.toolData || [];
    var i18nTools = (window.__i18n && window.__i18n.DATA && window.__i18n.DATA.tools) || {};

    for (var i = 0; i < data.length; i++) {
      var cat = data[i];
      var parentCat = window.__i18n ? window.__i18n.getCategoryName(cat.key, curLang) : cat.desc;
      var parentCode = cat.key;
      if (cat.toolList) {
        for (var j = 0; j < cat.toolList.length; j++) {
          var t = cat.toolList[j];
          var code = t.toolCode || t.url || '';
          var toolTrans = i18nTools[code];
          var name = (toolTrans && toolTrans.name && toolTrans.name[curLang]) || t.toolName || code;
          var nameZh = (toolTrans && toolTrans.name && toolTrans.name.zh) || t.toolName || '';
          var nameEn = (toolTrans && toolTrans.name && toolTrans.name.en) || '';
          var nameTw = (toolTrans && toolTrans.name && toolTrans.name['zh-TW']) || '';
          var desc = (toolTrans && toolTrans.desc && toolTrans.desc[curLang]) || t.desc || '';

          searchIndex.push({
            name: name,
            nameZh: nameZh,
            nameEn: nameEn,
            nameTw: nameTw,
            desc: desc,
            code: code,
            icon: t.icon || '',
            parentCat: parentCat,
            parentCode: parentCode,
            subCat: null
          });
        }
      }
      if (cat.children) {
        for (var k = 0; k < cat.children.length; k++) {
          var sub = cat.children[k];
          var subCat = window.__i18n ? window.__i18n.getSubcategoryName(sub.key || sub.desc, curLang) : sub.desc;
          if (sub.toolList) {
            for (var l = 0; l < sub.toolList.length; l++) {
              var st = sub.toolList[l];
              var scode = st.toolCode || st.url || '';
              var stoolTrans = i18nTools[scode];
              var sname = (stoolTrans && stoolTrans.name && stoolTrans.name[curLang]) || st.toolName || scode;
              var snameZh = (stoolTrans && stoolTrans.name && stoolTrans.name.zh) || st.toolName || '';
              var snameEn = (stoolTrans && stoolTrans.name && stoolTrans.name.en) || '';
              var snameTw = (stoolTrans && stoolTrans.name && stoolTrans.name['zh-TW']) || '';
              var sdesc = (stoolTrans && stoolTrans.desc && stoolTrans.desc[curLang]) || st.desc || '';

              searchIndex.push({
                name: sname,
                nameZh: snameZh,
                nameEn: snameEn,
                nameTw: snameTw,
                desc: sdesc,
                code: scode,
                icon: st.icon || '',
                parentCat: parentCat,
                parentCode: parentCode,
                subCat: subCat
              });
            }
          }
        }
      }
    }
  }

  window.addEventListener('langchange', function () {
    searchIndex = [];
    buildSearchIndex();
  });

  // Highlight helper
  function highlightText(text, keyword) {
    if (!keyword) return text;
    var escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('(' + escaped + ')', 'gi');
    return text.replace(regex, '<mark class="matched-text">$1</mark>');
  }

  // Initialize dropdown for an input
  function initSuggestions(input) {
    var parent = input.closest('.search-input-box');
    if (!parent) return;

    // Create dropdown container
    var dropdown = document.createElement('div');
    dropdown.className = 'search-suggestions-dropdown';
    parent.appendChild(dropdown);

    var activeIndex = -1;
    var currentSuggestions = [];

    function hideDropdown() {
      dropdown.classList.remove('show');
      activeIndex = -1;
    }

    function showDropdown() {
      if (currentSuggestions.length > 0) {
        dropdown.classList.add('show');
      } else {
        hideDropdown();
      }
    }

    function renderSuggestions() {
      dropdown.innerHTML = '';
      if (currentSuggestions.length === 0) {
        var emptyText = window.__i18n ? window.__i18n.t('searchNoResult', '未找到相关工具') : '未找到相关工具';
        dropdown.innerHTML = '<div class="suggestion-empty-row">' + emptyText + '</div>';
        return;
      }

      for (var i = 0; i < currentSuggestions.length; i++) {
        var t = currentSuggestions[i];
        var item = document.createElement('a');
        item.className = 'suggestion-item';
        if (i === activeIndex) {
          item.classList.add('active');
        }
        item.href = '/' + t.code;

        // Icon
        var iconHtml = '';
        if (t.icon) {
          iconHtml = '<img src="' + t.icon + '" alt="" />';
        } else {
          iconHtml = '<i class="my-icon my-icon-brain"></i>';
        }

        // Details
        var highlightedName = highlightText(t.name, input.value.trim());
        var metaText = t.parentCat + (t.subCat ? ' · ' + t.subCat : '');

        item.innerHTML =
          '<div class="icon-wrapper">' + iconHtml + '</div>' +
          '<div class="suggestion-details">' +
            '<div class="suggestion-name">' + highlightedName + '</div>' +
            '<div class="suggestion-meta">' + metaText + ' · ' + t.code + '</div>' +
          '</div>';

        // Mouse click helper
        (function (url) {
          item.addEventListener('mousedown', function (e) {
            e.preventDefault();
            window.location.href = url;
          });
        })(item.href);

        dropdown.appendChild(item);
      }
    }

    input.addEventListener('input', function () {
      buildSearchIndex();
      var val = input.value.trim().toLowerCase();
      if (!val) {
        currentSuggestions = [];
        hideDropdown();
        return;
      }

      // Filter matches
      var matches = [];
      for (var i = 0; i < searchIndex.length; i++) {
        var t = searchIndex[i];
        var n = (t.name || '').toLowerCase();
        var nZh = (t.nameZh || '').toLowerCase();
        var nEn = (t.nameEn || '').toLowerCase();
        var nTw = (t.nameTw || '').toLowerCase();
        var c = (t.code || '').toLowerCase();
        var d = (t.desc || '').toLowerCase();

        if (n.indexOf(val) >= 0 || nZh.indexOf(val) >= 0 || nEn.indexOf(val) >= 0 || nTw.indexOf(val) >= 0 || c.indexOf(val) >= 0 || d.indexOf(val) >= 0) {
          matches.push(t);
        }
      }

      // Sort matches (name starts with val -> code starts with val -> name contains -> code contains)
      matches.sort(function (a, b) {
        var aName = a.name.toLowerCase();
        var bName = b.name.toLowerCase();
        var aCode = a.code.toLowerCase();
        var bCode = b.code.toLowerCase();

        var aNameStart = aName.indexOf(val) === 0;
        var bNameStart = bName.indexOf(val) === 0;
        if (aNameStart && !bNameStart) return -1;
        if (!aNameStart && bNameStart) return 1;

        var aCodeStart = aCode.indexOf(val) === 0;
        var bCodeStart = bCode.indexOf(val) === 0;
        if (aCodeStart && !bCodeStart) return -1;
        if (!aCodeStart && bCodeStart) return 1;

        return aName.length - bName.length;
      });

      currentSuggestions = matches.slice(0, 8);
      activeIndex = -1;
      renderSuggestions();
      showDropdown();
    });

    input.addEventListener('keydown', function (e) {
      if (!dropdown.classList.contains('show')) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % currentSuggestions.length;
        renderSuggestions();
        // Scroll active item into view
        var activeItem = dropdown.querySelector('.suggestion-item.active');
        if (activeItem) activeItem.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
        renderSuggestions();
        var activeItem = dropdown.querySelector('.suggestion-item.active');
        if (activeItem) activeItem.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && activeIndex < currentSuggestions.length) {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = '/' + currentSuggestions[activeIndex].code;
        }
      } else if (e.key === 'Escape') {
        hideDropdown();
      }
    });

    input.addEventListener('focus', function () {
      if (input.value.trim() && currentSuggestions.length > 0) {
        showDropdown();
      }
    });

    input.addEventListener('blur', function () {
      // Small timeout to allow click event on suggestion link to fire
      setTimeout(hideDropdown, 200);
    });
  }

  function initAll() {
    var inputs = document.querySelectorAll('.search-input');
    for (var i = 0; i < inputs.length; i++) {
      initSuggestions(inputs[i]);
    }
  }

  // Navbar scroll class handler
  function handleNavbarScroll() {
    var nav = document.querySelector('.main-nav');
    if (!nav) return;
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAll();
      handleNavbarScroll();
    });
  } else {
    initAll();
    handleNavbarScroll();
  }
})();
