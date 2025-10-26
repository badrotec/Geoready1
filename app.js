/* app.js — GeoReady quiz engine (multi-page, bilingual RTL/LTR) */

/* =========================
   Utility & Language toggle
   ========================= */
const LANG_KEY = 'geoready_lang';
const RESULT_KEY = 'geoready_results';

function getLang(){
  return localStorage.getItem(LANG_KEY) || 'ar';
}
function setLang(l){ localStorage.setItem(LANG_KEY, l); applyLang() }
function applyLang(){
  const lang = getLang();
  document.documentElement.dir = (lang==='ar') ? 'rtl' : 'ltr';
  // translate static nodes
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(i18n[key]) el.innerHTML = i18n[key][lang];
  });
  // mark active language button if present
  document.querySelectorAll('.lang-switch').forEach(btn=>{
    btn.style.opacity = btn.dataset-lang === lang ? '1' : '0.6';
  });
}

/* simple translations for static bits */
const i18n = {
  'start_now': { ar: 'ابدأ الآن', en: 'Start Now' },
  'missions': { ar: 'المهمات', en: 'Missions' },
  'tools': { ar: 'الأدوات', en: 'Tools' },
  'learn': { ar: 'التعلّم', en: 'Learn' },
  'join': { ar: 'انضم', en: 'Join' },
  'score_text': { ar: 'نتيجتك', en: 'Your score' },
  'try_again': { ar: 'أعد المحاولة', en: 'Try again' },
  'download_report': { ar: 'تحميل التقرير', en: 'Download report' }
};

/* =========================
   Questions bank (sample)
   Each page id -> array of questions.
   Question object: { id, q: {ar,en}, options: [{ar,en}], answer: index, explain: {ar,en} }
   ========================= */
