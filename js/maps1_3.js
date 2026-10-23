
/* ========== 第1~3关：丧尸围城 / 异形巢穴 / 鬼怪凶宅 ========== */

/* ---------- 第一关 · 丧尸围城 ---------- */
GAME_DATA.levels.push({
  id: 'lv1', title: '第一关 · 丧尸围城', music: 'zombie', img: 'assets/lv1.jpg', reward: 500,
  intro: 'start',
  enemies: {
    zombie:  { spr: 10,name: '腐烂丧尸', img: 'assets/port_zombie.jpg', hp: 95, atk: 13, def: 1, spd: 1, weak: 'slash', points: 93 },
    dogs:    { spr: 1,name: '丧尸犬群', img: 'assets/port_zombie.jpg', hp: 95, atk: 13, def: 1, spd: 6, weak: 'shot', points: 93 },
    butcher: { spr: 11, name: '屠夫丧尸·BOSS', spr: 11, img: 'assets/port_butcher.jpg', hp: 400, atk: 20, def: 2, spd: 3, weak: 'fire', points: 334, boss: true, noFlee: true },
  },
  nodes: {
    start: {
      text: '头痛欲裂。你在一堆瓦砾中醒来，天空是铅灰色的。\n\n脑海里响起冰冷的机械音：\n「欢迎进入无限轮回。当前世界：T病毒泄露后的浣熊市郊外。任务：活到城市另一端的撤离点。」\n\n远处传来零星的嘶吼声。街道上浓烟滚滚，一具穿着警服的尸体趴在不远处。',
      options: [
        { t: '搜查警察尸体', to: 'corpse' },
        { t: '顺着求救声摸过去', to: 'girl' },
        { t: '先观察周围地形', to: 'observe', fx: { san: -3 } },
      ]
    },
    observe: {
      text: '你爬到一辆翻倒的巴士车顶眺望：城市大半已经沦陷，撤离点在东侧的医院天台。最近的路要穿过一条满是残骸的商业街。\n\n街角的便利店里隐约能看到货架上还有物资。',
      options: [
        { t: '去便利店搜刮物资', to: 'store' },
        { t: '直接去商业街', to: 'street' },
      ]
    },
    corpse: {
      text: '尸体已经凉透了。你在他腰间摸到一根撬棍和半盒子弹，腰间的对讲机突然响起杂音：\n\n「……幸存者请前往……市立医院天台……直升机……最后一批……」\n\n话音未落，巷口传来拖沓的脚步声——三只丧尸闻到了活人味。',
      fx: { items: ['crowbar', 'bandage'], points: 30 },
      options: [
        { t: '迎战丧尸（战斗）', battle: 'zombie', win: 'after_fight', lose: 'death' },
        { t: '转身逃跑', to: 'store', fx: { hp: -8 } },
      ]
    },
    after_fight: {
      text: '丧尸倒下了，腐臭的黑血溅了你一身。你从其中一只的口袋里摸出一把开山刀——刀刃还沾着干涸的血迹。\n\n现在可以去便利店补充物资，或者直接往医院方向走。',
      fx: { items: ['machete'] },
      options: [
        { t: '去便利店搜刮', to: 'store' },
        { t: '直接前往商业街', to: 'street' },
      ]
    },
    store: {
      text: '便利店里一片狼藉。你飞快地把绷带、罐头和一个打火机塞进背包。\n\n突然，货架后面窜出两条皮毛烂光的丧尸犬，獠牙上挂着碎肉。',
      fx: { items: ['bandage', 'medkit', 'lighter', 'molotov'], points: 40 },
      options: [
        { t: '和丧尸犬拼了（战斗）', battle: 'dogs', win: 'girl', lose: 'death' },
      ]
    },
    girl: {
      text: '求救声来自一辆侧翻的校车。一个穿校服的女孩被卡在车窗里，车外三只丧尸正在抓挠车门。\n\n女孩看到你，哭喊着伸出手。',
      options: [
        { t: '冲上去救她（战斗）', battle: 'zombie', win: 'saved_girl', lose: 'death' },
        { t: '装作没看见，继续前进', to: 'street', fx: { san: -10 } },
      ]
    },
    saved_girl: {
      text: '你把女孩从车里拽了出来。她哭着说：「我叫小雨，我爸爸在医院工作……求你带我去找他！」\n\n她从怀里掏出一枚护身玉佩塞给你：「妈妈给我的，能保平安。」\n\n（带着她，撤离时或许有变数。）',
      fx: { items: ['charm'], flags: { with_girl: 1 }, points: 50 },
      options: [ { t: '带着小雨穿过商业街', to: 'street' } ]
    },
    street: {
      text: '商业街宛如地狱：烧焦的汽车、散落的行李箱、墙上喷溅的血手印。\n\n街中央，上百只丧尸正漫无目的地游荡。硬闯等于送死。你注意到旁边的居民楼——或许可以翻墙绕过去。',
      options: [
        { t: '翻墙绕行（需要撬棍）', to: 'roof_path', req: { item: 'crowbar' } },
        { t: '翻墙绕行（徒手攀爬）', to: 'roof_path', fx: { hp: -15 } },
        { t: '点燃烧瓶引开尸群硬闯', battle: 'zombie', win: 'roof_path', lose: 'death', req: { item: 'molotov' } },
        { t: '硬闯尸群（危险！）', battle: 'zombie', win: 'roof_path', lose: 'death', fx: { hp: -20 } },
      ]
    },
    roof_path: {
      text: '你从居民楼顶一路跳到医院大楼。天台上果然停着一架救援直升机——\n\n但机舱门口蹲着一个三米高的怪物：穿着染血屠围裙的巨型丧尸，手里拖着一把剁骨刀。\n\n它听见动静，缓缓转过头来。',
      options: [
        { t: '决一死战（BOSS战）', battle: 'butcher', win: 'end', lose: 'death' },
        { t: '先搜天台找重火力', to: 'roof_loot' },
      ]
    },
    roof_loot: {
      text: '你在直升机残骸里翻出一把霰弹枪和两枚手雷！天助你也。\n\n屠夫丧尸已经拖着刀向你走来，地面都在震。',
      fx: { items: ['shotgun', 'grenade', 'grenade'] },
      options: [
        { t: '开火！（BOSS战）', battle: 'butcher', win: 'end', lose: 'death' },
      ]
    },
    end: {
      text: '屠夫丧尸轰然倒地。直升机的螺旋桨开始转动——\n\n但你脚下的世界忽然像玻璃一样碎裂、褪色。机械音再次响起：\n\n「任务完成。奖励结算中……即将返回主神空间。」\n\n白光吞没了你。第一关，通过。',
      options: [ { t: '返回主神空间', special: 'clear' } ]
    },
  }
});

