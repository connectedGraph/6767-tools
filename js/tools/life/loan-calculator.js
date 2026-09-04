var vueObj = Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        loanAmount: null,
        loanRate: null,
        loanTerm: null
      },
      monthAmount: "?",
      totalInterest: "?",
      totalAmount: "?",
      firstMonthMoney: "?",
      monthDecrease: "?",
      totalInterest2: "?",
      totalAmount2: "?",
      monthRepaymentList: null
    };
  },
  mounted() {},
  methods: {
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          var loanAmount = Number(this.formData.loanAmount);
          var monthlyRate = Number(this.formData.loanRate) / 12 / 100;
          var loanTerm = Number(this.formData.loanTerm);
          var compoundFactor = Math.pow(1 + monthlyRate, loanTerm);
          var monthlyPayment = loanAmount * monthlyRate * compoundFactor / (compoundFactor - 1);
          this.totalAmount = (monthlyPayment * loanTerm).toFixed(2);
          this.totalInterest = (monthlyPayment * loanTerm - loanAmount).toFixed(2);
          this.monthAmount = monthlyPayment.toFixed(2);
          var principalPerTerm = loanAmount / loanTerm;
          this.totalAmount2 = ((loanTerm + 1) * loanAmount * monthlyRate / 2).toFixed(2);
          this.totalInterest2 = ((loanTerm + 1) * loanAmount * monthlyRate / 2 + loanAmount).toFixed(2);
          this.firstMonthMoney = (principalPerTerm + loanAmount * monthlyRate).toFixed(2);
          this.monthDecrease = (principalPerTerm * monthlyRate).toFixed(2);
          var resultText = "";
          for (var periodIndex = 1; periodIndex <= loanTerm; periodIndex++) {
            resultText += ("<div class='item'>" + locales.monthAmount2 + "</div>").replace("100", "<span class='month'>" + periodIndex + "</span>").replace("200", "<span class='money'>" + (principalPerTerm + (loanAmount - principalPerTerm * (periodIndex - 1)) * monthlyRate).toFixed(2) + "</span>");
          }
          console.log(resultText);
          this.monthRepaymentList = resultText;
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");