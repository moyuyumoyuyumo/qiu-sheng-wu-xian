
/* ========== 程序化音频引擎：Web Audio 生成 BGM 与音效 ========== */
const AudioSys = {
  ctx: null, master: null, musicGain: null, sfxGain: null,
  muted: false, currentTrack: null, schedTimer: null,
  nextNoteTime: 0, step: 0, delayNode: null,

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain(); this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain(); this.musicGain.gain.value = 0.55;
      this.sfxGain = this.ctx.createGain(); this.sfxGain.gain.value = 0.7;
      // 简单回声当混响
      this.delayNode = this.ctx.createDelay(1.5);
      const fb = this.ctx.createGain(); fb.gain.value = 0.35;
      const wet = this.ctx.createGain(); wet.gain.value = 0.35;
      this.musicGain.connect(this.master);
      this.musicGain.connect(this.delayNode);
      this.delayNode.connect(fb); fb.connect(this.delayNode);
      this.delayNode.connect(wet); wet.connect(this.master);
      this.sfxGain.connect(this.master);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.9;
  },

  midi2hz(m) { return 440 * Math.pow(2, (m - 69) / 12); },

  /* ---- 音轨定义：root=midi, scale=半音阶偏移, bpm, dens=旋律密度, wave, drone midi[], perc=打击概率 ---- */
  TRACKS: {
    title:  { root: 45, scale: [0,3,5,7,10,12,15], bpm: 70,  dens: 0.55, wave: 'triangle',  bass: 'sine',     drone: [33,40], padStep: 16, perc: 0.10, lp: 2400 },
    hub:    { root: 50, scale: [0,4,7,11,12,16],   bpm: 60,  dens: 0.45, wave: 'sine',      bass: 'sine',     drone: [38,45], padStep: 12, perc: 0.06, lp: 3000 },
    zombie: { root: 38, scale: [0,1,5,6,10,12],    bpm: 76,  dens: 0.50, wave: 'sawtooth',  bass: 'square',   drone: [26,27], padStep: 8,  perc: 0.30, lp: 1600 },
    alien:  { root: 41, scale: [0,1,4,6,7,12],     bpm: 88,  dens: 0.42, wave: 'sawtooth',  bass: 'sawtooth', drone: [29,30], padStep: 10, perc: 0.34, lp: 1400 },
    ghost:  { root: 47, scale: [0,2,3,7,8,12],     bpm: 52,  dens: 0.38, wave: 'sine',      bass: 'sine',     drone: [35,36], padStep: 14, perc: 0.05, lp: 2000 },
    rule:   { root: 44, scale: [0,2,5,6,11,12],    bpm: 66,  dens: 0.50, wave: 'triangle',  bass: 'sine',     drone: [32,33], padStep: 10, perc: 0.16, lp: 2200 },
    train:  { root: 40, scale: [0,2,5,7,8,12],     bpm: 96,  dens: 0.55, wave: 'square',    bass: 'sawtooth', drone: [28,29], padStep: 8,  perc: 0.42, lp: 1800 },
    cthulhu:{ root: 36, scale: [0,1,3,6,8,12],     bpm: 50,  dens: 0.34, wave: 'sine',      bass: 'sine',     drone: [24,25,31], padStep: 18, perc: 0.04, lp: 1200 },
    village:{ root: 43, scale: [0,2,5,7,9,12],     bpm: 60,  dens: 0.44, wave: 'triangle',  bass: 'sine',     drone: [31,38], padStep: 12, perc: 0.10, lp: 2400 },
    breach: { root: 39, scale: [0,1,4,6,8,12],     bpm: 100, dens: 0.52, wave: 'sawtooth',  bass: 'square',   drone: [27,28], padStep: 8,  perc: 0.40, lp: 1600 },
    royale: { root: 42, scale: [0,2,4,7,9,12],     bpm: 110, dens: 0.58, wave: 'square',    bass: 'sawtooth', drone: [30,31], padStep: 8,  perc: 0.46, lp: 2200 },
    final:  { root: 44, scale: [0,2,4,7,11,12],    bpm: 64,  dens: 0.50, wave: 'triangle',  bass: 'sine',     drone: [32,39,44], padStep: 14, perc: 0.08, lp: 2600 },
    battle: { root: 40, scale: [0,2,3,7,8,12],     bpm: 120, dens: 0.62, wave: 'sawtooth',  bass: 'square',   drone: [28,29], padStep: 8,  perc: 0.55, lp: 2800 },
    boss:   { root: 37, scale: [0,1,3,6,7,12],     bpm: 126, dens: 0.66, wave: 'sawtooth',  bass: 'sawtooth', drone: [25,26], padStep: 8,  perc: 0.60, lp: 3000 },
  },

  playTrack(name) {
    if (this.currentTrack === name) return;
    this.ensure();
    this.currentTrack = name;
    this.step = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.stopDrone();
    this.startDrone();
    if (!this.schedTimer) this.schedTimer = setInterval(() => this.tick(), 120);
  },

  stopMusic() {
    this.currentTrack = null;
    this.stopDrone();
    if (this.schedTimer) { clearInterval(this.schedTimer); this.schedTimer = null; }
  },

  droneNodes: [],
  startDrone() {
    const t = this.TRACKS[this.currentTrack]; if (!t) return;
    (t.drone || []).forEach(m => {
      const o = this.ctx.createOscillator(); o.type = t.bass || 'sine';
      o.frequency.value = this.midi2hz(m);
      const g = this.ctx.createGain(); g.gain.value = 0;
      const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = t.lp || 2000;
      o.connect(lp); lp.connect(g); g.connect(this.musicGain);
      o.start();
      g.gain.linearRampToValueAtTime(0.10, this.ctx.currentTime + 3);
      // 缓慢颤音
      const lfo = this.ctx.createOscillator(); lfo.frequency.value = 0.08 + Math.random() * 0.06;
      const lg = this.ctx.createGain(); lg.gain.value = 0.045;
      lfo.connect(lg); lg.connect(g.gain); lfo.start();
      this.droneNodes.push(o, lfo);
    });
  },
  stopDrone() {
    this.droneNodes.forEach(n => { try { n.stop(); } catch(e) {} });
    this.droneNodes = [];
  },

  tick() {
    const t = this.TRACKS[this.currentTrack]; if (!t) return;
    const stepDur = 60 / t.bpm / 2; // 八分音符
    while (this.nextNoteTime < this.ctx.currentTime + 0.35) {
      this.scheduleStep(this.step, this.nextNoteTime, stepDur, t);
      this.nextNoteTime += stepDur;
      this.step++;
    }
  },

  scheduleStep(step, time, dur, t) {
    const s = this.step % 64;
    // 长音 pad
    if (s % t.padStep === 0) {
      const chordIdx = Math.floor(this.step / t.padStep) % 4;
      const chordRoots = [0, -4, -2, -5];
      const base = t.root + chordRoots[chordIdx];
      [0, 3, 7].forEach(iv => this.note(this.midi2hz(base + iv), time, dur * t.padStep * 0.9, t.wave, 0.035, t.lp));
    }
    // 旋律
    if (Math.random() < t.dens) {
      const sc = t.scale;
      const noteM = t.root + 12 + sc[Math.floor(Math.random() * sc.length)];
      this.note(this.midi2hz(noteM), time, dur * (Math.random() < 0.3 ? 3 : 1.5), t.wave, 0.05, t.lp);
    }
    // 低音脉冲
    if (s % 4 === 0 && Math.random() < 0.8) {
      this.note(this.midi2hz(t.root - 12), time, dur * 2, t.bass, 0.07, t.lp);
    }
    // 打击
    if (Math.random() < t.perc) this.noise(time, 0.05, 0.06, s % 8 === 0 ? 800 : 4000);
  },

  note(freq, time, dur, wave, vol, lp) {
    const o = this.ctx.createOscillator(); o.type = wave; o.frequency.value = freq;
    const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp || 2400;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(vol, time + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    o.connect(f); f.connect(g); g.connect(this.musicGain);
    o.start(time); o.stop(time + dur + 0.1);
  },

  noise(time, dur, vol, freq) {
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq;
    const g = this.ctx.createGain(); g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(this.musicGain);
    src.start(time);
  },

  /* ---- 音效 ---- */
  sfx(name) {
    this.ensure();
    const c = this.ctx, t = c.currentTime;
    const play = (type, f0, f1, dur, vol) => {
      const o = c.createOscillator(); o.type = type;
      o.frequency.setValueAtTime(f0, t);
      if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      const g = c.createGain();
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(this.sfxGain); o.start(t); o.stop(t + dur + 0.05);
    };
    const nz = (dur, vol, freq) => {
      const len = Math.floor(c.sampleRate * dur);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const s = c.createBufferSource(); s.buffer = buf;
      const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq;
      const g = c.createGain(); g.gain.value = vol;
      s.connect(f); f.connect(g); g.connect(this.sfxGain); s.start(t);
    };
    switch (name) {
      case 'click': play('square', 660, 880, 0.06, 0.12); break;
      case 'hit':   nz(0.12, 0.3, 1200); play('square', 180, 90, 0.12, 0.2); break;
      case 'crit':  nz(0.2, 0.4, 900); play('sawtooth', 300, 60, 0.25, 0.3); break;
      case 'hurt':  play('sawtooth', 200, 70, 0.3, 0.25); nz(0.15, 0.2, 500); break;
      case 'heal':  play('sine', 440, 880, 0.35, 0.15); play('sine', 554, 1108, 0.4, 0.1); break;
      case 'coin':  play('square', 988, 1319, 0.08, 0.12); setTimeout(()=>play('square', 1319, 1568, 0.12, 0.1), 70); break;
      case 'door':  play('sine', 110, 55, 0.7, 0.25); break;
      case 'win':   [523,659,784,1047].forEach((f,i)=>setTimeout(()=>play('triangle', f, f, 0.3, 0.15), i*110)); break;
      case 'lose':  [392,330,262,196].forEach((f,i)=>setTimeout(()=>play('sawtooth', f, f*0.8, 0.4, 0.15), i*160)); break;
      case 'skill': play('sine', 300, 900, 0.25, 0.15); nz(0.1, 0.1, 3000); break;
      case 'scare': play('sawtooth', 90, 45, 0.9, 0.3); nz(0.6, 0.15, 300); break;
      case 'level': [330,440,554,659,880].forEach((f,i)=>setTimeout(()=>play('sine', f, f, 0.25, 0.12), i*90)); break;
    }
  }
};

