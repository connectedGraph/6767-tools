c.preventCheat();
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
        document.querySelectorAll(".content i").forEach(iconElement => {
          iconElement.setAttribute("title", iconElement.textContent);
          iconElement.addEventListener("click", function () {
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
        var catdElements = document.querySelector(".tool-body .content").querySelectorAll(this.needFindCatdObjList.join(","));
        if (catdElements.length == 0) {
          return;
        }
        var catdObjMap = {};
        this.needFindCatdObjList.forEach(catdObj => {
          catdObjMap[catdObj] = 0;
        });
        catdElements.forEach(catdElement => {
          for (var index = 0; index < this.needFindCatdObjList.length; index++) {
            if (this.needFindCatdObjList[index] == catdElement.tagName) {
              catdObjMap[catdElement.tagName]++;
              break;
            }
          }
        });
        var resultList = [];
        for (var key in catdObjMap) {
          if (catdObjMap[key] > 0) {
            resultList.push(key);
          }
        }
        var counter = 0;
        catdElements.forEach(catdNode => {
          catdNode.id = Math.random();
          catdNode.level = resultList.indexOf(catdNode.tagName);
          if (catdNode.tagName == resultList[0]) {
            counter++;
          }
        });
        if (counter > 1) {
          var position = 1;
          catdElements.forEach(catdItem => {
            if (catdItem.tagName == resultList[0]) {
              catdItem.textContent = position + ". " + catdItem.textContent;
              position++;
            }
          });
        }
        this.catObjList = catdElements;
      } catch (error) {
        console.log("error:" + error);
      }
    },
    goPosition(targetElementId) {
      try {
        var targetElement = document.getElementById(targetElementId);
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
        var handler = eventData => {
          var catalogLinks = document.querySelectorAll(".catalog-list a");
          catalogLinks.forEach(catalogLink => {
            if (catalogLink.id == "cat-" + eventData) {
              catalogLink.className = "active";
            } else {
              catalogLink.className = "";
            }
          });
        };
        var scrollHandler = () => {
          var scrollTopValue = document.documentElement.scrollTop || document.body.scrollTop;
          for (var reverseIndex = this.catObjList.length - 1; reverseIndex >= 0; reverseIndex--) {
            if (parseInt(scrollTopValue) >= Math.ceil(this.catObjList[reverseIndex].offsetTop) - 70) {
              handler(this.catObjList[reverseIndex].id);
              return;
            }
          }
        };
        window.addEventListener("scroll", scrollEvent => {
          scrollHandler();
        });
        scrollHandler();
      } catch (ex) {
        console.log("error:" + ex);
      }
    }
  }
}).use(ElementPlus).mount(".main-body");