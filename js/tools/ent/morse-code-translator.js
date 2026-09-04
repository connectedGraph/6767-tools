c.preventCheat();
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
      lineCount: 0,
      morseCode: "",
      textToMorseCodeMap: {
        a: ".-",
        b: "-...",
        c: "-.-.",
        d: "-..",
        e: ".",
        f: "..-.",
        g: "--.",
        h: "....",
        i: "..",
        j: ".---",
        k: "-.-",
        l: ".-..",
        m: "--",
        n: "-.",
        o: "---",
        p: ".--.",
        q: "--.-",
        r: ".-.",
        s: "...",
        t: "-",
        u: "..-",
        v: "...-",
        w: ".--",
        x: "-..-",
        y: "-.--",
        z: "--..",
        "1": ".----",
        "2": "..---",
        "3": "...--",
        "4": "....-",
        "5": ".....",
        "6": "-....",
        "7": "--...",
        "8": "---..",
        "9": "----.",
        "0": "-----",
        ".": ".-.-.-",
        ",": "--..--",
        "?": "..--..",
        "'": ".----.",
        "/": "-..-.",
        "(": "-.--.",
        ")": "-.--.-",
        "&": ".-...",
        ":": "---...",
        ";": "-.-.-.",
        "=": "-...-",
        "+": ".-.-.",
        "-": "-....-",
        _: "..--.-",
        "\"": ".-..-.",
        $: "...-..-",
        "!": "-.-.--",
        "@": ".--.-.",
        " ": "/"
      },
      morseToTextMap: {
        "-----": "0",
        ".----": "1",
        "..---": "2",
        "...--": "3",
        "....-": "4",
        ".....": "5",
        "-....": "6",
        "--...": "7",
        "---..": "8",
        "----.": "9",
        ".-": "a",
        "-...": "b",
        "-.-.": "c",
        "-..": "d",
        ".": "e",
        "..-.": "f",
        "--.": "g",
        "....": "h",
        "..": "i",
        ".---": "j",
        "-.-": "k",
        ".-..": "l",
        "--": "m",
        "-.": "n",
        "---": "o",
        ".--.": "p",
        "--.-": "q",
        ".-.": "r",
        "...": "s",
        "-": "t",
        "..-": "u",
        "...-": "v",
        ".--": "w",
        "-..-": "x",
        "-.--": "y",
        "--..": "z",
        ".-.-.-": ".",
        "--..--": ",",
        "..--..": "?",
        ".----.": "'",
        "-..-.": "/",
        "-.--.": "(",
        "-.--.-": ")",
        ".-...": "&",
        "---...": ":",
        "-.-.-.": ";",
        "-...-": "=",
        ".-.-.": "+",
        "-....-": "-",
        "..--.-": "_",
        ".-..-.": "\"",
        "...-..-": "$",
        "-.-.--": "!",
        ".--.-.": "@",
        "/": " "
      },
      audioContext: null,
      oscillator: null,
      audioDuration: 0,
      audioSeekDuration: 0,
      audioPlayTime: 0,
      audioPlaying: false,
      audioPlayTimeInterval: null,
      audioSliderInputed: false
    };
  },
  computed: {
    audioPlayDurationStr() {
      var effectivePlayTime = this.audioPlayTime > this.audioDuration + this.audioSeekDuration ? this.audioDuration + this.audioSeekDuration : this.audioPlayTime;
      return this.transDurationStr(effectivePlayTime);
    },
    audioTotalDurationStr() {
      return this.transDurationStr(this.audioDuration + this.audioSeekDuration);
    },
    audioSliderMax() {
      return parseInt((this.audioDuration + this.audioSeekDuration) * 1000, 10);
    },
    audioSliderValue() {
      return parseInt(this.audioPlayTime * 1000, 10);
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
        var inputText = this.text;
        if (c.isNullOrEmpty(inputText)) {
          inputText = "Type or paste your content here";
        }
        var translationResult = "";
        for (var sentenceIndex = 0; sentenceIndex < inputText.length; sentenceIndex++) {
          var currentCharLower = inputText[sentenceIndex].toLowerCase();
          if (typeof this.textToMorseCodeMap[currentCharLower] != "undefined") {
            translationResult += this.textToMorseCodeMap[currentCharLower] + " ";
          }
        }
        this.morseCode = translationResult.trim();
      },
      immediate: true
    },
    morseCode: {
      handler() {
        var morseCodeValue = this.morseCode;
        if (c.isNullOrEmpty(morseCodeValue)) {
          return "";
        }
        var translatedText = "";
        var morseCodeParts = morseCodeValue.split(" ");
        for (var morsePartIndex = 0; morsePartIndex < morseCodeParts.length; morsePartIndex++) {
          if (morseCodeParts[morsePartIndex] != "") {
            if (morseCodeParts[morsePartIndex] == "/") {
              translatedText += " ";
            } else if (typeof this.morseToTextMap[morseCodeParts[morsePartIndex]] != "undefined") {
              translatedText += this.morseToTextMap[morseCodeParts[morsePartIndex]];
            }
          }
        }
        translatedText = translatedText.toLowerCase();
        if (!c.isNullOrEmpty(translatedText)) {
          var firstChar = translatedText.trim().substring(0, 1);
          var firstCharIndex = translatedText.indexOf(firstChar);
          translatedText = translatedText.substring(0, firstCharIndex + 1).toUpperCase() + translatedText.substring(firstCharIndex + 1);
          translatedText = translatedText.replace(/([.]{1}[\s]*)([a-zA-Z]{1})/g, (matchStr, dotWithSpace, letterChar) => {
            return dotWithSpace + letterChar.toUpperCase();
          });
        }
        this.text = translatedText;
        var morseAccumulator = 0;
        var morseCodeParts = this.morseCode.replace(/ \/ /g, "w").replace(/ /g, "c").split("");
        for (var morsePartIndex = 0; morsePartIndex < morseCodeParts.length; morsePartIndex++) {
          switch (morseCodeParts[morsePartIndex]) {
            case ".":
              morseAccumulator += 0.08;
              morseAccumulator += 0.08;
              break;
            case "-":
              morseAccumulator += 0.24;
              morseAccumulator += 0.08;
              break;
            case "c":
              morseAccumulator += 0.24;
              break;
            case "w":
              morseAccumulator += 0.56;
              break;
          }
        }
        this.audioDuration = morseAccumulator;
        this.disposeAudioContent();
        this.audioPlayTime = 0;
        this.audioSeekDuration = 0;
      },
      immediate: true
    }
  },
  methods: {
    playMorseCode() {
      if (this.audioPlaying) {
        this.audioPlaying = false;
        this.audioContext.suspend();
      } else {
        this.audioPlaying = true;
        if (this.audioContext != null && this.audioContext.state === "suspended") {
          this.audioContext.resume();
        } else {
          if (this.audioContext == null) {
            this.audioContext = new AudioContext();
          }
          if (this.oscillator == null) {
            this.oscillator = this.audioContext.createOscillator();
            this.oscillator.type = "sine";
            this.oscillator.frequency.value = 800;
          }
          var gainNode = this.audioContext.createGain();
          let playbackTimerId = 0;
          let playbackElapsedTime = 0;
          gainNode.gain.value = 1;
          var morseTokens = this.morseCode.replace(/ \/ /g, "w").replace(/ /g, "c").split("");
          for (var tokenIndex = 0; tokenIndex < morseTokens.length; tokenIndex++) {
            switch (morseTokens[tokenIndex]) {
              case ".":
                if (playbackElapsedTime + 0.08 <= this.audioSeekDuration) {
                  playbackElapsedTime += 0.08;
                } else {
                  gainNode.gain.setValueAtTime(1, playbackTimerId);
                  if (playbackElapsedTime >= this.audioSeekDuration) {
                    playbackTimerId += 0.08;
                  } else {
                    playbackTimerId += playbackElapsedTime + 0.08 - this.audioSeekDuration;
                    playbackElapsedTime = this.audioSeekDuration;
                  }
                }
                if (playbackElapsedTime + 0.08 <= this.audioSeekDuration) {
                  playbackElapsedTime += 0.08;
                } else {
                  gainNode.gain.setValueAtTime(0, playbackTimerId);
                  if (playbackElapsedTime >= this.audioSeekDuration) {
                    playbackTimerId += 0.08;
                  } else {
                    playbackTimerId += playbackElapsedTime + 0.08 - this.audioSeekDuration;
                    playbackElapsedTime = this.audioSeekDuration;
                  }
                }
                break;
              case "-":
                if (playbackElapsedTime + 0.24 <= this.audioSeekDuration) {
                  playbackElapsedTime += 0.24;
                } else {
                  gainNode.gain.setValueAtTime(1, playbackTimerId);
                  if (playbackElapsedTime >= this.audioSeekDuration) {
                    playbackTimerId += 0.24;
                  } else {
                    playbackTimerId += playbackElapsedTime + 0.24 - this.audioSeekDuration;
                    playbackElapsedTime = this.audioSeekDuration;
                  }
                }
                if (playbackElapsedTime + 0.08 <= this.audioSeekDuration) {
                  playbackElapsedTime += 0.08;
                } else {
                  gainNode.gain.setValueAtTime(0, playbackTimerId);
                  if (playbackElapsedTime >= this.audioSeekDuration) {
                    playbackTimerId += 0.08;
                  } else {
                    playbackTimerId += playbackElapsedTime + 0.08 - this.audioSeekDuration;
                    playbackElapsedTime = this.audioSeekDuration;
                  }
                }
                break;
              case "c":
                if (playbackElapsedTime + 0.24 <= this.audioSeekDuration) {
                  playbackElapsedTime += 0.24;
                } else if (playbackElapsedTime >= this.audioSeekDuration) {
                  playbackTimerId += 0.24;
                } else {
                  playbackTimerId += playbackElapsedTime + 0.24 - this.audioSeekDuration;
                  playbackElapsedTime = this.audioSeekDuration;
                }
                break;
              case "w":
                if (playbackElapsedTime + 0.56 <= this.audioSeekDuration) {
                  playbackElapsedTime += 0.56;
                } else if (playbackElapsedTime >= this.audioSeekDuration) {
                  playbackTimerId += 0.56;
                } else {
                  playbackTimerId += playbackElapsedTime + 0.56 - this.audioSeekDuration;
                  playbackElapsedTime = this.audioSeekDuration;
                }
                break;
            }
          }
          this.audioDuration = playbackTimerId;
          if (this.audioPlayTime >= this.audioDuration + this.audioSeekDuration) {
            this.audioPlayTime = 0;
          }
          gainNode.connect(this.audioContext.destination);
          this.oscillator.connect(gainNode);
          this.oscillator.start(0);
          if (this.audioPlayTimeInterval == null) {
            this.audioPlayTimeInterval = setInterval(() => {
              if (this.audioContext == null) {
                this.audioPlayTimeInterval = null;
                return;
              }
              this.audioPlayTime = this.audioContext.currentTime + this.audioSeekDuration;
              if (this.audioPlayTime >= this.audioDuration + this.audioSeekDuration) {
                this.audioPlayTime = this.audioDuration + this.audioSeekDuration;
                this.audioDuration = this.audioDuration + this.audioSeekDuration;
                this.audioSeekDuration = 0;
                this.disposeAudioContent();
              }
            }, 50);
          }
        }
      }
    },
    disposeAudioContent() {
      if (this.oscillator != null) {
        this.oscillator.stop();
        this.oscillator = null;
      }
      this.audioContext = null;
      this.audioPlaying = false;
      if (this.audioPlayTimeInterval != null) {
        clearInterval(this.audioPlayTimeInterval);
        this.audioPlayTimeInterval = null;
      }
    },
    transDurationStr(durationValue) {
      if (durationValue == 0) {
        return "00:00.00";
      }
      var durationSecondsInt = parseInt(durationValue, 10);
      var durationStr = durationValue.toFixed(2) + "";
      var minutes = parseInt(durationSecondsInt / 60, 10);
      var seconds = parseInt(durationSecondsInt % 60, 10);
      var decimalPart = durationStr.substring(durationStr.indexOf("."));
      return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds) + (decimalPart == "" ? ".00" : decimalPart);
    },
    audioSliderInput(sliderValue) {
      this.audioPlayTime = sliderValue / 1000;
      this.disposeAudioContent();
      this.audioSliderInputed = true;
    },
    audioSliderChange(sliderChangeValue) {
      if (this.audioSliderInputed) {
        this.audioSeekDuration = sliderChangeValue / 1000;
        this.playMorseCode();
        this.audioSliderInputed = false;
      }
    },
    downloadText() {
      c.downloadTxt("morse-code-translator.txt", this.morseCode);
    },
    copyText() {
      c.copy(this.morseCode);
      this.$message.success(locales.copySuccess);
    }
  }
}).use(ElementPlus).mount(".main-body");