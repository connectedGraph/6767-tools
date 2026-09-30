(function (global) {
  'use strict';

  var catalogPromise = null;

  function loadCatalog() {
    if (!catalogPromise) {
      catalogPromise = fetch('/api/tools', {
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      }).then(function (response) {
        if (!response.ok) throw new Error('工具目录请求失败: HTTP ' + response.status);
        return response.json();
      }).then(function (payload) {
        if (!payload || payload.code !== 1 || !payload.data || !Array.isArray(payload.data.categories)) {
          throw new Error('工具目录响应格式无效');
        }
        return payload.data;
      });
    }
    return catalogPromise;
  }

  global.ToolsApi = {
    loadCatalog: loadCatalog
  };
})(window);
