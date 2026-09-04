Vue.createApp({
  components: {
    comment: comment,
    "el-date-picker-extend": elDatePickerExtend,
    "el-select-extend": elSelectExtend,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        birthday: null,
        sex: null,
        retirementAge: null
      },
      languageCode: languageCode,
      retirementAgeDesc: null,
      retirementTimeDesc: null,
      addMonths: null,
      disabledDate(currentDate) {
        var todayDate = new Date();
        var dayOfMonth = todayDate.getDate();
        return currentDate.getTime() > new Date().setDate(dayOfMonth - 1);
      }
    };
  },
  mounted() {},
  methods: {
    monthsBetween(startDate, endDate) {
      var monthDiff;
      monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12;
      monthDiff -= startDate.getMonth();
      monthDiff += endDate.getMonth();
      if (monthDiff <= 0) {
        return 0;
      } else {
        return monthDiff;
      }
    },
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          var birthDate = new Date(c.clone(this.formData.birthday));
          if (languageCode == "zh") {
            if (this.formData.sex == 1) {
              if (birthDate < new Date("1965.1.1")) {
                this.retirementAgeDesc = "60岁";
                this.addMonths = 0;
              }
              if (birthDate < new Date("1977.1.1")) {
                var elapsedMonths = this.monthsBetween(new Date("1964.12.1"), birthDate);
                this.addMonths = parseInt((elapsedMonths + 3) / 4, 10);
                this.retirementAgeDesc = 60 + parseInt(this.addMonths / 12, 10) + "岁" + (this.addMonths % 12 == 0 ? "" : this.addMonths % 12 + "个月");
                birthDate.setFullYear(birthDate.getFullYear() + 60);
                birthDate.setMonth(birthDate.getMonth() + this.addMonths);
              } else {
                this.retirementAgeDesc = "63岁";
                birthDate.setFullYear(birthDate.getFullYear() + 63);
                this.addMonths = 36;
              }
            } else if (this.formData.sex == 2) {
              if (birthDate < new Date("1970.1.1")) {
                this.retirementAgeDesc = "55岁";
                this.addMonths = 0;
              }
              if (birthDate < new Date("1982.1.1")) {
                var elapsedMonths = this.monthsBetween(new Date("1969.12.1"), birthDate);
                this.addMonths = parseInt((elapsedMonths + 3) / 4, 10);
                this.retirementAgeDesc = 55 + parseInt(this.addMonths / 12, 10) + "岁" + (this.addMonths % 12 == 0 ? "" : this.addMonths % 12 + "个月");
                birthDate.setFullYear(birthDate.getFullYear() + 55);
                birthDate.setMonth(birthDate.getMonth() + this.addMonths);
              } else {
                this.retirementAgeDesc = "58岁";
                birthDate.setFullYear(birthDate.getFullYear() + 58);
                this.addMonths = 36;
              }
            } else if (this.formData.sex == 3) {
              if (birthDate < new Date("1975.1.1")) {
                this.retirementAgeDesc = "50岁";
                this.addMonths = 0;
              }
              if (birthDate < new Date("1985.1.1")) {
                var elapsedMonths = this.monthsBetween(new Date("1974.12.1"), birthDate);
                this.addMonths = parseInt((elapsedMonths + 1) / 2, 10);
                this.retirementAgeDesc = 50 + parseInt(this.addMonths / 12, 10) + "岁" + (this.addMonths % 12 == 0 ? "" : this.addMonths % 12 + "个月");
                birthDate.setFullYear(birthDate.getFullYear() + 50);
                birthDate.setMonth(birthDate.getMonth() + this.addMonths);
              } else {
                this.retirementAgeDesc = "55岁";
                birthDate.setFullYear(birthDate.getFullYear() + 55);
                this.addMonths = 60;
              }
            }
            this.retirementTimeDesc = locales.retirementTime.replace("xxx", c.dateFormat(birthDate, "yyyy年MM月"));
          } else {
            birthDate.setFullYear(birthDate.getFullYear() + Number(this.formData.retirementAge));
            this.retirementTimeDesc = locales.retirementTime.replace("xxx", c.dateFormat(birthDate, "yyyy.MM"));
          }
        }
      });
    }
  }
}).use(ElementPlus, {
  locale: ElementPlusLocaleZhCn
}).mount(".main-body");