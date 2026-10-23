
/* ========== 地图数据：地形 / 实体 / 出生点 / 开场白 ========== */
/* 地形字符通用约定：
   '#' 障碍(墙/建筑)  '.' 主路面  ',' 次路面  '~' 液体/黑暗  'x' 残骸/家具/装饰障碍  ' ' 虚空 */

const MAP_DEFS = {
  /* ---------- 第一关 · 丧尸围城 ---------- */
  lv1: {
    spawn: [2, 10], dark: 0.40,
    introText: '头痛欲裂。你在瓦砾中醒来，天空铅灰。\n\n机械音响起：「欢迎进入无限轮回。当前世界：T病毒泄露后的浣熊市郊外。任务：抵达东北侧医院天台的撤离点。」\n\n移动：WASD/方向键，或点击地面自动寻路。撞上怪物=开战，走到❗处触发剧情，✦是物资。',
    terrain: {
      '#': { name: '废墟建筑', tile: 'dark', tex: 'ruin', color: '#49505a', block: true },
      '.': { name: '马路', tile: 'stone', tex: 'road',     color: '#53565e' },
      ',': { name: '人行道', tile: 'dirt',   color: '#5c6558', deco: '#708066' },
      'x': { name: '残骸堆', tile: 'rubble',   tex: 'ruin', color: '#60554e', block: true, deco: '#706050' },
      '~': { name: '积水', tile: 'water',     color: '#3c4860' },
    },
    map: [
      '########################',
      '#......x....#..........#',
      '#.####......#..x..x....#',
      '#.#..#..x...#..........#',
      '#.#..#......x..####....#',
      '#.#..x........#..#~#...#',
      '#.#......x....#..#~#...#',
      '#.######.######..#.....#',
      '#......x....#....##.##.#',
      '#..x........#..x.......#',
      '#....x..x...#.....x....#',
      '########################',
    ],
    entities: [
      { t: 'node', node: 'corpse', x: 6, y: 9 },
      { t: 'node', node: 'store',  x: 3, y: 4 },
      { t: 'node', node: 'girl', npc: 'npc_girl', x: 12, y: 8 },
      { t: 'enemy', id: 'zombie',  x: 9,  y: 10, patrol: [[9,10],[9,9],[10,10]] },
      { t: 'enemy', id: 'zombie',  x: 15, y: 5 },
      { t: 'enemy', id: 'zombie',  x: 19, y: 8, patrol: [[19,8],[19,9]] },
      { t: 'enemy', id: 'dogs',    x: 20, y: 4, patrol: [[20,4],[21,4],[20,3]] },
      { t: 'item',  item: 'bandage', x: 7, y: 2 },
      { t: 'item',  item: 'molotov', x: 15, y: 10 },
      { t: 'enemy', id: 'butcher', x: 21, y: 1 },   // BOSS=撤离点
      { t: 'stat', stat: {str: 1}, x: 11, y: 8 },
      { t: 'item', item: 'medkit', x: 13, y: 6 },
      { t: 'gear', equip: {weapon: 'pipe'}, x: 18, y: 6 },
    ],
  },

  /* ---------- 第二关 · 异形巢穴 ---------- */
  lv2: {
    spawn: [2, 11], dark: 0.52,
    introText: '冰冷气体喷在脸上。你从冬眠舱醒来，四周只有幽蓝应急灯。\n\n「副本载入：诺史莫级货运船。任务：抵达船尾逃生舱。警告：存在高威胁生物——它们怕火。」\n\n通风管传来沙沙的爬行声。小心生物质覆盖的区域。',
    terrain: {
      '#': { name: '舱壁', tile: 'dark', tex: 'chitin',     color: '#393e48', block: true },
      '.': { name: '金属地板', tile: 'stone', tex: 'biomass', color: '#444a56', deco: '#505868' },
      ',': { name: '走廊', tile: 'stone', tex: 'biomass',     color: '#404652', deco: '#4b5360' },
      '~': { name: '生物质', tile: 'void', tex: 'biomass',   color: '#303646', deco: '#403a4e' },
      'x': { name: '卵堆', tile: 'crate',     tex: 'chitin', color: '#504454', block: true, deco: '#605066' },
    },
    map: [
      '########################',
      '#..........x..~#.......#',
      '#.##.#....#......#..x..#',
      '#.##.#.~~.#.####.#.....#',
      '#....#.~~.#.#..#.#..#..#',
      '#.##.#....#.#..#.#..#..#',
      '#.##.######.#..#.#..#..#',
      '#.##........##.###..#..#',
      '#.######.x...........#.#',
      '#......#.#..~~~~.x.#...#',
      '#..x...#.#..~~~~...#...#',
      '##.#####################',
    ],
    entities: [
      { t: 'node', node: 'locker',  x: 4, y: 10 },
      { t: 'node', node: 'bridge',  x: 10, y: 1 },
      { t: 'node', node: 'lab', npc: 'npc_scientist', x: 15, y: 5 },
      { t: 'enemy', id: 'hugger',   x: 8,  y: 8, patrol: [[8,8],[9,8],[8,9]] },
      { t: 'enemy', id: 'drone',    x: 13, y: 9, patrol: [[13,9],[14,9],[13,10]] },
      { t: 'enemy', id: 'drone',    x: 19, y: 7 },
      { t: 'item',  item: 'molotov', x: 6, y: 4 },
      { t: 'item',  item: 'medkit',  x: 18, y: 10 },
      { t: 'enemy', id: 'queen',    x: 22, y: 1 },   // BOSS
      { t: 'stat', stat: {agi: 1}, x: 8, y: 5 },
      { t: 'item', item: 'grenade', x: 15, y: 8 },
      { t: 'gear', equip: {armor: 'vest'}, x: 14, y: 2 },
    ],
  },

  /* ---------- 第三关 · 鬼怪凶宅 ---------- */
  lv3: {
    spawn: [2, 6], dark: 0.55,
    introText: '暴雨之夜。你站在民国老宅前，纸灯笼无风自动。\n\n「副本载入：槐安巷凶宅。任务：查明宅中真相并活到天亮。警告：物理攻击对灵体效果低下——寻找桃木剑等克制手段。」\n\n屋里点着白蜡烛。火苗是幽绿色的。',
    terrain: {
      '#': { name: '木墙', tile: 'wall_wood', tex: 'wallpaper',   color: '#443c36', block: true },
      '.': { name: '木地板', tile: 'wood', tex: 'wood', color: '#504840', deco: '#5b5046' },
      ',': { name: '石板院', tile: 'dirt', tex: 'bluestone', color: '#4a443e', deco: '#565048' },
      '~': { name: '暗处', tile: 'void', tex: 'dark',   color: '#32302c', deco: '#3c3834' },
      'x': { name: '家具', tile: 'crate',   tex: 'wood', color: '#5b4f44', block: true, deco: '#6b5e4c' },
    },
    map: [
      '########################',
      '#..x..#....#.......x...#',
      '#.....#....#...#.......#',
      '#..x..#.~~.#.x.#.####..#',
      '###.###.~~.#...#.#..#..#',
      '#......#...#...#.#..#..#',
      '#..x...#.x.#.x.#.#..#..#',
      '#......#...#...#....#..#',
      '####.###.###.#####.##.##',
      '#...............#......#',
      '#..x....x....x..#..x...#',
      '########################',
    ],
    entities: [
      { t: 'node', node: 'yard',     x: 5, y: 9 },
      { t: 'node', node: 'hall',     x: 8, y: 5 },
      { t: 'node', node: 'kitchen',  x: 12, y: 7 },
      { t: 'node', node: 'bedroom', npc: 'npc_girl', x: 16, y: 1 },
      { t: 'enemy', id: 'doll',      x: 10, y: 3, patrol: [[10,3],[10,4]] },
      { t: 'enemy', id: 'revenant',  x: 15, y: 9, patrol: [[15,9],[16,9],[15,10]] },
      { t: 'item',  item: 'holywater', x: 3, y: 10 },
      { t: 'item',  item: 'charm',     x: 20, y: 10 },
      { t: 'enemy', id: 'lady',      x: 22, y: 4 },   // BOSS
      { t: 'stat', stat: {men: 1}, x: 7, y: 1 },
      { t: 'item', item: 'holywater', x: 16, y: 6 },
      { t: 'gear', equip: {weapon: 'talisman'}, x: 15, y: 1 },
    ],
  },

  /* ---------- 第四关 · 规则怪谈 ---------- */
  lv4: {
    spawn: [2, 10], dark: 0.45,
    introText: '你成了「幸福公寓」的新住户。布告栏贴着《住户守则》——有些规则保命，有些是它写的。\n\n「副本载入：规则怪谈·幸福公寓。任务：活过检查。记住：管理员穿红色制服。」\n\n走廊尽头，有一间不该存在的404室。',
    terrain: {
      '#': { name: '墙壁', tile: 'brick', tex: 'brick',   color: '#3c4049', block: true },
      '.': { name: '走廊', tile: 'floor', tex: 'biomass',   color: '#494f5b', deco: '#505866' },
      ',': { name: '房间', tile: 'floor', tex: 'tatami',   color: '#454b56', deco: '#4f5662' },
      '~': { name: '暗区', tile: 'void', tex: 'dark',   color: '#333841' },
      'x': { name: '杂物', tile: 'crate',   tex: 'brick', color: '#535a69', block: true, deco: '#60687a' },
    },
    map: [
      '########################',
      '#....#......#....#..~..#',
      '#.##.#..x...#.##.#..~..#',
      '#.##.#......#.##.#.....#',
      '#....#..#...#....#.###.#',
      '#.##.#..#...#.##.#.#...#',
      '#.##.#..#...#.##.#.#.x.#',
      '#....#..#...#....#.#...#',
      '####.####.#####.##.###.#',
      '#......................#',
      '#..x....x......x.....x.#',
      '########################',
    ],
    entities: [
      { t: 'node', node: 'lobby',      x: 4, y: 9 },
      { t: 'node', node: 'elevator',   x: 10, y: 9 },
      { t: 'node', node: 'room403',    x: 6, y: 1 },
      { t: 'node', node: 'corridor',   x: 15, y: 3 },
      { t: 'enemy', id: 'neighbor',    x: 8,  y: 9, patrol: [[8,9],[9,9],[8,10]] },
      { t: 'enemy', id: 'neighbor',    x: 17, y: 10 },
      { t: 'item',  item: 'rules_note', x: 12, y: 10 },
      { t: 'item',  item: 'charm',      x: 20, y: 2 },
      { t: 'enemy', id: 'keeper',      x: 21, y: 1 },   // BOSS
      { t: 'stat', stat: {luk: 1}, x: 10, y: 7 },
      { t: 'item', item: 'pills', x: 8, y: 1 },
      { t: 'gear', equip: {weapon: 'taser'}, x: 21, y: 9 },
    ],
  },

  /* ---------- 第五关 · 无限列车 ---------- */
  lv5: {
    spawn: [1, 6], dark: 0.35,
    introText: '「副本载入：午夜特快。任务：从9号车厢走到0号车头。」\n\n窗外是无尽黑夜隧道。广播温柔地重复：「请保管好车票。丢失车票的乘客，将成为本列车的新乘员。」\n\n一路向右走，就是车头。',
    terrain: {
      '#': { name: '车厢壁', tile: 'dark', tex: 'metal', color: '#35302c', block: true },
      '.': { name: '车厢', tile: 'wood', tex: 'metal',   color: '#493f35', deco: '#544b40' },
      ',': { name: '过道', tile: 'wood', tex: 'metal',   color: '#443b32', deco: '#4e453c' },
      '~': { name: '车门', tile: 'void', tex: 'starfield',   color: '#2a2826', deco: '#34302c' },
      'x': { name: '座位', tile: 'crate',   tex: 'metal', color: '#544940', block: true, deco: '#62564a' },
    },
    map: [
      '########################',
      '#......................#',
      '#.x..x....x..x....x..x.#',
      '#......................#',
      '#.x..x....x..x....x..x.#',
      '#......................#',
      '#......................#',
      '#.x..x....x..x....x..x.#',
      '#......................#',
      '#.x..x....x..x....x..x.#',
      '#......................#',
      '########################',
    ],
    entities: [
      { t: 'node', node: 'car9', npc: 'npc_passenger', x: 3,  y: 6 },
      { t: 'node', node: 'car8',    x: 8,  y: 2 },
      { t: 'node', node: 'car5',    x: 13, y: 8 },
      { t: 'node', node: 'car3',    x: 17, y: 3 },
      { t: 'enemy', id: 'faceless', x: 10, y: 6, patrol: [[10,6],[11,6],[10,7]] },
      { t: 'enemy', id: 'faceless', x: 15, y: 4 },
      { t: 'enemy', id: 'faceless', x: 19, y: 8, patrol: [[19,8],[20,8],[19,9]] },
      { t: 'item',  item: 'medkit',   x: 6, y: 10 },
      { t: 'item',  item: 'grenade',  x: 12, y: 1 },
      { t: 'enemy', id: 'conductor',  x: 22, y: 5 },   // BOSS
      { t: 'stat', stat: {int: 1}, x: 9, y: 8 },
      { t: 'item', item: 'medkit', x: 14, y: 7 },
      { t: 'gear', equip: {armor: 'vest'}, x: 17, y: 8 },
    ],
  },

  /* ---------- 第六关 · 深渊渔村 ---------- */
  lv6: {
    spawn: [2, 9], dark: 0.52,
    introText: '「副本载入：雾港渔村。任务：调查村庄并活着离开。警告：直视深渊者，深渊亦视之。」\n\n浓雾里全是腐烂鱼腥味。家家户户门窗紧闭，窗帘后有眼睛在看你。',
    terrain: {
      '#': { name: '木屋', tile: 'wall_wood', tex: 'wood',   color: '#40493e', block: true },
      '.': { name: '泥路', tile: 'dirt', tex: 'swamp',   color: '#495650', deco: '#52605a' },
      ',': { name: '码头板', tile: 'wood', tex: 'floor', color: '#534e46', deco: '#5d584e' },
      '~': { name: '海水', tile: 'water', tex: 'water',   color: '#2c3e50', deco: '#344a5e' },
      'x': { name: '礁石', tile: 'rubble', tex: 'ruin',   color: '#536053', block: true, deco: '#5e6e60' },
    },
    map: [
      '########################',
      '#....#....#..~~.......~#',
      '#.x..#.......~~..x....~#',
      '#....#.x..#......x....~#',
      '#.##.#....####.####...~#',
      '#.##......#..#.#..#...~#',
      '#....#..x.#..#.#..#...~#',
      '#.x..#....#..#.#..#...~#',
      '#....#....#..#.#.......~',
      '#.~~.#.~~.#..#.#.x....~#',
      '#.~~.#.~~.#............#',
      '########################',
    ],
    entities: [
      { t: 'node', node: 'dock',    x: 4,  y: 8 },
      { t: 'node', node: 'oldman', npc: 'npc_oldman', x: 8,  y: 5 },
      { t: 'node', node: 'church',  x: 14, y: 2 },
      { t: 'node', node: 'crypt',   x: 19, y: 7 },
      { t: 'enemy', id: 'hybrid',   x: 11, y: 6, patrol: [[11,6],[12,6],[11,7]] },
      { t: 'enemy', id: 'hybrid',   x: 16, y: 9 },
      { t: 'item',  item: 'molotov', x: 6, y: 3 },
      { t: 'item',  item: 'medkit',  x: 21, y: 4 },
      { t: 'enemy', id: 'priest',    x: 22, y: 2 },   // BOSS
      { t: 'stat', stat: {con: 1}, x: 11, y: 8 },
      { t: 'item', item: 'grenade', x: 14, y: 6 },
      { t: 'gear', equip: {weapon: 'fireaxe'}, x: 14, y: 1 },
    ],
  },

  /* ---------- 第七关 · 纸扎古村 ---------- */
  lv7: {
    spawn: [2, 8], dark: 0.52,
    introText: '「副本载入：封门村·纸祭。任务：破解古村祭祀并存活。提示：鬼怪怕火与道法。」\n\n牌坊上「封门村」褪了色。村口摆着真人大小的纸人，眼睛好像在跟着你转。',
    terrain: {
      '#': { name: '土墙', tile: 'wall_wood', tex: 'paperwall',   color: '#493c34', block: true },
      '.': { name: '泥地', tile: 'dirt', tex: 'bluestone',   color: '#54473c', deco: '#5e5044' },
      ',': { name: '祠堂', tile: 'floor', tex: 'tatami',   color: '#50463a', deco: '#5b5044' },
      '~': { name: '阴沟', tile: 'void', tex: 'dark',   color: '#3a352e' },
      'x': { name: '纸扎物', tile: 'crate', tex: 'paperwall', color: '#605042', block: true, deco: '#705e4e' },
    },
    map: [
      '########################',
      '#...x..#....#....#..x..#',
      '#......#....#.##.#.....#',
      '#..x...#..x.#.##.#..x..#',
      '###.####....#....#.....#',
      '#...........#....#.##..#',
      '#..x....x...#..x.#.##..#',
      '#...........#....#.....#',
      '##.#.####.###.####.###.#',
      '#......................#',
      '#..x....x......x....x..#',
      '########################',
    ],
    entities: [
      { t: 'node', node: 'house',   x: 5,  y: 9 },
      { t: 'node', node: 'shrine', npc: 'npc_bride', x: 11, y: 2 },
      { t: 'node', node: 'coffin',  x: 18, y: 5 },
      { t: 'enemy', id: 'paper',    x: 9,  y: 6, patrol: [[9,6],[10,6],[9,7]] },
      { t: 'enemy', id: 'paper',    x: 15, y: 9 },
      { t: 'enemy', id: 'paper',    x: 19, y: 3, patrol: [[19,3],[20,3],[19,4]] },
      { t: 'item',  item: 'charm',   x: 3, y: 10 },
      { t: 'item',  item: 'molotov', x: 13, y: 10 },
      { t: 'enemy', id: 'jiangshi',  x: 22, y: 1 },   // BOSS
      { t: 'stat', stat: {str: 1}, x: 11, y: 9 },
      { t: 'item', item: 'charm', x: 10, y: 2 },
      { t: 'gear', equip: {weapon: 'talisman'}, x: 14, y: 1 },
    ],
  },

  /* ---------- 第八关 · 收容失效 ---------- */
  lv8: {
    spawn: [2, 10], dark: 0.48,
    introText: '红色警报灯旋转闪烁。\n\n「副本载入：欧米茄收容设施·全面收容失效。任务：抵达地下4层的紧急撤离电梯。所有异常均已脱笼。」\n\n广播断断续续：「请……不要……眨眼……」',
    terrain: {
      '#': { name: '金属墙', tile: 'dark', tex: 'containment', color: '#40434b', block: true },
      '.': { name: '走廊', tile: 'stone', tex: 'biomass',   color: '#4a4f5d', deco: '#525868' },
      ',': { name: '收容室', tile: 'stone', tex: 'lab', color: '#464b5a', deco: '#4e5668' },
      '~': { name: '血渍', tile: 'water', tex: 'biomass',   color: '#503333', deco: '#5c3838' },
      'x': { name: '设备', tile: 'crate',   tex: 'lab', color: '#575d6c', block: true, deco: '#636a7e' },
    },
    map: [
      '########################',
      '#....#.....#...#...x...#',
      '#.##.#..x..#...#.......#',
      '#.##.#.....#.x.#.####..#',
      '#....#..#..#...#.#..#..#',
      '#.##.#..#..#...#.#..#..#',
      '#.##.#..#..#...#.#..#..#',
      '#....#..#..#...#....#..#',
      '####.##.#.##.#####.##.##',
      '#.........~~...........#',
      '#..x...x..~~....x....x.#',
      '########################',
    ],
    entities: [
      { t: 'node', node: 'corridor',      x: 5,  y: 9 },
      { t: 'node', node: 'b3', npc: 'npc_scientist', x: 10, y: 3 },
      { t: 'node', node: 'elevator_hall', x: 17, y: 8 },
      { t: 'enemy', id: 'anomaly',        x: 7,  y: 6, patrol: [[7,6],[7,5]] },
      { t: 'enemy', id: 'anomaly',        x: 14, y: 10 },
      { t: 'enemy', id: 'anomaly',        x: 19, y: 5, patrol: [[19,5],[20,5],[19,6]] },
      { t: 'item',  item: 'keycard',      x: 4, y: 10 },
      { t: 'item',  item: 'taser',        x: 12, y: 10 },
      { t: 'item',  item: 'medkit',       x: 21, y: 10 },
      { t: 'enemy', id: 'horror',         x: 22, y: 2 },   // BOSS
      { t: 'stat', stat: {men: 1}, x: 10, y: 7 },
      { t: 'item', item: 'medkit', x: 17, y: 10 },
      { t: 'gear', equip: {armor: 'hazmat'}, x: 21, y: 9 },
    ],
  },

  /* ---------- 第九关 · 轮回者大逃杀 ---------- */
  lv9: {
    spawn: [2, 9], dark: 0.28,
    introText: '「副本载入：无名荒岛·大逃杀模式。本副本共8名轮回者。任务：成为最后存活者。击杀轮回者可夺取其50%积分。」\n\n这一次敌人不是怪物——是和你一样从主神空间杀出来的人。',
    terrain: {
      '#': { name: '树丛', tile: 'tree', color: '#44533e', block: true },
      '.': { name: '草地', tile: 'grass', tex: 'grass', color: '#556044', deco: '#606e4e' },
      ',': { name: '沙滩', tile: 'sand', tex: 'sand', color: '#70654e', deco: '#7c725a' },
      '~': { name: '海水', tile: 'water', tex: 'water', color: '#345060', deco: '#406070' },
      'x': { name: '岩石', tile: 'rubble', tex: 'stone', color: '#605a4e', block: true, deco: '#6e685e' },
    },
    map: [
      '########################',
      '#....#.....#...~..x...~#',
      '#.x........#...~......~#',
      '#....#.....#...~..x...~#',
      '#.##.#..#..#####.#####.#',
      '#.##.#..#..#...#.#...#.#',
      '#....#..#......#.#...#.#',
      '#.x..#..#..#...#.#.x.#.#',
      '#....#.....#...#.....#.#',
      '#.~~.#.~~..#...#.x...#.#',
      '#.~~.#.~~..#...........#',
      '########################',
    ],
    entities: [
      { t: 'node', node: 'island',  x: 4,  y: 8 },
      { t: 'node', node: 'beach',   x: 9,  y: 2 },
      { t: 'node', node: 'jungle',  x: 14, y: 6 },
      { t: 'node', node: 'tower',   x: 18, y: 4 },
      { t: 'node', node: 'fate_altar', x: 7, y: 3 },
      { t: 'enemy', id: 'rival1',   x: 10, y: 7, patrol: [[10,7],[12,7]] },
      { t: 'enemy', id: 'rival2',   x: 16, y: 10 },
      { t: 'enemy', id: 'rival1',   x: 20, y: 3, patrol: [[20,3],[21,3],[20,4]] },
      { t: 'item',  item: 'grenade', x: 6, y: 4 },
      { t: 'item',  item: 'medkit',  x: 13, y: 9 },
      { t: 'enemy', id: 'ace',       x: 22, y: 1 },   // BOSS
      { t: 'stat', stat: {agi: 1}, x: 5, y: 2 },
      { t: 'item', item: 'grenade', x: 16, y: 9 },
      { t: 'gear', equip: {weapon: 'katana'}, x: 20, y: 8 },
    ],
  },

  /* ---------- 终局 · 主神真面目 ---------- */
  lv10: {
    spawn: [2, 6], dark: 0.32,
    introText: '这一关没有副本世界。\n\n白光散去后，你站在主神空间中央——巨大的光球裂开了，露出内部的机器：无数光缆通向虚无，每根尽头都连着一个正在轮回的「你」。\n\n机械音第一次有了温度：「第1024号轮回者。你，是最接近答案的人。」',
    terrain: {
      '#': { name: '虚空', tile: 'dark', tex: 'starfield',   color: '#303044', block: true },
      '.': { name: '光路', tile: 'stone', tex: 'marble',   color: '#40405a', deco: '#4c4c70' },
      ',': { name: '数据桥', tile: 'void', tex: 'starfield', color: '#464664', deco: '#52527a' },
      '~': { name: '深渊', tile: 'void', tex: 'starfield',   color: '#262632', deco: '#2e2e42' },
      'x': { name: '光缆柱', tile: 'crate', tex: 'marble', color: '#505070', block: true, deco: '#5e5e88' },
    },
    map: [
      '########################',
      '#....#.....~....#......#',
      '#.x..#..x..~....#..x...#',
      '#....#.....~....#......#',
      '#.##.#..#..~.##.#.###..#',
      '#.##.#..#..~.##........#',
      '#..........~....#.#.x..#',
      '#.x..#..#..~....#.#....#',
      '#....#.....~.##.#.#.##.#',
      '#.~~.#.~~..~.##.#.#....#',
      '#.~~.#.~~..~....#...x..#',
      '########################',
    ],
    entities: [
      { t: 'node', node: 'truth', x: 12, y: 6 },
      { t: 'enemy', id: 'god',    x: 20, y: 5 },   // 最终BOSS
      { t: 'stat', stat: {luk: 2}, x: 7, y: 10 },
      { t: 'item', item: 'medkit', x: 11, y: 3 },
    ],
  },
};

