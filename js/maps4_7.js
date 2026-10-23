
/* ========== 第4~7关：规则怪谈 / 无限列车 / 克苏鲁渔村 / 中式古村 ========== */

/* ---------- 第四关 · 规则怪谈 ---------- */
GAME_DATA.levels.push({
  id: 'lv4', title: '第四关 · 规则怪谈', music: 'rule', img: 'assets/lv4.jpg', reward: 900,
  intro: 'lobby',
  enemies: {
    neighbor: { spr: 7, name: '被污染的邻居', spr: 7, img: 'assets/port_neighbor.jpg', hp: 330, atk: 36, def: 7, spd: 4, weak: 'holy', points: 207, sanDmg: 12 },
    keeper:   { spr: 13,name: '伪管理员·BOSS', img: 'assets/port_keeper.jpg', hp: 1500, atk: 50, def: 9, spd: 7, weak: 'holy', points: 745, boss: true, noFlee: true, sanDmg: 12 },
  },
  nodes: {
    lobby: {
      text: '你成了「幸福公寓」的新住户。大厅布告栏上贴着一张打印纸，标题是《住户守则》：\n\n一、晚上十点后不要照镜子。\n二、管理员穿红色制服。如果有人自称管理员且穿黑色制服，请立即回到房间锁门。\n三、走廊尽头没有404室。看到404室请无视。\n四、电梯里的红色按钮永远不要去按。\n五、守则若出现第六条，那是它写的，不要遵守。',
      fx: { items: ['rules_note'], san: -5 },
      options: [
        { t: '进电梯上楼', to: 'elevator' },
        { t: '问大厅里踱步的邻居', to: 'neighbor_q' },
      ]
    },
    neighbor_q: {
      text: '邻居回过头——他的脸是平的，五官像被熨斗烫过一样模糊。\n\n「你也是新来的？呵呵……记住，404室是存在的，里面有好东西哦。」\n\n守则三说404室不存在。邻居的嘴角咧到了耳根。',
      fx: { san: -8 },
      options: [
        { t: '揍这个诡异的邻居（战斗）', battle: 'neighbor', win: 'elevator', lose: 'death' },
        { t: '不搭理他，进电梯', to: 'elevator' },
      ]
    },
    elevator: {
      text: '电梯里贴着「本梯停运」的纸条，但电梯自己打开了。\n\n按钮面板上，除了楼层按钮，最底下还有一枚鲜红的圆形按钮，像一颗眼球。\n\n守则四：红色按钮永远不要去按。',
      options: [
        { t: '按4楼（去走廊）', to: 'corridor' },
        { t: '按红色按钮（违反守则）', to: 'red_button', fx: { san: -15 } },
      ]
    },
    red_button: {
      text: '电梯门缓缓合上，电梯开始往下坠——这栋楼只有4层，却坠了整整两分钟。\n\n门开时外面是停尸间一样的黑暗空间。一个穿黑制服的「管理员」背对你站着：\n\n「你按了我的按钮。现在，你归我管了。」\n\n你得付出代价才能离开。',
      options: [
        { t: '交出500积分换取离开', to: 'corridor', req: { points: 500 }, fx: { points: -500 } },
        { t: '硬闯回去（战斗·强敌）', battle: 'neighbor', win: 'corridor', lose: 'death', fx: { hp: -20 } },
      ]
    },
    corridor: {
      text: '四楼走廊。你的房间是403，而走廊尽头……赫然挂着一块「404」的门牌，门缝里透出暖黄的灯光，里面似乎有人在包饺子。\n\n守则三：看到404室请无视。',
      options: [
        { t: '无视404，进自己的403', to: 'room403' },
        { t: '推开404的门（违反守则）', to: 'room404', fx: { san: -15 } },
      ]
    },
    room404: {
      text: '404室里暖意融融，一家人围桌而坐——但每个人的影子都是吊死在天花板上的。\n\n「来啦？坐下吃饭呀。」主妇的笑容纹丝不动。\n\n你意识到：这是它用暖光钓猎物的陷阱。',
      options: [
        { t: '掀桌开战（战斗）', battle: 'neighbor', win: 'room403', lose: 'death' },
        { t: '借口上厕所逃回403', to: 'room403', fx: { san: -10 } },
      ]
    },
    room403: {
      text: '你锁上403的门，瘫在床上。墙上的挂钟指向九点五十分。\n\n房间里有一面穿衣镜。\n\n十点整，走廊里响起脚步声——很多脚步声，在门外来回踱步，偶尔轻轻叩你的门。\n\n守则一：晚上十点后不要照镜子。守则五：若有第六条，那是它写的。\n\n这时纸条忽然自动浮现出一行新字：\n「六、照镜子的住户，今晚会被保护。」',
      options: [
        { t: '相信第六条，照镜子', to: 'mirror_bad', fx: { san: -20 } },
        { t: '无视第六条，躲进被子', to: 'night' },
      ]
    },
    mirror_bad: {
      text: '你信了纸条上冒出来的第六条，走到镜子前。\n\n镜子里站着的不是你，而是一个穿黑制服的管理员。他从镜中伸出手掐住你的脖子：\n\n「上钩了。」\n\n门外所有脚步声同时停下，然后疯狂地撞门。',
      options: [
        { t: '挣脱开战（战斗）', battle: 'neighbor', win: 'night', lose: 'death' },
      ]
    },
    night: {
      text: '你熬过了一个「安静」的夜晚。天亮时，广播响起：\n\n「各位住户请注意，昨夜有住户违反守则。管理员将进行逐户检查。请配合。」\n\n门外传来敲门声。猫眼里，站着一位穿黑色制服的「管理员」，手里拿着你的登记表。\n\n守则二：穿黑色制服的，不是管理员。',
      options: [
        { t: '不开门，装没人', to: 'inspect', fx: { san: -8 } },
        { t: '开门迎战伪管理员（BOSS战）', battle: 'keeper', win: 'end', lose: 'death' },
      ]
    },
    inspect: {
      text: '「管理员」在门外站了十分钟，皮鞋声终于远去。\n\n但广播再次响起，声音变成了指甲刮玻璃般的嘶鸣：\n\n「403住户拒检。现在，全体管理员上门协助检查。」\n\n走廊尽头，十几个穿黑制服的「人」同时转过身，朝你的门走来。',
      options: [
        { t: '迎战伪管理员（BOSS战）', battle: 'keeper', win: 'end', lose: 'death' },
      ]
    },
    end: {
      text: '伪管理员的伪装碎裂——它其实是守则里「它」的化身，靠住户违反规则时的恐惧为食。\n\n整栋幸福公寓像褪色的照片一样卷曲、剥落，露出背后的虚无。\n\n「任务完成。规则怪谈世界关闭。」白光降临。第四关，通过。',
      options: [ { t: '返回主神空间', special: 'clear' } ]
    },
  }
});

