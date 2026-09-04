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
  mounted() {},
  methods: {
    convert(input) {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          this.computeResult = null;
          this.errorMsg = null;
          try {
            if (input == "encode") {
              this.computeResult = c.unicodeConvert.encode(this.formData.text, true);
            } else {
              this.computeResult = c.unicodeConvert.decode(this.formData.text);
            }
          } catch (error) {
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