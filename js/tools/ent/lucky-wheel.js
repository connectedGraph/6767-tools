Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      fullscreen: false,
      setPrizeDialogVisible: false,
      luckyWheelData: {
        prizeList: [{
          name: locales.prizeIndex.replace("1", "1"),
          img: "./img/prize.png",
          range: 10
        }, {
          name: locales.prizeIndex.replace("1", "2"),
          img: "./img/prize.png",
          range: 10
        }, {
          name: locales.prizeIndex.replace("1", "3"),
          img: "./img/prize.png",
          range: 10
        }, {
          name: locales.prizeIndex.replace("1", "4"),
          img: "./img/prize.png",
          range: 10
        }, {
          name: locales.prizeIndex.replace("1", "5"),
          img: "./img/prize.png",
          range: 10
        }, {
          name: locales.prizeIndex.replace("1", "6"),
          img: "./img/prize.png",
          range: 10
        }]
      },
      formData: null,
      currentPrizeImgIndex: null,
      prizeDialogVisible: false,
      prizeName: null,
      prizeImg: null
    };
  },
  mounted() {
    var storedLuckyWheelData = localStorage.getItem("luckyWheelData");
    if (storedLuckyWheelData != null) {
      this.luckyWheelData = JSON.parse(storedLuckyWheelData);
    }
    this.resizeEventBind();
    this.createLuckyWheel();
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
  },
  methods: {
    resizeEventBind() {
      var docElement = document.documentElement;
      var orientationOrResizeEvent = "orientationchange" in window ? "orientationchange" : "resize";
      var viewportResizeHandler = () => {
        var viewportWidth = docElement.clientWidth;
        if (!viewportWidth) {
          return;
        }
        if (this.fullscreen) {
          var viewportHeight = docElement.clientHeight;
          if (viewportWidth > viewportHeight) {
            docElement.style.fontSize = viewportHeight / 800 * 100 + "px";
          } else {
            docElement.style.fontSize = viewportWidth / 800 * 100 + "px";
          }
        } else if (viewportWidth >= 850) {
          docElement.style.fontSize = "100px";
        } else if (viewportWidth <= 768) {
          docElement.style.fontSize = viewportWidth / 800 * 100 + "px";
        } else {
          docElement.style.fontSize = viewportWidth / 1000 * 100 + "px";
        }
      };
      if (!document.addEventListener) {
        return;
      }
      window.addEventListener(orientationOrResizeEvent, viewportResizeHandler, false);
      document.addEventListener("DOMContentLoaded", viewportResizeHandler, false);
    },
    createLuckyWheel() {
      document.getElementById("my-lucky").innerHTML = "";
      var wheelSectorList = [];
      var wheelBlockColors = ["#FFF5D6", "#FFFFFF"];
      for (var prizeListIndex = 0; prizeListIndex < this.luckyWheelData.prizeList.length; prizeListIndex++) {
        var wheelSectorItem = {
          background: wheelBlockColors[prizeListIndex % wheelBlockColors.length],
          range: Number(this.luckyWheelData.prizeList[prizeListIndex].range)
        };
        if (!c.isNullOrEmpty(this.luckyWheelData.prizeList[prizeListIndex].name) && !c.isNullOrEmpty(this.luckyWheelData.prizeList[prizeListIndex].img)) {
          wheelSectorItem.fonts = [{
            text: this.luckyWheelData.prizeList[prizeListIndex].name,
            top: "0.25rem"
          }];
          wheelSectorItem.imgs = [{
            src: this.luckyWheelData.prizeList[prizeListIndex].img,
            width: "25%",
            top: "0.70rem"
          }];
        } else if (!c.isNullOrEmpty(this.luckyWheelData.prizeList[prizeListIndex].name) && c.isNullOrEmpty(this.luckyWheelData.prizeList[prizeListIndex].img)) {
          wheelSectorItem.fonts = [{
            text: this.luckyWheelData.prizeList[prizeListIndex].name,
            top: "0.3rem"
          }];
        } else if (c.isNullOrEmpty(this.luckyWheelData.prizeList[prizeListIndex].name) && !c.isNullOrEmpty(this.luckyWheelData.prizeList[prizeListIndex].img)) {
          wheelSectorItem.imgs = [{
            src: this.luckyWheelData.prizeList[prizeListIndex].img,
            width: "25%",
            top: "0.35rem"
          }];
        }
        wheelSectorList.push(wheelSectorItem);
      }
      const luckyWheelInstance = new LuckyCanvas.LuckyWheel("#my-lucky", {
        width: "5.5rem",
        height: "5.5rem",
        blocks: [{
          padding: "3px",
          background: "#FFD43A"
        }, {
          padding: "8px",
          background: "#D21C22"
        }, {
          padding: "2px",
          background: "#fff"
        }],
        prizes: wheelSectorList,
        buttons: [{
          radius: "28%",
          background: "#E94922"
        }, {
          radius: "27%",
          background: "#FFD43A"
        }, {
          radius: "25%",
          background: "#CD1417",
          pointer: true,
          fonts: [{
            text: "GO",
            fontSize: "0.6rem",
            fontColor: "#FFD43A",
            fontWeight: "600",
            top: "-0.35rem"
          }]
        }],
        defaultConfig: {
          gutter: "1px"
        },
        defaultStyle: {
          fontSize: "0.3rem"
        },
        start: () => {
          luckyWheelInstance.play();
          setTimeout(() => {
            c.playAudio(staticSiteHost + "/audio/lucky-wheel.mp3");
          }, 400);
          setTimeout(() => {
            luckyWheelInstance.stop();
          }, 2800);
        },
        end: endResult => {
          this.prizeDialogVisible = true;
          this.prizeName = typeof endResult.fonts != "undefined" ? endResult.fonts[0].text : null;
          this.prizeImg = typeof endResult.imgs != "undefined" ? endResult.imgs[0].src : null;
        }
      });
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
    goSetData() {
      this.setPrizeDialogVisible = true;
      this.formData = c.clone(this.luckyWheelData);
    },
    addPrize() {
      this.formData.prizeList.push({
        name: "",
        img: "",
        range: null
      });
    },
    removePrize(prizeItem) {
      const prizeIndexToRemove = this.formData.prizeList.indexOf(prizeItem);
      if (prizeIndexToRemove !== -1) {
        this.formData.prizeList.splice(prizeIndexToRemove, 1);
      }
    },
    selectPrizeImg(prizeImg) {
      this.currentPrizeImgIndex = prizeImg;
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
          return fileReadEvent => {
            c.compressImg(fileReadEvent.target.result, 80, 220, 220, compressedImg => {
              this.formData.prizeList[this.currentPrizeImgIndex].img = compressedImg;
              document.getElementById("flFile").value = "";
            });
          };
        })(currentFile);
        fileReader.readAsDataURL(currentFile);
      }
      document.getElementById("flFile").value = null;
    },
    setPrize() {
      this.$refs.formRef.validate(isFormValid => {
        if (isFormValid) {
          for (var formPrizeIndex = 0; formPrizeIndex < this.formData.prizeList.length; formPrizeIndex++) {
            if (c.isNullOrEmpty(this.formData.prizeList[formPrizeIndex].name) && c.isNullOrEmpty(this.formData.prizeList[formPrizeIndex].img)) {
              this.$message({
                message: locales.submitTip1.replace("10", formPrizeIndex + 1),
                type: "error",
                grouping: true
              });
              return;
            }
          }
          if (this.formData.prizeList.length < 2) {
            this.$message({
              message: locales.submitTip2,
              type: "error",
              grouping: true
            });
            return;
          }
          if (JSON.stringify(this.luckyWheelData) != JSON.stringify(this.formData)) {
            localStorage.setItem("luckyWheelData", JSON.stringify(this.formData));
          }
          this.luckyWheelData = c.clone(this.formData);
          this.createLuckyWheel();
          this.setPrizeDialogVisible = false;
          this.$message.success(locales.submitPrizeTip);
        } else {
          this.$message({
            message: locales.submitValiErrorTip,
            type: "error",
            grouping: true
          });
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");