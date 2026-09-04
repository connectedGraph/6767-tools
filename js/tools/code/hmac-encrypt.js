Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      formData: {
        text: "",
        key: "",
        algorithmMD5: true,
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
        for (var resultKey in this.computeResult) {
          this.computeResult[resultKey] = param0 ? this.computeResult[resultKey].toUpperCase() : this.computeResult[resultKey].toLowerCase();
        }
      }
    }
  },
  methods: {
    compute() {
      this.$refs.computeForm.validate(valid => {
        if (valid) {
          if (!this.formData.algorithmMD5 && !this.formData.algorithmSHA1 && !this.formData.algorithmSHA3 && !this.formData.algorithmSHA224 && !this.formData.algorithmSHA256 && !this.formData.algorithmSHA384 && !this.formData.algorithmSHA512 && !this.formData.algorithmRIPEMD160) {
            this.$message({
              message: locales.selectEncryptAlgorithmTip,
              type: "error",
              grouping: true
            });
            return;
          }
          var mappingObj = {
            MD5: CryptoJS.HmacMD5(this.formData.text, this.formData.key).toString(),
            SHA1: CryptoJS.HmacSHA1(this.formData.text, this.formData.key).toString(),
            SHA3: CryptoJS.HmacSHA3(this.formData.text, this.formData.key).toString(),
            SHA224: CryptoJS.HmacSHA224(this.formData.text, this.formData.key).toString(),
            SHA256: CryptoJS.HmacSHA256(this.formData.text, this.formData.key).toString(),
            SHA384: CryptoJS.HmacSHA384(this.formData.text, this.formData.key).toString(),
            SHA512: CryptoJS.HmacSHA512(this.formData.text, this.formData.key).toString(),
            RIPEMD160: CryptoJS.HmacRIPEMD160(this.formData.text, this.formData.key).toString()
          };
          if (this.formData.uppercase) {
            for (var mapKey in mappingObj) {
              mappingObj[mapKey] = mappingObj[mapKey].toUpperCase();
            }
          }
          this.computeResult = mappingObj;
        }
      });
    },
    copy(source) {
      c.copy(this.computeResult[source]);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");