/* ============ 子地图（传送点互通，可往返）============ */
/* 主图里的 portal 坐标按放大前写（运行时统一×2）；extra 子地图按实际坐标写 */

MAP_DEFS.lv1.entities.push({ t: 'portal', to: 1, tx: 2, ty: 2, name: '地下停车场', x: 19, y: 9 });
MAP_DEFS.lv1.extra = [{
  name: '地下停车场', spawn: [2, 2], dark: 0.62,
  map: [
    '##########################',
    '#........................#',
    '#.x....x...x....x...x..x.#',
    '#........................#',
    '#..x..x....x.....x...x...#',
    '#........................#',
    '#....x....x...x....x..x..#',
    '#........................#',
    '#.x...x.....x....x....x..#',
    '#........................#',
    '#..x....x.....x....x..x..#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'soldier', npc: 'npc_soldier', x: 20, y: 5 },
    { t: 'enemy', id: 'zombie', x: 12, y: 6, patrol: [[12,6],[13,6],[12,7]] },
    { t: 'enemy', id: 'dogs',   x: 8,  y: 9, patrol: [[8,9],[9,9]] },
    { t: 'item',  item: 'grenade', x: 5,  y: 5 },
    { t: 'item',  item: 'medkit',  x: 22, y: 9 },
    { t: 'stat',  stat: { men: 1 }, x: 15, y: 3 },
    { t: 'portal', to: 0, tx: 39, ty: 18, name: '返回街区', x: 2, y: 2 },
  ],
}];

