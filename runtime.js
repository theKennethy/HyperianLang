'use strict';
// ═══════════════════════════════════════════════════════════════════════════
// HyperianLang — Node.js runtime world adapter
//
// Pass an instance of HLRuntime as the `world` argument to HyperianLang so
// that every ES statement (say, print, wait, heal, etc.) works in a terminal
// or Node.js server context.
//
// You can subclass HLRuntime to override any handler.
// ═══════════════════════════════════════════════════════════════════════════

class HLRuntime {
  constructor(options = {}) {
    // Key/value variables visible to the interpreter
    this._vars = {};
    // Simple switch bank
    this._switches = {};
    // Entity positions (name → {x, y})
    this._entities = {};
    // Entity properties (name → {prop → value})
    this._props = {};
    // Persistent data store (in-memory by default; replace with fs/DB as needed)
    this._store = {};
    // Game state
    this._running = true;

    // Tile size
    this.TILE = options.tile || 32;

    // Dialogue / choice handler — override for custom I/O
    this.onDialogue = options.onDialogue || null;
    this.onChoice   = options.onChoice   || null;
    this.onLog      = options.onLog      || null;
    this.onEvent    = options.onEvent    || null;
  }

  // ── entity management ───────────────────────────────────────────────────

  spawnEntity(name, x, y) {
    this._entities[name] = { x: x || 0, y: y || 0 };
    this._props[name] = this._props[name] || {};
  }

  destroyEntity(name) {
    delete this._entities[name];
    delete this._props[name];
  }

  showEntity(name)     { this.setProperty(name, 'visible', true);  }
  hideEntity(name)     { this.setProperty(name, 'visible', false); }
  freezeEntity(name)   { this.setProperty(name, 'frozen', true);   }
  unfreezeEntity(name) { this.setProperty(name, 'frozen', false);  }

  moveEntity(name, dx, dy, relative = true) {
    const e = this._entities[name];
    if (!e) return;
    if (relative) { e.x += dx; e.y += dy; }
    else          { e.x  = dx; e.y  = dy; }
  }

  applyImpulse() {} // physics stub
  applyForce()   {} // physics stub

  // ── property bag ────────────────────────────────────────────────────────

  getProperty(entity, prop) {
    if (!entity) return undefined;
    const bag = this._props[entity] || {};
    return bag[prop];
  }

  setProperty(entity, prop, value) {
    if (typeof prop === 'undefined') {
      // single-arg shorthand: setProperty(varName, value)
      this._vars[entity] = prop;
      return;
    }
    if (!this._props[entity]) this._props[entity] = {};
    this._props[entity][prop] = value;
  }

  // ── switches ─────────────────────────────────────────────────────────────

  isSwitch(id)     { return !!this._switches[id]; }
  turnOnSwitch(id) { this._switches[id] = true;   }
  turnOffSwitch(id){ this._switches[id] = false;  }

  // ── output ───────────────────────────────────────────────────────────────

  log(msg) {
    if (this.onLog) { this.onLog(msg); return; }
    console.log(msg);
  }

  /** Override to wire up a real prompt library (e.g. inquirer). */
  async showDialogue(text, speaker, _portrait) {
    if (this.onDialogue) return this.onDialogue(text, speaker);
    const prefix = speaker ? `[${speaker}]: ` : '';
    console.log(prefix + text);
  }

  /** Returns 0-based index of the selected choice. */
  async showChoice(prompt, options) {
    if (this.onChoice) return this.onChoice(prompt, options);
    if (prompt) console.log(prompt);
    options.forEach((o, i) => console.log(`  ${i + 1}. ${o}`));
    // In a plain Node.js script there's no stdin listener by default —
    // return 0 (first option) as a safe default.
    return 0;
  }

  // ── timing ────────────────────────────────────────────────────────────────

  wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, Math.round(seconds * 1000)));
  }

  // ── audio stubs (no-op in Node) ───────────────────────────────────────────

  playSound()    {}
  stopSound()    {}
  stopAllSounds(){}
  playMusic()    {}
  stopMusic()    {}
  setVolume()    {}
  loadTileset()  {}

  // ── screen fx stubs ───────────────────────────────────────────────────────

  screenShake() {}
  screenFlash() {}
  screenTint()  {}

  // ── animation stubs ───────────────────────────────────────────────────────

  defineSprite()    {}
  defineAnimation() {}
  playAnimation()   {}
  stopAnimation()   {}

  // ── events ────────────────────────────────────────────────────────────────

  emitEvent(name, data) {
    if (this.onEvent) { this.onEvent(name, data); return; }
    // Default: print to console and return; ES trigger() handles re-routing.
  }

  callFunction(fn, args) {
    if (typeof this[fn] === 'function') this[fn](...args);
    else console.warn(`[ESRuntime] Unknown function: ${fn}`);
  }

  // ── game state ────────────────────────────────────────────────────────────

  endGame()     { this._running = false; }
  winGame()     { this._running = false; console.log('[HLRuntime] Game won!');  }
  loseGame()    { this._running = false; console.log('[HLRuntime] Game over.');  }
  restartGame() { console.log('[HLRuntime] Restart requested.'); }
  loadScene(id) { console.log(`[HLRuntime] Load scene: ${id}`); }

  // ── inventory (basic in-memory) ───────────────────────────────────────────

  async addItem(itemId, qty = 1) {
    const k = 'inv:' + itemId;
    this._store[k] = (Number(this._store[k]) || 0) + Number(qty);
  }

  async removeItem(itemId, qty = 1) {
    const k = 'inv:' + itemId;
    this._store[k] = Math.max(0, (Number(this._store[k]) || 0) - Number(qty));
  }

  // ── persistent data ───────────────────────────────────────────────────────

  async saveData(key, value)   { this._store[key] = value; }
  async loadData(key)          { return this._store[key] ?? null; }
  async deleteData(key)        { delete this._store[key]; }

  // ── RPG stats stubs (override for real game data) ─────────────────────────

  heal(target, amount)             { /* override for real HP logic */ }
  recover(target)                  { /* override */ }
  giveExp(amount)                  { /* override */ }
  giveGold(amount)                 { /* override */ }
  addToParty(memberId)             { /* override */ }
  removeFromParty(memberId)        { /* override */ }
  changeMap(mapId, x, y)          { /* override */ }
  changeGold(amount, relative)     { /* override */ }
  changeStat(stat, entity, n, rel) { /* override */ }
  changeLevel(entity, n, rel)      { /* override */ }
  changeExp(entity, n, rel)        { /* override */ }
  changeClass(entity, classId)     { /* override */ }
  changeEncounterRate(rate)        { /* override */ }
  learnSkill(skillId, who)         { /* override */ }
  forgetSkill(skillId, who)        { /* override */ }
  defineData(kind, id, props)      { /* override */ }
  defineEvent(id, body)            { /* override */ }
  defineZone(id, entries)          { /* override */ }
  defineStatus(id, props, turnOps) { /* override */ }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HLRuntime };
}
