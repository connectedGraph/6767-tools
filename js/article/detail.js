Vue.createApp({
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
        this.listenerCatalogScroll();
      }, 100);
      document.querySelectorAll("pre").forEach(preElement => {
        preElement.classList.add("prettyprint");
      });
      addEventListener("load", PR.prettyPrint, false);
    });
  },
  methods: {
    initCatalogObj() {
      try {
        var cardElements = document.querySelector(".tool-body .content").querySelectorAll(this.needFindCatdObjList.join(","));
        if (cardElements.length == 0) {
          return;
        }
        var cardInfoMap = {};
        this.needFindCatdObjList.forEach(cardObj => {
          cardInfoMap[cardObj] = 0;
        });
        cardElements.forEach(cardElement => {
          for (var i = 0; i < this.needFindCatdObjList.length; i++) {
            if (this.needFindCatdObjList[i] == cardElement.tagName) {
              cardInfoMap[cardElement.tagName]++;
              break;
            }
          }
        });
        var positiveCardKeys = [];
        for (var key in cardInfoMap) {
          if (cardInfoMap[key] > 0) {
            positiveCardKeys.push(key);
          }
        }
        var nameList = [];
        function buildNameWithIndex(baseName, indexNum) {
          indexNum = indexNum == null ? 0 : indexNum;
          var combinedName = baseName + (indexNum == 0 ? "" : indexNum + 1);
          if (nameList.includes(combinedName)) {
            return buildNameWithIndex(baseName, indexNum + 1);
          } else {
            nameList.push(combinedName);
            return combinedName;
          }
        }
        cardElements.forEach(cardDomElement => {
          if (c.isNullOrEmpty(cardDomElement.id)) {
            var normalizedText = cardDomElement.innerText.replace(/ /g, "-");
            cardDomElement.id = buildNameWithIndex(normalizedText);
          }
          cardDomElement.level = positiveCardKeys.indexOf(cardDomElement.tagName);
        });
        this.catObjList = cardElements;
        var hashValue = location.hash;
        if (!c.isNullOrEmpty(hashValue)) {
          setTimeout(() => {
            hashValue = hashValue.replace("#", "");
            var targetElement = document.getElementById(hashValue);
            if (targetElement != null) {
              targetElement.scrollIntoView({
                behavior: "instant"
              });
            }
          }, 200);
        }
      } catch (error) {
        console.log("error:" + error);
      }
    },
    listenerCatalogScroll() {
      try {
        var scrollHandler = event => {
          var catalogLinks = document.querySelectorAll(".catalog-list a");
          catalogLinks.forEach(linkElement => {
            if (linkElement.id == "cat-" + event) {
              linkElement.className = "active";
            } else {
              linkElement.className = "";
            }
          });
        };
        var catalogClickHandler = () => {
          var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          for (var j = this.catObjList.length - 1; j >= 0; j--) {
            if (parseInt(scrollTop) >= Math.ceil(this.catObjList[j].offsetTop) - 70) {
              scrollHandler(this.catObjList[j].id);
              return;
            }
          }
        };
        window.addEventListener("scroll", scrollEvent => {
          catalogClickHandler();
        });
        catalogClickHandler();
      } catch (err) {
        console.log("error:" + err);
      }
    }
  }
}).use(ElementPlus).mount(".main-body");