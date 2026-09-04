Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      formData: {
        text: "",
        splitStr: ","
      },
      computeResult: null,
      errorMsg: null
    };
  },
  computed: {
    computeResultHtml() {
      return this.computeResult.replace(/\n/gi, "<br>");
    }
  },
  mounted() {},
  methods: {
    convert(inputText) {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          this.errorMsg = locales.decodeErrTip;
          this.computeResult = null;
          this.errorMsg = null;
          try {
            if (inputText == "encode") {
              var resultArray = [];
              for (var charIndex = 0; charIndex < this.formData.text.length; charIndex++) {
                resultArray.push(this.formData.text.charCodeAt(charIndex));
              }
              this.computeResult = resultArray.join(this.formData.splitStr);
            } else {
              var resultArray = this.formData.text.split(this.formData.splitStr);
              var resultText = "";
              for (var charIndex = 0; charIndex < resultArray.length; charIndex++) {
                resultText += String.fromCharCode(resultArray[charIndex]);
              }
              if (resultText != "\0") {
                this.computeResult = resultText;
              } else {
                this.errorMsg = errorMsg;
              }
            }
          } catch (err) {
            this.errorMsg = errorMsg;
          }
        }
      });
    },
    copy() {
      c.copy(this.computeResult);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");