Vue.createApp({
  components: {
    comment: comment,
    "my-div-input": myDivInput
  },
  data() {
    return {
      textForFind: "",
      textForReplace: "",
      text: "",
      isTextFocus: false,
      charCount: 0,
      wordCount: 0,
      sentenceCount: 0,
      lineCount: 0
    };
  },
  watch: {
    text: {
      handler() {
        var originalText = this.getText();
        this.charCount = originalText.length;
        this.wordCount = originalText == "" ? 0 : originalText.split(" ").length;
        this.sentenceCount = 0;
        this.sentenceArr = originalText.split(".");
        for (var sentenceIndex = 0; sentenceIndex < this.sentenceArr.length; sentenceIndex++) {
          if (!c.isNullOrEmpty(this.sentenceArr[sentenceIndex])) {
            this.sentenceCount++;
          }
        }
        this.lineCount = originalText == "" ? 0 : originalText.split("\n").length;
      },
      immediate: true
    }
  },
  methods: {
    findText() {
      this.text = this.text.replace(/<[\/]?mark>/g, "");
      if (!this.isTextFocus && this.textForFind != "") {
        var findRegex = new RegExp(this.textForFind, "g");
        this.text = this.text.replace(findRegex, "<mark>" + this.textForFind + "</mark>");
      }
    },
    replaceText() {
      if (this.textForFind != "" && this.textForReplace != "" && this.textForFind != this.textForReplace) {
        var globalRegex = new RegExp(this.textForFind, "g");
        this.text = this.text.replace(/<[\/]?mark>/g, "").replace(globalRegex, this.textForReplace);
      }
    },
    getText() {
      var copyTextareaElement = document.getElementById("copyTextarea");
      if (copyTextareaElement == null) {
        copyTextareaElement = document.createElement("div");
        copyTextareaElement.id = "copyTextArea";
        copyTextareaElement.style.height = "0px";
        copyTextareaElement.style.overflow = "hidden";
        copyTextareaElement.style.position = "absolute";
        document.body.appendChild(copyTextareaElement);
      }
      copyTextareaElement.innerHTML = this.text;
      return copyTextareaElement.innerText;
    },
    downloadText() {
      c.downloadTxt(location.host.replace(/\./g, "_") + ".txt", this.getText());
    },
    copyText() {
      c.copy(this.getText());
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");