Vue.createApp({
  components: {
    comment: comment
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
  watch: {
    text: {
      handler() {
        this.charCount = this.text.length;
        this.wordCount = this.text == "" ? 0 : this.text.split(" ").length;
        this.sentenceCount = 0;
        this.sentenceArr = this.text.split(".");
        for (var sentenceIndex = 0; sentenceIndex < this.sentenceArr.length; sentenceIndex++) {
          if (!c.isNullOrEmpty(this.sentenceArr[sentenceIndex])) {
            this.sentenceCount++;
          }
        }
        this.lineCount = this.text == "" ? 0 : this.text.split("\n").length;
      },
      immediate: true
    }
  },
  methods: {
    sentenceCase() {
      if (c.isNullOrEmpty(this.text)) {
        return;
      }
      this.text = this.text.toLowerCase();
      var firstChar = this.text.trim().substring(0, 1);
      var firstCharIndex = this.text.indexOf(firstChar);
      this.text = this.text.substring(0, firstCharIndex + 1).toUpperCase() + this.text.substring(firstCharIndex + 1);
      this.text = this.text.replace(/([.]{1}[\s]*)([a-zA-Z]{1})/g, (wholeMatch, dotSpaceGroup, letterGroup) => {
        return dotSpaceGroup + letterGroup.toUpperCase();
      });
    },
    capitalizedCase() {
      this.text = this.text.toLowerCase();
      var lines = this.text.split("\n");
      for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        var words = lines[lineIndex].split(" ");
        for (var wordIndex = 0; wordIndex < words.length; wordIndex++) {
          words[wordIndex] = words[wordIndex].substring(0, 1).toUpperCase() + words[wordIndex].substring(1);
        }
        lines[lineIndex] = words.join(" ");
      }
      this.text = lines.join("\n");
    },
    alternatingCase() {
      this.text = this.text.toLowerCase();
      var alternatingCaseText = "";
      for (var textIndex = 0; textIndex < this.text.length; textIndex++) {
        alternatingCaseText += textIndex % 2 == 0 ? this.text[textIndex].toLowerCase() : this.text[textIndex].toUpperCase();
      }
      this.text = alternatingCaseText;
    },
    titleCase() {
      var lowerText = this.text.toLowerCase();
      var stopWords = ["in", "for", "of", "at", "by", "on", "out", "up", "for", "as", "with", "to", "is", "the", "a", "an", "and", "but", "or"];
      var lowerLines = lowerText.split("\n");
      for (var lowerLineIndex = 0; lowerLineIndex < lowerLines.length; lowerLineIndex++) {
        var sentenceSegments = lowerLines[lowerLineIndex].split(".");
        for (var segmentIndex = 0; segmentIndex < sentenceSegments.length; segmentIndex++) {
          var segmentWords = sentenceSegments[segmentIndex].split(" ");
          for (var segmentWordIndex = 0; segmentWordIndex < segmentWords.length; segmentWordIndex++) {
            if (!stopWords.includes(segmentWords[segmentWordIndex])) {
              segmentWords[segmentWordIndex] = segmentWords[segmentWordIndex].substring(0, 1).toUpperCase() + segmentWords[segmentWordIndex].substring(1);
            }
          }
          sentenceSegments[segmentIndex] = segmentWords.join(" ");
        }
        lowerLines[lowerLineIndex] = sentenceSegments.join(".");
      }
      lowerText = lowerLines.join("\n");
      this.text = lowerText;
    },
    inverseCase() {
      var swappedCaseText = "";
      for (var textPos = 0; textPos < this.text.length; textPos++) {
        swappedCaseText += this.text[textPos] == this.text[textPos].toUpperCase() ? this.text[textPos].toLowerCase() : this.text[textPos].toUpperCase();
      }
      this.text = swappedCaseText;
    },
    downloadText() {
      c.downloadTxt(location.host.replace(/\./g, "_") + ".txt", this.text);
    },
    copyText() {
      c.copy(this.text);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");