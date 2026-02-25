'use strict';
// ═══════════════════════════════════════════════════════════════════════════
// HyperianLang — core language: Lexer · Parser · Interpreter · HyperianLang
// Compatible with both browser (<script>) and Node.js (require / import).
// ═══════════════════════════════════════════════════════════════════════════

const _ES_KEYWORDS = new Set([
  'when', 'then', 'end', 'if', 'else', 'repeat', 'times', 'every',
  'seconds', 'while', 'do', 'and', 'or', 'not',
  // JS/Node.js control flow
  'for', 'try', 'catch', 'break', 'skip', 'where', 'finally',
  // functions
  'function', 'return',
  // OOP/classes
  'class', 'extends', 'method', 'constructor', 'property', 'static', 'private', 'public',
  // modules
  'import', 'export', 'from', 'as',
  // async
  'await', 'async',
  // timers
  'after', 'interval',
  // lambda/arrow functions
  'lambda', 'arrow',
  // destructuring
  'extract',
  // generators
  'generator', 'yield',
  // advanced JS
  'proxy', 'symbol', 'bigint', 'weakmap', 'weakset',
  // Promise API
  'promise', 'all', 'race', 'allsettled', 'anyof',
  // Date/Time
  'date', 'time', 'now',
  // TypedArrays
  'typed', 'arraybuffer', 'dataview',
  // Reflect
  'reflect',
  // Intl
  'format', 'locale',
  // Missing JS features
  'url', 'abort', 'clone',
]);

const _ES_ACTIONS = new Set([
  'set', 'increase', 'decrease', 'move', 'play', 'stop', 'spawn',
  'destroy', 'show', 'hide', 'print', 'wait', 'call', 'emit',
  'teleport', 'freeze', 'unfreeze', 'apply', 'define',
  'say', 'choice', 'battle', 'attack', 'add', 'remove', 'toggle',
  'load', 'win', 'lose', 'restart', 'save', 'give', 'take', 'let',
  'turn', 'open', 'shake', 'flash', 'tint', 'equip',
  'heal', 'grant', 'recover', 'change', 'learn', 'forget',
  'delete', 'deal', 'restore', 'drain',
  // JS/Node.js — data/arrays/strings
  'append', 'fetch', 'post', 'parse', 'stringify',
  'read', 'write', 'split', 'replace', 'convert', 'count',
  'round', 'floor', 'ceil', 'abs', 'sqrt', 'min', 'max', 'random',
  'join', 'trim', 'uppercase', 'lowercase',
  // JS/Node.js — new
  'sort', 'reverse', 'filter', 'merge', 'flatten',
  'get', 'index', 'slice', 'find', 'clamp', 'log',
  'exit', 'run', 'create', 'pad', 'sign', 'type',
  // functions, match, array-pipeline, path, object
  'transform', 'reduce', 'copy', 'assign', 'serve',
  'match', 'respond', 'listen', 'every', 'any',
  // server - English syntax
  'start', 'send', 'when',
  // OOP
  'new', 'inherit', 'extends', 'super',
  // regex
  'regex', 'pattern', 'test', 'matches', 'capture', 'extract',
  // error handling
  'throw', 'raise', 'error',
  // websockets
  'connect', 'disconnect', 'broadcast',
  // child process
  'execute', 'spawn', 'shell',
  // database
  'query', 'insert', 'update', 'select', 'where',
  // async
  'await', 'async', 'promise', 'resolve', 'reject',
  // check
  'check',
  // new features
  'spread', 'hash', 'encrypt', 'decrypt', 'encode', 'decode',
  'buffer', 'safely',
  // generators, proxies, symbols
  'generate', 'yield', 'intercept', 'trap',
  'tag', 'produce', 'emit', 'wrap', 'process', 'combine',
  // Promise API
  'all', 'race', 'settle', 'parallel',
  // Object methods
  'freezeobj', 'sealobj', 'compare', 'frompairs',
  // Array methods
  'arrayfrom', 'isarray', 'flatmap', 'fillarr', 'copywithin',
  // Date/Time
  'getdate', 'gettime', 'setdate', 'settime', 'toiso', 'timestamp',
  // TypedArrays
  'uint8', 'int32', 'float64', 'view',
  // Reflect API
  'reflectget', 'reflectset', 'reflecthas', 'reflectdelete',
  // Intl
  'formatdate', 'formatnumber', 'currency',
  // Missing JS features - Promise
  'anyof', 'first',
  // Missing JS features - Object
  'defineprop', 'getdescriptor', 'getprototype', 'setprototype',
  // Missing JS features - Array
  'reduceright', 'copywithin', 'itemat', 'tosorted', 'toreversed',
  // Missing JS features - String
  'replaceall', 'charat', 'normalize', 'localecompare',
  // Missing JS features - Number
  'isinteger', 'isfinite', 'isnan', 'parsefloat', 'parseint', 'tofixed', 'toprecision',
  // Missing JS features - Math
  'trunc', 'cbrt', 'hypot', 'log2', 'log10', 'sinh', 'cosh', 'tanh',
  // Missing JS features - URL
  'url', 'searchparams',
  // Missing JS features - Console
  'table', 'group', 'groupend', 'timestart', 'timeend', 'assert',
  // Missing JS features - Misc
  'clone', 'microtask', 'abort', 'textencode', 'textdecode',
]);

const _ES_PREPS = new Set([
  'to', 'by', 'at', 'from', 'with', 'on', 'of', 'in', 'is', 'has',
  'touches', 'presses', 'clicks', 'enters', 'leaves', 'becomes',
  'impulse', 'force', 'frames', 'fps', 'loop', 'as', 'portrait',
  'item', 'inventory', 'scene', 'game', 'quantity', 'starts',
  'switch', 'off', 'menu', 'shop', 'over', 'event', 'for',
  'formula', 'editor', 'autotile', 'zone', 'slot', 'effect',
  'party', 'exp', 'experience', 'gold', 'member', 'wins', 'loses',
  'levels', 'up', 'all', 'class', 'level', 'map', 'encounter',
  'rate', 'skill', 'actor', 'enemy', 'name', 'desc', 'drops',
  'weight', 'costs', 'cost', 'price', 'type', 'scope', 'element',
  'power', 'physical', 'drain', 'revive', 'inflict', 'turns',
  'heals', 'hp', 'mp', 'atk', 'def', 'matk', 'mdef', 'spd', 'luk',
  'maxHp', 'maxMp', 'ai', 'color', 'weakTo', 'resistTo',
  'growth', 'stats', 'skills', 'looping', 'beneficial',
  'into', 'data', 'record',
  'each', 'turn', 'percent', 'damage', 'flat', 'message',
  'preventsAction', 'preventsMagic', 'missChance', 'wakeOnHit',
  // JS/Node.js feature preps
  'json', 'exists', 'empty', 'last', 'first', 'text', 'number',
  'file', 'array', 'url', 'body', 'contains',
  // verb preps
  'uses', 'defeats', 'wins', 'loses', 'hits', 'dies', 'spawns',
  // object/map
  'object', 'key', 'keys', 'nothing',
  // misc
  'ascending', 'descending', 'folder', 'directory', 'env',
  'command', 'code', 'timestamp', 'date', 'time',
  'starts', 'ends', 'right', 'left', 'char', 'length',
  'boolean', 'integer',
  // functions / match / reduce / path
  'function', 'param', 'params', 'arg', 'args',
  'against', 'pattern',
  'starting', 'accumulator',
  'path', 'basename', 'dirname', 'extension', 'extname',
  'port', 'route', 'request', 'response', 'server', 'receiving', 'receives', 'status',
  'html', 'css', 'javascript',
  'infinity', 'pi', 'nan', 'math',
  'an', 'a', 'return',
  // English sentence helpers
  'be', 'the', 'this', 'that', 'these', 'those', 'which', 'who',
  // OOP preps
  'instance', 'new', 'method', 'methods', 'property', 'properties', 'inherits', 'parent', 'child',
  // regex preps
  'regex', 'pattern', 'flags', 'global', 'ignorecase', 'multiline', 'groups',
  // websocket preps
  'websocket', 'socket', 'channel', 'room',
  // database preps
  'database', 'table', 'column', 'row', 'rows', 'values', 'where', 'limit', 'offset', 'order',
  // callback preps
  'callback', 'handler', 'listener',
  // stream preps
  'stream', 'pipe', 'chunk', 'encoding',
  // module preps
  'module', 'export', 'exports', 'require',
  // Map/Set preps
  'map', 'set', 'entry', 'entries', 'size',
  // new feature preps
  'lambda', 'arrow', 'safely', 'otherwise', 'default', 'using', 'algorithm',
  'sha256', 'sha512', 'md5', 'sha1', 'hex', 'base64', 'utf8', 'binary',
  'buffer', 'crypto', 'bytes',
  // generators/proxies/symbols
  'generator', 'yields', 'next', 'done', 'iterator',
  'proxy', 'target', 'handler', 'trap', 'traps',
  'symbol', 'symbols', 'unique', 'description',
  'bigint', 'big', 'integer',
  'weakmap', 'weakset', 'weak',
  'tag', 'tagged', 'template', 'raw', 'strings', 'literal',
  // More natural English connectors
  'called', 'named', 'produces', 'emits', 'starting', 'wrapped',
  // Promise API
  'promises', 'settled', 'resolved', 'rejected', 'parallel', 'concurrently',
  // Object methods
  'frozen', 'sealed', 'identical', 'pairs', 'entries',
  // Array methods
  'filled', 'copied', 'isarray', 'typed',
  // Date/Time
  'year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond',
  'timezone', 'iso', 'utc', 'local',
  // TypedArrays
  'uint8', 'int8', 'uint16', 'int16', 'uint32', 'int32', 'float32', 'float64',
  'bytes', 'view', 'offset', 'bytelength',
  // Reflect
  'reflect', 'property', 'descriptor', 'configurable', 'enumerable', 'writable',
  // Intl
  'locale', 'currency', 'style', 'notation', 'compact', 'scientific',
  // Missing JS features
  'base', 'radix', 'digits', 'precision', 'form', 'signal', 'controller',
  'normalized', 'compared', 'truncated', 'encoded', 'decoded',
]);

const _ES_COMPARISONS = new Set([
  'less', 'greater', 'than', 'equal', 'equals', 'above', 'below', 'between',
]);

// Loop-control sentinel signals (thrown and caught inside loop executors)
const _HL_BREAK   = Symbol('hl:break');
const _HL_SKIP    = Symbol('hl:skip');
const _HL_RETURN  = Symbol('hl:return');

// ═══════════════════════════════════════════════════════════════════════════
// LEXER
// ═══════════════════════════════════════════════════════════════════════════

class HLLexer {
  constructor(source) {
    this.source = source;
    this.pos    = 0;
  }

  tokenize() {
    const tokens = [];
    while (this.pos < this.source.length) {
      this._skipWhitespace();
      if (this.pos >= this.source.length) break;
      const ch = this.source[this.pos];

      // Single-line comment (//)
      if (ch === '/' && this.source[this.pos + 1] === '/') {
        while (this.pos < this.source.length && this.source[this.pos] !== '\n') this.pos++;
        continue;
      }
      // Single-line comment (#)
      if (ch === '#') {
        while (this.pos < this.source.length && this.source[this.pos] !== '\n') this.pos++;
        continue;
      }

      // Quoted string (with interpolation support)
      if (ch === '"') {
        let str = '';
        this.pos++;
        const parts = []; // For string interpolation
        let hasInterpolation = false;
        let currentPart = '';
        
        while (this.pos < this.source.length && this.source[this.pos] !== '"') {
          // Check for interpolation: {varName}
          if (this.source[this.pos] === '{') {
            // Save current string part
            if (currentPart) parts.push({ type: 'text', value: currentPart });
            currentPart = '';
            this.pos++; // skip {
            let varName = '';
            while (this.pos < this.source.length && this.source[this.pos] !== '}' && this.source[this.pos] !== '"') {
              varName += this.source[this.pos++];
            }
            if (this.source[this.pos] === '}') {
              this.pos++; // skip }
              parts.push({ type: 'var', value: varName.trim() });
              hasInterpolation = true;
            } else {
              currentPart += '{' + varName; // Not a valid interpolation
            }
          } else {
            currentPart += this.source[this.pos++];
          }
        }
        if (currentPart) parts.push({ type: 'text', value: currentPart });
        this.pos++; // closing quote
        
        if (hasInterpolation) {
          tokens.push({ type: 'INTERPOLATED_STRING', parts: parts });
        } else {
          tokens.push({ type: 'STRING', value: parts.map(p => p.value).join('') });
        }
        continue;
      }

      // Negative number literal
      if (ch === '-' && this.pos + 1 < this.source.length && /[0-9]/.test(this.source[this.pos + 1])) {
        let num = '-';
        this.pos++;
        while (this.pos < this.source.length && /[0-9.]/.test(this.source[this.pos])) {
          num += this.source[this.pos++];
        }
        tokens.push({ type: 'NUMBER', value: parseFloat(num) });
        continue;
      }

      // Positive number literal
      if (/[0-9]/.test(ch)) {
        let num = '';
        while (this.pos < this.source.length && /[0-9.]/.test(this.source[this.pos])) {
          num += this.source[this.pos++];
        }
        tokens.push({ type: 'NUMBER', value: parseFloat(num) });
        continue;
      }

      // Math / assignment operators
      if ('+-*/%'.includes(ch)) {
        this.pos++;
        tokens.push({ type: 'OPERATOR', value: ch });
        continue;
      }
      if (ch === '=') {
        this.pos++;
        tokens.push({ type: 'ASSIGN', value: '=' });
        continue;
      }

      // Word (identifier / keyword)
      if (/[a-zA-Z_]/.test(ch)) {
        let word = '';
        while (this.pos < this.source.length && /[a-zA-Z0-9_]/.test(this.source[this.pos])) {
          word += this.source[this.pos++];
        }
        tokens.push(this._classifyWord(word));
        continue;
      }

      // Brackets, braces, parens, punctuation
      if ('[]{}(),:;'.includes(ch)) {
        this.pos++;
        tokens.push({ type: 'PUNCT', value: ch });
        continue;
      }

      this.pos++; // skip unknown character
    }
    return tokens;
  }

  _skipWhitespace() {
    while (this.pos < this.source.length && /\s/.test(this.source[this.pos])) {
      this.pos++;
    }
  }

  _classifyWord(word) {
    const lw = word.toLowerCase();
    if (lw === 'true' || lw === 'false') return { type: 'BOOLEAN', value: lw === 'true' };
    if (lw === 'null' || lw === 'nothing') return { type: 'NULL', value: null };
    if (lw === 'plus')     return { type: 'OPERATOR', value: '+' };
    if (lw === 'minus')    return { type: 'OPERATOR', value: '-' };
    if (lw === 'times')    return { type: 'KEYWORD',  value: 'times' };
    if (lw === 'divided')  return { type: 'KEYWORD',  value: 'divided' };
    if (lw === 'multiplied') return { type: 'KEYWORD', value: 'multiplied' };
    if (lw === 'modulo')   return { type: 'OPERATOR', value: '%' };
    if (_ES_KEYWORDS.has(lw))    return { type: 'KEYWORD',    value: lw };
    if (_ES_ACTIONS.has(lw))     return { type: 'ACTION',     value: lw };
    if (_ES_PREPS.has(lw))       return { type: 'PREP',       value: lw };
    if (_ES_COMPARISONS.has(lw)) return { type: 'COMPARISON', value: lw };
    return { type: 'IDENT', value: word };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PARSER
// ═══════════════════════════════════════════════════════════════════════════

class HLParser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos    = 0;
  }

  _peek(offset = 0) { return this.tokens[this.pos + offset] || null; }
  _next() { return this.tokens[this.pos++] || null; }
  _is(val) { return this._peek()?.value === val; }
  _isType(t) { return this._peek()?.type === t; }

  _consume(expectedValue) {
    const tok = this._next();
    if (expectedValue !== undefined && tok?.value !== expectedValue) {
      throw new Error(`HLParser: expected "${expectedValue}" but got "${tok?.value}"`);
    }
    return tok;
  }

  _consumeIdent() {
    const tok = this._peek();
    if (!tok || (tok.type !== 'IDENT' && tok.type !== 'PREP' && tok.type !== 'ACTION' && tok.type !== 'KEYWORD')) {
      if (tok && (tok.type === 'STRING' || tok.type === 'NUMBER')) {
        this.pos++;
        return String(tok.value);
      }
      throw new Error(`HLParser: expected identifier but got "${tok?.value}" (${tok?.type})`);
    }
    this.pos++;
    return tok.value;
  }

  _consumeIdentOrString() {
    const tok = this._peek();
    if (tok?.type === 'STRING') { this.pos++; return tok.value; }
    if (tok?.type === 'INTERPOLATED_STRING') { this.pos++; return { __interpolated: true, parts: tok.parts }; }
    if (tok?.type === 'IDENT' || tok?.type === 'PREP' || tok?.type === 'ACTION' || tok?.type === 'KEYWORD') { this.pos++; return tok.value; }
    throw new Error(`HLParser: expected identifier or string but got "${tok?.value}"`);
  }

  /**
   * Consume a multi-word variable name (e.g. "the player score") until a stop token.
   * Words are joined with underscores to form a single identifier.
   * stopSet: Set of values that end the name (e.g. 'be', 'to', 'by', 'is', 'has')
   */
  _consumeMultiWordName(stopSet) {
    const words = [];
    const WORD_TYPES = new Set(['IDENT', 'PREP', 'ACTION']);
    // articles/determiners that can be skipped at the start
    const NAME_PREPS = new Set(['the', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'your', 'our', 'their']);
    // Statement-starting actions that should not be consumed as part of variable names
    const STMT_ACTIONS = new Set([
      'let', 'set', 'increase', 'decrease', 'move', 'play', 'stop', 'spawn',
      'destroy', 'show', 'hide', 'print', 'wait', 'call', 'emit', 'teleport',
      'freeze', 'unfreeze', 'apply', 'define', 'say', 'choice', 'battle',
      'attack', 'add', 'remove', 'toggle', 'load', 'win', 'lose', 'restart',
      'save', 'give', 'take', 'turn', 'open', 'shake', 'flash', 'tint', 'equip',
      'heal', 'grant', 'recover', 'change', 'learn', 'forget', 'delete', 'deal',
      'restore', 'drain', 'append', 'fetch', 'post', 'parse', 'stringify',
      'read', 'write', 'split', 'replace', 'convert', 'sort', 'reverse', 'filter',
      'merge', 'flatten', 'get', 'find', 'clamp', 'log', 'exit', 'run', 'create',
      'transform', 'reduce', 'copy', 'assign', 'match', 'return', 'check',
    ]);
    // Statement-starting keywords that should not be consumed as part of variable names
    const STMT_KEYWORDS = new Set([
      'if', 'while', 'repeat', 'for', 'return', 'end', 'else', 'when', 'then', 'do',
      'function', 'match', 'on', 'every', 'any', 'each', 'break', 'continue',
    ]);
    while (this.pos < this.tokens.length) {
      const tok = this._peek();
      if (!tok) break;
      // Stop on assignment/comparison keywords
      if (stopSet.has(tok.value)) break;
      if (tok.type === 'ASSIGN') break;
      if (tok.type === 'OPERATOR') break;
      if (tok.type === 'COMPARISON') break;
      if (tok.type === 'NUMBER' || tok.type === 'STRING' || tok.type === 'BOOLEAN') break;
      // Stop on statement-starting actions (after collecting at least one word)
      if (words.length > 0 && tok.type === 'ACTION' && STMT_ACTIONS.has(tok.value)) break;
      // Stop on statement-starting keywords (after collecting at least one word)
      if (words.length > 0 && tok.type === 'KEYWORD' && STMT_KEYWORDS.has(tok.value)) break;
      // Only collect identifier-like tokens
      if (!WORD_TYPES.has(tok.type) && tok.type !== 'KEYWORD') break;
      // Skip articles at the start ONLY if the next token is not a stop/assignment
      if (words.length === 0 && NAME_PREPS.has(tok.value)) {
        const nextTok = this._peek(1);
        if (nextTok && !stopSet.has(nextTok.value) && nextTok.type !== 'ASSIGN' && nextTok.type !== 'OPERATOR' && !(nextTok.type === 'ACTION' && STMT_ACTIONS.has(nextTok.value)) && !(nextTok.type === 'KEYWORD' && STMT_KEYWORDS.has(nextTok.value))) {
          this._next(); continue;
        }
      }
      words.push(tok.value);
      this._next();
    }
    if (words.length === 0) throw new Error('HLParser: expected variable name');
    return words.join('_');
  }

  parse() {
    const rules = [];
    const init  = [];
    while (this.pos < this.tokens.length) {
      // 'when receiving' or 'when the server receives' is a server route (statement), not a rule
      const isServerRoute = this._is('when') && (
        this._peek(1)?.value === 'receiving' ||
        (this._peek(1)?.value === 'the' && this._peek(2)?.value === 'server') ||
        this._peek(1)?.value === 'server'
      );
      if (isServerRoute) {
        try { const stmt = this._parseStatement(); if (stmt) init.push(stmt); else this.pos++; }
        catch (e) { console.warn('[HLParser] Stmt error:', e.message); this.pos++; }
      } else if (this._is('when')) {
        try { rules.push(this._parseRule()); }
        catch (e) { console.warn('[HLParser] Rule error:', e.message); this.pos++; }
      } else {
        try { const stmt = this._parseStatement(); if (stmt) init.push(stmt); else this.pos++; }
        catch (e) { console.warn('[HLParser] Stmt error:', e.message); this.pos++; }
      }
    }
    return { type: 'program', rules, init };
  }

  _parseRule() {
    this._consume('when');
    const event = this._parseEvent();
    this._consume('then');
    const body = this._parseBody(['end']);
    if (this._is('end')) this._consume('end');
    return { type: 'rule', event, body };
  }

  _parseEvent() {
    const tok = this._peek();

    if (tok?.value === 'starts' || tok?.value === 'game') {
      if (tok?.value === 'game') this._next();
      if (this._is('starts')) this._next();
      return { type: 'starts', subject: 'game' };
    }

    if (tok?.value === 'combat') {
      this._next();
      const sub = this._peek()?.value || '';
      if (sub === 'starts') {
        this._next();
        const a = this._consumeIdent();
        const b = this._consumeIdent();
        return { type: 'combatStart', attacker: a, defender: b };
      }
      if (sub === 'hit' || sub === 'hits') {
        this._next();
        const a = this._consumeIdent();
        const b = this._consumeIdent();
        return { type: 'combatHit', attacker: a, defender: b };
      }
      if (sub === 'defeat' || sub === 'defeats') {
        this._next();
        const entity = this._consumeIdentOrString();
        return { type: 'combatDefeat', entity };
      }
      return { type: 'custom', name: 'combat:' + sub };
    }

    const subject = this._consumeIdent();
    const verb = this._peek()?.value;

    if (verb === 'touches') { this._next(); return { type: 'touches', subject, object: this._consumeIdent() }; }
    if (verb === 'presses') { this._next(); return { type: 'presses', subject, key: this._consumeIdentOrString().toLowerCase() }; }
    if (verb === 'clicks')  { this._next(); return { type: 'clicks', subject }; }
    if (verb === 'enters')  { this._next(); return { type: 'enters', subject, zone: this._consumeIdent() }; }
    if (verb === 'leaves')  { this._next(); return { type: 'leaves', subject, zone: this._consumeIdent() }; }
    if (verb === 'becomes') { this._next(); return { type: 'becomes', subject, value: this._parseValue() }; }
    if (verb === 'levels')  { this._next(); if (this._is('up')) this._next(); return { type: 'custom', name: subject + ':levelup' }; }
    if (verb === 'uses')    { this._next(); return { type: 'uses', subject, item: this._consumeIdentOrString() }; }
    if (verb === 'dies' || verb === 'spawns' || verb === 'wins' || verb === 'loses') {
      this._next(); return { type: 'custom', name: subject + ':' + verb };
    }

    if (this._isType('IDENT') || this._isType('PREP')) {
      const prop = this._consumeIdent();
      const connector = this._peek();
      if (connector?.value === 'is' || connector?.value === 'has') {
        this._next();
        return { type: 'condition', subject, prop, comparison: this._parseComparison() };
      }
      return { type: 'custom', name: subject + ':' + prop };
    }

    return { type: 'custom', name: subject };
  }

  _parseComparison() {
    const tok = this._peek();
    if (tok?.value === 'less')    { this._consume('less');    if (this._is('than')) this._consume('than'); return { op: 'less',    value: this._parseValue() }; }
    if (tok?.value === 'greater') { this._consume('greater'); if (this._is('than')) this._consume('than'); return { op: 'greater', value: this._parseValue() }; }
    if (tok?.value === 'equal' || tok?.value === 'equals') { this._next(); if (this._is('to')) this._next(); return { op: 'equal', value: this._parseValue() }; }
    if (tok?.value === 'above')   { this._next(); return { op: 'greater', value: this._parseValue() }; }
    if (tok?.value === 'below')   { this._next(); return { op: 'less',    value: this._parseValue() }; }
    if (tok?.value === 'between') {
      this._next();
      const low = this._parseValue();
      this._consume('and');
      return { op: 'between', low, high: this._parseValue() };
    }
    if (tok?.value === 'empty')   { this._next(); return { op: 'empty',   value: null }; }
    if (tok?.value === 'exists')  { this._next(); return { op: 'exists',  value: null }; }
    if (tok?.value === 'nothing') { this._next(); return { op: 'nothing', value: null }; }
    if (tok?.type  === 'NULL')    { this._next(); return { op: 'nothing', value: null }; }
    if (tok?.value === 'not') {
      this._next();
      if (this._is('empty'))   { this._next(); return { op: 'notEmpty',   value: null }; }
      if (this._is('exists'))  { this._next(); return { op: 'notExists',  value: null }; }
      if (this._is('nothing')) { this._next(); return { op: 'notNothing', value: null }; }
    }
    return { op: 'equal', value: this._parseValue() };
  }

  _parsePrimary() {
    const tok = this._peek();
    if (!tok) throw new Error('HLParser: expected value but reached end of input');

    // Array literal: [1, 2, 3]
    if (tok.type === 'PUNCT' && tok.value === '[') {
      this._next(); // consume '['
      const elements = [];
      while (this._peek() && !(this._peek().type === 'PUNCT' && this._peek().value === ']')) {
        elements.push(this._parseValue());
        if (this._peek()?.type === 'PUNCT' && this._peek()?.value === ',') this._next();
      }
      if (this._peek()?.type === 'PUNCT' && this._peek()?.value === ']') this._next();
      return { type: 'array', elements };
    }

    // Object literal: {"key": value, ...}
    if (tok.type === 'PUNCT' && tok.value === '{') {
      this._next(); // consume '{'
      const pairs = [];
      while (this._peek() && !(this._peek().type === 'PUNCT' && this._peek().value === '}')) {
        let key;
        if (this._peek()?.type === 'STRING') {
          key = this._next().value;
        } else {
          key = this._consumeIdent();
        }
        // consume : if present
        if (this._peek()?.type === 'PUNCT' && this._peek()?.value === ':') this._next();
        const value = this._parseValue();
        pairs.push({ key, value });
        if (this._peek()?.type === 'PUNCT' && this._peek()?.value === ',') this._next();
      }
      if (this._peek()?.type === 'PUNCT' && this._peek()?.value === '}') this._next();
      return { type: 'object', pairs };
    }

    // Ternary conditional as value: if X then Y else Z
    // Also supports: X then Y else Z (shorter syntax)
    if (tok.value === 'if') {
      this._next(); // consume 'if'
      const condition = this._parseCondition();
      if (this._is('then')) this._next();
      const trueValue = this._parsePrimary();
      if (this._is('else')) this._next();
      const falseValue = this._parsePrimary();
      return { type: 'ternary', condition, trueValue, falseValue };
    }

    // math pi / math e / math infinity / math tau / math nan
    if (tok.value === 'math') {
      this._next();
      const cname = this._consumeIdent();
      return { type: 'mathConst', name: cname };
    }

    // inline call function "name" with args — produces a value
    if (tok.value === 'call' && this._peek(1)?.value === 'function') {
      this._next(); // consume 'call'
      return { type: 'callExpr', ...this._parseCallFunction() };
    }

    // Function-expression ops (math, string, array) — checked by VALUE, type-agnostic
    const FUNC_OPS = new Set([
      'round','floor','ceil','abs','sqrt','power','min','max','random','sign','log','clamp',
      'uppercase','lowercase','trim','length','count','join','split','array','object',
      'index','slice','type',
      // New: array/string methods
      'includes','findItem','findIndex','startsWith','endsWith',
    ]);
    if (FUNC_OPS.has(tok.value)) {
      this.pos++;
      return this._parseFuncExpr(tok.value);
    }

    // get X from Y -- property access as a value expression
    // Patterns: "get X from Y", "get the X from Y", "get the X of Y"
    if (tok.value === 'get') {
      this._next(); // consume 'get'
      if (this._is('the')) this._next(); // optional 'the'
      
      // Check for special patterns: body, params
      const propName = this._consumeIdent();
      if (this._is('from') || this._is('of')) {
        this._next();
        const objName = this._consumeIdent();
        return { type: 'getObjKey', obj: objName, key: { type: 'string', value: propName } };
      }
      // If no 'from'/'of', return as identifier 'get_X'  
      return { type: 'ident', value: 'get_' + propName };
    }

    if (tok.type === 'NULL') { this._next(); return { type: 'null', value: null }; }
    // Interpolated strings: "Hello {name}"
    if (tok.type === 'INTERPOLATED_STRING') {
      this._next();
      return { type: 'interpolatedString', parts: tok.parts };
    }
    if (tok.type === 'NUMBER' || tok.type === 'STRING' || tok.type === 'BOOLEAN') {
      this._next();
      return { type: tok.type.toLowerCase(), value: tok.value };
    }
    // Multi-word variable names in value position
    // Collect words until we hit an operator, keyword, comparison, or known stop token
    if (tok.type === 'IDENT' || tok.type === 'PREP' || tok.type === 'ACTION' || tok.type === 'KEYWORD') {
      const PRIM_STOP = new Set(['then', 'end', 'else', 'do', 'into', 'and', 'or', 
                                  'is', 'has', 'be', 'to', 'by', 'at', 'from', 'with', 'on', 'of', 'in', 'as',
                                  'times', 'seconds', 'while', 'for', 'if', 'repeat']);
      // Statement-starting actions that should not be consumed as variable name parts
      const STMT_ACTIONS = new Set([
        'let', 'set', 'increase', 'decrease', 'move', 'play', 'stop', 'spawn',
        'destroy', 'show', 'hide', 'print', 'wait', 'call', 'emit', 'teleport',
        'freeze', 'unfreeze', 'apply', 'define', 'say', 'choice', 'battle',
        'attack', 'add', 'remove', 'toggle', 'load', 'win', 'lose', 'restart',
        'save', 'give', 'take', 'turn', 'open', 'shake', 'flash', 'tint', 'equip',
        'heal', 'grant', 'recover', 'change', 'learn', 'forget', 'delete', 'deal',
        'restore', 'drain', 'append', 'fetch', 'post', 'parse', 'stringify',
        'read', 'write', 'split', 'replace', 'convert', 'sort', 'reverse', 'filter',
        'merge', 'flatten', 'get', 'find', 'clamp', 'log', 'exit', 'run', 'create',
        'transform', 'reduce', 'copy', 'assign', 'match', 'return', 'check',
      ]);
      const SKIP_ARTICLES = new Set(['the', 'a', 'an', 'this', 'that']);
      const words = [];
      while (this.pos < this.tokens.length) {
        const t = this._peek();
        if (!t) break;
        if (t.type === 'OPERATOR' || t.type === 'COMPARISON' || t.type === 'ASSIGN') break;
        if (t.type === 'NUMBER' || t.type === 'STRING' || t.type === 'BOOLEAN') break;
        if (PRIM_STOP.has(t.value)) break;
        if (t.type === 'KEYWORD') break; // Stop on ANY keyword
        // Stop on statement-starting actions (but not after collecting at least one word if that word isn't an action)
        if (words.length > 0 && t.type === 'ACTION' && STMT_ACTIONS.has(t.value)) break;
        if (t.type !== 'IDENT' && t.type !== 'PREP' && t.type !== 'ACTION') break;
        // Skip leading articles only if next is another word
        if (words.length === 0 && SKIP_ARTICLES.has(t.value)) {
          const nx = this._peek(1);
          if (nx && !PRIM_STOP.has(nx.value) && nx.type !== 'OPERATOR' && nx.type !== 'COMPARISON' && nx.type !== 'NUMBER' && !(nx.type === 'ACTION' && STMT_ACTIONS.has(nx.value))) {
            this._next();
            continue;
          }
        }
        words.push(t.value);
        this._next();
      }
      if (words.length === 0) throw new Error('HLParser: expected value');
      return { type: 'ident', value: words.join('_') };
    }
    throw new Error(`HLParser: unexpected token "${tok.value}" (${tok.type}) when expecting a value`);
  }

