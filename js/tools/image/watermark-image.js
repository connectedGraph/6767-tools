/* dp disabled */;
import { execute } from "../../../lib/ImageMagick/magickApi.js";
var canvas;
Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      imageExtArr: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tif", "tiff", "ico", "psd", "tga", "miff", "pcx", "fits", "ppm", "pgm", "pfm", "mng", "hdr", "dds", "otb", "psb"],
      commonImageExtArr: ["jpg", "jpeg", "png", "webp"],
      fileList: [],
      addingFile: false,
      processing: false,
      processPercent: null,
      settingPopupVisible: false,
      watermarkSizeType: 1,
      minWidth: null,
      minHeight: null,
      previewThumbSwiper: null,
      previewThumbSwiperDispose: false,
      previewThumbSwiperIndex: 0,
      sourceFileName: null,
      sourceWidth: null,
      sourceHeight: null,
      canvasWidth: null,
      canvasHeight: null,
      watermarkObjectOptionsArr: [],
      editOptions: null,
      resizeSetTimeout: null,
      resizeSetInterval: null,
      pageWidth: null
    };
  },
  computed: {
    fileAccept() {
      var imageExtensionsWithDots = [];
      for (var imageExtIndex = 0; imageExtIndex < this.imageExtArr.length; imageExtIndex++) {
        imageExtensionsWithDots.push("." + this.imageExtArr[imageExtIndex]);
      }
      return imageExtensionsWithDots.join(",");
    },
    processedCount() {
      if (this.fileList.length == 0) {
        return 0;
      }
      var filteredFileList = this.fileList.filter(file => {
        return file.newBlobUrl != null;
      });
      return filteredFileList.length;
    }
  },
  watch: {
    watermarkSizeType(watermarkType, watermarkSize) {
      if (watermarkType == 1) {
        for (var watermarkObjectIndex = 0; watermarkObjectIndex < this.watermarkObjectOptionsArr.length; watermarkObjectIndex++) {
          this.watermarkObjectOptionsArr[watermarkObjectIndex].scaleX = this.watermarkObjectOptionsArr[watermarkObjectIndex].scaleX / this.watermarkObjectOptionsArr[watermarkObjectIndex].canvasScale;
          this.watermarkObjectOptionsArr[watermarkObjectIndex].scaleY = this.watermarkObjectOptionsArr[watermarkObjectIndex].scaleY / this.watermarkObjectOptionsArr[watermarkObjectIndex].canvasScale;
        }
      } else {
        for (var watermarkObjectIndex = 0; watermarkObjectIndex < this.watermarkObjectOptionsArr.length; watermarkObjectIndex++) {
          this.watermarkObjectOptionsArr[watermarkObjectIndex].scaleX = this.watermarkObjectOptionsArr[watermarkObjectIndex].scaleX * this.watermarkObjectOptionsArr[watermarkObjectIndex].canvasScale;
          this.watermarkObjectOptionsArr[watermarkObjectIndex].scaleY = this.watermarkObjectOptionsArr[watermarkObjectIndex].scaleY * this.watermarkObjectOptionsArr[watermarkObjectIndex].canvasScale;
        }
      }
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
      var viewportWidth = document.documentElement.clientWidth || document.body.clientWidth;
      if (this.pageWidth != null && this.pageWidth == viewportWidth) {
        return;
      } else {
        this.pageWidth = viewportWidth;
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
        }, 500);
      } else {
        this.resizeSetTimeout = setTimeout(() => {
          this.createCanvas();
        }, 200);
      }
    };
  },
  methods: {
    dragEventBind() {
      var that = this;
      function callAddFileListData(fileListData) {
        that.addFileListData(fileListData);
      }
      var fileBoxElement = document.querySelector(".file-box");
      fileBoxElement.addEventListener("dragenter", function (dragEnterEvent) {
        dragEnterEvent.preventDefault();
        dragEnterEvent.stopPropagation();
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
        var eventDataTransfer = dropEvent.dataTransfer;
        var selectedFiles = [];
        var counter = 0;
        var totalFiles = eventDataTransfer.files.length;
        function finalizeFileSelection() {
          if (counter === totalFiles - 1) {
            callAddFileListData(selectedFiles);
          }
          counter++;
        }
        if (eventDataTransfer.items !== undefined) {
          for (var itemIndex = 0; itemIndex < eventDataTransfer.items.length; itemIndex++) {
            var currentItem = eventDataTransfer.items[itemIndex];
            if (currentItem.kind === "file" && currentItem.webkitGetAsEntry().isFile) {
              var selectedFile = currentItem.getAsFile();
              selectedFiles.push(selectedFile);
            }
          }
          callAddFileListData(selectedFiles);
        } else {
          for (var itemIndex = 0; itemIndex < totalFiles; itemIndex++) {
            var listedFile = eventDataTransfer.files[itemIndex];
            if (listedFile.type) {
              selectedFiles.push(listedFile);
              finalizeFileSelection();
            } else {
              try {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(listedFile.slice(0, 3));
                fileReader.addEventListener("load", function (loadEvent) {
                  console.log(loadEvent, "load");
                  selectedFiles.push(listedFile);
                  finalizeFileSelection();
                }, false);
                fileReader.addEventListener("error", function (errorEvent) {
                  console.log(errorEvent, "error，cannot upload folder");
                  finalizeFileSelection();
                }, false);
              } catch (catchError) {
                console.log(catchError, "catch error，cannot upload folder");
                finalizeFileSelection();
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
      this.addFileListData(selectEvent.target.files);
    },
    addFileListData(fileListData) {
      if (this.addingFile) {
        return;
      }
      this.addingFile = true;
      c.loading.show(".file-box");
      setTimeout(() => {
        var updateCanvasSize = currentWidth => {
          var imageElement = new Image();
          imageElement.src = this.fileList[currentWidth].sourceConvertBlobUrl ?? this.fileList[currentWidth].sourceBlobUrl;
          imageElement.onload = () => {
            this.fileList[currentWidth].sourceWidth = imageElement.width;
            this.fileList[currentWidth].sourceHeight = imageElement.height;
            setCanvasSize(currentWidth - offsetWidth);
          };
        };
        var fetchResource = (param0, fetchUrl, successCallback) => {
          fetch(fetchUrl).then(async fetchResponse => {
            try {
              let imageBuffer = await fetchResponse.arrayBuffer();
              let byteArray = new Uint8Array(imageBuffer);
              var executionResult = await execute({
                inputFiles: [{
                  name: "input." + successCallback,
                  content: byteArray
                }],
                commands: "convert input." + successCallback + " out.png"
              });
              if (executionResult.outputFiles.length > 0 && executionResult.outputFiles[0].blob != null && executionResult.outputFiles[0].blob.size > 0) {
                this.fileList[param0].sourceConvertBlobUrl = URL.createObjectURL(executionResult.outputFiles[0].blob);
                updateCanvasSize(param0);
              }
              if (this.loading) {
                this.loading.close();
                this.loading = null;
              }
            } catch (caughtError) {}
          });
        };
        var offsetWidth = this.fileList.length;
        var totalLength = fileListData.length;
        function* generatorFunc() {
          for (var index = 0; index < totalLength; index++) {
            yield transformItem(index);
          }
        }
        var transformItem = item => {
          var fileExtension = fileListData[item].name.substring(fileListData[item].name.lastIndexOf(".") + 1).toLowerCase();
          if (!this.imageExtArr.includes(fileExtension)) {
            setCanvasSize(item);
          } else {
            var filteredFiles = this.fileList.filter(fileItem => {
              return fileItem.name == fileListData[item].name;
            });
            if (filteredFiles.length > 0) {
              setCanvasSize(item);
            } else {
              try {
                var objectUrl = URL.createObjectURL(fileListData[item]);
                this.fileList.push({
                  name: fileListData[item].name,
                  sourceFormat: fileExtension,
                  originalSize: fileListData[item].size,
                  originalSizeDesc: c.transSizeDesc(fileListData[item].size, 1),
                  sourceBlobUrl: objectUrl,
                  sourceConvertBlobUrl: null,
                  newBlobUrl: null,
                  sourceWidth: null,
                  sourceHeight: null
                });
                if (fileExtension == "gif" || this.commonImageExtArr.includes(fileExtension)) {
                  updateCanvasSize(item + offsetWidth);
                } else {
                  setTimeout(() => {
                    fetchResource(item + offsetWidth, objectUrl, fileExtension);
                  }, 30);
                }
              } catch (error) {
                setCanvasSize(item);
              }
            }
          }
        };
        var setCanvasSize = currentIndex => {
          if (currentIndex == totalLength - 1) {
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
                  },
                  on: {
                    click: (swiperInstance, nativeEvent) => {
                      if (swiperInstance.clickedIndex == null || this.previewThumbSwiperIndex == swiperInstance.clickedIndex) {
                        return;
                      }
                      this.previewThumbSwiperIndex = swiperInstance.clickedIndex;
                      this.createCanvas();
                    }
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
              iterator.next();
            }, 10);
          }
        };
        var iterator = generatorFunc();
        iterator.next();
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
        this.watermarkObjectOptionsArr = [];
        this.previewThumbSwiperIndex = 0;
        canvas = null;
      });
    },
    createCanvas() {
      if (this.fileList.length == 0) {
        return;
      }
      c.loading.show(".canvas-box");
      this.editOptions = null;
      var currentFile = this.fileList[this.previewThumbSwiperIndex];
      this.sourceFileName = currentFile.name;
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerColor = "#84AFFF";
      fabric.Object.prototype.cornerStyle = "circle";
      if (canvas == null) {
        canvas = new fabric.Canvas("canvas");
      } else {
        canvas.clear();
        canvas.remove(canvas.getActiveObject());
      }
      this.sourceWidth = currentFile.sourceWidth;
      this.sourceHeight = currentFile.sourceHeight;
      var previewBoxWidth = document.querySelector(".preview-box").clientWidth;
      if (this.watermarkSizeType == 1) {
        this.canvasWidth = previewBoxWidth;
      } else {
        this.canvasWidth = this.sourceWidth;
        if (this.canvasWidth > previewBoxWidth) {
          this.canvasWidth = previewBoxWidth;
        }
      }
      if (this.canvasWidth > 1000) {
        this.canvasWidth = 1000;
      }
      this.canvasHeight = Number((this.sourceHeight * this.canvasWidth / this.sourceWidth).toFixed(6));
      canvas.setWidth(this.canvasWidth);
      canvas.setHeight(this.canvasHeight);
      canvas.selection = false;
      fabric.Image.fromURL(currentFile.sourceConvertBlobUrl ?? currentFile.sourceBlobUrl, imageObj => {
        imageObj.set({
          left: 0,
          top: 0,
          selectable: false,
          movable: false,
          hoverCursor: "default"
        });
        imageObj.scale(Number((this.canvasWidth / this.sourceWidth).toFixed(6)));
        canvas.add(imageObj);
        this.restoreWatermarkObjects();
        c.loading.hide(".canvas-box");
      });
    },
    addTextWatermark(canvasObj, watermarkConfig) {
      if (this.fileList.length == 0 || this.addingFile || this.processing) {
        return;
      }
      this.settingPopupVisible = false;
      var scaleRatio = this.watermarkSizeType == 1 ? 1 : Number((this.canvasWidth / this.sourceWidth).toFixed(6));
      var textboxOptions = {
        index: this.watermarkObjectOptionsArr.length,
        top: 60,
        fontSize: 30,
        fill: "#000000",
        text: locales.normalText,
        scaleX: scaleRatio,
        scaleY: scaleRatio
      };
      if (canvasObj != null) {
        Object.assign(textboxOptions, canvasObj);
        if (this.watermarkSizeType == 2) {
          textboxOptions.scaleX = canvasObj.scaleX / canvasObj.canvasScale * scaleRatio;
          textboxOptions.scaleY = canvasObj.scaleY / canvasObj.canvasScale * scaleRatio;
        }
      }
      var textbox = new fabric.Textbox(null, textboxOptions);
      textbox.set({
        scaleX: textboxOptions.scaleX,
        scaleY: textboxOptions.scaleY
      });
      if (canvasObj == null) {
        var centerX = this.canvasWidth / 2;
        textbox.set({
          left: centerX - textbox.width * scaleRatio / 2
        });
      }
      canvas.add(textbox);
      textbox.on("moving", () => {
        this.getWatermarkObjectOptions(textbox, textboxOptions.index);
      });
      textbox.on("scaling", () => {
        this.getWatermarkObjectOptions(textbox, textboxOptions.index);
      });
      textbox.on("rotating", () => {
        this.getWatermarkObjectOptions(textbox, textboxOptions.index);
      });
      textbox.on("modified", () => {
        this.getWatermarkObjectOptions(textbox, textboxOptions.index);
      });
      textbox.on("selected", () => {
        var watermarkIndex = textboxOptions.index;
        this.editOptions = {
          type: textboxOptions.type,
          index: textboxOptions.index,
          opacity: this.watermarkObjectOptionsArr[watermarkIndex].opacity,
          fill: this.watermarkObjectOptionsArr[watermarkIndex].fill,
          stroke: this.watermarkObjectOptionsArr[watermarkIndex].stroke,
          strokeWidth: this.watermarkObjectOptionsArr[watermarkIndex].strokeWidth,
          backgroundColor: this.watermarkObjectOptionsArr[watermarkIndex].backgroundColor,
          fontWeight: this.watermarkObjectOptionsArr[watermarkIndex].fontWeight,
          fontSize: this.watermarkObjectOptionsArr[watermarkIndex].fontSize,
          underline: this.watermarkObjectOptionsArr[watermarkIndex].underline,
          fontStyle: this.watermarkObjectOptionsArr[watermarkIndex].fontStyle
        };
      });
      textbox.on("deselected", () => {
        this.editOptions = null;
      });
      if (canvasObj == null) {
        this.watermarkObjectOptionsArr.push(textboxOptions);
        this.getWatermarkObjectOptions(textbox, textboxOptions.index);
        canvas.setActiveObject(textbox);
      }
      if (watermarkConfig != null) {
        watermarkConfig();
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
      var selectedFile = fileInputEvent.target.files[0];
      var imageObjectUrl = URL.createObjectURL(selectedFile);
      this.addImgWatermark(imageObjectUrl);
      document.getElementById("flFile2").value = null;
    },
    addImgWatermark(imageUrl, watermarkText, watermarkCallback) {
      var imgElement = new Image();
      imgElement.src = imageUrl;
      imgElement.onload = () => {
        var watermarkWidth = 0;
        var boundaryX = this.canvasWidth - 20;
        var boundaryY = this.canvasHeight - 60 - 10;
        if (imgElement.width < boundaryX && imgElement.height < boundaryY) {
          watermarkWidth = imgElement.width;
        } else if (imgElement.width / imgElement.height > boundaryX / boundaryY) {
          watermarkWidth = boundaryX;
        } else {
          watermarkWidth = imgElement.width * boundaryY / imgElement.height;
        }
        var scaleRatio = this.watermarkSizeType == 1 ? 1 : Number((this.canvasWidth / this.sourceWidth).toFixed(6));
        var watermarkObjectOptions = {
          index: this.watermarkObjectOptionsArr.length,
          left: this.canvasWidth / 2 - watermarkWidth / 2,
          top: 60,
          src: imageUrl
        };
        if (watermarkText != null) {
          Object.assign(watermarkObjectOptions, watermarkText);
        }
        fabric.Image.fromURL(imageUrl, loadedImage => {
          loadedImage.set(watermarkObjectOptions);
          if (watermarkText == null) {
            loadedImage.scale(Number((watermarkWidth / imgElement.width).toFixed(6)));
          } else if (this.watermarkSizeType == 2) {
            loadedImage.set({
              scaleX: watermarkText.scaleX / watermarkText.canvasScale * scaleRatio,
              scaleY: watermarkText.scaleY / watermarkText.canvasScale * scaleRatio
            });
          }
          canvas.add(loadedImage);
          loadedImage.on("moving", () => {
            this.getWatermarkObjectOptions(loadedImage, watermarkObjectOptions.index);
          });
          loadedImage.on("scaling", () => {
            this.getWatermarkObjectOptions(loadedImage, watermarkObjectOptions.index);
          });
          loadedImage.on("rotating", () => {
            this.getWatermarkObjectOptions(loadedImage, watermarkObjectOptions.index);
          });
          loadedImage.on("modified", () => {
            this.getWatermarkObjectOptions(loadedImage, watermarkObjectOptions.index);
          });
          loadedImage.on("selected", () => {
            this.editOptions = {
              type: watermarkObjectOptions.type,
              index: watermarkObjectOptions.index,
              opacity: this.watermarkObjectOptionsArr[watermarkObjectOptions.index].opacity
            };
          });
          loadedImage.on("deselected", () => {
            this.editOptions = null;
          });
          if (watermarkText == null) {
            this.watermarkObjectOptionsArr.push(watermarkObjectOptions);
            this.getWatermarkObjectOptions(loadedImage, watermarkObjectOptions.index);
            canvas.setActiveObject(loadedImage);
          }
          if (watermarkCallback != null) {
            watermarkCallback();
          }
        });
      };
    },
    getWatermarkObjectOptions(watermarkObj, param1) {
      var gridIndexValue = null;
      var ref0 = null;
      var ref1 = null;
      var ref2 = null;
      var ref3 = null;
      var canvasScaleRatio = Number((this.canvasWidth / this.sourceWidth).toFixed(6));
      var centerCoordinates = [watermarkObj.left + watermarkObj.width * watermarkObj.scaleX / 2, watermarkObj.top + watermarkObj.height * watermarkObj.scaleY / 2];
      if (this.watermarkSizeType == 1) {
        if (centerCoordinates[1] < this.canvasHeight / 3) {
          ref2 = watermarkObj.top;
          if (centerCoordinates[0] < this.canvasWidth / 3) {
            gridIndexValue = 0;
            ref0 = watermarkObj.left;
          } else if (centerCoordinates[0] < this.canvasWidth / 3 * 2) {
            gridIndexValue = 1;
            ref0 = centerCoordinates[0] / this.canvasWidth;
          } else {
            gridIndexValue = 2;
            ref1 = this.canvasWidth - watermarkObj.left - watermarkObj.width * watermarkObj.scaleX;
          }
        } else if (centerCoordinates[1] < this.canvasHeight / 3 * 2) {
          ref2 = centerCoordinates[1] / this.canvasHeight;
          if (centerCoordinates[0] < this.canvasWidth / 3) {
            gridIndexValue = 3;
            ref0 = watermarkObj.left;
          } else if (centerCoordinates[0] < this.canvasWidth / 3 * 2) {
            gridIndexValue = 4;
            ref0 = centerCoordinates[0] / this.canvasWidth;
          } else {
            gridIndexValue = 5;
            ref1 = this.canvasWidth - watermarkObj.left - watermarkObj.width * watermarkObj.scaleX;
          }
        } else {
          ref3 = this.canvasHeight - watermarkObj.top - watermarkObj.height * watermarkObj.scaleY;
          if (centerCoordinates[0] < this.canvasWidth / 3) {
            gridIndexValue = 6;
            ref0 = watermarkObj.left;
          } else if (centerCoordinates[0] < this.canvasWidth / 3 * 2) {
            gridIndexValue = 7;
            ref0 = centerCoordinates[0] / this.canvasWidth;
          } else {
            gridIndexValue = 8;
            ref1 = this.canvasWidth - watermarkObj.left - watermarkObj.width * watermarkObj.scaleX;
          }
        }
      } else if (centerCoordinates[1] < this.canvasHeight / 3) {
        ref2 = watermarkObj.top / canvasScaleRatio;
        if (centerCoordinates[0] < this.canvasWidth / 3) {
          gridIndexValue = 0;
          ref0 = watermarkObj.left / canvasScaleRatio;
        } else if (centerCoordinates[0] < this.canvasWidth / 3 * 2) {
          gridIndexValue = 1;
          ref0 = centerCoordinates[0] / this.canvasWidth;
        } else {
          gridIndexValue = 2;
          ref1 = (this.canvasWidth - watermarkObj.left - watermarkObj.width * watermarkObj.scaleX) / canvasScaleRatio;
        }
      } else if (centerCoordinates[1] < this.canvasHeight / 3 * 2) {
        ref2 = centerCoordinates[1] / this.canvasHeight;
        if (centerCoordinates[0] < this.canvasWidth / 3) {
          gridIndexValue = 3;
          ref0 = watermarkObj.left / canvasScaleRatio;
        } else if (centerCoordinates[0] < this.canvasWidth / 3 * 2) {
          gridIndexValue = 4;
          ref0 = centerCoordinates[0] / this.canvasWidth;
        } else {
          gridIndexValue = 5;
          ref1 = (this.canvasWidth - watermarkObj.left - watermarkObj.width * watermarkObj.scaleX) / canvasScaleRatio;
        }
      } else {
        ref3 = (this.canvasHeight - watermarkObj.top - watermarkObj.height * watermarkObj.scaleY) / canvasScaleRatio;
        if (centerCoordinates[0] < this.canvasWidth / 3) {
          gridIndexValue = 6;
          ref0 = watermarkObj.left / canvasScaleRatio;
        } else if (centerCoordinates[0] < this.canvasWidth / 3 * 2) {
          gridIndexValue = 7;
          ref0 = centerCoordinates[0] / this.canvasWidth;
        } else {
          gridIndexValue = 8;
          ref1 = (this.canvasWidth - watermarkObj.left - watermarkObj.width * watermarkObj.scaleX) / canvasScaleRatio;
        }
      }
      var watermarkConfig = {
        type: watermarkObj.type,
        gridIndex: gridIndexValue,
        watermarkLeft: ref0,
        watermarkRight: ref1,
        watermarkTop: ref2,
        watermarkBottom: ref3,
        width: watermarkObj.width,
        height: watermarkObj.height,
        scaleX: watermarkObj.scaleX,
        scaleY: watermarkObj.scaleY,
        canvasScale: canvasScaleRatio,
        angle: watermarkObj.angle,
        opacity: watermarkObj.opacity
      };
      if (watermarkObj.type == "textbox") {
        Object.assign(watermarkConfig, {
          fill: watermarkObj.fill,
          stroke: watermarkObj.stroke,
          strokeWidth: watermarkObj.strokeWidth,
          backgroundColor: watermarkObj.backgroundColor,
          fontFamily: watermarkObj.fontFamily,
          fontWeight: watermarkObj.fontWeight,
          fontSize: watermarkObj.fontSize,
          text: watermarkObj.text,
          underline: watermarkObj.underline,
          fontStyle: watermarkObj.fontStyle
        });
      }
      Object.assign(this.watermarkObjectOptionsArr[param1], watermarkConfig);
    },
    restoreWatermarkObjects() {
      if (this.minWidth != null && this.minWidth > this.fileList[this.previewThumbSwiperIndex].sourceWidth || this.minHeight != null && this.minHeight > this.fileList[this.previewThumbSwiperIndex].sourceHeight) {
        return;
      }
      var watermarkObjectsCount = this.watermarkObjectOptionsArr.length;
      if (watermarkObjectsCount == 0) {
        return;
      }
      function* watermarkGenerator() {
        for (var loopIndex = 0; loopIndex < watermarkObjectsCount; loopIndex++) {
          yield getWatermarkItem(loopIndex);
        }
      }
      var watermarkScaleFactor = this.watermarkSizeType == 1 ? 1 : Number((this.canvasWidth / this.sourceWidth).toFixed(6));
      var getWatermarkItem = watermarkIndex => {
        var currentWatermarkItem = this.watermarkObjectOptionsArr[watermarkIndex];
        if (currentWatermarkItem == null) {
          processWatermark(watermarkIndex);
          return;
        }
        if (this.watermarkSizeType == 1) {
          if (currentWatermarkItem.gridIndex == 0) {
            currentWatermarkItem.left = currentWatermarkItem.watermarkLeft;
            currentWatermarkItem.top = currentWatermarkItem.watermarkTop;
          } else if (currentWatermarkItem.gridIndex == 1) {
            currentWatermarkItem.left = this.canvasWidth * currentWatermarkItem.watermarkLeft - currentWatermarkItem.width * currentWatermarkItem.scaleX / 2;
            currentWatermarkItem.top = currentWatermarkItem.watermarkTop;
          } else if (currentWatermarkItem.gridIndex == 2) {
            currentWatermarkItem.left = this.canvasWidth - currentWatermarkItem.width * currentWatermarkItem.scaleX - currentWatermarkItem.watermarkRight;
            currentWatermarkItem.top = currentWatermarkItem.watermarkTop;
          } else if (currentWatermarkItem.gridIndex == 3) {
            currentWatermarkItem.left = currentWatermarkItem.watermarkLeft;
            currentWatermarkItem.top = this.canvasHeight * currentWatermarkItem.watermarkTop - currentWatermarkItem.height * currentWatermarkItem.scaleY / 2;
          } else if (currentWatermarkItem.gridIndex == 4) {
            currentWatermarkItem.left = this.canvasWidth * currentWatermarkItem.watermarkLeft - currentWatermarkItem.width * currentWatermarkItem.scaleX / 2;
            currentWatermarkItem.top = this.canvasHeight * currentWatermarkItem.watermarkTop - currentWatermarkItem.height * currentWatermarkItem.scaleY / 2;
          } else if (currentWatermarkItem.gridIndex == 5) {
            currentWatermarkItem.left = this.canvasWidth - currentWatermarkItem.width * currentWatermarkItem.scaleX - currentWatermarkItem.watermarkRight;
            currentWatermarkItem.top = this.canvasHeight * currentWatermarkItem.watermarkTop - currentWatermarkItem.height * currentWatermarkItem.scaleY / 2;
          } else if (currentWatermarkItem.gridIndex == 6) {
            currentWatermarkItem.left = currentWatermarkItem.watermarkLeft;
            currentWatermarkItem.top = this.canvasHeight - currentWatermarkItem.height * currentWatermarkItem.scaleY - currentWatermarkItem.watermarkBottom;
          } else if (currentWatermarkItem.gridIndex == 7) {
            currentWatermarkItem.left = this.canvasWidth * currentWatermarkItem.watermarkLeft - currentWatermarkItem.width * currentWatermarkItem.scaleX / 2;
            currentWatermarkItem.top = this.canvasHeight - currentWatermarkItem.height * currentWatermarkItem.scaleY - currentWatermarkItem.watermarkBottom;
          } else if (currentWatermarkItem.gridIndex == 8) {
            currentWatermarkItem.left = this.canvasWidth - currentWatermarkItem.width * currentWatermarkItem.scaleX - currentWatermarkItem.watermarkRight;
            currentWatermarkItem.top = this.canvasHeight - currentWatermarkItem.height * currentWatermarkItem.scaleY - currentWatermarkItem.watermarkBottom;
          }
        } else if (currentWatermarkItem.gridIndex == 0) {
          currentWatermarkItem.left = currentWatermarkItem.watermarkLeft * watermarkScaleFactor;
          currentWatermarkItem.top = currentWatermarkItem.watermarkTop * watermarkScaleFactor;
        } else if (currentWatermarkItem.gridIndex == 1) {
          currentWatermarkItem.left = this.canvasWidth * currentWatermarkItem.watermarkLeft - currentWatermarkItem.width * (currentWatermarkItem.scaleX / currentWatermarkItem.canvasScale) * watermarkScaleFactor / 2;
          currentWatermarkItem.top = currentWatermarkItem.watermarkTop * watermarkScaleFactor;
        } else if (currentWatermarkItem.gridIndex == 2) {
          currentWatermarkItem.left = this.canvasWidth - currentWatermarkItem.width * (currentWatermarkItem.scaleX / currentWatermarkItem.canvasScale) * watermarkScaleFactor - currentWatermarkItem.watermarkRight * watermarkScaleFactor;
          currentWatermarkItem.top = currentWatermarkItem.watermarkTop * watermarkScaleFactor;
        } else if (currentWatermarkItem.gridIndex == 3) {
          currentWatermarkItem.left = currentWatermarkItem.watermarkLeft * watermarkScaleFactor;
          currentWatermarkItem.top = this.canvasHeight * currentWatermarkItem.watermarkTop - currentWatermarkItem.height * (currentWatermarkItem.scaleY / currentWatermarkItem.canvasScale) * watermarkScaleFactor / 2;
        } else if (currentWatermarkItem.gridIndex == 4) {
          currentWatermarkItem.left = this.canvasWidth * currentWatermarkItem.watermarkLeft - currentWatermarkItem.width * (currentWatermarkItem.scaleX / currentWatermarkItem.canvasScale) * watermarkScaleFactor / 2;
          currentWatermarkItem.top = this.canvasHeight * currentWatermarkItem.watermarkTop - currentWatermarkItem.height * (currentWatermarkItem.scaleY / currentWatermarkItem.canvasScale) * watermarkScaleFactor / 2;
        } else if (currentWatermarkItem.gridIndex == 5) {
          currentWatermarkItem.left = this.canvasWidth - currentWatermarkItem.width * (currentWatermarkItem.scaleX / currentWatermarkItem.canvasScale) * watermarkScaleFactor - currentWatermarkItem.watermarkRight * watermarkScaleFactor;
          currentWatermarkItem.top = this.canvasHeight * currentWatermarkItem.watermarkTop - currentWatermarkItem.height * (currentWatermarkItem.scaleY / currentWatermarkItem.canvasScale) * watermarkScaleFactor / 2;
        } else if (currentWatermarkItem.gridIndex == 6) {
          currentWatermarkItem.left = currentWatermarkItem.watermarkLeft * watermarkScaleFactor;
          currentWatermarkItem.top = this.canvasHeight - currentWatermarkItem.height * (currentWatermarkItem.scaleY / currentWatermarkItem.canvasScale) * watermarkScaleFactor - currentWatermarkItem.watermarkBottom * watermarkScaleFactor;
        } else if (currentWatermarkItem.gridIndex == 7) {
          currentWatermarkItem.left = this.canvasWidth * currentWatermarkItem.watermarkLeft - currentWatermarkItem.width * (currentWatermarkItem.scaleX / currentWatermarkItem.canvasScale) * watermarkScaleFactor / 2;
          currentWatermarkItem.top = this.canvasHeight - currentWatermarkItem.height * (currentWatermarkItem.scaleY / currentWatermarkItem.canvasScale) * watermarkScaleFactor - currentWatermarkItem.watermarkBottom * watermarkScaleFactor;
        } else if (currentWatermarkItem.gridIndex == 8) {
          currentWatermarkItem.left = this.canvasWidth - currentWatermarkItem.width * (currentWatermarkItem.scaleX / currentWatermarkItem.canvasScale) * watermarkScaleFactor - currentWatermarkItem.watermarkRight * watermarkScaleFactor;
          currentWatermarkItem.top = this.canvasHeight - currentWatermarkItem.height * (currentWatermarkItem.scaleY / currentWatermarkItem.canvasScale) * watermarkScaleFactor - currentWatermarkItem.watermarkBottom * watermarkScaleFactor;
        }
        if (currentWatermarkItem.type == "textbox") {
          this.addTextWatermark(currentWatermarkItem, () => {
            processWatermark(watermarkIndex);
          });
        } else {
          this.addImgWatermark(currentWatermarkItem.src, currentWatermarkItem, () => {
            processWatermark(watermarkIndex);
          });
        }
      };
      var processWatermark = options => {
        if (options < this.watermarkObjectOptionsArr.length - 1) {
          setTimeout(() => {
            processGenerator.next();
          }, 10);
        }
      };
      var processGenerator = watermarkGenerator();
      processGenerator.next();
    },
    setWatermarkFontSize() {
      var activeObject1 = canvas.getActiveObject();
      activeObject1.set({
        fontSize: this.editOptions.fontSize
      });
      this.getWatermarkObjectOptions(activeObject1, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkOpacity() {
      var activeObject2 = canvas.getActiveObject();
      activeObject2.set({
        opacity: this.editOptions.opacity
      });
      this.getWatermarkObjectOptions(activeObject2, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkBold() {
      this.editOptions.fontWeight = this.editOptions.fontWeight == "bold" ? "normal" : "bold";
      var activeObject3 = canvas.getActiveObject();
      activeObject3.set({
        fontWeight: this.editOptions.fontWeight
      });
      this.getWatermarkObjectOptions(activeObject3, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkItalic() {
      this.editOptions.fontStyle = this.editOptions.fontStyle == "italic" ? "normal" : "italic";
      var activeObject4 = canvas.getActiveObject();
      activeObject4.set({
        fontStyle: this.editOptions.fontStyle
      });
      this.getWatermarkObjectOptions(activeObject4, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkUnderline() {
      this.editOptions.underline = !this.editOptions.underline;
      var activeObject5 = canvas.getActiveObject();
      activeObject5.set({
        underline: this.editOptions.underline
      });
      this.getWatermarkObjectOptions(activeObject5, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkBackgroundColor() {
      var activeObject6 = canvas.getActiveObject();
      activeObject6.set({
        backgroundColor: this.editOptions.backgroundColor
      });
      this.getWatermarkObjectOptions(activeObject6, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkFill() {
      var fillTargetObject = canvas.getActiveObject();
      fillTargetObject.set({
        fill: this.editOptions.fill
      });
      this.getWatermarkObjectOptions(fillTargetObject, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkStroke() {
      var strokeTargetObject = canvas.getActiveObject();
      strokeTargetObject.set({
        stroke: this.editOptions.stroke
      });
      this.getWatermarkObjectOptions(strokeTargetObject, this.editOptions.index);
      canvas.renderAll();
    },
    setWatermarkStrokeWidth() {
      var strokeWidthTargetObject = canvas.getActiveObject();
      strokeWidthTargetObject.set({
        strokeWidth: this.editOptions.strokeWidth
      });
      this.getWatermarkObjectOptions(strokeWidthTargetObject, this.editOptions.index);
      canvas.renderAll();
    },
    deleteWatermark() {
      this.watermarkObjectOptionsArr[this.editOptions.index] = null;
      var objectToRemove = canvas.getActiveObject();
      canvas.remove(objectToRemove);
    },
    process() {
      if (this.processing) {
        return;
      }
      this.processing = true;
      setTimeout(() => {
        c.loading.show(".file-box");
        var fileListLength = this.fileList.length;
        function* fileListGenerator() {
          for (var fileLoopIndex = 0; fileLoopIndex < fileListLength; fileLoopIndex++) {
            yield processFile(fileLoopIndex);
          }
        }
        var var0;
        var processFile = fileIndex => {
          this.processPercent = locales.percentage.replace("100%", fileIndex + 1 + "/" + this.fileList.length);
          if (var0 == null) {
            var0 = new fabric.Canvas("canvas2");
          } else {
            var0.clear();
            var0.remove(canvas.getActiveObject());
          }
          var0.setWidth(this.fileList[fileIndex].sourceWidth);
          var0.setHeight(this.fileList[fileIndex].sourceHeight);
          if (this.commonImageExtArr.includes(this.fileList[fileIndex].sourceFormat)) {
            fabric.Image.fromURL(this.fileList[fileIndex].sourceBlobUrl, loadedImage => {
              loadedImage.set({
                left: 0,
                top: 0
              });
              var0.add(loadedImage);
              processFileWithCallback(fileIndex, () => {
                var1(fileIndex);
              });
            });
          } else {
            processFileWithCallback(fileIndex, () => {
              var1(fileIndex);
            });
          }
        };
        var processFileWithCallback = (fileIdx, callback) => {
          if (this.minWidth != null && this.minWidth > this.fileList[fileIdx].sourceWidth || this.minHeight != null && this.minHeight > this.fileList[fileIdx].sourceHeight) {
            this.fileList[fileIdx].newBlobUrl = this.fileList[fileIdx].sourceBlobUrl;
            callback();
            return;
          }
          var widthScale = this.fileList[fileIdx].sourceWidth / this.canvasWidth;
          var optionsCount = this.watermarkObjectOptionsArr.length;
          if (optionsCount == 0) {
            callback();
            return;
          }
          function* watermarkOptionGenerator() {
            for (var optionIndex = 0; optionIndex < optionsCount; optionIndex++) {
              yield processWatermarkOption(optionIndex);
            }
          }
          var processWatermarkOption = currentOptionIndex => {
            var watermarkOptions = c.clone(this.watermarkObjectOptionsArr[currentOptionIndex]);
            if (watermarkOptions == null) {
              createWatermark(currentOptionIndex);
              return;
            }
            var sourceWidth = this.fileList[fileIdx].sourceWidth;
            var sourceHeight = this.fileList[fileIdx].sourceHeight;
            if (this.watermarkSizeType == 1) {
              watermarkOptions.scaleX = watermarkOptions.scaleX * widthScale;
              watermarkOptions.scaleY = watermarkOptions.scaleY * widthScale;
            } else {
              widthScale = 1;
              watermarkOptions.scaleX = watermarkOptions.scaleX / watermarkOptions.canvasScale * widthScale;
              watermarkOptions.scaleY = watermarkOptions.scaleY / watermarkOptions.canvasScale * widthScale;
            }
            if (watermarkOptions.gridIndex == 0) {
              watermarkOptions.left = watermarkOptions.watermarkLeft * widthScale;
              watermarkOptions.top = watermarkOptions.watermarkTop * widthScale;
            } else if (watermarkOptions.gridIndex == 1) {
              watermarkOptions.left = sourceWidth * watermarkOptions.watermarkLeft - watermarkOptions.width * watermarkOptions.scaleX / 2;
              watermarkOptions.top = watermarkOptions.watermarkTop * widthScale;
            } else if (watermarkOptions.gridIndex == 2) {
              watermarkOptions.left = sourceWidth - watermarkOptions.width * watermarkOptions.scaleX - watermarkOptions.watermarkRight * widthScale;
              watermarkOptions.top = watermarkOptions.watermarkTop * widthScale;
            } else if (watermarkOptions.gridIndex == 3) {
              watermarkOptions.left = watermarkOptions.watermarkLeft * widthScale;
              watermarkOptions.top = sourceHeight * watermarkOptions.watermarkTop - watermarkOptions.height * watermarkOptions.scaleY / 2;
            } else if (watermarkOptions.gridIndex == 4) {
              watermarkOptions.left = sourceWidth * watermarkOptions.watermarkLeft - watermarkOptions.width * watermarkOptions.scaleX / 2;
              watermarkOptions.top = sourceHeight * watermarkOptions.watermarkTop - watermarkOptions.height * watermarkOptions.scaleY / 2;
            } else if (watermarkOptions.gridIndex == 5) {
              watermarkOptions.left = sourceWidth - watermarkOptions.width * watermarkOptions.scaleX - watermarkOptions.watermarkRight * widthScale;
              watermarkOptions.top = sourceHeight * watermarkOptions.watermarkTop - watermarkOptions.height * watermarkOptions.scaleY / 2;
            } else if (watermarkOptions.gridIndex == 6) {
              watermarkOptions.left = watermarkOptions.watermarkLeft * widthScale;
              watermarkOptions.top = sourceHeight - watermarkOptions.height * watermarkOptions.scaleY - watermarkOptions.watermarkBottom * widthScale;
            } else if (watermarkOptions.gridIndex == 7) {
              watermarkOptions.left = sourceWidth * watermarkOptions.watermarkLeft - watermarkOptions.width * watermarkOptions.scaleX / 2;
              watermarkOptions.top = sourceHeight - watermarkOptions.height * watermarkOptions.scaleY - watermarkOptions.watermarkBottom * widthScale;
            } else if (watermarkOptions.gridIndex == 8) {
              watermarkOptions.left = sourceWidth - watermarkOptions.width * watermarkOptions.scaleX - watermarkOptions.watermarkRight * widthScale;
              watermarkOptions.top = sourceHeight - watermarkOptions.height * watermarkOptions.scaleY - watermarkOptions.watermarkBottom * widthScale;
            }
            if (watermarkOptions.type == "textbox") {
              var watermarkTextbox = new fabric.Textbox(null, watermarkOptions);
              var0.add(watermarkTextbox);
              createWatermark(currentOptionIndex);
            } else {
              fabric.Image.fromURL(watermarkOptions.src, loadedImage => {
                loadedImage.set(watermarkOptions);
                var0.add(loadedImage);
                createWatermark(currentOptionIndex);
              });
            }
          };
          var createWatermark = watermarkIndex => {
            if (watermarkIndex < this.watermarkObjectOptionsArr.length - 1) {
              setTimeout(() => {
                watermarkAsyncIterator.next();
              }, 10);
            } else if (this.commonImageExtArr.includes(this.fileList[fileIdx].sourceFormat)) {
              this.fileList[fileIdx].newBlobUrl = c.base64ToBlob(var0.toDataURL(this.fileList[fileIdx].sourceFormat));
              callback(fileIdx);
            } else {
              fetch(this.fileList[fileIdx].sourceConvertBlobUrl ?? this.fileList[fileIdx].sourceBlobUrl).then(async response => {
                try {
                  let bufferData = await response.arrayBuffer();
                  let fileBytes = new Uint8Array(bufferData);
                  var fileSourceFormat = this.fileList[fileIdx].sourceFormat;
                  var fileInfoList = [{
                    name: "input." + this.fileList[fileIdx].sourceFormat,
                    content: fileBytes
                  }, {
                    name: "watermark.png",
                    content: c.base64ToUint8Array(var0.toDataURL("png"))
                  }];
                  var convertCommandList = [];
                  if (fileSourceFormat == "gif") {
                    convertCommandList.push("convert input." + fileSourceFormat + " -coalesce -gravity center -geometry +0+0 null: watermark.png -layers composite -layers optimize result." + fileSourceFormat);
                  } else {
                    convertCommandList.push("convert input." + fileSourceFormat + " watermark.png -gravity center -composite result." + fileSourceFormat);
                  }
                  var executeResult = await execute({
                    inputFiles: fileInfoList,
                    commands: convertCommandList
                  });
                  var lastOutputFileIndex = executeResult.outputFiles.length - 1;
                  this.fileList[fileIdx].newBlobUrl = executeResult.outputFiles[lastOutputFileIndex].blob;
                  callback(fileIdx);
                } catch (error) {
                  callback(fileIdx);
                }
              });
            }
          };
          var watermarkAsyncIterator = watermarkOptionGenerator();
          watermarkAsyncIterator.next();
        };
        var var1 = currentFileIndex => {
          if (currentFileIndex == this.fileList.length - 1) {
            c.loading.hide(".file-box");
            this.processing = false;
            this.$message.success(locales.processOver);
          } else {
            setTimeout(() => {
              fileAsyncIterator.next();
            }, 10);
          }
        };
        var fileAsyncIterator = fileListGenerator();
        fileAsyncIterator.next();
      }, 50);
    },
    download() {
      var previewThumbIndex = this.previewThumbSwiperIndex;
      var downloadAnchor = document.createElement("a");
      var outputFileName = this.fileList[previewThumbIndex].name.substring(0, this.fileList[previewThumbIndex].name.lastIndexOf(".") + 1) + this.fileList[previewThumbIndex].sourceFormat;
      downloadAnchor.download = outputFileName;
      downloadAnchor.href = URL.createObjectURL(this.fileList[previewThumbIndex].newBlobUrl);
      downloadAnchor.click();
    },
    downloadAll() {
      var zipInstance = new JSZip();
      var watermarkFolder = zipInstance.folder("watermark-image");
      for (var fileIndex = 0; fileIndex < this.fileList.length; fileIndex++) {
        if (this.fileList[fileIndex].newBlobUrl == null) {
          continue;
        }
        var currentFileName = this.fileList[fileIndex].name.substring(0, this.fileList[fileIndex].name.lastIndexOf(".") + 1) + this.fileList[fileIndex].sourceFormat;
        watermarkFolder.file(currentFileName, this.fileList[fileIndex].newBlobUrl, {
          binary: true
        });
      }
      zipInstance.generateAsync({
        type: "blob"
      }).then(function (zipBlob) {
        saveAs(zipBlob, "watermark-image.zip");
      });
    }
  }
}).use(ElementPlus).mount(".main-body");