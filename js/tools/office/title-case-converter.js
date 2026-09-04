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
    titleText() {
      var lowercasedText = this.text.toLowerCase();
      if (c.isNullOrEmpty(this.text)) {
        lowercasedText = "Type or paste your content here";
      }
      var minorWords = ["in", "for", "of", "at", "by", "on", "out", "up", "for", "as", "with", "to", "is", "the", "a", "an", "and", "but", "or"];
      var lines = lowercasedText.split("\n");
      for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        var sentenceFragments = lines[lineIndex].split(".");
        for (var sentenceIndex = 0; sentenceIndex < sentenceFragments.length; sentenceIndex++) {
          var wordsInSentence = sentenceFragments[sentenceIndex].split(" ");
          for (var wordIndex = 0; wordIndex < wordsInSentence.length; wordIndex++) {
            if (!minorWords.includes(wordsInSentence[wordIndex])) {
              wordsInSentence[wordIndex] = wordsInSentence[wordIndex].substring(0, 1).toUpperCase() + wordsInSentence[wordIndex].substring(1);
            }
          }
          sentenceFragments[sentenceIndex] = wordsInSentence.join(" ");
        }
        lines[lineIndex] = sentenceFragments.join(".");
      }
      lowercasedText = lines.join("\n");
      return lowercasedText;
    }
  },
  watch: {
    text: {
      handler() {
        this.charCount = this.text.length;
        this.wordCount = this.text == "" ? 0 : this.text.split(" ").length;
        this.sentenceCount = 0;
        this.sentenceArr = this.text.split(".");
        for (var sentenceArrIdx = 0; sentenceArrIdx < this.sentenceArr.length; sentenceArrIdx++) {
          if (!c.isNullOrEmpty(this.sentenceArr[sentenceArrIdx])) {
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
      c.downloadTxt(location.host.replace(/\./g, "_") + ".txt", this.titleText);
    },
    copyText() {
      c.copy(this.titleText);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");