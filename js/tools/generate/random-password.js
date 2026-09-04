Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      formData: {
        pwdLength: 8,
        pwdCount: 1,
        ckAzUpper: true,
        ckAzLower: true,
        ck09: true,
        ckOther: true,
        ckFilter: true
      },
      passwordArr: []
    };
  },
  computed: {
    charArr() {
      var charPool = [];
      if (this.formData.ckAzUpper) {
        charPool.splice(charPool.length, 0, ...["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]);
      }
      if (this.formData.ckAzLower) {
        charPool.splice(charPool.length, 0, ...["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]);
      }
      if (this.formData.ck09) {
        charPool.splice(charPool.length, 0, ...["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
      }
      if (this.formData.ckOther) {
        charPool.splice(charPool.length, 0, ...["!", "@", "#", "$", "%", "^", "&", "*", "+", "="]);
      }
      if (this.formData.ckFilter) {
        var excludedChars = ["1", "l", "I", "i", "o", "O", "0"];
        for (var excludedCharIndex = 0; excludedCharIndex < excludedChars.length; excludedCharIndex++) {
          charPool.remove(excludedChars[excludedCharIndex]);
        }
      }
      return charPool;
    }
  },
  mounted() {},
  methods: {
    compute() {
      this.$refs.computeForm.validate(isValid => {
        if (isValid) {
          if (!this.formData.ckAzUpper && !this.formData.ckAzLower && !this.formData.ck09 && !this.formData.ckOther) {
            this.$message({
              message: locales.ckTip,
              type: "error",
              grouping: true
            });
            return;
          }
          var generatePassword = () => {
            var password = "";
            var availableChars = c.clone(this.charArr);
            while (password.length < this.formData.pwdLength) {
              var randomIndex = Math.floor(Math.random() * availableChars.length);
              password += availableChars[randomIndex];
            }
            return password;
          };
          this.passwordArr = [];
          for (var pwdIndex = 0; pwdIndex < this.formData.pwdCount; pwdIndex++) {
            this.passwordArr.push(generatePassword());
          }
        }
      });
    },
    copyAll() {
      c.copy(this.passwordArr.join("\n"));
      this.$message.success(locales.copySuccess);
    },
    copy(textToCopy) {
      c.copy(this.passwordArr[textToCopy]);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");