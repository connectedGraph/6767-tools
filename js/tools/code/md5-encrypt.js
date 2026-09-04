Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      formData: {
        text: null,
        uppercase: false
      },
      computeResult: null
    };
  },
  watch: {
    "formData.uppercase"(formDataInstance, param0) {
      if (this.computeResult != null) {
        for (var loopIndex = 0; loopIndex < this.computeResult.length; loopIndex++) {
          this.computeResult[loopIndex] = formDataInstance ? this.computeResult[loopIndex].toUpperCase() : this.computeResult[loopIndex].toLowerCase();
        }
      }
    }
  },
  methods: {
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          var md5Hash = CryptoJS.MD5(this.formData.text).toString();
          if (this.formData.uppercase) {
            md5Hash = md5Hash.toUpperCase();
          }
          this.computeResult = [md5Hash, md5Hash.substr(8, 16)];
        }
      });
    },
    copy(contentToCopy) {
      c.copy(this.computeResult[contentToCopy]);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");