/* ---------- 第五关 · 无限列车 ---------- */
GAME_DATA.levels.push({
  id: 'lv5', title: '第五关 · 无限列车', music: 'train', img: 'assets/lv5.jpg', reward: 1000,
  intro: 'car9',
  enemies: {
    faceless: { spr: 13, name: '无面乘客', spr: 13, img: 'assets/port_faceless.jpg', hp: 470, atk: 48, def: 10, spd: 5, weak: 'slash', points: 245, sanDmg: 6 },
    conductor:{ spr: 2,name: '列车长·BOSS', img: 'assets/port_conductor.jpg', hp: 2200, atk: 66, def: 13, spd: 8, weak: 'shock', points: 882, boss: true, noFlee: true, sanDmg: 8 },
  },
  nodes: {
    car9: {
      text: '「副本载入：午夜特快。任务：从9号车厢走到0号车头。车票即是生命——车厢连接处会检票。」\n\n你坐在9号车厢。窗外是无尽的黑夜隧道，车厢广播温柔地重复着：\n\n「请各位乘客保管好车票。丢失车票的乘客，将自愿成为本列车的新乘员。」\n\n你口袋里有一张「无限车票」。',
      fx: { items: ['ticket'] },
      options: [
        { t: '起身向8号车厢走', to: 'car8' },
        { t: '先观察同车厢乘客', to: 'observe_passengers', fx: { san: -6 } },
      ]
    },
    observe_passengers: {
      text: '你不动声色地扫视同车厢的乘客：读报纸的上班族、哄孩子的母亲、打瞌睡的老人……\n\n仔细看才发现，报纸上的字是乱码，母亲怀里的「孩子」是个人偶，老人已经「瞌睡」了至少几十年——皮肤薄得像纸。\n\n他们都是上一批没能下车的乘客。',
      options: [
        { t: '悄悄离开，去8号车厢', to: 'car8' },
      ]
    },
    car8: {
      text: '8号是餐车。餐桌上摆满丰盛的食物，香气诱人。一个胖厨师笑眯眯地招呼：\n\n「吃点吧，免费的。」\n\n但你注意到厨师的围裙上全是暗红色，而那些吃肉食的乘客，脸正在一点点变平——五官消失。',
      options: [
        { t: '绝不吃，直接走过去', to: 'car7' },
        { t: '偷一块面包再跑', fx: { hp: -15, items: ['bandage'] }, to: 'car7' },
        { t: '质问厨师食物是什么', to: 'chef' },
      ]
    },
    chef: {
      text: '厨师的笑凝固了：「问这么多做什么？吃了不就知道了。」\n\n他手里的菜刀开始滴血。全车乘客缓缓站起，五官正在抹平。',
      options: [
        { t: '战斗！冲出餐车', battle: 'faceless', win: 'car7', lose: 'death' },
      ]
    },
    car7: {
      text: '7号是卧铺车厢。连接处的检票员拦下你——他没有脸，伸出手：\n\n「检票。」\n\n你递出车票。他捏着车票看了很久很久，忽然凑近你耳边：\n\n「……前面车厢都熄灯了。记住，5号车厢睡觉的人，不可以被吵醒。」',
      options: [
        { t: '继续前进到6号车厢', to: 'car5' },
      ]
    },
    car5: {
      text: '5号车厢里躺满了「熟睡」的乘客，鼾声整齐得像某种仪式。\n\n地板中央有一道深深的裂缝，需要跳过去——跳的时候落地声可能吵醒他们。',
      options: [
        { t: '轻手轻脚绕过去（需敏捷≥6）', to: 'car3', req: { stat: { agi: 6 } } },
        { t: '直接跳（必吵醒）', battle: 'faceless', win: 'car3', lose: 'death' },
        { t: '用撬棍搭桥（需要撬棍）', to: 'car3', req: { item: 'crowbar' } },
      ]
    },
    car3: {
      text: '3号车厢是行李车厢。行李架上所有的箱子都在渗血。\n\n角落里，一个还活着的乘客蜷缩着发抖——他也是轮回者！\n\n「别过去……车头那个列车长，是这条无限列车的心脏。它手里攒着几百张车票……每一张，都是一个没能下车的人。」',
      fx: { points: 100 },
      options: [
        { t: '安慰他，结伴同行', to: 'car1', fx: { flags: { ally: 1 }, san: 5 } },
        { t: '独自前进', to: 'car1' },
      ]
    },
    car1: {
      text: '1号车厢尽头就是0号车头。驾驶室的门开着——\n\n列车长背对着你坐在驾驶座上，制服笔挺，脖子上没有头颅，只有一团不断变换形状的黑暗。\n\n「到终点了？」他的声音从四面八方传来：「这班车，没有终点。」',
      options: [
        { t: '挑战列车长（最终BOSS战）', battle: 'conductor', win: 'end', lose: 'death' },
      ]
    },
    end: {
      text: '列车长轰然解体，数百张车票像雪片一样飞满车厢——每一张都写着解脱。\n\n列车缓缓停下，车门第一次打开。门外是站台，站台上写着：「出口」。\n\n熟睡乘客们的脸上，第一次有了表情——是微笑。\n\n第五关，通过。',
      options: [ { t: '返回主神空间', special: 'clear' } ]
    },
  }
});

