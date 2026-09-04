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
        "0": "0̶",
        "1": "1̶",
        "2": "2̶",
        "3": "3̶",
        "4": "4̶",
        "5": "5̶",
        "6": "6̶",
        "7": "7̶",
        "8": "8̶",
        "9": "9̶",
        a: "a̶",
        b: "b̶",
        c: "c̶",
        d: "d̶",
        e: "e̶",
        f: "f̶",
        g: "g̶",
        h: "h̶",
        i: "i̶",
        j: "j̶",
        k: "k̶",
        l: "l̶",
        m: "m̶",
        n: "n̶",
        o: "o̶",
        p: "p̶",
        q: "q̶",
        r: "r̶",
        s: "s̶",
        t: "t̶",
        u: "u̶",
        v: "v̶",
        w: "w̶",
        x: "x̶",
        y: "y̶",
        z: "z̶",
        A: "A̶",
        B: "B̶",
        C: "C̶",
        D: "D̶",
        E: "E̶",
        F: "F̶",
        G: "G̶",
        H: "H̶",
        I: "I̶",
        J: "J̶",
        K: "K̶",
        L: "L̶",
        M: "M̶",
        N: "N̶",
        O: "O̶",
        P: "P̶",
        Q: "Q̶",
        R: "R̶",
        S: "S̶",
        T: "T̶",
        U: "U̶",
        V: "V̶",
        W: "W̶",
        X: "X̶",
        Y: "Y̶",
        Z: "Z̶",
        "`": "`̶",
        "~": "~̶",
        "!": "!̶",
        "@": "@̶",
        "#": "#̶",
        $: "$̶",
        "%": "%̶",
        "^": "^̶",
        "&": "&̶",
        "*": "*̶",
        "(": "(̶",
        ")": ")̶",
        "-": "-̶",
        _: "_̶",
        "=": "=̶",
        "+": "+̶",
        "[": "[̶",
        "{": "{̶",
        "]": "]̶",
        "}": "}̶",
        "|": "̶|",
        ";": "̶;",
        ":": "̶:",
        "'": "̶'",
        "\"": "\"̶",
        ",": ",̶",
        "<": "<̶",
        ".": ".̶",
        ">": ">̶",
        "/": "/̶",
        "?": "?̶",
        " ": "̶ ̶"
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
      for (var charIndex = 0; charIndex < text.length; charIndex++) {
        if (typeof this.textMap[text[charIndex]] != "undefined") {
          result += this.textMap[text[charIndex]];
        } else {
          result += text[charIndex];
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