
/* ========== 求生无限 · 游戏引擎（俯视地图 + RPG战斗） ========== */
const $ = id => document.getElementById(id);

let S = null;
let combat = null;
let hubTab = 'gear';
let map = null;        // 当前地图运行时 {grid, w, h, entities, px, py, tx, ty, moving, path}
const TILE = 52;       // 逻辑像素/格
const keys = {};       // 按键状态
let lastDir = 'down';
let animFrame = 0;

/* 素材：Kenney 地形图集 + LPC 行走图（CC0 / CC-BY-SA 3.0） */
const TILES = ['grass','dirt','water','sand','floor','stone','dark','brick','wood','wall_wood','tree','bush','crate','rubble','roof','stairs','fence','door','barrel','void'];
// 地形用整块手绘纹理按格切片（跨格连续无缝）；树/箱/栏杆等仍用小精灵
const TEX_SRC = {grass:'assets/tex_grass.png',dirt:'assets/tex_dirt.png',water:'assets/tex_water.png',sand:'assets/tex_sand.png',floor:'assets/tex_floor.png',stone:'assets/tex_stone.png',dark:'assets/tex_dark.png',brick:'assets/tex_brick.png',wood:'assets/tex_wood.png',wall_wood:'assets/tex_wood.png',road:'assets/tex_road.png',ruin:'assets/tex_ruin.png',biomass:'assets/tex_biomass.png',chitin:'assets/tex_chitin.png',carpet:'assets/tex_carpet.png',wallpaper:'assets/tex_wallpaper.png',tatami:'assets/tex_tatami.png',metal:'assets/tex_metal.png',swamp:'assets/tex_swamp.png',bluestone:'assets/tex_bluestone.png',paperwall:'assets/tex_paperwall.png',lab:'assets/tex_lab.png',containment:'assets/tex_containment.png',marble:'assets/tex_marble.png',starfield:'assets/tex_starfield.png'};
const TEX = {};
Object.keys(TEX_SRC).forEach(k => { const im = new Image(); im.src = TEX_SRC[k]; TEX[k] = im; });
const tileAtlas = new Image(); tileAtlas.src = 'assets/tiles.png';
const heroSprite = new Image(); heroSprite.src = 'assets/spr_hero.png';
// 每个敌人独立的高清 Q 版小精灵（抠图透明底），字面量路径便于打包内嵌
const SPR_SRCS = {
  zombie:'assets/spr_zombie.png', dogs:'assets/spr_dogs.png', butcher:'assets/spr_butcher.png',
  hugger:'assets/spr_hugger.png', drone:'assets/spr_hugger.png', queen:'assets/spr_queen.png',
  doll:'assets/spr_doll.png', revenant:'assets/spr_revenant.png', lady:'assets/spr_lady.png',
  neighbor:'assets/spr_neighbor.png', keeper:'assets/spr_keeper.png',
  faceless:'assets/spr_faceless.png', conductor:'assets/spr_conductor.png',
  hybrid:'assets/spr_hybrid.png', priest:'assets/spr_priest.png',
  paper:'assets/spr_paper.png', jiangshi:'assets/spr_jiangshi.png',
  anomaly:'assets/spr_anomaly.png', horror:'assets/spr_horror.png',
  rival1:'assets/spr_rival1.png', rival2:'assets/spr_rival2.png', ace:'assets/spr_ace.png',
  god:'assets/spr_god.png',
  npc_girl:'assets/npc_girl.png', npc_oldman:'assets/npc_oldman.png', npc_scientist:'assets/npc_scientist.png',
  npc_bride:'assets/npc_bride.png', npc_passenger:'assets/npc_passenger.png',
  npc_soldier:'assets/npc_soldier.png', npc_cultist:'assets/npc_cultist.png', npc_ghostgirl:'assets/npc_ghostgirl.png',
  obj_chest:'assets/obj_chest.png', obj_altar:'assets/obj_altar.png', obj_portal:'assets/obj_portal.png',
  obj_lv1:'assets/obj_lv1.png', obj_lv2:'assets/obj_lv2.png', obj_lv3:'assets/obj_lv3.png',
  obj_lv4:'assets/obj_lv4.png', obj_lv5:'assets/obj_lv5.png', obj_lv6:'assets/obj_lv6.png',
  obj_lv7:'assets/obj_lv7.png', obj_lv8:'assets/obj_lv8.png', obj_lv9:'assets/obj_lv9.png',
  obj_lv10:'assets/obj_lv10.png'
};
// 每关可收集物资的形象：符合当前地图主题
const LV_OBJ = {
  lv1: 'obj_lv1',   // 丧尸围城：军用补给箱
  lv2: 'obj_lv2',   // 异形巢穴：生物质卵囊
  lv3: 'obj_lv3',   // 鬼怪凶宅：旧木柜
  lv4: 'obj_lv4',   // 规则怪谈：符咒封印箱
  lv5: 'obj_lv5',   // 无限列车：行李箱
  lv6: 'obj_lv6',   // 深渊渔村：鱼篓
  lv7: 'obj_lv7',   // 纸扎古村：纸扎供品盒
  lv8: 'obj_lv8',   // 收容失效：收容舱
  lv9: 'obj_lv9',   // 轮回者大逃杀：空投补给箱
  lv10: 'obj_lv10', // 主神终局：圣物匣
};
const SPR_IMGS = {};
for (const k in SPR_SRCS) { const im = new Image(); im.src = SPR_SRCS[k]; SPR_IMGS[k] = im; }

/* ---------- 派生属性（含饰品/血统/职业加成） ---------- */
const GEAR_TIER = { vest:1, hazmat:1, chainmail:2, nanofiber:3, exosuit:3, aegis:4, divineplate:4, pipe:1, bat:1, knife:1, machete:1, fireaxe:1, pistol:1, talisman:2, staff:2, shotgun:2, katana:2, rifle:3, railgun:3, excalibur:4, doomblade:4, godslayer:4 };
const HERO_IMGS = { 0: 'assets/hero_t0.jpg', 1: 'assets/hero_t1.jpg', 2: 'assets/hero_t2.jpg', 3: 'assets/hero_t3.jpg', 4: 'assets/hero_t4.jpg' };
function heroImg() { return HERO_IMGS[Math.max(GEAR_TIER[S.armor] || 0, GEAR_TIER[S.weapon] || 0)]; }

/* ---- 血统/职业独立等级：Lv1-10，Lv5 小质变，Lv10 大质变 ----
   LV_XP[n] = 升到 Lv.n 所需累计经验；LV_EFF = 各等级下基础 mods 的发挥效率 */
const LV_XP = [0, 35, 100, 205, 365, 600, 930, 1385, 2005, 2855];
const LV_EFF = { 1: 0.55, 2: 0.7, 3: 0.85, 4: 1, 5: 1.35, 6: 1.5, 7: 1.65, 8: 1.8, 9: 1.95, 10: 2.2 };
function progOf(kind, id) {
  const tbl = kind === 'blood' ? (S.bloodProg = S.bloodProg || {}) : (S.clsProg = S.clsProg || {});
  return tbl[id] = tbl[id] || { lv: 1, xp: 0 };
}
const bloodLv = () => (S && S.blood) ? ((S.bloodProg || {})[S.blood] || { lv: 1, xp: 0 }) : { lv: 0, xp: 0 };
const clsLv = () => (S && S.cls) ? ((S.clsProg || {})[S.cls] || { lv: 1, xp: 0 }) : { lv: 0, xp: 0 };
/* 按等级缩放 mods：基础 mods × 发挥效率，里程碑 mods（质变加成）全额生效 */
function scaledMods(def, lv) {
  const m = {};
  if (!def || lv <= 0) return m;
  const add = (mm, sc) => Object.keys(mm || {}).forEach(k => {
    if (k === 'elemBoost') {
      m.elemBoost = m.elemBoost || {};
      Object.keys(mm.elemBoost).forEach(e => m.elemBoost[e] = (m.elemBoost[e] || 0) + mm.elemBoost[e] * sc);
    } else m[k] = (m[k] || 0) + mm[k] * sc;
  });
  add(def.mods, LV_EFF[lv] || 1);
  if (lv >= 5 && def.lv5) add(def.lv5.mods, 1);
  if (lv >= 7 && def.lv7) add(def.lv7.mods, 1);
  if (lv >= 10 && def.lv10) add(def.lv10.mods, 1);
  return m;
}
const bmod = () => scaledMods(GAME_DATA.bloodlines[S.blood], bloodLv().lv);
const cmod = () => scaledMods(GAME_DATA.classes[S.cls], clsLv().lv);
// 家具加成聚合（摆放在私人房间里的家具常驻生效）
/* v20：家具加成只算当前入住房间；房间自身增益并入 fmod */
const curRoomId  = () => S.roomId || 'studio';
const curRoomDef = () => GAME_DATA.rooms[curRoomId()] || GAME_DATA.rooms.studio;
const curFurn    = () => (S.roomFurn && S.roomFurn[curRoomId()]) || [];
const fmod = () => {
  const m = Object.assign({}, curRoomDef().mods || {});
  curFurn().forEach(f => Object.assign(m, GAME_DATA.furniture[f.id]?.mods || {}));
  return m;
};
const accIt = () => GAME_DATA.items[S.acc] || {};
const wpIt = () => GAME_DATA.items[S.weapon] || {};
const arIt = () => GAME_DATA.items[S.armor] || {};
/* 有效属性 = 基础 × (1 + 全属性% + 单项%) + 血统/职业平加 */
const statPct  = k => (accIt().allstatPct || 0) + (accIt()[k + 'Pct'] || 0) + (wpIt()[k + 'Pct'] || 0) + (arIt()[k + 'Pct'] || 0) + (bmod()[k + 'Pct'] || 0) + (cmod()[k + 'Pct'] || 0);
const statFlat = k => (bmod().allstat || 0) + (bmod()[k] || 0) + (cmod().allstat || 0) + (cmod()[k] || 0) + (accIt().allstat || 0) + (accIt()[k] || 0) + (wpIt()[k] || 0);
const est = k => Math.floor(S[k] * (1 + statPct(k) / 100) + statFlat(k));
const d_maxHp  = () => Math.floor((60 + est('con') * 12) * (1 + (arIt().hpPct || 0) / 100) + (arIt().hp || 0));
const d_maxSan = () => 50 + est('men') * 10 + (fmod().sanMax || 0);
const d_atk    = () => Math.floor((est('str') * 3 + (wpIt().atk || 0) + (accIt().atk || 0) + (fmod().atkPlus || 0)) * (1 + ((wpIt().atkPct || 0) + (accIt().atkPct || 0) + (bmod().atkPct || 0) + (cmod().atkPct || 0)) / 100));
const d_def    = () => Math.floor((est('con') * 0.8 + (arIt().def || 0) + (accIt().def || 0) + (bmod().def || 0)) * (1 + ((arIt().defPct || 0) + (accIt().defPct || 0) + (bmod().defPct || 0) + (cmod().defPct || 0)) / 100));
const d_spd    = () => Math.floor(est('agi') * 2 * (1 + ((wpIt().spdPct || 0) + (accIt().spdPct || 0)) / 100) + (wpIt().spd || 0) + (accIt().spd || 0));
const d_dodge  = () => est('agi') * 1.2 + est('luk') * 0.8 + (accIt().dodge || 0) + (arIt().dodge || 0) + (bmod().dodge || 0);
const d_crit   = () => 4 + est('agi') * 0.8 + est('luk') * 1.2 + (accIt().crit || 0) + (wpIt().crit || 0) + (bmod().crit || 0) + (cmod().crit || 0);
const d_dmgCut = () => (bmod().dmgReduce || 0) + (arIt().dmgReduce || 0) + (cmod().dmgReduce || 0);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* 血统/职业经验：击杀与通关结算时两条线各自独立获得 */
function grantXp(kind, amount) {
  ['blood', 'cls'].forEach(k => {
    if (kind !== 'both' && kind !== k) return;
    const id = k === 'blood' ? S.blood : S.cls;
    if (!id) return;
    const p = progOf(k, id);
    if (p.lv >= 10) return;
    p.xp += Math.max(0, Math.round(amount));
    while (p.lv < 10 && p.xp >= LV_XP[p.lv]) { p.lv++; onLevelUp(k, id, p.lv); }
  });
}
function onLevelUp(kind, id, lv) {
  const def = (kind === 'blood' ? GAME_DATA.bloodlines : GAME_DATA.classes)[id];
  if (!def) return;
  AudioSys.sfx('level');
  const label = kind === 'blood' ? '血统' : '职业';
  const ms = lv === 5 ? def.lv5 : lv === 7 ? def.lv7 : lv === 10 ? def.lv10 : null;
  const tier = lv === 10 ? '完美' : lv === 7 ? '超凡' : lv === 5 ? '觉醒' : '';
  let msg;
  if (ms) {
    msg = `${label}【${def.name}】${tier}质变「${ms.title || ''}」——Lv.${lv}！威力大幅提升`;
    if (ms.skill && !S.skills.includes(ms.skill)) { S.skills.push(ms.skill); msg += `，习得【${GAME_DATA.skills[ms.skill].name}】`; }
  } else msg = `${label}【${def.name}】升至 Lv.${lv}，加成增强`;
  if (kind === 'cls' && lv === 3 && def.skills && def.skills[1] && !S.skills.includes(def.skills[1])) {
    S.skills.push(def.skills[1]); msg += `，习得【${GAME_DATA.skills[def.skills[1]].name}】`;
  }
  toast(msg);
}

/* ---------- 新游戏 ---------- */
function newGame() {
  S = {
    li: 0, px: 0, py: 0,
    hp: 60, san: 50, pts: 1200,
    str: 3, agi: 3, con: 3, men: 3, int: 3, luk: 3,
    statPts: 2,
    inv: { bandage: 2 }, weapon: null, armor: null, acc: null,
    blood: null, cls: null, team: [], allyUp: {}, started: false, mi: 0,
    skills: [], flags: {}, cleared: [], deadEnts: [], seenNodes: [], seenEnts: [],
    unlocked: 0, deaths: 0, kills: 0, bloodProg: {}, clsProg: {},
    grade: { S: 0, A: 0, B: 0, C: 0 }, bestGrade: {},
    timeLeft: 0, hubTime: 0, explored: {}, furn: [], roster: [], shopReturn: false,
    shops: [], shopStock: {}, shopAccr: 0,
    roomId: 'studio', roomsOwned: ['studio'], roomFurn: { studio: [] }, garden: [], brew: null,
    cheat: { god: false, one: false, timeStop: false }, muted: AudioSys.muted
  };
  S.hp = d_maxHp(); S.san = d_maxSan();
  $('btn-mute-title').textContent = AudioSys.muted ? '🔇 音乐关' : '🔊 音乐开';
  $('btn-mute').textContent = AudioSys.muted ? '🔇' : '🔊';
  openHub();
}

function showScreen(name) {
  ['title-screen', 'game-screen', 'hub-screen', 'sys-screen'].forEach(id => $(id).classList.add('hidden'));
  $(name).classList.remove('hidden');
}

/* ---------- 进入关卡：构建地图 ---------- */
function enterLevel(li, keepPos) {
  S.li = li; S.started = true;
  if (!keepPos) S.timeLeft = LV_TIME[GAME_DATA.levels[li].id] || 800;
  if (!keepPos) S.mi = 0;
  const lv = GAME_DATA.levels[li];
  showScreen('game-screen');
  AudioSys.playTrack(lv.music || 'hub');
  buildMap(lv, S.mi || 0);
  $('level-name').textContent = lv.title + ((map.subName && (lv.maps || []).length > 1) ? ' · ' + map.subName : '');
  if (!keepPos) { map.px = map.spawnX; map.py = map.spawnY; }
  S.px = map.px; S.py = map.py;
  closeDialog();
  renderBars();
  autoSave();
  // 开场提示
  if (lv.introText && !S.seenNodes.includes(lv.id + ':intro')) {
    S.seenNodes.push(lv.id + ':intro');
    openDialog({ img: lv.img, text: lv.introText, options: [{ t: '开始探索', to: 'close' }] });
  }
}

function curLevel() { return GAME_DATA.levels[S.li]; }

/* ---------- 时间系统：移动/战斗/事件/发呆都消耗 ---------- */
const LV_TIME = { lv1: 780, lv2: 800, lv3: 760, lv4: 820, lv5: 800, lv6: 840, lv7: 780, lv8: 860, lv9: 880, lv10: 900 };
const HUB_TIME = 300;
const timeCut = () => 1 - (fmod().timeCut || 0) / 100;
function fmtTime(sec) { sec = Math.max(0, Math.ceil(sec)); return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0'); }
function renderTimeChip() {
  if (!S) return;
  const inMap = !$('game-screen').classList.contains('hidden');
  const tc = $('chip-time');
  if (tc) tc.style.display = inMap ? '' : 'none';
  const ec2 = $('chip-explore');
  if (ec2) ec2.style.display = inMap ? '' : 'none';
  if (tc) {
    $('time-num').textContent = fmtTime(S.timeLeft || 0);
    tc.classList.toggle('low', (S.timeLeft || 0) <= 90);
  }
  const ec = $('explore-num'); if (ec && map) ec.textContent = explorePct(map.lv) + '%';
}
function useTime(sec) {
  if (!S || !S.started || !map) return;
  if (S.cheat.timeStop) return;
  S.timeLeft -= sec * timeCut();
  renderTimeChip();
  if (S.timeLeft <= 0) { S.timeLeft = 0; timeOut(); }
}
function timeOut() {
  if (combat) { endBattle(false, true); }
  map.dialogOpen = true;
  $('dialog-box').classList.remove('hidden');
  $('dialog-img-wrap').style.display = 'block';
  $('dialog-img').src = map.lv.img;
  $('dialog-text').textContent = '视野忽然扭曲——主神的声音在脑内响起：\n\n「本世界滞留时限已到。强制召回。」\n\n光影倒转，你被拉回了主神空间。本关的探索进度保留，下次进入时时间重置。';
  const box = $('dialog-options'); box.innerHTML = '';
  const b = document.createElement('button'); b.className = 'btn'; b.textContent = '回到主神空间';
  b.onclick = () => { closeDialog(); openHub(); };
  box.appendChild(b);
  AudioSys.sfx('lose');
}

/* ---------- 探索度 ---------- */
function markVisited(x, y) {
  const k = map.lv.id + '|' + (map.mi || 0);
  const e = S.explored[k] = S.explored[k] || {};
  e[x + ',' + y] = 1;
}
function lvWalkable(lv) {
  if (lv._walk === undefined) {
    let w = 0;
    (lv.maps || [lv]).forEach(sub => {
      sub.map.forEach(row => {
        for (const ch of row) { const t = (sub.terrain || lv.terrain)[ch] || lv.terrain[ch]; if (t && !t.block) w++; }
      });
    });
    lv._walk = w;
    lv._trig = (lv.maps || [lv]).reduce((n, sub) => n + (sub.entities || []).filter(e => ['node', 'item', 'stat', 'gear'].includes(e.t)).length, 0);
    lv._foes = (lv.maps || [lv]).reduce((n, sub) => n + (sub.entities || []).filter(e => e.t === 'enemy').length, 0);
  }
  return lv._walk;
}
function lvTrigTotal(lv) { lvWalkable(lv); return lv._trig; }
function bossDead(lv) {
  let has = false, dead = true;
  (lv.maps || [lv]).forEach((sub, mi) => {
    (sub.entities || []).forEach((e, i) => {
      if (e.t === 'enemy' && (lv.enemies[e.id] || {}).boss) {
        has = true;
        if (!S.deadEnts.includes(lv.id + ':' + (mi ? mi + ':' : '') + i)) dead = false;
      }
    });
  });
  return has && dead;
}
function explorePct(lv) {
  if (!S || !lv) return 0;
  const walk = lvWalkable(lv) || 1;
  let vis = 0;
  (lv.maps || [lv]).forEach((sub, mi) => { vis += Object.keys(S.explored[lv.id + '|' + mi] || {}).length; });
  const trigTotal = lvTrigTotal(lv) || 1;
  const pref = lv.id + ':';
  // 尸体/拾取分两类：非敌人交互全计入；敌人只按 70% 封顶计入（时间不够全清）
  const subEnts = (lv.maps || [lv]).flatMap((sub, mi) => (sub.entities || []).map((e, i) => ({ e, key: lv.id + ':' + (mi ? mi + ':' : '') + i })));
  const deadSet = new Set(S.deadEnts), seenSet = new Set(S.seenEnts);
  let trig = 0, foeTotal = 0, foeDead = 0;
  subEnts.forEach(({ e, key }) => {
    if (e.t === 'enemy') { foeTotal++; if (deadSet.has(key)) foeDead++; }
    else if (['node', 'item', 'stat', 'gear'].includes(e.t) && (deadSet.has(key) || seenSet.has(key))) trig++;
  });
  const foeScore = Math.min(1, foeDead / Math.max(1, Math.ceil(foeTotal * 0.55)));
  const boss = bossDead(lv);
  let pct = Math.round(52 * Math.min(1, vis / (walk * 0.30)) + 20 * Math.min(1, trig / trigTotal) + 13 * foeScore + 15 * (boss ? 1 : 0));
  if (!boss) pct = Math.min(pct, 84);
  return clamp(pct, 0, 100);
}
const GRADE_ORDER = ['C', 'B', 'A', 'S'];
function gradeOf(pct) { return pct >= 92 ? 'S' : pct >= 78 ? 'A' : pct >= 55 ? 'B' : 'C'; }
function addGrade(g, n) {
  n = n || 1; S.grade[g] = (S.grade[g] || 0) + n;
  toast('获得 ' + '★'.repeat(0) + g + ' 级徽章 ×' + n);
}
function splitGrade(from, to) {
  if ((S.grade[from] || 0) <= 0) { toast('没有 ' + from + ' 级徽章'); return; }
  S.grade[from]--; S.grade[to] = (S.grade[to] || 0) + 3;
  AudioSys.sfx('coin'); toast(from + ' 拆成 3 枚 ' + to);
  renderGrades(); renderShop();
}
function renderGrades() {
  if (!S) return;
  $('hub-grades').innerHTML = '评级 ' + GRADE_ORDER.slice().reverse().map(g =>
    `<span class="grade-chip g${g}">${g}×${S.grade[g] || 0}</span>`).join('');
}

function entKey(ent) { return map.lv.id + ':' + (map.mi ? map.mi + ':' : '') + ent._id; }

function buildMap(lv, mi) {
  mi = mi || 0;
  const sub = (lv.maps && lv.maps[mi]) || lv;
  const rows = sub.map;
  const h = rows.length, w = rows[0].length;
  const entities = (sub.entities || []).map((e, i) => Object.assign({ _id: i, dead: S.deadEnts.includes(lv.id + ':' + (mi ? mi + ':' : '') + i) }, e));
  map = {
    lv, mi, w, h, grid: rows,
    terrain: sub.terrain || lv.terrain,
    dark: sub.dark ?? lv.dark,
    subName: sub.name || '',
    entities,
    px: sub.spawn[0], py: sub.spawn[1], spawnX: sub.spawn[0], spawnY: sub.spawn[1],
    drawX: sub.spawn[0], drawY: sub.spawn[1],
    path: [], moving: false,
    seed: lv.id.length * 7919 + li_seed(S.li) + mi * 131,
    dialogOpen: false
  };
}

function enterSubmap(mi, x, y) {
  const lv = curLevel();
  S.mi = mi;
  buildMap(lv, mi);
  map.px = x; map.py = y; map.drawX = x; map.drawY = y;
  S.px = x; S.py = y;
  $('level-name').textContent = lv.title + ((map.subName && (lv.maps || []).length > 1) ? ' · ' + map.subName : '');
  AudioSys.sfx('door');
  toast('⟿ ' + (map.subName || '另一区域'));
  autoSave();
}
function li_seed(i) { return (i * 104729) % 9973; }

/* ---------- 地形 ---------- */
function tileAt(x, y) {
  if (!map || x < 0 || y < 0 || x >= map.w || y >= map.h) return '#';
  return map.grid[y][x];
}
function walkable(x, y) {
  const t = map.terrain[tileAt(x, y)];
  return t && !t.block;
}
function entAt(x, y) {
  return map.entities.find(e => !e.dead && e.x === x && e.y === y);
}

/* ---------- 移动：键盘 + 点击寻路 ---------- */
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
// 武器出手特效映射：刀剑斩击 / 钝器重击 / 枪械弹道 / 法术弹
const WFX = { pipe: 'blunt', bat: 'blunt', fireaxe: 'blunt', pistol: 'shot', shotgun: 'shot', rifle: 'shot', railgun: 'shot', staff: 'cast', talisman: 'cast' };
const weaponFx = () => WFX[S.weapon] || 'slash';
// 技能元素 → 特效
const SKFX = { fire: 'fire', holy: 'holy', shock: 'lightning', poison: 'venom' };
const skillFx = sk => SKFX[sk.elem] || 'cast';

function tryMove(dx, dy) {
  if (!map || map.dialogOpen || combat || map.path.length) return false;
  const nx = map.px + dx, ny = map.py + dy;
  lastDir = dx < 0 ? 'left' : dx > 0 ? 'right' : dy < 0 ? 'up' : 'down';
  const ent = entAt(nx, ny);
  if (ent) { interact(ent); return true; }
  if (walkable(nx, ny)) { map.px = nx; map.py = ny; markVisited(nx, ny); useTime(1); return true; }
  return false;
}

function bfsPath(sx, sy, tx, ty) {
  if (sx === tx && sy === ty) return [];
  const key = (x, y) => x + ',' + y;
  const prev = { [key(sx, sy)]: null };
  const q = [[sx, sy]];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of Object.values(DIRS)) {
      const nx = x + dx, ny = y + dy, k = key(nx, ny);
      if (k in prev) continue;
      const ent = entAt(nx, ny);
      const blocked = (!walkable(nx, ny) || !!ent) && !(nx === tx && ny === ty);
      if (blocked) continue;
      prev[k] = [x, y];
      if (nx === tx && ny === ty) {
        const path = []; let cur = [nx, ny];
        while (cur) { path.unshift(cur); cur = prev[key(cur[0], cur[1])]; }
        path.shift();
        return path;
      }
      if (walkable(nx, ny) && !ent) q.push([nx, ny]);
      else if (ent) { /* 可以走到实体邻格 */ }
    }
  }
  return null;
}

