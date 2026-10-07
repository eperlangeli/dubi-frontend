// D-041 (2), D-042 (2), D-043 (2, 3, 5): composizione corporea. La regola vive nel backend
// (config/body-composition-rules.js); qui solo testi e formattazione.
// Testi IT/EN approvati da Francesco Calabrese — 7 ottobre 2026. Eccezioni della Regia, da approvare:
// "expired", "formTitle/formValue/formMethod/formDate/formSave", "sourceLabel/dateLabel/rangeLabel", "deurenberg", "methods".
// fr, es, de, ar, pt, zh, ja, ru: tradotte dall'inglese approvato senza attenuare le cautele; in attesa di QA linguistico.

export const BODY_COMPOSITION_CODES = Object.freeze({
  caution: "BODY_FAT_ESTIMATE_CAUTION",
  surplusNotRecommended: "MASS_SURPLUS_NOT_RECOMMENDED",
  dataRequired: "BODY_COMPOSITION_DATA_REQUIRED",
  dataConflict: "BODY_COMPOSITION_DATA_CONFLICT",
  expired: "BODY_COMPOSITION_MEASUREMENT_EXPIRED",
  lowCaution: "LOW_BODY_FAT_ESTIMATE_CAUTION",
  lowBlock: "LOW_BODY_FAT_CONFIRMED_BLOCK",
});

export const BODY_FAT_METHODS = Object.freeze([
  "DEXA_OR_CLINICAL",
  "SKINFOLD_OR_BIA_PROFESSIONAL",
  "CIRCUMFERENCES_VALIDATED",
  "SCALE_OR_WEARABLE",
]);

