/**
 * DUBI Legal Content v3
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
        '<p><em>Ultimo aggiornamento: Giugno 2026</em></p>' +

        '<h3>1. Titolari del Trattamento</h3>' +
        '<p><strong>Enrico Perlangeli e Francesco Calabrese</strong><br>' +
        'Email: <a href="mailto:privacy@dubi.health">privacy@dubi.health</a></p>' +

        '<h3>2. Quali dati raccogliamo</h3>' +
        '<p><strong>Dati identificativi e di account:</strong> nome, email, password (in forma hash &mdash; non accessibile a noi).</p>' +
        '<p><strong>Dati di profilo e onboarding:</strong> data di nascita, sesso biologico, altezza, peso, obiettivo nutrizionale, tipo di sport, frequenza e timing degli allenamenti, preferenze alimentari, tipo di dieta, allergie e intolleranze.</p>' +
        '<p><strong>Dati sanitari (Art. 9 GDPR):</strong> i dati relativi ad allergie, intolleranze, obiettivi fisici e preferenze alimentari sono considerati dati relativi alla salute. Se connetti un dispositivo wearable: frequenza cardiaca, HRV, qualità del sonno, calorie attive, passi, score di recupero.</p>' +
        '<p><strong>Dati di utilizzo:</strong> pasti registrati, aderenza al piano, feedback NPS, log di accesso.</p>' +
        '<p><strong>Dati AI:</strong> se usi &ldquo;Chiedi a DUBI&rdquo;, il testo delle conversazioni è trasmesso a OpenAI per generare la risposta. <strong>Lo storico non è conservato sui nostri server</strong>; può essere presente solo localmente sul tuo dispositivo (memoria del browser) e non è accessibile ai nostri server.</p>' +

        '<h3>3. Finalità e base giuridica</h3>' +
        '<ul>' +
        '<li>Gestione account &rarr; esecuzione del contratto (Art. 6.1.b)</li>' +
        '<li>Generazione piano nutrizionale &rarr; esecuzione del contratto (Art. 6.1.b)</li>' +
        '<li>Adattamento piano con dati wearable &rarr; consenso esplicito (Art. 6.1.a + Art. 9.2.a)</li>' +
        '<li>Dati sanitari &rarr; consenso esplicito (Art. 9.2.a)</li>' +
        '<li>Sicurezza &rarr; legittimo interesse (Art. 6.1.f)</li>' +
        '</ul>' +
        '<p><strong>Non utilizziamo i tuoi dati per finalità pubblicitarie. Non vendiamo i tuoi dati.</strong></p>' +

        '<h3>4. Provider terzi</h3>' +
        '<p>Ci avvaliamo dei seguenti fornitori, che trattano dati per nostro conto ai sensi dei rispettivi data processing terms ove disponibili:</p>' +
        '<ul>' +
        '<li><strong>Supabase Inc.</strong> (USA) &mdash; database e storage</li>' +
        '<li><strong>Render Inc.</strong> (USA) &mdash; hosting server backend</li>' +
        '<li><strong>OpenAI LLC</strong> (USA) &mdash; AI per &ldquo;Chiedi a DUBI&rdquo; (solo se attiva)</li>' +
        '<li><strong>USDA FoodData Central</strong> (USA) &mdash; database nutrizionale pubblico, nessun dato personale</li>' +
        '<li><strong>WHOOP / Garmin / Strava</strong> &mdash; dati wearable (solo se connessi dall&rsquo;utente)</li>' +
        '</ul>' +
        '<p>DUBI usa autorizzazioni/token OAuth concessi dall&rsquo;utente tramite il provider ufficiale; DUBI non vede mai la password del tuo account wearable. I trasferimenti extra-UE avvengono tramite Clausole Contrattuali Standard ove applicabili.</p>' +

        '<h3>5. Conservazione</h3>' +
        '<ul>' +
        '<li>Dati account e profilo: fino alla cancellazione + 30 giorni</li>' +
        '<li>Dati wearable: fino alla disconnessione + 30 giorni</li>' +
        '<li>Log di accesso: 90 giorni</li>' +
        '<li>Storico &ldquo;Chiedi a DUBI&rdquo;: non conservato sui server DUBI</li>' +
        '<li>Dati aderenza e feedback: fino alla cancellazione</li>' +
        '</ul>' +

        '<h3>6. I tuoi diritti (Art. 15&ndash;22 GDPR)</h3>' +
        '<p>Hai diritto di accesso, rettifica, cancellazione, portabilità, opposizione, revoca del consenso e reclamo al Garante (<a href="https://www.garanteprivacy.it" target="_blank">garanteprivacy.it</a>).<br>' +
        'Scrivi a <a href="mailto:privacy@dubi.health">privacy@dubi.health</a> &mdash; risponderemo entro 30 giorni.</p>' +

        '<h3>7. Sicurezza</h3>' +
        '<ul>' +
        '<li>Password in hash bcrypt</li>' +
        '<li>Comunicazioni cifrate via HTTPS/TLS</li>' +
        '<li>Token di accesso wearable non esposti al frontend; ove conservati da DUBI saranno cifrati, altrimenti gestiti dal provider wearable</li>' +
        '<li>Database protetto tramite Row-Level Security (Supabase RLS)</li>' +
        '</ul>' +

        '<h3>8. Minori</h3>' +
        '<p>DUBI è riservato a persone di almeno <strong>18 anni</strong>. Per segnalare account di minori: <a href="mailto:privacy@dubi.health">privacy@dubi.health</a>.</p>' +

        '<h3>9. Decisioni automatizzate</h3>' +
        '<p>Il piano nutrizionale è una <strong>raccomandazione</strong>, non una decisione vincolante (Art. 22 GDPR).</p>' +

        '<h3>10. Modifiche</h3>' +
        '<p>Notificheremo modifiche sostanziali almeno 14 giorni prima dell&rsquo;entrata in vigore.</p>',

      en: '<h2>Privacy Policy</h2>' +
        '<p><em>Last updated: June 2026</em></p>' +

        '<h3>1. Data Controllers</h3>' +
        '<p><strong>Enrico Perlangeli and Francesco Calabrese</strong><br>' +
        'Email: <a href="mailto:privacy@dubi.health">privacy@dubi.health</a></p>' +

        '<h3>2. What data we collect</h3>' +
        '<p><strong>Identity and account data:</strong> name, email, password (stored as a hash &mdash; inaccessible to us).</p>' +
        '<p><strong>Profile and onboarding data:</strong> date of birth, biological sex, height, weight, nutritional goal, sport type, training frequency and timing, dietary preferences, diet type, food allergies and intolerances.</p>' +
        '<p><strong>Health data (Art. 9 GDPR):</strong> data relating to allergies, intolerances, physical goals and dietary preferences are considered health-related. If you connect a wearable: heart rate, HRV, sleep quality, active calories, steps, recovery scores.</p>' +
        '<p><strong>Usage data:</strong> logged meals, plan adherence, NPS feedback, access logs.</p>' +
        '<p><strong>AI data:</strong> if you use &ldquo;Ask DUBI&rdquo;, conversation text is transmitted to OpenAI to generate a response. <strong>History is not stored on our servers</strong>; it may exist only locally on your device (browser storage) and is not accessible to our servers.</p>' +

        '<h3>3. Purposes and legal basis</h3>' +
        '<ul>' +
        '<li>Account management &rarr; performance of contract (Art. 6.1.b)</li>' +
        '<li>Nutritional plan generation &rarr; performance of contract (Art. 6.1.b)</li>' +
        '<li>Plan adaptation with wearable data &rarr; explicit consent (Art. 6.1.a + Art. 9.2.a)</li>' +
        '<li>Health data &rarr; explicit consent (Art. 9.2.a)</li>' +
        '<li>Security &rarr; legitimate interest (Art. 6.1.f)</li>' +
        '</ul>' +
        '<p><strong>We do not use your data for advertising. We do not sell your data.</strong></p>' +

        '<h3>4. Third-party providers</h3>' +
        '<p>We use the following providers, who process data on our behalf subject to their respective data processing terms where available:</p>' +
        '<ul>' +
        '<li><strong>Supabase Inc.</strong> (USA) &mdash; database and storage</li>' +
        '<li><strong>Render Inc.</strong> (USA) &mdash; backend server hosting</li>' +
        '<li><strong>OpenAI LLC</strong> (USA) &mdash; AI for &ldquo;Ask DUBI&rdquo; (only if active)</li>' +
        '<li><strong>USDA FoodData Central</strong> (USA) &mdash; public nutritional database, no personal data</li>' +
        '<li><strong>WHOOP / Garmin / Strava</strong> &mdash; wearable data (only if connected by user)</li>' +
        '</ul>' +
        '<p>DUBI uses OAuth authorisations/tokens granted by the user through the official wearable provider; DUBI never sees the user&rsquo;s wearable account password. International transfers take place via Standard Contractual Clauses where applicable.</p>' +

        '<h3>5. Retention</h3>' +
        '<ul>' +
        '<li>Account and profile data: until deletion + 30 days</li>' +
        '<li>Wearable data: until disconnection + 30 days</li>' +
        '<li>Access logs: 90 days</li>' +
        '<li>&ldquo;Ask DUBI&rdquo; history: not stored on DUBI servers</li>' +
        '<li>Adherence and feedback: until account deletion</li>' +
        '</ul>' +

        '<h3>6. Your rights (Art. 15&ndash;22 GDPR)</h3>' +
        '<p>You have the right to access, rectification, erasure, portability, objection, withdrawal of consent and complaint to your DPA.<br>' +
        'Write to <a href="mailto:privacy@dubi.health">privacy@dubi.health</a> &mdash; we will respond within 30 days.</p>' +

        '<h3>7. Security</h3>' +
        '<ul>' +
        '<li>Passwords stored as bcrypt hashes</li>' +
        '<li>HTTPS/TLS encryption for all communications</li>' +
        '<li>Wearable access tokens not exposed to the frontend; where stored by DUBI they will be encrypted, otherwise managed by the wearable provider</li>' +
        '<li>Database access protected via Row-Level Security (Supabase RLS)</li>' +
        '</ul>' +

        '<h3>8. Children</h3>' +
        '<p>DUBI is exclusively for persons aged at least <strong>18 years</strong>. To report a minor&rsquo;s account: <a href="mailto:privacy@dubi.health">privacy@dubi.health</a>.</p>' +

        '<h3>9. Automated decision-making</h3>' +
        '<p>The nutritional plan is a <strong>recommendation</strong>, not a binding decision (Art. 22 GDPR).</p>' +

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
