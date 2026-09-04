Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        height: height,
        weight: weight
      },
      computeResult: null
    };
  },
  mounted() {
    // 支持 /man-clothing-size?height=175&weight=65 这类带参链接进入
    var heightParam = c.urlParam("height");
    var weightParam = c.urlParam("weight");
    if (!c.isNullOrEmpty(heightParam)) {
      this.formData.height = heightParam;
    }
    if (!c.isNullOrEmpty(weightParam)) {
      this.formData.weight = weightParam;
    }
    this.refreshResult();
  },
  methods: {
    refreshResult() {
      var braSize = this.computeBraSize();
      if (braSize != null) {
        this.computeResult = locales.computeResult.replace("XXXL", "<span>" + braSize + "</span>");
      } else {
        this.computeResult = null;
      }
    },
    computeBraSize() {
      var ref0 = null;
      if (c.isNumber(this.formData.height) && c.isNumber(this.formData.weight)) {
        var sizeChartData = [44, 85, 115, 153, 163, 44, 85, 105, 163, 168, 44, 85, 95, 168, 173, 46, 115, 135, 153, 163, 46, 135, 145, 153, 158, 46, 105, 125, 163, 168, 46, 95, 115, 168, 173, 46, 95, 105, 173, 178, 48, 145, 165, 153, 158, 48, 135, 155, 158, 163, 48, 125, 145, 163, 168, 48, 115, 145, 168, 173, 48, 105, 125, 173, 178, 48, 105, 115, 178, 183, 50, 165, 185, 153, 158, 50, 155, 175, 158, 163, 50, 145, 165, 163, 168, 50, 145, 155, 168, 173, 50, 125, 155, 173, 178, 50, 115, 135, 178, 183, 50, 115, 125, 183, 188, 52, 175, 195, 158, 163, 52, 165, 185, 163, 168, 52, 155, 175, 168, 173, 52, 155, 165, 173, 183, 52, 135, 155, 178, 183, 52, 125, 145, 183, 188, 52, 125, 135, 188, 193, 54, 185, 195, 163, 173, 54, 175, 185, 168, 178, 54, 165, 175, 173, 188, 54, 145, 165, 183, 188, 54, 135, 155, 188, 193, 56, 195, 215, 168, 183, 56, 185, 195, 173, 193, 56, 175, 185, 178, 193, 56, 155, 175, 188, 193, 58, 195, 215, 183, 193];
        for (var sizeChartIndex = 0; sizeChartIndex < sizeChartData.length / 5; sizeChartIndex++) {
          if (this.formData.weight * 2 >= sizeChartData[sizeChartIndex * 5 + 1] && this.formData.weight * 2 <= sizeChartData[sizeChartIndex * 5 + 2] && this.formData.height >= sizeChartData[sizeChartIndex * 5 + 3] && this.formData.height <= sizeChartData[sizeChartIndex * 5 + 4]) {
            ref0 = sizeChartData[sizeChartIndex * 5];
            break;
          }
        }
        switch (ref0) {
          case 44:
            ref0 = "XS";
            break;
          case 46:
            ref0 = "S";
            break;
          case 48:
            ref0 = "M";
            break;
          case 50:
            ref0 = "L";
            break;
          case 52:
            ref0 = "XL";
            break;
          case 54:
            ref0 = "XXL";
            break;
          case 56:
            ref0 = "XXXL";
            break;
        }
        if (ref0 == null) {
          this.$message.error(locales.computeErrorTip);
        }
      }
      return ref0;
    },
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          // 纯 SPA 页内计算，不跳转、不刷新，输入内容保留；
          // 仅用 replaceState 同步 URL，保持结果链接可分享
          this.refreshResult();
          history.replaceState(null, "", "?height=" + this.formData.height + "&weight=" + this.formData.weight);
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");