MAP_DEFS.lv2.entities.push({ t: 'portal', to: 1, tx: 2, ty: 2, name: '货舱B层', x: 19, y: 10 });
MAP_DEFS.lv2.extra = [{
  name: '货舱B层', spawn: [2, 2], dark: 0.58,
  map: [
    '##########################',
    '#.......x.....x..........#',
    '#..~~.......x......x..~..#',
    '#..~~..x.........x....~..#',
    '#......x....x....x....~..#',
    '#..x........x.........~..#',
    '#.....x.........x........#',
    '#..........x......x..x...#',
    '#..x...x........x........#',
    '#.........x......x..x....#',
    '#.....x......x...........#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'officer', npc: 'npc_soldier', x: 18, y: 6 },
    { t: 'enemy', id: 'drone',  x: 10, y: 5, patrol: [[10,5],[11,5],[10,6]] },
    { t: 'enemy', id: 'hugger', x: 16, y: 9 },
    { t: 'item',  item: 'molotov', x: 5, y: 7 },
    { t: 'stat',  stat: { agi: 1 }, x: 13, y: 3 },
    { t: 'portal', to: 0, tx: 39, ty: 20, name: '返回主舱', x: 2, y: 2 },
  ],
}];

MAP_DEFS.lv3.entities.push({ t: 'portal', to: 1, tx: 2, ty: 2, name: '后院枯井', x: 19, y: 9 });
MAP_DEFS.lv3.extra = [{
  name: '后院枯井', spawn: [2, 2], dark: 0.66,
  map: [
    '##########################',
    '#....x......x.....x......#',
    '#..........~~~...........#',
    '#..x...x...~~~....x..x...#',
    '#..........~~~...........#',
    '#....x.....~~~..x......x.#',
    '#..x.......~~~...........#',
    '#..........~~~....x...x..#',
    '#....x..x........x.......#',
    '#..x.........x........x..#',
    '#......x........x........#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'wellghost', npc: 'npc_ghostgirl', x: 12, y: 1 },
    { t: 'enemy', id: 'doll',    x: 8,  y: 7, patrol: [[8,7],[9,7]] },
    { t: 'enemy', id: 'revenant', x: 18, y: 8 },
    { t: 'item',  item: 'holywater', x: 4,  y: 9 },
    { t: 'item',  item: 'charm',     x: 21, y: 4 },
    { t: 'stat',  stat: { luk: 1 }, x: 15, y: 10 },
    { t: 'portal', to: 0, tx: 39, ty: 18, name: '返回宅邸', x: 2, y: 2 },
  ],
}];

