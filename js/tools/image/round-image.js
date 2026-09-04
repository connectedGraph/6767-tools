Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      topLeft: 20,
      topRight: 20,
      bottomLeft: 20,
      bottomRight: 20,
      sameAngle: true,
      image: null,
      imageExtArr: ["jpg", "jpeg", "png", "gif", "webp", "bmp"],
      processing: false
    };
  },
  computed: {
    fileAccept() {
      var imageExtensionsWithDot = [];
      for (var imageIndex = 0; imageIndex < this.imageExtArr.length; imageIndex++) {
        imageExtensionsWithDot.push("." + this.imageExtArr[imageIndex]);
      }
      return imageExtensionsWithDot.join(",");
    }
  },
  watch: {
    topLeft(topLeftX, topLeftY) {
      this.process();
    },
    topRight(topRightX, topRightY) {
      this.process();
    },
    bottomLeft(bottomLeftX, bottomLeftY) {
      this.process();
    },
    bottomRight(bottomRightX, bottomRightY) {
      this.process();
    },
    sameAngle(angle1, angle2) {
      if (angle1) {
        this.topRight = this.bottomLeft = this.bottomRight = this.topLeft;
      }
    }
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
  },
  methods: {
    selectImg() {
      document.getElementById("flFile").click();
    },
    handleFileSelect(fileSelectEvent) {
      var selectedFile = fileSelectEvent.target.files[0];
      var fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf(".") + 1).toLowerCase();
      if (!this.imageExtArr.includes(fileExtension)) {
        return;
      }
      var objectUrl = URL.createObjectURL(selectedFile);
      var imageObj = new Image();
      imageObj.src = objectUrl;
      imageObj.onload = () => {
        this.image = {
          name: selectedFile.name,
          sourceFormat: fileExtension,
          sourceBlobUrl: URL.createObjectURL(selectedFile),
          sourceWidth: imageObj.width,
          sourceHeight: imageObj.height,
          newBlobUrl: null
        };
        setTimeout(() => {
          this.process();
        }, 50);
      };
      document.getElementById("flFile").value = null;
    },
    topLeftInput() {
      if (c.isNullOrEmpty(this.topLeft) || isNaN(this.topLeft) || this.topLeft < 0) {
        this.topLeft = 0;
      }
      this.topLeft = Number(this.topLeft);
      if (this.sameAngle) {
        this.topRight = this.bottomLeft = this.bottomRight = this.topLeft;
      }
    },
    topRightInput() {
      if (c.isNullOrEmpty(this.topRight) || isNaN(this.topRight) || this.topRight < 0) {
        this.topRight = 0;
      }
      this.topRight = Number(this.topRight);
      if (this.sameAngle) {
        this.topLeft = this.bottomLeft = this.bottomRight = this.topRight;
      }
    },
    bottomLeftInput() {
      if (c.isNullOrEmpty(this.bottomLeft) || isNaN(this.bottomLeft) || this.bottomLeft < 0) {
        this.bottomLeft = 0;
      }
      this.bottomLeft = Number(this.bottomLeft);
      if (this.sameAngle) {
        this.topRight = this.bottomRight = this.topLeft = this.bottomLeft;
      }
    },
    bottomRightInput() {
      if (c.isNullOrEmpty(this.bottomRight) || isNaN(this.bottomRight) || this.bottomRight < 0) {
        this.bottomRight = 0;
      }
      this.bottomRight = Number(this.bottomRight);
      if (this.sameAngle) {
        this.topRight = this.bottomLeft = this.topLeft = this.bottomRight;
      }
    },
    drawTransparentRoundedImage(ctx, sourceImage, cornerRadius, radius) {
      sourceImage.save();
      sourceImage.beginPath();
      sourceImage.globalAlpha = 1;
      sourceImage.moveTo(this.topLeft, 0);
      sourceImage.lineTo(cornerRadius - this.topRight, 0);
      sourceImage.quadraticCurveTo(cornerRadius, 0, cornerRadius, this.topRight);
      sourceImage.lineTo(cornerRadius, radius - this.bottomRight);
      sourceImage.quadraticCurveTo(cornerRadius, radius, cornerRadius - this.bottomRight, radius);
      sourceImage.lineTo(this.bottomLeft, radius);
      sourceImage.quadraticCurveTo(0, radius, 0, radius - this.bottomLeft);
      sourceImage.lineTo(0, this.topLeft);
      sourceImage.quadraticCurveTo(0, 0, this.topLeft, 0);
      sourceImage.closePath();
      sourceImage.clip();
      sourceImage.drawImage(ctx, 0, 0, cornerRadius, radius);
      sourceImage.restore();
    },
    process() {
      if (this.processing) {
        return;
      }
      this.processing = true;
      c.loading.show(".trans-right");
      setTimeout(() => {
        var imageElement = new Image();
        imageElement.src = this.image.sourceBlobUrl;
        imageElement.onload = () => {
          var canvasElement = document.createElement("canvas");
          canvasElement.width = imageElement.width;
          canvasElement.height = imageElement.height;
          var canvasContext = canvasElement.getContext("2d");
          this.drawTransparentRoundedImage(imageElement, canvasContext, imageElement.width, imageElement.height);
          this.image.newBlobUrl = URL.createObjectURL(c.base64ToBlob(canvasElement.toDataURL("image/" + this.toFormat, 1)));
          setTimeout(() => {
            this.processing = false;
            c.loading.hide(".trans-right");
          }, 50);
        };
      }, 50);
    },
    download(downloadData) {
      var downloadLink = document.createElement("a");
      var fileName = this.image.name + ".png";
      downloadLink.download = fileName;
      downloadLink.href = this.image.newBlobUrl;
      downloadLink.click();
    }
  }
}).use(ElementPlus).mount(".main-body");