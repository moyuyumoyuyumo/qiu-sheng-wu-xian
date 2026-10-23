
/* ========== 物品 / 技能 / 血统 / 职业 / 商店 数据 ========== */
const GAME_DATA = { levels: [], items: {}, skills: {}, bloodlines: {}, classes: {}, shopItems: [], shopSkills: [] };

GAME_DATA.items = {
  /* ---- 消耗品 ---- */
  bandage:   { name: '绷带',       desc: '恢复 30 HP', type: 'consumable', heal: 30, price: 40 },
  medkit:    { name: '急救喷雾',   desc: '恢复 80 HP', type: 'consumable', heal: 80, price: 120 },
  stimpack:  { name: '纳米修复剂', desc: '恢复 160 HP，主神科技', type: 'consumable', heal: 160, price: 260 },
  pills:     { name: '镇定剂',     desc: '恢复 30 精神力', type: 'consumable', sanHeal: 30, price: 60 },
  charm:     { name: '安神符',     desc: '恢复 60 精神力', type: 'consumable', sanHeal: 60, price: 150 },
  mindwipe:  { name: '记忆稳定剂', desc: '恢复 120 精神力', type: 'consumable', sanHeal: 120, price: 300 },
  molotov:   { name: '燃烧瓶',     desc: '投掷造成 60 火焰伤害', type: 'consumable', dmg: 60, elem: 'fire', price: 80 },
  grenade:   { name: '手雷',       desc: '投掷造成 120 伤害', type: 'consumable', dmg: 120, price: 200 },
  c4:        { name: '塑性炸药',   desc: '投掷造成 240 伤害', type: 'consumable', dmg: 240, price: 420 },
  holywater: { name: '圣水',       desc: '投掷造成 80 神圣伤害（克制鬼怪）', type: 'consumable', dmg: 80, elem: 'holy', price: 100 },
  taser:     { name: '电击器',     desc: '投掷造成 50 电击伤害', type: 'consumable', dmg: 50, elem: 'shock', price: 90 },
  acidflask: { name: '强酸瓶',     desc: '投掷造成 70 酸蚀伤害（克制异形）', type: 'consumable', dmg: 70, elem: 'acid', price: 110 },
  adrenaline:{ name: '肾上腺素',   desc: '本回合攻击必定暴击', type: 'consumable', critNext: true, price: 150 },
  smoke:     { name: '烟雾弹',     desc: '必定逃脱战斗', type: 'consumable', sureFlee: true, price: 90 },
  revive:    { name: '复活十字章', desc: '携带阵亡时自动复活（50%HP）', type: 'consumable', revive: true, price: 600 },
  godserum:  { name: '神性血清',   desc: '永久全属性 +4，主神亲手调配的药剂', type: 'consumable', statAll: 4, price: 6000, g: 'S' },
  /* ---- 武器：T1~T5（攻击以百分比为主，等级越高收益越大） ---- */
  pipe:      { name: '钢管',       desc: '攻击 +5，攻击 +12%', type: 'weapon', atk: 5, atkPct: 12, elem: 'blunt', price: 150 },
  bat:       { name: '钉刺球棒',   desc: '攻击 +6，攻击 +14%', type: 'weapon', atk: 6, atkPct: 14, elem: 'blunt', price: 200 },
  knife:     { name: '战术匕首',   desc: '攻击 +5，攻击 +10%，速度 +12%', type: 'weapon', atk: 5, atkPct: 10, spdPct: 12, elem: 'slash', price: 180 },
  machete:   { name: '开山刀',     desc: '攻击 +8，攻击 +22%', type: 'weapon', atk: 8, atkPct: 22, elem: 'slash', price: 450 },
  fireaxe:   { name: '消防斧',     desc: '攻击 +10，攻击 +25%（克制丧尸）', type: 'weapon', atk: 10, atkPct: 25, elem: 'slash', price: 600 },
  pistol:    { name: '战术手枪',   desc: '攻击 +9，攻击 +24%', type: 'weapon', atk: 9, atkPct: 24, elem: 'shot', price: 550 },
  shotgun:   { name: '霰弹枪',     desc: '攻击 +13，攻击 +32%（克制血肉系）', type: 'weapon', atk: 13, atkPct: 32, elem: 'shot', price: 900 },
  talisman:  { name: '桃木剑',     desc: '攻击 +12，攻击 +30%（克制鬼怪僵尸）', type: 'weapon', atk: 12, atkPct: 30, elem: 'holy', price: 950 },
  staff:     { name: '秘银法杖',   desc: '攻击 +11，攻击 +28%，智力 +15%', type: 'weapon', atk: 11, atkPct: 28, intPct: 15, elem: 'arcane', price: 1000 },
  rifle:     { name: '脉冲步枪',   desc: '攻击 +17，攻击 +42%', type: 'weapon', atk: 17, atkPct: 42, elem: 'shot', price: 1600 },
  katana:    { name: '高频振动刀', desc: '攻击 +21，攻击 +52%，主神空间科技', type: 'weapon', atk: 21, atkPct: 52, elem: 'slash', price: 2200 },
  excalibur: { name: '誓约圣剑',   desc: '攻击 +31，攻击 +75%（克制黑暗异常）', type: 'weapon', atk: 31, atkPct: 75, elem: 'holy', price: 5200, g: 'A' },
  railgun:   { name: '磁轨狙击枪', desc: '攻击 +36，攻击 +85%，暴击率 +15%', type: 'weapon', atk: 36, atkPct: 85, crit: 15, elem: 'shot', price: 6500, g: 'A' },
  doomblade: { name: '灭世魔刃',   desc: '攻击 +44，攻击 +105%，暴击率 +12%，附带暗影伤害', type: 'weapon', atk: 44, atkPct: 105, crit: 12, elem: 'dark', price: 8500, g: 'A' },
  godslayer: { name: '神罚之刃',   desc: '攻击 +55，攻击 +130%，暴击率 +15%，神器·一击破万法', type: 'weapon', atk: 55, atkPct: 130, crit: 15, elem: 'holy', price: 10000, g: 'S' },
  /* ---- 防具：T1~T4 ---- */
  vest:      { name: '防弹背心',   desc: '防御 +4，防御 +20%', type: 'armor', def: 4, defPct: 20, price: 350 },
  hazmat:    { name: '防化服',     desc: '防御 +3，防御 +15%，精神伤害 -2', type: 'armor', def: 3, defPct: 15, sanResist: 2, price: 320 },
  chainmail: { name: '链甲作战服', desc: '防御 +7，防御 +32%', type: 'armor', def: 7, defPct: 32, price: 850 },
  nanofiber: { name: '纳米纤维服', desc: '防御 +10，防御 +40%，闪避 +4%', type: 'armor', def: 10, defPct: 40, dodge: 4, price: 1600 },
  exosuit:   { name: '外骨骼装甲', desc: '防御 +15，防御 +55%，HP 上限 +10%', type: 'armor', def: 15, defPct: 55, hpPct: 10, price: 2600 },
  aegis:     { name: '神盾力场',   desc: '防御 +24，防御 +80%，受伤 -15%', type: 'armor', def: 24, defPct: 80, dmgReduce: 15, price: 5600, g: 'A' },
  divineplate:{ name: '神谕战铠',  desc: '防御 +32，防御 +120%，HP 上限 +25%，精神伤害 -5，神器·不动如山', type: 'armor', def: 32, defPct: 120, hpPct: 25, sanResist: 5, price: 9800, g: 'S' },
  /* ---- 饰品 ---- */
  analyzer:  { name: '战斗分析仪', desc: '攻击 +12%', type: 'acc', atkPct: 12, price: 500 },
  jade:      { name: '护身玉佩',   desc: '防御 +15%，每回合回复 3 精神力', type: 'acc', defPct: 15, sanRegen: 3, price: 550 },
  windboots: { name: '疾风之靴',   desc: '速度 +30%，闪避 +6%', type: 'acc', spdPct: 30, dodge: 6, price: 700 },
  critring:  { name: '猎杀指环',   desc: '暴击率 +10%', type: 'acc', crit: 10, price: 800 },
  sagestone: { name: '贤者之石',   desc: '智力 +25%，技能消耗 -25%', type: 'acc', intPct: 25, sanCostCut: 25, price: 1100 },
  vampire:   { name: '吸血獠牙',   desc: '攻击吸血 12%', type: 'acc', lifesteal: 12, price: 1300 },
  horn:      { name: '巨兽之角',   desc: '攻击 +20%，暴击 +4%', type: 'acc', atkPct: 20, crit: 4, price: 1500 },
  halo:      { name: '天使光环',   desc: '全属性 +15%', type: 'acc', allstatPct: 15, price: 5200, g: 'A' },
  godshard:  { name: '神格碎片',   desc: '全属性 +30%，暴击率 +8%，神器·神性结晶', type: 'acc', allstatPct: 30, crit: 8, price: 9000, g: 'S' },
  /* ---- 灵植园产物 / 炼丹房丹药 ---- */
  fruit_vita: { name: '回春果', desc: '灵植园产物：恢复 180 HP', type: 'consumable', heal: 180, price: 120 },
  flower_mind:{ name: '凝神花', desc: '灵植园产物：恢复 180 精神力', type: 'consumable', sanHeal: 180, price: 120 },
  fruit_body: { name: '淬体果', desc: '灵植园产物：体质 +1', type: 'consumable', stat: 'con', price: 200 },
  leaf_swift: { name: '疾风叶', desc: '灵植园产物：敏捷 +1', type: 'consumable', stat: 'agi', price: 200 },
  clover:     { name: '四叶草', desc: '灵植园产物：运气 +1', type: 'consumable', stat: 'luk', price: 260 },
  fox_tail:    { name: '灵狐尾焰', desc: '灵兽园产物：力量 +1', type: 'consumable', stat: 'str', price: 260 },
  bird_feather:{ name: '雷雀绒羽', desc: '灵兽园产物：敏捷 +1', type: 'consumable', stat: 'agi', price: 260 },
  turtle_shell:{ name: '石灵龟甲', desc: '灵兽园产物：体质 +1', type: 'consumable', stat: 'con', price: 260 },
  rabbit_fluff:{ name: '月兔绒球', desc: '灵兽园产物：精神 +1', type: 'consumable', stat: 'men', price: 280 },
  kirin_scale: { name: '麒麟鳞',   desc: '灵兽园产物：全属性 +1', type: 'consumable', statAll: 1, price: 520 },
  pill_heal:  { name: '回春丹', desc: '炼丹房炼制：恢复 400 HP', type: 'consumable', heal: 400, price: 320 },
  pill_mind:  { name: '凝神丹', desc: '炼丹房炼制：恢复 400 精神力', type: 'consumable', sanHeal: 400, price: 320 },
  pill_body:  { name: '淬体丹', desc: '炼丹房炼制：体质 +2、敏捷 +1', type: 'consumable', stats: { con: 2, agi: 1 }, price: 600 },
  pill_luck:  { name: '天运丹', desc: '炼丹房炼制：运气 +3', type: 'consumable', stats: { luk: 3 }, price: 700 },
  pill_all:   { name: '九转金丹', desc: '炼丹房炼制：全属性 +2', type: 'consumable', statAll: 2, price: 1500 },
  /* ---- 剧情物品 ---- */
  crowbar:   { name: '撬棍',       desc: '可以撬开门锁', type: 'key' },
  flash:     { name: '手电筒',     desc: '照亮黑暗', type: 'key' },
  rope:      { name: '登山绳',     desc: '攀爬用', type: 'key' },
  lighter:   { name: '打火机',     desc: '点火', type: 'key' },
  diary:     { name: '少女日记',   desc: '记录凶宅真相的日记', type: 'key' },
  rules_note:{ name: '规则纸条',   desc: '写满诡异规则的纸条', type: 'key' },
  ticket:    { name: '无限车票',   desc: '通往下一节车厢的凭证', type: 'key' },
  idol:      { name: '深潜者神像', desc: '散发着腥臭的黄金雕像', type: 'key' },
  paper_man: { name: '纸人',       desc: '画着眼睛的祭祀纸人', type: 'key' },
  keycard:   { name: '门禁卡',     desc: '收容设施研究员的卡', type: 'key' },
  /* ---- 任务线物品 ---- */
  stargate_shard: { name: '星门残片', desc: '通往第九世界的钥匙碎片，四枚合一才能开启大逃杀的门', type: 'key' },
  fate_key:   { name: '命运之钥', desc: '命运祭坛凝聚的钥匙——终局之门的唯一凭证', type: 'key' },
};