/* ---------- 第二关 · 异形巢穴 ---------- */
GAME_DATA.levels.push({
  id: 'lv2', title: '第二关 · 异形巢穴', music: 'alien', img: 'assets/lv2.jpg', reward: 650,
  intro: 'pod',
  enemies: {
    hugger: { spr: 9, name: '抱脸虫', spr: 9, img: 'assets/port_hugger.jpg', hp: 150, atk: 19, def: 3, spd: 7, weak: 'fire', points: 131, sanDmg: 8 },
    drone:  { spr: 9,name: '工蜂异形', img: 'assets/port_hugger.jpg', hp: 150, atk: 19, def: 3, spd: 6, weak: 'fire', points: 131, sanDmg: 4 },
    queen:  { spr: 15,name: '异形女王·BOSS', img: 'assets/port_queen.jpg', hp: 640, atk: 28, def: 5, spd: 5, weak: 'fire', points: 471, boss: true, noFlee: true, sanDmg: 6 },
  },
  nodes: {
    pod: {
      text: '冰冷的气体喷在你脸上。你从冬眠舱里坐起来，四周是幽蓝的应急灯。\n\n「副本载入：诺史莫级货运船。任务：抵达尾部逃生舱。警告：本副本存在高威胁生物。」\n\n整艘船寂静得可怕。冬眠室里其他舱位全是空的——舱盖内侧全是抓痕。',
      fx: { san: -5 },
      options: [
        { t: '搜查冬眠室储物柜', to: 'locker' },
        { t: '直接去走廊', to: 'corridor' },
      ]
    },
    locker: {
      text: '储物柜里有一件防化服、一支手电筒和一张皱巴巴的船员字条：\n\n「它们怕火。千万别进通风管道。如果你看到卵，跑，别回头。」\n\n字条背面沾着某种黏液，还在微微蠕动。',
      fx: { items: ['flash', 'hazmat'], san: -5 },
      options: [ { t: '装备好，去走廊', to: 'corridor' } ]
    },
    corridor: {
      text: '走廊的金属墙壁上挂着大片黑色生物质，像血管一样微微搏动。\n\n头顶的通风口传来「沙沙」的爬行声。前方有两条路：左侧通往舰桥，右侧通往实验室，墙上的血迹一路拖到实验室方向。',
      options: [
        { t: '去舰桥查航行日志', to: 'bridge' },
        { t: '沿血迹去实验室', to: 'lab' },
      ]
    },
    bridge: {
      text: '舰桥的屏幕上还循环播放着船长的遗言影像：\n\n「我们带回了不该带回的东西……它们在船里繁殖……上帝保佑我们所有人。」\n\n你在武器柜里找到一把消防斧。正准备离开时，天花板上的生物质裂开——一只抱脸虫直直扑向你的脸！',
      fx: { items: ['fireaxe'], san: -8 },
      options: [
        { t: '挥斧格挡（战斗）', battle: 'hugger', win: 'after_hugger', lose: 'death' },
      ]
    },
    after_hugger: {
      text: '抱脸虫被劈成两半，酸血溅在地板上嘶嘶作响，蚀出一个个冒烟的坑。\n\n你喘着粗气意识到：在这种地方被寄生，比死更可怕。',
      fx: { san: -6 },
      options: [ { t: '前往实验室', to: 'lab' } ]
    },
    lab: {
      text: '实验室里全是破裂的培养舱。最里面的手术台上，一具尸体胸口破了个大洞——有什么东西从他体内钻了出来。\n\n桌上的研究日志写着：「幼体进入宿主后约4小时破体。唯一的希望是船尾的逃生舱。」\n\n阴影中，一只两米高的黑色异形缓缓立起，内槽牙滴着口水。',
      fx: { san: -10 },
      options: [
        { t: '硬拼（战斗）', battle: 'drone', win: 'after_drone', lose: 'death' },
        { t: '钻进通风管绕道（需要手电筒）', to: 'vent', req: { item: 'flash' } },
        { t: '钻通风管摸黑爬（极险）', to: 'vent', fx: { san: -12 } },
      ]
    },
    vent: {
      text: '通风管狭窄黑暗，手电筒的光柱只能照亮几米。身后传来利爪刮擦金属的声音——它进来了。\n\n你拼命往前爬，管壁尽头透出一丝绿光：是逃生舱舱门。你几乎是滚着摔出去的。',
      fx: { hp: -10 },
      options: [ { t: '进入逃生舱区', to: 'nest' } ]
    },
    after_drone: {
      text: '工蜂异形倒下了。你看着它被斧刃劈开的头颅——里面的酸血把地板蚀穿了一整层。\n\n船尾方向传来沉重的拖拽声和黏液滴落声。逃生舱应该就在那边……但恐怕有什么东西比你先到。',
      options: [ { t: '向船尾逃生舱前进', to: 'nest' } ]
    },
    nest: {
      text: '逃生舱区已经完全变成了巢穴：墙壁上全是黑色的卵，像心脏一样搏动。\n\n而在卵群的中央，一个五米高的巨大身影盘踞在那里——异形女王，甲壳如黑曜石，头顶的冠饰如同王座。\n\n它身后三米，就是逃生舱的舱门。没有别的路。',
      fx: { san: -15 },
      options: [
        { t: '挑战异形女王（最终BOSS战）', battle: 'queen', win: 'end', lose: 'death' },
        { t: '先用燃烧瓶烧掉卵群激怒它', fx: { rmItems: ['molotov'], points: 50 }, battle: 'queen', win: 'end', lose: 'death', req: { item: 'molotov' } },
      ]
    },
    end: {
      text: '女王发出震耳欲聋的嘶鸣，庞大的身躯缓缓倒下，把巢穴的卵群压成一片浆糊。\n\n你摔进逃生舱，拉下弹射杆。小型舱体从船体分离的那一刻，身后的货运船炸成一团静默的烟花。\n\n白光降临。第二关，通过。',
      options: [ { t: '返回主神空间', special: 'clear' } ]
    },
  }
});

