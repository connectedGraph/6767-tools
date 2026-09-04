Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      needFindCatdObjList: ["H1", "H2", "H3", "H4", "H5", "H6"],
      catObjList: [],
      showRightDrawer: false
    };
  },
  mounted() {
    this.initCatalogObj();
    this.$nextTick(() => {
      setTimeout(() => {
        this.goPosition(location.hash.replace("#", ""));
        this.listenerScroll();
        document.querySelectorAll(".content i").forEach(contentIcon => {
          contentIcon.addEventListener("click", function () {
            c.copy(this.textContent);
            c.layerMsg("复制成功");
          });
        });
      }, 100);
    });
  },
  methods: {
    initCatalogObj() {
      try {
        var matchedElements = document.querySelector(".tool-body .content").querySelectorAll(this.needFindCatdObjList.join(","));
        if (matchedElements.length == 0) {
          return;
        }
        var resultMap = {};
        this.needFindCatdObjList.forEach(needFindItem => {
          resultMap[needFindItem] = 0;
        });
        matchedElements.forEach(matchedElement => {
          for (var index = 0; index < this.needFindCatdObjList.length; index++) {
            if (this.needFindCatdObjList[index] == matchedElement.tagName) {
              resultMap[matchedElement.tagName]++;
              break;
            }
          }
        });
        var resultList = [];
        for (var mapKey in resultMap) {
          if (resultMap[mapKey] > 0) {
            resultList.push(mapKey);
          }
        }
        var count = 0;
        matchedElements.forEach(elementItem => {
          elementItem.id = Math.random();
          elementItem.level = resultList.indexOf(elementItem.tagName);
          if (elementItem.tagName == resultList[0]) {
            count++;
          }
        });
        if (count > 1) {
          var var0 = 1;
          matchedElements.forEach(currentElement => {
            if (currentElement.tagName == resultList[0]) {
              currentElement.textContent = var0 + ". " + currentElement.textContent;
              var0++;
            }
          });
        }
        this.catObjList = matchedElements;
      } catch (error) {
        console.log("error:" + error);
      }
    },
    goPosition(targetId) {
      try {
        var targetElement = document.getElementById(targetId);
        if (!targetElement) {
          return;
        }
        window.scrollTo({
          top: targetElement.offsetTop - 70
        });
      } catch (err) {
        console.log("error:" + err);
      }
    },
    listenerScroll() {
      try {
        var handleCatalogLinks = param0 => {
          var catalogLinks = document.querySelectorAll(".catalog-list a");
          catalogLinks.forEach(catalogLink => {
            if (catalogLink.id == "cat-" + param0) {
              catalogLink.className = "active";
            } else {
              catalogLink.className = "";
            }
          });
        };
        var updateScrollSpy = () => {
          var scrollTopPos = document.documentElement.scrollTop || document.body.scrollTop;
          for (var reverseIndex = this.catObjList.length - 1; reverseIndex >= 0; reverseIndex--) {
            if (parseInt(scrollTopPos) >= Math.ceil(this.catObjList[reverseIndex].offsetTop) - 70) {
              handleCatalogLinks(this.catObjList[reverseIndex].id);
              return;
            }
          }
        };
        window.addEventListener("scroll", scrollEvent => {
          updateScrollSpy();
        });
        updateScrollSpy();
      } catch (exception) {
        console.log("error:" + exception);
      }
    }
  }
}).use(ElementPlus).mount(".main-body");