function clickMove(canvasX, canvasY) {
  if (!map || map.dialogOpen || combat) return;
  const rect = $('map-canvas').getBoundingClientRect();
  const scale = TILE * map.zoom;
  const wx = (canvasX - map.camX) / scale, wy = (canvasY - map.camY) / scale;
  const tx = Math.floor(wx), ty = Math.floor(wy);
  const ent = entAt(tx, ty);
  if (ent && Math.abs(map.px - tx) + Math.abs(map.py - ty) === 1) { interact(ent); return; }
  if (ent) { // 走到实体旁边
    const adj = Object.values(DIRS).map(([dx, dy]) => [tx + dx, ty + dy])
      .filter(([x, y]) => walkable(x, y) && !entAt(x, y));
    let best = null, bl = 1e9;
    adj.forEach(([x, y]) => { const p = bfsPath(map.px, map.py, x, y); if (p && p.length < bl) { bl = p.length; best = p; } });
    if (best) map.path = best;
    return;
  }
  let path = bfsPath(map.px, map.py, tx, ty);
  if (!path) {
    // 点到障碍/死路：找附近最近可达格
    let best = null, bl = 1e9;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const nx = tx + dx, ny = ty + dy;
      if (!walkable(nx, ny) || entAt(nx, ny)) continue;
      const p = bfsPath(map.px, map.py, nx, ny);
      if (p && p.length < bl) { bl = p.length; best = p; }
    }
    path = best;
  }
  if (path) map.path = path;
  else toast('那里过不去');
}

/* ---------- 实体交互 ---------- */
function interact(ent) {
  map.path = [];  // 接触触发后不再继续走，杜绝连锁触发
  const TC = { enemy: 12, node: 8, item: 3, stat: 3, gear: 3, portal: 4, exit: 0 };
  useTime(TC[ent.t] || 0);
  if (ent.t === 'enemy') {
    startBattle(ent);
  } else if (ent.t === 'node') {
    openNode(ent.node, ent);
  } else if (ent.t === 'item') {
    ent.dead = true; S.deadEnts.push(entKey(ent));
    applyFx(ent.fx || { items: [ent.item] });
    AudioSys.sfx('coin');
    if (ent.item === 'stargate_shard') {
      const n = Math.min(4, S.inv['stargate_shard'] || 0);
      toast(n >= 4 ? '获得：星门残片——四枚齐聚！第九扇光门的星尘封印解开了' : `获得：星门残片（${n}/4）——残片在指间共鸣发光`);
    } else {
      toast('获得：' + (GAME_DATA.items[ent.item]?.name || ent.item));
    }
  } else if (ent.t === 'stat') {
    ent.dead = true; S.deadEnts.push(entKey(ent));
    applyFx({ stat: ent.stat });
    AudioSys.sfx('coin');
    toast('属性强化：' + Object.keys(ent.stat).map(k => STAT_NAMES[k] + '+' + ent.stat[k]).join(' '));
  } else if (ent.t === 'gear') {
    ent.dead = true; S.deadEnts.push(entKey(ent));
    applyFx({ equip: ent.equip });
    AudioSys.sfx('level');
    const gid = ent.equip.weapon || ent.equip.armor;
    toast('拾取装备：' + (GAME_DATA.items[gid]?.name || gid) + '（已装备）');
  } else if (ent.t === 'portal') {
    if (ent.req && !checkReq(ent.req)) { toast('传送门未激活：' + reqDesc(ent.req)); return; }
    enterSubmap(ent.to, ent.tx, ent.ty);
  } else if (ent.t === 'exit') {
    if (ent.req && !checkReq(ent.req)) { toast('还不能走：' + reqDesc(ent.req)); return; }
    clearLevel();
  }
}

// 剧情独立性：节点若在任一子地图上有实体落点，或其中含战斗选项，就不再在对话里被直接链入
function placedElsewhere(nid) {
  if (!map) return false;
  return (map.lv.maps || [map.lv]).some(s => (s.entities || []).some(e => e.t === 'node' && e.node === nid && !e.dead));
}
function nodeHasBattle(nid) {
  const n = map && map.lv.nodes[nid];
  return !!(n && (n.options || []).some(o => o.battle));
}
let curNode = null;  // 当前渲染的对话节点（供切割时保留安全选项）
function optSafe(o) {
  if (o.battle) { const e = map && map.lv.enemies[o.battle]; return !(e && e.boss); }
  if (o.to && o.to !== 'close' && o.to !== 'restart-level' && (placedElsewhere(o.to) || nodeHasBattle(o.to))) return false;
  return true;
}
function leaveLabel(node, ent) {
  if (node && node.leave) return node.leave;
  if (ent && ent.npc) return '就此道别';
  const m = { lv1: '回到街上', lv2: '退回通道', lv3: '离开这间屋', lv4: '回到走廊', lv5: '回到车厢', lv6: '回到村里', lv7: '离开这间铺子', lv8: '回到收容区', lv9: '继续潜行', lv10: '回到光球下' };
  return (map && m[map.lv.id]) || '继续前进';
}
// 渲染“截断”节点：保留不涉及落点/战斗的安全选项，末尾永远附一个按场景的“离开”选择
function renderDialogSevered(node, ent, overrideText) {
  const safe = (node.options || []).filter(optSafe);
  const opts = safe.concat([{ t: leaveLabel(node, ent), to: 'close' }]);
  renderDialog(Object.assign({}, node, { text: overrideText || node.text, options: opts }), ent);
  toast('（这段剧情在地图上有落点，走过去还能继续）');
}
const STAT_NAMES = { str: '力量', agi: '敏捷', con: '体质', men: '精神', int: '智力', luk: '运气' };

/* ---------- 剧情节点（对话框） ---------- */
function openNode(nodeId, ent) {
  const node = map.lv.nodes[nodeId];
  if (!node) return;
  map.dialogOpen = true;
  if (ent && !S.seenEnts.includes(entKey(ent))) S.seenEnts.push(entKey(ent));
  const nodeKey = map.lv.id + ':' + nodeId;
  if (node.fx && !(node.once && S.seenNodes.includes(nodeKey))) {
    applyFx(node.fx);
    if (node.once) S.seenNodes.push(nodeKey);
  }
  if (node.grade && !S.seenNodes.includes(nodeKey + '|g')) {
    S.seenNodes.push(nodeKey + '|g'); addGrade(node.grade);
  }
  renderDialog(node, ent);
}

function openDialog(node) {
  if (map) map.dialogOpen = true;
  renderDialog(node, null);
}

function renderDialog(node, ent) {
  $('dialog-box').classList.remove('hidden');
  const iw = $('dialog-img-wrap');
  const dImg = node.img || (ent && ent.npc ? SPR_SRCS[ent.npc] : null) || map.lv.img;
  if (dImg) { iw.style.display = 'block'; $('dialog-img').src = dImg; }
  else iw.style.display = 'none';
  $('dialog-text').textContent = node.text;
  curNode = node;
  const box = $('dialog-options'); box.innerHTML = '';
  (node.options || []).forEach(opt => {
    if (opt.hide && S.flags[opt.hide]) return;
    const b = document.createElement('button');
    b.className = 'btn';
    if (opt.req && !checkReq(opt.req)) {
      b.disabled = true;
      b.innerHTML = `<span class="opt-tag">✕</span>${opt.t} <small style="color:var(--dim)">（${reqDesc(opt.req)}）</small>`;
    } else {
      b.innerHTML = (opt.battle ? '<span class="opt-tag">⚔️</span>' : '<span class="opt-tag">▸</span>') + opt.t;
      b.onclick = () => chooseDialog(opt, ent);
    }
    box.appendChild(b);
  });
  if (!box.children.length) {
    const b = document.createElement('button'); b.className = 'btn';
    b.textContent = '继续探索'; b.onclick = closeDialog;
    box.appendChild(b);
  }
  autoSave();
}

function chooseDialog(opt, ent) {
  AudioSys.sfx('click');
  useTime(8);
  if (opt.fx) applyFx(opt.fx);
  if (opt.toast) toast(opt.toast);
  if (opt.consumeEnt && ent) { ent.dead = true; S.deadEnts.push(entKey(ent)); }
  if (opt.special === 'clear') { closeDialog(); clearLevel(); return; }
  if (opt.battle) {
    const edef = map ? map.lv.enemies[opt.battle] : null;
    if (edef && edef.boss) { renderDialogSevered(curNode || { text: '' }, ent, '……它就在这片区域的深处徘徊。准备好装备后，走过去正面迎战吧。'); return; }
    closeDialog(); startBattle(opt.battle, opt.win, opt.lose, ent);
    return;
  }
  if (opt.to === 'close') { closeDialog(); return; }
  if (opt.to === 'restart-level') { closeDialog(); restartLevel(); return; }
  if (!opt.to) { closeDialog(); return; }  // 纯动作选项（拾取/偷跑等）
  // 剧情点独立：目标节点若在地图上落点存在/本身带战斗，截断不自动链入
  if (placedElsewhere(opt.to) || nodeHasBattle(opt.to)) { renderDialogSevered(map.lv.nodes[opt.to], ent); return; }
  renderDialog(map.lv.nodes[opt.to], ent);
}

function closeDialog() {
  $('dialog-box').classList.add('hidden');
  if (map) map.dialogOpen = false;
}

function checkReq(req) {
  if (req.item && !(S.inv[req.item] > 0)) return false;
  if (req.flag && !S.flags[req.flag]) return false;
  if (req.stat) { for (const k in req.stat) if (est(k) < req.stat[k]) return false; }
  if (req.san && S.san < req.san) return false;
  if (req.points && S.pts < req.points) return false;
  return true;
}
function reqDesc(req) {
  if (req.item) return '需要 ' + GAME_DATA.items[req.item].name;
  if (req.flag) return '条件未满足';
  if (req.stat) return Object.keys(req.stat).map(k => `${STAT_NAMES[k]}≥${req.stat[k]}`).join(' ');
  if (req.san) return `精神力≥${req.san}`;
  if (req.points) return `积分≥${req.points}`;
  return '';
}

function applyFx(fx) {
  if (fx.hp)    { S.hp = clamp(S.hp + fx.hp, 0, d_maxHp()); if (fx.hp < 0) { AudioSys.sfx('hurt'); flashRed(); } }
  if (fx.san)   { S.san = clamp(S.san + fx.san, 0, d_maxSan()); if (fx.san <= -8) AudioSys.sfx('scare'); }
  if (fx.points){ S.pts += fx.points; if (fx.points > 0) AudioSys.sfx('coin'); }
  if (fx.items) fx.items.forEach(it => { S.inv[it] = (S.inv[it] || 0) + 1; toast('获得：' + GAME_DATA.items[it].name); });
  if (fx.rmItems) fx.rmItems.forEach(it => { if (--S.inv[it] <= 0) delete S.inv[it]; });
  if (fx.flags) Object.assign(S.flags, fx.flags);
  if (fx.skills) fx.skills.forEach(sk => { if (!S.skills.includes(sk)) { S.skills.push(sk); toast('学会技能：' + GAME_DATA.skills[sk].name); } });
  if (fx.stat) for (const k in fx.stat) S[k] += fx.stat[k];
  if (fx.equip) { if (fx.equip.weapon) S.weapon = fx.equip.weapon; if (fx.equip.armor) S.armor = fx.equip.armor; }
  if (fx.grade) addGrade(fx.grade, fx.gradeN || 1);
  renderBars();
  checkDeath();
}

function checkDeath() {
  if (S.cheat.god && S.hp <= 0) S.hp = 1;
  if (S.hp <= 0 && !combat) showDeath();
}

function restartLevel() { S.hp = d_maxHp(); S.san = d_maxSan(); S.px = map.spawnX; S.py = map.spawnY; enterLevel(S.li); }

function showDeath() {
  S.deaths++;
  AudioSys.sfx('lose');
  map.dialogOpen = true;
  $('dialog-box').classList.remove('hidden');
  $('dialog-img-wrap').style.display = 'block';
  $('dialog-img').src = 'assets/npc_default.jpg';
  $('dialog-text').textContent = '眼前一黑，意识沉入深渊……\n\n但你听到了主神冰冷的提示音：\n「轮回者死亡。副本坐标已封锁——只能回溯到存档点。」';
  const box = $('dialog-options'); box.innerHTML = '';
  [['读取存档（轮回继续）', () => openLoadModal()]]
    .forEach(([t, fn]) => { const b = document.createElement('button'); b.className = 'btn'; b.textContent = t; b.onclick = fn; box.appendChild(b); });
}

function clearLevel() {
  const lv = curLevel();
  if (!S.cleared.includes(S.li)) S.cleared.push(S.li);
  S.unlocked = Math.max(S.unlocked, Math.min(S.li + 1, GAME_DATA.levels.length - 1));
  const pct = Math.min(100, explorePct(lv) + (fmod().exploreBonus || 0));
  const g = gradeOf(pct);
  S.grade[g] = (S.grade[g] || 0) + 1;
  const ord = { C: 0, B: 1, A: 2, S: 3 };
  if (!S.bestGrade[lv.id] || ord[g] > ord[S.bestGrade[lv.id]]) S.bestGrade[lv.id] = g;
  const rew = Math.floor((lv.reward || 500) * (1 + (fmod().ptsBonus || 0) / 100));
  S.pts += rew;
  S.statPts += 6;
  grantXp('both', 40 + S.li * 25);
  AudioSys.sfx('level');
  toast(`通关！探索度 ${pct}% → 评级 ${g}｜+${rew} 积分 · 6 属性点 · ${g}徽章×1`);
  // 轮回回廊：第3~8关通关但探索度不达标 → 随机送回第1~N关重练
  if (S.li >= 2 && S.li <= 7 && pct < 55) {
    const dest = (Math.random() * (S.li + 1)) | 0;
    setTimeout(() => { toast(`探索度不足 55%——轮回回廊将你卷入旧门：${GAME_DATA.levels[dest].title}`); enterLevel(dest); }, 1600);
    return;
  }
  openHub();
}

/* ---------- 战斗 ---------- */
const imgCache = {};
function getImg(src) { if (!imgCache[src]) { const i = new Image(); i.src = src; imgCache[src] = i; } return imgCache[src]; }

function mkEnemy(src) {
  const e = Object.assign({}, src);
  e.maxHp = e.hp; e.stun = 0; e.dot = 0; e.dotDmg = 0;
  return e;
}

function startBattle(enemyRef, win, lose, ent) {
  useTime(12);
  let primary;
  if (typeof enemyRef === 'object') { primary = curLevel().enemies[enemyRef.id]; ent = ent || enemyRef; }
  else primary = curLevel().enemies[enemyRef];
  const enemies = [mkEnemy(primary)];
  if (primary.boss) {
    const mobs = Object.values(curLevel().enemies).filter(x => !x.boss);
    for (let i = 0; i < Math.min(2, mobs.length); i++) enemies.push(mkEnemy(mobs[(Math.random() * mobs.length) | 0]));
  } else if (Math.random() < 0.45) {
    enemies.push(mkEnemy(primary));
  }
  const allies = (S.team || []).slice(0, 2).map(id => {
    const a = GAME_DATA.allies[id];
    const up = (S.allyUp || {})[id] || {};
    const hp = a.hp + (up.hp || 0);
    return { id, name: a.name, img: a.img, atk: a.atk + (up.atk || 0), hp, maxHp: hp, spd: (a.spd || 7) + (up.spd || 0) };
  });
  combat = { enemies, allies, target: 0, win, lose, ent: ent || null, defending: false, busy: false,
             ap: { hero: 0 }, awaitHero: false, animLock: false };
  $('combat-layer').classList.remove('hidden');
  $('combat-sub').classList.add('hidden');
  FX.clear();
  $('hero-img').src = heroImg();
  $('combat-log').innerHTML = '';
  $('battle-stage').style.setProperty('--stage-bg', `url("${curLevel().img}")`);
  buildCombatCards();
  AudioSys.playTrack(primary.boss ? 'boss' : 'battle');
  AudioSys.sfx('scare');
  clog(`<span class="sys">—— ${enemies.map(x => x.name).join('、')} 出现了！——</span>`);
  if (enemies.length > 1) clog('<span class="sys">点击敌方卡片可切换攻击目标</span>');
  if (allies.length) clog(`<span class="sys">${allies.map(a => a.name).join('、')} 与你并肩作战！</span>`);
  updateCombatUI();
  setActionsEnabled(false);
  updateApBars();
}

function buildCombatCards() {
  const ec = $('enemy-cards'); ec.innerHTML = '';
  combat.ecards = combat.enemies.map((e, i) => {
    const c = document.createElement('div');
    c.className = 'fighter-card enemy-card';
    c.innerHTML = `<div class="fighter-img-wrap"><img src="${e.img}" alt=""></div><div class="fighter-name">${e.name}</div><div class="bar enemy-hp"><div class="bar-track"><div class="bar-fill"></div></div><span class="bar-num"></span></div><div class="ap-track"><div class="ap-fill"></div></div>`;
    c.onclick = () => { if (!combat || combat.enemies[i].hp <= 0) return; combat.target = i; updateCombatUI(); };
    ec.appendChild(c);
    return c;
  });
  const ac = $('ally-cards'); ac.innerHTML = '';
  combat.acards = combat.allies.map((a) => {
    const c = document.createElement('div');
    c.className = 'fighter-card ally-card';
    c.innerHTML = `<div class="fighter-img-wrap"><img src="${a.img}" alt=""></div><div class="fighter-name">${a.name}</div><div class="bar hp"><div class="bar-track"><div class="bar-fill"></div></div><span class="bar-num"></span></div><div class="ap-track"><div class="ap-fill"></div></div>`;
    ac.appendChild(c);
    return c;
  });
}

function updateCombatUI() {
  combat.enemies.forEach((e, i) => {
    const c = combat.ecards[i];
    c.querySelector('.bar-fill').style.width = clamp(e.hp / e.maxHp * 100, 0, 100) + '%';
    c.querySelector('.bar-num').textContent = `${Math.max(0, e.hp)} / ${e.maxHp}`;
    c.classList.toggle('dead', e.hp <= 0);
    c.classList.toggle('target', i === combat.target && e.hp > 0);
  });
  combat.allies.forEach((a, i) => {
    const c = combat.acards[i];
    c.querySelector('.bar-fill').style.width = clamp(a.hp / a.maxHp * 100, 0, 100) + '%';
    c.querySelector('.bar-num').textContent = `${Math.max(0, a.hp)} / ${a.maxHp}`;
    c.classList.toggle('dead', a.hp <= 0);
  });
  $('hero-hp-fill').style.width = clamp(S.hp / d_maxHp() * 100, 0, 100) + '%';
  $('hero-hp-num').textContent = `${Math.max(0, S.hp)} / ${d_maxHp()}`;
  $('hero-san-fill').style.width = clamp(S.san / d_maxSan() * 100, 0, 100) + '%';
  $('hero-san-num').textContent = `${Math.max(0, S.san)} / ${d_maxSan()}`;
  renderBars();
  $('combat-actions').querySelector('[data-act="flee"]').disabled = !combat.awaitHero || combat.enemies.some(e => e.hp > 0 && e.noFlee);
}

function clog(html) {
  const log = $('combat-log');
  log.innerHTML += html + '<br>';
  log.scrollTop = log.scrollHeight;
}

/* --- 战斗演出 --- */
function fighterCard(ref) {
  if (ref === 'hero') return $('hero-card');
  if (ref[0] === 'e') return combat.ecards[+ref.slice(1)];
  return combat.acards[+ref.slice(1)];
}
function spawnDmgNum(ref, text, cls) {
  const stage = $('battle-stage');
  const card = fighterCard(ref);
  if (!card) return;
  const r = card.getBoundingClientRect(), sr = stage.getBoundingClientRect();
  const n = document.createElement('div');
  n.className = 'dmg-num ' + (cls || '');
  n.textContent = text;
  n.style.left = (r.left - sr.left + r.width / 2 - 20 + (Math.random() * 40 - 20)) + 'px';
  n.style.top = (r.top - sr.top + r.height * 0.3) + 'px';
  stage.appendChild(n);
  setTimeout(() => n.remove(), 1000);
}
function animLunge(ref) {
  const c = fighterCard(ref);
  if (!c) return;
  c.classList.remove('atk-l', 'atk-r'); void c.offsetWidth;
  c.classList.add(ref[0] === 'e' ? 'atk-r' : 'atk-l');
}
function animHurt(ref) {
  const c = fighterCard(ref);
  if (!c) return;
  c.classList.remove('hurt'); void c.offsetWidth; c.classList.add('hurt');
  $('combat-layer').classList.remove('shake'); void $('combat-layer').offsetWidth;
  $('combat-layer').classList.add('shake');
}
function skillFlash(color) {
  const f = $('vs-flash');
  f.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
  f.style.opacity = .7;
  setTimeout(() => f.style.opacity = 0, 300);
}

function curTarget() {
  if (!combat.enemies[combat.target] || combat.enemies[combat.target].hp <= 0) {
    combat.target = combat.enemies.findIndex(e => e.hp > 0);
  }
  return combat.enemies[combat.target];
}
function allEnemiesDead() { return combat.enemies.every(e => e.hp <= 0); }

/* 玩家回合（行动条满才可出手） */
function playerTurn(act, arg) {
  if (!combat || combat.busy || !combat.awaitHero) return;
  combat.busy = true;
  useTime(6);
  combat.defending = false;
  let dmg = 0;

  if (act === 'attack') {
    const e = curTarget();
    const eDef = Math.floor(e.def * (1 - (bmod().pierce || 0) / 100));
    dmg = Math.max(1, d_atk() + Math.floor(Math.random() * (est('str') + 3)) - eDef);
    if (combat.atkBuff) dmg = Math.floor(dmg * (1 + combat.atkBuffPct));
    let crit = Math.random() * 100 < d_crit() || combat.critNext;
    combat.critNext = false;
    const weapon = GAME_DATA.items[S.weapon];
    if (weapon?.elem && e.weak && weapon.elem === e.weak) { dmg = Math.floor(dmg * 1.6); clog('<span class="crit">击中弱点！</span>'); }
    if (crit) { dmg = Math.floor(dmg * (1.8 + (bmod().critDmg || 0) / 100)); }
    if (S.cheat.one) dmg = e.hp;
    const ti = combat.enemies.indexOf(e);
    e.hp -= dmg;
    const wf = weaponFx();
    animLunge('hero');
    setTimeout(() => {
      if (wf === 'shot') FX.shot('hero', 'e' + ti);
      else if (wf === 'blunt') FX.blunt('e' + ti);
      else if (wf === 'cast') FX.cast('e' + ti, '#cfe4ff');
      else FX.slash('e' + ti);
      animHurt('e' + ti);
      spawnDmgNum('e' + ti, '-' + dmg, crit ? 'crit' : '');
      AudioSys.sfx(crit ? 'crit' : 'hit');
      if (crit) clog('<span class="crit">会心一击！</span>');
      combat.lastPlayerHit = dmg;
      clog(`你攻击 ${e.name}，造成 <span class="dmg">${dmg}</span> 伤害`);
      updateCombatUI();
      setTimeout(afterPlayerTurn, 320);
    }, 220);
    return;
  } else if (act === 'skill') {
    const sk = GAME_DATA.skills[arg];
    if (S.san < sk.sanCost) { clog('<span class="sys">精神力不足，无法发动！</span>'); combat.busy = false; return; }
    S.san -= sk.sanCost;
    skillFlash(sk.elem === 'fire' ? 'rgba(255,120,40,.8)' : sk.elem === 'holy' ? 'rgba(255,240,180,.8)' : sk.elem === 'shock' ? 'rgba(120,200,255,.8)' : 'rgba(160,120,255,.8)');
    AudioSys.sfx('skill');
    animLunge('hero');
    setTimeout(() => {
      const e = curTarget();
      const ti = combat.enemies.indexOf(e);
      if (sk.type === 'damage' || sk.type === 'dot') {
        const eDef = sk.pierce ? 0 : Math.floor(e.def * (1 - (bmod().pierce || 0) / 100));
        dmg = Math.max(1, Math.floor(d_atk() * sk.power + est('int') * 3) - eDef);
        if (combat.atkBuff) dmg = Math.floor(dmg * (1 + combat.atkBuffPct));
        if (sk.execBonus && e.hp < e.maxHp * 0.35) dmg = Math.floor(dmg * 3.5 / sk.power * 1.0);
        if (sk.elem && e.weak && sk.elem === e.weak) { dmg = Math.floor(dmg * 1.6); clog('<span class="crit">弱点克制！</span>'); }
        const eb = bmod().elemBoost?.[sk.elem]; if (eb) dmg = Math.floor(dmg * (1 + eb / 100));
        if (sk.critBonus && Math.random() * 100 < sk.critBonus) { dmg = Math.floor(dmg * 1.8); clog('<span class="crit">会心一击！</span>'); }
        if (S.cheat.one) dmg = e.hp;
        e.hp -= dmg;
        if (sk.type === 'dot' && e.hp > 0) { e.dot = sk.dot; e.dotDmg = Math.max(2, Math.floor(d_atk() * 0.35)); clog(`<span class="sys">${e.name} 中了剧毒！</span>`); }
        const sfx = skillFx(sk);
        if (sfx === 'fire') FX.fire('e' + ti);
        else if (sfx === 'holy') FX.holy('e' + ti);
        else if (sfx === 'lightning') FX.lightning('e' + ti);
        else if (sfx === 'venom') FX.venom('e' + ti);
        else FX.cast('e' + ti);
        animHurt('e' + ti);
        spawnDmgNum('e' + ti, '-' + dmg, 'crit');
        combat.lastPlayerHit = dmg;
        clog(`你使用【${sk.name}】攻击 ${e.name}，造成 <span class="dmg">${dmg}</span> 伤害`);
      } else if (sk.type === 'buff_atk') {
        FX.buff('hero', '#ffce6a');
        combat.atkBuff = sk.turns; combat.atkBuffPct = sk.power;
        clog(`你使用【${sk.name}】，${sk.turns} 回合内攻击提升 ${Math.round(sk.power * 100)}%！`);
      } else if (sk.type === 'buff_def') {
        FX.buff('hero', '#8ad0ff');
        combat.defBuff = sk.turns; combat.defBuffPct = sk.power;
        clog(`你使用【${sk.name}】，${sk.turns} 回合内受伤降低 ${Math.round(sk.power * 100)}%！`);
      } else if (sk.type === 'stun') {
        FX.buff('e' + ti, '#b78aff');
        e.stun = 1;
        clog(`你使用【${sk.name}】，${e.name} 的动作被时间冻结！`);
      } else {
        const h = Math.floor(d_maxHp() * sk.power);
        FX.heal('hero');
        S.hp = clamp(S.hp + h, 0, d_maxHp());
        if (sk.sanHeal) S.san = clamp(S.san + sk.sanHeal, 0, d_maxSan());
        spawnDmgNum('hero', '+' + h, 'heal');
        AudioSys.sfx('heal');
        clog(`你使用【${sk.name}】，恢复 <span class="heal">${h}</span> HP${sk.sanHeal ? '与 ' + sk.sanHeal + ' 精神力' : ''}`);
      }
      updateCombatUI();
      setTimeout(afterPlayerTurn, 320);
    }, 300);
    return;
  } else if (act === 'item') {
    const it = GAME_DATA.items[arg];
    const e = curTarget();
    const ti = combat.enemies.indexOf(e);
    if (it.heal) { S.hp = clamp(S.hp + it.heal, 0, d_maxHp()); spawnDmgNum('hero', '+' + it.heal, 'heal'); clog(`使用【${it.name}】，恢复 <span class="heal">${it.heal}</span> HP`); }
    if (it.sanHeal) { S.san = clamp(S.san + it.sanHeal, 0, d_maxSan()); spawnDmgNum('hero', '+' + it.sanHeal + '精神', 'san'); clog(`使用【${it.name}】，恢复 ${it.sanHeal} 精神力`); }
    if (it.dmg) { dmg = it.dmg; if (it.elem && e.weak === it.elem) dmg = Math.floor(dmg * 1.8); e.hp -= dmg; if (it.elem === 'fire') FX.fire('e' + ti); else if (it.elem === 'holy') FX.holy('e' + ti); else if (it.elem === 'shock') FX.lightning('e' + ti); else FX.impact('e' + ti); animHurt('e' + ti); spawnDmgNum('e' + ti, '-' + dmg); clog(`掷出【${it.name}】，对 ${e.name} 造成 <span class="dmg">${dmg}</span> 伤害`); }
    if (it.stat) { S[it.stat]++; clog(`<span class="sys">${STAT_NAMES[it.stat]} +1！</span>`); }
    if (it.stats) { Object.keys(it.stats).forEach(k => { S[k] += it.stats[k]; }); clog(`<span class="sys">药力化开：${Object.keys(it.stats).map(k => STAT_NAMES[k] + '+' + it.stats[k]).join('、')}！</span>`); }
    if (it.critNext) { combat.critNext = true; clog('<span class="sys">肾上腺素起效：下一击必定暴击！</span>'); }
    if (it.sureFlee) { clog('<span class="sys">烟雾弥漫，全队趁机撤退！</span>'); if (--S.inv[arg] <= 0) delete S.inv[arg]; updateCombatUI(); combat.busy = false; endBattle(false, true); return; }
    if (--S.inv[arg] <= 0) delete S.inv[arg];
    AudioSys.sfx('heal');
    updateCombatUI();
    setTimeout(afterPlayerTurn, 320);
    return;
  } else if (act === 'defend') {
    combat.defending = true;
    clog('<span class="sys">你摆出防御姿态。</span>');
    updateCombatUI();
    setTimeout(afterPlayerTurn, 200);
    return;
  } else if (act === 'flee') {
    if (Math.random() * 100 < 30 + est('agi') * 2.2 + est('luk') * 1.5 + (bmod().fleeBonus || 0)) {
      clog('<span class="sys">全队成功撤退！</span>');
      combat.busy = false; endBattle(false, true);
      return;
    }
    clog('<span class="sys">逃跑失败！</span>');
    setTimeout(afterPlayerTurn, 280);
    return;
  }
  combat.busy = false;
}

