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
    // 支持 /woman-shirt-size?height=160&weight=50 这类带参链接进入
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
      var shirtSizeValue = this.computeBraSize();
      if (shirtSizeValue != null) {
        this.computeResult = locales.computeResult.replace("XXXL", "<span>" + shirtSizeValue + "</span>");
      } else {
        this.computeResult = null;
      }
    },
    computeBraSize() {
      var braSizeResult = null;
      if (c.isNumber(this.formData.height) && c.isNumber(this.formData.weight)) {
        var braSizeTable = ["S", 80, 99, 145, 149, "S", 90, 99, 150, 169, "S", 80, 89, 160, 169, "M", 80, 99, 170, 172, "M", 90, 99, 173, 175, "M", 100, 109, 145, 149, "M", 100, 109, 155, 179, "L", 110, 119, 145, 149, "L", 110, 119, 155, 179, "L", 120, 129, 155, 159, "L", 120, 129, 170, 179, "XS", 80, 89, 150, 159, "XL", 110, 119, 150, 154, "XL", 120, 129, 145, 154, "XL", 120, 129, 160, 169, "XL", 130, 139, 160, 179, "XL", 140, 149, 173, 179, "XXL", 130, 139, 150, 159, "XXL", 140, 149, 155, 172];
        for (var rowIndex = 0; rowIndex < braSizeTable.length / 5; rowIndex++) {
          if (this.formData.weight * 2 >= braSizeTable[rowIndex * 5 + 1] && this.formData.weight * 2 <= braSizeTable[rowIndex * 5 + 2] && this.formData.height >= braSizeTable[rowIndex * 5 + 3] && this.formData.height <= braSizeTable[rowIndex * 5 + 4]) {
            braSizeResult = braSizeTable[rowIndex * 5];
            break;
          }
        }
        if (braSizeResult == null) {
          this.$message.error(locales.computeErrorTip);
        }
      }
      return braSizeResult;
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