Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        value: [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        ratio: [1000000, 10000, 100, 1, 0.01, 0.0001, 0.000001, 4046.8564224, 2589988.110336, 0.8361274, 0.092903, 0.00064516, 25.2928526]
      }
    };
  },
  mounted() {},
  methods: {
    convert(targetIndex) {
      if (c.isNullOrEmpty(this.formData.value[targetIndex])) {
        this.formData.value = [null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      } else {
        for (var rowLoopIndex = 0; rowLoopIndex < this.formData.value.length; rowLoopIndex++) {
          if (rowLoopIndex != targetIndex) {
            var convertedAreaValue = Number(this.formData.value[targetIndex]) * this.formData.ratio[targetIndex] * 1000000 / (this.formData.ratio[rowLoopIndex] * 1000000);
            var decimalPlaces = 4;
            for (var percentLoopIndex = 1; percentLoopIndex < 100; percentLoopIndex++) {
              if (convertedAreaValue > Number("0." + "1".padStart(percentLoopIndex, 0))) {
                decimalPlaces += percentLoopIndex;
                break;
              }
            }
            this.formData.value[rowLoopIndex] = c.toThousandthPlace(convertedAreaValue, decimalPlaces);
          }
        }
      }
    },
    focus(focusedIndex) {
      var cleanedInputValue = String(this.formData.value[focusedIndex]).replace(/,/g, "").replace(/ /g, "");
      if (!c.isNullOrEmpty(cleanedInputValue)) {
        this.formData.value[focusedIndex] = cleanedInputValue;
      }
    },
    blur(blurredIndex) {
      this.formData.value[blurredIndex] = c.toThousandthPlace(this.formData.value[blurredIndex]);
    }
  }
}).use(ElementPlus).mount(".main-body");