Vue.createApp({
  components: {
    comment: comment,
    "my-div-input": myDivInput
  },
  data() {
    return {
      formData: {
        number: 50000
      },
      min: 1,
      max: 1000000,
      querying: false,
      pi: null,
      queryResult: null
    };
  },
  methods: {
    compute() {
      this.querying = true;
      if (this.queryResult != null) {
        this.queryResult = "";
      }
      setTimeout(() => {
        if (c.isNullOrEmpty(this.pi) || this.formData.number + 2 > this.pi.length) {
          c.ajaxGet({
            url: "/Tools/PiQuery?length=" + this.formData.number,
            showLoading: false
          }).then(promiseResult => {
            this.pi = promiseResult.data;
            this.queryResult = this.pi;
            this.querying = false;
          });
        } else {
          this.queryResult = this.pi.substring(0, this.formData.number + 2);
          this.querying = false;
        }
      }, 100);
    },
    downloadText() {
      c.downloadTxt("pi.txt", this.queryResult);
    },
    copyText() {
      c.copy(this.queryResult);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");