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
    "formData.uppercase"(shouldUppercase, param0) {
      if (this.computeResult != null) {
        this.computeResult = shouldUppercase ? this.computeResult.toUpperCase() : this.computeResult.toLowerCase();
      }
    }
  },
  methods: {
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          var ripemd160Hash = CryptoJS.RIPEMD160(this.formData.text).toString();
          if (this.formData.uppercase) {
            ripemd160Hash = ripemd160Hash.toUpperCase();
          }
          this.computeResult = ripemd160Hash;
        }
      });
    },
    copy(copyText) {
      c.copy(this.computeResult);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");