GAME_DATA.skills = {
  /* ---- 主动攻击 ---- */
  qigong:      { name: '气功波',   desc: '伤害×1.8 电击', type: 'damage', power: 1.8, elem: 'shock', sanCost: 15, price: 400 },
  fireball:    { name: '烈焰术',   desc: '伤害×2.2 火焰', type: 'damage', power: 2.2, elem: 'fire', sanCost: 20, price: 700 },
  frost:       { name: '冰锥术',   desc: '伤害×2.0 冰冻', type: 'damage', power: 2.0, elem: 'ice', sanCost: 18, price: 650 },
  thunder:     { name: '雷霆万钧', desc: '伤害×2.5 电击', type: 'damage', power: 2.5, elem: 'shock', sanCost: 28, price: 1200 },
  holy_arrow:  { name: '净化之矢', desc: '伤害×2.0 神圣（克制鬼怪）', type: 'damage', power: 2.0, elem: 'holy', sanCost: 18, price: 700 },
  shadow_bolt: { name: '暗影箭',   desc: '伤害×2.3 暗影', type: 'damage', power: 2.3, elem: 'dark', sanCost: 22, price: 900 },
  venom:       { name: '剧毒之触', desc: '伤害×1.3 并施加剧毒（每回合损血）', type: 'dot', power: 1.3, dot: 3, elem: 'poison', sanCost: 16, price: 800 },
  shadow_step: { name: '影袭',     desc: '伤害×2.0，高暴击率', type: 'damage', power: 2.0, critBonus: 25, elem: 'slash', sanCost: 20, price: 900 },
  sweep:       { name: '横扫千军', desc: '伤害×1.7，必中', type: 'damage', power: 1.7, elem: 'blunt', sanCost: 12, price: 500 },
  execution:   { name: '处决',     desc: '伤害×2.8，对低血量敌人×3.5', type: 'damage', power: 2.8, execBonus: true, elem: 'slash', sanCost: 30, price: 2200 },
  blood_frenzy:{ name: '狂暴血统', desc: '伤害×2.5 的嗜血一击', type: 'damage', power: 2.5, elem: 'blunt', sanCost: 30, price: 1500 },
  meteor:      { name: '陨石天降', desc: '伤害×4.2 火焰终极技', type: 'damage', power: 4.2, elem: 'fire', sanCost: 45, price: 5600, g: 'A' },
  voidstrike:  { name: '虚空斩',   desc: '伤害×3.0，无视防御', type: 'damage', power: 3.0, pierce: true, elem: 'dark', sanCost: 35, price: 5000, g: 'A' },
  annihilation:{ name: '湮灭',     desc: '伤害×5.0，无视防御，神器技·万物归零', type: 'damage', power: 5.0, pierce: true, elem: 'dark', sanCost: 60, price: 9800, g: 'S' },
  godslay:     { name: '神陨斩',   desc: '伤害×3.6，无视防御，弑神者专属技', type: 'damage', power: 3.6, pierce: true, elem: 'slash', sanCost: 50, price: 0 },
  /* ---- 血统觉醒技（Lv5 质变习得） ---- */
  dragonbreath: { name: '龙息术',   desc: '伤害×3.0 火焰·血统觉醒技', type: 'damage', power: 3.0, elem: 'fire', sanCost: 36, price: 0 },
  demonclaw:    { name: '恶魔撕裂', desc: '伤害×2.8 暗影·血统觉醒技', type: 'damage', power: 2.8, elem: 'dark', sanCost: 34, price: 0 },
  moonblade:    { name: '月华斩',   desc: '伤害×2.6，高暴击·血统觉醒技', type: 'damage', power: 2.6, critBonus: 15, elem: 'slash', sanCost: 32, price: 0 },
  overclock:    { name: '过载炮击', desc: '伤害×3.0 电击·血统觉醒技', type: 'damage', power: 3.0, elem: 'shock', sanCost: 36, price: 0 },
  judgment:     { name: '审判之光', desc: '伤害×2.8 神圣·血统觉醒技', type: 'damage', power: 2.8, elem: 'holy', sanCost: 34, price: 0 },
  soulharvest:  { name: '汲魂术',   desc: '伤害×2.4 并施加剧毒·血统觉醒技', type: 'dot', power: 2.4, dot: 3, elem: 'dark', sanCost: 30, price: 0 },
  titansmash:   { name: '崩地击',   desc: '伤害×2.7 钝击·血统觉醒技', type: 'damage', power: 2.7, elem: 'blunt', sanCost: 33, price: 0 },
  foxstrike:    { name: '魅影突袭', desc: '伤害×2.6·血统觉醒技', type: 'damage', power: 2.6, elem: 'slash', sanCost: 32, price: 0 },
  voidrend:     { name: '虚空裂隙', desc: '伤害×2.8，无视防御·血统觉醒技', type: 'damage', power: 2.8, pierce: true, elem: 'dark', sanCost: 36, price: 0 },
  asuracut:     { name: '修罗连斩', desc: '伤害×3.0·血统觉醒技', type: 'damage', power: 3.0, elem: 'slash', sanCost: 34, price: 0 },
  chaosbreath:  { name: '混沌吐息', desc: '伤害×3.2 暗影·血统觉醒技', type: 'damage', power: 3.2, elem: 'dark', sanCost: 38, price: 0 },
  /* ---- 血统奥义（Lv10 质变习得） ---- */
  dragonfinal:  { name: '真龙灭世', desc: '伤害×5.0 火焰·血统奥义', type: 'damage', power: 5.0, elem: 'fire', sanCost: 65, price: 0 },
  demonfinal:   { name: '魔王降临', desc: '伤害×4.8 暗影·血统奥义', type: 'damage', power: 4.8, elem: 'dark', sanCost: 62, price: 0 },
  elffinal:     { name: '星月神罚', desc: '伤害×4.6，高暴击·血统奥义', type: 'damage', power: 4.6, critBonus: 20, elem: 'slash', sanCost: 60, price: 0 },
  mechfinal:    { name: '湮灭主炮', desc: '伤害×5.0，无视防御·血统奥义', type: 'damage', power: 5.0, pierce: true, elem: 'shock', sanCost: 66, price: 0 },
  saintfinal:   { name: '神圣审判', desc: '伤害×5.0 神圣·血统奥义', type: 'damage', power: 5.0, elem: 'holy', sanCost: 65, price: 0 },
  necrofinal:   { name: '亡灵天灾', desc: '伤害×4.6 并施加剧毒·血统奥义', type: 'dot', power: 4.6, dot: 4, elem: 'dark', sanCost: 60, price: 0 },
  titanfinal:   { name: '泰坦之怒', desc: '伤害×5.0 钝击·血统奥义', type: 'damage', power: 5.0, elem: 'blunt', sanCost: 65, price: 0 },
  foxfinal:     { name: '九尾灭世', desc: '伤害×4.6·血统奥义', type: 'damage', power: 4.6, elem: 'slash', sanCost: 60, price: 0 },
  voidfinal:    { name: '虚空归零', desc: '伤害×5.0，无视防御·血统奥义', type: 'damage', power: 5.0, pierce: true, elem: 'dark', sanCost: 68, price: 0 },
  asurafinal:   { name: '修罗灭道', desc: '伤害×5.2·血统奥义', type: 'damage', power: 5.2, elem: 'slash', sanCost: 66, price: 0 },
  chaosfinal:   { name: '混沌奇点', desc: '伤害×5.5，无视防御·血统奥义', type: 'damage', power: 5.5, pierce: true, elem: 'dark', sanCost: 70, price: 0 },
  /* ---- 职业进阶技（Lv5 质变习得） ---- */
  warbreak:     { name: '破阵斩',   desc: '伤害×2.6·职业进阶技', type: 'damage', power: 2.6, elem: 'blunt', sanCost: 30, price: 0 },
  arcaneflow:   { name: '奥术洪流', desc: '伤害×3.0 奥术·职业进阶技', type: 'damage', power: 3.0, elem: 'arcane', sanCost: 36, price: 0 },
  assstrike:    { name: '瞬狱杀',   desc: '伤害×3.0，高暴击·职业进阶技', type: 'damage', power: 3.0, critBonus: 20, elem: 'slash', sanCost: 34, price: 0 },
  holynova:     { name: '神圣新星', desc: '伤害×2.6 神圣·职业进阶技', type: 'damage', power: 2.6, elem: 'holy', sanCost: 32, price: 0 },
  arrowrain:    { name: '流星箭雨', desc: '伤害×2.8·职业进阶技', type: 'damage', power: 2.8, elem: 'shot', sanCost: 33, price: 0 },
  berserk:      { name: '嗜血狂击', desc: '伤害×3.2·职业进阶技', type: 'damage', power: 3.2, elem: 'blunt', sanCost: 36, price: 0 },
  abyss:        { name: '深渊之触', desc: '伤害×2.8 并施加剧毒·职业进阶技', type: 'dot', power: 2.8, dot: 3, elem: 'dark', sanCost: 34, price: 0 },
  hammersaint:  { name: '圣裁之锤', desc: '伤害×2.9 神圣·职业进阶技', type: 'damage', power: 2.9, elem: 'holy', sanCost: 34, price: 0 },
  godcombo:     { name: '弑神连斩', desc: '伤害×3.4，无视防御·弑神者进阶技', type: 'damage', power: 3.4, pierce: true, elem: 'slash', sanCost: 40, price: 0 },
  /* ---- 职业奥义（Lv10 质变习得） ---- */
  warfinal:     { name: '战神怒击', desc: '伤害×4.8·职业奥义', type: 'damage', power: 4.8, elem: 'blunt', sanCost: 60, price: 0 },
  magefinal:    { name: '元素湮灭', desc: '伤害×5.0 奥术·职业奥义', type: 'damage', power: 5.0, elem: 'arcane', sanCost: 66, price: 0 },
  assfinal:     { name: '死亡莲华', desc: '伤害×4.8，高暴击·职业奥义', type: 'damage', power: 4.8, critBonus: 25, elem: 'slash', sanCost: 62, price: 0 },
  priestfinal:  { name: '女神慈悲', desc: '伤害×4.4 神圣·职业奥义', type: 'damage', power: 4.4, elem: 'holy', sanCost: 58, price: 0 },
  rangerfinal:  { name: '贯穿星辰', desc: '伤害×4.8，无视防御·职业奥义', type: 'damage', power: 4.8, pierce: true, elem: 'shot', sanCost: 62, price: 0 },
  bersfinal:    { name: '毁天灭地', desc: '伤害×5.2·职业奥义', type: 'damage', power: 5.2, elem: 'blunt', sanCost: 64, price: 0 },
  warlockfinal: { name: '虚空诅咒', desc: '伤害×4.8 并施加剧毒·职业奥义', type: 'dot', power: 4.8, dot: 4, elem: 'dark', sanCost: 62, price: 0 },
  palfinal:     { name: '圣光降临', desc: '伤害×4.6 神圣·职业奥义', type: 'damage', power: 4.6, elem: 'holy', sanCost: 60, price: 0 },
  godkfinal:    { name: '诸神黄昏', desc: '伤害×5.5，无视防御·弑神奥义', type: 'damage', power: 5.5, pierce: true, elem: 'slash', sanCost: 72, price: 0 },
  /* ---- 辅助 ---- */
  heal_light:  { name: '圣愈之光', desc: '恢复 45% HP', type: 'heal', power: 0.45, sanCost: 25, price: 600 },
  great_heal:  { name: '神圣庇护', desc: '恢复 70% HP 并回复 30 精神力', type: 'heal', power: 0.7, sanHeal: 30, sanCost: 45, price: 2600 },
  warcry:      { name: '战意咆哮', desc: '3 回合内攻击 +35%', type: 'buff_atk', power: 0.35, turns: 3, sanCost: 20, price: 700 },
  ironskin:    { name: '金钟罩',   desc: '3 回合内受伤 -50%', type: 'buff_def', power: 0.5, turns: 3, sanCost: 20, price: 700 },
  timewarp:    { name: '时缓术',   desc: '本回合敌人无法行动', type: 'stun', sanCost: 35, price: 1800 },
};

