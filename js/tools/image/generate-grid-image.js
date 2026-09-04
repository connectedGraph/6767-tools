Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      file: null,
      cropper: null,
      width: null,
      height: null,
      x: null,
      y: null,
      rotate: null,
      scaleX: null,
      scaleY: null,
      aspectRatio: "NaN",
      row: 3,
      column: 3,
      imgGridBase64Arr: [],
      showImgGrid: false,
      creating: false
    };
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
    this.dragEventBind();
  },
  methods: {
    dragEventBind() {
      var that = this;
      function handleAddFileData(fileData) {
        that.addFileData(fileData);
      }
      var fileBoxEl = document.querySelector(".file-box");
      fileBoxEl.addEventListener("dragenter", function (dragEnterEvent) {
        dragEnterEvent.preventDefault();
        dragEnterEvent.stopPropagation();
      }, false);
      fileBoxEl.addEventListener("dragover", function (dragOverEvent) {
        dragOverEvent.dataTransfer.dropEffect = "copy";
        dragOverEvent.preventDefault();
        dragOverEvent.stopPropagation();
      }, false);
      fileBoxEl.addEventListener("dragleave", function (dragLeaveEvent) {
        dragLeaveEvent.preventDefault();
        dragLeaveEvent.stopPropagation();
      }, false);
      fileBoxEl.addEventListener("drop", function (dropEvent) {
        dropEvent.preventDefault();
        dropEvent.stopPropagation();
        var dropDataTransfer = dropEvent.dataTransfer;
        var filesArray = [];
        var fileCounter = 0;
        var fileCount = dropDataTransfer.files.length;
        function processDroppedFiles() {
          if (fileCounter === fileCount - 1) {
            handleAddFileData(filesArray);
          }
          fileCounter++;
        }
        if (dropDataTransfer.items !== undefined) {
          for (var itemIndex = 0; itemIndex < dropDataTransfer.items.length; itemIndex++) {
            var dropItem = dropDataTransfer.items[itemIndex];
            if (dropItem.kind === "file" && dropItem.webkitGetAsEntry().isFile) {
              var itemFile = dropItem.getAsFile();
              filesArray.push(itemFile);
            }
          }
          handleAddFileData(filesArray);
        } else {
          for (var itemIndex = 0; itemIndex < fileCount; itemIndex++) {
            var currentFile = dropDataTransfer.files[itemIndex];
            if (currentFile.type) {
              filesArray.push(currentFile);
              processDroppedFiles();
            } else {
              try {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(currentFile.slice(0, 3));
                fileReader.addEventListener("load", function (loadEvent) {
                  console.log(loadEvent, "load");
                  filesArray.push(currentFile);
                  processDroppedFiles();
                }, false);
                fileReader.addEventListener("error", function (errorEvent) {
                  console.log(errorEvent, "error，cannot upload folder");
                  processDroppedFiles();
                }, false);
              } catch (caughtError) {
                console.log(caughtError, "catch error，cannot upload folder");
                processDroppedFiles();
              }
            }
          }
        }
      }, false);
    },
    selectImg() {
      document.getElementById("flFile").click();
    },
    handleFileSelect(selectEvent) {
      this.addFileData(selectEvent.target.files);
    },
    addFileData(fileData) {
      var fileExtension = fileData[0].name.substring(fileData[0].name.lastIndexOf(".") + 1).toLowerCase();
      if (["svg"].includes(fileExtension)) {
        fileExtension = "png";
      }
      this.file = {
        name: fileData[0].name,
        sourceFormat: fileExtension,
        sourceSize: fileData[0].size,
        sourceSizeDesc: c.transSizeDesc(fileData[0].size, 1),
        sourceBlobUrl: URL.createObjectURL(fileData[0])
      };
      document.getElementById("flFile").value = null;
      setTimeout(() => {
        this.initCropper();
      }, 50);
    },
    initCropper() {
      if (this.cropper != null) {
        this.cropper.replace(this.file.sourceBlobUrl, false);
      } else {
        var cropperImgEl = document.querySelector(".cropper-img");
        this.cropper = new Cropper(cropperImgEl, {
          aspectRatio: this.aspectRatio,
          viewMode: 1,
          preview: ".small",
          dragMode: "move",
          responsive: true,
          restore: true,
          checkCrossOrigin: true,
          modal: true,
          guides: false,
          highlight: true,
          background: true,
          center: true,
          autoCrop: true,
          autoCropArea: 1,
          movable: true,
          rotatable: true,
          scalable: true,
          zoomable: true,
          zoomOnTouch: true,
          zoomOnWheel: true,
          wheelZoomRatio: 0.2,
          cropBoxMovable: true,
          cropBoxResizable: true,
          toggleDragModeOnDblclick: true,
          minCanvasWidth: 0,
          minCanvasHeight: 0,
          ready: function (readyEvent) {},
          cropstart: function (cropStartEvent) {},
          cropmove: function (cropMoveEvent) {},
          cropend: function (cropEndEvent) {},
          crop: cropEvent => {
            this.width = Math.round(cropEvent.detail.width);
            this.height = Math.round(cropEvent.detail.height);
            this.x = Math.round(cropEvent.detail.x);
            this.y = Math.round(cropEvent.detail.y);
            this.rotate = Math.round(cropEvent.detail.rotate);
            this.scaleX = Math.round(cropEvent.detail.scaleX);
            this.scaleY = Math.round(cropEvent.detail.scaleY);
          }
        });
      }
    },
    cropperSetDragMode(dragMode) {
      if (this.cropper != null) {
        this.cropper.setDragMode(dragMode);
      }
    },
    cropperZoom(zoomValue) {
      if (this.cropper != null) {
        this.cropper.zoom(zoomValue);
      }
    },
    cropperMove(offsetX, offsetY) {
      if (this.cropper != null) {
        this.cropper.move(offsetX, offsetY);
      }
    },
    cropperRotate(rotateDegrees) {
      if (this.cropper != null) {
        this.cropper.rotate(rotateDegrees);
      }
    },
    cropperScale(scaleX, scaleY) {
      if (this.cropper != null) {
        this.cropper.scale(scaleX, scaleY);
      }
    },
    cropperReset() {
      if (this.cropper != null) {
        this.cropper.reset();
      }
    },
    cropperSetAspectRatio(aspectRatio) {
      if (this.cropper != null) {
        this.cropper.setAspectRatio(aspectRatio);
      }
      this.aspectRatio = aspectRatio;
    },
    widthInput(widthValue) {
      if (this.cropper != null) {
        this.cropper.setData({
          width: Number(widthValue)
        });
        this.cropper.renderCropBox();
      }
    },
    heightInput(heightValue) {
      if (this.cropper != null) {
        this.cropper.setData({
          height: Number(heightValue)
        });
        this.cropper.renderCropBox();
      }
    },
    xInput(xValue) {
      if (this.cropper != null) {
        this.cropper.setData({
          x: Number(xValue)
        });
        this.cropper.renderCropBox();
      }
    },
    yInput(yValue) {
      if (this.cropper != null) {
        this.cropper.setData({
          y: Number(yValue)
        });
        this.cropper.renderCropBox();
      }
    },
    rotateInput(rotateValue) {
      if (this.cropper != null) {
        this.cropper.setData({
          rotate: Number(rotateValue)
        });
        this.cropper.renderCropBox();
      }
    },
    createGridImg() {
      if (this.cropper != null) {
        this.creating = true;
        setTimeout(() => {
          var fileSourceFormat = this.file.sourceFormat;
          var croppedDataUrl = this.cropper.getCroppedCanvas().toDataURL("image/" + fileSourceFormat);
          var imageEl = new Image();
          imageEl.src = croppedDataUrl;
          imageEl.onload = () => {
            var imageWidth = imageEl.width;
            var imageHeight = imageEl.height;
            var cellWidth = Math.floor(imageWidth / this.column);
            var cellHeight = Math.floor(imageHeight / this.row);
            this.imgGridBase64Arr = [];
            for (let rowIndex = 0; rowIndex < this.row; rowIndex++) {
              for (let colIndex = 0; colIndex < this.column; colIndex++) {
                var canvasEl = document.createElement("canvas");
                canvasEl.width = cellWidth;
                canvasEl.height = cellHeight;
                var canvasCtx = canvasEl.getContext("2d");
                canvasCtx.drawImage(imageEl, colIndex * cellWidth, rowIndex * cellHeight, cellWidth, cellHeight, 0, 0, cellWidth, cellHeight);
                this.imgGridBase64Arr.push(canvasEl.toDataURL("image/" + fileSourceFormat));
              }
            }
            this.cropper.destroy();
            this.cropper = null;
            this.showImgGrid = true;
            this.creating = false;
          };
        }, 50);
      }
    },
    downloadGridImg() {
      var zipInstance = new JSZip();
      var gridFolder = zipInstance.folder("grid-images");
      for (var gridImageIndex = 0; gridImageIndex < this.imgGridBase64Arr.length; gridImageIndex++) {
        var gridImageName = gridImageIndex + 1 + "." + this.file.sourceFormat;
        gridFolder.file(gridImageName, c.base64ToBlob(this.imgGridBase64Arr[gridImageIndex]), {
          binary: true
        });
      }
      zipInstance.generateAsync({
        type: "blob"
      }).then(function (zipBlob) {
        saveAs(zipBlob, "grid-images.zip");
      });
    },
    back() {
      this.showImgGrid = false;
      setTimeout(() => {
        this.initCropper();
      }, 50);
    }
  }
}).use(ElementPlus).mount(".main-body");