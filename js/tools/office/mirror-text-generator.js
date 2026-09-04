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
        a: "ɒ",
        b: "d",
        c: "ɔ",
        d: "b",
        e: "ɘ",
        f: "ʇ",
        g: "ǫ",
        h: "ʜ",
        i: "i",
        j: "ⴑ",
        k: "ʞ",
        l: "l",
        m: "m",
        n: "n",
        o: "o",
        p: "q",
        q: "p",
        r: "ɿ",
        s: "ƨ",
        t: "ƚ",
        u: "u",
        v: "v",
        w: "w",
        x: "x",
        y: "y",
        z: "z",
        A: "A",
        B: "ᙠ",
        C: "Ɔ",
        D: "ᗡ",
        E: "Ǝ",
        F: "ᖷ",
        G: "Ꭾ",
        H: "H",
        I: "I",
        J: "Ⴑ",
        K: "ᐴ",
        L: "ⅅ",
        M: "M",
        N: "И",
        O: "O",
        P: "ꟼ",
        Q: "Ọ",
        R: "Я",
        S: "Ƨ",
        T: "T",
        U: "U",
        V: "V",
        W: "W",
        X: "X",
        Y: "Y",
        Z: "Ƹ"
      }
    };
  },
  computed: {
    convertedText() {
      var originalText = this.text;
      if (c.isNullOrEmpty(originalText)) {
        originalText = "Type or paste your content here";
      }
      var mirroredText = "";
      for (var reverseIndex = originalText.length - 1; reverseIndex >= 0; reverseIndex--) {
        if (typeof this.textMap[originalText[reverseIndex]] != "undefined") {
          mirroredText += this.textMap[originalText[reverseIndex]];
        } else {
          mirroredText += originalText[reverseIndex];
        }
      }
      return mirroredText;
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