Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend,
    "el-date-picker-extend": elDatePickerExtend,
    "el-select-extend": elSelectExtend
  },
  data() {
    return {
      formData: {
        birthday: null,
        sex: null,
        height: null,
        weight: null,
        mentality: null,
        smoke: null
      },
      disabledDate(date) {
        var today = new Date();
        var dayOfMonth = today.getDate();
        return date.getTime() > new Date().setDate(dayOfMonth - 1);
      },
      computeResult: null
    };
  },
  methods: {
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          var lifeExpectancyYears = 90;
          var bmi = this.formData.weight / (this.formData.height * this.formData.height / 10000);
          if (bmi >= 40) {
            lifeExpectancyYears += -10;
          } else if (bmi >= 30 && bmi < 40) {
            lifeExpectancyYears += -7;
          } else if (bmi >= 27 && bmi < 30) {
            lifeExpectancyYears += -5;
          } else if (bmi >= 24 && bmi < 27) {
            lifeExpectancyYears += -3;
          } else if (bmi > 18.5 && bmi < 24) {
            lifeExpectancyYears += 3;
          } else {
            lifeExpectancyYears += -5;
          }
          if (this.formData.sex == 2) {
            lifeExpectancyYears += 5;
          }
          if (this.formData.mentality == 1) {
            lifeExpectancyYears += 5;
          } else if (this.formData.mentality == 2) {
            lifeExpectancyYears += -10;
          } else if (this.formData.mentality == 3) {
            lifeExpectancyYears += -5;
          }
          if (this.formData.smoke == 1) {
            lifeExpectancyYears += -5;
          }
          var deathDate = new Date(Date.parse(this.formData.birthday) + lifeExpectancyYears * 31536000000);
          var currentDate = new Date();
          var remainingDays = parseInt((deathDate - currentDate) / 86400000);
          this.computeResult = "<div>" + locales.computeResult1 + "</div>" + ("<div><span>" + c.dateFormat(deathDate, "yyyy.MM.dd") + ",&nbsp;" + locales.computeResult2.replace("100", lifeExpectancyYears) + "</span></div > ") + ("<div>" + locales.computeResult3.replace("100", " <span>" + remainingDays + "</span> ") + "</div>") + ("<div class='remark'>" + locales.computeResult4 + "</div>");
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");