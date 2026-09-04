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
      }, 100);
    });
  },
  methods: {
    initCatalogObj() {
      try {
        var cardElements = document.querySelector(".tool-body .content").querySelectorAll(this.needFindCatdObjList.join(","));
        if (cardElements.length == 0) {
          return;
        }
        var resultMap = {};
        this.needFindCatdObjList.forEach(cardSelector => {
          resultMap[cardSelector] = 0;
        });
        cardElements.forEach(cardElement => {
          for (var index = 0; index < this.needFindCatdObjList.length; index++) {
            if (this.needFindCatdObjList[index] == cardElement.tagName) {
              resultMap[cardElement.tagName]++;
              break;
            }
          }
        });
        var matchedCards = [];
        for (var key in resultMap) {
          if (resultMap[key] > 0) {
            matchedCards.push(key);
          }
        }
        var counter = 0;
        cardElements.forEach(currentCard => {
          currentCard.id = Math.random();
          currentCard.level = matchedCards.indexOf(currentCard.tagName);
          if (currentCard.tagName == matchedCards[0]) {
            counter++;
          }
        });
        if (counter > 1) {
          var matchedCount = 1;
          cardElements.forEach(cardItem => {
            if (cardItem.tagName == matchedCards[0]) {
              cardItem.textContent = matchedCount + ". " + cardItem.textContent;
              matchedCount++;
            }
          });
        }
        this.catObjList = cardElements;
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
      } catch (exception) {
        console.log("error:" + exception);
      }
    },
    listenerScroll() {
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
        var handleScroll = () => {
          var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          for (var reverseIndex = this.catObjList.length - 1; reverseIndex >= 0; reverseIndex--) {
            if (parseInt(scrollTop) >= Math.ceil(this.catObjList[reverseIndex].offsetTop) - 70) {
              scrollHandler(this.catObjList[reverseIndex].id);
              return;
            }
          }
        };
        window.addEventListener("scroll", scrollEvt => {
          handleScroll();
        });
        handleScroll();
      } catch (caughtError) {
        console.log("error:" + caughtError);
      }
    }
  }
}).use(ElementPlus).mount(".main-body");