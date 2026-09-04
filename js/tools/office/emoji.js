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
        var targetElements = document.querySelector(".tool-body .content").querySelectorAll(this.needFindCatdObjList.join(","));
        if (targetElements.length == 0) {
          return;
        }
        var categoryCountMap = {};
        this.needFindCatdObjList.forEach(categoryObject => {
          categoryCountMap[categoryObject] = 0;
        });
        targetElements.forEach(element => {
          for (var categoryIndex = 0; categoryIndex < this.needFindCatdObjList.length; categoryIndex++) {
            if (this.needFindCatdObjList[categoryIndex] == element.tagName) {
              categoryCountMap[element.tagName]++;
              break;
            }
          }
        });
        var activeCategoryKeys = [];
        for (var categoryKey in categoryCountMap) {
          if (categoryCountMap[categoryKey] > 0) {
            activeCategoryKeys.push(categoryKey);
          }
        }
        var counter = 0;
        targetElements.forEach(item => {
          item.id = Math.random();
          item.level = activeCategoryKeys.indexOf(item.tagName);
          if (item.tagName == activeCategoryKeys[0]) {
            counter++;
          }
        });
        if (counter > 1) {
          var startIndex = 1;
          targetElements.forEach(targetItem => {
            if (targetItem.tagName == activeCategoryKeys[0]) {
              targetItem.textContent = startIndex + ". " + targetItem.textContent;
              startIndex++;
            }
          });
        }
        this.catObjList = targetElements;
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
        var handleClick = clickEvent => {
          var catalogLinks = document.querySelectorAll(".catalog-list a");
          catalogLinks.forEach(catalogLink => {
            if (catalogLink.id == "cat-" + clickEvent) {
              catalogLink.className = "active";
            } else {
              catalogLink.className = "";
            }
          });
        };
        var scrollHandler = () => {
          var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          for (var catIndex = this.catObjList.length - 1; catIndex >= 0; catIndex--) {
            if (parseInt(scrollTop) >= Math.ceil(this.catObjList[catIndex].offsetTop) - 70) {
              handleClick(this.catObjList[catIndex].id);
              return;
            }
          }
        };
        window.addEventListener("scroll", scrollEvent => {
          scrollHandler();
        });
        scrollHandler();
      } catch (catchException) {
        console.log("error:" + catchException);
      }
    }
  }
}).use(ElementPlus).mount(".main-body");