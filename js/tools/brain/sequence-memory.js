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
      programName: "顺序记忆",
      gameState: 0,
      blockIndexArr: [],
      blockClickIndex: 0,
      highlightBlockIndex: null,
      createGameLevelsOver: true,
      gameStartTime: 0,
      gameEndTime: 0,
      audioContext: null,
      setTimeout1: null,
      setTimeout2: null
    };
  },
  mounted() {
    this.setRelateToolPosition();
  },
  methods: {
    setRelateToolPosition() {
    },
    startGame() {
      this.gameState = 1;
      this.gameStartTime = new Date().getTime();
      this.blockIndexArr = [];
      this.createGameLevels();
      if (this.audioContext == null) {
        this.audioContext = new AudioContext();
      }
    },
    getRandomInRange(minValue, maxValue, excludeValue) {
      var randomValue;
      do {
        randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      } while (randomValue === excludeValue);
      return randomValue;
    },
    createGameLevels() {
      this.blockClickIndex = 0;
      this.createGameLevelsOver = false;
      var lastSequenceIndex = this.blockIndexArr.length > 0 ? this.blockIndexArr[this.blockIndexArr.length - 1] : -1;
      this.blockIndexArr.push(this.getRandomInRange(0, 8, lastSequenceIndex));
      var flashSequenceBlock = blockIndex => {
        if (blockIndex < this.blockIndexArr.length) {
          this.highlightBlockIndex = this.blockIndexArr[blockIndex];
          this.playAudio(this.highlightBlockIndex + 1);
          var oneBasedIndex = blockIndex + 1;
          if (oneBasedIndex == this.blockIndexArr.length) {
            setTimeout(() => {
              this.highlightBlockIndex = null;
              this.createGameLevelsOver = true;
            }, 700);
          } else {
            setTimeout(() => {
              flashSequenceBlock(oneBasedIndex);
            }, 500);
          }
        }
      };
      setTimeout(() => {
        flashSequenceBlock(0);
      }, 700);
    },
    blockClick(clickedBlockIndex) {
      if (this.createGameLevelsOver) {
        if (clickedBlockIndex == this.blockIndexArr[this.blockClickIndex]) {
          this.playAudio(clickedBlockIndex + 1);
          this.blockClickIndex++;
          this.highlightBlockIndex = clickedBlockIndex;
          if (this.setTimeout1 != null) {
            clearTimeout(this.setTimeout1);
            this.setTimeout1 = null;
          }
          if (this.setTimeout2 != null) {
            clearTimeout(this.setTimeout2);
            this.setTimeout2 = null;
          }
          this.setTimeout1 = setTimeout(() => {
            this.highlightBlockIndex = null;
          }, 300);
          if (this.blockClickIndex == this.blockIndexArr.length) {
            this.gameEndTime = new Date().getTime();
            this.createGameLevelsOver = false;
            this.setTimeout2 = setTimeout(() => {
              this.createGameLevels();
            }, 900);
            document.querySelector(".game-area").style.backgroundColor = "#3AAEF6";
            setTimeout(() => {
              document.querySelector(".game-area").style.backgroundColor = "#2b87d1";
            }, 200);
          }
        } else {
          this.playAudio(0);
          this.gameState = 2;
          document.querySelector(".game-area").style.backgroundColor = "#ce2636";
          setTimeout(() => {
            document.querySelector(".game-area").style.backgroundColor = "#2b87d1";
          }, 200);
          var programResultData = {
            programName: this.programName,
            score: this.blockIndexArr.length - 1,
            time: this.gameEndTime - this.gameStartTime
          };
          c.game.addRankingList(programResultData);
        }
      }
    },
    againGame() {
      this.gameState = 0;
    },
    playAudio(frequency) {
      if (!mainNavVueObj.soundOpen) {
        return;
      }
      var noteDuration = 0.5;
      var noteFrequencies = [150, 262, 294, 330, 349, 392, 440, 494, 523, 587];
      var oscillator = this.audioContext.createOscillator();
      var gainNode = this.audioContext.createGain();
      oscillator.connect(gainNode);
      oscillator.type = "sine";
      oscillator.frequency.value = frequency > noteFrequencies.length - 1 ? noteFrequencies[noteFrequencies.length - 1] : noteFrequencies[frequency];
      gainNode.connect(this.audioContext.destination);
      gainNode.gain.value = 0.4;
      oscillator.start();
      gainNode.gain.linearRampToValueAtTime(0.6, this.audioContext.currentTime + 0.01);
      oscillator.stop(this.audioContext.currentTime + noteDuration);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + noteDuration);
    }
  }
}).use(ElementPlus).mount(".main-body");