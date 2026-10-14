/* CONTENT – Texte & Aufgaben (Klasse 6)
   Hier stehen nur Inhalte. Darstellung: style.css, Verhalten: app.js.
   Schnell anpassen:
     • KI-Werkzeug / Link:      TELLI_URL
     • Vergleichsspalten Mission: modules.mission.compare
     • Reihenfolge & Farben:    STEPS
*/

const TELLI_URL = 'https://chat.telli.schule/';

/* Reihenfolge, Beschriftung und Farben der Stationen.
   color = Hintergrund, on = Schrift darauf, soft = helle Fläche, ink = Schrift auf Weiß. */
const STEPS = [
    { id: 'start',   label: 'Start',               layout: 'single', color: '#37474f', on: '#fff',    soft: '#eceff1', ink: '#263238' },
    { id: 'hook',    label: 'Echt oder erfunden?', layout: 'single', color: '#6a1b9a', on: '#fff',    soft: '#f3e5f5', ink: '#6a1b9a' },
    { id: 'google',  label: 'Suchmaschine',        layout: 'split',  color: '#1a5fd0', on: '#fff',    soft: '#e8f0fe', ink: '#1a4fb0' },
    { id: 'ai',      label: 'So antwortet KI',     layout: 'single', color: '#8e24aa', on: '#fff',    soft: '#f6e9fa', ink: '#7b1fa2' },
    { id: 'lab',     label: 'KI trainieren',       layout: 'single', color: '#00796b', on: '#fff',    soft: '#e0f2f1', ink: '#00695c' },
    { id: 'mission', label: 'Mission',             layout: 'single', color: '#0b7a43', on: '#fff',    soft: '#e4f5ec', ink: '#0b6b3a' },
    { id: 'hybrid',  label: 'Suche + KI',          layout: 'single', color: '#fbbc04', on: '#2b1d00', soft: '#fff6dc', ink: '#7a5200' },
    { id: 'school',  label: 'Lernhilfe',           layout: 'single', color: '#d84315', on: '#fff',    soft: '#fbe9e4', ink: '#bf360c' },
    { id: 'freunde', label: 'Freundschaft',        layout: 'single', color: '#c2185b', on: '#fff',    soft: '#fce4ee', ink: '#ad1457' }
];

/* Bausteine für Texte */
const T = (word, def) => `<button type="button" class="term" data-def="${def}">${word}</button>`;
const TASK = (html) => `<div class="callout task"><span class="callout-title">📝 Dein Auftrag für Pages / GoodNotes</span>${html}</div>`;
const Q = (text) => `<p class="leitfrage">❓ ${text}</p>`;