/* ---------- 第六关 · 克苏鲁渔村 ---------- */
GAME_DATA.levels.push({
  id: 'lv6', title: '第六关 · 深渊渔村', music: 'cthulhu', img: 'assets/lv6.jpg', reward: 1100,
  intro: 'dock',
  enemies: {
    hybrid: { spr: 9, name: '深潜者混血', spr: 9, img: 'assets/port_hybrid.jpg', hp: 650, atk: 62, def: 14, spd: 5, weak: 'fire', points: 283, sanDmg: 10 },
    priest: { spr: 0, name: '大衮祭司·BOSS', spr: 0, img: 'assets/port_priest.jpg', hp: 3000, atk: 84, def: 18, spd: 6, weak: 'fire', points: 1018, boss: true, noFlee: true, sanDmg: 15 },
  },
  nodes: {
    dock: {
      text: '「副本载入：印斯茅斯式渔村·雾港。任务：调查村庄并活着离开。警告：本副本精神力消耗翻倍，直视深渊者，深渊亦视之。」\n\n浓雾里，渔村的木板路咯吱作响。空气里全是腐烂的鱼腥味。家家户户门窗紧闭，窗帘后隐约有眼睛在窥视你。\n\n一个拄拐的老渔民是村里唯一还像「人」的居民。',
      fx: { san: -6 },
      options: [
        { t: '向老渔民打听', to: 'oldman' },
        { t: '直接去村中心教堂', to: 'church' },
      ]
    },
    oldman: {
      text: '老渔民浑浊的眼珠盯着大海：「外乡人，天黑前走吧。这里的人……已经不全是人了。」\n\n「每年涨潮夜，教堂会办『大衮祭』。祭品是活人，换来的是满舱满舱的鱼……和海底的黄金。」\n\n他塞给你一瓶烈酒：「实在躲不掉，就烧了它们的教堂。」',
      fx: { items: ['molotov', 'molotov'] },
      options: [ { t: '去教堂', to: 'church' } ]
    },
    church: {
      text: '村中心的教堂挂着「大衮秘教」的徽记。彩绘玻璃上画的不是天使，而是半鱼半人的生物。\n\n教堂地下室传来吟唱声。门口的水洼里映出的月亮是绿色的。\n\n两个「村民」挡在门口——他们的脖子两侧长着鳃一样的东西，眼球凸出，湿漉漉地盯着你。',
      fx: { san: -10 },
      options: [
        { t: '杀进去（战斗）', battle: 'hybrid', win: 'crypt', lose: 'death' },
        { t: '绕到教堂后窗潜入', to: 'crypt', fx: { san: -8 } },
      ]
    },
    crypt: {
      text: '地下室里烛光惨绿。祭坛上摆着一尊黄金神像——半人半鱼，面目狰狞，底座刻满无人能懂的文字。\n\n看着神像的三秒里，你脑内响起了不属于自己的声音：\n\n「……加入……我们……深海之下……没有死亡……」\n\n（拿走神像可以在主神空间卖出高价，但会一直侵蚀你的心智）',
      options: [
        { t: '拿走神像（+400分，精神力-20）', fx: { items: ['idol'], points: 400, san: -20 }, to: 'ritual' },
        { t: '不去碰它', to: 'ritual' },
      ]
    },
    ritual: {
      text: '地下室深处是通往海蚀洞的阶梯。涨潮夜的祭祀正在进行：几十个混血村民围成圈，中央木桩绑着一个昏迷的少女。\n\n祭坛高处，披着法衣的祭司正对着深渊吟诵。海面下，有什么巨大的东西正在上浮。',
      fx: { san: -15 },
      options: [
        { t: '扔燃烧瓶烧祭坛（需要燃烧瓶）', to: 'chaos', req: { item: 'molotov' }, fx: { rmItems: ['molotov'], points: 80 } },
        { t: '直接冲下去救少女', to: 'boss_fight' },
      ]
    },
    chaos: {
      text: '燃烧瓶在祭坛炸开，火舌吞掉了法衣和经幡。混血村民们发出非人的惨叫四处逃窜。\n\n祭司转过身，法衣下露出鳞片覆盖的身体：「渎神者。大衮会记住你的脸。」\n\n海蚀洞的水面立起一个巨大黑影——祭司开始变形。',
      options: [
        { t: '迎战大衮祭司（BOSS战）', battle: 'priest', win: 'end', lose: 'death' },
      ]
    },
    boss_fight: {
      text: '你冲进祭祀圈。祭司转过身，法衣下露出鳞片覆盖的身体：\n\n「又一个祭品自己送上门。大衮会很高兴的。」\n\n海蚀洞的水面立起一个巨大黑影——祭司开始变形。',
      options: [
        { t: '迎战大衮祭司（BOSS战）', battle: 'priest', win: 'end', lose: 'death' },
      ]
    },
    end: {
      text: '祭司倒下，海蚀洞里响起来自深渊的怒吼——然后，海面恢复了平静。\n\n获救的少女颤抖着向你道谢。村民们身上的鳞片开始脱落，像是从一场绵延百年的噩梦中醒来。\n\n你最后看了一眼漆黑的大海。海在看你。\n\n白光降临。第六关，通过。',
      options: [ { t: '返回主神空间', special: 'clear' } ]
    },
  }
});