const COPY = {
  "it": {
    "title": "Prima di impostare un surplus, controlliamo la composizione corporea.",
    "measured": "La percentuale di grasso indicata è {x}%. In questa situazione un surplus calorico potrebbe aumentare soprattutto la massa grassa. DUBI non avvia la fase massa e propone un percorso di ricomposizione a mantenimento.",
    "estimate": "DUBI stima una percentuale di grasso di circa {x}%, con un intervallo indicativo di {y}–{z}%. È una stima basata su BMI, età e sesso, non una misurazione diretta.",
    "toRecomposition": "Passa a ricomposizione",
    "updateMeasurement": "Aggiorna la misurazione",
    "formTitle": "Misurazione della composizione corporea",
    "formValue": "Percentuale di grasso (%)",
    "formMethod": "Come è stata misurata",
    "formDate": "Data della misurazione",
    "formSave": "Salva misurazione",
    "sourceLabel": "Origine del dato",
    "dateLabel": "Data",
    "rangeLabel": "Intervallo",
    "deurenberg": "Stima da BMI, età e sesso (Deurenberg)",
    "methods": {
      "DEXA_OR_CLINICAL": "DEXA o valutazione clinica",
      "SKINFOLD_OR_BIA_PROFESSIONAL": "Plicometria o impedenziometria (BIA) da un professionista",
      "CIRCUMFERENCES_VALIDATED": "Circonferenze complete con metodo validato",
      "SCALE_OR_WEARABLE": "Bilancia o dispositivo indossabile"
    },
    "scaleEstimate": "La bilancia o il wearable stima il tuo grasso corporeo al {x}%. Questo valore può variare in base a idratazione, orario e dispositivo: lo consideriamo una stima, non una misurazione clinica.",
    "conflict": "I dati sulla composizione corporea non sono coerenti tra loro. Prima di applicare un surplus calorico, aggiorna la misurazione o inserisci un dato ottenuto con un metodo più affidabile.",
    "needTwoReadings": "Misura ogni circonferenza due volte, nelle stesse condizioni, senza stringere il metro. DUBI utilizzerà la media delle due misurazioni.",
    "estimateTag": "Stima indicativa, non misurazione clinica.",
    "lowBodyFat": "Il valore indicato è molto basso. Per la tua sicurezza DUBI non può creare automaticamente un piano di dimagrimento o definizione. Ti consigliamo di verificare la composizione corporea con un professionista.",
    "expired": "La misurazione salvata non è più valida (data, variazione di peso o evento clinico). Aggiornala per continuare a usarla."
  },
  "en": {
    "title": "Before starting a calorie surplus, let’s check your body composition.",
    "measured": "Your reported body-fat percentage is {x}%. In this situation, a calorie surplus could primarily increase fat mass. DUBI will not start a mass-gain phase and recommends maintenance-based body recomposition.",
    "estimate": "DUBI estimates your body-fat percentage at approximately {x}%, with an indicative range of {y}–{z}%. This is based on BMI, age and sex and is not a direct measurement.",
    "toRecomposition": "Switch to body recomposition",
    "updateMeasurement": "Update measurement",
    "formTitle": "Body composition measurement",
    "formValue": "Body-fat percentage (%)",
    "formMethod": "How it was measured",
    "formDate": "Measurement date",
    "formSave": "Save measurement",
    "sourceLabel": "Data source",
    "dateLabel": "Date",
    "rangeLabel": "Range",
    "deurenberg": "Estimate from BMI, age and sex (Deurenberg)",
    "methods": {
      "DEXA_OR_CLINICAL": "DEXA or clinical assessment",
      "SKINFOLD_OR_BIA_PROFESSIONAL": "Skinfolds or bioimpedance (BIA) by a professional",
      "CIRCUMFERENCES_VALIDATED": "Full circumference set with a validated method",
      "SCALE_OR_WEARABLE": "Smart scale or wearable"
    },
    "scaleEstimate": "Your scale or wearable estimates your body fat at {x}%. This value can vary with hydration, timing and device, so DUBI treats it as an estimate rather than a clinical measurement.",
    "conflict": "Your body-composition data are not consistent. Before applying a calorie surplus, update the measurement or enter a value obtained with a more reliable method.",
    "needTwoReadings": "Measure each circumference twice under the same conditions, without tightening the tape. DUBI will use the average of the two measurements.",
    "estimateTag": "Indicative estimate, not a clinical measurement.",
    "lowBodyFat": "The reported value is very low. For your safety, DUBI cannot automatically create a fat-loss or definition plan. We recommend verifying your body composition with a qualified professional.",
    "expired": "Your saved measurement is no longer valid (date, weight change or clinical event). Please update it to keep using it."
  },
  "fr": {
    "title": "Avant de commencer un surplus calorique, vérifions ta composition corporelle.",
    "measured": "Le pourcentage de masse grasse indiqué est de {x} %. Dans cette situation, un surplus calorique pourrait surtout augmenter la masse grasse. DUBI ne lance pas la phase de prise de masse et propose une recomposition corporelle au maintien.",
    "estimate": "DUBI estime ton pourcentage de masse grasse à environ {x} %, avec un intervalle indicatif de {y}–{z} %. C'est une estimation fondée sur l'IMC, l'âge et le sexe, pas une mesure directe.",
    "toRecomposition": "Passer à la recomposition",
    "updateMeasurement": "Mettre à jour la mesure",
    "formTitle": "Mesure de la composition corporelle",
    "formValue": "Pourcentage de masse grasse (%)",
    "formMethod": "Méthode de mesure",
    "formDate": "Date de la mesure",
    "formSave": "Enregistrer la mesure",
    "sourceLabel": "Origine de la donnée",
    "dateLabel": "Date",
    "rangeLabel": "Intervalle",
    "deurenberg": "Estimation à partir de l'IMC, de l'âge et du sexe (Deurenberg)",
    "methods": {
      "DEXA_OR_CLINICAL": "DEXA ou évaluation clinique",
      "SKINFOLD_OR_BIA_PROFESSIONAL": "Plis cutanés ou bio-impédance (BIA) par un professionnel",
      "CIRCUMFERENCES_VALIDATED": "Circonférences complètes avec une méthode validée",
      "SCALE_OR_WEARABLE": "Balance connectée ou objet connecté"
    },
    "scaleEstimate": "Ta balance ou ton objet connecté estime ta masse grasse à {x} %. Cette valeur peut varier selon l'hydratation, l'heure et l'appareil : DUBI la considère comme une estimation et non comme une mesure clinique.",
    "conflict": "Tes données de composition corporelle ne sont pas cohérentes entre elles. Avant d'appliquer un surplus calorique, mets à jour la mesure ou saisis une valeur obtenue avec une méthode plus fiable.",
    "needTwoReadings": "Mesure chaque circonférence deux fois, dans les mêmes conditions, sans serrer le mètre ruban. DUBI utilisera la moyenne des deux mesures.",
    "estimateTag": "Estimation indicative, pas une mesure clinique.",
    "lowBodyFat": "La valeur indiquée est très basse. Pour ta sécurité, DUBI ne peut pas créer automatiquement un plan de perte de graisse ou de sèche. Nous te recommandons de faire vérifier ta composition corporelle par un professionnel qualifié.",
    "expired": "La mesure enregistrée n'est plus valide (date, variation de poids ou événement clinique). Mets-la à jour pour continuer à l'utiliser."
  },
  "es": {
    "title": "Antes de empezar un superávit calórico, revisemos tu composición corporal.",
    "measured": "El porcentaje de grasa indicado es {x} %. En esta situación, un superávit calórico podría aumentar sobre todo la masa grasa. DUBI no inicia la fase de volumen y propone una recomposición corporal en mantenimiento.",
    "estimate": "DUBI estima tu porcentaje de grasa en aproximadamente {x} %, con un intervalo orientativo de {y}–{z} %. Es una estimación basada en el IMC, la edad y el sexo, no una medición directa.",
    "toRecomposition": "Pasar a recomposición",
    "updateMeasurement": "Actualizar la medición",
    "formTitle": "Medición de la composición corporal",
    "formValue": "Porcentaje de grasa (%)",
    "formMethod": "Cómo se midió",
    "formDate": "Fecha de la medición",
    "formSave": "Guardar medición",
    "sourceLabel": "Origen del dato",
    "dateLabel": "Fecha",
    "rangeLabel": "Intervalo",
    "deurenberg": "Estimación a partir del IMC, la edad y el sexo (Deurenberg)",
    "methods": {
      "DEXA_OR_CLINICAL": "DEXA o valoración clínica",
      "SKINFOLD_OR_BIA_PROFESSIONAL": "Pliegues cutáneos o bioimpedancia (BIA) por un profesional",
      "CIRCUMFERENCES_VALIDATED": "Circunferencias completas con un método validado",
      "SCALE_OR_WEARABLE": "Báscula o dispositivo wearable"
    },
    "scaleEstimate": "Tu báscula o wearable estima tu grasa corporal en {x} %. Este valor puede variar según la hidratación, la hora y el dispositivo, por lo que DUBI lo considera una estimación y no una medición clínica.",
    "conflict": "Tus datos de composición corporal no son coherentes entre sí. Antes de aplicar un superávit calórico, actualiza la medición o introduce un valor obtenido con un método más fiable.",
    "needTwoReadings": "Mide cada circunferencia dos veces, en las mismas condiciones y sin apretar la cinta. DUBI utilizará la media de las dos mediciones.",
    "estimateTag": "Estimación orientativa, no una medición clínica.",
    "lowBodyFat": "El valor indicado es muy bajo. Por tu seguridad, DUBI no puede crear automáticamente un plan de pérdida de grasa o de definición. Te recomendamos verificar tu composición corporal con un profesional cualificado.",
    "expired": "La medición guardada ya no es válida (fecha, cambio de peso o evento clínico). Actualízala para seguir usándola."
  },
  "de": {
    "title": "Bevor wir einen Kalorienüberschuss starten, prüfen wir deine Körperzusammensetzung.",
    "measured": "Dein angegebener Körperfettanteil beträgt {x} %. In dieser Situation würde ein Kalorienüberschuss vor allem die Fettmasse erhöhen. DUBI startet keine Aufbauphase und empfiehlt eine Rekomposition auf Erhaltungsniveau.",
    "estimate": "DUBI schätzt deinen Körperfettanteil auf etwa {x} %, mit einem Orientierungsbereich von {y}–{z} %. Die Schätzung basiert auf BMI, Alter und Geschlecht und ist keine direkte Messung.",
    "toRecomposition": "Zur Rekomposition wechseln",
    "updateMeasurement": "Messung aktualisieren",
    "formTitle": "Messung der Körperzusammensetzung",
    "formValue": "Körperfettanteil (%)",
    "formMethod": "Messmethode",
    "formDate": "Datum der Messung",
    "formSave": "Messung speichern",
    "sourceLabel": "Datenquelle",
    "dateLabel": "Datum",
    "rangeLabel": "Bereich",
    "deurenberg": "Schätzung aus BMI, Alter und Geschlecht (Deurenberg)",
    "methods": {
      "DEXA_OR_CLINICAL": "DEXA oder klinische Untersuchung",
      "SKINFOLD_OR_BIA_PROFESSIONAL": "Hautfaltenmessung oder Bioimpedanz (BIA) durch Fachpersonal",
      "CIRCUMFERENCES_VALIDATED": "Vollständige Umfangsmessung mit validierter Methode",
      "SCALE_OR_WEARABLE": "Körperanalysewaage oder Wearable"
    },
    "scaleEstimate": "Deine Waage oder dein Wearable schätzt deinen Körperfettanteil auf {x} %. Dieser Wert kann je nach Flüssigkeitshaushalt, Uhrzeit und Gerät schwanken, daher behandelt DUBI ihn als Schätzung und nicht als klinische Messung.",
    "conflict": "Deine Daten zur Körperzusammensetzung passen nicht zusammen. Bevor ein Kalorienüberschuss angewendet wird, aktualisiere die Messung oder gib einen Wert ein, der mit einer zuverlässigeren Methode ermittelt wurde.",
    "needTwoReadings": "Miss jeden Umfang zweimal unter denselben Bedingungen, ohne das Maßband festzuziehen. DUBI verwendet den Mittelwert der beiden Messungen.",
    "estimateTag": "Orientierende Schätzung, keine klinische Messung.",
    "lowBodyFat": "Der angegebene Wert ist sehr niedrig. Zu deiner Sicherheit kann DUBI nicht automatisch einen Plan zur Fettreduktion oder Definition erstellen. Wir empfehlen, deine Körperzusammensetzung von einer qualifizierten Fachperson überprüfen zu lassen.",
    "expired": "Die gespeicherte Messung ist nicht mehr gültig (Datum, Gewichtsveränderung oder klinisches Ereignis). Aktualisiere sie, um sie weiter zu verwenden."
  },
  "ar": {
    "title": "قبل بدء فائض في السعرات، لنتحقق من تركيب جسمك.",
    "measured": "نسبة الدهون التي أدخلتها هي {x}٪. في هذه الحالة قد يزيد فائض السعرات كتلة الدهون بشكل أساسي. لن يبدأ DUBI مرحلة زيادة الكتلة، ويقترح إعادة تشكيل الجسم مع الحفاظ على السعرات.",
    "estimate": "يقدّر DUBI نسبة الدهون لديك بحوالي {x}٪، ضمن نطاق تقريبي {y}–{z}٪. هذا تقدير يعتمد على مؤشر كتلة الجسم والعمر والجنس، وليس قياسًا مباشرًا.",
    "toRecomposition": "الانتقال إلى إعادة تشكيل الجسم",
    "updateMeasurement": "تحديث القياس",
    "formTitle": "قياس تركيب الجسم",
    "formValue": "نسبة الدهون (٪)",
    "formMethod": "طريقة القياس",
    "formDate": "تاريخ القياس",
    "formSave": "حفظ القياس",
    "sourceLabel": "مصدر البيانات",
    "dateLabel": "التاريخ",
    "rangeLabel": "النطاق",
    "deurenberg": "تقدير من مؤشر كتلة الجسم والعمر والجنس (Deurenberg)",
    "methods": {
      "DEXA_OR_CLINICAL": "DEXA أو تقييم سريري",
      "SKINFOLD_OR_BIA_PROFESSIONAL": "قياس ثنيات الجلد أو المعاوقة الحيوية (BIA) من مختص",
      "CIRCUMFERENCES_VALIDATED": "قياسات محيطية كاملة بطريقة معتمدة",
      "SCALE_OR_WEARABLE": "ميزان ذكي أو جهاز قابل للارتداء"
    },
    "scaleEstimate": "يقدّر ميزانك أو جهازك القابل للارتداء نسبة الدهون في جسمك بـ {x}٪. قد تتغير هذه القيمة حسب الترطيب والتوقيت والجهاز، لذلك يعتبرها DUBI تقديرًا وليس قياسًا سريريًا.",
    "conflict": "بيانات تركيب جسمك غير متسقة. قبل تطبيق فائض في السعرات، حدّث القياس أو أدخل قيمة تم الحصول عليها بطريقة أكثر موثوقية.",
    "needTwoReadings": "قِس كل محيط مرتين في الظروف نفسها ودون شدّ شريط القياس. سيستخدم DUBI متوسط القياسين.",
    "estimateTag": "تقدير إرشادي، وليس قياسًا سريريًا.",
    "lowBodyFat": "القيمة المُدخلة منخفضة جدًا. حفاظًا على سلامتك، لا يمكن لـ DUBI إنشاء خطة لخسارة الدهون أو للتنشيف تلقائيًا. ننصحك بالتحقق من تركيب جسمك لدى مختص مؤهل.",
    "expired": "القياس المحفوظ لم يعد صالحًا (التاريخ أو تغيّر الوزن أو حدث سريري). حدّثه لمواصلة استخدامه."
  },
  "pt": {
    "title": "Antes de iniciar um excedente calórico, vamos verificar a tua composição corporal.",
    "measured": "A percentagem de gordura indicada é {x} %. Nesta situação, um excedente calórico poderia aumentar sobretudo a massa gorda. A DUBI não inicia a fase de ganho de massa e propõe uma recomposição corporal em manutenção.",
    "estimate": "A DUBI estima a tua percentagem de gordura em cerca de {x} %, com um intervalo indicativo de {y}–{z} %. É uma estimativa baseada no IMC, idade e sexo, não uma medição direta.",
    "toRecomposition": "Mudar para recomposição",
    "updateMeasurement": "Atualizar a medição",
    "formTitle": "Medição da composição corporal",
    "formValue": "Percentagem de gordura (%)",
    "formMethod": "Como foi medida",
    "formDate": "Data da medição",
    "formSave": "Guardar medição",
    "sourceLabel": "Origem do dado",
    "dateLabel": "Data",
    "rangeLabel": "Intervalo",
    "deurenberg": "Estimativa a partir do IMC, idade e sexo (Deurenberg)",
    "methods": {
      "DEXA_OR_CLINICAL": "DEXA ou avaliação clínica",
      "SKINFOLD_OR_BIA_PROFESSIONAL": "Pregas cutâneas ou bioimpedância (BIA) por um profissional",
      "CIRCUMFERENCES_VALIDATED": "Perímetros completos com método validado",
      "SCALE_OR_WEARABLE": "Balança ou dispositivo wearable"
    },
    "scaleEstimate": "A tua balança ou wearable estima a tua gordura corporal em {x} %. Este valor pode variar com a hidratação, a hora e o dispositivo, por isso a DUBI considera-o uma estimativa e não uma medição clínica.",
    "conflict": "Os teus dados de composição corporal não são coerentes entre si. Antes de aplicar um excedente calórico, atualiza a medição ou introduz um valor obtido com um método mais fiável.",
    "needTwoReadings": "Mede cada perímetro duas vezes, nas mesmas condições, sem apertar a fita. A DUBI usará a média das duas medições.",
    "estimateTag": "Estimativa indicativa, não uma medição clínica.",
    "lowBodyFat": "O valor indicado é muito baixo. Para tua segurança, a DUBI não pode criar automaticamente um plano de perda de gordura ou de definição. Recomendamos que verifiques a tua composição corporal com um profissional qualificado.",
    "expired": "A medição guardada já não é válida (data, variação de peso ou evento clínico). Atualiza-a para continuares a usá-la."
  },
  "zh": {
    "title": "在开始热量盈余之前，我们先检查一下你的身体成分。",
    "measured": "你填写的体脂率为 {x}%。在这种情况下，热量盈余可能主要增加脂肪量。DUBI 不会开始增肌阶段，并建议在维持热量下进行身体重组。",
    "estimate": "DUBI 估算你的体脂率约为 {x}%，参考区间为 {y}–{z}%。这是根据 BMI、年龄和性别得出的估算，并非直接测量。",
    "toRecomposition": "改为身体重组",
    "updateMeasurement": "更新测量",
    "formTitle": "身体成分测量",
    "formValue": "体脂率 (%)",
    "formMethod": "测量方式",
    "formDate": "测量日期",
    "formSave": "保存测量",
    "sourceLabel": "数据来源",
    "dateLabel": "日期",
    "rangeLabel": "区间",
    "deurenberg": "根据 BMI、年龄和性别的估算（Deurenberg）",
    "methods": {
      "DEXA_OR_CLINICAL": "DEXA 或临床评估",
      "SKINFOLD_OR_BIA_PROFESSIONAL": "由专业人员进行的皮褶测量或生物电阻抗 (BIA)",
      "CIRCUMFERENCES_VALIDATED": "采用经验证方法的完整围度测量",
      "SCALE_OR_WEARABLE": "体脂秤或可穿戴设备"
    },
    "scaleEstimate": "你的体脂秤或可穿戴设备估算你的体脂率为 {x}%。该数值可能因身体水分、测量时间和设备而变化，因此 DUBI 将其视为估算值，而非临床测量。",
    "conflict": "你的身体成分数据彼此不一致。在应用热量盈余之前，请更新测量，或输入通过更可靠方法获得的数值。",
    "needTwoReadings": "每个围度在相同条件下测量两次，不要拉紧软尺。DUBI 将使用两次测量的平均值。",
    "estimateTag": "参考性估算，非临床测量。",
    "lowBodyFat": "你填写的数值非常低。为了你的安全，DUBI 无法自动生成减脂或塑形计划。建议你请合格的专业人士核实身体成分。",
    "expired": "已保存的测量已失效（日期、体重变化或临床事件）。请更新后继续使用。"
  },
  "ja": {
    "title": "カロリー過多を始める前に、体組成を確認しましょう。",
    "measured": "入力された体脂肪率は {x}% です。この状況では、カロリー過多は主に体脂肪を増やす可能性があります。DUBIは増量期を開始せず、維持カロリーでのボディリコンポジションを提案します。",
    "estimate": "DUBIはあなたの体脂肪率を約 {x}%（目安の範囲 {y}–{z}%）と推定しています。BMI・年齢・性別に基づく推定であり、直接の測定値ではありません。",
    "toRecomposition": "リコンポジションに切り替える",
    "updateMeasurement": "測定値を更新",
    "formTitle": "体組成の測定",
    "formValue": "体脂肪率 (%)",
    "formMethod": "測定方法",
    "formDate": "測定日",
    "formSave": "測定値を保存",
    "sourceLabel": "データの出所",
    "dateLabel": "日付",
    "rangeLabel": "範囲",
    "deurenberg": "BMI・年齢・性別からの推定（Deurenberg）",
    "methods": {
      "DEXA_OR_CLINICAL": "DEXAまたは臨床評価",
      "SKINFOLD_OR_BIA_PROFESSIONAL": "専門家による皮下脂肪厚測定または生体インピーダンス（BIA）",
      "CIRCUMFERENCES_VALIDATED": "検証済みの方法による周囲径の測定",
      "SCALE_OR_WEARABLE": "体組成計またはウェアラブル"
    },
    "scaleEstimate": "体組成計またはウェアラブルは、あなたの体脂肪率を {x}% と推定しています。この値は水分量、測定時刻、機器によって変動するため、DUBIは臨床的な測定ではなく推定値として扱います。",
    "conflict": "体組成のデータに一貫性がありません。カロリー過多を適用する前に、測定値を更新するか、より信頼性の高い方法で得た値を入力してください。",
    "needTwoReadings": "各周囲径を同じ条件で2回測定し、メジャーを締めつけないでください。DUBIは2回の測定の平均値を使用します。",
    "estimateTag": "参考となる推定値であり、臨床的な測定ではありません。",
    "lowBodyFat": "入力された値は非常に低いです。安全のため、DUBIは減量または絞り込み（ディフィニション）のプランを自動で作成できません。資格のある専門家に体組成を確認してもらうことをおすすめします。",
    "expired": "保存された測定値は無効になりました（日付、体重の変化、または臨床的な出来事）。引き続き使用するには更新してください。"
  },
  "ru": {
    "title": "Прежде чем начинать профицит калорий, проверим состав тела.",
    "measured": "Указанный процент жира — {x}%. В этой ситуации профицит калорий может увеличить в основном жировую массу. DUBI не начинает фазу набора массы и предлагает рекомпозицию тела на поддерживающей калорийности.",
    "estimate": "DUBI оценивает ваш процент жира примерно в {x}% с ориентировочным диапазоном {y}–{z}%. Это оценка на основе ИМТ, возраста и пола, а не прямое измерение.",
    "toRecomposition": "Перейти к рекомпозиции",
    "updateMeasurement": "Обновить измерение",
    "formTitle": "Измерение состава тела",
    "formValue": "Процент жира (%)",
    "formMethod": "Способ измерения",
    "formDate": "Дата измерения",
    "formSave": "Сохранить измерение",
    "sourceLabel": "Источник данных",
    "dateLabel": "Дата",
    "rangeLabel": "Диапазон",
    "deurenberg": "Оценка по ИМТ, возрасту и полу (Deurenberg)",
    "methods": {
      "DEXA_OR_CLINICAL": "DEXA или клиническая оценка",
      "SKINFOLD_OR_BIA_PROFESSIONAL": "Калиперометрия или биоимпеданс (BIA) у специалиста",
      "CIRCUMFERENCES_VALIDATED": "Полный набор обхватов по проверенной методике",
      "SCALE_OR_WEARABLE": "Умные весы или носимое устройство"
    },
    "scaleEstimate": "Ваши весы или носимое устройство оценивают процент жира в организме в {x}%. Это значение может меняться в зависимости от гидратации, времени суток и устройства, поэтому DUBI рассматривает его как оценку, а не клиническое измерение.",
    "conflict": "Ваши данные о составе тела не согласуются между собой. Прежде чем применять профицит калорий, обновите измерение или введите значение, полученное более надёжным методом.",
    "needTwoReadings": "Измерьте каждый обхват дважды в одинаковых условиях, не затягивая ленту. DUBI использует среднее значение двух измерений.",
    "estimateTag": "Ориентировочная оценка, а не клиническое измерение.",
    "lowBodyFat": "Указанное значение очень низкое. Ради вашей безопасности DUBI не может автоматически составить план снижения жира или рельефа. Рекомендуем проверить состав тела у квалифицированного специалиста.",
    "expired": "Сохранённое измерение больше не действительно (дата, изменение веса или клиническое событие). Обновите его, чтобы продолжить использовать."
  }
};

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => values[key]);

