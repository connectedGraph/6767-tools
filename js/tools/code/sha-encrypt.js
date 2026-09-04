Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      formData: {
        text: null,
        algorithmSHA1: true,
        algorithmSHA3: true,
        algorithmSHA224: true,
        algorithmSHA256: true,
        algorithmSHA384: true,
        algorithmSHA512: true,
        algorithmRIPEMD160: true,
        uppercase: false
      },
      computeResult: null
    };
  },
  watch: {
    "formData.uppercase"(param0, param1) {
      if (this.computeResult != null) {
        for (var computeResultIndex = 0; computeResultIndex < this.computeResult.length; computeResultIndex++) {
          this.computeResult[computeResultIndex] = param0 ? this.computeResult[computeResultIndex].toUpperCase() : this.computeResult[computeResultIndex].toLowerCase();
        }
      }
    }
  },
  methods: {
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          if (!this.formData.algorithmSHA1 && !this.formData.algorithmSHA3 && !this.formData.algorithmSHA224 && !this.formData.algorithmSHA256 && !this.formData.algorithmSHA384 && !this.formData.algorithmSHA512 && !this.formData.algorithmRIPEMD160) {
            this.$message({
              message: locales.selectEncryptAlgorithmTip,
              type: "error",
              grouping: true
            });
            return;
          }
          var hashResults = [CryptoJS.SHA1(this.formData.text).toString(), CryptoJS.SHA3(this.formData.text).toString(), CryptoJS.SHA224(this.formData.text).toString(), CryptoJS.SHA256(this.formData.text).toString(), CryptoJS.SHA384(this.formData.text).toString(), CryptoJS.SHA512(this.formData.text).toString(), CryptoJS.RIPEMD160(this.formData.text).toString()];
          if (this.formData.uppercase) {
            for (var hashResultIndex = 0; hashResultIndex < hashResults.length; hashResultIndex++) {
              hashResults[hashResultIndex] = hashResults[hashResultIndex].toUpperCase();
            }
          }
          this.computeResult = hashResults;
        }
      });
    },
    copy(contentToCopy) {
      c.copy(this.computeResult[contentToCopy]);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");