
/* ========== 战斗特效系统：武器/技能演出粒子 ========== */
const FX = (() => {
  let cv = null, ctx = null, running = false;
  const parts = [];

  function ensure() {
    cv = $('fx-canvas');
    const st = $('battle-stage');
    if (!cv || !st) return false;
    const r = st.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    if (cv.width !== Math.round(r.width * dpr) || cv.height !== Math.round(r.height * dpr)) {
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      cv.style.width = r.width + 'px'; cv.style.height = r.height + 'px';
    }
    ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  }

  // 战斗卡中心点在舞台坐标系中的位置
  function pt(ref) {
    const c = fighterCard(ref), st = $('battle-stage');
    if (!c || !st) return { x: 100, y: 100, w: 80, h: 160 };
    const a = c.getBoundingClientRect(), b = st.getBoundingClientRect();
    return {
      x: a.left - b.left + a.width / 2,
      y: a.top - b.top + a.height * 0.42,
      top: a.top - b.top, bottom: a.bottom - b.top,
      w: a.width, h: a.height
    };
  }

  function add(p) { p.born = performance.now(); parts.push(p); if (!running) { running = true; requestAnimationFrame(loop); } }
  const rnd = (a, b) => a + Math.random() * (b - a);

  function loop() {
    if (!parts.length) { running = false; if (ctx && cv) ctx.clearRect(0, 0, cv.width, cv.height); return; }
    if (!ensure()) { parts.length = 0; running = false; return; }
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.lineCap = 'round';
    const now = performance.now();
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i], t = (now - p.born) / p.dur;
      if (t >= 1) { parts.splice(i, 1); continue; }
      draw(p, t, now);
    }
    requestAnimationFrame(loop);
  }

  function draw(p, t, now) {
    const a = 1 - t;
    switch (p.kind) {
      case 'arc': { // 刀光剑弧：扫过的月牙
        const sweep = p.sweep || Math.PI * 0.9;
        const sa = p.a0 + sweep * t, r = p.r;
        ctx.strokeStyle = p.color; ctx.globalAlpha = a * 0.95; ctx.lineWidth = p.lw * (1 - t * 0.4);
        ctx.shadowColor = p.color; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, sa, sa + sweep * 0.35); ctx.stroke();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        break;
      }
      case 'spark': { // 火花短线
        const d = p.v * t * p.dur;
        const x = p.x + Math.cos(p.a) * d, y = p.y + Math.sin(p.a) * d;
        ctx.strokeStyle = p.color; ctx.globalAlpha = a; ctx.lineWidth = p.lw;
        ctx.shadowColor = p.color; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(p.a) * p.len * (1 - t * 0.5), y - Math.sin(p.a) * p.len * (1 - t * 0.5)); ctx.stroke();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        break;
      }
      case 'dot': { // 圆点粒子（爆炸尘）
        const d = t * p.dur;
        const x = p.x + p.vx * d / 16.7, y = p.y + p.vy * d / 16.7 + (p.g || 0) * t * t * 60;
        ctx.fillStyle = p.color; ctx.globalAlpha = a * (p.alpha || 1);
        ctx.beginPath(); ctx.arc(x, y, p.r * (1 - t * 0.6), 0, 7); ctx.fill();
        ctx.globalAlpha = 1;
        break;
      }
      case 'tracer': { // 弹道光线
        ctx.strokeStyle = p.color; ctx.globalAlpha = a; ctx.lineWidth = p.lw;
        ctx.shadowColor = p.color; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.moveTo(p.x0, p.y0); ctx.lineTo(p.x1, p.y1); ctx.stroke();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        break;
      }
      case 'orb': { // 飞行法球
        const e = t < .5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
        const x = p.x0 + (p.x1 - p.x0) * e, y = p.y0 + (p.y1 - p.y0) * e - Math.sin(e * Math.PI) * 26;
        const g = ctx.createRadialGradient(x, y, 0, x, y, p.r * 2.2);
        g.addColorStop(0, '#ffffff'); g.addColorStop(0.3, p.color); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.globalAlpha = Math.min(1, a + .3);
        ctx.beginPath(); ctx.arc(x, y, p.r * 2.2, 0, 7); ctx.fill();
        ctx.globalAlpha = 1;
        break;
      }
      case 'bolt': { // 闪电链
        ctx.strokeStyle = p.color; ctx.lineWidth = p.lw; ctx.globalAlpha = a;
        ctx.shadowColor = p.color; ctx.shadowBlur = 16;
        ctx.beginPath();
        p.pts.forEach(([x, y], i) => {
          const jx = i && i < p.pts.length - 1 ? rnd(-4, 4) : 0;
          i ? ctx.lineTo(x + jx, y + jx) : ctx.moveTo(x, y);
        });
        ctx.stroke();
        ctx.lineWidth = p.lw * 0.4; ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        break;
      }
      case 'beam': { // 圣光柱
        const w = p.w * (0.5 + t * 0.5);
        const g = ctx.createLinearGradient(p.x - w / 2, 0, p.x + w / 2, 0);
        g.addColorStop(0, 'rgba(255,230,140,0)'); g.addColorStop(.5, p.color); g.addColorStop(1, 'rgba(255,230,140,0)');
        ctx.fillStyle = g; ctx.globalAlpha = a * 0.9;
        ctx.fillRect(p.x - w / 2, p.top - 20, w, p.h + 40);
        ctx.globalAlpha = 1;
        break;
      }
      case 'ring': { // 扩散光环
        const r = p.r0 + (p.r1 - p.r0) * t;
        ctx.strokeStyle = p.color; ctx.globalAlpha = a * 0.9; ctx.lineWidth = p.lw * (1 - t);
        ctx.shadowColor = p.color; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.stroke();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        break;
      }
      case 'flash': { // 径向闪光
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, p.color); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.globalAlpha = a;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
        ctx.globalAlpha = 1;
        break;
      }
      case 'rise': { // 上升粒子（治疗/强化）
        const x = p.x + Math.sin(t * 5 + p.ph) * 8;
        const y = p.y - t * p.h;
        ctx.fillStyle = p.color; ctx.globalAlpha = a * .9;
        ctx.shadowColor = p.color; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(x, y, p.r, 0, 7); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        break;
      }
    }
  }

  /* ---- 特效编排 ---- */
  function burst(x, y, color, n = 10, spd = .22) {
    for (let i = 0; i < n; i++) add({ kind: 'spark', x, y, a: rnd(0, Math.PI * 2), v: spd * rnd(.6, 1.4), len: rnd(8, 22), lw: rnd(1.5, 3), dur: rnd(220, 420), color });
    add({ kind: 'ring', x, y, r0: 4, r1: rnd(30, 46), lw: 4, dur: 340, color });
  }

  return {
    // 近战斩击（刀/剑/爪）
    slash(to, color = '#eaf4ff') {
      const c = pt(to);
      add({ kind: 'arc', x: c.x, y: c.y, r: Math.max(34, c.w * .42), a0: rnd(0, Math.PI * 2), sweep: Math.PI * rnd(.8, 1.1), lw: 6, dur: 300, color });
      add({ kind: 'arc', x: c.x, y: c.y, r: Math.max(30, c.w * .34), a0: rnd(0, Math.PI * 2), sweep: Math.PI * .8, lw: 3, dur: 340, color: '#ffffff' });
      burst(c.x, c.y, color, 7, .18);
    },
    // 钝器重击（钢管/球棒/斧）
    blunt(to) {
      const c = pt(to);
      for (let i = 0; i < 8; i++) add({ kind: 'spark', x: c.x, y: c.y, a: (Math.PI * 2 / 8) * i, v: .3, len: rnd(14, 26), lw: 3, dur: 300, color: '#ffd27a' });
      add({ kind: 'ring', x: c.x, y: c.y + c.h * .2, r0: 8, r1: 60, lw: 6, dur: 400, color: '#ffcf7a' });
      for (let i = 0; i < 10; i++) add({ kind: 'dot', x: c.x, y: c.y + c.h * .15, vx: rnd(-3, 3), vy: rnd(-5, -1), g: .5, r: rnd(2, 4), dur: rnd(350, 600), color: '#c9a15a' });
    },
    // 枪械：枪口闪光 + 弹道 + 弹着点火花
    shot(from, to) {
      const a = pt(from), b = pt(to);
      const mx = a.x + a.w * .3, my = a.y - a.h * .1;
      add({ kind: 'flash', x: mx, y: my, r: 34, dur: 120, color: 'rgba(255,220,120,.95)' });
      add({ kind: 'tracer', x0: mx, y0: my, x1: b.x, y1: b.y, lw: 3, dur: 150, color: '#ffe9a0' });
      add({ kind: 'tracer', x0: mx, y0: my, x1: b.x, y1: b.y, lw: 1.2, dur: 180, color: '#ffffff' });
      setTimeout(() => burst(b.x, b.y, '#ffce6a', 8, .26), 90);
    },
    // 法术/能量弹道（法杖/符咒/技能）
    cast(to, color = '#b78aff') {
      const a = pt('hero'), b = pt(to);
      add({ kind: 'orb', x0: a.x + a.w * .28, y0: a.y - a.h * .12, x1: b.x, y1: b.y, r: 12, dur: 300, color });
      setTimeout(() => {
        burst(b.x, b.y, color, 14, .3);
        add({ kind: 'flash', x: b.x, y: b.y, r: 60, dur: 260, color });
      }, 270);
    },
    // 火焰术
    fire(to) {
      const a = pt('hero'), b = pt(to);
      add({ kind: 'orb', x0: a.x + a.w * .28, y0: a.y - a.h * .12, x1: b.x, y1: b.y, r: 14, dur: 300, color: '#ff7a2a' });
      setTimeout(() => {
        for (let i = 0; i < 16; i++) add({ kind: 'dot', x: b.x, y: b.y, vx: rnd(-4, 4), vy: rnd(-6, -1), g: .35, r: rnd(3, 6), dur: rnd(300, 620), color: ['#ff9a3a', '#ff5a2a', '#ffd27a'][i % 3] });
        add({ kind: 'flash', x: b.x, y: b.y, r: 70, dur: 300, color: 'rgba(255,120,40,.8)' });
        add({ kind: 'ring', x: b.x, y: b.y, r0: 10, r1: 70, lw: 5, dur: 380, color: '#ff8a3a' });
      }, 270);
    },
    // 雷电术
    lightning(to) {
      const b = pt(to);
      const pts = [[b.x + rnd(-30, 30), b.top - 30]];
      let y = b.top - 30;
      while (y < b.y - 10) { y += rnd(16, 30); pts.push([b.x + rnd(-18, 18), y]); }
      pts.push([b.x, b.y]);
      add({ kind: 'bolt', pts, lw: 4, dur: 220, color: '#8ad0ff' });
      add({ kind: 'bolt', pts: pts.map(([x, yy]) => [x + rnd(-8, 8), yy]), lw: 2, dur: 300, color: '#c8ecff' });
      add({ kind: 'flash', x: b.x, y: b.y, r: 66, dur: 260, color: 'rgba(140,210,255,.85)' });
      burst(b.x, b.y, '#9fdcff', 10, .3);
    },
    // 圣光术
    holy(to) {
      const b = pt(to);
      add({ kind: 'beam', x: b.x, top: b.top, h: b.h, w: b.w * .9, dur: 520, color: 'rgba(255,236,160,.9)' });
      for (let i = 0; i < 12; i++) add({ kind: 'rise', x: b.x + rnd(-b.w * .3, b.w * .3), y: b.y + b.h * .3, h: rnd(40, 90), ph: rnd(0, 6), r: rnd(2, 4), dur: rnd(500, 800), color: '#ffe9a8' });
      add({ kind: 'ring', x: b.x, y: b.y, r0: 8, r1: 66, lw: 5, dur: 480, color: '#ffe9a8' });
    },
    // 治疗/恢复
    heal(ref) {
      const b = pt(ref);
      for (let i = 0; i < 14; i++) add({ kind: 'rise', x: b.x + rnd(-b.w * .35, b.w * .35), y: b.y + b.h * .35, h: rnd(50, 110), ph: rnd(0, 6), r: rnd(2.5, 5), dur: rnd(600, 1000), color: '#7aff9a' });
      add({ kind: 'flash', x: b.x, y: b.y, r: 55, dur: 420, color: 'rgba(120,255,150,.4)' });
      add({ kind: 'ring', x: b.x, y: b.y + b.h * .3, r0: 6, r1: 50, lw: 3, dur: 500, color: '#7aff9a' });
    },
    // 增益/护盾
    buff(ref, color = '#8ad0ff') {
      const b = pt(ref);
      add({ kind: 'ring', x: b.x, y: b.y + b.h * .35, r0: 10, r1: 56, lw: 5, dur: 500, color });
      add({ kind: 'ring', x: b.x, y: b.y + b.h * .35, r0: 4, r1: 40, lw: 3, dur: 620, color });
      for (let i = 0; i < 10; i++) add({ kind: 'rise', x: b.x + rnd(-b.w * .3, b.w * .3), y: b.y + b.h * .3, h: rnd(40, 80), ph: rnd(0, 6), r: rnd(2, 3.5), dur: rnd(500, 800), color });
    },
    // 敌方爪击/撕咬（通用红色撕裂）
    claw(to) {
      const c = pt(to);
      for (let i = 0; i < 3; i++) add({ kind: 'arc', x: c.x + i * 10 - 10, y: c.y, r: Math.max(30, c.w * .36), a0: -Math.PI / 3 + i * .3, sweep: Math.PI * .7, lw: 4, dur: 280, color: '#ff5a4a' });
      burst(c.x, c.y, '#ff6a5a', 6, .2);
    },
    // 剧毒/腐蚀
    venom(to) {
      const b = pt(to);
      for (let i = 0; i < 12; i++) add({ kind: 'dot', x: b.x + rnd(-b.w * .3, b.w * .3), y: b.y, vx: rnd(-1.5, 1.5), vy: rnd(-3, -0.5), g: .3, r: rnd(2.5, 5), dur: rnd(400, 700), color: '#8aff5a' });
      add({ kind: 'flash', x: b.x, y: b.y, r: 55, dur: 380, color: 'rgba(110,255,90,.5)' });
    },
    // 通用冲击
    impact(to, color = '#ffd0a0') { const c = pt(to); burst(c.x, c.y, color, 9, .26); },
    clear() { parts.length = 0; }
  };
})();

