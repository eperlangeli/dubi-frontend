/**
 * DUBI Legal Content v4
 * Titolari: Enrico Perlangeli e Francesco Calabrese
 * Privacy: privacy@dubi.health | Support: support@dubi.health
 * Ultimo aggiornamento: Giugno 2026
 *
 * INTEGRAZIONE (Babel standalone, no Vite):
 *   <script src="dubi_legal.js"><\/script>
 *   window.DUBI_LEGAL.privacy.it
 *   window.DUBI_LEGAL.terms.en
 *   window.DUBI_LEGAL.health.it
 *   window.DUBI_LEGAL.consent.healthData.it
 *   window.DUBI_LEGAL.consent.wearable.it('WHOOP')
 *
 * Quando migrate a Vite: cambia l'IIFE in "export const LEGAL = {...}"
 */

(function () {
  window.DUBI_LEGAL = {

    // -------------------------------------------------------------------------
    // PRIVACY POLICY
    // -------------------------------------------------------------------------

    privacy: {
      lastUpdated: 'Giugno 2026 / June 2026',

      it: '<h2>Informativa sulla Privacy</h2>' +
        '<p><em>Ultimo aggiornamento: Giugno 2026 &mdash; v4</em></p>' +
        '<div class="legal-summary">' +
        '<h3>In breve &mdash; Riepilogo del trattamento</h3>' +
        '<table class="legal-summary-table">' +
        '<tr><td><strong>Chi tratta i tuoi dati?</strong></td>'
        + '<td>DUBI &mdash; <a href="https://dubi.health">dubi.health</a>'
        + ' &mdash; <a href="mailto:privacy@dubi.health">privacy@dubi.health</a>'
        + ' (identit&agrave; completa del titolare: &sect;1)</td></tr>' +
        '<tr><td><strong>Quali dati trattiamo?</strong></td>'
        + '<td>Dati account (nome, email); dati profilo e onboarding (et&agrave;, altezza, peso, obiettivi, allergie);'
        + ' dati sanitari (Art.&nbsp;9 GDPR &mdash; solo con consenso esplicito);'
        + ' dati wearable (solo se connessi dall&rsquo;utente);'
        + ' dati tecnici (indirizzo IP, tipo dispositivo, sistema operativo, versione del browser);'
        + ' conversazioni &ldquo;Chiedi a DUBI&rdquo; (non conservate sui server DUBI)</td></tr>' +
        '<tr><td><strong>Perch&eacute; trattiamo i tuoi dati?</strong></td>'
        + '<td>Fornitura del servizio (esecuzione contratto);'
        + ' dati sanitari (consenso esplicito Art.&nbsp;9.2.a GDPR);'
        + ' miglioramento servizio su aggregati anonimi (legittimo interesse);'
        + ' ricerca longitudinale pseudonimizzata su consenso separato e facoltativo (<em>research_consent</em>)</td></tr>' +
        '<tr><td><strong>Con chi li condividiamo?</strong></td>'
        + '<td>Fornitori tecnici (Supabase, Render, Resend, provider AI) nominati responsabili del trattamento'
        + ' ex Art.&nbsp;28 GDPR. I tuoi dati non vengono venduti n&eacute; comunicati a soggetti indeterminati.</td></tr>' +
        '<tr><td><strong>Per quanto li conserviamo?</strong></td>'
        + '<td>Di regola: fino alla cancellazione account + 24 mesi.'
        + ' Dati pseudonimizzati R&amp;D: fino a revoca <em>research_consent</em> + 30 giorni.'
        + ' Dati anonimi aggregati: indefinitamente (fuori scope GDPR, Considerando 26).'
        + ' Vedi &sect;5 per i dettagli per categoria.</td></tr>' +
        '<tr><td><strong>Quali sono i tuoi diritti?</strong></td>'
        + '<td>Accesso, rettifica, cancellazione, limitazione, portabilit&agrave;,'
        + ' opposizione, revoca del consenso &mdash; vedi &sect;6</td></tr>' +
        '<tr><td><strong>Come contattarci?</strong></td>'
        + '<td><a href="mailto:privacy@dubi.health">privacy@dubi.health</a>'
        + ' &mdash; risposta entro 1 mese (prorogabile a 3 mesi, Art.&nbsp;12.3 GDPR)</td></tr>' +
        '</table>' +
        '</div>' +


        '<h3>1. Titolari del Trattamento</h3>' +
        '<p><strong>Enrico Perlangeli e Francesco Calabrese</strong><br>' +
        'Email: <a href="mailto:privacy@dubi.health">privacy@dubi.health</a></p>' +

        '<h3>2. Quali dati raccogliamo</h3>' +
        '<p><strong>Dati identificativi e di account:</strong> nome, email. La password è conservata esclusivamente in forma di hash bcrypt &mdash; una funzione a senso unico che rende la password originale tecnicamente irrecuperabile anche per noi.</p>' +
        '<p><strong>Dati di profilo e onboarding:</strong> data di nascita, sesso biologico, altezza, peso, obiettivo nutrizionale, tipo di sport, frequenza e timing degli allenamenti, preferenze alimentari, tipo di dieta, allergie e intolleranze.</p>' +
        '<p><strong>Dati sanitari (Art. 9 GDPR):</strong> i dati relativi ad allergie, intolleranze, obiettivi fisici e preferenze alimentari sono considerati dati relativi alla salute ai sensi dell&rsquo;Art. 9 GDPR. Se connetti un dispositivo wearable: frequenza cardiaca, HRV, qualità del sonno, calorie attive, passi, score di recupero.</p>' +
        '<p><strong>Dati di utilizzo:</strong> pasti registrati, aderenza al piano, feedback NPS, log di accesso.</p>' +
        '<p><strong>Dati tecnici:</strong> indirizzo IP, tipo di dispositivo (smartphone/tablet/desktop), sistema operativo, versione del browser. Questi dati vengono registrati automaticamente dai nostri provider di infrastruttura (Supabase, Render) per garantire il corretto funzionamento e la sicurezza del servizio. Non raccogliamo dati di geolocalizzazione.</p>' +
        '<p><strong>Dati AI:</strong> se usi &ldquo;Chiedi a DUBI&rdquo;, il testo delle conversazioni è trasmesso a un provider AI terzo per generare la risposta. <strong>Lo storico non è conservato sui nostri server</strong>; può essere presente solo localmente sul tuo dispositivo (memoria del browser).</p>' +

        '<h3>3. Finalità e base giuridica</h3>' +
        '<ul>' +
        '<li>Gestione account &rarr; esecuzione del contratto (GDPR Art. 6.1.b | CCPA &sect;1798.100 | UAE PDPL Art. 4)</li>' +
        '<li>Generazione piano nutrizionale &rarr; esecuzione del contratto (GDPR Art. 6.1.b)</li>' +
        '<li>Adattamento piano con dati wearable &rarr; consenso esplicito (GDPR Art. 6.1.a + Art. 9.2.a | UAE PDPL Art. 6)</li>' +
        '<li>Dati sanitari &rarr; consenso esplicito (GDPR Art. 9.2.a | UAE PDPL Art. 6 | CCPA &sect;1798.121)</li>' +
        '<li>Sicurezza &rarr; legittimo interesse (GDPR Art. 6.1.f)</li>' +
        '<li>Ricerca e sviluppo (aggregati anonimi) &rarr; legittimo interesse (GDPR Art. 6.1.f + Considerando 26 &mdash; fuori scope GDPR | CCPA &sect;1798.145(a)(5))</li>' +
        '<li>Ricerca longitudinale su dati pseudonimizzati &rarr; consenso esplicito separato e facoltativo (<em>research_consent</em>, GDPR Art. 9.2.a) &mdash; opzionale, non condiziona l&rsquo;accesso al servizio</li>' +
        '</ul>' +
        '<p><strong>Non utilizziamo i tuoi dati personali per finalità pubblicitarie e non li vendiamo.</strong> Dati aggregati e anonimizzati &mdash; non riconducibili a nessun individuo &mdash; possono essere utilizzati a fini statistici e di ricerca interna.</p>' +

        '<h3>4. Provider terzi</h3>' +
        '<p>Ci avvaliamo dei seguenti fornitori, che trattano dati per nostro conto ai sensi dei rispettivi data processing terms ove disponibili. <strong>I tuoi dati non vengono venduti n&eacute; comunicati a soggetti indeterminati:</strong> la condivisione &egrave; limitata esclusivamente ai provider elencati di seguito, per le finalit&agrave; indicate.</p>' +
        '<ul>' +
        '<li><strong>Supabase Inc.</strong> (USA) &mdash; database e storage</li>' +
        '<li><strong>Render Inc.</strong> (USA) &mdash; hosting server backend</li>' +
        '<li><strong>Resend Inc.</strong> (USA) &mdash; invio email transazionali (conferma account, notifiche di servizio)</li>' +
        '<li><strong>Provider AI</strong> &mdash; elaborazione linguistica per &ldquo;Chiedi a DUBI&rdquo; (solo se attiva; il provider specifico è indicato nell&rsquo;informativa aggiornata)</li>' +
        '<li><strong>USDA FoodData Central</strong> (USA) &mdash; database nutrizionale pubblico, nessun dato personale</li>' +
        '<li><strong>WHOOP / Garmin / Strava</strong> &mdash; dati wearable (solo se connessi dall&rsquo;utente)</li>' +
        '</ul>' +
        '<p>DUBI usa autorizzazioni/token OAuth concessi dall&rsquo;utente tramite il provider ufficiale; DUBI non vede mai la password del tuo account wearable. I trasferimenti extra-UE avvengono tramite Clausole Contrattuali Standard ove applicabili.</p>' +

        '<h3>5. Conservazione</h3>' +
        '<ul>' +
        '<li><strong>Dati sanitari e biometrici:</strong> anonimizzati immediatamente su revoca del consenso</li>' +
        '<li>Dati di account (email, nome): fino alla cancellazione account + 24 mesi</li>' +
        '<li>Dati wearable: fino alla disconnessione + 30 giorni</li>' +
        '<li>Log di accesso: 90 giorni</li>' +
        '<li>Storico &ldquo;Chiedi a DUBI&rdquo;: non conservato sui server DUBI</li>' +
        '<li>Dati aderenza e feedback: fino alla cancellazione account</li>' +
        '<li>Dati di ricerca aggregati anonimi (<em>research_aggregates</em>): conservati indefinitamente &mdash; sono dati anonimi fuori scope GDPR (Considerando 26); nessun individuo è identificabile</li>' +
        '<li>Dati di ricerca pseudonimizzati (<em>research_data_snapshots</em>, <em>research_longitudinal</em>): conservati per la durata del <em>research_consent</em>; cancellati entro 30 giorni dalla revoca del consenso o dalla cancellazione dell&rsquo;account</li>' +
        '</ul>' +

        '<h3>6. I tuoi diritti</h3>' +
        '<p>Ai sensi del GDPR (Art. 15&ndash;22), CCPA e normative equivalenti, hai diritto a:</p>' +
        '<ul>' +
        '<li><strong>Accesso (Art. 15 GDPR)</strong> &mdash; richiedere copia di tutti i dati che conserviamo su di te</li>' +
        '<li><strong>Rettifica (Art. 16)</strong> &mdash; correggere dati inesatti o incompleti</li>' +
        '<li><strong>Cancellazione / diritto all&rsquo;oblio (Art. 17)</strong> &mdash; richiedere l&rsquo;eliminazione completa. <em>Eccezione (Art. 17.3.d GDPR)</em>: i dati pseudonimizzati trattati con <em>research_consent</em> possono essere conservati in forma ulteriormente anonimizzata per finalità di ricerca scientifica nei limiti strettamente necessari (Art. 89 GDPR); revocare il <em>research_consent</em> dalle impostazioni produce l&rsquo;eliminazione completa entro 30 giorni</li>' +
        '<li><strong>Limitazione (Art. 18)</strong> &mdash; sospendere il trattamento senza cancellare i dati</li>' +
        '<li><strong>Portabilità (Art. 20)</strong> &mdash; ricevere i tuoi dati in formato leggibile da macchina</li>' +
        '<li><strong>Opposizione (Art. 21)</strong> &mdash; opporti al trattamento basato su legittimo interesse</li>' +
        '<li><strong>Revoca del consenso (Art. 7.3)</strong> &mdash; ritirare il consenso in qualsiasi momento dalle impostazioni, senza effetto retroattivo</li>' +
        '<li><strong>Notifica di violazione dei dati (Art. 34 GDPR)</strong> &mdash; in caso di violazione dei tuoi dati personali che presenti un rischio elevato per i tuoi diritti, ti avviseremo senza ingiustificato ritardo. La notifica indicher&agrave;: la natura della violazione, le probabili conseguenze e le misure adottate o proposte per porvi rimedio</li>' +
        '<li><strong>Reclamo</strong> &mdash; presentare reclamo al Garante Privacy (<a href="https://www.garanteprivacy.it" target="_blank">garanteprivacy.it</a>) o all&rsquo;Autorità competente del tuo paese</li>' +
        '</ul>' +
        '<p>Scrivi a <a href="mailto:privacy@dubi.health">privacy@dubi.health</a>. Risponderemo entro <strong>1 mese</strong> dal ricevimento della richiesta (GDPR Art. 12.3). In caso di richieste complesse o numerose, il termine pu&ograve; essere prorogato di ulteriori 2 mesi (fino a 3 mesi complessivi); ti notificheremo la proroga e i relativi motivi entro il primo mese.</p>' +

        '<h3>7. Sicurezza</h3>' +
        '<ul>' +
        '<li>Password conservate esclusivamente come hash bcrypt (irrecuperabili)</li>' +
        '<li>Comunicazioni cifrate via HTTPS/TLS</li>' +
        '<li>Token di accesso wearable non esposti al frontend; ove conservati da DUBI saranno cifrati, altrimenti gestiti direttamente dal provider wearable</li>' +
        '<li>Database protetto tramite Row-Level Security (Supabase RLS)</li>' +
        '<li>Dati di ricerca pseudonimizzati tramite <strong>HMAC-SHA-256</strong> con salt separato (<em>RESEARCH_SALT</em>), conservato esclusivamente in variabile d&rsquo;ambiente sul server &mdash; mai nel database; la re-identificazione è tecnicamente impossibile senza il salt</li>' +
        '</ul>' +

        '<h3>8. Minori</h3>' +
        '<p>DUBI è accessibile a persone di almeno <strong>18 anni</strong>. I minori di 18 anni possono utilizzare DUBI esclusivamente con il consenso verificato di un genitore o tutore legale, fornito tramite conferma via email prima dell&rsquo;accesso al servizio. Questo risponde ai requisiti di GDPR Art. 8, UAE PDPL e COPPA (USA). Per segnalare account di minori privi di consenso: <a href="mailto:privacy@dubi.health">privacy@dubi.health</a>.</p>' +

        '<h3>9. Decisioni automatizzate</h3>' +
        '<p>Il piano nutrizionale è una <strong>raccomandazione algoritmica</strong>, non una decisione vincolante ai sensi dell&rsquo;Art. 22 GDPR. L&rsquo;utente è sempre libero di ignorarla o modificarla.</p>' +

        '<h3>10. Modifiche</h3>' +
        '<p>Notificheremo modifiche sostanziali almeno 14 giorni prima dell&rsquo;entrata in vigore.</p>',

      en: '<h2>Privacy Policy</h2>' +
        '<p><em>Last updated: June 2026 &mdash; v4</em></p>' +
        '<div class="legal-summary">' +
        '<h3>At a glance &mdash; Summary</h3>' +
        '<table class="legal-summary-table">' +
        '<tr><td><strong>Who processes your data?</strong></td>'
        + '<td>DUBI &mdash; <a href="https://dubi.health">dubi.health</a>'
        + ' &mdash; <a href="mailto:privacy@dubi.health">privacy@dubi.health</a>'
        + ' (full controller identity: &sect;1)</td></tr>' +
        '<tr><td><strong>What data do we process?</strong></td>'
        + '<td>Account data (name, email); profile and onboarding data (age, height, weight, goals, allergies);'
        + ' health data (GDPR Art.&nbsp;9 &mdash; explicit consent only);'
        + ' wearable data (only if connected by you);'
        + ' technical data (IP address, device type, OS, browser version);'
        + ' &ldquo;Ask DUBI&rdquo; conversations (not stored on DUBI servers)</td></tr>' +
        '<tr><td><strong>Why do we process your data?</strong></td>'
        + '<td>Service delivery (performance of contract);'
        + ' health data (explicit consent, GDPR Art.&nbsp;9.2.a);'
        + ' service improvement on anonymous aggregates (legitimate interest);'
        + ' pseudonymised longitudinal research under separate and optional consent (<em>research_consent</em>)</td></tr>' +
        '<tr><td><strong>Who do we share it with?</strong></td>'
        + '<td>Technical providers (Supabase, Render, Resend, AI provider) appointed as processors'
        + ' under GDPR Art.&nbsp;28. Your data is never sold or disclosed to unidentified third parties.</td></tr>' +
        '<tr><td><strong>How long do we keep it?</strong></td>'
        + '<td>As a rule: until account deletion + 24 months.'
        + ' Pseudonymised R&amp;D data: until <em>research_consent</em> withdrawal + 30 days.'
        + ' Anonymous aggregates: indefinitely (outside GDPR scope, Recital 26).'
        + ' See &sect;5 for per-category details.</td></tr>' +
        '<tr><td><strong>What are your rights?</strong></td>'
        + '<td>Access, rectification, erasure, restriction, portability,'
        + ' objection, consent withdrawal &mdash; see &sect;6</td></tr>' +
        '<tr><td><strong>How to contact us?</strong></td>'
        + '<td><a href="mailto:privacy@dubi.health">privacy@dubi.health</a>'
        + ' &mdash; response within 1 month (extendable to 3 months, GDPR Art.&nbsp;12.3)</td></tr>' +
        '</table>' +
        '</div>' +


        '<h3>1. Data Controllers</h3>' +
        '<p><strong>Enrico Perlangeli and Francesco Calabrese</strong><br>' +
        'Email: <a href="mailto:privacy@dubi.health">privacy@dubi.health</a></p>' +

        '<h3>2. What data we collect</h3>' +
        '<p><strong>Identity and account data:</strong> name, email. Passwords are stored exclusively as bcrypt hashes &mdash; a one-way function that makes the original password technically unrecoverable, including by us.</p>' +
        '<p><strong>Profile and onboarding data:</strong> date of birth, biological sex, height, weight, nutritional goal, sport type, training frequency and timing, dietary preferences, diet type, food allergies and intolerances.</p>' +
        '<p><strong>Health data (Art. 9 GDPR):</strong> data relating to allergies, intolerances, physical goals and dietary preferences are considered health-related data under GDPR Art. 9. If you connect a wearable: heart rate, HRV, sleep quality, active calories, steps, recovery scores.</p>' +
        '<p><strong>Usage data:</strong> logged meals, plan adherence, NPS feedback, access logs.</p>' +
        '<p><strong>Technical data:</strong> IP address, device type (smartphone/tablet/desktop), operating system, browser version. This data is automatically logged by our infrastructure providers (Supabase, Render) to ensure proper service operation and security. We do not collect geolocation data.</p>' +
        '<p><strong>AI data:</strong> if you use &ldquo;Ask DUBI&rdquo;, conversation text is transmitted to a third-party AI provider to generate a response. <strong>History is not stored on our servers</strong>; it may exist only locally on your device (browser storage).</p>' +

        '<h3>3. Purposes and legal basis</h3>' +
        '<ul>' +
        '<li>Account management &rarr; performance of contract (GDPR Art. 6.1.b | CCPA &sect;1798.100 | UAE PDPL Art. 4)</li>' +
        '<li>Nutritional plan generation &rarr; performance of contract (GDPR Art. 6.1.b)</li>' +
        '<li>Plan adaptation with wearable data &rarr; explicit consent (GDPR Art. 6.1.a + Art. 9.2.a | UAE PDPL Art. 6)</li>' +
        '<li>Health data &rarr; explicit consent (GDPR Art. 9.2.a | UAE PDPL Art. 6 | CCPA &sect;1798.121)</li>' +
        '<li>Security &rarr; legitimate interest (GDPR Art. 6.1.f)</li>' +
        '<li>Research &amp; development (anonymous aggregates) &rarr; legitimate interest (GDPR Art. 6.1.f + Recital 26 &mdash; outside GDPR scope | CCPA &sect;1798.145(a)(5))</li>' +
        '<li>Longitudinal research on pseudonymised data &rarr; separate and optional explicit consent (<em>research_consent</em>, GDPR Art. 9.2.a) &mdash; optional, does not condition access to the service</li>' +
        '</ul>' +
        '<p><strong>We do not use your personal data for advertising and we do not sell it.</strong> Aggregated and anonymised data &mdash; not attributable to any individual &mdash; may be used for statistical and internal research purposes.</p>' +

        '<h3>4. Third-party providers</h3>' +
        '<p>We use the following providers, who process data on our behalf subject to their respective data processing terms where available. <strong>Your data is never sold or disclosed to unidentified third parties:</strong> sharing is limited exclusively to the providers listed below, for the purposes indicated.</p>' +
        '<ul>' +
        '<li><strong>Supabase Inc.</strong> (USA) &mdash; database and storage</li>' +
        '<li><strong>Render Inc.</strong> (USA) &mdash; backend server hosting</li>' +
        '<li><strong>Resend Inc.</strong> (USA) &mdash; transactional email delivery (account confirmation, service notifications)</li>' +
        '<li><strong>AI provider</strong> &mdash; language processing for &ldquo;Ask DUBI&rdquo; (only if active; the specific provider is listed in the current version of this policy)</li>' +
        '<li><strong>USDA FoodData Central</strong> (USA) &mdash; public nutritional database, no personal data</li>' +
        '<li><strong>WHOOP / Garmin / Strava</strong> &mdash; wearable data (only if connected by user)</li>' +
        '</ul>' +
        '<p>DUBI uses OAuth authorisations/tokens granted by the user through the official wearable provider; DUBI never sees the user&rsquo;s wearable account password. International transfers take place via Standard Contractual Clauses where applicable.</p>' +

        '<h3>5. Retention</h3>' +
        '<ul>' +
        '<li><strong>Health and biometric data:</strong> anonymised immediately upon consent withdrawal</li>' +
        '<li>Account data (email, name): until account deletion + 24 months</li>' +
        '<li>Wearable data: until disconnection + 30 days</li>' +
        '<li>Access logs: 90 days</li>' +
        '<li>&ldquo;Ask DUBI&rdquo; history: not stored on DUBI servers</li>' +
        '<li>Adherence and feedback: until account deletion</li>' +
        '<li>Anonymous research aggregates (<em>research_aggregates</em>): retained indefinitely &mdash; these are anonymous data outside GDPR scope (Recital 26); no individual is identifiable</li>' +
        '<li>Pseudonymised research data (<em>research_data_snapshots</em>, <em>research_longitudinal</em>): retained for the duration of <em>research_consent</em>; deleted within 30 days of consent withdrawal or account deletion</li>' +
        '</ul>' +

        '<h3>6. Your rights</h3>' +
        '<p>Under GDPR (Art. 15&ndash;22), CCPA and equivalent laws, you have the right to:</p>' +
        '<ul>' +
        '<li><strong>Access (Art. 15 GDPR)</strong> &mdash; request a copy of all data we hold about you</li>' +
        '<li><strong>Rectification (Art. 16)</strong> &mdash; correct inaccurate or incomplete data</li>' +
        '<li><strong>Erasure / right to be forgotten (Art. 17)</strong> &mdash; request complete deletion. <em>Exception (Art. 17.3.d GDPR)</em>: pseudonymised data processed under <em>research_consent</em> may be retained in further anonymised form for scientific research purposes to the extent strictly necessary (Art. 89 GDPR); withdrawing <em>research_consent</em> from settings triggers full deletion within 30 days</li>' +
        '<li><strong>Restriction (Art. 18)</strong> &mdash; suspend processing without deleting data</li>' +
        '<li><strong>Portability (Art. 20)</strong> &mdash; receive your data in a machine-readable format</li>' +
        '<li><strong>Objection (Art. 21)</strong> &mdash; object to processing based on legitimate interest</li>' +
        '<li><strong>Withdrawal of consent (Art. 7.3)</strong> &mdash; withdraw consent at any time from settings, without retroactive effect</li>' +
        '<li><strong>Data breach notification (Art. 34 GDPR)</strong> &mdash; in the event of a personal data breach that poses a high risk to your rights, we will notify you without undue delay. The notification will include: the nature of the breach, its likely consequences, and the measures taken or proposed to address it</li>' +
        '<li><strong>Complaint</strong> &mdash; lodge a complaint with your supervisory authority (e.g. <a href="https://www.garanteprivacy.it" target="_blank">garanteprivacy.it</a> for Italy)</li>' +
        '</ul>' +
        '<p>Write to <a href="mailto:privacy@dubi.health">privacy@dubi.health</a>. We will respond within <strong>1 month</strong> of receiving your request (GDPR Art. 12.3). Where requests are complex or numerous, the deadline may be extended by a further 2 months (up to 3 months total); we will notify you of any such extension and the reasons within the first month.</p>' +

        '<h3>7. Security</h3>' +
        '<ul>' +
        '<li>Passwords stored exclusively as bcrypt hashes (unrecoverable)</li>' +
        '<li>HTTPS/TLS encryption for all communications</li>' +
        '<li>Wearable access tokens not exposed to the frontend; where stored by DUBI they will be encrypted, otherwise managed directly by the wearable provider</li>' +
        '<li>Database access protected via Row-Level Security (Supabase RLS)</li>' +
        '<li>Research data pseudonymised via <strong>HMAC-SHA-256</strong> with a separate salt (<em>RESEARCH_SALT</em>), stored exclusively as a server-side environment variable &mdash; never in the database; re-identification is technically impossible without the salt</li>' +
        '</ul>' +

        '<h3>8. Children and minors</h3>' +
        '<p>DUBI is accessible to persons aged at least <strong>18 years</strong>. Users under 18 may use DUBI exclusively with verified consent from a parent or legal guardian, provided via email confirmation before access is granted. This complies with GDPR Art. 8, UAE PDPL and COPPA (USA). To report a minor&rsquo;s account without parental consent: <a href="mailto:privacy@dubi.health">privacy@dubi.health</a>.</p>' +

        '<h3>9. Automated decision-making</h3>' +
        '<p>The nutritional plan is an <strong>algorithmic recommendation</strong>, not a binding decision under GDPR Art. 22. Users are always free to disregard or modify it.</p>' +

        '<h3>10. Changes</h3>' +
        '<p>We will notify you of material changes at least 14 days before they take effect.</p>',
    },

    // -------------------------------------------------------------------------
    // TERMS OF SERVICE
    // -------------------------------------------------------------------------

    terms: {
      lastUpdated: 'Giugno 2026 / June 2026',

      it: '<h2>Termini di Servizio</h2>' +
        '<p><em>Ultimo aggiornamento: Giugno 2026</em></p>' +

        '<h3>1. Accettazione</h3>' +
        '<p>Utilizzando DUBI accetti i presenti Termini nella loro interezza. DUBI è riservato a persone di almeno <strong>18 anni</strong>.</p>' +

        '<h3>2. Descrizione del Servizio</h3>' +
        '<p>DUBI è un’applicazione di nutrizione personalizzata attualmente in <strong>fase beta gratuita</strong>. <strong>Non è un servizio medico.</strong> I piani nutrizionali sono suggerimenti algoritmici, non prescrizioni.</p>' +

        '<h3>3. Responsabilità dell’Utente</h3>' +
        '<ul>' +
        '<li>Sei responsabile della riservatezza delle tue credenziali.</li>' +
        '<li>Non puoi cedere o condividere il tuo account.</li>' +
        '<li>Devi fornire informazioni accurate durante l’onboarding.</li>' +
        '</ul>' +

        '<h3>4. Uso Accettabile</h3>' +
        '<p>Non puoi usare DUBI per violare leggi, accedere a dati altrui, effettuare reverse engineering, trasmettere malware o per finalità commerciali non autorizzate.</p>' +

        '<h3>5. Proprietà Intellettuale</h3>' +
        '<p>DUBI e i suoi contenuti originali sono di proprietà di Enrico Perlangeli e Francesco Calabrese. I tuoi dati personali rimangono tuoi.</p>' +

        '<h3>6. Limitazione di Responsabilità</h3>' +
        '<p>DUBI è fornito “così com’è” durante la beta. Non garantiamo disponibilità continuativa né assenza di errori. Non siamo responsabili per decisioni sanitarie basate sui piani generati. Consulta sempre un professionista qualificato.</p>' +

        '<h3>7. Servizi Terzi</h3>' +
        '<p>Connettendo un wearable accetti anche i termini del relativo provider. Non siamo responsabili per il loro comportamento.</p>' +

        '<h3>8. Modifiche e Cancellazione</h3>' +
        '<p>Possiamo modificare o sospendere il servizio con preavviso. Puoi cancellare il tuo account in qualsiasi momento dalle impostazioni.</p>' +

        '<h3>9. Legge Applicabile</h3>' +
        '<p>Legge italiana. Foro del consumatore o, in alternativa, Milano.</p>' +
        '<p>Contatti: <a href="mailto:privacy@dubi.health">privacy@dubi.health</a> | <a href="mailto:support@dubi.health">support@dubi.health</a></p>',

      en: '<h2>Terms of Service</h2>' +
        '<p><em>Last updated: June 2026</em></p>' +

        '<h3>1. Acceptance</h3>' +
        '<p>By using DUBI you agree to these Terms in their entirety. DUBI is exclusively for persons aged at least <strong>18 years</strong>.</p>' +

        '<h3>2. Description of Service</h3>' +
        '<p>DUBI is a personalised nutrition app currently in <strong>free beta</strong>. <strong>It is not a medical service.</strong> Nutritional plans are algorithmic suggestions, not prescriptions.</p>' +

        '<h3>3. User Responsibilities</h3>' +
        '<ul>' +
        '<li>You are responsible for keeping your credentials confidential.</li>' +
        '<li>You may not transfer or share your account.</li>' +
        '<li>You must provide accurate information during onboarding.</li>' +
        '</ul>' +

        '<h3>4. Acceptable Use</h3>' +
        '<p>You may not use DUBI to violate laws, access others’ data, reverse-engineer the app, transmit malware or for unauthorised commercial purposes.</p>' +

        '<h3>5. Intellectual Property</h3>' +
        '<p>DUBI and its original content are the property of Enrico Perlangeli and Francesco Calabrese. Your personal data remains yours.</p>' +

        '<h3>6. Limitation of Liability</h3>' +
        '<p>DUBI is provided “as is” during beta. We do not guarantee continuous availability or absence of errors. We are not liable for health decisions based on generated plans. Always consult a qualified professional.</p>' +

        '<h3>7. Third-Party Services</h3>' +
        '<p>By connecting a wearable you also agree to the relevant provider’s terms. We are not responsible for their behaviour.</p>' +

        '<h3>8. Changes and Deletion</h3>' +
        '<p>We may modify or suspend the service with notice. You may delete your account at any time from settings.</p>' +

        '<h3>9. Governing Law</h3>' +
        '<p>Italian law. Consumer’s court of residence or, alternatively, Milan.</p>' +
        '<p>Contact: <a href="mailto:privacy@dubi.health">privacy@dubi.health</a> | <a href="mailto:support@dubi.health">support@dubi.health</a></p>',
    },

    // -------------------------------------------------------------------------
    // HEALTH DISCLAIMER
    // -------------------------------------------------------------------------

    health: {
      lastUpdated: 'Giugno 2026 / June 2026',

      it: '<h2>Disclaimer Sanitario</h2>' +
        '<p><strong>DUBI non è un dispositivo medico. DUBI non è un servizio medico.</strong></p>' +
        '<p>I piani nutrizionali e le raccomandazioni alimentari di DUBI sono generati da algoritmi a scopo <strong>informativo e di supporto personale</strong>. Non costituiscono diagnosi medica, prescrizione nutrizionale o trattamento terapeutico.</p>' +
        '<p><strong>Consulta sempre un medico o un nutrizionista qualificato prima di apportare cambiamenti significativi alla tua alimentazione</strong>, in particolare se:</p>' +
        '<ul>' +
        '<li>Sei affetto da diabete, malattie cardiovascolari, renali o altre condizioni croniche</li>' +
        '<li>Stai seguendo terapie farmacologiche che possono interagire con la dieta</li>' +
        '<li>Sei in gravidanza o stai allattando</li>' +
        '<li>Hai una storia di disturbi alimentari</li>' +
        '<li>Hai subito un intervento chirurgico di recente</li>' +
        '</ul>' +
        '<p>I dati wearable (frequenza cardiaca, HRV, sonno, calorie) sono <strong>indicatori di fitness</strong>, non strumenti diagnostici clinici.</p>' +
        '<p>&ldquo;Chiedi a DUBI&rdquo; è una funzione di supporto nutrizionale generale. Le risposte AI <strong>non costituiscono consulenza medica</strong>.</p>' +
        '<p>DUBI declina ogni responsabilità per danni alla salute derivanti dall’uso delle informazioni fornite in sostituzione di un consulto professionale.</p>',

      en: '<h2>Health Disclaimer</h2>' +
        '<p><strong>DUBI is not a medical device. DUBI is not a medical service.</strong></p>' +
        '<p>DUBI’s nutritional plans and dietary recommendations are generated by algorithms for <strong>informational and personal support purposes only</strong>. They do not constitute medical diagnosis, nutritional prescription or therapeutic treatment.</p>' +
        '<p><strong>Always consult a doctor or qualified nutritionist before making significant changes to your diet</strong>, particularly if:</p>' +
        '<ul>' +
        '<li>You have diabetes, cardiovascular disease, kidney disease or other chronic conditions</li>' +
        '<li>You are taking medications that may interact with diet</li>' +
        '<li>You are pregnant or breastfeeding</li>' +
        '<li>You have a history of eating disorders</li>' +
        '<li>You have recently undergone surgery</li>' +
        '</ul>' +
        '<p>Wearable data (heart rate, HRV, sleep, calories) are <strong>fitness indicators</strong>, not clinical diagnostic tools.</p>' +
        '<p>&ldquo;Ask DUBI&rdquo; is a general nutritional support feature. AI responses <strong>do not constitute medical advice</strong>.</p>' +
        '<p>DUBI disclaims all liability for health damages resulting from using the information provided as a substitute for professional medical advice.</p>',
    },

    // -------------------------------------------------------------------------
    // CONSENT STRINGS (per onboarding e connessione wearable)
    // -------------------------------------------------------------------------

    consent: {
      // Consenso Art. 9 GDPR: da mostrare PRIMA di raccogliere allergie/obiettivi
      healthData: {
        it: 'Acconsento al trattamento dei miei dati relativi alla salute (allergie, intolleranze, obiettivi fisici) per la personalizzazione del piano nutrizionale DUBI, ai sensi dell’Art. 9.2.a GDPR. Posso revocare il consenso in qualsiasi momento dalle impostazioni.',
        en: 'I consent to the processing of my health-related data (allergies, intolerances, physical goals) for personalisation of my DUBI nutritional plan (Art. 9.2.a GDPR). I can withdraw consent at any time from settings.',
      },
      // Consenso contestuale wearable: da mostrare al momento della connessione
      wearable: {
        it: function (provider) {
          return 'Connettendo ' + provider + ' autorizzi DUBI a leggere i tuoi dati di attività fisica e sonno tramite token OAuth, senza accedere alla tua password. Puoi disconnettere il dispositivo in qualsiasi momento dalle impostazioni.';
        },
        en: function (provider) {
          return 'By connecting ' + provider + ' you authorise DUBI to read your physical activity and sleep data via OAuth token, without accessing your password. You can disconnect at any time from settings.';
        },
      },
      // Accettazione Termini + Privacy: checkbox obbligatoria al primo login
      terms: {
        it: 'Ho letto e accetto i Termini di Servizio e l’Informativa sulla Privacy di DUBI.',
        en: 'I have read and accept DUBI’s Terms of Service and Privacy Policy.',
      },
    },

  };
})();