/* ===== 行动条制（ATB）：每帧按速度充能，满 100 出手，快者可连击 ===== */
const AP_RATE = 0.22;

function setActionsEnabled(v) {
  document.querySelectorAll('#combat-actions .combat-btn').forEach(b => b.disabled = !v);
  $('hero-card').classList.toggle('ready', v);
}

function updateApBars() {
  if (!combat) return;
  const set = (el, ap) => { if (el) el.style.width = clamp(ap || 0, 0, 100) + '%'; };
  set($('hero-ap-fill'), combat.ap.hero);
  combat.enemies.forEach((e, i) => set(combat.ecards[i] && combat.ecards[i].querySelector('.ap-fill'), e.hp > 0 ? combat.ap['e' + i] : 0));
  combat.allies.forEach((a, i) => set(combat.acards[i] && combat.acards[i].querySelector('.ap-fill'), a.hp > 0 ? combat.ap['a' + i] : 0));
}

function combatTick() {
  if (!combat || combat.animLock || combat.awaitHero) return;
  const charge = (ref, spd) => { combat.ap[ref] = (combat.ap[ref] || 0) + spd * AP_RATE; };
  charge('hero', d_spd() + 8);
  combat.allies.forEach((a, i) => { if (a.hp > 0) charge('a' + i, a.spd || 7); });
  combat.enemies.forEach((e, i) => { if (e.hp > 0) charge('e' + i, (e.spd || 4) + 3); });
  updateApBars();
  if (combat.ap.hero >= 100) {
    combat.ap.hero = 100;
    combat.awaitHero = true;
    setActionsEnabled(true);
    return;
  }
  let actor = null, top = 99;
  const scan = r => { if ((combat.ap[r] || 0) >= 100 && combat.ap[r] > top) { actor = r; top = combat.ap[r]; } };
  combat.allies.forEach((a, i) => { if (a.hp > 0) scan('a' + i); });
  combat.enemies.forEach((e, i) => { if (e.hp > 0) scan('e' + i); });
  if (!actor) return;
  combat.ap[actor] -= 100;
  combat.animLock = true;
  if (actor[0] === 'e') enemyAct(+actor.slice(1)); else allyAct(+actor.slice(1));
}

/* 玩家行动后：结算 buff、解锁下一轮跑条 */
function afterPlayerTurn() {
  if (!combat) return;
  if (allEnemiesDead()) { endBattle(true); return; }
  tickBuffs();
  combat.awaitHero = false;
  combat.ap.hero = 0;
  combat.busy = false;
  setActionsEnabled(false);
  updateApBars();
}

function allyAct(i) {
  if (!combat) return;
  const a = combat.allies[i];
  const alive = combat.enemies.filter(e => e.hp > 0);
  if (!alive.length) { combat.animLock = false; endBattle(true); return; }
  const t = alive[(Math.random() * alive.length) | 0];
  const ti = combat.enemies.indexOf(t);
  animLunge('a' + i);
  setTimeout(() => {
    if (!combat) return;
    let d = Math.max(1, a.atk + ((Math.random() * 6) | 0) - t.def);
    let note = '';
    if ((a.id === 'mage' || a.id === 'dragonlord') && t.weak === 'fire') { d = Math.floor(d * 1.6); note = '（灼烧克制！）'; }
    if (a.id === 'sword' && Math.random() < 0.3) { d = Math.floor(d * 1.8); note = '（二连击！）'; }
    if (a.id === 'dragonlord' && Math.random() < 0.25) { d = Math.floor(d * 2.6); note = '（三连龙爪！）'; }
    if (S.cheat.one) d = t.hp;
    t.hp -= d;
    if (a.id === 'mage' || a.id === 'dragonlord') FX.fire('e' + ti);
    else if (a.id === 'knight') FX.blunt('e' + ti);
    else FX.slash('e' + ti, '#ffd0e8');
    animHurt('e' + ti); spawnDmgNum('e' + ti, '-' + d);
    clog(`${a.name} 攻击 ${t.name}${note}，造成 <span class="dmg">${d}</span> 伤害`);
    updateCombatUI(); updateApBars();
    combat.animLock = false;
    if (allEnemiesDead()) endBattle(true);
  }, 240);
}

function enemyAct(i) {
  if (!combat) return;
  const e = combat.enemies[i];
  if (e.hp <= 0) { combat.animLock = false; return; }
  const unlock = (ms) => setTimeout(() => { if (combat) combat.animLock = false; }, ms || 180);
  if (e.stun > 0) { e.stun--; clog(`<span class="sys">${e.name} 被时间冻结，无法行动！</span>`); unlock(160); return; }
  if (e.dot > 0) {
    e.hp -= e.dotDmg; e.dot--;
    spawnDmgNum('e' + i, '-' + e.dotDmg, 'san');
    clog(`<span class="sys">剧毒侵蚀，${e.name} 损失 ${e.dotDmg} HP</span>`);
    updateCombatUI();
    if (e.hp <= 0) { combat.animLock = false; if (allEnemiesDead()) endBattle(true); return; }
  }
  // 目标选择：艾琳(盾卫)40%概率嘲讽吸火；其余随机分配到我方
  let targ = 'hero';
  const kIdx = combat.allies.findIndex(a => a.id === 'knight' && a.hp > 0);
  const alliesAlive = combat.allies.map((a, j) => ({ a, j })).filter(x => x.a.hp > 0);
  if (kIdx >= 0 && Math.random() < 0.4) targ = 'a' + kIdx;
  else if (alliesAlive.length && Math.random() < 0.45) targ = 'a' + alliesAlive[(Math.random() * alliesAlive.length) | 0].j;

  animLunge('e' + i);
  setTimeout(() => {
    if (!combat) return;
    FX.claw(targ);
    if (targ === 'hero') {
      if (Math.random() * 100 < d_dodge()) {
        clog(`${e.name} 的攻击被你闪开！`);
        updateCombatUI();
        unlock(160); return;
      }
      let dmg = Math.max(1, e.atk + Math.floor(Math.random() * 5) - d_def());
      if (combat.defending) { dmg = Math.floor(dmg * 0.4); clog('<span class="sys">防御生效，伤害减半。</span>'); }
      if (combat.defBuff) { dmg = Math.floor(dmg * (1 - combat.defBuffPct)); clog('<span class="sys">护体生效，伤害减免。</span>'); }
      if (d_dmgCut()) dmg = Math.max(1, Math.floor(dmg * (1 - d_dmgCut() / 100)));
      if (S.cheat.god) dmg = 0;
      S.hp -= dmg;
      animHurt('hero');
      spawnDmgNum('hero', '-' + dmg);
      if (e.sanDmg) {
        let sd = e.sanDmg - (arIt().sanResist || 0);
        if (bmod().sanResistPct) sd = Math.floor(sd * (1 - bmod().sanResistPct / 100));
        sd = Math.max(0, sd);
        if (sd) { S.san -= sd; spawnDmgNum('hero', '-' + sd + '精神', 'san'); }
      }
      AudioSys.sfx('hurt'); flashRed();
      clog(`${e.name} 攻击你，造成 <span class="dmg">${dmg}</span> 伤害`);
      if (combat.lastPlayerHit && accIt().lifesteal) { const lh = Math.floor(combat.lastPlayerHit * accIt().lifesteal / 100); S.hp = clamp(S.hp + lh, 0, d_maxHp()); }
      updateCombatUI();
      if (S.hp <= 0) {
        if (S.cheat.god) { S.hp = 1; }
        else if (S.inv.revive > 0) { S.inv.revive--; S.hp = Math.floor(d_maxHp() * 0.5); clog('<span class="crit">复活十字章碎裂——你重新站了起来！</span>'); updateCombatUI(); unlock(300); return; }
        else { combat.animLock = false; endBattle(false, false); return; }
      }
      unlock(220);
    } else {
      const ai = +targ.slice(1); const a = combat.allies[ai];
      let dmg = Math.max(1, e.atk + Math.floor(Math.random() * 5) - 4);
      if (combat.defBuff) dmg = Math.floor(dmg * (1 - combat.defBuffPct));
      a.hp -= dmg;
      animHurt(targ); spawnDmgNum(targ, '-' + dmg);
      AudioSys.sfx('hurt');
      clog(`${e.name} 攻击 ${a.name}，造成 <span class="dmg">${dmg}</span> 伤害${a.hp <= 0 ? '——' + a.name + '重伤撤退！' : ''}`);
      updateCombatUI();
      unlock(220);
    }
  }, 240);
}

// 每回合结束：buff 回合数递减 + 血统/饰品回复
function tickBuffs() {
  if (!combat) return;
  if (combat.atkBuff && --combat.atkBuff <= 0) { combat.atkBuff = 0; clog('<span class="sys">战意消退。</span>'); }
  if (combat.defBuff && --combat.defBuff <= 0) { combat.defBuff = 0; clog('<span class="sys">护体消散。</span>'); }
  const bm = bmod();
  if (bm.hpRegen) { const h = Math.floor(d_maxHp() * bm.hpRegen / 100); if (h) S.hp = clamp(S.hp + h, 0, d_maxHp()); }
  if (bm.hpDrain) { const d = Math.floor(d_maxHp() * bm.hpDrain / 100); if (d) S.hp = Math.max(1, S.hp - d); }
  if (bm.sanRegenPct) { const h = Math.floor(d_maxSan() * bm.sanRegenPct / 100); if (h) S.san = clamp(S.san + h, 0, d_maxSan()); }
  if (accIt().sanRegen) S.san = clamp(S.san + accIt().sanRegen, 0, d_maxSan());
}

function endBattle(win, fled) {
  const { enemies, win: winNode, lose: loseNode, ent } = combat;
  const bossFight = enemies.some(e => e.boss);
  combat = null;
  FX.clear();
  $('combat-layer').classList.add('hidden');
  $('combat-sub').classList.add('hidden');
  AudioSys.playTrack(curLevel().music || 'hub');
  if (win) {
    S.kills += enemies.length;
    const pts = Math.floor(enemies.reduce((s, e) => s + (e.points || 100), 0) * (1 + ((bmod().ptsBonus || 0) + (fmod().ptsBonus || 0)) / 100));
    S.pts += pts;
    grantXp('both', pts / 12 + enemies.length * 5 + (bossFight ? 80 : 0));
    const bm = bmod();
    if (bm.killHeal) S.hp = clamp(S.hp + Math.floor(d_maxHp() * bm.killHeal / 100), 0, d_maxHp());
    if (bm.killSan) S.san = clamp(S.san + Math.floor(d_maxSan() * bm.killSan / 100), 0, d_maxSan());
    if (ent) { ent.dead = true; S.deadEnts.push(entKey(ent)); }
    AudioSys.sfx('win');
    toast(`胜利！+${pts} 积分`);
    renderBars(); autoSave();
    if (winNode && !placedElsewhere(winNode) && !nodeHasBattle(winNode)) openNode(winNode, ent);
    else if (bossFight) { const endN = curLevel().nodes.end; if (endN) openNode('end', ent); else clearLevel(); }
  } else if (fled) {
    // 退回原来格子
  } else {
    if (loseNode === 'death' || !loseNode) { S.hp = 0; showDeath(); }
    else openNode(loseNode, ent);
  }
}

/* ---------- 地图渲染 ---------- */
function seedRand(x, y, s) { let h = (x * 374761393 + y * 668265263 + s * 1442695041) >>> 0; h = (h ^ (h >> 13)) * 1274126177; return (((h ^ (h >> 16)) >>> 0) % 1000) / 1000; }

function renderMap() {
  const cv = $('map-canvas');
  const ctx = cv.getContext('2d');
  const W = cv.clientWidth, H = cv.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  if (cv.width !== W * dpr || cv.height !== H * dpr) { cv.width = W * dpr; cv.height = H * dpr; }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  if (!map) return;

  // 缩放：竖屏约9格宽
  map.zoom = clamp(W / (TILE * 8.2), 0.62, 1.7);
  const scale = TILE * map.zoom;
  // 相机跟随玩家（平滑）
  const camTX = map.drawX * scale + scale / 2 - W / 2;
  const camTY = map.drawY * scale + scale / 2 - H / 2;
  const mapW = map.w * scale, mapH = map.h * scale;
  let cx = -camTX, cy = -camTY;
  if (mapW <= W) cx = (W - mapW) / 2; else cx = clamp(cx, W - mapW, 0);
  if (mapH <= H) cy = (H - mapH) / 2; else cy = clamp(cy, H - mapH, 0);
  map.camX = map.camX === undefined ? cx : map.camX + (cx - map.camX) * 0.15;
  map.camY = map.camY === undefined ? cy : map.camY + (cy - map.camY) * 0.15;

  const x0 = Math.floor(-map.camX / scale) - 1, y0 = Math.floor(-map.camY / scale) - 1;
  const x1 = x0 + Math.ceil(W / scale) + 2, y1 = y0 + Math.ceil(H / scale) + 2;

  // 地形
  for (let y = Math.max(0, y0); y < Math.min(map.h, y1); y++) {
    for (let x = Math.max(0, x0); x < Math.min(map.w, x1); x++) {
      const t = map.terrain[tileAt(x, y)] || map.terrain['.'];
      const px = x * scale + map.camX, py = y * scale + map.camY;
      const r = seedRand(x, y, map.seed);
      const tex = TEX[t.tex || t.tile] || null;
      const ti = t.tile !== undefined ? TILES.indexOf(t.tile) : -1;
      if (tex && tex.complete && tex.naturalWidth) {
        // 手绘纹理切片：按格坐标取样保证跨格无缝连续
        const tw = tex.naturalWidth, th = tex.naturalHeight, cell = 64;
        const sx = (x * cell) % (tw - cell), sy = (y * cell) % (th - cell);
        ctx.drawImage(tex, sx, sy, cell, cell, px, py, scale + 0.5, scale + 0.5);
      } else if (ti >= 0 && tileAtlas.complete && tileAtlas.naturalWidth) {
        // 小精灵地块（树/箱/废墟等）：草地打底避免镂空
        const g = TEX.grass;
        if (g && g.complete && g.naturalWidth) {
          const tw = g.naturalWidth, th = g.naturalHeight;
          ctx.drawImage(g, (x * 64) % (tw - 64), (y * 64) % (th - 64), 64, 64, px, py, scale + 0.5, scale + 0.5);
        }
        ctx.drawImage(tileAtlas, ti * 64, 0, 64, 64, px, py, scale + 0.5, scale + 0.5);
      } else {
        ctx.fillStyle = shade(t.color, (r - 0.5) * 0.14);
        ctx.fillRect(px, py, scale + 0.5, scale + 0.5);
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = t.color;
        ctx.fillRect(px, py, scale + 0.5, scale + 0.5);
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(0,0,0,' + (r * 0.10) + ')';
        ctx.fillRect(px, py, scale + 0.5, scale + 0.5);
      }
      // 装饰
      if (t.deco && r > 0.72) {
        ctx.fillStyle = t.deco;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(px + scale * seedRand(x, y, map.seed + 1), py + scale * seedRand(x, y, map.seed + 2), scale * 0.07, 0, 7);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      // 墙体顶部高光
      if (t.block) {
        ctx.fillStyle = 'rgba(255,255,255,.06)';
        ctx.fillRect(px, py, scale + 0.5, scale * 0.14);
        ctx.fillStyle = 'rgba(0,0,0,.35)';
        ctx.fillRect(px, py + scale * 0.86, scale + 0.5, scale * 0.14);
      }
    }
  }

  // 实体
  map.entities.forEach(ent => {
    if (ent.dead) return;
    const ex = ent.x * scale + map.camX, ey = ent.y * scale + map.camY;
    const bob = Math.sin(animFrame / 25 + ent._id) * scale * 0.04;
    if (ent.t === 'enemy') {
      const edef = map.lv.enemies[ent.id];
      const img = getImg(edef.img);
      const sz = scale * (edef.boss ? 1.5 : 1.12);
      // 高清 Q 版怪物小精灵（透明底独立贴图）
      const spr = SPR_IMGS[ent.id];
      if (spr && spr.complete && spr.naturalWidth) {
        // 地面投影
        ctx.fillStyle = 'rgba(0,0,0,.35)';
        ctx.beginPath(); ctx.ellipse(ex + scale / 2, ey + scale * 0.86, sz * 0.34, sz * 0.11, 0, 0, 7); ctx.fill();
        const sH = sz * 1.1, sW = sH * spr.naturalWidth / spr.naturalHeight;
        ctx.save();
        ctx.shadowColor = edef.boss ? 'rgba(232,185,60,.8)' : 'rgba(200,52,46,.55)';
        ctx.shadowBlur = edef.boss ? 16 : 8;
        ctx.drawImage(spr, ex + scale / 2 - sW / 2, ey + scale * 0.92 - sH + bob, sW, sH);
        ctx.restore();
      } else {
        ctx.save();
        ctx.beginPath(); ctx.arc(ex + scale / 2, ey + scale / 2 + bob, sz / 2, 0, 7);
        ctx.clip();
        if (img.complete && img.naturalWidth) ctx.drawImage(img, ex + scale / 2 - sz / 2, ey + scale / 2 - sz / 2 + bob, sz, sz);
        else { ctx.fillStyle = '#7a2a2a'; ctx.fill(); }
        ctx.restore();
        ctx.strokeStyle = edef.boss ? '#e8b93c' : '#c8342e';
        ctx.lineWidth = edef.boss ? 3 : 1.5;
        ctx.beginPath(); ctx.arc(ex + scale / 2, ey + scale / 2 + bob, sz / 2, 0, 7); ctx.stroke();
      }
      // BOSS 光环
      if (edef.boss) {
        ctx.strokeStyle = 'rgba(232,185,60,' + (0.3 + 0.2 * Math.sin(animFrame / 12)) + ')';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ex + scale / 2, ey + scale / 2 + bob, sz / 2 + 6, 0, 7); ctx.stroke();
      }
    } else {
      const cxp = ex + scale / 2, cyp = ey + scale / 2 + bob;
      const R = scale * 0.5;
      // 通用：画一幅透明精灵图（锚定格底部中心）+ 呼吸光环
      const drawSpr = (key, hMul, glowColor, glowR) => {
        const pulse = 0.55 + 0.4 * Math.sin(animFrame / 12 + ent._id);
        if (glowColor) {
          ctx.fillStyle = glowColor + (pulse * 0.42) + ')';
          ctx.beginPath(); ctx.arc(cxp, cyp, scale * glowR, 0, 7); ctx.fill();
        }
        const im = SPR_IMGS[key];
        if (im && im.complete && im.naturalWidth) {
          const h = scale * hMul, w = h * im.naturalWidth / im.naturalHeight;
          ctx.drawImage(im, cxp - w / 2, cyp + scale * 0.4 - h, w, h);
        }
      };
      // 剧情点标记：黄色叹号（npc 节点悬在立绘头上，普通节点直接画在格上）
      const drawBang = (bx, by) => {
        const pu = 0.65 + 0.35 * Math.sin(animFrame / 10);
        const bob2 = Math.sin(animFrame / 9) * scale * 0.04;
        ctx.fillStyle = 'rgba(255,196,40,' + (0.32 * pu) + ')';
        ctx.beginPath(); ctx.arc(bx, by + bob2, scale * 0.36, 0, 7); ctx.fill();
        ctx.fillStyle = '#ffc428';
        ctx.beginPath(); ctx.arc(bx, by + bob2, scale * 0.26, 0, 7); ctx.fill();
        ctx.fillStyle = '#553a00';
        ctx.font = '900 ' + Math.round(scale * 0.42) + 'px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('!', bx, by + bob2 + scale * 0.02);
      };
      if (ent.t === 'node' && ent.npc) {
        drawSpr(ent.npc, 1.22, 'rgba(140,190,255,', 0.52);
        drawBang(cxp, cyp - scale * 1.06);
      } else if (ent.t === 'node') {
        const pulse = 0.6 + 0.4 * Math.sin(animFrame / 15);
        ctx.fillStyle = 'rgba(255,196,40,' + pulse * 0.3 + ')';
        ctx.beginPath(); ctx.arc(cxp, cyp, scale * 0.48, 0, 7); ctx.fill();
        drawBang(cxp, cyp);
      } else if (ent.t === 'item' && ent.item === 'stargate_shard') {
        // 任务物品：悬浮星辉水晶
        const pulse = 0.55 + 0.45 * Math.sin(animFrame / 12);
        ctx.fillStyle = 'rgba(150,200,255,' + (0.22 + pulse * 0.25) + ')';
        ctx.beginPath(); ctx.arc(cxp, cyp, scale * 0.55, 0, 7); ctx.fill();
        const cy2 = cyp - scale * 0.15 - bob * 2, R = scale * 0.3;
        ctx.save(); ctx.translate(cxp, cy2); ctx.rotate(animFrame / 60);
        ctx.fillStyle = '#9fd8ff'; ctx.strokeStyle = 'rgba(230,246,255,.95)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, -R); ctx.lineTo(R * 0.62, 0); ctx.lineTo(0, R); ctx.lineTo(-R * 0.62, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.beginPath(); ctx.moveTo(0, -R * 0.5); ctx.lineTo(R * 0.28, 0); ctx.lineTo(0, R * 0.5); ctx.lineTo(-R * 0.28, 0); ctx.closePath(); ctx.fill();
        ctx.restore();
        ctx.font = 'bold ' + Math.round(scale * 0.19) + 'px sans-serif';
        ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(180,225,255,.95)';
        ctx.fillText('星门残片', cxp, cyp - scale * 0.9);
      } else if (ent.t === 'item') {
        drawSpr(LV_OBJ[map.lv.id] || 'obj_chest', 0.92, 'rgba(255,214,90,', 0.44);
      } else if (ent.t === 'stat') {
        drawSpr('obj_altar', 1.08, 'rgba(80,220,255,', 0.5);
      } else if (ent.t === 'gear') {
        drawSpr(LV_OBJ[map.lv.id] || 'obj_chest', 1.02, 'rgba(255,140,60,', 0.48);
        // 装备箱上浮一柄小剑标识
        ctx.save(); ctx.translate(cxp, cyp - scale * 1.0 - bob * 2); ctx.rotate(-0.78);
        ctx.fillStyle = '#ffd9a0';
        ctx.beginPath(); ctx.moveTo(0, -R * 0.5); ctx.lineTo(R * 0.12, -R * 0.08); ctx.lineTo(-R * 0.12, -R * 0.08); ctx.closePath(); ctx.fill();
        ctx.fillRect(-R * 0.09, -R * 0.08, R * 0.18, R * 0.36);
        ctx.fillStyle = '#c98f4e'; ctx.fillRect(-R * 0.26, R * 0.26, R * 0.52, R * 0.1);
        ctx.restore();
      } else if (ent.t === 'portal') {
        drawSpr('obj_portal', 1.26, 'rgba(214,140,255,', 0.6);
        // 传送点名称悬浮标
        ctx.font = 'bold ' + Math.round(scale * 0.2) + 'px sans-serif';
        ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(230,190,255,.95)';
        ctx.fillText(ent.name || '传送点', cxp, cyp - scale * 0.92);
      } else if (ent.t === 'exit') {
        drawSpr('obj_portal', 1.3, 'rgba(140,220,255,', 0.62);
      }
    }
  });

  // 玩家（Q版人物：Tiny Dungeon 小精灵）
  const ppx = map.drawX * scale + map.camX + scale / 2;
  const ppy = map.drawY * scale + map.camY + scale / 2;
  const moving = Math.abs(map.drawX - map.px) + Math.abs(map.drawY - map.py) > 0.01;
  ctx.fillStyle = 'rgba(0,0,0,.5)';
  ctx.beginPath(); ctx.ellipse(ppx, ppy + scale * 0.36, scale * 0.26, scale * 0.09, 0, 0, 7); ctx.fill();
  if (heroSprite.complete && heroSprite.naturalWidth) {
    const s = scale * 1.4, sw = s * heroSprite.naturalWidth / heroSprite.naturalHeight;
    const hop = moving ? Math.abs(Math.sin(animFrame / 4)) * scale * 0.09 : 0;
    ctx.save();
    ctx.shadowColor = 'rgba(255,180,220,.5)'; ctx.shadowBlur = 10;
    if (lastDir === 'left') { ctx.translate(ppx * 2, 0); ctx.scale(-1, 1); }
    ctx.drawImage(heroSprite, ppx - sw / 2, ppy + scale * 0.34 - s - hop, sw, s);
    ctx.restore();
  } else {
    ctx.fillStyle = '#2b3140';
    ctx.beginPath(); ctx.roundRect(ppx - scale * 0.13, ppy - scale * 0.12, scale * 0.26, scale * 0.42, 4); ctx.fill();
    ctx.fillStyle = '#e8c9a8';
    ctx.beginPath(); ctx.arc(ppx, ppy - scale * 0.22, scale * 0.15, 0, 7); ctx.fill();
  }

  // 自动寻路预览（虚线轨迹）
  if (map.path.length) {
    ctx.strokeStyle = 'rgba(232,185,60,.5)'; ctx.lineWidth = 2; ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(ppx, ppy);
    map.path.forEach(([x, y]) => ctx.lineTo(x * scale + map.camX + scale / 2, y * scale + map.camY + scale / 2));
    ctx.stroke(); ctx.setLineDash([]);
  }

  // 黑暗氛围（视线遮蔽）
  const dark = map.dark ?? 0.55;
  const vg = ctx.createRadialGradient(ppx, ppy, scale * 2.2, ppx, ppy, scale * 8.5);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, `rgba(0,0,0,${dark})`);
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  renderMinimap();

  // 相邻可交互提示
  const hint = $('interact-hint');
  if (hint) {
    const ENT_LABEL = { enemy: '⚔ 战斗', node: '❗ 剧情', item: '✦ 物资', stat: '❖ 强化', gear: '⚒ 装备', exit: '▲ 出口', portal: '⟿ 传送' };
    const near = map.entities.find(e => !e.dead && Math.abs(e.x - map.px) + Math.abs(e.y - map.py) === 1);
    if (near) { hint.textContent = (ENT_LABEL[near.t] || '?') + ' · 走过去触发'; hint.classList.remove('hidden'); }
    else hint.classList.add('hidden');
  }
}