const QUESTIONS = {
  'general': [
    { id: 'g1', q:{ar:'ما الذي يَعرف به الصخر الرسوبي؟', en:'What typically characterizes a sedimentary rock?'}, 
      options:[
        {ar:'وجود طبقات وفتات', en:'Layering and clastic fragments'},
        {ar:'بنية بلورية متداخلة', en:'Interlocking crystalline texture'},
        {ar:'تشكّل من تبريد الحمم', en:'Formed by cooling magma'}
      ], answer:0, explain:{ar:'الصخور الرسوبية غالباً ما تكون طباقية ومكونة من فتات.', en:'Sedimentary rocks often show layering and are made of clastic fragments.'}},
    { id: 'g2', q:{ar:'ما العنصر الأكثر وفرة في قشرة الأرض؟', en:'Which element is most abundant in Earth\'s crust?'}, 
      options:[{ar:'الأكسجين',en:'Oxygen'},{ar:'حديد',en:'Iron'},{ar:'هيدروجين',en:'Hydrogen'}], answer:0, explain:{ar:'الأكسجين يمثل ~46% من القشرة.', en:'Oxygen makes up ~46% of the crust.'}},
    { id: 'g3', q:{ar:'ماذا يقيس ROP؟', en:'What does ROP measure?'}, 
      options:[{ar:'معدل الاختراق (m/hr)',en:'Rate of penetration (m/hr)'},{ar:'عمق البئر',en:'Well depth'},{ar:'سرعة الموجات الزلزالية',en:'Seismic wave speed'}], answer:0, explain:{ar:'ROP يحدد معدل الحفر.', en:'ROP is the drilling penetration rate.'}},
    { id: 'g4', q:{ar:'ما هي المسامية (Porosity)؟', en:'What is porosity?'}, 
      options:[{ar:'نسبة الفراغات في الصخر',en:'Volume fraction of voids'},{ar:'الكثافة الظرفية',en:'Bulk density'},{ar:'سرعة النفاذية',en:'Permeability'}], answer:0, explain:{ar:'المسامية نسبة الفراغات من الحجم الكلي.', en:'Porosity is the fraction of void volume to total volume.'}},
    { id: 'g5', q:{ar:'أيهما صخر ناري جوفي؟', en:'Which is an intrusive igneous rock?'}, 
      options:[{ar:'جرانيت',en:'Granite'},{ar:'بازلت',en:'Basalt'},{ar:'شست',en:'Schist'}], answer:0, explain:{ar:'الجرانيت يتبلور ببطء تحت السطح.', en:'Granite crystallizes slowly below the surface.'}},
    { id: 'g6', q:{ar:'التحول الإقليمي ينتج عن؟', en:'Regional metamorphism results from?'}, 
      options:[{ar:'ضغط وحرارة على نطاق واسع',en:'Widespread pressure and heat'},{ar:'مياه جوفية فقط',en:'Only groundwater'},{ar:'ترسيب بحري',en:'Marine deposition'}], answer:0, explain:{ar:'التحول الإقليمي بفعل الضغط والحرارة.', en:'Regional metamorphism due to pressure & heat.'}},
    { id: 'g7', q:{ar:'ما الذي يدل على بيئة رسوبية نهرية؟', en:'What indicates a fluvial (river) depositional environment?'}, 
      options:[{ar:'تقاطع طبقي متجه',en:'Cross-bedding and channel structures'},{ar:'نشاط بركاني',en:'Volcanic activity'},{ar:'طبقات متجانسة دقيقة',en:'Homogenous fine layers'}], answer:0, explain:{ar:'التقاطعات والقنوات تشير للنهر.', en:'Cross-bedding and channels indicate fluvial.'}},
    { id: 'g8', q:{ar:'ما معنى “strike” في البنيوية؟', en:'What is "strike" in structural geology?'}, 
      options:[{ar:'اتجاه المستوى',en:'Direction of the plane'},{ar:'زاوية الميل',en:'Dip angle'},{ar:'سرعة الفالق',en:'Fault velocity'}], answer:0, explain:{ar:'الـ strike هو اتجاه المستوى.', en:'Strike is the direction of a plane.'}},
    { id: 'g9', q:{ar:'الشقوق (fractures) تؤثر على؟', en:'Fractures most affect?'}, 
      options:[{ar:'نفاذية الصخور',en:'Rock permeability'},{ar:'درجة الحرارة فقط',en:'Temperature only'},{ar:'التركيب الكيميائي فقط',en:'Only chemical composition'}], answer:0, explain:{ar:'الشقوق تزيد من نفاذية الصخور.', en:'Fractures increase permeability.'}},
    { id: 'g10', q:{ar:'ماذا تقيّم عند وصف نواة؟', en:'What do you record when describing a core?'}, 
      options:[{ar:'اللون، الحبيبات، البنية',en:'Color, grain, texture'},{ar:'سجل الطقس فقط',en:'Only weather'},{ar:'نوع المضخة',en:'Type of pump used'}], answer:0, explain:{ar:'وصف النواة يشمل اللون والحبيبات والبنية.', en:'Core description includes color, grain, texture.'}}
  ],

  'hydro': [
    { id:'h1', q:{ar:'ما هو الخزان الجوفي (Aquifer)؟', en:'What is an aquifer?'}, options:[{ar:'طبقة قابلة لتخزين ونقل الماء',en:'Layer capable of storing & transmitting water'},{ar:'جبل من الصخور',en:'A mountain mass'},{ar:'أداة قياس الحفر',en:'A drilling instrument'}], answer:0, explain:{ar:'الخزان الجوفي يسمح بتخزين ونقل المياه.', en:'Aquifer stores & transmits groundwater.'}},
    { id:'h2', q:{ar:'ما الفرق بين البئر الحر والمقيّد؟', en:{ar:'What is the difference between an unconfined and confined aquifer?', en:'ignore'}}, /* note: bilingual provided above */,
      options:[{ar:'الحرة سطحها متصل بالجو',en:'Unconfined has water table exposed'},{ar:'المقيّدة مفتوحة على السطح',en:'Confined is open to surface'},{ar:'لا فرق',en:'No difference'}], answer:0, explain:{ar:'البئر الحر سطح الماء مرتبط بالجو.', en:'Unconfined has its water table open to the atmosphere.'}},
    { id:'h3', q:{ar:'ما الذي تعبر عنه النفاذية (K)؟', en:'What does hydraulic conductivity (K) express?'}, options:[{ar:'قدرة الصخور على نقل الماء',en:'Ability of rock to transmit water'},{ar:'مقدار الملوحة',en:'Salinity'},{ar:'درجة الحرارة'},], answer:0, explain:{ar:'K تعبر عن قدرة النقل.', en:'K quantifies how easily water can move through material.'}},
    { id:'h4', q:{ar:'قانون دارسي يحسب؟', en:'Darcy\'s law computes?'}, options:[{ar:'معدل التدفق Q',en:'Flow rate Q'},{ar:'المسامية',en:'Porosity'},{ar:'الضغط الجوي',en:'Atmospheric pressure'}], answer:0, explain:{ar:'قانون دارسي لحساب Q.', en:'Darcy equation gives flow rate Q.'}},
    { id:'h5', q:{ar:'كيف تقاس منسوبات المياه؟', en:'How are water levels measured?'}, options:[{ar:'باستخدام tape أو piezometer',en:'With tape or piezometer'},{ar:'بالمجهر',en:'Using a microscope'},{ar:'باستخدام GPS فقط',en:'Using GPS only'}], answer:0, explain:{ar:'منسوب الماء يقاس بتاب أو بيزوميتر.', en:'Water level measured with tape or piezometer.'}},
    { id:'h6', q:{ar:'ما معنى T (transmissivity)?', en:'What does transmissivity (T) mean?'}, options:[{ar:'K × b (نفاذية × سمك)',en:'K × b (conductivity × thickness)'},{ar:'K ÷ b',en:'K divided by b'},{ar:'كمية الرواسب'}], answer:0, explain:{ar:'T = K × b.', en:'Transmissivity is K times aquifer thickness.'}},
    { id:'h7', q:{ar:'ماذا يدل انخفاض منسوب الماء بسرعة؟', en:'Rapid drawdown in water level indicates?'}, options:[{ar:'سحب زائد/استنزاف',en:'Over-pumping or depletion'},{ar:'زيادة الأمطار',en:'More rainfall'},{ar:'تحسن في النفاذية'}], answer:0, explain:{ar:'هبوط سريع يدل على استنزاف.', en:'Rapid decline often due to over-pumping.'}},
    { id:'h8', q:{ar:'ماذا تُقيس EC؟', en:'What does EC measure?'}, options:[{ar:'التوصيلية الكهربائية/الملوحة',en:'Electrical conductivity/salinity'},{ar:'العمق',en:'Depth'},{ar:'السرعة'}], answer:0, explain:{ar:'EC يقيس التوصيلية/الملوحة.', en:'EC measures electrical conductivity (salinity).'}},
    { id:'h9', q:{ar:'اختبار نفاذية بسيط للتربة؟', en:'A simple field permeability test is?'}, options:[{ar:'Permeameter أو اختبار شنق',en:'Permeameter or infiltrometer'},{ar:'XRD',en:'XRD'},{ar:'Thin section'}], answer:0, explain:{ar:'استخدام permeameter شائع.', en:'Permeameter or infiltrometer are common.'}},
    { id:'h10', q:{ar:'ما الذي يؤثر على سرعة الجريان في الخزان؟', en:'What affects groundwater flow speed?'}, options:[{ar:'K, Δh, L',en:'K, Δh, L'},{ar:'الطيف اللوني',en:'Color spectrum'},{ar:'نوع الأحفور'}], answer:0, explain:{ar:'العوامل الرئيسية K, Δh, L.', en:'Key factors are K, hydraulic gradient, and length.'}}
  ],

  'petrology': [
    { id:'p1', q:{ar:'ما الفرق بين صخر جوفي وسطحي؟', en:'Difference between intrusive and extrusive?'}, options:[{ar:'التبريد البطيء ينتج بلورات كبيرة',en:'Slow cooling produces large crystals'},{ar:'التبريد السريع ينتج بلورات كبيرة',en:'Fast cooling produces large crystals'},{ar:'لا فرق'}], answer:0, explain:{ar:'الجوفية تبرد ببطء.', en:'Intrusive cool slowly producing large crystals.'}},
    { id:'p2', q:{ar:'أي من التالي حجر رملي كوارتزي؟', en:'Which is quartz arenite?'}, options:[{ar:'حجر رملي نقي كوارتز',en:'Sandstone dominated by quartz'},{ar:'صخر غامق غني بالحديد',en:'Iron-rich dark rock'},{ar:'طفلة غنية بالطين'}], answer:0, explain:{ar:'Quartz arenite غني بالكوارتز.', en:'Quartz arenite is rich in quartz grains.'}},
    { id:'p3', q:{ar:'ما هو الفرق بين المافية والفيلسية؟', en:'Mafic vs felsic difference?'}, options:[{ar:'مافية غامقة وغنية Fe/Mg',en:'Mafic dark, rich in Fe/Mg'},{ar:'لا فرق',en:'No difference'},{ar:'فلسية غامقة'}], answer:0, explain:{ar:'المافية غنية بالحديد والمغنيسيوم.', en:'Mafic rocks are Fe/Mg rich and darker.'}},
    { id:'p4', q:{ar:'ماهي النسيج الحبيبي؟', en:'What is phaneritic texture?'}, options:[{ar:'حبيبات مرئية بالعين',en:'Visible grains to naked eye'},{ar:'حبيبات دقيقة جدا',en:'Very fine grains'},{ar:'نسيج زجاجي'}], answer:0, explain:{ar:'Phaneritic = coarse visible grains.', en:'Phaneritic texture has visible crystals.'}},
    { id:'p5', q:{ar:'ما الذي تدرسه البتروجرافيا؟', en:'What does petrology study?'}, options:[{ar:'تركيب ونشأة الصخور',en:'Rock composition and origin'},{ar:'حركة الصفائح فقط',en:'Plate movement only'},{ar:'خواص الماء'}], answer:0, explain:{ar:'Petrology studies rocks origin & composition.', en:'Petrology studies rock composition & genesis.'}},
    { id:'p6', q:{ar:'أي أداة تفحص حبيبات دقيقة بالميدان؟', en:'Tool for examining grains in field?'}, options:[{ar:'Hand lens (10x)',en:'Hand lens (10x)'},{ar:'Seismograph',en:'Seismograph'},{ar:'GPS'}], answer:0, explain:{ar:'العدسة اليدوية أداة أساسية.', en:'Hand lens is essential in the field.'}},
    { id:'p7', q:{ar:'صخرة نفاذية عالية غالباً تكون؟', en:'High permeability rock often is?'}, options:[{ar:'حجر رملي خشن',en:'Coarse sandstone'},{ar:'طفلة متماسكة',en:'Compact clay'},{ar:'رخام'}], answer:0, explain:{ar:'الحجر الرملي الخشن نفاذية عالية.', en:'Coarse sandstone often has high permeability.'}},
    { id:'p8', q:{ar:'ما الذي يدل على تيار عالي طاقة في الترسب؟', en:'What indicates high-energy current in deposition?'}, options:[{ar:'حبيبات خشنة والتثبيت',en:'Coarse grains and cross-bedding'},{ar:'طحالب دقيقة',en:'Fine algae'},{ar:'طبقات متجانسة'}], answer:0, explain:{ar:'الحبيبات الخشنة تقترن بطاقة عالية.', en:'Coarse grains imply high energy.'}},
    { id:'p9', q:{ar:'ما وظيفة thin section في petro؟', en:'Thin section purpose?'}, options:[{ar:'دراسة المعادن تحت المجهر',en:'Study minerals under microscope'},{ar:'قياس النفاذية',en:'Measure permeability'},{ar:'قياس pH'}], answer:0, explain:{ar:'Thin sections للكشف المعدني', en:'Thin sections reveal mineralogy under microscope'}},
    { id:'p10', q:{ar:'أي صخر يتبلور سريعًا على السطح؟', en:'Which rock crystallizes quickly at surface?'}, options:[{ar:'Basalt',en:'Basalt'},{ar:'Granite',en:'Granite'},{ar:'Marble',en:'Marble'}], answer:0, explain:{ar:'Basalt is extrusive and fine-grained.', en:'Basalt extrudes and cools fast producing fine grains.'}}
  ],

  'structure': [
    { id:'s1', q:{ar:'ما هو الفالق العادي؟', en:'What is a normal fault?'}, options:[{ar:'انزلاق بفعل الشد',en:'Downward movement due to extension'},{ar:'انزلاق بفعل الضغط',en:'Movement due to compression'},{ar:'لا وجود'}], answer:0, explain:{ar:'الفالق العادي يرتبط بالشد.', en:'Normal fault forms under extension.'}},
    { id:'s2', q:{ar:'ما هي الطية المحدبة (anticline)؟', en:'What is an anticline?'}, options:[{ar:'طية محدبة لأعلى',en:'Convex-up folding'},{ar:'طية محدبة لأسفل',en:'Concave-down folding'},{ar:'فالق'}], answer:0, explain:{ar:'الـ anticline محدبة لأعلى.', en:'Anticline is an upfold.'}},
    { id:'s3', q:{ar:'ما أداة قياس strike/dip؟', en:'Tool to measure strike & dip?'}, options:[{ar:'Brunton compass',en:'Brunton compass'},{ar:'Hand lens',en:'Hand lens'},{ar:'Tape measure',en:'Tape measure'}], answer:0, explain:{ar:'Brunton لقياس strike/dip.', en:'Brunton compass measures strike & dip.'}},
    { id:'s4', q:{ar:'ماذا تعني علامات الانجراف (slickensides)؟', en:'What do slickensides indicate?'}, options:[{ar:'حركة على سطح الفالق',en:'Movement on fault surface'},{ar:'تشكيل رسوبي',en:'Depositional feature'},{ar:'شيء بيولوجي'}], answer:0, explain:{ar:'تشير لاحتكاك على الفالق.', en:'They indicate fault surface movement.'}},
    { id:'s5', q:{ar:'أثر الفوالق على البنية؟', en:'Effect of faults on structure?'}, options:[{ar:'تغير استمرارية الطبقات',en:'Disrupt continuity of layers'},{ar:'زيادة المسامية فقط',en:'Increase porosity only'},{ar:'لا تأثير'}], answer:0, explain:{ar:'الفوالق تُقطع وتُحرك الطبقات.', en:'Faults offset and displace layers.'}},
    { id:'s6', q:{ar:'ما الفرق بين strike و dip? (مختصر)', en:'Difference between strike & dip?'}, options:[{ar:'strike اتجاه الطبقة - dip زاوية النزول',en:'strike = direction, dip = inclination angle'},{ar:'هما نفس الشيء',en:'they are same'},{ar:'أداة'}], answer:0, explain:{ar:'strike اتجاه والميل هو زاوية.', en:'Strike is direction; dip is angle of inclination.'}},
    { id:'s7', q:{ar:'كيف تؤثر الطيات على تصميم طريق جبلي؟', en:'How folds affect mountain road design?'}, options:[{ar:'تؤثر على استقرار المنحدرات وتحتاج دراسات',en:'Affect slope stability and require study'},{ar:'تمكن من البناء بسهولة',en:'Make building easier'},{ar:'لا تأثير'}], answer:0, explain:{ar:'الطيات تغير الانحدار والاستقرار.', en:'Folds change slope geometry and stability.'}},
    { id:'s8', q:{ar:'ما الذي تبحث عنه عند وصف فالق؟', en:'What to note when describing a fault?'}, options:[{ar:'نوع الحركة واتجاهها واندفاعها',en:'Type of movement, direction & offset'},{ar:'اللون فقط',en:'Color only'},{ar:'السمك فقط'}], answer:0, explain:{ar:'نوذج الحركة وقياس الانزياح مهمة.', en:'Movement type and offset are key.'}},
    { id:'s9', q:{ar:'متى يكون الفالق معكوس؟', en:'When is a reverse fault?'}, options:[{ar:'عندما يتحرك الطرف العلوي لأعلى',en:'When hanging wall moves up'},{ar:'عندما يتحرك لأسفل',en:'When hanging wall moves down'},{ar:'عندما ينكسر الصخر فقط'}], answer:0, explain:{ar:'الفالق المعكوس يُرفع الطرف العلوي.', en:'Reverse fault uplifts the hanging wall.'}},
    { id:'s10', q:{ar:'كيف نرسم مقطع جيولوجي؟', en:'How to draw a geological cross-section?'}, options:[{ar:'نستخدم خرائط السطح والمقاييس لتحويلها لمقطع',en:'Use surface map & scales to project a cross-section'},{ar:'نرسم عشوائياً',en:'Draw randomly'},{ar:'نقيس فقط GPS'}], answer:0, explain:{ar:'نحوّل الحدود من الخريطة إلى مقطع.', en:'Project map boundaries to section using scales.'}}
  ],

  'mineralogy': [
    { id:'m1', q:{ar:'ما هو معدن؟', en:'What is a mineral?'}, options:[{ar:'مادة صلبة متجانسة بتركيب كيميائي ونظام بلوري',en:'A solid homogeneous substance with chemical composition & crystalline structure'},{ar:'مزيج من معادن',en:'A mix of minerals'},{ar:'صخر رسوبي'}], answer:0, explain:{ar:'المعدن مادة نقية ومحددة التركيب.', en:'A mineral has fixed chemistry and crystal structure.'}},
    { id:'m2', q:{ar:'ما الخاصية التي تحدد الصلادة؟', en:'Which property measures hardness?'}, options:[{ar:'ماوس (Mohs) scale',en:'Mohs scale of hardness'},{ar:'الإنفصام',en:'Cleavage'},{ar:'اللون فقط'}], answer:0, explain:{ar:'مقياس Mohs لصلادة المعادن.', en:'Mohs scale measures hardness.'}},
    { id:'m3', q:{ar:'ما الذي يميز الانفصام (cleavage)?', en:'What is cleavage?'}, options:[{ar:'ميل المعدن للانقسام على أسطح مستوية',en:'Tendency to split on flat planes'},{ar:'لون المعدن',en:'Mineral color'},{ar:'اللمعان فقط'}], answer:0, explain:{ar:'الانفصام يحدد اسطح الانشقاق.', en:'Cleavage defines planes of breakage.'}},
    { id:'m4', q:{ar:'أي أداة مفيدة للتعرف السريع؟', en:'Which is useful for quick ID?'}, options:[{ar:'hand lens 10x',en:'hand lens 10x'},{ar:'flowmeter',en:'flowmeter'},{ar:'tape measure'}], answer:0, explain:{ar:'العدسة مفيدة لتفاصيل الحبيبات.', en:'Hand lens reveals grain features.'}},
    { id:'m5', q:{ar:'ما الذي يحدد لون المعدن دائماً؟',en:'What always determines a mineral\'s color?'}, options:[{ar:'اللون ليس ثابتاً غالباً',en:'Color is often variable'},{ar:'التركيب الكيميائي وحده',en:'Chemical composition only'},{ar:'الصلادة فقط'}], answer:0, explain:{ar:'لون المعادن قد يتغير ولا يعتمد دائماً.', en:'Color can vary and is not always diagnostic.'}},
    { id:'m6', q:{ar:'ما فائدة اختبار الخدش؟',en:'Purpose of scratch test?'}, options:[{ar:'تحديد الصلادة',en:'Determine hardness'},{ar:'قياس الكثافة',en:'Measure density'},{ar:'قياس النفاذية'}], answer:0, explain:{ar:'الخدش يقيس الصلادة.', en:'Scratch test checks hardness.'}},
    { id:'m7', q:{ar:'ما معنى specific gravity؟',en:'What is specific gravity?'}, options:[{ar:'نسبة كثافة المعدن إلى الماء',en:'Ratio of mineral density to water'},{ar:'اللمعان',en:'Luster'},{ar:'الانفصام'}], answer:0, explain:{ar:'SG = ρ_mineral / ρ_water', en:'SG = mineral density relative to water.'}},
    { id:'m8', q:{ar:'ما الذي يعطينا اللمعان؟',en:'What does luster describe?'}, options:[{ar:'مظهر سطح المنعكس للضوء',en:'Appearance of reflected light'},{ar:'المسامية',en:'Porosity'},{ar:'النسيج'}], answer:0, explain:{ar:'اللمعان وصف سلوك السطح الضوئي.', en:'Luster describes surface reflectivity.'}},
    { id:'m9', q:{ar:'لماذا thin section مهم؟',en:'Why thin section is important?'}, options:[{ar:'يسمح بدراسة البنية المعدنية بالمجهر',en:'Allows microscopic mineral study'},{ar:'لقياس pH',en:'To measure pH'},{ar:'لقياس النفاذية'}], answer:0, explain:{ar:'thin section للكشف المعدني دقيقاً', en:'Thin section reveals mineral textures microscopically'}},
    { id:'m10', q:{ar:'ما أهمية تحديد المعادن في الميدان؟',en:'Why identify minerals in field?'}, options:[{ar:'تفيد في استنتاج الأصل والبيئة الرسوبية',en:'Helps infer origin & environment'},{ar:'لأغراض زخرفية فقط',en:'Only decorative'},{ar:'لا فائدة'}], answer:0, explain:{ar:'التعرف يعطي معلومات بيئية.', en:'Identification gives environmental/process clues.'}}
  ]
};

