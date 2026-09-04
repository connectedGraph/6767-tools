Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      formData: {
        text: "",
        key: "",
        mode: "CBC"
      },
      computeResult: null,
      errorMsg: null
    };
  },
  computed: {
    mode() {
      if (this.formData.mode == "CBC") {
        return CryptoJS.mode.CBC;
      } else if (this.formData.mode == "CFB") {
        return CryptoJS.mode.CFB;
      } else if (this.formData.mode == "CTR") {
        return CryptoJS.mode.CTR;
      } else if (this.formData.mode == "OFB") {
        return CryptoJS.mode.OFB;
      } else if (this.formData.mode == "ECB") {
        return CryptoJS.mode.ECB;
      }
    },
    computeResultHtml() {
      return this.computeResult.replace(/\n/gi, "<br>");
    }
  },
  methods: {
    desEncrypt() {
      this.$refs.computeForm.validate(formValid1 => {
        if (formValid1) {
          this.computeResult = null;
          this.errorMsg = null;
          this.computeResult = CryptoJS.DES.encrypt(this.formData.text, this.formData.key, {
            mode: this.mode
          }).toString();
        }
      });
    },
    desDecrypt() {
      this.$refs.computeForm.validate(formValid2 => {
        if (formValid2) {
          var decrypErrTip1Text1 = locales.decrypErrTip1;
          this.computeResult = null;
          this.errorMsg = null;
          try {
            var desDecryptedText = CryptoJS.DES.decrypt(this.formData.text, this.formData.key, {
              mode: this.mode
            }).toString(CryptoJS.enc.Utf8);
            if (!c.isNullOrEmpty(desDecryptedText)) {
              this.computeResult = desDecryptedText;
            } else {
              this.errorMsg = decrypErrTip1Text1;
            }
          } catch (desDecryptError) {
            this.errorMsg = decrypErrTip1Text1;
          }
        }
      });
    },
    tripleDesEecrypt() {
      this.$refs.computeForm.validate(formValid3 => {
        if (formValid3) {
          this.computeResult = null;
          this.errorMsg = null;
          this.computeResult = CryptoJS.TripleDES.encrypt(this.formData.text, this.formData.key, {
            mode: this.mode
          }).toString();
        }
      });
    },
    tripleDesDecrypt() {
      this.$refs.computeForm.validate(formValid4 => {
        if (formValid4) {
          var decrypErrTip1Text2 = locales.decrypErrTip1;
          this.computeResult = null;
          this.errorMsg = null;
          try {
            var tripleDesDecryptedText = CryptoJS.TripleDES.decrypt(this.formData.text, this.formData.key, {
              mode: this.mode
            }).toString(CryptoJS.enc.Utf8);
            if (!c.isNullOrEmpty(tripleDesDecryptedText)) {
              this.computeResult = tripleDesDecryptedText;
            } else {
              this.errorMsg = decrypErrTip1Text2;
            }
          } catch (tripleDesDecryptError) {
            this.errorMsg = decrypErrTip1Text2;
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