/* ---------- 小地图 ---------- */
function renderMinimap() {
  const mm = $('minimap');
  if (!mm) return;
  const MW = 148;
  const ms = MW / map.w;
  const MH = Math.round(map.h * ms);
  const dpr = window.devicePixelRatio || 1;
  if (mm.width !== MW * dpr || mm.height !== MH * dpr) { mm.width = MW * dpr; mm.height = MH * dpr; mm.style.width = MW + 'px'; mm.style.height = MH + 'px'; }
  const mc = mm.getContext('2d');
  mc.setTransform(dpr, 0, 0, dpr, 0, 0);
  mc.fillStyle = 'rgba(8,8,14,.82)';
  mc.beginPath(); mc.roundRect(0, 0, MW, MH, 8); mc.fill();
  for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
    const t = map.terrain[tileAt(x, y)] || map.terrain['.'];
    mc.fillStyle = t.color || '#333';
    mc.fillRect(x * ms, y * ms, ms + 0.5, ms + 0.5);
  }
  map.entities.forEach(e => {
    if (e.dead) return;
    mc.fillStyle = e.t === 'enemy' ? (map.lv.enemies[e.id]?.boss ? '#e8b93c' : '#ff5a4a')
      : e.t === 'exit' ? '#8ad0ff' : e.t === 'portal' ? '#e07aff' : e.t === 'node' ? '#ffd23c' : e.t === 'stat' ? '#6ae4ff' : e.t === 'gear' ? '#ff9a5a' : '#ffe06a';
    mc.beginPath(); mc.arc(e.x * ms + ms / 2, e.y * ms + ms / 2, Math.max(1.5, ms * 0.7), 0, 7); mc.fill();
  });
  mc.fillStyle = '#fff';
  mc.beginPath(); mc.arc(map.px * ms + ms / 2, map.py * ms + ms / 2, 3, 0, 7); mc.fill();
  mc.strokeStyle = 'rgba(255,255,255,.8)'; mc.lineWidth = 1;
  mc.beginPath(); mc.arc(map.px * ms + ms / 2, map.py * ms + ms / 2, 4.5, 0, 7); mc.stroke();
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + Math.round(amt * 255), g = ((n >> 8) & 255) + Math.round(amt * 255), b = (n & 255) + Math.round(amt * 255);
  return `rgb(${clamp(r, 0, 255)},${clamp(g, 0, 255)},${clamp(b, 0, 255)})`;
}

/* ---------- 主循环 ---------- */
function gameLoop() {
  animFrame++;
  const gameVisible = !$('game-screen').classList.contains('hidden');
  if (map && !Array.isArray(map.path)) map.path = [];
  if (gameVisible && map && !combat && !map.dialogOpen) {
    // 键盘连续移动
    let dx = 0, dy = 0;
    if (keys['arrowup'] || keys['w']) dy = -1;
    else if (keys['arrowdown'] || keys['s']) dy = 1;
    else if (keys['arrowleft'] || keys['a']) dx = -1;
    else if (keys['arrowright'] || keys['d']) dx = 1;
    map.moveCool = (map.moveCool || 0) - 1;
    if (dx || dy) map.path = [];  // 手动按键接管，取消寻路
    if ((dx || dy) && map.moveCool <= 0) { if (tryMove(dx, dy)) map.moveCool = 7; }
    // 点击路径
    if (map.path.length && map.moveCool <= 0) {
      const [nx, ny] = map.path[0];
      const ddx = nx - map.px, ddy = ny - map.py;
      if (Math.abs(ddx) + Math.abs(ddy) !== 1) map.path = [];
      else {
        const ent = entAt(nx, ny);
        if (ent) { map.path = []; interact(ent); }
        else { map.px = nx; map.py = ny; map.path.shift(); map.moveCool = 7; markVisited(nx, ny); useTime(1); }
      }
    }
    // 原地不动也流逝时间：每 ~1.2 秒扣 1
    if (animFrame % 72 === 0) useTime(1);
    // 敌人游荡/追击：非Boss在视野内主动扑向玩家（撞上即开战），Boss 镇守不动
    if (animFrame % 30 === 0) {
      map.entities.forEach(ent => {
        if (combat || ent.dead || ent.t !== 'enemy') return;
        const edef = map.lv.enemies[ent.id] || {};
        if (!edef.boss) {
          const dist = Math.abs(map.px - ent.x) + Math.abs(map.py - ent.y);
          if (dist === 1) { startBattle(ent); return; }
          if (dist <= 7) {
            const p = bfsPath(ent.x, ent.y, map.px, map.py);
            if (p && p.length && p.length <= 9) {
              const [nx, ny] = p[0];
              if (nx === map.px && ny === map.py) { startBattle(ent); return; }
              if (walkable(nx, ny) && !entAt(nx, ny)) { ent.x = nx; ent.y = ny; return; }
            }
          }
        }
        if (ent.patrol) {
          ent._pi = ((ent._pi || 0) + 1) % ent.patrol.length;
          const [nx, ny] = ent.patrol[ent._pi];
          if (walkable(nx, ny) && !entAt(nx, ny) && !(nx === map.px && ny === map.py)) { ent.x = nx; ent.y = ny; }
        } else if (Math.random() < 0.3) {
          const dirs = Object.values(DIRS);
          const [dx, dy] = dirs[Math.floor(Math.random() * 4)];
          const nx = ent.x + dx, ny = ent.y + dy;
          if (walkable(nx, ny) && !entAt(nx, ny) && !(nx === map.px && ny === map.py)) { ent.x = nx; ent.y = ny; }
        }
      });
    }
    // 平滑绘制位置
    map.drawX += (map.px - map.drawX) * 0.25;
    map.drawY += (map.py - map.drawY) * 0.25;
  }
  // 主神空间停留时间
  if (S && (!$('hub-screen').classList.contains('hidden') || !$('sys-screen').classList.contains('hidden')) && animFrame % 72 === 0 && !S.cheat.timeStop) {
    S.hubTime = Math.max(0, (S.hubTime || 0) - 1);
    shopTick();
    const el = $('hub-time-num'); if (el) el.textContent = fmtTime(S.hubTime);
    if (S.hubTime <= 0) { toast('停留时间耗尽，主神将你送入下一扇门'); nextLevel(); }
  }
  try {
    if (combat) combatTick();
    renderMap();
  } catch (e) { console.error('frame', e); }
  requestAnimationFrame(gameLoop);
}

/* ---------- 主神空间 ---------- */
function openHub() {
  showScreen('hub-screen');
  AudioSys.playTrack('hub');
  if (!S.hubTime || S.hubTime <= 0) S.hubTime = HUB_TIME;
  $('hub-points-num').textContent = S.pts;
  $('hub-time-num').textContent = fmtTime(S.hubTime);
  renderGrades();
  const newbie = !S.started;
  $('hub-desc').textContent = newbie
    ? '新手礼包已发放——1200 积分到账。先在主神空间兑换装备/同伴，再踏入第一扇门。'
    : '光球悬浮在中央，无数光门环绕。用积分兑换强化，然后踏入下一扇门。';
  $('btn-next-level').textContent = S.shopReturn ? '返回当前关卡' : newbie ? '整装完毕，进入第一关' : '进入下一关';
  // 任务线提示
  const qh = $('quest-hint');
  if (qh) {
    const shards = S.inv['stargate_shard'] || 0, hasKey = (S.inv['fate_key'] || 0) > 0;
    if (S.cleared.includes(9)) qh.textContent = '✦ 终局已攻略——轮回的尽头已被你点亮';
    else if (S.li === 8 || (S.cleared.includes(8) && !hasKey)) qh.textContent = hasKey ? '✦ 命运之钥已入手——终局之门随时可以推开' : '✦ 任务线：在荒岛丛林背阴处找到「命运祭坛」，取下命运之钥才能开启终局';
    else if (S.cleared.length >= 7 || S.li >= 7) qh.textContent = `✦ 任务线：第九扇光门需要 4 枚星门残片（${Math.min(shards, 4)}/4）——藏在规则怪谈/深渊渔村/纸扎古村/收容失效的子地图里`;
    else qh.textContent = '';
  }
  autoSave();
}

const SHOP_TABS = [['gear', '装备'], ['item', '道具'], ['skill', '技能'], ['blood', '血统职业'], ['team', '同伴'], ['heal', '休整']];
function openShop() {
  if (!SHOP_TABS.some(t => t[0] === hubTab)) hubTab = 'gear';
  openModal('🏪 主神商店', true);
  renderShop($('modal-body'));
}
function renderShop(box) {
  if (!box) return;
  box.innerHTML = '';
  const tabs = document.createElement('div'); tabs.className = 'shop-tabs';
  SHOP_TABS.forEach(([id, label]) => {
    const t = document.createElement('button');
    t.className = 'tab' + (hubTab === id ? ' active' : ''); t.textContent = label;
    t.onclick = () => { hubTab = id; AudioSys.sfx('click'); renderShop(box); };
    tabs.appendChild(t);
  });
  const grid = document.createElement('div'); grid.className = 'shop-grid';
  box.appendChild(tabs); box.appendChild(grid);
  let list = [];
  if (hubTab === 'gear') {
    list = GAME_DATA.shopItems.filter(id => ['weapon', 'armor', 'acc'].includes(GAME_DATA.items[id].type)).map(id => {
      const it = GAME_DATA.items[id];
      const owned = S.weapon === id || S.armor === id || S.acc === id;
      return {
        name: it.name + (owned ? '（装备中）' : ''), desc: it.desc, cost: it.price, owned, g: it.g, gcnt: it.g ? 1 : 0,
        buy: () => {
          S.inv[id] = (S.inv[id] || 0) + 1;
          if (it.type === 'weapon') S.weapon = id;
          else if (it.type === 'armor') S.armor = id;
          else if (it.type === 'acc') S.acc = id;
        }
      };
    });
  } else if (hubTab === 'item') {
    list = GAME_DATA.shopItems.filter(id => GAME_DATA.items[id].type === 'consumable').map(id => {
      const it = GAME_DATA.items[id];
      return {
        name: `${it.name}（持有 ${S.inv[id] || 0}）`, desc: it.desc, cost: it.price, g: it.g, gcnt: it.g ? 1 : 0,
        buy: () => { S.inv[id] = (S.inv[id] || 0) + 1; }
      };
    });
  } else if (hubTab === 'skill') {
    list = GAME_DATA.shopSkills.map(id => {
      const sk = GAME_DATA.skills[id];
      const owned = S.skills.includes(id);
      return { name: sk.name + (owned ? '（已学会）' : ''), desc: `${sk.desc}（消耗 ${sk.sanCost} 精神力）`, cost: sk.price, owned, g: sk.g, gcnt: sk.g ? 1 : 0, buy: () => S.skills.push(id) };
    });
  } else if (hubTab === 'blood') {
    const unlockTxt = d => [d.lv5 && `Lv5觉醒「${GAME_DATA.skills[d.lv5.skill]?.name}」`, d.lv7 && `Lv7超凡`, d.lv10 && `Lv10完美「${GAME_DATA.skills[d.lv10.skill]?.name}」`].filter(Boolean).join(' ');
    Object.keys(GAME_DATA.bloodlines).forEach(id => {
      const b = GAME_DATA.bloodlines[id];
      const owned = S.blood === id;
      const p = (S.bloodProg || {})[id];
      list.push({
        name: '🧬 ' + b.name + (p ? ` Lv.${p.lv}` : '') + (owned ? '（觉醒中）' : ''),
        desc: b.desc + (unlockTxt(b) ? '｜' + unlockTxt(b) : '') + (p && p.lv < 10 ? `｜经验 ${p.xp}/${LV_XP[p.lv]}` : p ? '｜已满级' : ''),
        cost: b.price, owned, g: b.g, gcnt: b.g ? 1 : 0,
        buy: () => { S.blood = id; progOf('blood', id); }
      });
    });
    Object.keys(GAME_DATA.classes).forEach(id => {
      const c = GAME_DATA.classes[id];
      const owned = S.cls === id;
      const p = (S.clsProg || {})[id];
      list.push({
        name: '⚔ ' + c.name + (p ? ` Lv.${p.lv}` : '') + (owned ? '（在职）' : ''),
        desc: c.desc + (unlockTxt(c) ? '｜' + unlockTxt(c) : '') + (p && p.lv < 10 ? `｜经验 ${p.xp}/${LV_XP[p.lv]}` : p ? '｜已满级' : ''),
        cost: c.price, owned, g: c.g, gcnt: c.g ? 1 : 0,
        buy: () => {
          S.cls = id;
          const pr = progOf('cls', id);
          const unl = [];
          if (c.skills && c.skills[0]) unl.push(c.skills[0]);
          if (pr.lv >= 3 && c.skills && c.skills[1]) unl.push(c.skills[1]);
          if (pr.lv >= 5 && c.lv5 && c.lv5.skill) unl.push(c.lv5.skill);
          if (pr.lv >= 7 && c.lv7 && c.lv7.skill) unl.push(c.lv7.skill);
          if (pr.lv >= 10 && c.lv10 && c.lv10.skill) unl.push(c.lv10.skill);
          unl.forEach(sid => { if (!S.skills.includes(sid)) { S.skills.push(sid); toast('习得技能：' + GAME_DATA.skills[sid].name); } });
        }
      });
    });
  } else if (hubTab === 'team') {
    if (!S.team) S.team = [];
    if (!S.roster) S.roster = [];
    const full = S.team.length >= 2;
    const staffed = staffedIds();
    const shopOf = id => (S.shops || []).find(s => s.ally === id);
    Object.keys(GAME_DATA.allies).forEach(id => {
      const a = GAME_DATA.allies[id];
      const owned = S.team.includes(id);
      const onDuty = staffed.includes(id);
      const dutyShop = onDuty ? GAME_DATA.shops[shopOf(id).id].name : '';
      const skillTxt = a.shop ? `｜经营专长：${GAME_DATA.shops[a.shop.tag].name} +${a.shop.pct}%` : '';
      if (a.price === 0) {
        // 事件专属同伴：只在偶遇中结伴加入编队
        const met = S.roster.includes(id);
        list.push({
          name: '👥 ' + a.name + (owned ? '（同行中）' : onDuty ? `（驻店·${dutyShop}）` : met ? '（待命）' : '（？？？）'),
          desc: met || onDuty ? `${a.desc}｜HP ${a.hp} / 攻击 ${a.atk}${skillTxt}` : '在主神空间的偶遇事件中有几率结识',
          cost: 0, owned: owned || full || !met || onDuty,
          buy: () => { if (met && !owned && !full && !onDuty) { S.team.push(id); S.roster = S.roster.filter(x => x !== id); } }
        });
      } else {
        list.push({
          name: '👥 ' + a.name + (owned ? '（同行中）' : onDuty ? `（驻店·${dutyShop}）` : ''), desc: `${a.desc}｜HP ${a.hp} / 攻击 ${a.atk}${skillTxt}`,
          cost: a.price, owned: owned || full || onDuty, g: a.g, gcnt: a.g ? 1 : 0,
          buy: () => { if (!S.team.includes(id) && !onDuty && S.team.length < 2) S.team.push(id); }
        });
      }
    });
    if (full) list.push({ name: '队伍已满', desc: '最多同时携带 2 名同伴进入关卡', cost: 0, owned: true, buy: () => {} });
  } else {
    const rb = 1 + (fmod().restBoost || 0) / 100;
    list = [
      { name: '完全恢复 HP', desc: '治疗所有伤势' + (rb > 1 ? '（床铺加成生效）' : ''), cost: 80, buy: () => { S.hp = d_maxHp(); S.san = clamp(S.san + Math.floor(d_maxSan() * 0.2 * (rb - 1)), 0, d_maxSan()); } },
      { name: '完全恢复精神力', desc: '抚平精神创伤', cost: 80, buy: () => { S.san = d_maxSan(); } },
      { name: 'HP 上限 +20', desc: '永久强化肉体（体质+2）', cost: 300, buy: () => { S.con += 2; } },
      { name: '精神力上限 +20', desc: '永久强化心智（精神+2）', cost: 300, buy: () => { S.men += 2; } },
    ];
  }
  list.forEach(item => {
    const row = document.createElement('div');
    row.className = 'shop-item' + (item.owned ? ' owned' : '');
    const g = item.g;
    // 高级商品：评级徽章 + 积分双货币
    const costHtml = g
      ? `<span class="grade-chip g${g}">${g}×${item.gcnt || 1}</span><span class="si-cost" style="margin-left:6px">+ ${item.cost}分</span>`
      : `<span class="si-cost">${item.cost}分</span>`;
    row.innerHTML = `<div class="si-info"><div class="si-name">${item.name}</div><div class="si-desc">${item.desc}</div></div>${costHtml}`;
    const b = document.createElement('button');
    b.className = 'btn'; b.textContent = item.owned ? '已购' : '兑换';
    const afford = g ? ((S.grade[g] || 0) >= (item.gcnt || 1) && S.pts >= item.cost) : S.pts >= item.cost;
    b.disabled = item.owned || !afford;
    b.onclick = () => {
      if (g) {
        if ((S.grade[g] || 0) < (item.gcnt || 1) || S.pts < item.cost) return;
        S.grade[g] -= item.gcnt || 1;
        S.pts -= item.cost;
      } else {
        if (S.pts < item.cost) return;
        S.pts -= item.cost;
      }
      item.buy();
      AudioSys.sfx('coin'); toast('兑换成功');
      $('hub-points-num').textContent = S.pts;
      renderGrades(); renderBars(); renderShop(box);
    };
    row.appendChild(b); grid.appendChild(row);
  });
}

function nextLevel() {
  const ret = S.shopReturn; S.shopReturn = false;
  if (!S.started) { AudioSys.sfx('door'); enterLevel(S.li); return; }
  if (ret) { // 从修改器中途进的主神空间：回到当前关
    AudioSys.sfx('door'); enterLevel(S.li, true); return;
  }
  if (S.li >= GAME_DATA.levels.length - 1) { toast('已是最终关'); return; }
  // 任务线门控：第九关需要集齐 4 枚星门残片（散落在第 4/6/7/8 关的子地图）；终局需要第九关命运祭坛的钥匙
  const nxt = S.li + 1;
  if (nxt === 8) {
    const shards = S.inv['stargate_shard'] || 0;
    if (shards < 4) {
      toast(`第九扇光门被星尘封锁——需要 4 枚星门残片（当前 ${shards}/4）`);
      setTimeout(() => toast('残片藏在：规则怪谈·天台水箱间 / 深渊渔村·雾港灯塔 / 纸扎古村·纸扎铺 / 收容失效·地下实验室'), 1700);
      return;
    }
  }
  if (nxt === 9 && !(S.inv['fate_key'] > 0)) {
    toast('终局之门没有锁孔——第九关的「命运祭坛」藏着唯一的钥匙');
    return;
  }
  AudioSys.sfx('door');
  enterLevel(S.li + 1);
}

/* 重返副本：花积分重进已通关的关卡 */
function openRevisit() {
  const body = $('modal-body'); body.innerHTML = '';
  const card = document.createElement('div'); card.className = 'ev-card';
  card.innerHTML = '<h3>重返副本</h3><p>已通关的世界化作稳定的光门，随时可以花积分重访——重访会重置该关的敌人、物资与剧情，重复通关可继续赚取积分、徽章与经验。探索度不足时重访低层世界也是刷评级的捷径。</p>';
  body.appendChild(card);
  const list = document.createElement('div');
  let any = false;
  GAME_DATA.levels.forEach((lv, i) => {
    if (!S.cleared.includes(i)) return;
    any = true;
    const cost = 300 + i * 150;
    const row = document.createElement('div'); row.className = 'shop-item';
    row.innerHTML = `<div class="si-info"><div class="si-name">${lv.title}${S.bestGrade[lv.id] ? ' · 最佳 ' + S.bestGrade[lv.id] : ''}</div><div class="si-desc">重置地图、敌人与物资，重新通关结算</div></div><span class="si-cost">${cost}分</span>`;
    const b = document.createElement('button'); b.className = 'btn'; b.textContent = '进入';
    b.disabled = S.pts < cost;
    b.onclick = () => {
      if (S.pts < cost) return;
      S.pts -= cost; closeModal(); AudioSys.sfx('door');
      toast('光门重组——重返 ' + lv.title);
      enterLevel(i);
    };
    row.appendChild(b); list.appendChild(row);
  });
  if (!any) { const p = document.createElement('p'); p.style.opacity = '.7'; p.textContent = '还没有通关过的世界——先去打通一个副本吧。'; list.appendChild(p); }
  body.appendChild(list);
  openModal('🌀 重返副本');
}

/* 主神空间系统入口 */
const SYS_TABS = [
  ['room', '🛋️', '私人空间'], ['street', '🏙️', '轮回者街区'], ['garden', '🌿', '灵植园'],
  ['beast', '🦊', '灵兽园'], ['alchemy', '⚗️', '炼丹房'], ['event', '🚪', '光门回廊'], ['grade', '🎖️', '评级徽章']
];
function openSysModal(sys) {
  AudioSys.sfx('click');
  if (sys === 'shop') { openShop(); return; }
  if (sys === 'god') { godDialog(); return; }
  if (sys === 'return') { openRevisit(); return; }
  showScreen('sys-screen');
  const rail = $('sys-rail'); rail.innerHTML = '';
  SYS_TABS.forEach(([id, ico, name]) => {
    const t = document.createElement('div'); t.className = 'sys-tab' + (id === sys ? ' on' : '');
    t.innerHTML = `<b>${ico}</b>${name}`;
    t.onclick = () => openSysModal(id);
    rail.appendChild(t);
  });
  const back = document.createElement('div'); back.className = 'sys-tab sys-back';
  back.innerHTML = '<b>↩</b>返回大厅';
  back.onclick = () => showScreen('hub-screen');
  rail.appendChild(back);
  const body = $('sys-main'); body.innerHTML = '';
  ({ event: renderEvents, room: renderRoom, street: renderStreet, garden: renderGarden, beast: renderBeast, alchemy: renderAlchemy, grade: renderGradeTab }[sys] || renderEvents)(body);
}