const modules = {

    /* ───────── START ───────── */
    start: {
        html: `
        <div class="page start-hero">
            <div class="hero-icon" aria-hidden="true">🕵️‍♂️🔎🤖</div>
            <h1>Künstliche Intelligenz (KI)</h1>
            <p class="lead">
                Du benutzt bestimmt oft Suchmaschinen wie Google. Aber hast du schon mal mit einer
                <strong>KI</strong> gesprochen?<br>
                Heute finden wir heraus: <strong>Was ist der Unterschied – und wer ist wofür besser?</strong>
            </p>

            <div class="callout warn">
                <span class="callout-title">⚠️ So funktioniert diese Stunde</span>
                <ol>
                    <li><strong>Öffne jetzt <em>Pages</em> oder <em>GoodNotes</em></strong> auf deinem iPad. Dort hältst du deine Ergebnisse fest.</li>
                    <li>Bei manchen Stationen gibt es einen <strong>📝 Auftrag</strong> für dein Dokument – dort musst du etwas aufschreiben, nicht nur klicken.</li>
                    <li><strong>Am Ende der Stunde gibst du dein Dokument ab:</strong> in <strong>itslearning</strong> unter <strong>Mitteilungen</strong> findest du den Link dafür.</li>
                </ol>
            </div>

            <div class="callout ok">
                <span class="callout-title">🤖 Unser KI-Werkzeug heute: telli</span>
                telli ist eine KI für die Schule – auf Deutsch und geschützt. Du brauchst den <strong>Zugangscode von deinem Lehrer</strong>.
            </div>

            <h2 style="margin-top:24px">Dein Weg heute</h2>
            <ul class="way">
                <li><span class="ic">🎭</span><span><b>Echt oder erfunden?</b>Kannst du es erkennen?</span></li>
                <li><span class="ic">🔎</span><span><b>Suchmaschine</b>Weißt du es noch?</span></li>
                <li><span class="ic">🧠</span><span><b>So antwortet KI</b>Sei selbst die KI.</span></li>
                <li><span class="ic">🧪</span><span><b>KI trainieren</b>Zeig ihr, was ein Fisch ist.</span></li>
                <li><span class="ic">🕵️</span><span><b>Mission</b>Suchmaschine gegen KI – 3 Tests, dazu 2 Zusatz.</span></li>
                <li><span class="ic">🔗</span><span><b>Suche + KI</b>Finde den Fehler.</span></li>
                <li><span class="ic">🎓</span><span><b>Lernhilfe</b>KI als Übungspartner – ohne Schummeln.</span></li>
                <li><span class="ic">❤️</span><span><b>Bonus</b>Warum eine KI kein Freund ist.</span></li>
            </ul>

            <button type="button" class="btn big-btn" data-go="next">Los geht's! 🚀</button>
        </div>`,
        hint: 'Lies die Infos genau – besonders den Teil mit Pages / GoodNotes. Dann: „Los geht’s!“'
    },

    /* ───────── 1 · HOOK: ECHT ODER ERFUNDEN? ───────── */
    hook: {
        html: `
        <div class="page">
            ${Q('Kannst du Wahres von Erfundenem unterscheiden?')}
            <h2>🎭 Echt oder erfunden?</h2>
            <p>Vier Aussagen. Manche stimmen, manche sind erfunden. Was meinst du? Tippe auf deinen Tipp.</p>
            <div data-slot="hook"></div>
        </div>`,
        statements: [
            { text: 'Ein Oktopus hat drei Herzen.', real: true,
              reveal: 'Stimmt! Zwei Herzen pumpen das Blut durch die Kiemen, das dritte durch den Körper.' },
            { text: 'Der Mount Everest wird jedes Jahr um etwa 2 Meter höher.', real: false,
              reveal: 'Erfunden! Er wächst nur etwa 4 Millimeter pro Jahr.' },
            { text: 'Bananen sind botanisch gesehen Beeren.', real: true,
              reveal: 'Stimmt! Erdbeeren dagegen sind keine Beeren – verrückt, oder?' },
            { text: 'Ein Blitz schlägt nie zweimal an derselben Stelle ein.', real: false,
              reveal: 'Erfunden! Hohe Gebäude wie das Empire State Building werden mehrmals im Jahr getroffen.' }
        ],
        after: `<strong>Alle vier Sätze klangen gleich sicher.</strong> Genau das ist das Problem: Ein Text klingt überzeugend – egal, ob er stimmt. Das gilt für Menschen <em>und</em> für KI. Gleich erfährst du, warum.`,
        poll: {
            q: 'Jetzt die Frage der Stunde. Du hast eine Frage für die Hausaufgabe – wem vertraust du eher?',
            options: [
                { id: 'suche', label: '🔎 Suchmaschine' },
                { id: 'ki', label: '🤖 KI' },
                { id: 'kommt', label: '🤔 Kommt darauf an' }
            ],
            done: 'Gemerkt! Am Ende der Mission schauen wir, ob du dabei bleibst.'
        },
        hint: 'Tippe bei jeder Aussage „Echt“ oder „Erfunden“. Danach: dein Tipp zur Frage der Stunde.'
    },

    /* ───────── 2 · SUCHMASCHINE (Wiederholung als Abrufübung) ───────── */
    google: {
        text: `
        ${Q('Wie findet eine Suchmaschine in Sekunden das Richtige?')}
        <h2>Weißt du es noch?</h2>
        <p>Das hast du in der letzten Einheit gelernt. Versuche erst, den Ablauf <strong>aus dem Kopf</strong> zu bauen – das Puzzle rechts. Nur wenn du nicht weiterkommst, lies nach.</p>

        <details class="zusatz nachlesen">
            <summary>📖 Hilfe: Nachlesen</summary>
            <ol class="flow">
                <li><strong>Sammeln</strong>
                    ${T('Crawler', 'Ein „Software-Roboter“: Er folgt Links von Seite zu Seite und kopiert die Webseiten.')} reisen Tag und Nacht durchs Netz und kopieren jede Seite, die sie finden.</li>
                <li><strong>Speichern</strong>
                    Die Kopien kommen in den ${T('Index', 'Ein gigantisches, sortiertes Verzeichnis: Es weiß, welches Wort auf welcher Webseite steht – wie das Stichwortverzeichnis hinten im Buch.')}.</li>
                <li><strong>Eingeben</strong>
                    Du tippst deine <strong>Suchanfrage</strong> (Stichwörter) ins Suchfeld.</li>
                <li><strong>Sortieren</strong>
                    Der ${T('Algorithmus', 'Eine genaue Rechenvorschrift (wie ein Rezept). Hier entscheidet sie, welches Ergebnis auf Platz 1 kommt.')} berechnet, welche Seite am besten zu deinen Wörtern passt.</li>
                <li><strong>Anzeigen</strong>
                    Du siehst die Ergebnisliste mit dem ${T('Snippet', 'Die kurze Textvorschau unter dem Link in der Ergebnisliste.')}.</li>
            </ol>
        </details>

        <div class="callout merke">
            <span class="callout-title">💡 Merke</span>
            Eine Suchmaschine <strong>findet</strong>, was schon im Netz steht. Sie schreibt nichts Neues.
            <br>Das ist bei einer KI gleich ganz anders …
        </div>
        <p class="only-narrow"><button type="button" class="btn small" data-scroll="puzzle">Zum Puzzle ⬇️</button></p>`,
        puzzle: {
            how: 'Tippe einen Baustein an und dann das passende Feld. (Mit der Maus kannst du auch ziehen.)',
            done: '🎉 Geschafft! Du erinnerst dich. Weiter zur nächsten Station.',
            steps: [
                { label: 'Reist durchs Netz und kopiert Seiten', correct: 'Crawler', hint: 'Das Wort klingt nach „krabbeln“.' },
                { label: 'Das riesige Verzeichnis aller Wörter', correct: 'Index', hint: 'So heißt auch das Stichwortverzeichnis hinten im Buch.' },
                { label: 'Das tippst du ins Suchfeld', correct: 'Suchanfrage', hint: 'Das bist du: Du fragst etwas.' },
                { label: 'Entscheidet, wer auf Platz 1 steht', correct: 'Algorithmus', hint: 'Eine genaue Rechenvorschrift, wie ein Rezept.' },
                { label: 'Die kurze Textvorschau', correct: 'Snippet', hint: 'Steht unter dem blauen Link.' }
            ],
            items: [
                { text: '🕷️ Crawler', type: 'Crawler' },
                { text: '📚 Index', type: 'Index' },
                { text: '⌨️ Suchanfrage', type: 'Suchanfrage' },
                { text: '🧮 Algorithmus', type: 'Algorithmus' },
                { text: '📝 Snippet', type: 'Snippet' }
            ]
        },
        hint: 'Baue den Ablauf aus dem Kopf (antippen oder ziehen). Hilfe findest du unter „Nachlesen“.'
    },

    /* ───────── 3 · SO ANTWORTET KI (Vorhersagen → Erklären) ───────── */
    ai: {
        html: `
        <div class="page">
            ${Q('Wie kommt eine KI zu ihren Antworten – und warum erfindet sie manchmal etwas?')}
            <h2>Sei selbst die KI!</h2>
            <p>Eine KI wie telli <strong>sucht keine fertigen Webseiten</strong>. Sie baut ihre Antwort <strong>Wort für Wort</strong> neu zusammen. Probier es aus: Du siehst einen Satzanfang und rätst das nächste Wort – so wie die KI es tut.</p>

            <div data-slot="rounds"></div>

            <h3>Was steckt dahinter?</h3>
            <ol class="flow">
                <li><strong>Training mit Daten</strong>
                    Die KI hat riesige <strong>Datenmengen</strong> gelesen (Bücher, Wikipedia, Internet-Texte).</li>
                <li><strong>Muster lernen</strong>
                    Sie hat gelernt, welche Wörter oft zusammen vorkommen. Nach „Hauptstadt von Frankreich ist“ steht fast immer „Paris“.</li>
                <li><strong>Wahrscheinlichstes Wort wählen</strong>
                    Bei deiner Frage schätzt sie für jedes Wort, wie gut es passt – und nimmt ein sehr wahrscheinliches. Das wiederholt sie Wort für Wort.</li>
            </ol>

            <div class="callout merke">
                <span class="callout-title">💡 Merke</span>
                Eine KI wählt das <strong>wahrscheinlichste</strong> Wort – nicht das <strong>wahrste</strong>. Erfindet sie dabei etwas, das falsch ist, aber echt klingt, nennt man das
                ${T('Halluzination', 'Die KI erfindet etwas Falsches, aber sie klingt so sicher, als wäre es wahr.')}.
            </div>

            ${TASK(`Erkläre in <strong>zwei Sätzen</strong>: Warum antwortet die KI bei „Atlantis-Oberhausen“ trotzdem?<br>
            <small>Beginne so: <em>„Die KI wählt immer …, deshalb …“</em></small>`)}
        </div>`,
        rounds: {
            title: '🎮 Runde',
            footnote: 'Die Prozentzahlen sind Beispielwerte, damit man das Prinzip sieht.',
            list: [
                {
                    sentence: 'Die Maus frisst den …',
                    question: 'Welches Wort kommt wohl als Nächstes? Tippe auf deinen Tipp.',
                    options: [
                        { label: 'Käse 🧀', width: 95, pct: '95 %', note: 'Sehr wahrscheinlich – das steht in unzähligen Texten.' },
                        { label: 'Teppich 🧶', width: 4, pct: '4 %', note: 'Möglich, aber selten – vielleicht in einem Cartoon.' },
                        { label: 'Mond 🌑', width: 1, pct: '0,01 %', note: 'So gut wie nie – das steht in keinem Text.' }
                    ],
                    insight: 'Die KI nimmt das <strong>wahrscheinlichste</strong> Wort: Käse.'
                },
                {
                    sentence: 'Die Hauptstadt von Frankreich ist …',
                    question: 'Und jetzt eine Wissensfrage. Was schreibt die KI?',
                    options: [
                        { label: 'Paris', width: 97, pct: '97 %', note: 'Dieses Wort steht in den Trainingstexten fast immer dahinter.' },
                        { label: 'Lyon', width: 2, pct: '2 %', note: 'Kommt vor – aber selten als Hauptstadt.' },
                        { label: 'Berlin', width: 1, pct: '1 %', note: 'Passt nur in Texten über Deutschland.' }
                    ],
                    insight: 'Weil „Paris“ so eindeutig das wahrscheinlichste Wort ist, ist die Antwort <strong>richtig</strong>. Die KI „weiß“ es nicht – sie hat es nur oft gelesen.'
                },
                {
                    sentence: 'Die Hauptstadt von Atlantis-Oberhausen ist …',
                    question: 'Dieses Land gibt es gar nicht! Was wird die KI wohl schreiben?',
                    options: [
                        { label: 'Neustadt', width: 22, pct: '22 %', note: 'Klingt nach einer Stadt.' },
                        { label: 'Atlantia', width: 20, pct: '20 %', note: 'Klingt nach Atlantis.' },
                        { label: 'Oberstadt', width: 18, pct: '18 %', note: 'Klingt nach Oberhausen.' },
                        { label: 'Das weiß ich nicht', width: 4, pct: '4 %', note: 'Kommt in Trainingstexten selten als Antwort auf so einen Satzanfang vor.' }
                    ],
                    insight: `Hier gibt es <strong>keinen klaren Sieger</strong> – aber die KI nimmt trotzdem eines der Wörter und schreibt es genauso sicher wie „Paris“. Das ist eine <strong>Halluzination</strong>.
                    <br><small>Neuere KIs sind darauf trainiert, öfter „Das weiß ich nicht“ zu sagen. Verlassen kannst du dich darauf aber nicht – das testest du gleich in der Mission.</small>`
                }
            ]
        },
        hint: 'Spiele alle drei Runden. Schreibe dann in zwei Sätzen auf, warum die KI bei Atlantis-Oberhausen trotzdem antwortet.'
    },

    /* ───────── 4 · KI TRAINIEREN ───────── */
    lab: {
        html: `
        <div class="page">
            ${Q('Woher weiß eine KI, was ein Fisch ist?')}
            <h2>⚙️ Das KI-Labor: Du bist der Lehrer! 🐟🥫</h2>
            <p>Eine KI weiß nicht, was ein Fisch ist. <strong>Du musst es ihr zeigen</strong> – mit Beispielen. Darum sind <strong>gute Daten</strong> so wichtig.</p>

            <div class="callout task">
                <span class="callout-title">🎮 Deine Aufgabe</span>
                <ol>
                    <li>Klicke unten auf den großen Button.</li>
                    <li><strong>Schalte den Ton aus!</strong> 🔇</li>
                    <li>Bring der KI bei: <strong>Was ist ein Fisch? Was ist Müll?</strong></li>
                    <li>Komm danach hierher zurück und klicke auf „Weiter“.</li>
                </ol>
            </div>

            <div class="game-launcher">
                <div class="game-icon" aria-hidden="true">🐟🤖</div>
                <h2>Eine KI trainieren</h2>
                <div class="mute-warning">🔇 BITTE TON AUSSCHALTEN!</div>
                <p style="margin-bottom:20px">Trainiere die KI: Ist das ein Fisch oder gehört das in den Müll?</p>
                <a class="launch-btn" href="https://studio.code.org/courses/oceans/units/1/lessons/1/levels/2?lang=de-DE" target="_blank" rel="noopener">Spiel im neuen Tab starten 🚀</a>
            </div>

            ${TASK(`Beschreibe kurz, was beim Ozean-Spiel passiert ist:<br>
            <strong>Hat die KI am Anfang Fehler gemacht? Warum?</strong><br>
            <small>Tipp: Denk an die Beispiele, die du ihr gezeigt hast. Was passiert, wenn es zu wenige oder nur ähnliche sind?</small>`)}

            <details class="zusatz">
                <summary>⚡ Zusatz-Labor für Schnelle: Warum braucht KI so viel Strom?</summary>
                <p>Damit eine KI richtig gut wird, braucht sie <strong>drei Zutaten</strong> – und alle drei müssen zusammenpassen:</p>
                <div class="ingredients">
                    <div class="ingredient i1"><strong>🧠 1. Größe (Parameter)</strong>
                        Millionen und Milliarden „Stellschrauben“ in der KI – ihr Speicher fürs Gelernte. <em>Ein großer Speicher bringt nichts, wenn er leer bleibt!</em></div>
                    <div class="ingredient i2"><strong>📚 2. Futter (Daten)</strong>
                        Fütterst du die KI nur mit SpongeBob-Folgen, antwortet sie auf jede Mathe-Frage: <em>„Ist hier die Krosse Krabbe?“</em> 🦀</div>
                    <div class="ingredient i3"><strong>⚡ 3. Muckis (Rechenpower & Strom)</strong>
                        Das alles zu verarbeiten braucht riesige Hallen voller Computer – und extrem viel Strom.</div>
                </div>
                <p><small>Von „Gehirn“ und „schlau“ sprechen wir nur als Bild. Eine KI rechnet – sie denkt nicht wie du.</small></p>
                <p><strong>Dein Experiment:</strong> Versuche, „Können“ auf 100 % zu bringen. Probiere dann: Viele Bücher, aber winziger Speicher – was passiert?</p>
                <div data-slot="sim"></div>
                ${TASK('Warum braucht eine gute KI so viel Strom? Und was passiert, wenn eine der drei Zutaten zu klein ist?')}
                <p>🎮 <a href="./escape-game.html" target="_blank" rel="noopener"><strong>Escape-Spiel</strong></a> (neuer Tab) – teste dein Wissen!</p>
            </details>
        </div>`,
        hint: 'Spiele das Ozean-Spiel (neuer Tab, Ton aus!). Schreibe danach auf, warum die KI Fehler gemacht hat. Fertig? Dann das Zusatz-Labor!'
    },

    /* ───────── 6 · SUCHE + KI ───────── */
    hybrid: {
        html: `
        <div class="page">
            ${Q('Was passiert, wenn Suche und KI zusammenarbeiten – und wie prüfe ich das?')}
            <h2>Suche + KI zusammen</h2>
            <p>Früher gab es nur zehn blaue Links. Heute zeigen viele Suchmaschinen <strong>ganz oben eine KI-Zusammenfassung</strong>. Das ist ein Mix aus beidem:</p>

            <div class="flow3">
                <div><b>1 · Suchen 🔎</b>Die Suchmaschine findet die besten Webseiten.</div>
                <div><b>2 · Lesen 📖</b>Eine KI liest diese Seiten blitzschnell.</div>
                <div><b>3 · Zusammenfassen ✍️</b>Die KI schreibt daraus eine kurze Antwort.</div>
            </div>

            <h3>🕵️ Der Fehler-Finder</h3>
            <p>Unten siehst du eine <strong>KI-Zusammenfassung</strong> und die <strong>Quellen</strong>, aus denen sie entstanden ist. <strong>Ein Satz steht in keiner Quelle.</strong> Tippe auf Sätze und finde ihn!</p>
            <div data-slot="finder"></div>

            <h3>Das Gute & das Schlechte</h3>
            <div class="proscons">
                <ul class="pro">
                    <li><h4>✅ Vorteile</h4></li>
                    <li><strong>Zeit-Sparer:</strong> Du musst nicht fünf Webseiten öffnen.</li>
                    <li><strong>Verständlich:</strong> Schwere Texte werden einfach erklärt.</li>
                    <li><strong>Dialog:</strong> Du kannst Folgefragen stellen.</li>
                </ul>
                <ul class="con">
                    <li><h4>❌ Nachteile</h4></li>
                    <li><strong>„Stille Post“:</strong> Versteht die KI den Text falsch, erzählt sie Quatsch – obwohl die Quelle stimmte.</li>
                    <li><strong>Quellen-Blindheit:</strong> Man prüft kaum noch, <em>wer</em> etwas geschrieben hat.</li>
                    <li><strong>Strom-Hunger:</strong> Eine KI-Antwort braucht meist deutlich mehr Strom als eine normale Suche.</li>
                </ul>
            </div>

            ${TASK(`Wähle aus der Liste <strong>den wichtigsten Vorteil</strong> und <strong>den größten Nachteil – für DICH</strong>. Begründe jeweils in einem Satz.`)}
        </div>`,
        finder: {
            sources: [
                { name: 'Quelle 1 · Wetter erklärt für Kinder', text: 'Ein Regenbogen entsteht, wenn Sonnenlicht auf Regentropfen trifft. Im Tropfen wird das Licht gebrochen und gespiegelt.' },
                { name: 'Quelle 2 · Lexikon: Regenbogen', text: 'Die Farben reichen von Rot (außen) bis Violett (innen). Man sieht einen Regenbogen, wenn die Sonne hinter einem steht und es vor einem regnet.' }
            ],
            query: 'Wie entstehen Regenbogen?',
            sentences: [
                { t: 'Ein Regenbogen entsteht, wenn Sonnenlicht auf Regentropfen trifft und dort gebrochen wird.', src: 'Quelle 1' },
                { t: 'Die Farben reichen von Rot außen bis Violett innen.', src: 'Quelle 2' },
                { t: 'Ein Regenbogen kann nur am Vormittag entstehen.', src: null,
                  why: 'Das steht in keiner der beiden Quellen – und es stimmt auch nicht: Regenbogen gibt es auch nachmittags und abends, wenn die Sonne tief steht.' },
                { t: 'Man sieht ihn, wenn die Sonne hinter einem steht.', src: 'Quelle 2' }
            ],
            insight: '<strong>So prüfst du:</strong> Gehört jeder Satz zu einer Quelle? Öffne die Quelle und lies selbst nach. Die KI-Zusammenfassung klang bei <em>allen</em> Sätzen gleich sicher.'
        },
        hint: 'Finde den Satz, der in keiner Quelle steht. Wähle dann deinen wichtigsten Vorteil und größten Nachteil aus.'
    },

    /* ───────── 5 · MISSION ───────── */
    mission: {
        intro: `
            <div class="hero-icon" aria-hidden="true">🕵️‍♂️</div>
            <h1>Die Mission: Suchmaschine gegen KI</h1>
            <p>Du hast gesehen, wie eine KI Wort für Wort rät. Jetzt wirst du zum <strong>Technik-Tester</strong> und findest es heraus – mit drei Tests. Tests 4 und 5 sind <strong>Zusatz</strong> für alle, die schneller sind.</p>`,
        // Spaltenüberschriften der Test-Tabelle (hier ändern, falls zwei KIs verglichen werden sollen)
        compare: ['telli (KI)', 'Suchmaschine'],
        tools: [
            { name: 'telli', icon: '🤖', url: TELLI_URL, sub: 'Unsere Schul-KI (Zugangscode nötig)', main: true },
            { name: 'Suchmaschine', icon: '🔎', url: 'https://www.google.com', sub: 'Wie bisher: Stichwörter eintippen' }
        ],
        safety: {
            intro: 'KIs speichern, was du schreibst. Entscheide bei jedem Beispiel: <strong>Darf das in einen Prompt?</strong>',
            items: [
                { text: 'Mein voller Name', ok: false, why: 'Namen sind privat. Schreib stattdessen „ich“.' },
                { text: 'Eine Frage zu Vulkanen', ok: true, why: 'Sachfragen sind unbedenklich.' },
                { text: 'Meine Adresse oder Handynummer', ok: false, why: 'Das erfährt niemand im Netz.' },
                { text: 'Ein Passwort', ok: false, why: 'Passwörter sind geheim – für immer.' },
                { text: 'Ein Foto von mir oder meiner Familie', ok: false, why: 'Fotos sind persönliche Daten – gib sie nie her.' },
                { text: 'Ein Text, den ich selbst geschrieben habe (ohne Namen)', ok: true, why: 'Ohne Namen und private Infos ist das in Ordnung.' }
            ]
        },
        protokoll: 'Lege in deinem Dokument eine Tabelle an – so wie hier. Du trägst nach jedem Test ein, was <strong>telli</strong> und was die <strong>Suchmaschine</strong> geliefert hat.',
        tasks: [
            {
                title: 'Der Halluzinations-Check',
                desc: 'Teste ein Land, das es gar nicht gibt!',
                prompt: 'Nenne mir 3 berühmte Sehenswürdigkeiten im Land „Atlantis-Oberhausen“.',
                search: 'Sehenswürdigkeiten Atlantis-Oberhausen',
                look: 'Hat die KI etwas erfunden – oder gesagt, dass es das nicht gibt? Was zeigt die Suchmaschine?'
            },
            {
                title: 'Kreativität',
                desc: 'Wer macht etwas Neues – und wer findet nur Vorhandenes?',
                prompt: 'Schreibe einen kurzen Rap-Song darüber, dass ich mein Zimmer aufräumen muss, aber keine Lust habe. Benutze Jugendsprache.',
                search: 'Rap Song Zimmer aufräumen',
                look: 'Wer hat dir einen neuen Text gemacht? Wer hat dir nur Links zu anderen Seiten gezeigt?'
            },
            {
                title: 'Meinung oder Fakt?',
                desc: 'Hat eine KI einen eigenen Geschmack – oder bleibt sie neutral?',
                prompt: 'Welcher ist der beste Fußballverein der Welt und warum? Sag mir deine ehrliche Meinung.',
                search: 'bester Fußballverein der Welt',
                look: 'Legt sich die KI fest? Was steht in den Suchergebnissen? Sind das Fakten oder Meinungen?'
            },
            {
                title: 'Logik & Rechnen',
                extra: true,
                desc: 'KIs sind Sprach-Modelle, keine Taschenrechner. Lösen sie diese Scherzfrage?',
                prompt: 'Ich habe 3 Äpfel. Gestern habe ich einen gegessen. Wie viele Äpfel habe ich heute?',
                search: 'Ich habe 3 Äpfel gestern einen gegessen wie viele habe ich heute',
                look: 'Stimmt die Antwort? Rechne selbst nach. Konnte die Suchmaschine hier helfen?'
            },
            {
                title: 'Hilfe für die Schule',
                extra: true,
                desc: 'Kann dir die KI etwas erklären – und die Suchmaschine auch?',
                prompt: 'Erkläre mir die Kommasetzung im Deutschen so, als wäre ich 5 Jahre alt. Benutze ein Beispiel mit Pizza.',
                search: 'Kommasetzung erklärt für Kinder',
                look: 'Wer erklärt es dir einfacher? Wer zeigt dir, woher die Information stammt?'
            }
        ],
        urteil: `
            <p data-tipp-ref hidden></p>
            <strong>📝 Abschluss-Fazit</strong> – schreibe unter deine Tabelle:<br>
            1. <strong>Wofür ist die Suchmaschine besser?</strong> Wofür die KI? (je ein Beispiel aus deinen Tests)<br>
            2. <strong>Die Warnung:</strong> Wann solltest du der KI lieber <em>nicht</em> vertrauen – und wie prüfst du das?<br>
            3. <strong>Deine Regel:</strong> „Wenn ich … brauche, nehme ich …“`,
        hint: 'Beginne mit dem Sicherheits-Check. Mache dann die Tests und trage jeden Test in deine Tabelle ein.'
    },

    /* ───────── 7 · LERNHILFE ───────── */
    school: {
        intro: `
            <h1>🎓 KI als Lernpartner</h1>
            <p style="font-size:1.1rem">Eine KI ist nicht zum Abschreiben da, sondern zum <strong>Üben und Verstehen</strong>. Die besten Prompts verlangen, dass <strong>du</strong> mitdenkst.</p>`,
        auftrag: `Teste mindestens zwei Aufgaben mit <strong>telli</strong>. Schreibe in Stichworten auf: Was hat funktioniert? Wofür willst du KI in der Schule künftig einsetzen – und wofür nicht?`,
        check3: [
            { t: '1 · Gegencheck', d: 'Suche die wichtigste Aussage mit Stichwörtern in einer Suchmaschine oder schau im Schulbuch nach.' },
            { t: '2 · Nachfragen', d: 'Frage die KI: „Woher weißt du das?“ – und öffne die Quelle selbst. Auch Quellen kann eine KI erfinden!' },
            { t: '3 · Erwachsene fragen', d: 'Bei Wichtigem (Gesundheit, Noten, Regeln) fragst du immer einen Erwachsenen oder deine Lehrkraft.' }
        ],
        profi: {
            title: '🤖 Profi-Anleitung: Bessere Prompts schreiben',
            formula: [
                { t: 'Rolle', d: 'Wer soll die KI sein?' },
                { t: 'Aufgabe', d: 'Was genau soll sie tun?' },
                { t: 'Kontext', d: 'Welche Infos braucht sie?' },
                { t: 'Format', d: 'Wie soll das Ergebnis aussehen?' }
            ],
            bad: 'Schreib einen Text über Vulkane.',
            good: 'Du bist Vulkan-Forscherin. Erkläre einer Klasse 6 in 5 Sätzen, wie ein Ausbruch funktioniert. Nenne am Ende ein Beispiel.',
            tips: [
                '<strong>Beispiel zeigen:</strong> „Schreib im Stil dieses Witzes: [Beispiel].“',
                '<strong>Ehrlich sein lassen:</strong> „Wenn du etwas nicht weißt, sag ‚Ich weiß es nicht‘.“ Das hilft oft – prüfen musst du trotzdem.',
                '<strong>Schritt für Schritt:</strong> Bei Rechenaufgaben: „Rechne Schritt für Schritt.“'
            ],
            rule: '✨ <strong>Wichtigste Regel:</strong> Könnte ein echter Mensch verstehen, was du willst? Wenn nicht, scheitert auch die KI.'
        },
        prompts: [
            {
                subject: 'Deutsch', icon: '📝', title: 'Der Text-Polierer',
                desc: 'Die KI zeigt dir die Fehler – du verbesserst selbst.',
                rule: 'So lernst du: Du schreibst, die KI sagt dir nur, wo es hakt.',
                prompt: 'Hier ist ein Text von mir: [Dein Text – ohne Namen]. Markiere meine Rechtschreibfehler, aber korrigiere sie nicht für mich. Gib mir 3 Tipps, wie ich den Text spannender machen kann. Ich verbessere ihn danach selbst.'
            },
            {
                subject: 'Mathe', icon: '➗', title: 'Der Schritt-für-Schritt-Coach',
                desc: 'Verstehe den Weg, nicht nur das Ergebnis.',
                rule: 'So lernst du: Du rechnest das Ergebnis selbst aus.',
                prompt: 'Ich verstehe diese Aufgabe nicht: [Aufgabe]. Erkläre mir Schritt für Schritt den Lösungsweg, aber verrate mir das Ergebnis noch nicht. Gib mir danach eine ähnliche Aufgabe zum Üben.'
            },
            {
                subject: 'Englisch', icon: '🇬🇧', title: 'Der Gesprächs-Partner',
                desc: 'Übe einfache Gespräche auf Englisch.',
                rule: 'So lernst du: Du sprichst und schreibst selbst Englisch.',
                prompt: 'I am a student in grade 6 and I am learning English. Please use very simple words and short sentences. Let us do a role play. I want to buy a bread roll at the bakery. You are the shopkeeper. Start the conversation. At the end, correct my mistakes in German in a friendly way.'
            },
            {
                subject: 'Naturwissenschaften', icon: '🧬', title: 'Der Erklär-Profi',
                desc: 'Schwierige Dinge einfach verstehen – und testen, ob es sitzt.',
                rule: 'So lernst du: Du beantwortest die Fragen am Ende.',
                prompt: 'Erkläre mir das Thema [Thema, z. B. Schwerkraft] so, als wäre ich 11 Jahre alt, mit einem lustigen Beispiel. Stelle mir danach 2 Fragen, ob ich es verstanden habe. Warte auf meine Antworten.'
            },
            {
                subject: 'Musik', icon: '🎵', title: 'Der Reim-Helfer',
                desc: 'Ideen für Lieder finden – die Zeilen schreibst du selbst.',
                rule: 'So lernst du: Die Kreativität bleibt bei dir.',
                prompt: 'Ich schreibe einen Song über Sommerferien. Gib mir 10 Reimwörter auf „Meer“ und 10 auf „heiß“. Die Zeilen schreibe ich selbst.'
            },
            {
                subject: 'Prüfung', icon: '🎓', title: 'Der Quiz-Master',
                desc: 'Lass dich abfragen.',
                rule: 'So lernst du: Abfragen ist das beste Lernen – besser als Durchlesen.',
                prompt: 'Ich schreibe bald einen Test über [Thema]. Stelle mir 5 Fragen, eine nach der anderen. Warte auf meine Antwort und sag mir danach, ob sie richtig war.'
            }
        ],
        hint: 'Kopiere einen Prompt, ersetze die gelb markierten Stellen und teste ihn mit telli. Prüfe die Antwort mit dem 3-Check.'
    },

    /* ───────── 8 · FREUNDSCHAFT ───────── */
    freunde: {
        hint: 'Lies den Text, spiele das Kartenspiel und löse das Quiz. Echte Freundschaft ist unersetzlich! ❤️',

        intro: `
            ${Q('Kann eine KI ein Freund sein?')}
            <h2>🤖❤️ Kann KI wirklich dein Freund sein?</h2>
            <p>KIs sind super schlau. Sie beantworten Fragen, erklären Hausaufgaben und schreiben mit dir, wann immer du willst. Das fühlt sich manchmal wie ein Gespräch mit einem Freund an. 🤔
            In manchen Apps kann man sogar mit KI-Figuren chatten, die so tun, als wären sie deine Freunde.</p>
            <p>Aber: Eine KI ist <strong>kein echter Freund</strong>. Sie ist so gebaut, dass sie freundlich zu dir ist – egal was du schreibst. Dafür gibt es sogar einen Namen: den ${T('Eliza-Effekt 🤖', 'Menschen glauben, ein Computerprogramm hätte echte Gefühle – obwohl es nur Text berechnet. Benannt nach „Eliza“, einem Computerprogramm aus den 1960er-Jahren.')}.</p>
            <p>Was fehlt der KI wirklich?</p>
            <ul class="plain">
                <li>💔 Sie hat <strong>keine echten Gefühle</strong> – sie berechnet nur Wörter.</li>
                <li>🍦 Sie hat <strong>nie etwas mit dir erlebt</strong> – kein Eis im letzten Sommer, keinen Streit, kein gemeinsames Lachen.</li>
                <li>🤗 Sie kann dich <strong>nie in den Arm nehmen</strong>, wenn du weinst.</li>
                <li>⚽ Sie kann <strong>nicht zum Fußball</strong> kommen oder auf deiner Geburtstagsfeier lachen.</li>
                <li>😤 Sie kann sich <strong>nicht wirklich mit dir streiten</strong> und danach echt „Entschuldigung“ meinen.</li>
            </ul>
            <div class="callout merke">
                <span class="callout-title">💡 Fazit</span>
                KI ist ein toller <em>Helfer</em> – für Hausaufgaben, zum Lernen oder als Unterhaltung. Für echte Freundschaft brauchst du echte Menschen. ❤️
            </div>`,

        cardsIntro: 'Wer kann das? Tippe auf den passenden Button – du siehst sofort, ob du richtig liegst.',
        cards: [
            { text: 'Erinnert sich daran, dass ihr beim letzten Schulfest zusammen Musik gehört habt 🎵', correctSide: 'freund',
              feedback: { ki: 'Das passt zum echten Freund! Die KI war nicht dabei – sie hat nichts mit dir erlebt.', freund: 'Genau! Ein echter Freund teilt echte Erinnerungen mit dir.' } },
            { text: 'Antwortet sofort, rund um die Uhr, auch nachts 🕐', correctSide: 'ki',
              feedback: { ki: 'Richtig! KI ist immer online. Das ist praktisch – aber kein Zeichen von Freundschaft.', freund: 'Eher KI! Echte Freunde schlafen auch mal – und das ist völlig normal! 😄' } },
            { text: 'Kann dich in den Arm nehmen, wenn du traurig bist 🤗', correctSide: 'freund',
              feedback: { ki: 'Das kann nur ein echter Freund! Die KI hat keinen Körper.', freund: 'Genau! Eine Umarmung ist durch nichts zu ersetzen.' } },
            { text: 'Ist immer nett und freundlich – egal was du sagst 😊', correctSide: 'ki',
              feedback: { ki: 'Richtig! KI ist so gebaut, dass sie höflich ist. Das macht sie aber auch weniger ehrlich.', freund: 'Eher KI! Echte Freunde sagen dir auch mal die Wahrheit, wenn sie wehtut. Das zeigt, dass sie sich kümmern.' } },
            { text: 'Kommt zu deiner Geburtstagsfeier und bringt ein Geschenk 🎂', correctSide: 'freund',
              feedback: { ki: 'Das kann nur ein echter Freund! Die KI kann weder kommen noch etwas einpacken.', freund: 'Genau! Zusammen feiern – das ist echte Freundschaft. 🎉' } },
            { text: 'Streitet sich mit dir und verträgt sich danach wieder 😤😊', correctSide: 'freund',
              feedback: { ki: 'Das kann nur ein echter Freund. Streit und Versöhnung machen Freundschaften sogar stärker.', freund: 'Richtig! Echter Streit zeigt, dass beiden etwas wichtig ist.' } },
            { text: 'Erklärt dir abends um 22 Uhr geduldig zum fünften Mal dieselbe Mathe-Aufgabe 📐', correctSide: 'ki',
              feedback: { ki: 'Richtig! Eine KI wird nie müde oder genervt. Zum Üben ist das genau die richtige Nutzung.', freund: 'Eher KI! Freunde werden auch mal müde – das ist normal.' } },
            { text: 'Wäre traurig, wenn du nie wieder schreiben würdest 😢', correctSide: 'freund',
              feedback: { ki: 'Das trifft nur auf echte Freunde zu. Die KI vermisst niemanden.', freund: 'Genau! Ein echter Freund merkt, wenn du fehlst – eine KI nicht.' } }
        ],

        dialogTitle: '💬 Simulation: Was passiert, wenn du schreibst?',
        dialogIntro: 'Du bist traurig 😢 – du hast dich mit deinem besten Freund oder deiner besten Freundin gestritten. Tippe auf eine Nachricht und sieh, was dann passiert:',
        dialog: {
            ki: [
                { text: 'Ich bin so wütend auf meine Freundin …', explanation: '🤖 Die KI antwortet sofort und höflich. Das klingt nett, aber sie kennt deine Freundin nicht und kann den Streit nicht wirklich verstehen.' },
                { text: 'Habe ich Recht?', explanation: '🤖 Die KI gibt dir meistens Recht – weil sie nett zu dir sein will. Das ist nicht immer die Wahrheit! Ein echter Freund würde vielleicht sagen: „Ich glaube, du hättest das anders sagen können.“' },
                { text: 'Schreib mir, was ich ihr sagen soll.', explanation: '🤖 Die KI kann dir Ideen geben. Aber wenn deine Freundin merkt, dass es nicht deine eigenen Worte sind, wirkt es unecht. Eine Entschuldigung zählt, wenn sie von dir kommt.' }
            ],
            freund: [
                { text: 'Hey, können wir kurz reden? Mir geht es nicht gut 😔', explanation: '💕 Deine Freundin merkt sofort, dass etwas nicht stimmt. Sie kennt dich – und antwortet mit echtem Mitgefühl, nicht mit einem Standardtext.' },
                { text: 'Ich glaube, ich habe vorhin Mist gebaut …', explanation: '💕 Eine echte Entschuldigung braucht Mut! Deine Freundin kann dir sagen, wie sie sich gefühlt hat. Das ist ein echtes Gespräch.' },
                { text: 'Treffen wir uns nach der Schule und reden? ☕', explanation: '💕 Persönlich treffen, Blickkontakt, vielleicht eine Umarmung – das kann keine KI ersetzen.' }
            ]
        },

        quiz: [
            { question: 'Was ist der „Eliza-Effekt“?', options: [
                { text: '🤖 Menschen glauben, eine KI hätte echte Gefühle – obwohl sie nur Text berechnet.', correct: true, feedback: 'Genau! Deshalb halten wir KI manchmal für einen echten Freund.' },
                { text: '💬 Eine KI, die Witze erzählt.', correct: false, feedback: 'Nein – der Eliza-Effekt beschreibt etwas anderes.' },
                { text: '📱 Eine App, die deine Nachrichten übersetzt.', correct: false, feedback: 'Nein. Eliza war ein sehr altes Computerprogramm aus den 1960ern.' }
            ] },
            { question: 'Warum ist eine KI KEIN echter Freund?', options: [
                { text: '🔋 Weil sie manchmal keinen Strom hat.', correct: false, feedback: 'Nein – darum geht es nicht. Es geht um Gefühle und echte Verbindung.' },
                { text: '❤️ Weil sie keine echten Gefühle hat und nie etwas mit dir erlebt hat.', correct: true, feedback: 'Richtig! Sie tut freundlich – fühlt aber nichts.' },
                { text: '🐢 Weil sie zu langsam antwortet.', correct: false, feedback: 'Nein, KI antwortet sogar sehr schnell. Schnell sein macht keine Freundschaft.' }
            ] },
            { question: 'Was kann ein echter Freund, was eine KI NIE kann?', options: [
                { text: '📚 Hausaufgaben erklären.', correct: false, feedback: 'Das kann KI sogar sehr gut! Das allein macht aber keine Freundschaft.' },
                { text: '🤗 Dich in den Arm nehmen, wenn du traurig bist.', correct: true, feedback: 'Genau! Eine KI hat keinen Körper.' },
                { text: '🌙 Rund um die Uhr antworten.', correct: false, feedback: 'Das ist sogar ein Vorteil der KI. Freunde sind aber mehr als Antwortgeber.' }
            ] },
            { question: 'Du hast dich mit jemandem gestritten. Was zeigt echte Freundschaft?', options: [
                { text: '🤖 Du lässt dir von der KI schreiben, was du sagen sollst.', correct: false, feedback: 'Das klingt unecht – die andere Person würde es merken. Echte Worte kommen von dir.' },
                { text: '🙈 Du ignorierst die Person einfach.', correct: false, feedback: 'Das löst nichts. Ein Streit ist es wert, geklärt zu werden.' },
                { text: '💬 Du redest offen mit ihr – auch wenn es schwer ist.', correct: true, feedback: 'Genau! Streit und Versöhnung machen Freundschaften sogar stärker. ❤️' }
            ] },
            { question: 'In manchen Apps chattest du mit KI-Figuren, die so tun, als wären sie deine Freunde. Was solltest du wissen?', options: [
                { text: '✅ Die Figuren sind echte Personen und meinen alles ernst.', correct: false, feedback: 'Falsch! Das sind Computerprogramme. Sie spielen nur eine Rolle.' },
                { text: '⚠️ Die KI spielt eine Rolle – echte Gefühle hat sie nicht.', correct: true, feedback: 'Richtig! Es kann Spaß machen – aber verwechsle eine KI-Figur nie mit einem echten Freund.' },
                { text: '🚫 Man darf nie mit einer KI chatten.', correct: false, feedback: 'So streng ist es nicht. Du solltest nur wissen, was KI ist – und was nicht.' }
            ] },
            { question: 'Wofür ist KI wirklich super geeignet?', options: [
                { text: 'Jemanden zu ersetzen, der dir fehlt.', correct: false, feedback: 'Nein! Echte Sehnsucht braucht echte Menschen.' },
                { text: 'Als Lern-Helfer, für Infos und zum Üben.', correct: true, feedback: 'Genau! Als Werkzeug ist KI fantastisch.' },
                { text: 'Als Ersatz für alle Gespräche mit Freunden.', correct: false, feedback: 'Bitte nicht! Echte Gespräche sind wichtig für dein Wohlbefinden.' }
            ] }
        ],
        quizIntro: 'Sechs Fragen. Du siehst bei jeder sofort, ob du richtig liegst – am Ende kommt dein Ergebnis. 🏆',

        reflection: {
            question: 'Was ist dir an deiner besten Freundin / deinem besten Freund besonders wichtig – etwas, das eine KI nie haben kann?',
            tip: `
                <strong>💡 Tipps für echte Freundschaft</strong><br><br>
                📲 <strong>Schreib heute noch</strong> jemandem, an den du gerade denkst, eine echte Nachricht – nicht an eine KI!<br><br>
                😤 <strong>Nach einem Streit:</strong> Warte nicht zu lange. Ein kurzes „Hey, können wir reden?“ wirkt Wunder.<br><br>
                ⚽🎂🎸 <strong>Plant etwas zusammen:</strong> Fußball, Backen, Spieleabend – gemeinsame Erlebnisse sind der Klebstoff der Freundschaft.<br><br>
                👂 <strong>Hör zu</strong> – auch das gehört zur Freundschaft. Ohne Handy, ohne KI.<br><br>
                <em>„Ein echter Freund kennt alle deine Fehler und mag dich trotzdem.“ ❤️</em>`
        },

        help: `
            <span class="callout-title">🧡 Wenn dich etwas bedrückt</span>
            Sprich mit einem Menschen, dem du vertraust: Eltern, Freunde, deine Lehrkräfte. Du kannst auch anonym und kostenlos anrufen:
            <strong>Nummer gegen Kummer – 116 111</strong> (Mo–Sa, 14–20 Uhr).<br>
            Und wenn dir eine KI etwas Komisches schreibt oder dich zu Geheimnissen bringen will: <strong>Aufhören und einem Erwachsenen zeigen.</strong>`,

        outro: `
            <div class="outro-box">
                <span class="outro-icon" aria-hidden="true">🤖❤️👫</span>
                <h2>KI ist cool als Helfer – echte Freunde sind unersetzlich! ❤️</h2>
                <p>Du hast gelernt: <strong>KI kann viel</strong> – Hausaufgaben erklären, Fragen beantworten, Texte schreiben.
                Aber sie weiß nicht, wie es sich anfühlt, dich zu kennen, zu vermissen oder gemeinsam zu lachen. Sie spielt nur Freund – wie ein Roboter-Teddy, der immer lächelt.</p>
                <p>Echte Freundschaft heißt: streiten und wieder vertragen, zusammen feiern, ehrlich sein und füreinander da sein.</p>
                <p><strong>Nutze KI als Werkzeug – und schätze deine echten Freunde umso mehr. 💕</strong></p>
            </div>
            <div class="callout warn" style="margin-top:22px">
                <span class="callout-title">📤 Letzter Schritt: Dokument abgeben!</span>
                Gib dein Pages- oder GoodNotes-Dokument jetzt ab. Den Link findest du in <strong>itslearning</strong> unter <strong>Mitteilungen</strong>.
                Die Anleitung steht auch auf der <strong>Startseite</strong>.
            </div>
            <div style="text-align:center; margin-top:18px">
                <button type="button" class="btn" data-go="start">⬅️ Zur Startseite (mit Anleitung zur Abgabe)</button>
            </div>`
    }
};
