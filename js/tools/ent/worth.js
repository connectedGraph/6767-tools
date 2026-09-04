Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        currentDeposit: 0,
        monthIncome: 0,
        depositRadio: 50,
        year: 5
      },
      computeResult: null
    };
  },
  mounted() {},
  methods: {
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          var monthlyInterestRate = 1 / 100;
          var compoundFactor = Math.pow(1 + monthlyInterestRate, this.formData.year * 12);
          var currentDepositFutureValue = this.formData.currentDeposit * compoundFactor;
          var monthlyInvestmentFutureValue = this.formData.monthIncome * (this.formData.depositRadio / 100) * ((compoundFactor - 1) / monthlyInterestRate);
          var totalFutureValue = currentDepositFutureValue + monthlyInvestmentFutureValue;
          var formattedTotalValue = c.toThousandthPlace(totalFutureValue, 2);
          var totalValueText = formattedTotalValue;
          if (this.formData.currentDeposit > 0) {
            totalValueText = c.toThousandthPlace((totalFutureValue - this.formData.currentDeposit) / this.formData.currentDeposit * 100, 2) + "%";
          }
          var futureValueFactor;
          if (totalFutureValue < 28000) {
            futureValueFactor = c.toThousandthPlace(totalFutureValue / 560 + 1, 2);
          } else if (totalFutureValue > 28000 && totalFutureValue < 200000) {
            futureValueFactor = c.toThousandthPlace((totalFutureValue - 28000) / 3822 + 50, 2);
          } else if (totalFutureValue > 200000 && totalFutureValue < 1000000) {
            futureValueFactor = c.toThousandthPlace((totalFutureValue - 200000) / 200000 + 95, 2);
          } else if (totalFutureValue > 1000000) {
            futureValueFactor = 99;
          }
          ;
          this.computeResult = locales.computeResult.replace("11", this.formData.year).replace("22", "<span>" + formattedTotalValue + "</span>").replace("33", totalValueText);
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");