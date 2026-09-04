/* dp disabled */;
import { execute } from "../../../lib/ImageMagick/magickApi.js";
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = "#84AFFF";
fabric.Object.prototype.cornerStyle = "circle";
var canvas;
createGifVueObj = Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      imageExtArr: ["jpg", "jpeg", "png", "gif", "webp", "bmp"],
      fileList: [],
      addingFile: false,
      processing: false,
      processPercent: null,
      settingPopupVisible: false,
      previewThumbSwiper: null,
      previewThumbSwiperDispose: false,
      previewThumbSwiperIndex: 0,
      canvasWidth: null,
      canvasHeight: null,
      defaultFrameDuration: 500,
      watermarkObjectOptionsArr: [],
      editOptions: null,
      gifBgColor: "#ffffff",
      gifWidth: 800,
      gifHeight: 600,
      gifUrl: null,
      editFrameVisible: false,
      editFrameData: {
        frameIndex: null,
        activeFrameUrl: null,
        frameDuration: null,
        fileList: [],
        sortedData: null
      },
      previewGifVisible: false,
      resizeSetTimeout: null,
      resizeSetInterval: null,
      pageWidth: null
    };
  },
  computed: {
    fileAccept() {
      var imageExtensionsWithDot = [];
      for (var imageExtIndex = 0; imageExtIndex < this.imageExtArr.length; imageExtIndex++) {
        imageExtensionsWithDot.push("." + this.imageExtArr[imageExtIndex]);
      }
      return imageExtensionsWithDot.join(",");
    },
    processedCount() {
      if (this.fileList.length == 0) {
        return 0;
      }
      var filteredFileList = this.fileList.filter(fileItem => {
        return fileItem.newBlobUrl != null;
      });
      return filteredFileList.length;
    }
  },
  watch: {
    gifBgColor() {
      this.createCanvas();
    },
    gifWidth() {
      this.createCanvas();
    },
    gifHeight() {
      this.createCanvas();
    }
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
    document.getElementById("flFile2").addEventListener("change", this.getWatermarkImgFile, false);
    this.dragEventBind();
    window.onresize = () => {
      if (this.fileList.length == 0) {
        return;
      }
      var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
      if (this.pageWidth != null && this.pageWidth == clientWidth) {
        return;
      } else {
        this.pageWidth = clientWidth;
      }
      if (this.resizeSetTimeout != null) {
        clearTimeout(this.resizeSetTimeout);
        this.resizeSetTimeout = null;
      }
      if (this.processing) {
        if (this.resizeSetInterval != null) {
          return;
        }
        this.resizeSetInterval = setInterval(() => {
          if (!this.processing) {
            clearInterval(this.resizeSetInterval);
            this.resizeSetInterval = null;
            this.createCanvas();
          }
        }, 200);
      } else {
        this.resizeSetTimeout = setTimeout(() => {
          this.createCanvas();
        }, 100);
      }
    };
  },
  methods: {
    dragEventBind() {
      var _this = this;
      function addFileListDataWrapper(fileListData) {
        _this.addFileListData(fileListData);
      }
      var fileBoxElement = document.querySelector(".file-box");
      fileBoxElement.addEventListener("dragenter", function (event) {
        event.preventDefault();
        event.stopPropagation();
      }, false);
      fileBoxElement.addEventListener("dragover", function (dragOverEvent) {
        dragOverEvent.dataTransfer.dropEffect = "copy";
        dragOverEvent.preventDefault();
        dragOverEvent.stopPropagation();
      }, false);
      fileBoxElement.addEventListener("dragleave", function (dragLeaveEvent) {
        dragLeaveEvent.preventDefault();
        dragLeaveEvent.stopPropagation();
      }, false);
      fileBoxElement.addEventListener("drop", function (dropEvent) {
        dropEvent.preventDefault();
        dropEvent.stopPropagation();
        var dataTransfer = dropEvent.dataTransfer;
        var allFilesData = [];
        var processedFileCount = 0;
        var fileCount = dataTransfer.files.length;
        function onAllFilesProcessed() {
          if (processedFileCount === fileCount - 1) {
            addFileListDataWrapper(allFilesData);
          }
          processedFileCount++;
        }
        if (dataTransfer.items !== undefined) {
          for (var itemIndex = 0; itemIndex < dataTransfer.items.length; itemIndex++) {
            var dataTransferItem = dataTransfer.items[itemIndex];
            if (dataTransferItem.kind === "file" && dataTransferItem.webkitGetAsEntry().isFile) {
              var file = dataTransferItem.getAsFile();
              allFilesData.push(file);
            }
          }
          addFileListDataWrapper(allFilesData);
        } else {
          for (var itemIndex = 0; itemIndex < fileCount; itemIndex++) {
            var selectedFile = dataTransfer.files[itemIndex];
            if (selectedFile.type) {
              allFilesData.push(selectedFile);
              onAllFilesProcessed();
            } else {
              try {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(selectedFile.slice(0, 3));
                fileReader.addEventListener("load", function (loadEvent) {
                  console.log(loadEvent, "load");
                  allFilesData.push(selectedFile);
                  onAllFilesProcessed();
                }, false);
                fileReader.addEventListener("error", function (errorEvent) {
                  console.log(errorEvent, "error，cannot upload folder");
                  onAllFilesProcessed();
                }, false);
              } catch (error) {
                console.log(error, "catch error，cannot upload folder");
                onAllFilesProcessed();
              }
            }
          }
        }
      }, false);
    },
    selectImg() {
      document.getElementById("flFile").click();
    },
    handleFileSelect(fileSelectEvent) {
      this.addFileListData(fileSelectEvent.target.files);
    },
    addFileListData(fileList) {
      if (this.addingFile) {
        return;
      }
      this.addingFile = true;
      c.loading.show(".file-box");
      var isCanvasWidthNull = this.canvasWidth == null;
      setTimeout(() => {
        var totalFileListCount = fileList.length;
        function* createGifGenerator() {
          for (var loopIndex = 0; loopIndex < totalFileListCount; loopIndex++) {
            yield handleFileEntry(loopIndex);
          }
        }
        var handleFileEntry = fileIndex => {
          var fileExtLower = fileList[fileIndex].name.substring(fileList[fileIndex].name.lastIndexOf(".") + 1).toLowerCase();
          if (!this.imageExtArr.includes(fileExtLower)) {
            processFileByIndex(fileIndex);
          } else {
            var sameNameFiles = this.fileList.filter(fileItem => {
              return fileItem.name == fileList[fileIndex].name;
            });
            if (sameNameFiles.length > 0) {
              processFileByIndex(fileIndex);
            } else {
              try {
                var objectUrl = URL.createObjectURL(fileList[fileIndex]);
                if (fileExtLower == "gif") {
                  var gifParserInstance = new gifParserPlugin();
                  var infoPromise = gifParserInstance.getInfo(fileList[fileIndex]);
                  infoPromise.then(infoData => {
                    if (infoData.images.length == 0) {
                      processFileByIndex(fileIndex);
                    } else {
                      var images = infoData.images;
                      var imgElement = document.createElement("img");
                      imgElement.setAttribute("rel:animated_src", URL.createObjectURL(fileList[fileIndex]));
                      imgElement.setAttribute("rel:auto_play", "0");
                      var gifPlayer = new SuperGif({
                        gif: imgElement
                      });
                      gifPlayer.load(() => {
                        for (let frameIndex = 1; frameIndex <= gifPlayer.get_length(); frameIndex++) {
                          gifPlayer.move_to(frameIndex);
                          var gifBlob = c.base64ToBlob(gifPlayer.get_canvas().toDataURL("image/gif"));
                          this.fileList.push({
                            sourceFormat: fileExtLower,
                            sourceBlobUrl: URL.createObjectURL(gifBlob),
                            newBlobUrl: null,
                            sourceWidth: images[frameIndex - 1].width,
                            sourceHeight: images[frameIndex - 1].height,
                            frameDuration: images[frameIndex - 1].delay
                          });
                        }
                        setTimeout(() => {
                          processFileByIndex(fileIndex);
                        }, 50);
                      });
                    }
                  });
                } else {
                  this.fileList.push({
                    sourceFormat: fileExtLower,
                    sourceBlobUrl: objectUrl,
                    newBlobUrl: null,
                    sourceWidth: null,
                    sourceHeight: null,
                    frameDuration: this.defaultFrameDuration
                  });
                  var lastIndex = this.fileList.length - 1;
                  var imageObj = new Image();
                  imageObj.src = this.fileList[lastIndex].sourceBlobUrl;
                  imageObj.onload = () => {
                    this.fileList[lastIndex].sourceWidth = imageObj.width;
                    this.fileList[lastIndex].sourceHeight = imageObj.height;
                    processFileByIndex(fileIndex);
                  };
                }
              } catch (error) {
                processFileByIndex(fileIndex);
              }
            }
          }
        };
        var processFileByIndex = processedIndex => {
          if (processedIndex == totalFileListCount - 1) {
            if (isCanvasWidthNull) {
              this.canvasWidth = 0;
              this.canvasHeight = 0;
              for (var fileListIndex = 0; fileListIndex < this.fileList.length; fileListIndex++) {
                if (this.canvasWidth < this.fileList[fileListIndex].sourceWidth) {
                  this.canvasWidth = this.fileList[fileListIndex].sourceWidth;
                }
                if (this.canvasHeight < this.fileList[fileListIndex].sourceHeight) {
                  this.canvasHeight = this.fileList[fileListIndex].sourceHeight;
                }
              }
              if (this.canvasWidth / this.canvasHeight > this.gifWidth / this.gifHeight) {
                if (this.canvasWidth > this.gifWidth) {
                  this.canvasHeight = Math.round(this.gifWidth / this.canvasWidth * this.canvasHeight);
                  this.canvasWidth = this.gifWidth;
                }
              } else if (this.canvasHeight > this.gifHeight) {
                this.canvasWidth = Math.round(this.gifHeight / this.canvasHeight * this.canvasWidth);
                this.canvasHeight = this.gifHeight;
              }
              this.gifWidth = this.canvasWidth;
              this.gifHeight = this.canvasHeight;
            }
            this.addingFile = false;
            c.loading.hide(".file-box");
            document.getElementById("flFile").value = null;
            var initPreviewThumbSwiper = () => {
              setTimeout(() => {
                this.previewThumbSwiper = new Swiper(".preview-thumb-swiper", {
                  freeMode: {
                    sticky: true
                  },
                  slidesPerView: "auto",
                  navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                  }
                });
                if (canvas == null) {
                  this.createCanvas();
                }
              }, 50);
            };
            if (this.previewThumbSwiper != null) {
              this.previewThumbSwiper = null;
              this.previewThumbSwiperDispose = true;
              setTimeout(() => {
                this.previewThumbSwiperDispose = false;
                initPreviewThumbSwiper();
              }, 50);
            } else {
              initPreviewThumbSwiper();
            }
          } else {
            setTimeout(() => {
              generator.next();
            }, 10);
          }
        };
        var generator = createGifGenerator();
        generator.next();
      }, 80);
    },
    removeFileListData() {
      if (this.processing) {
        return;
      }
      this.$confirm(locales.clearConfirm, locales.alertTitle, {
        confirmButtonText: locales.ok,
        cancelButtonText: locales.cancel
      }).then(() => {
        this.fileList = [];
        this.previewThumbSwiperIndex = 0;
        this.gifWidth = 800;
        this.gifHeight = 600;
        this.canvasWidth = this.canvasHeight = null;
        canvas = null;
      });
    },
    createCanvas() {
      if (this.fileList.length == 0) {
        return;
      }
      this.editOptions = null;
      var currentFileItem = this.fileList[this.previewThumbSwiperIndex];
      if (canvas == null) {
        canvas = new fabric.Canvas("canvas", {
          backgroundColor: this.gifBgColor == null ? "#ffffff" : this.gifBgColor
        });
        canvas.selection = false;
      } else {
        canvas.clear();
        canvas.remove(canvas.getActiveObject());
        canvas.setBackgroundColor(this.gifBgColor == null ? "#ffffff" : this.gifBgColor);
      }
      var previewBoxWidth = document.querySelector(".preview-box").clientWidth;
      this.canvasWidth = this.gifWidth;
      this.canvasHeight = this.gifHeight;
      if (this.canvasWidth > previewBoxWidth) {
        this.canvasWidth = previewBoxWidth;
      }
      if (this.canvasWidth != this.gifWidth) {
        this.canvasHeight = parseInt(this.gifHeight * this.canvasWidth / this.gifWidth, 10);
      }
      canvas.setWidth(this.canvasWidth);
      canvas.setHeight(this.canvasHeight);
      fabric.Image.fromURL(currentFileItem.sourceBlobUrl, fabricImage => {
        var scaleFactor = 1;
        if (this.canvasWidth / this.canvasHeight > currentFileItem.sourceWidth / currentFileItem.sourceHeight) {
          scaleFactor = Number((this.canvasHeight / currentFileItem.sourceHeight).toFixed(10));
        } else {
          scaleFactor = Number((this.canvasWidth / currentFileItem.sourceWidth).toFixed(10));
        }
        fabricImage.set({
          left: (this.canvasWidth - currentFileItem.sourceWidth * scaleFactor) / 2,
          top: (this.canvasHeight - currentFileItem.sourceHeight * scaleFactor) / 2,
          selectable: false,
          movable: false,
          hoverCursor: "default"
        });
        fabricImage.scale(scaleFactor);
        canvas.add(fabricImage);
        this.restoreWatermarkObjects();
      });
    },
    addTextWatermark(text, options) {
      if (this.fileList.length == 0 || this.addingFile || this.processing) {
        return;
      }
      this.settingPopupVisible = false;
      var textboxOptions = {
        index: this.watermarkObjectOptionsArr.length,
        top: 60,
        fontSize: 30,
        fill: "#000000",
        text: locales.normalText,
        scaleX: 1,
        scaleY: 1
      };
      if (text != null) {
        Object.assign(textboxOptions, text);
      }
      var watermarkTextbox = new fabric.Textbox(null, textboxOptions);
      watermarkTextbox.set({
        scaleX: textboxOptions.scaleX,
        scaleY: textboxOptions.scaleY
      });
      if (text == null) {
        var halfCanvasWidth = this.canvasWidth / 2;
        watermarkTextbox.set({
          left: halfCanvasWidth - watermarkTextbox.width / 2
        });
      }
      canvas.add(watermarkTextbox);
      watermarkTextbox.on("moving", () => {
        this.getWatermarkObjectOptions(watermarkTextbox, textboxOptions.index);
      });
      watermarkTextbox.on("scaling", () => {
        this.getWatermarkObjectOptions(watermarkTextbox, textboxOptions.index);
      });
      watermarkTextbox.on("rotating", () => {
        this.getWatermarkObjectOptions(watermarkTextbox, textboxOptions.index);
      });
      watermarkTextbox.on("modified", () => {
        this.getWatermarkObjectOptions(watermarkTextbox, textboxOptions.index);
      });
      watermarkTextbox.on("selected", () => {
        var textboxIndex = textboxOptions.index;
        this.editOptions = {
          type: textboxOptions.type,
          index: textboxOptions.index,
          opacity: this.watermarkObjectOptionsArr[textboxIndex].opacity,
          fill: this.watermarkObjectOptionsArr[textboxIndex].fill,
          stroke: this.watermarkObjectOptionsArr[textboxIndex].stroke,
          strokeWidth: this.watermarkObjectOptionsArr[textboxIndex].strokeWidth,
          backgroundColor: this.watermarkObjectOptionsArr[textboxIndex].backgroundColor,
          fontWeight: this.watermarkObjectOptionsArr[textboxIndex].fontWeight,
          fontSize: this.watermarkObjectOptionsArr[textboxIndex].fontSize,
          underline: this.watermarkObjectOptionsArr[textboxIndex].underline,
          fontStyle: this.watermarkObjectOptionsArr[textboxIndex].fontStyle
        };
      });
      watermarkTextbox.on("deselected", () => {
        this.editOptions = null;
      });
      if (text == null) {
        this.watermarkObjectOptionsArr.push(textboxOptions);
        this.getWatermarkObjectOptions(watermarkTextbox, textboxOptions.index);
        canvas.setActiveObject(watermarkTextbox);
      }
      if (options != null) {
        options();
      }
    },
    selectWatermarkImg() {
      if (this.fileList.length == 0 || this.addingFile || this.processing) {
        return;
      }
      this.settingPopupVisible = false;
      document.getElementById("flFile2").click();
    },
    getWatermarkImgFile(fileInputEvent) {
      var selectedWatermarkFile = fileInputEvent.target.files[0];
      var watermarkObjectURL = URL.createObjectURL(selectedWatermarkFile);
      this.addImgWatermark(watermarkObjectURL);
      document.getElementById("flFile2").value = null;
    },
    addImgWatermark(targetCanvas, watermarkImage, watermarkOptions) {
      var image = new Image();
      image.src = targetCanvas;
      image.onload = () => {
        var counter = 0;
        var canvasRightBound = this.canvasWidth - 20;
        var canvasBottomBound = this.canvasHeight - 60 - 10;
        if (image.width < canvasRightBound && image.height < canvasBottomBound) {
          counter = image.width;
        } else if (image.width / image.height > canvasRightBound / canvasBottomBound) {
          counter = canvasRightBound;
        } else {
          counter = image.width * canvasBottomBound / image.height;
        }
        var watermarkObjectOption = {
          index: this.watermarkObjectOptionsArr.length,
          left: this.canvasWidth / 2 - counter / 2,
          top: 60,
          src: targetCanvas
        };
        if (watermarkImage != null) {
          Object.assign(watermarkObjectOption, watermarkImage);
        }
        fabric.Image.fromURL(targetCanvas, img => {
          img.set(watermarkObjectOption);
          if (watermarkImage == null) {
            img.scale(Number((counter / image.width).toFixed(8)));
          }
          canvas.add(img);
          img.on("moving", () => {
            this.getWatermarkObjectOptions(img, watermarkObjectOption.index);
          });
          img.on("scaling", () => {
            this.getWatermarkObjectOptions(img, watermarkObjectOption.index);
          });
          img.on("rotating", () => {
            this.getWatermarkObjectOptions(img, watermarkObjectOption.index);
          });
          img.on("modified", () => {
            this.getWatermarkObjectOptions(img, watermarkObjectOption.index);
          });
          img.on("selected", () => {
            this.editOptions = {
              type: watermarkObjectOption.type,
              index: watermarkObjectOption.index,
              opacity: this.watermarkObjectOptionsArr[watermarkObjectOption.index].opacity
            };
          });
          img.on("deselected", () => {
            this.editOptions = null;
          });
          if (watermarkImage == null) {
            this.watermarkObjectOptionsArr.push(watermarkObjectOption);
            this.getWatermarkObjectOptions(img, watermarkObjectOption.index);
            canvas.setActiveObject(img);
          }
          if (watermarkOptions != null) {
            watermarkOptions();
          }
        });
      };
    },
    getWatermarkObjectOptions(watermarkItem, watermarkIndex) {
      var currentWatermarkOption = {
        type: watermarkItem.type,
        left: watermarkItem.left,
        top: watermarkItem.top,
        width: watermarkItem.width,
        height: watermarkItem.height,
        scaleX: watermarkItem.scaleX,
        scaleY: watermarkItem.scaleY,
        angle: watermarkItem.angle,
        opacity: watermarkItem.opacity
      };
      if (watermarkItem.type == "textbox") {
        Object.assign(currentWatermarkOption, {
          fill: watermarkItem.fill,
          stroke: watermarkItem.stroke,
          strokeWidth: watermarkItem.strokeWidth,
          backgroundColor: watermarkItem.backgroundColor,
          fontFamily: watermarkItem.fontFamily,
          fontWeight: watermarkItem.fontWeight,
          fontSize: watermarkItem.fontSize,
          text: watermarkItem.text,
          underline: watermarkItem.underline,
          fontStyle: watermarkItem.fontStyle
        });
      }
      Object.assign(this.watermarkObjectOptionsArr[watermarkIndex], currentWatermarkOption);
    },
    restoreWatermarkObjects() {
      var watermarkOptionsLength = this.watermarkObjectOptionsArr.length;
      if (watermarkOptionsLength == 0) {
        return;
      }
      function* gifGenerator() {
        for (var watermarkIndex = 0; watermarkIndex < watermarkOptionsLength; watermarkIndex++) {
          yield processFrame(watermarkIndex);
        }
      }
      var processFrame = watermarkIndex => {
        var currentWatermarkOptions = this.watermarkObjectOptionsArr[watermarkIndex];
        if (currentWatermarkOptions == null) {
          applyWatermark(watermarkIndex);
          return;
        }
        if (currentWatermarkOptions.type == "textbox") {
          this.addTextWatermark(currentWatermarkOptions, () => {
            applyWatermark(watermarkIndex);
          });
        } else {
          this.addImgWatermark(currentWatermarkOptions.src, currentWatermarkOptions, () => {
            applyWatermark(watermarkIndex);
          });
        }
      };
      var applyWatermark = watermarkObjectIndex => {
        if (watermarkObjectIndex < this.watermarkObjectOptionsArr.length - 1) {
          setTimeout(() => {
            iterator.next();
          }, 10);
        }
      };
      var iterator = gifGenerator();
      iterator.next();
    },
    setWatermarkFontSize() {
      var activeObject = canvas.getActiveObject();
      activeObject.set({
        fontSize: this.editOptions.fontSize
      });
      this.getWatermarkObjectOptions(activeObject, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkOpacity() {
      var currentActiveObject = canvas.getActiveObject();
      currentActiveObject.set({
        opacity: this.editOptions.opacity
      });
      this.getWatermarkObjectOptions(currentActiveObject, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkBold() {
      this.editOptions.fontWeight = this.editOptions.fontWeight == "bold" ? "normal" : "bold";
      var activeObject1 = canvas.getActiveObject();
      activeObject1.set({
        fontWeight: this.editOptions.fontWeight
      });
      this.getWatermarkObjectOptions(activeObject1, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkItalic() {
      this.editOptions.fontStyle = this.editOptions.fontStyle == "italic" ? "normal" : "italic";
      var activeObject2 = canvas.getActiveObject();
      activeObject2.set({
        fontStyle: this.editOptions.fontStyle
      });
      this.getWatermarkObjectOptions(activeObject2, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkUnderline() {
      this.editOptions.underline = !this.editOptions.underline;
      var activeObject3 = canvas.getActiveObject();
      activeObject3.set({
        underline: this.editOptions.underline
      });
      this.getWatermarkObjectOptions(activeObject3, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkBackgroundColor() {
      var activeObject4 = canvas.getActiveObject();
      activeObject4.set({
        backgroundColor: this.editOptions.backgroundColor
      });
      this.getWatermarkObjectOptions(activeObject4, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkFill() {
      var activeObject5 = canvas.getActiveObject();
      activeObject5.set({
        fill: this.editOptions.fill
      });
      this.getWatermarkObjectOptions(activeObject5, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkStroke() {
      var activeObject6 = canvas.getActiveObject();
      activeObject6.set({
        stroke: this.editOptions.stroke
      });
      this.getWatermarkObjectOptions(activeObject6, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkStrokeWidth() {
      var activeObject7 = canvas.getActiveObject();
      activeObject7.set({
        strokeWidth: this.editOptions.strokeWidth
      });
      this.getWatermarkObjectOptions(activeObject7, this.editOptions.index);
      canvas.renderAll();
    },
    deleteWatermark() {
      this.watermarkObjectOptionsArr[this.editOptions.index] = null;
      var activeObject8 = canvas.getActiveObject();
      canvas.remove(activeObject8);
    },
    process() {
      if (this.processing) {
        return;
      }
      this.processing = true;
      setTimeout(() => {
        c.loading.show(".file-box");
        var fileListLength = this.fileList.length;
        function* loadImageGenerator() {
          for (var fileIndex = 0; fileIndex < fileListLength; fileIndex++) {
            yield loadImageFromFile(fileIndex);
          }
        }
        var gifInstance = new GIF({
          workers: 2,
          quality: 10,
          width: this.gifWidth,
          height: this.gifHeight,
          workerScript: location.origin + "/lib/gif/gif.worker.js"
        });
        var fabricCanvas = new fabric.Canvas("canvas2", {
          backgroundColor: "rgb(255,0,0)"
        });
        fabricCanvas.setWidth(this.gifWidth);
        fabricCanvas.setHeight(this.gifHeight);
        var loadImageFromFile = currentFileIndex => {
          this.processPercent = locales.percentage.replace("100%", parseInt((currentFileIndex + 1) / this.fileList.length * 100, 10) + "%");
          fabricCanvas.clear();
          fabricCanvas.remove(canvas.getActiveObject());
          fabricCanvas.setBackgroundColor(this.gifBgColor == null ? "#ffffff" : this.gifBgColor);
          fabric.Image.fromURL(this.fileList[currentFileIndex].sourceBlobUrl, loadedImage => {
            var scaleRatio = 1;
            if (this.gifWidth / this.gifHeight > this.fileList[currentFileIndex].sourceWidth / this.fileList[currentFileIndex].sourceHeight) {
              scaleRatio = Number((this.gifHeight / this.fileList[currentFileIndex].sourceHeight).toFixed(8));
            } else {
              scaleRatio = Number((this.gifWidth / this.fileList[currentFileIndex].sourceWidth).toFixed(8));
            }
            loadedImage.set({
              left: (this.gifWidth - this.fileList[currentFileIndex].sourceWidth * scaleRatio) / 2,
              top: (this.gifHeight - this.fileList[currentFileIndex].sourceHeight * scaleRatio) / 2
            });
            loadedImage.scale(scaleRatio);
            fabricCanvas.add(loadedImage);
            processFile(currentFileIndex, () => {
              handleFileProcessed(currentFileIndex);
            });
          });
        };
        var processFile = (currentFileIndex, param0) => {
          var scaleRatio = this.gifWidth / this.canvasWidth;
          var watermarkOptionsCount = this.watermarkObjectOptionsArr.length;
          if (watermarkOptionsCount == 0) {
            this.fileList[currentFileIndex].newBlobUrl = URL.createObjectURL(c.base64ToBlob(fabricCanvas.toDataURL("image/gif")));
            param0();
            return;
          }
          function* generateWatermarkOptions() {
            for (var watermarkOptionIndex = 0; watermarkOptionIndex < watermarkOptionsCount; watermarkOptionIndex++) {
              yield createWatermark(watermarkOptionIndex);
            }
          }
          var createWatermark = currentWatermarkIndex => {
            var watermarkObject = c.clone(this.watermarkObjectOptionsArr[currentWatermarkIndex]);
            if (watermarkObject == null) {
              scheduleNextWatermark(currentWatermarkIndex);
              return;
            }
            watermarkObject.scaleX = watermarkObject.scaleX * scaleRatio;
            watermarkObject.scaleY = watermarkObject.scaleY * scaleRatio;
            watermarkObject.left = watermarkObject.left * scaleRatio;
            watermarkObject.top = watermarkObject.top * scaleRatio;
            if (watermarkObject.type == "textbox") {
              var textbox = new fabric.Textbox(null, watermarkObject);
              fabricCanvas.add(textbox);
              scheduleNextWatermark(currentWatermarkIndex);
            } else {
              fabric.Image.fromURL(watermarkObject.src, loadedImage => {
                loadedImage.set(watermarkObject);
                fabricCanvas.add(loadedImage);
                scheduleNextWatermark(currentWatermarkIndex);
              });
            }
          };
          var scheduleNextWatermark = watermarkIndexToProcess => {
            if (watermarkIndexToProcess < this.watermarkObjectOptionsArr.length - 1) {
              setTimeout(() => {
                watermarkGenerator.next();
              }, 10);
            } else {
              this.fileList[currentFileIndex].newBlobUrl = URL.createObjectURL(c.base64ToBlob(fabricCanvas.toDataURL("image/gif")));
              param0(currentFileIndex);
            }
          };
          var watermarkGenerator = generateWatermarkOptions();
          watermarkGenerator.next();
        };
        var handleFileProcessed = processedFileIndex => {
          if (processedFileIndex == this.fileList.length - 1) {
            setTimeout(() => {
              var frameElements = document.querySelectorAll(".frameImg");
              for (var index = 0; index < frameElements.length; index++) {
                gifInstance.addFrame(frameElements[index], {
                  delay: this.fileList[index].frameDuration
                });
              }
              gifInstance.on("finished", finishedResult => {
                this.gifUrl = URL.createObjectURL(finishedResult);
                c.loading.hide(".file-box");
                this.processing = false;
                this.$message.success(locales.createSucc);
                this.previewGifVisible = true;
              });
              gifInstance.render();
            }, 300);
          } else {
            setTimeout(() => {
              fileGenerator.next();
            }, 10);
          }
        };
        var fileGenerator = loadImageGenerator();
        fileGenerator.next();
      }, 50);
    },
    chooseFrame(frameElement) {
      var frameIndex = Number(frameElement.getAttribute("data-index"));
      this.previewThumbSwiperIndex = frameIndex;
      this.createCanvas();
    },
    deleteFrame(frameToDelete) {
      var removedFrameIndex = Number(frameToDelete.getAttribute("data-index"));
      this.fileList.splice(removedFrameIndex, 1);
      if (this.previewThumbSwiperIndex > removedFrameIndex) {
        this.previewThumbSwiperIndex = this.previewThumbSwiperIndex - 1;
      } else {
        if (this.previewThumbSwiperIndex == this.fileList.length) {
          this.previewThumbSwiperIndex = this.previewThumbSwiperIndex - 1;
        }
        if (this.fileList.length == 0) {
          this.previewThumbSwiperIndex = 0;
          this.gifWidth = 800;
          this.gifHeight = 600;
          this.canvasWidth = this.canvasHeight = null;
          canvas = null;
        }
      }
    },
    goEditFrame(frameToEdit) {
      var editFrameIndex = Number(frameToEdit.getAttribute("data-index"));
      this.editFrameData.frameIndex = editFrameIndex;
      this.editFrameData.activeFrameUrl = this.fileList[this.previewThumbSwiperIndex].sourceBlobUrl;
      this.editFrameData.frameDuration = this.fileList[editFrameIndex].frameDuration;
      this.editFrameData.fileList = c.clone(this.fileList);
      this.editFrameVisible = true;
      setTimeout(() => {
        this.editFrameData.sortedData = c.clone(this.editFrameData.fileList);
        Sortable.create(document.querySelector(".frame-list"), {
          handle: ".frame-item",
          animation: 150,
          onEnd: dragEvent => {
            const movedFrame = this.editFrameData.sortedData.splice(dragEvent.oldIndex, 1)[0];
            this.editFrameData.sortedData.splice(dragEvent.newIndex, 0, movedFrame);
          }
        });
      }, 100);
    },
    editFrame() {
      this.editFrameData.sortedData[this.editFrameData.frameIndex].frameDuration = Number(this.editFrameData.frameDuration);
      for (var sortedDataIndex = 0; sortedDataIndex < this.editFrameData.sortedData.length; sortedDataIndex++) {
        if (this.editFrameData.sortedData[sortedDataIndex].sourceBlobUrl == this.editFrameData.activeFrameUrl) {
          this.previewThumbSwiperIndex = sortedDataIndex;
          break;
        }
      }
      this.fileList = this.editFrameData.sortedData;
      console.log(this.fileList);
      this.editFrameVisible = false;
    },
    download() {
      var previewSwiperIndex = this.previewThumbSwiperIndex;
      var linkElement = document.createElement("a");
      linkElement.download = "new.gif";
      linkElement.href = this.gifUrl;
      linkElement.click();
    }
  }
}).use(ElementPlus).mount(".main-body");