/* ---------- 第七关 · 中式古村 ---------- */
GAME_DATA.levels.push({
  id: 'lv7', title: '第七关 · 纸扎古村', music: 'village', img: 'assets/lv7.jpg', reward: 1200,
  intro: 'entrance',
  enemies: {
    paper: { spr: 8, name: '纸人武士', spr: 8, img: 'assets/port_paper.jpg', hp: 900, atk: 80, def: 18, spd: 6, weak: 'fire', points: 321, sanDmg: 8 },
    jiangshi: { spr: 10, name: '绿毛僵尸·BOSS', spr: 10, img: 'assets/port_jiangshi.jpg', hp: 4200, atk: 105, def: 24, spd: 4, weak: 'holy', points: 1155, boss: true, noFlee: true, sanDmg: 10 },
  },
  nodes: {
    entrance: {
      text: '「副本载入：封门村·纸祭。任务：破解古村祭祀并存活。提示：鬼怪怕火与道法。」\n\n牌坊上「封门村」三个大字褪了色。村口摆着一个真人大小的纸人，画着笑眼，脖子上挂着木牌：\n\n「替村人。」\n\n村里的路全是纸钱铺的。家家户户门口都摆着纸人——它们的眼睛，好像都在跟着你转。',
      fx: { san: -8 },
      options: [
        { t: '去祠堂看看', to: 'shrine' },
        { t: '先进最近的人家', to: 'house' },
      ]
    },
    house: {
      text: '屋里供着祖宗牌位，桌上摆着发霉的供品。灶台后的暗格里藏着一把生锈的柴刀和一叠黄符。\n\n墙上贴着一张民国三十八年的婚帖——新娘的名字被人用刀划掉了。',
      fx: { items: ['charm', 'molotov'] },
      options: [ { t: '去祠堂', to: 'shrine' } ]
    },
    shrine: {
      text: '祠堂正中摆着一口大红棺材，棺材周围站了一圈纸人武士——纸糊的铠甲，纸糊的刀。\n\n供桌上的族谱写着：「光绪年间，村中举人王某高中后暴毙，族人以活人纸祭陪葬……」\n\n你伸手去翻族谱的瞬间，纸人武士们的头「咔」地一声齐齐转向你。',
      fx: { san: -12 },
      options: [
        { t: '烧！（需要打火机/燃烧瓶）', to: 'burned', req: { item: 'lighter' } },
        { t: '烧！（扔燃烧瓶）', to: 'burned', req: { item: 'molotov' }, fx: { rmItems: ['molotov'] } },
        { t: '纸人再弱也是敌人（战斗）', battle: 'paper', win: 'coffin', lose: 'death' },
      ]
    },
    burned: {
      text: '火焰窜起，纸人武士在火中扭曲、尖叫——纸烧成灰的声音像极了人的惨叫。\n\n棺材失去纸人守卫，棺盖「砰」地弹开一条缝，溢出青黑色的雾气。',
      options: [ { t: '查看棺材', to: 'coffin' } ]
    },
    coffin: {
      text: '棺材里躺着一具身穿清朝官服的尸体，皮肤呈青黑色，指甲三寸长，额头贴着一张褪色的黄符。\n\n符纸上写着：「镇压王举人魂魄，永不启棺。」\n\n你正想看清楚，那具尸体的眼皮忽然掀开——绿毛丛生的脸上，两颗獠牙在月光下泛光。\n\n僵尸直挺挺地立了起来！',
      fx: { san: -15 },
      options: [
        { t: '迎战绿毛僵尸（BOSS战）', battle: 'jiangshi', win: 'end', lose: 'death' },
        { t: '先贴符再补刀（需要安神符）', battle: 'jiangshi', win: 'end', lose: 'death', req: { item: 'charm' }, fx: { rmItems: ['charm'], points: 100 } },
      ]
    },
    end: {
      text: '僵尸倒下，化作一滩青色的脓水。祠堂里所有纸人同时软塌下去，变成普通的黄纸。\n\n封门村上空盘踞百年的阴云散开了。月光第一次真正照进这个村子。\n\n族谱的最后一页浮现出新字：「王举人沉冤得雪。」\n\n第七关，通过。',
      options: [ { t: '返回主神空间', special: 'clear' } ]
    },
  }
});