/* ---------- 第三关 · 鬼怪凶宅 ---------- */
GAME_DATA.levels.push({
  id: 'lv3', title: '第三关 · 鬼怪凶宅', music: 'ghost', img: 'assets/lv3.jpg', reward: 800,
  intro: 'gate',
  enemies: {
    doll:   { spr: 8,name: '怨灵人偶', img: 'assets/port_doll.jpg', hp: 220, atk: 25, def: 4, spd: 4, weak: 'holy', points: 169, sanDmg: 10 },
    revenant:{ spr: 14,name: '镜中怨灵', img: 'assets/port_doll.jpg', hp: 220, atk: 25, def: 4, spd: 6, weak: 'holy', points: 169, sanDmg: 12 },
    lady:   { spr: 14,name: '红衣女鬼·BOSS', img: 'assets/port_lady.jpg', hp: 950, atk: 36, def: 6, spd: 6, weak: 'holy', points: 608, boss: true, noFlee: true, sanDmg: 10 },
  },
  nodes: {
    gate: {
      text: '暴雨之夜。你站在一座民国时期的老宅前，门口的纸灯笼无风自动。\n\n「副本载入：槐安巷凶宅。任务：查明宅中真相并活到天亮。警告：物理攻击对灵体效果低下，请寻找克制手段。」\n\n朱漆大门「吱呀」一声自己开了。屋里点着白蜡烛。',
      fx: { san: -5 },
      options: [
        { t: '进入正厅', to: 'hall' },
        { t: '先绕到后院看看', to: 'yard' },
      ]
    },
    yard: {
      text: '后院有一口枯井和一间上锁的柴房。井边散落着纸钱。\n\n你用尽力气撬开柴房——里面供着一尊蒙尘的神龛，神龛上横放着一把桃木剑和几道黄符。\n\n拿走剑的瞬间，屋里所有的白蜡烛同时熄灭，又重新燃起——火苗变成了幽绿色。',
      fx: { items: ['talisman', 'holywater', 'holywater'], san: -8 },
      options: [ { t: '回正厅', to: 'hall' } ]
    },
    hall: {
      text: '正厅的八仙桌上摆着一副牌位，墨迹未干地写着「沈氏一门」。\n\n墙上的全家福照片里，所有人都没有脸。楼梯口传来小女孩的笑声——这栋宅子里不该有活人。\n\n笑声来自二楼。餐厅方向的碗柜后似乎藏着暗格。',
      options: [
        { t: '上二楼寻找笑声', to: 'bedroom' },
        { t: '搜餐厅暗格', to: 'kitchen' },
      ]
    },
    kitchen: {
      text: '碗柜后面果然有暗格：一本浸了血的日记，和一个贴着封条的木匣。\n\n日记最后一页写着：「小姐是被老爷活埋在后院的……她说她会回来的，穿那件红嫁衣回来……」\n\n你拆开木匣——里面是一把锋利的匕首和一枚护身玉佩。',
      fx: { items: ['diary', 'charm'], flags: { truth: 1 } },
      options: [ { t: '上楼', to: 'bedroom' } ]
    },
    bedroom: {
      text: '二楼卧室的雕花大床上，端坐着一个人偶——惨白的脸，鲜红的嘴唇，眼睛是用墨画上去的。\n\n你盯着它看的第二秒，它的眼睛眨了一下。\n\n它从床上飘了起来！',
      fx: { san: -12 },
      options: [
        { t: '用桃木剑迎战（战斗）', battle: 'doll', win: 'mirror', lose: 'death' },
        { t: '逃跑（物理难伤灵体）', to: 'mirror', fx: { hp: -15 } },
      ]
    },
    mirror: {
      text: '卧室的穿衣镜蒙着黑布。你不小心扯下了布——\n\n镜子里没有你的倒影，只有一个穿红嫁衣的女人，背对着你站在镜中的房间里。\n\n她缓缓回头。镜面裂开，无数只手从裂缝里伸出来抓你。',
      fx: { san: -15 },
      options: [
        { t: '砸碎镜子（战斗）', battle: 'revenant', win: 'basement', lose: 'death' },
        { t: '泼圣水（需要圣水）', to: 'basement', req: { item: 'holywater' }, fx: { rmItems: ['holywater'], points: 60 } },
      ]
    },
    basement: {
      text: '地下室是这座宅子的核心：墙上贴满褪色的符纸，正中摆着一口棺材。\n\n棺材里是空的——只有一件叠得整整齐齐的红嫁衣。\n\n身后传来幽幽的女声：「你也想知道……我是怎么死的吗？」\n\n红衣女鬼无声无息地悬在半空，长发垂到地面，七窍渗血。',
      fx: { san: -10 },
      options: [
        { t: '「我会替你讨公道。」（需要少女日记）', to: 'peace', req: { item: 'diary' } },
        { t: '拔剑战斗（BOSS战）', battle: 'lady', win: 'end_fight', lose: 'death' },
      ]
    },
    peace: {
      text: '你举起那本浸血的日记：「沈家小姐是被活埋的，冤案写在这里。我出去就把真相公之于众——」\n\n女鬼身上的怨气肉眼可见地消退了。她飘到你面前，血泪滑落：\n\n「八十年了……终于有人肯听我说话。带上这枚玉佩，它会护你周全。」\n\n宅子的阴气开始消散，天边泛起鱼肚白。',
      fx: { items: ['charm', 'talisman'], points: 300, flags: { ghost_spared: 1 } },
      options: [ { t: '返回主神空间（善结局+额外奖励）', special: 'clear' } ]
    },
    end_fight: {
      text: '桃木剑贯穿红衣的瞬间，整座宅子剧烈震颤，所有窗户同时炸裂。\n\n女鬼发出最后一声哀嚎，化作漫天红蝶消散。你隐约看见蝶群中她回眸一笑——像是在道谢，又像是在嘲笑。\n\n天亮了。白光降临。第三关，通过。',
      options: [ { t: '返回主神空间', special: 'clear' } ]
    },
  }
});

