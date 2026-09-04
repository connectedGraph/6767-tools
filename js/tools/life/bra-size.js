Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        upperBust: upperBust,
        underBust: underBust
      },
      computeResult: null
    };
  },
  mounted() {
    // 支持 /bra-size?upperBust=88&underBust=76 这类带参链接进入
    var upperBustParam = c.urlParam("upperBust");
    var underBustParam = c.urlParam("underBust");
    if (!c.isNullOrEmpty(upperBustParam)) {
      this.formData.upperBust = upperBustParam;
    }
    if (!c.isNullOrEmpty(underBustParam)) {
      this.formData.underBust = underBustParam;
    }
    this.refreshResult();
  },
  methods: {
    refreshResult() {
      var braSizeResult = this.computeBraSize();
      if (braSizeResult != null) {
        this.computeResult = locales.computeResult.replace("32/70A", "<span>" + braSizeResult + "</span>");
      } else {
        this.computeResult = null;
      }
    },
    computeBraSize() {
      var matchedBraSize = null;
      if (c.isNumber(this.formData.upperBust) && c.isNumber(this.formData.underBust)) {
        var braSizeTableData = ["32/70A", 68, 72, 80, 82, "32/70B", 68, 72, 83, 84, "32/70C", 68, 72, 85, 87, "32/70D", 68, 72, 88, 88, "34/75A", 73, 77, 85, 87, "34/75B", 73, 77, 88, 89, "34/75C", 73, 77, 90, 94, "34/75D", 73, 77, 95, 97, "34/75E", 73, 77, 98, 98, "36/80A", 78, 82, 90, 92, "36/80B", 78, 82, 93, 94, "36/80C", 78, 82, 95, 97, "36/80D", 78, 82, 98, 102, "36/80E", 78, 82, 103, 103, "38/85A", 83, 87, 95, 97, "38/85B", 83, 87, 99, 101, "38/85C", 83, 87, 101, 103, "38/85D", 83, 87, 103, 105, "40/90B", 88, 92, 103, 104, "40/90C", 88, 92, 105, 107, "40/90D", 88, 92, 108, 112, "40/90E", 88, 92, 113, 113];
        for (var braSizeRowIndex = 0; braSizeRowIndex < braSizeTableData.length / 5; braSizeRowIndex++) {
          if (this.formData.underBust >= braSizeTableData[braSizeRowIndex * 5 + 1] && this.formData.underBust <= braSizeTableData[braSizeRowIndex * 5 + 2] && this.formData.upperBust >= braSizeTableData[braSizeRowIndex * 5 + 3] && this.formData.upperBust <= braSizeTableData[braSizeRowIndex * 5 + 4]) {
            matchedBraSize = braSizeTableData[braSizeRowIndex * 5];
            break;
          }
        }
        if (matchedBraSize == null) {
          this.$message.error(locales.computeErrorTip);
        }
      }
      return matchedBraSize;
    },
    compute() {
      this.$refs.computeForm.validate(isFormValid => {
        if (isFormValid) {
          // 纯 SPA 页内计算，不跳转、不刷新，输入内容保留；
          // 仅用 replaceState 同步 URL，保持结果链接可分享
          this.refreshResult();
          history.replaceState(null, "", "?upperBust=" + this.formData.upperBust + "&underBust=" + this.formData.underBust);
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");