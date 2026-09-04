c.preventCheat();
const dialogMap = {
  "phb-dialog": phbDialog,
  "history-dialog": historyDialog,
  comment: comment
};
Vue.createApp({
  components: dialogMap,
  data() {
    const gameConfig = {
      programName: "找不同的字",
      gameState: 1,
      gameStartTime: 0,
      gameEndTime: 0,
      gameSecondTime: 0,
      gameTimeInterval: 0,
      countdown: 60,
      countdownInterval: null,
      level: 1,
      errorCount: 0,
      findChar: "",
      findCharBlockIndex: 0,
      errorCharIndex: -1,
      otherChar: "",
      emoji: "",
      scoreDesc: "",
      charArr: [["巴", "巳"], ["失", "矢"], ["悄", "俏"], ["大", "太"], ["戍", "戌"], ["白", "自"], ["兵", "乒"], ["竟", "竞"], ["鸣", "呜"], ["柬", "束"], ["含", "合"], ["士", "土"], ["己", "已"], ["写", "与"], ["商", "啇"], ["棋", "旗"], ["恨", "狠"], ["酸", "醋"], ["中", "申"], ["帽", "冒"], ["雨", "两"], ["听", "昕"], ["爱", "受"], ["鸡", "鸭"], ["老", "考"], ["末", "未"], ["田", "甲"], ["江", "红"], ["湿", "温"], ["鞋", "靴"], ["肾", "贤"], ["近", "进"], ["圆", "国"], ["米", "来"], ["乐", "牙"], ["关", "天"], ["兽", "善"], ["开", "井"], ["左", "右"], ["上", "止"], ["二", "三"], ["茶", "荼"], ["轻", "经"], ["友", "有"], ["方", "万"], ["鸟", "乌"], ["酒", "洒"], ["家", "冢"], ["女", "又"], ["服", "报"], ["后", "石"], ["海", "悔"], ["园", "圆"], ["哀", "衰"], ["月", "用"], ["新", "薪"], ["日", "目"], ["火", "灭"], ["快", "决"], ["少", "小"], ["车", "东"], ["人", "入"], ["湖", "胡"], ["本", "木"], ["脾", "碑"], ["坏", "怀"], ["羊", "半"], ["亮", "壳"], ["水", "小"], ["国", "围"], ["说", "悦"], ["猫", "描"], ["帅", "师"], ["北", "比"], ["咸", "成"], ["喜", "嘉"], ["天", "夫"], ["下", "卞"], ["面", "而"], ["古", "舌"], ["蓝", "篮"], ["雷", "雪"], ["硬", "便"], ["心", "必"], ["跑", "抱"], ["灰", "友"], ["电", "申"], ["跳", "挑"], ["足", "是"], ["农", "衣"], ["干", "于"], ["喝", "渴"], ["河", "何"], ["男", "另"], ["肺", "柿"], ["了", "子"], ["云", "去"], ["看", "着"], ["胖", "拌"], ["菜", "采"], ["冷", "令"], ["软", "吹"], ["白", "百"], ["狗", "枸"], ["怒", "恕"], ["远", "运"], ["卷", "券"], ["休", "体"], ["设", "没"], ["琴", "瑟"], ["脸", "睑"], ["灸", "炙"], ["驰", "弛"], ["第", "弟"], ["兔", "免"], ["良", "艮"], ["鸡", "鸣"], ["线", "钱"], ["玉", "王"], ["愿", "原"], ["刀", "力"], ["冷", "泠"], ["昏", "皆"], ["字", "宇"], ["风", "凤"], ["菅", "管"], ["觅", "苋"], ["延", "廷"], ["片", "方"], ["爸", "芭"], ["子", "孑"], ["徒", "徙"], ["伤", "仿"], ["目", "耳"], ["日", "曰"], ["目", "旦"], ["口", "囗"], ["夕", "歹"], ["九", "丸"], ["几", "凡"], ["刃", "刀"], ["矛", "予"], ["弋", "戈"], ["斤", "斥"], ["户", "尸"], ["尺", "尸"], ["乃", "及"], ["丫", "丫"], ["卜", "十"], ["川", "卅"], ["午", "牛"], ["手", "毛"], ["爪", "瓜"], ["片", "爿"], ["升", "开"], ["凶", "区"], ["历", "厉"], ["辩", "辨"], ["辩", "辫"], ["辩", "瓣"], ["峰", "锋"], ["峰", "逢"], ["幅", "副"], ["妨", "防"], ["访", "仿"], ["份", "分"], ["妨", "房"], ["拨", "拔"], ["泊", "珀"], ["博", "搏"], ["捕", "哺"], ["踩", "睬"], ["沧", "苍"], ["舱", "仓"], ["测", "侧"], ["岔", "忿"], ["偿", "尝"], ["忱", "沉"], ["城", "诚"], ["崇", "祟"], ["畴", "筹"], ["稠", "绸"], ["憧", "幢"], ["醇", "淳"], ["簇", "族"], ["摧", "催"], ["耽", "眈"], ["挡", "档"], ["悼", "掉"], ["笛", "迪"], ["淀", "绽"], ["栋", "冻"], ["妒", "护"], ["端", "瑞"], ["锻", "缎"], ["垛", "朵"], ["祟", "崇"], ["羸", "赢"], ["赢", "嬴"], ["辨", "辩"], ["巳", "已"], ["丐", "丏"], ["卬", "卯"], ["卯", "卵"], ["卵", "卥"], ["胄", "胃"], ["冒", "冐"], ["曷", "喝"], ["壶", "壸"], ["衮", "哀"], ["衰", "蓑"], ["篡", "纂"], ["藉", "籍"], ["籍", "藉"], ["蓬", "篷"], ["簿", "薄"], ["幕", "暮"], ["暮", "墓"], ["墓", "慕"], ["慕", "募"], ["募", "幕"], ["葺", "茸"], ["茸", "耸"], ["肆", "肄"], ["肄", "逝"], ["暨", "既"], ["嵇", "稽"], ["雎", "睢"], ["瞿", "翟"], ["羸", "累"], ["爨", "窜"], ["徒", "陡"], ["徙", "旋"], ["侍", "待"], ["待", "持"], ["持", "特"], ["倚", "依"], ["倚", "椅"], ["倚", "旖"], ["伦", "沦"], ["论", "伦"], ["沦", "轮"], ["咯", "洛"], ["络", "洛"], ["埋", "理"], ["理", "哩"], ["慢", "漫"], ["漫", "蔓"], ["芒", "茫"], ["茫", "莽"], ["茂", "茅"], ["玫", "枚"], ["眉", "楣"], ["弥", "迷"], ["迷", "谜"], ["绵", "棉"], ["缅", "腼"], ["描", "瞄"], ["渺", "缈"], ["敏", "敏"], ["铭", "明"], ["模", "摸"], ["磨", "摩"], ["末", "沫"], ["漠", "莫"], ["墨", "默"], ["相", "想"], ["梧", "悟"], ["梧", "桐"], ["栖", "牺"], ["梢", "稍"], ["枝", "肢"], ["柯", "坷"], ["柳", "铆"], ["枫", "讽"], ["柏", "泊"], ["芳", "妨"], ["荷", "何"], ["菊", "鞠"], ["莓", "梅"], ["芦", "庐"], ["苗", "描"], ["苔", "台"], ["芹", "勤"], ["芽", "蚜"], ["茉", "末"], ["怒", "努"], ["恕", "述"], ["憾", "撼"], ["悔", "晦"], ["怜", "拎"], ["悄", "峭"], ["愉", "喻"], ["情", "晴"], ["惜", "昔"], ["悔", "梅"], ["亍", "于"], ["亓", "开"], ["丗", "世"], ["乜", "也"], ["亽", "人"], ["仂", "力"], ["仞", "仁"], ["仨", "三"], ["伍", "五"], ["仳", "比"], ["伛", "区"], ["佧", "卡"], ["佟", "冬"], ["佗", "它"], ["佝", "勾"], ["侔", "牟"], ["侗", "同"], ["佶", "吉"], ["佴", "耳"], ["侃", "兄"], ["卺", "卷"], ["卶", "仰"], ["厖", "龙"], ["叕", "多"], ["吽", "吼"], ["呙", "涡"], ["呾", "旦"], ["呿", "去"], ["咅", "倍"], ["哿", "可"]]
    };
    return gameConfig;
  },
  mounted() {
    this.setRelateToolPosition();
    this.startGame();
    window.addEventListener("resize", () => {
      this.setRelateToolPosition();
    });
    window.addEventListener("beforeunload", () => {
      if (this.countdown != 0) {
        this.addRankingList();
      }
    });
  },
  methods: {
    setRelateToolPosition() {
    },
    startGame() {
      this.gameStartTime = new Date().getTime();
      this.gameEndTime = this.gameStartTime;
      this.level = 1;
      this.countdown = 60;
      this.errorCount = 0;
      this.gameState = 1;
      this.generateRandomChar();
      c.clearSchedule(this.countdownInterval);
      this.countdownInterval = c.schedule(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.gameOver();
        }
      }, 1000);
    },
    charClick(clickedChar) {
      if (clickedChar == this.findCharBlockIndex) {
        this.level++;
        this.generateRandomChar();
        this.gameEndTime = new Date().getTime();
        this.countdown = 60;
        this.errorCount = 0;
        c.playAudio(staticSiteHost + "/audio/brain/right.mp3");
      } else {
        this.errorCount++;
        if (this.errorCount == 3) {
          this.gameOver();
        } else {
          this.errorCharIndex = clickedChar;
          c.scheduleOnce(() => {
            this.errorCharIndex = -1;
          }, 300);
          c.playAudio(staticSiteHost + "/audio/brain/error.mp3");
        }
      }
    },
    gameOver() {
      c.clearSchedule(this.countdownInterval);
      this.addRankingList();
      if (this.level <= 1) {
        this.emoji = "😥";
      } else if (this.level <= 10) {
        this.emoji = "🙂";
      } else if (this.level <= 20) {
        this.emoji = "👏";
        c.playAudio(staticSiteHost + "/audio/brain/huan-hu.mp3");
      } else {
        this.emoji = "😎";
        c.playAudio(staticSiteHost + "/audio/brain/huan-hu.mp3");
      }
      let elapsedSeconds = this.gameEndTime == 0 ? "0" : Number(((this.gameEndTime - this.gameStartTime) / 1000).toFixed(3));
      this.scoreDesc = "您的通关数量：" + (this.level - 1) + " 关，用时 " + elapsedSeconds + " 秒";
      this.gameState = 2;
    },
    generateRandomChar() {
      if (this.gameState != 1) {
        return;
      }
      let randomChar = this.charArr[Math.floor(Math.random() * this.charArr.length)];
      let randomFlag = Math.round(Math.random() * 1);
      this.findChar = randomChar[randomFlag];
      this.otherChar = randomChar[Math.abs(1 - randomFlag)];
      this.findCharBlockIndex = Math.floor(Math.random() * 100);
    },
    addRankingList() {
      const gameRankData = {
        programName: this.programName,
        score: this.level - 1,
        time: this.gameEndTime - this.gameStartTime
      };
      var rankSubmitData = gameRankData;
      c.game.addRankingList(rankSubmitData);
    }
  }
}).use(ElementPlus).mount(".main-body");