MAP_DEFS.lv4.entities.push({ t: 'portal', to: 1, tx: 2, ty: 2, name: '天台水箱间', x: 19, y: 9 });
MAP_DEFS.lv4.extra = [{
  name: '天台水箱间', spawn: [2, 2], dark: 0.5,
  map: [
    '##########################',
    '#........................#',
    '#.x...x....x....x...x..x.#',
    '#..........~~~...........#',
    '#..x.......~~~....x......#',
    '#..........~~~......x....#',
    '#....x.....~~~...........#',
    '#........................#',
    '#..x....x....x....x...x..#',
    '#........................#',
    '#.x...x.....x......x..x..#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'believer', npc: 'npc_cultist', x: 20, y: 5 },
    { t: 'enemy', id: 'neighbor', x: 11, y: 7, patrol: [[11,7],[12,7]] },
    { t: 'item',  item: 'pills', x: 6,  y: 6 },
    { t: 'item',  item: 'rules_note', x: 15, y: 1 },
    { t: 'item',  item: 'stargate_shard', x: 23, y: 9 },
    { t: 'stat',  stat: { int: 1 }, x: 21, y: 9 },
    { t: 'portal', to: 0, tx: 39, ty: 18, name: '返回楼道', x: 2, y: 2 },
  ],
}];

