Vue.createApp({
  components: {
    comment: comment,
    "my-div-input": myDivInput
  },
  data() {
    return {
      text: "",
      charCount: 0,
      wordCount: 0,
      sentenceCount: 0,
      lineCount: 0
    };
  },
  computed: {
    sentenceText() {
      var lowerText = this.text.toLowerCase();
      if (c.isNullOrEmpty(this.text)) {
        lowerText = "Type or paste your content here";
      }
      var firstChar = lowerText.trim().substring(0, 1);
      var firstCharIndex = lowerText.indexOf(firstChar);
      lowerText = lowerText.substring(0, firstCharIndex + 1).toUpperCase() + lowerText.substring(firstCharIndex + 1);
      lowerText = lowerText.replace(/([.]{1}[\s]*)([a-zA-Z]{1})/g, (match, periodSpace, letter) => {
        return periodSpace + letter.toUpperCase();
      });
      return lowerText;
    }
  },
  watch: {
    text: {
      handler() {
        this.charCount = this.text.length;
        this.wordCount = this.text == "" ? 0 : this.text.split(" ").length;
        this.sentenceCount = 0;
        this.sentenceArr = this.text.split(".");
        for (var index = 0; index < this.sentenceArr.length; index++) {
          if (!c.isNullOrEmpty(this.sentenceArr[index])) {
            this.sentenceCount++;
          }
        }
        this.lineCount = this.text == "" ? 0 : this.text.split("\n").length;
      },
      immediate: true
    }
  },
  methods: {
    downloadText() {
      c.downloadTxt(location.host.replace(/\./g, "_") + ".txt", this.sentenceText);
    },
    copyText() {
      c.copy(this.sentenceText);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");