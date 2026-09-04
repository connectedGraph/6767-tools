Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        value: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        ratio: [1000, 1, 0.001, 0.000001, 1000000, 100000, 0.2, 453.59237, 28.3495231, 0.0647989, 1016046.9088, 907184.74, 50802.34544, 6350.29318, 1.7718452]
      }
    };
  },
  mounted() {},
  methods: {
    convert(fromUnitIndex) {
      if (c.isNullOrEmpty(this.formData.value[fromUnitIndex])) {
        this.formData.value = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      } else {
        for (var targetIndex = 0; targetIndex < this.formData.value.length; targetIndex++) {
          if (targetIndex != fromUnitIndex) {
            var convertedValue = Number(this.formData.value[fromUnitIndex]) * this.formData.ratio[fromUnitIndex] * 1000000 / (this.formData.ratio[targetIndex] * 1000000);
            var precision = 4;
            for (var decimalPlaceIndex = 1; decimalPlaceIndex < 100; decimalPlaceIndex++) {
              if (convertedValue > Number("0." + "1".padStart(decimalPlaceIndex, 0))) {
                precision += decimalPlaceIndex;
                break;
              }
            }
            this.formData.value[targetIndex] = c.toThousandthPlace(convertedValue, precision);
          }
        }
      }
    },
    focus(focusedUnitIndex) {
      var cleanedValueString = String(this.formData.value[focusedUnitIndex]).replace(/,/g, "").replace(/ /g, "");
      if (!c.isNullOrEmpty(cleanedValueString)) {
        this.formData.value[focusedUnitIndex] = cleanedValueString;
      }
    },
    blur(blurredUnitIndex) {
      this.formData.value[blurredUnitIndex] = c.toThousandthPlace(this.formData.value[blurredUnitIndex]);
    }
  }
}).use(ElementPlus).mount(".main-body");