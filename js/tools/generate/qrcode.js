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
        size: 200,
        margin: 10,
        colorDark: "#000000",
        colorLight: "#FFFFFF",
        logoImage: null
      },
      createPercent: null,
      qrcodeIndexArr: []
    };
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
  },
  methods: {
    createNumber() {
      this.$refs.createNumberForm.validate(isValid => {
        if (isValid) {
          var startNumberValue = Number(this.createNumberFormData.startNumber);
          var endNumberValue = Number(this.createNumberFormData.endNumber);
          var intervalSizeNum = Number(this.createNumberFormData.numberIntervalSize);
          var prefixValue = this.createNumberFormData.prefix;
          var suffixValue = this.createNumberFormData.suffix;
          var newlineChar = "\n";
          var emptyString = "";
          var zeroConstant = 0;
          var intervalSizeString = String(this.createNumberFormData.numberIntervalSize);
          if (intervalSizeString.indexOf(".") != -1) {
            zeroConstant = intervalSizeString.substring(intervalSizeString.indexOf(".") + 1).length;
          }
          if (endNumberValue > startNumberValue) {
            for (let currentNumAsc = startNumberValue; currentNumAsc <= endNumberValue; currentNumAsc += intervalSizeNum) {
              emptyString += prefixValue + currentNumAsc.toFixed(zeroConstant) + suffixValue + (currentNumAsc + intervalSizeNum > endNumberValue ? "" : newlineChar);
            }
          } else {
            for (let currentNumDesc = startNumberValue; currentNumDesc >= endNumberValue; currentNumDesc -= intervalSizeNum) {
              emptyString += prefixValue + currentNumDesc.toFixed(zeroConstant) + suffixValue + (currentNumDesc - intervalSizeNum < endNumberValue ? "" : newlineChar);
            }
          }
          this.formData.text = emptyString;
          this.createNumberDialogVisible = false;
          this.$message.success(locales.createSucc);
        }
      });
    },
    selectLogoImg() {
      document.getElementById("flFile").click();
    },
    handleFileSelect(fileEvent) {
      var fileList = fileEvent.target.files;
      for (var fileIndex = 0, currentFile; currentFile = fileList[fileIndex]; fileIndex++) {
        if (!currentFile.type.match("image.*")) {
          continue;
        }
        var fileReader = new FileReader();
        fileReader.onload = (loadEvent => {
          return resultEvent => {
            c.compressImg(resultEvent.target.result, 80, 250, 250, compressedResult => {
              document.getElementById("flFile").value = "";
              this.formData.logoImage = compressedResult;
            });
          };
        })(currentFile);
        fileReader.readAsDataURL(currentFile);
      }
      document.getElementById("flFile").value = null;
    },
    deleteLogoImg() {
      this.formData.logoImage = null;
    },
    createQRCode(elementId, qrText, qrOptions) {
      const qrContainer = document.getElementById(elementId);
      qrContainer.style.width = this.formData.size + "px";
      qrContainer.style.height = this.formData.size + "px";
      new AwesomeQR.AwesomeQR({
        text: qrText,
        size: this.formData.size,
        margin: this.formData.margin,
        colorDark: this.formData.colorDark,
        colorLight: this.formData.colorLight,
        logoImage: this.formData.logoImage,
        logoScale: 0.23,
        logoCornerRadius: 4
      }).draw().then(drawnResult => {
        qrContainer.setAttribute("src", drawnResult);
        if (qrOptions) {
          qrOptions();
        }
      }).catch(error => {
        console.error(error);
      });
    },
    compute() {
      this.$refs.computeForm.validate(computeFormValid => {
        if (computeFormValid) {
          this.createPercent = 0;
          this.qrcodeIndexArr = [];
          var lines = this.formData.text.split("\n");
          for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            if (!c.isNullOrEmpty(lines[lineIndex])) {
              this.qrcodeIndexArr.push(lineIndex);
            }
          }
          setTimeout(() => {
            function* qrGenerator() {
              for (var lineLoopIndex = 0; lineLoopIndex < lines.length; lineLoopIndex++) {
                yield makeQrCode(lineLoopIndex);
              }
            }
            var makeQrCode = index => {
              if (c.isNullOrEmpty(lines[index])) {
                processQrIndex(index);
              } else {
                var targetId = "qrcode" + index;
                this.createQRCode(targetId, lines[index], () => {
                  processQrIndex(index);
                });
              }
            };
            var processQrIndex = qrIndex => {
              this.createPercent = ((qrIndex + 1) / lines.length * 100).toFixed(0);
              if (qrIndex + 1 < lines.length) {
                setTimeout(() => {
                  generatorIterator.next();
                }, 10);
              }
            };
            var generatorIterator = qrGenerator();
            generatorIterator.next();
          }, 50);
        }
      });
    },
    downloadQRCode(downloadIndex) {
      var downloadLink = document.createElement("a");
      var imageBlob = c.base64ToBlob(document.getElementById("qrcode" + downloadIndex).getAttribute("src"));
      downloadLink.download = downloadIndex + 1 + ".png";
      downloadLink.href = URL.createObjectURL(imageBlob);
      downloadLink.click();
    },
    downloadAllQRCode() {
      var zipInstance = new JSZip();
      var zipFolder = zipInstance.folder("qrcodes");
      for (var qrcodeIndexLoop = 0; qrcodeIndexLoop < this.qrcodeIndexArr.length; qrcodeIndexLoop++) {
        var qrImageElement = document.getElementById("qrcode" + this.qrcodeIndexArr[qrcodeIndexLoop]);
        var imageSrc = qrImageElement.getAttribute("src");
        zipFolder.file(qrcodeIndexLoop + 1 + ".png", imageSrc.substring(imageSrc.indexOf("base64,") + 7), {
          base64: true
        });
      }
      zipInstance.generateAsync({
        type: "blob"
      }).then(function (zipBlob) {
        saveAs(zipBlob, "qrcodes.zip");
      });
    }
  }
}).use(ElementPlus).mount(".main-body");