/* ---------- v13 新增：子地图 NPC 剧情（独立存在、可跳过） ---------- */
Object.assign(GAME_DATA.levels[0].nodes, {
  soldier: {
    text: '地下停车场的应急灯忽明忽暗。一个扛着步枪的士兵靠在被掀翻的装甲车旁，胸牌写着「王铮·市卫戍旅」。\n\n他抬枪对准你：「站住！是活人还是那些东西？」\n\n看清你的眼睛后，他放下了枪口：「抱歉。三天没合眼了——整个连队就剩我一个。」',
    options: [
      { t: '询问撤离路线', to: 'soldier_route' },
      { t: '问他为什么不去天台', to: 'soldier_why' },
      { t: '给他一卷绷带', to: 'soldier_bandage', req: { item: 'bandage' } },
    ]
  },
  soldier_route: {
    text: '「天台？别想了。」王铮摇头，「直升机半小时前飞走了最后一趟。上面那些大人物丢下我们跑了。」\n\n他在水泥柱上画了张简图：「从东侧商业街的居民楼翻过去，能绕开尸群直达医院。别走正街——那里有几千只。」\n\n说完他塞给你一枚手雷：「拿着，我反正用不上了。」',
    fx: { items: ['grenade'], points: 30 },
    options: [{ t: '道谢后离开', to: 'close' }]
  },
  soldier_why: {
    text: '「我在等我的战友。」他盯着自己染血的狗牌，「他被咬了，把自己锁在B区电梯里。他说等他变成那种东西的时候……让我给他一个痛快。」\n\n他苦笑：「可我对着电梯门站了三天，就是扣不动扳机。」\n\n沉默半晌，他重新背好枪：「你走吧，替我活着出去。」',
    fx: { san: -4, points: 20 },
    options: [{ t: '默默离开', to: 'close' }]
  },
  soldier_bandage: {
    text: '他愣了一下，接过绷带笨拙地缠在渗血的小臂上：「……谢谢。这世道，愿意分给陌生人一卷绷带的人比丧尸还稀罕。」\n\n他解下自己的战术手电和两颗子弹递给你：「礼尚往来。记住，走居民楼顶。」',
    fx: { items: ['taser', 'bandage'], points: 40 },
    options: [{ t: '收好装备离开', to: 'close' }]
  },
});

