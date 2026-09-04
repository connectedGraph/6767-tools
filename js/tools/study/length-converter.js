Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        value: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        ratio: [1000, 1, 0.1, 0.01, 0.001, 0.000001, 1e-9, 1e-12, 9460730472580800, 149597870000, 1609.344, 0.3048, 0.0254, 0.9144, 1852, 1.829, 201.168, 0.0000254]
      }
    };
  },
  methods: {
    convert(fromIndex) {
      if (c.isNullOrEmpty(this.formData.value[fromIndex])) {
        this.formData.value = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      } else {
        for (var toIndex = 0; toIndex < this.formData.value.length; toIndex++) {
          if (toIndex != fromIndex) {
            var convertedValue = Number(this.formData.value[fromIndex]) * this.formData.ratio[fromIndex] * 1000000 / (this.formData.ratio[toIndex] * 1000000);
            var decimalPlaces = 4;
            for (var loopIndex = 1; loopIndex < 100; loopIndex++) {
              if (convertedValue > Number("0." + "1".padStart(loopIndex, 0))) {
                decimalPlaces += loopIndex;
                break;
              }
            }
            this.formData.value[toIndex] = c.toThousandthPlace(convertedValue, decimalPlaces);
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