/* ---------- 存档 ---------- */
const SAVE_KEY = 'qiu_sheng_wuxian_v2_';
function autoSave() {
  if (!S) return;
  S.px = map ? map.px : S.px; S.py = map ? map.py : S.py;
  try { localStorage.setItem(SAVE_KEY + 'auto', JSON.stringify(S)); } catch (e) {}
}
function saveSlot(n) { autoSave(); S.savedAt = new Date().toLocaleString('zh-CN'); localStorage.setItem(SAVE_KEY + n, JSON.stringify(S)); toast(`已存到档位 ${n}`); }
function loadSlot(n) {
  const raw = localStorage.getItem(SAVE_KEY + n);
  if (!raw) { toast('空档位'); return; }
  S = JSON.parse(raw);
  S.grade = S.grade || { S: 0, A: 0, B: 0, C: 0 };
  S.bestGrade = S.bestGrade || {}; S.explored = S.explored || {};
  S.seenEnts = S.seenEnts || []; S.furn = S.furn || []; S.roster = S.roster || [];
  S.shops = S.shops || []; S.shopStock = S.shopStock || {}; S.shopAccr = S.shopAccr || 0;
  S.furnStock = S.furnStock || {};
  S.roomId = S.roomId || 'studio'; S.roomsOwned = S.roomsOwned || ['studio'];
  S.roomFurn = S.roomFurn || { studio: [] };
  if (S.furn && S.furn.length) { S.roomFurn.studio = (S.roomFurn.studio || []).concat(S.furn); S.furn = []; }
  S.garden = S.garden || []; S.beasts = S.beasts || []; S.brew = S.brew || null;
  S.bloodProg = S.bloodProg || {}; S.clsProg = S.clsProg || {};
  if (S.cheat && S.cheat.timeStop === undefined) S.cheat.timeStop = false;
  S.hubTime = S.hubTime || 0;
  AudioSys.setMuted(!!S.muted);
  closeModal(); closeDialog();
  enterLevel(S.li, true);
  map.px = S.px; map.py = S.py; map.drawX = S.px; map.drawY = S.py;
  toast('读取成功');
}
function slotInfo(n) {
  const raw = localStorage.getItem(SAVE_KEY + n);
  if (!raw) return '空';
  try { const d = JSON.parse(raw); return `${GAME_DATA.levels[d.li]?.title || ''} · ${d.savedAt || ''}`; } catch (e) { return '空'; }
}
function openSaveModal() {
  const body = $('modal-body'); body.innerHTML = '';
  ['auto', 1, 2, 3, 4].forEach(n => {
    const row = document.createElement('div'); row.className = 'modal-row';
    row.innerHTML = `<span>${n === 'auto' ? '自动存档' : '档位 ' + n}：${slotInfo(n)}</span>`;
    if (n !== 'auto') { const b = document.createElement('button'); b.className = 'btn'; b.textContent = '存入'; b.onclick = () => { saveSlot(n); openSaveModal(); }; row.appendChild(b); }
    body.appendChild(row);
  });
  openModal('保存进度');
}
function openLoadModal() {
  const body = $('modal-body'); body.innerHTML = '';
  ['auto', 1, 2, 3, 4].forEach(n => {
    const row = document.createElement('div'); row.className = 'modal-row';
    row.innerHTML = `<span>${n === 'auto' ? '自动存档' : '档位 ' + n}：${slotInfo(n)}</span>`;
    const b = document.createElement('button'); b.className = 'btn'; b.textContent = '读取';
    b.disabled = slotInfo(n) === '空';
    b.onclick = () => loadSlot(n);
    row.appendChild(b); body.appendChild(row);
  });
  openModal('读取进度');
}

/* ---------- 修改器 / 状态 ---------- */
function openCheatModal() {
  const body = $('modal-body');
  body.innerHTML = `
    <div class="modal-row"><span>积分 +5000</span><button class="btn" id="ch-pts">使用</button></div>
    <div class="modal-row"><span>积分设为</span><input id="ch-pts-num" type="number" min="0" value="${S ? S.pts : 0}" style="width:110px;background:#0c0c14;border:1px solid var(--line);color:#eee;padding:6px 8px;border-radius:6px;font-size:14px"><button class="btn" id="ch-pts-set">设定</button></div>
    <div class="modal-row"><span>HP / 精神力全满</span><button class="btn" id="ch-heal">使用</button></div>
    <div class="modal-row"><span>全属性 +5</span><button class="btn" id="ch-stat">使用</button></div>
    <div class="modal-row"><span>血统经验 +300</span><button class="btn" id="ch-bxp">使用</button></div>
    <div class="modal-row"><span>职业经验 +300</span><button class="btn" id="ch-cxp">使用</button></div>
    <div class="modal-row"><span>解锁全部关卡</span><button class="btn" id="ch-unlock">使用</button></div>
    <div class="modal-row"><span>清空本关怪物</span><button class="btn" id="ch-clear">使用</button></div>
    <div class="modal-row cheat-toggle"><span>无敌模式：<b id="ch-god-v">${S?.cheat.god ? '开' : '关'}</b></span><button class="btn" id="ch-god">切换</button></div>
    <div class="modal-row cheat-toggle"><span>一击必杀：<b id="ch-one-v">${S?.cheat.one ? '开' : '关'}</b></span><button class="btn" id="ch-one">切换</button></div>
    <div class="modal-row cheat-toggle"><span>时间冻结：<b id="ch-time-v">${S?.cheat.timeStop ? '开' : '关'}</b></span><button class="btn" id="ch-time">切换</button></div>
    <div class="modal-row"><span>S 级徽章 +1</span><button class="btn" id="ch-gs">使用</button></div>
    <div class="modal-row"><span>A 级徽章 +3</span><button class="btn" id="ch-ga">使用</button></div>
    <div class="modal-row"><span>随时随地打开主神商店</span><button class="btn" id="ch-shop">进入</button></div>
    <div class="modal-row" style="flex-direction:column;align-items:stretch"><span>跳关（直接查看地图）</span><div id="ch-jump" style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px"></div></div>`;
  const jumpBox = $('ch-jump');
  GAME_DATA.levels.forEach((lv, i) => {
    const b = document.createElement('button');
    b.className = 'btn'; b.style.fontSize = '12px'; b.style.padding = '4px 2px';
    b.textContent = (i + 1);
    b.title = lv.title;
    b.onclick = () => { closeModal(); S.unlocked = Math.max(S.unlocked, i); enterLevel(i); toast('跳转到第' + (i + 1) + '关'); };
    jumpBox.appendChild(b);
  });
  $('ch-pts').onclick = () => { S.pts += 5000; renderBars(); toast('+5000 积分'); };
  $('ch-pts-set').onclick = () => { const v = Math.max(0, Math.floor(+$('ch-pts-num').value || 0)); S.pts = v; renderBars(); toast('积分已设为 ' + v); };
  $('ch-heal').onclick = () => { S.hp = d_maxHp(); S.san = d_maxSan(); renderBars(); toast('状态全满'); };
  $('ch-stat').onclick = () => { Object.keys(STAT_NAMES).forEach(k => S[k] += 5); renderBars(); toast('全属性 +5'); };
  $('ch-bxp').onclick = () => { if (!S.blood) { toast('还没有血统'); return; } grantXp('blood', 300); toast('血统经验 +300'); };
  $('ch-cxp').onclick = () => { if (!S.cls) { toast('还没有职业'); return; } grantXp('cls', 300); toast('职业经验 +300'); };
  $('ch-unlock').onclick = () => { S.unlocked = GAME_DATA.levels.length - 1; toast('全部关卡已解锁'); };
  $('ch-clear').onclick = () => { map.entities.forEach(e => { if (e.t === 'enemy' && !e.dead) { e.dead = true; S.deadEnts.push(entKey(e)); } }); toast('本关怪物已清空'); };
  $('ch-god').onclick = () => { S.cheat.god = !S.cheat.god; $('ch-god-v').textContent = S.cheat.god ? '开' : '关'; };
  $('ch-one').onclick = () => { S.cheat.one = !S.cheat.one; $('ch-one-v').textContent = S.cheat.one ? '开' : '关'; };
  $('ch-time').onclick = () => { S.cheat.timeStop = !S.cheat.timeStop; $('ch-time-v').textContent = S.cheat.timeStop ? '开' : '关'; toast(S.cheat.timeStop ? '时间已冻结' : '时间恢复流动'); };
  $('ch-gs').onclick = () => { addGrade('S'); toast('S 徽章 +1'); };
  $('ch-ga').onclick = () => { addGrade('A'); addGrade('A'); addGrade('A'); toast('A 徽章 +3'); };
  $('ch-shop').onclick = () => {
    if (combat) { toast('战斗中无法进入主神空间'); return; }
    closeModal(); closeDialog();
    S.shopReturn = true;
    if (map) map.path = [];
    openHub();
    toast('已传送至主神空间——「返回当前关卡」可回到原位置');
  };
  openModal('内置修改器');
}

function openStatusModal() {
  const lvRow = (label, def, p) => {
    if (!def) return `<div class="lvprog"><span class="lv-name">${label}：无</span></div>`;
    const maxed = p.lv >= 10;
    const lo = LV_XP[p.lv - 1] || 0, hi = LV_XP[p.lv] || p.xp;
    const pct = maxed ? 100 : clamp((p.xp - lo) / (hi - lo) * 100, 0, 100);
    const ms = p.lv >= 10 ? ' · 完美' : p.lv >= 7 ? ' · 超凡' : p.lv >= 5 ? ' · 觉醒' : '';
    return `<div class="lvprog"><span class="lv-name">${label}：${def.name} <b>Lv.${p.lv}</b>${ms}</span><div class="lv-track"><div class="lv-fill" style="width:${pct}%"></div></div><span class="lv-xp">${maxed ? 'MAX' : p.xp + '/' + hi}</span></div>`;
  };
  const cells = Object.keys(STAT_NAMES).map(k => {
    const eff = est(k);
    return `<div class="stat-cell">${STAT_NAMES[k]}<b>${eff}</b>${eff !== S[k] ? `<i class="stat-base">基础${S[k]}</i>` : ''}${S.statPts > 0 ? `<button class="stat-plus" data-stat="${k}">+</button>` : ''}</div>`;
  }).join('');
  const slotRow = (label, slot, icon) => {
    const it = S[slot] && GAME_DATA.items[S[slot]];
    return `<div class="eq-slot"><span class="eq-icon">${icon}</span><div class="eq-info"><b>${label}：${it ? it.name : '空'}</b><span>${it ? it.desc : '在下方背包中点击装备'}</span></div>${it ? `<button class="btn sm" data-uneq="${slot}">卸下</button>` : ''}</div>`;
  };
  const bag = Object.keys(S.inv).map(id => {
    const it = GAME_DATA.items[id]; if (!it) return '';
    let act = '';
    if (['weapon', 'armor', 'acc'].includes(it.type)) act = `<button class="btn sm" data-eq="${id}">装备</button>`;
    else if (it.type === 'consumable' && !it.sureFlee && !it.revive) act = `<button class="btn sm" data-use="${id}">使用</button>`;
    if (it.price) act += `<button class="btn sm dim" data-sell="${id}">卖出+${Math.floor(it.price / 2)}</button>`;
    return `<div class="bag-cell"><b>${it.name} <i>×${S.inv[id]}</i></b><span>${it.desc}</span>${act}</div>`;
  }).join('') || '<div style="color:var(--dim);font-size:12px">空空如也</div>';
  const sks = S.skills.map(id => GAME_DATA.skills[id].name).join('、') || '无';
  $('modal-body').innerHTML = `
    <div class="sheet">
      <div class="sheet-left">
        <div class="sheet-portrait"><img src="${heroImg()}" alt=""></div>
        <div class="sheet-meta">${GAME_DATA.bloodlines[S.blood]?.name || '凡人'} · ${GAME_DATA.classes[S.cls]?.name || '无职业'}<br>同伴：${(S.team || []).map(id => GAME_DATA.allies[id]?.name).join('、') || '无'}</div>
        ${lvRow('血统', GAME_DATA.bloodlines[S.blood], bloodLv())}
        ${lvRow('职业', GAME_DATA.classes[S.cls], clsLv())}
        <div class="sheet-bars">
          <div class="bar hp"><div class="bar-track"><div class="bar-fill" style="width:${clamp(S.hp / d_maxHp() * 100, 0, 100)}%"></div></div><span class="bar-num">HP ${Math.max(0, S.hp)}/${d_maxHp()}</span></div>
          <div class="bar san"><div class="bar-track"><div class="bar-fill" style="width:${clamp(S.san / d_maxSan() * 100, 0, 100)}%"></div></div><span class="bar-num">精神 ${Math.max(0, S.san)}/${d_maxSan()}</span></div>
        </div>
      </div>
      <div class="sheet-right">
        <div class="sheet-sec">属性${S.statPts > 0 ? `（可用 <b style="color:var(--gold)">${S.statPts}</b> 点，点 + 加点）` : ''}</div>
        <div class="stat-grid">${cells}</div>
        <div class="stat-grid derived"><div class="stat-cell">攻击<b>${d_atk()}</b></div><div class="stat-cell">防御<b>${d_def()}</b></div><div class="stat-cell">闪避<b>${Math.round(d_dodge())}%</b></div><div class="stat-cell">暴击<b>${Math.round(d_crit())}%</b></div></div>
        <div class="sheet-sec">装备</div>
        ${slotRow('武器', 'weapon', '武')}
        ${slotRow('防具', 'armor', '甲')}
        ${slotRow('饰品', 'acc', '饰')}
        <div class="sheet-sec">同伴（${(S.team || []).length}/2）</div>
        ${allyPanel()}
        <div class="sheet-sec">背包</div>
        <div class="bag-grid">${bag}</div>
        <div class="sheet-sec">技能</div>
        <div style="font-size:12px;color:var(--dim)">${sks}</div>
        <div class="sheet-sec">战绩</div>
        <div style="font-size:12px;color:var(--dim)">击杀 ${S.kills} · 死亡 ${S.deaths} · 已通关 ${S.cleared.length}/10</div>
      </div>
    </div>`;
  $('modal-body').querySelectorAll('.stat-plus').forEach(b => {
    b.onclick = () => {
      if (S.statPts <= 0) return;
      S.statPts--; S[b.dataset.stat]++;
      AudioSys.sfx('level'); openStatusModal(); renderBars();
    };
  });
  $('modal-body').querySelectorAll('[data-uneq]').forEach(b => {
    b.onclick = () => { S[b.dataset.uneq] = null; AudioSys.sfx('item'); openStatusModal(); };
  });
  $('modal-body').querySelectorAll('[data-eq]').forEach(b => {
    b.onclick = () => {
      const it = GAME_DATA.items[b.dataset.eq];
      S[it.type] = b.dataset.eq;
      AudioSys.sfx('item'); toast('已装备 ' + it.name); openStatusModal();
    };
  });
  $('modal-body').querySelectorAll('[data-use]').forEach(b => {
    b.onclick = () => {
      const id = b.dataset.use, it = GAME_DATA.items[id];
      if (it.heal) S.hp = clamp(S.hp + it.heal, 0, d_maxHp());
      if (it.sanHeal) S.san = clamp(S.san + it.sanHeal, 0, d_maxSan());
      if (it.stat) { S[it.stat]++; }
      if (it.stats) { Object.keys(it.stats).forEach(k => { S[k] += it.stats[k]; }); }
      if (it.statAll) { Object.keys(STAT_NAMES).forEach(k => S[k] += it.statAll); }
      if (--S.inv[id] <= 0) delete S.inv[id];
      AudioSys.sfx('heal'); renderBars(); openStatusModal();
    };
  });
  $('modal-body').querySelectorAll('[data-sell]').forEach(b => {
    b.onclick = () => {
      const id = b.dataset.sell, it = GAME_DATA.items[id];
      S.pts += Math.floor((it.price || 0) / 2);
      if (S[it.type] === id) S[it.type] = null;  // 卖掉的装备先卸下
      if (--S.inv[id] <= 0) delete S.inv[id];
      AudioSys.sfx('coin'); toast('卖出 ' + it.name + '，+' + Math.floor(it.price / 2) + ' 积分');
      renderBars(); openStatusModal();
    };
  });
  $('modal-body').querySelectorAll('[data-upg]').forEach(b => {
    b.onclick = () => {
      const [aid, k, v, cost] = b.dataset.upg.split('|');
      if (S.pts < +cost) { toast('积分不足'); return; }
      S.pts -= +cost;
      if (!S.allyUp) S.allyUp = {};
      if (!S.allyUp[aid]) S.allyUp[aid] = {};
      S.allyUp[aid][k] = (S.allyUp[aid][k] || 0) + +v;
      AudioSys.sfx('level'); toast('同伴已强化'); openStatusModal();
    };
  });
  $('modal-body').querySelectorAll('[data-leave]').forEach(b => {
    b.onclick = () => {
      const aid = b.dataset.leave;
      S.team = S.team.filter(x => x !== aid);
      const refund = Math.floor((GAME_DATA.allies[aid]?.price || 0) / 2);
      S.pts += refund;
      toast(GAME_DATA.allies[aid]?.name + ' 已解约，退还 ' + refund + ' 积分');
      AudioSys.sfx('item'); renderBars(); openStatusModal();
    };
  });
  openModal('轮回者状态', true);
}