/* ---- 血统（同时只能持有一种，独立等级 Lv1-10，Lv5/Lv10 质变，购买即永久保留进度） ---- */
GAME_DATA.bloodlines = {
  dragon:  { name: '龙裔血脉',   desc: '全属性+2，每回合回复5%HP，火焰技能+30%｜Lv5觉醒【龙息术】·Lv7超凡·Lv10完美【真龙灭世】', mods: { allstat: 2, hpRegen: 5, elemBoost: { fire: 30 } }, price: 2000,
    lv5: { title: '龙血觉醒', mods: { str: 3, con: 2 }, skill: 'dragonbreath' },
    lv7: { title: '龙魂升华', mods: { str: 2, con: 1, hpRegen: 2 } },
    lv10: { title: '真龙降世', mods: { allstat: 5, hpRegen: 3 }, skill: 'dragonfinal' } },
  demon:   { name: '恶魔血统',   desc: '攻击+20%，暗影技能+30%，每回合损3%HP｜Lv5觉醒【恶魔撕裂】·Lv7超凡·Lv10完美【魔王降临】', mods: { atkPct: 20, elemBoost: { dark: 30 }, hpDrain: 3 }, price: 1800,
    lv5: { title: '魔血苏醒', mods: { str: 4, atkPct: 8 }, skill: 'demonclaw' },
    lv7: { title: '深渊凝视', mods: { str: 2, agi: 1, atkPct: 10 } },
    lv10: { title: '魔王真身', mods: { allstat: 5, crit: 10 }, skill: 'demonfinal' } },
  elf:     { name: '精灵血统',   desc: '敏捷+5 运气+4，闪避+12%｜Lv5觉醒【月华斩】·Lv7超凡·Lv10完美【星月神罚】', mods: { agi: 5, luk: 4, dodge: 12 }, price: 1600,
    lv5: { title: '月华觉醒', mods: { agi: 4, dodge: 5 }, skill: 'moonblade' },
    lv7: { title: '星辉同调', mods: { agi: 2, luk: 2, dodge: 4 } },
    lv10: { title: '星月女王', mods: { allstat: 5, dodge: 8 }, skill: 'elffinal' } },
  mech:    { name: '机械改造人', desc: '体质+6，防御+12，精神伤害减半｜Lv5觉醒【过载炮击】·Lv7超凡·Lv10完美【湮灭主炮】', mods: { con: 6, def: 12, sanResistPct: 50 }, price: 2000,
    lv5: { title: '核心过载', mods: { con: 4, defPct: 20 }, skill: 'overclock' },
    lv7: { title: '战争协议', mods: { con: 2, def: 4 } },
    lv10: { title: '歼灭模式', mods: { allstat: 5, dmgReduce: 8 }, skill: 'mechfinal' } },
  saint:   { name: '圣光眷者',   desc: '精神+6，每回合回复8%精神力，神圣技能+40%｜Lv5觉醒【审判之光】·Lv7超凡·Lv10完美【神圣审判】', mods: { men: 6, sanRegenPct: 8, elemBoost: { holy: 40 } }, price: 1800,
    lv5: { title: '圣痕显现', mods: { men: 4, int: 2 }, skill: 'judgment' },
    lv7: { title: '神恩加护', mods: { men: 2, int: 1, sanRegenPct: 2 } },
    lv10: { title: '神光化身', mods: { allstat: 5, sanRegenPct: 4 }, skill: 'saintfinal' } },
  necro:   { name: '死灵血统',   desc: '击杀敌人回复15%HP与10%精神力｜Lv5觉醒【汲魂术】·Lv7超凡·Lv10完美【亡灵天灾】', mods: { killHeal: 15, killSan: 10 }, price: 1500,
    lv5: { title: '亡者低语', mods: { men: 3, int: 3 }, skill: 'soulharvest' },
    lv7: { title: '亡者契约', mods: { men: 1, int: 2, killSan: 4 } },
    lv10: { title: '死神权柄', mods: { allstat: 5, killHeal: 5 }, skill: 'necrofinal' } },
  titan:   { name: '泰坦之血',   desc: '体质+8，受伤减免18%｜Lv5觉醒【崩地击】·Lv7超凡·Lv10完美【泰坦之怒】', mods: { con: 8, dmgReduce: 18 }, price: 2200,
    lv5: { title: '大地共鸣', mods: { con: 5 }, skill: 'titansmash' },
    lv7: { title: '大地之心', mods: { con: 3, dmgReduce: 6 } },
    lv10: { title: '泰坦真身', mods: { allstat: 5, dmgReduce: 10 }, skill: 'titanfinal' } },
  fox:     { name: '九尾妖狐',   desc: '运气+7，战斗积分+30%，逃跑率+25%｜Lv5觉醒【魅影突袭】·Lv7超凡·Lv10完美【九尾灭世】', mods: { luk: 7, ptsBonus: 30, fleeBonus: 25 }, price: 1600,
    lv5: { title: '五尾显形', mods: { luk: 5, agi: 2 }, skill: 'foxstrike' },
    lv7: { title: '九命连环', mods: { luk: 3, dodge: 5 } },
    lv10: { title: '九尾真身', mods: { allstat: 5, ptsBonus: 15 }, skill: 'foxfinal' } },
  void:    { name: '虚空行者',   desc: '攻击无视30%防御，闪避+8%｜Lv5觉醒【虚空裂隙】·Lv7超凡·Lv10完美【虚空归零】', mods: { pierce: 30, dodge: 8 }, price: 2800,
    lv5: { title: '裂隙行走', mods: { agi: 3, pierce: 10 }, skill: 'voidrend' },
    lv7: { title: '维度剥离', mods: { agi: 2, pierce: 8 } },
    lv10: { title: '虚无本体', mods: { allstat: 5, pierce: 15 }, skill: 'voidfinal' } },
  asura:   { name: '阿修罗血',   desc: '暴击率+15%，暴伤+60%｜Lv5觉醒【修罗连斩】·Lv7超凡·Lv10完美【修罗灭道】', mods: { crit: 15, critDmg: 60 }, price: 2600,
    lv5: { title: '修罗开眼', mods: { str: 4, crit: 5 }, skill: 'asuracut' },
    lv7: { title: '斗战狂潮', mods: { str: 2, crit: 6 } },
    lv10: { title: '灭道修罗', mods: { allstat: 5, critDmg: 40 }, skill: 'asurafinal' } },
  chaos:   { name: '混沌始祖',   desc: '全属性+8，每回合回复6%HP，受伤减免12%，暴击+8%，神器血统｜Lv5觉醒【混沌吐息】·Lv7超凡·Lv10完美【混沌奇点】', mods: { allstat: 8, hpRegen: 6, dmgReduce: 12, crit: 8 }, g: 'S', price: 8800,
    lv5: { title: '混沌苏醒', mods: { allstat: 3, hpRegen: 2 }, skill: 'chaosbreath' },
    lv7: { title: '奇点凝聚', mods: { allstat: 3, dmgReduce: 5 } },
    lv10: { title: '始祖归位', mods: { allstat: 8, crit: 10 }, skill: 'chaosfinal' } },
};

