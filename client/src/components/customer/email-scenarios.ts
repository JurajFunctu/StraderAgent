// 20 Realistic Email Scenarios for Strader Agent
// Covering all client pain points from the audit

export interface EmailScenario {
  id: number;
  from: string;
  fromCompany: string;
  subject: string;
  body: string;
  receivedAt: string;
  status: string;
  aiSuggestedAction: string;
  aiConfidence: string;
  assignedOzId: number | null;
  assignedOzName: string | null;
  customerId: number;
  hasDuplicateResponse: boolean;
  responseTime: number | null; // in minutes
  scenario: string;
}

export const emailScenarios: EmailScenario[] = [
  // Email 1: Simple order
  {
    id: 1,
    from: 'jan.horak@hagardhal.sk',
    fromCompany: 'HagardHal s.r.o.',
    subject: 'Objednávka žľab a výložníky',
    body: 'Dobrý deň,\n\npotrebujem objednať:\n50ks žľab KZL100x60/3\n200ks výložník BWS300\n\nTermín dodania: do konca týždňa\nS pozdravom,\nJán Horák',
    receivedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'create-quote',
    aiConfidence: '95',
    assignedOzId: 1,
    assignedOzName: 'Ján Novák',
    customerId: 1,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'simple-order'
  },

  // Email 2: Complex project with large document
  {
    id: 2,
    from: 'technik@profitech.sk',
    fromCompany: 'ProfiTech a.s.',
    subject: 'Výberové konanie - káblov systémy pre výrobnú halu',
    body: 'Dobrý deň,\n\nv prílohe zasielam 5-stranovú projektovú dokumentáciu pre novú výrobnú halu. AI by malo extrahovať tieto 4 hlavné položky:\n- Káblové žľaby KZL pre 280m trasy\n- Prípojnicový systém PS-630A pre 45m\n- Stropné kotvenie kompletné\n- LED osvetlenie pre priemyselné priestory\n\nProsím o cenovú ponuku do 3 dní.\n\nS pozdravom,\nIng. Peter Novák',
    receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'extract-and-quote',
    aiConfidence: '89',
    assignedOzId: null,
    assignedOzName: null,
    customerId: 2,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'complex-project'
  },

  // Email 3: EDI order from HagardHal
  {
    id: 3,
    from: 'edi@hagardhal.sk',
    fromCompany: 'HagardHal s.r.o.',
    subject: 'EDI Objednávka #EDI-HH-2024-0892',
    body: '[EDI FORMAT]\nORDER_ID: EDI-HH-2024-0892\nCUSTOMER: HagardHal s.r.o.\nDATE: 2024-02-25\n\nLINE_ITEMS:\n1. KMO-300 | Káblový mostík KM-300 | QTY:100 | PRICE:12.50\n2. SVO-M8 | Svorka KS-M8 | QTY:400 | PRICE:0.85\n\nTOTAL: 1590.00 EUR\nDELIVERY: 2024-03-02',
    receivedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'processed',
    aiSuggestedAction: 'auto-confirm-edi',
    aiConfidence: '98',
    assignedOzId: 1,
    assignedOzName: 'Ján Novák',
    customerId: 1,
    hasDuplicateResponse: false,
    responseTime: 3,
    scenario: 'edi-order'
  },

  // Email 4: Incomplete inquiry
  {
    id: 4,
    from: 'm.vargova@profistav.sk',
    fromCompany: 'ProfiStav s.r.o.',
    subject: 'Dopyt - žľab na strop',
    body: 'Potrebujem žľab na strop, celkom asi 150m.\n\nAká je cena?\n\nMária Vargová',
    receivedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'request-info',
    aiConfidence: '72',
    assignedOzId: null,
    assignedOzName: null,
    customerId: 3,
    hasDuplicateResponse: true, // 2 OZ responded!
    responseTime: null,
    scenario: 'incomplete'
  },

  // Email 5: Price inquiry for catalogue
  {
    id: 5,
    from: 'nakup@stavmat.sk',
    fromCompany: 'StavMat s.r.o.',
    subject: 'Cenový dopyt - LED panely a zásuvky',
    body: 'Dobrý deň,\n\nprosím o aktuálne ceny:\n- LED panel 60x60 40W (potrebujem 25ks)\n- Zásuvka ABB Tango (50ks)\n\nĎakujem,\nAndrea Mináriková',
    receivedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'respond-prices',
    aiConfidence: '91',
    assignedOzId: 2,
    assignedOzName: 'Peter Horváth',
    customerId: 5,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'price-inquiry'
  },

  // Email 6: Complaint - wrong items delivered
  {
    id: 6,
    from: 'martin.novak@kabelpro.sk',
    fromCompany: 'KábelPro s.r.o.',
    subject: 'REKLAMÁCIA - Chybné položky v dodávke DL-2024-0876',
    body: 'Dobrý deň,\n\nv dnešnej dodávke DL-2024-0876 sme našli nasledovné problémy:\n\n- Namiesto Žľab KZL100x60 prišiel KZL80x50 (100ks)\n- Chýba 50ks Svorka KS-M8\n- 20ks káblových mostíkov je poškodených\n\nProsím o urýchlené riešenie, projekt stojí!\n\nMartin Novák\nTel: +421 905 123 456',
    receivedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'open-complaint',
    aiConfidence: '88',
    assignedOzId: 3,
    assignedOzName: 'Mária Kováčová',
    customerId: 7,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'complaint'
  },

  // Email 7: Follow-up on existing order
  {
    id: 7,
    from: 'eva.tothova@megastav.sk',
    fromCompany: 'MegaStav a.s.',
    subject: 'Kedy bude dodanie objednávky #1847?',
    body: 'Dobrý deň,\n\nrád by som sa opýtal kedy príde naša objednávka #1847 z 18.02?\n\nMali sme dodanie do 5 pracovných dní, už je 25.02.\n\nEva Tóthová',
    receivedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'check-order-status',
    aiConfidence: '92',
    assignedOzId: null,
    assignedOzName: null,
    customerId: 8,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'order-status'
  },

  // Email 8: Invoice correction request
  {
    id: 8,
    from: 'm.balog@elektropro.sk',
    fromCompany: 'ElektroPro s.r.o.',
    subject: 'Chyba vo faktúre FA-2024/1802',
    body: 'Dobrý deň,\n\nvo faktúre FA-2024/1802 je chyba v množstve:\n\nFakturované: Káblový systém KS-200 - 120ks\nSkutočne dodané: 100ks\n\nProsím o dobropis na rozdiel 20ks.\n\nMichal Balog',
    receivedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'create-credit-note',
    aiConfidence: '85',
    assignedOzId: 4,
    assignedOzName: 'Anna Szabó',
    customerId: 9,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'invoice-correction'
  },

  // Email 9: New customer first contact
  {
    id: 9,
    from: 'miroslav.sedlak@novyfirma.sk',
    fromCompany: 'Nový zákazník - Sedlák s.r.o.',
    subject: 'Prvý kontakt - dopyt na káblové systémy',
    body: 'Dobrý deň,\n\nsme nová firma a hľadáme dodávateľa káblových systémov.\n\nPotrebujeme:\n- Káblový systém KS-200: 120m\n- Prípojnicový systém PS-400A: 10ks\n\nMôžete nám poslať cenovú ponuku?\n\nMiroslav Sedlák\nSedlák s.r.o.\nIČO: 12345678',
    receivedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'create-customer',
    aiConfidence: '68',
    assignedOzId: null,
    assignedOzName: null,
    customerId: 16,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'new-customer'
  },

  // Email 10: URGENT order
  {
    id: 10,
    from: 'b.kovac@elektrostav.sk',
    fromCompany: 'ElektroStav a.s.',
    subject: '🔴 URGENTNÉ - Potrebujeme kábel ZAJTRA!',
    body: 'URGENTNÉ!\n\nProjekt stojí, potrebujeme ZAJTRA:\n\n- Kábel CYKY 5x16mm2: 500m\n- Inštalačná trubka 320N: 200m\n\nMôžete stihnúť dodanie do zajtra do 10:00?\n\nPlatíme OKAMŽITE.\n\nBranislav Kováč\nTel: +421 907 111 222',
    receivedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'escalate-urgent',
    aiConfidence: '95',
    assignedOzId: 1,
    assignedOzName: 'Ján Novák',
    customerId: 4,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'urgent'
  },

  // Email 11: Recurring monthly order from VIP
  {
    id: 11,
    from: 'jan.horak@hagardhal.sk',
    fromCompany: 'HagardHal s.r.o.',
    subject: 'Pravidelná mesačná objednávka - február 2024',
    body: 'Dobrý deň,\n\npravidelná mesačná objednávka podľa rámcovej zmluvy:\n\n- Káblový systém KS-200: 80m\n- Upevňovacia sada US-200: 40ks\n\nDodanie ako vždy na sklad Košice.\n\nĎakujem,\nJán Horák',
    receivedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: 'processed',
    aiSuggestedAction: 'auto-process',
    aiConfidence: '96',
    assignedOzId: 1,
    assignedOzName: 'Ján Novák',
    customerId: 1,
    hasDuplicateResponse: false,
    responseTime: 8,
    scenario: 'recurring-vip'
  },

  // Email 12: Technical question
  {
    id: 12,
    from: 'roman.kocur@techinstall.sk',
    fromCompany: 'TechInstall s.r.o.',
    subject: 'Technický dotaz - nosnosť žľabu KZL',
    body: 'Dobrý deň,\n\npotreboval by som vedieť akú nosnosť má žľab KZL100x60 pri rozpätí 3m?\n\nAké sú odporúčané maximálne rozostupy závesov?\n\nMáte k dispozícii statický posudok?\n\nRoman Kocúr',
    receivedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'respond-technical',
    aiConfidence: '73',
    assignedOzId: null,
    assignedOzName: null,
    customerId: 12,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'technical-question'
  },

  // Email 13: Request for samples
  {
    id: 13,
    from: 'pavol.hudak@novyzakaznik.sk',
    fromCompany: 'Nový zákazník - Hudák elektroinštalácie',
    subject: 'Žiadosť o vzorky produktov',
    body: 'Dobrý deň,\n\nradi by sme otestovali Vaše produkty pred väčšou objednávkou.\n\nMôžete nám poslať vzorky:\n- Káblový žľab KZL100x60 (2-3m)\n- Káblový mostík (1-2ks)\n\nV prípade spokojnosti plánujeme objednávku na cca 150m systémov.\n\nPavol Hudák',
    receivedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'prepare-samples',
    aiConfidence: '82',
    assignedOzId: 2,
    assignedOzName: 'Peter Horváth',
    customerId: 14,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'samples'
  },

  // Email 14: Large tender for municipality
  {
    id: 14,
    from: 'verejne.obstaravanie@mestoprešov.sk',
    fromCompany: 'Mesto Prešov',
    subject: 'Výberové konanie - Modernizácia verejného osvetlenia',
    body: 'Dobrý deň,\n\nMesto Prešov vyhlasuje výberové konanie na modernizáciu verejného osvetlenia.\n\nPotrebujeme ponuku na:\n- Stĺp verejného osvetlenia VO-8m: 45ks\n- LED svietidlo VO 150W: 45ks\n- Káblový box podzemný: 45ks\n\nTermín podania ponuky: 10.03.2024\nPredpokladaná hodnota: 50 000 EUR\n\nJozef Mrva\nOddelenie verejného obstarávania',
    receivedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'prepare-tender',
    aiConfidence: '89',
    assignedOzId: null,
    assignedOzName: null,
    customerId: 10,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'tender'
  },

  // Email 15: Order modification
  {
    id: 15,
    from: 'l.zitny@elektromontaz.sk',
    fromCompany: 'ElektroMontáž s.r.o.',
    subject: 'Zmena objednávky #1534',
    body: 'Dobrý deň,\n\npotrebujeme upraviť objednávku #1534:\n\nPôvodne:\n- LED panel 60x60: 25ks\n- Zásuvka ABB: 50ks\n\nNové množstvo:\n- LED panel 60x60: 15ks (zníženie)\n- Zásuvka ABB: 30ks (zníženie)\n\nMôžete prepočítať cenovú ponuku?\n\nLadislav Žitný',
    receivedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'modify-order',
    aiConfidence: '76',
    assignedOzId: 5,
    assignedOzName: 'Tomáš Varga',
    customerId: 15,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'order-modification'
  },

  // Email 16: Late delivery complaint
  {
    id: 16,
    from: 'z.kralikova@stavbyplus.sk',
    fromCompany: 'StavbyPlus s.r.o.',
    subject: 'Sťažnosť na oneskorené dodanie',
    body: 'Dobrý deň,\n\nobjednávka #1678 mala byť dodaná 22.02., dnes je 25.02. a stále nič.\n\nProj zastavený, máme penále od investora!\n\nKedy príde dodávka?? Toto je už druhýkrát čo sa to stalo!\n\nZuzana Králiková\nTel: +421 905 888 999',
    receivedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'escalate-logistics',
    aiConfidence: '91',
    assignedOzId: null,
    assignedOzName: null,
    customerId: 13,
    hasDuplicateResponse: true, // Duplicate response detected!
    responseTime: null,
    scenario: 'late-delivery-complaint'
  },

  // Email 17: Frame contract renewal
  {
    id: 17,
    from: 'k.buckova@energobuild.sk',
    fromCompany: 'EnergoBuild a.s.',
    subject: 'Predĺženie rámcovej zmluvy',
    body: 'Dobrý deň,\n\nnaša rámcová zmluva RZ-2023-045 vyprší 31.03.2024.\n\nRadi by sme ju predĺžili o ďalší rok s podobnými podmienkami.\n\nMôžeme sa stretnúť na rokovanie?\n\nKatarína Bučková\nObchodný riaditeľ',
    receivedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'prepare-frame-contract',
    aiConfidence: '79',
    assignedOzId: 1,
    assignedOzName: 'Ján Novák',
    customerId: 17,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'frame-contract'
  },

  // Email 18: Foreign language (Czech)
  {
    id: 18,
    from: 'filip.grega@instalpro.cz',
    fromCompany: 'InstalPro s.r.o. (CZ)',
    subject: 'Poptávka kabelových systémů',
    body: 'Dobrý den,\n\npotřebujeme nabídku na kabelové systémy pro nový projekt.\n\nJedná se o:\n- 200m kabelových tras\n- 15ks rozvaděčů\n- kompletní upevňovací systém\n\nMůžete poslat cenovou nabídku v CZK?\n\nFilip Grega',
    receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'translate-and-process',
    aiConfidence: '94',
    assignedOzId: 2,
    assignedOzName: 'Peter Horváth',
    customerId: 18,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'foreign-language'
  },

  // Email 19: EDI error
  {
    id: 19,
    from: 'edi@hagardhal.sk',
    fromCompany: 'HagardHal s.r.o.',
    subject: 'EDI chyba - cenový nesúlad #EDI-HH-2024-0895',
    body: '[EDI ERROR REPORT]\nORDER_ID: EDI-HH-2024-0895\nERROR: PRICE_MISMATCH\n\nDETAIL:\nItem: KMO-300 | EDI Price: 12.50 | System Price: 14.80 | Diff: -2.30\nItem: SVO-M8 | EDI Price: 0.85 | System Price: 0.90 | Diff: -0.05\n\nCelkový rozdiel: 248.00 EUR\n\nProsím overiť aktuálny cenník.',
    receivedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'pause-edi-order',
    aiConfidence: '72',
    assignedOzId: 1,
    assignedOzName: 'Ján Novák',
    customerId: 1,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'edi-error'
  },

  // Email 20: New products inquiry
  {
    id: 20,
    from: 'igor.benko@bardejov.sk',
    fromCompany: 'Mesto Bardejov',
    subject: 'Dopyt - alternatívy k osvetľovaciemu stĺpu',
    body: 'Dobrý deň,\n\npotrebujeme nahradiť staré osvetľovacie stĺpy.\n\nAké máte alternatívy k stĺpu VO-8m?\n\nPotrebujeme:\n- Vyššiu životnosť\n- Nižšiu spotrebu\n- LED technológiu\n\nCelkom 28ks.\n\nIgor Benko\nOddelenie investícií',
    receivedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    status: 'new',
    aiSuggestedAction: 'suggest-alternatives',
    aiConfidence: '86',
    assignedOzId: null,
    assignedOzName: null,
    customerId: 19,
    hasDuplicateResponse: false,
    responseTime: null,
    scenario: 'new-products'
  },
];

// Sales reps data
export const salesReps = [
  { id: 1, name: 'Ján Novák', region: 'Prešov', workload: 12, avgResponseTime: 8 },
  { id: 2, name: 'Peter Horváth', region: 'Košice', workload: 8, avgResponseTime: 11 },
  { id: 3, name: 'Mária Kováčová', region: 'Žilina', workload: 15, avgResponseTime: 14 },
  { id: 4, name: 'Anna Szabó', region: 'Bratislava', workload: 10, avgResponseTime: 9 },
  { id: 5, name: 'Tomáš Varga', region: 'Banská Bystrica', workload: 6, avgResponseTime: 12 },
];