function allyPanel() {
  if (!S.team || !S.team.length) return '<div style="color:var(--dim);font-size:12px">尚未招募同伴（主神空间 · 同伴）</div>';
  if (!S.allyUp) S.allyUp = {};
  return S.team.map(id => {
    const a = GAME_DATA.allies[id]; if (!a) return '';
    const up = S.allyUp[id] || {};
    const hp = a.hp + (up.hp || 0), atk = a.atk + (up.atk || 0), spd = (a.spd || 7) + (up.spd || 0);
    return `<div class="ally-panel">
      <img src="${a.img}" alt="">
      <div class="ally-info"><b>${a.name}</b><span>${a.desc}</span>
        <div class="ally-stats">HP ${hp} · 攻 ${atk} · 速 ${spd}</div>
        <div class="ally-btns">
          <button class="btn sm" data-upg="${id}|atk|4|300">攻+4 ·300分</button>
          <button class="btn sm" data-upg="${id}|hp|60|300">血+60 ·300分</button>
          <button class="btn sm" data-upg="${id}|spd|2|250">速+2 ·250分</button>
          <button class="btn sm dim" data-leave="${id}">解约+${Math.floor(a.price / 2)}分</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ---------- 通用 ---------- */
function openModal(title, wide) { $('modal-title').textContent = title; $('modal-box').classList.toggle('wide', !!wide); $('modal').classList.remove('hidden'); }
function closeModal() { $('modal').classList.add('hidden'); }
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.add('hidden'), 2000);
}
function renderBars() {
  if (!S) return;
  $('hp-fill').style.width = clamp(S.hp / d_maxHp() * 100, 0, 100) + '%';
  $('hp-num').textContent = `${Math.max(0, S.hp)} / ${d_maxHp()}`;
  $('san-fill').style.width = clamp(S.san / d_maxSan() * 100, 0, 100) + '%';
  $('san-num').textContent = `${Math.max(0, S.san)} / ${d_maxSan()}`;
  $('points-num').textContent = S.pts;
  const hp2 = $('hub-points-num'); if (hp2) hp2.textContent = S.pts;
  renderTimeChip();
}
function flashRed() {
  const m = $('main-area'); m.classList.remove('flash-red'); void m.offsetWidth; m.classList.add('flash-red');
  const a = $('app'); a.classList.remove('shake'); void a.offsetWidth; a.classList.add('shake');
}
function toggleMute() {
  AudioSys.ensure();
  AudioSys.setMuted(!AudioSys.muted);
  if (S) S.muted = AudioSys.muted;
  $('btn-mute-title').textContent = AudioSys.muted ? '🔇 音乐关' : '🔊 音乐开';
  $('btn-mute').textContent = AudioSys.muted ? '🔇' : '🔊';
}

function openCombatSub(kind) {
  const sub = $('combat-sub'); sub.innerHTML = '';
  if (kind === 'skill') {
    if (!S.skills.length) sub.innerHTML = '<div style="padding:10px;color:var(--dim)">尚未学会技能</div>';
    S.skills.forEach(id => {
      const sk = GAME_DATA.skills[id];
      const b = document.createElement('button'); b.className = 'btn';
      b.textContent = `${sk.name}（${sk.sanCost} 精神）`; b.disabled = S.san < sk.sanCost;
      b.onclick = () => { sub.classList.add('hidden'); playerTurn('skill', id); };
      sub.appendChild(b);
    });
  } else {
    const usable = Object.keys(S.inv).filter(id => { const it = GAME_DATA.items[id]; return !it.revive && (it.type === 'consumable' || it.dmg); });
    if (!usable.length) sub.innerHTML = '<div style="padding:10px;color:var(--dim)">没有可用道具</div>';
    usable.forEach(id => {
      const it = GAME_DATA.items[id];
      const b = document.createElement('button'); b.className = 'btn';
      b.textContent = `${it.name} ×${S.inv[id]}`;
      b.onclick = () => { sub.classList.add('hidden'); playerTurn('item', id); };
      sub.appendChild(b);
    });
  }
  const back = document.createElement('button'); back.className = 'btn ghost'; back.textContent = '← 返回';
  back.onclick = () => sub.classList.add('hidden');
  sub.appendChild(back); sub.classList.remove('hidden');
}

/* ---------- 事件绑定 ---------- */
function bindUI() {
  $('btn-new-game').onclick = () => { AudioSys.ensure(); AudioSys.sfx('click'); newGame(); };
  $('btn-load-game').onclick = () => { AudioSys.ensure(); openLoadModal(); };
  let titleClicks = 0, titleTimer = null;
  const cheatOn = () => localStorage.getItem('qswx_cheat') === '1';
  const applyCheatVis = () => {
    $('btn-cheat').style.display = cheatOn() ? '' : 'none';
    $('btn-cheat-title').style.display = cheatOn() ? '' : 'none';
  };
  applyCheatVis();
  document.querySelector('.game-title').addEventListener('click', () => {
    titleClicks++;
    clearTimeout(titleTimer); titleTimer = setTimeout(() => titleClicks = 0, 3500);
    if (titleClicks === 5 && !cheatOn()) {
      localStorage.setItem('qswx_cheat', '1');
      applyCheatVis();
      toast('（检测到隐藏指令……修改器已解锁，右上角 🛠️）');
      AudioSys.sfx('level');
    } else if (titleClicks === 3 && !cheatOn()) toast('（好像有什么在回应…）');
  });
  $('btn-cheat-title').onclick = () => { AudioSys.ensure(); if (!S) newGame(); openCheatModal(); };
  $('btn-mute-title').onclick = toggleMute;
  $('btn-status').onclick = openStatusModal;
  $('btn-save').onclick = openSaveModal;
  $('btn-load').onclick = openLoadModal;
  $('btn-cheat').onclick = openCheatModal;
  $('btn-mute').onclick = toggleMute;
  $('btn-home').onclick = () => { showScreen('title-screen'); AudioSys.playTrack('title'); };
  $('modal-close').onclick = closeModal;
  $('dlg-skip').onclick = () => { AudioSys.sfx('click'); closeDialog(); };
  $('modal').addEventListener('click', e => { if (e.target === $('modal')) closeModal(); });
  $('btn-next-level').onclick = nextLevel;
  $('god-img').onclick = () => openShop();
  // 停留时间调控：快进（店铺照常结算）/ 买时间
  $('btn-ff30').onclick = () => {
    if (!S) return;
    const ff = Math.min(30, S.hubTime || 0);
    for (let i = 0; i < ff; i++) shopTick();
    S.hubTime = Math.max(0, (S.hubTime || 0) - ff);
    $('hub-time-num').textContent = fmtTime(S.hubTime);
    $('hub-points-num').textContent = S.pts;
    AudioSys.sfx('click'); toast(`时间快进 ${ff} 分钟`);
    if (S.hubTime <= 0) { toast('停留时间耗尽，主神将你送入下一扇门'); nextLevel(); }
  };
  $('btn-extend').onclick = () => {
    if (!S) return;
    if (S.pts < 200) { toast('积分不足（需 200）'); AudioSys.sfx('deny'); return; }
    S.pts -= 200; S.hubTime = (S.hubTime || 0) + 60;
    $('hub-time-num').textContent = fmtTime(S.hubTime);
    $('hub-points-num').textContent = S.pts;
    AudioSys.sfx('coin'); toast('购买停留时间 +60 分钟');
  };
  document.querySelectorAll('#hub-systems .sys-card').forEach(c => c.onclick = () => openSysModal(c.dataset.sys));
  document.querySelectorAll('.combat-btn').forEach(b => {
    b.onclick = () => {
      const act = b.dataset.act;
      if (act === 'skill' || act === 'item') openCombatSub(act);
      else playerTurn(act);
    };
  });

  // 键盘
  window.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    keys[k] = true;
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
  });
  window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
  // 虚拟方向键（按住连发）
  document.querySelectorAll('.jbtn').forEach(b => {
    const dir = b.dataset.dir;
    const keyMap = { up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright' };
    const k = keyMap[dir];
    const on = e => { e.preventDefault(); keys[k] = true; };
    const off = e => { e.preventDefault(); keys[k] = false; };
    b.addEventListener('pointerdown', on);
    b.addEventListener('pointerup', off);
    b.addEventListener('pointerleave', off);
    b.addEventListener('pointercancel', off);
  });
  // 点击寻路
  const cv = $('map-canvas');
  cv.addEventListener('pointerdown', e => {
    const r = cv.getBoundingClientRect();
    clickMove(e.clientX - r.left, e.clientY - r.top);
  });
  document.body.addEventListener('pointerdown', () => AudioSys.ensure(), { once: true });
  window.addEventListener('resize', () => renderMap());
}

/* ---------- 启动 ---------- */
window.addEventListener('load', () => {
  bindUI();
  $('title-img').src = 'assets/title.jpg';
  $('hub-img').src = 'assets/hub.jpg';
  showScreen('title-screen');
  requestAnimationFrame(gameLoop);
});

/* ================= v15：偶遇事件 / 私人空间 / 评级 ================= */
function hubSpend(sec) {
  if (S.cheat.timeStop) return true;
  if ((S.hubTime || 0) < sec) { toast('停留时间不足'); return false; }
  S.hubTime -= sec; $('hub-time-num').textContent = fmtTime(S.hubTime);
  if (S.hubTime <= 0) { toast('停留时间耗尽，主神将你送入下一扇门'); nextLevel(); return false; }
  return true;
}

function renderEvents(box) {
  box.innerHTML = '';
  const head = document.createElement('div');
  head.className = 'ev-card';
  head.innerHTML = `<h3>光门回廊</h3><p>兑换完装备，还可以在回廊里四下走走——每次走动随机遭遇一件事，消耗 <b>15 分钟</b>停留时间。<br>大多是寻常的邂逅，偶尔有意外之喜，极小概率撞上麻烦。有人在这里捡到了同伴。</p>`;
  const btn = document.createElement('button'); btn.className = 'btn primary';
  const lack = (S.hubTime || 0) < 15 && !(S.cheat && S.cheat.timeStop);
  btn.disabled = lack;
  btn.textContent = lack ? `停留时间不足（需 15 分钟，剩余 ${fmtTime(S.hubTime || 0)}）` : `四处走走（15 分钟）· 剩余 ${fmtTime(S.hubTime || 0)}`;
  btn.onclick = () => {
    if (!hubSpend(15)) return;
    const luck = 1 + (fmod().evLuck || 0) / 100;
    const pool = GAME_DATA.hubEvents;
    const wOf = e => e.w * (e.tone === 'pos' ? luck : e.tone === 'neg' ? 1 / luck : 1);
    let tw = pool.reduce((s, e) => s + wOf(e), 0);
    let r = Math.random() * tw, ev = pool[0];
    for (const e of pool) { r -= wOf(e); if (r <= 0) { ev = e; break; } }
    showEvent(ev, box);
  };
  head.appendChild(btn);
  box.appendChild(head);
}

function showEvent(ev, box) {
  const pages = (ev.pages && ev.pages.length) ? ev.pages : [ev.text || ''];
  let pg = 0;
  openModal(ev.title, true);
  const body = $('modal-body');
  const render = () => {
    body.innerHTML = '';
    const wrap = document.createElement('div'); wrap.className = 'ev-stage';
    if (ev.img) {
      const iw = document.createElement('div'); iw.className = 'ev-imgwrap';
      const im = document.createElement('img'); im.className = 'ev-img'; im.src = ev.img; im.alt = ev.title;
      iw.appendChild(im); wrap.appendChild(iw);
    }
    const tx = document.createElement('div'); tx.className = 'ev-text';
    tx.innerHTML = `<p>${pages[pg]}</p><span class="ev-page">${pg + 1} / ${pages.length}</span>`;
    wrap.appendChild(tx);
    const ob = document.createElement('div'); ob.className = 'ev-opts';
    if (pg < pages.length - 1) {
      const b = document.createElement('button'); b.className = 'btn primary'; b.textContent = '继续 ▸';
      b.onclick = () => { pg++; AudioSys.sfx('click'); render(); };
      ob.appendChild(b);
    } else {
      ev.opts.forEach(opt => {
        const b = document.createElement('button'); b.className = 'btn';
        b.textContent = opt.t;
        b.onclick = () => { runEventOpt(opt, ev); renderEvents(body); };
        ob.appendChild(b);
      });
    }
    wrap.appendChild(ob);
    body.appendChild(wrap);
  };
  render();
}

function runEventOpt(opt, ev) {
  const eff = opt.eff || {};
  const say = t => toast(t);
  if (eff.costPts) { if (S.pts < eff.costPts) { say('积分不够'); return; } S.pts -= eff.costPts; }
  if (eff.needItem) { if (!(S.inv[eff.needItem] > 0)) { say('身上没有 ' + GAME_DATA.items[eff.needItem].name); return; } if (--S.inv[eff.needItem] <= 0) delete S.inv[eff.needItem]; }
  if (eff.allyChance) {
    const cand = (ev.ally || []).filter(id => !S.team.includes(id) && !(S.roster || []).includes(id));
    if (!cand.length) { say(opt.fail || '没有新的同伴可结识。'); }
    else if (Math.random() * 100 < eff.allyChance + (fmod().evLuck || 0)) {
      const id = cand[(Math.random() * cand.length) | 0];
      S.roster = S.roster || []; S.roster.push(id);
      say('【' + GAME_DATA.allies[id].name + '】加入了你的编队！（同伴页编入队伍）'); AudioSys.sfx('level');
    } else say(opt.fail || '对方婉拒了。');
  }
  if (eff.statChk) {
    const roll = est(eff.statChk) + est('luk') * 0.5 + Math.random() * 10;
    if (roll >= 8) { if (eff.win?.points) S.pts += eff.win.points; if (eff.win?.grade) addGrade(eff.win.grade); say(opt.ok); AudioSys.sfx('coin'); }
    else { if (eff.loseHp) S.hp = Math.max(1, S.hp - eff.loseHp); if (eff.losePts) S.pts = Math.max(0, S.pts - eff.losePts); say(opt.fail || '没占到便宜。'); }
  }
  if (eff.potSale) {
    const potIds = GAME_DATA.shopItems.filter(id => GAME_DATA.items[id].type === 'consumable');
    const id = potIds[(Math.random() * potIds.length) | 0], it = GAME_DATA.items[id];
    const price = Math.max(1, Math.floor(it.price * eff.potSale));
    if (S.pts >= price) { S.pts -= price; S.inv[id] = (S.inv[id] || 0) + 1; say((opt.ok || '买到了。') + '（' + it.name + ' ' + price + '分入手）'); }
    else say('积分不够，商人笑着收起了货。');
  }
  if (eff.discount) {
    const gearIds = GAME_DATA.shopItems.filter(id => { const it = GAME_DATA.items[id]; return ['weapon', 'armor', 'acc'].includes(it.type) && !it.g; });
    const id = gearIds[(Math.random() * gearIds.length) | 0], it = GAME_DATA.items[id];
    const price = Math.floor(it.price * eff.discount);
    if (S.pts >= price) { S.pts -= price; S.inv[id] = (S.inv[id] || 0) + 1; say(opt.ok + '（' + it.name + ' ' + price + '分入手）'); }
    else say('积分不够，商人收起了货。');
  }
  if (eff.gamble) {
    if (S.pts < eff.gamble) { say('积分不够上桌'); return; }
    S.pts -= eff.gamble;
    if (Math.random() * 100 < eff.winRate) {
      S.pts += eff.gamble * 2;
      if (eff.jackpot && Math.random() < 0.3) { addGrade(eff.jackpot.grade); say(opt.jackpotText || opt.ok); }
      else say(opt.ok);
    } else say(opt.fail);
  }
  if (eff.repay) { if (eff.repay.points) S.pts += eff.repay.points; if (eff.repay.grade) addGrade(eff.repay.grade); say(opt.ok); AudioSys.sfx('coin'); }
  if (eff.losePts && !eff.statChk) { S.pts = Math.max(0, S.pts - eff.losePts); }
  if (eff.hp) S.hp = clamp(S.hp + eff.hp, 1, d_maxHp());
  if (eff.randStat) { const k = Object.keys(STAT_NAMES)[(Math.random() * 6) | 0]; S[k]++; say(opt.ok + '（' + STAT_NAMES[k] + ' +1）'); }
  if (eff.san) S.san = clamp(S.san + eff.san, 0, d_maxSan());
  if (eff.smallChance && Math.random() * 100 < eff.smallChance.rate) { addGrade(eff.smallChance.grade); say(opt.bonus || ''); }
  if (eff.grade) addGrade(eff.grade);
  if (!Object.keys(eff).length) say(opt.ok || '……');
  $('hub-points-num').textContent = S.pts; renderGrades(); renderBars();
}

/* ---------- 私人空间 / 街区 / 灵植园 / 炼丹房（v20） ---------- */
const ROOM_CS = 38;
const STREET_W = 18, STREET_H = 9, STREET_ROWS = 5, STREET_CS = 44;
const GARDEN_W = 6, GARDEN_H = 4;               // 逻辑格 6×4，视觉分四簇 3×2 绕中央喷泉
const GARDEN_PLOT_W = 100, GARDEN_PLOT_H = 59, GARDEN_CW = 104, GARDEN_CH = 66;
const GARDEN_CVS_W = 780, GARDEN_CVS_H = 520;
function plotXY(x, y) {
  const px = (x <= 2 ? 10 : 462) + (x <= 2 ? x : x - 3) * GARDEN_CW;
  const py = (y <= 1 ? 34 : 361) + (y <= 1 ? y : y - 2) * GARDEN_CH;
  return { px, py };
}
const GARDEN_PLOT_SRC = 'assets/plot_tile.png';
const CROP_SRCS = { herb_vita: 'assets/crop_herb_vita.png', herb_mind: 'assets/crop_herb_mind.png', herb_body: 'assets/crop_herb_body.png', herb_swift: 'assets/crop_herb_swift.png', herb_luck: 'assets/crop_herb_luck.png' };
let placingFurn = null, placingSeed = null, movingFurn = null, roomGhost = null;
/* v34：私人空间复刻皮卡堂——真等距菱形地板+两面墙截面房，家具全像素等距立绘，
   贴地感=立绘自带底边咬合占地菱形+贴地接触暗斑（不再画偏移投射影）。
   朝向 r∈{0,1,2,3}：r≥2 镜像翻转（等距立绘只有正面/背面两个方向） */
const FURN_IMG = {
  bed: 'assets/furn_pika_bed.png', plant: 'assets/furn_pika_plant.png', bookshelf: 'assets/furn_pika_bookshelf.png',
  dummy: 'assets/furn_pika_dummy.png', treadmill: 'assets/furn_pika_treadmill.png', sandbag: 'assets/furn_pika_sandbag.png',
  cushion: 'assets/furn_pika_cushion.png', compass: 'assets/furn_pika_compass.png', trophy: 'assets/furn_pika_trophy.png',
  purifier: 'assets/furn_pika_purifier.png', star_map: 'assets/furn_pika_star_map.png', lamp: 'assets/furn_pika_lamp.png',
  sofa: 'assets/furn_pika_sofa.png', weapon_rack: 'assets/furn_pika_weapon_rack.png',
  /* 高级房型专属家具（像素等距立绘） */
  hang_chair: 'assets/furn_pika_hang_chair.png', workbench: 'assets/furn_pika_workbench.png',
  tea_table: 'assets/furn_pika_tea_table.png', stone_lantern: 'assets/furn_pika_stone_lantern.png',
  star_throne: 'assets/furn_pika_star_throne.png', nebula_orb: 'assets/furn_pika_nebula_orb.png',
  shop_general: 'assets/furn_iso_shop_general.png', shop_forge: 'assets/furn_iso_shop_forge.png',
  shop_diner: 'assets/furn_iso_shop_diner.png', shop_dojo: 'assets/furn_iso_shop_dojo.png',
  shop_intel: 'assets/furn_iso_shop_intel.png'
};
/* 房间皮：菱形地板贴图 + 墙面壁纸贴图 + 墙面挂件。v46：高阶房地板改用手绘地形纹理（tex_*），单间保留烘焙棋盘 */
const ROOM_FLOOR = { studio: 'assets/floor_studio.png', loft: 'assets/tex_wood.png', courtyard: 'assets/tex_tatami.png', palace: 'assets/tex_marble.png' };
const ROOM_FLOOR_GRID = { loft: 'rgba(58,38,20,.14)', courtyard: 'rgba(96,72,36,.16)', palace: 'rgba(140,110,50,.12)' };
const ROOM_WALL = { studio: 'assets/wall_studio.png', loft: 'assets/wall_loft.png', courtyard: 'assets/wall_courtyard.png', palace: 'assets/wall_palace.png' };
const ROOM_DECO = {
  studio:    [['assets/deco_window.png',  'R', 0.55], ['assets/deco_painting.png', 'L', 0.62], ['assets/deco_vine.png', 'L', 0.12]],
  loft:      [['assets/deco_garland.png', 'R', 0.38], ['assets/deco_lantern.png',  'L', 0.45], ['assets/deco_painting.png', 'R', 0.74]],
  courtyard: [['assets/deco_scroll.png',  'L', 0.50], ['assets/deco_lantern.png',  'R', 0.40], ['assets/deco_window.png', 'R', 0.78]],
  palace:    [['assets/deco_lantern.png', 'L', 0.30], ['assets/deco_lantern.png',  'L', 0.68], ['assets/deco_lantern.png', 'R', 0.55]]
};
/* v44/v45：房型差异化——地面纹理 + 围边 + 墙高。高阶房不再是庭院小屋：无围栏，地板边缘做主题包边，墙面加高 */
/* v50：房型改用整幅彩绘场景底图（空室内），地板区四边形双线性映射摆格子 */
const ROOM_SCENE = { loft: 'assets/scene_loft.jpg', courtyard: 'assets/scene_courtyard.jpg', palace: 'assets/scene_palace.jpg' };   /* 单间保留皮卡堂拼装小屋 */
const ROOM_BG_DIM = { studio: [1000, 1500], loft: [1000, 1500], courtyard: [1000, 1000], palace: [1000, 1200] };
const ROOM_FLOORQ = {
  studio:    [[20, 600], [985, 560], [1000, 1500], [0, 1500]],
  loft:      [[15, 660], [985, 605], [1000, 1500], [0, 1500]],
  courtyard: [[40, 335], [980, 318], [1000, 1000], [0, 1000]],
  palace:    [[80, 655], [940, 630], [1000, 1200], [0, 1200]],
};
/* 家具立绘缩放系数（场景模式：大房型家具更饱满） */
const ROOM_FSCALE = { studio: 0.72, loft: 1.15, courtyard: 1.05, palace: 1.25 };
/* 拼装模式（单间）仍用 */
const ROOM_GROUND = { studio: 'assets/grass.png' };
const ROOM_FENCE = { studio: 'picket' };
const ROOM_EDGE = {};
const ROOM_WALLH = { studio: 0.62, loft: 0.72, courtyard: 0.62, palace: 0.82 };
const STREET_BG = 'assets/street_bg.png', GARDEN_BG = 'assets/garden_bg.jpg', ALCHEMY_BG = 'assets/alchemy_bg.jpg';
/* v31：广场底图重做——只剩边缘喷泉/长椅/花盆，整片空地留给玩家店铺；店铺瓦片重新烘焙互不相截 */
const STREET_BG_DIM = [1312, 1199];
const SHOP_TILE = {
  general: { off: 'assets/shop_general_off.png', on: 'assets/shop_general_on.png', pos: [130, 60, 481, 347], posOn: [135, 26, 474, 395] },
  forge:   { off: 'assets/shop_forge_off.png',   on: 'assets/shop_forge_on.png',   pos: [670, 20, 541, 421], posOn: [689, 0, 541, 459] },
  diner:   { off: 'assets/shop_diner_off.png',   on: 'assets/shop_diner_on.png',   pos: [163, 176, 469, 437], posOn: [173, 149, 461, 464] },
  dojo:    { off: 'assets/shop_dojo_off.png',    on: 'assets/shop_dojo_on.png',    pos: [667, 128, 566, 493], posOn: [685, 87, 574, 522] },
  intel:   { off: 'assets/shop_intel_off.png',   on: 'assets/shop_intel_on.png',   pos: [350, 699, 569, 500], posOn: [369, 696, 548, 503] }
};
function shopTileAt(mx, my, scale) {
  let best = null, by = -1;
  for (const s of (S.shops || [])) {
    const t = SHOP_TILE[s.id]; if (!t) continue;
    const p = s.ally ? t.posOn : t.pos;
    const x0 = p[0] * scale, y0 = p[1] * scale, x1 = (p[0] + p[2]) * scale, y1 = (p[1] + p[3]) * scale;
    const mxr = (x1 - x0) * 0.06, myr = (y1 - y0) * 0.06;
    if (mx >= x0 + mxr && mx <= x1 - mxr && my >= y0 + myr && my <= y1 - myr && p[1] + p[3] > by) { best = s; by = p[1] + p[3]; }
  }
  return best;
}

const FURN_MOD_LABEL = { restBoost: '休整恢复', sanMax: '精神力上限', ptsBonus: '通关积分', timeCut: '时间消耗', exploreBonus: '探索度', evLuck: '偶遇好运', atkPlus: '攻击', trainCut: '锻炼耗时', shopBoost: '店铺产出' };
const furnModsTxt = mods => Object.keys(mods || {}).map(k => (FURN_MOD_LABEL[k] || k) + '+' + mods[k] + (['ptsBonus', 'timeCut', 'exploreBonus', 'evLuck', 'restBoost', 'trainCut', 'shopBoost'].includes(k) ? '%' : '')).join('、');
/* placingFurn 值：'bed' 放家具；'shop:general' 放店铺；movingFurn 指向被移动对象 */
function placeDef(id) { return id.startsWith('shop:') ? GAME_DATA.shops[id.slice(5)] : GAME_DATA.furniture[id]; }
/* 占地尺寸：r∈{0,1,2,3} 四个朝向，奇数朝向宽高互换 */
function effSize(def, r) { const s = def.size; return (r % 2 === 1) ? [s[1], s[0]] : s; }
function furnAt(x, y) {
  return curFurn().find(f => { const [w, h] = effSize(GAME_DATA.furniture[f.id], f.r); return x >= f.x && x < f.x + w && y >= f.y && y < f.y + h; });
}
function shopAt(x, y) {
  return (S.shops || []).find(s => { const [w, h] = effSize(GAME_DATA.shops[s.id], s.r); return x >= s.x && x < s.x + w && y >= s.y && y < s.y + h; });
}
/* zone: 'room' 家具摆放区 / 'street' 街区店铺区 */
function furnFits(id, x, y, ignore, zone, r) {
  const [w, h] = effSize(placeDef(id), r);
  if (zone === 'street') {
    if (x < 0 || y < 0 || x + w > STREET_W || y + h > STREET_ROWS) return false;
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) {
      const hit = shopAt(xx, yy);
      if (hit && hit !== ignore) return false;
    }
    return true;
  }
  const rd = curRoomDef();
  if (x < 0 || y < 0 || x + w > rd.w || y + h > rd.h) return false;
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) {
    const hit = furnAt(xx, yy);
    if (hit && hit !== ignore) return false;
  }
  return true;
}
/* 店铺产速：基础 rate × 店员专长 × 房间 shopBoost 增益 */
function shopRate(s) {
  const d = GAME_DATA.shops[s.id];
  if (!s.ally) return 0;
  const a = GAME_DATA.allies[s.ally];
  const bonus = a && a.shop && a.shop.tag === d.tag ? 1 + a.shop.pct / 100 : 1;
  return d.rate * bonus * (1 + (fmod().shopBoost || 0) / 100);
}
/* 驻店队友名单（不能同时出战） */
const staffedIds = () => (S.shops || []).map(s => s.ally).filter(Boolean);
/* 店铺结算 + 灵植园生长 + 丹炉计时：随主神空间停留时间推进 */
function shopTick() {
  S.shopAccr = S.shopAccr || 0;
  (S.shops || []).forEach(s => { S.shopAccr += shopRate(s); });
  const whole = Math.floor(S.shopAccr);
  if (whole > 0) { S.shopAccr -= whole; S.pts += whole; const el = $('hub-points-num'); if (el) el.textContent = S.pts; }
  (S.garden || []).forEach(p => { if (p.left > 0) p.left--; });
  (S.beasts || []).forEach(b => { if (b.left > 0) b.left--; });
  if (S.brew && S.brew.left > 0) {
    S.brew.left--;
    if (S.brew.left <= 0) {
      const r = GAME_DATA.recipes[S.brew.rid];
      S.inv[r.out] = (S.inv[r.out] || 0) + 1;
      toast(`丹成：【${r.name}】已入背包`); AudioSys.sfx('level'); S.brew = null;
    }
  }
}
/* ---------- 房间 ---------- */
function renderRoom(box) {
  box.innerHTML = '';
  placingSeed = null;
  const rd = curRoomDef();
  const agg = fmod();
  const aggTxt = furnModsTxt(agg);
  const head = document.createElement('div'); head.className = 'room-head';
  head.innerHTML = `<b>🛋️ ${rd.name}</b><span>${aggTxt ? '常驻加成：' + aggTxt : '摆放家具可获得常驻加成；锻炼家具消耗停留时间换永久属性。'}</span>`;
  box.appendChild(head);
  /* 房型购置 / 切换 */
  const rrow = document.createElement('div'); rrow.className = 'furn-list';
  Object.keys(GAME_DATA.rooms).forEach(rid => {
    const r = GAME_DATA.rooms[rid];
    const owned = (S.roomsOwned || []).includes(rid), cur = curRoomId() === rid;
    const costHtml = r.g ? `<span class="grade-chip g${r.g}">${r.g}×${r.cnt || 1}</span> + ${r.price}分` : (r.price ? `${r.price}分` : '免费');
    const cell = document.createElement('div'); cell.className = 'furn-cell' + (cur ? ' room-placing' : '');
    cell.innerHTML = `<b>${cur ? '🏠 ' : ''}${r.name}</b><span>${r.desc}｜${r.w}×${r.h}格${r.mods && Object.keys(r.mods).length ? '｜' + furnModsTxt(r.mods) : ''}</span><span style="color:#ffd76a">${owned ? (cur ? '当前入住' : '已购置') : costHtml}</span>`;
    const b = document.createElement('button'); b.className = 'btn';
    if (cur) { b.textContent = '入住中'; b.disabled = true; }
    else if (owned) {
      b.textContent = '搬入';
      b.onclick = () => { S.roomId = rid; placingFurn = null; movingFurn = null; roomGhost = null; AudioSys.sfx('click'); toast('已搬入「' + r.name + '」'); renderRoom(box); renderBars(); };
    } else {
      b.textContent = '购置';
      b.disabled = r.g ? ((S.grade[r.g] || 0) < (r.cnt || 1) || S.pts < r.price) : S.pts < r.price;
      b.onclick = () => {
        if (r.g) { if ((S.grade[r.g] || 0) < (r.cnt || 1) || S.pts < r.price) return; S.grade[r.g] -= r.cnt || 1; S.pts -= r.price; }
        else { if (S.pts < r.price) return; S.pts -= r.price; }
        S.roomsOwned.push(rid); S.roomFurn = S.roomFurn || {}; S.roomFurn[rid] = S.roomFurn[rid] || [];
        AudioSys.sfx('coin'); toast('已购下「' + r.name + '」，可随时搬入'); $('hub-points-num').textContent = S.pts; renderGrades(); renderRoom(box);
      };
    }
    cell.appendChild(b); rrow.appendChild(cell);
  });
  box.appendChild(rrow);
  const wrap = document.createElement('div'); wrap.id = 'room-wrap';
  const cv = document.createElement('canvas');
  cv.id = 'room-canvas'; cv.width = 720;
  cv.height = Math.round(roomGeom(rd, cv.width).H);
  const tip = document.createElement('div'); tip.id = 'room-tip';
  tip.textContent = '购入家具→仓库点「摆放」→鼠标悬停预览，点绿色区域落地。点家具：转向/移动/收回/回收/锻炼。';
  wrap.appendChild(cv); wrap.appendChild(tip); box.appendChild(wrap);
  drawRoom(cv);
  const gridAt = e => {
    const r = cv.getBoundingClientRect();
    const mx = (e.clientX - r.left) * cv.width / r.width, my = (e.clientY - r.top) * cv.height / r.height;
    return roomGridAt(rd, cv.width, mx, my);
  };
  cv.onpointermove = e => {
    if (!placingFurn && !movingFurn) return;
    const p = gridAt(e); p.r = roomGhost ? roomGhost.r : 0;
    if (!roomGhost || roomGhost.x !== p.x || roomGhost.y !== p.y) { roomGhost = p; drawRoom(cv); }
  };
  cv.onpointerleave = () => { if (roomGhost) { roomGhost = null; drawRoom(cv); } };
  cv.onclick = e => {
    const p = gridAt(e);
    const ghostId = movingFurn ? movingFurn.id : placingFurn;
    if (ghostId) {
      const rot = roomGhost ? roomGhost.r || 0 : 0;
      if (!furnFits(ghostId, p.x, p.y, movingFurn, 'room', rot)) { AudioSys.sfx('error'); toast('这里放不下'); return; }
      if (movingFurn) { movingFurn.x = p.x; movingFurn.y = p.y; movingFurn.r = rot; movingFurn = null; }
      else {
        curFurn().push({ id: ghostId, x: p.x, y: p.y, r: rot });
        S.furnStock[ghostId]--;
        if (S.furnStock[ghostId] <= 0) delete S.furnStock[ghostId];
        placingFurn = null;
        toast(`【${GAME_DATA.furniture[ghostId].name}】已就位`);
      }
      roomGhost = null; AudioSys.sfx('coin'); renderRoom(box); renderBars(); return;
    }
    const f = furnAt(p.x, p.y);
    if (f) showFurnMenu(f, tip, box);
  };
  // 家具库存（待摆放）
  const stockIds = Object.keys(S.furnStock || {});
  if (stockIds.length) {
    const cap = document.createElement('div'); cap.className = 'room-cap'; cap.textContent = '📦 仓库（点「摆放」后在房间内选位落地，悬停有幽灵预览）';
    box.appendChild(cap);
    const list = document.createElement('div'); list.className = 'furn-list';
    stockIds.forEach(id => {
      const f = GAME_DATA.furniture[id];
      const wrongRoom = f.rooms && !f.rooms.includes(curRoomId());
      const cell = document.createElement('div'); cell.className = 'furn-cell' + (placingFurn === id ? ' room-placing' : '');
      cell.innerHTML = `<b><img class="furn-thumb" src="${FURN_IMG[id]}" alt="">${f.name} ×${S.furnStock[id]}</b><span>${f.desc}${f.mods ? '｜' + furnModsTxt(f.mods) : ''}</span>`;
      const b = document.createElement('button'); b.className = 'btn'; b.textContent = wrongRoom ? '限其他房型' : (placingFurn === id ? '取消摆放' : '摆放');
      b.disabled = wrongRoom;
      b.onclick = () => {
        placingFurn = placingFurn === id ? null : id; movingFurn = null; roomGhost = null;
        AudioSys.sfx('click'); renderRoom(box);
        if (placingFurn) toast('在房间里选个位置落地，绿=可放 红=不可放');
      };
      cell.appendChild(b); list.appendChild(cell);
    });
    box.appendChild(list);
  }
  // 家具商店
  const cap2 = document.createElement('div'); cap2.className = 'room-cap'; cap2.textContent = '🛒 家具目录';
  box.appendChild(cap2);
  const shop = document.createElement('div'); shop.className = 'furn-list';
  Object.keys(GAME_DATA.furniture).forEach(id => {
    const f = GAME_DATA.furniture[id];
    const cell = document.createElement('div'); cell.className = 'furn-cell';
    const costHtml = f.g ? `<span class="grade-chip g${f.g}">${f.g}×${f.cnt || 1}</span> + ${f.price}分` : `${f.price}分`;
    cell.innerHTML = `<b><img class="furn-thumb" src="${FURN_IMG[id]}" alt="">${f.name}</b><span>${f.desc}${f.mods ? '｜' + furnModsTxt(f.mods) : ''}｜回收 ${Math.floor(f.price / 2)}分</span><span style="color:#ffd76a">${costHtml}</span>`;
    const b = document.createElement('button'); b.className = 'btn'; b.textContent = '购入';
    b.disabled = f.g ? ((S.grade[f.g] || 0) < (f.cnt || 1) || S.pts < f.price) : S.pts < f.price;
    b.onclick = () => {
      if (f.g) { if ((S.grade[f.g] || 0) < (f.cnt || 1) || S.pts < f.price) return; S.grade[f.g] -= f.cnt || 1; S.pts -= f.price; }
      else { if (S.pts < f.price) return; S.pts -= f.price; }
      S.furnStock = S.furnStock || {}; S.furnStock[id] = (S.furnStock[id] || 0) + 1;
      AudioSys.sfx('coin'); toast('家具已入库，点「摆放」布置到房间');
      $('hub-points-num').textContent = S.pts; renderGrades(); renderRoom(box);
    };
    cell.appendChild(b); shop.appendChild(cell);
  });
  box.appendChild(shop);
}
function furnSpriteSrc(id) { return FURN_IMG[id]; }
/* 等距房间几何（皮卡堂 2:1 菱形）：格 (x,y) → 屏 px=Vtop.x+(x−y)·cs，py=Vtop.y+(x+y)·cs/2。
   Vtop=两面墙交点（菱形顶角），地板菱形四顶点 (0,0)(w,0)(w,h)(0,h)。 */
function roomGeom(rd, W) {
  const rid = curRoomId();
  if (ROOM_SCENE[rid]) {
    const dim = ROOM_BG_DIM[rid], sc = W / dim[0];
    return { mode: 'scene', sc, quad: ROOM_FLOORQ[rid], cs: W / (rd.w + rd.h), H: dim[1] * sc };
  }
  const cs = (W - 44) / (rd.w + rd.h);
  const floorH = (rd.w + rd.h) * cs / 2;
  const wallH = floorH * (ROOM_WALLH[rid] || 0.62);
  const vtop = { x: W / 2, y: 16 + wallH };
  return { cs, floorH, wallH, vtop, H: vtop.y + floorH + 18 };
}
/* 场景模式：地板四边形内双线性插值 (u,v)∈[0,1] → 画布像素 */
function sceneP(g, u, v) {
  const q = g.quad, sc = g.sc;
  const x = (q[0][0] * (1 - u) + q[1][0] * u) * (1 - v) + (q[3][0] * (1 - u) + q[2][0] * u) * v;
  const y = (q[0][1] * (1 - u) + q[1][1] * u) * (1 - v) + (q[3][1] * (1 - u) + q[2][1] * u) * v;
  return [x * sc, y * sc];
}
function roomGridAt(rd, W, mx, my) {
  const g = roomGeom(rd, W);
  if (g.mode === 'scene') {
    let best = null, bd = 1e9;
    for (let y = 0; y < rd.h; y++) for (let x = 0; x < rd.w; x++) {
      const p = sceneP(g, (x + 0.5) / rd.w, (y + 0.5) / rd.h);
      const d = (p[0] - mx) * (p[0] - mx) + (p[1] - my) * (p[1] - my);
      if (d < bd) { bd = d; best = { x, y }; }
    }
    return best || { x: 0, y: 0 };
  }
  const dx = mx - g.vtop.x, dy = my - g.vtop.y;
  return { x: Math.floor((dx / g.cs + dy * 2 / g.cs) / 2), y: Math.floor((dy * 2 / g.cs - dx / g.cs) / 2) };
}
/* 占地四顶点：菱形模式=顶/右/底/左；场景模式=TL/TR/BR/BL */
function roomFootprint(g, x, y, w, h) {
  if (g.mode === 'scene') {
    const rd = curRoomDef();
    return [sceneP(g, x / rd.w, y / rd.h), sceneP(g, (x + w) / rd.w, y / rd.h),
            sceneP(g, (x + w) / rd.w, (y + h) / rd.h), sceneP(g, x / rd.w, (y + h) / rd.h)];
  }
  const P = (gx, gy) => [g.vtop.x + (gx - gy) * g.cs, g.vtop.y + (gx + gy) * g.cs / 2];
  return [P(x, y), P(x + w, y), P(x + w, y + h), P(x, y + h)];
}
function drawRhombus(ctx, pts, fill, stroke) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < 4; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}
/* 家具立绘：底缘锚在占地菱形底顶点（略下压让尖底咬进地板），不画任何阴影——
   皮卡堂式贴地靠立绘自带等距底座，外加阴影反而显悬空 */
function drawFurnSprite(ctx, id, cx, cy, w, h, alpha, rot, cs, g) {
  rot = rot || 0;
  const im = getImg(furnSpriteSrc(id));
  const fp = roomFootprint(g, cx, cy, w, h);
  let cpx, pyBot, dw;
  if (g.mode === 'scene') {
    cpx = (fp[2][0] + fp[3][0]) / 2;            // 前缘中点
    pyBot = Math.max(fp[2][1], fp[3][1]);
    const cw = Math.hypot(fp[2][0] - fp[3][0], fp[2][1] - fp[3][1]) / Math.max(1, w);
    dw = (w + h) * cw * (ROOM_FSCALE[curRoomId()] || 0.72);
  } else {
    cpx = (fp[0][0] + fp[2][0]) / 2;
    pyBot = fp[2][1];
    dw = (w + h) * g.cs * 1.14;
  }
  if (alpha !== undefined) ctx.globalAlpha = alpha;
  if (im.complete && im.naturalWidth) {
    const dh = dw * im.naturalHeight / im.naturalWidth;
    const baseY = pyBot + (g.mode === 'scene' ? dw * 0.02 : g.cs * 0.05);
    ctx.imageSmoothingEnabled = true;           // 立绘缩放开平滑（地板那套关平滑只对贴图）
    ctx.save();
    ctx.translate(cpx, baseY);
    if (rot === 2 || rot === 3) ctx.scale(-1, 1);
    ctx.drawImage(im, -dw / 2, -dh, dw, dh);
    ctx.restore();
    ctx.imageSmoothingEnabled = false;
  } else drawRoom._pending = true;
  ctx.globalAlpha = 1;
}
/* v34：皮卡堂式等距截面房——两面墙+菱形地板，程序化铺贴图保证格线对齐 */
function drawRoom(cv) {
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const rid = curRoomId(), rd = curRoomDef();
  drawRoom._pending = false;
  const g = roomGeom(rd, W);
  const { cs, wallH, vtop } = g;
  ctx.imageSmoothingEnabled = false;
  /* v50：场景模式——整幅彩绘室内底图 + 地板四边形双线性摆家具 */
  if (g.mode === 'scene') {
    const bg = getImg(ROOM_SCENE[rid]);
    ctx.fillStyle = '#141018'; ctx.fillRect(0, 0, W, H);
    if (bg.complete && bg.naturalWidth) { ctx.imageSmoothingEnabled = true; ctx.drawImage(bg, 0, 0, W, H); }
    else drawRoom._pending = true;
    curFurn().slice().sort((a, b) => {
      const sa = effSize(GAME_DATA.furniture[a.id], a.r), sb = effSize(GAME_DATA.furniture[b.id], b.r);
      return (a.y + sa[1]) - (b.y + sb[1]) || (a.x + sa[0]) - (b.x + sb[0]);
    }).forEach(f => {
      const [w, h] = effSize(GAME_DATA.furniture[f.id], f.r);
      drawFurnSprite(ctx, f.id, f.x, f.y, w, h, 1, f.r || 0, cs, g);
      if (movingFurn === f) drawRhombus(ctx, roomFootprint(g, f.x, f.y, w, h), 'rgba(232,185,60,.22)', 'rgba(232,185,60,.7)');
    });
    const ghostId = movingFurn ? movingFurn.id : placingFurn;
    if (ghostId && roomGhost) {
      const [w, h] = effSize(placeDef(ghostId), roomGhost.r || 0);
      const ok = furnFits(ghostId, roomGhost.x, roomGhost.y, movingFurn, 'room', roomGhost.r || 0);
      ctx.lineWidth = 2;
      drawRhombus(ctx, roomFootprint(g, roomGhost.x, roomGhost.y, w, h),
        ok ? 'rgba(110,220,120,.30)' : 'rgba(230,80,80,.30)', ok ? 'rgba(110,220,120,.95)' : 'rgba(230,80,80,.95)');
      drawFurnSprite(ctx, ghostId, roomGhost.x, roomGhost.y, w, h, ok ? 0.62 : 0.3, roomGhost.r || 0, cs, g);
    }
    ctx.strokeStyle = 'rgba(232,185,60,.55)'; ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
    if (drawRoom._pending) setTimeout(() => { if (cv.isConnected) drawRoom(cv); }, 380);
    return;
  }
  /* 底衬（房间外的虚空底色） */
  const grd = ROOM_GROUND[rid] || 'assets/grass.png';
  if (grd.startsWith('#')) { ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H); }
  else {
    const grassTex = getImg(grd);
    if (grassTex.complete && grassTex.naturalWidth) {
      const pat = ctx.createPattern(grassTex, 'repeat'); ctx.fillStyle = pat; ctx.fillRect(0, 0, W, H);
    } else { ctx.fillStyle = '#a8d8a0'; ctx.fillRect(0, 0, W, H); drawRoom._pending = true; }
  }  // 房型地面底纹：单间草地，高阶房深色纯色专注室内
  const wallTex = getImg(ROOM_WALL[rid]), floorTex = getImg(ROOM_FLOOR[rid]);
  const texOk = t => t.complete && t.naturalWidth;
  /* 两面墙：右墙(y=0排，沿vtop→右顶点)，左墙(x=0列，沿vtop→左顶点)，贴图随墙平面错切 */
  if (texOk(wallTex)) {
    const tw = wallTex.naturalWidth, th = wallTex.naturalHeight;
    ctx.save(); ctx.transform(1, 0.5, 0, 1, vtop.x, vtop.y - wallH);
    ctx.drawImage(wallTex, 0, 0, tw, th, 0, 0, rd.w * cs, wallH); ctx.restore();
    ctx.save(); ctx.transform(-1, 0.5, 0, 1, vtop.x, vtop.y - wallH);
    ctx.drawImage(wallTex, 0, 0, tw, th, 0, 0, rd.h * cs, wallH); ctx.restore();
  } else { ctx.fillStyle = '#5a4668'; ctx.fillRect(0, 0, W, vtop.y); drawRoom._pending = true; }
  /* 墙面挂件（跟着墙面错切） */
  (ROOM_DECO[rid] || []).forEach(d => {
    const im = getImg(d[0]); if (!texOk(im)) { drawRoom._pending = true; return; }
    const t = d[2], side = d[1];
    const len = (side === 'R' ? rd.w : rd.h) * cs;
    const px = vtop.x + (side === 'R' ? t : -t) * len, py = vtop.y + t * len * 0.5;
    const dw = cs * 2.3, dh = dw * im.naturalHeight / im.naturalWidth;
    /* v46：挂件不再错切贴进墙面，画成立直挂在墙上的物件 + 壁面投影 */
    ctx.save();
    ctx.filter = 'blur(1.5px) brightness(0)'; ctx.globalAlpha = 0.22;
    ctx.drawImage(im, px - dw / 2 + cs * 0.12, py - dh * 0.82 + cs * 0.16, dw, dh);
    ctx.restore();
    ctx.save(); ctx.imageSmoothingEnabled = true;
    ctx.drawImage(im, px - dw / 2, py - dh * 0.82, dw, dh); ctx.restore();
  });
  /* 墙根踢脚线（两条缝） */
  ctx.strokeStyle = 'rgba(35,22,45,.85)'; ctx.lineWidth = Math.max(1.5, cs * 0.09);
  ctx.beginPath(); ctx.moveTo(vtop.x, vtop.y); ctx.lineTo(vtop.x + rd.w * cs, vtop.y + rd.w * cs / 2);
  ctx.moveTo(vtop.x, vtop.y); ctx.lineTo(vtop.x - rd.h * cs, vtop.y + rd.h * cs / 2); ctx.stroke();
  /* 地板：整面错切铺一张贴图；纹理地面再描一层淡格线保证摆位可读 */
  if (texOk(floorTex)) {
    ctx.save(); ctx.transform(1, 0.5, -1, 0.5, vtop.x, vtop.y);
    ctx.drawImage(floorTex, 0, 0, floorTex.naturalWidth, floorTex.naturalHeight, 0, 0, rd.w * cs, rd.h * cs);
    ctx.restore();
    const gc = ROOM_FLOOR_GRID[rid];
    if (gc) {
      ctx.strokeStyle = gc; ctx.lineWidth = 1;
      for (let y = 0; y < rd.h; y++) for (let x = 0; x < rd.w; x++)
        drawRhombus(ctx, roomFootprint(g, x, y, 1, 1), null, gc);
    }
  } else {
    drawRoom._pending = true;
    for (let y = 0; y < rd.h; y++) for (let x = 0; x < rd.w; x++)
      drawRhombus(ctx, roomFootprint(g, x, y, 1, 1), '#6a563f');
  }
  /* 围边：单间=白栅栏庭院小屋；高阶房=地板边缘主题包边（不围栏） */
  {
    const fP = (gx, gy) => [vtop.x + (gx - gy) * cs, vtop.y + (gx + gy) * cs / 2];
    if (ROOM_FENCE[rid] === 'picket') {
      const fh = cs * 1.18, pw = cs * 0.16, gap = cs * 0.5, postEvery = 5;
      const fenceEdge = (A, B) => {
        const dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy);
        const ux = dx / len, uy = dy / len, nP = Math.round(len / gap);
        ctx.strokeStyle = '#f7f2e4'; ctx.lineCap = 'round'; ctx.lineWidth = cs * 0.13;
        ctx.beginPath(); ctx.moveTo(A[0], A[1] - fh * 0.36); ctx.lineTo(B[0], B[1] - fh * 0.36); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(A[0], A[1] - fh * 0.72); ctx.lineTo(B[0], B[1] - fh * 0.72); ctx.stroke();
        ctx.lineWidth = Math.max(1, cs * 0.045);
        for (let k = 0; k <= nP; k++) {
          const px = A[0] + ux * k * gap, py = A[1] + uy * k * gap;
          const isPost = k % postEvery === 0;
          const h2 = isPost ? fh * 1.28 : fh, w2 = isPost ? pw * 1.9 : pw;
          ctx.beginPath();
          ctx.moveTo(px - w2 / 2, py);
          ctx.lineTo(px - w2 / 2, py - h2 + w2 * 0.6);
          ctx.lineTo(px, py - h2);
          ctx.lineTo(px + w2 / 2, py - h2 + w2 * 0.6);
          ctx.lineTo(px + w2 / 2, py);
          ctx.closePath();
          ctx.fillStyle = isPost ? '#fdf9ee' : '#f7f2e4'; ctx.fill();
          ctx.strokeStyle = 'rgba(96,70,44,.8)'; ctx.stroke();
        }
      };
      const fOff = 0.3;
      fenceEdge(fP(0, rd.h + fOff), fP(rd.w + fOff, rd.h + fOff));
      fenceEdge(fP(rd.w + fOff, rd.h + fOff), fP(rd.w + fOff, 0));
    } else {
      /* 地板两条开口边画主题包边带 + 顶面高光线 */
      const bandC = ROOM_EDGE[rid] || '#7a5230';
      const bandEdge = (A, B) => {
        ctx.strokeStyle = bandC; ctx.lineCap = 'round'; ctx.lineWidth = cs * 0.34;
        ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,.32)'; ctx.lineWidth = Math.max(1, cs * 0.05);
        ctx.beginPath(); ctx.moveTo(A[0], A[1] - cs * 0.17); ctx.lineTo(B[0], B[1] - cs * 0.17); ctx.stroke();
      };
      const fOff = 0.08;
      bandEdge(fP(0, rd.h + fOff), fP(rd.w + fOff, rd.h + fOff));
      bandEdge(fP(rd.w + fOff, rd.h + fOff), fP(rd.w + fOff, 0));
    }
  }
  /* 地板菱形外轮廓 */
  ctx.lineWidth = 2.5; drawRhombus(ctx, roomFootprint(g, 0, 0, rd.w, rd.h), null, 'rgba(232,185,60,.5)');
  /* 摆放家具：按深度排序（底顶点 y 小的先画） */
  curFurn().slice().sort((a, b) => {
    const ha = effSize(GAME_DATA.furniture[a.id], a.r)[1], hb = effSize(GAME_DATA.furniture[b.id], b.r)[1];
    return (a.x + a.y + ha + effSize(GAME_DATA.furniture[a.id], a.r)[0]) - (b.x + b.y + hb + effSize(GAME_DATA.furniture[b.id], b.r)[0]);
  }).forEach(f => {
    const [w, h] = effSize(GAME_DATA.furniture[f.id], f.r);
    drawFurnSprite(ctx, f.id, f.x, f.y, w, h, 1, f.r || 0, cs, g);
    if (movingFurn === f) drawRhombus(ctx, roomFootprint(g, f.x, f.y, w, h), 'rgba(232,185,60,.22)', 'rgba(232,185,60,.7)');
  });
  /* 幽灵预览 */
  const ghostId = movingFurn ? movingFurn.id : placingFurn;
  if (ghostId && roomGhost) {
    const [w, h] = effSize(placeDef(ghostId), roomGhost.r || 0);
    const ok = furnFits(ghostId, roomGhost.x, roomGhost.y, movingFurn, 'room', roomGhost.r || 0);
    ctx.lineWidth = 2;
    drawRhombus(ctx, roomFootprint(g, roomGhost.x, roomGhost.y, w, h),
      ok ? 'rgba(110,220,120,.30)' : 'rgba(230,80,80,.30)', ok ? 'rgba(110,220,120,.95)' : 'rgba(230,80,80,.95)');
    drawFurnSprite(ctx, ghostId, roomGhost.x, roomGhost.y, w, h, ok ? 0.62 : 0.3, roomGhost.r || 0, cs, g);
  }
  ctx.strokeStyle = 'rgba(232,185,60,.55)'; ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
  if (drawRoom._pending) setTimeout(() => { if (cv.isConnected) drawRoom(cv); }, 380);
}
function showFurnMenu(f, tip, box) {
  const d = GAME_DATA.furniture[f.id];
  tip.innerHTML = `【${d.name}】${d.mods ? '加成：' + furnModsTxt(d.mods) + '　' : ''}`;
  const mk = (t, fn) => { const b = document.createElement('button'); b.className = 'btn'; b.style.cssText = 'font-size:11px;padding:3px 8px;margin-left:6px'; b.textContent = t; b.onclick = fn; tip.appendChild(b); };
  if (d.train) {
    const cost = Math.ceil(12 * (1 - (fmod().trainCut || 0) / 100));
    mk(`锻炼 ${STAT_NAMES[d.train]} +1（${cost}分钟）`, () => {
      if (!hubSpend(cost)) return;
      S[d.train]++; AudioSys.sfx('level'); toast(STAT_NAMES[d.train] + ' +1！'); renderBars(); renderRoom(box);
    });
  }
  mk('转向', () => {
    f.r = ((f.r || 0) + 1) % 4;
    if (!furnFits(f.id, f.x, f.y, f, 'room', f.r)) f.r = ((f.r + 2) % 4);   // 转不过去就退回
    AudioSys.sfx('click'); renderRoom(box);
  });
  mk('移动', () => {
    movingFurn = f; placingFurn = null; roomGhost = null;
    AudioSys.sfx('click'); toast('点新位置放下，占地会以绿色/红色提示'); renderRoom(box);
  });
  mk('收回仓库', () => {
    S.roomFurn[curRoomId()] = curFurn().filter(x => x !== f);
    S.furnStock = S.furnStock || {}; S.furnStock[f.id] = (S.furnStock[f.id] || 0) + 1;
    AudioSys.sfx('item'); renderRoom(box); renderBars();
  });
  mk(`回收 +${Math.floor((d.price || 0) / 2)}分`, () => {
    S.roomFurn[curRoomId()] = curFurn().filter(x => x !== f);
    S.pts += Math.floor((d.price || 0) / 2);
    AudioSys.sfx('coin'); toast(`已回收【${d.name}】，+${Math.floor((d.price || 0) / 2)} 积分`);
    $('hub-points-num').textContent = S.pts; renderRoom(box); renderBars();
  });
}
/* ---------- 轮回者街区（独立地图：店铺摆在这里） ---------- */
function renderStreet(box) {
  box.innerHTML = '';
  placingSeed = null; placingFurn = null; movingFurn = null; roomGhost = null;
  const head = document.createElement('div'); head.className = 'room-head';
  head.innerHTML = `<b>🏙️ 轮回者街区</b><span>主神空间边缘的一条小街——购入店铺自动落到它的专属铺位，进驻队友当店员，按停留时间产出积分。</span>`;
  box.appendChild(head);
  const wrap = document.createElement('div'); wrap.id = 'room-wrap';
  const cv = document.createElement('canvas');
  cv.id = 'street-canvas'; cv.width = 780; cv.height = Math.round(780 * STREET_BG_DIM[1] / STREET_BG_DIM[0]);
  const tip = document.createElement('div'); tip.id = 'room-tip';
  tip.textContent = '点击店铺：进驻店员 / 拆除。每种店有它的固定铺位。';
  wrap.appendChild(cv); wrap.appendChild(tip); box.appendChild(wrap);
  drawStreet(cv);
  cv.onclick = e => {
    const r = cv.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width * cv.width, my = (e.clientY - r.top) / r.height * cv.height;
    const scale = cv.width / STREET_BG_DIM[0];
    const sh = shopTileAt(mx, my, scale);
    if (sh) showShopMenu(sh, tip, box);
  };
  // 店铺库存（待开张）
  const shopStockIds = Object.keys(S.shopStock || {});
  if (shopStockIds.length) {
    const capS = document.createElement('div'); capS.className = 'room-cap'; capS.textContent = '🏪 店铺仓库（摆放后点击店铺进驻店员）';
    box.appendChild(capS);
    const listS = document.createElement('div'); listS.className = 'furn-list';
    shopStockIds.forEach(id => {
      const d = GAME_DATA.shops[id];
      const cell = document.createElement('div'); cell.className = 'furn-cell';
      cell.innerHTML = `<b><img class="furn-thumb" src="${FURN_IMG['shop_' + id]}" alt="">${d.name} ×${S.shopStock[id]}</b><span>${d.desc}｜产出 ${d.rate}分/分钟｜专属铺位</span>`;
      const b = document.createElement('button'); b.className = 'btn'; b.textContent = '摆放';
      b.onclick = () => {
        S.shops = S.shops || [];
        if (S.shops.some(s => s.id === id)) { toast('这家店已经开起来了'); return; }
        S.shops.push({ id, x: 0, y: 0, r: 0, ally: null });
        S.shopStock[id]--; if (S.shopStock[id] <= 0) delete S.shopStock[id];
        AudioSys.sfx('coin'); toast('「' + d.name + '」已在它的铺位开张，进驻店员后开始产出');
        renderStreet(box); renderBars();
      };
      cell.appendChild(b); listS.appendChild(cell);
    });
    box.appendChild(listS);
  }
  // 经营状态一览
  if (S.shops && S.shops.length) {
    const capR = document.createElement('div'); capR.className = 'room-cap'; capR.textContent = '📈 经营中（点击街区里的店铺管理）';
    box.appendChild(capR);
    const listR = document.createElement('div'); listR.className = 'furn-list';
    S.shops.forEach(s => {
      const d = GAME_DATA.shops[s.id];
      const a = s.ally ? GAME_DATA.allies[s.ally] : null;
      const match = a && a.shop && a.shop.tag === d.tag;
      const cell = document.createElement('div'); cell.className = 'furn-cell';
      cell.innerHTML = `<b><img class="furn-thumb" src="${FURN_IMG['shop_' + s.id]}" alt="">${d.name}</b>` +
        `<span>${a ? `店员：<b>${a.name}</b>${match ? `（专长 +${a.shop.pct}%）` : ''}｜产出 <b style="color:#ffd76a">${shopRate(s).toFixed(1)}分/分钟</b>` : '<i style="color:#c88">空置中——进驻队友后开张</i>'}</span>`;
      listR.appendChild(cell);
    });
    box.appendChild(listR);
  }
  // 店铺目录
  const cap3 = document.createElement('div'); cap3.className = 'room-cap'; cap3.textContent = '🏪 开店（队友进驻后按停留时间产出积分，专长队友效率更高）';
  box.appendChild(cap3);
  const sdir = document.createElement('div'); sdir.className = 'furn-list';
  Object.keys(GAME_DATA.shops).forEach(id => {
    const d = GAME_DATA.shops[id];
    const costHtml = d.g ? `<span class="grade-chip g${d.g}">${d.g}×${d.cnt || 1}</span> + ${d.price}分` : `${d.price}分`;
    const experts = Object.keys(GAME_DATA.allies).filter(a => GAME_DATA.allies[a].shop && GAME_DATA.allies[a].shop.tag === d.tag).map(a => GAME_DATA.allies[a].name + '+' + GAME_DATA.allies[a].shop.pct + '%').join('、');
    const cell = document.createElement('div'); cell.className = 'furn-cell';
    cell.innerHTML = `<b><img class="furn-thumb" src="${FURN_IMG['shop_' + id]}" alt="">${d.name}</b><span>${d.desc}｜产出 ${d.rate}分/分钟｜占格 ${d.size[0]}×${d.size[1]}${experts ? '｜专长：' + experts : ''}</span><span style="color:#ffd76a">${costHtml}</span>`;
    const b = document.createElement('button'); b.className = 'btn'; b.textContent = '购铺';
    b.disabled = d.g ? ((S.grade[d.g] || 0) < (d.cnt || 1) || S.pts < d.price) : S.pts < d.price;
    b.onclick = () => {
      if (d.g) { if ((S.grade[d.g] || 0) < (d.cnt || 1) || S.pts < d.price) return; S.grade[d.g] -= d.cnt || 1; S.pts -= d.price; }
      else { if (S.pts < d.price) return; S.pts -= d.price; }
      S.shopStock = S.shopStock || {}; S.shopStock[id] = (S.shopStock[id] || 0) + 1;
      AudioSys.sfx('coin'); toast('店铺已备好，点「摆放」选位置开张');
      $('hub-points-num').textContent = S.pts; renderGrades(); renderStreet(box);
    };
    cell.appendChild(b); sdir.appendChild(cell);
  });
  box.appendChild(sdir);
}
function drawStreet(cv) {
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  drawRoom._pending = false;
  const scale = W / STREET_BG_DIM[0];
  const bg = getImg(STREET_BG);
  if (bg.complete && bg.naturalWidth) ctx.drawImage(bg, 0, 0, W, H);
  else { ctx.fillStyle = '#3a3050'; ctx.fillRect(0, 0, W, H); drawRoom._pending = true; }
  const tiles = (S.shops || []).map(s => ({ s, t: SHOP_TILE[s.id] })).filter(o => o.t);
  tiles.sort((a, b) => {
    const pa = a.s.ally ? a.t.posOn : a.t.pos, pb = b.s.ally ? b.t.posOn : b.t.pos;
    return (pa[1] + pa[3]) - (pb[1] + pb[3]);
  });
  tiles.forEach(({ s, t }) => {
    const p = s.ally ? t.posOn : t.pos;
    const im = getImg(s.ally ? t.on : t.off);
    if (im.complete && im.naturalWidth) ctx.drawImage(im, p[0] * scale, p[1] * scale, p[2] * scale, p[3] * scale);
    else drawRoom._pending = true;
    // 进驻店员头像挂店门口
    if (s.ally) {
      const a = GAME_DATA.allies[s.ally];
      const ax = (p[0] + p[2]) * scale - 16, ay = p[1] * scale + 16;
      ctx.fillStyle = 'rgba(30,20,45,.85)';
      ctx.beginPath(); ctx.arc(ax, ay, 14, 0, 7); ctx.fill();
      ctx.strokeStyle = a && a.shop && a.shop.tag === GAME_DATA.shops[s.id].tag ? '#8fe08f' : '#ffd76a';
      ctx.lineWidth = 2; ctx.stroke();
      if (a) {
        const ai = getImg(a.img);
        if (ai.complete && ai.naturalWidth) {
          ctx.save(); ctx.beginPath(); ctx.arc(ax, ay, 12, 0, 7); ctx.clip();
          ctx.drawImage(ai, ax - 12, ay - 12, 24, 24); ctx.restore();
        } else drawRoom._pending = true;
      }
    }
  });
  ctx.strokeStyle = 'rgba(232,185,60,.55)'; ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
  if (drawRoom._pending) setTimeout(() => { if (cv.isConnected) drawStreet(cv); }, 380);
}
/* ---------- 店铺经营 ---------- */
function showShopMenu(s, tip, box) {
  const d = GAME_DATA.shops[s.id];
  const a = s.ally ? GAME_DATA.allies[s.ally] : null;
  const match = a && a.shop && a.shop.tag === d.tag;
  tip.innerHTML = `【${d.name}】${a ? `店员 ${a.name}${match ? ` 专长+${a.shop.pct}%` : ''}｜${shopRate(s).toFixed(1)}分/分钟` : '空置中——进驻队友开张'}　`;
  const mk = (t, fn, dis) => { const b = document.createElement('button'); b.className = 'btn'; b.style.cssText = 'font-size:11px;padding:3px 8px;margin-left:6px'; b.textContent = t; if (dis) b.disabled = true; b.onclick = fn; tip.appendChild(b); };
  const pool = [...(S.roster || []), ...(S.team || [])].filter(id => !staffedIds().includes(id));
  if (s.ally) {
    mk(`撤下 ${a.name}`, () => {
      S.roster = S.roster || []; S.roster.push(s.ally);
      s.ally = null; AudioSys.sfx('click'); toast(a.name + ' 已撤下，回到待命'); renderStreet(box);
    });
  } else {
    pool.forEach(id => {
      const al = GAME_DATA.allies[id];
      const isMatch = al.shop && al.shop.tag === d.tag;
      mk(`进驻 ${al.name}${isMatch ? `★${al.shop.pct}%` : ''}`, () => {
        S.team = (S.team || []).filter(x => x !== id);
        S.roster = (S.roster || []).filter(x => x !== id);
        s.ally = id; AudioSys.sfx('coin');
        toast(`${al.name} 进驻「${d.name}」${isMatch ? `——专长对口，产出 +${al.shop.pct}%` : ''}！`);
        renderStreet(box);
      });
    });
    if (!pool.length) mk('无可进驻队友', () => {}, true);
  }
  mk('拆除收回', () => {
    if (s.ally) { S.roster = S.roster || []; S.roster.push(s.ally); }
    S.shops = S.shops.filter(x => x !== s);
    S.shopStock = S.shopStock || {}; S.shopStock[s.id] = (S.shopStock[s.id] || 0) + 1;
    AudioSys.sfx('item'); renderStreet(box); renderBars();
  });
}
/* ---------- 灵植园 ---------- */
function plotAt(x, y) { return (S.garden || []).find(p => p.x === x && p.y === y); }
function renderGarden(box) {
  box.innerHTML = '';
  placingFurn = null; movingFurn = null;
  const head = document.createElement('div'); head.className = 'room-head';
  head.innerHTML = `<b>🌿 灵植园</b><span>主神空间后山的一方药圃。播下种子，随停留时间生长，成熟后采收灵植——可直接服用，也是炼丹房的原料。</span>`;
  box.appendChild(head);
  const wrap = document.createElement('div'); wrap.id = 'room-wrap';
  const cv = document.createElement('canvas');
  cv.id = 'garden-canvas'; cv.width = GARDEN_CVS_W; cv.height = GARDEN_CVS_H;
  const tip = document.createElement('div'); tip.id = 'room-tip';
  tip.textContent = placingSeed ? '点击空苗圃播种【' + GAME_DATA.seeds[placingSeed].name + '】' : '点击发光的成熟灵植采收；点空苗圃可先选种子再播种。';
  wrap.appendChild(cv); wrap.appendChild(tip); box.appendChild(wrap);
  drawGarden(cv);
  const cellOf = e => {
    const r = cv.getBoundingClientRect();
    const mx = (e.clientX - r.left) * cv.width / r.width, my = (e.clientY - r.top) * cv.height / r.height;
    for (let y = 0; y < GARDEN_H; y++) for (let x = 0; x < GARDEN_W; x++) {
      const { px, py } = plotXY(x, y);
      if (mx >= px - 6 && mx <= px + GARDEN_PLOT_W + 6 && my >= py - 40 && my <= py + GARDEN_PLOT_H + 4) return { x, y };
    }
    return { x: -1, y: -1 };
  };
  cv.onpointermove = e => {
    const p = cellOf(e);
    if (!roomGhost || roomGhost.x !== p.x || roomGhost.y !== p.y) { roomGhost = p; drawGarden(cv); }
  };
  cv.onpointerleave = () => { roomGhost = null; drawGarden(cv); };
  cv.onclick = e => {
    const { x, y } = cellOf(e);
    if (x < 0) return;
    const p = plotAt(x, y);
    if (placingSeed) {
      if (p) { tip.textContent = '这块苗圃已经有灵植了。'; AudioSys.sfx('deny'); return; }
      S.garden = S.garden || [];
      S.garden.push({ seed: placingSeed, x, y, left: GAME_DATA.seeds[placingSeed].grow });
      placingSeed = null; AudioSys.sfx('coin'); renderGarden(box);
      return;
    }
    if (p && p.left <= 0) {
      const sd = GAME_DATA.seeds[p.seed];
      S.inv[sd.out] = (S.inv[sd.out] || 0) + 1;
      S.garden = S.garden.filter(q => q !== p);
      AudioSys.sfx('level'); toast(`采收【${GAME_DATA.items[sd.out].name}】×1`);
      renderGarden(box); return;
    }
    if (p) tip.textContent = `【${GAME_DATA.seeds[p.seed].name}】生长中，还需 ${p.left} 分钟。`;
  };
  // 种子目录
  const cap = document.createElement('div'); cap.className = 'room-cap'; cap.textContent = '🌱 种子目录（买入即播，成熟按停留时间计）';
  box.appendChild(cap);
  const list = document.createElement('div'); list.className = 'furn-list';
  Object.keys(GAME_DATA.seeds).forEach(id => {
    const sd = GAME_DATA.seeds[id];
    const cell = document.createElement('div'); cell.className = 'furn-cell' + (placingSeed === id ? ' room-placing' : '');
    cell.innerHTML = `<b><span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:${sd.color};margin-right:5px;vertical-align:-2px"></span>${sd.name}</b><span>${sd.desc}</span><span style="color:#ffd76a">${sd.price}分</span>`;
    const b = document.createElement('button'); b.className = 'btn'; b.textContent = placingSeed === id ? '取消' : '购种播种';
    b.disabled = S.pts < sd.price;
    b.onclick = () => {
      if (placingSeed === id) { placingSeed = null; renderGarden(box); return; }
      if (S.pts < sd.price) return;
      S.pts -= sd.price; placingSeed = id; roomGhost = null;
      AudioSys.sfx('coin'); $('hub-points-num').textContent = S.pts; renderGarden(box);
    };
    cell.appendChild(b); list.appendChild(cell);
  });
  box.appendChild(list);
}
function drawGarden(cv) {
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  drawRoom._pending = false;
  const bg = getImg(GARDEN_BG);
  if (bg.complete && bg.naturalWidth) ctx.drawImage(bg, 0, 0, W, H);
  else { ctx.fillStyle = '#58a63f'; ctx.fillRect(0, 0, W, H); drawRoom._pending = true; setTimeout(() => { if (cv.isConnected) drawGarden(cv); }, 300); }
  /* QQ农场风：AI 翻土垄块贴图，四簇 3×2 绕中央喷泉 */
  const tile = getImg(GARDEN_PLOT_SRC);
  const tileOk = tile.complete && tile.naturalWidth;
  if (!tileOk) setTimeout(() => { if (cv.isConnected) drawGarden(cv); }, 300);
  for (let y = 0; y < GARDEN_H; y++) for (let x = 0; x < GARDEN_W; x++) {
    const { px, py } = plotXY(x, y);
    if (tileOk) ctx.drawImage(tile, px, py, GARDEN_PLOT_W, GARDEN_PLOT_H);
    else {
      ctx.fillStyle = '#96693a';
      ctx.beginPath(); ctx.roundRect(px, py, GARDEN_PLOT_W, GARDEN_PLOT_H, 8); ctx.fill();
    }
  }
  /* 植株：发芽程序化 → 作物立绘随进度放大 → 成熟发光可采收 */
  (S.garden || []).forEach(p => {
    const sd = GAME_DATA.seeds[p.seed];
    const { px, py } = plotXY(p.x, p.y);
    const prog = clamp(1 - p.left / sd.grow, 0, 1);
    const cx = px + GARDEN_PLOT_W / 2, by = py + GARDEN_PLOT_H - 8;
    const crop = getImg(CROP_SRCS[p.seed]);
    const cropOk = crop && crop.complete && crop.naturalWidth;
    if (prog < 0.1) {
      // 刚发芽：两片小叶
      ctx.fillStyle = '#6fae4c'; ctx.beginPath(); ctx.arc(cx, by - 3, 3.5, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx - 5, by - 6, 5, 3, -0.6, 0, 7); ctx.fill();
      ctx.fillStyle = '#8fcf63'; ctx.beginPath(); ctx.ellipse(cx + 5, by - 7, 5, 3, 0.6, 0, 7); ctx.fill();
    } else if (cropOk) {
      const sc = p.left <= 0 ? 1 : (0.28 + prog * 0.66);
      const cw = 92 * sc, ch = cw * (crop.naturalHeight / crop.naturalWidth);
      const wob = Math.sin((animFrame + p.x * 31 + p.y * 17) / 16) * (p.left <= 0 ? 0.02 : 0.008);
      ctx.save();
      ctx.translate(cx, by + 2); ctx.rotate(wob);
      if (p.left <= 0) { // 成熟光晕
        const pulse = 3 + Math.sin(animFrame / 8) * 1.5;
        ctx.fillStyle = 'rgba(255,244,180,.18)';
        ctx.beginPath(); ctx.arc(0, -ch * 0.55, cw * 0.52 + pulse, 0, 7); ctx.fill();
      }
      ctx.drawImage(crop, -cw / 2, -ch, cw, ch);
      ctx.restore();
      if (p.left <= 0) {
        ctx.fillStyle = 'rgba(255,244,200,.95)'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
        ctx.strokeStyle = 'rgba(60,35,10,.9)'; ctx.lineWidth = 3;
        ctx.strokeText('可采收', cx, py - 4); ctx.fillText('可采收', cx, py - 4);
      }
    } else {
      // 贴图未就绪的兜底：简单叶丛
      ctx.fillStyle = sd.color;
      ctx.beginPath(); ctx.ellipse(cx, by - 12 * prog, 12 * prog, 8 * prog, 0, 0, 7); ctx.fill();
    }
    if (p.left > 0 && prog >= 0.1) {
      // 生长进度条（迷你）
      ctx.fillStyle = 'rgba(30,20,10,.55)'; ctx.fillRect(px + 12, py + GARDEN_PLOT_H - 5, GARDEN_PLOT_W - 24, 4);
      ctx.fillStyle = '#8fd96a'; ctx.fillRect(px + 12, py + GARDEN_PLOT_H - 5, (GARDEN_PLOT_W - 24) * prog, 4);
    }
  });
  if (placingSeed && roomGhost && roomGhost.x >= 0) {
    const ok = !plotAt(roomGhost.x, roomGhost.y);
    const { px, py } = plotXY(roomGhost.x, roomGhost.y);
    ctx.fillStyle = ok ? 'rgba(140,240,160,.30)' : 'rgba(220,80,80,.34)';
    ctx.strokeStyle = ok ? 'rgba(160,255,170,.95)' : 'rgba(240,110,110,.9)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(px - 2, py - 2, GARDEN_PLOT_W + 4, GARDEN_PLOT_H + 4, 8);
    ctx.fill(); ctx.stroke();
  }
  if ((S.garden || []).some(p => p.left <= 0)) setTimeout(() => { if (cv.isConnected) drawGarden(cv); }, 120);
}
/* ---------- 灵兽园（QQ牧场式：幼崽放养游走、成熟点击收产出） ---------- */
const PASTURE_BG = 'assets/pasture_bg.jpg', PASTURE_W = 560, PASTURE_H = 280;
function renderBeast(box) {
  box.innerHTML = '';
  placingFurn = null; movingFurn = null; placingSeed = null;
  const head = document.createElement('div'); head.className = 'room-head';
  head.innerHTML = `<b>🦊 灵兽园</b><span>围栏牧场里放养灵兽幼崽——小家伙们在草地上游走吃草，随停留时间长大，成熟后点它收产出（可服用也可卖出）。点成长中的灵兽可投喂加速。</span>`;
  box.appendChild(head);
  const wrap = document.createElement('div'); wrap.id = 'room-wrap';
  const cv = document.createElement('canvas');
  cv.id = 'beast-canvas'; cv.width = PASTURE_W; cv.height = PASTURE_H;
  const tip = document.createElement('div'); tip.id = 'room-tip';
  tip.textContent = '点击发光的成熟灵兽收产出；点击成长中的灵兽投喂（20分，-15分钟）。';
  wrap.appendChild(cv); wrap.appendChild(tip); box.appendChild(wrap);
  S.beasts = S.beasts || [];
  drawBeast(cv);
  cv.onclick = e => {
    const r = cv.getBoundingClientRect();
    const mx = (e.clientX - r.left) * cv.width / r.width, my = (e.clientY - r.top) * cv.height / r.height;
    const b = [...S.beasts].reverse().find(q => Math.hypot(q.x - mx, q.y - my) < 34);
    if (!b) return;
    const bd = GAME_DATA.beasts[b.id];
    if (b.left <= 0) {
      S.inv[bd.out] = (S.inv[bd.out] || 0) + 1;
      b.left = bd.grow;
      AudioSys.sfx('level'); toast(`收获【${GAME_DATA.items[bd.out].name}】×1，${bd.name}继续吃草长大`);
      renderBeast(box); return;
    }
    // 投喂
    if (S.pts < 20) { toast('积分不足 20'); AudioSys.sfx('deny'); return; }
    S.pts -= 20; b.left = Math.max(0, b.left - 15);
    AudioSys.sfx('item'); $('hub-points-num').textContent = S.pts;
    tip.textContent = `投喂了【${bd.name}】——${b.left <= 0 ? '吃得太饱当场成熟了！' : `开心吃草，还需 ${b.left} 分钟。`}`;
    drawBeast(cv);
  };
  // 幼崽兽栏目录
  const cap = document.createElement('div'); cap.className = 'room-cap'; cap.textContent = `🐾 幼崽兽栏（目前在养 ${S.beasts.length} 只，上限 8）`;
  box.appendChild(cap);
  const list = document.createElement('div'); list.className = 'furn-list';
  Object.keys(GAME_DATA.beasts).forEach(id => {
    const bd = GAME_DATA.beasts[id];
    const cell = document.createElement('div'); cell.className = 'furn-cell';
    const priceTxt = bd.g ? `${bd.g}×${bd.cnt} + ${bd.price}分` : `${bd.price}分`;
    cell.innerHTML = `<img src="${bd.img}" style="width:44px;height:44px;object-fit:contain;filter:drop-shadow(0 3px 3px rgba(0,0,0,.4))"><b>${bd.name}</b><span>${bd.desc}</span><span style="color:#ffd76a">${priceTxt}</span>`;
    const b = document.createElement('button'); b.className = 'btn'; b.textContent = '购入幼崽';
    const enough = S.pts >= bd.price && (!bd.g || (S.grade && (S.grade[bd.g] || 0) >= (bd.cnt || 1)));
    b.disabled = !enough || S.beasts.length >= 8;
    b.onclick = () => {
      if (bd.g) {
        if (!(S.grade && (S.grade[bd.g] || 0) >= (bd.cnt || 1))) { toast(`${bd.g}级徽章不足`); return; }
        S.grade[bd.g] -= bd.cnt || 1; renderGrades();
      }
      S.pts -= bd.price;
      S.beasts.push({ id, x: 80 + Math.random() * 400, y: 70 + Math.random() * 160, vx: 0, vy: 0, left: bd.grow });
      AudioSys.sfx('coin'); $('hub-points-num').textContent = S.pts; renderBeast(box);
    };
    cell.appendChild(b); list.appendChild(cell);
  });
  box.appendChild(list);
}
function drawBeast(cv) {
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const bg = getImg(PASTURE_BG);
  if (bg.complete && bg.naturalWidth) ctx.drawImage(bg, 0, 0, W, H);
  else { ctx.fillStyle = '#5c8f4a'; ctx.fillRect(0, 0, W, H); }
  ctx.strokeStyle = 'rgba(232,185,60,.5)'; ctx.lineWidth = 3; ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
  const list = (S && S.beasts) || [];
  // 游走：每帧挪一点，偶尔换方向
  list.forEach(b => {
    if (Math.random() < 0.02 || (!b.vx && !b.vy)) {
      const a = Math.random() * Math.PI * 2, sp = 0.15 + Math.random() * 0.3;
      b.vx = Math.cos(a) * sp; b.vy = Math.sin(a) * sp * 0.6;
    }
    b.x = clamp(b.x + b.vx, 40, W - 40); b.y = clamp(b.y + b.vy, 62, H - 34);
    if (b.x <= 40 || b.x >= W - 40) b.vx = -b.vx;
    if (b.y <= 62 || b.y >= H - 34) b.vy = -b.vy;
  });
  // 按 y 排序画（前面压后面）
  [...list].sort((a, b2) => a.y - b2.y).forEach(b => {
    const bd = GAME_DATA.beasts[b.id];
    const im = getImg(bd.img);
    const bob = Math.sin((animFrame + b.x) / 12) * 2;
    const scale = b.left <= 0 ? 1.15 : 0.72 + 0.43 * clamp(1 - b.left / bd.grow, 0, 1);
    const bw = 62 * scale, bh = bw * (im.naturalHeight && im.complete ? im.naturalHeight / im.naturalWidth : 1.15);
    // 地影
    ctx.fillStyle = 'rgba(30,50,20,.35)';
    ctx.beginPath(); ctx.ellipse(b.x, b.y + bh * 0.42, bw * 0.42, bw * 0.14, 0, 0, 7); ctx.fill();
    if (b.left <= 0) {
      // 成熟光晕
      const pulse = 1 + Math.sin(animFrame / 8) * 0.08;
      ctx.fillStyle = 'rgba(255,240,170,.18)';
      ctx.beginPath(); ctx.arc(b.x, b.y, bw * 0.62 * pulse, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(255,220,120,.75)'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(b.x, b.y, bw * 0.56 * pulse, 0, 7); ctx.stroke();
    }
    if (im.complete && im.naturalWidth) {
      ctx.save(); ctx.translate(b.x, b.y + bob);
      if (b.vx < 0) ctx.scale(-1, 1); // 朝游走方向
      ctx.drawImage(im, -bw / 2, -bh / 2, bw, bh); ctx.restore();
    } else {
      ctx.fillStyle = '#eee'; ctx.beginPath(); ctx.arc(b.x, b.y, bw / 2.4, 0, 7); ctx.fill();
    }
    if (b.left <= 0) {
      ctx.fillStyle = 'rgba(255,244,200,.95)'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(60,35,10,.9)'; ctx.lineWidth = 3;
      ctx.strokeText('可采收', b.x, b.y - bh * 0.55); ctx.fillText('可采收', b.x, b.y - bh * 0.55);
    } else {
      // 迷你进度条
      const prog = clamp(1 - b.left / bd.grow, 0, 1);
      ctx.fillStyle = 'rgba(30,20,10,.55)'; ctx.fillRect(b.x - 20, b.y + bh * 0.5, 40, 4);
      ctx.fillStyle = '#8fd96a'; ctx.fillRect(b.x - 20, b.y + bh * 0.5, 40 * prog, 4);
    }
  });
  if (cv.isConnected) setTimeout(() => drawBeast(cv), 140);
}
function renderAlchemy(box) {
  box.innerHTML = '';
  placingFurn = null; placingSeed = null; movingFurn = null;
  const head = document.createElement('div'); head.className = 'room-head';
  head.innerHTML = `<b>⚗️ 炼丹房</b><span>青铜丹炉一坐，灵植入火成丹。一次只能炼一炉，成丹时间按停留时间计。</span>`;
  box.appendChild(head);
  const im = document.createElement('img'); im.src = ALCHEMY_BG; im.className = 'alchemy-banner'; im.alt = '';
  box.appendChild(im);
  // 丹炉状态
  const stove = document.createElement('div'); stove.className = 'ev-card';
  if (S.brew) {
    const r = GAME_DATA.recipes[S.brew.rid];
    stove.innerHTML = `<h3>🔥 炉中：${r.name}</h3><p>还需 <b>${S.brew.left} 分钟</b>停留时间成丹。炉火正旺，去别处转转吧。</p>`;
  } else {
    stove.innerHTML = `<h3>丹炉空闲</h3><p>挑一张丹方开炉。原料来自灵植园，炼丹还要少许积分作火资。</p>`;
  }
  box.appendChild(stove);
  const cap = document.createElement('div'); cap.className = 'room-cap'; cap.textContent = '📜 丹方';
  box.appendChild(cap);
  const list = document.createElement('div'); list.className = 'furn-list';
  Object.keys(GAME_DATA.recipes).forEach(rid => {
    const r = GAME_DATA.recipes[rid];
    const needTxt = Object.keys(r.need).map(k => `${GAME_DATA.items[k].name}×${r.need[k]}（有 ${S.inv[k] || 0}）`).join('、');
    const can = !S.brew && S.pts >= r.pts && Object.keys(r.need).every(k => (S.inv[k] || 0) >= r.need[k]);
    const cell = document.createElement('div'); cell.className = 'furn-cell';
    cell.innerHTML = `<b>${r.name}</b><span>${r.desc}｜需 ${needTxt}｜火资 ${r.pts}分｜炼制 ${r.brew}分钟</span>`;
    const b = document.createElement('button'); b.className = 'btn'; b.textContent = S.brew ? '炉 occupied' : '开炉';
    b.disabled = !can;
    b.onclick = () => {
      if (!can) return;
      Object.keys(r.need).forEach(k => { S.inv[k] -= r.need[k]; if (S.inv[k] <= 0) delete S.inv[k]; });
      S.pts -= r.pts; S.brew = { rid, left: r.brew };
      AudioSys.sfx('coin'); toast(`【${r.name}】开炉，${r.brew} 分钟后丹成`);
      $('hub-points-num').textContent = S.pts; renderAlchemy(box); renderBars();
    };
    cell.appendChild(b); list.appendChild(cell);
  });
  box.appendChild(list);
}

/* ---------- 评级页 ---------- */
function renderGradeTab(box) {
  box.innerHTML = '';
  const info = document.createElement('div'); info.className = 'ev-card';
  info.innerHTML = `<h3>评级徽章</h3><p>通关按<b>探索度</b>结算评级（需走遍地图、触发事件、击败 Boss）：<br>S ≥92% ｜ A ≥78% ｜ B ≥55% ｜ C &lt;55%<br>支线剧情与主神空间偶遇也会赠徽章。高级兑换（神器/龙血/弑神者…）需要<b>徽章 + 积分</b>一起支付。<br>高阶徽章可拆分：<b>S→3A → 9B → 27C</b>（单向）。</p>`;
  box.appendChild(info);
  GRADE_ORDER.slice().reverse().forEach((g, i) => {
    const row = document.createElement('div'); row.className = 'grade-row';
    row.innerHTML = `<span class="grade-chip g${g}" style="font-size:16px">${g}</span><span class="gnum">${S.grade[g] || 0}</span>`;
    const lower = GRADE_ORDER.slice().reverse()[i + 1];
    if (lower) {
      const b = document.createElement('button'); b.className = 'btn grade-split';
      b.textContent = `拆成 ${lower}×3`;
      b.disabled = (S.grade[g] || 0) <= 0;
      b.onclick = () => splitGrade(g, lower);
      row.appendChild(b);
    }
    box.appendChild(row);
  });
  const best = document.createElement('div'); best.className = 'ev-card'; best.style.marginTop = '10px';
  best.innerHTML = '<h3>各关最佳评级</h3><p>' + GAME_DATA.levels.map(lv => `${lv.title}：<b style="color:var(--gold)">${S.bestGrade[lv.id] || '—'}</b>`).join('<br>') + '</p>';
  box.appendChild(best);
}

/* ---------- 觐见主神 ---------- */
function godDialog() {
  AudioSys.sfx('click');
  const body = $('modal-body'); body.innerHTML = '';
  const card = document.createElement('div'); card.className = 'ev-card';
  card.innerHTML = `<h3>主神</h3><p>巨大的光球缓缓旋转，无数光门在它周围明明灭灭。一个无感情的意识直接在你脑内响起：<br><br>「轮回者。通关世界，赚取积分与评级徽章。探索度决定评级，徽章兑换神器与至高力量。你的私人空间已经分配完毕——去看看吧。」</p>`;
  [['询问评级的意义', '评级由探索度结算：走遍地图、触发剧情、击杀 Boss。高级兑换需要高级徽章。'],
   ['询问时间限制', '每个世界有滞留时限：移动、战斗、剧情、停留都消耗时间。时间耗尽会被强制召回，探索进度保留。主神空间内也有限时——用在家具锻炼和偶遇事件上。'],
   ['询问私人空间', '「私人空间」页可购买并摆放家具。锻炼类家具消耗停留时间换永久属性；功能类家具提供常驻加成。'],
   ['离开', null]].forEach(([t, ans]) => {
    const b = document.createElement('button'); b.className = 'btn'; b.style.margin = '4px 6px 0 0'; b.textContent = t;
    b.onclick = () => {
      if (!ans) { closeModal(); return; }
      const p = document.createElement('p'); p.style.cssText = 'font-size:12px;color:#cfd4e8;margin-top:8px'; p.textContent = '「' + ans + '」';
      card.appendChild(p);
    };
    card.appendChild(b);
  });
  body.appendChild(card);
  openModal('觐见主神');
}