  _parseFuncExpr(fn) {
    switch (fn) {
      // ─ Math unary
      case 'round': case 'floor': case 'ceil': case 'abs': case 'sqrt': case 'sign': case 'log':
        return { type: 'funcExpr', fn, args: [this._parsePrimary()] };

      case 'length': case 'count':
        if (this._is('of')) this._next();
        return { type: 'funcExpr', fn, args: [this._parsePrimary()] };

      case 'power': {
        const base = this._parsePrimary();
        if (this._is('to') || this._is('by')) this._next();
        return { type: 'funcExpr', fn, args: [base, this._parsePrimary()] };
      }
      case 'min': case 'max': {
        const a = this._parsePrimary();
        if (this._is('and') || this._is('or') || this._is('with')) this._next();
        return { type: 'funcExpr', fn, args: [a, this._parsePrimary()] };
      }
      case 'random': {
        const lo = this._parsePrimary();
        if (this._is('to') || this._is('and') || this._is('between')) this._next();
        return { type: 'funcExpr', fn, args: [lo, this._parsePrimary()] };
      }
      case 'clamp': {
        const val = this._parsePrimary();
        if (this._is('between') || this._is('from')) this._next();
        const lo = this._parsePrimary();
        if (this._is('and') || this._is('to')) this._next();
        return { type: 'funcExpr', fn, args: [val, lo, this._parsePrimary()] };
      }

      // ─ String/array unary
      case 'uppercase': case 'lowercase': case 'trim':
        return { type: 'funcExpr', fn, args: [this._parsePrimary()] };

      case 'join': {
        const a = this._parsePrimary();
        let sep = null;
        if (this._is('with')) { this._next(); sep = this._parsePrimary(); }
        const STOP = new Set(['then','end','do','times','else','and','or']);
        let b = null;
        if (this._peek() && !STOP.has(this._peek().value) &&
            (this._peek().type === 'STRING' || this._peek().type === 'IDENT' || this._peek().type === 'NUMBER')) {
          try { b = this._parsePrimary(); } catch(_) {}
        }
        if (sep && b) return { type: 'funcExpr', fn, args: [a, b, sep] };
        if (sep)      return { type: 'funcExpr', fn: 'arrayJoin', args: [a, sep] };
        if (b)        return { type: 'funcExpr', fn, args: [a, b] };
        return { type: 'funcExpr', fn, args: [a] };
      }
      case 'split': {
        const str = this._parsePrimary();
        let sep = { type: 'string', value: ' ' };
        if (this._is('by') || this._is('on') || this._is('with')) { this._next(); sep = this._parsePrimary(); }
        return { type: 'funcExpr', fn, args: [str, sep] };
      }

      // ─ type of value
      case 'type': {
        if (this._is('of')) this._next();
        return { type: 'funcExpr', fn: 'typeOf', args: [this._parsePrimary()] };
      }

      // ─ index of value in array
      case 'index': {
        if (this._is('of')) this._next();
        const needle = this._parsePrimary();
        if (this._is('in')) this._next();
        return { type: 'funcExpr', fn: 'indexOf', args: [needle, this._parsePrimary()] };
      }

      // ─ slice array from N to M
      case 'slice': {
        const src = this._parsePrimary();
        if (this._is('from')) this._next();
        const start = this._parsePrimary();
        if (this._is('to') || this._is('until')) this._next();
        return { type: 'funcExpr', fn: 'slice', args: [src, start, this._parsePrimary()] };
      }

      case 'array': {
        const vals = [];
        const VALUE_ACTIONS = new Set([
          'round','floor','ceil','abs','sqrt','power','min','max','random','sign','log','clamp',
          'uppercase','lowercase','trim','length','count','join','split',
        ]);
        const PREP_STOP = new Set(['into','to','by','at','from','with','on','of','in','as','then','end','do','times','else','any','every','each']);
        while (this.pos < this.tokens.length) {
          const t = this._peek();
          if (!t) break;
          if (t.type === 'KEYWORD') break;
          if (t.type === 'ACTION' && !VALUE_ACTIONS.has(t.value)) break;
          if (t.type === 'PREP' && PREP_STOP.has(t.value)) break;
          try { vals.push(this._parsePrimary()); } catch(_) { break; }
        }
        return { type: 'funcExpr', fn: 'array', args: vals };
      }

      case 'object': {
        const ovals = [];
        const OSTOP = new Set(['into','to','then','end','do','else','any','every','each']);
        while (this.pos < this.tokens.length) {
          const t = this._peek();
          if (!t) break;
          if (t.type === 'KEYWORD' && t.value !== 'and') break;
          if (t.type === 'ACTION' && !['round','floor','ceil','abs','sqrt','power','min','max','random','sign','log','clamp','uppercase','lowercase','trim','length','count'].includes(t.value)) break;
          if (t.type === 'PREP' && OSTOP.has(t.value)) break;
          if (t.value === 'and') { this._next(); continue; }
          try { ovals.push(this._parsePrimary()); } catch(_) { break; }
        }
        return { type: 'funcExpr', fn: 'object', args: ovals };
      }

      // ─ includes/contains: check if array/string contains value
      case 'includes': {
        const haystack = this._parsePrimary();
        if (this._is('contains') || this._is('has') || this._is('with')) this._next();
        const needle = this._parsePrimary();
        return { type: 'funcExpr', fn: 'includes', args: [haystack, needle] };
      }

      // ─ findItem: find first item matching condition in array
      case 'findItem': {
        if (this._is('in')) this._next();
        const arr = this._parsePrimary();
        if (this._is('where') || this._is('matching') || this._is('with')) this._next();
        const val = this._parsePrimary();
        return { type: 'funcExpr', fn: 'find', args: [arr, val] };
      }

      // ─ findIndex: find index of first matching item
      case 'findIndex': {
        if (this._is('in')) this._next();
        const arr = this._parsePrimary();
        if (this._is('where') || this._is('matching') || this._is('of')) this._next();
        const val = this._parsePrimary();
        return { type: 'funcExpr', fn: 'findIndex', args: [arr, val] };
      }

      // ─ startsWith: check if string starts with value
      case 'startsWith': {
        const str = this._parsePrimary();
        if (this._is('with')) this._next();
        const prefix = this._parsePrimary();
        return { type: 'funcExpr', fn: 'startsWith', args: [str, prefix] };
      }

      // ─ endsWith: check if string ends with value
      case 'endsWith': {
        const str = this._parsePrimary();
        if (this._is('with')) this._next();
        const suffix = this._parsePrimary();
        return { type: 'funcExpr', fn: 'endsWith', args: [str, suffix] };
      }

      default:
        return { type: 'funcExpr', fn, args: [] };
    }
  }

  _parseValue() {
    let left = this._parsePrimary();
    // Handle both OPERATOR tokens (+, -, *, /) and English math keywords (plus, minus, times, divided)
    const MATH_WORDS = { 'plus': '+', 'minus': '-', 'times': '*', 'multiplied': '*', 'divided': '/' };
    while (true) {
      if (this._isType('OPERATOR')) {
        const op = this._next().value;
        left = { type: 'math', op, left, right: this._parsePrimary() };
      } else if (this._peek() && MATH_WORDS[this._peek().value]) {
        const word = this._next().value;
        if (word === 'multiplied' && this._is('by')) this._next(); // "multiplied by"
        if (word === 'divided' && this._is('by')) this._next(); // "divided by"
        const op = MATH_WORDS[word];
        left = { type: 'math', op, left, right: this._parsePrimary() };
      } else {
        break;
      }
    }
    return left;
  }

  _parseBody(stopTokens) {
    const statements = [];
    while (this.pos < this.tokens.length) {
      const tok = this._peek();
      if (!tok || stopTokens.includes(tok.value)) break;
      try { const stmt = this._parseStatement(); if (stmt) statements.push(stmt); }
      catch (e) { console.warn('[HLParser] Statement error:', e.message); this.pos++; }
    }
    return statements;
  }

  _parseStatement() {
    const tok = this._peek();
    if (!tok) return null;
    switch (tok.value) {
      case 'if':       return this._parseIf();
      case 'repeat':   return this._parseRepeat();
      case 'while':    return this._parseWhile();
      case 'let':      return this._parseLet();
      case 'set':      return this._parseSet();
      case 'increase': return this._parseModify('increase');
      case 'decrease': return this._parseModify('decrease');
      case 'move':     return this._parseMove();
      case 'teleport': return this._parseTeleport();
      case 'play':     return this._parsePlay();
      case 'stop':     return this._parseStop();
      case 'spawn':    return this._parseSpawn();
      case 'destroy':  return this._parseDestroy();
      case 'show':     return this._parseShowHide('show');
      case 'hide':     return this._parseShowHide('hide');
      case 'print':    return this._parsePrint();
      case 'wait':     return this._parseWait();
      case 'call':     return this._parseCall();
      case 'emit':     return this._parseEmit();
      case 'freeze':   return this._parseFreezeUnfreeze('freeze');
      case 'unfreeze': return this._parseFreezeUnfreeze('unfreeze');
      case 'apply':    return this._parseApply();
      case 'define':   return this._parseDefine();
      case 'say':      return this._parseSay();
      case 'choice':   return this._parseChoice();
      case 'battle':   return this._parseBattle();
      case 'attack':   return this._parseAttack();
      case 'add':      return this._parseAdd();
      case 'give':     return this._parseGive();
      case 'remove':   return this._parseRemove();
      case 'take':     return this._parseRemoveItem();
      case 'toggle':   return this._parseToggle();
      case 'load':     return this._parseLoad();
      case 'save':     return this._parseSave();
      case 'turn':     return this._parseTurn();
      case 'open':     return this._parseOpen();
      case 'shake':    return this._parseScreenFx('shake');
      case 'flash':    return this._parseScreenFx('flash');
      case 'tint':     return this._parseScreenFx('tint');
      case 'equip':    return this._parseEquip();
      case 'heal':     return this._parseHeal();
      case 'grant':    return this._parseGrant();
      case 'recover':  return this._parseRecover();
      case 'change':   return this._parseChange();
      case 'learn':    return this._parseLearn();
      case 'forget':   return this._parseForget();
      case 'delete':   return this._parseDelete();
      case 'win':      { this._next(); if (this._is('game')) this._next(); return { type: 'winGame' }; }
      case 'lose':     { this._next(); if (this._is('game')) this._next(); return { type: 'loseGame' }; }
      case 'restart':  { this._next(); if (this._is('game')) this._next(); return { type: 'restartGame' }; }
      // JS/Node.js features
      case 'for':       return this._parseForEach();
      case 'append':    return this._parseAppend();
      case 'fetch':     return this._parseFetch();
      case 'post':      return this._parsePost();
      case 'parse':     return this._parseParseJson();
      case 'stringify': return this._parseStringify();
      case 'read':      return this._parseReadFile();
      case 'write':     return this._parseWriteFile();
      case 'split':     return this._parseSplitStmt();
      case 'replace':   return this._parseReplaceStmt();
      case 'convert':   return this._parseConvert();
      case 'break':     { this._next(); return { type: 'break' }; }
      case 'skip':      { this._next(); return { type: 'skip' };  }
      case 'return':    return this._parseReturn();
      case 'try':       return this._parseTryCatch();
      // extended JS/Node.js
      case 'sort':    return this._parseSort();
      case 'reverse': return this._parseReverse();
      case 'filter':  return this._parseFilter();
      case 'merge':   return this._parseMerge();
      case 'flatten': return this._parseFlatten();
      case 'find':    return this._parseFindStmt();
      case 'get':     return this._parseGetStmt();
      case 'slice':   return this._parseSliceStmt();
      case 'char':    return this._parseCharAt();
      case 'pad':     return this._parsePadStmt();
      case 'clamp':   return this._parseClampStmt();
      case 'keys':
      case 'values':  return this._parseKeysValues();
      case 'exit':    return this._parseExitStmt();
      case 'run':     return this._parseRunCommand();
      case 'list':    return this._parseListFiles();
      case 'file':    return this._parseFileExists();
      case 'type':    return this._parseTypeOf();
      case 'index':   return this._parseIndexOfStmt();
      // full JS features
      case 'match':     return this._parseMatch();
      case 'transform': return this._parseTransform();
      case 'reduce':    return this._parseReduce();
      case 'every':     return this._parseEveryAny();
      case 'any':       return this._parseEveryAny();
      case 'copy':      return this._parseCopyObj();
      case 'assign':    return this._parseAssignObjs();
      case 'log':       return this._parseLogStmt();
      // path ops
      case 'join':
      case 'basename':
      case 'dirname':
      case 'extension':
      case 'extname':   return this._parsePathOp();
      // server ops - English syntax
      case 'start':     if (this._peek(1)?.value === 'server' || this._peek(1)?.value === 'a' || this._peek(1)?.value === 'the') return this._parseStartServer(); return null;
      case 'create':    
        if (this._peek(1)?.value === 'server' || this._peek(1)?.value === 'a' || this._peek(1)?.value === 'the') return this._parseCreateServer(); 
        if (this._peek(1)?.value === 'map') return this._parseCreateMap();
        if (this._peek(1)?.value === 'set') return this._parseCreateSet();
        return this._parseCreateFolder();
      case 'send':      if (this._peek(1)?.value === 'response' || this._peek(1)?.value === 'a' || this._peek(1)?.value === 'the' || this._peek(1)?.value === 'file' || this._peek(1)?.value === 'html' || this._peek(1)?.value === 'css') return this._parseSendResponse(); return null;
      case 'when':      if (this._peek(1)?.value === 'receiving' || this._peek(1)?.value === 'the' || this._peek(1)?.value === 'server') return this._parseWhenReceiving(); return null;
      // legacy server ops
      case 'serve':     if (this._peek(1)?.value === 'file' || this._peek(1)?.value === 'the') return this._parseServeFile(); return this._parseServe();
      case 'route':     return this._parseRoute();
      case 'respond':   return this._parseRespond();
      case 'end':
        if (this._peek(1)?.value === 'battle') { this._next(); this._next(); return { type: 'endBattle' }; }
        if (this._peek(1)?.value === 'game')   { this._next(); this._next(); return { type: 'endGame' }; }
        return null;
      // ═══════════════════════════════════════════════════════════════════════
      // NEW FEATURES: Classes, Modules, Async, Regex, WebSockets, Database
      // ═══════════════════════════════════════════════════════════════════════
      // Classes/OOP
      case 'class':     return this._parseClass();
      case 'new':       return this._parseNewInstance();
      // Modules
      case 'import':    return this._parseImport();
      case 'export':    return this._parseExport();
      // Error handling
      case 'throw':     return this._parseThrow();
      case 'raise':     return this._parseThrow();
      // Regex
      case 'regex':     return this._parseRegex();
      case 'test':      return this._parseRegexTest();
      case 'extract': {
        // Look ahead to determine if this is regex extract or destructuring
        // Regex: extract "pattern" from text
        // Destructuring: extract name and age from object
        const next = this._peek(1);
        if (next?.type === 'STRING' || next?.type === 'IDENT' && this._peek(2)?.value === 'from') {
          // Could be either - check if pattern looks like regex or ident list
          // If next token after 'extract' is a STRING (pattern), use regex
          if (next?.type === 'STRING') {
            return this._parseRegexExtract();
          }
          // Otherwise check if we have "name and name from" pattern for destructuring
          return this._parseExtract();
        }
        return this._parseExtract();
      }
      // Child processes
      case 'execute':   return this._parseExecuteCommand();
      case 'shell':     return this._parseShellCommand();
      // WebSockets
      case 'connect':   return this._parseConnectWebSocket();
      case 'broadcast': return this._parseBroadcast();
      // Database
      case 'query':     return this._parseQuery();
      case 'insert':    return this._parseInsert();
      case 'select':    return this._parseSelect();
      // Async/await
      case 'await':     return this._parseAwait();
      // Timers (setTimeout/setInterval)
      case 'after':     return this._parseAfter();
      case 'interval':  return this._parseInterval();
      // Check contains
      case 'check':     return this._parseCheck();
      // Lambda functions
      case 'lambda':    return this._parseLambda();
      // Spread
      case 'spread':    return this._parseSpread();
      // Crypto/hashing
      case 'hash':      return this._parseHash();
      case 'encrypt':   return this._parseEncrypt();
      case 'decode':    return this._parseDecode();
      case 'encode':    return this._parseEncode();
      // Buffer
      case 'buffer':    return this._parseBuffer();
      // Safe access (optional chaining + nullish coalescing)
      case 'safely':    return this._parseSafeGet();
      // Generators
      case 'generator': return this._parseGenerator();
      case 'yield':     return this._parseYield();
      case 'produce':   return this._parseYield();  // English alias for yield
      case 'emit':      return this._parseYield();  // English alias for yield
      // Proxies
      case 'proxy':     return this._parseProxy();
      case 'wrap':      return this._parseWrap();   // English alias for proxy
      case 'intercept': return this._parseIntercept();
      // WeakMap/WeakSet
      case 'weakmap':   return this._parseWeakMap();
      case 'weakset':   return this._parseWeakSet();
      // Symbol
      case 'symbol':    return this._parseSymbol();
      // BigInt
      case 'bigint':    return this._parseBigInt();
      // Tagged templates
      case 'tag':       return this._parseTaggedTemplate();
      case 'process':   return this._parseProcess();  // English alias for tag
      // Spread alternative
      case 'combine':   return this._parseCombine();  // English alias for spread
      // ═══════════════════════════════════════════════════════════════════════
      // PROMISE API
      // ═══════════════════════════════════════════════════════════════════════
      case 'promise':   return this._parsePromise();
      case 'all':       return this._parsePromiseAll();
      case 'race':      return this._parsePromiseRace();
      case 'parallel':  return this._parsePromiseAll();  // English alias
      case 'settle':    return this._parsePromiseAllSettled();
      // ═══════════════════════════════════════════════════════════════════════
      // OBJECT METHODS
      // ═══════════════════════════════════════════════════════════════════════
      case 'freezeobj': return this._parseFreezeObj();
      case 'sealobj':   return this._parseSealObj();
      case 'compare':   return this._parseObjectIs();
      case 'frompairs': return this._parseFromPairs();
      // ═══════════════════════════════════════════════════════════════════════
      // ARRAY METHODS
      // ═══════════════════════════════════════════════════════════════════════
      case 'arrayfrom': return this._parseArrayFrom();
      case 'isarray':   return this._parseIsArray();
      case 'flatmap':   return this._parseFlatMap();
      case 'fillarr':   return this._parseFillArray();
      // ═══════════════════════════════════════════════════════════════════════
      // DATE/TIME
      // ═══════════════════════════════════════════════════════════════════════
      case 'date':      return this._parseDate();
      case 'now':       return this._parseNow();
      case 'timestamp': return this._parseTimestamp();
      case 'toiso':     return this._parseToISO();
      // ═══════════════════════════════════════════════════════════════════════
      // TYPED ARRAYS
      // ═══════════════════════════════════════════════════════════════════════
      case 'uint8':     return this._parseTypedArray('Uint8Array');
      case 'int32':     return this._parseTypedArray('Int32Array');
      case 'float64':   return this._parseTypedArray('Float64Array');
      case 'arraybuffer': return this._parseArrayBuffer();
      case 'view':      return this._parseDataView();
      // ═══════════════════════════════════════════════════════════════════════
      // REFLECT API
      // ═══════════════════════════════════════════════════════════════════════
      case 'reflect':   return this._parseReflect();
      case 'reflectget': return this._parseReflectGet();
      case 'reflectset': return this._parseReflectSet();
      case 'reflecthas': return this._parseReflectHas();
      // ═══════════════════════════════════════════════════════════════════════
      // INTL FORMATTING
      // ═══════════════════════════════════════════════════════════════════════
      case 'formatdate': return this._parseFormatDate();
      case 'formatnumber': return this._parseFormatNumber();
      case 'currency':  return this._parseCurrency();
      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - Promise.any
      // ═══════════════════════════════════════════════════════════════════════
      case 'anyof':     return this._parsePromiseAny();
      case 'first':     return this._parsePromiseAny();  // alias
      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - Object methods
      // ═══════════════════════════════════════════════════════════════════════
      case 'defineprop': return this._parseDefineProperty();
      case 'getdescriptor': return this._parseGetDescriptor();
      case 'getprototype': return this._parseGetPrototype();
      case 'setprototype': return this._parseSetPrototype();
      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - Array methods
      // ═══════════════════════════════════════════════════════════════════════
      case 'reduceright': return this._parseReduceRight();
      case 'copywithin': return this._parseCopyWithin();
      case 'itemat':    return this._parseItemAt();
      case 'tosorted':  return this._parseToSorted();
      case 'toreversed': return this._parseToReversed();
      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - String methods
      // ═══════════════════════════════════════════════════════════════════════
      case 'replaceall': return this._parseReplaceAll();
      case 'charat':    return this._parseCharAtStmt();
      case 'normalize': return this._parseNormalize();
      case 'localecompare': return this._parseLocaleCompare();
      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - Number methods
      // ═══════════════════════════════════════════════════════════════════════
      case 'isinteger': return this._parseIsInteger();
      case 'isfinite':  return this._parseIsFinite();
      case 'isnan':     return this._parseIsNaN();
      case 'parsefloat': return this._parseParseFloat();
      case 'parseint':  return this._parseParseInt();
      case 'tofixed':   return this._parseToFixed();
      case 'toprecision': return this._parseToPrecision();
      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - Math methods
      // ═══════════════════════════════════════════════════════════════════════
      case 'trunc':     return this._parseTrunc();
      case 'cbrt':      return this._parseCbrt();
      case 'hypot':     return this._parseHypot();
      case 'log2':      return this._parseLog2();
      case 'log10':     return this._parseLog10();
      case 'sinh':      return this._parseSinh();
      case 'cosh':      return this._parseCosh();
      case 'tanh':      return this._parseTanh();
      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - URL
      // ═══════════════════════════════════════════════════════════════════════
      case 'url':       return this._parseURL();
      case 'searchparams': return this._parseSearchParams();
      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - Console
      // ═══════════════════════════════════════════════════════════════════════
      case 'table':     return this._parseConsoleTable();
      case 'group':     return this._parseConsoleGroup();
      case 'groupend':  return this._parseConsoleGroupEnd();
      case 'timestart': return this._parseConsoleTime();
      case 'timeend':   return this._parseConsoleTimeEnd();
      case 'assert':    return this._parseConsoleAssert();
      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - Misc
      // ═══════════════════════════════════════════════════════════════════════
      case 'clone':     return this._parseClone();
      case 'microtask': return this._parseMicrotask();
      case 'abort':     return this._parseAbort();
      case 'textencode': return this._parseTextEncode();
      case 'textdecode': return this._parseTextDecode();
      default: this._next(); return null;
    }
  }

  _parseIf() {
    this._consume('if');
    const condition = this._parseCondition();
    if (this._is('then')) this._consume('then'); // 'then' is optional
    const consequent = this._parseBody(['else', 'end']);
    let alternate = [];
    if (this._is('else')) {
      this._consume('else');
      if (this._is('if')) { alternate = [this._parseIf()]; }
      else { alternate = this._parseBody(['end']); if (this._is('end')) this._consume('end'); }
    } else if (this._is('end')) { this._consume('end'); }
    return { type: 'if', condition, consequent, alternate };
  }

  _parseRepeat() {
    // Peek: if next token (after 'repeat') is a STRING or non-NUMBER IDENT that
    // has an 'into' somewhere before 'end', treat as string-repeat statement.
    // Simple heuristic: first token is STRING → string repeat.
    if (this._peek(1)?.type === 'STRING') {
      return this._parseRepeatStr();
    }
    this._consume('repeat');
    // Use _parsePrimary to avoid consuming 'times' as math operator
    const count = this._parsePrimary();
    if (this._is('times')) this._consume('times');
    const body = this._parseBody(['end']);
    if (this._is('end')) this._consume('end');
    return { type: 'repeat', count, body };
  }

  _parseWhile() {
    this._consume('while');
    const condition = this._parseCondition();
    if (this._is('do')) this._consume('do');
    const body = this._parseBody(['end']);
    if (this._is('end')) this._consume('end');
    return { type: 'while', condition, body };
  }

  _parseCondition() {
    let left = this._parseSingleCondition();
    while (this._is('and') || this._is('or')) {
      const op = this._next().value;
      left = { type: 'logical', op, left, right: this._parseSingleCondition() };
    }
    return left;
  }

  _parseSingleCondition() {
    if (this._is('not')) { this._next(); return { type: 'not', condition: this._parseSingleCondition() }; }

    // Handle bare boolean literals: if true then / if false then
    if (this._isType('BOOLEAN')) {
      const val = this._next().value;
      return { type: 'booleanLiteral', value: val === true || val === 'true' };
    }

    // Handle numeric/string comparisons: if 10 is greater than 5 then
    if (this._isType('NUMBER') || this._isType('STRING')) {
      const left = this._parseValue();
      if (this._is('is')) this._next();
      return { type: 'valueComparison', left, comparison: this._parseComparison() };
    }

    if (this._is('switch')) {
      this._next();
      const id = this._parseValue();
      if (this._is('is')) this._next();
      return { type: 'switchCond', id, on: this._consumeIdent() === 'on' };
    }

    if (this._is('choice')) {
      this._next();
      if (this._is('is')) this._next();
      return { type: 'choiceIs', value: this._parseValue() };
    }

    if (this._is('has') && this._peek(1)?.value === 'item') {
      this._next(); this._next();
      return { type: 'hasItem', itemId: this._consumeIdentOrString() };
    }

    if ((this._peek()?.value === 'player' || this._peek()?.value === 'enemy') && this._peek(1)?.value === 'has') {
      const entity = this._next().value;
      this._next();
      return { type: 'hasStatus', entity, effect: this._consumeIdentOrString() };
    }

    // Use multi-word name for subject
    const COND_STOP = new Set(['is', 'has', 'contains', 'starts', 'ends', 'equals', 'equal']);
    const subject = this._consumeMultiWordName(COND_STOP);
    const nx = this._peek();

    // "X contains Y" — string/array membership check
    if (nx?.value === 'contains') {
      this._next();
      return { type: 'contains', subject, value: this._parseValue() };
    }

    // "X starts with Y" / "X ends with Y"
    if (nx?.value === 'starts') {
      this._next();
      if (this._is('with')) this._next();
      return { type: 'startsWith', subject, value: this._parseValue() };
    }
    if (nx?.value === 'ends') {
      this._next();
      if (this._is('with')) this._next();
      return { type: 'endsWith', subject, value: this._parseValue() };
    }

    // "X has key "foo""  — object key check
    if (nx?.value === 'has' && this._peek(1)?.value === 'key') {
      this._next(); this._next();
      return { type: 'hasKey', subject, key: this._parseValue() };
    }

    // "X is a number" / "X is an array" / "X is text" / "X is a boolean"
    if ((nx?.value === 'is') && (this._peek(1)?.value === 'a' || this._peek(1)?.value === 'an' ||
        this._peek(1)?.value === 'number' || this._peek(1)?.value === 'text' ||
        this._peek(1)?.value === 'array'  || this._peek(1)?.value === 'object' ||
        this._peek(1)?.value === 'boolean'|| this._peek(1)?.value === 'integer')) {
      this._next(); // consume 'is'
      if (this._is('a') || this._is('an')) this._next(); // consume 'a'/'an'
      const typeName = this._consumeIdent();
      return { type: 'typeCheck', subject, typeName };
    }

    const _p1type = this._peek(1)?.type;
    const _p1val  = this._peek(1)?.value;
    const isVarCond = !nx ||
      nx.type === 'COMPARISON' || nx.value === 'equals' ||
      (nx.value === 'is' && (_p1type === 'COMPARISON' || _p1type === 'NUMBER' || _p1type === 'STRING' || _p1type === 'BOOLEAN' || _p1type === 'NULL' || _p1val === 'not' || _p1val === 'empty' || _p1val === 'exists' || _p1val === 'nothing')) ||
      (nx.value === 'has' && _p1val !== 'item') ||
      nx.value === 'empty' || nx.value === 'exists' || nx.value === 'nothing' || nx.type === 'NULL';

    if (isVarCond) {
      if (this._is('is') || this._is('has') || this._is('equals')) this._next();
      return { type: 'varCondition', name: subject, comparison: this._parseComparison() };
    }

    const prop = this._consumeIdent();
    if (this._is('is') || this._is('has')) this._next();
    return { type: 'condition', subject, prop, comparison: this._parseComparison() };
  }

  _parseLet() {
    this._consume('let');
    const STOP = new Set(['be', 'to', 'equal', 'equals']);
    const name = this._consumeMultiWordName(STOP);
    if (this._isType('ASSIGN') || this._is('to') || this._is('be') || this._is('equal') || this._is('equals')) this._next();
    return { type: 'letVar', name, value: this._parseValue() };
  }

  _parseSet() {
    this._consume('set');
    if (this._is('volume')) { this._next(); if (this._is('to')) this._next(); return { type: 'setVolume', value: this._parseValue() }; }
    if (this._is('music') && this._peek(1)?.value === 'volume') { this._next(); this._next(); if (this._is('to')) this._next(); return { type: 'setVolume', value: this._parseValue() }; }
    if (this._is('formula')) { this._next(); const k = this._consumeIdentOrString(); if (this._is('to')) this._next(); return { type: 'setFormula', key: k, expr: this._parseValue() }; }
    if (this._is('tile'))    { this._next(); const tileId = this._parseValue(); if (this._is('as')) this._next(); if (this._is('autotile')) this._next(); return { type: 'setAutotile', tileId, tileName: this._parseValue() }; }
    if (this._is('zone'))    { this._next(); if (this._is('to')) this._next(); return { type: 'setZone', zoneName: this._parseValue() }; }
    // set key "k" in/of obj to val
    if (this._is('key')) {
      this._next();
      const key = this._parseValue();
      if (this._is('in') || this._is('of')) this._next();
      const obj = this._consumeIdent();
      if (this._is('to') || this._is('be')) this._next();
      return { type: 'setObjKey', obj, key, value: this._parseValue() };
    }
    // set index N in arr to val
    if (this._is('index')) {
      this._next();
      const idx = this._parseValue();
      if (this._is('in')) this._next();
      const arr = this._consumeIdent();
      if (this._is('to') || this._is('be')) this._next();
      return { type: 'setArrIndex', arr, index: idx, value: this._parseValue() };
    }
    const STOP = new Set(['to', 'be', 'equal', 'equals']);
    const name = this._consumeMultiWordName(STOP);
    if (this._is('to') || this._is('be') || this._isType('ASSIGN')) this._next();
    return { type: 'setVar', name, value: this._parseValue() };
  }

  _parseModify(op) {
    this._consume(op);
    const STOP = new Set(['by']);
    const name = this._consumeMultiWordName(STOP);
    if (this._is('by')) this._next();
    return { type: op + 'Var', name, value: this._parseValue() };
  }

  _parseMove() {
    this._consume('move');
    const entity = this._consumeIdent();
    let relative = true;
    if (this._is('by')) { this._next(); relative = true; }
    else if (this._is('to')) { this._next(); relative = false; }
    return { type: 'move', entity, x: this._parseValue(), y: this._parseValue(), relative };
  }

  _parseTeleport() {
    this._consume('teleport');
    const entity = this._consumeIdent();
    if (this._is('to')) this._next();
    return { type: 'teleport', entity, x: this._parseValue(), y: this._parseValue() };
  }

  _parsePlay() {
    this._consume('play');
    let loop = false;
    if (this._is('looping')) { this._next(); loop = true; }
    const kind = this._consumeIdent();
    if (kind === 'animation') {
      const name = this._consumeIdentOrString();
      if (this._is('on')) this._next();
      return { type: 'play', kind, entity: this._consumeIdent(), name: { type: 'string', value: name } };
    }
    return { type: 'play', kind, name: { type: 'string', value: this._consumeIdentOrString() }, loop };
  }

  _parseStop() {
    this._consume('stop');
    const tok = this._peek();
    let kind = 'sound', name = null, entity = null;
    if (tok?.type === 'IDENT' || tok?.type === 'PREP') {
      kind = this._consumeIdent();
      if (kind === 'all') { if (this._is('sounds') || this._is('music') || this._is('sound')) this._next(); return { type: 'stop', kind: 'all' }; }
      if (kind === 'animation') { if (this._is('on')) this._next(); if (this._isType('IDENT') || this._isType('STRING')) entity = this._consumeIdent(); }
      else if (this._isType('IDENT') || this._isType('STRING')) name = this._parseValue();
    }
    return { type: 'stop', kind, name, entity };
  }

  _parseSpawn() {
    this._consume('spawn');
    const entity = this._consumeIdent();
    if (this._is('at')) this._next();
    const useTile = this._is('tile') ? (this._next(), true) : false;
    return { type: 'spawn', entity, x: this._parseValue(), y: this._parseValue(), useTile };
  }

  _parseDestroy()           { this._consume('destroy');    return { type: 'destroy',   entity: this._consumeIdent() }; }
  _parseShowHide(op)        { this._consume(op);           return { type: op,          entity: this._consumeIdent() }; }
  _parsePrint()             { this._consume('print');      return { type: 'print',     message: this._parseValue() }; }
  _parseFreezeUnfreeze(op)  { this._consume(op);           return { type: op,          entity: this._consumeIdent() }; }

