Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      formData: {
        text: ""
      },
      encodeLoading: false,
      decodeLoading: false,
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
    convert(sourceText) {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          this.computeResult = null;
          this.errorMsg = null;
          if (sourceText == "encode") {
            if (this.encodeLoading) {
              return;
            }
            this.encodeLoading = true;
          } else {
            if (this.decodeLoading) {
              return;
            }
            this.decodeLoading = true;
          }
          c.ajaxPost({
            url: "/Tools/Base64Convert",
            data: JSON.stringify({
              convertType: sourceText,
              convertContent: this.formData.text
            }),
            contentType: "application/json",
            showLoading: false,
            hideErrorMsg: true,
            completeCallBack: () => {
              if (sourceText == "encode") {
                this.encodeLoading = false;
              } else {
                this.decodeLoading = false;
              }
            }
          }).then(responseData => {
            this.computeResult = responseData.data;
          }).catch(error => {
            this.errorMsg = locales.decodeErrTip;
          });
        }
      });
    },
    copy() {
      c.copy(this.computeResult);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");