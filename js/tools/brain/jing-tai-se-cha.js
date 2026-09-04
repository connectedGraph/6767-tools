c.preventCheat();
const dialogMap = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
Vue.createApp({
  components: dialogMap,
  data() {
    return {
      programName: "静态色差",
      gameState: 1,
      gameStartTime: 0,
      gameEndTime: 0,
      gameSecondTime: 0,
      gameTimeInterval: 0,
      level: 1,
      levelDeltaEArr: [26, 22, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.8, 1.6, 1.4, 1.3, 1.2, 1.1, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1],
      randomRgb: {
        r: "",
        g: "",
        b: ""
      },
      similarRgb: {
        r: "",
        g: "",
        b: ""
      },
      similarColorIndex: 0,
      emoji: "",
      scoreDesc: "",
      audioContext: null
    };
  },
  mounted() {
    this.setRelateToolPosition();
    this.startGame();
    window.addEventListener("resize", () => {
      this.setRelateToolPosition();
    });
  },
  methods: {
    setRelateToolPosition() {
    },
    startGame() {
      this.gameStartTime = new Date().getTime();
      this.gameEndTime = this.gameStartTime;
      this.gameSecondTime = 0;
      c.clearSchedule(this.gameTimeInterval);
      this.gameTimeInterval = c.schedule(() => {
        let elapsedTime = new Date().getTime() - this.gameStartTime;
        this.gameSecondTime = Math.floor(elapsedTime / 1000);
      }, 1000);
      this.level = 1;
      this.similarColorIndex = 0;
      this.gameState = 1;
      this.generateLevel();
      if (this.audioContext == null) {
        this.audioContext = new AudioContext();
      }
    },
    generateLevel() {
      if (this.gameState != 1) {
        return;
      }
      this.randomRgb = {
        r: Math.floor(Math.random() * 200),
        g: Math.floor(Math.random() * 200),
        b: Math.floor(Math.random() * 200)
      };
      this.similarRgb = this.createSimilarRgb(this.randomRgb);
      this.similarColorIndex = Math.floor(Math.random() * 9);
    },
    selectSimilarColor(color) {
      let level = this.level;
      if (color == this.similarColorIndex) {
        this.gameEndTime = new Date().getTime();
        if (this.level == this.levelDeltaEArr.length) {
          this.emoji = "😮";
          this.scoreDesc = "您通关了，用时 " + Number(((this.gameEndTime - this.gameStartTime) / 1000).toFixed(3)) + " 秒，您能识别的静态色差值 ΔE=" + this.levelDeltaEArr[this.level - 1] + "，此色差值不是您的极限，是游戏关卡数量限制了您！";
          c.playAudio(staticSiteHost + "/audio/brain/huan-hu.mp3");
        } else {
          const colorCount = 26;
          let colorIndex = (this.level - 1) % colorCount + 1;
          if (colorIndex <= 13) {} else {
            colorIndex = 26 - colorIndex + 1;
          }
          this.playAudio(colorIndex);
          this.level++;
          this.generateLevel();
          return;
        }
      } else {
        if (this.level <= 2) {
          this.emoji = "😥";
        } else if (this.level <= 10) {
          this.emoji = "🙂";
        } else if (this.level <= 20) {
          this.emoji = "👏";
        } else {
          this.emoji = "😎";
        }
        level = this.level - 1;
        this.scoreDesc = "您的通关数量：" + level + " 关，用时 " + Number(((this.gameEndTime - this.gameStartTime) / 1000).toFixed(3)) + " 秒。";
        if (level > 0) {
          this.scoreDesc += "\n您能识别的静态色差值 ΔE=" + this.levelDeltaEArr[level - 1];
        }
        c.playAudio(staticSiteHost + "/audio/brain/error.mp3");
      }
      this.gameState = 2;
      c.clearSchedule(this.gameTimeInterval);
      var scorePayload = {
        programName: this.programName,
        score: level,
        time: this.gameEndTime - this.gameStartTime
      };
      c.game.addRankingList(scorePayload);
    },
    rgbToLab(red, green, blue) {
      red /= 255;
      green /= 255;
      blue /= 255;
      let xChannel;
      let yChannel;
      let zChannel;
      red = red > 0.04045 ? Math.pow((red + 0.055) / 1.055, 2.4) : red / 12.92;
      green = green > 0.04045 ? Math.pow((green + 0.055) / 1.055, 2.4) : green / 12.92;
      blue = blue > 0.04045 ? Math.pow((blue + 0.055) / 1.055, 2.4) : blue / 12.92;
      xChannel = red * 0.4124 + green * 0.3576 + blue * 0.1805;
      yChannel = red * 0.2126 + green * 0.7152 + blue * 0.0722;
      zChannel = red * 0.0193 + green * 0.1192 + blue * 0.9505;
      xChannel /= 0.95047;
      yChannel /= 1;
      zChannel /= 1.08883;
      function labF(fInput) {
        if (fInput > 0.008856) {
          return Math.pow(fInput, 1 / 3);
        } else {
          return fInput * 7.787 + 16 / 116;
        }
      }
      let obj0 = {
        l: labF(yChannel) * 116 - 16,
        a: (labF(xChannel) - labF(yChannel)) * 500,
        b: (labF(yChannel) - labF(zChannel)) * 200
      };
      return obj0;
    },
    labToRgb(labL, labA, labB) {
      const whitePointX = 0.95047;
      const whitePointY = 1;
      const whitePointZ = 1.08883;
      function labFInverse(fInvInput) {
        if (fInvInput > 6 / 29) {
          return Math.pow(fInvInput, 3);
        } else {
          return (fInvInput - 16 / 116) / 7.787;
        }
      }
      let fy = (labL + 16) / 116;
      let fx = labA / 500 + fy;
      let fz = fy - labB / 200;
      fx = whitePointX * labFInverse(fx);
      fy = whitePointY * labFInverse(fy);
      fz = whitePointZ * labFInverse(fz);
      let linearRgb = [fx * 3.2406 + fy * -1.5372 + fz * -0.4986, fx * -0.9689 + fy * 1.8758 + fz * 0.0415, fx * 0.0557 + fy * -0.204 + fz * 1.057];
      function linearToSrgb(linearChannel) {
        if (linearChannel > 0.0031308) {
          return Math.pow(linearChannel, 1 / 2.4) * 1.055 - 0.055;
        } else {
          return linearChannel * 12.92;
        }
      }
      linearRgb = [linearToSrgb(linearRgb[0]), linearToSrgb(linearRgb[1]), linearToSrgb(linearRgb[2])];
      linearRgb = [Math.min(255, Math.max(0, Math.round(linearRgb[0] * 255))), Math.min(255, Math.max(0, Math.round(linearRgb[1] * 255))), Math.min(255, Math.max(0, Math.round(linearRgb[2] * 255)))];
      const rgbColor = {
        r: linearRgb[0],
        g: linearRgb[1],
        b: linearRgb[2]
      };
      return rgbColor;
    },
    getDeltaE(lab1, lab2) {
      let deltaL = lab2.l - lab1.l;
      let deltaA = lab2.a - lab1.a;
      let deltaB = lab2.b - lab1.b;
      return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
    },
    createSimilarRgb(rgbColor) {
      const labColor = this.rgbToLab(rgbColor.r, rgbColor.g, rgbColor.b);
      let labVariant;
      let randomBit = Math.round(Math.random() * 1);
      let deltaOffset = randomBit == 0 ? -0.1 : 0.1;
      let var0;
      do {
        labVariant = {
          l: labColor.l + deltaOffset,
          a: labColor.a,
          b: labColor.b
        };
        var0 = this.getDeltaE(labColor, labVariant);
        if (var0 < this.levelDeltaEArr[this.level - 1]) {
          deltaOffset = deltaOffset + (randomBit == 0 ? -0.1 : 0.1);
        } else {
          deltaOffset = deltaOffset + (randomBit == 0 ? -0.01 : 0.01);
        }
      } while (Math.abs(var0 - this.levelDeltaEArr[this.level - 1]) > 0.05);
      const similarRgb = this.labToRgb(labVariant.l, labVariant.a, labVariant.b);
      return similarRgb;
    },
    playAudio(noteIndex) {
      var volume = 0.5;
      var noteFrequencies = [150, 262, 294, 330, 349, 392, 440, 494, 523, 587, 659, 698, 784, 880, 988, 1047, 1110, 1170, 1230, 1290, 1350];
      var oscillator = this.audioContext.createOscillator();
      var gainNode = this.audioContext.createGain();
      oscillator.connect(gainNode);
      oscillator.type = "sine";
      oscillator.frequency.value = noteIndex > noteFrequencies.length - 1 ? noteFrequencies[noteFrequencies.length - 1] : noteFrequencies[noteIndex];
      gainNode.connect(this.audioContext.destination);
      gainNode.gain.value = 0.4;
      oscillator.start();
      gainNode.gain.linearRampToValueAtTime(0.6, this.audioContext.currentTime + 0.01);
      oscillator.stop(this.audioContext.currentTime + volume);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + volume);
    }
  }
}).use(ElementPlus).mount(".main-body");