  _parseWait() {
    this._consume('wait');
    const duration = this._parseValue();
    if (this._is('seconds')) this._next();
    return { type: 'wait', duration };
  }

  _parseCall() {
    this._consume('call');
    // call function "name" with args into result
    if (this._is('function')) {
      return this._parseCallFunction();
    }
    // call event "name"  — runs a define event body
    if (this._is('event')) {
      this._next();
      return { type: 'callEvent', id: this._consumeIdentOrString() };
    }
    const fn = this._consumeIdent();
    const args = [];
    if (this._is('with')) {
      this._next();
      while (this.pos < this.tokens.length) {
        const tok = this._peek();
        if (!tok || this._is('into')) break;
        // Skip 'and' between arguments
        if (this._is('and') || this._is(',')) { this._next(); continue; }
        // Stop on other keywords that aren't valid values
        if (tok.type === 'KEYWORD' && tok.value !== 'true' && tok.value !== 'false' && tok.value !== 'null' && tok.value !== 'nothing') break;
        try { args.push(this._parseValue()); } catch { break; }
      }
    }
    let out = null;
    if (this._is('into')) {
      this._next();
      out = this._consumeIdent();
    }
    return { type: 'call', fn, args, out };
  }

  _parseEmit() {
    this._consume('emit');
    const event = this._consumeIdentOrString();
    let entity = null;
    if (this._is('on') || this._is('from')) { this._next(); entity = this._consumeIdent(); }
    return { type: 'emit', event, entity };
  }

  _parseApply() {
    this._consume('apply');
    const kind = this._consumeIdent();
    if (kind === 'impulse' || kind === 'force') {
      const entity = this._consumeIdent();
      return { type: 'apply', kind, entity, x: this._parseValue(), y: this._parseValue() };
    }
    if (this._is('to')) this._next();
    const target = this._consumeIdent();
    let duration = { type: 'number', value: 3 };
    if (this._is('for')) { this._next(); duration = this._parseValue(); if (this._is('turns') || this._is('turn')) this._next(); }
    return { type: 'applyStatus', effect: kind, target, duration };
  }

  _parseDefine() {
    this._consume('define');
    const kind = this._consumeIdent();

    // ── OOP class definition ──
    // define class "ClassName" with prop1 and prop2 ... end
    // define class "Child" extends "Parent" ... end
    if (kind === 'class') {
      const className = this._consumeIdentOrString();
      let parentClass = null;
      
      // extends "ParentClass"
      if (this._is('extends') || this._is('inherits')) {
        this._next();
        parentClass = this._consumeIdentOrString();
      }
      
      // Parse properties (with prop1 and prop2...)
      const properties = [];
      if (this._is('with')) {
        this._next();
        while (this._peek() && !this._is('then') && !this._is('do') && !this._is('end') && !this._is('define')) {
          if (this._is('and') || this._is(',')) { this._next(); continue; }
          if (this._peek()?.value === 'define' || this._peek()?.value === 'method') break;
          properties.push(this._consumeMultiWordName(new Set(['and', 'then', 'do', 'end', ',', 'define', 'method'])));
        }
      }
      
      if (this._is('then') || this._is('do')) this._next();
      
      // Parse methods
      const methods = [];
      while (this._peek() && !this._is('end')) {
        if (this._is('define')) {
          this._next();
          if (this._is('method')) {
            this._next();
            const methodName = this._consumeIdentOrString();
            const params = [];
            if (this._is('with')) {
              this._next();
              if (!this._is('no')) {
                while (this._peek() && !this._is('then') && !this._is('do') && !this._is('end')) {
                  if (this._is('and') || this._is(',')) { this._next(); continue; }
                  if (this._is('arguments') || this._is('params')) { this._next(); continue; }
                  params.push(this._consumeMultiWordName(new Set(['and', 'then', 'do', 'end', ','])));
                }
              } else {
                this._next(); // skip 'no'
                if (this._is('arguments') || this._is('params')) this._next();
              }
            }
            if (this._is('then') || this._is('do')) this._next();
            const body = this._parseBody(['end']);
            if (this._is('end')) this._consume('end');
            methods.push({ name: methodName, params, body });
          } else if (this._is('constructor')) {
            this._next();
            const params = [];
            if (this._is('with')) {
              this._next();
              while (this._peek() && !this._is('then') && !this._is('do') && !this._is('end')) {
                if (this._is('and') || this._is(',')) { this._next(); continue; }
                params.push(this._consumeMultiWordName(new Set(['and', 'then', 'do', 'end', ','])));
              }
            }
            if (this._is('then') || this._is('do')) this._next();
            const body = this._parseBody(['end']);
            if (this._is('end')) this._consume('end');
            methods.push({ name: 'constructor', params, body, isConstructor: true });
          } else {
            // Unknown define inside class, skip
            this._next();
          }
        } else {
          this._next();
        }
      }
      if (this._is('end')) this._consume('end');
      
      return { type: 'defineClass', className, parentClass, properties, methods };
    }

    if (['enemy','item','skill','actor','event','zone','status','map'].includes(kind)) {
      return this._parseDefineData(kind);
    }

    // define function "name" with a and b ... end
    if (kind === 'function') {
      const id = this._consumeIdentOrString();
      const params = [];
      if (this._is('with') || this._is('params') || this._is('param')) {
        this._next();
        const PARAM_STOP = new Set(['and', 'then', 'do']);
        while (this._peek() && !this._is('then') && !this._is('do') &&
               (this._peek().type === 'IDENT' || this._peek().type === 'PREP' || this._peek().type === 'ACTION')) {
          params.push(this._consumeMultiWordName(PARAM_STOP));
          if (this._is('and') || this._is(',')) this._next(); else break;
        }
      }
      if (this._is('then') || this._is('do')) this._next();
      const body = this._parseBody(['end']);
      if (this._is('end')) this._consume('end');
      return { type: 'defineFunction', id, params, body };
    }

    // define lambda double with x as x times 2
    if (kind === 'lambda' || kind === 'arrow') {
      const name = this._consumeIdent();
      const params = [];
      if (this._is('with')) {
        this._next();
        while (this._peek() && !this._is('as') && !this._is('do') && !this._is('then')) {
          params.push(this._consumeIdent());
          if (this._is('and') || this._is(',')) this._next(); else break;
        }
      }
      if (this._is('as') || this._is('do') || this._is('then')) this._next();
      const expr = this._parseValue();
      return { type: 'defineLambda', name, params, expr };
    }

    if (kind === 'sprite') {
      const entity = this._consumeIdent();
      return { type: 'define', kind: 'sprite', entity, src: this._parseValue(), fw: this._parseValue(), fh: this._parseValue() };
    }

    if (kind === 'animation') {
      const entity = this._consumeIdent();
      const name = this._parseValue();
      if (this._is('frames')) this._next();
      const frames = [];
      while (this._isType('NUMBER')) frames.push(this._next().value);
      if (this._is('fps')) this._next();
      const fps = this._parseValue();
      let loop = { type: 'boolean', value: true };
      if (this._is('loop')) { this._next(); loop = this._parseValue(); }
      return { type: 'define', kind: 'animation', entity, name, frames, fps, loop };
    }
    return null;
  }

  _parseDefineData(kind) {
    const id = this._consumeIdentOrString();

    if (kind === 'event') {
      const body = this._parseBody(['end']);
      if (this._is('end')) this._consume('end');
      return { type: 'defineEvent', id, body };
    }

    if (kind === 'zone') {
      const entries = [];
      while (this.pos < this.tokens.length && !this._is('end') && !this._is('when') && !this._is('define')) {
        const enemyId = this._consumeIdentOrString();
        let weight = 1;
        if (this._is('at') || this._is('weight')) { this._next(); weight = Number(this._resolveNodeValue(this._parseValue())); }
        entries.push({ id: enemyId, weight });
      }
      if (this._is('end')) this._consume('end');
      return { type: 'defineZone', id, entries };
    }

    if (kind === 'status') {
      const props = {}, turnOps = [];
      const SSTOP = new Set(['end','when','define']);
      while (this.pos < this.tokens.length) {
        const tok = this._peek();
        if (!tok || SSTOP.has(tok.value)) break;
        const key = this._consumeIdentOrString();
        if (key === 'each') {
          if (this._is('turn')) this._next();
          while (this.pos < this.tokens.length && !this._is('end') && !this._is('when') && !this._is('define')) {
            const op = this._parseTurnOp();
            if (op) turnOps.push(op);
          }
          if (this._is('end')) this._consume('end');
          continue;
        }
        props[key] = this._resolveNodeValue(this._parseValue());
      }
      if (this._is('end')) this._consume('end');
      return { type: 'defineStatus', id, props, turnOps };
    }

    const props = {};
    const STOP = new Set(['end','when','define']);
    while (this.pos < this.tokens.length) {
      const tok = this._peek();
      if (!tok || STOP.has(tok.value)) break;
      const key = this._consumeIdentOrString();
      if (key === 'drops') {
        props.drops = props.drops || [];
        const itemId = this._consumeIdentOrString();
        let rate = 0.1;
        if (this._is('at') || this._is('rate')) { this._next(); rate = Number(this._resolveNodeValue(this._parseValue())); }
        props.drops.push({ id: itemId, rate });
        continue;
      }
      if (key === 'skills') {
        props.skills = props.skills || [];
        while (this._isType('STRING') || (this._isType('IDENT') && !STOP.has(this._peek()?.value))) {
          const chk = this._peek()?.value || '';
          if (STOP.has(chk) || !chk) break;
          props.skills.push(this._consumeIdentOrString());
          if (!this._isType('STRING') && !this._isType('IDENT')) break;
        }
        continue;
      }
      if (key === 'initStats' || key === 'growth') {
        const sub = {};
        const knownStats = new Set(['atk','matk','def','mdef','spd','luk','maxHp','maxMp','maxTp','hp','mp']);
        while (this._isType('IDENT') && knownStats.has(this._peek()?.value)) {
          const sk = this._consumeIdent();
          sub[sk] = Number(this._resolveNodeValue(this._parseValue()));
        }
        props[key] = sub;
        continue;
      }
      props[key] = this._resolveNodeValue(this._parseValue());
    }
    if (this._is('end')) this._consume('end');
    return { type: 'defineData', kind, id, props };
  }

  _resolveNodeValue(node) {
    if (!node) return undefined;
    if (node.type === 'number' || node.type === 'boolean') return node.value;
    if (node.type === 'string' || node.type === 'ident') return node.value;
    if (node.type === 'math') {
      const l = this._resolveNodeValue(node.left);
      const r = this._resolveNodeValue(node.right);
      switch (node.op) {
        case '+': return Number(l) + Number(r);
        case '-': return Number(l) - Number(r);
        case '*': return Number(l) * Number(r);
        case '/': return Number(r) !== 0 ? Number(l) / Number(r) : 0;
      }
    }
    return node.value;
  }

  _parseTurnOp() {
    const tok = this._peek();
    if (!tok || tok.value === 'end' || tok.value === 'when' || tok.value === 'define') return null;
    const action = this._consumeIdent();
    if (action === 'deal') {
      const amtNode = this._parseValue();
      let pct = false;
      if (this._is('percent')) { this._next(); pct = true; }
      if (this._is('damage') || this._is('hp')) this._next();
      return { op: pct ? 'dealPercent' : 'dealFlat', amount: this._resolveNodeValue(amtNode) };
    }
    if (action === 'restore') {
      const amtNode = this._parseValue();
      let pct = false;
      if (this._is('percent')) { this._next(); pct = true; }
      const stat = this._is('mp') ? 'mp' : 'hp';
      if (this._is('hp') || this._is('mp')) this._next();
      return { op: stat === 'mp' ? (pct ? 'restoreMpPercent' : 'restoreMpFlat') : (pct ? 'healPercent' : 'healFlat'), amount: this._resolveNodeValue(amtNode) };
    }
    if (action === 'drain') {
      const amtNode = this._parseValue();
      const stat = this._is('mp') ? 'mp' : 'hp';
      if (this._is('hp') || this._is('mp')) this._next();
      return { op: stat === 'mp' ? 'drainMp' : 'dealFlat', amount: this._resolveNodeValue(amtNode) };
    }
    if (action === 'message' || action === 'print' || action === 'say') {
      const valNode = this._parseValue();
      if (this._is('as')) { this._next(); if (this._isType('IDENT')) this._next(); }
      return { op: 'message', text: this._resolveNodeValue(valNode) };
    }
    return null;
  }

  _parseRecover() {
    this._consume('recover');
    let target = 'all';
    if (!this._is('then') && !this._is('end') && this.pos < this.tokens.length) target = this._consumeIdentOrString();
    return { type: 'recover', target };
  }

  _parseChange() {
    this._consume('change');
    const what = this._consumeIdent();
    if (what === 'map')       { if (this._is('to')) this._next(); const mapId = this._consumeIdentOrString(); let x = null, y = null; if (this._is('at')) { this._next(); x = this._parseValue(); y = this._parseValue(); } return { type: 'changeMap', mapId, x, y }; }
    if (what === 'class')     { const entity = this._consumeIdentOrString(); if (this._is('to')) this._next(); return { type: 'changeClass', entity, classId: this._consumeIdentOrString() }; }
    if (what === 'level')     { const entity = this._consumeIdentOrString(); const byTo = this._is('by') ? 'by' : 'to'; if (this._is('by') || this._is('to')) this._next(); return { type: 'changeLevel', entity, amount: this._parseValue(), relative: byTo === 'by' }; }
    if (what === 'exp' || what === 'experience') { const entity = this._consumeIdentOrString(); const byTo = this._is('by') ? 'by' : 'to'; if (this._is('by') || this._is('to')) this._next(); return { type: 'changeExp', entity, amount: this._parseValue(), relative: byTo === 'by' }; }
    if (what === 'gold')      { const byTo = this._is('by') ? 'by' : 'to'; if (this._is('by') || this._is('to')) this._next(); return { type: 'changeGold', amount: this._parseValue(), relative: byTo === 'by' }; }
    if (what === 'hp' || what === 'mp' || what === 'tp') { const entity = this._consumeIdentOrString(); const byTo = this._is('by') ? 'by' : 'to'; if (this._is('by') || this._is('to')) this._next(); return { type: 'changeStat', stat: what, entity, amount: this._parseValue(), relative: byTo === 'by' }; }
    if (what === 'encounter')  { if (this._is('rate')) this._next(); if (this._is('to')) this._next(); return { type: 'changeEncounterRate', value: this._parseValue() }; }
    return null;
  }

  _parseLearn()  { this._consume('learn');  if (this._is('skill')) this._next(); const skillId = this._consumeIdentOrString(); let target = 'player'; if (this._is('for')) { this._next(); target = this._consumeIdentOrString(); } return { type: 'learnSkill', skillId, target }; }
  _parseForget() { this._consume('forget'); if (this._is('skill')) this._next(); const skillId = this._consumeIdentOrString(); let target = 'player'; if (this._is('for')) { this._next(); target = this._consumeIdentOrString(); } return { type: 'forgetSkill', skillId, target }; }

  _parseSay() {
    this._consume('say');
    // Check for interpolated string
    const tok = this._peek();
    let text;
    if (tok?.type === 'INTERPOLATED_STRING') {
      this._next();
      text = { type: 'interpolatedString', parts: tok.parts };
    } else {
      text = { type: 'string', value: this._consumeIdentOrString() };
      // Handle if _consumeIdentOrString returned an interpolated obj  
      if (text.value && text.value.__interpolated) {
        text = { type: 'interpolatedString', parts: text.value.parts };
      }
    }
    let speaker = '', portrait = '';
    if (this._is('as')) { this._next(); speaker = this._consumeIdentOrString(); }
    if (this._is('with') && this._peek(1)?.value === 'portrait') { this._next(); this._next(); portrait = this._consumeIdentOrString(); }
    return { type: 'say', text, speaker, portrait };
  }

  _parseChoice() {
    this._consume('choice');
    let prompt = '';
    if (this._isType('STRING')) prompt = this._next().value;
    if (this._is('option')) {
      const options = [];
      while (this._is('option')) {
        this._next();
        const label = this._consumeIdentOrString();
        const body = this._parseBody(['end', 'option']);
        if (this._is('end')) this._consume('end');
        options.push({ label, body });
      }
      if (this._is('end')) this._consume('end');
      return { type: 'choice', prompt, options };
    }
    const options = [];
    if (!this._is('then') && !this._is('end')) {
      try {
        options.push({ label: this._consumeIdentOrString(), body: [] });
        while (this._is('or')) { this._next(); options.push({ label: this._consumeIdentOrString(), body: [] }); }
      } catch (_) {}
    }
    return { type: 'choice', prompt, options };
  }

  _parseBattle() {
    this._consume('battle');
    if (this._isType('STRING')) {
      const enemies = [this._parseValue()];
      while (this._is('and') || this._is(',')) { this._next(); if (this._isType('STRING') || this._isType('IDENT')) enemies.push(this._parseValue()); }
      let music = null;
      if (this._is('with') && this._peek(1)?.value === 'music') { this._next(); this._next(); music = this._parseValue(); }
      return { type: 'battleEnemy', enemies, music };
    }
    const attacker = this._consumeIdent();
    if (this._is('with')) this._next();
    return { type: 'battle', attacker, defender: this._consumeIdent() };
  }

  _parseAttack() {
    this._consume('attack');
    return { type: 'attack', attacker: this._consumeIdent(), defender: this._consumeIdent() };
  }

  _parseAddItem() {
    this._next();
    if (this._is('item')) this._next();
    const itemId = this._consumeIdentOrString();
    let quantity = { type: 'number', value: 1 };
    if (this._is('quantity') || this._is('x') || this._isType('NUMBER')) { if (this._is('quantity') || this._is('x')) this._next(); quantity = this._parseValue(); }
    if (this._is('to')) this._next(); if (this._is('inventory')) this._next();
    return { type: 'addItem', itemId, quantity };
  }

  _parseRemoveItem() {
    this._next();
    if (this._is('item')) this._next();
    const itemId = this._consumeIdentOrString();
    let quantity = { type: 'number', value: 1 };
    if (this._is('quantity') || this._is('x') || this._isType('NUMBER')) { if (this._is('quantity') || this._is('x')) this._next(); quantity = this._parseValue(); }
    if (this._is('from')) this._next(); if (this._is('inventory')) this._next();
    return { type: 'removeItem', itemId, quantity };
  }

  _parseToggle() {
    this._consume('toggle');
    if (this._is('inventory')) { this._next(); return { type: 'toggleInventory' }; }
    return { type: 'toggle', target: this._consumeIdent() };
  }

  _parseLoad() {
    this._consume('load');
    if (this._is('data'))   { this._next(); const key = this._consumeIdentOrString(); let variable = null; if (this._is('into') || this._is('to')) { this._next(); variable = this._consumeIdentOrString(); } return { type: 'loadData', key, variable }; }
    if (this._is('record')) { this._next(); const id = this._consumeIdentOrString(); if (this._is('from') || this._is('in')) this._next(); const table = this._consumeIdentOrString(); let variable = null; if (this._is('into') || this._is('to')) { this._next(); variable = this._consumeIdentOrString(); } return { type: 'loadRecord', id, table, variable }; }
    if (this._is('scene'))  { this._next(); return { type: 'loadScene', id: this._consumeIdentOrString() }; }
    if (this._is('game'))   { this._next(); if (this._is('from')) this._next(); return { type: 'loadGame', slot: (this._isType('STRING') || this._isType('IDENT')) ? this._consumeIdentOrString() : 'slot1' }; }
    if (this._is('tileset')){ this._next(); return { type: 'loadTileset', src: this._consumeIdentOrString() }; }
    return null;
  }

  _parseSave() {
    this._consume('save');
    if (this._is('data'))   { this._next(); const key = this._consumeIdentOrString(); if (this._is('as') || this._is('to')) this._next(); return { type: 'saveData', key, value: this._parseValue() }; }
    if (this._is('record')) { this._next(); const id = this._consumeIdentOrString(); if (this._is('in') || this._is('to')) this._next(); const table = this._consumeIdentOrString(); let data = null; if (this._is('with') || this._is('as')) { this._next(); data = this._parseValue(); } return { type: 'saveRecord', id, table, data }; }
    if (this._is('game'))   { this._next(); if (this._is('to')) this._next(); return { type: 'saveGame', slot: (this._isType('STRING') || this._isType('IDENT')) ? this._consumeIdentOrString() : 'slot1' }; }
    return { type: 'saveGame', slot: 'slot1' };
  }

  _parseDelete() {
    this._consume('delete');
    if (this._is('data'))   { this._next(); return { type: 'deleteData', key: this._consumeIdentOrString() }; }
    if (this._is('record')) { this._next(); const id = this._consumeIdentOrString(); if (this._is('from') || this._is('in')) this._next(); return { type: 'deleteRecord', id, table: this._consumeIdentOrString() }; }
    if (this._is('game'))   { this._next(); return { type: 'deleteData', key: 'game:' + ((this._isType('STRING') || this._isType('IDENT')) ? this._consumeIdentOrString() : 'slot1') }; }
    // delete file "path"
    if (this._is('file'))  { this._next(); return { type: 'deleteFile', path: this._parseValue() }; }
    // delete key "k" from myMap (works for both Map and object)
    if (this._is('key'))   { 
      this._next(); 
      const key = this._parseValue(); 
      if (this._is('from') || this._is('in')) this._next(); 
      const obj = this._consumeIdent();
      return { type: 'mapDelete', mapName: obj, key }; 
    }
    // delete value from mySet
    if (this._is('value')) {
      this._next();
      const value = this._parseValue();
      if (this._is('from') || this._is('in')) this._next();
      const setName = this._consumeIdent();
      return { type: 'setDelete', setName, value };
    }
    return null;
  }

  _parseTurn() {
    this._consume('turn');
    const onOff = this._consumeIdent();
    if (this._is('switch')) this._next();
    return { type: 'turnSwitch', on: onOff === 'on', id: this._parseValue() };
  }

  _parseOpen() {
    this._consume('open');
    const what = this._consumeIdent();
    if (what === 'shop')    { return { type: 'openShop', name: (this._isType('STRING') || this._isType('IDENT')) ? this._parseValue() : { type: 'string', value: '' } }; }
    if (what === 'formula') { if (this._is('editor')) this._next(); return { type: 'openFormulaEditor' }; }
    if (what === 'game' && this._is('over')) { this._next(); return { type: 'gameOver' }; }
    return { type: 'openMenu', tab: what };
  }

  _parseEquip() {
    this._consume('equip');
    const itemId = this._parseValue();
    let slot = null;
    if (this._is('in')) this._next();
    if (this._isType('IDENT') || this._isType('STRING')) { slot = this._consumeIdentOrString(); if (this._is('slot')) this._next(); }
    return { type: 'equipItem', itemId, slot };
  }

  _parseHeal() {
    this._consume('heal');
    if (this._is('all')) { this._next(); return { type: 'heal', target: 'all', amount: null }; }
    const target = this._consumeIdentOrString();
    let amount = null;
    if (this._is('by') || this._is('for')) { this._next(); amount = this._parseValue(); }
    return { type: 'heal', target, amount };
  }

  _parseGrant() { this._consume('grant'); return this._parseGiveBody(); }
  _parseGive()  { this._consume('give');  return this._parseGiveBody(); }

  _parseGiveBody() {
    if (this._isType('NUMBER')) {
      const p1 = this._peek(1);
      if (p1?.value === 'exp' || p1?.value === 'experience') { const a = this._parseValue(); this._next(); return { type: 'giveExp', amount: a }; }
      if (p1?.value === 'gold') { const a = this._parseValue(); this._next(); return { type: 'giveGold', amount: a }; }
    }
    if (this._is('exp') || this._is('experience')) { this._next(); return { type: 'giveExp', amount: this._parseValue() }; }
    if (this._is('gold')) { this._next(); return { type: 'giveGold', amount: this._parseValue() }; }
    if (this._peek(1)?.value === 'to' && this._peek(2)?.value === 'party') { const memberId = this._consumeIdentOrString(); this._next(); this._next(); return { type: 'addToParty', memberId }; }
    if (this._is('item')) this._next();
    const itemId = this._consumeIdentOrString();
    let quantity = { type: 'number', value: 1 };
    if (this._is('quantity') || this._is('x') || this._isType('NUMBER')) { if (this._is('quantity') || this._is('x')) this._next(); quantity = this._parseValue(); }
    if (this._is('to')) this._next(); if (this._is('inventory')) this._next();
    return { type: 'addItem', itemId, quantity };
  }

  _parseAdd() {
    this._consume('add');
    if (this._is('member')) this._next();
    if (this._peek(1)?.value === 'to' && this._peek(2)?.value === 'party') { const memberId = this._consumeIdentOrString(); this._next(); this._next(); return { type: 'addToParty', memberId }; }
    if (this._is('item')) this._next();
    const itemId = this._parseValue();
    let quantity = { type: 'number', value: 1 };
    // Check for Map/Set: add X to myMap with key "foo" | add X to mySet
    if (this._is('to')) {
      this._next();
      const target = this._consumeIdent();
      // Check if it's a Map operation
      if (this._is('with') && this._peek(1)?.value === 'key') {
        this._next(); // consume 'with'
        this._next(); // consume 'key'
        const key = this._parseValue();
        return { type: 'mapSet', mapName: target, key, value: itemId };
      }
      // Could be a Set add
      return { type: 'setAdd', setName: target, value: itemId };
    }
    if (this._is('quantity') || this._is('x') || this._isType('NUMBER')) { if (this._is('quantity') || this._is('x')) this._next(); quantity = this._parseValue(); }
    if (this._is('to')) this._next(); if (this._is('inventory')) this._next();
    return { type: 'addItem', itemId, quantity };
  }

  _parseRemove() {
    this._consume('remove');
    // Array-specific: remove last from X  /  remove first from X
    if (this._is('last')) {
      this._next();
      if (this._is('from') || this._is('of')) this._next();
      return { type: 'arrayPop', varName: this._consumeIdent() };
    }
    if (this._is('first')) {
      this._next();
      if (this._is('from') || this._is('of')) this._next();
      return { type: 'arrayShift', varName: this._consumeIdent() };
    }
    if (this._is('member')) this._next();
    if (this._peek(1)?.value === 'from' && this._peek(2)?.value === 'party') { const memberId = this._consumeIdentOrString(); this._next(); this._next(); return { type: 'removeFromParty', memberId }; }
    if (this._is('item')) this._next();
    const itemId = this._consumeIdentOrString();
    let quantity = { type: 'number', value: 1 };
    if (this._is('quantity') || this._is('x') || this._isType('NUMBER')) { if (this._is('quantity') || this._is('x')) this._next(); quantity = this._parseValue(); }
    if (this._is('from')) this._next(); if (this._is('inventory')) this._next();
    return { type: 'removeItem', itemId, quantity };
  }

  // ── JS/Node.js feature parse methods ────────────────────────────────────

  // for each item in list do ... end
  _parseForEach() {
    this._consume('for');
    if (this._is('each') || this._is('every')) this._next();
    const varName = this._consumeIdent();
    if (this._is('in') || this._is('of') || this._is('from')) this._next();
    const iterable = this._consumeIdent();
    if (this._is('do') || this._is('then')) this._next();
    const body = this._parseBody(['end']);
    if (this._is('end')) this._consume('end');
    return { type: 'forEach', varName, iterable, body };
  }

  // append value to arrayVar  /  append to file "path" with content
  _parseAppend() {
    this._consume('append');
    // append to file "..." with content
    if (this._is('to') && this._peek(1)?.value === 'file') {
      this._next(); this._next(); // consume 'to', 'file'
      const path = this._parseValue();
      let contents = { type: 'string', value: '' };
      if (this._is('with') || this._is('content')) { this._next(); contents = this._parseValue(); }
      return { type: 'writeFile', path, contents, append: true };
    }
    const value = this._parseValue();
    if (this._is('to') || this._is('into')) this._next();
    return { type: 'append', value, varName: this._consumeIdent() };
  }

  // fetch "url" into result
  _parseFetch() {
    this._consume('fetch');
    if (this._is('from') || this._is('url')) this._next();
    const url = this._parseValue();
    let variable = null;
    if (this._is('into') || this._is('to')) { this._next(); variable = this._consumeIdent(); }
    return { type: 'fetchUrl', url, method: 'GET', body: null, variable };
  }

  // post "url" with bodyVar into result
  _parsePost() {
    this._consume('post');
    if (this._is('to') || this._is('url')) this._next();
    const url = this._parseValue();
    let body = null;
    if (this._is('with') || this._is('body')) { this._next(); body = this._parseValue(); }
    let variable = null;
    if (this._is('into') || this._is('to')) { this._next(); variable = this._consumeIdent(); }
    return { type: 'fetchUrl', url, method: 'POST', body, variable };
  }

  // parse json textVar into objVar
  _parseParseJson() {
    this._consume('parse');
    if (this._is('json')) this._next();
    const text = this._parseValue();
    let variable = null;
    if (this._is('into') || this._is('to')) { this._next(); variable = this._consumeIdent(); }
    return { type: 'parseJson', text, variable };
  }

  // stringify objVar into jsonText
  _parseStringify() {
    this._consume('stringify');
    const value = this._parseValue();
    let variable = null;
    if (this._is('into') || this._is('to') || this._is('as')) { this._next(); variable = this._consumeIdent(); }
    return { type: 'stringify', value, variable };
  }

  // read file "path" into contents
  _parseReadFile() {
    this._consume('read');
    if (this._is('file')) this._next();
    const path = this._parseValue();
    let variable = null;
    if (this._is('into') || this._is('to')) { this._next(); variable = this._consumeIdent(); }
    return { type: 'readFile', path, variable };
  }

  // write file "path" with contents  /  append to file "path" with line
  _parseWriteFile() {
    this._consume('write');
    let isAppend = false;
    if (this._is('append')) this._next();
    if (this._is('file')) this._next();
    const path = this._parseValue();
    let contents = { type: 'string', value: '' };
    if (this._is('with') || this._is('as') || this._is('content')) { this._next(); contents = this._parseValue(); }
    return { type: 'writeFile', path, contents, append: isAppend };
  }

  // split text by "," into parts
  _parseSplitStmt() {
    this._consume('split');
    const str = this._parseValue();
    let sep = { type: 'string', value: ' ' };
    if (this._is('by') || this._is('on') || this._is('with')) { this._next(); sep = this._parseValue(); }
    let variable = null;
    if (this._is('into') || this._is('to')) { this._next(); variable = this._consumeIdent(); }
    return { type: 'splitStr', str, sep, variable };
  }

  // replace "old" with "new" in msg  /  replace "old" with "new" in msg into result
  _parseReplaceStmt() {
    this._consume('replace');
    const from = this._parseValue();
    if (this._is('with')) this._next();
    const to = this._parseValue();
    let inVar = null, variable = null;
    if (this._is('in')) { this._next(); inVar = this._consumeIdent(); }
    if (this._is('into') || this._is('to')) { this._next(); variable = this._consumeIdent(); }
    return { type: 'replaceStr', from, to, inVar, variable };
  }

  // convert value to number/text/boolean into varName
  _parseConvert() {
    this._consume('convert');
    const value = this._parseValue();
    if (this._is('to') || this._is('as') || this._is('into')) this._next();
    const typeTok = this._peek();
    let toType = 'text';
    if (typeTok && (typeTok.type === 'IDENT' || typeTok.type === 'PREP')) {
      toType = typeTok.value.toLowerCase();
      this._next();
    }
    let variable = null;
    if (this._is('into') || this._is('to') || this._is('as')) { this._next(); variable = this._consumeIdent(); }
    return { type: 'convert', value, toType, variable };
  }

  // try ... catch error ... end
  _parseTryCatch() {
    this._consume('try');
    const tryBody = this._parseBody(['catch', 'end']);
    let errorVar = 'error';
    let catchBody = [];
    if (this._is('catch')) {
      this._consume('catch');
      if (this._peek() && !['then','end','if','repeat','while'].includes(this._peek().value) &&
          (this._peek().type === 'IDENT' || this._peek().type === 'PREP')) {
        errorVar = this._consumeIdent();
      }
      catchBody = this._parseBody(['end']);
    }
    if (this._is('end')) this._consume('end');
    return { type: 'tryCatch', tryBody, catchBody, errorVar };
  }

