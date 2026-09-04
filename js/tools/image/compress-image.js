/* dp disabled */;
import { execute } from "../../../lib/ImageMagick/magickApi.js";
Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      imageExtArr: ["jpg", "jpeg", "gif"],
      fileList: [],
      quality: 75,
      converting: false,
      loading: null
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
      var sourceBlobUrls = [];
      for (var fileIndex = 0; fileIndex < this.fileList.length; fileIndex++) {
        sourceBlobUrls.push(this.fileList[fileIndex].sourceBlobUrl);
      }
      return sourceBlobUrls;
    },
    convertedCount() {
      if (this.fileList.length == 0) {
        return 0;
      }
      var filteredFileList = this.fileList.filter(fileItem => {
        return fileItem.newBlob != null;
      });
      return filteredFileList.length;
    },
    convertPercent() {
      if (this.fileList.length == 0) {
        return 0;
      }
      var filteredFileList2 = this.fileList.filter(currentFile => {
        return currentFile.newBlob != null;
      });
      return filteredFileList2.length + "/" + this.fileList.length;
    }
  },
  mounted() {
    document.getElementById("flFile").addEventListener("change", this.handleFileSelect, false);
    this.dragEventBind();
  },
  methods: {
    dragEventBind() {
      var that = this;
      function addFileListDataHandler(fileListData) {
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
        var index = 0;
        var fileCount = dataTransfer.files.length;
        function handleFilesLoaded() {
          if (index === fileCount - 1) {
            addFileListDataHandler(fileList);
          }
          index++;
        }
        if (dataTransfer.items !== undefined) {
          for (var itemIndex = 0; itemIndex < dataTransfer.items.length; itemIndex++) {
            var currentItem = dataTransfer.items[itemIndex];
            if (currentItem.kind === "file" && currentItem.webkitGetAsEntry().isFile) {
              var itemFile = currentItem.getAsFile();
              fileList.push(itemFile);
            }
          }
          addFileListDataHandler(fileList);
        } else {
          for (var itemIndex = 0; itemIndex < fileCount; itemIndex++) {
            var fileEntry = dataTransfer.files[itemIndex];
            if (fileEntry.type) {
              fileList.push(fileEntry);
              handleFilesLoaded();
            } else {
              try {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileEntry.slice(0, 3));
                fileReader.addEventListener("load", function (loadEvent) {
                  console.log(loadEvent, "load");
                  fileList.push(fileEntry);
                  handleFilesLoaded();
                }, false);
                fileReader.addEventListener("error", function (errorEvent) {
                  console.log(errorEvent, "error，cannot upload folder");
                  handleFilesLoaded();
                }, false);
              } catch (caughtError) {
                console.log(caughtError, "catch error，cannot upload folder");
                handleFilesLoaded();
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
      document.getElementById("flFile").value = null;
    },
    addFileListData(newFiles) {
      for (var newFileIdx = 0; newFileIdx < newFiles.length; newFileIdx++) {
        var fileExtension = newFiles[newFileIdx].name.substring(newFiles[newFileIdx].name.lastIndexOf(".") + 1).toLowerCase();
        if (!this.imageExtArr.includes(fileExtension)) {
          continue;
        }
        var existingFiles = this.fileList.filter(existingFile => {
          return existingFile.name == newFiles[newFileIdx].name;
        });
        if (existingFiles.length > 0) {
          continue;
        }
        this.fileList.push({
          name: newFiles[newFileIdx].name,
          sourceFormat: fileExtension,
          originalSize: newFiles[newFileIdx].size,
          originalSizeDesc: c.transSizeDesc(newFiles[newFileIdx].size, 1),
          newSize: null,
          newSizeDesc: null,
          sourceBlobUrl: URL.createObjectURL(newFiles[newFileIdx]),
          newBlob: null,
          quality: null
        });
      }
    },
    removeFileListData(fileToRemove) {
      if (this.converting) {
        return;
      }
      if (fileToRemove != null) {
        this.fileList.splice(fileToRemove, 1);
      } else {
        this.$confirm(locales.clearConfirm, locales.alertTitle, {
          confirmButtonText: locales.ok,
          cancelButtonText: locales.cancel
        }).then(() => {
          this.fileList = [];
        });
      }
    },
    convert() {
      if (this.converting) {
        return;
      }
      var updatedFileList = this.fileList.filter(fileEntry => {
        return fileEntry.quality != null;
      });
      if (updatedFileList.length > 0 && updatedFileList[0].quality != this.quality) {
        for (var fileListIndex = 0; fileListIndex < this.fileList.length; fileListIndex++) {
          this.fileList[fileListIndex].newSize = null;
          this.fileList[fileListIndex].newSizeDesc = null;
          this.fileList[fileListIndex].newBlob = null;
          this.fileList[fileListIndex].quality = null;
        }
      }
      updatedFileList = this.fileList.filter(uncompressedFile => {
        return uncompressedFile.newBlob == null;
      });
      if (updatedFileList.length == 0) {
        return;
      }
      this.converting = true;
      setTimeout(() => {
        var totalFiles = this.fileList.length;
        function* compressGenerator() {
          for (var loopIndex = 0; loopIndex < totalFiles; loopIndex++) {
            yield processFile(loopIndex);
          }
        }
        var processFile = currentFileIndex => {
          if (this.fileList[currentFileIndex].newBlob != null) {
            closeLoadingForFile(currentFileIndex);
          } else {
            this.loading = this.$loading({
              target: document.querySelectorAll(".file-item")[currentFileIndex]
            });
            try {
              fetch(this.fileList[currentFileIndex].sourceBlobUrl).then(async response => {
                try {
                  let arrayBuffer = await response.arrayBuffer();
                  let uint8Array = new Uint8Array(arrayBuffer);
                  var convertCommand = "convert -quality " + this.quality + " input." + this.fileList[currentFileIndex].sourceFormat + " out." + this.fileList[currentFileIndex].sourceFormat;
                  if (this.fileList[currentFileIndex].sourceFormat == "gif") {
                    convertCommand = "convert input." + this.fileList[currentFileIndex].sourceFormat + " -fuzz " + (20 - parseInt(this.quality / 5, 10)) + "% -layers Optimize out." + this.fileList[currentFileIndex].sourceFormat;
                  }
                  var executionResult = await execute({
                    inputFiles: [{
                      name: "input." + this.fileList[currentFileIndex].sourceFormat,
                      content: uint8Array
                    }],
                    commands: convertCommand
                  });
                  if (executionResult.outputFiles.length > 0 && executionResult.outputFiles[0].blob != null && executionResult.outputFiles[0].blob.size > 0) {
                    this.fileList[currentFileIndex].newSize = executionResult.outputFiles[0].blob.size;
                    this.fileList[currentFileIndex].newSizeDesc = c.transSizeDesc(this.fileList[currentFileIndex].newSize, 1);
                    this.fileList[currentFileIndex].newBlob = executionResult.outputFiles[0].blob;
                    this.fileList[currentFileIndex].quality = this.quality;
                  }
                  closeLoadingForFile(currentFileIndex);
                } catch (err) {
                  closeLoadingForFile(currentFileIndex);
                }
              });
            } catch (err2) {
              closeLoadingForFile(currentFileIndex);
            }
          }
        };
        var closeLoadingForFile = loadingFileIndex => {
          if (this.loading) {
            this.loading.close();
            this.loading = null;
          }
          if (loadingFileIndex == this.fileList.length - 1) {
            this.converting = false;
            this.$message.success(locales.compressOver);
          } else {
            setTimeout(() => {
              iterator.next();
            }, 10);
          }
        };
        var iterator = compressGenerator();
        iterator.next();
      }, 50);
    },
    download(downloadIndex) {
      var downloadLink = document.createElement("a");
      var fileName = this.fileList[downloadIndex].name;
      downloadLink.download = fileName;
      downloadLink.href = URL.createObjectURL(this.fileList[downloadIndex].newBlob);
      downloadLink.click();
    },
    downloadAll() {
      var zipInstance = new JSZip();
      var compressedFolder = zipInstance.folder("compressed-images");
      for (var fileLoopIndex = 0; fileLoopIndex < this.fileList.length; fileLoopIndex++) {
        if (this.fileList[fileLoopIndex].newBlob == null) {
          continue;
        }
        var currentFileName = this.fileList[fileLoopIndex].name;
        compressedFolder.file(currentFileName, this.fileList[fileLoopIndex].newBlob, {
          binary: true
        });
      }
      zipInstance.generateAsync({
        type: "blob"
      }).then(function (result) {
        saveAs(result, "compressed-images.zip");
      });
    }
  }
}).use(ElementPlus).mount(".main-body");