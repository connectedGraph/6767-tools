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
        a: "ɐ",
        b: "q",
        c: "ɔ",
        d: "p",
        e: "ǝ",
        f: "ɟ",
        g: "ƃ",
        h: "ɥ",
        i: "ᴉ",
        j: "ɾ",
        k: "ʞ",
        l: "l",
        m: "ɯ",
        n: "u",
        o: "o",
        p: "d",
        q: "b",
        r: "ɹ",
        s: "s",
        t: "ʇ",
        u: "n",
        v: "ʌ",
        w: "ʍ",
        x: "x",
        y: "ʎ",
        z: "z",
        A: "∀",
        B: "B",
        C: "Ɔ",
        D: "ᗡ",
        E: "Ǝ",
        F: "Ⅎ",
        G: "פ",
        H: "H",
        I: "I",
        J: "ſ",
        K: "K",
        L: "˥",
        M: "W",
        N: "N",
        O: "O",
        P: "Ԁ",
        Q: "Q",
        R: "R",
        S: "S",
        T: "┴",
        U: "∩",
        V: "Λ",
        W: "M",
        X: "X",
        Y: "⅄",
        Z: "Z"
      }
    };
  },
  computed: {
    convertedText() {
      var text = this.text;
      if (c.isNullOrEmpty(text)) {
        text = "Type or paste your content here";
      }
      var result = "";
      for (var index = text.length - 1; index >= 0; index--) {
        if (typeof this.textMap[text[index]] != "undefined") {
          result += this.textMap[text[index]];
        } else {
          result += text[index];
        }
      }
      return result;
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