  // ── sort items / sort items descending ─────────────────────────────────
  _parseSort() {
    this._consume('sort');
    const arr = this._consumeIdent();
    const dir = (this._is('descending') || this._is('desc')) ? (this._next(), 'desc') : 'asc';
    return { type: 'sortArr', arr, dir };
  }
  // ── reverse items ────────────────────────────────────────────────────────
  _parseReverse() {
    this._consume('reverse');
    return { type: 'reverseArr', arr: this._consumeIdent() };
  }
  // ── filter items where item contains "x" into result ────────────────────
  _parseFilter() {
    this._consume('filter');
    const arr = this._consumeIdent();
    if (this._is('where')) this._next();
    const itemVar = this._consumeIdent();
    // Build condition: itemVar <comparison> OR full single-condition with itemVar as subject
    let condition;
    const nx = this._peek();
    if (!nx || nx.type === 'COMPARISON' || nx.value === 'equals' || nx.value === 'is' ||
        nx.value === 'less' || nx.value === 'greater' || nx.value === 'equal' ||
        nx.value === 'above' || nx.value === 'below' || nx.value === 'between' ||
        nx.value === 'empty' || nx.value === 'exists' || nx.value === 'nothing' || nx.value === 'not') {
      if (this._is('is') || this._is('has') || this._is('equals')) this._next();
      condition = { type: 'varCondition', name: itemVar, comparison: this._parseComparison() };
    } else if (nx?.value === 'contains') {
      this._next();
      condition = { type: 'contains', subject: itemVar, value: this._parseValue() };
    } else if (nx?.value === 'starts') {
      this._next(); if (this._is('with')) this._next();
      condition = { type: 'startsWith', subject: itemVar, value: this._parseValue() };
    } else if (nx?.value === 'ends') {
      this._next(); if (this._is('with')) this._next();
      condition = { type: 'endsWith', subject: itemVar, value: this._parseValue() };
    } else {
      condition = this._parseSingleCondition();
    }
    if (this._is('into')) this._next();
    const out = this._consumeIdent();
    return { type: 'filterArr', arr, itemVar, condition, out };
  }
  // ── merge arr with more into combined ───────────────────────────────────
  _parseMerge() {
    this._consume('merge');
    const a = this._consumeIdent();
    if (this._is('with')) this._next();
    const b = this._consumeIdent();
    if (this._is('into')) this._next();
    return { type: 'mergeArr', a, b, out: this._consumeIdent() };
  }
  // ── flatten nested into flat ─────────────────────────────────────────────
  _parseFlatten() {
    this._consume('flatten');
    const arr = this._consumeIdent();
    const out = this._is('into') ? (this._next(), this._consumeIdent()) : arr;
    return { type: 'flattenArr', arr, out };
  }
  // ── find "x" in items into idx ───────────────────────────────────────────
  _parseFindStmt() {
    this._consume('find');
    const needle = this._parseValue();
    if (this._is('in')) this._next();
    const arr = this._consumeIdent();
    if (this._is('into')) this._next();
    return { type: 'findInArr', arr, needle, out: this._consumeIdent() };
  }
  // ── get key/index/env/time/date ──────────────────────────────────────────
  _parseGetStmt() {
    this._consume('get');
    // get env "VAR" into x
    if (this._is('env')) {
      this._next();
      const key = this._parseValue();
      if (this._is('into')) this._next();
      return { type: 'getEnv', key, out: this._consumeIdent() };
    }
    // get time into x
    if (this._is('time')) {
      this._next();
      if (this._is('into')) this._next();
      return { type: 'getTime', out: this._consumeIdent() };
    }
    // get date into x
    if (this._is('date')) {
      this._next();
      if (this._is('into')) this._next();
      return { type: 'getDate', out: this._consumeIdent() };
    }
    // get timestamp into x
    if (this._is('timestamp')) {
      this._next();
      if (this._is('into')) this._next();
      return { type: 'getTimestamp', out: this._consumeIdent() };
    }
    // get from map: get key "k" from myMap into x
    if (this._is('key')) {
      this._next();
      const key = this._parseValue();
      if (this._is('from') || this._is('in')) this._next();
      const obj = this._consumeIdent();
      if (this._is('into')) this._next();
      const out = this._consumeIdent();
      return { type: 'mapGet', mapName: obj, key, out };
    }
    // get index N from arr into x
    if (this._is('index')) {
      this._next();
      const idx = this._parseValue();
      if (this._is('from') || this._is('in')) this._next();
      const arr = this._consumeIdent();
      if (this._is('into')) this._next();
      return { type: 'getArrIndex', arr, index: idx, out: this._consumeIdent() };
    }
    // get size of myMap/mySet into x
    if (this._is('size')) {
      this._next();
      if (this._is('of')) this._next();
      const varName = this._consumeIdent();
      if (this._is('into')) this._next();
      return { type: 'getSize', varName, out: this._consumeIdent() };
    }
    // get entries from myMap into x (returns array of [key, value] pairs)
    if (this._is('entries')) {
      this._next();
      if (this._is('from') || this._is('of')) this._next();
      const varName = this._consumeIdent();
      if (this._is('into')) this._next();
      return { type: 'getEntries', varName, out: this._consumeIdent() };
    }
    return null;
  }
  // ── slice arr from N to M into result ────────────────────────────────────
  _parseSliceStmt() {
    this._consume('slice');
    const src = this._consumeIdent();
    if (this._is('from')) this._next();
    const start = this._parseValue();
    if (this._is('to')) this._next();
    const end = this._parseValue();
    if (this._is('into')) this._next();
    return { type: 'sliceStmt', src, start, end, out: this._consumeIdent() };
  }
  // ── char at N in str into c ──────────────────────────────────────────────
  _parseCharAt() {
    this._consume('char');
    if (this._is('at')) this._next();
    const idx = this._parseValue();
    if (this._is('in')) this._next();
    const src = this._consumeIdent();
    if (this._is('into')) this._next();
    return { type: 'charAtStmt', src, index: idx, out: this._consumeIdent() };
  }
  // ── repeat "str" N times into var  (string repeat, NOT loop repeat) ──────
  _parseRepeatStr() {
    this._consume('repeat');
    const str = this._parseValue();
    const count = this._isType('NUMBER') || this._isType('IDENT') ? this._parseValue() : { type: 'number', value: 1 };
    if (this._is('times')) this._next();
    if (this._is('into')) this._next();
    return { type: 'repeatStr', str, count, out: this._consumeIdent() };
  }
  // ── pad left/right "val" to N with "c" into res ──────────────────────────
  _parsePadStmt() {
    this._consume('pad');
    const dir = (this._is('left') || this._is('right')) ? this._consumeIdent() : 'left';
    const src = this._parseValue();
    if (this._is('to')) this._next();
    const len = this._parseValue();
    let fill = { type: 'string', value: ' ' };
    if (this._is('with')) { this._next(); fill = this._parseValue(); }
    if (this._is('into')) this._next();
    return { type: 'padStr', dir, src, len, fill, out: this._consumeIdent() };
  }
  // ── clamp var between A and B into res ───────────────────────────────────
  _parseClampStmt() {
    this._consume('clamp');
    const src = this._consumeIdent();
    if (this._is('between')) this._next();
    const low = this._parseValue();
    if (this._is('and')) this._next();
    const high = this._parseValue();
    let out = src;
    if (this._is('into')) { this._next(); out = this._consumeIdent(); }
    return { type: 'clampVar', src, low, high, out };
  }
  // ── keys of obj into list / values of obj into list ──────────────────────
  _parseKeysValues() {
    const which = this._consumeIdent(); // 'keys' or 'values'
    if (this._is('of')) this._next();
    const obj = this._consumeIdent();
    if (this._is('into')) this._next();
    return { type: which === 'keys' ? 'objKeys' : 'objValues', obj, out: this._consumeIdent() };
  }
  // ── exit / exit with code N ───────────────────────────────────────────────
  _parseExitStmt() {
    this._consume('exit');
    let code = { type: 'number', value: 0 };
    if (this._is('with')) { this._next(); if (this._is('code')) this._next(); code = this._parseValue(); }
    return { type: 'exitProg', code };
  }
  // ── run "cmd" into output ─────────────────────────────────────────────────
  _parseRunCommand() {
    this._consume('run');
    const cmd = this._parseValue();
    let out = null;
    if (this._is('into')) { this._next(); out = this._consumeIdent(); }
    return { type: 'runCommand', cmd, out };
  }
  // ── list files in "path" into files ──────────────────────────────────────
  _parseListFiles() {
    this._consume('list');
    if (this._is('files')) this._next();
    if (this._is('in')) this._next();
    const path = this._parseValue();
    if (this._is('into')) this._next();
    return { type: 'listFiles', path, out: this._consumeIdent() };
  }
  // ── file exists "path" into flag ──────────────────────────────────────────
  _parseFileExists() {
    this._consume('file');
    if (this._is('exists')) this._next();
    const path = this._parseValue();
    if (this._is('into')) this._next();
    return { type: 'fileExists', path, out: this._consumeIdent() };
  }
  // ── create folder "path" ─────────────────────────────────────────────────
  _parseCreateFolder() {
    this._consume('create');
    if (this._is('folder') || this._is('directory')) this._next();
    return { type: 'createFolder', path: this._parseValue() };
  }
  // ── create map as myMap ─────────────────────────────────────────────────
  _parseCreateMap() {
    this._consume('create');
    this._consume('map');
    if (this._is('as')) this._next();
    const name = this._consumeIdent();
    return { type: 'createMap', name };
  }
  // ── create set as mySet ─────────────────────────────────────────────────
  _parseCreateSet() {
    this._consume('create');
    this._consume('set');
    if (this._is('as')) this._next();
    const name = this._consumeIdent();
    return { type: 'createSet', name };
  }
  // ── type of X into t ─────────────────────────────────────────────────────
  _parseTypeOf() {
    this._consume('type');
    if (this._is('of')) this._next();
    const src = this._consumeIdent();
    if (this._is('into')) this._next();
    return { type: 'typeOfStmt', src, out: this._consumeIdent() };
  }
  // ── index of X in arr/str into pos ───────────────────────────────────────
  _parseIndexOfStmt() {
    this._consume('index');
    if (this._is('of')) this._next();
    const needle = this._parseValue();
    if (this._is('in')) this._next();
    const src = this._consumeIdent();
    if (this._is('into')) this._next();
    return { type: 'indexOfStmt', src, needle, out: this._consumeIdent() };
  }

  // ── return value ─────────────────────────────────────────────────────────
  _parseReturn() {
    this._consume('return');
    const value = (this._peek() && !this._is('end') && !this._is('else')) ? this._parseValue() : { type: 'null', value: null };
    return { type: 'returnStmt', value };
  }

  // ── call function "name" with args into result ────────────────────────────
  _parseCallFunction() {
    if (this._is('function')) this._next(); // consume 'function'
    const id = this._consumeIdentOrString();
    const args = [];
    if (this._is('with') || this._is('args') || this._is('params')) {
      this._next();
      while (this._peek() && !this._is('into') && !this._is('then') && !this._is('end') &&
             this._peek().type !== 'KEYWORD') {
        args.push(this._parseValue());
        if (this._is('and') || this._is(',')) this._next(); else break;
      }
    }
    let out = null;
    if (this._is('into')) { 
      this._next(); 
      const STOP = new Set(['then', 'end', 'else']);
      out = this._consumeMultiWordName(STOP); 
    }
    return { type: 'callFunction', id, args, out };
  }

  // ── match x on "a" then ... on "b" then ... else ... end ──────────────────
  _parseMatch() {
    this._consume('match');
    const STOP = new Set(['on', 'then', 'do']);
    const subject = this._consumeMultiWordName(STOP);
    const cases = [];
    let defaultBody = [];
    while (this.pos < this.tokens.length && !this._is('end')) {
      if (this._is('on')) {
        this._next();
        // parse a comparison or value
        let match;
        const nx = this._peek();
        if (nx?.type === 'COMPARISON' || nx?.value === 'less' || nx?.value === 'greater' ||
            nx?.value === 'between' || nx?.value === 'not') {
          match = { type: 'comparison', comparison: this._parseComparison() };
        } else {
          match = { type: 'value', value: this._parseValue() };
        }
        if (this._is('then') || this._is('do')) this._next();
        const body = this._parseBody(['on', 'else', 'end']);
        cases.push({ match, body });
      } else if (this._is('else')) {
        this._next();
        defaultBody = this._parseBody(['end']);
      } else {
        break;
      }
    }
    if (this._is('end')) this._consume('end');
    return { type: 'matchStmt', subject, cases, defaultBody };
  }

  // ── transform items with item into item * 2 into doubled ─────────────────
  _parseTransform() {
    this._consume('transform');
    const STOP = new Set(['with', 'where', 'using', 'into', 'as']);
    const arr = this._consumeMultiWordName(STOP);
    if (this._is('with') || this._is('where') || this._is('using')) this._next();
    // Skip optional "each" before item variable name
    if (this._is('each')) this._next();
    const STOP2 = new Set(['into', 'to', 'as', 'then', 'do']);
    const itemVar = this._consumeMultiWordName(STOP2);
    if (this._is('into') || this._is('to') || this._is('as')) this._next();
    
    // Check if next is a body-style (output var then expression in block)
    // or inline-style (expression then 'into' output)
    // Heuristic: if we hit 'end' or a statement action, it's body-style
    // Otherwise try to parse an expression and look for 'into' afterwards
    
    // Save position to potentially backtrack
    const savedPos = this.pos;
    
    // Try inline style: <expr> into <out>
    try {
      const expr = this._parseValue();
      if (this._is('into')) {
        this._next();
        const STOP3 = new Set(['then', 'do', 'end', 'else']);
        const out = this._consumeMultiWordName(STOP3);
        return { type: 'transformArr', arr, itemVar, expr, out };
      }
      // If no 'into' after expr, this might be body-style where we parsed output as expr
      throw new Error('need into');
    } catch (e) {
      // Restore position and try body-style
      this.pos = savedPos;
    }
    
    // Body style: <out> then/do <expr in body> end
    const STOP3 = new Set(['then', 'do', 'end']);
    const out = this._consumeMultiWordName(STOP3);
    if (this._is('then') || this._is('do')) this._next();
    const expr = this._parseValue();
    if (this._is('end')) this._consume('end');
    return { type: 'transformArr', arr, itemVar, expr, out };
  }

  // ── reduce arr with sum and item starting 0 ... end ──────────────────────
  // or: reduce arr into total starting 0 with sum and item ... end
  _parseReduce() {
    this._consume('reduce');
    const STOP = new Set(['with', 'using', 'into']);
    const arr = this._consumeMultiWordName(STOP);
    let accVar = 'acc', itemVar = 'item', initial = { type: 'number', value: 0 }, out = 'acc';
    if (this._is('with') || this._is('using')) {
      this._next();
      accVar  = this._consumeIdent();
      if (this._is('and') || this._is(',')) this._next();
      itemVar = this._consumeIdent();
    }
    if (this._is('starting') || this._is('from') || this._is('at')) {
      this._next();
      if (this._is('from') || this._is('at')) this._next(); // handle "starting from"
      initial = this._parsePrimary(); // Use _parsePrimary to avoid consuming 'into'
    }
    // Handle 'into <out>' before body - use strict stop set
    if (this._is('into')) {
      this._next();
      // Only consume the output variable name, not the body expression
      // Use a simple single-IDENT approach or stop at any known action/value token
      out = this._consumeMultiWordName(new Set(['then', 'do', 'let', 'set', 'increase', 'decrease', 'return']));
    }
    if (this._is('then') || this._is('do')) this._next();
    const body = this._parseBody(['end']);
    if (this._is('end')) this._consume('end');
    // Also allow 'into <out>' after end
    if (this._is('into')) {
      this._next();
      out = this._consumeMultiWordName(new Set(['then', 'end', 'else']));
    }
    return { type: 'reduceArr', arr, accVar, itemVar, initial, body, out };
  }

  // ── every item in arr is condition into flag ──────────────────────────────
  // ── any item in arr is condition into flag ────────────────────────────────
  _parseEveryAny() {
    const which = this._consumeIdent(); // 'every' or 'any'
    const itemVar = (this._peek()?.type !== 'PREP' || this._peek()?.value === 'item') ? this._consumeIdent() : 'item';
    if (this._is('in')) this._next();
    const STOP = new Set(['is', 'has']);
    const arr = this._consumeMultiWordName(STOP);
    // parse condition relative to itemVar
    if (this._is('is') || this._is('has')) this._next();
    const comparison = this._parseComparison();
    if (this._is('into')) this._next();
    const STOP2 = new Set(['then', 'end', 'else']);
    const out = this._consumeMultiWordName(STOP2);
    return { type: which === 'every' ? 'everyArr' : 'anyArr', arr, itemVar, comparison, out };
  }

  // ── copy obj into newObj ──────────────────────────────────────────────────
  _parseCopyObj() {
    this._consume('copy');
    const STOP = new Set(['into', 'to']);
    const src = this._consumeMultiWordName(STOP);
    if (this._is('into')) this._next();
    const STOP2 = new Set(['then', 'end', 'else']);
    return { type: 'copyObj', src, out: this._consumeMultiWordName(STOP2) };
  }

  // ── assign obj1 and obj2 into merged ─────────────────────────────────────
  _parseAssignObjs() {
    this._consume('assign');
    const STOP = new Set(['and', 'into', 'to']);
    const sources = [this._consumeMultiWordName(STOP)];
    while (this._is('and') || this._is(',')) { 
      this._next(); 
      sources.push(this._consumeMultiWordName(STOP)); 
    }
    if (this._is('into')) this._next();
    const STOP2 = new Set(['then', 'end', 'else']);
    return { type: 'assignObjs', sources, out: this._consumeMultiWordName(STOP2) };
  }

  // ── path operations ───────────────────────────────────────────────────────
  // join path "dir" and "file" into p
  // basename of "path/file.txt" into name
  // dirname of "path/file.txt" into dir
  // extension of "file.txt" into ext
  _parsePathOp() {
    const op = this._consumeIdent(); // join/basename/dirname/extension/extname
    if (this._is('path')) this._next();
    if (this._is('of'))   this._next();
    const parts = [this._parseValue()];
    while (this._is('and') || this._is(',')) { this._next(); parts.push(this._parseValue()); }
    if (this._is('into')) this._next();
    const STOP = new Set(['then', 'end', 'else']);
    return { type: 'pathOp', op, parts, out: this._consumeMultiWordName(STOP) };
  }

  // ── print/log statement wrapper ───────────────────────────────────────────
  _parseLogStmt() {
    this._consume('log');
    const values = [this._parseValue()];
    while (this._peek() && !this._is('end') && !this._is('then') && !this._is('else') &&
           this._peek().type !== 'KEYWORD' && this._peek().type !== 'ACTION' &&
           (this._peek().type === 'IDENT' || this._peek().type === 'STRING' ||
           this._peek().type === 'NUMBER' || this._peek().type === 'BOOLEAN' || this._peek().type === 'PREP')) {
      values.push(this._parseValue());
    }
    return { type: 'logStmt', values };
  }

  // ── server operations ─────────────────────────────────────────────────────
  // English: start the server on port 3000 / start a server on port 3000
  _parseStartServer() {
    this._consume('start');
    if (this._is('a') || this._is('the')) this._next();
    if (this._is('server')) this._consume('server');
    if (this._is('on')) this._next();
    if (this._is('port')) this._next();
    const port = this._parseValue();
    return { type: 'serve', port };
  }

  // English: create a server on port 3000 / create the server on port 3000
  _parseCreateServer() {
    this._consume('create');
    if (this._is('a') || this._is('the')) this._next();
    if (this._is('server')) this._consume('server');
    if (this._is('on')) this._next();
    if (this._is('port')) this._next();
    const port = this._parseValue();
    return { type: 'serve', port };
  }

  // English: send a response with status 200 and body {...}
  // English: send the response 200 with {...}
  // English: send html "<html>..." with status 200
  // English: send file "index.html"
  _parseSendResponse() {
    this._consume('send');
    if (this._is('a') || this._is('the')) this._next();
    
    // Handle "send file" / "send the file"
    if (this._is('file')) {
      this._next();
      const path = this._parseValue();
      return { type: 'serveFile', path };
    }
    
    // Handle "send html" / "send css"
    let contentType = null;
    if (this._is('html')) {
      this._next();
      contentType = { type: 'string', value: 'html' };
      const body = this._parseValue();
      let status = { type: 'number', value: 200 };
      if (this._is('with')) {
        this._next();
        if (this._is('status')) this._next();
        status = this._parseValue();
      }
      return { type: 'respond', status, body, contentType };
    }
    if (this._is('css')) {
      this._next();
      contentType = { type: 'string', value: 'css' };
      const body = this._parseValue();
      let status = { type: 'number', value: 200 };
      if (this._is('with')) {
        this._next();
        if (this._is('status')) this._next();
        status = this._parseValue();
      }
      return { type: 'respond', status, body, contentType };
    }
    
    if (this._is('response')) this._consume('response');
    // Handle "with status X" or just "X"
    if (this._is('with')) this._next();
    if (this._is('status')) this._next();
    
    // If the next token is '{', this is just a body with implicit status 200
    let status;
    let body;
    if (this._isType('LBRACE') || this._peek()?.value === '{') {
      status = { type: 'number', value: 200 };
      body = this._parseValue();
    } else {
      status = this._parseValue();
      body = { type: 'object', pairs: [] };
      if (this._is('and') || this._is('with')) {
        this._next();
        if (this._is('body')) this._next();
        body = this._parseValue();
      }
    }
    // Handle "as html" / "as css" / "as json"
    if (this._is('as')) {
      this._next();
      contentType = this._parseValue();
    }
    return { type: 'respond', status, body, contentType };
  }

  // serve file "path/to/file.html"
  // serve the file "path/to/file.html"
  _parseServeFile() {
    this._consume('serve');
    if (this._is('the')) this._next();
    if (this._is('file')) this._next();
    const path = this._parseValue();
    return { type: 'serveFile', path };
  }

  // English: when the server receives a "GET" request to "/" then ... end
  // English: when receiving a "GET" request to "/" with request ... end
  _parseWhenReceiving() {
    this._consume('when');
    if (this._is('the')) this._next();
    if (this._is('server')) this._next();
    if (this._is('receives') || this._is('receiving')) this._next();
    if (this._is('a') || this._is('an')) this._next();
    const method = this._parseValue(); // "GET", "POST", etc.
    if (this._is('request')) this._next();
    if (this._is('to') || this._is('at') || this._is('on')) this._next();
    const path = this._parseValue();   // "/api/users"
    let reqVar = 'request';
    if (this._is('with')) { this._next(); reqVar = this._consumeIdent(); }
    if (this._is('then')) this._next();
    const body = this._parseBody(['end']);
    if (this._is('end')) this._consume('end');
    return { type: 'route', method, path, reqVar, body };
  }

  // Legacy: serve on port 3000
  _parseServe() {
    this._consume('serve');
    if (this._is('on')) this._next();
    if (this._is('port')) this._next();
    const port = this._parseValue();
    return { type: 'serve', port };
  }

  // Legacy: route "GET" "/path" with request
  _parseRoute() {
    this._consume('route');
    const method = this._parseValue();
    const path = this._parseValue();
    let reqVar = 'request';
    if (this._is('with')) { this._next(); reqVar = this._consumeIdent(); }
    const body = this._parseBody(['end']);
    if (this._is('end')) this._consume('end');
    return { type: 'route', method, path, reqVar, body };
  }

  // Legacy: respond with 200 and {"data": value}
  _parseRespond() {
    this._consume('respond');
    if (this._is('with')) this._next();
    
    // If the next token is '{', this is just a body with implicit status 200
    if (this._isType('LBRACE') || this._peek()?.value === '{') {
      const body = this._parseValue();
      return { type: 'respond', status: { type: 'number', value: 200 }, body };
    }
    
    const status = this._parseValue();
    let body = { type: 'object', pairs: [] };
    if (this._is('and') || this._is('with')) {
      this._next();
      body = this._parseValue();
    }
    return { type: 'respond', status, body };
  }