Object.assign(GAME_DATA.levels[1].nodes, {
  officer: {
    text: '货舱深处，一名穿制服的保安官缩在翻倒的货架后面，手里的电击棒还在滋滋作响。\n\n「别过来！」他声音发抖，「这艘船……这艘船已经不是我们的了。它们把茧挂在每一寸墙上。」\n\n他的工牌写着「林锐·安保部」。',
    options: [
      { t: '询问怪物的弱点', to: 'officer_weak' },
      { t: '询问船上的幸存者', to: 'officer_crew' },
    ]
  },
  officer_weak: {
    text: '「火。」林锐比划着，「只有火能让它们退开。它们的外壳比钢板还硬，子弹打上去像挠痒痒，但一点火星就能让它们烧成一团。」\n\n他从怀里摸出一支信号弹：「拿去吧。我腿断了，跑不动了。」\n\n「逃生舱在船尾。去吧，别回头。」',
    fx: { items: ['molotov'], points: 35 },
    options: [{ t: '接过信号弹离开', to: 'close' }]
  },
  officer_crew: {
    text: '「全死了。」他闭了闭眼，「四百人的船，我在监控里一个一个看着它们被拖进通风管。声音……那声音我一辈子忘不掉。」\n\n「实验室的张博士还活着——他把自己反锁在无菌室里，那些东西进不去。他比我懂这些怪物。」',
    fx: { san: -3 },
    options: [{ t: '离开货舱', to: 'close' }]
  },
});

