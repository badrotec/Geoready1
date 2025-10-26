/* app.js — GeoReady quiz engine (multi-page, bilingual RTL/LTR)
   UPDATED: expanded question banks to 20 questions per section
   Note: keep your HTML files names: general.html, hydro.html, petrology.html, structure.html, mineralogy.html
*/

const LANG_KEY = 'geoready_lang';
const RESULT_KEY = 'geoready_results';

function getLang(){
  return localStorage.getItem(LANG_KEY) || 'ar';
}
function setLang(l){ localStorage.setItem(LANG_KEY, l); applyLang() }
function applyLang(){
  const lang = getLang();
  document.documentElement.dir = (lang==='ar') ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(i18n[key]) el.innerHTML = i18n[key][lang];
  });
  document.querySelectorAll('.lang-switch').forEach(btn=>{
    btn.style.opacity = btn.dataset ? (btn.dataset.lang === lang ? '1' : '0.6') : '1';
  });
}

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
   QUESTIONS — expanded to 20 per section
   (Each question: id, q:{ar,en}, options:[{ar,en}], answer:index, explain:{ar,en})
   ========================= */
const QUESTIONS = {
  'general': [
    { id: 'g1', q:{ar:'ما الذي يَعرف به الصخر الرسوبي؟', en:'What typically characterizes a sedimentary rock?'}, 
      options:[{ar:'وجود طبقات وفتات', en:'Layering and clastic fragments'},{ar:'بنية بلورية متداخلة', en:'Interlocking crystalline texture'},{ar:'تشكّل من تبريد الحمم', en:'Formed by cooling magma'},{ar:'نشأة تحت ضغط عالي فقط', en:'Formed only under high pressure'}],
      answer:0, explain:{ar:'الصخور الرسوبية غالباً ما تكون طباقية ومكونة من فتات.', en:'Sedimentary rocks often show layering and are made of clastic fragments.'}},

    { id: 'g2', q:{ar:'ما العنصر الأكثر وفرة في قشرة الأرض؟', en:'Which element is most abundant in Earth\'s crust?'}, 
      options:[{ar:'الأكسجين',en:'Oxygen'},{ar:'حديد',en:'Iron'},{ar:'هيدروجين',en:'Hydrogen'},{ar:'سيليكون',en:'Silicon'}],
      answer:0, explain:{ar:'الأكسجين يمثل ~46% من القشرة.', en:'Oxygen makes up ~46% of the crust.'}},

    { id: 'g3', q:{ar:'ماذا يقيس ROP؟', en:'What does ROP measure?'}, 
      options:[{ar:'معدل الاختراق (m/hr)',en:'Rate of penetration (m/hr)'},{ar:'عمق البئر',en:'Well depth'},{ar:'سرعة الموجات الزلزالية',en:'Seismic wave speed'},{ar:'معدل الترسيب'}],
      answer:0, explain:{ar:'ROP يحدد معدل الحفر.', en:'ROP is the drilling penetration rate.'}},

    { id: 'g4', q:{ar:'ما هي المسامية (Porosity)؟', en:'What is porosity?'}, 
      options:[{ar:'نسبة الفراغات في الصخر',en:'Volume fraction of voids'},{ar:'الكثافة الظرفية',en:'Bulk density'},{ar:'سرعة النفاذية',en:'Permeability'},{ar:'محتوى الماء فقط'}],
      answer:0, explain:{ar:'المسامية نسبة الفراغات من الحجم الكلي.', en:'Porosity is the fraction of void volume to total volume.'}},

    { id: 'g5', q:{ar:'أيهما صخر ناري جوفي؟', en:'Which is an intrusive igneous rock?'}, 
      options:[{ar:'جرانيت',en:'Granite'},{ar:'بازلت',en:'Basalt'},{ar:'شست',en:'Schist'},{ar:'طفلة'}], answer:0, explain:{ar:'الجرانيت يتبلور ببطء تحت السطح.', en:'Granite crystallizes slowly below the surface.'}},

    { id: 'g6', q:{ar:'التحول الإقليمي ينتج عن؟', en:'Regional metamorphism results from?'}, 
      options:[{ar:'ضغط وحرارة على نطاق واسع',en:'Widespread pressure and heat'},{ar:'مياه جوفية فقط',en:'Only groundwater'},{ar:'ترسيب بحري',en:'Marine deposition'},{ar:'تبريد سريع'}], answer:0, explain:{ar:'التحول الإقليمي بفعل الضغط والحرارة.', en:'Regional metamorphism due to pressure & heat.'}},

    { id: 'g7', q:{ar:'ما الذي يدل على بيئة رسوبية نهرية؟', en:'What indicates a fluvial (river) depositional environment?'}, 
      options:[{ar:'تقاطع طبقي متجه',en:'Cross-bedding and channel structures'},{ar:'نشاط بركاني',en:'Volcanic activity'},{ar:'طبقات متجانسة دقيقة',en:'Homogenous fine layers'},{ar:'حبيبات عديمة الشوائب'}], answer:0, explain:{ar:'التقاطعات والقنوات تشير للنهر.', en:'Cross-bedding and channels indicate fluvial.'}},

    { id: 'g8', q:{ar:'ما معنى “strike” في البنيوية؟', en:'What is "strike" in structural geology?'}, 
      options:[{ar:'اتجاه المستوى',en:'Direction of the plane'},{ar:'زاوية الميل',en:'Dip angle'},{ar:'سرعة الفالق',en:'Fault velocity'},{ar:'نوع الصخر'}], answer:0, explain:{ar:'الـ strike هو اتجاه المستوى.', en:'Strike is the direction of a plane.'}},

    { id: 'g9', q:{ar:'الشقوق (fractures) تؤثر على؟', en:'Fractures most affect?'}, 
      options:[{ar:'نفاذية الصخور',en:'Rock permeability'},{ar:'درجة الحرارة فقط',en:'Temperature only'},{ar:'التركيب الكيميائي فقط',en:'Only chemical composition'},{ar:'الوزن'}], answer:0, explain:{ar:'الشقوق تزيد من نفاذية الصخور.', en:'Fractures increase permeability.'}},

    { id: 'g10', q:{ar:'ماذا تقيّم عند وصف نواة؟', en:'What do you record when describing a core?'}, 
      options:[{ar:'اللون، الحبيبات، البنية',en:'Color, grain, texture'},{ar:'سجل الطقس فقط',en:'Only weather'},{ar:'نوع المضخة',en:'Type of pump used'},{ar:'العمق فقط'}], answer:0, explain:{ar:'وصف النواة يشمل اللون والحبيبات والبنية.', en:'Core description includes color, grain, texture.'}},

    /* --- additional 10 practical + theoretical questions (11-20) --- */
    { id: 'g11', q:{ar:'ما الذي يدل على تراجع البحر (regression) في سجل الرواسب؟', en:'What indicates a marine regression in the sedimentary record?'}, 
      options:[{ar:'تحول الطبقات البحرية إلى رملية/قارية',en:'Transition from marine to sand/terrestrial deposits'},{ar:'زيادة الحفريات البحرية فقط',en:'Only increase in marine fossils'},{ar:'حضور حمم بركانية',en:'Volcanic flows'},{ar:'زيادة الطين فقط'}], answer:0, explain:{ar:'تبدّل من رواسب بحرية إلى رواسب قارية يدل على تراجع البحر.', en:'Shift from marine to terrestrial sediments indicates regression.'}},

    { id: 'g12', q:{ar:'ما الفرق بين الصخور المتحولة والرسوبية؟', en:'Main difference between metamorphic and sedimentary rocks?'}, 
      options:[{ar:'المتحولة تتكون بتغير في النسيج دون انصهار كامل',en:'Metamorphic form by texture/chemical change without full melting'},{ar:'الرسوبية تتكون من بلورات كبيرة',en:'Sedimentary form from large crystals'},{ar:'المتحولة رسوبية بالأساس',en:'Metamorphic are sedimentary'},{ar:'لا فرق'}], answer:0, explain:{ar:'التحول تغيّر نسيجي وكيميائي بدون انصهار كامل.', en:'Metamorphism alters texture/composition without full melting.'}},

    { id: 'g13', q:{ar:'عند أخذ عينات cuttings أثناء الحفر، ماذا تسجل عادةً؟', en:'When collecting cuttings while drilling, what do you normally log?'}, 
      options:[{ar:'عمق كل عينة، لونها، تركيبها وحبيباتها',en:'Depth of sample, color, composition, grain size'},{ar:'فقط وزن العينة',en:'Only sample weight'},{ar:'وقت اليوم فقط',en:'Time of day only'},{ar:'اسم السائق'}], answer:0, explain:{ar:'سجل العينات يتضمن العمق والخصائص الواضحة.', en:'Cuttings logs include depth and observed properties.'}},

    { id: 'g14', q:{ar:'ما النوع الأنسب من التحاليل لتحديد معادن دقيقة؟', en:'Which analysis best identifies fine minerals?'}, 
      options:[{ar:'XRD (X-ray diffraction)',en:'XRD (X-ray diffraction)'},{ar:'قياس pH',en:'pH measurement'},{ar:'قياس الوزن',en:'Weight measurement'},{ar:'اختبار الخدش'}], answer:0, explain:{ar:'XRD يكشف التركيب البلوري للمعادن.', en:'XRD reveals mineral crystalline composition.'}},

    { id: 'g15', q:{ar:'ما الذي يعنيه مصطلح “matrix” في الصخر الرسوبي؟', en:'What does "matrix" mean in a sedimentary rock?'}, 
      options:[{ar:'المادة الناعمة التي تحيط الحبيبات الأكبر',en:'Fine material surrounding larger grains'},{ar:'الإطار الصخري الصلب',en:'Solid rock frame'},{ar:'نوع من الفوالق'},{ar:'مقياس المسام'}], answer:0, explain:{ar:'الماتريكس هو مادة رقيقة تحيط الحبيبات.', en:'Matrix is the fine material between larger grains.'}},

    { id: 'g16', q:{ar:'ما وظيفة بطاقة العينة (Sample label)؟', en:'What is the role of a sample label?'}, 
      options:[{ar:'توثيق معرف العينة، الموقع، والعمق',en:'Document sample ID, location, and depth'},{ar:'تلوين العينة',en:'Color the sample'},{ar:'تسريع الشحن',en:'Speed shipping'},{ar:'لا أهمية'}], answer:0, explain:{ar:'التوثيق يضمن إمكانية تتبع العينة لاحقًا.', en:'Labeling ensures traceability of the sample.'}},

    { id: 'g17', q:{ar:'عند وصف صخر في الحقل، لماذا نذكر presence/absence of fossils؟', en:'Why mention presence/absence of fossils when describing a rock in the field?'}, 
      options:[{ar:'لأنه يحدد بيئة الترسيب والعمر النسبي',en:'Because it indicates depositional environment and relative age'},{ar:'للتجميل',en:'For aesthetics'},{ar:'لأنه يؤثر على الكثافة فقط',en:'Only affects density'},{ar:'لا فائدة'}], answer:0, explain:{ar:'الحفريات تساعد في استنتاج البيئة والعمر.', en:'Fossils help infer environment and relative age.'}},

    { id: 'g18', q:{ar:'ما هو significance of grain size sorting؟', en:'What is the significance of grain size sorting?'}, 
      options:[{ar:'يوضح طاقة الوسط الناقل (قوي أم ضعيف)',en:'Indicates transport energy (high vs low)'},{ar:'يعطي لون الصخر',en:'Gives rock color'},{ar:'مهم للضغط فقط',en:'Important only for pressure'},{ar:'لا يفيد'}], answer:0, explain:{ar:'الفرز يعكس طاقة التيار أثناء الترسيب.', en:'Sorting reflects transport energy during deposition.'}},

    { id: 'g19', q:{ar:'ما الذي يعبر عنه مفهوم “unconformity”?', en:'What does an "unconformity" represent?'}, 
      options:[{ar:'فاصل زمني بين وحدتين رسوبيتين يدل على نقص ترسيب/تآكل',en:'A time gap between deposits indicating erosion/non-deposition'},{ar:'نوع من الفالق',en:'A fault type'},{ar:'تغير في التركيب الكيميائي فقط',en:'Only chemical change'},{ar:'طبقة بركانية'}], answer:0, explain:{ar:'الـ unconformity يمثل فجوة زمنية في السجل الرسوبي.', en:'Unconformity is a time gap in the sedimentary record.'}},

    { id: 'g20', q:{ar:'في تحليل ميداني، لماذا نستخدم الخرائط الطبوغرافية مع الخرائط الجيولوجية؟', en:'Why use topographic maps together with geological maps in field analysis?'}, 
      options:[{ar:'لتحويل الحدود السطحية إلى مقاطع وتحديد الانحدارات الواقعية',en:'To project surface boundaries into sections and determine real slopes'},{ar:'لرسم صور الملصقات فقط',en:'Just to create posters'},{ar:'لأخذ قياسات pH',en:'To measure pH'},{ar:'لا علاقة'}], answer:0, explain:{ar:'الطبوغرافيا تسمح بتحويل الخريطة لمقطع واقعي.', en:'Topography allows projecting maps into realistic cross-sections.'}}
  ],

  'hydro': [
    { id:'h1', q:{ar:'ما هو الخزان الجوفي (Aquifer)?', en:'What is an aquifer?'}, options:[{ar:'طبقة قابلة لتخزين ونقل الماء',en:'Layer capable of storing & transmitting water'},{ar:'جبل من الصخور',en:'A mountain mass'},{ar:'أداة قياس',en:'A measuring device'},{ar:'نوع من النباتات'}], answer:0, explain:{ar:'الخزان الجوفي يسمح بتخزين ونقل المياه.', en:'Aquifer stores & transmits groundwater.'}},

    { id:'h2', q:{ar:'ما الفرق بين البئر الحر والمقيّد؟', en:{ar:'ما الفرق بين البئر الحر والمقيد؟', en:'What is the difference between an unconfined and confined aquifer?'}},
      options:[{ar:'الحرة سطحها متصل بالجو',en:'Unconfined has water table exposed'},{ar:'المقيّدة مفتوحة للسطح',en:'Confined is open to surface'},{ar:'يُعتمدان على نفس الشيء',en:'They are same'},{ar:'لا علاقة'}], answer:0, explain:{ar:'البئر الحر سطح الماء مرتبط بالجو.', en:'Unconfined has its water table open to the atmosphere.'}},

    { id:'h3', q:{ar:'ما الذي تعبر عنه النفاذية (K)?', en:'What does hydraulic conductivity (K) express?'}, options:[{ar:'قدرة الصخور على نقل الماء',en:'Ability of rock to transmit water'},{ar:'مقدار الملوحة',en:'Salinity'},{ar:'درجة الحرارة',en:'Temperature'},{ar:'الوزن'}], answer:0, explain:{ar:'K تعبر عن قدرة النقل.', en:'K quantifies how easily water can move through material.'}},

    { id:'h4', q:{ar:'قانون دارسي يحسب؟', en:'Darcy\'s law computes?'}, options:[{ar:'معدل التدفق Q',en:'Flow rate Q'},{ar:'المسامية',en:'Porosity'},{ar:'الضغط الجوي',en:'Atmospheric pressure'},{ar:'الحرارة'}], answer:0, explain:{ar:'قانون دارسي لحساب Q.', en:'Darcy equation gives flow rate Q.'}},

    { id:'h5', q:{ar:'كيف تقاس منسوبات المياه؟', en:'How are water levels measured?'}, options:[{ar:'باستخدام tape أو piezometer',en:'With tape or piezometer'},{ar:'بالمجهر',en:'Using a microscope'},{ar:'باستخدام GPS فقط',en:'Using GPS only'},{ar:'بالمطر'}], answer:0, explain:{ar:'منسوب الماء يقاس بتاب أو بيزوميتر.', en:'Water level measured with tape or piezometer.'}},

    { id:'h6', q:{ar:'ما معنى T (transmissivity)?', en:'What does transmissivity (T) mean?'}, options:[{ar:'K × b (نفاذية × سمك)',en:'K × b (conductivity × thickness)'},{ar:'K ÷ b',en:'K divided by b'},{ar:'كمية الرواسب',en:'Amount of sediment'},{ar:'درجة الحرارة'}], answer:0, explain:{ar:'T = K × b.', en:'Transmissivity is K times aquifer thickness.'}},

    { id:'h7', q:{ar:'ماذا يدل انخفاض منسوب الماء بسرعة؟', en:'Rapid drawdown in water level indicates?'}, options:[{ar:'سحب زائد/استنزاف',en:'Over-pumping or depletion'},{ar:'زيادة الأمطار',en:'More rainfall'},{ar:'تحسن النفاذية',en:'Improved permeability'},{ar:'تغير في اللون'}], answer:0, explain:{ar:'هبوط سريع يدل على استنزاف.', en:'Rapid decline often due to over-pumping.'}},

    { id:'h8', q:{ar:'ماذا تُقيس EC؟', en:'What does EC measure?'}, options:[{ar:'التوصيلية الكهربائية/الملوحة',en:'Electrical conductivity/salinity'},{ar:'العمق',en:'Depth'},{ar:'السرعة',en:'Speed'},{ar:'الضغط'}], answer:0, explain:{ar:'EC يقيس التوصيلية/الملوحة.', en:'EC measures electrical conductivity (salinity).'}},

    { id:'h9', q:{ar:'اختبار نفاذية ميداني بسيط؟', en:'A simple field permeability test is?'}, options:[{ar:'Permeameter أو infiltrometer',en:'Permeameter or infiltrometer'},{ar:'XRD',en:'XRD'},{ar:'Thin section',en:'Thin section'},{ar:'Spectroscopy'}], answer:0, explain:{ar:'استخدام permeameter شائع.', en:'Permeameter or infiltrometer are common.'}},

    { id:'h10', q:{ar:'ما الذي يؤثر على سرعة الجريان في الخزان؟', en:'What affects groundwater flow speed?'}, options:[{ar:'K, Δh, L',en:'K, Δh, L'},{ar:'الطيف اللوني',en:'Color spectrum'},{ar:'نوع الأحفور',en:'Fossil type'},{ar:'درجة الحرارة فقط'}], answer:0, explain:{ar:'العوامل الرئيسية K, Δh, L.', en:'Key factors are K, hydraulic gradient, and length.'}},

    /* additional hydro questions 11-20 */
    { id:'h11', q:{ar:'ما المقصود بالمنسوب الاستاتيكي (static water level)?', en:'What is static water level?'}, options:[{ar:'مستوى الماء في البئر عندما لا يعمل الضخ',en:'Level when the well is not pumping'},{ar:'عند أعلى مستوى فقط',en:'Only highest level'},{ar:'خلال المطر',en:'During rainfall'},{ar:'لا فائدة'}], answer:0, explain:{ar:'المنسوب الاستاتيكي يقاس بدون ضخ.', en:'Static level measured when no pumping occurs.'}},

    { id:'h12', q:{ar:'ما هو تأثير الطورة الطينية (clay lens) في طبقة ناقلة؟', en:'What is effect of a clay lens within an aquifer?'}, options:[{ar:'يقلل النفاذية ويشكل حاجزاً محلياً',en:'Reduces permeability and forms local barrier'},{ar:'يزيد النفاذية',en:'Increases permeability'},{ar:'لا تأثير',en:'No effect'},{ar:'يزيد الملوحة فقط'}], answer:0, explain:{ar:'عدسة طينية تقلل النفاذية محلياً.', en:'Clay lens reduces permeability locally.'}},

    { id:'h13', q:{ar:'ما الفرق بين recharge و discharge؟', en:'Difference between recharge and discharge?'}, options:[{ar:'recharge إدخال الماء للخزان — discharge إخراجه',en:'Recharge adds water; discharge removes it'},{ar:'هما نفس الشيء',en:'They are same'},{ar:'أسماء لنفس الأداة',en:'Equipment names'},{ar:'غير معلوم'}], answer:0, explain:{ar:'إعادة التغذية مقابل التصريف.', en:'Recharge adds; discharge removes groundwater.'}},

    { id:'h14', q:{ar:'عند اسم المستخدم لقياس Q (m³/day)، أي وحدة مناسبة؟', en:'To express Q in m³/day which conversion is used from m³/s?'}, options:[{ar:'اضرب في 86400',en:'Multiply by 86,400'},{ar:'اقسم على 86400',en:'Divide by 86,400'},{ar:'اضرب في 60',en:'Multiply by 60'},{ar:'اضرب في 3600'}], answer:0, explain:{ar:'1 m³/s × 86400 = m³/day.', en:'Multiply m³/s by 86,400 to get m³/day.'}},

    { id:'h15', q:{ar:'ما هي أهمية اختبار pompage (pumping test)?', en:'Why perform a pumping test?'}, options:[{ar:'تحديد K وT وخواص الخزان',en:'To determine K, T and aquifer properties'},{ar:'لقياس pH فقط',en:'To measure pH only'},{ar:'لتحديد نوع الصخر فقط',en:'To identify rock type'},{ar:'لا أهمية'}], answer:0, explain:{ar:'اختبار الضخ يقيس خواص الخزان.', en:'Pumping tests determine aquifer hydraulic properties.'}},

    { id:'h16', q:{ar:'كيف يمكن التقليل من تأثير over-pumping؟', en:'How to mitigate over-pumping effects?'}, options:[{ar:'تنظيم السحب وإعادة التغذية الصناعي',en:'Regulate pumping and artificial recharge'},{ar:'زيادة المضخات',en:'Increase pumps'},{ar:'تجاهل المشكلة',en:'Ignore it'},{ar:'استخدام أغذية أخرى'}], answer:0, explain:{ar:'التنظيم وإعادة التغذية حلول عملية.', en:'Regulation and artificial recharge are practical solutions.'}},

    { id:'h17', q:{ar:'ما الذي يُعطي clue لتلوث جيوكيميائي في البئر؟', en:'What gives a clue for geochemical contamination in a well?'}, options:[{ar:'ارتفاع EC وتغيرات في أيونات الأملاح',en:'Rising EC and changes in major ions'},{ar:'تغير اللون فقط',en:'Color change only'},{ar:'هبوط الحرارة',en:'Temperature drop'},{ar:'ازدياد الحيوانات'}], answer:0, explain:{ar:'الزيادة في EC تشي بتلوث ملحي/جيوكيميائي.', en:'EC rise often indicates salinity or geochemical contamination.'}},

    { id:'h18', q:{ar:'ما هي وحدة K عادة في الحقول؟', en:'Typical unit of hydraulic conductivity K in field studies?'}, options:[{ar:'m/s أو m/day',en:'m/s or m/day'},{ar:'kg/m3',en:'kg/m3'},{ar:'°C',en:'°C'},{ar:'ppm'}], answer:0, explain:{ar:'K يعبر عنه ب m/s أو m/day.', en:'K is expressed in m/s or m/day.'}},

    { id:'h19', q:{ar:'عند وجود طبقة طينية فوق طبقة رملية، ماذا تتوقع لخاصية الخزان؟', en:'If a clay layer overlies sand, what is expected for aquifer properties?'}, options:[{ar:'خزان مقيد (confined) محتمل',en:'Possible confined aquifer'},{ar:'خزان حر فقط',en:'Only unconfined'},{ar:'زيادة النفاذية',en:'Higher permeability'},{ar:'لا يتأثر'}], answer:0, explain:{ar:'طبقة طينية غير منفذة قد تقيد الخزان.', en:'An overlying clay can create a confined aquifer.'}},

    { id:'h20', q:{ar:'ما الفائدة من مراقبة منسوب المياه على مدى طويل؟', en:'Benefit of long-term water level monitoring?'}, options:[{ar:'تحديد اتجاهات الاستنزاف/تجدد الخزان',en:'Identify trends of depletion/recharge'},{ar:'للحصول على بيانات درجة الحرارة فقط',en:'Only temperature data'},{ar:'لرصد الرياح',en:'Wind monitoring'},{ar:'لا فائدة'}], answer:0, explain:{ar:'المراقبة الطويلة تكشف اتجاهات الخزان.', en:'Long-term monitoring reveals depletion or recharge trends.'}}
  ],

  'petrology': [
    { id:'p1', q:{ar:'ما الفرق بين صخر جوفي وسطحي؟', en:'Difference between intrusive and extrusive?'}, options:[{ar:'التبريد البطيء ينتج بلورات كبيرة',en:'Slow cooling produces large crystals'},{ar:'التبريد السريع ينتج بلورات كبيرة',en:'Fast cooling produces large crystals'},{ar:'لا فرق',en:'No difference'},{ar:'أحدهما رسوبي'}], answer:0, explain:{ar:'الجوفية تبرد ببطء.', en:'Intrusive cool slowly producing large crystals.'}},

    { id:'p2', q:{ar:'أي من التالي حجر رملي كوارتزي؟', en:'Which is quartz arenite?'}, options:[{ar:'حجر رملي نقي كوارتز',en:'Sandstone dominated by quartz'},{ar:'صخر غامق غني بالحديد',en:'Iron-rich dark rock'},{ar:'طفلة غنية بالطين',en:'Clay-rich mudstone'},{ar:'رَخام'}], answer:0, explain:{ar:'Quartz arenite غني بالكوارتز.', en:'Quartz arenite is rich in quartz grains.'}},

    { id:'p3', q:{ar:'ما هو الفرق بين المافية والفيلسية؟', en:'Mafic vs felsic difference?'}, options:[{ar:'مافية غامقة وغنية Fe/Mg',en:'Mafic dark, rich in Fe/Mg'},{ar:'لا فرق',en:'No difference'},{ar:'فلسية غامقة',en:'Felsic is dark'},{ar:'المعادن فقط'}], answer:0, explain:{ar:'المافية غنية بالحديد والمغنيسيوم.', en:'Mafic rocks are Fe/Mg rich and darker.'}},

    { id:'p4', q:{ar:'ماهي النسيج الحبيبي؟', en:'What is phaneritic texture?'}, options:[{ar:'حبيبات مرئية بالعين',en:'Visible grains to naked eye'},{ar:'حبيبات دقيقة جدا',en:'Very fine grains'},{ar:'نسيج زجاجي',en:'Glassy texture'},{ar:'نسيج ومسامية'}], answer:0, explain:{ar:'Phaneritic = coarse visible grains.', en:'Phaneritic texture has visible crystals.'}},

    { id:'p5', q:{ar:'ما الذي تدرسه البتروجرافيا؟', en:'What does petrology study?'}, options:[{ar:'تركيب ونشأة الصخور',en:'Rock composition and origin'},{ar:'حركة الصفائح فقط',en:'Plate movement only'},{ar:'خواص الماء',en:'Water properties'},{ar:'الطقس'}], answer:0, explain:{ar:'Petrology studies rocks origin & composition.', en:'Petrology studies rock composition & genesis.'}},

    { id:'p6', q:{ar:'أي أداة تفحص الحبيبات الدقيقة بالميدان؟', en:'Tool for examining grains in field?'}, options:[{ar:'Hand lens (10x)',en:'Hand lens (10x)'},{ar:'Seismograph',en:'Seismograph'},{ar:'GPS',en:'GPS'},{ar:'Flowmeter'}], answer:0, explain:{ar:'العدسة اليدوية أداة أساسية.', en:'Hand lens is essential in the field.'}},

    { id:'p7', q:{ar:'صخرة نفاذية عالية غالباً تكون؟', en:'High permeability rock often is?'}, options:[{ar:'حجر رملي خشن',en:'Coarse sandstone'},{ar:'طفلة متماسكة',en:'Compact clay'},{ar:'رخام',en:'Marble'},{ar:'غازي'}], answer:0, explain:{ar:'الحجر الرملي الخشن نفاذية عالية.', en:'Coarse sandstone often has high permeability.'}},

    { id:'p8', q:{ar:'ما الذي يدل على تيار عالي طاقة في الترسب؟', en:'What indicates high-energy current in deposition?'}, options:[{ar:'حبيبات خشنة والتقاطعات الطبقية',en:'Coarse grains and cross-bedding'},{ar:'طحالب دقيقة',en:'Fine algae'},{ar:'طبقات متجانسة',en:'Homogenous layers'},{ar:'حفريات بحرية عميقة'}], answer:0, explain:{ar:'الحبيبات الخشنة تقترن بطاقة عالية.', en:'Coarse grains imply high energy.'}},

    { id:'p9', q:{ar:'ما وظيفة thin section في petro؟', en:'Thin section purpose?'}, options:[{ar:'دراسة المعادن تحت المجهر',en:'Study minerals under microscope'},{ar:'قياس النفاذية',en:'Measure permeability'},{ar:'قياس pH',en:'Measure pH'},{ar:'اختبار الخدش'}], answer:0, explain:{ar:'Thin sections للكشف المعدني', en:'Thin sections reveal mineralogy under microscope'}},

    { id:'p10', q:{ar:'أي صخر يتبلور سريعًا على السطح؟', en:'Which rock crystallizes quickly at surface?'}, options:[{ar:'Basalt',en:'Basalt'},{ar:'Granite',en:'Granite'},{ar:'Marble',en:'Marble'},{ar:'Sandstone'}], answer:0, explain:{ar:'Basalt is extrusive and fine-grained.', en:'Basalt extrudes and cools fast producing fine grains.'}},

    /* additional petrology 11-20 */
    { id:'p11', q:{ar:'ما معنى مصطلح "phenocryst"؟', en:'What is a "phenocryst"?'}, options:[{ar:'بلورة كبيرة داخل سائل بركاني',en:'Large crystal in a volcanic rock'},{ar:'نوع من الطين',en:'Type of mud'},{ar:'أداة في المختبر',en:'Lab tool'},{ar:'حبيبات صغيرة فقط'}], answer:0, explain:{ar:'Phenocryst بلورة كبيرة داخل مصفوفة دقيقة.', en:'Phenocryst is a large crystal in a finer groundmass.'}},

    { id:'p12', q:{ar:'أي مقياس يصف الكثافة الظرفية؟', en:'Which metric describes bulk density?'}, options:[{ar:'kg/m³',en:'kg/m³'},{ar:'°C',en:'°C'},{ar:'ppm',en:'ppm'},{ar:'m/s'}], answer:0, explain:{ar:'الكثافة الظرفية تقاس بوحدة kg/m³.', en:'Bulk density is measured in kg/m³.'}},

    { id:'p13', q:{ar:'ما تأثير التجوية الكيميائية على الصخر؟', en:'Effect of chemical weathering on rock?'}, options:[{ar:'تفكك المعادن وتغيير التركيب',en:'Decompose minerals and alter composition'},{ar:'زيادة الكتلة فقط',en:'Increase mass only'},{ar:'يمنع الترسيب',en:'Prevents deposition'},{ar:'لا تأثير'}], answer:0, explain:{ar:'التجوية تغير التركيب المعدني.', en:'Chemical weathering alters mineral composition.'}},

    { id:'p14', q:{ar:'ماذا يعني “sorting” في الحجر الرملي؟', en:'What is "sorting" in sandstone?'}, options:[{ar:'تجانس حجم الحبيبات',en:'Uniformity of grain sizes'},{ar:'اللون',en:'Color'},{ar:'اللمعان',en:'Luster'},{ar:'الانفصام'}], answer:0, explain:{ar:'الفرز يحدد مدى تجانس حجوم الحبيبات.', en:'Sorting indicates grain-size uniformity.'}},

    { id:'p15', q:{ar:'أي عملية تؤدي إلى تكون الحجر الجيري (limestone)?', en:'Which process commonly forms limestone?'}, options:[{ar:'ترسيب كربونات من مياه بحرية وحيوانية',en:'Carbonate deposition from marine waters/organisms'},{ar:'تبريد الحمم',en:'Cooling magma'},{ar:'تجمع طين نهري',en:'River mud accumulation'},{ar:'ضغط فقط'}], answer:0, explain:{ar:'الكلس يتكوّن بتراكم كربونات بحرية.', en:'Limestone forms from carbonate accumulation in marine settings.'}},

    { id:'p16', q:{ar:'ما الذي يشير إلى القياسات البطيئة للتبلور؟', en:'What indicates slow crystallization?'}, options:[{ar:'بلورات كبيرة وبارزة',en:'Large conspicuous crystals'},{ar:'نسيج زجاجي',en:'Glassy texture'},{ar:'طبقات دقيقة',en:'Fine laminations'},{ar:'فواصل'] , answer:0, explain:{ar:'التبريد البطيء يعطي بلورات كبيرة.', en:'Slow cooling produces large crystals.'}},

    { id:'p17', q:{ar:'لماذا نأخذ thin sections؟', en:'Why prepare thin sections?'}, options:[{ar:'لتحليل المعادن تحت المجهر والبنية الدقيقة',en:'To analyze minerals and microtextures'},{ar:'لقياس الوزن',en:'To weigh the sample'},{ar:'للتصوير فقط',en:'For photography only'},{ar:'لفحص الرائحة'}], answer:0, explain:{ar:'Thin sections تكشف البنية الدقيقة.', en:'They reveal mineralogy and fine textures.'}},

    { id:'p18', q:{ar:'أي صخر غني بالسيليكا؟', en:'Which rock is silica-rich?'}, options:[{ar:'Granite',en:'Granite'},{ar:'Basalt',en:'Basalt'},{ar:'Peridotite',en:'Peridotite'},{ar:'Gabbro'}], answer:0, explain:{ar:'الجرانيت غني بالسيليكا.', en:'Granite is silica-rich.'}},

    { id:'p19', q:{ar:'ما الذي يقيس D10 في Hazen formula؟', en:'What does D10 measure in Hazen formula?'}, options:[{ar:'قطر الحبيبات الذي يساوي 10% المار خلال الغربال',en:'Grain diameter at 10% passing'},{ar:'المسامية',en:'Porosity'},{ar:'النفاذية فقط',en:'Permeability only'},{ar:'الوزن النوعي'}], answer:0, explain:{ar:'D10 هو قطر الحبيبات عند 10%، يُستخدم في Hazen.', en:'D10 is grain size at 10% passing, used in Hazen.'}},

    { id:'p20', q:{ar:'ما الذي يدل على أصل بركاني في الرواسب؟', en:'What indicates volcanic origin in deposits?'}, options:[{ar:'وجود رماد بركاني ومادة زجاجية',en:'Presence of volcanic ash and glassy material'},{ar:'طبقات رملية فقط',en:'Only sandstone layers'},{ar:'حفريات بحرية دليلة',en:'Typical marine fossils'},{ar:'نسيج بلوري متداخل'}], answer:0, explain:{ar:'الرماد والزجاج دليل على المنشأ البركاني.', en:'Ash and volcanic glass indicate volcanic origin.'}}
  ],

  'structure': [
    { id:'s1', q:{ar:'ما هو الفالق العادي؟', en:'What is a normal fault?'}, options:[{ar:'انزلاق بفعل الشد',en:'Downward movement due to extension'},{ar:'انزلاق بفعل الضغط',en:'Movement due to compression'},{ar:'فالق جانبي',en:'Strike-slip fault'},{ar:'لا وجود'}], answer:0, explain:{ar:'الفالق العادي يرتبط بالشد.', en:'Normal fault forms under extension.'}},

    { id:'s2', q:{ar:'ما هي الطية المحدبة (anticline)?', en:'What is an anticline?'}, options:[{ar:'طية محدبة لأعلى',en:'Convex-up folding'},{ar:'طية محدبة لأسفل',en:'Concave-down folding'},{ar:'شق في الصخور',en:'Fracture'},{ar:'حوض'}], answer:0, explain:{ar:'الـ anticline محدبة لأعلى.', en:'Anticline is an upfold.'}},

    { id:'s3', q:{ar:'ما أداة قياس strike/dip؟', en:'Tool to measure strike & dip?'}, options:[{ar:'Brunton compass',en:'Brunton compass'},{ar:'Hand lens',en:'Hand lens'},{ar:'Tape measure',en:'Tape measure'},{ar:'GPS'}], answer:0, explain:{ar:'Brunton لقياس strike/dip.', en:'Brunton compass measures strike & dip.'}},

    { id:'s4', q:{ar:'ماذا تعني slickensides؟', en:'What do slickensides indicate?'}, options:[{ar:'حركة على سطح الفالق',en:'Movement on fault surface'},{ar:'تشكيل رسوبي',en:'Depositional feature'},{ar:'خاصية معدنية',en:'Mineral property'},{ar:'علامة تآكل'}], answer:0, explain:{ar:'تشير لاحتكاك على الفالق.', en:'They indicate fault surface movement.'}},

    { id:'s5', q:{ar:'أثر الفوالق على الطبقات؟', en:'Effect of faults on layers?'}, options:[{ar:'تغير استمرارية الطبقات',en:'Disrupt continuity of layers'},{ar:'تزيد المسامية فقط',en:'Increase porosity only'},{ar:'لا تأثير',en:'No effect'},{ar:'تغير اللون'}], answer:0, explain:{ar:'الفوالق تُقطع وتُحرك الطبقات.', en:'Faults offset and displace layers.'}},

    { id:'s6', q:{ar:'ما الفرق بين strike و dip؟', en:'Difference between strike & dip?'}, options:[{ar:'strike اتجاه — dip زاوية الميل',en:'strike = direction, dip = inclination angle'},{ar:'هما نفس الشيء',en:'They are same'},{ar:'أداة',en:'Tool'},{ar:'مصطلح قديم'}], answer:0, explain:{ar:'strike اتجاه والميل هو زاوية.', en:'Strike is direction; dip is angle.'}},

    { id:'s7', q:{ar:'كيف تؤثر الطيات على تصميم الطرق؟', en:'How do folds affect road design?'}, options:[{ar:'تؤثر على استقرار المنحدرات',en:'Affect slope stability'},{ar:'تسهل البناء',en:'Make building easier'},{ar:'لا تأثير',en:'No effect'},{ar:'تغير المناخ'}], answer:0, explain:{ar:'الطيات تغير استقرار المنحدرات.', en:'Folds affect slope geometry and stability.'}},

    { id:'s8', q:{ar:'ما الذي نذكره عند وصف فالق؟', en:'What to note when describing a fault?'}, options:[{ar:'نوع الحركة واتجاهها واندفاعها',en:'Type of movement, direction & offset'},{ar:'اللون فقط',en:'Color only'},{ar:'السمك فقط',en:'Thickness only'},{ar:'الطول فقط'}], answer:0, explain:{ar:'حركته واتجاهه والاندفاع مهمة.', en:'Movement type, direction, and offset matter.'}},

    { id:'s9', q:{ar:'متى يكون الفالق معكوساً؟', en:'When is a reverse fault?'}, options:[{ar:'عندما يتحرك الطرف العلوي لأعلى',en:'When hanging wall moves up'},{ar:'عندما يتحرك لأسفل',en:'When hanging wall moves down'},{ar:'عند انقسام الصخور فقط',en:'When rocks split only'},{ar:'عند الترسيب'}], answer:0, explain:{ar:'الفالق المعكوس يرفع الطرف العلوي.', en:'Reverse fault uplifts the hanging wall.'}},

    { id:'s10', q:{ar:'كيف نرسم مقطع جيولوجي؟', en:'How to draw a geological cross-section?'}, options:[{ar:'نستخدم خريطة السطح ونحولها إلى مقطع بمقاييس',en:'Use surface map and project to a scaled cross-section'},{ar:'نرسم عشوائياً',en:'Draw randomly'},{ar:'نحسب pH',en:'Compute pH'},{ar:'نقيس السرعة فقط'}], answer:0, explain:{ar:'نحوّل حدود الخريطة إلى مقطع بسلاسة.', en:'Project map boundaries into a scaled section.'}},

    /* additional structural 11-20 */
    { id:'s11', q:{ar:'ما معنى "hanging wall"؟', en:'What is the hanging wall?'}, options:[{ar:'الكتلة أعلى سطح الفالق',en:'Block above the fault plane'},{ar:'الكتلة أسفل الفالق',en:'Block below the fault'},{ar:'نوع من الصخور',en:'Type of rock'},{ar:'أداة قياس'}], answer:0, explain:{ar:'hanging wall هي الكتلة فوق الفالق.', en:'Hanging wall is the block above the fault plane.'}},

    { id:'s12', q:{ar:'ما مؤشرًا على وجود فالق طولاني (strike-slip)?', en:'An indicator of strike-slip fault?'}, options:[{ar:'تحرك أفقي موازٍ للـ strike',en:'Horizontal movement parallel to strike'},{ar:'حركة رأسية كبيرة',en:'Large vertical movement'},{ar:'ترسب بحري',en:'Marine deposition'},{ar:'تجوية'}], answer:0, explain:{ar:'الانزلاق الجانبي حركة أفقية.', en:'Strike-slip involves horizontal displacement.'}},

    { id:'s13', q:{ar:'كيف تقاس زاوية الميل (dip)?', en:'How to measure dip angle?'}, options:[{ar:'باستخدام Brunton وقياس الزاوية على قطعة من السطح',en:'Use a Brunton to measure angle on the plane'},{ar:'بالعين المجردة',en:'By sight only'},{ar:'بمقياس الوزن',en:'Using a weight scale'},{ar:'بالمجهر'}], answer:0, explain:{ar:'Brunton أداة قياس الميل.', en:'Brunton compass measures dip angle.'}},

    { id:'s14', q:{ar:'ما تأثير الفوالق على تدفق المياه الجوفية؟', en:'Effect of faults on groundwater flow?'}, options:[{ar:'يمكن أن تكون قناة أو حاجز تبعاً للمادة الحاجزة',en:'They can act as conduit or barrier depending on fault materials'},{ar:'تزيد الحرارة فقط',en:'Increase temperature only'},{ar:'لا تأثير',en:'No effect'},{ar:'تغير اللون'}], answer:0, explain:{ar:'الفالق قد يفتح طريقاً للمياه أو يمنعها.', en:'Faults may channel or block groundwater.'}},

    { id:'s15', q:{ar:'ما الذي يظهر على السطح كدليل على فالق نشط؟', en:'What surface evidence suggests an active fault?'}, options:[{ar:'انزياح حديث في التضاريس وخدوش/كتل مقلوبة',en:'Recent offsets in topography and scarps'},{ar:'وجود طبقات ناعمة',en:'Presence of fine layers'},{ar:'تجمع النبات فقط',en:'Vegetation only'},{ar:'تغير لون التربة فقط'}], answer:0, explain:{ar:'انزياح التضاريس دليل نشاط فالق حديث.', en:'Topographic offsets indicate recent fault activity.'}},

    { id:'s16', q:{ar:'كيف تميّز anticline عن syncline في الحقل؟', en:'How to distinguish anticline from syncline in the field?'}, options:[{ar:'anticline يظهر أقدم الطبقات في المركز',en:'anticline has older rocks at the core'},{ar:'anticline له طبقات حديثة في المركز',en:'anticline has younger core'},{ar:'هما نفس الشيء',en:'They are same'},{ar:'لا يمكن التفريق'}], answer:0, explain:{ar:'anticline أقدم في المركز.', en:'Anticline contains older rocks at its core.'}},

    { id:'s17', q:{ar:'ما دور الملاحظات الميدانية في رسم الخرائط البنيوية؟', en:'Role of field observations in structural mapping?'}, options:[{ar:'توفير قياسات strike/dip وعلامات الحركة لفهم البنية',en:'Provide strike/dip measurements and movement indicators'},{ar:'لتجميل الخريطة فقط',en:'For map aesthetics only'},{ar:'تستخدم فقط في المختبر',en:'Only lab use'},{ar:'لا دور'}], answer:0, explain:{ar:'القياسات الميدانية هي الأساس لرسم الخرائط.', en:'Field measurements form the basis of structural maps.'}},

    { id:'s18', q:{ar:'ما الذي تعنيه عبارة "fold axis"?', en:'What is a fold axis?'}, options:[{ar:'الخط الذي يمر بمركز الطية ويحدد اتجاهها',en:'Line passing through fold core defining orientation'},{ar:'فاصل طبقي',en:'Layer boundary'},{ar:'قاع الوادي',en:'Valley bottom'},{ar:'نوع من الصدوع'}], answer:0, explain:{ar:'محور الطية يحدد اتجاهها.', en:'Fold axis defines fold orientation.'}},

    { id:'s19', q:{ar:'ماذا تفعل إذا وجدت فالق مرئي قرب طريق؟', en:'What to do if a fault is observed near a road?'}, options:[{ar:'إبلاغ مهندس الجيولوجي والهندسة لإجراء دراسة استقرار',en:'Report to geologist/engineers for stability study'},{ar:'تجاهله',en:'Ignore it'},{ar:'تغطيته فقط',en:'Cover it'},{ar:'قياس pH'}], answer:0, explain:{ar:'إبلاغ المختصين واجراء دراسات استقرار أمر ضروري.', en:'Inform specialists and carry out stability studies.'}},

    { id:'s20', q:{ar:'لماذا نستخدم stereonet في البنيوية؟', en:'Why use stereonet in structural geology?'}, options:[{ar:'لتحليل اتجاهات الطيات والفوالق ثلاثياً',en:'To analyze fold and fault orientations in 3D'},{ar:'لقياس pH',en:'To measure pH'},{ar:'لرسم الخرائط فقط',en:'Map drawing only'},{ar:'للتصوير'}], answer:0, explain:{ar:'Stereonet أداة تحليلية ثلاثية الأبعاد.', en:'Stereonet is a 3D orientation analysis tool.'}}
  ],

  'mineralogy': [
    { id:'m1', q:{ar:'ما هو معدن؟', en:'What is a mineral?'}, options:[{ar:'مادة صلبة متجانسة بتركيب كيميائي ونظام بلوري',en:'A solid homogeneous substance with chemical composition & crystalline structure'},{ar:'مزيج من معادن',en:'A mix of minerals'},{ar:'صخر رسوبي',en:'A sedimentary rock'},{ar:'مادة سائلة'}], answer:0, explain:{ar:'المعدن مادة نقية ومحددة التركيب.', en:'A mineral has fixed chemistry and crystal structure.'}},

    { id:'m2', q:{ar:'ما الخاصية التي تحدد الصلادة؟', en:'Which property measures hardness?'}, options:[{ar:'مقياس Mohs',en:'Mohs scale'},{ar:'الانفصام',en:'Cleavage'},{ar:'اللمعان',en:'Luster'},{ar:'اللون'}], answer:0, explain:{ar:'مقياس Mohs يُستخدم لصلادة المعادن.', en:'Mohs scale measures mineral hardness.'}},

    { id:'m3', q:{ar:'ما الذي يحدد الانفصام؟', en:'What is cleavage?'}, options:[{ar:'ميل المعدن للانقسام على أسطح مستوية',en:'Tendency to split on flat planes'},{ar:'اللون',en:'Color'},{ar:'الصلادة',en:'Hardness'},{ar:'اللمعان'}], answer:0, explain:{ar:'الانفصام يعكس اتجاهات التحطم.', en:'Cleavage reflects preferred planes of breakage.'}},

    { id:'m4', q:{ar:'أي أداة سريعة للتعرف الميداني؟', en:'Which quick tool for field ID?'}, options:[{ar:'hand lens 10x',en:'hand lens 10x'},{ar:'flowmeter',en:'flowmeter'},{ar:'tape measure',en:'tape measure'},{ar:'seismograph'}], answer:0, explain:{ar:'العدسة أداة ميدانية أساسية.', en:'Hand lens is a basic field tool.'}},

    { id:'m5', q:{ar:'هل اللون مؤشر ثابت للهوية؟', en:'Is color a reliable diagnostic?'}, options:[{ar:'لا دائماً — اللون متغير',en:'Not always — color can vary'},{ar:'نعم دائمًا',en:'Yes always'},{ar:'لا علاقة',en:'No relation'},{ar:'يحدد الكثافة فقط'}], answer:0, explain:{ar:'اللون قد يتغير بفعل الشوائب.', en:'Color may vary due to impurities.'}},

    { id:'m6', q:{ar:'ما فائدة اختبار الخدش؟', en:'Purpose of scratch test?'}, options:[{ar:'تحديد الصلادة',en:'Determine hardness'},{ar:'قياس الحجم',en:'Measure size'},{ar:'تحديد اللون',en:'Determine color'},{ar:'قياس النفاذية'}], answer:0, explain:{ar:'الخدش يقيس الصلادة وفق Mohs.', en:'Scratch test checks hardness per Mohs scale.'}},

    { id:'m7', q:{ar:'ما المقصود بالspecific gravity؟', en:'What is specific gravity?'}, options:[{ar:'نسبة كثافة المعدن إلى الماء',en:'Ratio of mineral density to water'},{ar:'اللمعان',en:'Luster'},{ar:'الانفصام',en:'Cleavage'},{ar:'اللون'}], answer:0, explain:{ar:'SG = ρ_mineral / ρ_water', en:'SG = mineral density relative to water.'}},

    { id:'m8', q:{ar:'ما الذي يحدد اللمعان؟', en:'What does luster describe?'}, options:[{ar:'مظهر سطح منعكس للضوء',en:'Appearance of reflected light'},{ar:'الوزن',en:'Weight'},{ar:'الصلادة',en:'Hardness'},{ar:'الانفصام'}], answer:0, explain:{ar:'اللمعان وصف سلوك السطح الضوئي.', en:'Luster describes surface reflectivity.'}},

    { id:'m9', q:{ar:'لماذا thin section مهم؟', en:'Why thin section is important?'}, options:[{ar:'لدراسة البنية المعدنية بالمجهر',en:'Allows microscopic mineral study'},{ar:'لقياس pH',en:'To measure pH'},{ar:'لقياس النفاذية',en:'To measure permeability'},{ar:'لفحص الكثافة فقط'}], answer:0, explain:{ar:'Thin section يكشف التفاصيل الدقيقة.', en:'Thin section reveals fine mineral textures.'}},

    { id:'m10', q:{ar:'ما أهمية تحديد المعادن في الميدان؟', en:'Why identify minerals in the field?'}, options:[{ar:'يفيد في استنتاج الأصل والبيئة الرسوبية',en:'Helps infer origin & depositional environment'},{ar:'لأغراض زخرفية فقط',en:'Only decorative'},{ar:'لا فائدة',en:'No use'},{ar:'لمعرفة الوزن فقط'}], answer:0, explain:{ar:'التعرف يساعد في استنتاج البيئات.', en:'Identification helps infer depositional/environmental conditions.'}},

    /* additional mineralogy 11-20 */
    { id:'m11', q:{ar:'ما الفرق بين cleavage و fracture؟', en:'Difference between cleavage and fracture?'}, options:[{ar:'cleavage انقسام على أسطح مستوية — fracture انكسار غير منتظم',en:'cleavage = flat planes, fracture = irregular break'},{ar:'هما نفس الشيء',en:'They are the same'},{ar:'cleavage لون و fracture حجم',en:'cleavage = color, fracture = size'},{ar:'لا وجود'}], answer:0, explain:{ar:'الانفصام أسطح منظمة، الانكسار غير منتظم.', en:'Cleavage produces flat planes; fracture is irregular.'}},

    { id:'m12', q:{ar:'ما الذي يعطي صلادة أعلى على مقياس Mohs؟', en:'Which mineral has higher Mohs hardness?'}, options:[{ar:'الماس (Diamond)',en:'Diamond'},{ar:'التلك (Talc)',en:'Talc'},{ar:'جبس (Gypsum)',en:'Gypsum'},{ar:'فلسبار (Feldspar)'}], answer:0, explain:{ar:'الماس أعلى صلادة 10 على مقياس Mohs.', en:'Diamond is highest with Mohs hardness 10.'}},

    { id:'m13', q:{ar:'ما هي الcleavage directions؟', en:'What are cleavage directions?'}, options:[{ar:'اتجاهات الانقسام البلورية في المعدن',en:'Preferred crystalline planes of breakage'},{ar:'اتجاهات الرياح',en:'Wind directions'},{ar:'خطوط الطول والعرض',en:'Longitude/latitude'},{ar:'حجم الحبيبات'}], answer:0, explain:{ar:'هي أسطح انقسام متكررة في البلورة.', en:'They are repeated planes of breakage in crystals.'}},

    { id:'m14', q:{ar:'كيف نستخدم specific gravity ميدانيًا؟', en:'How is specific gravity used in field?'}, options:[{ar:'للتفريق بين المعادن الثقيلة والخفيفة',en:'To separate heavy from light minerals'},{ar:'لقياس pH',en:'To measure pH'},{ar:'لقياس السرعة',en:'To measure speed'},{ar:'لا نستخدمها'}],