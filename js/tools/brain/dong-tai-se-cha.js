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
      programName: "动态色差",
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
      gameAreaWidth: 0,
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      moveSpeed: 0,
      lastMoveTimme: 0,
      moveAnimationId: null,
      emoji: "",
      scoreDesc: "",
      audioContext: null
    };
  },
  mounted() {
    this.setRelateToolPosition();
    this.getGameAreaSize();
    this.startGame();
    window.addEventListener("resize", () => {
      this.setRelateToolPosition();
      this.getGameAreaSize();
      cancelAnimationFrame(this.moveAnimationId);
      this.moveSamllRect();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(this.moveAnimationId);
      } else {
        this.moveSamllRect();
      }
    });
  },
  methods: {
    setRelateToolPosition() {
    },
    getGameAreaSize() {
      if (this.gameState != 1) {
        return;
      }
      let gamePlayRect = document.querySelector(".game-play").getBoundingClientRect();
      this.gameAreaWidth = gamePlayRect.width;
    },
    startGame() {
      this.gameStartTime = new Date().getTime();
      this.gameEndTime = this.gameStartTime;
      this.gameSecondTime = 0;
      c.clearSchedule(this.gameTimeInterval);
      this.gameTimeInterval = c.schedule(() => {
        let gameElapsedTime = new Date().getTime() - this.gameStartTime;
        this.gameSecondTime = Math.floor(gameElapsedTime / 1000);
      }, 1000);
      this.level = 1;
      this.gameState = 1;
      this.generateLevel();
      this.moveSamllRect();
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
    },
    clickRect(clickedRect) {
      if (this.gameState != 1) {
        return;
      }
      let currentLevel = this.level;
      if (clickedRect == "small") {
        this.gameEndTime = new Date().getTime();
        if (this.level == this.levelDeltaEArr.length) {
          this.emoji = "😮";
          this.scoreDesc = "您通关了，用时 " + Number(((this.gameEndTime - this.gameStartTime) / 1000).toFixed(3)) + " 秒，您能识别的动态色差值 ΔE=" + this.levelDeltaEArr[this.level - 1] + "，此色差值不是您的极限，是游戏关卡数量限制了您！";
          c.playAudio(staticSiteHost + "/audio/brain/huan-hu.mp3");
        } else {
          const levelVariantCount = 26;
          let currentLevelInCycle = (this.level - 1) % levelVariantCount + 1;
          if (currentLevelInCycle <= 13) {} else {
            currentLevelInCycle = 26 - currentLevelInCycle + 1;
          }
          this.playAudio(currentLevelInCycle);
          this.level++;
          this.generateLevel();
          cancelAnimationFrame(this.moveAnimationId);
          this.moveSamllRect();
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
        currentLevel = this.level - 1;
        this.scoreDesc = "您的通关数量：" + currentLevel + " 关，用时 " + Number(((this.gameEndTime - this.gameStartTime) / 1000).toFixed(3)) + " 秒。";
        if (currentLevel > 0) {
          this.scoreDesc += "\n您能识别的动态色差值 ΔE=" + this.levelDeltaEArr[currentLevel - 1];
        }
        c.playAudio(staticSiteHost + "/audio/brain/error.mp3");
      }
      this.gameState = 2;
      c.clearSchedule(this.gameTimeInterval);
      cancelAnimationFrame(this.moveAnimationId);
      var gameScorePayload = {
        programName: this.programName,
        score: currentLevel,
        time: this.gameEndTime - this.gameStartTime
      };
      c.game.addRankingList(gameScorePayload);
    },
    getRandomPosition() {
      return {
        x: Math.floor(Math.random() * (this.gameAreaWidth - this.gameAreaWidth / 3)),
        y: Math.floor(Math.random() * (this.gameAreaWidth - this.gameAreaWidth / 3))
      };
    },
    moveSamllRect() {
      var randomTargetPosition = this.getRandomPosition();
      this.currentX = randomTargetPosition.x;
      this.currentY = randomTargetPosition.y;
      randomTargetPosition = this.getRandomPosition();
      this.targetX = randomTargetPosition.x;
      this.targetY = randomTargetPosition.y;
      this.lastMoveTimme = performance.now();
      this.moveSpeed = this.gameAreaWidth / 450 * 0.07;
      this.moveAnimationId = window.requestAnimationFrame(this.moveAnimation);
    },
    moveAnimation(animationTimestamp) {
      const timeSinceLastMove = animationTimestamp - this.lastMoveTimme;
      this.lastMoveTimme = animationTimestamp;
      const deltaX = this.targetX - this.currentX;
      const deltaY = this.targetY - this.currentY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < 1) {
        var newTargetPosition = this.getRandomPosition();
        this.targetX = newTargetPosition.x;
        this.targetY = newTargetPosition.y;
        this.moveAnimationId = window.requestAnimationFrame(this.moveAnimation);
        return;
      }
      const stepDistance = this.moveSpeed * timeSinceLastMove;
      const stepOffsetX = deltaX / distance * stepDistance;
      const stepOffsetY = deltaY / distance * stepDistance;
      this.currentX += stepOffsetX;
      this.currentY += stepOffsetY;
      this.moveAnimationId = window.requestAnimationFrame(this.moveAnimation);
    },
    rgbToLab(red, green, blue) {
      red /= 255;
      green /= 255;
      blue /= 255;
      let xyzX;
      let xyzY;
      let xyzZ;
      red = red > 0.04045 ? Math.pow((red + 0.055) / 1.055, 2.4) : red / 12.92;
      green = green > 0.04045 ? Math.pow((green + 0.055) / 1.055, 2.4) : green / 12.92;
      blue = blue > 0.04045 ? Math.pow((blue + 0.055) / 1.055, 2.4) : blue / 12.92;
      xyzX = red * 0.4124 + green * 0.3576 + blue * 0.1805;
      xyzY = red * 0.2126 + green * 0.7152 + blue * 0.0722;
      xyzZ = red * 0.0193 + green * 0.1192 + blue * 0.9505;
      xyzX /= 0.95047;
      xyzY /= 1;
      xyzZ /= 1.08883;
      function labF(xyzChannel) {
        if (xyzChannel > 0.008856) {
          return Math.pow(xyzChannel, 1 / 3);
        } else {
          return xyzChannel * 7.787 + 16 / 116;
        }
      }
      let labColor = {
        l: labF(xyzY) * 116 - 16,
        a: (labF(xyzX) - labF(xyzY)) * 500,
        b: (labF(xyzY) - labF(xyzZ)) * 200
      };
      return labColor;
    },
    labToRgb(labL, labA, labB) {
      const xWhiteRef = 0.95047;
      const yWhiteRef = 1;
      const zWhiteRef = 1.08883;
      function labFInverse(fValue) {
        if (fValue > 6 / 29) {
          return Math.pow(fValue, 3);
        } else {
          return (fValue - 16 / 116) / 7.787;
        }
      }
      let fy = (labL + 16) / 116;
      let fx = labA / 500 + fy;
      let fz = fy - labB / 200;
      fx = xWhiteRef * labFInverse(fx);
      fy = yWhiteRef * labFInverse(fy);
      fz = zWhiteRef * labFInverse(fz);
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
      const rgbColorObject = {
        r: linearRgb[0],
        g: linearRgb[1],
        b: linearRgb[2]
      };
      return rgbColorObject;
    },
    getDeltaE(labColor1, labColor2) {
      let deltaL = labColor2.l - labColor1.l;
      let deltaA = labColor2.a - labColor1.a;
      let deltaB = labColor2.b - labColor1.b;
      return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
    },
    createSimilarRgb(originalRgb) {
      const originalLab = this.rgbToLab(originalRgb.r, originalRgb.g, originalRgb.b);
      let newLabColor;
      let randomBit = Math.round(Math.random() * 1);
      let lightnessAdjustment = randomBit == 0 ? -0.1 : 0.1;
      let previousLabColor;
      do {
        newLabColor = {
          l: originalLab.l + lightnessAdjustment,
          a: originalLab.a,
          b: originalLab.b
        };
        previousLabColor = this.getDeltaE(originalLab, newLabColor);
        if (previousLabColor < this.levelDeltaEArr[this.level - 1]) {
          lightnessAdjustment = lightnessAdjustment + (randomBit == 0 ? -0.1 : 0.1);
        } else {
          lightnessAdjustment = lightnessAdjustment + (randomBit == 0 ? -0.01 : 0.01);
        }
      } while (Math.abs(previousLabColor - this.levelDeltaEArr[this.level - 1]) > 0.05);
      const convertedRgb = this.labToRgb(newLabColor.l, newLabColor.a, newLabColor.b);
      return convertedRgb;
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