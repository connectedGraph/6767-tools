Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      createNumberDialogVisible: 0,
      createNumberFormData: {
        startNumber: 1,
        endNumber: 100,
        numberIntervalSize: 1,
        prefix: "",
        suffix: ""
      },
      formData: {
        text: "123456",
        format: "CODE128",
        width: 2,
        height: 60,
        background: "#ffffff",
        lineColor: "#000000",
        displayValue: true,
        fontSize: 18
      },
      createPercent: null,
      barcodeIndexArr: []
    };
  },
  methods: {
    createNumber() {
      this.$refs.createNumberForm.validate(createNumberFormValid => {
        if (createNumberFormValid) {
          var startNumberValue = Number(this.createNumberFormData.startNumber);
          var endNumberValue = Number(this.createNumberFormData.endNumber);
          var intervalSizeValue = Number(this.createNumberFormData.numberIntervalSize);
          var prefixText = this.createNumberFormData.prefix;
          var suffixText = this.createNumberFormData.suffix;
          var newlineChar = "\n";
          var emptyStr = "";
          var zeroValue = 0;
          var intervalSizeStr = String(this.createNumberFormData.numberIntervalSize);
          if (intervalSizeStr.indexOf(".") != -1) {
            zeroValue = intervalSizeStr.substring(intervalSizeStr.indexOf(".") + 1).length;
          }
          if (endNumberValue > startNumberValue) {
            for (let currentAscendingNum = startNumberValue; currentAscendingNum <= endNumberValue; currentAscendingNum += intervalSizeValue) {
              emptyStr += prefixText + currentAscendingNum.toFixed(zeroValue) + suffixText + (currentAscendingNum + intervalSizeValue > endNumberValue ? "" : newlineChar);
            }
          } else {
            for (let currentDescendingNum = startNumberValue; currentDescendingNum >= endNumberValue; currentDescendingNum -= intervalSizeValue) {
              emptyStr += prefixText + currentDescendingNum.toFixed(zeroValue) + suffixText + (currentDescendingNum - intervalSizeValue < endNumberValue ? "" : newlineChar);
            }
          }
          this.formData.text = emptyStr;
          this.createNumberDialogVisible = false;
          this.$message.success(locales.createSucc);
        }
      });
    },
    compute() {
      this.$refs.computeForm.validate(computeFormValid => {
        if (computeFormValid) {
          this.createPercent = 0;
          this.barcodeIndexArr = [];
          var linesArray = this.formData.text.split("\n");
          for (var lineIndex = 0; lineIndex < linesArray.length; lineIndex++) {
            if (!c.isNullOrEmpty(linesArray[lineIndex])) {
              this.barcodeIndexArr.push(lineIndex);
            }
          }
          setTimeout(() => {
            function* lineGeneratorFunc() {
              for (var generatorLineIndex = 0; generatorLineIndex < linesArray.length; generatorLineIndex++) {
                yield processLineFunc(generatorLineIndex);
              }
            }
            var processLineFunc = processedLineIndex => {
              if (c.isNullOrEmpty(linesArray[processedLineIndex])) {
                lineHandler(processedLineIndex);
              } else {
                try {
                  JsBarcode("#barcode" + processedLineIndex, linesArray[processedLineIndex], {
                    format: this.formData.format,
                    width: this.formData.width,
                    height: this.formData.height,
                    displayValue: this.formData.displayValue,
                    fontSize: this.formData.fontSize,
                    background: this.formData.background,
                    lineColor: this.formData.lineColor
                  });
                  lineHandler(processedLineIndex);
                } catch (error) {
                  this.createPercent = null;
                  this.$message({
                    message: "Content error",
                    type: "error",
                    grouping: true
                  });
                }
              }
            };
            var lineHandler = handlerLineIndex => {
              this.createPercent = ((handlerLineIndex + 1) / linesArray.length * 100).toFixed(0);
              if (handlerLineIndex + 1 < linesArray.length) {
                setTimeout(() => {
                  generatorObj.next();
                }, 10);
              }
            };
            var generatorObj = lineGeneratorFunc();
            generatorObj.next();
          }, 50);
        }
      });
    },
    downloadBarCode(barcodeId) {
      var downloadLink = document.createElement("a");
      var barcodeBlob = c.base64ToBlob(document.getElementById("barcode" + barcodeId).getAttribute("src"));
      downloadLink.download = barcodeId + 1 + ".png";
      downloadLink.href = URL.createObjectURL(barcodeBlob);
      downloadLink.click();
    },
    downloadAllBarCode() {
      var zipInstance = new JSZip();
      var barcodesFolder = zipInstance.folder("barcodes");
      for (var barcodeIndexPosition = 0; barcodeIndexPosition < this.barcodeIndexArr.length; barcodeIndexPosition++) {
        var barcodeSrc = document.getElementById("barcode" + this.barcodeIndexArr[barcodeIndexPosition]).getAttribute("src");
        barcodesFolder.file(barcodeIndexPosition + 1 + ".png", barcodeSrc.substring(barcodeSrc.indexOf("base64,") + 7), {
          base64: true
        });
      }
      zipInstance.generateAsync({
        type: "blob"
      }).then(function (generatedZipBlob) {
        saveAs(generatedZipBlob, "barcodes.zip");
      });
    }
  }
}).use(ElementPlus).mount(".main-body");