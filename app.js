/* APP – Navigation, Puzzle, Simulator, Mission, Schule, Freundschaft
   Inhalte stehen in content.js. Jede Station wird beim ersten Besuch EINMAL aufgebaut,
   danach bleibt der Zustand (gelöstes Puzzle, Quiz, Häkchen) beim Zurückblättern erhalten. */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};
const h = (html) => {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
};

const app = {
    steps: STEPS,
    current: null,
    visited: new Set(),
    VISITED_KEY: 'ki6-visited',

    /* ───────── START & NAVIGATION ───────── */
    init() {
        try { (JSON.parse(localStorage.getItem(this.VISITED_KEY)) || []).forEach((id) => this.visited.add(id)); } catch (e) { /* ohne Speicher weiter */ }

        this.stage = document.getElementById('stage');
        this.buildStepper();

        document.getElementById('next-btn').addEventListener('click', () => this.go('next'));
        document.getElementById('prev-btn').addEventListener('click', () => this.go('prev'));
        window.addEventListener('hashchange', () => this.show(this.fromHash(), true));

        // Delegierte Klicks: Navigationslinks im Inhalt und Fachbegriffe
        document.addEventListener('click', (e) => {
            const go = e.target.closest('[data-go]');
            if (go) { this.go(go.dataset.go); return; }
            const sc = e.target.closest('[data-scroll]');
            if (sc) {
                const area = this.stage.querySelector('.view.active .interactive-area');
                if (area) area.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
            const term = e.target.closest('.term');
            if (term) { this.toggleTerm(term); return; }
            this.hideTerm();
        });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.hideTerm(); });
        // Beim Scrollen schließen – aber nicht durch das Scrollen, das das Antippen selbst auslöst
        this.stage.addEventListener('scroll', () => { if (Date.now() - (this.termShownAt || 0) > 400) this.hideTerm(); }, true);

        this.show(this.fromHash(), false);
    },

    buildStepper() {
        const nav = document.getElementById('stepper-nav');
        this.steps.forEach((s, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'step-btn';
            b.dataset.target = s.id;
            b.title = s.label;
            b.setAttribute('aria-label', i === 0 ? s.label : `Station ${i}: ${s.label}`);
            b.style.setProperty('--c', s.color);
            b.style.setProperty('--on-c', s.on);
            b.innerHTML = `<span class="step-num">${i === 0 ? '★' : i}</span><span class="lbl">${esc(s.label)}</span>`;
            b.addEventListener('click', () => this.go(s.id));
            nav.appendChild(b);
        });
    },

    fromHash() {
        let id = decodeURIComponent(location.hash.replace('#', ''));
        if (id === 'lab2') id = 'lab'; // alte Station ist jetzt Zusatz-Labor in „KI trainieren“
        return this.steps.some((s) => s.id === id) ? id : 'start';
    },

    go(target) {
        const idx = this.steps.findIndex((s) => s.id === this.current);
        let id = target;
        if (target === 'next') id = (this.steps[idx + 1] || this.steps[idx]).id;
        if (target === 'prev') id = (this.steps[idx - 1] || this.steps[idx]).id;
        if (id === this.current) return;
        if (location.hash === '#' + id) { this.show(id, true); return; }
        location.hash = id; // löst hashchange aus → show()
    },

    show(id, userAction) {
        const step = this.steps.find((s) => s.id === id) || this.steps[0];
        const idx = this.steps.indexOf(step);
        this.current = step.id;
        this.hideTerm();

        this.visited.add(step.id);
        try { localStorage.setItem(this.VISITED_KEY, JSON.stringify([...this.visited])); } catch (e) { /* egal */ }

        let view = document.getElementById('view-' + step.id);
        if (!view) view = this.buildView(step);

        this.stage.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v === view));

        document.querySelectorAll('.step-btn').forEach((b) => {
            const on = b.dataset.target === step.id;
            b.classList.toggle('active', on);
            b.classList.toggle('visited', this.visited.has(b.dataset.target));
            if (on) {
                b.setAttribute('aria-current', 'step');
                b.scrollIntoView({ inline: 'center', block: 'nearest' });
            } else b.removeAttribute('aria-current');
        });

        // Farben der aktuellen Station auch für Fortschrittsbalken
        document.documentElement.style.setProperty('--accent', step.color === '#fbbc04' ? '#e0a100' : step.color);
        document.getElementById('progress-bar').style.width = (idx / (this.steps.length - 1)) * 100 + '%';

        document.getElementById('footer-hint').innerHTML = (modules[step.id] && modules[step.id].hint) || '';
        document.getElementById('prev-btn').hidden = idx === 0;
        document.getElementById('next-btn').hidden = idx === this.steps.length - 1;
        document.title = `KI – ${step.label}`;
        if (step.id === 'mission') this.refreshTipp(view);
        if (userAction) this.stage.focus({ preventScroll: true });
    },

    // Zeigt in der Mission, was die Schüler:in am Anfang getippt hat (bei jedem Besuch aktuell)
    refreshTipp(view) {
        const ref = view.querySelector('[data-tipp-ref]');
        let tipp = this.tipp;
        try { tipp = tipp || localStorage.getItem('ki6-tipp'); } catch (e) { /* egal */ }
        if (!ref || !tipp) return;
        ref.hidden = false;
        ref.innerHTML = `<strong>Am Anfang hast du getippt:</strong> ${esc(tipp)} – Hat sich das geändert? Schreib es dazu!`;
    },

    buildView(step) {
        const m = modules[step.id];
        const v = document.createElement('section');
        v.id = 'view-' + step.id;
        v.className = 'view' + (step.layout === 'split' ? ' split' : '');
        v.style.setProperty('--accent', step.color);
        v.style.setProperty('--soft', step.soft);
        v.style.setProperty('--ink-accent', step.ink);
        v.style.setProperty('--on', step.on);
        this.stage.appendChild(v);

        if (step.layout === 'split') {
            v.innerHTML = `<div class="col-text">${m.text}</div><div class="interactive-area"><div id="puzzle-${step.id}"></div></div>`;
            this.buildPuzzle(v.querySelector('#puzzle-' + step.id), m.puzzle);
        } else if (step.id === 'mission') this.buildMission(v, m);
        else if (step.id === 'school') this.buildSchool(v, m);
        else if (step.id === 'freunde') this.buildFreunde(v, m);
        else {
            v.innerHTML = m.html;
            if (step.id === 'hook') this.buildHook(v.querySelector('[data-slot="hook"]'), m);
            if (step.id === 'ai') this.buildRounds(v.querySelector('[data-slot="rounds"]'), m.rounds);
            if (step.id === 'lab') this.buildSim(v.querySelector('[data-slot="sim"]'));
            if (step.id === 'hybrid') this.buildFinder(v.querySelector('[data-slot="finder"]'), m.finder);
        }
        return v;
    },

    /* ───────── FACHBEGRIFFE (Tippen, Hover, Tastatur) ───────── */
    showTerm(t) {
        const p = document.getElementById('term-popup');
        p.textContent = t.dataset.def;
        p.style.display = 'block';
        const r = t.getBoundingClientRect();
        const w = p.offsetWidth, hgt = p.offsetHeight;
        const left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
        const top = r.bottom + 8 + hgt > window.innerHeight ? Math.max(8, r.top - hgt - 8) : r.bottom + 8;
        p.style.left = left + 'px';
        p.style.top = top + 'px';
        this.openTerm = t;
        this.termShownAt = Date.now();
    },
    hideTerm() {
        document.getElementById('term-popup').style.display = 'none';
        this.openTerm = null;
    },
    toggleTerm(t) { this.openTerm === t ? this.hideTerm() : this.showTerm(t); },

    /* ───────── PUZZLE (Antippen UND Ziehen) ───────── */
    buildPuzzle(host, cfg) {
        host.innerHTML = `
            <p class="puzzle-head">Bausteine</p>
            <div class="tray" role="group" aria-label="Bausteine"></div>
            <p class="puzzle-head" style="margin-top:18px">Ablauf</p>
            <ol class="slots"></ol>
            <p class="puzzle-msg" role="status" aria-live="polite"></p>
            <p class="puzzle-how">${cfg.how}</p>`;
        const tray = host.querySelector('.tray');
        const list = host.querySelector('.slots');
        const msg = host.querySelector('.puzzle-msg');
        let selected = null, dragged = null;

        const say = (text, cls) => { msg.textContent = text; msg.className = 'puzzle-msg ' + (cls || ''); };
        const armSlots = (on) => list.querySelectorAll('.slot:not(.correct)').forEach((s) => s.classList.toggle('armed', on));
        const select = (chip) => {
            if (selected) selected.setAttribute('aria-pressed', 'false');
            selected = selected === chip ? null : chip;
            if (selected) selected.setAttribute('aria-pressed', 'true');
            armSlots(!!selected);
        };

        const place = (slot, chip, step) => {
            if (!chip || slot.classList.contains('correct')) return;
            if (chip.dataset.type === slot.dataset.target) {
                slot.classList.remove('armed');
                slot.classList.add('correct');
                slot.querySelector('.slot-fill').textContent = '✔ ' + chip.textContent;
                slot.setAttribute('aria-label', `${step.label}: ${chip.textContent} (richtig)`);
                chip.remove();
                selected = null; dragged = null;
                armSlots(false);
                if (!list.querySelector('.slot:not(.correct)')) say(cfg.done, 'done');
                else say('✅ Richtig!', '');
            } else {
                slot.classList.remove('wrong'); void slot.offsetWidth; slot.classList.add('wrong');
                setTimeout(() => slot.classList.remove('wrong'), 450);
                say('Das passt hier noch nicht. Tipp: ' + step.hint, 'err');
            }
        };

        cfg.steps.forEach((step) => {
            const li = document.createElement('li');
            const slot = document.createElement('button');
            slot.type = 'button';
            slot.className = 'slot';
            slot.dataset.target = step.correct;
            slot.innerHTML = `<span class="slot-label">${esc(step.label)}</span><span class="slot-fill"></span>`;
            slot.addEventListener('click', () => {
                if (slot.classList.contains('correct')) return;
                if (!selected) { say('Tippe zuerst einen Baustein an – dann dieses Feld.', ''); return; }
                place(slot, selected, step);
            });
            slot.addEventListener('dragover', (e) => { e.preventDefault(); slot.classList.add('hovered'); });
            slot.addEventListener('dragleave', () => slot.classList.remove('hovered'));
            slot.addEventListener('drop', (e) => { e.preventDefault(); slot.classList.remove('hovered'); place(slot, dragged, step); });
            li.appendChild(slot);
            list.appendChild(li);
        });

        shuffle(cfg.items).forEach((item) => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'chip';
            chip.draggable = true;
            chip.textContent = item.text;
            chip.dataset.type = item.type;
            chip.setAttribute('aria-pressed', 'false');
            chip.addEventListener('click', () => select(chip));
            chip.addEventListener('dragstart', (e) => { dragged = chip; e.dataTransfer.setData('text/plain', item.type); chip.classList.add('dragging'); });
            chip.addEventListener('dragend', () => chip.classList.remove('dragging'));
            tray.appendChild(chip);
        });
    },

    /* ───────── HOOK: ECHT ODER ERFUNDEN? ───────── */
    buildHook(host, m) {
        host.innerHTML = `<div class="stmts"></div><div class="hook-after" role="status" aria-live="polite"></div>`;
        const list = host.querySelector('.stmts');
        const after = host.querySelector('.hook-after');
        let rest = m.statements.length, right = 0;
        m.statements.forEach((st) => {
            const card = h(`<div class="stmt"><p class="stmt-text">${st.text}</p>
                <div class="stmt-btns"><button type="button" class="btn small ghost" data-a="real">✅ Echt</button>
                <button type="button" class="btn small ghost" data-a="fake">🎭 Erfunden</button></div>
                <p class="stmt-fb" role="status"></p></div>`);
            card.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
                const ok = (b.dataset.a === 'real') === st.real;
                card.querySelectorAll('button').forEach((x) => { x.disabled = true; });
                card.classList.add(ok ? 'richtig' : 'falsch');
                card.querySelector('.stmt-fb').innerHTML = (ok ? '✅ Richtig getippt! ' : '❌ Reingefallen! ') + st.reveal;
                if (ok) right++;
                if (--rest === 0) {
                    after.innerHTML = `<div class="callout merke"><span class="callout-title">Du hast ${right} von ${m.statements.length} erkannt.</span>${m.after}</div>
                        <div class="poll"><h3>${m.poll.q}</h3><div class="poll-opts"></div><p class="poll-done"></p></div>`;
                    const opts = after.querySelector('.poll-opts');
                    m.poll.options.forEach((o) => {
                        const pb = h(`<button type="button" class="btn ghost">${o.label}</button>`);
                        pb.addEventListener('click', () => {
                            this.tipp = o.label;
                            try { localStorage.setItem('ki6-tipp', o.label); } catch (e) { /* egal */ }
                            opts.querySelectorAll('button').forEach((x) => { x.classList.add('ghost'); x.disabled = true; });
                            pb.classList.remove('ghost');
                            after.querySelector('.poll-done').textContent = m.poll.done;
                        });
                        opts.appendChild(pb);
                    });
                    after.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }));
            list.appendChild(card);
        });
    },

    /* ───────── "SEI DIE KI": Runden mit Vorhersage ───────── */
    buildRounds(host, cfg) {
        if (!host) return;
        const box = h(`<div class="predict"><h4></h4><div class="sentence"></div><div class="q"></div>
            <div class="predict-opts" style="margin-top:10px"></div>
            <div class="predict-result" role="status" aria-live="polite"></div>
            <p class="foot" style="font-size:.85rem;color:var(--muted);margin:10px 0 0">${cfg.footnote}</p></div>`);
        host.appendChild(box);
        const total = cfg.list.length;
        const render = (i) => {
            const r = cfg.list[i];
            box.classList.remove('revealed');
            box.querySelector('h4').textContent = `${cfg.title} ${i + 1} von ${total}`;
            box.querySelector('.sentence').textContent = r.sentence;
            box.querySelector('.q').textContent = r.question || 'Welches Wort kommt wohl als Nächstes? Tippe auf deinen Tipp.';
            box.querySelector('.predict-result').innerHTML = '';
            const opts = box.querySelector('.predict-opts');
            opts.innerHTML = '';
            shuffle(r.options).forEach((o) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'predict-opt';
                b.innerHTML = `<i class="bar"></i><span><b>${o.label}</b><b class="pct" style="visibility:hidden">${o.pct}</b><span class="note">${o.note}</span></span>`;
                b.dataset.width = o.width;
                b.addEventListener('click', () => {
                    if (box.classList.contains('revealed')) return;
                    box.classList.add('revealed');
                    b.classList.add('mine');
                    opts.querySelectorAll('.predict-opt').forEach((x) => {
                        x.querySelector('.pct').style.visibility = 'visible';
                        x.querySelector('.bar').style.width = x.dataset.width + '%';
                    });
                    const res = box.querySelector('.predict-result');
                    res.innerHTML = `<div class="callout merke" style="margin-bottom:10px">${r.insight}</div>`;
                    if (i < total - 1) {
                        const nb = h(`<button type="button" class="btn small">Nächste Runde ➡️</button>`);
                        nb.addEventListener('click', () => render(i + 1));
                        res.appendChild(nb);
                    }
                });
                opts.appendChild(b);
            });
        };
        render(0);
    },

    /* ───────── FEHLER-FINDER (Quellen prüfen) ───────── */
    buildFinder(host, cfg) {
        if (!host) return;
        host.innerHTML = `
            <div class="finder">
                <div class="mock-label">So ähnlich sieht das aus (nachgebautes Beispiel)</div>
                <div class="mock-bar">🔎 ${cfg.query}</div>
                <div class="mock-ai"><span class="mock-badge">✨ KI-Zusammenfassung – tippe auf die Sätze</span><div class="sents"></div></div>
                <div class="srcs">${cfg.sources.map((s) => `<div class="src"><b>${s.name}</b>${s.text}</div>`).join('')}</div>
            </div>
            <div class="finder-result" role="status" aria-live="polite"></div>`;
        const sents = host.querySelector('.sents');
        const result = host.querySelector('.finder-result');
        cfg.sentences.forEach((s) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'sent';
            b.textContent = s.t;
            b.addEventListener('click', () => {
                if (b.dataset.done) return;
                b.dataset.done = '1';
                if (s.src) {
                    b.classList.add('ok');
                    b.insertAdjacentHTML('beforeend', `<small>✔ steht in ${s.src}</small>`);
                } else {
                    b.classList.add('bad');
                    b.insertAdjacentHTML('beforeend', `<small>⚠️ ${s.why}</small>`);
                    result.innerHTML = `<div class="callout merke">${cfg.insight}</div>`;
                }
            });
            sents.appendChild(b);
        });
    },

    /* ───────── SIMULATOR ───────── */
    buildSim(host) {
        host.innerHTML = `
        <div class="sim">
            <div>
                <label for="sim-params">🧠 Größe des Speichers (Parameter) <output id="o-p">20</output></label>
                <input type="range" id="sim-params" min="1" max="100" value="20">
                <label for="sim-data">📚 Menge der Bücher (Daten) <output id="o-d">20</output></label>
                <input type="range" id="sim-data" min="1" max="100" value="20">
                <label for="sim-compute">⚡ Strom für die Rechner <output id="o-c">20</output></label>
                <input type="range" id="sim-compute" min="1" max="100" value="20">
            </div>
            <div class="sim-out" aria-live="polite">
                <h3>KI-STATUS</h3>
                <div class="meter"><div class="meter-label"><span>Können</span><b id="skill-val">20 %</b></div>
                    <div class="bar-container"><div id="bar-skill" class="bar-fill bar-skill"></div></div></div>
                <div class="meter"><div class="meter-label"><span>Stromverbrauch</span><b id="nrg-val">20 %</b></div>
                    <div class="bar-container"><div id="bar-nrg" class="bar-fill bar-nrg"></div></div></div>
                <div style="font-weight:700;margin:12px 0 6px;color:#5eead4">Die KI kann jetzt:</div>
                <div class="badges">
                    <span class="badge" data-at="10">💬 Texte schreiben</span>
                    <span class="badge" data-at="40">➗ Rechnen</span>
                    <span class="badge" data-at="70">💻 Programmieren</span>
                    <span class="badge" data-at="90">🧩 Knifflige Aufgaben lösen</span>
                </div>
                <div class="sim-msg" id="sim-msg"></div>
            </div>
        </div>`;
        const ids = ['sim-params', 'sim-data', 'sim-compute'];
        const update = () => {
            const [p, d, c] = ids.map((id) => parseInt(host.querySelector('#' + id).value, 10));
            host.querySelector('#o-p').textContent = p;
            host.querySelector('#o-d').textContent = d;
            host.querySelector('#o-c').textContent = c;

            // Die schwächste Zutat bestimmt, wie gut die KI werden kann (Engpass).
            const potential = Math.min(p, d);
            const skill = c >= potential ? potential : c + (potential - c) * 0.1;
            host.querySelector('#skill-val').textContent = Math.round(skill) + ' %';
            host.querySelector('#bar-skill').style.width = skill + '%';
            host.querySelector('#nrg-val').textContent = c + ' %';
            host.querySelector('#bar-nrg').style.width = c + '%';
            host.querySelectorAll('.badge').forEach((b) => { b.hidden = !(skill > +b.dataset.at); });

            const msg = host.querySelector('#sim-msg');
            let text, cls = '';
            if (c < potential - 5) {
                text = '⚠️ Zu wenig Strom! Speicher und Bücher würden mehr hergeben – aber die Rechner schaffen es nicht.'; cls = 'bottleneck';
            } else if (Math.abs(p - d) >= 20) {
                text = p < d
                    ? '⚠️ Engpass: Der Speicher ist zu klein! Die vielen Bücher passen gar nicht hinein.'
                    : '⚠️ Engpass: Zu wenig Bücher! Der große Speicher bleibt größtenteils leer.';
                cls = 'bottleneck';
            } else if (skill >= 90) {
                text = '🏆 Perfekt abgestimmt – alle drei Zutaten sind groß. Schau dir an, wie viel Strom dafür nötig ist!'; cls = 'good';
            } else {
                text = 'Alle drei Zutaten passen zusammen. Schiebe sie gemeinsam nach oben und beobachte „Können“ und Strom.';
            }
            msg.textContent = text;
            msg.className = 'sim-msg ' + cls;
        };
        ids.forEach((id) => host.querySelector('#' + id).addEventListener('input', update));
        update();
    },

    /* ───────── KOPIEREN ───────── */
    copyBox(text) {
        const box = h(`<div class="copy-box"><div class="txt"></div><button type="button" class="btn small">📋 Kopieren</button></div>`);
        box.querySelector('.txt').innerHTML = esc(text).replace(/\[[^\]]+\]/g, (m) => `<span class="ph">${m}</span>`);
        const btn = box.querySelector('button');
        btn.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(text); }
            catch (e) {
                const ta = document.createElement('textarea');
                ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
                document.body.appendChild(ta); ta.select();
                try { document.execCommand('copy'); } catch (err) { /* nichts */ }
                ta.remove();
            }
            btn.textContent = '✓ Kopiert';
            setTimeout(() => { btn.textContent = '📋 Kopieren'; }, 1800);
        });
        return box;
    },

    /* ───────── MISSION ───────── */
    buildMission(v, m) {
        const [colA, colB] = m.compare;
        v.innerHTML = `
        <div class="page wide">
            <div class="hero">${m.intro}</div>

            <h3>Deine Werkzeuge</h3>
            <div class="tool-grid">${m.tools.map((t) => `
                <a class="tool-card ${t.main ? 'main' : ''}" href="${t.url}" target="_blank" rel="noopener">
                    <span class="ic">${t.icon}</span><h4>${t.name}</h4><small>${t.sub}</small>
                </a>`).join('')}
            </div>

            <div class="card" id="safety">
                <h2 style="margin-top:0">🛡️ Sicherheits-Check</h2>
                <p>${m.safety.intro}</p>
                <ul class="check-list"></ul>
                <div id="safety-done" role="status" aria-live="polite"></div>
            </div>

            <p id="lock-note" style="text-align:center;font-weight:700;margin:22px 0 10px">🔒 Löse zuerst den Sicherheits-Check, dann geht es los.</p>
            <div id="mission-tests" class="locked" inert>
                <div class="progress-pill" id="mission-progress">0 / ${m.tasks.filter((t) => !t.extra).length} Tests erledigt</div>

                <div class="callout task">
                    <span class="callout-title">📝 Schritt 1: Dein Test-Protokoll</span>
                    ${m.protokoll}
                    <div class="table-scroll"><table class="proto">
                        <tr><th>Test</th><th>${colA}</th><th>${colB}</th><th>Wer war besser – und warum?</th></tr>
                        ${m.tasks.map((t, i) => `<tr><td>${i + 1}. ${t.title}${t.extra ? ' (Zusatz)' : ''}</td><td class="blank"></td><td class="blank"></td><td class="blank"></td></tr>`).join('')}
                    </table></div>
                </div>

                <div id="mission-cards"></div>

                <div class="callout task"><span class="callout-title">📝 Schritt 2: Das Urteil</span>${m.urteil}</div>
            </div>
        </div>`;

        /* Sicherheits-Check */
        const list = v.querySelector('.check-list');
        let remaining = m.safety.items.length;
        shuffle(m.safety.items).forEach((it) => {
            const li = h(`<li class="check-item">
                <span class="what">${it.text}</span>
                <span class="btns">
                    <button type="button" class="btn small" data-v="1">✅ Darf rein</button>
                    <button type="button" class="btn small ghost" data-v="0">🚫 Bleibt privat</button>
                </span>
                <span class="fb" role="status"></span></li>`);
            li.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
                if (li.classList.contains('done')) return;
                const said = b.dataset.v === '1';
                const fb = li.querySelector('.fb');
                if (said === it.ok) {
                    li.classList.add('done');
                    li.querySelectorAll('button').forEach((x) => { x.disabled = true; });
                    fb.textContent = '✔ Richtig! ' + it.why;
                    if (--remaining === 0) {
                        v.querySelector('#safety-done').innerHTML = `<div class="callout ok" style="margin-bottom:0"><span class="callout-title">✅ Schutz aktiv!</span>Du kannst jetzt starten.</div>`;
                        const tests = v.querySelector('#mission-tests');
                        tests.classList.remove('locked'); tests.inert = false;
                        v.querySelector('#lock-note').remove();
                    }
                } else {
                    li.classList.remove('wrong'); void li.offsetWidth; li.classList.add('wrong');
                    fb.textContent = '✖ Überlege nochmal. ' + (it.ok ? 'Sachfragen ohne private Infos sind in Ordnung.' : 'Das ist privat.');
                }
            }));
            list.appendChild(li);
        });

        /* Test-Karten */
        const cards = v.querySelector('#mission-cards');
        const progress = v.querySelector('#mission-progress');
        m.tasks.forEach((t, i) => {
            const card = h(`<div class="test-card">
                <span class="test-no">Test ${i + 1}${t.extra ? ' · Zusatz' : ''}</span>
                <h3>${t.title}</h3>
                <p>${t.desc}</p>
                <div class="try-label">1 · Frag die KI (telli)</div>
                <div class="slot-ai"></div>
                <div class="try-label">2 · Suche mit Stichwörtern</div>
                <div class="slot-search"></div>
                <div class="look"><strong>🔍 Achte darauf:</strong> ${t.look}</div>
                <label class="done-check"><input type="checkbox"> Erledigt und in meine Tabelle eingetragen</label>
            </div>`);
            card.querySelector('.slot-ai').appendChild(this.copyBox(t.prompt));
            card.querySelector('.slot-search').appendChild(this.copyBox(t.search));
            card.querySelector('input').addEventListener('change', () => {
                card.classList.toggle('done', card.querySelector('input').checked);
                const need = m.tasks.filter((x) => !x.extra).length;
                const n = [...cards.querySelectorAll('.test-card')].filter((c, k) => !m.tasks[k].extra && c.querySelector('input').checked).length;
                progress.textContent = `${n} / ${need} Tests erledigt` + (n === need ? ' 🎉' : '');
            });
            cards.appendChild(card);
        });
    },

    /* ───────── SCHULE ───────── */
    buildSchool(v, m) {
        const p = m.profi;
        v.innerHTML = `
        <div class="page wide">
            <div class="hero">${m.intro}</div>
            <div class="callout task"><span class="callout-title">📝 Dein Auftrag</span>${m.auftrag}</div>

            <p style="text-align:center"><a class="btn" href="${TELLI_URL}" target="_blank" rel="noopener">🤖 telli öffnen</a><br>
            <small>Du brauchst den Zugangscode von deinem Lehrer.</small></p>

            <h2>So prüfst du KI-Antworten</h2>
            <div class="check3">${m.check3.map((c) => `<div><b>${c.t}</b>${c.d}</div>`).join('')}</div>

            <details class="profi">
                <summary>${p.title} <small style="font-weight:400">(freiwillig)</small></summary>
                <p>Eine gute Antwort beginnt mit einem guten <strong>Prompt</strong> – so heißt der Auftrag, den du der KI schreibst. Denk an vier Dinge:</p>
                <div class="formula">${p.formula.map((f) => `<div><b>${f.t}</b>${f.d}</div>`).join('')}</div>
                <div class="bad-good">
                    <p class="b"><strong>😕 Schlecht:</strong> „${p.bad}“</p>
                    <p class="g"><strong>😀 Besser:</strong> „${p.good}“</p>
                </div>
                <ul>${p.tips.map((t) => `<li>${t}</li>`).join('')}</ul>
                <div class="callout stop">${p.rule}</div>
            </details>

            <h2>Deine Lern-Prompts</h2>
            <p>Kopiere einen Prompt und ersetze die <span class="ph">gelb markierten</span> Stellen durch deine eigene Aufgabe.</p>
            <div class="school-grid" id="school-prompts-grid"></div>
        </div>`;
        const grid = v.querySelector('#school-prompts-grid');
        m.prompts.forEach((pr) => {
            const card = h(`<div class="prompt-card">
                <h3><span>${pr.icon}</span> ${pr.subject}</h3>
                <h4 style="margin:0">${pr.title}</h4>
                <p class="how">${pr.desc}</p>
                <p class="rule">${pr.rule}</p>
            </div>`);
            card.appendChild(this.copyBox(pr.prompt));
            grid.appendChild(card);
        });
    },

    /* ───────── FREUNDSCHAFT ───────── */
    buildFreunde(v, m) {
        const page = h(`<div class="page wide"></div>`);
        v.appendChild(page);
        const section = (html) => { const s = h(`<div class="f-section">${html}</div>`); page.appendChild(s); return s; };

        section(m.intro);

        /* Karten-Spiel */
        let richtig = 0;
        const total = m.cards.length;
        const s2 = section(`<h2>🃏 Spiel: KI-Freund oder echter Freund?</h2><p>${m.cardsIntro}</p>
            <div class="karten-score" role="status" aria-live="polite">0 / ${total} richtig ✅</div><div class="karten-grid"></div>`);
        const score = s2.querySelector('.karten-score');
        m.cards.forEach((k) => {
            const card = h(`<div class="karte-item"><div class="karte-text">${k.text}</div>
                <div class="karte-buttons">
                    <button type="button" class="karte-btn ki">🤖 KI-Freund</button>
                    <button type="button" class="karte-btn freund">👫 Echter Freund</button>
                </div><div class="karte-feedback" role="status"></div></div>`);
            [['ki', '.ki'], ['freund', '.freund']].forEach(([side, sel]) => {
                card.querySelector(sel).addEventListener('click', () => {
                    const ok = side === k.correctSide;
                    card.classList.add(ok ? 'richtig' : 'falsch');
                    card.querySelectorAll('button').forEach((b) => { b.disabled = true; });
                    const fb = card.querySelector('.karte-feedback');
                    fb.style.display = 'block';
                    fb.innerHTML = (ok ? '✅ Richtig! ' : '❌ Nicht ganz. ') + k.feedback[side];
                    if (ok) richtig++;
                    score.textContent = `${richtig} / ${total} richtig ✅`;
                });
            });
            s2.querySelector('.karten-grid').appendChild(card);
        });

        /* Dialog-Simulation */
        const s3 = section(`<h2>${m.dialogTitle}</h2><p>${m.dialogIntro}</p>
            <div class="dialog-grid">
                <div class="dialog-panel ki"><h3>🤖 Du schreibst der KI …</h3></div>
                <div class="dialog-panel freund"><h3>💕 Du schreibst deiner Freundin / deinem Freund …</h3></div>
            </div>`);
        [['ki', '.ki'], ['freund', '.freund']].forEach(([side, sel]) => {
            const panel = s3.querySelector(sel);
            m.dialog[side].forEach((o) => {
                const btn = h(`<button type="button" class="dialog-option" aria-expanded="false">${o.text}</button>`);
                const exp = h(`<div class="dialog-explanation">${o.explanation}</div>`);
                btn.addEventListener('click', () => {
                    const open = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', String(!open));
                    exp.style.display = open ? 'none' : 'block';
                });
                panel.append(btn, exp);
            });
        });

        /* Quiz */
        let punkte = 0, beantwortet = 0;
        const s4 = section(`<h2>🎯 Quiz: Weißt du's?</h2><p>${m.quizIntro}</p>
            <div class="quiz-score" role="status"><span class="zahl"></span><p class="text"></p></div>`);
        const scoreBox = s4.querySelector('.quiz-score');
        m.quiz.forEach((fr, fi) => {
            const block = h(`<div class="quiz-frage"><p>${fi + 1}. ${fr.question}</p></div>`);
            const buttons = [];
            shuffle(fr.options).forEach((o) => {
                const b = h(`<button type="button" class="quiz-opt">${o.text}</button>`);
                buttons.push([b, o]);
                b.addEventListener('click', () => {
                    buttons.forEach(([x, xo]) => {
                        x.disabled = true;
                        if (xo.correct) x.classList.add('richtig');
                    });
                    if (!o.correct) b.classList.add('falsch');
                    b.insertAdjacentHTML('beforeend', `<small>${o.correct ? '✅ ' : '❌ '}${o.feedback}</small>`);
                    if (o.correct) punkte++;
                    if (++beantwortet === m.quiz.length) {
                        scoreBox.querySelector('.zahl').textContent = `${punkte} / ${m.quiz.length}`;
                        const pct = punkte / m.quiz.length;
                        scoreBox.querySelector('.text').textContent =
                            pct === 1 ? '🏆 Perfekt! Du bist ein Experte für echte Freundschaft!'
                                : pct >= 0.7 ? '🎉 Super gemacht! Du verstehst das schon sehr gut!'
                                    : pct >= 0.5 ? '👍 Nicht schlecht – schau dir noch einmal die Rückmeldungen an.'
                                        : '💪 Noch etwas üben – du schaffst das!';
                        scoreBox.style.display = 'block';
                        scoreBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                });
                block.appendChild(b);
            });
            s4.insertBefore(block, scoreBox);
        });

        /* Reflexion */
        const s5 = section(`<h2>💭 Dein Gedanke</h2><h3 style="margin-top:0">${m.reflection.question}</h3>
            <div class="callout task"><span class="callout-title">📝 Dein Auftrag für Pages / GoodNotes</span>Schreib deine Antwort in eigenen Worten in dein Dokument. Mindestens 2–3 Sätze!</div>
            <button type="button" class="btn">💡 Tipps für echte Freundschaft anzeigen</button>
            <div class="tipp-box">${m.reflection.tip}</div>`);
        const tipp = s5.querySelector('.tipp-box');
        s5.querySelector('button').addEventListener('click', () => {
            const open = tipp.style.display === 'block';
            tipp.style.display = open ? 'none' : 'block';
            if (!open) tipp.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

        page.appendChild(h(`<div class="callout warn">${m.help}</div>`));
        section(m.outro);
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