MAP_DEFS.lv5.entities.push({ t: 'portal', to: 1, tx: 2, ty: 2, name: '卧铺车厢', x: 21, y: 6 });
MAP_DEFS.lv5.entities.push({ t: 'portal', to: 2, tx: 2, ty: 2, name: '餐车', x: 21, y: 8 });
MAP_DEFS.lv5.extra = [
  {
    name: '卧铺车厢', spawn: [2, 2], dark: 0.4,
    map: [
      '##########################',
      '#........................#',
      '#.x.x.x.x.x.x.x.x.x.x.x..#',
      '#........................#',
      '#.x.x.x.x.x.x.x.x.x.x.x..#',
      '#........................#',
      '#.x.x.x.x.x.x.x.x.x.x.x..#',
      '#........................#',
      '##########################',
    ],
    entities: [
      { t: 'node', node: 'sleeper', npc: 'npc_oldman', x: 18, y: 4 },
      { t: 'enemy', id: 'faceless', x: 12, y: 3, patrol: [[12,3],[13,3]] },
      { t: 'item',  item: 'medkit', x: 8, y: 5 },
      { t: 'stat',  stat: { luk: 1 }, x: 21, y: 7 },
      { t: 'portal', to: 0, tx: 43, ty: 12, name: '返回过道', x: 2, y: 2 },
    ],
  },
  {
    name: '餐车', spawn: [2, 2], dark: 0.38,
    map: [
      '##########################',
      '#........................#',
      '#..x....x....x....x....x.#',
      '#........................#',
      '#..x....x....x....x....x.#',
      '#........................#',
      '#........................#',
      '##########################',
    ],
    entities: [
      { t: 'node', node: 'chef', npc: 'npc_passenger', x: 16, y: 3 },
      { t: 'enemy', id: 'faceless', x: 10, y: 5 },
      { t: 'item',  item: 'grenade', x: 6, y: 5 },
      { t: 'portal', to: 0, tx: 43, ty: 16, name: '返回过道', x: 2, y: 2 },
    ],
  },
];

