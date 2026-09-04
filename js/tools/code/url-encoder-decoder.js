Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      formData: {
        text: ""
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
  methods: {
    convert(inputText) {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          this.computeResult = null;
          this.errorMsg = null;
          try {
            if (inputText == "encode") {
              this.computeResult = encodeURI(this.formData.text);
            } else {
              this.computeResult = decodeURIComponent(this.formData.text);
            }
          } catch (err) {
            this.errorMsg = locales.decodeErrTip;
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