export function getBodyCompositionCopy(lang) {
  const copy = COPY[lang];
  if (!copy) throw new Error(`BODY_COMPOSITION_COPY_MISSING:${lang}`);
  return copy;
}

export const BODY_COMPOSITION_COPY_LANGUAGES = Object.freeze(Object.keys(COPY));

// Separatore decimale della lingua dell'app.
export function formatPct(value, lang) {
  return new Intl.NumberFormat(lang, { maximumFractionDigits: 1, minimumFractionDigits: 0 }).format(Number(value));
}

// assessment: esito del backend (status, basis, estimate, measurement, notices).
export function bodyCompositionMessage(assessment, lang) {
  const copy = getBodyCompositionCopy(lang);
  if (!assessment || !assessment.estimate) return null;
  if (assessment.status === "LOW_BODY_FAT_BLOCK") return copy.lowBodyFat;
  if (assessment.status === "DATA_CONFLICT") return copy.conflict;
  if (assessment.basis === "CIRCUMFERENCES_TO_CONFIRM") return copy.needTwoReadings;
  const m = assessment.measurement;
  if ((assessment.basis === "MEASUREMENT" || assessment.basis === "MEASUREMENT_CONFIRMED") && m) {
    return assessment.status === "LOW_BODY_FAT_BLOCK" ? copy.lowBodyFat : fill(copy.measured, { x: formatPct(m.value_pct, lang) });
  }
  if (m && m.method === "SCALE_OR_WEARABLE" && String(assessment.basis).startsWith("SCALE_OR_WEARABLE")) {
    return fill(copy.scaleEstimate, { x: formatPct(m.value_pct, lang) });
  }
  return fill(copy.estimate, {
    x: formatPct(assessment.estimate.value_pct, lang),
    y: formatPct(assessment.estimate.range_low_pct, lang),
    z: formatPct(assessment.estimate.range_high_pct, lang),
  });
}