MAP_DEFS.lv6.entities.push({ t: 'portal', to: 1, tx: 2, ty: 2, name: '雾港灯塔', x: 14, y: 11 });
MAP_DEFS.lv6.extra = [{
  name: '雾港灯塔', spawn: [2, 2], dark: 0.55,
  map: [
    '##########################',
    '#..........~~............#',
    '#..x.......~~....x...x...#',
    '#..........~~............#',
    '#....x.....~~....x....x..#',
    '#..........~~.........x..#',
    '#..x.......~~....x.......#',
    '#..........~~............#',
    '#.....x....~~.....x...x..#',
    '#..........~~........x...#',
    '#..x...x...~~....x.......#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'lighthouse', npc: 'npc_cultist', x: 13, y: 3 },
    { t: 'enemy', id: 'hybrid', x: 8,  y: 8, patrol: [[8,8],[9,8]] },
    { t: 'item',  item: 'molotov', x: 18, y: 4 },
    { t: 'item',  item: 'stargate_shard', x: 22, y: 1 },
    { t: 'stat',  stat: { men: 1 }, x: 5, y: 5 },
    { t: 'portal', to: 0, tx: 29, ty: 22, name: '返回渔村', x: 2, y: 2 },
  ],
}];

MAP_DEFS.lv7.entities.push({ t: 'portal', to: 1, tx: 2, ty: 2, name: '纸扎铺', x: 19, y: 9 });
MAP_DEFS.lv7.extra = [{
  name: '纸扎铺', spawn: [2, 2], dark: 0.58,
  map: [
    '##########################',
    '#..x....x.....x.....x....#',
    '#........................#',
    '#....x....x.....x....x...#',
    '#........................#',
    '#..x....x.....x.....x....#',
    '#........................#',
    '#....x....x.....x....x...#',
    '#........................#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'papermaker', npc: 'npc_bride', x: 18, y: 4 },
    { t: 'enemy', id: 'paper', x: 10, y: 5, patrol: [[10,5],[11,5]] },
    { t: 'item',  item: 'charm', x: 6,  y: 7 },
    { t: 'item',  item: 'stargate_shard', x: 23, y: 8 },
    { t: 'stat',  stat: { int: 1 }, x: 21, y: 2 },
    { t: 'portal', to: 0, tx: 39, ty: 18, name: '返回村口', x: 2, y: 2 },
  ],
}];

MAP_DEFS.lv8.entities.push({ t: 'portal', to: 1, tx: 2, ty: 2, name: '地下实验室', x: 15, y: 9 });
MAP_DEFS.lv8.extra = [{
  name: '地下实验室', spawn: [2, 2], dark: 0.56,
  map: [
    '##########################',
    '#.,,,,,,,,,,,,,,,,,,,,,,.#',
    '#.,x,,,x,,,,x,,,,x,,,x,,.#',
    '#.,,,,,,,,,,,,,,,,,,,,,,.#',
    '#.,,x,,,,x,,,,x,,,,x,,,,.#',
    '#.,,,,,,,,,,,,,,,,,,,,,,.#',
    '#.,x,,,x,,,,x,,,,x,,,x,,.#',
    '#.,,,,,,,,,,,,,,,,,,,,,,.#',
    '#.,,x,,,,x,,,,x,,,,x,,,,.#',
    '#.,,,,,,,,,,,,,,,,,,,,,,.#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'survivor2', npc: 'npc_scientist', x: 18, y: 5 },
    { t: 'enemy', id: 'anomaly', x: 12, y: 7, patrol: [[12,7],[13,7]] },
    { t: 'item',  item: 'keycard', x: 6,  y: 3 },
    { t: 'item',  item: 'medkit',  x: 21, y: 7 },
    { t: 'item',  item: 'stargate_shard', x: 23, y: 9 },
    { t: 'stat',  stat: { men: 1 }, x: 15, y: 9 },
    { t: 'portal', to: 0, tx: 31, ty: 18, name: '返回走廊', x: 2, y: 2 },
  ],
}];

MAP_DEFS.lv9.entities.push({ t: 'portal', to: 1, tx: 2, ty: 2, name: '密林深处', x: 14, y: 10 });
MAP_DEFS.lv9.extra = [{
  name: '密林深处', spawn: [2, 2], dark: 0.4,
  map: [
    '##########################',
    '#....#.....#......#......#',
    '#.x..#..x..#..x..#..x..x.#',
    '#....#.....#......#......#',
    '#..#.#####.####.#####.#..#',
    '#..#.....#......#.....#..#',
    '#..x..x..#..x...#..x..x..#',
    '#........#......#........#',
    '#..x..x..#..x...#..x..x..#',
    '#........#......#........#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'hunter', npc: 'npc_soldier', x: 17, y: 7 },
    { t: 'enemy', id: 'rival1', x: 10, y: 5, patrol: [[10,5],[11,5]] },
    { t: 'enemy', id: 'rival2', x: 20, y: 2 },
    { t: 'item',  item: 'medkit', x: 5,  y: 8 },
    { t: 'stat',  stat: { str: 1 }, x: 7, y: 2 },
    { t: 'portal', to: 0, tx: 29, ty: 20, name: '返回荒岛', x: 2, y: 2 },
  ],
}];

MAP_DEFS.lv10.entities.push({ t: 'portal', to: 1, tx: 2, ty: 2, name: '英灵回廊', x: 8, y: 6 });
MAP_DEFS.lv10.entities.push({ t: 'portal', to: 2, tx: 2, ty: 2, name: '记忆殿堂', x: 19, y: 9 });
MAP_DEFS.lv10.extra = [
  {
    name: '英灵回廊', spawn: [2, 2], dark: 0.35,
    map: [
      '##########################',
      '#........................#',
      '#.x..x....x....x....x..x.#',
      '#........................#',
      '#..x....x....x....x....x.#',
      '#........................#',
      '#.x..x....x....x....x..x.#',
      '#........................#',
      '##########################',
    ],
    entities: [
      { t: 'node', node: 'oracle', npc: 'npc_cultist', x: 18, y: 4 },
      { t: 'enemy', id: 'rival2', x: 12, y: 5 },
      { t: 'item',  item: 'revive', x: 8, y: 1 },
      { t: 'stat',  stat: { luk: 1 }, x: 21, y: 7 },
      { t: 'portal', to: 0, tx: 17, ty: 12, name: '返回中枢', x: 2, y: 2 },
    ],
  },
  {
    name: '记忆殿堂', spawn: [2, 2], dark: 0.3,
    map: [
      '##########################',
      '#..x....x....x....x....x.#',
      '#........................#',
      '#....x....x....x....x....#',
      '#........................#',
      '#..x....x....x....x....x.#',
      '#........................#',
      '##########################',
    ],
    entities: [
      { t: 'node', node: 'echo', npc: 'npc_girl', x: 16, y: 3 },
      { t: 'item',  item: 'great_heal', x: 9, y: 5 },
      { t: 'stat',  stat: { men: 1 }, x: 20, y: 1 },
      { t: 'portal', to: 0, tx: 39, ty: 18, name: '返回中枢', x: 2, y: 2 },
    ],
  },
];