Object.assign(GAME_DATA.levels[2].nodes, {
  wellghost: {
    text: '枯井边站着一个穿白裙的女孩，长发垂下来遮住半边脸。她的身影在月光下有些透明。\n\n「你也听见井里的声音了吗？」她轻声问，「姐姐说，井底沉着所有被宅子吃掉的人。」\n\n她的眼睛是纯黑色的，却没有恶意。',
    options: [
      { t: '问她是谁', to: 'wellghost_who' },
      { t: '问宅子的真相', to: 'wellghost_truth' },
    ]
  },
  wellghost_who: {
    text: '「我叫阿槐，是这宅子里最后一个小姐。」她抱着膝盖坐在井沿，「爹把我许给了一个大官，迎亲那晚，花轿抬进了这座宅子——然后所有人一夜之间都死了。」\n\n「我不知道为什么只剩我一个留着。也许因为我是投井的，宅子管不到井水。」\n\n她递出一枚湿漉漉的玉佩：「带着它。宅子里的东西……不敢碰井水的气味。」',
    fx: { items: ['charm'], points: 30, san: -4 },
    options: [{ t: '接过玉佩', to: 'close' }]
  },
  wellghost_truth: {
    text: '「宅子不是宅子。」阿槐的声音飘远，「它是一张嘴。每隔十二年就要吃掉一户人家，把他们的魂缝进家具、烛台、画像里。」\n\n「红衣服的……是上一代的夫人。她恨这座宅子，可她已经被缝进去出不来了。」\n\n「烧了正堂的神龛。那是它的心脏。」',
    fx: { san: -6, points: 25 },
    options: [{ t: '记下情报离开', to: 'close' }]
  },
});

Object.assign(GAME_DATA.levels[2].nodes, {
  end: {
    text: '桃木剑贯穿红衣的瞬间，整座宅子剧烈震颤，所有窗户同时炸裂。\n\n女鬼发出最后一声哀嚎，化作漫天红蝶消散。你隐约看见蝶群中她回眸一笑——像是在道谢，又像是在嘲笑。\n\n天亮了。白光降临。第三关，通过。',
    options: [ { t: '返回主神空间', special: 'clear' } ]
  },
});

