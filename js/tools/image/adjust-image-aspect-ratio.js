/* dp disabled */;
import { execute } from "../../../lib/ImageMagick/magickApi.js";
Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    var adjustImageAspectRatio = (width, height, callback) => {
      if (c.isNullOrEmpty(this.processOptions.width) || c.isNullOrEmpty(this.processOptions.height)) {
        callback(new Error("请输入宽高比"));
      } else if (isNaN(this.processOptions.width) || !/^[0-9]+$/.test(this.processOptions.width) || isNaN(this.processOptions.height) || !/^[0-9]+$/.test(this.processOptions.height)) {
        callback(new Error(this.$t("common.mustBeInt")));
      } else {
        callback();
      }
    };
    return {
      imageExtArr: ["jpg", "jpeg", "png", "gif", "bmp", "tif", "tiff", "psd", "tga", "miff", "pcx", "fits", "ppm", "pgm", "pfm", "mng", "hdr", "dds", "otb", "psb"],
      fileList: [],
      addingFile: false,
      processing: false,
      loading: null,
      demoImgUrlS: staticSiteHost + "/up/2024/0328/s.jpg",
      processOptions: {
        width: 4,
        height: 3,
        fillType: 0
      },
      processOptionsRules: {
        ratio: [{
          validator: adjustImageAspectRatio,
          trigger: "blur"
        }]
      }
    };
  },
  computed: {
    fileAccept() {
      var dottedExtensions = [];
      for (var imageExtIndex = 0; imageExtIndex < this.imageExtArr.length; imageExtIndex++) {
        dottedExtensions.push("." + this.imageExtArr[imageExtIndex]);
      }
      return dottedExtensions.join(",");
    },
    imageList() {
      var convertedBlobFiles = [];
      for (var fileListIndex = 0; fileListIndex < this.fileList.length; fileListIndex++) {
        if (this.fileList[fileListIndex].sourceConvertBlobUrl) {
          convertedBlobFiles.push(this.fileList[fileListIndex].sourceConvertBlobUrl);
        } else {
          convertedBlobFiles.push(this.fileList[fileListIndex].sourceBlobUrl);
        }
      }
      return convertedBlobFiles;
    },
    processBtnDisabled() {
      if (this.fileList.length == 0 || this.addingFile) {
        return true;
      }
      if (c.isNullOrEmpty(this.processOptions.width) && c.isNullOrEmpty(this.processOptions.height)) {
        return true;
      }
      return false;
    },
    processedCount() {
      if (this.fileList.length == 0) {
        return 0;
      }
      var filteredFileList = this.fileList.filter(fileItem => {
        return fileItem.newBlob != null;
      });
      return filteredFileList.length;
    },
    processPercent() {
      if (this.fileList.length == 0) {
        return 0;
      }
      var filteredFiles = this.fileList.filter(fileItem => {
        return fileItem.newBlob != null;
      });
      return locales.percentage.replace("100%", filteredFiles.length + "/" + this.fileList.length);
    },
    processOptionsPercentage() {
      return locales.settingTip3.replace("50%", this.processOptions.percentage + "%");
    },
    demoImgUrl() {
      return staticSiteHost + "/up/2024/0328/" + this.processOptions.fillType + ".jpg";
    }
  },
  watch: {
    "processOptions.width"(widthValue, widthOptions) {
      this.setImageNewSize();
    },
    "processOptions.height"(heightValue, heightOptions) {
      this.setImageNewSize();
    },
    "processOptions.fillType"(fillTypeValue, fillTypeOptions) {
      this.setImageNewSize();
    }
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
    this.dragEventBind();
  },
  methods: {
    dragEventBind() {
      var that = this;
      function handleFileListData(fileListData) {
        that.addFileListData(fileListData);
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
        var fileList = [];
        var fileIndex = 0;
        var fileCount = dataTransfer.files.length;
        function completeProcessing() {
          if (fileIndex === fileCount - 1) {
            handleFileListData(fileList);
          }
          fileIndex++;
        }
        if (dataTransfer.items !== undefined) {
          for (var itemIndex = 0; itemIndex < dataTransfer.items.length; itemIndex++) {
            var currentItem = dataTransfer.items[itemIndex];
            if (currentItem.kind === "file" && currentItem.webkitGetAsEntry().isFile) {
              var file = currentItem.getAsFile();
              fileList.push(file);
            }
          }
          handleFileListData(fileList);
        } else {
          for (var itemIndex = 0; itemIndex < fileCount; itemIndex++) {
            var fileEntry = dataTransfer.files[itemIndex];
            if (fileEntry.type) {
              fileList.push(fileEntry);
              completeProcessing();
            } else {
              try {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileEntry.slice(0, 3));
                fileReader.addEventListener("load", function (loadEvent) {
                  console.log(loadEvent, "load");
                  fileList.push(fileEntry);
                  completeProcessing();
                }, false);
                fileReader.addEventListener("error", function (errorEvent) {
                  console.log(errorEvent, "error，cannot upload folder");
                  completeProcessing();
                }, false);
              } catch (err) {
                console.log(err, "catch error，cannot upload folder");
                completeProcessing();
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
    addFileListData(fileListData) {
      if (this.addingFile) {
        return;
      }
      this.addingFile = true;
      var clonedImageExtArr = c.clone(this.imageExtArr);
      clonedImageExtArr.remove("jpg");
      clonedImageExtArr.remove("jpeg");
      clonedImageExtArr.remove("png");
      clonedImageExtArr.remove("gif");
      clonedImageExtArr.remove("bmp");
      setTimeout(() => {
        var handleIndexUpdate = currentIndex => {
          var imageElement = new Image();
          imageElement.src = this.fileList[currentIndex].sourceConvertBlobUrl ?? this.fileList[currentIndex].sourceBlobUrl;
          imageElement.onload = () => {
            this.fileList[currentIndex].sourceWidth = imageElement.width;
            this.fileList[currentIndex].sourceHeight = imageElement.height;
            this.setImageNewSize(currentIndex);
            adjustAspectRatio(currentIndex - offset);
          };
        };
        var processImageItem = (item, index, processCallback) => {
          var image = new Image();
          image.src = this.fileList[item].sourceBlobUrl;
          image.onload = () => {
            this.fileList[item].sourceWidth = image.width;
            this.fileList[item].sourceHeight = image.height;
            this.setImageNewSize(item);
          };
          fetch(index).then(async response => {
            try {
              let arrayBuffer = await response.arrayBuffer();
              let bytes = new Uint8Array(arrayBuffer);
              var executionResult = await execute({
                inputFiles: [{
                  name: "input." + processCallback,
                  content: bytes
                }],
                commands: "convert input." + processCallback + " out.png"
              });
              if (executionResult.outputFiles.length > 0 && executionResult.outputFiles[0].blob != null && executionResult.outputFiles[0].blob.size > 0) {
                this.fileList[item].sourceConvertBlobUrl = URL.createObjectURL(executionResult.outputFiles[0].blob);
                handleIndexUpdate(item);
              }
              if (this.loading) {
                this.loading.close();
                this.loading = null;
              }
            } catch (error) {}
          });
        };
        var offset = this.fileList.length;
        var arrayLength = fileListData.length;
        function* iterateItems() {
          for (var index = 0; index < arrayLength; index++) {
            yield getFileExtension(index);
          }
        }
        var getFileExtension = fileIndex => {
          var fileExtension = fileListData[fileIndex].name.substring(fileListData[fileIndex].name.lastIndexOf(".") + 1).toLowerCase();
          if (!this.imageExtArr.includes(fileExtension)) {
            adjustAspectRatio(fileIndex);
          } else {
            var sameNameFiles = this.fileList.filter(fileEntry => {
              return fileEntry.name == fileListData[fileIndex].name;
            });
            if (sameNameFiles.length > 0) {
              adjustAspectRatio(fileIndex);
            } else {
              try {
                var objectUrl = URL.createObjectURL(fileListData[fileIndex]);
                this.fileList.push({
                  name: fileListData[fileIndex].name,
                  sourceFormat: fileExtension,
                  originalSize: fileListData[fileIndex].size,
                  originalSizeDesc: c.transSizeDesc(fileListData[fileIndex].size, 1),
                  newSize: null,
                  newSizeDesc: null,
                  sourceBlobUrl: objectUrl,
                  sourceConvertBlobUrl: null,
                  newBlob: null,
                  sourceWidth: null,
                  sourceHeight: null,
                  newWidth: null,
                  newHeight: null
                });
                if (clonedImageExtArr.includes(fileExtension)) {
                  setTimeout(() => {
                    this.loading = this.$loading({
                      target: document.querySelectorAll(".file-item")[fileIndex + offset]
                    });
                    processImageItem(fileIndex + offset, objectUrl, fileExtension);
                  }, 30);
                } else {
                  handleIndexUpdate(fileIndex + offset);
                }
              } catch (error) {
                adjustAspectRatio(fileIndex);
              }
            }
          }
        };
        var adjustAspectRatio = targetIndex => {
          if (this.loading) {
            this.loading.close();
            this.loading = null;
          }
          if (targetIndex == arrayLength - 1) {
            this.addingFile = false;
            document.getElementById("flFile").value = null;
          } else {
            setTimeout(() => {
              generator.next();
            }, 10);
          }
        };
        var generator = iterateItems();
        generator.next();
      }, 80);
    },
    removeFileListData(targetFile) {
      if (this.processing) {
        return;
      }
      if (targetFile != null) {
        this.fileList.splice(targetFile, 1);
      } else {
        this.$confirm(locales.clearConfirm, locales.alertTitle, {
          confirmButtonText: locales.ok,
          cancelButtonText: locales.cancel
        }).then(() => {
          this.fileList = [];
        });
      }
    },
    setImageNewSize(startIndex) {
      var targetWidth = this.processOptions.width;
      var targetHeight = this.processOptions.height;
      if (c.isNullOrEmpty(targetWidth) || isNaN(targetWidth) || c.isNullOrEmpty(targetHeight) || isNaN(targetHeight)) {
        return;
      } else {
        targetWidth = Number(targetWidth);
        targetHeight = Number(targetHeight);
      }
      var loopStartIndex = startIndex || 0;
      var endIndex = startIndex != null ? startIndex + 1 : this.fileList.length;
      for (var loopIndex = loopStartIndex; loopIndex < endIndex; loopIndex++) {
        if (this.fileList[loopIndex].newBlob != null) {
          continue;
        }
        var sourceWidth = this.fileList[loopIndex].sourceWidth;
        var sourceHeight = this.fileList[loopIndex].sourceHeight;
        var ref0 = null;
        var ref1 = null;
        var computedRatio = sourceWidth / sourceHeight;
        var aspectRatio = this.processOptions.width / this.processOptions.height;
        if (aspectRatio > computedRatio) {
          ref0 = sourceHeight * aspectRatio;
          ref1 = sourceHeight;
        } else if (aspectRatio < computedRatio) {
          ref0 = sourceWidth;
          ref1 = sourceWidth / aspectRatio;
        } else {
          ref0 = sourceWidth;
          ref1 = sourceHeight;
        }
        if (this.processOptions.fillType == 3) {
          if (aspectRatio > computedRatio) {
            ref0 = sourceWidth;
            ref1 = sourceWidth / aspectRatio;
          } else if (aspectRatio < computedRatio) {
            ref0 = sourceHeight * aspectRatio;
            ref1 = sourceHeight;
          }
        }
        this.fileList[loopIndex].newWidth = parseInt(ref0, 10);
        this.fileList[loopIndex].newHeight = parseInt(ref1, 10);
      }
    },
    process() {
      if (this.processing) {
        return;
      }
      var pendingItems = this.fileList.filter(fileItem => {
        return fileItem.newBlob == null;
      });
      if (pendingItems.length == 0) {
        return;
      }
      this.processing = true;
      var colorThief = new ColorThief();
      setTimeout(() => {
        var fileListLength = this.fileList.length;
        function* processGenerator() {
          for (var fileLoopIndex = 0; fileLoopIndex < fileListLength; fileLoopIndex++) {
            yield processItem(fileLoopIndex);
          }
        }
        var processItem = itemIndex => {
          if (this.fileList[itemIndex].newBlob != null) {
            handleProcessedItem(itemIndex);
          } else {
            this.loading = this.$loading({
              target: document.querySelectorAll(".file-item")[itemIndex]
            });
            let extractedColor = null;
            if (this.processOptions.fillType == 1) {
              extractedColor = colorThief.getColor(document.querySelectorAll(".file-item")[itemIndex].querySelector("img"));
              console.log(extractedColor);
            }
            try {
              fetch(this.fileList[itemIndex].sourceBlobUrl).then(async response => {
                try {
                  let imageArrayBuffer = await response.arrayBuffer();
                  let imageBytes = new Uint8Array(imageArrayBuffer);
                  var sourceImageFormat = this.fileList[itemIndex].sourceFormat;
                  var fillColor = null;
                  if (this.processOptions.fillType == 0) {
                    var whiteFillColor = "rgba(255,255,255,1)";
                    if (["png", "gif", "psd"].includes(sourceImageFormat)) {
                      whiteFillColor = "transparent";
                    }
                    fillColor = ["convert -size " + this.fileList[itemIndex].newWidth + "x" + this.fileList[itemIndex].newHeight + " xc:" + whiteFillColor + " bg." + sourceImageFormat, "convert bg." + sourceImageFormat + " input." + sourceImageFormat + " -gravity center -composite result." + sourceImageFormat];
                  } else if (this.processOptions.fillType == 1) {
                    fillColor = ["convert -size " + this.fileList[itemIndex].newWidth + "x" + this.fileList[itemIndex].newHeight + " xc:rgba(" + extractedColor[0] + "," + extractedColor[1] + "," + extractedColor[2] + ",1) bg." + sourceImageFormat, "convert bg." + sourceImageFormat + " input." + sourceImageFormat + " -gravity center -composite result." + sourceImageFormat];
                  } else if (this.processOptions.fillType == 2) {
                    fillColor = ["convert input." + sourceImageFormat + " -blur 0x35 -resize " + this.fileList[itemIndex].newWidth + "x" + this.fileList[itemIndex].newHeight + "! bg." + sourceImageFormat, "convert bg." + sourceImageFormat + " input." + sourceImageFormat + " -gravity center -composite result." + sourceImageFormat];
                  } else if (this.processOptions.fillType == 3) {
                    var horizontalCropOffset = parseInt((this.fileList[itemIndex].sourceWidth - this.fileList[itemIndex].newWidth) / 2, 10);
                    var verticalCropOffset = parseInt((this.fileList[itemIndex].sourceHeight - this.fileList[itemIndex].newHeight) / 2, 10);
                    fillColor = ["convert input." + sourceImageFormat + " -crop " + this.fileList[itemIndex].newWidth + "x" + this.fileList[itemIndex].newHeight + "+" + horizontalCropOffset + "+" + verticalCropOffset + " result." + sourceImageFormat];
                  } else if (this.processOptions.fillType == 4) {
                    fillColor = ["convert input." + sourceImageFormat + " -resize " + this.fileList[itemIndex].newWidth + "x" + this.fileList[itemIndex].newHeight + "! result." + sourceImageFormat];
                  }
                  var executeResult = await execute({
                    inputFiles: [{
                      name: "input." + this.fileList[itemIndex].sourceFormat,
                      content: imageBytes
                    }],
                    commands: fillColor
                  });
                  var lastIndex = executeResult.outputFiles.length - 1;
                  this.fileList[itemIndex].newSize = executeResult.outputFiles[lastIndex].blob.size;
                  this.fileList[itemIndex].newSizeDesc = c.transSizeDesc(this.fileList[itemIndex].newSize, 1);
                  this.fileList[itemIndex].newBlob = executeResult.outputFiles[lastIndex].blob;
                  this.fileList[itemIndex].sourceBlobUrl = URL.createObjectURL(executeResult.outputFiles[lastIndex].blob);
                  handleProcessedItem(itemIndex);
                } catch (catchError1) {
                  handleProcessedItem(itemIndex);
                }
              });
            } catch (catchError2) {
              handleProcessedItem(itemIndex);
            }
          }
        };
        var handleProcessedItem = processedIndex => {
          if (this.loading) {
            this.loading.close();
            this.loading = null;
          }
          if (processedIndex == this.fileList.length - 1) {
            this.processing = false;
            this.$message.success(locales.processOver);
          } else {
            setTimeout(() => {
              iterator.next();
            }, 10);
          }
        };
        var iterator = processGenerator();
        iterator.next();
      }, 50);
    },
    download(fileIndex) {
      var anchorElement = document.createElement("a");
      var fileName = this.fileList[fileIndex].name.substring(0, this.fileList[fileIndex].name.lastIndexOf(".") + 1) + this.fileList[fileIndex].sourceFormat;
      anchorElement.download = fileName;
      anchorElement.href = URL.createObjectURL(this.fileList[fileIndex].newBlob);
      anchorElement.click();
    },
    downloadAll() {
      var zipInstance = new JSZip();
      var resizeImagesFolder = zipInstance.folder("resize-images");
      for (var listIndex = 0; listIndex < this.fileList.length; listIndex++) {
        if (this.fileList[listIndex].newBlob == null) {
          continue;
        }
        var generatedFileName = this.fileList[listIndex].name.substring(0, this.fileList[listIndex].name.lastIndexOf(".") + 1) + this.fileList[listIndex].sourceFormat;
        resizeImagesFolder.file(generatedFileName, this.fileList[listIndex].newBlob, {
          binary: true
        });
      }
      zipInstance.generateAsync({
        type: "blob"
      }).then(function (result) {
        saveAs(result, "resize-images.zip");
      });
    }
  }
}).use(ElementPlus).mount(".main-body");