/* ---------- v14：第二批子地图（更多可探索地点） ---------- */
// 主图剧情点缀节点（纯文本，不依赖 NPC 立绘）
MAP_DEFS.lv1.entities.push({ t: 'node', node: 'broadcast', x: 10, y: 8 });
MAP_DEFS.lv2.entities.push({ t: 'node', node: 'scratch',    x: 12, y: 8 });
MAP_DEFS.lv3.entities.push({ t: 'node', node: 'coldspot',   x: 8,  y: 7 });
MAP_DEFS.lv4.entities.push({ t: 'node', node: 'notice',     x: 12, y: 9 });
MAP_DEFS.lv5.entities.push({ t: 'node', node: 'timetable',  x: 12, y: 6 });
MAP_DEFS.lv6.entities.push({ t: 'node', node: 'nets',       x: 15, y: 10 });
MAP_DEFS.lv7.entities.push({ t: 'node', node: 'ash',        x: 12, y: 9 });
MAP_DEFS.lv8.entities.push({ t: 'node', node: 'log',        x: 16, y: 9 });
MAP_DEFS.lv9.entities.push({ t: 'node', node: 'rifle',      x: 14, y: 10 });
MAP_DEFS.lv10.entities.push({ t: 'node', node: 'memoryfrag',x: 14, y: 10 });

// 第二个传送点 + 新子地图（lv5/lv10 已有两个，不再加）
MAP_DEFS.lv1.entities.push({ t: 'portal', to: 2, tx: 2, ty: 2, name: '市立医院门诊楼', x: 20, y: 10 });
MAP_DEFS.lv1.extra.push({
  name: '市立医院门诊楼', spawn: [2, 2], dark: 0.58,
  map: [
    '##########################',
    '#........................#',
    '#.##..x...##...x...##...x.#',
    '#.##......##......##......#',
    '#....x....x...x....x...x..#',
    '#..##....##......##....##.#',
    '#.........................#',
    '#..x...x....x....x....x...#',
    '#.........................#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'doctor', npc: 'npc_scientist', x: 20, y: 4 },
    { t: 'node', node: 'pharmacy', x: 12, y: 6 },
    { t: 'enemy', id: 'zombie', x: 10, y: 4 },
    { t: 'enemy', id: 'dogs',   x: 16, y: 7, patrol: [[16,7],[17,7],[16,8]] },
    { t: 'item',  item: 'medkit',  x: 6,  y: 4 },
    { t: 'item',  item: 'pills',   x: 22, y: 8 },
    { t: 'item',  item: 'smoke',   x: 4,  y: 8 },
    { t: 'stat',  stat: { con: 1 }, x: 14, y: 8 },
    { t: 'portal', to: 0, tx: 41, ty: 20, name: '返回街区', x: 2, y: 2 },
  ],
});

MAP_DEFS.lv2.entities.push({ t: 'portal', to: 2, tx: 2, ty: 2, name: '孵化腔', x: 21, y: 10 });
MAP_DEFS.lv2.extra.push({
  name: '孵化腔', spawn: [2, 2], dark: 0.66,
  map: [
    '##########################',
    '#........................#',
    '#..~....x...~....x....~..#',
    '#........................#',
    '#.~..x....~....x....~....#',
    '#........................#',
    '#....~....x....~....x....#',
    '#........................#',
    '#..x....~....x....~....x.#',
    '#........................#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'cocoon', x: 14, y: 5 },
    { t: 'node', node: 'eggwall', x: 20, y: 3 },
    { t: 'enemy', id: 'hugger', x: 12, y: 4, patrol: [[12,4],[13,4],[12,5]] },
    { t: 'enemy', id: 'drone',  x: 18, y: 7 },
    { t: 'enemy', id: 'hugger', x: 8,  y: 8 },
    { t: 'item',  item: 'acidflask', x: 5,  y: 5 },
    { t: 'item',  item: 'molotov',   x: 22, y: 9 },
    { t: 'stat',  stat: { men: 1 }, x: 10, y: 7 },
    { t: 'portal', to: 0, tx: 43, ty: 20, name: '返回主巢', x: 2, y: 2 },
  ],
});

MAP_DEFS.lv3.entities.push({ t: 'portal', to: 2, tx: 2, ty: 2, name: '阁楼画室', x: 20, y: 9 });
MAP_DEFS.lv3.extra.push({
  name: '阁楼画室', spawn: [2, 2], dark: 0.64,
  map: [
    '##########################',
    '#........................#',
    '#.x....##...x....##.....x.#',
    '#......##........##.......#',
    '#.x.........x.........x..#',
    '#.........................#',
    '#..##....x....##....x.....#',
    '#..##.........##..........#',
    '#.........................#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'painter', npc: 'npc_ghostgirl', x: 20, y: 5 },
    { t: 'node', node: 'canvas', x: 10, y: 6 },
    { t: 'enemy', id: 'doll',     x: 13, y: 4, patrol: [[13,4],[14,4],[13,5]] },
    { t: 'enemy', id: 'revenant', x: 8,  y: 7 },
    { t: 'item',  item: 'holywater', x: 5,  y: 3 },
    { t: 'item',  item: 'charm',     x: 22, y: 8 },
    { t: 'stat',  stat: { int: 1 }, x: 12, y: 3 },
    { t: 'portal', to: 0, tx: 41, ty: 18, name: '返回凶宅', x: 2, y: 2 },
  ],
});

MAP_DEFS.lv4.entities.push({ t: 'portal', to: 2, tx: 2, ty: 2, name: '档案室', x: 21, y: 9 });
MAP_DEFS.lv4.extra.push({
  name: '档案室', spawn: [2, 2], dark: 0.60,
  map: [
    '##########################',
    '#........................#',
    '#.##..##..##..##..##..##.#',
    '#.##..##..##..##..##..##.#',
    '#........................#',
    '#.##..##..##..##..##..##.#',
    '#.##..##..##..##..##..##.#',
    '#........................#',
    '#..x....x....x....x....x.#',
    '#........................#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'forbiddenfile', x: 13, y: 4 },
    { t: 'node', node: 'rulecard', x: 20, y: 8 },
    { t: 'enemy', id: 'neighbor', x: 10, y: 7, patrol: [[10,7],[11,7],[10,4]] },
    { t: 'enemy', id: 'neighbor', x: 18, y: 4 },
    { t: 'item',  item: 'mindwipe', x: 5,  y: 8 },
    { t: 'item',  item: 'pills',    x: 23, y: 4 },
    { t: 'stat',  stat: { men: 1 }, x: 8,  y: 2 },
    { t: 'portal', to: 0, tx: 43, ty: 18, name: '返回楼层', x: 2, y: 2 },
  ],
});

