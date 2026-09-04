c.preventCheat();
var dialogComponentMap = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
Vue.createApp({
  components: dialogComponentMap,
  data() {
    return {
      programName: "数字顺序记忆",
      gameState: 0,
      numberOfDigits: 4,
      numberGrid: [],
      numberClickIndex: 1,
      lives: 3,
      success: false,
      gameStartTime: 0,
      gameEndTime: 0,
      audioContext: null
    };
  },
  mounted() {
    this.setRelateToolPosition();
    document.querySelector(".tool-body .content video").parentNode.style.textAlign = "center";
  },
  methods: {
    setRelateToolPosition() {
    },
    startGame(initialDigitCount) {
      this.gameState = 1;
      if (initialDigitCount) {
        this.gameStartTime = new Date().getTime();
      }
      var sequenceNumbers = [];
      for (var loopIndex = 1; loopIndex <= 40; loopIndex++) {
        sequenceNumbers.push(loopIndex);
      }
      sequenceNumbers.sort(function () {
        return Math.random() - 0.5;
      });
      for (var loopIndex = 0; loopIndex < sequenceNumbers.length; loopIndex++) {
        if (sequenceNumbers[loopIndex] > this.numberOfDigits) {
          sequenceNumbers[loopIndex] = "";
        }
      }
      this.numberGrid = sequenceNumbers;
      this.numberClickIndex = 1;
      if (this.audioContext == null) {
        this.audioContext = new AudioContext();
      }
    },
    numberGridClick(clickedNumber, gridElement) {
      if (gridElement == this.numberClickIndex) {
        this.playAudio(this.numberClickIndex);
        this.numberClickIndex++;
        this.numberGrid[clickedNumber] = "";
        if (this.numberClickIndex > this.numberOfDigits) {
          this.gameEndTime = new Date().getTime();
          this.numberOfDigits++;
          if (this.numberOfDigits > 40) {
            this.gameState = 3;
          } else {
            this.gameState = 2;
          }
        }
        this.success = true;
      } else {
        this.playAudio(0);
        this.lives -= 1;
        if (this.lives == 0) {
          this.gameState = 3;
        } else {
          this.gameState = 2;
        }
        this.success = false;
      }
      if (this.gameState == 3) {
        var scoreSubmitData = {
          programName: this.programName,
          score: this.numberOfDigits - 4,
          time: this.gameEndTime - this.gameStartTime
        };
        c.game.addRankingList(scoreSubmitData);
      }
    },
    againGame() {
      this.gameState = 0;
      this.numberOfDigits = 4;
      this.lives = 3;
    },
    playAudio(frequency) {
      if (!mainNavVueObj.soundOpen) {
        return;
      }
      var volume = 0.5;
      var frequencyList = [150, 262, 294, 330, 349, 392, 440, 494, 523, 587, 659, 698, 784, 880, 988, 1047, 1110, 1170, 1230, 1290, 1350];
      var oscillator = this.audioContext.createOscillator();
      var gainNode = this.audioContext.createGain();
      oscillator.connect(gainNode);
      oscillator.type = "sine";
      oscillator.frequency.value = frequency > frequencyList.length - 1 ? frequencyList[frequencyList.length - 1] : frequencyList[frequency];
      gainNode.connect(this.audioContext.destination);
      gainNode.gain.value = 0.4;
      oscillator.start();
      gainNode.gain.linearRampToValueAtTime(0.6, this.audioContext.currentTime + 0.01);
      oscillator.stop(this.audioContext.currentTime + volume);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + volume);
    }
  }
}).use(ElementPlus).mount(".main-body");