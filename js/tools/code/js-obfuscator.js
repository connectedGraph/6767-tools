Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      tabActiveName: "code",
      code: "// Paste your JavaScript code here\nfunction hi() {\n    console.log(\"Hello World!\");\n}\nhi();",
      outputCode: "",
      options: {
        compact: true,
        controlFlowFlattening: false,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: false,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: false,
        debugProtectionInterval: 4000,
        disableConsoleOutput: false,
        domainLock: [],
        domainLockRedirectUrl: "about:blank",
        forceTransformStrings: [],
        identifierNamesCache: null,
        identifierNamesGenerator: "hexadecimal",
        identifiersDictionary: [],
        identifiersPrefix: "",
        ignoreImports: false,
        inputFileName: "",
        log: false,
        numbersToExpressions: false,
        optionsPreset: "default",
        renameGlobals: false,
        renameProperties: false,
        renamePropertiesMode: "safe",
        reservedNames: [],
        reservedStrings: [],
        seed: 0,
        selfDefending: false,
        simplify: true,
        sourceMap: false,
        sourceMapBaseUrl: "",
        sourceMapFileName: "",
        sourceMapMode: "separate",
        sourceMapSourcesMode: "sources-content",
        splitStrings: false,
        splitStringsChunkLength: 10,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 0.5,
        stringArrayEncoding: [],
        stringArrayIndexesType: ["hexadecimal-number"],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 1,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 2,
        stringArrayWrappersType: "variable",
        stringArrayThreshold: 0.75,
        target: "browser",
        transformObjectKeys: false,
        unicodeEscapeSequence: false
      },
      optionsPreset: {
        default: {
          compact: true,
          controlFlowFlattening: false,
          deadCodeInjection: false,
          debugProtection: false,
          debugProtectionInterval: 4000,
          disableConsoleOutput: false,
          identifierNamesGenerator: "hexadecimal",
          log: false,
          numbersToExpressions: false,
          renameGlobals: false,
          selfDefending: false,
          simplify: true,
          splitStrings: false,
          stringArray: true,
          stringArrayCallsTransform: false,
          stringArrayCallsTransformThreshold: 0.5,
          stringArrayEncoding: [],
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          stringArrayWrappersCount: 1,
          stringArrayWrappersChainedCalls: true,
          stringArrayWrappersParametersMaxCount: 2,
          stringArrayWrappersType: "variable",
          stringArrayThreshold: 0.75,
          unicodeEscapeSequence: false
        },
        "low-obfuscation": {
          compact: true,
          controlFlowFlattening: false,
          deadCodeInjection: false,
          debugProtection: false,
          debugProtectionInterval: 4000,
          disableConsoleOutput: true,
          identifierNamesGenerator: "hexadecimal",
          log: false,
          numbersToExpressions: false,
          renameGlobals: false,
          selfDefending: true,
          simplify: true,
          splitStrings: false,
          stringArray: true,
          stringArrayCallsTransform: false,
          stringArrayEncoding: [],
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          stringArrayWrappersCount: 1,
          stringArrayWrappersChainedCalls: true,
          stringArrayWrappersParametersMaxCount: 2,
          stringArrayWrappersType: "variable",
          stringArrayThreshold: 0.75,
          unicodeEscapeSequence: false
        },
        "medium-obfuscation": {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.4,
          debugProtection: false,
          debugProtectionInterval: 4000,
          disableConsoleOutput: true,
          identifierNamesGenerator: "hexadecimal",
          log: false,
          numbersToExpressions: true,
          renameGlobals: false,
          selfDefending: true,
          simplify: true,
          splitStrings: true,
          splitStringsChunkLength: 10,
          stringArray: true,
          stringArrayCallsTransform: true,
          stringArrayCallsTransformThreshold: 0.75,
          stringArrayEncoding: ["base64"],
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          stringArrayWrappersCount: 2,
          stringArrayWrappersChainedCalls: true,
          stringArrayWrappersParametersMaxCount: 4,
          stringArrayWrappersType: "function",
          stringArrayThreshold: 0.75,
          transformObjectKeys: true,
          unicodeEscapeSequence: false
        },
        "high-obfuscation": {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 1,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 1,
          debugProtection: true,
          debugProtectionInterval: 4000,
          disableConsoleOutput: true,
          identifierNamesGenerator: "hexadecimal",
          log: false,
          numbersToExpressions: true,
          renameGlobals: false,
          selfDefending: true,
          simplify: true,
          splitStrings: true,
          splitStringsChunkLength: 5,
          stringArray: true,
          stringArrayCallsTransform: true,
          stringArrayEncoding: ["rc4"],
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          stringArrayWrappersCount: 5,
          stringArrayWrappersChainedCalls: true,
          stringArrayWrappersParametersMaxCount: 5,
          stringArrayWrappersType: "function",
          stringArrayThreshold: 1,
          transformObjectKeys: true,
          unicodeEscapeSequence: false
        }
      },
      domainLockInputValue: "",
      forceTransformStringsInputValue: "",
      reservedStringsInputValue: "",
      reservedNamesInputValue: ""
    };
  },
  computed: {
    codeSize() {
      if (c.isNullOrEmpty(this.code)) {
        return "";
      }
      var codeBlob = new Blob([this.code]);
      return "(" + c.transSizeDesc(codeBlob.size) + ")";
    },
    outputCodeSize() {
      if (c.isNullOrEmpty(this.outputCode)) {
        return "";
      }
      var outputCodeBlob = new Blob([this.outputCode]);
      return "(" + c.transSizeDesc(outputCodeBlob.size) + ")";
    }
  },
  watch: {
    "options.optionsPreset": {
      handler: function (newVal, oldVal) {
        Object.assign(this.options, this.optionsPreset[this.options.optionsPreset]);
      },
      immediate: true
    }
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
    this.dragEventBind();
  },
  methods: {
    dragEventBind() {
      var self = this;
      function handleFileListData(fileListData) {
        self.addFileListData(fileListData);
      }
      var chooseFileCoverEl = document.querySelector(".choose-file-cover");
      chooseFileCoverEl.addEventListener("dragenter", function (dragEnterEvent) {
        dragEnterEvent.preventDefault();
        dragEnterEvent.stopPropagation();
      }, false);
      chooseFileCoverEl.addEventListener("dragover", function (dragOverEvent) {
        dragOverEvent.dataTransfer.dropEffect = "copy";
        dragOverEvent.preventDefault();
        dragOverEvent.stopPropagation();
      }, false);
      chooseFileCoverEl.addEventListener("dragleave", function (dragLeaveEvent) {
        dragLeaveEvent.preventDefault();
        dragLeaveEvent.stopPropagation();
      }, false);
      chooseFileCoverEl.addEventListener("drop", function (dropEvent) {
        dropEvent.preventDefault();
        dropEvent.stopPropagation();
        var dataTransfer = dropEvent.dataTransfer;
        var fileList = [];
        var fileCount = 0;
        var totalFiles = dataTransfer.files.length;
        function handleAllFilesUploaded() {
          if (fileCount === totalFiles - 1) {
            handleFileListData(fileList);
          }
          fileCount++;
        }
        if (dataTransfer.items !== undefined) {
          for (var index = 0; index < dataTransfer.items.length; index++) {
            var dataTransferItem = dataTransfer.items[index];
            if (dataTransferItem.kind === "file" && dataTransferItem.webkitGetAsEntry().isFile) {
              var itemFile = dataTransferItem.getAsFile();
              fileList.push(itemFile);
            }
          }
          handleFileListData(fileList);
        } else {
          for (var index = 0; index < totalFiles; index++) {
            var file = dataTransfer.files[index];
            if (file.type) {
              fileList.push(file);
              handleAllFilesUploaded();
            } else {
              try {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file.slice(0, 3));
                fileReader.addEventListener("load", function (loadEvent) {
                  console.log(loadEvent, "load");
                  fileList.push(file);
                  handleAllFilesUploaded();
                }, false);
                fileReader.addEventListener("error", function (errorEvent) {
                  console.log(errorEvent, "error，cannot upload folder");
                  handleAllFilesUploaded();
                }, false);
              } catch (error) {
                console.log(error, "catch error，cannot upload folder");
                handleAllFilesUploaded();
              }
            }
          }
        }
      }, false);
    },
    selectFile() {
      document.getElementById("flFile").click();
    },
    handleFileSelect(selectedFiles) {
      this.addFileListData(selectedFiles.target.files);
      document.getElementById("flFile").value = null;
    },
    addFileListData(fileListData) {
      for (var loopIndex = 0; loopIndex < fileListData.length; loopIndex++) {
        var fileExtension = fileListData[loopIndex].name.substring(fileListData[loopIndex].name.lastIndexOf(".") + 1).toLowerCase();
        if (fileExtension != "js") {
          continue;
        }
        var previewFileReader = new FileReader();
        previewFileReader.readAsText(fileListData[loopIndex]);
        previewFileReader.onload = previewLoadEvent => {
          this.code = previewLoadEvent.target.result;
          this.tabActiveName = "code";
        };
        break;
      }
    },
    obfuscator() {
      if (!c.isNullOrEmpty(this.code)) {
        var obfuscationResult = JavaScriptObfuscator.obfuscate(this.code, this.options);
        this.outputCode = obfuscationResult.getObfuscatedCode();
      } else {
        this.outputCode = "";
      }
      this.tabActiveName = "outputCode";
    },
    downloadOutputCode() {
      c.downloadTxt("js-obfuscator.js", this.outputCode);
    },
    copyOutputCode() {
      c.copy(this.outputCode);
      this.$message.success(locales.copySuccess);
    },
    domainLockInputConfirm() {
      if (!c.isNullOrEmpty(this.domainLockInputValue)) {
        this.options.domainLock.push(this.domainLockInputValue);
        this.domainLockInputValue = "";
      }
    },
    removeDomainLock(sourceCode) {
      this.options.domainLock.splice(this.options.domainLock.indexOf(sourceCode), 1);
    },
    forceTransformStringsInputConfirm() {
      if (!c.isNullOrEmpty(this.forceTransformStringsInputValue)) {
        this.options.forceTransformStrings.push(this.forceTransformStringsInputValue);
        this.forceTransformStringsInputValue = "";
      }
    },
    removeForceTransformStrings(code) {
      this.options.forceTransformStrings.splice(this.options.forceTransformStrings.indexOf(code), 1);
    },
    reservedStringsInputConfirm() {
      if (!c.isNullOrEmpty(this.reservedStringsInputValue)) {
        this.options.reservedStrings.push(this.reservedStringsInputValue);
        this.reservedStringsInputValue = "";
      }
    },
    removeReservedStrings(inputCode) {
      this.options.reservedStrings.splice(this.options.reservedStrings.indexOf(inputCode), 1);
    },
    reservedNamesInputConfirm() {
      if (!c.isNullOrEmpty(this.reservedNamesInputValue)) {
        this.options.reservedNames.push(this.reservedNamesInputValue);
        this.reservedNamesInputValue = "";
      }
    },
    removeReservedNames(reservedNameToRemove) {
      this.options.reservedNames.splice(this.options.reservedNames.indexOf(reservedNameToRemove), 1);
    }
  }
}).use(ElementPlus).mount(".main-body");