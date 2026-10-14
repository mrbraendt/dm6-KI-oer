/* APP LOGIC 
   Steuert Navigation, Simulator, Drag & Drop, Mission & Schul-Modul
   Version: 11.0 (Final)
*/

const app = {
    // Die Reihenfolge der Seiten
    sequence: ['start', 'google', 'ai', 'lab', 'lab2', 'hybrid', 'mission', 'school', 'freunde'],
    currentStep: 'start',

    init: function () {
        // Navigation Events (Header Buttons)
        document.querySelectorAll('.step-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.closest('.step-btn').dataset.target;
                this.goToStep(target);
            });
        });

        // "Weiter" Button im Footer
        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextStep();
        });

        // Simulator Events (Slider)
        ['sim-params', 'sim-data', 'sim-compute'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.updateSim());
        });

        // Initial update for simulator
        this.updateSim();

        // Start
        this.goToStep('start');
    },

    goToStep: function (targetId) {
        if (!this.sequence.includes(targetId)) return;
        this.currentStep = targetId;
        this.updateUI();
    },

    nextStep: function () {
        const currentIdx = this.sequence.indexOf(this.currentStep);
        if (currentIdx < this.sequence.length - 1) {
            this.goToStep(this.sequence[currentIdx + 1]);
        }
    },

    updateUI: function () {
        const mode = this.currentStep;
        const data = modules[mode];

        // 1. Navigation aktiv setzen
        document.querySelectorAll('.step-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === mode);
        });

        // 2. Views umschalten
        document.querySelectorAll('main').forEach(m => m.classList.remove('active'));
        const view = document.getElementById(`view-${mode}`);
        if (view) view.classList.add('active');

        // 3. Footer und Inhalte laden
        const hintBox = document.getElementById('footer-hint');
        const nextBtn = document.getElementById('next-btn');

        // Button auf letzter Seite ausblenden
        const isLastStep = this.sequence.indexOf(mode) === this.sequence.length - 1;
        nextBtn.style.display = (mode === 'school' || isLastStep) ? 'none' : 'flex';

        if (data) {
            // Hinweis Text setzen
            hintBox.innerHTML = data.hint || "Lies den Text.";

            // Text einfügen (für Split Layouts)
            if (data.text && document.getElementById(`text-${mode}`)) {
                document.getElementById(`text-${mode}`).innerHTML = data.text;
            }

            // HTML Insert (für Start/Lab)
            if (data.type === 'html-insert' && data.targetId) {
                const target = document.getElementById(data.targetId);
                if (target) target.innerHTML = data.content;
            }

            // Puzzles initialisieren (mit Verzögerung für DOM-Aufbau)
            if (data.puzzle) {
                setTimeout(() => this.initPuzzle(mode, data), 50);
            }

            // Visualisierung Hybrid
            if (mode === 'hybrid') {
                const visContainer = document.getElementById('hybrid-visual-content');
                if (visContainer) {
                    visContainer.innerHTML = ``;
                }
            }

            // Quiz rendern
            if (data.quiz) {
                this.renderQuiz(mode, data.quiz);
            }

            // Mission rendern
            if (mode === 'mission') {
                this.renderMission(data);
            }

            // Schule rendern (NEU)
            if (mode === 'school') {
                this.renderSchool(data);
            }

            // Freundschaft Modul rendern
            if (mode === 'freunde') {
                this.renderFreunde(data);
            }

            // Glossar Logik anhängen
            setTimeout(() => this.attachGlossary(), 100);
        }
    },

    /* --- PUZZLE LOGIC --- */
    initPuzzle: function (mode, data) {
        const pZone = document.getElementById(`puzzle-${mode}`);
        const tBox = document.getElementById(`toolbox-${mode}`);

        if (!pZone || !tBox) return;

        pZone.innerHTML = '';
        tBox.innerHTML = '';

        // Drop Zones (Ziel) erstellen
        data.puzzle.forEach((step, i) => {
            if (i > 0) {
                const arrow = document.createElement('div');
                arrow.className = 'arrow-down';
                arrow.innerText = '⬇️';
                pZone.appendChild(arrow);
            }

            const el = document.createElement('div');
            el.className = 'drop-zone';
            el.dataset.label = step.label;
            el.dataset.target = step.correct;

            // Event Listeners
            el.ondragover = (e) => {
                e.preventDefault();
                el.classList.add('hovered');
            };
            el.ondragleave = () => el.classList.remove('hovered');
            el.ondrop = (e) => this.handleDrop(e, el);

            pZone.appendChild(el);
        });

        // Draggables (Quelle) erstellen
        [...data.items].sort(() => Math.random() - 0.5).forEach(item => {
            const el = document.createElement('div');
            el.className = 'draggable-item';
            el.draggable = true;
            el.innerText = item.text;
            el.dataset.type = item.type;

            el.ondragstart = (e) => {
                e.dataTransfer.setData('type', item.type);
                e.dataTransfer.setData('text', item.text);
                el.classList.add('dragging');
            };
            el.ondragend = () => el.classList.remove('dragging');

            tBox.appendChild(el);
        });
    },

    handleDrop: function (e, zone) {
        e.preventDefault();
        zone.classList.remove('hovered');

        if (zone.classList.contains('correct')) return;

        const type = e.dataTransfer.getData('type');
        const text = e.dataTransfer.getData('text');

        if (type === zone.dataset.target) {
            zone.innerText = text;
            zone.classList.add('correct');
            const old = document.querySelector('.draggable-item.dragging');
            if (old) old.remove();
        } else {
            zone.style.backgroundColor = '#fce8e6';
            setTimeout(() => zone.style.backgroundColor = 'rgba(255,255,255,0.8)', 500);
        }
    },

    /* --- SIMULATOR --- */
    updateSim: function () {
        const p = parseInt(document.getElementById('sim-params').value);
        const d = parseInt(document.getElementById('sim-data').value);
        const c = parseInt(document.getElementById('sim-compute').value);

        const potential = (p + d) / 2;
        let realized = c >= potential ? potential : c + (potential - c) * 0.1;

        const iqVal = document.getElementById('iq-val');
        const barIq = document.getElementById('bar-iq');
        const barNrg = document.getElementById('bar-nrg');
        const simWarn = document.getElementById('sim-warn');

        if (iqVal) iqVal.innerText = Math.round(realized);
        if (barIq) barIq.style.width = realized + '%';
        if (barNrg) barNrg.style.width = Math.min(c, 100) + '%';

        const badges = ['b1', 'b2', 'b3', 'b4'];
        const thresholds = [10, 40, 70, 90];

        badges.forEach((id, idx) => {
            const el = document.getElementById(id);
            if (el) el.style.display = realized > thresholds[idx] ? 'inline-block' : 'none';
        });

        if (simWarn) simWarn.style.display = (c < potential - 15) ? 'block' : 'none';
    },

    /* --- RENDER HELPER --- */
    renderQuiz: function (mode, questions) {
        const container = document.getElementById(`quiz-${mode}`);
        if (!container) return;
        container.innerHTML = '';

        questions.forEach(q => {
            const el = document.createElement('div');
            el.className = 'quiz-option';
            el.innerText = q.text;
            el.onclick = function () {
                this.style.background = q.correct ? '#e6f4ea' : '#fce8e6';
                this.innerText = q.feedback;
            };
            container.appendChild(el);
        });
    },

    renderMission: function (data) {
        document.getElementById('text-mission-intro').innerHTML = data.intro;

        // 1. Tools rendern
        const toolCont = document.getElementById('mission-tools');
        toolCont.innerHTML = '';
        data.tools.forEach(t => {
            toolCont.innerHTML += `
                <a href="${t.url}" target="_blank" class="ai-tool-card">
                    <span style="font-size:2rem; display:block; margin-bottom:5px;">${t.icon}</span>
                    <h4 style="margin:0; color:#333;">${t.name}</h4>
                    <small style="color:#666;">${t.sub}</small>
                </a>`;
        });

        // 2. Tasks rendern
        const taskCont = document.getElementById('mission-tasks');
        taskCont.innerHTML = '';

        data.tasks.forEach((t, i) => {
            let html = `<div class="mission-card">`;

            html += `<h3 style="margin-top:0; color:#333;">${t.title}</h3><p style="line-height:1.6; color:#555;">${t.desc}</p>`;

            // Custom HTML (Tabelle, Security Check, Fazit Box)
            if (t.customHtml) {
                html += t.customHtml;
            }

            // Prompt Box
            if (t.prompt) {
                html += `
                <div class="copy-box">
                    <span id="p-${i}">${t.prompt}</span>
                    <button class="step-btn" onclick="app.copyToClip('p-${i}')">Kopieren</button>
                </div>`;
            }

            // Hinweis "In Tabelle eintragen"
            if (t.prompt) {
                html += `<div style="background:#fff3cd; color:#856404; padding:10px; border-radius:6px; font-size:0.9rem; margin-top:10px; border:1px solid #ffeeba;">
                            ✍️ <strong>Aufgabe:</strong> Kopiere die Antwort (oder eine Zusammenfassung) in deine Tabelle.
                         </div>`;
            }
            html += `</div>`;
            taskCont.innerHTML += html;
        });
    },

    // --- NEU: SCHULE RENDERER ---
    renderSchool: function (data) {
        const grid = document.getElementById('school-prompts-grid');
        if (!grid) return;
        grid.innerHTML = '';

        data.prompts.forEach((p, i) => {
            const html = `
            <div class="prompt-card">
                <h3><span>${p.icon}</span> ${p.subject}</h3>
                <h4 style="margin:10px 0; color:#333; font-size:1rem;">${p.title}</h4>
                <p>${p.desc}</p>
                <div class="copy-box" style="font-size:0.8rem; flex-direction:column; align-items:flex-start; gap:10px;">
                    <span id="sp-${i}" style="width:100%; white-space: pre-wrap;">${p.prompt}</span>
                    <button class="step-btn" style="width:100%; justify-content:center;" onclick="app.copyToClip('sp-${i}')">Kopieren</button>
                </div>
            </div>
            `;
            grid.innerHTML += html;
        });
    },

    /* --- FREUNDE MODUL --- */
    renderFreunde: function (data) {
        const container = document.getElementById('content-freunde');
        if (!container) return;
        container.innerHTML = '';

        // ── Sektion 1: Intro ─────────────────────────────────────────
        const s1 = document.createElement('div');
        s1.className = 'freunde-section';
        s1.innerHTML = data.intro;
        container.appendChild(s1);

        // ── Sektion 2: Karten-Spiel ──────────────────────────────────
        const s2 = document.createElement('div');
        s2.className = 'freunde-section';
        let scoreRichtig = 0;
        const totalKarten = data.cards.length;

        let kartenHTML = `
            <h2>🃏 Spiel: KI-Freund oder echter Freund?</h2>
            <p>Wer kann das wirklich? Klicke auf den richtigen Button – und sieh sofort, ob du Recht hast! 👇</p>
            <div class="karten-score" id="karten-score">0 / ${totalKarten} richtig ✅</div>
            <div class="karten-grid" id="karten-grid">
        `;
        data.cards.forEach((karte, idx) => {
            kartenHTML += `
                <div class="karte-item" id="karte-${idx}">
                    <div class="karte-text">${karte.text}</div>
                    <div class="karte-buttons">
                        <button class="karte-btn karte-btn-ki"
                            onclick="app.karteKlick(${idx}, 'ki', '${karte.correctSide}', \`${karte.feedback.ki.replace(/`/g, '\\`')}\`, \`${karte.feedback.freund.replace(/`/g, '\\`')}\`)">
                            🤖 KI-Freund
                        </button>
                        <button class="karte-btn karte-btn-freund"
                            onclick="app.karteKlick(${idx}, 'freund', '${karte.correctSide}', \`${karte.feedback.ki.replace(/`/g, '\\`')}\`, \`${karte.feedback.freund.replace(/`/g, '\\`')}\`)">
                            👫 Echter Freund
                        </button>
                    </div>
                    <div class="karte-feedback" id="karte-fb-${idx}"></div>
                </div>`;
        });
        kartenHTML += `</div>`;
        s2.innerHTML = kartenHTML;
        container.appendChild(s2);

        // ── Sektion 3: Dialog-Simulation ─────────────────────────────
        const s3 = document.createElement('div');
        s3.className = 'freunde-section';
        let dialogHTML = `
            <h2>💬 Simulation: Wer antwortet besser?</h2>
            <p>Du bist traurig 😢 – du hast dich mit deiner besten Freundin gestritten. Wen fragst du?<br>
            Klicke auf eine Antwort und sieh den Unterschied!</p>
            <div class="dialog-grid">
                <div class="dialog-panel dialog-panel-ki">
                    <h3>🤖 Du schreibst der KI …</h3>
        `;
        data.dialog.ki.forEach((opt, idx) => {
            dialogHTML += `
                <button class="dialog-option" id="dialog-ki-btn-${idx}"
                    onclick="app.dialogKlick('ki', ${idx})">
                    ${opt.text}
                </button>
                <div class="dialog-explanation" id="dialog-ki-exp-${idx}">${opt.explanation}</div>
            `;
        });
        dialogHTML += `
                </div>
                <div class="dialog-panel dialog-panel-freund">
                    <h3>💕 Du schreibst deiner Freundin …</h3>
        `;
        data.dialog.freund.forEach((opt, idx) => {
            dialogHTML += `
                <button class="dialog-option" id="dialog-freund-btn-${idx}"
                    onclick="app.dialogKlick('freund', ${idx})">
                    ${opt.text}
                </button>
                <div class="dialog-explanation" id="dialog-freund-exp-${idx}">${opt.explanation}</div>
            `;
        });
        dialogHTML += `</div></div>`;
        s3.innerHTML = dialogHTML;
        container.appendChild(s3);

        // ── Sektion 4: Quiz ───────────────────────────────────────────
        const s4 = document.createElement('div');
        s4.className = 'freunde-section';
        let quizHTML = `<h2>🎯 Quiz: Weißt du's?</h2>
            <p>6 Fragen – beantworte jede und sieh sofort, ob du richtig liegst! Am Ende gibt es deine Gesamtpunktzahl. 🏆</p>`;

        data.quiz.forEach((frage, fi) => {
            quizHTML += `<div class="quiz-frage-block" id="quiz-frage-${fi}">
                <p>${fi + 1}. ${frage.question}</p>`;
            frage.options.forEach((opt, oi) => {
                quizHTML += `<button class="quiz-option-freunde" id="qopt-${fi}-${oi}"
                    onclick="app.quizKlick(${fi}, ${oi}, ${opt.correct}, \`${opt.feedback.replace(/`/g, '\\`')}\`, ${frage.options.length})">
                    ${opt.text}
                </button>`;
            });
            quizHTML += `</div>`;
        });
        quizHTML += `
            <div class="quiz-score-box" id="quiz-score-box">
                <span class="score-zahl" id="quiz-score-zahl">0 / ${data.quiz.length}</span>
                <p id="quiz-score-text">Klasse gemacht! Weiter so! 🎉</p>
            </div>`;
        s4.innerHTML = quizHTML;
        container.appendChild(s4);

        // ── Sektion 5: Reflexion ──────────────────────────────────────
        const s5 = document.createElement('div');
        s5.className = 'freunde-section';
        s5.innerHTML = `
            <h2>💭 Dein Gedanke</h2>
            <h3>${data.reflection.question}</h3>
            <div style="background: #e8f0fe; padding: 15px; border-radius: 8px; margin-top: 16px; border: 1px solid var(--primary);">
                <strong>📝 Dein Auftrag für Pages / GoodNotes:</strong><br>
                Schreib deine Antwort in eigenen Worten in dein Dokument auf. Mindestens 2–3 Sätze!
            </div>
            <br>
            <button class="btn-tipp" onclick="app.tippAnzeigen()">💡 Tipp für echte Freundschaft anzeigen</button>
            <div class="tipp-box" id="freunde-tipp">${data.reflection.tip}</div>
        `;
        container.appendChild(s5);

        // ── Sektion 6: Outro ──────────────────────────────────────────
        const s6 = document.createElement('div');
        s6.className = 'freunde-section';
        s6.innerHTML = data.outro;
        container.appendChild(s6);

        // Score-Tracking initialisieren
        this._karteScore = 0;
        this._quizScore = 0;
        this._quizAnswered = 0;
        this._quizTotal = data.quiz.length;
    },

    karteKlick: function (idx, gewählt, richtige, feedbackKi, feedbackFreund) {
        const karteEl = document.getElementById(`karte-${idx}`);
        const fbEl = document.getElementById(`karte-fb-${idx}`);
        if (!karteEl || karteEl.classList.contains('karte-richtig') || karteEl.classList.contains('karte-falsch')) return;

        const istRichtig = gewählt === richtige;
        karteEl.classList.add(istRichtig ? 'karte-richtig' : 'karte-falsch');

        // Buttons deaktivieren
        karteEl.querySelectorAll('.karte-btn').forEach(b => b.disabled = true);

        // Feedback anzeigen
        fbEl.style.display = 'block';
        fbEl.className = `karte-feedback ${istRichtig ? 'richtig-fb' : 'falsch-fb'}`;
        const fbText = gewählt === 'ki' ? feedbackKi : feedbackFreund;
        fbEl.innerHTML = (istRichtig ? '✅ Richtig! ' : '❌ Nicht ganz. ') + fbText;

        // Score
        if (istRichtig) {
            this._karteScore = (this._karteScore || 0) + 1;
        }
        const scoreEl = document.getElementById('karten-score');
        if (scoreEl) scoreEl.textContent = `${this._karteScore || 0} / ${document.querySelectorAll('.karte-item').length} richtig ✅`;
    },

    dialogKlick: function (seite, idx) {
        const expEl = document.getElementById(`dialog-${seite}-exp-${idx}`);
        if (!expEl) return;
        // Toggle
        const istSichtbar = expEl.style.display === 'block';
        expEl.style.display = istSichtbar ? 'none' : 'block';
    },

    quizKlick: function (frageIdx, optIdx, istRichtig, feedback, anzOptionen) {
        const frageBlock = document.getElementById(`quiz-frage-${frageIdx}`);
        if (frageBlock && frageBlock.dataset.beantwortet) return;

        // Alle Optionen dieser Frage deaktivieren + einfärben
        for (let i = 0; i < anzOptionen; i++) {
            const btn = document.getElementById(`qopt-${frageIdx}-${i}`);
            if (btn) {
                btn.disabled = true;
                if (i === optIdx) {
                    btn.classList.add(istRichtig ? 'richtig' : 'falsch');
                    btn.innerHTML += `<br><small style="font-weight:normal;">${feedback}</small>`;
                }
            }
        }
        if (frageBlock) frageBlock.dataset.beantwortet = '1';

        if (istRichtig) this._quizScore = (this._quizScore || 0) + 1;
        this._quizAnswered = (this._quizAnswered || 0) + 1;

        // Ergebnis zeigen wenn alle beantwortet
        if (this._quizAnswered >= this._quizTotal) {
            const scoreBox = document.getElementById('quiz-score-box');
            const scoreZahl = document.getElementById('quiz-score-zahl');
            const scoreText = document.getElementById('quiz-score-text');
            if (scoreBox && scoreZahl && scoreText) {
                scoreZahl.textContent = `${this._quizScore} / ${this._quizTotal}`;
                const pct = this._quizScore / this._quizTotal;
                scoreText.textContent = pct === 1
                    ? '🏆 Perfekt! Du bist ein Experte für echte Freundschaft!'
                    : pct >= 0.7
                        ? '🎉 Super gemacht! Du verstehst es schon sehr gut!'
                        : pct >= 0.5
                            ? '👍 Nicht schlecht – lies nochmal die Tipps oben!'
                            : '💪 Noch ein bisschen üben – du schaffst das!';
                scoreBox.style.display = 'block';
                scoreBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    },

    tippAnzeigen: function () {
        const el = document.getElementById('freunde-tipp');
        if (el) {
            el.style.display = el.style.display === 'block' ? 'none' : 'block';
            if (el.style.display === 'block') el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    },

    /* --- HELPERS --- */
    copyToClip: function (id) {
        navigator.clipboard.writeText(document.getElementById(id).innerText);
        alert('Text kopiert! Füge ihn jetzt bei der KI ein.');
    },

    attachGlossary: function () {
        const popup = document.getElementById('term-popup');
        document.querySelectorAll('.term').forEach(t => {
            t.onmouseenter = e => {
                popup.innerText = t.dataset.def;
                popup.style.display = 'block';
                popup.style.left = (e.clientX + 10) + 'px';
                popup.style.top = (e.clientY + 10) + 'px';
            };
            t.onmouseleave = () => popup.style.display = 'none';
        });
    }
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});