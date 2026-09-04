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
      aspectRatio: "NaN"
    };
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
    this.dragEventBind();
  },
  methods: {
    dragEventBind() {
      var that = this;
      function addFileDataWrapper(fileDataToAdd) {
        that.addFileData(fileDataToAdd);
      }
      var fileBox = document.querySelector(".file-box");
      fileBox.addEventListener("dragenter", function (dragEnterEvent) {
        dragEnterEvent.preventDefault();
        dragEnterEvent.stopPropagation();
      }, false);
      fileBox.addEventListener("dragover", function (dragOverEvent) {
        dragOverEvent.dataTransfer.dropEffect = "copy";
        dragOverEvent.preventDefault();
        dragOverEvent.stopPropagation();
      }, false);
      fileBox.addEventListener("dragleave", function (dragLeaveEvent) {
        dragLeaveEvent.preventDefault();
        dragLeaveEvent.stopPropagation();
      }, false);
      fileBox.addEventListener("drop", function (dropEvent) {
        dropEvent.preventDefault();
        dropEvent.stopPropagation();
        var dataTransfer = dropEvent.dataTransfer;
        var fileArray = [];
        var processedCount = 0;
        var totalFiles = dataTransfer.files.length;
        function finalizeFileProcessing() {
          if (processedCount === totalFiles - 1) {
            addFileDataWrapper(fileArray);
          }
          processedCount++;
        }
        if (dataTransfer.items !== undefined) {
          for (var itemIndex = 0; itemIndex < dataTransfer.items.length; itemIndex++) {
            var item = dataTransfer.items[itemIndex];
            if (item.kind === "file" && item.webkitGetAsEntry().isFile) {
              var itemFile = item.getAsFile();
              fileArray.push(itemFile);
            }
          }
          addFileDataWrapper(fileArray);
        } else {
          for (var itemIndex = 0; itemIndex < totalFiles; itemIndex++) {
            var file = dataTransfer.files[itemIndex];
            if (file.type) {
              fileArray.push(file);
              finalizeFileProcessing();
            } else {
              try {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file.slice(0, 3));
                fileReader.addEventListener("load", function (loadEvent) {
                  console.log(loadEvent, "load");
                  fileArray.push(file);
                  finalizeFileProcessing();
                }, false);
                fileReader.addEventListener("error", function (errorEvent) {
                  console.log(errorEvent, "error，cannot upload folder");
                  finalizeFileProcessing();
                }, false);
              } catch (error) {
                console.log(error, "catch error，cannot upload folder");
                finalizeFileProcessing();
              }
            }
          }
        }
      }, false);
    },
    selectImg() {
      document.getElementById("flFile").click();
    },
    handleFileSelect(selectedFiles) {
      this.addFileData(selectedFiles.target.files);
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
        var cropperImg = document.querySelector(".cropper-img");
        this.cropper = new Cropper(cropperImg, {
          aspectRatio: this.aspectRatio,
          viewMode: 1,
          preview: ".small",
          dragMode: "move",
          responsive: true,
          restore: true,
          checkCrossOrigin: true,
          modal: true,
          guides: true,
          highlight: true,
          background: true,
          center: true,
          autoCrop: true,
          autoCropArea: 0.8,
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
            console.log(cropEvent);
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
    cropperZoom(zoomRatio) {
      if (this.cropper != null) {
        this.cropper.zoom(zoomRatio);
      }
    },
    cropperMove(offsetX, offsetY) {
      if (this.cropper != null) {
        this.cropper.move(offsetX, offsetY);
      }
    },
    cropperRotate(rotationDegrees) {
      if (this.cropper != null) {
        this.cropper.rotate(rotationDegrees);
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
    saveImg() {
      if (this.cropper != null) {
        var sourceFormat = this.file.sourceFormat;
        var croppedDataUrl = this.cropper.getCroppedCanvas().toDataURL("image/" + sourceFormat);
        var downloadAnchor = document.createElement("a");
        var imageBlob = c.base64ToBlob(croppedDataUrl);
        downloadAnchor.download = "cropped-img." + sourceFormat;
        downloadAnchor.href = URL.createObjectURL(imageBlob);
        downloadAnchor.click();
      }
    }
  }
}).use(ElementPlus).mount(".main-body");