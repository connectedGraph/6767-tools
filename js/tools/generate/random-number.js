Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        startNumber: 1,
        endNumber: 100,
        count: 10,
        unique: false,
        padStart: false,
        splitStr: ""
      },
      randomNumber: null
    };
  },
  mounted() {},
  methods: {
    compute() {
      this.$refs.computeForm.validate(isFormValid => {
        if (isFormValid) {
          if (this.formData.startNumber >= this.formData.endNumber) {
            this.$message({
              message: locales.numberTip,
              type: "error",
              grouping: true
            });
            return;
          }
          var startNumber = Number(this.formData.startNumber);
          var endNumber = Number(this.formData.endNumber);
          var count = Number(this.formData.count);
          if (this.formData.unique && count > endNumber - startNumber + 1) {
            count = endNumber - startNumber + 1;
          }
          var randomNumbers = [];
          while (randomNumbers.length < count) {
            var randomNumber = Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber;
            console.log(randomNumber);
            if (this.formData.padStart) {
              randomNumber = String(randomNumber).padStart(String(endNumber).length, "0");
            }
            if (this.formData.unique) {
              if (!randomNumbers.includes(randomNumber)) {
                randomNumbers.push(randomNumber);
              }
            } else {
              randomNumbers.push(randomNumber);
            }
          }
          this.randomNumber = randomNumbers.join(this.formData.splitStr == "" ? " " : this.formData.splitStr);
        }
      });
    },
    copy() {
      c.copy(this.randomNumber);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");