/* ---- 职业（独立等级 Lv1-10：Lv1/Lv3 解锁初始技能，Lv5/Lv10 质变习得进阶技与奥义） ---- */
GAME_DATA.classes = {
  warrior:   { name: '战士',   desc: '力量+4 体质+3｜Lv1【横扫千军】Lv5觉醒【破阵斩】·Lv7超凡·Lv10完美【战神怒击】', mods: { str: 4, con: 3 }, skills: ['sweep'], price: 800,
    lv5: { title: '百战进阶', mods: { str: 4, atkPct: 8 }, skill: 'warbreak' },
    lv7: { title: '万夫莫敌', mods: { str: 2, con: 1, atkPct: 8 } },
    lv10: { title: '战神降世', mods: { allstat: 4, crit: 8 }, skill: 'warfinal' } },
  mage:      { name: '元素法师', desc: '智力+5 精神+2｜Lv1【烈焰术】Lv3【雷霆万钧】Lv5觉醒【奥术洪流】·Lv7超凡·Lv10完美【元素湮灭】', mods: { int: 5, men: 2 }, skills: ['fireball', 'thunder'], price: 1000,
    lv5: { title: '奥术觉醒', mods: { int: 4, men: 2 }, skill: 'arcaneflow' },
    lv7: { title: '元素主宰', mods: { int: 2, men: 1 } },
    lv10: { title: '大魔导师', mods: { allstat: 4, intPct: 15 }, skill: 'magefinal' } },
  assassin:  { name: '刺客',   desc: '敏捷+5 运气+2｜Lv1【影袭】Lv3【剧毒之触】Lv5觉醒【瞬狱杀】·Lv7超凡·Lv10完美【死亡莲华】', mods: { agi: 5, luk: 2 }, skills: ['shadow_step', 'venom'], price: 900,
    lv5: { title: '暗影进阶', mods: { agi: 4, crit: 6 }, skill: 'assstrike' },
    lv7: { title: '无间行者', mods: { agi: 2, luk: 1, crit: 5 } },
    lv10: { title: '无面死神', mods: { allstat: 4, crit: 10 }, skill: 'assfinal' } },
  priest:    { name: '圣职者', desc: '精神+5 智力+2｜Lv1【圣愈之光】Lv3【净化之矢】Lv5觉醒【神圣新星】·Lv7超凡·Lv10完美【女神慈悲】', mods: { men: 5, int: 2 }, skills: ['heal_light', 'holy_arrow'], price: 900,
    lv5: { title: '圣徒进阶', mods: { men: 4, int: 2 }, skill: 'holynova' },
    lv7: { title: '慈悲垂怜', mods: { men: 2, int: 1 } },
    lv10: { title: '神之代言', mods: { allstat: 4, menPct: 15 }, skill: 'priestfinal' } },
  ranger:    { name: '游侠',   desc: '敏捷+3 力量+3｜Lv1【横扫千军】Lv3【剧毒之触】Lv5觉醒【流星箭雨】·Lv7超凡·Lv10完美【贯穿星辰】', mods: { agi: 3, str: 3 }, skills: ['sweep', 'venom'], price: 800,
    lv5: { title: '猎手进阶', mods: { agi: 3, str: 3 }, skill: 'arrowrain' },
    lv7: { title: '鹰眼锁定', mods: { agi: 2, str: 1 } },
    lv10: { title: '星辰游侠', mods: { allstat: 4, agiPct: 15 }, skill: 'rangerfinal' } },
  berserker: { name: '狂战士', desc: '力量+6，攻击+8%｜Lv1【狂暴血统】Lv5觉醒【嗜血狂击】·Lv7超凡·Lv10完美【毁天灭地】', mods: { str: 6, atkPct: 8 }, skills: ['blood_frenzy'], price: 1200,
    lv5: { title: '嗜血进阶', mods: { str: 5, atkPct: 10 }, skill: 'berserk' },
    lv7: { title: '狂化极限', mods: { str: 2, agi: 1, atkPct: 8 } },
    lv10: { title: '灭世狂神', mods: { allstat: 4, atkPct: 10 }, skill: 'bersfinal' } },
  warlock:   { name: '咒术师', desc: '智力+4 精神+3｜Lv1【暗影箭】Lv3【剧毒之触】Lv5觉醒【深渊之触】·Lv7超凡·Lv10完美【虚空诅咒】', mods: { int: 4, men: 3 }, skills: ['shadow_bolt', 'venom'], price: 1000,
    lv5: { title: '深渊进阶', mods: { int: 4, men: 2 }, skill: 'abyss' },
    lv7: { title: '诅咒精通', mods: { int: 2, men: 1 } },
    lv10: { title: '虚空大君', mods: { allstat: 4, intPct: 15 }, skill: 'warlockfinal' } },
  paladin:   { name: '圣殿骑士', desc: '体质+4 精神+3｜Lv1【圣愈之光】Lv3【金钟罩】Lv5觉醒【圣裁之锤】·Lv7超凡·Lv10完美【圣光降临】', mods: { con: 4, men: 3 }, skills: ['heal_light', 'ironskin'], price: 1100,
    lv5: { title: '圣裁进阶', mods: { con: 4, men: 2 }, skill: 'hammersaint' },
    lv7: { title: '神盾降临', mods: { con: 2, men: 1, dmgReduce: 4 } },
    lv10: { title: '光明神选', mods: { allstat: 4, dmgReduce: 8 }, skill: 'palfinal' } },
  godkiller: { name: '弑神者',   desc: '力量+8 敏捷+6 运气+5，攻击+15%｜Lv1【神陨斩】Lv5觉醒【弑神连斩】·Lv7超凡·Lv10完美【诸神黄昏】', mods: { str: 8, agi: 6, luk: 5, atkPct: 15 }, skills: ['godslay'], g: 'S', price: 8000,
    lv5: { title: '弑神觉醒', mods: { str: 5, agi: 3 }, skill: 'godcombo' },
    lv7: { title: '神格猎手', mods: { str: 2, agi: 2, luk: 1, crit: 5 } },
    lv10: { title: '黄昏将至', mods: { allstat: 6, crit: 10 }, skill: 'godkfinal' } },
};

