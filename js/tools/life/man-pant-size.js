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
    // 支持 /man-pant-size?height=175&weight=65 这类带参链接进入
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
      var pantSizeValue = this.computeBraSize();
      if (pantSizeValue != null) {
        this.computeResult = locales.computeResult.replace("XXXL", "<span>" + pantSizeValue + "</span>");
      } else {
        this.computeResult = null;
      }
    },
    computeBraSize() {
      var pantSizeResult = null;
      if (c.isNumber(this.formData.height) && c.isNumber(this.formData.weight)) {
        var bodyMeasurementGroups = [44, 85, 115, 153, 163, 44, 85, 105, 163, 168, 44, 85, 95, 168, 173, 46, 115, 135, 153, 163, 46, 135, 145, 153, 158, 46, 105, 125, 163, 168, 46, 95, 115, 168, 173, 46, 95, 105, 173, 178, 48, 145, 165, 153, 158, 48, 135, 155, 158, 163, 48, 125, 145, 163, 168, 48, 115, 145, 168, 173, 48, 105, 125, 173, 178, 48, 105, 115, 178, 183, 50, 165, 185, 153, 158, 50, 155, 175, 158, 163, 50, 145, 165, 163, 168, 50, 145, 155, 168, 173, 50, 125, 155, 173, 178, 50, 115, 135, 178, 183, 50, 115, 125, 183, 188, 52, 175, 195, 158, 163, 52, 165, 185, 163, 168, 52, 155, 175, 168, 173, 52, 155, 165, 173, 183, 52, 135, 155, 178, 183, 52, 125, 145, 183, 188, 52, 125, 135, 188, 193, 54, 185, 195, 163, 173, 54, 175, 185, 168, 178, 54, 165, 175, 173, 188, 54, 145, 165, 183, 188, 54, 135, 155, 188, 193, 56, 195, 215, 168, 183, 56, 185, 195, 173, 193, 56, 175, 185, 178, 193, 56, 155, 175, 188, 193, 58, 195, 215, 183, 193];
        for (var groupIndex = 0; groupIndex < bodyMeasurementGroups.length / 5; groupIndex++) {
          if (this.formData.weight * 2 >= bodyMeasurementGroups[groupIndex * 5 + 1] && this.formData.weight * 2 <= bodyMeasurementGroups[groupIndex * 5 + 2] && this.formData.height >= bodyMeasurementGroups[groupIndex * 5 + 3] && this.formData.height <= bodyMeasurementGroups[groupIndex * 5 + 4]) {
            pantSizeResult = bodyMeasurementGroups[groupIndex * 5];
            break;
          }
        }
        switch (pantSizeResult) {
          case 44:
            pantSizeResult = "27";
            break;
          case 46:
            pantSizeResult = "28/29/30";
            break;
          case 48:
            pantSizeResult = "30/31/32";
            break;
          case 50:
            pantSizeResult = "33/34";
            break;
          case 52:
            pantSizeResult = "35/36";
            break;
          case 54:
            pantSizeResult = "38";
            break;
          case 56:
            pantSizeResult = "40";
            break;
        }
        if (pantSizeResult == null) {
          this.$message.error(locales.computeErrorTip);
        }
      }
      return pantSizeResult;
    },
    compute() {
      this.$refs.computeForm.validate(valid => {
        if (valid) {
          // 纯 SPA 页内计算，不跳转、不刷新，输入内容保留；
          // 仅用 replaceState 同步 URL，保持结果链接可分享
          this.refreshResult();
          history.replaceState(null, "", "?height=" + this.formData.height + "&weight=" + this.formData.weight);
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");