MAP_DEFS.lv6.entities.push({ t: 'portal', to: 2, tx: 2, ty: 2, name: '沉船滩', x: 20, y: 10 });
MAP_DEFS.lv6.extra.push({
  name: '沉船滩', spawn: [2, 2], dark: 0.55,
  map: [
    '##########################',
    '#........................#',
    '#..~~....x....~~....x....#',
    '#..~~.........~~.........#',
    '#........................#',
    '#.x....~~....x....~~..x..#',
    '#......~~.........~~.....#',
    '#........................#',
    '#..x.......x....x.....x..#',
    '#........................#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'sailor', npc: 'npc_oldman', x: 20, y: 5 },
    { t: 'node', node: 'figurehead', x: 12, y: 4 },
    { t: 'enemy', id: 'hybrid', x: 10, y: 6, patrol: [[10,6],[11,6],[10,7]] },
    { t: 'enemy', id: 'hybrid', x: 17, y: 3 },
    { t: 'item',  item: 'molotov', x: 5,  y: 8 },
    { t: 'item',  item: 'charm',   x: 22, y: 7 },
    { t: 'stat',  stat: { con: 1 }, x: 14, y: 8 },
    { t: 'portal', to: 0, tx: 41, ty: 20, name: '返回渔村', x: 2, y: 2 },
  ],
});

MAP_DEFS.lv7.entities.push({ t: 'portal', to: 2, tx: 2, ty: 2, name: '祠堂', x: 21, y: 9 });
MAP_DEFS.lv7.extra.push({
  name: '祠堂', spawn: [2, 2], dark: 0.62,
  map: [
    '##########################',
    '#........................#',
    '#.x..##.....##.....##..x.#',
    '#....##.....##.....##....#',
    '#........................#',
    '#.##.....x.....x......##.#',
    '#.##..................##.#',
    '#........................#',
    '#.x.....x....x.....x.....#',
    '#........................#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'tablets', x: 13, y: 3 },
    { t: 'node', node: 'offering', x: 20, y: 7 },
    { t: 'enemy', id: 'paper', x: 11, y: 5, patrol: [[11,5],[12,5],[11,7]] },
    { t: 'enemy', id: 'paper', x: 18, y: 4 },
    { t: 'item',  item: 'holywater', x: 5,  y: 4 },
    { t: 'item',  item: 'talisman',  x: 22, y: 9 },
    { t: 'stat',  stat: { luk: 1 }, x: 9, y: 8 },
    { t: 'portal', to: 0, tx: 43, ty: 18, name: '返回古村', x: 2, y: 2 },
  ],
});

MAP_DEFS.lv8.entities.push({ t: 'portal', to: 2, tx: 2, ty: 2, name: 'B3培育舱', x: 20, y: 9 });
MAP_DEFS.lv8.extra.push({
  name: 'B3培育舱', spawn: [2, 2], dark: 0.66,
  map: [
    '##########################',
    '#........................#',
    '#.x..##....##....##....x.#',
    '#....##....##....##......#',
    '#........................#',
    '#.##.....x.....x.....##..#',
    '#.##.................##..#',
    '#........................#',
    '#..x....x....x....x....x.#',
    '#........................#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'tanks', x: 13, y: 3 },
    { t: 'node', node: 'terminal', x: 20, y: 7 },
    { t: 'enemy', id: 'anomaly', x: 11, y: 5, patrol: [[11,5],[12,5],[11,7]] },
    { t: 'enemy', id: 'anomaly', x: 17, y: 4 },
    { t: 'item',  item: 'taser',    x: 5,  y: 4 },
    { t: 'item',  item: 'stimpack', x: 22, y: 9 },
    { t: 'stat',  stat: { int: 1 }, x: 9, y: 8 },
    { t: 'portal', to: 0, tx: 41, ty: 18, name: '返回收容区', x: 2, y: 2 },
  ],
});

MAP_DEFS.lv9.entities.push({ t: 'portal', to: 2, tx: 2, ty: 2, name: '洞穴藏点', x: 20, y: 10 });
MAP_DEFS.lv9.extra.push({
  name: '洞穴藏点', spawn: [2, 2], dark: 0.68,
  map: [
    '##########################',
    '#........................#',
    '#.x....##...x....##.....x#',
    '#......##........##......#',
    '#.x.........x.........x..#',
    '#.........................#',
    '#..##....x....##....x....#',
    '#..##.........##.........#',
    '#.........................#',
    '##########################',
  ],
  entities: [
    { t: 'node', node: 'veteran', npc: 'npc_soldier', x: 20, y: 5 },
    { t: 'node', node: 'supplycache', x: 10, y: 6 },
    { t: 'enemy', id: 'rival1', x: 13, y: 4, patrol: [[13,4],[14,4],[13,5]] },
    { t: 'enemy', id: 'rival2', x: 8,  y: 7 },
    { t: 'item',  item: 'grenade',   x: 5,  y: 3 },
    { t: 'item',  item: 'adrenaline',x: 22, y: 8 },
    { t: 'stat',  stat: { str: 1 }, x: 12, y: 3 },
    { t: 'portal', to: 0, tx: 41, ty: 20, name: '返回荒岛', x: 2, y: 2 },
  ],
});

/* ---------- 合并进 GAME_DATA ---------- */
// 主图 2× 放大（更大更有层次），子地图按原尺寸载入
const X2 = rows => {
  const out = [];
  rows.forEach(r => { const rr = r.split('').map(c => c + c).join(''); out.push(rr, rr); });
  return out;
};
GAME_DATA.levels.forEach((lv, i) => {
  const d = MAP_DEFS[lv.id];
  if (!d) return;
  d.map = X2(d.map);
  d.spawn = d.spawn.map(v => v * 2);
  (d.entities || []).forEach(e => {
    e.x *= 2; e.y *= 2;
    if (e.patrol) e.patrol = e.patrol.map(p => [p[0] * 2, p[1] * 2]);
    if (e.tx !== undefined) { e.tx *= 2; e.ty *= 2; }
  });
  lv.map = d.map; lv.terrain = d.terrain; lv.spawn = d.spawn;
  lv.entities = d.entities; lv.dark = d.dark; lv.introText = d.introText;
  lv.maps = [{ name: d.name || '', map: d.map, entities: d.entities, spawn: d.spawn, dark: d.dark }];
  (d.extra || []).forEach(x => {
    const mw = Math.max(...x.map.map(r => r.length));
    x.map = x.map.map(r => r.padEnd(mw, '#'));
    lv.maps.push(x);
  });
});