GAME_DATA.shopItems = ['pipe','bat','knife','machete','fireaxe','pistol','shotgun','talisman','staff','rifle','katana','excalibur','railgun','doomblade','godslayer','vest','hazmat','chainmail','nanofiber','exosuit','aegis','divineplate','analyzer','jade','windboots','critring','sagestone','vampire','horn','halo','godshard','bandage','medkit','stimpack','pills','charm','mindwipe','molotov','grenade','c4','holywater','taser','acidflask','adrenaline','smoke','revive','godserum'];
GAME_DATA.shopSkills = ['qigong','fireball','frost','thunder','holy_arrow','shadow_bolt','venom','shadow_step','sweep','execution','blood_frenzy','meteor','voidstrike','annihilation','heal_light','great_heal','warcry','ironskin','timewarp'];

/* ---------- 同伴（主神空间招募，最多2名随行） ----------
   shop = 店铺专长：{tag: 店铺类型, pct: 效率加成%}——进驻对应店铺时产速翻倍提升 */
GAME_DATA.allies = {
  sword:  { name:'绯·太刀使', img:'assets/ally_sword.jpg',  price:900,  hp:220, atk:26, spd:9, desc:'东国剑姬，普攻附带 30% 概率二连击', shop:{tag:'forge', pct:50} },
  mage:   { name:'莉娅·星辉术士', img:'assets/ally_mage.jpg',  price:1100, hp:180, atk:34, spd:7, desc:'元素使，普攻视为火系伤害（克丧尸/虫群）', shop:{tag:'general', pct:50} },
  knight: { name:'艾琳·盾卫', img:'assets/ally_knight.jpg', price:800,  hp:320, atk:16, spd:4, desc:'圣堂盾卫，高血量并替全队承受 40% 攻击', shop:{tag:'diner', pct:45} },
  dragonlord: { name:'灼羽·龙王', img:'assets/ally_dragonlord.jpg', price:9000, hp:420, atk:62, spd:10, desc:'龙族君王，普攻 25% 概率三连龙爪，伤害视为火焰', g: 'S', shop:{tag:'dojo', pct:55} },
};

/* ---------- 私人空间 · 店铺经营 ----------
   rate=每分钟积分产出（进驻队友后生效；专长队友有额外加成）
   店铺占用房间格，按停留时间产出——时间快进同样结算 */