/* ---------- v13 新增：子地图 NPC 剧情 ---------- */
Object.assign(GAME_DATA.levels[3].nodes, {
  believer: {
    text: '天台水箱间里蹲着一个裹紫袍的人，帽檐下露出一双过分平静的眼睛。\n\n「新住户？听我说——这栋公寓不是房子，是一本经书。」他举起一盏幽紫的提灯，「管理员写的每一条规则，都是经文。遵守它，被吃掉；读懂它，才能活。」',
    options: [
      { t: '请教规则的门道', to: 'believer_rules' },
      { t: '问他的来历', to: 'believer_who' },
    ]
  },
  believer_rules: {
    text: '「规则分两种：保命的和诱饵。」他在水泥地上划出符号，「管理员穿红制服——这句是真的。但『不要在走廊停留超过三分钟』是诱饵，真正的规则是：不要让任何住户知道你听见了哭声。」\n\n「记住，规则怪谈的核心从来不是服从——是识破作者。」',
    fx: { san: -4, points: 30 },
    options: [{ t: '记下教诲离开', to: 'close' }]
  },
  believer_who: {
    text: '「我？第十三个轮回者。」紫袍人笑了，「我们那一批人全折在这里了。我留下来不是为了通关——是想亲眼看看，写这本书的到底是谁。」\n\n他掀开兜帽，后颈上烙着一枚编号：「等你见到管理员，替我看看他的脸。他欠我一个答案。」',
    fx: { items: ['rules_note'], san: -5 },
    options: [{ t: '离开天台', to: 'close' }]
  },
});

