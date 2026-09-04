Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      fullscreen: false,
      setDataDialogVisible: false,
      dataTabActive: "prize",
      lotteryData: {
        prizeList: [{
          img: "./img/prize.png",
          name: "一等奖",
          count: 1
        }, {
          img: "./img/prize.png",
          name: "二等奖",
          count: 5
        }],
        names: "name1\nname2\nname3\nname4\nname5\nname6\nname7\nname8\nname9\nname10\nname11\nname12\nname13",
        title: "在线抽奖"
      },
      formData: null,
      currentPrizeImgIndex: null,
      currentDrawPrizeIndex: null,
      drawPeopleNumber: 5,
      lotterying: false,
      winnerList: null,
      wnnerDialogVisible: false,
      winnerData: {}
    };
  },
  computed: {
    nameList() {
      if (c.isNullOrEmpty(this.lotteryData.names)) {
        return [];
      }
      return this.lotteryData.names.trim().split("\n");
    }
  },
  mounted() {
    var storedLotteryData = localStorage.getItem("lotteryData");
    if (storedLotteryData != null) {
      this.lotteryData = JSON.parse(storedLotteryData);
    }
    var storedLotteryWinnerData = localStorage.getItem("lotteryWinnerData");
    if (storedLotteryWinnerData != null) {
      this.winnerData = JSON.parse(storedLotteryWinnerData);
    }
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
  },
  methods: {
    goDrawLottery() {
      if (this.lotterying) {
        return;
      }
      if (this.nameList.length == 0) {
        this.$message({
          message: "抽奖名单为空，请先设置抽奖名单",
          type: "error",
          grouping: true
        });
        return;
      }
      if (this.lotteryData.prizeList[this.currentDrawPrizeIndex].count == 0) {
        this.$message({
          message: "剩余奖品数量为0",
          type: "error",
          grouping: true
        });
        return;
      }
      var winnerKeys = [];
      if (Object.keys(this.winnerData).length > 0) {
        for (var winnerKey in this.winnerData) {
          winnerKeys.splice(winnerKeys.length, 0, ...this.winnerData[winnerKey]);
        }
      }
      var filteredNames = this.nameList.filter(nameItem => {
        return !winnerKeys.includes(nameItem);
      });
      if (filteredNames.length == 0) {
        this.$message({
          message: "所有参与人员都已中奖",
          type: "error",
          grouping: true
        });
        return;
      }
      var drawPeopleCount = Number(this.drawPeopleNumber);
      if (drawPeopleCount > filteredNames.length) {
        drawPeopleCount = filteredNames.length;
      }
      if (drawPeopleCount > this.lotteryData.prizeList[this.currentDrawPrizeIndex].count) {
        drawPeopleCount = this.lotteryData.prizeList[this.currentDrawPrizeIndex].count;
      }
      this.lotterying = true;
      var drawCount = 0;
      var intervalId = setInterval(() => {
        var drawnNames = [];
        var clonedNamePool = c.clone(filteredNames);
        while (drawnNames.length < drawPeopleCount) {
          var randomIndex = Math.floor(Math.random() * clonedNamePool.length);
          drawnNames.push(clonedNamePool[randomIndex]);
          clonedNamePool.splice(randomIndex, 1);
        }
        this.winnerList = drawnNames;
        drawCount++;
        if (drawCount == 50) {
          clearInterval(intervalId);
          this.lotterying = false;
          this.lotteryData.prizeList[this.currentDrawPrizeIndex].count -= drawPeopleCount;
          localStorage.setItem("lotteryData", JSON.stringify(this.lotteryData));
          var currentPrizeName = this.lotteryData.prizeList[this.currentDrawPrizeIndex].name;
          if (typeof this.winnerData[currentPrizeName] == "undefined") {
            this.winnerData[currentPrizeName] = this.winnerList;
          } else {
            this.winnerData[currentPrizeName].splice(this.winnerData[currentPrizeName].length, 0, ...this.winnerList);
          }
          localStorage.setItem("lotteryWinnerData", JSON.stringify(this.winnerData));
        }
      }, 100);
    },
    inputDrawPeopleNumber() {
      if (!c.isInt(this.drawPeopleNumber) || this.drawPeopleNumber == 0) {
        this.drawPeopleNumber = null;
      }
    },
    goSetData() {
      if (this.lotterying) {
        return;
      }
      this.setDataDialogVisible = true;
      this.formData = c.clone(this.lotteryData);
    },
    setFullscreen() {
      var isFullscreen = this.fullscreen;
      this.fullscreen = !isFullscreen;
      if (isFullscreen) {
        if (document.exitFullScreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else if (document.documentElement.RequestFullScreen) {
        document.documentElement.RequestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    },
    backHome() {
      if (this.lotterying) {
        return;
      }
      this.currentDrawPrizeIndex = null;
      this.winnerList = null;
    },
    addPrize() {
      this.formData.prizeList.push({
        img: null,
        name: null,
        count: null
      });
    },
    removePrize(removedPrize) {
      const removedPrizeIndex = this.formData.prizeList.indexOf(removedPrize);
      if (removedPrizeIndex !== -1) {
        this.formData.prizeList.splice(removedPrizeIndex, 1);
      }
    },
    selectPrizeImg(selectedPrize) {
      this.currentPrizeImgIndex = selectedPrize;
      document.getElementById("flFile").click();
    },
    handleFileSelect(fileSelectEvent) {
      var selectedFiles = fileSelectEvent.target.files;
      for (var fileIndex = 0, currentFile; currentFile = selectedFiles[fileIndex]; fileIndex++) {
        if (!currentFile.type.match("image.*")) {
          continue;
        }
        var fileReader = new FileReader();
        fileReader.onload = (loadEvent => {
          return fileLoadEvent => {
            c.compressImg(fileLoadEvent.target.result, 80, 250, 250, compressedImgData => {
              this.formData.prizeList[this.currentPrizeImgIndex].img = compressedImgData;
              document.getElementById("flFile").value = "";
            });
          };
        })(currentFile);
        fileReader.readAsDataURL(currentFile);
      }
      document.getElementById("flFile").value = null;
    },
    setData() {
      this.$refs.formRef.validate(isValid => {
        if (isValid) {
          var nameLines = this.formData.names.trim().split("\n");
          if (new Set(nameLines).size !== nameLines.length) {
            this.$message({
              message: "抽奖参与人员姓名有重复",
              type: "error",
              grouping: true
            });
            return;
          }
          this.setDataDialogVisible = false;
          this.currentDrawPrizeIndex = null;
          this.winnerList = null;
          if (JSON.stringify(this.lotteryData) != JSON.stringify(this.formData)) {
            localStorage.setItem("lotteryData", JSON.stringify(this.formData));
          }
          this.lotteryData = c.clone(this.formData);
          this.$message.success("信息已保存在此设备中");
        } else {
          this.$message({
            message: "信息输入不完整，请检查",
            type: "error",
            grouping: true
          });
        }
      });
    },
    removeWinnerData(winnerToRemove) {
      this.$confirm(winnerToRemove == null ? "确定要清空中奖名单吗？" : "确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        if (winnerToRemove == null) {
          this.winnerData = {};
        } else {
          delete this.winnerData[winnerToRemove];
        }
        localStorage.setItem("lotteryWinnerData", JSON.stringify(this.winnerData));
      });
    }
  }
}).use(ElementPlus).mount(".main-body");