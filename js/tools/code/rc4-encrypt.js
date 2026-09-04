Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      formData: {
        text: "",
        key: ""
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
    encrypt() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          this.computeResult = null;
          this.errorMsg = null;
          this.computeResult = CryptoJS.Rabbit.encrypt(this.formData.text, this.formData.key).toString();
        }
      });
    },
    decrypt() {
      this.$refs.computeForm.validate(validationErrors => {
        if (validationErrors) {
          var decryptErrorTip = locales.decrypErrTip2;
          this.computeResult = null;
          this.errorMsg = null;
          try {
            var decryptedText = CryptoJS.Rabbit.decrypt(this.formData.text, this.formData.key).toString(CryptoJS.enc.Utf8);
            if (!c.isNullOrEmpty(decryptedText)) {
              this.computeResult = decryptedText;
            } else {
              this.errorMsg = decryptErrorTip;
            }
          } catch (error) {
            this.errorMsg = decryptErrorTip;
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