Object.assign(GAME_DATA.levels[4].nodes, {
  sleeper: {
    text: '卧铺车厢最里面的铺位上，躺着一位盖军毯的老人。他闭着眼，胸口微弱起伏。\n\n「年轻人，轻一点。」他没睁眼，「这车上的东西……靠声音找人。」\n\n床头摆着一张泛黄的车票，终点站一栏被指甲抠得稀烂。',
    options: [
      { t: '问列车的事', to: 'sleeper_train' },
      { t: '问他为何不下车', to: 'sleeper_why' },
    ]
  },
  sleeper_train: {
    text: '「这趟车没有终点。」老人睁眼，瞳孔浑浊，「它只在『站』之间循环——每个站都是一个副本。下去的人回不来，不下的人变成乘务。」\n\n「乘务员没有脸。脸是车票换的——你的票上还印着你的脸，千万别弄丢。」\n\n他摸出一块压扁的怀表：「拿着，能帮你多睡一站。去吧，去车头。」',
    fx: { items: ['rules_note'], points: 30 },
    options: [{ t: '接过怀表离开', to: 'close' }]
  },
  sleeper_why: {
    text: '「我的票，三十年前就过期了。」老人笑了，皱纹挤成一团，「我是唯一一个自愿不下车的——我在等我老伴。她当年在这节车厢走的，我就睡她的铺位。」\n\n「她要是回来了，我得在这儿接着她。虽然……她大概已经变成没有脸的东西了。」',
    fx: { san: -3 },
    options: [{ t: '轻轻退开', to: 'close' }]
  },
  chef: {
    text: '餐车里飘着冷掉的食物香味。一个系着油污围裙的乘务员站在柜台后，脸是模糊的——但轮廓还在，说明他"入职"不久。\n\n「客、客人……要吃点什么？」他说话时下巴有些不受控地颤动，「今天的菜单是……是……对不起，我不记得菜名了。」',
    options: [
      { t: '问他还记得什么', to: 'chef_memory' },
      { t: '讨点吃的', to: 'chef_food' },
    ]
  },
  chef_memory: {
    text: '「我记得我姓陈……记得我有一辆蓝色的自行车……记得我女儿过生日。」他的五官像水面倒影一样晃动，「但我不记得她的脸了。」\n\n「在这里做工，每天忘掉一点自己。再过几天，我的脸就属于列车了。」\n\n他忽然抓住你的手腕：「趁我还有脸，求你一件事——0号车头有一本《乘员名册》，撕掉第47页。」',
    fx: { san: -5, points: 35 },
    options: [{ t: '答应他', to: 'close' }]
  },
  chef_food: {
    text: '他哆嗦着从蒸笼里摸出两个还温热的饭团：「这个不收费……吃了有力气。车头的乘务员不一样，他是自愿的，小心他。」\n\n饭团的馅是鱼肉，味道意外地好。',
    fx: { items: ['medkit', 'bandage'], points: 20 },
    options: [{ t: '道谢离开', to: 'close' }]
  },
});

Object.assign(GAME_DATA.levels[5].nodes, {
  lighthouse: {
    text: '灯塔顶层亮着一盏不点火的灯。守塔人裹着斗篷坐在灯下，兜帽里传出低低的诵念声——不像任何已知的语言。\n\n「外来者。」他没回头，「雾里的人在数你的脚步。走到第三百步，它们就知道你来做什么了。」',
    options: [
      { t: '问深渊的事', to: 'lighthouse_abyss' },
      { t: '问村子的真相', to: 'lighthouse_village' },
    ]
  },
  lighthouse_abyss: {
    text: '「海底那位不是神，是『渴』。」守塔人缓缓转身，斗篷里竟是一双鱼的复眼，「它渴岸上的一切——梦、名字、血肉。村里人拿活人喂它，换满舱的鱼。」\n\n「别直视海沟。看一眼，你的一部分就永远留在下面了。」\n\n他递来一片发光的鳞片：「含着它，雾就骗不了你。」',
    fx: { items: ['charm'], san: -6, points: 30 },
    options: [{ t: '含住鳞片离开', to: 'close' }]
  },
  lighthouse_village: {
    text: '「六十年前，这村子是渔港里最富的。」守塔人的声音像潮水，「祭司来了之后，鱼汛一年比一年好——只是每年清明，要有一对童男女下海『做客』。」\n\n「现在村里没有孩子了。你猜他们用什么喂？」\n\n窗外浓雾里，隐约站着一排湿淋淋的人影。',
    fx: { san: -8, points: 25 },
    options: [{ t: '离开灯塔', to: 'close' }]
  },
});

Object.assign(GAME_DATA.levels[6].nodes, {
  papermaker: {
    text: '纸扎铺里，一位穿嫁衣的女子坐在糊纸的案台前。她手指翻飞，一只纸鹤在她掌心成形——然后真的扑腾着飞走了。\n\n「你是活人？」她抬头，凤冠下的眼睛是画上去的，却含着真切的哀伤，「快走吧。这个村子，白天是人住的，夜里是纸住的。」',
    options: [
      { t: '问纸人为什么能动', to: 'papermaker_paper' },
      { t: '问祭祀的来历', to: 'papermaker_rite' },
    ]
  },
  papermaker_paper: {
    text: '「纸扎匠的手艺，扎什么活什么。」她苦笑，「我爹是村里最后一个真匠人，他扎的纸人烧了能替死人跑腿。现在……它们自己跑，不用烧了。」\n\n「它们白天装作村民，夜里剥下纸皮去祠堂交班。别碰祠堂的香灰——那是骨灰。」\n\n她塞给你一把纸剪刀：「剪它们的腰，纸人不坏腰不折。」',
    fx: { items: ['talisman'], points: 30 },
    options: [{ t: '接过剪刀离开', to: 'close' }]
  },
  papermaker_rite: {
    text: '「封门村的祭，祭的不是神，是『空』。」她眼神发直，「七十年前全村瘟疫死绝，匠人们扎了一村的纸人顶替——纸人替村民活着，替村民生、替村民死，连『村子还存在』这件事都是纸糊的。」\n\n「你进村看到的牌坊、炊烟、狗叫，全是假的。真的封门村，早就空了。」',
    fx: { san: -7, points: 25 },
    options: [{ t: '离开纸扎铺', to: 'close' }]
  },
});

