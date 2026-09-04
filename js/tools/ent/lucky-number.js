Vue.createApp({
  components: {
    comment: comment,
    "el-date-picker-extend": elDatePickerExtend
  },
  data() {
    return {
      formData: {
        birthday: null
      },
      disabledDate(currentDate) {
        var nowDate = new Date();
        var dayOfMonth = nowDate.getDate();
        return currentDate.getTime() > new Date().setDate(dayOfMonth - 1);
      },
      luckyNumber: null
    };
  },
  mounted() {},
  methods: {
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          var birthdayStr = c.dateFormat(this.formData.birthday, "yyyyMMdd");
          while (birthdayStr.length > 1) {
            var sum = 0;
            for (var index = 0; index < birthdayStr.length; ++index) {
              sum += Number(birthdayStr.substr(index, 1));
            }
            birthdayStr = String(sum);
          }
          this.luckyNumber = birthdayStr;
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");