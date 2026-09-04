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
      computeResult: null
    };
  },
  methods: {
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          var sexConstant = this.formData.sex == womanVal ? 9 : 19.34;
          var heightNum = Number(this.formData.height);
          var weightNum = Number(this.formData.weight);
          var ageNum = Number(this.formData.age);
          var bfrValue = Number((weightNum * 1.39 / (heightNum * heightNum / 10000) + ageNum * 0.16 - sexConstant).toFixed(2));
          var sexKey = this.formData.sex == womanVal ? "woman" : "man";
          var sexData = this.bfrData[sexKey];
          var resultText = "";
          for (var dataIndex = 0; dataIndex < sexData.length; dataIndex++) {
            if (ageNum >= sexData[dataIndex].age[0] && sexData[dataIndex].age.length > 1 && ageNum <= sexData[dataIndex].age[1]) {
              if (bfrValue >= sexData[dataIndex].slimming[0] && bfrValue <= sexData[dataIndex].slimming[1]) {
                resultText = locales.weightDesc1;
              } else if (bfrValue > sexData[dataIndex].normal[0] && bfrValue <= sexData[dataIndex].normal[1]) {
                resultText = locales.weightDesc2;
              } else if (bfrValue > sexData[dataIndex].overweight[0] && bfrValue <= sexData[dataIndex].overweight[1]) {
                resultText = locales.weightDesc3;
              } else if (bfrValue > sexData[dataIndex].obesity[0] && bfrValue <= sexData[dataIndex].obesity[1]) {
                resultText = locales.weightDesc4;
              }
              break;
            }
          }
          this.computeResult = locales.computeResult.replace("100", "<span>" + bfrValue + "</span>").replace("xxx", "<span>" + resultText + "</span>");
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");