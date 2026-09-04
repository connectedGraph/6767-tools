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
  methods: {
    encrypt() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          this.computeResult = null;
          this.errorMsg = null;
          this.computeResult = CryptoJS.RC4.encrypt(this.formData.text, this.formData.key).toString();
        }
      });
    },
    decrypt() {
      this.$refs.computeForm.validate(isFormValid => {
        if (isFormValid) {
          var decryptionErrorTipText = locales.decrypErrTip2;
          this.computeResult = null;
          this.errorMsg = null;
          try {
            var decryptedText = CryptoJS.RC4.decrypt(this.formData.text, this.formData.key).toString(CryptoJS.enc.Utf8);
            if (!c.isNullOrEmpty(decryptedText)) {
              this.computeResult = decryptedText;
            } else {
              this.errorMsg = decryptionErrorTipText;
            }
          } catch (decryptError) {
            this.errorMsg = decryptionErrorTipText;
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