GAME_DATA.shops = {
  general: { name: '轮回杂货铺', size: [2,2], price: 900,  rate: 8,  tag: 'general', desc: '卖日用品和药水给路过轮回者，细水长流' },
  forge:   { name: '锻造工坊',   size: [2,2], price: 1300, rate: 7,  tag: 'forge',   desc: '锻炉不熄，接单修刀铸剑，单价高' },
  diner:   { name: '无限食堂',   size: [2,2], price: 1100, rate: 7,  tag: 'diner',   desc: '热汤暖饭，刚出副本的轮回者排队光顾' },
  dojo:    { name: '试炼道场',   size: [2,2], price: 1600, rate: 6,  tag: 'dojo',    desc: '新人来练手交学费，店员自己也长本事' },
  intel:   { name: '万事屋情报站', size: [2,2], price: 2200, rate: 10, tag: 'intel',   desc: '贩卖副本情报与预言，要价最狠', g: 'B', cnt: 1 },
};

/* ---------- 私人房间家具（装修+永久加成+锻炼） ---------- */
/* size=[w,h] 占地格；train=可锻炼属性；mods=摆放后常驻加成；price=积分 或 g=评级 */
GAME_DATA.furniture = {
  bed:       { name: '软床',       desc: '休整时恢复效果 +25%，还能打个盹', size: [2,1], price: 300,  mods: { restBoost: 25 }, color: '#5a6fa8', glyph: '床' },
  plant:     { name: '盆栽',       desc: '一点绿意，精神力上限 +10',          size: [1,1], price: 120,  mods: { sanMax: 10 },     color: '#4e8a52', glyph: '植' },
  bookshelf: { name: '书架',       desc: '可锻炼【智力】',                  size: [2,1], price: 400,  train: 'int', color: '#8a6a45', glyph: '书' },
  dummy:     { name: '木人桩',     desc: '可锻炼【力量】',                  size: [1,1], price: 500,  train: 'str', color: '#9a7b4f', glyph: '桩' },
  treadmill: { name: '跑步机',     desc: '可锻炼【敏捷】',                  size: [2,1], price: 500,  train: 'agi', color: '#5a7a9a', glyph: '跑' },
  sandbag:   { name: '沙袋',       desc: '可锻炼【体质】',                  size: [1,1], price: 450,  train: 'con', color: '#a86a4e', glyph: '袋' },
  cushion:   { name: '冥想蒲团',   desc: '可锻炼【精神】',                  size: [1,1], price: 450,  train: 'men', color: '#7a5a9a', glyph: '禅' },
  compass:   { name: '星象罗盘',   desc: '可锻炼【运气】',                  size: [1,1], price: 600,  train: 'luk', color: '#b8934e', glyph: '盘' },
  trophy:    { name: '战利品展示架', desc: '通关与击杀积分 +12%',            size: [2,1], g: 'B', cnt: 1, price: 2500, mods: { ptsBonus: 12 }, color: '#b8934e', glyph: '杯' },
  purifier:  { name: '空气净化器', desc: '关卡内时间消耗 -12%',             size: [1,1], g: 'B', cnt: 2, price: 2200, mods: { timeCut: 12 }, color: '#6a9aa8', glyph: '净' },
  star_map:  { name: '全息星图',   desc: '通关结算探索度 +8%',              size: [2,1], g: 'B', cnt: 2, price: 2800, mods: { exploreBonus: 8 }, color: '#4e6ab8', glyph: '图' },
  lamp:      { name: '落地灯',     desc: '私人空间偶遇事件好运 +15%',       size: [1,1], price: 200,  mods: { evLuck: 15 }, color: '#d8b25a', glyph: '灯' },
  sofa:      { name: '旧沙发',     desc: '纯装饰。偶尔能坐会儿，精神力上限 +5', size: [2,1], price: 150, mods: { sanMax: 5 },  color: '#7a5a6a', glyph: '发' },
  weapon_rack:{ name: '武器架',    desc: '纯装饰。看着安心，攻击 +2',       size: [1,1], price: 180,  mods: { atkPlus: 2 }, color: '#6a6a7a', glyph: '架' },
  /* ===== 高级房型专属家具（限对应房间摆放） ===== */
  hang_chair:  { name: '吊篮藤椅',   desc: '【阁楼限定】晃悠悠晒太阳：休整恢复 +15%、精神力上限 +8', size: [1,1], price: 900,  rooms: ['loft'],      mods: { restBoost: 15, sanMax: 8 },  color: '#b8934e', glyph: '椅' },
  workbench:   { name: '匠人工台',   desc: '【阁楼限定】敲敲打打的手工坊：锻炼耗时 -20%',            size: [2,1], price: 1400, rooms: ['loft'],      mods: { trainCut: 20 },              color: '#9a7b4f', glyph: '台' },
  tea_table:   { name: '茶席矮桌',   desc: '【宅邸限定】煮茶论道：通关积分 +8%、偶遇好运 +6',        size: [2,1], price: 2000, rooms: ['courtyard'], mods: { ptsBonus: 8, evLuck: 6 },   color: '#8a5a45', glyph: '茶' },
  stone_lantern:{ name: '青石灯笼',  desc: '【宅邸限定】院角的禅意：精神力上限 +18',                size: [1,1], price: 1300, rooms: ['courtyard'], mods: { sanMax: 18 },               color: '#7a8a7a', glyph: '灯' },
  star_throne: { name: '星辉王座',   desc: '【行宫限定】轮回者的御座：通关积分 +15%、偶遇好运 +10',   size: [1,2], g: 'A', cnt: 1, price: 4600, rooms: ['palace'], mods: { ptsBonus: 15, evLuck: 10 }, color: '#5a5ab8', glyph: '座' },
  nebula_orb:  { name: '星云水晶球', desc: '【行宫限定】窥见星河：精神力上限 +24、时间消耗 -8%',      size: [1,1], g: 'A', cnt: 1, price: 3800, rooms: ['palace'], mods: { sanMax: 24, timeCut: 8 },    color: '#8a5ab8', glyph: '球' },
};

/* ---------- 主神空间偶遇事件（消耗空间时间，部分奖励评级点/同伴） ----------
   tone: neu 中性 / pos 正面 / neg 负面。抽选为纯随机——玩家无法自选；
   权重设计：中性最多、正面略少、负面稀有。家具 evLuck 提升正面权重并压低负面。 */