  _parseScreenFx(kind) {
    this._next();
    if (kind === 'shake') {
      const intensity = this._isType('NUMBER') ? this._parseValue() : { type: 'number', value: 6 };
      if (this._is('for') || this._is('seconds')) this._next();
      return { type: 'screenShake', intensity, duration: this._isType('NUMBER') ? this._parseValue() : { type: 'number', value: 0.5 } };
    }
    if (kind === 'flash') {
      let color;
      if (this._isType('STRING')) { color = this._parseValue(); }
      else if (this._isType('NUMBER')) {
        const r = Math.min(255, Math.max(0, Math.round(Number(this._next().value))));
        const g = this._isType('NUMBER') ? Math.min(255, Math.max(0, Math.round(Number(this._next().value)))) : 255;
        const b = this._isType('NUMBER') ? Math.min(255, Math.max(0, Math.round(Number(this._next().value)))) : 255;
        color = { type: 'string', value: '#' + [r,g,b].map(n=>n.toString(16).padStart(2,'0')).join('') };
      } else { color = { type: 'string', value: '#ffffff' }; }
      if (this._is('for') || this._is('seconds')) this._next();
      return { type: 'screenFlash', color, duration: this._isType('NUMBER') ? this._parseValue() : { type: 'number', value: 0.3 } };
    }
    if (kind === 'tint') {
      const color = this._parseValue();
      return { type: 'screenTint', color, alpha: this._isType('NUMBER') ? this._parseValue() : { type: 'number', value: 50 } };
    }
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW FEATURES: Classes, Modules, Async, Regex, WebSockets, Database, Callbacks
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Classes/OOP ──────────────────────────────────────────────────────────
  // define class "Animal" with name and age
  //   define method "speak" with no arguments
  //     print "Hello!"
  //   end
  // end
  // 
  // define class "Dog" extends "Animal"
  //   define method "speak" with no arguments
  //     print "Woof!"
  //   end
  // end
  _parseClass() {
    this._consume('class');
    const className = this._consumeIdentOrString();
    let parentClass = null;
    
    // extends "ParentClass"
    if (this._is('extends') || this._is('inherits')) {
      this._next();
      parentClass = this._consumeIdentOrString();
    }
    
    // Parse properties (with prop1 and prop2...)
    const properties = [];
    if (this._is('with')) {
      this._next();
      while (this._peek() && !this._is('then') && !this._is('do') && !this._is('end')) {
        if (this._is('and') || this._is(',')) { this._next(); continue; }
        if (this._is('define') || this._is('method')) break;
        properties.push(this._consumeMultiWordName(new Set(['and', 'then', 'do', 'end', ',', 'define', 'method'])));
      }
    }
    
    if (this._is('then') || this._is('do')) this._next();
    
    // Parse methods
    const methods = [];
    while (this._peek() && !this._is('end')) {
      if (this._is('define')) {
        this._next();
        if (this._is('method')) {
          this._next();
          const methodName = this._consumeIdentOrString();
          const params = [];
          if (this._is('with')) {
            this._next();
            if (!this._is('no')) {
              while (this._peek() && !this._is('then') && !this._is('do') && !this._is('end')) {
                if (this._is('and') || this._is(',')) { this._next(); continue; }
                if (this._is('arguments') || this._is('params')) { this._next(); continue; }
                params.push(this._consumeMultiWordName(new Set(['and', 'then', 'do', 'end', ','])));
              }
            } else {
              this._next(); // skip 'no'
              if (this._is('arguments') || this._is('params')) this._next();
            }
          }
          if (this._is('then') || this._is('do')) this._next();
          const body = this._parseBody(['end']);
          if (this._is('end')) this._consume('end');
          methods.push({ name: methodName, params, body });
        } else if (this._is('constructor')) {
          this._next();
          const params = [];
          if (this._is('with')) {
            this._next();
            while (this._peek() && !this._is('then') && !this._is('do') && !this._is('end')) {
              if (this._is('and') || this._is(',')) { this._next(); continue; }
              params.push(this._consumeMultiWordName(new Set(['and', 'then', 'do', 'end', ','])));
            }
          }
          if (this._is('then') || this._is('do')) this._next();
          const body = this._parseBody(['end']);
          if (this._is('end')) this._consume('end');
          methods.push({ name: 'constructor', params, body, isConstructor: true });
        }
      } else {
        this._next();
      }
    }
    if (this._is('end')) this._consume('end');
    
    return { type: 'defineClass', className, parentClass, properties, methods };
  }

  // create new "Dog" with "Rex" and 3 into myDog
  // let myDog be new "Dog" with "Rex" and 3
  _parseNewInstance() {
    this._consume('new');
    const className = this._consumeIdentOrString();
    const args = [];
    
    if (this._is('with')) {
      this._next();
      while (this._peek() && !this._is('into') && !this._is('then') && !this._is('end')) {
        if (this._is('and') || this._is(',')) { this._next(); continue; }
        args.push(this._parseValue());
      }
    }
    
    let variable = null;
    if (this._is('into')) {
      this._next();
      variable = this._consumeMultiWordName(new Set(['then', 'end']));
    }
    
    return { type: 'newInstance', className, args, variable };
  }

  // ─── Modules ──────────────────────────────────────────────────────────────
  // import "utils.hl"
  // import "math" as mathLib
  // import add and subtract from "math.hl"
  _parseImport() {
    this._consume('import');
    
    // import X from "file"
    if (this._peek()?.type === 'IDENT' || this._peek()?.type === 'ACTION') {
      const imports = [];
      while (this._peek() && !this._is('from') && !this._is('as')) {
        if (this._is('and') || this._is(',')) { this._next(); continue; }
        imports.push(this._consumeIdentOrString());
      }
      if (this._is('from')) {
        this._next();
        const file = this._consumeIdentOrString();
        return { type: 'importFrom', imports, file };
      }
    }
    
    // import "file.hl" or import "file" as alias
    const file = this._consumeIdentOrString();
    let alias = null;
    if (this._is('as')) {
      this._next();
      alias = this._consumeIdentOrString();
    }
    return { type: 'import', file, alias };
  }

  // export myFunction
  // export the result
  _parseExport() {
    this._consume('export');
    const name = this._consumeMultiWordName(new Set(['then', 'end']));
    return { type: 'export', name };
  }

  // ─── Error Handling ───────────────────────────────────────────────────────
  // throw "Error message"
  // throw error "Something went wrong"
  _parseThrow() {
    if (this._is('throw')) this._consume('throw');
    else this._consume('raise');
    
    if (this._is('error') || this._is('exception')) this._next();
    const message = this._parseValue();
    return { type: 'throw', message };
  }

  // ─── Regex ────────────────────────────────────────────────────────────────
  // set pattern to regex "[0-9]+" with flags "gi"
  // regex "[a-z]+" into myPattern
  _parseRegex() {
    this._consume('regex');
    const pattern = this._consumeIdentOrString();
    let flags = '';
    if (this._is('with') || this._is('flags')) {
      this._next();
      if (this._is('flags')) this._next();
      flags = this._consumeIdentOrString();
    }
    let variable = null;
    if (this._is('into')) {
      this._next();
      variable = this._consumeMultiWordName(new Set(['then', 'end']));
    }
    return { type: 'regex', pattern, flags, variable };
  }

  // test "hello123" against pattern "[0-9]+" into result
  // test text matches pattern into result
  _parseRegexTest() {
    this._consume('test');
    const text = this._parseValue();
    if (this._is('against') || this._is('matches') || this._is('with')) this._next();
    if (this._is('pattern')) this._next();
    const pattern = this._parseValue();
    let flags = '';
    if (this._is('with') || this._is('flags')) {
      this._next();
      if (this._is('flags')) this._next();
      flags = this._consumeIdentOrString();
    }
    let variable = null;
    if (this._is('into')) {
      this._next();
      variable = this._consumeMultiWordName(new Set(['then', 'end']));
    }
    return { type: 'regexTest', text, pattern, flags, variable };
  }

  // extract "[0-9]+" from "hello123" into matches
  // extract pattern from text into results
  _parseRegexExtract() {
    this._consume('extract');
    const pattern = this._parseValue();
    if (this._is('from')) this._next();
    const text = this._parseValue();
    let flags = 'g';
    if (this._is('with') || this._is('flags')) {
      this._next();
      if (this._is('flags')) this._next();
      flags = this._consumeIdentOrString();
    }
    let variable = null;
    if (this._is('into')) {
      this._next();
      variable = this._consumeMultiWordName(new Set(['then', 'end']));
    }
    return { type: 'regexExtract', pattern, text, flags, variable };
  }

  // ─── Child Processes ──────────────────────────────────────────────────────
  // execute "ls -la" into result
  // execute command "npm install" into output
  _parseExecuteCommand() {
    this._consume('execute');
    if (this._is('command')) this._next();
    const command = this._parseValue();
    let variable = null;
    if (this._is('into')) {
      this._next();
      variable = this._consumeMultiWordName(new Set(['then', 'end']));
    }
    return { type: 'executeCommand', command, variable };
  }

  // shell "echo hello" into result
  _parseShellCommand() {
    this._consume('shell');
    const command = this._parseValue();
    let variable = null;
    if (this._is('into')) {
      this._next();
      variable = this._consumeMultiWordName(new Set(['then', 'end']));
    }
    return { type: 'shellCommand', command, variable };
  }

  // ─── WebSockets ───────────────────────────────────────────────────────────
  // connect to websocket "ws://localhost:8080" into mySocket
  // connect websocket "ws://localhost:8080" as mySocket
  _parseConnectWebSocket() {
    this._consume('connect');
    if (this._is('to')) this._next();
    if (this._is('websocket') || this._is('socket')) this._next();
    const url = this._parseValue();
    let variable = null;
    if (this._is('into') || this._is('as')) {
      this._next();
      variable = this._consumeMultiWordName(new Set(['then', 'end']));
    }
    return { type: 'connectWebSocket', url, variable };
  }

  // broadcast "message" to all clients
  // broadcast data to room "lobby"
  _parseBroadcast() {
    this._consume('broadcast');
    const message = this._parseValue();
    let target = 'all';
    if (this._is('to')) {
      this._next();
      if (this._is('all')) { this._next(); if (this._is('clients')) this._next(); }
      else if (this._is('room') || this._is('channel')) {
        this._next();
        target = { type: 'room', name: this._consumeIdentOrString() };
      } else {
        target = this._consumeIdentOrString();
      }
    }
    return { type: 'broadcast', message, target };
  }

  // ─── Database ─────────────────────────────────────────────────────────────
  // query "SELECT * FROM users" into results
  // query database with "SELECT * FROM users" into results
  _parseQuery() {
    this._consume('query');
    if (this._is('database') || this._is('db')) this._next();
    if (this._is('with')) this._next();
    const sql = this._parseValue();
    let params = [];
    if (this._is('with') || this._is('params') || this._is('parameters')) {
      this._next();
      if (this._is('params') || this._is('parameters')) this._next();
      // Parse array of params
      if (this._isType('LBRACKET') || this._peek()?.value === '[') {
        const p = this._parseValue();
        params = p;
      }
    }
    let variable = null;
    if (this._is('into')) {
      this._next();
      variable = this._consumeMultiWordName(new Set(['then', 'end']));
    }
    return { type: 'dbQuery', sql, params, variable };
  }

  // insert into "users" with { name: "John", age: 30 }
  // insert { name: "John" } into table "users"
  _parseInsert() {
    this._consume('insert');
    let table, data;
    if (this._is('into')) {
      this._next();
      if (this._is('table')) this._next();
      table = this._consumeIdentOrString();
      if (this._is('with') || this._is('values') || this._is('data')) {
        this._next();
        data = this._parseValue();
      }
    } else {
      data = this._parseValue();
      if (this._is('into')) {
        this._next();
        if (this._is('table')) this._next();
        table = this._consumeIdentOrString();
      }
    }
    return { type: 'dbInsert', table, data };
  }

  // select from "users" where "age > 18" into results
  // select * from table "users" into results
  _parseSelect() {
    this._consume('select');
    let columns = '*';
    if (!this._is('from') && !this._is('*')) {
      const cols = [];
      while (this._peek() && !this._is('from')) {
        if (this._is('and') || this._is(',')) { this._next(); continue; }
        cols.push(this._consumeIdentOrString());
      }
      columns = cols;
    } else if (this._is('*')) {
      this._next();
    }
    if (this._is('from')) this._next();
    if (this._is('table')) this._next();
    const table = this._consumeIdentOrString();
    let where = null;
    if (this._is('where')) {
      this._next();
      where = this._parseValue();
    }
    let limit = null, offset = null;
    if (this._is('limit')) { this._next(); limit = this._parseValue(); }
    if (this._is('offset')) { this._next(); offset = this._parseValue(); }
    let variable = null;
    if (this._is('into')) {
      this._next();
      variable = this._consumeMultiWordName(new Set(['then', 'end']));
    }
    return { type: 'dbSelect', columns, table, where, limit, offset, variable };
  }

  // ─── Async/Await ──────────────────────────────────────────────────────────
  // await fetch "url" into result
  // await promise into result
  _parseAwait() {
    this._consume('await');
    // The next part could be a fetch, promise variable, or function call
    if (this._is('fetch')) {
      const fetchStmt = this._parseFetch();
      fetchStmt.isAsync = true;
      return { type: 'await', expr: fetchStmt };
    }
    if (this._is('call')) {
      const callStmt = this._parseCall();
      return { type: 'await', expr: callStmt };
    }
    // await somePromise into result
    const promise = this._parseValue();
    let variable = null;
    if (this._is('into')) {
      this._next();
      variable = this._consumeMultiWordName(new Set(['then', 'end']));
    }
    return { type: 'await', expr: promise, variable };
  }

  // ── after X seconds do ... end ────────────────────────────────────────────
  // setTimeout equivalent
  _parseAfter() {
    this._consume('after');
    const delay = this._parseValue();
    if (this._is('seconds') || this._is('second')) this._next();
    if (this._is('do') || this._is('then')) this._next();
    const body = this._parseBody(['end']);
    if (this._is('end')) this._next();
    return { type: 'setTimeout', delay, body };
  }

  // ── interval X seconds do ... end ─────────────────────────────────────────
  // setInterval equivalent
  _parseInterval() {
    this._consume('interval');
    let id = null;
    // Optional: interval myTimer X seconds
    const maybeId = this._peek();
    if (maybeId && (maybeId.type === 'IDENT' || maybeId.type === 'PREP') && this._peek(1)?.type === 'NUMBER') {
      id = this._consumeIdent();
    }
    const delay = this._parseValue();
    if (this._is('seconds') || this._is('second')) this._next();
    if (this._is('do') || this._is('then')) this._next();
    const body = this._parseBody(['end']);
    if (this._is('end')) this._next();
    return { type: 'setInterval', delay, body, id };
  }

  // ── check if X contains Y into result ─────────────────────────────────────
  // Grammatically correct contains check
  _parseCheck() {
    this._consume('check');
    if (this._is('if')) this._next();
    const haystack = this._consumeIdent();
    let checkType = 'contains';
    if (this._is('contains') || this._is('has') || this._is('includes')) {
      checkType = 'contains';
      this._next();
    } else if (this._is('starts')) {
      this._next();
      if (this._is('with')) this._next();
      checkType = 'startsWith';
    } else if (this._is('ends')) {
      this._next();
      if (this._is('with')) this._next();
      checkType = 'endsWith';
    }
    const needle = this._parsePrimary();
    if (this._is('into')) this._next();
    const out = this._consumeIdent();
    return { type: 'checkContains', haystack, needle, checkType, out };
  }

  // ── define lambda double as x times 2 ─────────────────────────────────────
  // Arrow/lambda functions: define lambda name with param as expression
  _parseLambda() {
    this._consume('lambda');
    const name = this._consumeIdent();
    let params = [];
    if (this._is('with')) {
      this._next();
      while (this._peek() && !this._is('as') && !this._is('do') && !this._is('then')) {
        params.push(this._consumeIdent());
        if (this._is('and') || this._is(',')) this._next(); else break;
      }
    }
    if (this._is('as') || this._is('do') || this._is('then')) this._next();
    const expr = this._parseValue();
    return { type: 'defineLambda', name, params, expr };
  }

  // ── extract name and age from person into extracted ───────────────────────
  // Destructuring objects/arrays
  _parseExtract() {
    this._consume('extract');
    const keys = [];
    while (this._peek() && !this._is('from')) {
      keys.push(this._consumeIdent());
      if (this._is('and') || this._is(',')) this._next(); else break;
    }
    if (this._is('from')) this._next();
    const source = this._consumeIdent();
    let into = null;
    if (this._is('into')) {
      this._next();
      into = this._consumeIdent();
    }
    return { type: 'destructure', keys, source, into };
  }

  // ── spread items into newList ─────────────────────────────────────────────
  // Spread operator
  _parseSpread() {
    this._consume('spread');
    const sources = [];
    while (this._peek() && !this._is('into')) {
      sources.push(this._consumeIdent());
      if (this._is('and') || this._is(',')) this._next(); else break;
    }
    if (this._is('into')) this._next();
    const out = this._consumeIdent();
    return { type: 'spread', sources, out };
  }

  // ── hash "text" using sha256 into result ──────────────────────────────────
  // Crypto hashing
  _parseHash() {
    this._consume('hash');
    const input = this._parseValue();
    let algorithm = 'sha256';
    if (this._is('using') || this._is('with')) {
      this._next();
      algorithm = this._consumeIdent();
    }
    if (this._is('into')) this._next();
    const out = this._consumeIdent();
    return { type: 'hash', input, algorithm, out };
  }

  // ── encrypt "text" using "key" into result ────────────────────────────────
  _parseEncrypt() {
    this._consume('encrypt');
    const input = this._parseValue();
    let key = null;
    if (this._is('using') || this._is('with')) {
      this._next();
      key = this._parseValue();
    }
    if (this._is('into')) this._next();
    const out = this._consumeIdent();
    return { type: 'encrypt', input, key, out };
  }

  // ── decode base64 "encoded" into result ───────────────────────────────────
  _parseDecode() {
    this._consume('decode');
    let encoding = 'base64';
    if (this._is('base64') || this._is('hex') || this._is('utf8')) {
      encoding = this._consumeIdent();
    }
    const input = this._parseValue();
    if (this._is('into')) this._next();
    const out = this._consumeIdent();
    return { type: 'decode', encoding, input, out };
  }

  // ── encode "text" as base64 into result ───────────────────────────────────
  _parseEncode() {
    this._consume('encode');
    const input = this._parseValue();
    let encoding = 'base64';
    if (this._is('as') || this._is('to')) {
      this._next();
      encoding = this._consumeIdent();
    }
    if (this._is('into')) this._next();
    const out = this._consumeIdent();
    return { type: 'encode', encoding, input, out };
  }

  // ── buffer from "text" into buf ───────────────────────────────────────────
  _parseBuffer() {
    this._consume('buffer');
    if (this._is('from')) this._next();
    const input = this._parseValue();
    let encoding = 'utf8';
    if (this._is('as') || this._is('encoding')) {
      this._next();
      encoding = this._consumeIdent();
    }
    if (this._is('into')) this._next();
    const out = this._consumeIdent();
    return { type: 'createBuffer', input, encoding, out };
  }

  // ── safely get X from obj otherwise default into result ───────────────────
  // Optional chaining + nullish coalescing
  _parseSafeGet() {
    this._consume('safely');
    if (this._is('get')) this._next();
    const key = this._parseValue();
    if (this._is('from') || this._is('of')) this._next();
    const source = this._consumeIdent();
    let defaultVal = { type: 'null', value: null };
    if (this._is('otherwise') || this._is('or') || this._is('default')) {
      this._next();
      defaultVal = this._parseValue();
    }
    if (this._is('into')) this._next();
    const out = this._consumeIdent();
    return { type: 'safeGet', source, key, defaultVal, out };
  }

  // ── define generator counter starting at 0 yields value then increase value by 1 end ──
  // ── define generator counter with value starting at 0 do ... produce value ... end ──
  // Also supports: generator counter starting at n as 0 do ... yield n ... end
  _parseGenerator() {
    this._consume('generator');
    // Skip 'called' or 'named' if present
    if (this._is('called') || this._is('named')) this._next();
    const name = this._consumeIdent();
    let initVar = null;
    let initVal = { type: 'number', value: 0 };
    if (this._is('with') || this._is('starting') || this._is('using')) {
      this._next();
      // "with value starting at 0" or "starting at n as 0"
      if (this._is('value') || this._is('counter') || this._is('index')) {
        initVar = this._consumeIdent();
      } else {
        initVar = this._consumeIdent();
      }
      if (this._is('starting') || this._is('from') || this._is('at')) this._next();
      if (this._is('at')) this._next();
      if (this._is('as') || this._is('be') || this._is('equals')) this._next();
      initVal = this._parseValue();
    }
    if (this._is('do') || this._is('then')) this._next();
    const body = this._parseBody(['end']);
    if (this._is('end')) this._consume('end');
    return { type: 'defineGenerator', name, initVar, initVal, body };
  }

  // ── produce value ── (alternative to yield for more natural English)
  // Also supports: yield value, emit value, generate value
  _parseYield() {
    this._consume('yield');
    const value = this._parseValue();
    return { type: 'yield', value };
  }

  // ── wrap target with handler into result ──
  // Also supports: create proxy for target using handler into result
  // Also supports: proxy target with handler into result
  _parseProxy() {
    this._consume('proxy');
    // Skip 'for' or 'of' if present
    if (this._is('for') || this._is('of')) this._next();
    const target = this._consumeIdent();
    let traps = [];
    if (this._is('with') || this._is('using')) {
      this._next();
      if (this._is('handler') || this._is('traps')) this._next();
      // Parse inline traps or reference to handler object
      if (this._peek()?.type === 'IDENT' && !this._is('into')) {
        traps = [{ type: 'reference', name: this._consumeIdent() }];
      }
    }
    if (this._is('into') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'createProxy', target, traps, out };
  }

  // ── when getting property from target do ... end ──
  // Also supports: intercept get on proxyName do ... end
  // Also supports: on access to target do ... end
  _parseIntercept() {
    this._consume('intercept');
    const trapType = this._consumeIdent(); // get, set, has, delete, etc.
    // Skip connecting words
    if (this._is('on') || this._is('from') || this._is('of') || this._is('for')) this._next();
    const target = this._consumeIdent();
    if (this._is('with') || this._is('do') || this._is('then')) this._next();
    const body = this._parseBody(['end']);
    if (this._is('end')) this._consume('end');
    return { type: 'interceptTrap', trapType, target, body };
  }

  // ── create weak map called myWeakMap ──
  // Also supports: weakmap into myWeakMap
  _parseWeakMap() {
    this._consume('weakmap');
    // Skip 'called' or 'named' if present
    if (this._is('called') || this._is('named')) this._next();
    if (this._is('into') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'createWeakMap', out };
  }

  // ── create weak set called myWeakSet ──
  // Also supports: weakset into myWeakSet
  _parseWeakSet() {
    this._consume('weakset');
    // Skip 'called' or 'named' if present
    if (this._is('called') || this._is('named')) this._next();
    if (this._is('into') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'createWeakSet', out };
  }

  // ── create symbol with description "myDesc" called mySymbol ──
  // Also supports: create unique symbol called mySymbol
  // Also supports: symbol "description" into mySymbol
  _parseSymbol() {
    this._consume('symbol');
    let description = null;
    let isUnique = false;
    // Check for 'unique' or 'global'
    if (this._is('unique') || this._is('global') || this._is('shared')) {
      this._next();
      isUnique = true;
    }
    // Check for 'with description'
    if (this._is('with')) {
      this._next();
      if (this._is('description')) this._next();
    }
    // Get description if it's a string
    if (this._peek()?.type === 'STRING') {
      description = this._next().value;
    } else if (this._peek()?.type === 'IDENT' && !this._is('into') && !this._is('called') && !this._is('as') && !this._is('named')) {
      description = this._consumeIdent();
    }
    // Skip 'called', 'named', 'into', 'as'
    if (this._is('called') || this._is('named') || this._is('into') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'createSymbol', description, isUnique, out };
  }

  // ── create big integer from "999999999" called myBigInt ──
  // Also supports: bigint "999999999" into myBigInt
  // Also supports: big integer 12345 into myBigInt
  _parseBigInt() {
    this._consume('bigint');
    // Skip 'integer' if present (for "big integer")
    if (this._is('integer')) this._next();
    let value;
    if (this._is('from') || this._is('of')) {
      this._next();
      value = this._parseValue();
    } else {
      value = this._parseValue();
    }
    // Skip 'called', 'named', 'into', 'as'
    if (this._is('called') || this._is('named') || this._is('into') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'createBigInt', value, out };
  }

  // ── process template "Hello {name}" using myTagFn into result ──
  // Also supports: apply myTagFn to "Hello {name}" into result
  // Also supports: tag myTagFn with "Hello {name}" into result
  _parseTaggedTemplate() {
    this._consume('tag');
    const tagFn = this._consumeIdent();
    // Skip connecting words
    if (this._is('with') || this._is('to') || this._is('on')) this._next();
    if (this._is('template')) this._next();
    const template = this._parseValue();
    // Skip 'called', 'into', 'as'
    if (this._is('called') || this._is('into') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'taggedTemplate', tagFn, template, out };
  }

  // English-friendly alias: "process template '...' using myTagFn into result"
  _parseProcess() {
    this._consume('process');
    // Skip 'template'
    if (this._is('template')) this._next();
    const template = this._parseValue();
    // Skip 'using', 'with'
    if (this._is('using') || this._is('with')) this._next();
    const tagFn = this._consumeIdent();
    // Skip 'into', 'called', 'as'
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'taggedTemplate', tagFn, template, out };
  }

