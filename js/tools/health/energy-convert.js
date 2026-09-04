c.preventCheat();
Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        value: [null, null],
        ratio: [1, 0.239]
      }
    };
  },
  mounted() {},
  methods: {
    convert(value) {
      if (c.isNullOrEmpty(this.formData.value[value])) {
        this.formData.value = [null, null];
      } else {
        for (var index = 0; index < this.formData.value.length; index++) {
          if (index != value) {
            this.formData.value[index] = Number((Number(this.formData.value[value]) * this.formData.ratio[index] / this.formData.ratio[value]).toFixed(3));
          }
        }
      }
    }
  }
}).use(ElementPlus).mount(".main-body");