GAME_DATA.hubEvents = [
  /* ===== 中性（主基调） ===== */
  { id: 'wanderer', w: 11, tone: 'pos', title: '独行的轮回者', img: 'assets/ev_wanderer.jpg', ally: ['ghostblade', 'oracle'],
    pages: [
      '光门回廊的尽头泛着一层薄薄的光雾。一个人影抱着武器，背靠在一扇尚未点亮的光门旁。',
      '那是一位轮回者——眼神里没有新人的慌乱，只有踏过无数副本后沉淀下来的疲惫与锋利。',
      '对方抬起眼打量你：「新来的？还是……同类？」光门在他身后明明灭灭，像在等待谁的回答。'
    ],
    opts: [
      { t: '上前攀谈，邀请同行', eff: { allyChance: 70 }, ok: '对方沉默片刻，点头：「下个副本，一起走。」（同伴加入编队）', fail: '对方摇头：「我独来独往惯了。」' },
      { t: '切磋几招', eff: { statChk: 'str', win: { points: 300, grade: 'C' }, loseHp: 15 }, ok: '几回合下来你占了上风，对方心服口服，分了些积分给你。', fail: '你输了，胳膊生疼。' },
      { t: '点头致意，各自离开', eff: {} },
    ] },
  { id: 'blackmarket', w: 14, tone: 'neu', title: '黑市商人', img: 'assets/ev_blackmarket.jpg',
    pages: [
      '回廊一处阴影里，蹲着个戴青铜面具的小贩。他面前铺着一块黑布，摆着几样来路不明的货色。',
      '「嘘——」面具下传出压低的气音，「主神管得着台面上的兑换，可管不到我这块布。看看吧，都是好货，价也厚道。」',
      '黑布上的装备泛着幽幽的光。你注意到他的手指细长苍白，几乎不像活人。'
    ],
    opts: [
      { t: '买一件折价装备（6折）', eff: { discount: 0.6 }, ok: '他递给你一件来路不明的装备。' },
      { t: '不买，走人', eff: {} },
    ] },
  { id: 'gambler', w: 12, tone: 'neu', title: '赌局邀约', img: 'assets/ev_gambler.jpg',
    pages: [
      '几道光门之间的空地上，一群轮回者席地围成一圈。骰子在中央的光纹上骨碌碌打转。',
      '「新来的？来一把？」庄家是个叼着烟斗的瘦子，朝你扬下巴，「规矩简单——押积分，掷大小。赢了翻倍，输了……就当交学费。」',
      '围观的人跟着起哄。骰子还在转，像在勾你的手指。'
    ],
    opts: [
      { t: '押 200 积分', eff: { gamble: 200, winRate: 55, jackpot: { grade: 'B' } }, ok: '赢了！积分翻倍。', jackpotText: '大赢！庄家脸色难看地多付了一枚 B 级徽章。', fail: '输了，积分打了水漂。' },
      { t: '不赌', eff: {} },
    ] },
  { id: 'wounded', w: 10, tone: 'pos', title: '重伤的轮回者', img: 'assets/ev_wounded.jpg',
    pages: [
      '回廊转角处蜷着一个人影。走近才看清：一位轮回者靠着门沿坐着，手臂缠着渗血的布条，脸色灰败。',
      '「喂……」他抬起头，声音沙哑，「身上有绷带吗？我用积分换……或者，欠你个人情。」',
      '他的眼睛还亮着。轮回者之间流传一句话：在回廊里结的善缘，有时会在副本里救你一命。'
    ],
    opts: [
      { t: '给他一卷绷带', eff: { needItem: 'bandage', repay: { points: 400, grade: 'B' } }, ok: '他接过绷带郑重道谢，塞给你积分和一枚 B 徽章。「副本里遇见，我罩你。」' },
      { t: '转身离开', eff: {} },
    ] },
  { id: 'whisper', w: 12, tone: 'neu', title: '主神的低语', img: 'assets/ev_whisper.jpg',
    pages: [
      '行至回廊中央，头顶的光球忽然压低——巨大的白光几乎贴上你的眉心。',
      '没有声音。但你的意识深处被「塞进」了什么：一串不属于任何语言的符号，一段关于副本结构的直觉。',
      '光球缓缓升回原位，像什么都没发生过。只剩你的心跳声。'
    ],
    opts: [
      { t: '静心聆听', eff: { randStat: 1 }, ok: '某种知识直接灌进了脑子——属性提升了。' },
      { t: '抗拒退开', eff: { san: -5 }, ok: '你本能地后退。那股意识漠然收回。' },
    ] },
  { id: 'spar', w: 12, tone: 'neu', title: '竞技场切磋', img: 'assets/ev_spar.jpg',
    pages: [
      '回廊分出一条岔路，尽头竟是一方小型训练场。场中一个肌肉虬结的汉子正对着幻影靶挥拳。',
      '「哈！活人！」他转过身咧嘴一笑，「轮回者？来打一场？放心——点到为止。赢了我给你积分，输了……我给你疗伤药。」',
      '他捏了捏拳头，骨节噼啪作响。'
    ],
    opts: [
      { t: '应战', eff: { statChk: 'agi', win: { points: 350, grade: 'C' }, loseHp: 12 }, ok: '你抓住破绽赢了，汉子痛快地付了积分。', fail: '你被摔在地上，围观者哄笑。' },
      { t: '婉拒', eff: {} },
    ] },
  { id: 'intel', w: 10, tone: 'pos', title: '情报贩子', img: 'assets/ev_intel.jpg',
    pages: [
      '一个瘦高个倚在光门边框上，手里转着一本皱巴巴的记录本。',
      '「情报，买吗？」他压低帽檐，「下一关的地形、怪物弱点、隐藏剧情……我这条命就是从情报里捡回来的。150 分，童叟无欺。」',
      '记录本翻开一角，密密麻麻的手写字迹里夹着几张手绘的地图。'
    ],
    opts: [
      { t: '买下情报', eff: { costPts: 150, grade: 'C' }, ok: '情报密密麻麻写满一页——还有一枚 C 徽章作赠品。' },
      { t: '不买', eff: {} },
    ] },
  { id: 'shrine', w: 10, tone: 'pos', title: '无主祭坛', img: 'assets/ev_shrine.jpg',
    pages: [
      '回廊一个不起眼的角落，不知何时立起了一座小小的祭坛——不属于任何已知的信仰。',
      '石龛上供着一支蜡烛，烛火无风却在轻轻摇曳。龛前散落着几枚硬币和一朵干枯的花。',
      '你忽然觉得，在这里低头合十，或许会有什么「东西」听见。'
    ],
    opts: [
      { t: '合掌祭拜', eff: { san: 20, smallChance: { grade: 'C', rate: 25 } }, ok: '心神安定了下来。', bonus: '烛火忽然一跳——一枚 C 徽章落在你掌心。' },
      { t: '不拜', eff: {} },
    ] },
  { id: 'nothing', w: 12, tone: 'neu', title: '空荡回廊', img: 'assets/ev_nothing.jpg',
    pages: [
      '你绕着光门走了一大圈。',
      '远处偶尔闪过一两个轮回者的背影，走近却又消失在门后。回廊很大，大得不像一个「空间」，倒像一个世界。',
      '最终什么也没发生。只有光门明明灭灭。'
    ],
    opts: [{ t: '回去', eff: {} }] },
  { id: 'caravan', w: 13, tone: 'neu', title: '巡回商队', img: 'assets/ev_caravan.jpg',
    pages: [
      '两扇光门之间，竟悬着一座缀满灯笼的小摊——狐面少女摇着尾巴招呼你，尾巴尖扫过一排五颜六色的药水。',
      '「客人客人！巡回商队，只在回廊交汇时开张～」她托起一瓶紫光流转的液体，「补给半价哦，主神的柜台可没这个价。」',
      '摊位上药水、符纸、小玩意儿琳琅满目。她笑得眼睛眯成一条缝。'
    ],
    opts: [
      { t: '半价买一件补给', eff: { potSale: 0.5 }, ok: '她欢快地把东西塞给你：「常来哦～」' },
      { t: '只看不买', eff: {} },
    ] },
  { id: 'dreamer', w: 12, tone: 'neu', title: '星尘小憩', img: 'assets/ev_dreamer.jpg',
    pages: [
      '回廊一隅不知何时多出一处小小的安憩角——软垫、一盏暖灯、几株攀着门柱生长的白花。',
      '萤火般的光尘在半空缓缓飘浮。这里安静得不属于主神空间，像某个轮回者偷偷布置的避难所。',
      '你的眼皮忽然有点沉。'
    ],
    opts: [
      { t: '靠着门柱眯一会儿', eff: { hp: 40, san: 15 }, ok: '短短一刻钟，疲惫像被光尘带走了一样。' },
      { t: '保持警惕，继续走', eff: {} },
    ] },
  { id: 'recruit', w: 8, tone: 'pos', title: '新兵求助', img: 'assets/ev_recruit.jpg',
    pages: [
      '一个背着 oversized 外套的少女拦在你面前，深深鞠了一躬——差点没把脸埋进地板。',
      '「前、前辈！我是新来的轮回者……下一个副本我、我真的好害怕……能不能指点我几句？」',
      '她的眼睛里还残留着普通人的慌张。你想起自己第一次进副本时，也是这副模样。'
    ],
    opts: [
      { t: '指点她几句', eff: { grade: 'C' }, ok: '她拼命点头记着，塞给你一枚 C 徽章：「前辈的大恩！」' },
      { t: '没空，绕开', eff: {} },
    ] },
  /* ===== 负面（稀有） ===== */
  { id: 'thief', w: 6, tone: 'neg', title: '回廊扒手', img: 'assets/ev_thief.jpg',
    pages: [
      '一道影子贴着你的肩膀掠过——轻得像一阵风。',
      '等你反应过来，腰间的积分袋已经轻了一截。那道影子正在光门之间几个起落，兜帽下传来一声轻笑。',
      '「借走咯～」声音远远的，像猫踩过屋脊。'
    ],
    opts: [
      { t: '追上去夺回来（需敏捷）', eff: { statChk: 'agi', win: { points: 200 }, loseHp: 10, losePts: 80 }, ok: '你揪住她的兜帽，她吐了吐舌头把积分还了回来——还多赔了一点「赔罪钱」。', fail: '她几个闪身就消失在门后，你追得气喘吁吁。' },
      { t: '自认倒霉', eff: { losePts: 120 }, ok: '破财免灾……只能这么安慰自己。' },
    ] },
  { id: 'malice', w: 6, tone: 'neg', title: '拦路勒索', img: 'assets/ev_malice.jpg',
    pages: [
      '回廊中段，一个满身伤疤的轮回者横在路中央，双臂抱胸。回廊的光都映成了红色。',
      '「站住。」他咧嘴一笑，露出森白的牙，「这条道我罩的。过路费，一百五十分。」',
      '他身上的装备全是抢来的样式——在回廊里，偶尔也有靠欺负新人过活的家伙。'
    ],
    opts: [
      { t: '交出 150 积分息事宁人', eff: { losePts: 150 }, ok: '他掂了掂积分，侧身让开：「识相。」' },
      { t: '拒绝并动手', eff: { statChk: 'str', win: { points: 250, grade: 'C' }, loseHp: 25, losePts: 60 }, ok: '你把他按在地上。他骂骂咧咧地掏出自己的积蓄赔罪。', fail: '几个回合后你挂了彩，还被他摸走了一些积分。' },
    ] },
  { id: 'turbulence', w: 5, tone: 'neg', title: '时空乱流', img: 'assets/ev_turbulence.jpg',
    pages: [
      '毫无预兆地，整条回廊忽然扭曲——光门被扯成碎片，空间像被拧断的绸缎。',
      '一场紫白色的风暴凭空卷起，碎片擦着你的身体飞过，每一道都是细小的裂口。',
      '主神的声音第一次出现了裂痕：「……局部空间扰动，请轮回者就地避险……」'
    ],
    opts: [
      { t: '原地伏低硬抗', eff: { san: -12 }, ok: '风暴终于平息，你的精神被搅得嗡嗡作响。' },
      { t: '抓住最近的门沿（需体质）', eff: { statChk: 'con', win: { grade: 'C' }, loseHp: 18 }, ok: '你死死扒住门框撑过风暴——还在裂缝里捡到一枚 C 徽章。', fail: '你被掀翻在地，浑身像被碾过一遍。' },
    ] },
];

