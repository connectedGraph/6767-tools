var phbDialog = {
  name: "phb-dialog",
  props: {
    programName: {
      type: String,
      default: ""
    },
    levelGroupDescArr: {
      type: Array,
      default: []
    },
    levelGroupCodeArr: {
      type: Array,
      default: []
    },
    rankingWidth: {
      type: String,
      default: "60px"
    },
    scoreShow: {
      type: Boolean,
      default: true
    },
    scoreText: {
      type: String,
      default: "得分"
    },
    scoreWidth: {
      type: String,
      default: "15%"
    },
    timeShow: {
      type: Boolean,
      default: true
    },
    timeText: {
      type: String,
      default: "用时"
    },
    timeWidth: {
      type: String,
      default: "24%"
    }
  },
  data() {
    return {
      dialogVisible: false,
      isLoadingData: false,
      pageIndex: null,
      pageCount: null,
      pageSize: 30,
      levelGroupIndex: null,
      dataList: null,
      myInfo: null
    };
  },
  template: "\n        <el-dialog v-model=\"dialogVisible\" width=\"600\" modal-class=\"phb-dialog\" v-cloak>\n            <template #header>\n                <div class=\"flex\">\n                    <span style='font-size:18px;'>排行榜</span>\n                    <div v-if=\"levelGroupDescArr.length>0\" class=\"flex-center\" style=\"margin-left:5px;\">\n                        <el-dropdown trigger=\"click\" :disabled=\"isLoadingData\" v-on:command=\"showPhb\">\n                            <span class=\"group-head\">\n                                （{{levelGroupDescArr[levelGroupIndex]}}<i class=\"my-icon my-icon-jiantou-down\" style=\"font-size:14px;margin-left:3px;\"></i>）\n                            </span>\n                            <template #dropdown>\n                                <el-dropdown-menu>\n                                    <el-dropdown-item v-for=\"(item,index) in levelGroupDescArr\" :command=\"index\">{{item}}</el-dropdown-item>\n                                </el-dropdown-menu>\n                            </template>\n                        </el-dropdown>\n                    </div>\n                </div>\n            </template>\n            <div class=\"phb-head\">\n                <div :style=\"{width:rankingWidth}\">排名</div>\n                <div class=\"player\">玩家</div>\n                <div v-if=\"scoreShow\" :style=\"{width:scoreWidth}\">{{scoreText}}</div>\n                <div v-if=\"timeShow\" :style=\"{width:timeWidth}\">{{timeText}}</div>\n            </div>\n            <div v-if=\"dataList!=null\" class=\"phb-list\">\n                <div v-for=\"item in dataList\" class=\"phb-item\">\n                    <div :style=\"{width:rankingWidth}\">{{item.ranking}}</div>\n                    <div class=\"player\">\n                        <div class=\"player-info\">\n                            <img :src=\"item.avatarUrl\" />\n                            <span>{{item.nickName}}</span>\n                        </div>\n                    </div>\n                    <div class=\"score\" v-if=\"scoreShow\" :style=\"{width:scoreWidth}\">{{item.score}}</div>\n                    <div class=\"time\" v-if=\"timeShow\" :style=\"{width:timeWidth}\">{{item.time}}</div>\n                </div>\n            </div>\n            <div v-if=\"pageCount==null || (pageIndex!=pageCount && pageIndex<10 && pageCount!=0)\" class=\"phb-tip\">正在加载...</div>\n            <div v-if=\"pageCount!=null && pageCount==0\" class=\"phb-tip\">无数据</div>\n\n            <div v-if=\"myInfo!=null\" class=\"phb-item phb-my-info\">\n                <div :style=\"{width:rankingWidth}\">{{myInfo.ranking}}</div>\n                <div class=\"player\">\n                    <div class=\"player-info\">\n                        <img :src=\"myInfo.avatarUrl\" />\n                        <span>{{myInfo.nickName}}</span>\n                    </div>\n                </div>\n                <div v-if=\"scoreShow\" :style=\"{width:scoreWidth}\">{{myInfo.score}}</div>\n                <div  v-if=\"timeShow\" :style=\"{width:timeWidth}\">{{myInfo.time}}</div>\n            </div>\n        </el-dialog>\n    ",
  methods: {
    showPhb(phbData) {
      if (!c.isNullOrEmpty(phbData)) {
        if (phbData != -1 && this.levelGroupIndex < this.levelGroupCodeArr.length) {
          this.levelGroupIndex = phbData;
        } else {
          this.levelGroupIndex = 0;
        }
      }
      this.pageIndex = null;
      this.pageCount = null;
      this.dataList = null;
      this.myInfo = null;
      this.dialogVisible = true;
      this.getPhbData();
    },
    getPhbData() {
      if (this.isLoadingData) {
        return;
      }
      var counter = 1;
      if (this.pageIndex != null) {
        if (this.pageIndex == this.pageCount || this.pageIndex == 10) {
          return;
        }
        counter = this.pageIndex + 1;
      }
      this.isLoadingData = true;
      c.ajaxPost({
        url: "/NlxlRankingList/GetListForWeb",
        data: JSON.stringify({
          pageIndex: counter,
          pageSize: this.pageSize,
          programName: this.programName,
          levelGroup: this.levelGroupIndex != null ? this.levelGroupCodeArr[this.levelGroupIndex] : null
        }),
        contentType: "application/json",
        showLoading: false
      }).then(response => {
        setTimeout(() => {
          this.isLoadingData = false;
        }, 100);
        this.pageIndex = response.data.pageIndex;
        this.pageCount = response.data.pageCount;
        for (var idx = 0; idx < response.data.dataList.length; idx++) {
          response.data.dataList[idx].ranking = (counter - 1) * this.pageSize + idx + 1;
          response.data.dataList[idx].time = Number((response.data.dataList[idx].time / 1000).toFixed(3)) + "秒";
        }
        if (this.dataList == null) {
          this.dataList = response.data.dataList;
        } else {
          this.dataList = this.dataList.concat(response.data.dataList);
        }
        if (response.data.dataExtend != null) {
          response.data.dataExtend.time = Number((response.data.dataExtend.time / 1000).toFixed(3)) + "秒";
          this.myInfo = response.data.dataExtend;
        }
        var callback = () => {
          const scrollDistance = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight;
          if (scrollDistance <= 10) {
            this.getPhbData();
          }
        };
        let scrollContainer = document.querySelector(".el-dialog__body");
        scrollContainer.removeEventListener("scroll", callback);
        scrollContainer.addEventListener("scroll", callback);
      }).catch(error => {
        console.log(error);
        this.isLoadingData = false;
      });
    }
  }
};