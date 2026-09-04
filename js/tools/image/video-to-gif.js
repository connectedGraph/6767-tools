Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      settingPopupVisible: false,
      videoExtArr: ["mp4"],
      videoUrl: null,
      videoDuration: null,
      timeRange: null,
      scale: 50,
      speedArr: [0.25, 0.5, 1, 1.25, 1.5, 2, 4],
      speed: 1,
      frameRate: 10,
      imgList: [],
      gifUrl: null,
      processing: false,
      capturePercent: 0,
      composePercent: 0
    };
  },
  computed: {
    fileAccept() {
      var videoExtsWithDot = [];
      for (var videoExtIndex = 0; videoExtIndex < this.videoExtArr.length; videoExtIndex++) {
        videoExtsWithDot.push("." + this.videoExtArr[videoExtIndex]);
      }
      return videoExtsWithDot.join(",");
    },
    timeRangeStartDesc() {
      if (this.timeRange == null) {
        return "";
      }
      return this.transDurationStr(this.timeRange[0]);
    },
    timeRangeEndDesc() {
      if (this.timeRange == null) {
        return "";
      }
      return this.transDurationStr(this.timeRange[1]);
    },
    gifDurationDesc() {
      if (this.timeRange == null) {
        return "";
      }
      return locales.durationDesc.replace("10", this.timeRange[1] - this.timeRange[0]);
    },
    scaleDesc() {
      return locales.scaleDesc.replace("50%", this.scale + "%");
    }
  },
  watch: {
    timeRange() {
      if (this.timeRange != null) {
        var videoElement = document.getElementById("video");
        videoElement.currentTime = this.timeRange[0];
      }
    }
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
  },
  methods: {
    selectFile() {
      document.getElementById("flFile").click();
    },
    handleFileSelect(fileEvent) {
      var selectedFile = fileEvent.target.files[0];
      var fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf(".") + 1).toLowerCase();
      if (!this.videoExtArr.includes(fileExtension)) {
        return;
      }
      this.videoUrl = URL.createObjectURL(selectedFile);
      this.gifUrl = null;
      setTimeout(() => {
        var videoPlayer = document.getElementById("video");
        var videoDuration = parseInt(videoPlayer.duration, 10);
        if (isNaN(videoPlayer.duration)) {
          c.layerMsg(locales.onlyPcAllow);
          return;
        }
        this.timeRange = [0, 10];
        if (videoDuration < this.timeRange[1]) {
          this.timeRange[1] = videoDuration;
        }
        this.videoDuration = videoDuration;
      }, 100);
      document.getElementById("flFile").value = null;
    },
    transDurationStr(totalSeconds) {
      var durationSeconds = totalSeconds;
      var hours = parseInt(durationSeconds / 3600, 10);
      var minutes = parseInt(durationSeconds % 3600 / 60, 10);
      var seconds = parseInt(durationSeconds % 60, 10);
      return (this.videoDuration > 3600 ? (hours < 10 ? "0" + hours : hours) + ":" : "") + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    },
    videoToGif() {
      if (this.processing) {
        location.reload();
        return;
      }
      this.processing = true;
      this.gifUrl = null;
      var videoEl = document.getElementById("video");
      videoEl.controls = false;
      videoEl.currentTime = this.timeRange[0];
      var canvasElement = document.createElement("canvas");
      canvasElement.width = videoEl.videoWidth * this.scale / 100;
      canvasElement.height = videoEl.videoHeight * this.scale / 100;
      videoEl.play();
      this.imgList = [];
      var frameCount = this.frameRate * (this.timeRange[1] - this.timeRange[0]) / this.speed;
      var frameCaptureCount = 0;
      var captureVideoFrame = () => {
        canvasElement.getContext("2d").drawImage(videoEl, 0, 0, canvasElement.width, canvasElement.height);
        this.imgList.push(URL.createObjectURL(c.base64ToBlob(canvasElement.toDataURL("image/png"))));
        if (document.getElementById("video").currentTime > this.timeRange[1]) {
          videoEl.pause();
          clearInterval(timer);
          this.capturePercent = 100;
          gifshot.createGIF({
            gifWidth: videoEl.videoWidth * this.scale / 100,
            gifHeight: videoEl.videoHeight * this.scale / 100,
            images: this.imgList,
            frameDuration: 10 / this.frameRate / this.speed,
            progressCallback: progressCallback => {
              this.composePercent = parseInt(progressCallback * 100, 10);
            }
          }, conversionResult => {
            this.processing = false;
            videoEl.controls = true;
            videoEl.currentTime = this.timeRange[0];
            if (!conversionResult.error) {
              this.gifUrl = conversionResult.image;
              var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
              if (clientWidth < 1000) {
                setTimeout(() => {
                  document.querySelector(".trans-right").scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "start"
                  });
                }, 50);
              }
            }
          });
        }
        frameCaptureCount++;
        this.capturePercent = parseInt(frameCaptureCount / frameCount * 100, 10);
      };
      captureVideoFrame();
      timer = setInterval(() => {
        captureVideoFrame();
      }, 1000 / this.frameRate * this.speed);
      console.log(1000 / this.frameRate * this.speed);
    },
    download() {
      var downloadLink = document.createElement("a");
      var defaultFileName = "video.gif";
      downloadLink.download = defaultFileName;
      downloadLink.href = URL.createObjectURL(c.base64ToBlob(this.gifUrl));
      downloadLink.click();
    }
  }
}).use(ElementPlus).mount(".main-body");