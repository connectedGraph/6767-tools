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
    encrypt() {
      this.$refs.computeForm.validate(formValid => {
        if (formValid) {
          this.computeResult = null;
          this.errorMsg = null;
          this.computeResult = CryptoJS.AES.encrypt(this.formData.text, this.formData.key, {
            mode: this.mode
          }).toString();
        }
      });
    },
    decrypt() {
      this.$refs.computeForm.validate(validationSucceeded => {
        if (validationSucceeded) {
          var decryptErrorTip1 = locales.decrypErrTip1;
          this.computeResult = null;
          this.errorMsg = null;
          try {
            var decryptedData = CryptoJS.AES.decrypt(this.formData.text, this.formData.key, {
              mode: this.mode
            }).toString(CryptoJS.enc.Utf8);
            if (!c.isNullOrEmpty(decryptedData)) {
              this.computeResult = decryptedData;
            } else {
              this.errorMsg = decryptErrorTip1;
            }
          } catch (decryptError) {
            this.errorMsg = decryptErrorTip1;
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