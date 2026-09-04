Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        value: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        ratio: [1000000000000, 1000, 1, 0.001, 0.000001, 1, 0.1, 0.01, 0.001, 100, 0.000001, 28.3168, 0.016387037, 764.5536, 1233481.837548, 4.54609188, 3.785411784, 0.02841, 0.02957]
      }
    };
  },
  mounted() {},
  methods: {
    convert(convertIndex) {
      if (c.isNullOrEmpty(this.formData.value[convertIndex])) {
        this.formData.value = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      } else {
        for (var loopIndex = 0; loopIndex < this.formData.value.length; loopIndex++) {
          if (loopIndex != convertIndex) {
            var convertedValue = Number(this.formData.value[convertIndex]) * this.formData.ratio[convertIndex] * 1000000 / (this.formData.ratio[loopIndex] * 1000000);
            var decimalPlaces = 4;
            for (var percentIndex = 1; percentIndex < 100; percentIndex++) {
              if (convertedValue > Number("0." + "1".padStart(percentIndex, 0))) {
                decimalPlaces += percentIndex;
                break;
              }
            }
            this.formData.value[loopIndex] = c.toThousandthPlace(convertedValue, decimalPlaces);
          }
        }
      }
    },
    focus(focusIndex) {
      var sanitizedValue = String(this.formData.value[focusIndex]).replace(/,/g, "").replace(/ /g, "");
      if (!c.isNullOrEmpty(sanitizedValue)) {
        this.formData.value[focusIndex] = sanitizedValue;
      }
    },
    blur(blurIndex) {
      this.formData.value[blurIndex] = c.toThousandthPlace(this.formData.value[blurIndex]);
    }
  }
}).use(ElementPlus).mount(".main-body");