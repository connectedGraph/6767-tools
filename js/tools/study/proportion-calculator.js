Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      number: [100, 400, 25, 100]
    };
  },
  computed: {
    ratio() {
      if (this.number[0] != 0 && this.number[1] != 0) {
        return this.number[0] / this.number[1];
      }
      return null;
    }
  },
  methods: {
    convert(inputValue) {
      var numberArray = [this.number[0], this.number[1], this.number[2], this.number[3]];
      if (inputValue == 2) {
        if (numberArray[0] == 0) {
          this.number[3] = 0;
        } else {
          this.number[3] = Number((numberArray[2] * numberArray[1] / numberArray[0]).toFixed(8));
        }
      } else if (numberArray[1] == 0) {
        this.number[2] = 0;
      } else {
        this.number[2] = Number((numberArray[0] / numberArray[1] * numberArray[3]).toFixed(8));
      }
    }
  }
}).use(ElementPlus).mount(".main-body");