  // English-friendly alias: "wrap target with handler into result"
  _parseWrap() {
    this._consume('wrap');
    const target = this._consumeIdent();
    // Skip 'with', 'using'
    if (this._is('with') || this._is('using')) this._next();
    const handler = this._consumeIdent();
    // Skip 'into', 'called', 'as'
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'proxy', target, handler, out };
  }

  // English-friendly alias: "combine listA and listB into mergedList"
  _parseCombine() {
    this._consume('combine');
    const sources = [this._consumeIdent()];
    // Consume additional sources separated by 'and', ',', 'with'
    while (this._is('and') || this._is('with') || (this._peek2()?.type === 'PUNCT' && this._peek2()?.value === ',')) {
      if (this._peek2()?.type === 'PUNCT') this._next();
      this._next();
      sources.push(this._consumeIdent());
    }
    // Skip 'into', 'as', 'called'
    if (this._is('into') || this._is('as') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'spread', sources, out };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROMISE API PARSERS
  // ═══════════════════════════════════════════════════════════════════════════

  // "promise resolve 42 into result" or "promise reject 'error' into result"
  _parsePromise() {
    this._consume('promise');
    const action = this._consumeIdent(); // 'resolve' or 'reject'
    const value = this._parseValue();
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'promise', action, value, out };
  }

  // "all promises listOfPromises into results" or "parallel promises into results"
  _parsePromiseAll() {
    this._next(); // consume 'all' or 'parallel'
    if (this._is('promises')) this._next();
    const promises = this._consumeIdent();
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'promiseAll', promises, out };
  }

  // "race promises listOfPromises into winner"
  _parsePromiseRace() {
    this._consume('race');
    if (this._is('promises')) this._next();
    const promises = this._consumeIdent();
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'promiseRace', promises, out };
  }

  // "settle promises listOfPromises into results"
  _parsePromiseAllSettled() {
    this._consume('settle');
    if (this._is('promises') || this._is('all')) this._next();
    const promises = this._consumeIdent();
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'promiseAllSettled', promises, out };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // OBJECT METHODS PARSERS
  // ═══════════════════════════════════════════════════════════════════════════

  // "freezeobj myObject"
  _parseFreezeObj() {
    this._consume('freezeobj');
    const obj = this._consumeIdent();
    return { type: 'freezeObj', obj };
  }

  // "sealobj myObject"
  _parseSealObj() {
    this._consume('sealobj');
    const obj = this._consumeIdent();
    return { type: 'sealObj', obj };
  }

  // "compare a with b into result" (Object.is)
  _parseObjectIs() {
    this._consume('compare');
    const a = this._parseValue();
    if (this._is('with') || this._is('to') || this._is('and')) this._next();
    const b = this._parseValue();
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'objectIs', a, b, out };
  }

  // "frompairs entries into object" (Object.fromEntries)
  _parseFromPairs() {
    this._consume('frompairs');
    const entries = this._consumeIdent();
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'fromPairs', entries, out };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ARRAY METHODS PARSERS
  // ═══════════════════════════════════════════════════════════════════════════

  // "arrayfrom iterable into array"
  _parseArrayFrom() {
    this._consume('arrayfrom');
    const iterable = this._consumeIdent();
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'arrayFrom', iterable, out };
  }

  // "isarray value into result"
  _parseIsArray() {
    this._consume('isarray');
    const value = this._consumeIdent();
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'isArray', value, out };
  }

  // "flatmap arr with fn into result"
  _parseFlatMap() {
    this._consume('flatmap');
    const arr = this._consumeIdent();
    if (this._is('with') || this._is('using')) this._next();
    const fn = this._consumeIdent();
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'flatMap', arr, fn, out };
  }

  // "fillarr arr with value" or "fillarr arr with value from 0 to 5"
  _parseFillArray() {
    this._consume('fillarr');
    const arr = this._consumeIdent();
    if (this._is('with')) this._next();
    const value = this._parseValue();
    let start = null, end = null;
    if (this._is('from')) {
      this._next();
      start = this._parseValue();
      if (this._is('to')) {
        this._next();
        end = this._parseValue();
      }
    }
    return { type: 'fillArray', arr, value, start, end };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DATE/TIME PARSERS
  // ═══════════════════════════════════════════════════════════════════════════

  // "date create into myDate" or "date from '2024-01-01' into myDate"
  _parseDate() {
    this._consume('date');
    let dateValue = null;
    if (this._is('create') || this._is('new')) {
      this._next();
    } else if (this._is('from')) {
      this._next();
      dateValue = this._parseValue();
    } else {
      // Try to parse a value directly
      try { dateValue = this._parseValue(); } catch(e) {}
    }
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'dateCreate', dateValue, out };
  }

  // "now into currentTime"
  _parseNow() {
    this._consume('now');
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'now', out };
  }

  // "timestamp from myDate into ts" or "timestamp into ts"
  _parseTimestamp() {
    this._consume('timestamp');
    let dateVar = null;
    if (this._is('from') || this._is('of')) {
      this._next();
      dateVar = this._consumeIdent();
    }
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'timestamp', dateVar, out };
  }

  // "toiso myDate into isoString"
  _parseToISO() {
    this._consume('toiso');
    const dateVar = this._consumeIdent();
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'toISO', dateVar, out };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TYPED ARRAYS PARSERS
  // ═══════════════════════════════════════════════════════════════════════════

  // "uint8 from [1, 2, 3] into arr" or "uint8 size 10 into arr"
  _parseTypedArray(arrayType) {
    this._next(); // consume the type keyword
    let source = null, size = null;
    if (this._is('from')) {
      this._next();
      source = this._parseValue();
    } else if (this._is('size') || this._is('length')) {
      this._next();
      size = this._parseValue();
    } else {
      // Try to parse as source directly
      try { source = this._parseValue(); } catch(e) {}
    }
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'typedArray', arrayType, source, size, out };
  }

  // "arraybuffer size 16 into buf"
  _parseArrayBuffer() {
    this._consume('arraybuffer');
    if (this._is('size') || this._is('length')) this._next();
    const size = this._parseValue();
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'arrayBuffer', size, out };
  }

  // "view buffer from offset with length into dv"
  _parseDataView() {
    this._consume('view');
    const buffer = this._consumeIdent();
    let offset = null, length = null;
    if (this._is('from') || this._is('offset')) {
      this._next();
      offset = this._parseValue();
    }
    if (this._is('with') || this._is('length')) {
      this._next();
      length = this._parseValue();
    }
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'dataView', buffer, offset, length, out };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // REFLECT API PARSERS
  // ═══════════════════════════════════════════════════════════════════════════

  // "reflect get property from obj into value"
  _parseReflect() {
    this._consume('reflect');
    const action = this._consumeIdent(); // 'get', 'set', 'has', 'delete'
    if (action === 'get') {
      if (this._is('property')) this._next();
      const prop = this._parseValue();
      if (this._is('from') || this._is('of')) this._next();
      const obj = this._consumeIdent();
      if (this._is('into') || this._is('called') || this._is('as')) this._next();
      const out = this._consumeIdent();
      return { type: 'reflectGet', obj, prop, out };
    } else if (action === 'set') {
      if (this._is('property')) this._next();
      const prop = this._parseValue();
      if (this._is('on') || this._is('of') || this._is('in')) this._next();
      const obj = this._consumeIdent();
      if (this._is('to')) this._next();
      const value = this._parseValue();
      return { type: 'reflectSet', obj, prop, value };
    } else if (action === 'has') {
      if (this._is('property')) this._next();
      const prop = this._parseValue();
      if (this._is('in') || this._is('on') || this._is('of')) this._next();
      const obj = this._consumeIdent();
      if (this._is('into') || this._is('called') || this._is('as')) this._next();
      const out = this._consumeIdent();
      return { type: 'reflectHas', obj, prop, out };
    } else if (action === 'delete') {
      if (this._is('property')) this._next();
      const prop = this._parseValue();
      if (this._is('from') || this._is('of') || this._is('in')) this._next();
      const obj = this._consumeIdent();
      return { type: 'reflectDelete', obj, prop };
    }
    return null;
  }

  // Shorthand: "reflectget 'name' from obj into value"
  _parseReflectGet() {
    this._consume('reflectget');
    const prop = this._parseValue();
    if (this._is('from') || this._is('of')) this._next();
    const obj = this._consumeIdent();
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'reflectGet', obj, prop, out };
  }

  // Shorthand: "reflectset 'name' on obj to 'value'"
  _parseReflectSet() {
    this._consume('reflectset');
    const prop = this._parseValue();
    if (this._is('on') || this._is('of') || this._is('in')) this._next();
    const obj = this._consumeIdent();
    if (this._is('to')) this._next();
    const value = this._parseValue();
    return { type: 'reflectSet', obj, prop, value };
  }

  // Shorthand: "reflecthas 'name' in obj into result"
  _parseReflectHas() {
    this._consume('reflecthas');
    const prop = this._parseValue();
    if (this._is('in') || this._is('on') || this._is('of')) this._next();
    const obj = this._consumeIdent();
    if (this._is('into') || this._is('called') || this._is('as')) this._next();
    const out = this._consumeIdent();
    return { type: 'reflectHas', obj, prop, out };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INTL FORMATTING PARSERS
  // ═══════════════════════════════════════════════════════════════════════════

  // "formatdate myDate with locale 'en-US' into formatted"
  _parseFormatDate() {
    this._consume('formatdate');
    const dateVar = this._consumeIdent();
    let locale = 'en-US', options = {};
    if (this._is('with') || this._is('using')) {
      this._next();
      if (this._is('locale')) {
        this._next();
        const locVal = this._parseValue();
        locale = locVal.value || locVal;
      }
    }
    if (this._is('as') || this._is('style')) {
      this._next();
      const style = this._consumeIdent(); // 'short', 'medium', 'long', 'full'
      options.dateStyle = style;
    }
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'formatDate', dateVar, locale, options, out };
  }

  // "formatnumber value with locale 'en-US' into formatted"
  _parseFormatNumber() {
    this._consume('formatnumber');
    const value = this._parseValue();
    let locale = 'en-US', options = {};
    if (this._is('with') || this._is('using')) {
      this._next();
      if (this._is('locale')) {
        this._next();
        const locVal = this._parseValue();
        locale = locVal.value || locVal;
      }
    }
    if (this._is('as') || this._is('style')) {
      this._next();
      const style = this._consumeIdent(); // 'decimal', 'percent', 'currency'
      options.style = style;
    }
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'formatNumber', value, locale, options, out };
  }

  // "currency value as 'USD' with locale 'en-US' into formatted"
  _parseCurrency() {
    this._consume('currency');
    const value = this._parseValue();
    let currencyCode = 'USD', locale = 'en-US';
    if (this._is('as') || this._is('in')) {
      this._next();
      const cc = this._parseValue();
      currencyCode = cc.value || cc;
    }
    if (this._is('with') || this._is('using')) {
      this._next();
      if (this._is('locale')) this._next();
      const loc = this._parseValue();
      locale = loc.value || loc;
    }
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'currency', value, currencyCode, locale, out };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MISSING JS FEATURES - PARSERS
  // ═══════════════════════════════════════════════════════════════════════════

  // Promise.any - "anyof promises into winner" or "first of promises into winner"
  _parsePromiseAny() {
    this._next(); // consume 'anyof' or 'first'
    if (this._is('of')) this._next();
    if (this._is('promises')) this._next();
    const promises = this._consumeIdent();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'promiseAny', promises, out };
  }

  // Object.defineProperty - "defineprop obj 'name' with value 123"
  _parseDefineProperty() {
    this._consume('defineprop');
    const obj = this._consumeIdent();
    const prop = this._parseValue();
    let descriptor = {};
    if (this._is('with')) {
      this._next();
      // Parse descriptor properties
      while (!this._is('into') && !this._is('called') && this._peek()) {
        const key = this._consumeIdent();
        const val = this._parseValue();
        descriptor[key] = val;
        if (this._is('and')) this._next();
      }
    }
    return { type: 'defineProperty', obj, prop, descriptor };
  }

  // Object.getOwnPropertyDescriptor - "getdescriptor obj 'name' into desc"
  _parseGetDescriptor() {
    this._consume('getdescriptor');
    const obj = this._consumeIdent();
    const prop = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'getDescriptor', obj, prop, out };
  }

  // Object.getPrototypeOf - "getprototype obj into proto"
  _parseGetPrototype() {
    this._consume('getprototype');
    if (this._is('of')) this._next();
    const obj = this._consumeIdent();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'getPrototype', obj, out };
  }

  // Object.setPrototypeOf - "setprototype obj to proto"
  _parseSetPrototype() {
    this._consume('setprototype');
    if (this._is('of')) this._next();
    const obj = this._consumeIdent();
    if (this._is('to')) this._next();
    const proto = this._consumeIdent();
    return { type: 'setPrototype', obj, proto };
  }

  // Array.reduceRight - "reduceright arr with fn starting 0 into result"
  _parseReduceRight() {
    this._consume('reduceright');
    const arr = this._consumeIdent();
    if (this._is('with') || this._is('using')) this._next();
    const fn = this._consumeIdent();
    let initial = null;
    if (this._is('starting') || this._is('from')) {
      this._next();
      initial = this._parseValue();
    }
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'reduceRight', arr, fn, initial, out };
  }

  // Array.copyWithin - "copywithin arr to 0 from 3 to 5"
  _parseCopyWithin() {
    this._consume('copywithin');
    const arr = this._consumeIdent();
    if (this._is('to')) this._next();
    const target = this._parseValue();
    let start = null, end = null;
    if (this._is('from')) {
      this._next();
      start = this._parseValue();
    }
    if (this._is('to')) {
      this._next();
      end = this._parseValue();
    }
    return { type: 'copyWithin', arr, target, start, end };
  }

  // Array.at - "itemat arr -1 into last"
  _parseItemAt() {
    this._consume('itemat');
    const arr = this._consumeIdent();
    const index = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'itemAt', arr, index, out };
  }

  // Array.toSorted - "tosorted arr into sorted"
  _parseToSorted() {
    this._consume('tosorted');
    const arr = this._consumeIdent();
    let fn = null;
    if (this._is('with') || this._is('using')) {
      this._next();
      fn = this._consumeIdent();
    }
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'toSorted', arr, fn, out };
  }

  // Array.toReversed - "toreversed arr into reversed"
  _parseToReversed() {
    this._consume('toreversed');
    const arr = this._consumeIdent();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'toReversed', arr, out };
  }

  // String.replaceAll - "replaceall str 'old' with 'new' into result"
  _parseReplaceAll() {
    this._consume('replaceall');
    const str = this._consumeIdent();
    const search = this._parseValue();
    if (this._is('with')) this._next();
    const replacement = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'replaceAll', str, search, replacement, out };
  }

  // String.charAt (statement) - "charat str 0 into char"
  _parseCharAtStmt() {
    this._consume('charat');
    const str = this._consumeIdent();
    const index = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'charAt', str, index, out };
  }

  // String.normalize - "normalize str 'NFC' into normalized"
  _parseNormalize() {
    this._consume('normalize');
    const str = this._consumeIdent();
    let form = 'NFC';
    if (this._peek()?.type === 'STRING') {
      form = this._parseValue();
    }
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'normalize', str, form, out };
  }

  // String.localeCompare - "localecompare a with b into result"
  _parseLocaleCompare() {
    this._consume('localecompare');
    const a = this._consumeIdent();
    if (this._is('with') || this._is('to')) this._next();
    const b = this._consumeIdent();
    let locale = null;
    if (this._is('using') || this._is('locale')) {
      this._next();
      if (this._is('locale')) this._next();
      locale = this._parseValue();
    }
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'localeCompare', a, b, locale, out };
  }

  // Number.isInteger - "isinteger value into result"
  _parseIsInteger() {
    this._consume('isinteger');
    const value = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'isInteger', value, out };
  }

  // Number.isFinite - "isfinite value into result"
  _parseIsFinite() {
    this._consume('isfinite');
    const value = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'isFinite', value, out };
  }

  // Number.isNaN - "isnan value into result"
  _parseIsNaN() {
    this._consume('isnan');
    const value = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'isNaN', value, out };
  }

  // parseFloat - "parsefloat str into num"
  _parseParseFloat() {
    this._consume('parsefloat');
    const str = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'parseFloat', str, out };
  }

  // parseInt - "parseint str 10 into num" (with optional radix)
  _parseParseInt() {
    this._consume('parseint');
    const str = this._parseValue();
    let radix = null;
    if (this._peek()?.type === 'NUMBER') {
      radix = this._parseValue();
    } else if (this._is('base')) {
      this._next();
      radix = this._parseValue();
    }
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'parseInt', str, radix, out };
  }

  // toFixed - "tofixed num 2 into str"
  _parseToFixed() {
    this._consume('tofixed');
    const num = this._parseValue();
    const digits = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'toFixed', num, digits, out };
  }

  // toPrecision - "toprecision num 5 into str"
  _parseToPrecision() {
    this._consume('toprecision');
    const num = this._parseValue();
    const precision = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'toPrecision', num, precision, out };
  }

  // Math.trunc - "trunc value into result"
  _parseTrunc() {
    this._consume('trunc');
    const value = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'trunc', value, out };
  }

  // Math.cbrt - "cbrt value into result"
  _parseCbrt() {
    this._consume('cbrt');
    const value = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'cbrt', value, out };
  }

  // Math.hypot - "hypot a b into result" or "hypot a b c into result"
  _parseHypot() {
    this._consume('hypot');
    const values = [];
    while (!this._is('into') && !this._is('called') && this._peek()) {
      values.push(this._parseValue());
      if (this._is('and')) this._next();
    }
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'hypot', values, out };
  }

  // Math.log2 - "log2 value into result"
  _parseLog2() {
    this._consume('log2');
    const value = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'log2', value, out };
  }

  // Math.log10 - "log10 value into result"
  _parseLog10() {
    this._consume('log10');
    const value = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'log10', value, out };
  }

  // Math.sinh - "sinh value into result"
  _parseSinh() {
    this._consume('sinh');
    const value = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'sinh', value, out };
  }

  // Math.cosh - "cosh value into result"
  _parseCosh() {
    this._consume('cosh');
    const value = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'cosh', value, out };
  }

  // Math.tanh - "tanh value into result"
  _parseTanh() {
    this._consume('tanh');
    const value = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'tanh', value, out };
  }

  // URL - "url 'https://example.com' into myUrl"
  _parseURL() {
    this._consume('url');
    const urlStr = this._parseValue();
    let base = null;
    if (this._is('base') || this._is('from')) {
      this._next();
      base = this._parseValue();
    }
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'url', urlStr, base, out };
  }

  // URLSearchParams - "searchparams 'a=1&b=2' into params"
  _parseSearchParams() {
    this._consume('searchparams');
    const init = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'searchParams', init, out };
  }

  // console.table - "table data"
  _parseConsoleTable() {
    this._consume('table');
    const data = this._consumeIdent();
    return { type: 'consoleTable', data };
  }

  // console.group - "group 'label'"
  _parseConsoleGroup() {
    this._consume('group');
    let label = null;
    if (this._peek()?.type === 'STRING') {
      label = this._parseValue();
    }
    return { type: 'consoleGroup', label };
  }

  // console.groupEnd - "groupend"
  _parseConsoleGroupEnd() {
    this._consume('groupend');
    return { type: 'consoleGroupEnd' };
  }

  // console.time - "timestart 'label'"
  _parseConsoleTime() {
    this._consume('timestart');
    const label = this._parseValue();
    return { type: 'consoleTime', label };
  }

  // console.timeEnd - "timeend 'label'"
  _parseConsoleTimeEnd() {
    this._consume('timeend');
    const label = this._parseValue();
    return { type: 'consoleTimeEnd', label };
  }

  // console.assert - "assert condition 'message'"
  _parseConsoleAssert() {
    this._consume('assert');
    const condition = this._parseCondition();
    let message = null;
    if (this._peek()?.type === 'STRING') {
      message = this._parseValue();
    }
    return { type: 'consoleAssert', condition, message };
  }

  // structuredClone - "clone obj into copy"
  _parseClone() {
    this._consume('clone');
    const obj = this._consumeIdent();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'clone', obj, out };
  }

  // queueMicrotask - "microtask fn"
  _parseMicrotask() {
    this._consume('microtask');
    const fn = this._consumeIdent();
    return { type: 'microtask', fn };
  }

  // AbortController - "abort controller into ctrl signal into sig"
  _parseAbort() {
    this._consume('abort');
    if (this._is('controller')) this._next();
    if (this._is('into') || this._is('called')) this._next();
    const controller = this._consumeIdent();
    let signal = null;
    if (this._is('signal')) {
      this._next();
      if (this._is('into') || this._is('called')) this._next();
      signal = this._consumeIdent();
    }
    return { type: 'abortController', controller, signal };
  }

  // TextEncoder - "textencode str into bytes"
  _parseTextEncode() {
    this._consume('textencode');
    const str = this._parseValue();
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'textEncode', str, out };
  }

  // TextDecoder - "textdecode bytes into str"
  _parseTextDecode() {
    this._consume('textdecode');
    const bytes = this._consumeIdent();
    let encoding = 'utf-8';
    if (this._is('as') || this._is('using')) {
      this._next();
      const enc = this._parseValue();
      encoding = enc.value || enc;
    }
    if (this._is('into') || this._is('called')) this._next();
    const out = this._consumeIdent();
    return { type: 'textDecode', bytes, encoding, out };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERPRETER
// ═══════════════════════════════════════════════════════════════════════════

class HLInterpreter {
  constructor(world) {
    this.world          = world;
    this.ast            = null;
    this.eventRules     = new Map();
    this.conditionRules = [];
    this._lastChoice    = -1;
    this._definedEvents = new Map(); // stores bodies from "define event"
    this._functions     = new Map(); // stores user-defined functions
  }

  load(ast) {
    this.ast = ast;
    this.eventRules.clear();
    this.conditionRules = [];
    this._registerEvents();
  }

  async run() {
    if (!this.ast) return;
    if (this.ast.init && this.ast.init.length) {
      await this._executeBody(this.ast.init);
    }
  }

  _registerEvents() {
    if (!this.ast) return;
    for (const rule of this.ast.rules) {
      const ev = rule.event;
      if (ev.type === 'condition') {
        this.conditionRules.push(rule);
      } else {
        const key = this._eventKey(ev);
        if (key) {
          if (!this.eventRules.has(key)) this.eventRules.set(key, []);
          this.eventRules.get(key).push(rule);
        }
      }
    }
  }

  _eventKey(ev) {
    switch (ev.type) {
      case 'starts':       return `starts:${ev.subject}`;
      case 'touches':      return `touches:${ev.subject}:${ev.object}`;
      case 'presses':      return `presses:${ev.subject}:${ev.key}`;
      case 'clicks':       return `clicks:${ev.subject}`;
      case 'enters':       return `enters:${ev.subject}:${ev.zone}`;
      case 'leaves':       return `leaves:${ev.subject}:${ev.zone}`;
      case 'becomes':      return `becomes:${ev.subject}`;
      case 'combatStart':  return `combat:start:${ev.attacker}:${ev.defender}`;
      case 'combatHit':    return `combat:hit:${ev.attacker}:${ev.defender}`;
      case 'combatDefeat': return `combat:defeat:${ev.entity}`;
      case 'uses':         return `uses:${ev.subject}:${ev.item}`;
      case 'custom':       return ev.name;
      default: return null;
    }
  }

  async trigger(eventKey) {
    const rules = this.eventRules.get(eventKey) || [];
    for (const rule of rules) await this._executeBody(rule.body);
  }

  async evaluateFrame() {
    for (const rule of this.conditionRules) {
      if (this._evalConditionEvent(rule.event)) await this._executeBody(rule.body);
    }
  }

  _evalConditionEvent(event) {
    if (event.type !== 'condition') return false;
    const value = this.world ? this.world.getProperty(event.subject, event.prop) : undefined;
    return this._evalComparison(value, event.comparison);
  }

  _evalComparison(value, cmp) {
    if (!cmp) return false;
    const v = this._resolveValue(cmp.value);
    switch (cmp.op) {
      case 'less':       return value < v;
      case 'greater':    return value > v;
      case 'equal':      return value === v || String(value) === String(v);
      case 'between':    return value >= this._resolveValue(cmp.low) && value <= this._resolveValue(cmp.high);
      case 'empty':      return value === null || value === undefined || value === '' || value === 0 || value === false || (Array.isArray(value) && value.length === 0);
      case 'notEmpty':   return !(value === null || value === undefined || value === '' || value === 0 || value === false || (Array.isArray(value) && value.length === 0));
      case 'exists':     return value !== null && value !== undefined;
      case 'notExists':  return value === null || value === undefined;
      case 'nothing':    return value === null || value === undefined;
      case 'notNothing': return value !== null && value !== undefined;
      default: return false;
    }
  }

  _resolveValue(valNode) {
    if (!valNode) return undefined;
    if (typeof valNode === 'string' || typeof valNode === 'number' || typeof valNode === 'boolean') return valNode;
    // Ternary: if X then Y else Z
    if (valNode.type === 'ternary') {
      const condResult = this._evaluateCondition(valNode.condition);
      return condResult ? this._resolveValue(valNode.trueValue) : this._resolveValue(valNode.falseValue);
    }
    if (valNode.type === 'math') {
      const l = this._resolveValue(valNode.left);
      const r = this._resolveValue(valNode.right);
      switch (valNode.op) {
        case '+': return (typeof l === 'string' || typeof r === 'string') ? String(l) + String(r) : Number(l) + Number(r);
        case '-': return Number(l) - Number(r);
        case '*': return Number(l) * Number(r);
        case '/': return Number(r) !== 0 ? Number(l) / Number(r) : 0;
        case '%': return Number(l) % Number(r);
      }
    }
    // Function expressions (math, string, array ops)
    if (valNode.type === 'funcExpr') {
      const args = valNode.args.map(a => this._resolveValue(a));
      switch (valNode.fn) {
        case 'round':     return Math.round(Number(args[0]));
        case 'floor':     return Math.floor(Number(args[0]));
        case 'ceil':      return Math.ceil(Number(args[0]));
        case 'abs':       return Math.abs(Number(args[0]));
        case 'sqrt':      return Math.sqrt(Number(args[0]));
        case 'sign':      return Math.sign(Number(args[0]));
        case 'log':       return args[1] !== undefined ? Math.log(Number(args[0])) / Math.log(Number(args[1])) : Math.log(Number(args[0]));
        case 'clamp':     return Math.min(Math.max(Number(args[0]), Number(args[1])), Number(args[2]));
        case 'power':     return Math.pow(Number(args[0]), Number(args[1]));
        case 'min':       return Math.min(Number(args[0]), Number(args[1]));
        case 'max':       return Math.max(Number(args[0]), Number(args[1]));
        case 'random':    return Math.floor(Math.random() * (Number(args[1]) - Number(args[0]) + 1)) + Number(args[0]);
        case 'uppercase': return String(args[0]).toUpperCase();
        case 'lowercase': return String(args[0]).toLowerCase();
        case 'trim':      return String(args[0]).trim();
        case 'length':    return Array.isArray(args[0]) ? args[0].length : String(args[0]).length;
        case 'count':     return Array.isArray(args[0]) ? args[0].length : String(args[0]).length;
        case 'join':      // join(a, b) or join(a, b, sep)
          if (args[2] !== undefined) return String(args[0]) + String(args[2]) + String(args[1]);
          return String(args[0]) + String(args[1] ?? '');
        case 'arrayJoin': // join array with separator
          return Array.isArray(args[0]) ? args[0].join(String(args[1] ?? '')) : String(args[0]);
        case 'split':     return String(args[0]).split(String(args[1] ?? ' '));
        case 'typeOf':    { const _t = typeof args[0]; return Array.isArray(args[0]) ? 'array' : (args[0] === null ? 'nothing' : _t); }
        case 'indexOf':   return Array.isArray(args[0]) ? args[0].indexOf(args[1]) : String(args[0]).indexOf(String(args[1]));
        case 'slice':     return Array.isArray(args[0]) ? args[0].slice(Number(args[1]), args[2] !== undefined ? Number(args[2]) : undefined) : String(args[0]).slice(Number(args[1]), args[2] !== undefined ? Number(args[2]) : undefined);
        case 'object':    { const _obj = {}; for (let i = 0; i + 1 < args.length; i += 2) _obj[String(args[i])] = args[i+1]; return _obj; }
        case 'array':     return [...args];
        // New: array/string methods
        case 'includes':  return Array.isArray(args[0]) ? args[0].includes(args[1]) : String(args[0]).includes(String(args[1]));
        case 'find':      return Array.isArray(args[0]) ? (args[0].find(item => item === args[1]) ?? null) : null;
        case 'findIndex': return Array.isArray(args[0]) ? args[0].findIndex(item => item === args[1]) : -1;
        case 'startsWith': return String(args[0]).startsWith(String(args[1]));
        case 'endsWith':   return String(args[0]).endsWith(String(args[1]));
        default:          return undefined;
      }
    }
    if (valNode.type === 'null' || valNode.type === 'NULL') return null;
    // Array literal: [1, 2, 3]
    if (valNode.type === 'array') {
      return valNode.elements.map(el => this._resolveValue(el));
    }
    // Object literal: {key: value, ...}
    if (valNode.type === 'object') {
      const obj = {};
      const pairs = valNode.pairs || valNode.props || [];
      for (const pair of pairs) {
        obj[pair.key] = this._resolveValue(pair.value);
      }
      return obj;
    }
    // Math constants: math pi / math e / math infinity / math tau / math nan
    if (valNode.type === 'mathConst') {
      const _mc = { pi: Math.PI, e: Math.E, infinity: Infinity, tau: Math.PI * 2, nan: NaN, ln2: Math.LN2, sqrt2: Math.SQRT2, log2e: Math.LOG2E, log10e: Math.LOG10E };
      const _key = String(valNode.name).toLowerCase();
      return _mc.hasOwnProperty(_key) ? _mc[_key] : NaN;
    }
    // Inline call function "name" with args (used in value position)
    if (valNode.type === 'callExpr' || valNode.type === 'callFunction') {
      // Synchronous-ish: execute function and return value
      // We mark a special slot on world to capture return value
      const _fn = this._functions ? this._functions.get(valNode.id) : undefined;
      if (!_fn) return null;
      const w = this.world;
      const _savedVars = w ? { ...w._vars } : {};
      if (_fn.params && w) { _fn.params.forEach((p, i) => { w._vars[p] = this._resolveValue(valNode.args && valNode.args[i]); }); }
      let _retVal = null;
      // execute synchronously using a try/catch for _HL_RETURN
      const _execSync = (body) => {
        for (const s of (body || [])) {
          if (s.type === 'returnStmt') { const rv = this._resolveValue(s.value); throw { __hlReturn: true, value: rv }; }
          // Only handle simple stmts sync; complex ones fall through
          if (s.type === 'setVar' && w) w._vars[s.name] = this._resolveValue(s.value);
        }
      };
      try { _execSync(_fn.body); } catch(e) { if (e && e.__hlReturn) _retVal = e.value; }
      if (w) w._vars = _savedVars;
      return _retVal;
    }
    if (valNode.type === 'getObjKey') {
      const w = this.world;
      const obj = (w && w._vars && valNode.obj in w._vars) ? w._vars[valNode.obj] : null;
      if (obj && typeof obj === 'object') return obj[this._resolveValue(valNode.key)] ?? null;
      return null;
    }
    if (valNode.type === 'string') {
      return valNode.value.replace(/\{([\w.]+)\}/g, (_, vname) => {
        const w = this.world;
        if (vname.includes('.')) {
          const [entity, prop] = vname.split('.');
          if (w) { const v = w.getProperty(entity, prop); if (v !== undefined) return v; }
          return '';
        }
        if (w && w._vars && vname in w._vars) return w._vars[vname];
        if (w) { const v = w.getProperty('player', vname); if (v !== undefined) return v; }
        return '';
      });
    }
    // Interpolated string: parts array with {type: 'text'/'var', value: '...'}
    if (valNode.type === 'interpolatedString') {
      const w = this.world;
      return valNode.parts.map(part => {
        if (part.type === 'text') return part.value;
        if (part.type === 'var') {
          const vname = part.value;
          if (vname.includes('.')) {
            const [entity, prop] = vname.split('.');
            if (w) { const v = w.getProperty(entity, prop); if (v !== undefined) return v; }
            return '';
          }
          if (w && w._vars && vname in w._vars) return w._vars[vname];
          if (w) { const v = w.getProperty('player', vname); if (v !== undefined) return v; }
          return '';
        }
        return '';
      }).join('');
    }
    if (valNode.type === 'ident') {
      const w = this.world;
      if (w && w._vars && valNode.value in w._vars) return w._vars[valNode.value];
      if (w) { const v = w.getProperty('_vars', valNode.value); if (v !== undefined) return v; }
      return valNode.value;
    }
    return valNode.value;
  }

  _evaluateCondition(cond) {
    if (!cond) return true;
    switch (cond.type) {
      case 'not': return !this._evaluateCondition(cond.condition);
      case 'logical':
        if (cond.op === 'and') return this._evaluateCondition(cond.left) && this._evaluateCondition(cond.right);
        if (cond.op === 'or')  return this._evaluateCondition(cond.left) || this._evaluateCondition(cond.right);
        return false;
      case 'booleanLiteral':
        return cond.value;
      case 'valueComparison': {
        const left = this._resolveValue(cond.left);
        return this._evalComparison(left, cond.comparison);
      }
      case 'condition': {
        const val = this.world ? this.world.getProperty(cond.subject, cond.prop) : undefined;
        return this._evalComparison(val, cond.comparison);
      }
      case 'varCondition': {
        const w = this.world;
        const val = (w && w._vars && cond.name in w._vars) ? w._vars[cond.name] : (w ? w.getProperty(cond.name, cond.name) : undefined);
        return this._evalComparison(val, cond.comparison);
      }
      case 'switchCond': {
        const id  = String(this._resolveValue(cond.id));
        return cond.on ? (this.world ? this.world.isSwitch(id) : false) : !(this.world ? this.world.isSwitch(id) : false);
      }
      case 'choiceIs': {
        const expected = this._resolveValue(cond.value);
        return this._lastChoice === expected || this._lastChoice === parseInt(expected);
      }
      case 'hasItem': {
        const k = 'inv:' + cond.itemId;
        if (typeof localStorage !== 'undefined') return parseInt(localStorage.getItem(k) || '0') > 0;
        return false;
      }
      case 'startsWith': {
        const w = this.world;
        const str = (w && w._vars && cond.subject in w._vars) ? w._vars[cond.subject] : String(cond.subject);
        return String(str).startsWith(String(this._resolveValue(cond.value)));
      }
      case 'endsWith': {
        const w = this.world;
        const str = (w && w._vars && cond.subject in w._vars) ? w._vars[cond.subject] : String(cond.subject);
        return String(str).endsWith(String(this._resolveValue(cond.value)));
      }
      case 'hasKey': {
        const w = this.world;
        const obj = (w && w._vars && cond.subject in w._vars) ? w._vars[cond.subject] : null;
        if (!obj || typeof obj !== 'object') return false;
        return Object.prototype.hasOwnProperty.call(obj, String(this._resolveValue(cond.key)));
      }
      case 'typeCheck': {
        const w = this.world;
        const val = (w && w._vars && cond.subject in w._vars) ? w._vars[cond.subject] : undefined;
        const actual = Array.isArray(val) ? 'array' : (val === null || val === undefined ? 'nothing' : typeof val);
        const want = cond.typeName.toLowerCase();
        if (want === 'text') return actual === 'string';
        if (want === 'integer') return typeof val === 'number';
        return actual === want;
      }
      case 'hasStatus': return false; // game-engine specific; override in subclass
      case 'contains': {
        const w = this.world;
        const haystack = (w && w._vars && cond.subject in w._vars)
          ? w._vars[cond.subject]
          : ((w ? w.getProperty(cond.subject, cond.subject) : undefined) ?? cond.subject);
        const needle = this._resolveValue(cond.value);
        if (Array.isArray(haystack)) return haystack.includes(needle);
        return String(haystack).includes(String(needle));
      }
      default: return false;
    }
  }

  async _executeBody(stmts) {
    for (const stmt of stmts) await this._executeStatement(stmt);
  }

  async _executeStatement(stmt) {
    if (!stmt) return;
    const w = this.world;

    switch (stmt.type) {
      case 'if': {
        const branch = this._evaluateCondition(stmt.condition) ? stmt.consequent : stmt.alternate;
        await this._executeBody(branch);
        break;
      }
      case 'repeat': {
        const count = this._resolveValue(stmt.count);
        for (let i = 0; i < count; i++) {
          try { await this._executeBody(stmt.body); }
          catch(e) { if (e === _HL_BREAK) break; if (e === _HL_SKIP) continue; throw e; }
        }
        break;
      }
      case 'while': {
        let guard = 0;
        while (this._evaluateCondition(stmt.condition) && guard++ < 10000) {
          try { await this._executeBody(stmt.body); }
          catch(e) { if (e === _HL_BREAK) break; if (e === _HL_SKIP) continue; throw e; }
        }
        break;
      }

      case 'letVar':
      case 'setVar':
        if (w) w._vars[stmt.name] = this._resolveValue(stmt.value);
        break;
      case 'increaseVar': { const cur = Number(w?._vars[stmt.name] || 0); if (w) w._vars[stmt.name] = cur + Number(this._resolveValue(stmt.value)); break; }
      case 'decreaseVar': { const cur = Number(w?._vars[stmt.name] || 0); if (w) w._vars[stmt.name] = cur - Number(this._resolveValue(stmt.value)); break; }

      case 'set':      w && w.setProperty(stmt.entity, stmt.prop,  this._resolveValue(stmt.value)); break;
      case 'increase': { const cur = (w ? w.getProperty(stmt.entity, stmt.prop) : 0) || 0; w && w.setProperty(stmt.entity, stmt.prop, parseFloat(cur) + this._resolveValue(stmt.value)); break; }
      case 'decrease': { const cur = (w ? w.getProperty(stmt.entity, stmt.prop) : 0) || 0; w && w.setProperty(stmt.entity, stmt.prop, parseFloat(cur) - this._resolveValue(stmt.value)); break; }

      case 'move':     w && w.moveEntity(stmt.entity, this._resolveValue(stmt.x), this._resolveValue(stmt.y), stmt.relative);  break;
      case 'teleport': w && w.moveEntity(stmt.entity, this._resolveValue(stmt.x), this._resolveValue(stmt.y), false); break;
      case 'spawn': {
        const TILE = (w && w.TILE) || 32;
        const sx = this._resolveValue(stmt.x) * (stmt.useTile ? TILE : 1);
        const sy = this._resolveValue(stmt.y) * (stmt.useTile ? TILE : 1);
        w && w.spawnEntity(stmt.entity, sx, sy);
        break;
      }
      case 'destroy':  w && w.destroyEntity(stmt.entity);  break;
      case 'show':     w && w.showEntity(stmt.entity);     break;
      case 'hide':     w && w.hideEntity(stmt.entity);     break;
      case 'freeze':   w && w.freezeEntity(stmt.entity);   break;
      case 'unfreeze': w && w.unfreezeEntity(stmt.entity); break;

      case 'play':
        if (!w) break;
        if (stmt.kind === 'sound')     w.playSound(this._resolveValue(stmt.name));
        else if (stmt.kind === 'animation') w.playAnimation(stmt.entity, this._resolveValue(stmt.name));
        else if (stmt.kind === 'music') w.playMusic(this._resolveValue(stmt.name), stmt.loop !== false);
        break;
      case 'stop':
        if (!w) break;
        if (stmt.kind === 'all')            w.stopAllSounds();
        else if (stmt.kind === 'sound')     w.stopSound(this._resolveValue(stmt.name));
        else if (stmt.kind === 'animation') w.stopAnimation(stmt.entity);
        else if (stmt.kind === 'music')     w.stopMusic();
        break;
      case 'setVolume':   w && w.setVolume(this._resolveValue(stmt.value));             break;
      case 'loadTileset': w && w.loadTileset(this._resolveValue(stmt.src));             break;
      case 'print':       w && w.log(this._resolveValue(stmt.message));                 break;
      case 'wait':        w && await w.wait(this._resolveValue(stmt.duration));         break;
      case 'call': {
        // Check if it's a lambda stored in variables first
        const lambdaFn = w ? w._vars[stmt.fn] : null;
        if (lambdaFn && lambdaFn.__isLambda) {
          const _savedVars = { ...w._vars };
          (lambdaFn.params || []).forEach((p, i) => {
            w._vars[p] = this._resolveValue(stmt.args[i]);
          });
          const result = this._resolveValue(lambdaFn.expr);
          w._vars = _savedVars;
          if (stmt.out) w._vars[stmt.out] = result;
        } else {
          w && w.callFunction(stmt.fn, stmt.args.map(a => this._resolveValue(a)));
        }
        break;
      }
      case 'callEvent': {
        const evBody = this._definedEvents.get(stmt.id);
        if (evBody) { await this._executeBody(evBody); }
        else if (w) { w.emitEvent('event:' + stmt.id, null); }
        break;
      }
      case 'emit':        w && w.emitEvent(stmt.event, stmt.entity);                    break;

      case 'endGame':     w && w.endGame();     break;
      case 'winGame':     w && w.winGame();     break;
      case 'loseGame':    w && w.loseGame();    break;
      case 'restartGame': w && w.restartGame(); break;
      case 'loadScene':   w && w.loadScene(stmt.id); break;

      case 'saveData':   { const k = String(this._resolveValue(stmt.key)); const v = String(this._resolveValue(stmt.value)); w && await w.saveData(k, v); break; }
      case 'loadData':   { const k = String(this._resolveValue(stmt.key)); const raw = w ? await w.loadData(k) : null; if (stmt.variable && w) w.setProperty(stmt.variable, isNaN(raw) || raw === '' ? raw : Number(raw)); break; }
      case 'deleteData': { const k = String(this._resolveValue(stmt.key)); w && await w.deleteData(k); break; }

      case 'turnSwitch':
        if (w) { if (stmt.on) w.turnOnSwitch(String(this._resolveValue(stmt.id))); else w.turnOffSwitch(String(this._resolveValue(stmt.id))); }
        break;
      case 'openMenu':   w && w.emitEvent('menu:open', stmt.tab || 'main'); break;
      case 'openShop':   w && w.emitEvent('shop:open', String(this._resolveValue(stmt.name))); break;
      case 'gameOver':   w && w.emitEvent('game:over', ''); break;
      case 'screenShake': w && w.screenShake(this._resolveValue(stmt.intensity), this._resolveValue(stmt.duration)); break;
      case 'screenFlash': w && w.screenFlash(this._resolveValue(stmt.color),     this._resolveValue(stmt.duration)); break;
      case 'screenTint':  w && w.screenTint(this._resolveValue(stmt.color),      this._resolveValue(stmt.alpha));    break;

      case 'say': {
        if (w) await w.showDialogue(this._resolveValue(stmt.text), stmt.speaker, stmt.portrait);
        break;
      }
      case 'choice': {
        const labels = stmt.options.map(o => (typeof o === 'object' ? o.label : o));
        if (w) {
          const idx = await w.showChoice(stmt.prompt || '', labels);
          this._lastChoice = idx;
          w.setProperty('_vars', '_lastChoice', idx);
          const chosen = stmt.options[idx];
          if (chosen && typeof chosen === 'object' && chosen.body) await this._executeBody(chosen.body);
        }
        break;
      }

      case 'battleEnemy': {
        const enemyIds = stmt.enemies.map(e => this._resolveValue(e));
        if (stmt.music && w) w.playMusic(this._resolveValue(stmt.music), true);
        w && w.emitEvent('battle:start', JSON.stringify(enemyIds));
        break;
      }
      case 'battle':   w && w.emitEvent('combat:start', stmt.attacker + ':' + stmt.defender); break;
      case 'attack':   w && w.emitEvent('combat:attack', stmt.attacker + ':' + stmt.defender); break;
      case 'endBattle': w && w.emitEvent('combat:end', ''); break;

      case 'addItem':    w && await w.addItem(stmt.itemId, this._resolveValue(stmt.quantity)); break;
      case 'removeItem': w && await w.removeItem(stmt.itemId, this._resolveValue(stmt.quantity)); break;
      case 'toggleInventory': w && w.emitEvent('inventory:toggle', ''); break;
      case 'toggle':          w && w.emitEvent('toggle:' + stmt.target, ''); break;

      case 'apply':
        if (!w) break;
        if (stmt.kind === 'impulse') w.applyImpulse(stmt.entity, this._resolveValue(stmt.x), this._resolveValue(stmt.y));
        else if (stmt.kind === 'force') w.applyForce(stmt.entity, this._resolveValue(stmt.x), this._resolveValue(stmt.y));
        break;

      case 'heal': {
        const healAmount = stmt.amount ? Number(this._resolveValue(stmt.amount)) : null;
        w && w.heal(stmt.target, healAmount);
        break;
      }
      case 'recover': w && w.recover(stmt.target || 'all'); break;

      case 'giveExp':  w && w.giveExp(Number(this._resolveValue(stmt.amount))); break;
      case 'giveGold': w && w.giveGold(Number(this._resolveValue(stmt.amount))); break;
      case 'addToParty':    w && w.addToParty(this._resolveValue(stmt.memberId)); break;
      case 'removeFromParty': w && w.removeFromParty(this._resolveValue(stmt.memberId)); break;

      case 'changeMap':   w && w.changeMap(this._resolveValue(stmt.mapId), stmt.x != null ? Number(this._resolveValue(stmt.x)) : null, stmt.y != null ? Number(this._resolveValue(stmt.y)) : null); break;
      case 'changeGold':  w && w.changeGold(Number(this._resolveValue(stmt.amount)), stmt.relative); break;
      case 'changeStat':  w && w.changeStat(stmt.stat, this._resolveValue(stmt.entity), Number(this._resolveValue(stmt.amount)), stmt.relative); break;
      case 'changeLevel': w && w.changeLevel(this._resolveValue(stmt.entity), Number(this._resolveValue(stmt.amount)), stmt.relative); break;
      case 'changeExp':   w && w.changeExp(this._resolveValue(stmt.entity), Number(this._resolveValue(stmt.amount)), stmt.relative); break;
      case 'changeClass': w && w.changeClass(this._resolveValue(stmt.entity), this._resolveValue(stmt.classId)); break;
      case 'changeEncounterRate': w && w.changeEncounterRate(Number(this._resolveValue(stmt.value))); break;
      case 'learnSkill':  w && w.learnSkill(this._resolveValue(stmt.skillId), this._resolveValue(stmt.target) || 'player'); break;
      case 'forgetSkill': w && w.forgetSkill(this._resolveValue(stmt.skillId), this._resolveValue(stmt.target) || 'player'); break;

      case 'defineData': {
        w && w.defineData(stmt.kind, stmt.id, this._resolveProps(stmt.props));
        break;
      }
      case 'defineEvent': {
        // Store locally so "call event" can run it directly
        this._definedEvents.set(stmt.id, stmt.body);
        w && w.defineEvent(stmt.id, stmt.body);
        break;
      }
      case 'defineZone': {
        w && w.defineZone(stmt.id, stmt.entries);
        break;
      }
      case 'defineStatus': {
        w && w.defineStatus(stmt.id, stmt.props, stmt.turnOps);
        break;
      }

      case 'define':
        if (!w) break;
        if (stmt.kind === 'sprite') w.defineSprite(stmt.entity, this._resolveValue(stmt.src), this._resolveValue(stmt.fw), this._resolveValue(stmt.fh));
        else if (stmt.kind === 'animation') w.defineAnimation(stmt.entity, this._resolveValue(stmt.name), stmt.frames, this._resolveValue(stmt.fps), this._resolveValue(stmt.loop) !== false);
        break;

      // ── JS/Node.js feature statements ──────────────────────────────────

      case 'break': throw _HL_BREAK;
      case 'skip':  throw _HL_SKIP;

      // for each item in list do ... end
      case 'forEach': {
        const iterable = (w && w._vars) ? w._vars[stmt.iterable] : null;
        const arr = Array.isArray(iterable) ? iterable : (iterable != null ? [iterable] : []);
        for (const item of arr) {
          if (w) w._vars[stmt.varName] = item;
          try { await this._executeBody(stmt.body); }
          catch(e) { if (e === _HL_BREAK) break; if (e === _HL_SKIP) continue; throw e; }
        }
        break;
      }

      // append value to arrayVar
      case 'append': {
        if (w && w._vars) {
          const existing = w._vars[stmt.varName];
          const arr = Array.isArray(existing) ? existing : (existing != null ? [existing] : []);
          arr.push(this._resolveValue(stmt.value));
          w._vars[stmt.varName] = arr;
        }
        break;
      }

      // remove last / remove first (array pop/shift)
      case 'arrayPop': {
        if (w && w._vars && Array.isArray(w._vars[stmt.varName])) w._vars[stmt.varName].pop();
        break;
      }
      case 'arrayShift': {
        if (w && w._vars && Array.isArray(w._vars[stmt.varName])) w._vars[stmt.varName].shift();
        break;
      }

      // split text by "," into parts
      case 'splitStr': {
        if (w) {
          const str = String(this._resolveValue(stmt.str));
          const sep = String(this._resolveValue(stmt.sep));
          const parts = str.split(sep);
          if (stmt.variable) w._vars[stmt.variable] = parts;
        }
        break;
      }

      // replace "old" with "new" in msg
      case 'replaceStr': {
        if (w) {
          const src = stmt.inVar ? String(w._vars[stmt.inVar] ?? '') : '';
          const from = String(this._resolveValue(stmt.from));
          const to   = String(this._resolveValue(stmt.to));
          const result = src.split(from).join(to);
          const target = stmt.variable || stmt.inVar;
          if (target) w._vars[target] = result;
        }
        break;
      }

      // convert value to number/text/boolean
      case 'convert': {
        if (w) {
          const val = this._resolveValue(stmt.value);
          let converted;
          switch (stmt.toType) {
            case 'number':  converted = Number(val);        break;
            case 'text':    converted = String(val);        break;
            case 'boolean': converted = Boolean(val);       break;
            case 'array':   converted = Array.isArray(val) ? val : (val != null ? [val] : []); break;
            default:        converted = String(val);
          }
          if (stmt.variable) w._vars[stmt.variable] = converted;
        }
        break;
      }

      // parse json text into obj
      case 'parseJson': {
        if (w) {
          const text = String(this._resolveValue(stmt.text));
          try {
            const obj = JSON.parse(text);
            if (stmt.variable) w._vars[stmt.variable] = obj;
          } catch(e) { console.warn('[HLInterpreter] JSON parse error:', e.message); }
        }
        break;
      }

      // stringify value into jsonText
      case 'stringify': {
        if (w) {
          const val = this._resolveValue(stmt.value);
          const json = JSON.stringify(val);
          if (stmt.variable) w._vars[stmt.variable] = json;
        }
        break;
      }

      // fetch "url" into result  /  post "url" with body into result
      case 'fetchUrl': {
        if (w) {
          try {
            const url  = String(this._resolveValue(stmt.url));
            const opts = stmt.method === 'POST'
              ? { method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(this._resolveValue(stmt.body)) }
              : {};
            let result;
            if (typeof fetch !== 'undefined') {
              const res = await fetch(url, opts);
              const text = await res.text();
              try { result = JSON.parse(text); } catch(_) { result = text; }
            } else {
              // Node.js < 18 fallback via https module
              result = await new Promise((resolve, reject) => {
                const lib = url.startsWith('https') ? require('https') : require('http');
                const reqOpts = { method: stmt.method || 'GET', headers: opts.headers || {} };
                const req = lib.request(url, reqOpts, res => {
                  let data = '';
                  res.on('data', c => data += c);
                  res.on('end', () => { try { resolve(JSON.parse(data)); } catch(_) { resolve(data); } });
                });
                req.on('error', reject);
                if (opts.body) req.write(opts.body);
                req.end();
              });
            }
            if (stmt.variable && result !== undefined) w._vars[stmt.variable] = result;
          } catch(e) { console.warn('[HLInterpreter] fetch error:', e.message); }
        }
        break;
      }

      // read file "path" into contents  (Node.js only)
      case 'readFile': {
        if (w) {
          try {
            const path = String(this._resolveValue(stmt.path));
            let contents = null;
            if (typeof require !== 'undefined') {
              const fs = require('fs');
              contents = fs.readFileSync(path, 'utf8');
            }
            if (stmt.variable && contents !== null) w._vars[stmt.variable] = contents;
          } catch(e) { console.warn('[HLInterpreter] read file error:', e.message); }
        }
        break;
      }

      // write file "path" with contents  (Node.js only)
      case 'writeFile': {
        if (w) {
          try {
            const path = String(this._resolveValue(stmt.path));
            const contents = String(this._resolveValue(stmt.contents));
            if (typeof require !== 'undefined') {
              const fs = require('fs');
              if (stmt.append) fs.appendFileSync(path, contents + '\n', 'utf8');
              else             fs.writeFileSync(path, contents, 'utf8');
            }
          } catch(e) { console.warn('[HLInterpreter] write file error:', e.message); }
        }
        break;
      }

      // try ... catch error ... end
      case 'tryCatch': {
        try {
          await this._executeBody(stmt.tryBody);
        } catch(e) {
          if (e === _HL_BREAK || e === _HL_SKIP) throw e; // propagate loop signals
          if (w && stmt.errorVar) w._vars[stmt.errorVar] = e?.message || String(e);
          await this._executeBody(stmt.catchBody);
        }
        break;
      }

      // ── Objects ────────────────────────────────────────────────────────
      case 'setObjKey': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        if (obj && typeof obj === 'object') obj[String(this._resolveValue(stmt.key))] = this._resolveValue(stmt.value);
        break;
      }
      case 'getObjKey': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        w._vars[stmt.out] = (obj && typeof obj === 'object') ? (obj[String(this._resolveValue(stmt.key))] ?? null) : null;
        break;
      }
      case 'deleteObjKey': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        if (obj && typeof obj === 'object') delete obj[String(this._resolveValue(stmt.key))];
        break;
      }
      case 'objKeys': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        w._vars[stmt.out] = obj && typeof obj === 'object' ? Object.keys(obj) : [];
        break;
      }
      case 'objValues': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        w._vars[stmt.out] = obj && typeof obj === 'object' ? Object.values(obj) : [];
        break;
      }

      // ── Arrays ─────────────────────────────────────────────────────────
      case 'sortArr': {
        if (!w) break;
        const arr = w._vars[stmt.arr];
        if (Array.isArray(arr)) {
          arr.sort((a, b) => {
            if (typeof a === 'number' && typeof b === 'number') return stmt.dir === 'desc' ? b - a : a - b;
            return stmt.dir === 'desc' ? String(b).localeCompare(String(a)) : String(a).localeCompare(String(b));
          });
        }
        break;
      }
      case 'reverseArr': {
        if (!w) break;
        const arr = w._vars[stmt.arr];
        if (Array.isArray(arr)) arr.reverse();
        break;
      }
      case 'filterArr': {
        if (!w) break;
        const arr = w._vars[stmt.arr];
        if (!Array.isArray(arr)) { w._vars[stmt.out] = []; break; }
        const filtered = [];
        for (const item of arr) {
          w._vars[stmt.itemVar] = item;
          if (this._evaluateCondition(stmt.condition)) filtered.push(item);
        }
        w._vars[stmt.out] = filtered;
        break;
      }
      case 'mergeArr': {
        if (!w) break;
        const a = w._vars[stmt.a] ?? [];
        const b = w._vars[stmt.b] ?? [];
        w._vars[stmt.out] = [...(Array.isArray(a) ? a : [a]), ...(Array.isArray(b) ? b : [b])];
        break;
      }
      case 'flattenArr': {
        if (!w) break;
        const arr = w._vars[stmt.arr];
        w._vars[stmt.out] = Array.isArray(arr) ? arr.flat(Infinity) : (arr !== undefined ? [arr] : []);
        break;
      }
      case 'findInArr': {
        if (!w) break;
        const arr = w._vars[stmt.arr];
        const needle = this._resolveValue(stmt.needle);
        w._vars[stmt.out] = Array.isArray(arr) ? arr.indexOf(needle) : -1;
        break;
      }
      case 'getArrIndex': {
        if (!w) break;
        const arr = w._vars[stmt.arr];
        const idx = Number(this._resolveValue(stmt.index));
        w._vars[stmt.out] = Array.isArray(arr) ? (arr[idx] ?? null) : null;
        break;
      }
      case 'getSize': {
        if (!w) break;
        const coll = w._vars[stmt.varName];
        if (coll instanceof Map || coll instanceof Set) {
          w._vars[stmt.out] = coll.size;
        } else if (Array.isArray(coll)) {
          w._vars[stmt.out] = coll.length;
        } else if (typeof coll === 'string') {
          w._vars[stmt.out] = coll.length;
        } else {
          w._vars[stmt.out] = 0;
        }
        break;
      }
      case 'getEntries': {
        if (!w) break;
        const coll = w._vars[stmt.varName];
        if (coll instanceof Map) {
          w._vars[stmt.out] = [...coll.entries()];
        } else if (coll instanceof Set) {
          w._vars[stmt.out] = [...coll.values()];
        } else if (typeof coll === 'object' && coll !== null) {
          w._vars[stmt.out] = Object.entries(coll);
        } else {
          w._vars[stmt.out] = [];
        }
        break;
      }
      case 'setArrIndex': {
        if (!w) break;
        const arr = w._vars[stmt.arr];
        const idx = Number(this._resolveValue(stmt.index));
        if (Array.isArray(arr)) arr[idx] = this._resolveValue(stmt.value);
        break;
      }
      case 'sliceStmt': {
        if (!w) break;
        const src = w._vars[stmt.src] ?? (typeof stmt.src === 'string' ? stmt.src : '');
        const start = Number(this._resolveValue(stmt.start));
        const end   = Number(this._resolveValue(stmt.end));
        w._vars[stmt.out] = Array.isArray(src) ? src.slice(start, end) : String(src).slice(start, end);
        break;
      }
      case 'indexOfStmt': {
        if (!w) break;
        const src    = w._vars[stmt.src] ?? String(stmt.src);
        const needle = this._resolveValue(stmt.needle);
        w._vars[stmt.out] = Array.isArray(src) ? src.indexOf(needle) : String(src).indexOf(String(needle));
        break;
      }

      // ── Strings ────────────────────────────────────────────────────────
      case 'charAtStmt': {
        if (!w) break;
        const src = String(w._vars[stmt.src] ?? '');
        w._vars[stmt.out] = src.charAt(Number(this._resolveValue(stmt.index))) || '';
        break;
      }
      case 'repeatStr': {
        if (!w) break;
        const str   = String(this._resolveValue(stmt.str));
        const count = Math.max(0, Math.floor(Number(this._resolveValue(stmt.count))));
        w._vars[stmt.out] = str.repeat(count);
        break;
      }
      case 'padStr': {
        if (!w) break;
        const src  = String(this._resolveValue(stmt.src));
        const len  = Number(this._resolveValue(stmt.len));
        const fill = String(this._resolveValue(stmt.fill) ?? ' ');
        w._vars[stmt.out] = stmt.dir === 'right' ? src.padEnd(len, fill) : src.padStart(len, fill);
        break;
      }

      // ── Math/Type ──────────────────────────────────────────────────────
      case 'clampVar': {
        if (!w) break;
        const val  = Number(w._vars[stmt.src] ?? 0);
        const low  = Number(this._resolveValue(stmt.low));
        const high = Number(this._resolveValue(stmt.high));
        w._vars[stmt.out] = Math.min(Math.max(val, low), high);
        break;
      }
      case 'typeOfStmt': {
        if (!w) break;
        const val = w._vars[stmt.src];
        const t   = Array.isArray(val) ? 'array' : (val === null || val === undefined ? 'nothing' : typeof val);
        w._vars[stmt.out] = t;
        break;
      }

      // ── Node.js ────────────────────────────────────────────────────────
      case 'getEnv': {
        if (!w) break;
        const key = String(this._resolveValue(stmt.key));
        w._vars[stmt.out] = (typeof process !== 'undefined' && process.env) ? (process.env[key] ?? null) : null;
        break;
      }
      case 'getTime': {
        if (!w) break;
        const d = new Date();
        w._vars[stmt.out] = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
        break;
      }
      case 'getDate': {
        if (!w) break;
        const d = new Date();
        w._vars[stmt.out] = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        break;
      }
      case 'getTimestamp': {
        if (!w) break;
        w._vars[stmt.out] = Date.now();
        break;
      }
      case 'exitProg': {
        const code = Number(this._resolveValue(stmt.code) ?? 0);
        if (typeof process !== 'undefined') process.exit(code);
        break;
      }
      case 'runCommand': {
        if (!w) break;
        const cmd = String(this._resolveValue(stmt.cmd));
        if (typeof require !== 'undefined') {
          const { execSync } = require('child_process');
          try {
            const out = execSync(cmd, { encoding: 'utf8', stdio: ['pipe','pipe','pipe'] });
            if (stmt.out) w._vars[stmt.out] = out.trim();
          } catch(e) { if (stmt.out) w._vars[stmt.out] = e.message; }
        }
        break;
      }
      case 'listFiles': {
        if (!w) break;
        const path = String(this._resolveValue(stmt.path));
        if (typeof require !== 'undefined') {
          const fs = require('fs');
          try { w._vars[stmt.out] = fs.readdirSync(path); } catch(e) { w._vars[stmt.out] = []; }
        } else { w._vars[stmt.out] = []; }
        break;
      }
      case 'fileExists': {
        if (!w) break;
        const path = String(this._resolveValue(stmt.path));
        if (typeof require !== 'undefined') {
          const fs = require('fs');
          w._vars[stmt.out] = fs.existsSync(path);
        } else { w._vars[stmt.out] = false; }
        break;
      }
      case 'deleteFile': {
        const path = String(this._resolveValue(stmt.path));
        if (typeof require !== 'undefined') {
          const fs = require('fs');
          try { fs.unlinkSync(path); } catch(e) {}
        }
        break;
      }
      case 'createFolder': {
        const path = String(this._resolveValue(stmt.path));
        if (typeof require !== 'undefined') {
          const fs = require('fs');
          try { fs.mkdirSync(path, { recursive: true }); } catch(e) {}
        }
        break;
      }

      // ── Map operations ─────────────────────────────────────────────────────
      case 'createMap': {
        if (w) w._vars[stmt.name] = new Map();
        break;
      }
      case 'mapSet': {
        const map = w?._vars[stmt.mapName];
        if (map instanceof Map) {
          map.set(this._resolveValue(stmt.key), this._resolveValue(stmt.value));
        } else if (map instanceof WeakMap) {
          const key = this._resolveValue(stmt.key);
          if (typeof key === 'object' && key !== null) {
            map.set(key, this._resolveValue(stmt.value));
          }
        }
        break;
      }
      case 'mapGet': {
        const map = w?._vars[stmt.mapName];
        if (w) {
          if (map instanceof Map) {
            w._vars[stmt.out] = map.get(this._resolveValue(stmt.key)) ?? null;
          } else if (map instanceof WeakMap) {
            const key = this._resolveValue(stmt.key);
            if (typeof key === 'object' && key !== null) {
              w._vars[stmt.out] = map.get(key) ?? null;
            }
          } else if (map && typeof map === 'object') {
            w._vars[stmt.out] = map[this._resolveValue(stmt.key)] ?? null;
          }
        }
        break;
      }
      case 'mapDelete': {
        const map = w?._vars[stmt.mapName];
        const key = this._resolveValue(stmt.key);
        if (map instanceof Map) {
          map.delete(key);
        } else if (map instanceof WeakMap && typeof key === 'object' && key !== null) {
          map.delete(key);
        } else if (map && typeof map === 'object') {
          delete map[key];
        }
        break;
      }
      case 'mapHas': {
        const map = w?._vars[stmt.mapName];
        const key = this._resolveValue(stmt.key);
        if (map instanceof Map && w) {
          w._vars[stmt.out] = map.has(key);
        } else if (map instanceof WeakMap && w && typeof key === 'object' && key !== null) {
          w._vars[stmt.out] = map.has(key);
        } else if (map && typeof map === 'object' && w) {
          w._vars[stmt.out] = Object.prototype.hasOwnProperty.call(map, key);
        }
        break;
      }

      // ── Set operations ─────────────────────────────────────────────────────
      case 'createSet': {
        if (w) w._vars[stmt.name] = new Set();
        break;
      }
      case 'setAdd': {
        const set = w?._vars[stmt.setName];
        if (set instanceof Set) {
          set.add(this._resolveValue(stmt.value));
        } else if (set instanceof WeakSet) {
          const val = this._resolveValue(stmt.value);
          if (typeof val === 'object' && val !== null) {
            set.add(val);
          }
        }
        break;
      }
      case 'setDelete': {
        const set = w?._vars[stmt.setName];
        const val = this._resolveValue(stmt.value);
        if (set instanceof Set) {
          set.delete(val);
        } else if (set instanceof WeakSet && typeof val === 'object' && val !== null) {
          set.delete(val);
        }
        break;
      }
      case 'setHas': {
        const set = w?._vars[stmt.setName];
        const val = this._resolveValue(stmt.value);
        if (set instanceof Set && w) {
          w._vars[stmt.out] = set.has(val);
        } else if (set instanceof WeakSet && w && typeof val === 'object' && val !== null) {
          w._vars[stmt.out] = set.has(val);
        }
        break;
      }

      // ── User-defined functions ────────────────────────────────────────────
      case 'defineFunction': {
        this._functions.set(stmt.id, { params: stmt.params || [], body: stmt.body || [] });
        break;
      }
      case 'callFunction': {
        // Check if it's a lambda stored in variables
        const lambdaFn = w ? w._vars[stmt.id] : null;
        if (lambdaFn && lambdaFn.__isLambda) {
          const _savedVars = { ...w._vars };
          // Bind lambda params to args
          (lambdaFn.params || []).forEach((p, i) => {
            w._vars[p] = this._resolveValue((stmt.args || [])[i]);
          });
          // Evaluate lambda expression
          const result = this._resolveValue(lambdaFn.expr);
          w._vars = _savedVars;
          if (stmt.out) w._vars[stmt.out] = result;
          break;
        }
        
        const _fn = this._functions.get(stmt.id);
        if (!_fn) { if (stmt.out && w) w._vars[stmt.out] = null; break; }
        const w2 = w;
        const _savedVars2 = w2 ? { ...w2._vars } : {};
        if (w2) { (_fn.params || []).forEach((p, i) => { w2._vars[p] = this._resolveValue((stmt.args || [])[i]); }); }
        let _retVal2 = null;
        try {
          await this._executeBody(_fn.body);
        } catch (e) {
          if (e === _HL_BREAK || e === _HL_SKIP) throw e;
          if (e && e.__hlReturn) { _retVal2 = e.value; }
          else throw e;
        }
        if (w2) w2._vars = _savedVars2;
        if (stmt.out && w2) w2._vars[stmt.out] = _retVal2;
        break;
      }
      case 'returnStmt': {
        const _rv = this._resolveValue(stmt.value);
        const _err = new Error('__hlReturn');
        _err.__hlReturn = true;
        _err.value = _rv;
        throw _err;
      }

      // ── match / switch ────────────────────────────────────────────────────
      case 'matchStmt': {
        const _mval = w ? (w._vars[stmt.subject] ?? this._resolveValue({ type: 'ident', value: stmt.subject })) : null;
        let _matched = false;
        for (const arm of (stmt.cases || [])) {
          let _hit = false;
          if (arm.match.type === 'value') {
            _hit = _mval == this._resolveValue(arm.match.value);
          } else if (arm.match.type === 'comparison') {
            _hit = this._evalComparison(_mval, arm.match.comparison);
          }
          if (_hit) { _matched = true; await this._executeBody(arm.body); break; }
        }
        if (!_matched && stmt.defaultBody && stmt.defaultBody.length) {
          await this._executeBody(stmt.defaultBody);
        }
        break;
      }

      // ── transform / map ───────────────────────────────────────────────────
      case 'transformArr': {
        const _tarr = w ? (w._vars[stmt.arr] || []) : [];
        if (!Array.isArray(_tarr)) { if (w && stmt.out) w._vars[stmt.out] = []; break; }
        const _tres = [];
        for (const _ti of _tarr) {
          if (w) w._vars[stmt.itemVar] = _ti;
          _tres.push(this._resolveValue(stmt.expr));
        }
        if (w) w._vars[stmt.out] = _tres;
        break;
      }

      // ── reduce / fold ─────────────────────────────────────────────────────
      case 'reduceArr': {
        const _rarr = w ? (w._vars[stmt.arr] || []) : [];
        if (!Array.isArray(_rarr)) { if (w && stmt.out) w._vars[stmt.out] = this._resolveValue(stmt.initial); break; }
        if (w) w._vars[stmt.accVar] = this._resolveValue(stmt.initial);
        for (const _ri of _rarr) {
          if (w) w._vars[stmt.itemVar] = _ri;
          await this._executeBody(stmt.body);
        }
        if (w && stmt.out) w._vars[stmt.out] = w._vars[stmt.accVar];
        break;
      }

      // ── every / any ───────────────────────────────────────────────────────
      case 'everyArr': {
        const _earr = w ? (w._vars[stmt.arr] || []) : [];
        let _everRes = true;
        for (const _ei of (_earr || [])) {
          if (w) w._vars[stmt.itemVar] = _ei;
          if (!this._evalComparison(_ei, stmt.comparison)) { _everRes = false; break; }
        }
        if (w && stmt.out) w._vars[stmt.out] = _everRes;
        break;
      }
      case 'anyArr': {
        const _aarr = w ? (w._vars[stmt.arr] || []) : [];
        let _anyRes = false;
        for (const _ai of (_aarr || [])) {
          if (w) w._vars[stmt.itemVar] = _ai;
          if (this._evalComparison(_ai, stmt.comparison)) { _anyRes = true; break; }
        }
        if (w && stmt.out) w._vars[stmt.out] = _anyRes;
        break;
      }

      // ── copy / assign (object spread) ─────────────────────────────────────
      case 'copyObj': {
        const _csrc = w ? w._vars[stmt.src] : null;
        if (w && stmt.out) {
          w._vars[stmt.out] = Array.isArray(_csrc) ? [...(_csrc || [])] : Object.assign({}, _csrc || {});
        }
        break;
      }
      case 'assignObjs': {
        const _aoRes = Object.assign({}, ...(stmt.sources || []).map(s => (w && w._vars[s]) || {}));
        if (w && stmt.out) w._vars[stmt.out] = _aoRes;
        break;
      }

      // ── path operations ───────────────────────────────────────────────────
      case 'pathOp': {
        if (typeof require === 'undefined') { if (w && stmt.out) w._vars[stmt.out] = ''; break; }
        const _nodePath = require('path');
        let _pr;
        const _pargs = (stmt.parts || stmt.args || []).map(a => String(this._resolveValue(a)));
        switch (stmt.op) {
          case 'join':      _pr = _nodePath.join(..._pargs); break;
          case 'basename':  _pr = _nodePath.basename(_pargs[0], _pargs[1] || undefined); break;
          case 'dirname':   _pr = _nodePath.dirname(_pargs[0]); break;
          case 'extension': _pr = _nodePath.extname(_pargs[0]); break;
          case 'extname':   _pr = _nodePath.extname(_pargs[0]); break;
          case 'resolve':   _pr = _nodePath.resolve(..._pargs); break;
          default:          _pr = _pargs[0] || '';
        }
        if (w && stmt.out) w._vars[stmt.out] = _pr;
        break;
      }

      // ── console.log ───────────────────────────────────────────────────────
      case 'logStmt': {
        const _lvals = (stmt.values || []).map(v => this._resolveValue(v));
        console.log(..._lvals);
        break;
      }

      // ── HTTP server ───────────────────────────────────────────────────────
      case 'serve': {
        if (typeof require === 'undefined') break;
        const _http = require('http');
        const _port = this._resolveValue(stmt.port);
        
        // Initialize route storage
        if (!this._httpRoutes) this._httpRoutes = [];
        if (!this._httpServer) {
          this._httpServer = _http.createServer((req, res) => {
            const method = req.method;
            const url = req.url.split('?')[0];
            
            // Find matching route
            const route = this._httpRoutes.find(r => r.method === method && r.path === url);
            
            if (route) {
              // Collect request body
              let body = '';
              req.on('data', chunk => body += chunk);
              req.on('end', () => {
                // Set up request object
                const reqObj = {
                  method: method,
                  url: url,
                  headers: req.headers,
                  body: body ? JSON.parse(body) : {},
                  query: Object.fromEntries(new URL(req.url, `http://localhost:${_port}`).searchParams)
                };
                
                // Create response context
                this._currentResponse = res;
                
                // Execute route body with request variable
                const w = this.world || { _vars: {} };
                w._vars[route.reqVar] = reqObj;
                
                for (const s of route.body) {
                  this._executeStatement(s, w);
                }
              });
            } else {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Not Found' }));
            }
          });
          
          this._httpServer.listen(_port, () => {
            console.log(`Server running on port ${_port}`);
          });
        }
        break;
      }

      case 'route': {
        if (!this._httpRoutes) this._httpRoutes = [];
        this._httpRoutes.push({
          method: this._resolveValue(stmt.method),
          path: this._resolveValue(stmt.path),
          reqVar: stmt.reqVar,
          body: stmt.body
        });
        break;
      }

      case 'respond': {
        if (this._currentResponse) {
          const status = this._resolveValue(stmt.status);
          let body = this._resolveValue(stmt.body);
          let contentType = 'application/json';
          
          // Auto-detect content type
          if (typeof body === 'string') {
            const trimmed = body.trim();
            if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.startsWith('<') && trimmed.includes('</')) {
              contentType = 'text/html';
            } else if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
              contentType = 'application/json';
            } else if (trimmed.includes('body {') || trimmed.includes('.') && trimmed.includes('{')) {
              contentType = 'text/css';
            } else {
              contentType = 'text/plain';
            }
          } else if (typeof body === 'object') {
            body = JSON.stringify(body);
            contentType = 'application/json';
          }
          
          // Check for explicit content type in statement
          if (stmt.contentType) {
            const ct = this._resolveValue(stmt.contentType);
            if (ct === 'html') contentType = 'text/html';
            else if (ct === 'css') contentType = 'text/css';
            else if (ct === 'json') contentType = 'application/json';
            else if (ct === 'text') contentType = 'text/plain';
            else if (ct === 'javascript' || ct === 'js') contentType = 'application/javascript';
            else contentType = ct;
          }
          
          this._currentResponse.writeHead(status, { 'Content-Type': contentType });
          this._currentResponse.end(body);
          this._currentResponse = null;
        }
        break;
      }

      case 'serveFile': {
        if (this._currentResponse && typeof require !== 'undefined') {
          const _fs = require('fs');
          const _path = require('path');
          const filePath = this._resolveValue(stmt.path);
          const ext = _path.extname(filePath).toLowerCase();
          
          const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.txt': 'text/plain'
          };
          
          const contentType = mimeTypes[ext] || 'application/octet-stream';
          
          try {
            const content = _fs.readFileSync(filePath);
            this._currentResponse.writeHead(200, { 'Content-Type': contentType });
            this._currentResponse.end(content);
          } catch (e) {
            this._currentResponse.writeHead(404, { 'Content-Type': 'text/plain' });
            this._currentResponse.end('File not found');
          }
          this._currentResponse = null;
        }
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // NEW FEATURES: Classes, Modules, Async, Regex, WebSockets, Database
      // ═══════════════════════════════════════════════════════════════════════

      // ── Classes/OOP ───────────────────────────────────────────────────────
      case 'defineClass': {
        if (!this._classes) this._classes = new Map();
        this._classes.set(stmt.className, {
          parentClass: stmt.parentClass,
          properties: stmt.properties || [],
          methods: stmt.methods || []
        });
        break;
      }

      case 'newInstance': {
        if (!w) break;
        const classDef = this._classes?.get(stmt.className);
        if (!classDef) { console.warn(`Class "${stmt.className}" not defined`); break; }
        
        // Create instance object
        const instance = { __class__: stmt.className };
        
        // Set properties from args
        const args = (stmt.args || []).map(a => this._resolveValue(a));
        (classDef.properties || []).forEach((prop, i) => {
          instance[prop] = args[i] ?? null;
        });
        
        // Call constructor if exists
        const constructor = classDef.methods.find(m => m.isConstructor);
        if (constructor) {
          const savedVars = w ? { ...w._vars } : {};
          if (w) {
            w._vars['this'] = instance;
            (constructor.params || []).forEach((p, i) => { w._vars[p] = args[i]; });
          }
          try { await this._executeBody(constructor.body); }
          catch (e) { if (!e.__hlReturn) throw e; }
          if (w) w._vars = savedVars;
        }
        
        // Bind methods to instance
        for (const method of classDef.methods) {
          if (!method.isConstructor) {
            instance[method.name] = async (...callArgs) => {
              const savedVars = w ? { ...w._vars } : {};
              if (w) {
                w._vars['this'] = instance;
                (method.params || []).forEach((p, i) => { w._vars[p] = callArgs[i]; });
              }
              let retVal = null;
              try { await this._executeBody(method.body); }
              catch (e) { if (e?.__hlReturn) retVal = e.value; else throw e; }
              if (w) w._vars = savedVars;
              return retVal;
            };
          }
        }
        
        if (stmt.variable && w) w._vars[stmt.variable] = instance;
        break;
      }

      // ── Modules ───────────────────────────────────────────────────────────
      case 'import': {
        if (typeof require === 'undefined') break;
        const fs = require('fs');
        const path = require('path');
        let filePath = this._resolveValue(stmt.file);
        
        // Add .hl extension if not present
        if (!filePath.endsWith('.hl') && !filePath.endsWith('.es')) {
          filePath += '.hl';
        }
        
        // Resolve relative to current file or cwd
        const resolvedPath = path.resolve(filePath);
        
        if (fs.existsSync(resolvedPath)) {
          const source = fs.readFileSync(resolvedPath, 'utf8');
          const tokens = new HLLexer(source).tokenize();
          const ast = new HLParser(tokens).parse();
          
          // Execute the imported module
          const savedVars = w ? { ...w._vars } : {};
          await this._executeBody(ast.init);
          
          // If alias provided, wrap exports in a namespace
          if (stmt.alias && w) {
            const exported = {};
            // Copy functions defined in the module
            for (const [name, fn] of this._functions) {
              exported[name] = fn;
            }
            w._vars[stmt.alias] = exported;
          }
        } else {
          console.warn(`[HyperianLang] Module not found: ${resolvedPath}`);
        }
        break;
      }

      case 'importFrom': {
        if (typeof require === 'undefined') break;
        const fs = require('fs');
        const path = require('path');
        let filePath = this._resolveValue(stmt.file);
        if (!filePath.endsWith('.hl') && !filePath.endsWith('.es')) filePath += '.hl';
        const resolvedPath = path.resolve(filePath);
        
        if (fs.existsSync(resolvedPath)) {
          const source = fs.readFileSync(resolvedPath, 'utf8');
          const tokens = new HLLexer(source).tokenize();
          const ast = new HLParser(tokens).parse();
          await this._executeBody(ast.init);
          
          // Import specific functions by name
          for (const name of stmt.imports) {
            const fn = this._functions.get(name);
            if (fn && w) w._vars[name] = fn;
          }
        }
        break;
      }

      case 'export': {
        // Exports are implicit - functions/vars are already accessible
        break;
      }

      // ── Error Handling ────────────────────────────────────────────────────
      case 'throw': {
        const msg = this._resolveValue(stmt.message);
        const err = new Error(msg);
        err.__hlThrow = true;
        throw err;
        break;
      }

      case 'tryCatch': {
        try {
          await this._executeBody(stmt.tryBody);
        } catch (e) {
          if (e === _HL_BREAK || e === _HL_SKIP || e?.__hlReturn) throw e;
          // Set error variable
          if (stmt.errorVar && w) {
            w._vars[stmt.errorVar] = e?.message || String(e);
          }
          await this._executeBody(stmt.catchBody);
        } finally {
          if (stmt.finallyBody) {
            await this._executeBody(stmt.finallyBody);
          }
        }
        break;
      }

      // ── Regex ─────────────────────────────────────────────────────────────
      case 'regex': {
        if (!w) break;
        const pattern = this._resolveValue(stmt.pattern);
        const flags = stmt.flags || '';
        try {
          const regex = new RegExp(pattern, flags);
          if (stmt.variable) w._vars[stmt.variable] = regex;
        } catch (e) {
          console.warn(`[HyperianLang] Invalid regex: ${pattern}`);
          if (stmt.variable) w._vars[stmt.variable] = null;
        }
        break;
      }

      case 'regexTest': {
        if (!w) break;
        const text = String(this._resolveValue(stmt.text));
        let pattern = this._resolveValue(stmt.pattern);
        const flags = stmt.flags || '';
        
        try {
          if (typeof pattern === 'string') pattern = new RegExp(pattern, flags);
          const result = pattern.test(text);
          if (stmt.variable) w._vars[stmt.variable] = result;
        } catch (e) {
          if (stmt.variable) w._vars[stmt.variable] = false;
        }
        break;
      }

      case 'regexExtract': {
        if (!w) break;
        const text = String(this._resolveValue(stmt.text));
        let pattern = this._resolveValue(stmt.pattern);
        const flags = stmt.flags || 'g';
        
        try {
          if (typeof pattern === 'string') pattern = new RegExp(pattern, flags);
          const matches = text.match(pattern) || [];
          if (stmt.variable) w._vars[stmt.variable] = matches;
        } catch (e) {
          if (stmt.variable) w._vars[stmt.variable] = [];
        }
        break;
      }

      // ── Child Processes ───────────────────────────────────────────────────
      case 'executeCommand':
      case 'shellCommand': {
        if (!w || typeof require === 'undefined') break;
        const cmd = String(this._resolveValue(stmt.command));
        const { execSync } = require('child_process');
        try {
          const output = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
          if (stmt.variable) w._vars[stmt.variable] = output.trim();
        } catch (e) {
          if (stmt.variable) w._vars[stmt.variable] = { error: e.message, code: e.status };
        }
        break;
      }

      // ── WebSockets ────────────────────────────────────────────────────────
      case 'connectWebSocket': {
        if (!w) break;
        const url = String(this._resolveValue(stmt.url));
        
        let WebSocket;
        if (typeof require !== 'undefined') {
          try { WebSocket = require('ws'); } 
          catch (e) { console.warn('[HyperianLang] ws module not found. Install with: npm install ws'); break; }
        } else if (typeof window !== 'undefined' && window.WebSocket) {
          WebSocket = window.WebSocket;
        } else {
          console.warn('[HyperianLang] WebSocket not available'); break;
        }
        
        const socket = new WebSocket(url);
        socket._hlMessageHandlers = [];
        
        socket.on?.('message', (data) => {
          for (const handler of socket._hlMessageHandlers) handler(data);
        });
        
        if (stmt.variable) w._vars[stmt.variable] = socket;
        break;
      }

      case 'broadcast': {
        if (!w) break;
        const message = this._resolveValue(stmt.message);
        // Broadcast to all connected WebSocket clients (server-side)
        if (this._wsClients) {
          for (const client of this._wsClients) {
            if (client.readyState === 1) { // OPEN
              client.send(typeof message === 'string' ? message : JSON.stringify(message));
            }
          }
        }
        break;
      }

      // ── Database ──────────────────────────────────────────────────────────
      case 'dbQuery': {
        if (!w || typeof require === 'undefined') break;
        const sql = String(this._resolveValue(stmt.sql));
        const params = Array.isArray(stmt.params) ? stmt.params.map(p => this._resolveValue(p)) : [];
        
        // Use better-sqlite3 for synchronous SQLite
        let Database;
        try { Database = require('better-sqlite3'); }
        catch (e) { 
          console.warn('[HyperianLang] better-sqlite3 not found. Install with: npm install better-sqlite3');
          if (stmt.variable) w._vars[stmt.variable] = [];
          break;
        }
        
        try {
          if (!this._db) this._db = new Database('hyperianlang.db');
          const result = sql.trim().toLowerCase().startsWith('select')
            ? this._db.prepare(sql).all(...params)
            : this._db.prepare(sql).run(...params);
          if (stmt.variable) w._vars[stmt.variable] = result;
        } catch (e) {
          console.warn(`[HyperianLang] Database error: ${e.message}`);
          if (stmt.variable) w._vars[stmt.variable] = { error: e.message };
        }
        break;
      }

      case 'dbInsert': {
        if (!w || typeof require === 'undefined') break;
        const table = String(this._resolveValue(stmt.table));
        const data = this._resolveValue(stmt.data);
        
        if (typeof data !== 'object' || data === null) break;
        
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = columns.map(() => '?').join(', ');
        const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
        
        let Database;
        try { Database = require('better-sqlite3'); }
        catch (e) { break; }
        
        try {
          if (!this._db) this._db = new Database('hyperianlang.db');
          this._db.prepare(sql).run(...values);
        } catch (e) {
          console.warn(`[HyperianLang] Insert error: ${e.message}`);
        }
        break;
      }

      case 'dbSelect': {
        if (!w || typeof require === 'undefined') break;
        const table = String(this._resolveValue(stmt.table));
        const cols = Array.isArray(stmt.columns) ? stmt.columns.join(', ') : '*';
        let sql = `SELECT ${cols} FROM ${table}`;
        
        const params = [];
        if (stmt.where) {
          const where = this._resolveValue(stmt.where);
          sql += ` WHERE ${where}`;
        }
        if (stmt.limit) sql += ` LIMIT ${this._resolveValue(stmt.limit)}`;
        if (stmt.offset) sql += ` OFFSET ${this._resolveValue(stmt.offset)}`;
        
        let Database;
        try { Database = require('better-sqlite3'); }
        catch (e) { if (stmt.variable) w._vars[stmt.variable] = []; break; }
        
        try {
          if (!this._db) this._db = new Database('hyperianlang.db');
          const result = this._db.prepare(sql).all(...params);
          if (stmt.variable) w._vars[stmt.variable] = result;
        } catch (e) {
          console.warn(`[HyperianLang] Select error: ${e.message}`);
          if (stmt.variable) w._vars[stmt.variable] = [];
        }
        break;
      }

      // ── Async/Await ───────────────────────────────────────────────────────
      case 'await': {
        const expr = stmt.expr;
        let result;
        
        if (expr?.type === 'fetchUrl') {
          // Handle fetch
          const url = String(this._resolveValue(expr.url));
          const method = expr.method || 'GET';
          const body = expr.body ? this._resolveValue(expr.body) : null;
          
          try {
            if (typeof fetch !== 'undefined') {
              const opts = { method };
              if (body) {
                opts.body = JSON.stringify(body);
                opts.headers = { 'Content-Type': 'application/json' };
              }
              const res = await fetch(url, opts);
              result = await res.json();
            } else if (typeof require !== 'undefined') {
              // Node.js: use built-in fetch or http
              const https = require('https');
              const http = require('http');
              const urlModule = require('url');
              const parsed = urlModule.parse(url);
              const mod = parsed.protocol === 'https:' ? https : http;
              
              result = await new Promise((resolve, reject) => {
                const req = mod.request(url, { method }, (res) => {
                  let data = '';
                  res.on('data', chunk => data += chunk);
                  res.on('end', () => {
                    try { resolve(JSON.parse(data)); }
                    catch (e) { resolve(data); }
                  });
                });
                req.on('error', reject);
                if (body) req.write(JSON.stringify(body));
                req.end();
              });
            }
          } catch (e) {
            result = { error: e.message };
          }
          
          if (expr.variable && w) w._vars[expr.variable] = result;
        } else if (expr?.type === 'callFunction') {
          // Handle async function call
          await this._executeStatement(expr);
          result = w?._vars[expr.out] ?? null;
        } else {
          // Await a promise variable
          const promise = this._resolveValue(expr);
          if (promise && typeof promise.then === 'function') {
            result = await promise;
          } else {
            result = promise;
          }
        }
        
        if (stmt.variable && w) w._vars[stmt.variable] = result;
        break;
      }

      // ── setTimeout: after X seconds do ... end ────────────────────────────
      case 'setTimeout': {
        const delay = Number(this._resolveValue(stmt.delay)) * 1000;
        const body = stmt.body;
        setTimeout(async () => {
          try { await this._executeBody(body); }
          catch (e) { if (e !== _HL_BREAK && e !== _HL_SKIP) console.error('setTimeout error:', e); }
        }, delay);
        break;
      }

      // ── setInterval: interval X seconds do ... end ─────────────────────────
      case 'setInterval': {
        const delay = Number(this._resolveValue(stmt.delay)) * 1000;
        const body = stmt.body;
        const intervalId = setInterval(async () => {
          try { await this._executeBody(body); }
          catch (e) { 
            if (e === _HL_BREAK) clearInterval(intervalId);
            else if (e !== _HL_SKIP) console.error('setInterval error:', e);
          }
        }, delay);
        // Store interval ID in vars if specified
        if (stmt.id && w) w._vars[stmt.id] = intervalId;
        break;
      }

      // ── check if X contains Y into result ─────────────────────────────────
      case 'checkContains': {
        if (!w) break;
        const haystack = w._vars[stmt.haystack] ?? stmt.haystack;
        const needle = this._resolveValue(stmt.needle);
        let result = false;
        
        if (stmt.checkType === 'contains') {
          if (Array.isArray(haystack)) {
            result = haystack.includes(needle);
          } else {
            result = String(haystack).includes(String(needle));
          }
        } else if (stmt.checkType === 'startsWith') {
          result = String(haystack).startsWith(String(needle));
        } else if (stmt.checkType === 'endsWith') {
          result = String(haystack).endsWith(String(needle));
        }
        
        w._vars[stmt.out] = result;
        break;
      }

      case 'defineLambda': {
        if (!w) break;
        // Store lambda definition for later invocation
        w._vars[stmt.name] = {
          __isLambda: true,
          params: stmt.params,
          expr: stmt.expr
        };
        break;
      }

      case 'destructure': {
        if (!w) break;
        const source = w._vars[stmt.source];
        if (Array.isArray(source)) {
          // Array destructuring: extract by index
          stmt.keys.forEach((key, idx) => {
            w._vars[key] = source[idx];
          });
        } else if (typeof source === 'object' && source !== null) {
          // Object destructuring: extract by key
          stmt.keys.forEach(key => {
            w._vars[key] = source[key];
          });
        }
        if (stmt.into) {
          // Also create an object with extracted values
          const extracted = {};
          stmt.keys.forEach(key => {
            extracted[key] = w._vars[key];
          });
          w._vars[stmt.into] = extracted;
        }
        break;
      }

      case 'spread': {
        if (!w) break;
        const combined = [];
        for (const src of stmt.sources) {
          const val = w._vars[src];
          if (Array.isArray(val)) {
            combined.push(...val);
          } else if (typeof val === 'object' && val !== null) {
            combined.push(...Object.values(val));
          } else if (val !== undefined) {
            combined.push(val);
          }
        }
        w._vars[stmt.out] = combined;
        break;
      }

      case 'hash': {
        if (!w) break;
        const crypto = require('crypto');
        const input = this._resolveValue(stmt.input);
        const hash = crypto.createHash(stmt.algorithm).update(String(input)).digest('hex');
        w._vars[stmt.out] = hash;
        break;
      }

      case 'encrypt': {
        if (!w) break;
        const crypto = require('crypto');
        const input = this._resolveValue(stmt.input);
        const key = this._resolveValue(stmt.key);
        // Simple AES-256-CBC encryption
        const algorithm = 'aes-256-cbc';
        const keyBuffer = crypto.createHash('sha256').update(String(key)).digest();
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
        let encrypted = cipher.update(String(input), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        w._vars[stmt.out] = iv.toString('hex') + ':' + encrypted;
        break;
      }

      case 'decode': {
        if (!w) break;
        const input = this._resolveValue(stmt.input);
        let result;
        if (stmt.encoding === 'base64') {
          result = Buffer.from(String(input), 'base64').toString('utf8');
        } else if (stmt.encoding === 'hex') {
          result = Buffer.from(String(input), 'hex').toString('utf8');
        } else {
          result = String(input);
        }
        w._vars[stmt.out] = result;
        break;
      }

      case 'encode': {
        if (!w) break;
        const input = this._resolveValue(stmt.input);
        let result;
        if (stmt.encoding === 'base64') {
          result = Buffer.from(String(input), 'utf8').toString('base64');
        } else if (stmt.encoding === 'hex') {
          result = Buffer.from(String(input), 'utf8').toString('hex');
        } else {
          result = String(input);
        }
        w._vars[stmt.out] = result;
        break;
      }

      case 'createBuffer': {
        if (!w) break;
        const input = this._resolveValue(stmt.input);
        const encoding = stmt.encoding || 'utf8';
        w._vars[stmt.out] = Buffer.from(String(input), encoding);
        break;
      }

      case 'safeGet': {
        if (!w) break;
        const source = w._vars[stmt.source];
        const key = this._resolveValue(stmt.key);
        const defaultVal = this._resolveValue(stmt.defaultVal);
        let result;
        if (source === null || source === undefined) {
          result = defaultVal;
        } else if (typeof source === 'object') {
          result = source[key] ?? defaultVal;
        } else {
          result = defaultVal;
        }
        w._vars[stmt.out] = result;
        break;
      }

      case 'defineGenerator': {
        if (!w) break;
        // Store generator definition for later instantiation
        w._vars[stmt.name] = {
          __isGenerator: true,
          initVar: stmt.initVar,
          initVal: stmt.initVal,
          body: stmt.body
        };
        break;
      }

      case 'yield': {
        // Yield is handled specially inside generator execution
        const value = this._resolveValue(stmt.value);
        const err = new Error('__hlYield');
        err.__hlYield = true;
        err.value = value;
        throw err;
      }

      case 'createProxy': {
        if (!w) break;
        const target = w._vars[stmt.target] || {};
        const handler = {};
        // If traps reference a handler object
        if (stmt.traps.length && stmt.traps[0].type === 'reference') {
          const handlerObj = w._vars[stmt.traps[0].name] || {};
          Object.assign(handler, handlerObj);
        }
        w._vars[stmt.out] = new Proxy(target, handler);
        break;
      }

      case 'interceptTrap': {
        if (!w) break;
        // Store trap definition for use with proxy
        const trapDef = {
          trapType: stmt.trapType,
          body: stmt.body,
          interpreter: this
        };
        if (!w._vars['__traps']) w._vars['__traps'] = {};
        if (!w._vars['__traps'][stmt.target]) w._vars['__traps'][stmt.target] = {};
        w._vars['__traps'][stmt.target][stmt.trapType] = trapDef;
        break;
      }

      case 'createWeakMap': {
        if (!w) break;
        w._vars[stmt.out] = new WeakMap();
        break;
      }

      case 'createWeakSet': {
        if (!w) break;
        w._vars[stmt.out] = new WeakSet();
        break;
      }

      case 'createSymbol': {
        if (!w) break;
        if (stmt.isUnique) {
          // Symbol.for creates a global/unique symbol
          w._vars[stmt.out] = Symbol.for(stmt.description || stmt.out);
        } else {
          w._vars[stmt.out] = Symbol(stmt.description || '');
        }
        break;
      }

      case 'createBigInt': {
        if (!w) break;
        const value = this._resolveValue(stmt.value);
        try {
          w._vars[stmt.out] = BigInt(value);
        } catch (e) {
          w._vars[stmt.out] = BigInt(0);
        }
        break;
      }

      case 'taggedTemplate': {
        if (!w) break;
        const tagFn = w._vars[stmt.tagFn];
        const template = this._resolveValue(stmt.template);
        if (typeof tagFn === 'function') {
          // Call the tag function with strings array and values
          // For simplicity, treat as single string template
          if (template && template.parts) {
            const strings = [];
            const values = [];
            for (const part of template.parts) {
              if (part.type === 'text') strings.push(part.value);
              else if (part.type === 'var') values.push(w._vars[part.value]);
            }
            // Ensure strings has one more element than values
            if (strings.length <= values.length) strings.push('');
            strings.raw = [...strings];
            w._vars[stmt.out] = tagFn(strings, ...values);
          } else {
            w._vars[stmt.out] = tagFn([String(template)], ...[]);
          }
        } else {
          // No tag function, just resolve the template
          w._vars[stmt.out] = template;
        }
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PROMISE API
      // ═══════════════════════════════════════════════════════════════════════

      case 'promise': {
        if (!w) break;
        const value = this._resolveValue(stmt.value);
        if (stmt.action === 'resolve') {
          w._vars[stmt.out] = Promise.resolve(value);
        } else if (stmt.action === 'reject') {
          w._vars[stmt.out] = Promise.reject(value);
        }
        break;
      }

      case 'promiseAll': {
        if (!w) break;
        const promises = w._vars[stmt.promises] || [];
        w._vars[stmt.out] = await Promise.all(promises);
        break;
      }

      case 'promiseRace': {
        if (!w) break;
        const promises = w._vars[stmt.promises] || [];
        w._vars[stmt.out] = await Promise.race(promises);
        break;
      }

      case 'promiseAllSettled': {
        if (!w) break;
        const promises = w._vars[stmt.promises] || [];
        w._vars[stmt.out] = await Promise.allSettled(promises);
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // OBJECT METHODS
      // ═══════════════════════════════════════════════════════════════════════

      case 'freezeObj': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        if (obj && typeof obj === 'object') Object.freeze(obj);
        break;
      }

      case 'sealObj': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        if (obj && typeof obj === 'object') Object.seal(obj);
        break;
      }

      case 'objectIs': {
        if (!w) break;
        const a = this._resolveValue(stmt.a);
        const b = this._resolveValue(stmt.b);
        w._vars[stmt.out] = Object.is(a, b);
        break;
      }

      case 'fromPairs': {
        if (!w) break;
        const entries = w._vars[stmt.entries] || [];
        w._vars[stmt.out] = Object.fromEntries(entries);
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // ARRAY METHODS
      // ═══════════════════════════════════════════════════════════════════════

      case 'arrayFrom': {
        if (!w) break;
        const iterable = w._vars[stmt.iterable];
        w._vars[stmt.out] = Array.from(iterable || []);
        break;
      }

      case 'isArray': {
        if (!w) break;
        const value = w._vars[stmt.value];
        w._vars[stmt.out] = Array.isArray(value);
        break;
      }

      case 'flatMap': {
        if (!w) break;
        const arr = w._vars[stmt.arr] || [];
        const fn = w._vars[stmt.fn] || this._functions.get(stmt.fn);
        if (typeof fn === 'function') {
          w._vars[stmt.out] = arr.flatMap(fn);
        } else if (fn && fn.body) {
          // User-defined function
          const results = [];
          for (const item of arr) {
            const localVars = { ...w._vars };
            if (fn.params && fn.params.length > 0) localVars[fn.params[0]] = item;
            const savedVars = { ...w._vars };
            w._vars = localVars;
            await this._executeBody(fn.body);
            if (w._vars._returnValue !== undefined) {
              const val = w._vars._returnValue;
              if (Array.isArray(val)) results.push(...val);
              else results.push(val);
              delete w._vars._returnValue;
            }
            w._vars = savedVars;
          }
          w._vars[stmt.out] = results;
        } else {
          w._vars[stmt.out] = arr.flat();
        }
        break;
      }

      case 'fillArray': {
        if (!w) break;
        const arr = w._vars[stmt.arr] || [];
        const value = this._resolveValue(stmt.value);
        const start = stmt.start ? this._resolveValue(stmt.start) : undefined;
        const end = stmt.end ? this._resolveValue(stmt.end) : undefined;
        arr.fill(value, start, end);
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // DATE/TIME
      // ═══════════════════════════════════════════════════════════════════════

      case 'dateCreate': {
        if (!w) break;
        if (stmt.dateValue) {
          const val = this._resolveValue(stmt.dateValue);
          w._vars[stmt.out] = new Date(val);
        } else {
          w._vars[stmt.out] = new Date();
        }
        break;
      }

      case 'now': {
        if (!w) break;
        w._vars[stmt.out] = Date.now();
        break;
      }

      case 'timestamp': {
        if (!w) break;
        if (stmt.dateVar) {
          const date = w._vars[stmt.dateVar];
          w._vars[stmt.out] = date instanceof Date ? date.getTime() : Date.now();
        } else {
          w._vars[stmt.out] = Date.now();
        }
        break;
      }

      case 'toISO': {
        if (!w) break;
        const date = w._vars[stmt.dateVar];
        w._vars[stmt.out] = date instanceof Date ? date.toISOString() : new Date().toISOString();
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // TYPED ARRAYS
      // ═══════════════════════════════════════════════════════════════════════

      case 'typedArray': {
        if (!w) break;
        const TypedArrayConstructor = {
          'Uint8Array': Uint8Array,
          'Int32Array': Int32Array,
          'Float64Array': Float64Array,
          'Uint16Array': Uint16Array,
          'Int8Array': Int8Array,
          'Int16Array': Int16Array,
          'Uint32Array': Uint32Array,
          'Float32Array': Float32Array,
        }[stmt.arrayType] || Uint8Array;
        if (stmt.source) {
          const src = this._resolveValue(stmt.source);
          w._vars[stmt.out] = new TypedArrayConstructor(src);
        } else if (stmt.size) {
          const size = this._resolveValue(stmt.size);
          w._vars[stmt.out] = new TypedArrayConstructor(size);
        } else {
          w._vars[stmt.out] = new TypedArrayConstructor(0);
        }
        break;
      }

      case 'arrayBuffer': {
        if (!w) break;
        const size = this._resolveValue(stmt.size);
        w._vars[stmt.out] = new ArrayBuffer(size);
        break;
      }

      case 'dataView': {
        if (!w) break;
        const buffer = w._vars[stmt.buffer];
        const offset = stmt.offset ? this._resolveValue(stmt.offset) : 0;
        const length = stmt.length ? this._resolveValue(stmt.length) : undefined;
        if (buffer instanceof ArrayBuffer) {
          w._vars[stmt.out] = new DataView(buffer, offset, length);
        }
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // REFLECT API
      // ═══════════════════════════════════════════════════════════════════════

      case 'reflectGet': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        const prop = this._resolveValue(stmt.prop);
        w._vars[stmt.out] = Reflect.get(obj || {}, prop);
        break;
      }

      case 'reflectSet': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        const prop = this._resolveValue(stmt.prop);
        const value = this._resolveValue(stmt.value);
        Reflect.set(obj || {}, prop, value);
        break;
      }

      case 'reflectHas': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        const prop = this._resolveValue(stmt.prop);
        w._vars[stmt.out] = Reflect.has(obj || {}, prop);
        break;
      }

      case 'reflectDelete': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        const prop = this._resolveValue(stmt.prop);
        Reflect.deleteProperty(obj || {}, prop);
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // INTL FORMATTING
      // ═══════════════════════════════════════════════════════════════════════

      case 'formatDate': {
        if (!w) break;
        const date = w._vars[stmt.dateVar];
        const locale = stmt.locale || 'en-US';
        const options = stmt.options || {};
        const formatter = new Intl.DateTimeFormat(locale, options);
        w._vars[stmt.out] = formatter.format(date instanceof Date ? date : new Date(date));
        break;
      }

      case 'formatNumber': {
        if (!w) break;
        const value = this._resolveValue(stmt.value);
        const locale = stmt.locale || 'en-US';
        const options = stmt.options || {};
        const formatter = new Intl.NumberFormat(locale, options);
        w._vars[stmt.out] = formatter.format(value);
        break;
      }

      case 'currency': {
        if (!w) break;
        const value = this._resolveValue(stmt.value);
        const currencyCode = stmt.currencyCode || 'USD';
        const locale = stmt.locale || 'en-US';
        const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode });
        w._vars[stmt.out] = formatter.format(value);
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - Promise.any
      // ═══════════════════════════════════════════════════════════════════════

      case 'promiseAny': {
        if (!w) break;
        const promises = w._vars[stmt.promises] || [];
        w._vars[stmt.out] = await Promise.any(promises);
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - Object methods
      // ═══════════════════════════════════════════════════════════════════════

      case 'defineProperty': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        const prop = this._resolveValue(stmt.prop);
        const descriptor = {};
        for (const [k, v] of Object.entries(stmt.descriptor || {})) {
          descriptor[k] = this._resolveValue(v);
        }
        if (obj && typeof obj === 'object') {
          Object.defineProperty(obj, prop, descriptor);
        }
        break;
      }

      case 'getDescriptor': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        const prop = this._resolveValue(stmt.prop);
        w._vars[stmt.out] = Object.getOwnPropertyDescriptor(obj || {}, prop);
        break;
      }

      case 'getPrototype': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        w._vars[stmt.out] = Object.getPrototypeOf(obj || {});
        break;
      }

      case 'setPrototype': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        const proto = w._vars[stmt.proto];
        if (obj && proto !== undefined) {
          Object.setPrototypeOf(obj, proto);
        }
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - Array methods
      // ═══════════════════════════════════════════════════════════════════════

      case 'reduceRight': {
        if (!w) break;
        const arr = w._vars[stmt.arr] || [];
        const fn = w._vars[stmt.fn] || this._functions.get(stmt.fn);
        const initial = stmt.initial ? this._resolveValue(stmt.initial) : undefined;
        if (typeof fn === 'function') {
          w._vars[stmt.out] = initial !== undefined ? arr.reduceRight(fn, initial) : arr.reduceRight(fn);
        } else if (fn && fn.body) {
          let acc = initial !== undefined ? initial : arr[arr.length - 1];
          const startIdx = initial !== undefined ? arr.length - 1 : arr.length - 2;
          for (let i = startIdx; i >= 0; i--) {
            const localVars = { ...w._vars };
            if (fn.params && fn.params.length >= 2) {
              localVars[fn.params[0]] = acc;
              localVars[fn.params[1]] = arr[i];
            }
            const savedVars = { ...w._vars };
            w._vars = localVars;
            await this._executeBody(fn.body);
            if (w._vars._returnValue !== undefined) {
              acc = w._vars._returnValue;
              delete w._vars._returnValue;
            }
            w._vars = savedVars;
          }
          w._vars[stmt.out] = acc;
        }
        break;
      }

      case 'copyWithin': {
        if (!w) break;
        const arr = w._vars[stmt.arr] || [];
        const target = this._resolveValue(stmt.target);
        const start = stmt.start ? this._resolveValue(stmt.start) : undefined;
        const end = stmt.end ? this._resolveValue(stmt.end) : undefined;
        arr.copyWithin(target, start, end);
        break;
      }

      case 'itemAt': {
        if (!w) break;
        const arr = w._vars[stmt.arr] || [];
        const index = this._resolveValue(stmt.index);
        w._vars[stmt.out] = arr.at ? arr.at(index) : arr[index < 0 ? arr.length + index : index];
        break;
      }

      case 'toSorted': {
        if (!w) break;
        const arr = w._vars[stmt.arr] || [];
        const fn = stmt.fn ? (w._vars[stmt.fn] || this._functions.get(stmt.fn)) : undefined;
        w._vars[stmt.out] = arr.toSorted ? arr.toSorted(fn) : [...arr].sort(fn);
        break;
      }

      case 'toReversed': {
        if (!w) break;
        const arr = w._vars[stmt.arr] || [];
        w._vars[stmt.out] = arr.toReversed ? arr.toReversed() : [...arr].reverse();
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - String methods
      // ═══════════════════════════════════════════════════════════════════════

      case 'replaceAll': {
        if (!w) break;
        const str = String(w._vars[stmt.str] || '');
        const search = this._resolveValue(stmt.search);
        const replacement = this._resolveValue(stmt.replacement);
        w._vars[stmt.out] = str.replaceAll(search, replacement);
        break;
      }

      case 'charAt': {
        if (!w) break;
        const str = String(w._vars[stmt.str] || '');
        const index = this._resolveValue(stmt.index);
        w._vars[stmt.out] = str.charAt(index);
        break;
      }

      case 'normalize': {
        if (!w) break;
        const str = String(w._vars[stmt.str] || '');
        const form = this._resolveValue(stmt.form) || 'NFC';
        w._vars[stmt.out] = str.normalize(form);
        break;
      }

      case 'localeCompare': {
        if (!w) break;
        const a = String(w._vars[stmt.a] || '');
        const b = String(w._vars[stmt.b] || '');
        const locale = stmt.locale ? this._resolveValue(stmt.locale) : undefined;
        w._vars[stmt.out] = a.localeCompare(b, locale);
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - Number methods
      // ═══════════════════════════════════════════════════════════════════════

      case 'isInteger': {
        if (!w) break;
        const value = this._resolveValue(stmt.value);
        w._vars[stmt.out] = Number.isInteger(value);
        break;
      }

      case 'isFinite': {
        if (!w) break;
        const value = this._resolveValue(stmt.value);
        w._vars[stmt.out] = Number.isFinite(value);
        break;
      }

      case 'isNaN': {
        if (!w) break;
        const value = this._resolveValue(stmt.value);
        w._vars[stmt.out] = Number.isNaN(value);
        break;
      }

      case 'parseFloat': {
        if (!w) break;
        const str = this._resolveValue(stmt.str);
        w._vars[stmt.out] = parseFloat(str);
        break;
      }

      case 'parseInt': {
        if (!w) break;
        const str = this._resolveValue(stmt.str);
        const radix = stmt.radix ? this._resolveValue(stmt.radix) : 10;
        w._vars[stmt.out] = parseInt(str, radix);
        break;
      }

      case 'toFixed': {
        if (!w) break;
        const num = this._resolveValue(stmt.num);
        const digits = this._resolveValue(stmt.digits);
        w._vars[stmt.out] = Number(num).toFixed(digits);
        break;
      }

      case 'toPrecision': {
        if (!w) break;
        const num = this._resolveValue(stmt.num);
        const precision = this._resolveValue(stmt.precision);
        w._vars[stmt.out] = Number(num).toPrecision(precision);
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - Math methods
      // ═══════════════════════════════════════════════════════════════════════

      case 'trunc': {
        if (!w) break;
        const value = this._resolveValue(stmt.value);
        w._vars[stmt.out] = Math.trunc(value);
        break;
      }

      case 'cbrt': {
        if (!w) break;
        const value = this._resolveValue(stmt.value);
        w._vars[stmt.out] = Math.cbrt(value);
        break;
      }

      case 'hypot': {
        if (!w) break;
        const values = (stmt.values || []).map(v => this._resolveValue(v));
        w._vars[stmt.out] = Math.hypot(...values);
        break;
      }

      case 'log2': {
        if (!w) break;
        const value = this._resolveValue(stmt.value);
        w._vars[stmt.out] = Math.log2(value);
        break;
      }

      case 'log10': {
        if (!w) break;
        const value = this._resolveValue(stmt.value);
        w._vars[stmt.out] = Math.log10(value);
        break;
      }

      case 'sinh': {
        if (!w) break;
        const value = this._resolveValue(stmt.value);
        w._vars[stmt.out] = Math.sinh(value);
        break;
      }

      case 'cosh': {
        if (!w) break;
        const value = this._resolveValue(stmt.value);
        w._vars[stmt.out] = Math.cosh(value);
        break;
      }

      case 'tanh': {
        if (!w) break;
        const value = this._resolveValue(stmt.value);
        w._vars[stmt.out] = Math.tanh(value);
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - URL
      // ═══════════════════════════════════════════════════════════════════════

      case 'url': {
        if (!w) break;
        const urlStr = this._resolveValue(stmt.urlStr);
        const base = stmt.base ? this._resolveValue(stmt.base) : undefined;
        w._vars[stmt.out] = base ? new URL(urlStr, base) : new URL(urlStr);
        break;
      }

      case 'searchParams': {
        if (!w) break;
        const init = this._resolveValue(stmt.init);
        w._vars[stmt.out] = new URLSearchParams(init);
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - Console
      // ═══════════════════════════════════════════════════════════════════════

      case 'consoleTable': {
        if (!w) break;
        const data = w._vars[stmt.data];
        console.table(data);
        break;
      }

      case 'consoleGroup': {
        const label = stmt.label ? this._resolveValue(stmt.label) : undefined;
        label ? console.group(label) : console.group();
        break;
      }

      case 'consoleGroupEnd': {
        console.groupEnd();
        break;
      }

      case 'consoleTime': {
        const label = this._resolveValue(stmt.label);
        console.time(label);
        break;
      }

      case 'consoleTimeEnd': {
        const label = this._resolveValue(stmt.label);
        console.timeEnd(label);
        break;
      }

      case 'consoleAssert': {
        if (!w) break;
        const condition = this._evalCondition(stmt.condition, w, {});
        const message = stmt.message ? this._resolveValue(stmt.message) : undefined;
        console.assert(condition, message);
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // MISSING JS FEATURES - Misc
      // ═══════════════════════════════════════════════════════════════════════

      case 'clone': {
        if (!w) break;
        const obj = w._vars[stmt.obj];
        w._vars[stmt.out] = structuredClone ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
        break;
      }

      case 'microtask': {
        if (!w) break;
        const fn = w._vars[stmt.fn] || this._functions.get(stmt.fn);
        if (typeof fn === 'function') {
          queueMicrotask(fn);
        } else if (fn && fn.body) {
          queueMicrotask(async () => {
            await this._executeBody(fn.body);
          });
        }
        break;
      }

      case 'abortController': {
        if (!w) break;
        const controller = new AbortController();
        w._vars[stmt.controller] = controller;
        if (stmt.signal) {
          w._vars[stmt.signal] = controller.signal;
        }
        break;
      }

      case 'textEncode': {
        if (!w) break;
        const str = this._resolveValue(stmt.str);
        const encoder = new TextEncoder();
        w._vars[stmt.out] = encoder.encode(str);
        break;
      }

      case 'textDecode': {
        if (!w) break;
        const bytes = w._vars[stmt.bytes];
        const encoding = stmt.encoding || 'utf-8';
        const decoder = new TextDecoder(encoding);
        w._vars[stmt.out] = decoder.decode(bytes);
        break;
      }
    }
  }

  /** Recursively resolve all leaf values in a props object. */
  _resolveProps(props) {
    const out = {};
    for (const [k, v] of Object.entries(props)) {
      if (Array.isArray(v)) {
        out[k] = v.map(el => typeof el === 'object' && el !== null && el.type ? this._resolveValue(el) : el);
      } else if (v !== null && typeof v === 'object' && !v.type) {
        const sub = {};
        for (const [sk, sv] of Object.entries(v)) sub[sk] = typeof sv === 'object' && sv?.type ? this._resolveValue(sv) : sv;
        out[k] = sub;
      } else {
        out[k] = typeof v === 'object' && v?.type ? this._resolveValue(v) : v;
      }
    }
    return out;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC API WRAPPER
// ═══════════════════════════════════════════════════════════════════════════

class HyperianLang {
  constructor(world) {
    this.world       = world || null;
    this.interpreter = new HLInterpreter(world || null);
  }

  setWorld(world) {
    this.world = world;
    this.interpreter.world = world;
  }

  load(sourceString) {
    const tokens = new HLLexer(sourceString).tokenize();
    const ast    = new HLParser(tokens).parse();
    this.interpreter.load(ast);
  }

  loadScene(sourceString) {
    const tokens = new HLLexer(sourceString).tokenize();
    const ast    = new HLParser(tokens).parse();
    for (const rule of ast.rules) {
      const key = this.interpreter._eventKey(rule.event);
      if (key) {
        if (!this.interpreter.eventRules.has(key)) this.interpreter.eventRules.set(key, []);
        rule._isScene = true;
        this.interpreter.eventRules.get(key).push(rule);
      }
      if (rule.event.type === 'condition') {
        rule._isScene = true;
        this.interpreter.conditionRules.push(rule);
      }
    }
  }

  unloadScene() {
    for (const [key, rules] of this.interpreter.eventRules)
      this.interpreter.eventRules.set(key, rules.filter(r => !r._isScene));
    this.interpreter.conditionRules = this.interpreter.conditionRules.filter(r => !r._isScene);
  }

  async run()            { await this.interpreter.run(); }
  async trigger(eventKey) { await this.interpreter.trigger(eventKey); }
  async tick()            { await this.interpreter.evaluateFrame(); }
}

// ─── Export (Node.js / CommonJS + browser global) ───────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HLLexer, HLParser, HLInterpreter, HyperianLang };
} else if (typeof window !== 'undefined') {
  window.HLLexer       = HLLexer;
  window.HLParser      = HLParser;
  window.HLInterpreter = HLInterpreter;
  window.HyperianLang  = HyperianLang;
}