/* ---------- v14：主图点缀 + 第二子地图剧情 ---------- */
Object.assign(GAME_DATA.levels[0].nodes, {
  broadcast: {
    text: '墙上的应急广播还在循环，喇叭罩上凝着干涸的血点：\n\n「……幸存者请前往市立医院天台，直升机最后一批……撤离将于日落前结束……重复……」\n\n广播底下压着一张手绘地图，标着几条还算安全的巷子。',
    leave: '记下路线，继续走',
    options: [
      { t: '仔细听广播里的杂音', to: 'broadcast2' },
      { t: '收起地图（获得手雷）', fx: { items: ['grenade'], points: 20 }, to: 'close' },
    ]
  },
  broadcast2: { grade: 'C',
    text: '你把耳朵贴近喇叭。机械的播报间隙里，夹着一段很轻的人声——像是有人趁机器换气时抢着说话：\n\n「……别信天台……那里有东西等着……走地下……」\n\n话音被下一遍播报盖掉了。你分不清这是提醒，还是陷阱。',
    options: [ { t: '回到街上', to: 'close' } ]
  },
  doctor: {
    text: '门诊楼大厅的导诊台后缩着一个穿白大褂的人，胸牌写着「陈屿·急诊科」。他的听诊器挂在脖子上，手里攥着半瓶碘伏。\n\n「活人？」他探出头，「快进来，外面那些东西循着声音走——这里是整条街唯一还算干净的地方。」',
    options: [
      { t: '问他有没有见过其他幸存者', to: 'doctor_others' },
      { t: '请他帮忙处理伤口', to: 'doctor_heal' },
      { t: '就此道别', to: 'close' },
    ]
  },
  doctor_others: {
    text: '「见过。」陈屿的声音低下去，「三天前有个戴红围巾的女孩往天台跑，说要找直升机。我拦不住她。」\n\n「昨天下午我听见天台上枪响了一阵，然后就没有然后了。你要去天台的话……」他把碘伏塞进你手里，「带上这个。还有——天台门后如果站着『穿白大褂的我』，千万别开门。」\n\n你注意到大厅阴影里，另一件白大褂在无风地晃。',
    fx: { items: ['bandage'], san: -4 },
    options: [
      { t: '「那件白大褂是什么？」', to: 'doctor_coat' },
      { t: '就此道别', to: 'close' },
    ]
  },
  doctor_coat: {
    text: '「这栋楼里昨天开始多了一个『我』。」陈屿盯着自己的影子，「它学我说话、学我开药。被我拆穿的东西都会变成走廊里那些……你见过的。」\n\n他顿了顿：「如果哪天我也开始学别人说话——别犹豫，跑。」',
    fx: { san: -4, flags: { coat_warning: 1 } },
    options: [ { t: '就此道别', to: 'close' } ]
  },
  doctor_heal: { grade: 'B',
    text: '陈屿动作利索地替你清创包扎，手法专业得让人安心。\n\n「急诊科的最后一台手术，病人是我自己找上门的轮回者。」他自嘲地笑了笑，「去吧，这层的药柜里应该还剩些能用的。」',
    fx: { hp: 40, san: 8 },
    options: [ { t: '就此道别', to: 'close' } ]
  },
  pharmacy: { grade: 'C',
    text: '药房柜台后的货架被翻得乱七八糟，但底层抽屉还锁着。\n\n你撬开抽屉——抗生素、绷带、一小盒没开封的镇定剂，旁边压着张字条：「留给下一个还能看懂说明书的人」。',
    fx: { items: ['medkit', 'pills'], points: 30 },
    leave: '拿上药，退出药房',
    options: [ { t: '拿上药，退出药房', to: 'close' } ]
  },
});
Object.assign(GAME_DATA.levels[1].nodes, {
  scratch: {
    text: '舱壁上密密麻麻全是爪痕——四趾、带钩，从地面一路爬到三米高。\n\n最深的一道把合金壁板整个划穿了。痕口边缘泛着诡异的银亮，像被什么东西的分泌物腐蚀过。\n\n你比划了一下爪距：那东西的爪子比你整条手臂还长。',
    leave: '退回通道',
    options: [
      { t: '研究爪痕的方向', to: 'scratch2' },
      { t: '退回通道', to: 'close' },
    ]
  },
  scratch2: { grade: 'C',
    text: '爪痕全部指向同一个方向——货舱深处。\n\n而且越往深处越密。这不是觅食留下的痕迹，是某种东西反复在同一条路线上来回巡逻磨出来的。\n\n你在心里标出它的巡区：往北那条走廊，最好别空手走。',
    fx: { flags: { patrol_hint: 1 } },
    options: [ { t: '退回通道', to: 'close' } ]
  },
  cocoon: {
    text: '孵化腔中央悬着十几个灰白色的大茧，丝一样的生物质把它们吊在半空。\n\n其中一个茧在动。你剥开丝膜——里面是个还有呼吸的船员，脸上盖着一层薄薄的黏膜，胸口有什么东西在皮下蠕动。\n\n他睁开眼，瞳孔已经散了大半：「……别碰我……它在我身体里……快跑……」',
    fx: { san: -8 },
    options: [
      { t: '给他一个痛快（战斗）', battle: 'hugger', win: 'cocoon_end', lose: 'death' },
      { t: '后退——茧群在震动', to: 'cocoon_flee' },
    ]
  },
  cocoon_flee: {
    text: '你退开的瞬间，他胸口的黏膜爆裂——一只湿漉漉的小东西破体而出，嘶叫着钻进通风管。\n\n茧群此起彼伏地开始蠕动。你不敢再靠近。',
    fx: { san: -6, flags: { cocoon_burst: 1 } },
    options: [ { t: '退回通道', to: 'close' } ]
  },
  cocoon_end: { grade: 'B',
    text: '那东西断成两截，黏液溅在地板上嘶嘶冒烟。\n\n船员的身体安静下来，表情反而解脱了。你替他合上眼。\n\n茧群的蠕动声停了——这一小片孵化腔，暂时安全。',
    fx: { points: 60, san: -3 },
    options: [ { t: '退回通道', to: 'close' } ]
  },
  eggwall: { grade: 'C',
    text: '整面墙被卵状的半透明囊体糊满了。囊体内部蜷着模糊的人形轮廓——有的还能看出制服的样子。\n\n这层巢里被拖来的不止船员。你在囊壁的反光里看到自己的影子，形状和所有囊体一模一样。\n\n某种潮湿的搏动声顺着墙壁传过来，像巨大的心脏。',
    fx: { san: -5 },
    leave: '退回通道',
    options: [ { t: '退回通道', to: 'close' } ]
  },
});
Object.assign(GAME_DATA.levels[2].nodes, {
  coldspot: {
    text: '这个角落比屋里其他地方冷得多——你呼出的气都凝成了白雾。\n\n墙上挂着一幅蒙尘的全家福。照片里的四口之家站在宅子门前笑得端正，只是每个人的脸都被指甲抠成了窟窿。\n\n相框背面刻着一行小字：「别替我们难过，我们活该。」',
    fx: { san: -4 },
    leave: '离开这间屋',
    options: [
      { t: '翻过相框看背面刻痕', to: 'coldspot2' },
      { t: '离开这间屋', to: 'close' },
    ]
  },
  coldspot2: { grade: 'C',
    text: '刻痕不止一行。更下面还有浅浅的一排，像是用发抖的手刻的：\n\n「沈家小姐不是病死的。是被活埋的。在后院。井里。」\n\n你放下相框的时候，玻璃罩后面有个模糊的影子一晃而过——照片里的四个人脸窟窿，全都朝向了你。',
    fx: { san: -6, flags: { well_hint: 1 } },
    options: [ { t: '离开这间屋', to: 'close' } ]
  },
  painter: {
    text: '阁楼斜顶下支着一个画架。一个穿校服裙的女孩背对你站着，手里握着一根炭笔，画纸上一片漆黑。\n\n她回过头——脸很白，白得不像活人，但眼睛里有种过分安静的东西：「你是来听故事的吗？这栋宅子的故事，画里的人最清楚。」',
    options: [
      { t: '「画里的人是谁？」', to: 'painter_who' },
      { t: '问她怎么死的', to: 'painter_death' },
      { t: '就此道别', to: 'close' },
    ]
  },
  painter_who: {
    text: '「画里是我姐姐。」她把画纸转过来——漆黑的纸上隐约能看出一个穿红嫁衣的轮廓，「她被许给了一个死人配冥婚。婚礼那天她不肯走，他们就把她钉进了后院的井里。」\n\n「我画了她八十年，可她从来不肯在纸上回头看我一眼。」\n\n炭笔在纸上又添了一笔，那片漆黑里多了一只睁开的眼睛。',
    fx: { san: -5, flags: { bride_truth: 1 } },
    options: [
      { t: '「你想让她回头吗？」', to: 'painter_wish' },
      { t: '就此道别', to: 'close' },
    ]
  },
  painter_wish: { grade: 'B',
    text: '「想啊。」她笑了，嘴角裂得比常人大一点，「所以她每次杀完人，我都替她数着。数到一百个的时候——她就能回头了。」\n\n「现在是第九十九个。」\n\n阁楼里所有的画纸无风自动，每一张漆黑里都睁开了一只眼睛。',
    fx: { san: -8, points: 40 },
    options: [ { t: '就此道别', to: 'close' } ]
  },
  painter_death: {
    text: '「我？」她低头看看自己的手，「我记不清了。也许是上吊，也许是被活埋。这个家里死法太多了，谁还记得自己哪一种。」\n\n「不过我记得死前画完了最后一幅画——就是画架上这张。」\n\n画纸上那片漆黑里，你认出了一个熟悉的轮廓：站在井边的你自己。',
    fx: { san: -6 },
    options: [ { t: '就此道别', to: 'close' } ]
  },
  canvas: { grade: 'C',
    text: '画架上的画布蒙着布。掀开——满纸漆黑，只有一道细细的白线勾出后院井口的形状。\n\n黑颜料还没干透，像刚画上去似的微微反光。\n\n你注意到画架腿边散着一堆撕碎的画——每一张的碎片拼起来，都是同一个女人的红嫁衣。',
    fx: { san: -3 },
    leave: '离开这间屋',
    options: [ { t: '离开这间屋', to: 'close' } ]
  },
});