// Avvisi su misure non utilizzabili (scadute, circonferenze singole, ecc.).
export function bodyCompositionNotices(assessment, lang) {
  const copy = getBodyCompositionCopy(lang);
  return (assessment?.notices || []).map((notice) => {
    if (notice.code === BODY_COMPOSITION_CODES.expired) return copy.expired;
    if (notice.reason === "CIRCUMFERENCES_NEED_TWO_READINGS") return copy.needTwoReadings;
    return copy.updateMeasurement;
  });
}

// D-042: per ogni dato mostrato servono valore, origine, data, intervallo e, per le stime, la dicitura.
export function bodyCompositionDetails(assessment, lang, todayIso) {
  const copy = getBodyCompositionCopy(lang);
  if (!assessment || !assessment.estimate) return [];
  const rows = [];
  const m = assessment.measurement;
  if (m) {
    rows.push({
      value: `${formatPct(m.value_pct, lang)}%`,
      source: copy.methods[m.method],
      date: m.measured_at,
      range: m.range_low_pct !== null && m.range_low_pct !== undefined ? `${formatPct(m.range_low_pct, lang)}–${formatPct(m.range_high_pct, lang)}%` : null,
      estimateTag: m.is_estimate ? copy.estimateTag : null,
    });
  }
  const e = assessment.estimate;
  rows.push({
    value: `${formatPct(e.value_pct, lang)}%`,
    source: copy.deurenberg,
    date: todayIso,
    range: `${formatPct(e.range_low_pct, lang)}–${formatPct(e.range_high_pct, lang)}%`,
    estimateTag: copy.estimateTag,
  });
  return rows;
}
