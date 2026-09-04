Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend,
    "el-date-picker-extend": elDatePickerExtend,
    "el-select-extend": elSelectExtend
  },
  data() {
    var validateTargetUrl = (param0, inputUrl, errorCallback) => {
      if (c.isNullOrEmpty(inputUrl)) {
        errorCallback(new Error(locales.pleaseEnter));
      } else {
        var hostWithoutProtocol = inputUrl.replace("http://", "").replace("https://", "");
        if (hostWithoutProtocol.substr(hostWithoutProtocol.length - 1) == "/") {
          hostWithoutProtocol = hostWithoutProtocol.substr(0, hostWithoutProtocol.length - 1);
        }
        if (c.isNullOrEmpty(hostWithoutProtocol)) {
          errorCallback(new Error(locales.pleaseEnter));
        } else if (!/^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/.test(hostWithoutProtocol) && !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostWithoutProtocol)) {
          errorCallback(new Error(locales.targetErrTip));
        } else {
          errorCallback();
        }
      }
    };
    var handlePortScan = (param1, portInput, scanCallback) => {
      var pendingPorts = [];
      var portList = portInput.trim().replace(/，/gi, ",").split(",");
      for (var portIndex = 0; portIndex < portList.length; portIndex++) {
        if (portList[portIndex].trim() != "") {
          if (!/^[1-9]\d*$/.test(portList[portIndex].trim())) {
            scanCallback(new Error(locales.portErrTip));
            return;
          }
          pendingPorts.push(portList[portIndex].trim());
        }
      }
      if (pendingPorts.length == 0) {
        scanCallback(new Error(locales.pleaseEnter));
      } else {
        scanCallback();
      }
    };
    return {
      formData: {
        target: null,
        port: "21,22,23,25,80,110,143,443,1433,3306,3389"
      },
      formDataRules: {
        target: [{
          required: true,
          message: locales.pleaseEnter,
          trigger: "blur"
        }, {
          validator: validateTargetUrl,
          trigger: "blur"
        }],
        port: [{
          required: true,
          message: locales.pleaseEnter,
          trigger: "blur"
        }, {
          validator: handlePortScan,
          trigger: "blur"
        }]
      },
      computeResult: null
    };
  },
  computed: {
    target() {
      var targetHost = this.formData.target.replace("http://", "").replace("https://", "");
      if (targetHost.substr(targetHost.length - 1) == "/") {
        targetHost = targetHost.substr(0, targetHost.length - 1);
      }
      return targetHost;
    },
    portArr() {
      var portsToScan = [];
      var portInputList = this.formData.port.trim().replace(/，/gi, ",").split(",");
      for (var portInputIndex = 0; portInputIndex < portInputList.length; portInputIndex++) {
        if (portInputList[portInputIndex].trim() != "") {
          portsToScan.push(portInputList[portInputIndex].trim());
        }
      }
      return portsToScan;
    }
  },
  methods: {
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          this.computeResult = {
            target: this.target,
            result: []
          };
          for (var portArrIndex = 0; portArrIndex < this.portArr.length; portArrIndex++) {
            this.computeResult.result.push({
              port: this.portArr[portArrIndex],
              state: null
            });
          }
          this.scanPort(c.clone(this.portArr), 0);
        }
      });
    },
    scanPort(host, resultIndex) {
      var resultPort = this.computeResult.result[resultIndex].port;
      c.ajaxGet({
        url: "/Tools/ScanPort?target=" + this.computeResult.target + "&port=" + resultPort,
        showLoading: false
      }).then(scanResponse => {
        this.computeResult.result[resultIndex].state = scanResponse.data;
        resultIndex += 1;
        if (resultIndex < host.length) {
          this.scanPort(host, resultIndex);
        }
      }).catch(error => {
        for (var resultIdx = 0; resultIdx < this.computeResult.result.length; resultIdx++) {
          if (this.computeResult.result[resultIdx].state == null) {
            this.computeResult.result[resultIdx].state = 0;
          }
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");