/* =========================
   Quiz engine functions
   ========================= */

function getPageId(){
  // returns the key used in QUESTIONS based on file name
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const name = path.split('.')[0];
  // mapping: general/hydro/petrology/structure/mineralogy
  if(name==='general' || name==='hydro' || name==='petrology' || name==='structure' || name==='mineralogy') return name;
  return null;
}

function renderQuiz() {
  const page = getPageId();
  if(!page) return;
  const container = document.getElementById('quizContainer');
  if(!container) return;
  const lang = getLang();
  const bank = QUESTIONS[page] || [];
  if(bank.length===0){ container.innerHTML = '<p class="muted">No questions configured.</p>'; return; }

  // state
  let idx = 0;
  let score = 0;
  const userAnswers = [];

  // build DOM
  container.innerHTML = `
    <div class="quiz-wrap">
      <div class="progress"><span id="progBar" style="width:0%"></span></div>
      <div id="qArea"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
        <button id="prevBtn" class="btn ghost">◀</button>
        <button id="nextBtn" class="btn">▶</button>
      </div>
    </div>
  `;
  const qArea = document.getElementById('qArea');
  const progBar = document.getElementById('progBar');

  function showQuestion(i){
    const item = bank[i];
    const qhtml = `
      <div class="question">
        <div style="font-weight:700">${i+1}. ${item.q[lang]}</div>
        <div class="options" id="opts"></div>
      </div>
    `;
    qArea.innerHTML = qhtml;
    const opts = document.getElementById('opts');
    item.options.forEach((opt, k)=>{
      const div = document.createElement('div');
      div.className = 'option';
      div.tabIndex = 0;
      div.innerText = opt[lang];
      div.addEventListener('click', ()=> selectOption(k));
      div.addEventListener('keypress', (e)=>{ if(e.key==='Enter') selectOption(k) });
      opts.appendChild(div);
      if(userAnswers[i]!==undefined){
        // mark selected
        if(userAnswers[i]===k) div.classList.add('selected');
      }
    });
    progBar.style.width = Math.round(((i)/(bank.length))*100)+'%';
  }

  function selectOption(k){
    userAnswers[idx] = k;
    // mark options
    document.querySelectorAll('#opts .option').forEach((el, j)=>{
      el.classList.toggle('selected', j===k);
    });
  }

  function showResult(){
    // compute score
    score = 0;
    bank.forEach((it, i)=>{
      if(userAnswers[i]===it.answer) score++;
    });
    const percent = Math.round((score/bank.length)*100);
    // save to localStorage
    const pageKey = getPageId();
    const all = JSON.parse(localStorage.getItem(RESULT_KEY) || '{}');
    all[pageKey] = { score, total: bank.length, percent, date: new Date().toISOString() };
    localStorage.setItem(RESULT_KEY, JSON.stringify(all));

    // result UI
    qArea.innerHTML = `
      <div class="result">
        <div class="score">${i18n['score_text'][lang]}: ${score} / ${bank.length} — ${percent}%</div>
        <div style="margin-bottom:8px">${getFeedback(percent, lang)}</div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:10px">
          <button id="retryBtn" class="btn ghost">${i18n['try_again'][lang]}</button>
          <button id="dlBtn" class="btn">${i18n['download_report'][lang]}</button>
        </div>
      </div>
    `;
    document.getElementById('retryBtn').addEventListener('click', ()=>{ idx=0; score=0; userAnswers.length=0; showQuestion(0); });
    document.getElementById('dlBtn').addEventListener('click', ()=> { downloadReport(page, all[page]); });
  }

  function getFeedback(p, lang){
    if(p>=85) return (lang==='ar')? 'ممتاز — مستوى جاهزية ميدانية عالي ✅' : 'Excellent — high field readiness ✅';
    if(p>=60) return (lang==='ar')? 'جيد — تحتاج تحسين في بعض المواضيع ⚡' : 'Good — needs improvement in some topics ⚡';
    return (lang==='ar')? 'ضعيف — راجع المواد وحاول مرة أخرى 🔄' : 'Weak — review material and try again 🔄';
  }

  // init
  showQuestion(0);
  document.getElementById('prevBtn').addEventListener('click', ()=>{
    if(idx>0){ idx--; showQuestion(idx); }
  });
  document.getElementById('nextBtn').addEventListener('click', ()=>{
    // if no answer, confirm skip
    if(userAnswers[idx]===undefined){
      if(!confirm((getLang()==='ar')?'لم تختَر إجابة. هل تريد المتابعة؟':'You did not select an answer. Continue?')) return;
    }
    if(idx < bank.length-1){ idx++; showQuestion(idx); }
    else { // finish
      progBar.style.width = '100%';
      showResult();
    }
  });
}

/* report download */
function downloadReport(page, data){
  if(!data){ alert('No result to download'); return; }
  const lang = getLang();
  const title = (lang==='ar')? `تقرير_${page}.txt` : `report_${page}.txt`;
  const lines = [];
  lines.push((lang==='ar')?`تقرير GeoReady — ${page}`:`GeoReady report — ${page}`);
  lines.push((lang==='ar')?`التاريخ: ${new Date().toLocaleString()}`:`Date: ${new Date().toLocaleString()}`);
  lines.push((lang==='ar')?`النتيجة: ${data.score} / ${data.total} (${data.percent}%)`:`Score: ${data.score} / ${data.total} (${data.percent}%)`);
  lines.push('');
  const blob = new Blob([lines.join('\n')], { type:'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = title;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

/* on DOM ready */
document.addEventListener('DOMContentLoaded', ()=>{
  // apply language
  applyLang();

  // language switch buttons (if any)
  document.querySelectorAll('.lang-switch').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      setLang(btn.dataset.lang);
    });
  });

  // render quiz if container exists
  if(document.getElementById('quizContainer')) renderQuiz();

  // set page static labels if any
  // add dynamic links (enable english labels if present)
});