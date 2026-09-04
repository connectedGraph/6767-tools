/* ── app loading overlay ── */
(function initAppLoading() {
    if (document.getElementById('appLoading')) return;
    var el = document.createElement('div');
    el.id = 'appLoading';
    el.className = 'app-loading';
    el.innerHTML = '<div class="app-loading-spinner"></div>';
    (document.body || document.documentElement).appendChild(el);
    var hide = function () {
        el.classList.add('is-hidden');
        setTimeout(function () { el.remove(); }, 400);
    };
    if (document.readyState === 'complete') { hide(); return; }
    window.addEventListener('load', hide, { once: true });
    setTimeout(hide, 2000);
})();

var c = {
  extendMethod: function () {
    Array.prototype.remove = function (itemToRemove) {
      var originalLength = this.length;
      while (originalLength--) {
        if (this[originalLength] === itemToRemove) {
          this.splice(originalLength, 1);
          break;
        }
      }
    };
  },
  isNumber: function (numberValue) {
    if (this.isNullOrEmpty(numberValue) || isNaN(numberValue)) {
      return false;
    }
    return true;
  },
  isInt: function (intValue) {
    if (this.isNullOrEmpty(intValue) || isNaN(intValue) || String(intValue).indexOf(".") != -1) {
      return false;
    }
    return true;
  },
  isNullOrEmpty: function (valueToCheck) {
    if (valueToCheck == null || typeof valueToCheck == "undefined" || String(valueToCheck).trim() == "") {
      return true;
    } else {
      return false;
    }
  },
  urlParam: function (paramName, defaultValue) {
    var queryRegex = new RegExp("[&,?]" + paramName + "=([^\\&]*)", "i");
    var matchResult = queryRegex.exec(document.location.search);
    if (matchResult != null) {
      if (defaultValue == true) {
        return matchResult[1];
      } else {
        return decodeURIComponent(matchResult[1]);
      }
    }
    return null;
  },
  md5: function (md5Input) {
    function rotateLeft(value, shiftCount) {
      return value << shiftCount | value >>> 32 - shiftCount;
    }
    function add32(addendA, addendB) {
      let var0;
      let var1;
      let addendASignBit;
      let addendBSignBit;
      let var2;
      addendASignBit = addendA & -2147483648;
      addendBSignBit = addendB & -2147483648;
      var0 = addendA & 1073741824;
      var1 = addendB & 1073741824;
      var2 = (addendA & 1073741823) + (addendB & 1073741823);
      if (var0 & var1) {
        return var2 ^ -2147483648 ^ addendASignBit ^ addendBSignBit;
      }
      if (var0 | var1) {
        if (var2 & 1073741824) {
          return var2 ^ -1073741824 ^ addendASignBit ^ addendBSignBit;
        } else {
          return var2 ^ 1073741824 ^ addendASignBit ^ addendBSignBit;
        }
      } else {
        return var2 ^ addendASignBit ^ addendBSignBit;
      }
    }
    function md5F(fX, fY, fZ) {
      return fX & fY | ~fX & fZ;
    }
    function md5G(gX, gY, gZ) {
      return gX & gZ | gY & ~gZ;
    }
    function md5H(xorX, xorY, xorZ) {
      return xorX ^ xorY ^ xorZ;
    }
    function logicalOp(argA, argB, argC) {
      return argB ^ (argA | ~argC);
    }
    function roundTransformA(stateA1, stateB1, stateC1, stateD1, stateE1, stateF1, stateG1) {
      stateA1 = add32(stateA1, add32(add32(md5F(stateB1, stateC1, stateD1), stateE1), stateG1));
      return add32(rotateLeft(stateA1, stateF1), stateB1);
    }
    function roundTransformB(stateA2, stateB2, stateC2, stateD2, decodeParamA, decodeParamB, decodeParamC) {
      stateA2 = add32(stateA2, add32(add32(md5G(stateB2, stateC2, stateD2), decodeParamA), decodeParamC));
      return add32(rotateLeft(stateA2, decodeParamB), stateB2);
    }
    function decodeFunctionA(decodeAAccumulator, decodeAKey, decodeAChunk1, decodeAChunk2, decodeAChunk3, decodeAChunk4, decodeAChunk5) {
      decodeAAccumulator = add32(decodeAAccumulator, add32(add32(md5H(decodeAKey, decodeAChunk1, decodeAChunk2), decodeAChunk3), decodeAChunk5));
      return add32(rotateLeft(decodeAAccumulator, decodeAChunk4), decodeAKey);
    }
    function decodeFunctionB(decodeBAccumulator, decodeBKey, decodeBChunk1, decodeBChunk2, decodeBChunk3, decodeBChunk4, decodeBChunk5) {
      decodeBAccumulator = add32(decodeBAccumulator, add32(add32(logicalOp(decodeBKey, decodeBChunk1, decodeBChunk2), decodeBChunk3), decodeBChunk5));
      return add32(rotateLeft(decodeBAccumulator, decodeBChunk4), decodeBKey);
    }
    function parseInputString(inputString) {
      let var3;
      let inputLength = inputString.length;
      let paddedLength = inputLength + 8;
      let blockCount = (paddedLength - paddedLength % 64) / 64;
      let bufferSize = (blockCount + 1) * 16;
      let bufferArray = Array(bufferSize - 1);
      let num0 = 0;
      let num1 = 0;
      while (num1 < inputLength) {
        var3 = (num1 - num1 % 4) / 4;
        num0 = num1 % 4 * 8;
        bufferArray[var3] = bufferArray[var3] | inputString.charCodeAt(num1) << num0;
        num1++;
      }
      var3 = (num1 - num1 % 4) / 4;
      num0 = num1 % 4 * 8;
      bufferArray[var3] = bufferArray[var3] | 128 << num0;
      bufferArray[bufferSize - 2] = inputLength << 3;
      bufferArray[bufferSize - 1] = inputLength >>> 29;
      return bufferArray;
    }
    function transformFunction(var4) {
      let var5 = "";
      let var6 = "";
      let var7;
      let var8;
      for (var8 = 0; var8 <= 3; var8++) {
        var7 = var4 >>> var8 * 8 & 255;
        var6 = "0" + var7.toString(16);
        var5 = var5 + var6.substr(var6.length - 2, 2);
      }
      return var5;
    }
    let arr0 = [];
    let var9;
    let var10;
    let var11;
    let var12;
    let var13;
    let var14;
    let var15;
    let var16;
    let var17;
    const cnst0 = 7;
    const cnst1 = 12;
    const md5Shift17 = 17;
    const md5Shift22 = 22;
    const md5Shift5 = 5;
    const md5Shift9 = 9;
    const md5Shift14 = 14;
    const md5Shift20 = 20;
    const md5Shift4 = 4;
    const md5Shift11 = 11;
    const md5Shift16 = 16;
    const md5Shift23 = 23;
    const md5Shift6 = 6;
    const md5Shift10 = 10;
    const md5Shift15 = 15;
    const md5Shift21 = 21;
    md5Input = unescape(encodeURIComponent(md5Input));
    arr0 = parseInputString(md5Input);
    var14 = 1732584193;
    var15 = 4023233417;
    var16 = 2562383102;
    var17 = 271733878;
    for (var9 = 0; var9 < arr0.length; var9 += 16) {
      var10 = var14;
      var11 = var15;
      var12 = var16;
      var13 = var17;
      var14 = roundTransformA(var14, var15, var16, var17, arr0[var9 + 0], cnst0, 3614090360);
      var17 = roundTransformA(var17, var14, var15, var16, arr0[var9 + 1], cnst1, 3905402710);
      var16 = roundTransformA(var16, var17, var14, var15, arr0[var9 + 2], md5Shift17, 606105819);
      var15 = roundTransformA(var15, var16, var17, var14, arr0[var9 + 3], md5Shift22, 3250441966);
      var14 = roundTransformA(var14, var15, var16, var17, arr0[var9 + 4], cnst0, 4118548399);
      var17 = roundTransformA(var17, var14, var15, var16, arr0[var9 + 5], cnst1, 1200080426);
      var16 = roundTransformA(var16, var17, var14, var15, arr0[var9 + 6], md5Shift17, 2821735955);
      var15 = roundTransformA(var15, var16, var17, var14, arr0[var9 + 7], md5Shift22, 4249261313);
      var14 = roundTransformA(var14, var15, var16, var17, arr0[var9 + 8], cnst0, 1770035416);
      var17 = roundTransformA(var17, var14, var15, var16, arr0[var9 + 9], cnst1, 2336552879);
      var16 = roundTransformA(var16, var17, var14, var15, arr0[var9 + 10], md5Shift17, 4294925233);
      var15 = roundTransformA(var15, var16, var17, var14, arr0[var9 + 11], md5Shift22, 2304563134);
      var14 = roundTransformA(var14, var15, var16, var17, arr0[var9 + 12], cnst0, 1804603682);
      var17 = roundTransformA(var17, var14, var15, var16, arr0[var9 + 13], cnst1, 4254626195);
      var16 = roundTransformA(var16, var17, var14, var15, arr0[var9 + 14], md5Shift17, 2792965006);
      var15 = roundTransformA(var15, var16, var17, var14, arr0[var9 + 15], md5Shift22, 1236535329);
      var14 = roundTransformB(var14, var15, var16, var17, arr0[var9 + 1], md5Shift5, 4129170786);
      var17 = roundTransformB(var17, var14, var15, var16, arr0[var9 + 6], md5Shift9, 3225465664);
      var16 = roundTransformB(var16, var17, var14, var15, arr0[var9 + 11], md5Shift14, 643717713);
      var15 = roundTransformB(var15, var16, var17, var14, arr0[var9 + 0], md5Shift20, 3921069994);
      var14 = roundTransformB(var14, var15, var16, var17, arr0[var9 + 5], md5Shift5, 3593408605);
      var17 = roundTransformB(var17, var14, var15, var16, arr0[var9 + 10], md5Shift9, 38016083);
      var16 = roundTransformB(var16, var17, var14, var15, arr0[var9 + 15], md5Shift14, 3634488961);
      var15 = roundTransformB(var15, var16, var17, var14, arr0[var9 + 4], md5Shift20, 3889429448);
      var14 = roundTransformB(var14, var15, var16, var17, arr0[var9 + 9], md5Shift5, 568446438);
      var17 = roundTransformB(var17, var14, var15, var16, arr0[var9 + 14], md5Shift9, 3275163606);
      var16 = roundTransformB(var16, var17, var14, var15, arr0[var9 + 3], md5Shift14, 4107603335);
      var15 = roundTransformB(var15, var16, var17, var14, arr0[var9 + 8], md5Shift20, 1163531501);
      var14 = roundTransformB(var14, var15, var16, var17, arr0[var9 + 13], md5Shift5, 2850285829);
      var17 = roundTransformB(var17, var14, var15, var16, arr0[var9 + 2], md5Shift9, 4243563512);
      var16 = roundTransformB(var16, var17, var14, var15, arr0[var9 + 7], md5Shift14, 1735328473);
      var15 = roundTransformB(var15, var16, var17, var14, arr0[var9 + 12], md5Shift20, 2368359562);
      var14 = decodeFunctionA(var14, var15, var16, var17, arr0[var9 + 5], md5Shift4, 4294588738);
      var17 = decodeFunctionA(var17, var14, var15, var16, arr0[var9 + 8], md5Shift11, 2272392833);
      var16 = decodeFunctionA(var16, var17, var14, var15, arr0[var9 + 11], md5Shift16, 1839030562);
      var15 = decodeFunctionA(var15, var16, var17, var14, arr0[var9 + 14], md5Shift23, 4259657740);
      var14 = decodeFunctionA(var14, var15, var16, var17, arr0[var9 + 1], md5Shift4, 2763975236);
      var17 = decodeFunctionA(var17, var14, var15, var16, arr0[var9 + 4], md5Shift11, 1272893353);
      var16 = decodeFunctionA(var16, var17, var14, var15, arr0[var9 + 7], md5Shift16, 4139469664);
      var15 = decodeFunctionA(var15, var16, var17, var14, arr0[var9 + 10], md5Shift23, 3200236656);
      var14 = decodeFunctionA(var14, var15, var16, var17, arr0[var9 + 13], md5Shift4, 681279174);
      var17 = decodeFunctionA(var17, var14, var15, var16, arr0[var9 + 0], md5Shift11, 3936430074);
      var16 = decodeFunctionA(var16, var17, var14, var15, arr0[var9 + 3], md5Shift16, 3572445317);
      var15 = decodeFunctionA(var15, var16, var17, var14, arr0[var9 + 6], md5Shift23, 76029189);
      var14 = decodeFunctionA(var14, var15, var16, var17, arr0[var9 + 9], md5Shift4, 3654602809);
      var17 = decodeFunctionA(var17, var14, var15, var16, arr0[var9 + 12], md5Shift11, 3873151461);
      var16 = decodeFunctionA(var16, var17, var14, var15, arr0[var9 + 15], md5Shift16, 530742520);
      var15 = decodeFunctionA(var15, var16, var17, var14, arr0[var9 + 2], md5Shift23, 3299628645);
      var14 = decodeFunctionB(var14, var15, var16, var17, arr0[var9 + 0], md5Shift6, 4096336452);
      var17 = decodeFunctionB(var17, var14, var15, var16, arr0[var9 + 7], md5Shift10, 1126891415);
      var16 = decodeFunctionB(var16, var17, var14, var15, arr0[var9 + 14], md5Shift15, 2878612391);
      var15 = decodeFunctionB(var15, var16, var17, var14, arr0[var9 + 5], md5Shift21, 4237533241);
      var14 = decodeFunctionB(var14, var15, var16, var17, arr0[var9 + 12], md5Shift6, 1700485571);
      var17 = decodeFunctionB(var17, var14, var15, var16, arr0[var9 + 3], md5Shift10, 2399980690);
      var16 = decodeFunctionB(var16, var17, var14, var15, arr0[var9 + 10], md5Shift15, 4293915773);
      var15 = decodeFunctionB(var15, var16, var17, var14, arr0[var9 + 1], md5Shift21, 2240044497);
      var14 = decodeFunctionB(var14, var15, var16, var17, arr0[var9 + 8], md5Shift6, 1873313359);
      var17 = decodeFunctionB(var17, var14, var15, var16, arr0[var9 + 15], md5Shift10, 4264355552);
      var16 = decodeFunctionB(var16, var17, var14, var15, arr0[var9 + 6], md5Shift15, 2734768916);
      var15 = decodeFunctionB(var15, var16, var17, var14, arr0[var9 + 13], md5Shift21, 1309151649);
      var14 = decodeFunctionB(var14, var15, var16, var17, arr0[var9 + 4], md5Shift6, 4149444226);
      var17 = decodeFunctionB(var17, var14, var15, var16, arr0[var9 + 11], md5Shift10, 3174756917);
      var16 = decodeFunctionB(var16, var17, var14, var15, arr0[var9 + 2], md5Shift15, 718787259);
      var15 = decodeFunctionB(var15, var16, var17, var14, arr0[var9 + 9], md5Shift21, 3951481745);
      var14 = add32(var14, var10);
      var15 = add32(var15, var11);
      var16 = add32(var16, var12);
      var17 = add32(var17, var13);
    }
    return transformFunction(var14) + transformFunction(var15) + transformFunction(var16) + transformFunction(var17);
  },
  generateSignature: function (requestParams) {
    var signatureBase = "";
    if (requestParams == null) {
      requestParams = "";
    }
    if (typeof requestParams == "string" || requestParams == "") {
      signatureBase = requestParams;
    } else {
      let sortedKeys = Object.keys(requestParams).sort();
      for (let key of sortedKeys) {
        if (typeof requestParams[key] == "object") {
          signatureBase += key + JSON.stringify(requestParams[key]);
        } else {
          signatureBase += key + requestParams[key];
        }
      }
    }
    let timestamp = Date.now();
    let randomValue = Math.random();
    if (randomValue == 0) {
      randomValue = Number(Date.now().toString().substring(5));
    } else {
      randomValue = Number(randomValue.toFixed(8).toString().substring(2));
    }
    let nonce = Date.now().toString().substring(6) + String(randomValue);
    let md5HashFragment = this.md5((timestamp + nonce).substring(8, 16)).substring(12, 28);
    let signatureContent = signatureBase + "timestamp" + timestamp + "nonce" + nonce + md5HashFragment;
    let md5Hash = this.md5(signatureContent);
    return {
      timestamp: timestamp,
      nonce: nonce,
      sign: md5Hash
    };
  },
  ajax: function (ajaxConfig) {
    let {
      url: requestUrl,
      method = "GET",
      data = null,
      headers = {},
      timeout = 20000,
      sign = false,
      showLoading = true,
      loadingTarget = null,
      stayCurrentPage = false,
      hideErrorMsg = false,
      completeCallBack = null
    } = ajaxConfig;
    var token = this.cookie.get("Token");
    if (this.isNullOrEmpty(token)) {
      token = "";
    }
    return new Promise((resolve, reject) => {
      if (showLoading) {
        c.loading.show(loadingTarget);
      }
      const xhr = new XMLHttpRequest();
      xhr.timeout = timeout;
      if (requestUrl.toLowerCase().indexOf("http") != 0 && requestUrl.toLowerCase().indexOf("//") != 0) {
        requestUrl = webApiSiteHost + requestUrl;
      }
      if (method.toUpperCase() === "GET") {
        if (data) {
          requestUrl += "?" + Object.keys(data).map(paramKey => paramKey + "=" + encodeURIComponent(data[paramKey])).join("&");
          data = null;
        }
      } else if (method.toUpperCase() === "POST") {
        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }
        if (data) {
          if (typeof data == "object") {
            data = JSON.stringify(data);
          }
        }
      }
      xhr.open(method.toUpperCase(), requestUrl, true);
      headers.Authorization = "Bearer " + token;
      headers.LanguageCode = "zh";
      headers.IsAjax = "true";
      headers.Platform = "ToolWeb";
      if (sign) {
        let signature = c.generateSignature(data);
        headers.timestamp = signature.timestamp.toString();
        headers.nonce = signature.nonce;
        headers.sign = signature.sign;
      }
      Object.keys(headers).forEach(headerKey => xhr.setRequestHeader(headerKey, headers[headerKey]));
      xhr.onload = function () {
        var handleUnauthorized = () => {
          c.user.removeToken();
          reject({
            msg: "请重新登录"
          });
          var loginTimeoutConfirm = confirm("未登录或登录超时，现在去登录。");
          if (loginTimeoutConfirm) {
            location.href = websiteRoot + "/SignIn?redirect=" + encodeURIComponent(location.href);
          } else if (!stayCurrentPage) {
            location.href = websiteRoot + "/";
          }
        };
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(xhr.responseText);
        } catch {
          parsedResponse = xhr.responseText;
        }
        if (xhr.status === 401) {
          handleUnauthorized();
          return;
        }
        if (xhr.status >= 200 && xhr.status < 300) {
          if (typeof parsedResponse.code == "undefined") {
            resolve(parsedResponse);
          } else if (parsedResponse.code == 1) {
            resolve(parsedResponse);
          } else if (parsedResponse.code == 1100) {
            handleUnauthorized();
          } else {
            if (!hideErrorMsg && !c.isNullOrEmpty(parsedResponse.message)) {
              c.layerMsg(parsedResponse.message);
            }
            reject(parsedResponse);
          }
        } else {
          reject({
            code: xhr.status,
            msg: parsedResponse?.msg || "接口请求异常"
          });
        }
      };
      xhr.onerror = () => reject({
        msg: "网络异常"
      });
      xhr.ontimeout = () => reject({
        msg: "请求超时"
      });
      xhr.onabort = () => reject({
        msg: "请求已取消"
      });
      xhr.onloadend = () => {
        if (showLoading) {
          c.loading.hide(loadingTarget);
        }
        var responseToken = xhr.getResponseHeader("Token");
        if (!c.isNullOrEmpty(responseToken)) {
          c.user.setToken(responseToken);
        }
        if (completeCallBack) {
          completeCallBack();
        }
      };
      xhr.send(data);
    });
  },
  ajaxGet: function (requestOptions) {
    requestOptions.method = "GET";
    return c.ajax(requestOptions);
  },
  ajaxPost: function (postRequestOptions) {
    postRequestOptions.method = "POST";
    return c.ajax(postRequestOptions);
  },
  cookie: {
    set: function (key, value, options, param0) {
      if (value != null) {
        if (options == null) {
          options = {};
        }
        var expireTime = "";
        if (options.minutes != null) {
          expireTime = new Date(new Date().getTime() + options.minutes * 60000);
          expireTime = ";expires=" + expireTime.toGMTString();
        }
        document.cookie = key + "=" + (param0 ? value : encodeURIComponent(value)) + expireTime + ";path=" + (options.path ? options.path : "/") + (options.domain ? ";domain=" + options.domain : "");
      }
    },
    get: function (cookieName) {
      var cookieMatch = document.cookie.match(new RegExp("(^| )" + cookieName + "=([^;]*)(;|$)"));
      if (cookieMatch != null) {
        return decodeURIComponent(cookieMatch[2]);
      }
      return null;
    },
    remove: function (cookieNameToRemove, cookiePath, cookieDomain) {
      if (c.cookie.get(cookieNameToRemove) != null) {
        c.cookie.set(cookieNameToRemove, "", {
          minutes: -1,
          path: cookiePath,
          domain: cookieDomain
        });
      }
    },
    checkEnabled: function () {
      if (typeof navigator.cookieEnabled !== "undefined" && !navigator.cookieEnabled) {
        return false;
      }
      try {
        document.cookie = "testcookie=1";
        var hasTestCookie = document.cookie.indexOf("testcookie") !== -1;
        return hasTestCookie;
      } catch (error) {
        return false;
      }
    }
  },
  localStorage: {
    set: function (cookieNameToSet, cookieValue, storedValue) {
      if (typeof cookieValue == "object") {
        cookieValue = JSON.stringify(cookieValue);
      }
      if (storedValue != null) {
        var currentDate = new Date();
        currentDate.setTime(currentDate.getTime() + storedValue * 60 * 1000);
        cookieValue = JSON.stringify({
          value: cookieValue,
          timer: currentDate.getTime()
        });
      }
      localStorage.setItem(cookieNameToSet, cookieValue);
    },
    get: function (storageKey) {
      var storedItemString = localStorage.getItem(storageKey);
      try {
        var parsedData = JSON.parse(storedItemString);
        if (parsedData != null && typeof parsedData != "undefined" && parsedData.value != null && typeof parsedData.value != "undefined" && parsedData.timer != null && typeof parsedData.timer != "undefined") {
          if (new Date().getTime() > parsedData.timer) {
            c.localStorage.remove(storageKey);
            return null;
          }
          storedItemString = parsedData.value;
        }
      } catch (caughtError) {}
      if (storedItemString != null && typeof storedItemString != "undefined" && typeof storedItemString == "string" && (storedItemString.indexOf("{") == 0 || storedItemString.indexOf("[") == 0)) {
        storedItemString = JSON.parse(storedItemString);
      }
      return storedItemString;
    },
    remove: function (keyToRemove) {
      localStorage.removeItem(keyToRemove);
    }
  },
  timers: new Map(),
  idCounter: 0,
  scheduleOnce: function (callback, delay, ...args) {
    const newId = ++this.idCounter;
    const timerOptions = {
      id: newId,
      callback: callback,
      args: args,
      startTime: Date.now(),
      delay: delay,
      isInterval: false
    };
    const cleanupTimer = () => {
      this.timers.delete(newId);
      callback(...args);
    };
    timerOptions.timeoutId = window.setTimeout(cleanupTimer, delay);
    this.timers.set(newId, timerOptions);
    return newId;
  },
  schedule: function (taskCallback, delayMs, param1, ...restArgs) {
    const nextId = ++this.idCounter;
    const timerRecord = {
      id: nextId,
      callback: taskCallback,
      args: restArgs,
      startTime: Date.now(),
      interval: delayMs,
      isInterval: true,
      lastExecTime: Date.now()
    };
    const executeTimerTask = () => {
      timerRecord.lastExecTime = Date.now();
      taskCallback(...restArgs);
    };
    if (param1) {
      executeTimerTask();
    }
    timerRecord.intervalId = window.setInterval(executeTimerTask, delayMs);
    this.timers.set(nextId, timerRecord);
    return nextId;
  },
  clearSchedule: function (scheduleId) {
    const timerHandle = this.timers.get(scheduleId);
    if (timerHandle) {
      if (timerHandle.isInterval) {
        window.clearInterval(timerHandle.intervalId);
      } else {
        window.clearTimeout(timerHandle.timeoutId);
      }
      this.timers.delete(scheduleId);
    }
  },
  clearAllSchedule: function () {
    for (const [timerKey, timerValue] of this.timers) {
      this.clearSchedule(timerKey);
    }
  },
  generateRandomInt: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  },
  generateRandomNumbers: function (count, minValue, maxValue, unique = true) {
    if (minValue <= count) {
      return null;
    }
    if (unique && maxValue > minValue - count) {
      maxValue = minValue - count;
    }
    var randomList = [];
    while (randomList.length < maxValue) {
      var randomInt = Math.floor(Math.random() * (minValue - count)) + count;
      if (unique) {
        if (!randomList.includes(randomInt)) {
          randomList.push(randomInt);
        }
      } else {
        randomList.push(randomInt);
      }
    }
    return randomList;
  },
  clone: function (source) {
    if (source == null || typeof source != "object") {
      return source;
    }
    return JSON.parse(JSON.stringify(source));
  },
  audio: null,
  playAudio: function (audioSrc) {
    var soundOpenStorage = c.localStorage.get("soundOpen");
    var soundEnabled = c.isNullOrEmpty(soundOpenStorage) ? true : JSON.parse(soundOpenStorage);
    if (!soundEnabled) {
      return;
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.oncanplaythrough = null;
      this.audio.onerror = null;
    }
    this.audio = new Audio(audioSrc);
    this.audio.volume = 1;
    this.audio.oncanplaythrough = () => {
      this.audio.play().catch(playError => console.warn("播放失败:", playError));
      this.audio.oncanplaythrough = null;
    };
    this.audio.onerror = () => {
      console.error("音频加载错误:", audioSrc);
      this.audio.onerror = null;
    };
    this.audio.load();
  },
  loadScript: function (scriptSrc) {
    return new Promise((resolvePromise, rejectPromise) => {
      const scriptElement = document.querySelector("script[src=\"" + scriptSrc + "\"]");
      if (scriptElement) {
        resolvePromise();
        return;
      }
      const newScriptElement = document.createElement("script");
      newScriptElement.type = "text/javascript";
      newScriptElement.src = scriptSrc;
      newScriptElement.onload = () => {
        resolvePromise();
      };
      newScriptElement.onerror = () => {
        const loadError = new Error("Failed to load script: " + scriptSrc);
        rejectPromise(loadError);
      };
      document.head.appendChild(newScriptElement);
    });
  },
  dateFormat: function (dateValue, datePattern) {
    if (this.isNullOrEmpty(dateValue)) {
      return "";
    }
    if (this.isNullOrEmpty(datePattern)) {
      datePattern = "yyyy-MM-dd HH:mm:ss";
    }
    if (typeof dateValue == "string") {
      dateValue = new Date(dateValue);
    }
    var sourceObject = {
      "M+": dateValue.getMonth() + 1,
      "d+": dateValue.getDate(),
      "H+": dateValue.getHours(),
      "m+": dateValue.getMinutes(),
      "s+": dateValue.getSeconds(),
      "q+": Math.floor((dateValue.getMonth() + 3) / 3),
      S: dateValue.getMilliseconds()
    };
    if (/(y+)/.test(datePattern)) {
      datePattern = datePattern.replace(RegExp.$1, (dateValue.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var objectKey in sourceObject) {
      if (new RegExp("(" + objectKey + ")").test(datePattern)) {
        datePattern = datePattern.replace(RegExp.$1, RegExp.$1.length == 1 ? sourceObject[objectKey] : ("00" + sourceObject[objectKey]).substr(("" + sourceObject[objectKey]).length));
      }
    }
    return datePattern;
  },
  toThousandthPlace: function (inputValue, decimalPlaces) {
    if (this.isNullOrEmpty(inputValue) || isNaN(inputValue)) {
      return "";
    }
    if (String(inputValue).indexOf("e") != -1) {
      return inputValue;
    }
    if (decimalPlaces != null) {
      inputValue = Number(Number(inputValue).toFixed(decimalPlaces));
    }
    if (typeof inputValue == "number") {
      inputValue = String(inputValue);
    }
    var resultString = "";
    var counter = 0;
    var resultStr = "";
    if (inputValue.indexOf("-") == 0) {
      resultStr = "-";
      inputValue = inputValue.substring(1);
    }
    if (inputValue.indexOf(".") == -1) {
      for (var index = inputValue.length - 1; index >= 0; index--) {
        if (counter % 3 == 0 && counter != 0) {
          resultString = inputValue.charAt(index) + "," + resultString;
        } else {
          resultString = inputValue.charAt(index) + resultString;
        }
        counter++;
      }
    } else {
      for (var index = inputValue.indexOf(".") - 1; index >= 0; index--) {
        if (counter % 3 == 0 && counter != 0) {
          resultString = inputValue.charAt(index) + "," + resultString;
        } else {
          resultString = inputValue.charAt(index) + resultString;
        }
        counter++;
      }
      resultString = resultString + inputValue.substr(inputValue.indexOf("."));
    }
    return resultStr + resultString;
  },
  myToFixed: function (num, digits) {
    if (digits == null) {
      digits = 2;
    }
    if (this.isNullOrEmpty(num) || isNaN(num)) {
      return "";
    }
    if (typeof num == "string") {
      num = Number(num);
    }
    return Number(num.toFixed(digits));
  },
  compressImgquality: 80,
  compressImg: function (imageSource, quality, maxWidth, maxHeight, compressResultCallback) {
    var dataUrlParts = imageSource.split(";");
    var imageFormat = dataUrlParts[0].substr(dataUrlParts[0].indexOf("/") + 1).toLowerCase();
    if (imageFormat == "gif") {
      compressResultCallback(imageSource);
    } else {
      var imageElement = new Image();
      imageElement.src = imageSource;
      imageElement.onload = function () {
        var canvasElement = document.createElement("canvas");
        canvasElement.width = imageElement.width;
        canvasElement.height = imageElement.height;
        var canvasContext = canvasElement.getContext("2d");
        canvasContext.drawImage(imageElement, 0, 0);
        var loopCounterA = 0;
        var loopCounterB = 0;
        var imageNaturalWidth = imageElement.naturalWidth;
        var imageNaturalHeight = imageElement.naturalHeight;
        if (maxWidth == null || maxHeight == null) {
          loopCounterA = imageNaturalWidth;
          loopCounterB = imageNaturalHeight;
        } else if (imageNaturalWidth < maxWidth && imageNaturalHeight < maxHeight) {
          loopCounterA = imageNaturalWidth;
          loopCounterB = imageNaturalHeight;
        } else if (imageNaturalWidth / imageNaturalHeight > maxWidth / maxHeight) {
          loopCounterA = maxWidth;
          loopCounterB = imageNaturalHeight * maxWidth / imageNaturalWidth;
        } else {
          loopCounterA = imageNaturalWidth * maxHeight / imageNaturalHeight;
          loopCounterB = maxHeight;
        }
        canvasElement.width = loopCounterA;
        canvasElement.height = loopCounterB;
        canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasContext.drawImage(imageElement, 0, 0, loopCounterA, loopCounterB);
        var imageDataUrl = canvasElement.toDataURL("image/" + imageFormat, quality / 100);
        if (compressResultCallback != null) {
          compressResultCallback(imageDataUrl);
        }
      };
    }
  },
  base64ToBlob: function (base64Input) {
    var parts = base64Input.split(";base64,");
    var mimeType = parts[0].split(":")[1];
    var binaryString = window.atob(parts[1]);
    var byteLength = binaryString.length;
    var bytes = new Uint8Array(byteLength);
    for (var i = 0; i < byteLength; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], {
      type: mimeType
    });
  },
  base64ToUint8Array: function (base64Data) {
    var partsUint = base64Data.split(";base64,");
    var binaryData = window.atob(partsUint[1]);
    var byteLength = binaryData.length;
    var byteArray = new Uint8Array(byteLength);
    for (var byteIndex = 0; byteIndex < byteLength; ++byteIndex) {
      byteArray[byteIndex] = binaryData.charCodeAt(byteIndex);
    }
    return byteArray;
  },
  downloadTxt: function (fileName, fileContent) {
    let blob = new Blob([fileContent]);
    let linkElement = document.createElement("a");
    linkElement.download = fileName;
    linkElement.style.display = "none";
    const objectUrl = URL.createObjectURL(blob);
    linkElement.href = objectUrl;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(objectUrl);
  },
  downloadFile: function (sourceUrl, outputName, downloadType = "url") {
    let downloadUrl = "";
    if (downloadType == "text") {
      let fileBlob = new Blob([outputName]);
      downloadUrl = URL.createObjectURL(fileBlob);
    } else if (downloadType == "base64") {
      downloadUrl = URL.createObjectURL(outputName);
    } else if (downloadType == "url") {
      downloadUrl = outputName;
    }
    let anchorElement = document.createElement("a");
    anchorElement.download = sourceUrl;
    anchorElement.style.display = "none";
    anchorElement.href = downloadUrl;
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    if (downloadType != "url") {
      URL.revokeObjectURL(downloadUrl);
    }
  },
  isMobile: function () {
    if (/android|windows phone|iphone|symbianos|webos|blackberry|ucweb/i.test(navigator.userAgent.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  },
  unicodeConvert: {
    encode: function (plainText, cipherKey) {
      var charIndex;
      var charCode;
      var charCodeArray = [];
      for (charIndex = 0; charIndex < plainText.length; charIndex++) {
        charCode = plainText.charCodeAt(charIndex);
        if (cipherKey || charCode > 256) {
          charCode = charCode.toString(16);
          charCodeArray[charIndex] = "\\u" + charCode.padStart(4, "0");
        } else {
          charCodeArray[charIndex] = plainText[charIndex];
        }
      }
      return charCodeArray.join("");
    },
    decode: function (encodedText) {
      return unescape(encodedText.replace(/\\(u[0-9a-fA-F]{4})/gm, "%$1"));
    }
  },
  transSizeDesc(sizeValue, descriptionValue) {
    if (descriptionValue == null) {
      descriptionValue = 2;
    }
    if (sizeValue == null) {
      return "";
    }
    if (sizeValue < 1024) {
      return sizeValue + "B";
    }
    if (sizeValue < 1048576) {
      return (sizeValue / 1024).toFixed(descriptionValue) + "KB";
    }
    return (sizeValue / 1024 / 1024).toFixed(descriptionValue) + "MB";
  },
  parseJwt: function () {
    var token = c.cookie.get("Token");
    if (this.isNullOrEmpty(token)) {
      return null;
    }
    try {
      const tokenPayloadSegment = token.split(".")[1];
      const base64EncodedPayload = tokenPayloadSegment.replace(/-/g, "+").replace(/_/g, "/");
      const decodedTokenPayload = decodeURIComponent(atob(base64EncodedPayload).split("").map(char => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2)).join(""));
      return JSON.parse(decodedTokenPayload);
    } catch (jwtParseError) {
      console.error("JWT 解析失败：", jwtParseError);
      return null;
    }
  },
  loading: {
    show: function (loadingMessage, loadingOptions) {
      var createdDiv = document.createElement("div");
      createdDiv.className = "mask mask-loading";
      createdDiv.innerHTML = "<img src=\"" + staticSiteHost + "/img/loading.svg\" style=\"width:100px;\" />" + (c.isNullOrEmpty(loadingOptions) ? "" : "<span>" + loadingOptions + "</span>");
      if (c.isNullOrEmpty(loadingMessage)) {
        createdDiv.style.position = "fixed";
        createdDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        document.body.appendChild(createdDiv);
      } else {
        createdDiv.style.position = "absolute";
        var themeValue = c.cookie.get("theme") || "light";
        createdDiv.style.backgroundColor = themeValue == "light" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.5)";
        var targetElement = document.querySelector(loadingMessage);
        if (targetElement != null) {
          targetElement.classList.add("loading-parent-relative");
          targetElement.appendChild(createdDiv);
        }
      }
    },
    hide: function (selector) {
      var loadingMask = document.querySelector(".mask-loading");
      if (loadingMask == null) {
        return;
      }
      if (c.isNullOrEmpty(selector)) {
        document.body.removeChild(loadingMask);
      } else {
        var hideElement = document.querySelector(selector);
        if (hideElement != null) {
          hideElement.removeChild(loadingMask);
          hideElement.classList.remove("loading-parent-relative");
        }
      }
    }
  },
  layerMsgTimeout: null,
  layerMsg: function (message, options) {
    var layerMsgElement = document.querySelector(".layer-msg");
    if (layerMsgElement != null) {
      document.body.removeChild(layerMsgElement);
    }
    var tempDiv = document.createElement("div");
    tempDiv.className = "layer-msg";
    tempDiv.innerText = message;
    document.body.appendChild(tempDiv);
    if (this.layerMsgTimeout != null) {
      clearTimeout(this.layerMsgTimeout);
      this.layerMsgTimeout = null;
    }
    this.layerMsgTimeout = setTimeout(() => {
      document.body.removeChild(tempDiv);
    }, options || 3000);
  },
  navigateBack: function () {
    if (history.length == 1) {
      location.href = websiteRoot + "/";
    } else {
      history.go(-1);
    }
  },
  getCustomUID: function () {
    var customUIDKey = "customUID";
    var storedCustomUID = localStorage.getItem(customUIDKey);
    if (storedCustomUID == null) {
      storedCustomUID = String(Math.random());
      localStorage.setItem(customUIDKey, storedCustomUID);
    }
    return storedCustomUID;
  },
  copy: function (textToCopy) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(textToCopy);
    } else {
      var copyTextareaEl = document.getElementById("copyTextarea");
      if (copyTextareaEl == null) {
        copyTextareaEl = document.createElement("input");
        copyTextareaEl.id = "copyTextArea";
        copyTextareaEl.style.border = "0px";
        copyTextareaEl.style.height = "0px";
        copyTextareaEl.style.overflow = "hidden";
        copyTextareaEl.style.position = "absolute";
        document.body.appendChild(copyTextareaEl);
      }
      copyTextareaEl.value = textToCopy;
      copyTextareaEl.focus();
      copyTextareaEl.select();
      document.execCommand("Copy");
    }
  },
  backTop: function () {
    var backTopEl = document.getElementById("back-top");
    if (!backTopEl) {
      return;
    }
    function updateBackTopVisibility() {
      var scrollTopVal = document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollTopVal > 300) {
        backTopEl.style.display = "flex";
      } else {
        backTopEl.style.display = "none";
      }
    }
    updateBackTopVisibility();
    window.addEventListener("scroll", updateBackTopVisibility);
    backTopEl.onclick = function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };
  },
  popupToggle: function (popupConfig) {
    popupConfig = Object.assign({
      toggle: true,
      callbackForShow: null,
      callbackForHide: null
    }, popupConfig);
    let targetElement;
    if (popupConfig.el.startsWith("#")) {
      const targetSelector = popupConfig.el.slice(1);
      targetElement = document.getElementById(targetSelector);
    } else if (popupConfig.el.startsWith(".")) {
      const elementId = popupConfig.el.slice(1);
      targetElement = document.querySelector("." + elementId);
    } else {
      targetElement = document.querySelector(popupConfig.el);
    }
    if (!targetElement) {
      return;
    }
    const computedDisplay = getComputedStyle(targetElement).display;
    if (computedDisplay === "none" || !popupConfig.toggle) {
      targetElement.style.display = "block";
      if (typeof popupConfig.callbackForShow === "function") {
        popupConfig.callbackForShow();
      }
    } else {
      targetElement.style.display = "none";
      if (typeof popupConfig.callbackForHide === "function") {
        popupConfig.callbackForHide();
      }
    }
    document.documentElement.onmouseup = function (mouseUpEvent) {
      if (getComputedStyle(targetElement).display === "none") {
        return;
      }
      const eventObj = mouseUpEvent || window.event;
      let eventTarget = eventObj.target || eventObj.srcElement;
      const elementParentNode = targetElement.parentNode;
      if (eventTarget !== elementParentNode) {
        let targetParentNode = eventTarget.parentNode;
        while (targetParentNode && targetParentNode !== elementParentNode) {
          targetParentNode = targetParentNode.parentNode;
        }
        if (!targetParentNode) {
          targetElement.style.display = "none";
          if (targetElement.previousElementSibling) {
            targetElement.previousElementSibling.blur();
          }
          if (typeof popupConfig.callbackForHide === "function") {
            popupConfig.callbackForHide();
          }
        }
      }
    };
  },
  goShare: function () {
    setTimeout(() => {
      const sharePopupLinks = document.querySelectorAll(".share-popup a");
      if (sharePopupLinks.length === 0) {
        return;
      }
      const currentUrl = location.href;
      const pageTitle = document.title;
      let shareBodyText = "";
      const metaElements = document.getElementsByTagName("meta");
      for (let metaIndex = 0; metaIndex < metaElements.length; metaIndex++) {
        const metaElement = metaElements[metaIndex];
        if (metaElement.name && metaElement.name.toLowerCase() === "description") {
          if (!c.isNullOrEmpty(metaElement.content)) {
            shareBodyText = metaElement.content;
          }
        }
      }
      for (let shareIndex = 0; shareIndex < sharePopupLinks.length; shareIndex++) {
        const shareElement = sharePopupLinks[shareIndex];
        const shareType = shareElement.getAttribute("data-share-type");
        if (shareType === "link") {
          shareElement.addEventListener("click", function (event) {
            event.preventDefault();
            c.copy(currentUrl);
            const dataMsg = this.getAttribute("data-msg");
            c.layerMsg(dataMsg);
          });
        } else if (shareType === "email") {
          const mailtoString = "mailto:?subject=" + encodeURIComponent(pageTitle) + "&body=" + encodeURIComponent(shareBodyText);
          shareElement.setAttribute("href", mailtoString);
        }
      }
    }, 500);
  },
  user: {
    setToken: function (tokenValue) {
      var cookieDomain = null;
      if (location.host.indexOf("localhost") == -1) {
        cookieDomain = "tool.6767.chat";
      }
      c.cookie.set("Token", tokenValue, {
        minutes: 129600,
        domain: cookieDomain
      });
    },
    getUserSummary: function (userSummaryParam) {
      var cookieToken = c.cookie.get("Token");
      var storedUserSummary = c.cookie.get("UserSummary");
      if (c.isNullOrEmpty(cookieToken) && !c.isNullOrEmpty(storedUserSummary)) {
        c.cookie.remove("UserSummary");
        storedUserSummary = null;
      }
      if (!c.isNullOrEmpty(cookieToken) && c.isNullOrEmpty(storedUserSummary)) {
        c.ajaxGet({
          url: "/User/GetUserSummary",
          showLoading: false
        }).then(responseData => {
          if (responseData.data != null) {
            c.cookie.set("UserSummary", JSON.stringify(responseData.data));
          } else {
            c.user.removeToken();
          }
          if (userSummaryParam != null) {
            userSummaryParam();
          }
        });
      } else if (userSummaryParam != null) {
        userSummaryParam();
      }
    },
    updateUserSummary: function (updatedUserSummary) {
      var userSummaryCookie = c.cookie.get("UserSummary");
      if (userSummaryCookie == null) {
        return;
      }
      userSummaryCookie = JSON.parse(userSummaryCookie);
      Object.assign(userSummaryCookie, updatedUserSummary);
      c.cookie.set("UserSummary", JSON.stringify(userSummaryCookie));
    },
    signOut: function () {
      c.user.removeToken();
      c.cookie.remove("UserSummary");
      location.reload();
    },
    removeToken: function () {
      var backupDomain = null;
      if (location.host.indexOf("localhost") == -1) {
        backupDomain = "tool.6767.chat";
      }
      c.cookie.remove("Token", null, backupDomain);
    }
  },
  preventCheat: function () {
    if (location.hostname == "localhost") {
      return;
    }
    document.addEventListener("selectstart", selectStartEvent => {
      selectStartEvent.preventDefault();
    });
    document.addEventListener("copy", copyEvent => {
      copyEvent.preventDefault();
    });
    document.addEventListener("contextmenu", contextMenuEvent => {
      contextMenuEvent.preventDefault();
    });
    document.addEventListener("keydown", keydownEvent => {
      if (keydownEvent.key === "F12") {
        keydownEvent.preventDefault();
      }
      if (keydownEvent.ctrlKey && keydownEvent.shiftKey && keydownEvent.key === "I") {
        keydownEvent.preventDefault();
      }
      if (keydownEvent.ctrlKey && keydownEvent.shiftKey && keydownEvent.key === "J") {
        keydownEvent.preventDefault();
      }
      if (keydownEvent.ctrlKey && keydownEvent.shiftKey && keydownEvent.key === "C") {
        event.preventDefault();
      }
      if (keydownEvent.ctrlKey && keydownEvent.key === "u") {
        keydownEvent.preventDefault();
      }
    });

    const timeoutFn = window.setTimeout;
    const intervalFn = window.setInterval;
    const clearTimeoutFn = window.clearTimeout;
    const clearIntervalFn = window.clearInterval;
    Object.defineProperty(window, "setTimeout", {
      value: timeoutFn,
      writable: false
    });
    Object.defineProperty(window, "setInterval", {
      value: intervalFn,
      writable: false
    });
    Object.defineProperty(window, "clearTimeout", {
      value: clearTimeoutFn,
      writable: false
    });
    Object.defineProperty(window, "clearInterval", {
      value: clearIntervalFn,
      writable: false
    });
  },
  game: {
    addRankingList: function ({
      programName = "",
      levelGroup = null,
      level = null,
      score = null,
      time = null
    }) {
      if (c.cookie.get("UserSummary") == null || level != null && level <= 0 || score != null && score <= 0 || time != null && time <= 0) {
        return;
      }
      c.ajaxPost({
        url: "/NlxlRankingList/Add",
        data: JSON.stringify({
          platformName: "ToolWeb",
          programName: programName,
          levelGroup: levelGroup,
          level: level,
          score: score,
          time: time
        }),
        contentType: "application/json",
        sign: true,
        showLoading: false
      }).then(thenResult => {}).catch(catchError => {});
    }
  },
  init: function () {
    this.extendMethod();
    this.backTop();
    this.goShare();
    if (window.top !== window.self) {
      try {
        window.top.location.replace(window.location.href);
        window.top.location.href = window.self.location.href;
      } catch (denyError) {
        document.body.innerHTML = "<h1>Deny</h1>";
      }
    }
  }
};
c.init();
var signIn = {
  name: "SignIn",
  components: {
    "slide-captcha": typeof slideCaptcha != "undefined" ? slideCaptcha : null
  },
  props: ["loginCallback"],
  data() {
    return {
      websiteRoot: websiteRoot,
      signInModuleType: "",
      phoneSmsEnable: typeof phoneSmsEnable != "undefined" ? phoneSmsEnable : 0,
      customUID: c.getCustomUID(),
      signInData: {
        signInType: typeof phoneSmsEnable != "undefined" && phoneSmsEnable == 1 ? "phoneCode" : "pwd",
        account: "",
        pwd: "",
        phone: "",
        phoneCode: "",
        getPhoneCodeMsg: "发送验证码",
        getPhoneCodeTime: 60,
        isGettingPhoneCode: false
      },
      signUpData: {
        signUpType: typeof phoneSmsEnable != "undefined" && phoneSmsEnable == 1 ? "phone" : "email",
        email: "",
        emailCode: "",
        getEmailCodeMsg: "发送验证码",
        getEmailCodeTime: 60,
        isGettingEmailCode: false,
        pwd: "",
        pwdAgain: "",
        phone: "",
        phoneCode: "",
        getPhoneCodeMsg: "发送验证码",
        getPhoneCodeTime: 60,
        isGettingPhoneCode: false
      },
      signUpFormRules: {
        pwd: [{
          required: true,
          validator: (rule, value, signUpPwdCallback) => {
            if (this.signUpData.pwd.length < 6) {
              signUpPwdCallback(new Error("密码长度必须大于等于6"));
            } else {
              signUpPwdCallback();
            }
          },
          trigger: "blur"
        }],
        pwdAgain: [{
          required: true,
          validator: (rule2, value2, callback2) => {
            if (this.signUpData.pwd != this.signUpData.pwdAgain) {
              callback2(new Error("确认密码输入错误"));
            } else {
              callback2();
            }
          },
          trigger: "blur"
        }]
      },
      findPwdData: {
        findPwdStep: 0,
        account: "",
        authType: "",
        email: "",
        emailCode: "",
        getEmailCodeMsg: "发送验证码",
        getEmailCodeTime: 60,
        isGettingEmailCode: false,
        phone: "",
        phoneCode: "",
        getPhoneCodeMsg: "发送验证码",
        getPhoneCodeTime: 60,
        isGettingPhoneCode: false,
        pwd: "",
        pwdAgain: ""
      },
      findPwdFormRules: {
        pwd: [{
          required: true,
          validator: (rule3, value3, callback3) => {
            if (this.findPwdData.pwd.length < 6) {
              callback3(new Error("密码长度必须大于等于6"));
            } else {
              callback3();
            }
          },
          trigger: "blur"
        }],
        pwdAgain: [{
          required: true,
          validator: (rule4, confirmPwdValue, confirmPwdCallback) => {
            if (this.findPwdData.pwd != this.findPwdData.pwdAgain) {
              confirmPwdCallback(new Error("确认密码输入错误"));
            } else {
              confirmPwdCallback();
            }
          },
          trigger: "blur"
        }]
      }
    };
  },
  watch: {
    signInModuleType(moduleType, moduleValue) {
      var headingText = "";
      if (moduleType == "signIn") {
        headingText = "登录";
      } else if (moduleType == "signUp") {
        headingText = "注册";
      } else if (moduleType == "findPwd") {
        headingText = "找回密码";
      }
      this.$emit("setSignInModuleTitle", headingText);
    }
  },
  template: "\n        <el-form v-if=\"signInModuleType=='signIn'\" ref=\"signInForm\" :model=\"signInData\" size=\"large\" class=\"account-form\">\n            <el-tabs v-if =\"phoneSmsEnable==1\" v-model=\"signInData.signInType\">\n                <el-tab-pane label=\"短信验证码登录\" name=\"phoneCode\"></el-tab-pane>\n                <el-tab-pane label=\"密码登录\" name=\"pwd\"></el-tab-pane>\n            </el-tabs>\n            <template v-if=\"signInData.signInType=='phoneCode'\">\n                <el-form-item prop=\"phone\" :rules=\"[{ required: true, message: '请输入手机号', trigger: 'blur' }, { pattern: /^[1][0-9]{10}$/, message: '手机号输入错误', trigger: 'blur' }]\">\n                    <el-input type=\"number\" v-model=\"signInData.phone\" placeholder=\"手机号\" v-on:keyup.enter.native=\"signIn\"></el-input>\n                </el-form-item>\n                <el-form-item prop=\"phoneCode\" :rules=\"{ required: true, message: '请输入验证码', trigger: 'blur' }\">\n                    <div class=\"get-code\">\n                        <el-input type=\"number\" v-model=\"signInData.phoneCode\" placeholder=\"短信验证码\" class=\"get-code-input\" v-on:keyup.enter.native=\"signIn\"></el-input>\n                        <el-button v-on:click=\"getPhoneCodeForSignIn\" :disabled=\"signInData.isGettingPhoneCode\" class=\"get-code-msg\">{{signInData.getPhoneCodeMsg}}</el-button>\n                    </div>\n                    <slide-captcha ref=\"slideCaptchaForSignIn\" v-bind:phone=\"signInData.phone\" v-on:success=\"checkCaptchaSuccessForSignIn\"></slide-captcha>\n                </el-form-item>\n            </template>\n            <template v-if=\"signInData.signInType=='pwd'\">\n                <el-form-item prop=\"account\" :rules=\"[{ required: true, message: '请输入账户', trigger: 'blur' }]\">\n                    <el-input v-model=\"signInData.account\" placeholder=\"邮箱/手机号\" v-on:keyup.enter.native=\"signIn\"></el-input>\n                </el-form-item>\n                <el-form-item prop=\"pwd\" :rules=\"{ required: true, message: '请输入登录密码', trigger: 'blur' }\">\n                    <el-input type=\"password\" v-model=\"signInData.pwd\" show-password placeholder=\"登录密码\" v-on:keyup.enter.native=\"signIn\"></el-input>\n                </el-form-item>\n            </template>\n            <el-form-item style=\"margin-bottom:0;\">\n                <el-button type=\"primary\" v-on:click=\"signIn\" class=\"submit-btn\">登录</el-button>\n            </el-form-item>\n            <div v-if=\"signInData.signInType=='pwd'\" class=\"sign-in-bottom1\">\n                <a href=\"javascript:;\" v-on:click=\"goFindPwd\">忘记密码</a>\n                <a href=\"javascript:;\" v-on:click=\"signInModuleType='signUp'\">注册</a>\n            </div>\n            <div v-else class=\"sign-in-bottom2\">未注册过的手机号，登录成功后将自动注册账户</div>\n        </el-form>\n\n        <el-form v-if=\"signInModuleType=='signUp'\" ref=\"signUpForm\" :model=\"signUpData\" :rules=\"signUpFormRules\" size=\"large\" class=\"account-form\">\n            <el-tabs v-if=\"phoneSmsEnable==1\" v-model=\"signUpData.signUpType\">\n                <el-tab-pane label=\"手机号注册\" name=\"phone\"></el-tab-pane>\n                <el-tab-pane label=\"邮箱注册\" name=\"email\"></el-tab-pane>\n            </el-tabs>\n            <template v-if=\"signUpData.signUpType=='phone'\">\n                <el-form-item prop=\"phone\" :rules=\"[{ required: true, message: '请输入手机号', trigger: 'blur' }, { pattern: /^[1][0-9]{10}$/, message: '手机号输入错误', trigger: 'blur' }]\">\n                    <el-input type=\"number\" v-model=\"signUpData.phone\" placeholder=\"手机号\" v-on:keyup.enter.native=\"signUp\"></el-input>\n                </el-form-item>\n                <el-form-item prop=\"phoneCode\" :rules=\"{ required: true, message: '请输入登录密码', trigger: 'blur' }\">\n                    <div class=\"get-code\">\n                        <el-input type=\"number\" v-model=\"signUpData.phoneCode\" placeholder=\"短信验证码\" class=\"get-code-input\" v-on:keyup.enter.native=\"signUp\"></el-input>\n                        <el-button v-on:click=\"getPhoneCodeForSignUp\" :disabled=\"signUpData.isGettingPhoneCode\" class=\"get-code-msg\">{{signUpData.getPhoneCodeMsg}}</el-button>\n                    </div>\n                    <slide-captcha ref=\"slideCaptchaByPhoneForSignUp\" v-bind:phone=\"signUpData.phone\" v-on:success=\"checkCaptchaSuccessByPhoneForSignUp\"></slide-captcha>\n                </el-form-item>\n            </template>\n            <template v-if=\"signUpData.signUpType=='email'\">\n                <el-form-item prop=\"email\" :rules=\"[{ required: true, message: '请输入邮箱', trigger: 'blur' }]\">\n                    <el-input v-model=\"signUpData.email\" placeholder=\"邮箱\" v-on:keyup.enter.native=\"signUp\"></el-input>\n                </el-form-item>\n                <el-form-item prop=\"emailCode\" :rules=\"{ required: true, message: '请输入验证码', trigger: 'blur' }\">\n                    <div class=\"get-code\">\n                        <el-input type=\"number\" v-model=\"signUpData.emailCode\" placeholder=\"邮箱验证码\" class=\"get-code-input\" v-on:keyup.enter.native=\"signUp\"></el-input>\n                        <el-button v-on:click=\"getEmailCodeForSignUp\" :disabled=\"signUpData.isGettingEmailCode\" class=\"get-code-msg\">{{signUpData.getEmailCodeMsg}}</el-button>\n                    </div>\n                    <slide-captcha ref=\"slideCaptchaByEmailForSignUp\" v-bind:email=\"signUpData.email\" v-on:success=\"checkCaptchaSuccessByEmailForSignUp\"></slide-captcha>\n                </el-form-item>\n                <el-form-item prop=\"pwd\">\n                    <el-input type=\"password\" v-model=\"signUpData.pwd\" show-password placeholder=\"登录密码\" v-on:keyup.enter.native=\"signUp\"></el-input>\n                </el-form-item>\n                <el-form-item prop=\"pwdAgain\">\n                    <el-input type=\"password\" v-model=\"signUpData.pwdAgain\" show-password placeholder=\"确认密码\" v-on:keyup.enter.native=\"signUp\"></el-input>\n                </el-form-item>\n            </template>\n            <el-form-item style=\"margin-bottom:0;\">\n                <el-button type=\"primary\" v-on:click=\"signUp\" class=\"submit-btn\">注册</el-button>\n            </el-form-item>\n            <div class=\"sign-up-bottom1\">点击注册按钮，即表示您同意本服务相关条款</div>\n            <div class=\"sign-up-bottom2\"><a href=\"javascript:;\" v-on:click=\"signInModuleType='signIn'\">返回登录</a></div>\n        </el-form>\n\n        <template v-if=\"signInModuleType=='findPwd'\">\n            <el-form ref=\"findPwdForm\" :model=\"findPwdData\" :rules=\"findPwdFormRules\" size=\"large\" class=\"account-form\">\n                <el-steps :active=\"findPwdData.findPwdStep\" align-center>\n                    <el-step title=\"填写账户\"></el-step>\n                    <el-step title=\"身份验证\"></el-step>\n                    <el-step title=\"重置密码\"></el-step>\n                </el-steps>\n                <template v-if=\"findPwdData.findPwdStep==0\">\n                    <el-form-item prop=\"account\" :rules=\"{ required: true, message: '请输入邮箱或手机号', trigger: 'blur' }\">\n                        <el-input v-model=\"findPwdData.account\" placeholder=\"邮箱/手机号\" v-on:keyup.enter.native=\"getAllAccount\"></el-input>\n                    </el-form-item>\n                    <el-button type=\"primary\" v-on:click=\"getAllAccount\" class=\"submit-btn\">下一步</el-button>\n                </template>\n\n                <template v-if=\"findPwdData.findPwdStep==1\">\n                    <div v-if=\"findPwdData.email!=''\" class=\"auth-type\" v-on:click=\"findPwdData.authType='email'\">\n                        <i class=\"my-icon\" v-bind:class=\"findPwdData.authType=='email'?'my-icon-selected':'my-icon-unselected'\"></i>使用邮箱验证: {{findPwdData.email}}\n                    </div>\n                    <template v-if=\"findPwdData.authType=='email' && findPwdData.email!=''\">\n                        <el-form-item prop=\"emailCode\" :rules=\"{ required: true, message: '请输入验证码', trigger: 'blur' }\">\n                            <div class=\"get-code\">\n                                <el-input type=\"number\" v-model=\"findPwdData.emailCode\" placeholder=\"邮箱验证码\" class=\"get-code-input\" v-on:keyup.enter.native=\"identityAuth\"></el-input>\n                                <el-button v-on:click=\"getEmailCodeForFindPwd\" :disabled=\"findPwdData.isGettingEmailCode\" class=\"get-code-msg\">{{findPwdData.getEmailCodeMsg}}</el-button>\n                            </div>\n                            <slide-captcha ref=\"slideCaptchaByEmailForFindPwd\" v-bind:email=\"findPwdData.email\" v-on:success=\"checkCaptchaSuccessByEmailForFindPwd\"></slide-captcha>\n                        </el-form-item>\n                    </template>\n\n                    <div v-if=\"findPwdData.phone!=''\" class=\"auth-type\" v-on:click=\"findPwdData.authType='phone'\">\n                        <i class=\"my-icon\" v-bind:class=\"findPwdData.authType=='phone'?'my-icon-selected':'my-icon-unselected'\"></i>使用手机验证: {{findPwdData.phone}}\n                    </div>\n                    <template v-if=\"findPwdData.authType=='phone' && findPwdData.phone!=''\">\n                        <el-form-item prop=\"phoneCode\" :rules=\"{ required: true, message: '请输入验证码', trigger: 'blur' }\">\n                            <div class=\"get-code\">\n                                <el-input type=\"number\" v-model=\"findPwdData.phoneCode\" placeholder=\"短信验证码\" class=\"get-code-input\" v-on:keyup.enter.native=\"identityAuth\"></el-input>\n                                <el-button v-on:click=\"getPhoneCodeForFindPwd\" :disabled=\"findPwdData.isGettingPhoneCode\" class=\"get-code-msg\">{{findPwdData.getPhoneCodeMsg}}</el-button>\n                            </div>\n                            <slide-captcha ref=\"slideCaptchaByPhoneForFindPwd\" v-bind:phone=\"findPwdData.phone\" v-on:success=\"checkCaptchaSuccessByPhoneForFindPwd\"></slide-captcha>\n                        </el-form-item>\n                    </template>\n\n                    <el-button type=\"primary\" v-on:click=\"identityAuth\" class=\"submit-btn\">下一步</el-button>\n                </template>\n\n                <template v-if=\"findPwdData.findPwdStep==2\">\n                    <el-form-item prop=\"pwd\">\n                        <el-input type=\"password\" v-model=\"findPwdData.pwd\" show-password placeholder=\"登录密码\" v-on:keyup.enter.native=\"resetPwd\"></el-input>\n                    </el-form-item>\n                    <el-form-item prop=\"pwdAgain\">\n                        <el-input type=\"password\" v-model=\"findPwdData.pwdAgain\" show-password placeholder=\"确认密码\" v-on:keyup.enter.native=\"resetPwd\"></el-input>\n                    </el-form-item>\n                    <el-button type=\"primary\" v-on:click=\"resetPwd\" class=\"submit-btn\">提交</el-button>\n                </template>\n\n                <div class=\"find-pwd-bottom\"><a href=\"javascript:;\" v-on:click=\"signInModuleType='signIn'\">返回登录</a></div>\n            </el-form>\n        </template>\n    ",
  methods: {
    getPhoneCodeForSignIn() {
      if (this.signInData.isGettingPhoneCode) {
        return;
      }
      if (c.isNullOrEmpty(this.signInData.phone)) {
        c.layerMsg("请输入手机号");
        return;
      }
      if (!/^[1][0-9]{10}$/.test(this.signInData.phone.trim())) {
        c.layerMsg("手机号输入错误");
        return;
      }
      this.$refs.slideCaptchaForSignIn.open();
    },
    checkCaptchaSuccessForSignIn(captchaResult) {
      this.signInData.isGettingPhoneCode = true;
      this.signInData.getPhoneCodeMsg = this.signInData.getPhoneCodeTime + "s";
      var intervalId = setInterval(() => {
        this.signInData.getPhoneCodeTime = this.signInData.getPhoneCodeTime - 1;
        this.signInData.getPhoneCodeMsg = this.signInData.getPhoneCodeTime + "s";
        if (this.signInData.getPhoneCodeTime == 0) {
          clearInterval(intervalId);
          this.signInData.getPhoneCodeMsg = "重新获取";
          this.signInData.getPhoneCodeTime = 60;
          this.signInData.isGettingPhoneCode = false;
        }
      }, 1000);
    },
    signIn() {
      this.$refs.signInForm.validate(valid => {
        if (valid) {
          c.ajaxPost({
            url: "/User/SignIn",
            data: JSON.stringify({
              signInType: this.signInData.signInType,
              account: this.signInData.account,
              pwd: this.signInData.pwd,
              phone: this.signInData.phone,
              phoneCode: this.signInData.phoneCode
            }),
            contentType: "application/json",
            loadingTarget: ".account-form"
          }).then(loginResponse => {
            c.user.setToken(loginResponse.data);
            this.$message({
              message: "登录成功",
              type: "success",
              duration: 500,
              onClose: () => {
                var redirectUrl = c.urlParam("redirect");
                if (redirectUrl != null) {
                  location.href = redirectUrl;
                } else if (this.loginCallback != null) {
                  this.loginCallback();
                } else {
                  location.reload();
                }
              }
            });
          });
        } else {
          return false;
        }
      });
    },
    getPhoneCodeForSignUp() {
      if (this.signUpData.isGettingPhoneCode) {
        return;
      }
      if (c.isNullOrEmpty(this.signUpData.phone)) {
        c.layerMsg("请输入手机号");
        return;
      }
      if (!/^[1][0-9]{10}$/.test(this.signUpData.phone.trim())) {
        c.layerMsg("手机号输入错误");
        return;
      }
      c.ajaxGet({
        url: "/User/AccountExists?account=" + encodeURIComponent(this.signUpData.phone),
        loadingTarget: ".account-form"
      }).then(phoneCheckResponse => {
        if (phoneCheckResponse.data) {
          this.$message.error("该手机号已被注册");
        } else {
          this.$refs.slideCaptchaByPhoneForSignUp.open();
        }
      });
    },
    checkCaptchaSuccessByPhoneForSignUp(phoneCaptchaResult) {
      this.signUpData.isGettingPhoneCode = true;
      this.signUpData.getPhoneCodeMsg = this.signUpData.getPhoneCodeTime + "s";
      var phoneCheckTimerId = setInterval(() => {
        this.signUpData.getPhoneCodeTime = this.signUpData.getPhoneCodeTime - 1;
        this.signUpData.getPhoneCodeMsg = this.signUpData.getPhoneCodeTime + "s";
        if (this.signUpData.getPhoneCodeTime == 0) {
          clearInterval(phoneCheckTimerId);
          this.signUpData.getPhoneCodeMsg = "重新获取";
          this.signUpData.getPhoneCodeTime = 60;
          this.signUpData.isGettingPhoneCode = false;
        }
      }, 1000);
    },
    getEmailCodeForSignUp() {
      if (this.signUpData.isGettingEmailCode) {
        return;
      }
      if (c.isNullOrEmpty(this.signUpData.email)) {
        c.layerMsg("请输入邮箱");
        return;
      }
      if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(this.signUpData.email.trim())) {
        c.layerMsg("邮箱格式输入错误");
        return;
      }
      c.ajaxGet({
        url: "/User/AccountExists?account=" + encodeURIComponent(this.signUpData.email),
        loadingTarget: ".account-form"
      }).then(emailCheckResponse => {
        if (emailCheckResponse.data) {
          this.$message.error("该邮箱已被注册");
        } else {
          this.$refs.slideCaptchaByEmailForSignUp.open();
        }
      });
    },
    checkCaptchaSuccessByEmailForSignUp(emailCaptchaResult) {
      this.signUpData.isGettingEmailCode = true;
      this.signUpData.getEmailCodeMsg = this.signUpData.getEmailCodeTime + "s";
      var emailCheckTimerId = setInterval(() => {
        this.signUpData.getEmailCodeTime = this.signUpData.getEmailCodeTime - 1;
        this.signUpData.getEmailCodeMsg = this.signUpData.getEmailCodeTime + "s";
        if (this.signUpData.getEmailCodeTime == 0) {
          clearInterval(emailCheckTimerId);
          this.signUpData.getEmailCodeMsg = "重新获取";
          this.signUpData.getEmailCodeTime = 60;
          this.signUpData.isGettingEmailCode = false;
        }
      }, 1000);
    },
    signUp() {
      this.$refs.signUpForm.validate(isFormValid => {
        if (isFormValid) {
          c.ajaxPost({
            url: "/User/SignUp",
            data: JSON.stringify({
              signUpType: this.signUpData.signUpType,
              email: this.signUpData.email,
              emailCode: this.signUpData.emailCode,
              pwd: this.signUpData.pwd,
              phone: this.signUpData.phone,
              phoneCode: this.signUpData.phoneCode
            }),
            contentType: "application/json",
            loadingTarget: ".account-form"
          }).then(authResponse => {
            c.user.setToken(authResponse.data);
            this.$message({
              message: "注册成功",
              type: "success",
              duration: 500,
              onClose: () => {
                var redirectParam = c.urlParam("redirect");
                if (redirectParam != null) {
                  location.href = redirectParam;
                } else if (this.loginCallback != null) {
                  this.loginCallback();
                } else {
                  location.reload();
                }
              }
            });
          });
        } else {
          return false;
        }
      });
    },
    goFindPwd() {
      this.signInModuleType = "findPwd";
      this.findPwdData.findPwdStep = 0;
      this.findPwdData.account = "";
      this.findPwdData.authType = "";
      this.findPwdData.email = "";
      this.findPwdData.emailCode = "";
      this.findPwdData.phone = "";
      this.findPwdData.phoneCode = "";
    },
    getEmailCodeForFindPwd() {
      if (this.findPwdData.isGettingEmailCode) {
        return;
      }
      if (c.isNullOrEmpty(this.findPwdData.email)) {
        c.layerMsg("请输入邮箱");
        return;
      }
      if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(this.findPwdData.email.trim())) {
        c.layerMsg("邮箱格式输入错误");
        return;
      }
      c.ajaxGet({
        url: "/User/AccountExists?account=" + encodeURIComponent(this.findPwdData.email),
        loadingTarget: ".account-form"
      }).then(verifyResponse => {
        if (verifyResponse.data) {
          this.$refs.slideCaptchaByEmailForFindPwd.open();
        } else {
          this.$message.error("该邮箱未被注册");
        }
      });
    },
    checkCaptchaSuccessByEmailForFindPwd(emailCaptchaValue) {
      this.findPwdData.isGettingEmailCode = true;
      this.findPwdData.getEmailCodeMsg = this.findPwdData.getEmailCodeTime + "s";
      var emailTimerId = setInterval(() => {
        this.findPwdData.getEmailCodeTime = this.findPwdData.getEmailCodeTime - 1;
        this.findPwdData.getEmailCodeMsg = this.findPwdData.getEmailCodeTime + "s";
        if (this.findPwdData.getEmailCodeTime == 0) {
          clearInterval(emailTimerId);
          this.findPwdData.getEmailCodeMsg = "重新获取";
          this.findPwdData.getEmailCodeTime = 60;
          this.findPwdData.isGettingEmailCode = false;
        }
      }, 1000);
    },
    getPhoneCodeForFindPwd() {
      if (this.findPwdData.isGettingPhoneCode) {
        return;
      }
      if (c.isNullOrEmpty(this.findPwdData.phone)) {
        c.layerMsg("请输入手机号");
        return;
      }
      if (!/^[1][0-9]{10}$/.test(this.findPwdData.phone.trim())) {
        c.layerMsg("手机号输入错误");
        return;
      }
      c.ajaxGet({
        url: "/User/AccountExists?account=" + encodeURIComponent(this.findPwdData.phone),
        loadingTarget: ".account-form"
      }).then(emailResponse => {
        if (emailResponse.data) {
          this.$refs.slideCaptchaByPhoneForFindPwd.open();
        } else {
          this.$message.error("该手机号未被注册");
        }
      });
    },
    checkCaptchaSuccessByPhoneForFindPwd(phoneCaptchaValue) {
      this.findPwdData.isGettingPhoneCode = true;
      this.findPwdData.getPhoneCodeMsg = this.findPwdData.getPhoneCodeTime + "s";
      var phoneTimerId = setInterval(() => {
        this.findPwdData.getPhoneCodeTime = this.findPwdData.getPhoneCodeTime - 1;
        this.findPwdData.getPhoneCodeMsg = this.findPwdData.getPhoneCodeTime + "s";
        if (this.findPwdData.getPhoneCodeTime == 0) {
          clearInterval(phoneTimerId);
          this.findPwdData.getPhoneCodeMsg = "重新获取";
          this.findPwdData.getPhoneCodeTime = 60;
          this.findPwdData.isGettingPhoneCode = false;
        }
      }, 1000);
    },
    getAllAccount() {
      this.$refs.findPwdForm.validate(isEmailFormValid => {
        if (isEmailFormValid) {
          c.ajaxGet({
            url: "/User/GetAllAccount?account=" + encodeURIComponent(this.findPwdData.account),
            loadingTarget: ".account-form"
          }).then(phoneResponse => {
            if (!c.isNullOrEmpty(phoneResponse.data.email)) {
              this.findPwdData.email = phoneResponse.data.email;
              this.findPwdData.authType = "email";
            }
            if (!c.isNullOrEmpty(phoneResponse.data.phone)) {
              this.findPwdData.phone = phoneResponse.data.phone;
              if (c.isNullOrEmpty(this.findPwdData.authType)) {
                this.findPwdData.authType = "phone";
              }
            }
            this.findPwdData.findPwdStep = 1;
          });
        } else {
          return false;
        }
      });
    },
    identityAuth() {
      this.$refs.findPwdForm.validate(isPhoneFormValid => {
        if (isPhoneFormValid) {
          c.ajaxPost({
            url: "/User/IdentityAuth",
            data: JSON.stringify({
              authType: this.findPwdData.authType,
              account: this.findPwdData.authType == "email" ? this.findPwdData.email : this.findPwdData.phone,
              authVal: this.findPwdData.authType == "email" ? this.findPwdData.emailCode : this.findPwdData.phoneCode,
              customUID: this.customUID
            }),
            contentType: "application/json",
            loadingTarget: ".account-form"
          }).then(findPwdResponse => {
            this.findPwdData.findPwdStep = 2;
          });
        } else {
          return false;
        }
      });
    },
    resetPwd() {
      this.$refs.findPwdForm.validate(isFindPwdFormValid => {
        if (isFindPwdFormValid) {
          c.ajaxPost({
            url: "/User/ResetPwd",
            data: JSON.stringify({
              pwd: this.findPwdData.pwd,
              customUID: this.customUID
            }),
            contentType: "application/json",
            loadingTarget: ".account-form"
          }).then(resetResult => {
            this.$message({
              message: "密码重置成功",
              type: "success",
              duration: 1000,
              onClose: () => {
                this.signInModuleType = "signIn";
              }
            });
          });
        } else {
          return false;
        }
      });
    }
  }
};
var mainNavVueObj = Vue.createApp({
  components: {
    "sign-in": signIn
  },
  data() {
    return {
      showNavDrawer: false,
      keyword: c.urlParam("keyword"),
      searchInputFocus: false,
      toolData: null,
      menuPopoverDisabled: false,
      menuHoverActive: "",
      settingDialogVisible: false,
      soundOpen: true,
      isLogin: null,
      userSummary: null,
      signInDialogVisible: false,
      signInModuleTitle: "",
      loginCallback: null
    };
  },
  mounted() {
    this.getUserSummary();
    this.initToolData();
    var soundOpenStorage = c.localStorage.get("soundOpen");
    this.soundOpen = c.isNullOrEmpty(soundOpenStorage) ? true : JSON.parse(soundOpenStorage);
  },
  methods: {
    getUserSummary() {
      c.user.getUserSummary(() => {
        var userSummary = c.cookie.get("UserSummary");
        if (userSummary == null) {
          this.isLogin = false;
        } else {
          this.isLogin = true;
          this.userSummary = JSON.parse(userSummary);
        }
      });
    },
    initToolData() {
      if (typeof toolData != "undefined") {
        var optionsObject = {};
        for (var toolIndex = 0; toolIndex < toolData.length; toolIndex++) {
          optionsObject[toolData[toolIndex].key] = toolData[toolIndex];
        }
        this.toolData = optionsObject;
      }
    },
    menuShow(menuVisible) {
      this.menuHoverActive = menuVisible;
    },
    menuHide() {
      this.menuHoverActive = "";
    },
    menuMouseEnter() {
      this.menuPopoverDisabled = window.innerWidth < 768;
    },
    goSearch() {
      if (this.keyword == null) {
        this.keyword = "";
      } else {
        this.keyword = this.keyword.trim();
      }
      if (c.isNullOrEmpty(this.keyword)) {
        return;
      }
      location.href = websiteRoot + "/Search?keyword=" + encodeURIComponent(this.keyword);
    },
    switchTheme(themeMode) {
      if (themeMode.target.checked) {
        document.body.setAttribute("data-theme", "dark");
        c.cookie.set("theme", "dark", {
          minutes: 5256000
        });
        document.querySelectorAll(".theme-switch input[type=\"checkbox\"]").forEach(themeCheckbox => {
          themeCheckbox.checked = true;
        });
      } else {
        document.body.removeAttribute("data-theme");
        c.cookie.set("theme", "light", {
          minutes: 5256000
        });
        document.querySelectorAll(".theme-switch input[type=\"checkbox\"]").forEach(themeCheckboxEl => {
          themeCheckboxEl.checked = false;
        });
      }
    },
    switchSound() {
      this.soundOpen = !this.soundOpen;
      c.localStorage.set("soundOpen", this.soundOpen);
    },
    goSignIn(loginPayload) {
      if (typeof loginPayload === "function") {
        this.loginCallback = loginPayload;
      } else {
        this.loginCallback = null;
      }
      this.signInDialogVisible = true;
      setTimeout(() => {
        this.$refs.signIn.signInModuleType = "signIn";
      }, 100);
    },
    setSignInModuleTitle(titleText) {
      this.signInModuleTitle = titleText;
    }
  }
}).use(ElementPlus).mount(".main-nav");