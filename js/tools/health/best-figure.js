c.preventCheat();
Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        height: height
      },
      chest: null,
      arm: null,
      waist: null,
      buttocks: null,
      thigh: null,
      calf: null
    };
  },
  mounted() {
    // 支持 /best-figure?height=165 这类带参链接进入
    var heightParam = c.urlParam("height");
    if (!c.isNullOrEmpty(heightParam)) {
      this.formData.height = heightParam;
    }
    this.refreshResult();
  },
  methods: {
    refreshResult() {
      if (!c.isNullOrEmpty(this.formData.height) && c.isNumber(this.formData.height)) {
        this.chest = Math.round(this.formData.height * 0.53 * 100) / 100;
        this.arm = Math.round(this.formData.height * 0.15 * 100) / 100;
        this.buttocks = Math.round(this.formData.height * 0.54 * 100) / 100;
        this.waist = Math.round(this.formData.height * 0.3657 * 100) / 100;
        this.thigh = Math.round((this.formData.height * 0.26 + 7.8) * 100) / 100;
        this.calf = Math.round(this.formData.height * 0.21 * 100) / 100;
      } else {
        this.chest = null;
        this.arm = null;
        this.buttocks = null;
        this.waist = null;
        this.thigh = null;
        this.calf = null;
      }
    },
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          // 纯 SPA 页内计算，不跳转、不刷新，输入内容保留；
          // 仅用 replaceState 同步 URL，保持结果链接可分享
          this.refreshResult();
          history.replaceState(null, "", "?height=" + this.formData.height);
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");