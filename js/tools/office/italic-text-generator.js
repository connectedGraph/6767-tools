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
      lineCount: 0,
      textMap: {
        a: "𝘢",
        b: "𝘣",
        c: "𝘤",
        d: "𝘥",
        e: "𝘦",
        f: "𝘧",
        g: "𝘨",
        h: "𝘩",
        i: "𝘪",
        j: "𝘫",
        k: "𝘬",
        l: "𝘭",
        m: "𝘮",
        n: "𝘯",
        o: "𝘰",
        p: "𝘱",
        q: "𝘲",
        r: "𝘳",
        s: "𝘴",
        t: "𝘵",
        u: "𝘶",
        v: "𝘷",
        w: "𝘸",
        x: "𝘹",
        y: "𝘺",
        z: "𝘻",
        A: "𝘈",
        B: "𝘉",
        C: "𝘊",
        D: "𝘋",
        E: "𝘌",
        F: "𝘍",
        G: "𝘎",
        H: "𝘏",
        I: "𝘐",
        J: "𝘑",
        K: "𝘒",
        L: "𝘓",
        M: "𝘔",
        N: "𝘕",
        O: "𝘖",
        P: "𝘗",
        Q: "𝘘",
        R: "𝘙",
        S: "𝘚",
        T: "𝘛",
        U: "𝘜",
        V: "𝘝",
        W: "𝘞",
        X: "𝘟",
        Y: "𝘠",
        Z: "𝘡"
      }
    };
  },
  computed: {
    convertedText() {
      var inputText = this.text;
      if (c.isNullOrEmpty(inputText)) {
        inputText = "Type or paste your content here";
      }
      var outputText = "";
      for (var charIndex = 0; charIndex < inputText.length; charIndex++) {
        if (typeof this.textMap[inputText[charIndex]] != "undefined") {
          outputText += this.textMap[inputText[charIndex]];
        } else {
          outputText += inputText[charIndex];
        }
      }
      return outputText;
    }
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
    downloadText() {
      c.downloadTxt(location.host.replace(/\./g, "_") + ".txt", this.convertedText);
    },
    copyText() {
      c.copy(this.convertedText);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");