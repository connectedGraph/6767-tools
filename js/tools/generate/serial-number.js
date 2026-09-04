Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        startNumber: 1,
        endNumber: 100,
        numberIntervalSize: 1,
        prefix: "",
        suffix: "",
        splitStr: ""
      },
      serialNumber: null
    };
  },
  mounted() {},
  methods: {
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          var startNumberValue = Number(this.formData.startNumber);
          var endNumberValue = Number(this.formData.endNumber);
          var intervalSizeValue = Number(this.formData.numberIntervalSize);
          var prefixValue = this.formData.prefix;
          var suffixValue = this.formData.suffix;
          var splitStrValue = this.formData.splitStr;
          if (splitStrValue == "") {
            splitStrValue = "\n";
          }
          var generatedSerial = "";
          var counter = 0;
          var intervalSizeStr = String(this.formData.numberIntervalSize);
          if (intervalSizeStr.indexOf(".") != -1) {
            counter = intervalSizeStr.substring(intervalSizeStr.indexOf(".") + 1).length;
          }
          if (endNumberValue > startNumberValue) {
            for (var currentNumber = startNumberValue; currentNumber <= endNumberValue; currentNumber += intervalSizeValue) {
              generatedSerial += prefixValue + currentNumber.toFixed(counter) + suffixValue + (currentNumber + intervalSizeValue > endNumberValue ? "" : splitStrValue);
            }
          } else {
            for (var currentNumber = startNumberValue; currentNumber >= endNumberValue; currentNumber -= intervalSizeValue) {
              generatedSerial += prefixValue + currentNumber.toFixed(counter) + suffixValue + (currentNumber - intervalSizeValue < endNumberValue ? "" : splitStrValue);
            }
          }
          this.serialNumber = generatedSerial;
        }
      });
    },
    copy() {
      c.copy(this.serialNumber);
      this.$message.success(locales.copySuccess);
    },
    download() {
      c.downloadTxt("serial-number.txt", this.serialNumber);
    }
  }
}).use(ElementPlus).mount(".main-body");