/* 事件专属同伴（不出售，只能在偶遇中结伴） */
GAME_DATA.allies.ghostblade = { name: '无名·幽灵刀', img: 'assets/ally_ghostblade.jpg', price: 0, hp: 260, atk: 40, spd: 12, desc: '死去又复活的刀客，普攻 35% 概率化为虚影二连斩', shop:{tag:'forge', pct:60} };
GAME_DATA.allies.oracle = { name: '织命·预言者', img: 'assets/ally_oracle.jpg', price: 0, hp: 170, atk: 30, spd: 8, desc: '能看见命运线的少女，普攻附带 25% 概率预知（暴击）', shop:{tag:'intel', pct:65} };


/* ---------- v20：多房间布局（私人空间可购置切换，各带常驻增益） ---------- */
GAME_DATA.rooms = {
  studio:    { name: '单间公寓', w: 16, h: 10, price: 0,    wall: 0.40, bg: 'assets/room_studio.jpg',         desc: '主神分配的落脚处', mods: {} },
  loft:      { name: '复式阁楼', w: 22, h: 13, price: 1500, wall: 0.36, bg: 'assets/room_loft.jpg',          desc: '挑高两层小楼：锻炼家具耗时 -25%', mods: { trainCut: 25 } },
  courtyard: { name: '庭院宅邸', w: 24, h: 14, price: 3600, wall: 0.40, bg: 'assets/room_courtyard.jpg',     desc: '带内院的中式宅子：街区店铺产出 +15%', mods: { shopBoost: 15 } },
  palace:    { name: '星轨行宫', w: 28, h: 16, price: 8000, wall: 0.36, bg: 'assets/room_palace.jpg', g: 'A', cnt: 1, desc: '浮在星海上的行宫：偶遇好运 +12%、通关积分 +10%', mods: { evLuck: 12, ptsBonus: 10 } },
};

/* ---------- v20：灵植园（种子→按停留时间生长→采收灵植） ---------- */
GAME_DATA.seeds = {
  herb_vita:  { name: '回春草籽', price: 150, grow: 25, out: 'fruit_vita',  color: '#7fd6a0', desc: '25分钟成熟 → 回春果' },
  herb_mind:  { name: '凝神花籽', price: 150, grow: 25, out: 'flower_mind', color: '#9fb8ff', desc: '25分钟成熟 → 凝神花' },
  herb_body:  { name: '淬体藤籽', price: 260, grow: 40, out: 'fruit_body',  color: '#e0a56a', desc: '40分钟成熟 → 淬体果（体质+1）' },
  herb_swift: { name: '疾风叶草', price: 260, grow: 40, out: 'leaf_swift',  color: '#8fe0e0', desc: '40分钟成熟 → 疾风叶（敏捷+1）' },
  herb_luck:  { name: '四叶草籽', price: 320, grow: 50, out: 'clover',      color: '#ffd76a', desc: '50分钟成熟 → 四叶草（运气+1）' },
};

/* ---------- v23：灵兽园（QQ牧场式放养，成熟点击收产出，产出可吃可卖） ---------- */
GAME_DATA.beasts = {
  rabbit: { name: '月兔',   price: 650,  grow: 45, out: 'rabbit_fluff', img: 'assets/beast_rabbit.png', desc: '耳尖沾月华的白团子，成熟时掉月光绒球' },
  bird:   { name: '雷雀',   price: 700,  grow: 50, out: 'bird_feather', img: 'assets/beast_bird.png',   desc: '羽冠像小闪电的圆啾，掉毛时噼啪作响' },
  turtle: { name: '石灵龟', price: 750,  grow: 55, out: 'turtle_shell', img: 'assets/beast_turtle.png', desc: '背壳长满苔纹石片，慢悠悠啃草' },
  fox:    { name: '灵狐',   price: 800,  grow: 60, out: 'fox_tail',     img: 'assets/beast_fox.png',    desc: '尾尖常燃灵火的小狐狸，成熟脱下一缕尾焰' },
  kirin:  { name: '小麒麟', price: 1400, grow: 90, out: 'kirin_scale',  img: 'assets/beast_kirin.png', g: 'B', cnt: 1, desc: '传说瑞兽幼体，鳞片值大钱' },
};

/* ---------- v20：炼丹房（灵植+积分入炉，按停留时间成丹；一次一炉） ---------- */
GAME_DATA.recipes = {
  pill_heal: { name: '回春丹',   need: { fruit_vita: 2 },                              pts: 120, brew: 15, out: 'pill_heal', desc: '恢复 400 HP' },
  pill_mind: { name: '凝神丹',   need: { flower_mind: 2 },                             pts: 120, brew: 15, out: 'pill_mind', desc: '恢复 400 精神力' },
  pill_body: { name: '淬体丹',   need: { fruit_body: 2, leaf_swift: 1 },               pts: 300, brew: 25, out: 'pill_body', desc: '体质+2、敏捷+1' },
  pill_luck: { name: '天运丹',   need: { clover: 2 },                                  pts: 500, brew: 40, out: 'pill_luck', desc: '运气+3' },
  pill_all:  { name: '九转金丹', need: { fruit_vita: 1, flower_mind: 1, fruit_body: 1, leaf_swift: 1, clover: 1 }, pts: 900, brew: 60, out: 'pill_all', desc: '全属性 +2' },
};
