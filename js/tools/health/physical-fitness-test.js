c.preventCheat();
Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        sex: womanVal,
        height: null,
        weight: null,
        age: null
      },
      weightResult: "",
      bmiResult: "",
      bmrResult: "",
      bfrData: {
        woman: [{
          age: [18, 39],
          slimming: [5, 20],
          normal: [20, 34],
          overweight: [34, 39],
          obesity: [39, 45]
        }, {
          age: [40, 59],
          slimming: [5, 21],
          normal: [21, 35],
          overweight: [35, 40],
          obesity: [40, 45]
        }, {
          age: [60],
          slimming: [5, 22],
          normal: [22, 36],
          overweight: [36, 41],
          obesity: [41, 45]
        }],
        man: [{
          age: [18, 39],
          slimming: [5, 10],
          normal: [10, 21],
          overweight: [21, 26],
          obesity: [26, 45]
        }, {
          age: [40, 59],
          slimming: [5, 11],
          normal: [11, 22],
          overweight: [22, 27],
          obesity: [27, 45]
        }, {
          age: [60],
          slimming: [5, 13],
          normal: [13, 24],
          overweight: [24, 29],
          obesity: [29, 45]
        }]
      },
      bfrResult: ""
    };
  },
  methods: {
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          var genderAdjustment = this.formData.sex == womanVal ? 9 : 19.34;
          var height = Number(this.formData.height);
          var weight = Number(this.formData.weight);
          var age = Number(this.formData.age);
          var standardWeight = 0;
          if (this.formData.sex == womanVal) {
            standardWeight = Number(((height - 70) * 0.6).toFixed(1));
          } else {
            standardWeight = Number(((height - 80) * 0.7).toFixed(1));
          }
          var weightStatusText = "";
          if (weight >= standardWeight * 0.9 && weight <= standardWeight * 1.1) {
            weightStatusText = locales.weightDesc2;
          } else if (weight > standardWeight * 1.1 && weight <= standardWeight * 1.2) {
            weightStatusText = locales.weightDesc3;
          } else if (weight < standardWeight * 0.9) {
            weightStatusText = locales.weightDesc1;
          } else if (weight > standardWeight * 1.2) {
            weightStatusText = locales.weightDesc4;
          }
          this.weightResult = locales.weightResult.replace("100", "<span>" + standardWeight + "</span>").replace("200", (standardWeight * 0.9).toFixed(1)).replace("300", (standardWeight * 1.1).toFixed(1)).replace("xxx", "<span>" + weightStatusText + "</span>");
          var bodyFatRate = Number((weight * 1.39 / (height * height / 10000) + age * 0.16 - (this.formData.sex == womanVal ? 9 : 19.34)).toFixed(2));
          var bfrStatusText = "";
          var genderKey = this.formData.sex == womanVal ? "woman" : "man";
          var genderBfrData = this.bfrData[genderKey];
          for (var index = 0; index < genderBfrData.length; index++) {
            if (age >= genderBfrData[index].age[0] && genderBfrData[index].age.length > 1 && age <= genderBfrData[index].age[1]) {
              if (bodyFatRate >= genderBfrData[index].slimming[0] && bodyFatRate <= genderBfrData[index].slimming[1]) {
                bfrStatusText = locales.weightDesc1;
              } else if (bodyFatRate > genderBfrData[index].normal[0] && bodyFatRate <= genderBfrData[index].normal[1]) {
                bfrStatusText = locales.weightDesc2;
              } else if (bodyFatRate > genderBfrData[index].overweight[0] && bodyFatRate <= genderBfrData[index].overweight[1]) {
                bfrStatusText = locales.weightDesc3;
              } else if (bodyFatRate > genderBfrData[index].obesity[0] && bodyFatRate <= genderBfrData[index].obesity[1]) {
                bfrStatusText = locales.weightDesc4;
              }
              break;
            }
          }
          this.bfrResult = locales.bfrResult.replace("100", "<span>" + bodyFatRate + "</span>").replace("xxx", "<span>" + bfrStatusText + "</span>");
          var bmi = Number((weight / (height * height / 10000)).toFixed(2));
          var bmiStatusText = "";
          if (bmi <= 18.4) {
            bmiStatusText = locales.weightDesc1;
          } else if (bmi >= 18.5 && bmi <= 23.9) {
            bmiStatusText = locales.weightDesc2;
          } else if (bmi >= 24 && bmi <= 27.9) {
            bmiStatusText = locales.weightDesc3;
          } else if (bmi >= 28) {
            bmiStatusText = locales.weightDesc4;
          }
          this.bmiResult = locales.bmiResult.replace("100", "<span>" + bmi + "</span>").replace("xxx", "<span>" + bmiStatusText + "</span>");
          var num0 = 0;
          if (this.formData.sex == womanVal) {
            num0 = Number((655 + weight * 9.6 + height * 1.8 - age * 4.7).toFixed(2));
          } else {
            num0 = Number((66 + weight * 13.7 + height * 5 - age * 6.8).toFixed(2));
          }
          this.bmrResult = locales.bmrResult.replace("100", "<span>" + num0 + "</span>");
          this.heartResult = locales.heartResult.replace("100", "<span>" + parseInt((220 - age) * 0.6, 10) + "</span>").replace("200", "<span>" + parseInt((220 - age) * 0.75, 10) + "</span>");
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");