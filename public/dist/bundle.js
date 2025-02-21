/*! For license information please see bundle.js.LICENSE.txt */
(() => {
  function t(e) { return t = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (t) { return typeof t; } : function (t) { return t && typeof Symbol === 'function' && t.constructor === Symbol && t !== Symbol.prototype ? 'symbol' : typeof t; }, t(e); } function e(t, e) { (e == null || e > t.length) && (e = t.length); for (var r = 0, n = Array(e); r < e; r++)n[r] = t[r]; return n; } function r() {
    r = function () { return n; }; let e; var n = {}; const o = Object.prototype; const a = o.hasOwnProperty; const i = Object.defineProperty || function (t, e, r) { t[e] = r.value; }; const c = typeof Symbol === 'function' ? Symbol : {}; const u = c.iterator || '@@iterator'; const s = c.asyncIterator || '@@asyncIterator'; const l = c.toStringTag || '@@toStringTag'; function f(t, e, r) {
      return Object.defineProperty(t, e, {
        value: r, enumerable: !0, configurable: !0, writable: !0
      }), t[e];
    } try { f({}, ''); } catch (e) { f = function (t, e, r) { return t[e] = r; }; } function d(t, e, r, n) { const o = e && e.prototype instanceof w ? e : w; const a = Object.create(o.prototype); const c = new _(n || []); return i(a, '_invoke', { value: C(t, r, c) }), a; } function h(t, e, r) { try { return { type: 'normal', arg: t.call(e, r) }; } catch (t) { return { type: 'throw', arg: t }; } }n.wrap = d; const p = 'suspendedStart'; const m = 'suspendedYield'; const y = 'executing'; const v = 'completed'; const g = {}; function w() {} function b() {} function x() {} let k = {}; f(k, u, (function () { return this; })); const L = Object.getPrototypeOf; const E = L && L(L(F([]))); E && E !== o && a.call(E, u) && (k = E); const S = x.prototype = w.prototype = Object.create(k); function j(t) { ['next', 'throw', 'return'].forEach(((e) => { f(t, e, (function (t) { return this._invoke(e, t); })); })); } function T(e, r) { function n(o, i, c, u) { const s = h(e[o], e, i); if (s.type !== 'throw') { const l = s.arg; const f = l.value; return f && t(f) == 'object' && a.call(f, '__await') ? r.resolve(f.__await).then(((t) => { n('next', t, c, u); }), ((t) => { n('throw', t, c, u); })) : r.resolve(f).then(((t) => { l.value = t, c(l); }), ((t) => n('throw', t, c, u))); }u(s.arg); } let o; i(this, '_invoke', { value(t, e) { function a() { return new r(((r, o) => { n(t, e, r, o); })); } return o = o ? o.then(a, a) : a(); } }); } function C(t, r, n) { let o = p; return function (a, i) { if (o === y) throw Error('Generator is already running'); if (o === v) { if (a === 'throw') throw i; return { value: e, done: !0 }; } for (n.method = a, n.arg = i; ;) { const c = n.delegate; if (c) { const u = D(c, n); if (u) { if (u === g) continue; return u; } } if (n.method === 'next')n.sent = n._sent = n.arg; else if (n.method === 'throw') { if (o === p) throw o = v, n.arg; n.dispatchException(n.arg); } else n.method === 'return' && n.abrupt('return', n.arg); o = y; const s = h(t, r, n); if (s.type === 'normal') { if (o = n.done ? v : m, s.arg === g) continue; return { value: s.arg, done: n.done }; }s.type === 'throw' && (o = v, n.method = 'throw', n.arg = s.arg); } }; } function D(t, r) { const n = r.method; const o = t.iterator[n]; if (o === e) return r.delegate = null, n === 'throw' && t.iterator.return && (r.method = 'return', r.arg = e, D(t, r), r.method === 'throw') || n !== 'return' && (r.method = 'throw', r.arg = new TypeError(`The iterator does not provide a '${n}' method`)), g; const a = h(o, t.iterator, r.arg); if (a.type === 'throw') return r.method = 'throw', r.arg = a.arg, r.delegate = null, g; const i = a.arg; return i ? i.done ? (r[t.resultName] = i.value, r.next = t.nextLoc, r.method !== 'return' && (r.method = 'next', r.arg = e), r.delegate = null, g) : i : (r.method = 'throw', r.arg = new TypeError('iterator result is not an object'), r.delegate = null, g); } function O(t) { const e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function q(t) { const e = t.completion || {}; e.type = 'normal', delete e.arg, t.completion = e; } function _(t) { this.tryEntries = [{ tryLoc: 'root' }], t.forEach(O, this), this.reset(!0); } function F(r) { if (r || r === '') { const n = r[u]; if (n) return n.call(r); if (typeof r.next === 'function') return r; if (!isNaN(r.length)) { let o = -1; const i = function t() { for (;++o < r.length;) if (a.call(r, o)) return t.value = r[o], t.done = !1, t; return t.value = e, t.done = !0, t; }; return i.next = i; } } throw new TypeError(`${t(r)} is not iterable`); } return b.prototype = x, i(S, 'constructor', { value: x, configurable: !0 }), i(x, 'constructor', { value: b, configurable: !0 }), b.displayName = f(x, l, 'GeneratorFunction'), n.isGeneratorFunction = function (t) { const e = typeof t === 'function' && t.constructor; return !!e && (e === b || (e.displayName || e.name) === 'GeneratorFunction'); }, n.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, x) : (t.__proto__ = x, f(t, l, 'GeneratorFunction')), t.prototype = Object.create(S), t; }, n.awrap = function (t) { return { __await: t }; }, j(T.prototype), f(T.prototype, s, (function () { return this; })), n.AsyncIterator = T, n.async = function (t, e, r, o, a) { void 0 === a && (a = Promise); const i = new T(d(t, e, r, o), a); return n.isGeneratorFunction(e) ? i : i.next().then(((t) => (t.done ? t.value : i.next()))); }, j(S), f(S, l, 'Generator'), f(S, u, (function () { return this; })), f(S, 'toString', (() => '[object Generator]')), n.keys = function (t) { const e = Object(t); const r = []; for (const n in e)r.push(n); return r.reverse(), function t() { for (;r.length;) { const n = r.pop(); if (n in e) return t.value = n, t.done = !1, t; } return t.done = !0, t; }; }, n.values = F, _.prototype = {
      constructor: _, reset(t) { if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = 'next', this.arg = e, this.tryEntries.forEach(q), !t) for (const r in this)r.charAt(0) === 't' && a.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = e); }, stop() { this.done = !0; const t = this.tryEntries[0].completion; if (t.type === 'throw') throw t.arg; return this.rval; }, dispatchException(t) { if (this.done) throw t; const r = this; function n(n, o) { return c.type = 'throw', c.arg = t, r.next = n, o && (r.method = 'next', r.arg = e), !!o; } for (let o = this.tryEntries.length - 1; o >= 0; --o) { const i = this.tryEntries[o]; var c = i.completion; if (i.tryLoc === 'root') return n('end'); if (i.tryLoc <= this.prev) { const u = a.call(i, 'catchLoc'); const s = a.call(i, 'finallyLoc'); if (u && s) { if (this.prev < i.catchLoc) return n(i.catchLoc, !0); if (this.prev < i.finallyLoc) return n(i.finallyLoc); } else if (u) { if (this.prev < i.catchLoc) return n(i.catchLoc, !0); } else { if (!s) throw Error('try statement without catch or finally'); if (this.prev < i.finallyLoc) return n(i.finallyLoc); } } } }, abrupt(t, e) { for (let r = this.tryEntries.length - 1; r >= 0; --r) { const n = this.tryEntries[r]; if (n.tryLoc <= this.prev && a.call(n, 'finallyLoc') && this.prev < n.finallyLoc) { var o = n; break; } }o && (t === 'break' || t === 'continue') && o.tryLoc <= e && e <= o.finallyLoc && (o = null); const i = o ? o.completion : {}; return i.type = t, i.arg = e, o ? (this.method = 'next', this.next = o.finallyLoc, g) : this.complete(i); }, complete(t, e) { if (t.type === 'throw') throw t.arg; return t.type === 'break' || t.type === 'continue' ? this.next = t.arg : t.type === 'return' ? (this.rval = this.arg = t.arg, this.method = 'return', this.next = 'end') : t.type === 'normal' && e && (this.next = e), g; }, finish(t) { for (let e = this.tryEntries.length - 1; e >= 0; --e) { const r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), q(r), g; } }, catch(t) { for (let e = this.tryEntries.length - 1; e >= 0; --e) { const r = this.tryEntries[e]; if (r.tryLoc === t) { const n = r.completion; if (n.type === 'throw') { var o = n.arg; q(r); } return o; } } throw Error('illegal catch attempt'); }, delegateYield(t, r, n) { return this.delegate = { iterator: F(t), resultName: r, nextLoc: n }, this.method === 'next' && (this.arg = e), g; }
    }, n;
  } function n(t, e, r, n, o, a, i) { try { var c = t[a](i); var u = c.value; } catch (t) { return void r(t); }c.done ? e(u) : Promise.resolve(u).then(n, o); } function o(t) { return function () { const e = this; const r = arguments; return new Promise(((o, a) => { const i = t.apply(e, r); function c(t) { n(i, o, a, c, u, 'next', t); } function u(t) { n(i, o, a, c, u, 'throw', t); }c(void 0); })); }; } const a = (function () { const t = o(r().mark((function t() { let e; let n; return r().wrap(((t) => { for (;;) switch (t.prev = t.next) { case 0: e = [{ text: 'haiiii', timestamp: Date.now() - 3e5, status: 'read' }, { text: 'aku udh sampee', timestamp: Date.now() - 24e4, status: 'read' }, { text: 'udah sampeeeee??', timestamp: Date.now() - 18e4 }, { text: 'alhamdulillah udaah sampeee', timestamp: Date.now() - 12e4 }, { text: 'tadi ngapain aja sini cerita', timestamp: Date.now() - 6e4 }, { text: 'si konbrut gaya bnr ngmngnya🤣🤣🤣', timestamp: Date.now() - 45e3, status: 'read' }, { text: 'apaan sih orang di aku kecil', timestamp: Date.now() - 3e4 }, { text: 'se jentik', timestamp: Date.now() - 25e3 }, { text: 'muka gw ky gembel😅', timestamp: Date.now() - 2e4, status: 'read' }, { text: 'bejir tobrut banget bangke', timestamp: Date.now() - 15e3 }, { text: 'ko do tutupin stiker siii😡😡😡', timestamp: Date.now() - 1e4 }, { text: 'kan lucuuu', timestamp: Date.now() - 5e3 }, { text: 'sayangggggggg', timestamp: Date.now() }], (n = document.querySelector('.message-list')).innerHTML = '', e.forEach(((t, e) => { const r = i(t, e % 2 == 1); n.appendChild(r); })), n.scrollTop = n.scrollHeight; case 5: case 'end': return t.stop(); } }), t); }))); return function () { return t.apply(this, arguments); }; }()); function i(t) { const e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1]; const r = document.querySelector('#message-template').content.cloneNode(!0); const n = r.querySelector('.message'); const o = r.querySelector('.message-text'); const a = r.querySelector('.message-time'); const i = r.querySelector('.message-status'); n.classList.add(e ? 'message-own' : 'message-other'), o.textContent = t.text; const c = new Date(t.timestamp); return a.textContent = c.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: !0 }), i && t.status && i.classList.add('status-'.concat(t.status)), r; } function c() { return u.apply(this, arguments); } function u() {
    return (u = o(r().mark((function t() {
      let e; let n; let o; let a; let i; let c; let u; let s; return r().wrap(((t) => {
        for (;;) {
          switch (t.prev = t.next) {
            case 0: if (e = document.querySelector('.chat-input'), (n = e.innerHTML.trim()) || selectedFile || recordingVoice) { t.next = 4; break; } return t.abrupt('return'); case 4: if (o = {
              chatId: currentChat,
              content: n,
              replyTo: replyingTo,
              formatting: {
                bold: /font-weight:\s*bold/.test(n), italic: /font-style:\s*italic/.test(n), strikethrough: /text-decoration:\s*line-through/.test(n), monospace: /<code>.*<\/code>/.test(n)
              }
            }, !selectedFile) { t.next = 24; break; } return (a = new FormData()).append('file', selectedFile), t.prev = 8, t.next = 11, fetch('/api/upload', { method: 'POST', headers: { 'x-auth-token': authToken }, body: a }); case 11: return i = t.sent, t.next = 14, i.json(); case 14: c = t.sent, u = c.url, s = c.thumbnail, o.media = {
              url: u, thumbnail: s, type: selectedFile.type, name: selectedFile.name, size: selectedFile.size
            }, t.next = 24; break; case 20: return t.prev = 20, t.t0 = t.catch(8), showResponse(`Error uploading file: ${t.t0.message}`, !0), t.abrupt('return'); case 24: socket.emit('message', o), e.innerHTML = '', cancelReply(), removeFile(), recordingVoice && stopVoiceRecording(); case 29: case 'end': return t.stop();
          }
        }
      }), t, null, [[8, 20]]);
    })))).apply(this, arguments);
  }document.addEventListener('DOMContentLoaded', o(r().mark((function t() { let e; return r().wrap(((t) => { for (;;) switch (t.prev = t.next) { case 0: return t.next = 2, a(); case 2: document.querySelector('.contact-name').textContent = 'Bestie 💕', document.querySelector('.contact-status').textContent = 'online', (e = document.querySelector('.file-input')) && e.addEventListener('change', (function () { const t = o(r().mark((function t(e) { let n; let o; let a; let i; return r().wrap(((t) => { for (;;) switch (t.prev = t.next) { case 0: if (n = e.target.files[0]) { t.next = 3; break; } return t.abrupt('return'); case 3: return (o = new FormData()).append('file', n), t.prev = 5, t.next = 8, fetch('/api/upload', { method: 'POST', headers: { 'x-auth-token': localStorage.getItem('token') }, body: o }); case 8: if ((a = t.sent).ok) { t.next = 11; break; } throw new Error('Upload failed'); case 11: return t.next = 13, a.json(); case 13: i = t.sent, console.log('File uploaded:', i), t.next = 20; break; case 17: t.prev = 17, t.t0 = t.catch(5), console.error('Error uploading file:', t.t0); case 20: case 'end': return t.stop(); } }), t, null, [[5, 17]]); }))); return function (e) { return t.apply(this, arguments); }; }())); case 6: case 'end': return t.stop(); } }), t); })))), document.querySelector('.chat-input').addEventListener('keydown', ((t) => { if (t.key === 'Enter' && !t.shiftKey) { t.preventDefault(); const e = t.target; const r = e.textContent.trim(); if (r) { const n = { text: r, timestamp: Date.now(), status: 'sent' }; const o = document.querySelector('.message-list'); o.appendChild(i(n, !0)), o.scrollTop = o.scrollHeight, e.textContent = '', setTimeout((() => { const t = ['iyaaa sayanggg', 'hmmmm', 'wkwkwk bisa aja', 'iya iya betul', 'lanjut cerita dong', '😂😂😂']; const e = { text: t[Math.floor(Math.random() * t.length)], timestamp: Date.now(), status: 'read' }; o.appendChild(i(e, !1)), o.scrollTop = o.scrollHeight; }), 1e3); } } })), document.querySelector('.voice-button').addEventListener('click', (() => { const t = document.querySelector('.chat-input'); const e = t.textContent.trim(); if (e) { const r = { text: e, timestamp: Date.now(), status: 'sent' }; const n = document.querySelector('.message-list'); n.appendChild(i(r, !0)), n.scrollTop = n.scrollHeight, t.textContent = ''; } })), document.querySelector('.chat-input').addEventListener('keydown', ((t) => { t.key !== 'Enter' || t.shiftKey || (t.preventDefault(), c()); })), document.querySelector('.voice-button').addEventListener('click', c), socket.on('message', (function () { const t = o(r().mark((function t(n) { let o; let a; let c; let u; let s; let l; let f; let d; let h; let p; let m; let y; let v; return r().wrap(((t) => { for (;;) switch (t.prev = t.next) { case 0: if (a = document.querySelector('.message-list'), c = n.sender._id === currentUser._id, u = i(n, c), a.appendChild(u), a.scrollTop = a.scrollHeight, s = [], n.formatting && (n.formatting.bold && s.push('bold'), n.formatting.italic && s.push('italic'), n.formatting.strikethrough && s.push('strikethrough'), n.formatting.monospace && s.push('monospace')), (o = u.querySelector('.message-content').classList).add.apply(o, s), !n.media) { t.next = 35; break; }l = u.querySelector('.message-content'), (f = document.createElement('div')).classList.add('media-container'), l.appendChild(f), t.t0 = n.media.type.split('/')[0], t.next = t.t0 === 'image' ? 16 : t.t0 === 'video' ? 21 : t.t0 === 'audio' ? 26 : 31; break; case 16: return (d = document.createElement('img')).src = n.media.url, d.alt = 'Image', f.appendChild(d), t.abrupt('break', 35); case 21: return (h = document.createElement('video')).src = n.media.url, h.controls = !0, f.appendChild(h), t.abrupt('break', 35); case 26: return (p = document.createElement('audio')).src = n.media.url, p.controls = !0, f.appendChild(p), t.abrupt('break', 35); case 31: (m = document.createElement('div')).classList.add('file-message'), m.innerHTML = '\n                    <i class="fas fa-file"></i>\n                    <div class="file-info">\n                        <div class="file-name">'.concat(n.media.name, '</div>\n                        <div class="file-size">').concat(formatFileSize(n.media.size), "</div>\n                    </div>\n                    <button onclick=\"downloadMedia('").concat(n.media.url, "', '").concat(n.media.name, '\')">\n                        <i class="fas fa-download"></i>\n                    </button>\n                '), f.appendChild(m); case 35: n.reactions && n.reactions.length > 0 && (y = n.reactions.reduce(((t, e) => (t[e.emoji] = (t[e.emoji] || 0) + 1, t)), {}), (v = document.createElement('div')).classList.add('message-reactions'), u.appendChild(v), Object.entries(y).forEach(((t) => { let r; let n; const o = (n = 2, (function (t) { if (Array.isArray(t)) return t; }(r = t)) || (function (t, e) { let r = t == null ? null : typeof Symbol !== 'undefined' && t[Symbol.iterator] || t['@@iterator']; if (r != null) { let n; let o; let a; let i; const c = []; let u = !0; let s = !1; try { if (a = (r = r.call(t)).next, e === 0) { if (Object(r) !== r) return; u = !1; } else for (;!(u = (n = a.call(r)).done) && (c.push(n.value), c.length !== e); u = !0); } catch (t) { s = !0, o = t; } finally { try { if (!u && r.return != null && (i = r.return(), Object(i) !== i)) return; } finally { if (s) throw o; } } return c; } }(r, n)) || (function (t, r) { if (t) { if (typeof t === 'string') return e(t, r); let n = {}.toString.call(t).slice(8, -1); return n === 'Object' && t.constructor && (n = t.constructor.name), n === 'Map' || n === 'Set' ? Array.from(t) : n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? e(t, r) : void 0; } }(r, n)) || (function () { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'); }())); const a = o[0]; const i = o[1]; const c = document.createElement('div'); c.classList.add('reaction'), c.innerHTML = ''.concat(a, ' ').concat(i), v.appendChild(c); }))); case 36: case 'end': return t.stop(); } }), t); }))); return function (e) { return t.apply(this, arguments); }; }()));
})();
