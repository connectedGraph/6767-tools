var birthdayTimer = null;
var vueObj = Vue.createApp({
  components: {
    comment: comment,
    "el-date-picker-extend": elDatePickerExtend
  },
  data() {
    return {
      formData: {
        birthday: birthday
      },
      ageNumber: null,
      age: null,
      constellation: null,
      nextBirthday: null,
      disabledDate(date) {
        var currentDate = new Date();
        var currentDay = currentDate.getDate();
        return date.getTime() > new Date().setDate(currentDay - 1);
      }
    };
  },
  mounted() {
    // 支持 /age?birthday=2019.08.15 这类带参链接进入（分享/收藏场景）
    var birthdayParam = c.urlParam("birthday");
    if (!c.isNullOrEmpty(birthdayParam)) {
      var paramDate = new Date(birthdayParam);
      if (!isNaN(paramDate.getTime())) {
        this.formData.birthday = birthdayParam;
      }
    }
    this.recompute();
  },
  beforeUnmount() {
    if (birthdayTimer != null) {
      clearInterval(birthdayTimer);
      birthdayTimer = null;
    }
  },
  methods: {
    recompute() {
      if (c.isNullOrEmpty(this.formData.birthday)) {
        this.age = null;
        this.ageNumber = null;
        this.constellation = null;
        this.nextBirthday = null;
        return;
      }
      var ageDiff = this.getDiffYmdBetweenDate(c.dateFormat(this.formData.birthday), c.dateFormat(new Date()));
      this.ageNumber = ageDiff.y;
      this.age = locales.computeResult1.replace("111", ageDiff.y).replace("222", ageDiff.m).replace("333", ageDiff.d);
      this.getConstellation();
      this.getNextBirthday();
    },
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          // 纯 SPA 页内计算，不跳转、不刷新，输入内容保留；
          // 仅用 replaceState 同步 URL，保持结果链接可分享
          this.recompute();
          history.replaceState(null, "", "?birthday=" + c.dateFormat(this.formData.birthday, "yyyy.MM.dd"));
        }
      });
    },
    getDiffYmdBetweenDate(startDate, endDate) {
      function formatDateStr(dateStr) {
        var dateParts = dateStr.split("-");
        for (var partsIndex = 0; partsIndex < dateParts.length; partsIndex++) {
          dateParts[partsIndex] = padZero(parseInt(dateParts[partsIndex]));
        }
        return dateParts.join("-");
      }
      function padZero(num) {
        if (num < 10) {
          return "0" + num;
        } else {
          return num;
        }
      }
      function convertToNumbers(inputArray) {
        for (var inputIndex = 0; inputIndex < inputArray.length; inputIndex++) {
          inputArray[inputIndex] = parseInt(inputArray[inputIndex]);
        }
        return inputArray;
      }
      function getMonthDays(month, year) {
        var monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (month % 400 == 0 || month % 4 == 0 && month % 100 != 0) {
          monthDays[2] = 29;
        }
        return monthDays[year];
      }
      function calculateAge(ageInput) {}
      var diffYears = 0;
      var diffMonths = 0;
      var diffDays = 0;
      var tempStartDate;
      var tempEndDate;
      startDate = formatDateStr(startDate);
      endDate = formatDateStr(endDate);
      if (startDate > endDate) {
        tempStartDate = endDate;
        endDate = startDate;
        startDate = tempStartDate;
      }
      var startParts = startDate.split("-");
      startParts = convertToNumbers(startParts);
      var endParts = endDate.split("-");
      endParts = convertToNumbers(endParts);
      diffYears = endParts[0] - startParts[0];
      if (endDate.replace(endParts[0], "") < startDate.replace(startParts[0], "")) {
        diffYears = diffYears - 1;
      }
      tempEndDate = [startParts[0] + diffYears, startParts[1], padZero(startParts[2])];
      while (true) {
        if (tempEndDate[1] == 12) {
          tempEndDate[0]++;
          tempEndDate[1] = 1;
        } else {
          tempEndDate[1]++;
        }
        if ([tempEndDate[0], padZero(tempEndDate[1]), tempEndDate[2]].join("-") <= endDate) {
          diffMonths++;
        } else {
          break;
        }
      }
      tempEndDate = [startParts[0] + diffYears, startParts[1] + diffMonths, startParts[2]];
      if (tempEndDate[1] > 12) {
        tempEndDate[0]++;
        tempEndDate[1] -= 12;
      }
      while (true) {
        if (tempEndDate[2] == getMonthDays(tempEndDate[0], tempEndDate[1])) {
          if (tempEndDate[1] == 12) {
            tempEndDate[0]++;
            tempEndDate[1] = 1;
            tempEndDate[2] = 1;
          } else {
            tempEndDate[1]++;
            tempEndDate[2] = 1;
          }
        } else {
          tempEndDate[2]++;
        }
        tempStartDate = [tempEndDate[0], padZero(tempEndDate[1]), padZero(tempEndDate[2])].join("-");
        if (tempStartDate <= endDate) {
          diffDays++;
        } else {
          break;
        }
      }
      return {
        y: diffYears,
        m: diffMonths,
        d: diffDays
      };
    },
    getConstellation() {
      var birthDate = new Date(this.formData.birthday);
      var birthMonth = birthDate.getMonth() + 1;
      var birthDay = birthDate.getDate();
      var resultTemplate = locales.computeResult2;
      if (birthMonth == 1 && birthDay >= 20 || birthMonth == 2 && birthDay <= 18) {
        this.constellation = resultTemplate[0];
      } else if (birthMonth == 2 && birthDay >= 19 || birthMonth == 3 && birthDay <= 20) {
        this.constellation = resultTemplate[1];
      } else if (birthMonth == 3 && birthDay >= 21 || birthMonth == 4 && birthDay <= 19) {
        this.constellation = resultTemplate[2];
      } else if (birthMonth == 4 && birthDay >= 20 || birthMonth == 5 && birthDay <= 20) {
        this.constellation = resultTemplate[3];
      } else if (birthMonth == 5 && birthDay >= 21 || birthMonth == 6 && birthDay <= 21) {
        this.constellation = resultTemplate[4];
      } else if (birthMonth == 6 && birthDay >= 22 || birthMonth == 7 && birthDay <= 22) {
        this.constellation = resultTemplate[5];
      } else if (birthMonth == 7 && birthDay >= 23 || birthMonth == 8 && birthDay <= 22) {
        this.constellation = resultTemplate[6];
      } else if (birthMonth == 8 && birthDay >= 23 || birthMonth == 9 && birthDay <= 22) {
        this.constellation = resultTemplate[7];
      } else if (birthMonth == 9 && birthDay >= 23 || birthMonth == 10 && birthDay <= 22) {
        this.constellation = resultTemplate[8];
      } else if (birthMonth == 10 && birthDay >= 23 || birthMonth == 11 && birthDay <= 21) {
        this.constellation = resultTemplate[9];
      } else if (birthMonth == 11 && birthDay >= 22 || birthMonth == 12 && birthDay <= 21) {
        this.constellation = resultTemplate[10];
      } else if (birthMonth == 12 && birthDay >= 22 || birthMonth == 1 && birthDay <= 19) {
        this.constellation = resultTemplate[11];
      }
    },
    getNextBirthday() {
      if (birthdayTimer != null) {
        clearInterval(birthdayTimer);
        birthdayTimer = null;
      }
      var birthdayStr = this.formData.birthday;
      var tick = () => {
        var endTimestamp;
        var startTimestamp;
        if (Number(c.dateFormat(birthdayStr, "MMdd")) == Number(c.dateFormat(new Date(), "MMdd"))) {
          this.nextBirthday = ("🎂" + locales.computeResult4 + "🎂").replace("100", this.ageNumber);
        } else {
          if (Number(c.dateFormat(birthdayStr, "MMdd")) > Number(c.dateFormat(new Date(), "MMdd"))) {
            endTimestamp = new Date().getFullYear() + "-" + c.dateFormat(birthdayStr, "MM-dd") + " 00:00:00";
            endTimestamp = new Date(endTimestamp).getTime();
            startTimestamp = new Date().getTime();
          } else {
            endTimestamp = new Date().getFullYear() + "-" + c.dateFormat(birthdayStr, "MM-dd") + " 00:00:00";
            endTimestamp = new Date(endTimestamp);
            endTimestamp.setFullYear(endTimestamp.getFullYear() + 1);
            endTimestamp = endTimestamp.getTime();
            startTimestamp = new Date().getTime();
          }
          var elapsedDays = parseInt((endTimestamp - startTimestamp) / 86400000, 10);
          var elapsedHours = parseInt((endTimestamp - startTimestamp) % 86400000 / 3600000, 10);
          var elapsedMinutes = parseInt((endTimestamp - startTimestamp) % 3600000 / 60000, 10);
          var elapsedSeconds = parseInt((endTimestamp - startTimestamp) % 60000 / 1000, 10);
          this.nextBirthday = locales.computeResult3.replace("222", elapsedHours).replace("333", elapsedMinutes).replace("444", elapsedSeconds).replace("111", elapsedDays);
        }
      };
      tick();
      birthdayTimer = setInterval(tick, 1000);
    }
  }
}).use(ElementPlus).mount(".main-body");