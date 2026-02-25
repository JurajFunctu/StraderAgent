import { db } from './db.js';
import * as schema from './schema.js';

async function seed() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await db.delete(schema.productComponents);
  await db.delete(schema.dashboardStats);
  await db.delete(schema.orders);
  await db.delete(schema.deliveryNotes);
  await db.delete(schema.invoices);
  await db.delete(schema.products);
  await db.delete(schema.emails);
  await db.delete(schema.customers);
  await db.delete(schema.salesReps);

  console.log('✓ Cleared existing data');

  // Insert sales reps
  const salesRepsData = [
    { name: 'Ján Novák', location: 'Košice', email: 'jan.novak@strader.sk' },
    { name: 'Peter Horváth', location: 'Prešov', email: 'peter.horvath@strader.sk' },
    { name: 'Mária Kováčová', location: 'Stropkov', email: 'maria.kovacova@strader.sk' },
    { name: 'Tomáš Varga', location: 'Bratislava', email: 'tomas.varga@strader.sk' },
    { name: 'Anna Szabó', location: 'Košice', email: 'anna.szabo@strader.sk' },
    { name: 'Martin Dudáš', location: 'Prešov', email: 'martin.dudas@strader.sk' },
    { name: 'Eva Lukáčová', location: 'Bratislava', email: 'eva.lukacova@strader.sk' },
  ];

  const reps = await db.insert(schema.salesReps).values(salesRepsData).returning();
  console.log(`✓ Inserted ${reps.length} sales reps`);

  // Insert customers
  const customersData = [
    { name: 'Jozef Halász', company: 'HagardHal s.r.o.', email: 'objednavky@hagardhal.sk', phone: '+421 905 123 456', assignedOzId: reps[0].id, segment: 'VIP', creditTerms: 60, discount: '5.00' },
    { name: 'Marián Kovács', company: 'Elektro Centrum Košice', email: 'info@elektrocentrum.sk', phone: '+421 915 234 567', assignedOzId: reps[1].id, segment: 'Stredný', creditTerms: 30, discount: '2.50' },
    { name: 'Peter Szabó', company: 'ProfiStav s.r.o.', email: 'objednavky@profistav.sk', phone: '+421 903 345 678', assignedOzId: reps[2].id, segment: 'Veľký', creditTerms: 45, discount: '3.00' },
    { name: 'Anna Molnárová', company: 'StavMat Plus', email: 'stavmat@stavmat.sk', phone: '+421 917 456 789', assignedOzId: reps[3].id, segment: 'Stredný', creditTerms: 30, discount: '2.00' },
    { name: 'Michal Tóth', company: 'TechnoEnergia a.s.', email: 'techno@technoenergia.sk', phone: '+421 902 567 890', assignedOzId: reps[4].id, segment: 'VIP', creditTerms: 60, discount: '4.50' },
    { name: 'Katarína Vargová', company: 'ElektroMontáž SK', email: 'info@elektromontaz.sk', phone: '+421 911 678 901', assignedOzId: reps[5].id, segment: 'Malý', creditTerms: 21, discount: '1.00' },
    { name: 'Ján Balog', company: 'Balog Elektro', email: 'balog@balog-elektro.sk', phone: '+421 908 789 012', assignedOzId: reps[6].id, segment: 'Stredný', creditTerms: 30, discount: '2.50' },
    { name: 'Eva Nagyová', company: 'Elektroservis Prešov', email: 'servis@elektroservis.sk', phone: '+421 904 890 123', assignedOzId: reps[0].id, segment: 'Malý', creditTerms: 21, discount: '1.50' },
  ];

  const customers = await db.insert(schema.customers).values(customersData).returning();
  console.log(`✓ Inserted ${customers.length} customers`);

  // Insert products
  const productsData = [
    // Káblové nosné systémy
    { code: 'KNS-100-60', name: 'Žľab káblový perforovaný 100x60mm', category: 'Káblové nosné systémy', price: '12.50', stockQty: 450, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný káblový žľab, dĺžka 3m' },
    { code: 'KNS-200-60', name: 'Žľab káblový perforovaný 200x60mm', category: 'Káblové nosné systémy', price: '18.90', stockQty: 320, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný káblový žľab, dĺžka 3m' },
    { code: 'KNS-300-60', name: 'Žľab káblový perforovaný 300x60mm', category: 'Káblové nosné systémy', price: '24.50', stockQty: 180, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný káblový žľab, dĺžka 3m' },
    { code: 'KNS-100-100', name: 'Žľab káblový perforovaný 100x100mm', category: 'Káblové nosné systémy', price: '15.80', stockQty: 280, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný káblový žľab, dĺžka 3m' },
    { code: 'KNS-VYL-300', name: 'Výložník konzolový 300mm', category: 'Káblové nosné systémy', price: '4.20', stockQty: 850, supplier: 'BAKS', unit: 'ks', description: 'Výložník pre upevnenie žľabu na stenu' },
    { code: 'KNS-VYL-450', name: 'Výložník konzolový 450mm', category: 'Káblové nosné systémy', price: '5.60', stockQty: 620, supplier: 'BAKS', unit: 'ks', description: 'Výložník pre upevnenie žľabu na stenu' },
    { code: 'KNS-ZAV-SET', name: 'Závesný systém pre žľab (sada)', category: 'Káblové nosné systémy', price: '8.90', stockQty: 340, supplier: 'BAKS', unit: 'ks', description: 'Kompletná sada na závesenie žľabu na strop' },
    { code: 'KNS-SPOJKA', name: 'Spojka žľabová (100-300mm)', category: 'Káblové nosné systémy', price: '2.10', stockQty: 1200, supplier: 'BAKS', unit: 'ks', description: 'Univerzálna spojka pre žľaby' },
    { code: 'KNS-KRYT-100', name: 'Kryt na žľab 100mm', category: 'Káblové nosné systémy', price: '6.50', stockQty: 220, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný kryt, dĺžka 3m' },
    
    // Prípojnicové systémy
    { code: 'PRI-630-3F', name: 'Prípojnicový systém 630A 3-fázový', category: 'Prípojnicové systémy', price: '145.00', stockQty: 45, supplier: 'BAKS', unit: 'ks', description: 'Kompletný prípojnicový systém 3m' },
    { code: 'PRI-1000-3F', name: 'Prípojnicový systém 1000A 3-fázový', category: 'Prípojnicové systémy', price: '210.00', stockQty: 28, supplier: 'BAKS', unit: 'ks', description: 'Kompletný prípojnicový systém 3m' },
    { code: 'PRI-ODVOD', name: 'Odvodová jednotka pre prípojnice', category: 'Prípojnicové systémy', price: '32.50', stockQty: 120, supplier: 'BAKS', unit: 'ks', description: 'Odvodová jednotka s istením' },
    { code: 'PRI-ROZB', name: 'Rozboč T pre prípojnice', category: 'Prípojnicové systémy', price: '48.00', stockQty: 65, supplier: 'BAKS', unit: 'ks', description: 'T-rozboč pre prípojnicový systém' },
    
    // Upevňovacie systémy
    { code: 'UPE-SVORKA-16', name: 'Svorka káblová 16-25mm', category: 'Upevňovacie systémy', price: '0.85', stockQty: 5400, supplier: 'BAKS', unit: 'ks', description: 'Plastová svorka na káble' },
    { code: 'UPE-SVORKA-32', name: 'Svorka káblová 25-32mm', category: 'Upevňovacie systémy', price: '1.20', stockQty: 3800, supplier: 'BAKS', unit: 'ks', description: 'Plastová svorka na káble' },
    { code: 'UPE-KOTVA-M8', name: 'Kotevný bolt M8x80', category: 'Upevňovacie systémy', price: '0.65', stockQty: 8200, supplier: 'BAKS', unit: 'ks', description: 'Oceľový kotevný bolt' },
    { code: 'UPE-KOTVA-M10', name: 'Kotevný bolt M10x100', category: 'Upevňovacie systémy', price: '0.95', stockQty: 6500, supplier: 'BAKS', unit: 'ks', description: 'Oceľový kotevný bolt' },
    { code: 'UPE-PASKY', name: 'Pásky stahovacie 200x4.8mm (bal. 100ks)', category: 'Upevňovacie systémy', price: '5.50', stockQty: 180, supplier: 'BAKS', unit: 'bal', description: 'Plastové stahovacie pásky' },
    
    // Osvetľovacie stĺpy
    { code: 'OSV-STLP-6M', name: 'Osvetľovací stĺp 6m oceľový', category: 'Osvetľovacie stĺpy', price: '280.00', stockQty: 12, supplier: 'OSRAM', unit: 'ks', description: 'Pozinkovaný oceľový stĺp s päticou' },
    { code: 'OSV-STLP-8M', name: 'Osvetľovací stĺp 8m oceľový', category: 'Osvetľovacie stĺpy', price: '385.00', stockQty: 8, supplier: 'OSRAM', unit: 'ks', description: 'Pozinkovaný oceľový stĺp s päticou' },
    { code: 'OSV-STLP-10M', name: 'Osvetľovací stĺp 10m oceľový', category: 'Osvetľovacie stĺpy', price: '520.00', stockQty: 5, supplier: 'OSRAM', unit: 'ks', description: 'Pozinkovaný oceľový stĺp s päticou' },
    { code: 'OSV-PATICA', name: 'Pätica pre osvetľovací stĺp', category: 'Osvetľovacie stĺpy', price: '45.00', stockQty: 35, supplier: 'OSRAM', unit: 'ks', description: 'Betónová pätica' },
    { code: 'OSV-SVIETIDLO-LED', name: 'LED svietidlo 100W', category: 'Osvetľovacie stĺpy', price: '125.00', stockQty: 48, supplier: 'OSRAM', unit: 'ks', description: 'LED pouličné svietidlo' },
    
    // Rozvádzačové skrine
    { code: 'ROZ-600-600', name: 'Rozvádzačová skriňa 600x600x200', category: 'Rozvádzačové skrine', price: '185.00', stockQty: 22, supplier: 'BAKS', unit: 'ks', description: 'Oceľová rozvádzačová skriňa IP65' },
    { code: 'ROZ-800-600', name: 'Rozvádzačová skriňa 800x600x250', category: 'Rozvádzačové skrine', price: '245.00', stockQty: 15, supplier: 'BAKS', unit: 'ks', description: 'Oceľová rozvádzačová skriňa IP65' },
    { code: 'ROZ-1000-800', name: 'Rozvádzačová skriňa 1000x800x300', category: 'Rozvádzačové skrine', price: '380.00', stockQty: 9, supplier: 'BAKS', unit: 'ks', description: 'Oceľová rozvádzačová skriňa IP65' },
    { code: 'ROZ-MONT-DOSKA', name: 'Montážna doska do skrine', category: 'Rozvádzačové skrine', price: '28.00', stockQty: 65, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaná montážna doska' },
    { code: 'ROZ-ZAMOK', name: 'Zámok pre rozvádzač', category: 'Rozvádzačové skrine', price: '12.50', stockQty: 140, supplier: 'BAKS', unit: 'ks', description: 'Cylindrický zámok s 2 kľúčmi' },
    
    // Doplnkové produkty
    { code: 'DOP-KABEL-CYY-3x1.5', name: 'Kábel CYY 3x1.5mm² (bal. 100m)', category: 'Káblové nosné systémy', price: '68.00', stockQty: 45, supplier: 'Nexans', unit: 'bal', description: 'Silový kábel' },
    { code: 'DOP-KABEL-CYY-5x2.5', name: 'Kábel CYY 5x2.5mm² (bal. 100m)', category: 'Káblové nosné systémy', price: '135.00', stockQty: 28, supplier: 'Nexans', unit: 'bal', description: 'Silový kábel' },
    { code: 'DOP-KABEL-NYY-3x2.5', name: 'Kábel NYY 3x2.5mm² (bal. 100m)', category: 'Káblové nosné systémy', price: '92.00', stockQty: 32, supplier: 'Nexans', unit: 'bal', description: 'Silový kábel' },
  ];

  const products = await db.insert(schema.products).values(productsData).returning();
  console.log(`✓ Inserted ${products.length} products`);

  // Insert composite products (templates)
  const compositeProductsData = [
    { code: 'COMP-ZLOB-100-STROP', name: 'Žľab 100x60 montáž strop - kompletná sada 3m', category: 'Káblové nosné systémy', price: '42.00', stockQty: 0, supplier: 'BAKS', unit: 'súprava', description: 'Kompletná sada na montáž 3m žľabu na strop', isComposite: true },
    { code: 'COMP-ZLOB-200-STENA', name: 'Žľab 200x60 montáž stena - kompletná sada 3m', category: 'Káblové nosné systémy', price: '56.00', stockQty: 0, supplier: 'BAKS', unit: 'súprava', description: 'Kompletná sada na montáž 3m žľabu na stenu', isComposite: true },
    { code: 'COMP-ROZV-600-KOMPL', name: 'Rozvádzač 600x600 kompletná montáž', category: 'Rozvádzačové skrine', price: '230.00', stockQty: 0, supplier: 'BAKS', unit: 'súprava', description: 'Kompletný rozvádzač s montážnou doskou a zámkom', isComposite: true },
  ];

  const compositeProducts = await db.insert(schema.products).values(compositeProductsData).returning();
  console.log(`✓ Inserted ${compositeProducts.length} composite products`);

  // Insert product components for composite products
  const componentsData = [
    // COMP-ZLOB-100-STROP
    { parentProductId: compositeProducts[0].id, componentProductId: products.find(p => p.code === 'KNS-100-60')!.id, quantity: '1' },
    { parentProductId: compositeProducts[0].id, componentProductId: products.find(p => p.code === 'KNS-ZAV-SET')!.id, quantity: '3' },
    { parentProductId: compositeProducts[0].id, componentProductId: products.find(p => p.code === 'KNS-SPOJKA')!.id, quantity: '2' },
    { parentProductId: compositeProducts[0].id, componentProductId: products.find(p => p.code === 'UPE-KOTVA-M8')!.id, quantity: '6' },
    
    // COMP-ZLOB-200-STENA
    { parentProductId: compositeProducts[1].id, componentProductId: products.find(p => p.code === 'KNS-200-60')!.id, quantity: '1' },
    { parentProductId: compositeProducts[1].id, componentProductId: products.find(p => p.code === 'KNS-VYL-300')!.id, quantity: '4' },
    { parentProductId: compositeProducts[1].id, componentProductId: products.find(p => p.code === 'KNS-SPOJKA')!.id, quantity: '2' },
    { parentProductId: compositeProducts[1].id, componentProductId: products.find(p => p.code === 'UPE-KOTVA-M10')!.id, quantity: '8' },
    
    // COMP-ROZV-600-KOMPL
    { parentProductId: compositeProducts[2].id, componentProductId: products.find(p => p.code === 'ROZ-600-600')!.id, quantity: '1' },
    { parentProductId: compositeProducts[2].id, componentProductId: products.find(p => p.code === 'ROZ-MONT-DOSKA')!.id, quantity: '1' },
    { parentProductId: compositeProducts[2].id, componentProductId: products.find(p => p.code === 'ROZ-ZAMOK')!.id, quantity: '1' },
  ];

  await db.insert(schema.productComponents).values(componentsData);
  console.log(`✓ Inserted product components`);

  // Insert emails
  const emailsData = [
    {
      from: 'objednavky@hagardhal.sk',
      fromCompany: 'HagardHal s.r.o.',
      subject: 'Objednávka materiálu - projekt Košice',
      body: `Dobrý deň,

potrebujeme objednať nasledovný materiál na projekt v Košiciach:

- 50ks žľab 100x60mm (KNS-100-60)
- 200ks výložník 300mm (KNS-VYL-300)
- 100ks spojka žľabová (KNS-SPOJKA)
- 50ks kryt na žľab 100mm (KNS-KRYT-100)

Termín dodania: do 7 dní
Adresa: Košice, Moldavská cesta 12

Ďakujem
Jozef Halász`,
      receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'new',
      aiSuggestedAction: 'create-order',
      aiConfidence: '95.50',
      assignedOzId: reps[0].id,
      customerId: customers[0].id,
    },
    {
      from: 'info@elektrocentrum.sk',
      fromCompany: 'Elektro Centrum Košice',
      subject: 'Cenová ponuka - rozvádzačové skrine',
      body: `Dobrý deň,

prosím o zaslanie cenovej ponuky na:
- Rozvádzačová skriňa 800x600x250 - 5ks
- Rozvádzačová skriňa 1000x800x300 - 3ks
- Montážne dosky
- Zámky

Potrebujeme aj informáciu o dostupnosti a termíne dodania.

S pozdravom
Marián Kovács`,
      receivedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      status: 'new',
      aiSuggestedAction: 'respond-with-prices',
      aiConfidence: '88.30',
      assignedOzId: reps[1].id,
      customerId: customers[1].id,
    },
    {
      from: 'objednavky@profistav.sk',
      fromCompany: 'ProfiStav s.r.o.',
      subject: 'URGENT: Materiál na veľký projekt',
      body: `Dobrý deň,

máme veľký projekt na rekonštrukciu priemyselnej haly v Prešove. Potrebujeme kompletný systém káblových nosníkov vrátane upevnenia.

Parametre:
- Celková dĺžka trasy: cca 150 metrov
- Žľaby 200x60mm a 300x60mm (mix)
- Montáž na strop
- Potrebujeme aj prípojnicový systém 1000A

Prosím o návštevu technika na obhliadku a vypracovanie návrhu riešenia s kompletnou materiálovou špecifikáciou.

Kontakt: Peter Szabó, +421 903 345 678

Naliehavé!`,
      receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'assign-to-rep',
      aiConfidence: '92.10',
      assignedOzId: reps[2].id,
      customerId: customers[2].id,
    },
    {
      from: 'stavmat@stavmat.sk',
      fromCompany: 'StavMat Plus',
      subject: 'Re: Faktúra č. 2024/0156',
      body: `Dobrý deň,

potvrdujeme prijatie faktúry č. 2024/0156. Platbu realizujeme do konca týždňa.

S pozdravom
Anna Molnárová`,
      receivedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'processed',
      aiSuggestedAction: 'assign-to-rep',
      aiConfidence: '75.20',
      assignedOzId: reps[3].id,
      customerId: customers[3].id,
    },
    {
      from: 'techno@technoenergia.sk',
      fromCompany: 'TechnoEnergia a.s.',
      subject: 'Objednávka - osvetľovacie stĺpy',
      body: `Dobrý deň,

objednávame:
- 12ks osvetľovací stĺp 8m oceľový (OSV-STLP-8M)
- 12ks LED svietidlo 100W (OSV-SVIETIDLO-LED)
- 12ks pätica pre stĺp (OSV-PATICA)

Termín: do 14 dní
Dodacia adresa: Bratislava, Račianska 95

Michal Tóth`,
      receivedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'create-order',
      aiConfidence: '96.80',
      assignedOzId: reps[4].id,
      customerId: customers[4].id,
    },
    {
      from: 'info@elektromontaz.sk',
      fromCompany: 'ElektroMontáž SK',
      subject: 'Dopyt - káblové svorky',
      body: `Ahoj,

koľko stoja káblové svorky 16-25mm? Potrebujem asi 500ks. Máte ich skladom?

Katka`,
      receivedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'respond-with-prices',
      aiConfidence: '91.50',
      assignedOzId: reps[5].id,
      customerId: customers[5].id,
    },
    {
      from: 'balog@balog-elektro.sk',
      fromCompany: 'Balog Elektro',
      subject: 'Objednávka KNS systém',
      body: `Dobrý deň,

100ks KNS-100-60
50ks KNS-VYL-300
200ks KNS-SPOJKA

Odber osobne v Košiciach.

Ján Balog`,
      receivedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'create-order',
      aiConfidence: '94.20',
      assignedOzId: reps[6].id,
      customerId: customers[6].id,
    },
    {
      from: 'servis@elektroservis.sk',
      fromCompany: 'Elektroservis Prešov',
      subject: 'Informácie o prípojnicových systémoch',
      body: `Dobrý deň,

plánujeme modernizáciu rozvádzača a potrebujeme informácie o prípojnicových systémoch.

Aké máte systémy? Aké sú ceny? Potrebujeme aj technické poradenstvo.

Prosím o kontakt od technika.

Eva Nagyová`,
      receivedAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'assign-to-rep',
      aiConfidence: '82.60',
      assignedOzId: reps[0].id,
      customerId: customers[7].id,
    },
    {
      from: 'objednavky@hagardhal.sk',
      fromCompany: 'HagardHal s.r.o.',
      subject: 'Objednávka - doplnenie skladu',
      body: `Dobrý deň,

štandardná mesačná objednávka:

KNS-100-60: 200ks
KNS-200-60: 150ks
KNS-VYL-300: 500ks
KNS-VYL-450: 300ks
KNS-SPOJKA: 1000ks
UPE-SVORKA-16: 2000ks
UPE-KOTVA-M8: 1500ks

Dodanie najbližší možný termín.

J. Halász`,
      receivedAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
      status: 'action-taken',
      aiSuggestedAction: 'create-order',
      aiConfidence: '98.50',
      assignedOzId: reps[0].id,
      customerId: customers[0].id,
    },
    {
      from: 'info@elektrocentrum.sk',
      fromCompany: 'Elektro Centrum Košice',
      subject: 'Reklamácia - poškodený materiál',
      body: `Dobrý deň,

v poslednej dodávke sme obdržali poškodený materiál - 5ks žľabov má deformovaný okraj.

Číslo dodacieho listu: DL-2024/0234
Dátum dodania: 15.02.2024

Prosím o riešenie - výmenu alebo dobropis.

M. Kovács`,
      receivedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'assign-to-rep',
      aiConfidence: '89.30',
      assignedOzId: reps[1].id,
      customerId: customers[1].id,
    },
    {
      from: 'objednavky@profistav.sk',
      fromCompany: 'ProfiStav s.r.o.',
      subject: 'Ponuka na kábly',
      body: `Dobrý deň,

potrebujeme cenovú ponuku na káble:
- CYY 3x1.5 - cca 2000m
- CYY 5x2.5 - cca 1500m
- NYY 3x2.5 - cca 1000m

Prosím o najlepšiu cenu pri tomto objeme.

P. Szabó`,
      receivedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'respond-with-prices',
      aiConfidence: '93.70',
      assignedOzId: reps[2].id,
      customerId: customers[2].id,
    },
    {
      from: 'techno@technoenergia.sk',
      fromCompany: 'TechnoEnergia a.s.',
      subject: 'Chýbajúce položky v dodávke',
      body: `Dobrý deň,

v dodávke podľa DL-2024/0245 chýbajú 3ks LED svietidiel.

Prosím o dodanie chýbajúcich kusov alebo úpravu faktúry.

Michal Tóth`,
      receivedAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'assign-to-rep',
      aiConfidence: '87.40',
      assignedOzId: reps[4].id,
      customerId: customers[4].id,
    },
    {
      from: 'stavmat@stavmat.sk',
      fromCompany: 'StavMat Plus',
      subject: 'Objednávka upevňovacieho materiálu',
      body: `Dobrý deň,

potrebujeme:
- Kotevné bolty M8x80: 500ks
- Kotevné bolty M10x100: 300ks
- Stahovacie pásky 200mm: 20 balení

Anna M.`,
      receivedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'create-order',
      aiConfidence: '95.10',
      assignedOzId: reps[3].id,
      customerId: customers[3].id,
    },
    {
      from: 'balog@balog-elektro.sk',
      fromCompany: 'Balog Elektro',
      subject: 'Dopyt - rozvádzače väčšie rozmery',
      body: `Ahoj,

máte rozvádzače väčšie ako 1000x800? Potrebujem niečo aspoň 1200x1000.

Ak nie, viete zohnať?

Ján`,
      receivedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'request-info',
      aiConfidence: '78.90',
      assignedOzId: reps[6].id,
      customerId: customers[6].id,
    },
    {
      from: 'servis@elektroservis.sk',
      fromCompany: 'Elektroservis Prešov',
      subject: 'Dodací list č. DL-2024/0251',
      body: `Dobrý deň,

potvrdujeme prevzatie materiálu podľa DL-2024/0251. Všetko v poriadku.

Eva Nagyová`,
      receivedAt: new Date(Date.now() - 28 * 60 * 60 * 1000),
      status: 'processed',
      aiSuggestedAction: 'create-invoice',
      aiConfidence: '91.20',
      assignedOzId: reps[0].id,
      customerId: customers[7].id,
    },
    {
      from: 'objednavky@hagardhal.sk',
      fromCompany: 'HagardHal s.r.o.',
      subject: 'EDI: ORDER-2024-02-456',
      body: `ORDER_ID: 2024-02-456
CUSTOMER: HAGARDHAL
DATE: 2024-02-25

ITEMS:
KNS-300-60|50|24.50
KNS-ZAV-SET|150|8.90
PRI-630-3F|10|145.00
ROZ-800-600|5|245.00

DELIVERY: 2024-03-05
SHIP_TO: HAGARDHAL_WAREHOUSE_01`,
      receivedAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'create-order',
      aiConfidence: '99.20',
      assignedOzId: reps[0].id,
      customerId: customers[0].id,
    },
    {
      from: 'info@elektrocentrum.sk',
      fromCompany: 'Elektro Centrum Košice',
      subject: 'Objednávka - žľaby + príslušenstvo',
      body: `Dobrý deň,

20x žľab 100x100mm
50x výložník 450mm  
30x spojka
10x kryt 100mm

Marián Kovács
Elektro Centrum`,
      receivedAt: new Date(Date.now() - 32 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'create-order',
      aiConfidence: '92.80',
      assignedOzId: reps[1].id,
      customerId: customers[1].id,
    },
    {
      from: 'info@elektromontaz.sk',
      fromCompany: 'ElektroMontáž SK',
      subject: 'Otázka k prípojniciam',
      body: `Ahoj,

aký je rozdiel medzi 630A a 1000A prípojnicovým systémom okrem ampéráže? Je tam aj rozdiel v rozmeroch?

Vieme na 630A systém neskôr pridať odvodovú jednotku? Alebo sa musí objednať hneď komplet?

Vďaka, Katka`,
      receivedAt: new Date(Date.now() - 34 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'request-info',
      aiConfidence: '84.50',
      assignedOzId: reps[5].id,
      customerId: customers[5].id,
    },
    {
      from: 'techno@technoenergia.sk',
      fromCompany: 'TechnoEnergia a.s.',
      subject: 'Platba faktúry',
      body: `Dobrý deň,

dnes sme uhradili faktúru č. FA-2024/0198 v plnej výške.

Revolut transaction ID: REV-20240225-458796

S pozdravom
Michal Tóth`,
      receivedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
      status: 'processed',
      aiSuggestedAction: 'assign-to-rep',
      aiConfidence: '88.90',
      assignedOzId: reps[4].id,
      customerId: customers[4].id,
    },
    {
      from: 'objednavky@profistav.sk',
      fromCompany: 'ProfiStav s.r.o.',
      subject: 'Skladová dostupnosť',
      body: `Dobrý deň,

môžete overiť skladovú dostupnosť týchto položiek?

- Prípojnicový systém 1000A: 8ks
- Odvodové jednotky: 25ks
- T-rozboče: 12ks

Potrebujeme to na budúci týždeň.

Peter Szabó`,
      receivedAt: new Date(Date.now() - 38 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'respond-with-prices',
      aiConfidence: '86.70',
      assignedOzId: reps[2].id,
      customerId: customers[2].id,
    },
  ];

  const emails = await db.insert(schema.emails).values(emailsData).returning();
  console.log(`✓ Inserted ${emails.length} emails`);

  // Insert delivery notes
  const deliveryNotesData = [
    {
      number: 'DL-2024/0234',
      customerId: customers[1].id,
      status: 'pending',
      items: JSON.stringify([
        { productCode: 'KNS-100-60', productName: 'Žľab káblový perforovaný 100x60mm', quantity: 50, price: 12.50, total: 625.00 },
        { productCode: 'KNS-VYL-300', productName: 'Výložník konzolový 300mm', quantity: 100, price: 4.20, total: 420.00 },
      ]),
      totalAmount: '1045.00',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'DL-2024/0245',
      customerId: customers[4].id,
      status: 'pending',
      items: JSON.stringify([
        { productCode: 'OSV-STLP-8M', productName: 'Osvetľovací stĺp 8m oceľový', quantity: 12, price: 385.00, total: 4620.00 },
        { productCode: 'OSV-SVIETIDLO-LED', productName: 'LED svietidlo 100W', quantity: 9, price: 125.00, total: 1125.00 },
        { productCode: 'OSV-PATICA', productName: 'Pätica pre osvetľovací stĺp', quantity: 12, price: 45.00, total: 540.00 },
      ]),
      totalAmount: '6285.00',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'DL-2024/0251',
      customerId: customers[7].id,
      status: 'completed',
      items: JSON.stringify([
        { productCode: 'ROZ-600-600', productName: 'Rozvádzačová skriňa 600x600x200', quantity: 3, price: 185.00, total: 555.00 },
        { productCode: 'ROZ-MONT-DOSKA', productName: 'Montážna doska do skrine', quantity: 3, price: 28.00, total: 84.00 },
      ]),
      totalAmount: '639.00',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  const deliveryNotes = await db.insert(schema.deliveryNotes).values(deliveryNotesData).returning();
  console.log(`✓ Inserted ${deliveryNotes.length} delivery notes`);

  // Insert invoices
  const invoicesData = [
    {
      number: 'FA-2024/0145',
      customerId: customers[0].id,
      type: 'issued',
      amount: '5245.00',
      vatAmount: '1049.00',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'sent',
      items: JSON.stringify([
        { productCode: 'KNS-100-60', quantity: 200, price: 12.50, total: 2500.00 },
        { productCode: 'KNS-VYL-300', quantity: 500, price: 4.20, total: 2100.00 },
        { productCode: 'KNS-SPOJKA', quantity: 300, price: 2.10, total: 630.00 },
      ]),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'FA-2024/0156',
      customerId: customers[3].id,
      type: 'issued',
      amount: '1840.00',
      vatAmount: '368.00',
      dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'sent',
      items: JSON.stringify([
        { productCode: 'ROZ-800-600', quantity: 5, price: 245.00, total: 1225.00 },
        { productCode: 'ROZ-MONT-DOSKA', quantity: 5, price: 28.00, total: 140.00 },
        { productCode: 'ROZ-ZAMOK', quantity: 5, price: 12.50, total: 62.50 },
      ]),
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'FA-2024/0198',
      customerId: customers[4].id,
      type: 'issued',
      amount: '6285.00',
      vatAmount: '1257.00',
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'paid',
      revolutPaymentId: 'REV-20240225-458796',
      items: JSON.stringify([
        { productCode: 'OSV-STLP-8M', quantity: 12, price: 385.00, total: 4620.00 },
        { productCode: 'OSV-SVIETIDLO-LED', quantity: 12, price: 125.00, total: 1500.00 },
      ]),
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'FA-2024/0134',
      customerId: customers[1].id,
      type: 'issued',
      amount: '3280.00',
      vatAmount: '656.00',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'overdue',
      items: JSON.stringify([
        { productCode: 'KNS-200-60', quantity: 100, price: 18.90, total: 1890.00 },
        { productCode: 'PRI-630-3F', quantity: 5, price: 145.00, total: 725.00 },
      ]),
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'FA-2024/0167',
      customerId: customers[2].id,
      type: 'issued',
      amount: '8950.00',
      vatAmount: '1790.00',
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'viewed',
      items: JSON.stringify([
        { productCode: 'KNS-300-60', quantity: 150, price: 24.50, total: 3675.00 },
        { productCode: 'PRI-1000-3F', quantity: 8, price: 210.00, total: 1680.00 },
        { productCode: 'KNS-ZAV-SET', quantity: 100, price: 8.90, total: 890.00 },
      ]),
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    // Incoming invoices from BAKS
    {
      number: 'BAKS-2024/5678',
      customerId: customers[0].id, // Using as supplier placeholder
      type: 'received',
      amount: '12500.00',
      vatAmount: '2500.00',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'sent',
      items: JSON.stringify([
        { productCode: 'KNS-100-60', quantity: 500, price: 12.00, total: 6000.00 },
        { productCode: 'KNS-200-60', quantity: 200, price: 18.00, total: 3600.00 },
        { productCode: 'KNS-VYL-300', quantity: 1000, price: 3.80, total: 3800.00 },
      ]),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'BAKS-2024/5689',
      customerId: customers[0].id,
      type: 'received',
      amount: '4200.00',
      vatAmount: '840.00',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'sent',
      items: JSON.stringify([
        { productCode: 'ROZ-600-600', quantity: 20, price: 175.00, total: 3500.00, note: 'Cena nekorešponduje s CP!' },
        { productCode: 'ROZ-MONT-DOSKA', quantity: 20, price: 26.00, total: 520.00 },
      ]),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  const invoices = await db.insert(schema.invoices).values(invoicesData).returning();
  console.log(`✓ Inserted ${invoices.length} invoices`);

  // Insert orders
  const ordersData = [
    {
      customerId: customers[0].id,
      emailId: emails[0].id,
      status: 'confirmed',
      totalAmount: '2420.00',
      items: JSON.stringify([
        { productCode: 'KNS-100-60', quantity: 50, price: 12.50 },
        { productCode: 'KNS-VYL-300', quantity: 200, price: 4.20 },
        { productCode: 'KNS-SPOJKA', quantity: 100, price: 2.10 },
        { productCode: 'KNS-KRYT-100', quantity: 50, price: 6.50 },
      ]),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      confirmedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      customerId: customers[4].id,
      emailId: emails[4].id,
      status: 'in-progress',
      totalAmount: '6285.00',
      items: JSON.stringify([
        { productCode: 'OSV-STLP-8M', quantity: 12, price: 385.00 },
        { productCode: 'OSV-SVIETIDLO-LED', quantity: 12, price: 125.00 },
        { productCode: 'OSV-PATICA', quantity: 12, price: 45.00 },
      ]),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      confirmedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      customerId: customers[6].id,
      emailId: emails[6].id,
      status: 'new',
      totalAmount: '1670.00',
      items: JSON.stringify([
        { productCode: 'KNS-100-60', quantity: 100, price: 12.50 },
        { productCode: 'KNS-VYL-300', quantity: 50, price: 4.20 },
        { productCode: 'KNS-SPOJKA', quantity: 200, price: 2.10 },
      ]),
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  ];

  const orders = await db.insert(schema.orders).values(ordersData).returning();
  console.log(`✓ Inserted ${orders.length} orders`);

  // Insert dashboard stats (fictional data for charts)
  const dashboardStatsData = [];
  const today = new Date();
  
  // Daily revenue for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const baseRevenue = 8000 + Math.random() * 7000;
    dashboardStatsData.push({
      date,
      metric: 'daily_revenue',
      value: baseRevenue.toFixed(2),
    });
    
    const inquiries = Math.floor(20 + Math.random() * 40);
    dashboardStatsData.push({
      date,
      metric: 'daily_inquiries',
      value: inquiries.toString(),
    });
    
    const conversion = (35 + Math.random() * 35).toFixed(2);
    dashboardStatsData.push({
      date,
      metric: 'daily_conversion',
      value: conversion,
    });
  }

  await db.insert(schema.dashboardStats).values(dashboardStatsData);
  console.log(`✓ Inserted ${dashboardStatsData.length} dashboard stats`);

  console.log('✅ Seed completed successfully!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