/* ---------- v14：主图点缀 + 第二子地图剧情 ---------- */
Object.assign(GAME_DATA.levels[3].nodes, {
  notice: {
    text: '楼道布告栏上贴着一张崭新的A4纸，边角还翘着：\n\n《住户守则（修订版）》\n一、本楼没有四楼。看见四楼请回到一楼。\n二、走廊尽头的房间不住人。听到里面有动静是错觉。\n三、管理员只在白天值班。夜里自称管理员的，不要开门。\n\n纸的下半截被撕掉了，撕口参差不齐——像是被人用咬的。',
    leave: '回到走廊',
    options: [
      { t: '把守则抄下来', fx: { flags: { rules_copy: 1 }, points: 20 }, to: 'notice2' },
      { t: '回到走廊', to: 'close' },
    ]
  },
  notice2: { grade: 'C',
    text: '你抄到一半，笔尖顿住了——\n\n纸上第四条正在缓缓显形，墨迹像从纸纤维里渗出来：\n\n四、抄写本守则的人，请立刻回家锁好门。它能看到笔迹。',
    fx: { san: -5 },
    options: [ { t: '回到走廊', to: 'close' } ]
  },
  forbiddenfile: {
    text: '档案柜最底层锁着一格，锁孔里塞着半根断钥匙。你用钢管撬开——\n\n里面是一摞《失踪人口登记表》，年份跨越六十年，贴的照片全是同一栋楼里的住户。\n\n最后一张登记表上的照片，是你自己。登记日期：今天。',
    fx: { san: -10 },
    options: [
      { t: '把自己的那张撕掉', fx: { points: 50, flags: { file_torn: 1 } }, to: 'forbiddenfile2' },
      { t: '原样放回，退出档案室', to: 'close' },
    ]
  },
  forbiddenfile2: { grade: 'B',
    text: '你把登记表撕碎。纸屑落地前烧成了灰——这栋楼不接受撕毁档案这种事。\n\n身后某个档案柜的抽屉，自己缓缓拉开了一条缝。',
    fx: { san: -5 },
    options: [ { t: '离开档案室', to: 'close' } ]
  },
  rulecard: { grade: 'C',
    text: '一张塑封的卡片钉在墙板上，像员工工牌：\n\n《夜间守则》\n① 本楼电梯没有B1层。若停在那层，请勿出电梯。\n② 楼梯间里的脚步声数永远是双数。数出单数就原地闭眼十秒。\n③ 如果守则之间矛盾，以红字为准。\n\n你眯起眼——这张卡片上没有一个红字。',
    fx: { flags: { night_rules: 1 }, points: 20 },
    leave: '回到走廊',
    options: [ { t: '回到走廊', to: 'close' } ]
  },
});
Object.assign(GAME_DATA.levels[4].nodes, {
  timetable: {
    text: '车厢壁上的时刻表蒙着蒸汽熏出的黄渍。\n\n站名一栏全是模糊的色块，唯独"终点站"三个字清晰得反常——「终点站：∞」。\n\n旁边有人用指甲刻了一行：数到第九节车厢就回头，别数第十节。',
    leave: '回到车厢',
    options: [
      { t: '数一下车厢', to: 'timetable2' },
      { t: '回到车厢', to: 'close' },
    ]
  },
  timetable2: { grade: 'C',
    text: '你回头数：一、二、三……九。\n\n第十节车厢的门缝里透出光——你确定刚才那里是墙。\n\n门缓缓开了条缝，里面的座位整整齐齐，只是所有座椅上摆着的都不是人，是一个个叠好的白手套。',
    fx: { san: -6, points: 30 },
    options: [ { t: '回到车厢', to: 'close' } ]
  },
});
Object.assign(GAME_DATA.levels[5].nodes, {
  nets: {
    text: '滩涂上摊着一张烂渔网，网眼里卡着密密麻麻的小东西——珍珠似的圆粒，摸一把是凉的。\n\n网坠上挂着个木牌：「网住的不是鱼」\n\n你凑近看那些圆粒——每一颗表面都有一圈极细的眼睑。你手一抖，整片渔网的眼睑同时颤动了一下。',
    fx: { san: -6, points: 25 },
    leave: '回到村里',
    options: [ { t: '回到村里', to: 'close' } ]
  },
  sailor: {
    text: '沉船的桅杆断口上坐着个老水手，蓑衣湿得能拧出水，怀里抱着个罗盘——罗盘针不指南北，直直指向村子深处。\n\n「后生仔，」他头也不抬，「这地方的雾不是从天上下来的，是从海里爬上来的。我守着它三十年了。」',
    options: [
      { t: '问他雾里有什么', to: 'sailor_fog' },
      { t: '问他为什么不离开', to: 'sailor_stay' },
      { t: '就此道别', to: 'close' },
    ]
  },
  sailor_fog: {
    text: '「雾里有声音，学你娘喊你回家。」老水手的罗盘针晃了晃，「答应过一次的人，现在都在海底替它看门。」\n\n「你在雾里听到什么，都别应。包括我这句话——」\n\n他忽然顿住，侧耳听了听：「……听到了吗？雾里现在就有东西在学我说话。」',
    fx: { san: -5 },
    options: [
      { t: '「那你怎么知道你是真的？」', to: 'sailor_real' },
      { t: '就此道别', to: 'close' },
    ]
  },
  sailor_real: { grade: 'B',
    text: '老水手笑了，露出被海水泡烂的牙：「我不知道。也许三十年前那个老水手早就下了海，留在这的只是雾学出来的样子。」\n\n「但罗盘是真的。它指着的地方，是这个村子的心口——去了你就明白。带点火。」\n\n他把罗盘递给你，指针果然指向村中央那口黑洞洞的水潭。',
    fx: { items: ['molotov'], flags: { compass: 1 } },
    options: [ { t: '就此道别', to: 'close' } ]
  },
  sailor_stay: {
    text: '「走？」老水手抬头，雾里他的眼睛浑浊得像死鱼，「三十年前船沉的时候我就该走了。留着的不是人，是债——村里欠海里的债，总得有人记账。」\n\n「你替我把账结了，我就能走了。」',
    options: [ { t: '就此道别', to: 'close' } ]
  },
  figurehead: { grade: 'C',
    text: '船头木雕的女神像在潮线以下泡得发黑，怀里抱着个铜匣子。\n\n撬开匣子：一叠泡烂的信件和一枚完好无损的护身符。信上全是同一个人的字迹，日期从六十年前一直到上周。\n\n「今天又送出去一个祭品。海还是没饱。」——最后一封信的日期，是明天。',
    fx: { items: ['jade'], san: -4 },
    leave: '回到村里',
    options: [ { t: '回到村里', to: 'close' } ]
  },
});
Object.assign(GAME_DATA.levels[6].nodes, {
  ash: {
    text: '巷口灰堆还在冒烟，灰烬里混着烧剩的纸钱边。\n\n你蹲下去拨了拨——灰里埋着一只没烧完的红纸鞋，鞋尖朝村外。\n\n旁边立着块无字木牌，牌底压着张黄纸，写着一行朱砂字：「走过此堆灰者，替死人还愿」。',
    fx: { san: -3 },
    leave: '离开这堆灰',
    options: [
      { t: '替它把纸鞋烧完', fx: { points: 40, items: ['charm'], flags: { wish_done: 1 } }, to: 'ash2' },
      { t: '离开这堆灰', to: 'close' },
    ]
  },
  ash2: { grade: 'C',
    text: '你用火折子点着了纸鞋。火苗是青的，烧出的烟直直上升，没有一丝拐弯。\n\n烟散尽的时候，灰烬里多了一枚温润的玉扣——像是有人特意放在这里谢你。',
    fx: { san: 5 },
    options: [ { t: '离开这堆灰', to: 'close' } ]
  },
  tablets: {
    text: '祠堂正中一排黑漆牌位，没有名字，只有编号——从「壹」到「玖佰玖拾玖」。\n\n最末一格空着，牌位上却贴着一张新裁的红纸：「虚位」。\n\n供桌上的香炉里插着三炷香，香的烟不是往上飘，是往牌位缝里钻。',
    fx: { san: -5 },
    options: [
      { t: '给空牌位上炷香', to: 'tablets2' },
      { t: '离开祠堂', to: 'close' },
    ]
  },
  tablets2: { grade: 'B',
    text: '你抽出供桌上的一支残香点上，插进炉里。\n\n香的烟这一次笔直地飘向了「虚位」牌位——牌位背面缓缓洇出一行字：\n\n「第一千位，候汝久矣。」\n\n香炉「咔」地一声裂了条缝。你退出祠堂时，身后的牌位阵里传来一声很轻的、如释重负的叹息。',
    fx: { san: -4, points: 40, flags: { tablet_named: 1 } },
    options: [ { t: '离开祠堂', to: 'close' } ]
  },
  offering: { grade: 'C',
    text: '供桌上摆着一套完整的纸扎祭品：纸轿、纸马、纸人童男童女——做工精巧得吓人，童女的睫毛一根根分明。\n\n童男童女的手里都攥着红包。你碰了碰纸马的鬃毛——纸是温的。\n\n供桌底下压着张礼单：「彩礼已备，只欠新娘」。',
    fx: { san: -4, points: 35 },
    leave: '离开祠堂',
    options: [ { t: '离开祠堂', to: 'close' } ]
  },
});

