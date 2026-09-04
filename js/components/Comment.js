var comment = {
  props: {
    commentClass: {
      type: Number,
      default: 1
    },
    relateId: {
      type: Number,
      default: 0
    }
  },
  data: function () {
    return {
      userId: null,
      pageSize: 15,
      childrenPageSize: 10,
      commentList: null,
      allCommentCount: null,
      totalCount: null,
      loading: false,
      childrenLoadingIndex: null,
      upSetTimeoutObj: {},
      upCountObj: {},
      emojiArr: ["😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "😍", "🤩", "😘", "😚", "😋", "😛", "😜", "🤪", "🤑", "🤗", "🤭", "🤫", "🤐", "🤨", "😑", "😏", "🙄", "😬", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😵", "🤯", "🤠", "😎", "🤓", "🧐", "😕", "😟", "😲", "😰", "😥", "😭", "😱", "😣", "😞", "😓", "😫", "😤", "😡", "😠", "🤬", "👋", "👌", "👍", "👎", "💪", "🌹", "🍉", "🍵", "🎂"],
      headerCommentPlaceholder: "评论",
      headerCommentContent: "",
      headerCommentBottomVisible: false,
      headerCommentEmojiVisible: false,
      popupCommentPlaceholder: "评论",
      popupCommentContent: "",
      popupCommentVisible: false,
      popupCommentEmojiVisible: false,
      parentId: 0,
      toReplyUserId: null,
      newAddChildrenCommentIdArr: [],
      reportDialogVisible: false,
      reportReasonDic: null,
      reportCommentId: null,
      reportReason: null
    };
  },
  template: "\n        <div class=\"comment-model\" v-cloak>\n            <div class=\"title\">评论列表<span v-if=\"allCommentCount!=null\"> ({{allCommentCount}})</span></div>\n            <div class=\"comment-submit-box head-comment\">\n                <el-input v-model=\"headerCommentContent\" ref=\"headerCommentContent\" :rows=\"headerCommentBottomVisible?2:1\" type=\"textarea\" :placeholder=\"headerCommentPlaceholder\" v-on:focus=\"headerCommentContentFocus\" class=\"w100\"></el-input>\n                <div class=\"bottom\" v-show=\"headerCommentBottomVisible\">\n                    <el-popover placement=\"bottom-start\" v-model:visible=\"headerCommentEmojiVisible\" :hide-after=\"0\" :width=\"300\" popper-class=\"biaoqing-popover\" trigger=\"click\">\n                        <template #reference>\n                            <i class=\"my-icon my-icon-biaoqing\"></i>\n                        </template>\n                        <div class=\"biaoqing-list\"><i v-for='item in emojiArr' v-on:click='addEmoji(item)'>{{item}}</i></div>\n                    </el-popover>\n                    <div class=\"bottom-right\">\n                        <a href=\"javascript:;\" v-on:click=\"hideHeadSubmitBottom\">取消</a>\n                        <el-button type=\"primary\" v-on:click=\"submitComment\">评论</el-button>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"popup-comment-box\" v-bind:class=\"{ hide: !popupCommentVisible }\">\n                <div class=\"mask\" v-on:click=\"closeCommentPopup\" v-bind:class=\"{ show: popupCommentVisible }\"></div>\n                <div class=\"comment-submit-box popup-comment\">\n                    <el-input v-model=\"popupCommentContent\" ref=\"popupCommentContent\" rows=\"3\" type=\"textarea\" :placeholder=\"popupCommentPlaceholder\" class=\"w100\"></el-input>\n                    <div class=\"bottom\">\n                        <el-popover placement=\"bottom-start\" v-model:visible=\"popupCommentEmojiVisible\" :hide-after=\"0\" :width=\"300\" popper-class=\"biaoqing-popover\" trigger=\"click\">\n                            <template #reference>\n                                <i class=\"my-icon my-icon-biaoqing\"></i>\n                            </template>\n                            <div class=\"biaoqing-list\"><i v-for='item in emojiArr' v-on:click='addEmoji(item)'>{{item}}</i></div>\n                        </el-popover>\n                        <div class=\"bottom-right\">\n                            <a href=\"javascript:;\" v-on:click=\"closeCommentPopup\">取消</a>\n                            <el-button type=\"primary\" v-on:click=\"submitComment\">评论</el-button>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"comment-list\" v-if=\"commentList!=null && commentList.length>0\">\n                <template v-for=\"(item,itemIndex) in commentList\">\n                    <div class=\"comment-item\">\n                        <img :src=\"item.createByHeadImg\" class=\"head-img\" />\n                        <div class=\"item-right\">\n                            <div class=\"top\">\n                                <div class=\"name\">{{item.createByUserName}}</div>\n                                <div class=\"time\">{{item.createTime}}</div>\n                            </div>\n                            <div class=\"comment-content\">{{item.commentContent}}</div>\n                            <div class=\"bottom\">\n                                <div class=\"op\">\n                                    <div class=\"zan\" v-on:click=\"upComment(itemIndex)\"><i class=\"my-icon\" v-bind:class=\"item.upped?'my-icon-zan-active':'my-icon-zan'\"></i><span class=\"count\">{{item.upCount}}</span></div>\n                                    <div class=\"replay\" v-on:click=\"openCommentPopup(item.id,null,null)\">回复</div>\n                                </div>\n                                <div class=\"more\">\n                                    <i class=\"my-icon my-icon-more\"></i>\n                                    <div v-if=\"userId!=null && userId==item.createBy\" class=\"popup\" v-on:click=\"deleteComment(item.id)\">删除</div>\n                                    <div v-else class=\"popup\" v-on:click=\"openReportDialog(item.id)\">举报</div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"comment-list child\" v-if=\"item.children!=null\">\n                        <div class=\"comment-item\" v-for=\"(child,childIndex) in item.children\">\n                            <img :src=\"child.createByHeadImg\" class=\"head-img\" />\n                            <div class=\"item-right\">\n                                <div class=\"top\">\n                                    <div class=\"name\">{{child.createByUserName}}</div>\n                                    <div class=\"time\">{{child.createTime}}</div>\n                                </div>\n                                <div class=\"comment-content\">{{child.toReplyUserName!=null?'@'+child.toReplyUserName+' ':''}}{{child.commentContent}}</div>\n                                <div class=\"bottom\">\n                                    <div class=\"op\">\n                                        <div class=\"zan\" v-on:click=\"upComment(itemIndex,childIndex)\"><i class=\"my-icon\" v-bind:class=\"child.upped?'my-icon-zan-active':'my-icon-zan'\"></i><span class=\"count\">{{child.upCount}}</span></div>\n                                        <div class=\"replay\" v-on:click=\"openCommentPopup(item.id,child.createBy,child.createByUserName)\">回复</div>\n                                    </div>\n                                    <div class=\"more\">\n                                        <i class=\"my-icon my-icon-more\"></i>\n                                        <div v-if=\"userId!=null && userId==child.createBy\" class=\"popup\" v-on:click=\"deleteComment(child.id)\">删除</div>\n                                        <div v-else class=\"popup\" v-on:click=\"openReportDialog(child.id)\">举报</div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"show-more\" v-if=\"item.replyCount-item.children.length>0 && childrenLoadingIndex!=itemIndex\" v-on:click=\"showMoreChildrenComment(itemIndex)\">展开更多({{item.replyCount-item.children.length}})<i class=\"my-icon my-icon-jiantou-down\"></i></div>\n                        <div class=\"show-more\" v-if='childrenLoadingIndex==itemIndex'>正在加载..</div>\n                    </div>\n                </template>\n            </div>\n\n            <div class=\"tip\" v-if=\"commentList!=null && commentList.length==0\">暂无评论</div>\n            <div class=\"tip\" v-if=\"totalCount==null || totalCount>pageSize\">正在加载..</div>\n            <div class=\"tip\" v-if=\"totalCount!=null && totalCount<=pageSize && commentList.length>0\">已全部加载完毕</div>\n        </div>\n        <el-dialog v-model=\"reportDialogVisible\" title=\"举报\" width=\"400\" v-cloak>\n            <ul class=\"report-reason-list\">\n                <li v-for=\"item in reportReasonDic\" v-on:click=\"reportReason=item.value\"><i class=\"my-icon\" v-bind:class=\"reportReason==item.value?'my-icon-selected':'my-icon-unselected'\"></i>{{item.desc}}</li>\n            </ul>\n            <template #footer>\n                <el-button v-on:click=\"reportDialogVisible = false\">取消</el-button>\n                <el-button type=\"primary\" :disabled=\"reportReason==null\" v-on:click=\"report\">确定</el-button>\n            </template>\n        </el-dialog>\n        ",
  mounted: function () {
    var parsedToken = c.parseJwt();
    if (!c.isNullOrEmpty(parsedToken)) {
      this.userId = Number(parsedToken.Id);
    }
    this.getCommentList();
    window.addEventListener("scroll", () => {
      if (this.loading || this.commentList != null && this.commentList.length == 0 || this.totalCount != null && this.totalCount <= this.pageSize && this.commentList.length > 0) {
        return;
      }
      if (document.documentElement.scrollTop >= document.querySelector(".comment-model .tip").offsetTop - window.innerHeight) {
        this.getCommentList();
      }
    });
  },
  methods: {
    getCommentList() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      c.ajaxPost({
        url: "/Comment/GetList",
        data: JSON.stringify({
          pageSize: this.pageSize,
          commentClass: this.commentClass,
          relateId: this.relateId,
          startId: this.commentList == null ? null : this.commentList[this.commentList.length - 1].id,
          getAllCommentCount: this.commentList == null ? true : false
        }),
        contentType: "application/json",
        showLoading: false,
        completeCallBack: () => {
          this.loading = false;
        }
      }).then(responseData => {
        for (var commentIndex = 0; commentIndex < responseData.data.dataList.length; commentIndex++) {
          responseData.data.dataList[commentIndex].createTime = new Date(responseData.data.dataList[commentIndex].createTime).toLocaleString();
          if (responseData.data.dataList[commentIndex].children != null) {
            for (var childCommentIndex = 0; childCommentIndex < responseData.data.dataList[commentIndex].children.length; childCommentIndex++) {
              responseData.data.dataList[commentIndex].children[childCommentIndex].createTime = new Date(responseData.data.dataList[commentIndex].children[childCommentIndex].createTime).toLocaleString();
            }
          }
        }
        if (this.commentList == null) {
          this.commentList = responseData.data.dataList;
        } else {
          this.commentList.splice(this.commentList.length, 0, ...responseData.data.dataList);
        }
        this.totalCount = responseData.data.totalCount;
        if (responseData.data.dataExtend != null && !c.isNullOrEmpty(responseData.data.dataExtend.allCommentCount)) {
          this.allCommentCount = responseData.data.dataExtend.allCommentCount;
        }
      });
    },
    showMoreChildrenComment(commentIdx) {
      var commentId = this.commentList[commentIdx].id;
      var ref0 = null;
      var childComments = this.commentList[commentIdx].children;
      if (this.newAddChildrenCommentIdArr.length == 0) {
        ref0 = childComments[childComments.length - 1].id;
      } else {
        for (var reverseChildIndex = childComments.length - 1; reverseChildIndex >= 0; reverseChildIndex--) {
          if (!this.newAddChildrenCommentIdArr.includes(childComments[reverseChildIndex].id)) {
            ref0 = childComments[reverseChildIndex].id;
            break;
          }
        }
      }
      this.childrenLoadingIndex = commentIdx;
      c.ajaxPost({
        url: "/Comment/GetList",
        data: JSON.stringify({
          pageSize: this.childrenPageSize,
          parentId: commentId,
          startId: ref0
        }),
        contentType: "application/json",
        showLoading: false,
        completeCallBack: () => {
          this.childrenLoadingIndex = null;
        }
      }).then(moreCommentsResponse => {
        if (this.newAddChildrenCommentIdArr.length > 0) {
          for (var reverseCommentIndex = moreCommentsResponse.data.dataList.length - 1; reverseCommentIndex >= 0; reverseCommentIndex--) {
            if (this.newAddChildrenCommentIdArr.includes(moreCommentsResponse.data.dataList[reverseCommentIndex].id)) {
              moreCommentsResponse.data.dataList.splice(reverseCommentIndex, 1);
            }
          }
        }
        for (var reverseCommentIndex = 0; reverseCommentIndex < moreCommentsResponse.data.dataList.length; reverseCommentIndex++) {
          moreCommentsResponse.data.dataList[reverseCommentIndex].createTime = new Date(moreCommentsResponse.data.dataList[reverseCommentIndex].createTime).toLocaleString();
          if (moreCommentsResponse.data.dataList[reverseCommentIndex].children != null) {
            for (var nestedChildIndex = 0; nestedChildIndex < moreCommentsResponse.data.dataList[reverseCommentIndex].children.length; nestedChildIndex++) {
              moreCommentsResponse.data.dataList[reverseCommentIndex].children[nestedChildIndex].createTime = new Date(moreCommentsResponse.data.dataList[reverseCommentIndex].children[nestedChildIndex].createTime).toLocaleString();
            }
          }
        }
        this.commentList[commentIdx].children.splice(this.commentList[commentIdx].children.length, 0, ...moreCommentsResponse.data.dataList);
      });
    },
    headerCommentContentFocus() {
      if (c.isNullOrEmpty(c.cookie.get("Token"))) {
        this.$refs.headerCommentContent.blur();
        this.$confirm("未登录或登录超时，现在去登录。", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(() => {
          mainNavVueObj.goSignIn();
        });
      } else {
        this.headerCommentBottomVisible = true;
      }
    },
    hideHeadSubmitBottom() {
      this.headerCommentContent = "";
      this.headerCommentBottomVisible = false;
    },
    openCommentPopup(commentId, parentId, commentContent) {
      if (c.isNullOrEmpty(c.cookie.get("Token"))) {
        this.$confirm("未登录或登录超时，现在去登录。", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(() => {
          mainNavVueObj.goSignIn();
        });
      } else {
        this.popupCommentVisible = true;
        this.parentId = commentId;
        this.toReplyUserId = parentId;
        if (commentContent != null) {
          this.popupCommentPlaceholder = "@" + commentContent;
        } else {
          this.popupCommentPlaceholder = "评论";
        }
      }
    },
    closeCommentPopup(closingCommentId) {
      this.popupCommentVisible = false;
      this.parentId = 0;
    },
    addEmoji(emoji) {
      if (this.popupCommentVisible) {
        this.popupCommentContent += emoji;
        this.$refs.popupCommentContent.focus();
        this.popupCommentEmojiVisible = false;
      } else {
        this.headerCommentContent += emoji;
        this.$refs.headerCommentContent.focus();
        this.headerCommentEmojiVisible = false;
      }
    },
    submitComment: function (submitData) {
      var currentCommentContent = this.popupCommentVisible ? this.popupCommentContent : this.headerCommentContent;
      if (c.isNullOrEmpty(currentCommentContent)) {
        c.layerMsg("请输入评论内容");
        return;
      }
      if (currentCommentContent.trim().length < 3) {
        c.layerMsg("请多输入点评论内容");
        return;
      }
      c.ajaxPost({
        url: "/Comment/Add",
        data: JSON.stringify({
          relateId: this.relateId,
          commentClass: this.commentClass,
          commentContent: currentCommentContent,
          parentId: this.parentId,
          toReplyUserId: this.toReplyUserId
        }),
        contentType: "application/json",
        loadingTarget: this.popupCommentVisible ? ".popup-comment" : ".head-comment"
      }).then(submitCommentResponse => {
        var userSummary = JSON.parse(c.cookie.get("UserSummary"));
        var requestPayload = {
          id: submitCommentResponse.data,
          upCount: 0,
          replyCount: 0,
          commentContent: currentCommentContent,
          toReplyUserId: this.toReplyUserId,
          toReplyUserName: null,
          createBy: userSummary.id,
          createByUserName: c.isNullOrEmpty(userSummary.userName) ? userSummary.id : userSummary.userName,
          createByHeadImg: userSummary.headImg,
          createTime: new Date().toLocaleString()
        };
        this.allCommentCount++;
        if (this.popupCommentVisible) {
          if (this.popupCommentPlaceholder.indexOf("@") == 0) {
            requestPayload.toReplyUserName = this.popupCommentPlaceholder.substring(1);
          }
          for (var commentListIndex = 0; commentListIndex < this.commentList.length; commentListIndex++) {
            if (this.commentList[commentListIndex].id == this.parentId) {
              if (this.commentList[commentListIndex].children == null) {
                this.commentList[commentListIndex].children = [];
              }
              this.commentList[commentListIndex].replyCount++;
              this.commentList[commentListIndex].children.push(requestPayload);
              break;
            }
          }
          this.newAddChildrenCommentIdArr.push(submitCommentResponse.data);
        } else {
          this.commentList.splice(0, 0, requestPayload);
        }
        this.headerCommentContent = this.popupCommentContent = null;
        this.popupCommentVisible = false;
        c.layerMsg("评论成功");
      });
    },
    upComment: function (targetCommentId, upvoteEvent) {
      if (c.isNullOrEmpty(c.cookie.get("Token"))) {
        this.$confirm("未登录或登录超时，现在去登录。", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(() => {
          mainNavVueObj.goSignIn();
        });
        return;
      }
      var targetCommentId = null;
      if (upvoteEvent == null) {
        targetCommentId = this.commentList[targetCommentId].id;
        if (this.upCountObj["id-" + targetCommentId] == null) {
          this.upCountObj["id-" + targetCommentId] = 0;
        }
        if (this.commentList[targetCommentId].upped) {
          this.commentList[targetCommentId].upCount--;
          this.upCountObj["id-" + targetCommentId]--;
        } else {
          this.commentList[targetCommentId].upCount++;
          this.upCountObj["id-" + targetCommentId]++;
        }
        this.commentList[targetCommentId].upped = !this.commentList[targetCommentId].upped;
      } else {
        targetCommentId = this.commentList[targetCommentId].children[upvoteEvent].id;
        if (this.upCountObj["id-" + targetCommentId] == null) {
          this.upCountObj["id-" + targetCommentId] = 0;
        }
        if (this.commentList[targetCommentId].children[upvoteEvent].upped) {
          this.commentList[targetCommentId].children[upvoteEvent].upCount--;
          this.upCountObj["id-" + targetCommentId]--;
        } else {
          this.commentList[targetCommentId].children[upvoteEvent].upCount++;
          this.upCountObj["id-" + targetCommentId]++;
        }
        this.commentList[targetCommentId].children[upvoteEvent].upped = !this.commentList[targetCommentId].children[upvoteEvent].upped;
      }
      if (this.upSetTimeoutObj[targetCommentId] != null) {
        clearTimeout(this.upSetTimeoutObj[targetCommentId]);
        this.upSetTimeoutObj[targetCommentId] = null;
      }
      this.upSetTimeoutObj[targetCommentId] = setTimeout(() => {
        if (this.upCountObj["id-" + targetCommentId] == 0) {
          this.upSetTimeoutObj[targetCommentId] = null;
        } else {
          this.upCountObj["id-" + targetCommentId] = 0;
          this.upSetTimeoutObj[targetCommentId] = null;
          c.ajaxGet({
            url: "/Comment/Up?id=" + targetCommentId,
            showLoading: false
          }).then(unusedResponse => {});
        }
      }, 1000);
    },
    deleteComment(deleteCommentId) {
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        c.ajaxGet({
          url: "/Comment/Delete?id=" + deleteCommentId
        }).then(deleteResponse => {
          this.allCommentCount--;
          var foundParentComment = false;
          for (var parentCommentIndex = 0; parentCommentIndex < this.commentList.length; parentCommentIndex++) {
            if (this.commentList[parentCommentIndex].id == deleteCommentId) {
              this.commentList.splice(parentCommentIndex, 1);
              foundParentComment = true;
              break;
            }
            if (this.commentList[parentCommentIndex].children != null) {
              for (var childCommentLoopIndex = 0; childCommentLoopIndex < this.commentList[parentCommentIndex].children.length; childCommentLoopIndex++) {
                if (this.commentList[parentCommentIndex].children[childCommentLoopIndex].id == deleteCommentId) {
                  this.commentList[parentCommentIndex].children.splice(childCommentLoopIndex, 1);
                  this.commentList[parentCommentIndex].replyCount--;
                  foundParentComment = true;
                  break;
                }
              }
              if (foundParentComment) {
                break;
              }
            }
          }
        });
      });
    },
    openReportDialog(reportCommentId) {
      if (c.isNullOrEmpty(c.cookie.get("Token"))) {
        this.$confirm("未登录或登录超时，现在去登录。", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(() => {
          mainNavVueObj.goSignIn();
        });
      } else {
        this.reportCommentId = reportCommentId;
        this.reportReason = null;
        if (this.reportReasonDic == null) {
          c.ajaxPost({
            url: "/DataDictionary/GetValueDescList",
            data: JSON.stringify({
              code: "ReportReason"
            }),
            contentType: "application/json"
          }).then(reportResponse => {
            this.reportReasonDic = reportResponse.data;
            console.log(this.reportReasonDic);
            this.reportDialogVisible = true;
          });
        } else {
          this.reportDialogVisible = true;
        }
      }
    },
    report: function (reportData) {
      c.ajaxPost({
        url: "/Report/Add",
        data: JSON.stringify({
          commentId: this.reportCommentId,
          reportReasonValue: Number(this.reportReason)
        }),
        contentType: "application/json"
      }).then(reportResult => {
        this.reportDialogVisible = false;
        c.layerMsg("举报成功");
      });
    }
  }
};