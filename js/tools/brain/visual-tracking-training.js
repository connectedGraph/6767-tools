c.preventCheat();
const dialogMap = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
Vue.createApp({
  components: dialogMap,
  data() {
    const programConfig = {
      programName: "视觉追踪训练",
      levelGroupIndex: 1,
      levelGroupDescArr: locales.levelGroupDescArr,
      levelGroupCodeArr: ["8球1目标", "10球2目标", "10球3目标", "12球4目标"],
      gameAreaWidth: 0,
      gameState: 1,
      gameTimeInterval: null,
      gameStartTime: 0,
      gameEndTime: 0,
      gameSecondTime: 0,
      gameProgress: 1,
      totalBall: 10,
      targetBall: 2,
      radius: 20,
      moveSpeed: 260,
      moveSpeedScale: 260,
      maxMoveSpeed: 700,
      moveSpeedTime: 10000,
      NORMAL_COLOR: "#42A5F5",
      TARGET_COLOR: "#F5B542",
      WRONG_COLOR: "#ff0000",
      isRunning: false,
      allowClickBall: false,
      ballList: [],
      targetIndexList: [],
      foundCount: 0,
      showNextLevelBtn: false,
      animationId: null,
      emoji: "",
      scoreDesc: ""
    };
    return programConfig;
  },
  mounted() {
    this.setRelateToolPosition();
    this.getGameAreaSize();
    window.addEventListener("resize", () => {
      this.setRelateToolPosition();
      this.getGameAreaSize();
    });
    this.animateLoop();
    this.setBallCount();
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationId);
  },
  methods: {
    setRelateToolPosition() {
    },
    getGameAreaSize() {
      if (this.gameState == 3) {
        return;
      }
      var gameAreaRect = document.querySelector(".game-area").getBoundingClientRect();
      this.gameAreaWidth = gameAreaRect.width;
      this.radius = this.gameAreaWidth * 0.04;
      this.moveSpeedScale = this.gameAreaWidth / 500 * this.moveSpeed;
    },
    changeLevelGroup(levelGroup) {
      c.clearAllSchedule();
      this.levelGroupIndex = levelGroup;
      this.setBallCount();
      if (this.gameState == 2) {
        this.startGame();
      }
    },
    setBallCount() {
      if (this.levelGroupIndex == 0) {
        this.totalBall = 8;
        this.targetBall = 1;
      } else if (this.levelGroupIndex == 1) {
        this.totalBall = 10;
        this.targetBall = 2;
      } else if (this.levelGroupIndex == 2) {
        this.totalBall = 10;
        this.targetBall = 3;
      } else if (this.levelGroupIndex == 3) {
        this.totalBall = 12;
        this.targetBall = 4;
      }
    },
    startGame() {
      c.clearAllSchedule();
      this.gameStartTime = new Date().getTime();
      this.gameEndTime = this.gameStartTime;
      this.gameSecondTime = 0;
      this.gameTimeInterval = c.schedule(() => {
        let elapsedTime = new Date().getTime() - this.gameStartTime;
        this.gameSecondTime = Math.floor(elapsedTime / 1000);
      }, 1000);
      this.gameProgress = 1;
      this.gameState = 2;
      this.moveSpeed = 260;
      this.moveSpeedScale = this.gameAreaWidth / 500 * this.moveSpeed;
      this.createBalls();
    },
    createBalls() {
      this.ballList = [];
      this.targetIndexList = [];
      this.foundCount = 0;
      this.isRunning = false;
      this.allowClickBall = false;
      this.showNextLevelBtn = false;
      const radius = this.radius;
      const diameter = this.radius * 2;
      for (let ballIndex = 0; ballIndex < this.totalBall; ballIndex++) {
        let found = false;
        let newBallX = 0;
        let newBallY = 0;
        for (let attempt = 0; attempt < 1000 && !found; attempt++) {
          newBallX = radius + Math.random() * (this.gameAreaWidth - radius * 2);
          newBallY = radius + Math.random() * (this.gameAreaWidth - radius * 2);
          found = true;
          for (const existingBall of this.ballList) {
            const distanceToBall = Math.hypot(newBallX - existingBall.x, newBallY - existingBall.y);
            if (distanceToBall < diameter) {
              found = false;
              break;
            }
          }
        }
        let randomDx = (Math.random() - 0.5) * 2;
        let randomDy = (Math.random() - 0.5) * 2;
        const randomVecLength = Math.hypot(randomDx, randomDy);
        this.ballList.push({
          index: ballIndex,
          x: newBallX,
          y: newBallY,
          dirX: randomDx / randomVecLength,
          dirY: randomDy / randomVecLength,
          isTarget: false,
          color: this.NORMAL_COLOR
        });
      }
      this.targetIndexList = c.generateRandomNumbers(0, this.ballList.length, this.targetBall);
      this.targetIndexList.forEach(targetIndex => {
        this.ballList[targetIndex].isTarget = true;
        this.ballList[targetIndex].color = this.TARGET_COLOR;
      });
      c.scheduleOnce(() => {
        this.targetIndexList.forEach(targetIndex2 => {
          this.ballList[targetIndex2].isTarget = true;
          this.ballList[targetIndex2].color = this.NORMAL_COLOR;
        });
        c.scheduleOnce(() => {
          this.targetIndexList.forEach(targetIndex3 => {
            this.ballList[targetIndex3].isTarget = true;
            this.ballList[targetIndex3].color = this.TARGET_COLOR;
          });
        }, 200);
      }, 500);
      c.scheduleOnce(() => {
        this.isRunning = true;
        c.scheduleOnce(() => {
          this.isRunning = false;
          this.allowClickBall = true;
        }, this.moveSpeedTime);
      }, 2000);
      c.scheduleOnce(() => {
        this.targetIndexList.forEach(targetIndex4 => {
          this.ballList[targetIndex4].isTarget = true;
          this.ballList[targetIndex4].color = this.NORMAL_COLOR;
        });
      }, 2500);
    },
    checkEdge(checkedBall) {
      const ballRadius = this.radius;
      if (checkedBall.x - ballRadius < 0) {
        checkedBall.x = ballRadius;
        checkedBall.dirX *= -1;
      } else if (checkedBall.x + ballRadius > this.gameAreaWidth) {
        checkedBall.x = this.gameAreaWidth - ballRadius;
        checkedBall.dirX *= -1;
      }
      if (checkedBall.y - ballRadius < 0) {
        checkedBall.y = ballRadius;
        checkedBall.dirY *= -1;
      } else if (checkedBall.y + ballRadius > this.gameAreaWidth) {
        checkedBall.y = this.gameAreaWidth - ballRadius;
        checkedBall.dirY *= -1;
      }
    },
    checkBallCollision() {
      const ballCount = this.ballList.length;
      for (let outerBallIndex = 0; outerBallIndex < ballCount; outerBallIndex++) {
        const ballA = this.ballList[outerBallIndex];
        for (let innerBallIndex = outerBallIndex + 1; innerBallIndex < ballCount; innerBallIndex++) {
          const ballB = this.ballList[innerBallIndex];
          const deltaX = ballB.x - ballA.x;
          const deltaY = ballB.y - ballA.y;
          const distanceBetweenBalls = Math.hypot(deltaX, deltaY);
          const collisionDiameter = this.radius * 2;
          if (distanceBetweenBalls >= collisionDiameter) {
            continue;
          }
          const overlap = collisionDiameter - distanceBetweenBalls;
          const normalDx = deltaX / distanceBetweenBalls;
          const normalDy = deltaY / distanceBetweenBalls;
          ballA.x -= normalDx * overlap * 0.5;
          ballA.y -= normalDy * overlap * 0.5;
          ballB.x += normalDx * overlap * 0.5;
          ballB.y += normalDy * overlap * 0.5;
          const velocityAAlongNormal = ballA.dirX * normalDx + ballA.dirY * normalDy;
          const velocityBAlongNormal = ballB.dirX * normalDx + ballB.dirY * normalDy;
          ballA.dirX -= normalDx * (velocityAAlongNormal - velocityBAlongNormal);
          ballA.dirY -= normalDy * (velocityAAlongNormal - velocityBAlongNormal);
          ballB.dirX -= normalDx * (velocityBAlongNormal - velocityAAlongNormal);
          ballB.dirY -= normalDy * (velocityBAlongNormal - velocityAAlongNormal);
          const speedA = Math.hypot(ballA.dirX, ballA.dirY);
          ballA.dirX /= speedA;
          ballA.dirY /= speedA;
          const speedB = Math.hypot(ballB.dirX, ballB.dirY);
          ballB.dirX /= speedB;
          ballB.dirY /= speedB;
        }
      }
    },
    animateLoop() {
      let lastFrameTime = performance.now();
      const animationFrameCallback = timestamp => {
        const deltaTime = Math.min((timestamp - lastFrameTime) / 1000, 0.02);
        lastFrameTime = timestamp;
        if (this.isRunning) {
          for (const movingBall of this.ballList) {
            movingBall.x += movingBall.dirX * this.moveSpeedScale * deltaTime;
            movingBall.y += movingBall.dirY * this.moveSpeedScale * deltaTime;
            this.checkEdge(movingBall);
          }
          this.checkBallCollision();
        }
        this.animationId = requestAnimationFrame(animationFrameCallback);
      };
      animationFrameCallback(lastFrameTime);
    },
    clickBall(clickedBall) {
      if (!this.allowClickBall) {
        return;
      }
      let gameProgress = this.gameProgress;
      let elapsedGameTime = new Date().getTime() - this.gameStartTime;
      if (clickedBall.isTarget) {
        if (clickedBall.color != this.TARGET_COLOR) {
          c.playAudio(staticSiteHost + "/audio/brain/right.mp3");
          clickedBall.color = this.TARGET_COLOR;
          clickedBall.isTarget = false;
          this.foundCount++;
          if (this.foundCount == this.targetIndexList.length) {
            this.allowClickBall = false;
            c.scheduleOnce(() => {
              this.showNextLevelBtn = true;
            }, 500);
            ;
          }
        }
      } else {
        this.allowClickBall = false;
        c.clearSchedule(this.gameTimeInterval);
        c.playAudio(staticSiteHost + "/audio/brain/error.mp3");
        clickedBall.color = this.WRONG_COLOR;
        c.scheduleOnce(() => {
          this.targetIndexList.forEach(targetIndex5 => {
            this.ballList[targetIndex5].color = this.TARGET_COLOR;
          });
          c.scheduleOnce(() => {
            gameProgress = this.gameProgress - 1;
            var feedbackEmoji = "";
            if (gameProgress <= 1) {
              feedbackEmoji = "😥";
            } else if (gameProgress <= 5) {
              feedbackEmoji = "🙂";
            } else if (gameProgress < 10) {
              feedbackEmoji = "👏";
            } else {
              feedbackEmoji = "😎";
            }
            this.emoji = feedbackEmoji;
            this.scoreDesc = "您通过了 " + gameProgress + " 个关卡，用时 " + Number((elapsedGameTime / 1000).toFixed(3)) + " 秒。";
            this.gameState = 3;
            const rankingData = {
              programName: this.programName,
              levelGroup: this.levelGroupCodeArr[this.levelGroupIndex],
              score: gameProgress,
              time: elapsedGameTime
            };
            var rankingListData = rankingData;
            c.game.addRankingList(rankingListData);
          }, 1000);
        }, 500);
      }
    },
    goNextLevel() {
      this.gameProgress++;
      this.moveSpeed += 40;
      if (this.moveSpeed > this.maxMoveSpeed) {
        this.moveSpeed = this.maxMoveSpeed;
      }
      this.moveSpeedScale = this.gameAreaWidth / 500 * this.moveSpeed;
      this.createBalls();
    }
  }
}).use(ElementPlus).mount(".main-body");