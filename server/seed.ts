import { db } from './db.js';
import * as schema from './schema.js';

async function seed() {
  console.log('🌱 Starting comprehensive seed...');

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
    { name: 'Ján Novák', location: 'Stropkov', email: 'jan.novak@strader.sk' },
    { name: 'Peter Horváth', location: 'Stropkov', email: 'peter.horvath@strader.sk' },
    { name: 'Mária Kováčová', location: 'Stropkov', email: 'maria.kovacova@strader.sk' },
    { name: 'Tomáš Varga', location: 'Bratislava', email: 'tomas.varga@strader.sk' },
    { name: 'Anna Szabó', location: 'Bratislava', email: 'anna.szabo@strader.sk' },
    { name: 'Martin Dudáš', location: 'Bratislava', email: 'martin.dudas@strader.sk' },
    { name: 'Eva Lukáčová', location: 'Bratislava', email: 'eva.lukacova@strader.sk' },
  ];

  const reps = await db.insert(schema.salesReps).values(salesRepsData).returning();
  console.log(`✓ Inserted ${reps.length} sales reps`);

  // Insert customers
  const customersData = [
    { name: 'Jozef Halász', company: 'HagardHal s.r.o.', email: 'objednavky@hagardhal.sk', phone: '+421 905 123 456', assignedOzId: reps[0].id, segment: 'VIP', creditTerms: 60, discount: '5.00' },
    { name: 'Ing. Pavol Kováč', company: 'ElektroStav s.r.o.', email: 'info@elektrostav.sk', phone: '+421 915 234 567', assignedOzId: reps[3].id, segment: 'Stredný', creditTerms: 30, discount: '2.50' },
    { name: 'Peter Szabó', company: 'ProfiStav a.s.', email: 'objednavky@profistav.sk', phone: '+421 903 345 678', assignedOzId: reps[1].id, segment: 'Veľký', creditTerms: 45, discount: '3.00' },
    { name: 'Anna Molnárová', company: 'StavMat Group s.r.o.', email: 'stavmat@stavmat.sk', phone: '+421 917 456 789', assignedOzId: reps[4].id, segment: 'Stredný', creditTerms: 30, discount: '2.00' },
    { name: 'Michal Tóth', company: 'TechnoEnergia s.r.o.', email: 'techno@technoenergia.sk', phone: '+421 902 567 890', assignedOzId: reps[2].id, segment: 'Stredný', creditTerms: 30, discount: '2.50' },
    { name: 'Katarína Vargová', company: 'Elektro Centrum s.r.o.', email: 'info@elektrocentrum.sk', phone: '+421 911 678 901', assignedOzId: reps[5].id, segment: 'Stredný', creditTerms: 30, discount: '2.00' },
    { name: 'Ján Balog', company: 'KábelPro s.r.o.', email: 'balog@kabelpro.sk', phone: '+421 908 789 012', assignedOzId: reps[6].id, segment: 'Malý', creditTerms: 21, discount: '1.50' },
    { name: 'Eva Nagyová', company: 'MegaStav a.s.', email: 'nagy@megastav.sk', phone: '+421 904 890 123', assignedOzId: reps[3].id, segment: 'VIP', creditTerms: 60, discount: '4.50' },
    { name: 'Marek Horváth', company: 'ElektroServis Košice s.r.o.', email: 'servis@elektroservis.sk', phone: '+421 907 123 456', assignedOzId: reps[0].id, segment: 'Malý', creditTerms: 21, discount: '1.00' },
    { name: 'Zuzana Kiss', company: 'StavTech Prešov s.r.o.', email: 'kiss@stavtech.sk', phone: '+421 912 234 567', assignedOzId: reps[1].id, segment: 'Stredný', creditTerms: 30, discount: '2.00' },
    { name: 'Róbert Lakatos', company: 'ElektroMont Žilina s.r.o.', email: 'lakatos@elektromont.sk', phone: '+421 903 345 678', assignedOzId: reps[4].id, segment: 'Malý', creditTerms: 21, discount: '1.50' },
  ];

  const customers = await db.insert(schema.customers).values(customersData).returning();
  console.log(`✓ Inserted ${customers.length} customers`);

  // Insert products (50+ comprehensive catalog)
  const productsData = [
    // Káblové nosné systémy - Žľaby
    { code: 'KZL100x60/3', name: 'Žľab káblový perforovaný 100x60mm L=3m', category: 'Káblové nosné systémy', price: '15.80', stockQty: 450, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný káblový žľab perforovaný, dĺžka 3m' },
    { code: 'KZL150x60/3', name: 'Žľab káblový perforovaný 150x60mm L=3m', category: 'Káblové nosné systémy', price: '19.50', stockQty: 380, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný káblový žľab perforovaný, dĺžka 3m' },
    { code: 'KZL200x60/3', name: 'Žľab káblový perforovaný 200x60mm L=3m', category: 'Káblové nosné systémy', price: '24.90', stockQty: 320, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný káblový žľab perforovaný, dĺžka 3m' },
    { code: 'KZL300x60/3', name: 'Žľab káblový perforovaný 300x60mm L=3m', category: 'Káblové nosné systémy', price: '32.50', stockQty: 180, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný káblový žľab perforovaný, dĺžka 3m' },
    { code: 'KZL400x60/3', name: 'Žľab káblový perforovaný 400x60mm L=3m', category: 'Káblové nosné systémy', price: '38.90', stockQty: 120, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný káblový žľab perforovaný, dĺžka 3m' },
    { code: 'KZL100x100/3', name: 'Žľab káblový perforovaný 100x100mm L=3m', category: 'Káblové nosné systémy', price: '18.90', stockQty: 280, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný káblový žľab perforovaný, dĺžka 3m' },
    { code: 'KZL150x100/3', name: 'Žľab káblový perforovaný 150x100mm L=3m', category: 'Káblové nosné systémy', price: '24.50', stockQty: 220, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný káblový žľab perforovaný, dĺžka 3m' },
    { code: 'KZL200x100/3', name: 'Žľab káblový perforovaný 200x100mm L=3m', category: 'Káblové nosné systémy', price: '29.80', stockQty: 180, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný káblový žľab perforovaný, dĺžka 3m' },
    
    // Káblové nosné systémy - Rebríky
    { code: 'KRB100/3', name: 'Rebrík káblový 100mm L=3m', category: 'Káblové nosné systémy', price: '22.50', stockQty: 160, supplier: 'BAKS', unit: 'ks', description: 'Káblový rebrík pozinkovaný, dĺžka 3m' },
    { code: 'KRB200/3', name: 'Rebrík káblový 200mm L=3m', category: 'Káblové nosné systémy', price: '34.80', stockQty: 140, supplier: 'BAKS', unit: 'ks', description: 'Káblový rebrík pozinkovaný, dĺžka 3m' },
    { code: 'KRB300/3', name: 'Rebrík káblový 300mm L=3m', category: 'Káblové nosné systémy', price: '45.90', stockQty: 95, supplier: 'BAKS', unit: 'ks', description: 'Káblový rebrík pozinkovaný, dĺžka 3m' },
    
    // Výložníky a konzoly
    { code: 'BWS300', name: 'Výložník konzolový 300mm', category: 'Káblové nosné systémy', price: '8.20', stockQty: 850, supplier: 'BAKS', unit: 'ks', description: 'Výložník pre upevnenie žľabu na stenu' },
    { code: 'BWS450', name: 'Výložník konzolový 450mm', category: 'Káblové nosné systémy', price: '10.80', stockQty: 620, supplier: 'BAKS', unit: 'ks', description: 'Výložník pre upevnenie žľabu na stenu' },
    { code: 'BWS600', name: 'Výložník konzolový 600mm', category: 'Káblové nosné systémy', price: '13.50', stockQty: 420, supplier: 'BAKS', unit: 'ks', description: 'Výložník pre upevnenie žľabu na stenu' },
    { code: 'BWSC300', name: 'Výložník C-profil 300mm', category: 'Káblové nosné systémy', price: '9.50', stockQty: 480, supplier: 'BAKS', unit: 'ks', description: 'C-profilový výložník zosilnený' },
    { code: 'BWSC450', name: 'Výložník C-profil 450mm', category: 'Káblové nosné systémy', price: '12.20', stockQty: 380, supplier: 'BAKS', unit: 'ks', description: 'C-profilový výložník zosilnený' },
    
    // Závesné systémy
    { code: 'ZM8x1000', name: 'Závesná tyč M8x1000mm', category: 'Káblové nosné systémy', price: '3.80', stockQty: 1200, supplier: 'BAKS', unit: 'ks', description: 'Oceľová závesná tyč so závitom' },
    { code: 'ZM10x1000', name: 'Závesná tyč M10x1000mm', category: 'Káblové nosné systémy', price: '4.90', stockQty: 950, supplier: 'BAKS', unit: 'ks', description: 'Oceľová závesná tyč so závitom' },
    { code: 'ZM8x1500', name: 'Závesná tyč M8x1500mm', category: 'Káblové nosné systémy', price: '5.20', stockQty: 680, supplier: 'BAKS', unit: 'ks', description: 'Oceľová závesná tyč so závitom' },
    { code: 'ZSV-M8', name: 'Závesná svorka M8', category: 'Káblové nosné systémy', price: '1.80', stockQty: 2400, supplier: 'BAKS', unit: 'ks', description: 'Svorka pre upevnenie žľabu na závesnú tyč' },
    { code: 'ZSV-M10', name: 'Závesná svorka M10', category: 'Káblové nosné systémy', price: '2.10', stockQty: 1900, supplier: 'BAKS', unit: 'ks', description: 'Svorka pre upevnenie žľabu na závesnú tyč' },
    { code: 'SKM8', name: 'Stropná kotva M8', category: 'Káblové nosné systémy', price: '1.20', stockQty: 3200, supplier: 'BAKS', unit: 'ks', description: 'Stropná kotva do betónu' },
    { code: 'SKM10', name: 'Stropná kotva M10', category: 'Káblové nosné systémy', price: '1.50', stockQty: 2800, supplier: 'BAKS', unit: 'ks', description: 'Stropná kotva do betónu' },
    
    // Spojky a tvarovky
    { code: 'SPJ-100', name: 'Spojka žľabová 100mm', category: 'Káblové nosné systémy', price: '2.10', stockQty: 1500, supplier: 'BAKS', unit: 'ks', description: 'Spojka pre žľaby šírky 100mm' },
    { code: 'SPJ-200', name: 'Spojka žľabová 200mm', category: 'Káblové nosné systémy', price: '2.80', stockQty: 1200, supplier: 'BAKS', unit: 'ks', description: 'Spojka pre žľaby šírky 200mm' },
    { code: 'SPJ-300', name: 'Spojka žľabová 300mm', category: 'Káblové nosné systémy', price: '3.50', stockQty: 950, supplier: 'BAKS', unit: 'ks', description: 'Spojka pre žľaby šírky 300mm' },
    { code: 'TKU-100', name: 'T-kus žľabový 100mm', category: 'Káblové nosné systémy', price: '8.90', stockQty: 280, supplier: 'BAKS', unit: 'ks', description: 'T-kus pre vetvenie žľabov' },
    { code: 'TKU-200', name: 'T-kus žľabový 200mm', category: 'Káblové nosné systémy', price: '12.50', stockQty: 220, supplier: 'BAKS', unit: 'ks', description: 'T-kus pre vetvenie žľabov' },
    { code: 'KOL-100-90', name: 'Koleno žľabové 100mm 90°', category: 'Káblové nosné systémy', price: '7.20', stockQty: 340, supplier: 'BAKS', unit: 'ks', description: 'Koleno 90° pre zmenu smeru žľabu' },
    { code: 'KOL-200-90', name: 'Koleno žľabové 200mm 90°', category: 'Káblové nosné systémy', price: '10.80', stockQty: 280, supplier: 'BAKS', unit: 'ks', description: 'Koleno 90° pre zmenu smeru žľabu' },
    
    // Kryty
    { code: 'KRY-100/3', name: 'Kryt na žľab 100mm L=3m', category: 'Káblové nosné systémy', price: '9.50', stockQty: 320, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný kryt, dĺžka 3m' },
    { code: 'KRY-200/3', name: 'Kryt na žľab 200mm L=3m', category: 'Káblové nosné systémy', price: '14.80', stockQty: 250, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný kryt, dĺžka 3m' },
    { code: 'KRY-300/3', name: 'Kryt na žľab 300mm L=3m', category: 'Káblové nosné systémy', price: '19.90', stockQty: 180, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaný kryt, dĺžka 3m' },
    
    // Prípojnicové systémy
    { code: 'PRI-630-3F', name: 'Prípojnicový systém 630A 3-fázový', category: 'Prípojnicové systémy', price: '145.00', stockQty: 45, supplier: 'BAKS', unit: 'ks', description: 'Kompletný prípojnicový systém 3m' },
    { code: 'PRI-800-3F', name: 'Prípojnicový systém 800A 3-fázový', category: 'Prípojnicové systémy', price: '178.00', stockQty: 32, supplier: 'BAKS', unit: 'ks', description: 'Kompletný prípojnicový systém 3m' },
    { code: 'PRI-1000-3F', name: 'Prípojnicový systém 1000A 3-fázový', category: 'Prípojnicové systémy', price: '210.00', stockQty: 28, supplier: 'BAKS', unit: 'ks', description: 'Kompletný prípojnicový systém 3m' },
    { code: 'PRI-ODVOD', name: 'Odvodová jednotka pre prípojnice', category: 'Prípojnicové systémy', price: '32.50', stockQty: 120, supplier: 'BAKS', unit: 'ks', description: 'Odvodová jednotka s istením' },
    { code: 'PRI-ROZB', name: 'T-rozboč pre prípojnice', category: 'Prípojnicové systémy', price: '48.00', stockQty: 65, supplier: 'BAKS', unit: 'ks', description: 'T-rozboč pre prípojnicový systém' },
    { code: 'PRI-ADAPT', name: 'Adaptér pre prípojnice', category: 'Prípojnicové systémy', price: '15.80', stockQty: 180, supplier: 'BAKS', unit: 'ks', description: 'Adaptér pre pripojenie rozvodnej jednotky' },
    
    // Upevňovacie systémy
    { code: 'SKR-M6x20', name: 'Skrutka M6x20mm (bal. 100ks)', category: 'Upevňovacie systémy', price: '8.50', stockQty: 240, supplier: 'BAKS', unit: 'bal', description: 'Oceľové skrutky so šesťhrannou hlavou' },
    { code: 'SKR-M8x20', name: 'Skrutka M8x20mm (bal. 100ks)', category: 'Upevňovacie systémy', price: '12.00', stockQty: 320, supplier: 'BAKS', unit: 'bal', description: 'Oceľové skrutky so šesťhrannou hlavou' },
    { code: 'SKR-M10x25', name: 'Skrutka M10x25mm (bal. 100ks)', category: 'Upevňovacie systémy', price: '16.50', stockQty: 280, supplier: 'BAKS', unit: 'bal', description: 'Oceľové skrutky so šesťhrannou hlavou' },
    { code: 'MAT-M6', name: 'Matica M6 (bal. 100ks)', category: 'Upevňovacie systémy', price: '4.20', stockQty: 450, supplier: 'BAKS', unit: 'bal', description: 'Oceľové matice šesťhranné' },
    { code: 'MAT-M8', name: 'Matica M8 (bal. 100ks)', category: 'Upevňovacie systémy', price: '6.80', stockQty: 520, supplier: 'BAKS', unit: 'bal', description: 'Oceľové matice šesťhranné' },
    { code: 'MAT-M10', name: 'Matica M10 (bal. 100ks)', category: 'Upevňovacie systémy', price: '9.50', stockQty: 380, supplier: 'BAKS', unit: 'bal', description: 'Oceľové matice šesťhranné' },
    { code: 'POD-M6', name: 'Podložka M6 (bal. 100ks)', category: 'Upevňovacie systémy', price: '3.20', stockQty: 680, supplier: 'BAKS', unit: 'bal', description: 'Oceľové podložky' },
    { code: 'POD-M8', name: 'Podložka M8 (bal. 100ks)', category: 'Upevňovacie systémy', price: '4.50', stockQty: 720, supplier: 'BAKS', unit: 'bal', description: 'Oceľové podložky' },
    { code: 'POD-M10', name: 'Podložka M10 (bal. 100ks)', category: 'Upevňovacie systémy', price: '6.20', stockQty: 580, supplier: 'BAKS', unit: 'bal', description: 'Oceľové podložky' },
    { code: 'KOTVA-M8x80', name: 'Kotevný bolt M8x80mm', category: 'Upevňovacie systémy', price: '0.65', stockQty: 8200, supplier: 'BAKS', unit: 'ks', description: 'Oceľový kotevný bolt' },
    { code: 'KOTVA-M10x100', name: 'Kotevný bolt M10x100mm', category: 'Upevňovacie systémy', price: '0.95', stockQty: 6500, supplier: 'BAKS', unit: 'ks', description: 'Oceľový kotevný bolt' },
    { code: 'PASKY-200', name: 'Pásky stahovacie 200x4.8mm (bal. 100ks)', category: 'Upevňovacie systémy', price: '5.50', stockQty: 180, supplier: 'BAKS', unit: 'bal', description: 'Plastové stahovacie pásky' },
    
    // Osvetľovacie stĺpy
    { code: 'OSV-STLP-4M', name: 'Osvetľovací stĺp 4m oceľový', category: 'Osvetľovacie stĺpy', price: '185.00', stockQty: 18, supplier: 'OSRAM', unit: 'ks', description: 'Pozinkovaný oceľový stĺp s päticou' },
    { code: 'OSV-STLP-6M', name: 'Osvetľovací stĺp 6m oceľový', category: 'Osvetľovacie stĺpy', price: '280.00', stockQty: 12, supplier: 'OSRAM', unit: 'ks', description: 'Pozinkovaný oceľový stĺp s päticou' },
    { code: 'OSV-STLP-8M', name: 'Osvetľovací stĺp 8m oceľový', category: 'Osvetľovacie stĺpy', price: '385.00', stockQty: 8, supplier: 'OSRAM', unit: 'ks', description: 'Pozinkovaný oceľový stĺp s päticou' },
    { code: 'OSV-STLP-10M', name: 'Osvetľovací stĺp 10m oceľový', category: 'Osvetľovacie stĺpy', price: '520.00', stockQty: 5, supplier: 'OSRAM', unit: 'ks', description: 'Pozinkovaný oceľový stĺp s päticou' },
    { code: 'OSV-STLP-12M', name: 'Osvetľovací stĺp 12m oceľový', category: 'Osvetľovacie stĺpy', price: '685.00', stockQty: 3, supplier: 'OSRAM', unit: 'ks', description: 'Pozinkovaný oceľový stĺp s päticou' },
    { code: 'OSV-PATICA', name: 'Pätica pre osvetľovací stĺp', category: 'Osvetľovacie stĺpy', price: '45.00', stockQty: 35, supplier: 'OSRAM', unit: 'ks', description: 'Betónová pätica' },
    { code: 'OSV-SVIETIDLO-50W', name: 'LED svietidlo 50W', category: 'Osvetľovacie stĺpy', price: '85.00', stockQty: 62, supplier: 'OSRAM', unit: 'ks', description: 'LED pouličné svietidlo' },
    { code: 'OSV-SVIETIDLO-100W', name: 'LED svietidlo 100W', category: 'Osvetľovacie stĺpy', price: '125.00', stockQty: 48, supplier: 'OSRAM', unit: 'ks', description: 'LED pouličné svietidlo' },
    { code: 'OSV-VYL-STLP', name: 'Výložník na stĺp 1.5m', category: 'Osvetľovacie stĺpy', price: '68.00', stockQty: 28, supplier: 'OSRAM', unit: 'ks', description: 'Oceľový výložník pre montáž svietidla' },
    
    // Rozvádzačové skrine
    { code: 'ROZ-400-400-200', name: 'Rozvádzačová skriňa 400x400x200', category: 'Rozvádzačové skrine', price: '125.00', stockQty: 35, supplier: 'BAKS', unit: 'ks', description: 'Oceľová rozvádzačová skriňa IP65' },
    { code: 'ROZ-600-600-200', name: 'Rozvádzačová skriňa 600x600x200', category: 'Rozvádzačové skrine', price: '185.00', stockQty: 22, supplier: 'BAKS', unit: 'ks', description: 'Oceľová rozvádzačová skriňa IP65' },
    { code: 'ROZ-800-600-250', name: 'Rozvádzačová skriňa 800x600x250', category: 'Rozvádzačové skrine', price: '245.00', stockQty: 15, supplier: 'BAKS', unit: 'ks', description: 'Oceľová rozvádzačová skriňa IP65' },
    { code: 'ROZ-1000-800-300', name: 'Rozvádzačová skriňa 1000x800x300', category: 'Rozvádzačové skrine', price: '380.00', stockQty: 9, supplier: 'BAKS', unit: 'ks', description: 'Oceľová rozvádzačová skriňa IP65' },
    { code: 'ROZ-MONT-DOSKA', name: 'Montážna doska do skrine', category: 'Rozvádzačové skrine', price: '28.00', stockQty: 65, supplier: 'BAKS', unit: 'ks', description: 'Pozinkovaná montážna doska' },
    { code: 'ROZ-ZAMOK', name: 'Zámok pre rozvádzač', category: 'Rozvádzačové skrine', price: '12.50', stockQty: 140, supplier: 'BAKS', unit: 'ks', description: 'Cylindrický zámok s 2 kľúčmi' },
    { code: 'ROZ-PANEL-DVERE', name: 'Panelové dvere do rozvádzača', category: 'Rozvádzačové skrine', price: '48.00', stockQty: 45, supplier: 'BAKS', unit: 'ks', description: 'Oceľové panelové dvere' },
  ];

  const products = await db.insert(schema.products).values(productsData).returning();
  console.log(`✓ Inserted ${products.length} products`);

  // Insert composite products (10 templates)
  const compositeProductsData = [
    { code: 'KOMP-ZLB100-STR-1M', name: 'Žľab 100x60 závesenie na strop - komplet na 1m', category: 'Káblové nosné systémy', price: '42.00', stockQty: 0, supplier: 'BAKS', unit: 'súprava', description: 'Kompletná sada: žľab + závesy + kotvy + montážny materiál', isComposite: true },
    { code: 'KOMP-ZLB100-STE-1M', name: 'Žľab 100x60 montáž na stenu - komplet na 1m', category: 'Káblové nosné systémy', price: '38.00', stockQty: 0, supplier: 'BAKS', unit: 'súprava', description: 'Kompletná sada: žľab + výložníky + kotvy + montážny materiál', isComposite: true },
    { code: 'KOMP-ZLB200-STR-1M', name: 'Žľab 200x60 závesenie na strop - komplet na 1m', category: 'Káblové nosné systémy', price: '52.00', stockQty: 0, supplier: 'BAKS', unit: 'súprava', description: 'Kompletná sada: žľab + závesy + kotvy + montážny materiál', isComposite: true },
    { code: 'KOMP-ZLB200-STE-1M', name: 'Žľab 200x60 montáž na stenu - komplet na 1m', category: 'Káblové nosné systémy', price: '48.00', stockQty: 0, supplier: 'BAKS', unit: 'súprava', description: 'Kompletná sada: žľab + výložníky + kotvy + montážny materiál', isComposite: true },
    { code: 'KOMP-ZLB300-STR-1M', name: 'Žľab 300x60 závesenie na strop - komplet na 1m', category: 'Káblové nosné systémy', price: '65.00', stockQty: 0, supplier: 'BAKS', unit: 'súprava', description: 'Kompletná sada: žľab + závesy + kotvy + montážny materiál', isComposite: true },
    { code: 'KOMP-ZLB300-STE-1M', name: 'Žľab 300x60 montáž na stenu - komplet na 1m', category: 'Káblové nosné systémy', price: '58.00', stockQty: 0, supplier: 'BAKS', unit: 'súprava', description: 'Kompletná sada: žľab + výložníky + kotvy + montážny materiál', isComposite: true },
    { code: 'KOMP-ROZ600-KOMPL', name: 'Rozvádzač 600x600 kompletná montáž', category: 'Rozvádzačové skrine', price: '230.00', stockQty: 0, supplier: 'BAKS', unit: 'súprava', description: 'Kompletný rozvádzač: skriňa + montážna doska + zámok', isComposite: true },
    { code: 'KOMP-ROZ800-KOMPL', name: 'Rozvádzač 800x600 kompletná montáž', category: 'Rozvádzačové skrine', price: '290.00', stockQty: 0, supplier: 'BAKS', unit: 'súprava', description: 'Kompletný rozvádzač: skriňa + montážna doska + zámok', isComposite: true },
    { code: 'KOMP-OSV-6M-KOMPL', name: 'Osvetľovací stĺp 6m kompletná sada', category: 'Osvetľovacie stĺpy', price: '495.00', stockQty: 0, supplier: 'OSRAM', unit: 'súprava', description: 'Kompletná sada: stĺp + pätica + svietidlo + výložník', isComposite: true },
    { code: 'KOMP-OSV-8M-KOMPL', name: 'Osvetľovací stĺp 8m kompletná sada', category: 'Osvetľovacie stĺpy', price: '665.00', stockQty: 0, supplier: 'OSRAM', unit: 'súprava', description: 'Kompletná sada: stĺp + pätica + svietidlo + výložník', isComposite: true },
  ];

  const compositeProducts = await db.insert(schema.products).values(compositeProductsData).returning();
  console.log(`✓ Inserted ${compositeProducts.length} composite products`);

  // Insert product components
  const componentsData = [
    // KOMP-ZLB100-STR-1M
    { parentProductId: compositeProducts[0].id, componentProductId: products.find(p => p.code === 'KZL100x60/3')!.id, quantity: '0.33' },
    { parentProductId: compositeProducts[0].id, componentProductId: products.find(p => p.code === 'ZM8x1000')!.id, quantity: '2' },
    { parentProductId: compositeProducts[0].id, componentProductId: products.find(p => p.code === 'SKM8')!.id, quantity: '2' },
    { parentProductId: compositeProducts[0].id, componentProductId: products.find(p => p.code === 'ZSV-M8')!.id, quantity: '2' },
    { parentProductId: compositeProducts[0].id, componentProductId: products.find(p => p.code === 'MAT-M8')!.id, quantity: '0.04' },
    { parentProductId: compositeProducts[0].id, componentProductId: products.find(p => p.code === 'POD-M8')!.id, quantity: '0.04' },
    
    // KOMP-ZLB100-STE-1M
    { parentProductId: compositeProducts[1].id, componentProductId: products.find(p => p.code === 'KZL100x60/3')!.id, quantity: '0.33' },
    { parentProductId: compositeProducts[1].id, componentProductId: products.find(p => p.code === 'BWS300')!.id, quantity: '2' },
    { parentProductId: compositeProducts[1].id, componentProductId: products.find(p => p.code === 'KOTVA-M8x80')!.id, quantity: '4' },
    { parentProductId: compositeProducts[1].id, componentProductId: products.find(p => p.code === 'SKR-M8x20')!.id, quantity: '0.04' },
    
    // KOMP-ROZ600-KOMPL
    { parentProductId: compositeProducts[6].id, componentProductId: products.find(p => p.code === 'ROZ-600-600-200')!.id, quantity: '1' },
    { parentProductId: compositeProducts[6].id, componentProductId: products.find(p => p.code === 'ROZ-MONT-DOSKA')!.id, quantity: '1' },
    { parentProductId: compositeProducts[6].id, componentProductId: products.find(p => p.code === 'ROZ-ZAMOK')!.id, quantity: '1' },
    
    // KOMP-OSV-6M-KOMPL
    { parentProductId: compositeProducts[8].id, componentProductId: products.find(p => p.code === 'OSV-STLP-6M')!.id, quantity: '1' },
    { parentProductId: compositeProducts[8].id, componentProductId: products.find(p => p.code === 'OSV-PATICA')!.id, quantity: '1' },
    { parentProductId: compositeProducts[8].id, componentProductId: products.find(p => p.code === 'OSV-SVIETIDLO-100W')!.id, quantity: '1' },
    { parentProductId: compositeProducts[8].id, componentProductId: products.find(p => p.code === 'OSV-VYL-STLP')!.id, quantity: '1' },
  ];

  await db.insert(schema.productComponents).values(componentsData);
  console.log(`✓ Inserted product components`);

  // Insert emails (20+ comprehensive Slovak emails)
  const emailsData = [
    {
      from: 'objednavky@hagardhal.sk',
      fromCompany: 'HagardHal s.r.o.',
      subject: 'Objednávka materiálu - projekt Košice Moldavská',
      body: `Dobrý deň,

potrebujeme objednať nasledovný materiál na projekt v Košiciach:

- 50ks žľab 100x60mm dĺžka 3m (KZL100x60/3)
- 200ks výložník 300mm (BWSC300)
- 100ks závesná tyč M8x1000 (ZM8x1000)
- 50ks kryt na žľab 100mm (KRY-100/3)
- 150ks spojka žľabová 100mm (SPJ-100)

Termín dodania: do 7 dní
Dodacia adresa: Košice, Moldavská cesta 12

S pozdravom
Jozef Halász
HagardHal s.r.o.`,
      receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'create-order',
      aiConfidence: '96.50',
      assignedOzId: reps[0].id,
      customerId: customers[0].id,
    },
    {
      from: 'info@elektrostav.sk',
      fromCompany: 'ElektroStav s.r.o.',
      subject: 'URGENT - Potrebujeme žľaby do zajtra ráno',
      body: `Dobrý deň,

URGENTNE potrebujeme materiál na stavbu do zajtra do 8:00 ráno!

100ks KZL200x60/3
50ks BWS450
200ks SPJ-200

Vieme si prísť osobne vyzdvihnúť do Košíc alebo Stropkov - čo je bližšie.

Prosím urgentné vybavenie!

Ing. Pavol Kováč
ElektroStav s.r.o.
+421 915 234 567`,
      receivedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'assign-to-rep',
      aiConfidence: '98.20',
      assignedOzId: reps[3].id,
      customerId: customers[1].id,
    },
    {
      from: 'objednavky@profistav.sk',
      fromCompany: 'ProfiStav a.s.',
      subject: 'Veľký projekt - požiadavka na kompletný návrh riešenia',
      body: `Dobrý deň,

máme veľký projekt na rekonštrukciu priemyselnej haly v Prešove pre klienta SlovNaft.

Základné parametre projektu:
- Plocha haly: 5000 m²
- 3 podlažia
- Potrebujeme kompletný káblový nosný systém pre silnoprúd + slaboprúd
- Celková predpokladaná dĺžka trás: cca 800 metrov
- Mix žľabov 100mm, 200mm, 300mm podľa sekcií
- Montáž kombinovaná: strop + stena
- Potrebujeme aj prípojnicový systém 1000A pre hlavný rozvádzač na každom podlaží

Prosím o:
1. Návštevu technika na obhliadku objektu
2. Vypracovanie návrhu technického riešenia
3. Kompletná materiálová špecifikácia so skladovou dostupnosťou
4. Cenová ponuka s možnosťou etapového dodania
5. Odporúčanie ohľadom požiarnej odolnosti - zákazník sa pýtal na FR varianty

Termín realizácie: Q2 2024
Budget: cca 120 000 - 150 000 EUR

Kontakt pre obhliadku:
Peter Szabó
+421 903 345 678
objednavky@profistav.sk

Naliehavé - potrebujeme ponuku do 10 dní!

S pozdravom
Peter Szabó
ProfiStav a.s.`,
      receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'assign-to-rep',
      aiConfidence: '94.80',
      assignedOzId: reps[1].id,
      customerId: customers[2].id,
    },
    {
      from: 'stavmat@stavmat.sk',
      fromCompany: 'StavMat Group s.r.o.',
      subject: 'Cenová ponuka - rozvádzačové skrine',
      body: `Dobrý deň,

prosím o zaslanie cenovej ponuky na:

- Rozvádzačová skriňa 800x600x250 - 5ks
- Rozvádzačová skriňa 1000x800x300 - 3ks  
- Rozvádzačová skriňa 600x600x200 - 8ks
- Montážne dosky zodpovedajúce veľkostiam
- Zámky s rovnakým kľúčom - 16ks

Potrebujeme aj informáciu o:
- Dostupnosti a termíne dodania
- Možnosti vrátenia nepoužitých kusov (máme rezervu v objednávke)
- Certifikáty IP65

S pozdravom
Anna Molnárová
StavMat Group s.r.o.`,
      receivedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'respond-with-prices',
      aiConfidence: '91.30',
      assignedOzId: reps[4].id,
      customerId: customers[3].id,
    },
    {
      from: 'techno@technoenergia.sk',
      fromCompany: 'TechnoEnergia s.r.o.',
      subject: 'Objednávka - osvetľovacie stĺpy parkovisko',
      body: `Dobrý deň,

objednávame materiál na osvetlenie parkoviska:

- 12ks osvetľovací stĺp 8m oceľový (OSV-STLP-8M)
- 12ks LED svietidlo 100W (OSV-SVIETIDLO-100W)
- 12ks pätica pre stĺp (OSV-PATICA)
- 12ks výložník na stĺp (OSV-VYL-STLP)

Termín dodania: do 14 dní
Dodacia adresa: Banská Bystrica, Rudlovská cesta 85
Fakturácia: štandardná 30 dní

Prosím o potvrdenie objednávky a termínu.

S pozdravom
Michal Tóth
TechnoEnergia s.r.o.`,
      receivedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'create-order',
      aiConfidence: '97.80',
      assignedOzId: reps[2].id,
      customerId: customers[4].id,
    },
    {
      from: 'info@elektrocentrum.sk',
      fromCompany: 'Elektro Centrum s.r.o.',
      subject: 'Dopyt na upevňovací materiál',
      body: `Ahoj,

koľko stoja káblové spojky a upevňovací materiál? Potrebujeme veľké množstvo:

- Spojky 100mm: 500ks
- Spojky 200mm: 300ks
- Kotevné bolty M8x80: 2000ks
- Kotevné bolty M10x100: 1500ks
- Stahovacie pásky 200mm: 50 balení

Máte to skladom? Aká je cena pri tomto objeme?

Katka Vargová
Elektro Centrum`,
      receivedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'respond-with-prices',
      aiConfidence: '93.50',
      assignedOzId: reps[5].id,
      customerId: customers[5].id,
    },
    {
      from: 'balog@kabelpro.sk',
      fromCompany: 'KábelPro s.r.o.',
      subject: 'Objednávka KNS systém',
      body: `Dobrý deň,

štandardná týždenná objednávka:

100ks KZL100x60/3
50ks BWS300
200ks SPJ-100
30ks KRY-100/3

Odber osobne v Košiciach.

Ján Balog
KábelPro s.r.o.`,
      receivedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'create-order',
      aiConfidence: '95.20',
      assignedOzId: reps[6].id,
      customerId: customers[6].id,
    },
    {
      from: 'nagy@megastav.sk',
      fromCompany: 'MegaStav a.s.',
      subject: 'Informácie o prípojnicových systémoch',
      body: `Dobrý deň,

plánujeme modernizáciu hlavného rozvádzača v našej výrobnej hale.

Potrebujeme informácie:
- Aké máte prípojnicové systémy? (videl som 630A, 800A, 1000A)
- Aké sú ceny kompletných systémov?
- Akú dĺžku máte štandardne? Vieme objednať aj dlhšie?
- Sú k dispozícii odvodové jednotky a adaptéry?
- Potrebujeme aj technické poradenstvo a možno aj návrh riešenia

Prosím o kontakt od technika.

S pozdravom
Eva Nagyová
MegaStav a.s.
+421 904 890 123`,
      receivedAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'assign-to-rep',
      aiConfidence: '86.60',
      assignedOzId: reps[3].id,
      customerId: customers[7].id,
    },
    {
      from: 'objednavky@hagardhal.sk',
      fromCompany: 'HagardHal s.r.o.',
      subject: 'Mesačná objednávka - doplnenie skladu',
      body: `Dobrý deň,

ako obvykle, mesačná objednávka na doplnenie skladu:

KZL100x60/3: 200ks
KZL200x60/3: 150ks
KZL300x60/3: 80ks
BWS300: 500ks
BWS450: 300ks
BWSC300: 200ks
SPJ-100: 1000ks
SPJ-200: 500ks
ZM8x1000: 800ks
KOTVA-M8x80: 2000ks
KOTVA-M10x100: 1500ks

Dodanie najbližší možný termín.
Štandardná fakturácia a dodacia adresa.

Ďakujem
J. Halász`,
      receivedAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
      status: 'action-taken',
      aiSuggestedAction: 'create-order',
      aiConfidence: '99.20',
      assignedOzId: reps[0].id,
      customerId: customers[0].id,
    },
    {
      from: 'info@elektrocentrum.sk',
      fromCompany: 'Elektro Centrum s.r.o.',
      subject: 'Reklamácia - poškodený materiál',
      body: `Dobrý deň,

v poslednej dodávke (DL-2024/0234) sme obdržali poškodený materiál:
- 5ks žľabov KZL100x60/3 má deformovaný okraj
- 3ks kryty KRY-100/3 majú poškodený povrch (pravdepodobne počas prepravy)

Číslo dodacieho listu: DL-2024/0234
Dátum dodania: 15.02.2024

Materiál sme nafotili, fotky priložené v prílohe.

Prosím o riešenie - výmenu poškodených kusov alebo dobropis.

S pozdravom
Katarína Vargová
Elektro Centrum s.r.o.`,
      receivedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'assign-to-rep',
      aiConfidence: '92.30',
      assignedOzId: reps[5].id,
      customerId: customers[5].id,
    },
    {
      from: 'objednavky@profistav.sk',
      fromCompany: 'ProfiStav a.s.',
      subject: 'Dopyt - káblové rebríky',
      body: `Dobrý deň,

na projekt do Žiliny potrebujeme káblové rebríky namiesto žľabov (požiadavka klienta).

Požadované množstvo:
- Rebrík 200mm: cca 120 metrov
- Rebrík 300mm: cca 80 metrov
- Príslušenstvo: konzoly, závesy, spojky

Prosím o:
1. Cenovú ponuku
2. Skladovú dostupnosť
3. Termín dodania
4. Technické parametre (nosnosť)

Peter Szabó
ProfiStav a.s.`,
      receivedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'respond-with-prices',
      aiConfidence: '94.70',
      assignedOzId: reps[1].id,
      customerId: customers[2].id,
    },
    {
      from: 'techno@technoenergia.sk',
      fromCompany: 'TechnoEnergia s.r.o.',
      subject: 'K objednávke č. OSV-2024-0156 - chýbajúce položky',
      body: `Dobrý deň,

k našej objednávke zo včera (č. OSV-2024-0156) potrebujeme ešte doplniť:

- 12ks SKR-M10x25 (bal. 100ks) - skrutky pre kotvu stĺpov
- 12ks MAT-M10 (bal. 100ks)
- 12ks POD-M10 (bal. 100ks)

Vieme to pridať do tej istej objednávky alebo máme urobiť novú?

Michal Tóth`,
      receivedAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'request-info',
      aiConfidence: '88.40',
      assignedOzId: reps[2].id,
      customerId: customers[4].id,
    },
    {
      from: 'stavmat@stavmat.sk',
      fromCompany: 'StavMat Group s.r.o.',
      subject: 'Objednávka upevňovacieho materiálu',
      body: `Dobrý deň,

potrebujeme:
- Kotevné bolty M8x80: 500ks
- Kotevné bolty M10x100: 300ks
- Stahovacie pásky 200mm: 20 balení
- Skrutky M8x20: 5 balení
- Matice M8: 5 balení
- Podložky M8: 5 balení

Dodanie: najbližší možný termín
Odber: Prešov

Anna Molnárová`,
      receivedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'create-order',
      aiConfidence: '96.10',
      assignedOzId: reps[4].id,
      customerId: customers[3].id,
    },
    {
      from: 'balog@kabelpro.sk',
      fromCompany: 'KábelPro s.r.o.',
      subject: 'Dopyt - rozvádzače väčšie rozmery',
      body: `Ahoj,

potrebujeme rozvádzač 1200x1000 alebo aspoň 1200x800.

Máte niečo také? V katalógu som videl maximálne 1000x800.

Ak nie, viete zohnať? Je to pre zákazníka na veľký projekt.

Ján Balog
+421 908 789 012`,
      receivedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'request-info',
      aiConfidence: '81.90',
      assignedOzId: reps[6].id,
      customerId: customers[6].id,
    },
    {
      from: 'servis@elektroservis.sk',
      fromCompany: 'ElektroServis Košice s.r.o.',
      subject: 'Potvrdenie prevzatia - DL-2024/0251',
      body: `Dobrý deň,

potvrdujeme prevzatie materiálu podľa dodacieho listu č. DL-2024/0251.

Všetko v poriadku, materiál kompletný a nepoškodený.

Môžete vystaviť faktúru.

S pozdravom
Marek Horváth`,
      receivedAt: new Date(Date.now() - 28 * 60 * 60 * 1000),
      status: 'processed',
      aiSuggestedAction: 'create-invoice',
      aiConfidence: '94.20',
      assignedOzId: reps[0].id,
      customerId: customers[8].id,
    },
    {
      from: 'objednavky@hagardhal.sk',
      fromCompany: 'HagardHal s.r.o.',
      subject: 'EDI: ORDER-2024-02-456',
      body: `ORDER_ID: 2024-02-456
CUSTOMER: HAGARDHAL
DATE: 2024-02-25
PRIORITY: NORMAL

ITEMS:
KZL300x60/3|50|32.50
BWSC450|150|12.20
PRI-630-3F|10|145.00
ROZ-800-600-250|5|245.00
SPJ-300|200|3.50
KRY-300/3|50|19.90

DELIVERY_DATE: 2024-03-05
SHIP_TO: HAGARDHAL_WAREHOUSE_01
PAYMENT_TERMS: NET60

NOTES: Urgent delivery required for ongoing project`,
      receivedAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'create-order',
      aiConfidence: '99.50',
      assignedOzId: reps[0].id,
      customerId: customers[0].id,
    },
    {
      from: 'info@elektrostav.sk',
      fromCompany: 'ElektroStav s.r.o.',
      subject: 'Objednávka - žľaby + príslušenstvo Bratislava',
      body: `Dobrý deň,

objednávka na projekt v Bratislave:

20x KZL100x100/3
50x BWS450  
30x SPJ-100
10x KRY-100/3
100x KOTVA-M8x80
5x SKR-M8x20 (balenie)

Dodanie: do konca týždňa
Adresa: Bratislava, Bajkalská 20

Ing. Pavol Kováč
ElektroStav s.r.o.`,
      receivedAt: new Date(Date.now() - 32 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'create-order',
      aiConfidence: '95.80',
      assignedOzId: reps[3].id,
      customerId: customers[1].id,
    },
    {
      from: 'info@elektrocentrum.sk',
      fromCompany: 'Elektro Centrum s.r.o.',
      subject: 'Otázka k prípojniciam - kompatibilita',
      body: `Ahoj,

mám technickú otázku:

Je prípojnicový systém 630A kompatibilný s 1000A? Teda môžeme postupne rozširovať systém, alebo treba hneď objednať celý v rovnakej veľkosti?

Vieme na 630A systém neskôr pridať odvodovú jednotku, alebo sa musí objednať hneď komplet?

Aký je fyzický rozmer rozdielu medzi 630A a 1000A systémom?

Potrebujeme to vedieť kvôli projektu, kde možno bude v budúcnosti rozšírenie.

Ďakujem za info!

Katka Vargová
Elektro Centrum`,
      receivedAt: new Date(Date.now() - 34 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'request-info',
      aiConfidence: '87.50',
      assignedOzId: reps[5].id,
      customerId: customers[5].id,
    },
    {
      from: 'techno@technoenergia.sk',
      fromCompany: 'TechnoEnergia s.r.o.',
      subject: 'Potvrdenie platby FA-2024/0198',
      body: `Dobrý deň,

dnes (25.02.2024) sme uhradili faktúru č. FA-2024/0198 v plnej výške 7 542,00 EUR (vrátane DPH).

Platba bola realizovaná cez Revolut Business.
Transaction ID: REV-20240225-458796

Prosím o potvrdenie prijatia platby.

S pozdravom
Michal Tóth
TechnoEnergia s.r.o.`,
      receivedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
      status: 'processed',
      aiSuggestedAction: 'assign-to-rep',
      aiConfidence: '91.90',
      assignedOzId: reps[2].id,
      customerId: customers[4].id,
    },
    {
      from: 'objednavky@profistav.sk',
      fromCompany: 'ProfiStav a.s.',
      subject: 'Overenie skladovej dostupnosti - urgentné',
      body: `Dobrý deň,

prosím o urgenté overenie skladovej dostupnosti týchto položiek:

- Prípojnicový systém 1000A (PRI-1000-3F): 8ks
- Odvodové jednotky (PRI-ODVOD): 25ks
- T-rozboče (PRI-ROZB): 12ks
- Adaptéry (PRI-ADAPT): 30ks

Potrebujeme to URGENTNE na budúci týždeň (najneskôr štvrtok 29.02).

Ak nemáte všetko skladom, prosím info čo áno a čo nie, aby sme vedeli plánovať.

Projekt je veľký a časovo kritický!

Peter Szabó
+421 903 345 678`,
      receivedAt: new Date(Date.now() - 38 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'respond-with-prices',
      aiConfidence: '89.70',
      assignedOzId: reps[1].id,
      customerId: customers[2].id,
    },
    {
      from: 'kiss@stavtech.sk',
      fromCompany: 'StavTech Prešov s.r.o.',
      subject: 'Nový zákazník - predstavenie a prvá objednávka',
      body: `Dobrý deň,

sme nová firma StavTech Prešov, zaoberáme sa elektroinstaláciami a hľadáme dodávateľa káblových systémov.

Dostal som vašu firmu odporúčanú od ProfiStav.

Pre prvú objednávku potrebujeme:
- Žľaby 100x60: 30ks
- Žľaby 200x60: 20ks
- Výložníky 300mm: 100ks
- Spojky: mix veľkostí cca 150ks

Prosím o:
1. Registráciu ako nový zákazník
2. Cenovú ponuku
3. Info o platobných podmienkach
4. Termín dodania

Do budúcna plánujeme pravidelnú spoluprácu, robíme veľa projektov v regióne Prešov/Košice.

Kontakt:
Zuzana Kiss
StavTech Prešov s.r.o.
+421 912 234 567
kiss@stavtech.sk

S pozdravom
Zuzana Kiss`,
      receivedAt: new Date(Date.now() - 40 * 60 * 60 * 1000),
      status: 'new',
      aiSuggestedAction: 'assign-to-rep',
      aiConfidence: '93.20',
      assignedOzId: reps[1].id,
      customerId: customers[9].id,
    },
  ];

  const emails = await db.insert(schema.emails).values(emailsData).returning();
  console.log(`✓ Inserted ${emails.length} emails`);

  // Insert delivery notes
  const deliveryNotesData = [
    {
      number: 'DL-2024/0234',
      customerId: customers[5].id,
      status: 'pending',
      items: JSON.stringify([
        { productCode: 'KZL100x60/3', productName: 'Žľab káblový perforovaný 100x60mm L=3m', quantity: 50, price: 15.80, total: 790.00 },
        { productCode: 'BWSC300', productName: 'Výložník C-profil 300mm', quantity: 100, price: 9.50, total: 950.00 },
        { productCode: 'SPJ-100', productName: 'Spojka žľabová 100mm', quantity: 80, price: 2.10, total: 168.00 },
      ]),
      totalAmount: '1908.00',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'DL-2024/0245',
      customerId: customers[4].id,
      status: 'pending',
      items: JSON.stringify([
        { productCode: 'OSV-STLP-8M', productName: 'Osvetľovací stĺp 8m oceľový', quantity: 12, price: 385.00, total: 4620.00 },
        { productCode: 'OSV-SVIETIDLO-100W', productName: 'LED svietidlo 100W', quantity: 9, price: 125.00, total: 1125.00 },
        { productCode: 'OSV-PATICA', productName: 'Pätica pre osvetľovací stĺp', quantity: 12, price: 45.00, total: 540.00 },
      ]),
      totalAmount: '6285.00',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'DL-2024/0251',
      customerId: customers[8].id,
      status: 'completed',
      items: JSON.stringify([
        { productCode: 'ROZ-600-600-200', productName: 'Rozvádzačová skriňa 600x600x200', quantity: 3, price: 185.00, total: 555.00 },
        { productCode: 'ROZ-MONT-DOSKA', productName: 'Montážna doska do skrine', quantity: 3, price: 28.00, total: 84.00 },
      ]),
      totalAmount: '639.00',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'DL-2024/0256',
      customerId: customers[0].id,
      status: 'completed',
      items: JSON.stringify([
        { productCode: 'KZL100x60/3', productName: 'Žľab káblový perforovaný 100x60mm L=3m', quantity: 200, price: 15.80, total: 3160.00 },
        { productCode: 'KZL200x60/3', productName: 'Žľab káblový perforovaný 200x60mm L=3m', quantity: 150, price: 24.90, total: 3735.00 },
        { productCode: 'BWS300', productName: 'Výložník konzolový 300mm', quantity: 500, price: 8.20, total: 4100.00 },
        { productCode: 'SPJ-100', productName: 'Spojka žľabová 100mm', quantity: 1000, price: 2.10, total: 2100.00 },
      ]),
      totalAmount: '13095.00',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
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
      amount: '13095.00',
      vatAmount: '2619.00',
      dueDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      status: 'sent',
      items: JSON.stringify([
        { productCode: 'KZL100x60/3', quantity: 200, price: 15.80, total: 3160.00 },
        { productCode: 'KZL200x60/3', quantity: 150, price: 24.90, total: 3735.00 },
        { productCode: 'BWS300', quantity: 500, price: 8.20, total: 4100.00 },
        { productCode: 'SPJ-100', quantity: 1000, price: 2.10, total: 2100.00 },
      ]),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'FA-2024/0156',
      customerId: customers[3].id,
      type: 'issued',
      amount: '2145.00',
      vatAmount: '429.00',
      dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'sent',
      items: JSON.stringify([
        { productCode: 'ROZ-800-600-250', quantity: 5, price: 245.00, total: 1225.00 },
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
      dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'paid',
      revolutPaymentId: 'REV-20240225-458796',
      items: JSON.stringify([
        { productCode: 'OSV-STLP-8M', quantity: 12, price: 385.00, total: 4620.00 },
        { productCode: 'OSV-SVIETIDLO-100W', quantity: 12, price: 125.00, total: 1500.00 },
        { productCode: 'OSV-VYL-STLP', quantity: 12, price: 68.00, total: 816.00 },
      ]),
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'FA-2024/0134',
      customerId: customers[1].id,
      type: 'issued',
      amount: '4580.00',
      vatAmount: '916.00',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'overdue',
      items: JSON.stringify([
        { productCode: 'KZL200x60/3', quantity: 100, price: 24.90, total: 2490.00 },
        { productCode: 'PRI-630-3F', quantity: 5, price: 145.00, total: 725.00 },
        { productCode: 'BWS450', quantity: 150, price: 10.80, total: 1620.00 },
      ]),
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'FA-2024/0167',
      customerId: customers[2].id,
      type: 'issued',
      amount: '12845.00',
      vatAmount: '2569.00',
      dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      status: 'viewed',
      items: JSON.stringify([
        { productCode: 'KZL300x60/3', quantity: 150, price: 32.50, total: 4875.00 },
        { productCode: 'PRI-1000-3F', quantity: 8, price: 210.00, total: 1680.00 },
        { productCode: 'BWSC450', quantity: 200, price: 12.20, total: 2440.00 },
        { productCode: 'SPJ-300', quantity: 300, price: 3.50, total: 1050.00 },
      ]),
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'FA-2024/0172',
      customerId: customers[7].id,
      type: 'issued',
      amount: '8450.00',
      vatAmount: '1690.00',
      dueDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
      status: 'sent',
      items: JSON.stringify([
        { productCode: 'KZL200x60/3', quantity: 80, price: 24.90, total: 1992.00 },
        { productCode: 'KRB200/3', quantity: 50, price: 34.80, total: 1740.00 },
        { productCode: 'PRI-630-3F', quantity: 12, price: 145.00, total: 1740.00 },
      ]),
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'FA-2024/0189',
      customerId: customers[6].id,
      type: 'issued',
      amount: '2890.00',
      vatAmount: '578.00',
      dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      status: 'viewed',
      items: JSON.stringify([
        { productCode: 'KZL100x60/3', quantity: 100, price: 15.80, total: 1580.00 },
        { productCode: 'BWS300', quantity: 50, price: 8.20, total: 410.00 },
        { productCode: 'SPJ-100', quantity: 200, price: 2.10, total: 420.00 },
        { productCode: 'KRY-100/3', quantity: 30, price: 9.50, total: 285.00 },
      ]),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    // Incoming invoices from BAKS
    {
      number: 'BAKS-2024/5678',
      customerId: customers[0].id,
      type: 'received',
      amount: '18500.00',
      vatAmount: '3700.00',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'sent',
      items: JSON.stringify([
        { productCode: 'KZL100x60/3', quantity: 500, price: 14.00, total: 7000.00, note: 'Veľkoobchodná cena' },
        { productCode: 'KZL200x60/3', quantity: 300, price: 22.00, total: 6600.00 },
        { productCode: 'BWS300', quantity: 1000, price: 7.20, total: 7200.00 },
      ]),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'BAKS-2024/5689',
      customerId: customers[0].id,
      type: 'received',
      amount: '5420.00',
      vatAmount: '1084.00',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'sent',
      items: JSON.stringify([
        { productCode: 'ROZ-600-600-200', quantity: 20, price: 175.00, total: 3500.00, note: '⚠️ Cena nekorešponduje s CP 185,00!' },
        { productCode: 'ROZ-MONT-DOSKA', quantity: 20, price: 26.00, total: 520.00 },
        { productCode: 'ROZ-ZAMOK', quantity: 30, price: 11.00, total: 330.00 },
      ]),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      number: 'BAKS-2024/5701',
      customerId: customers[0].id,
      type: 'received',
      amount: '8920.00',
      vatAmount: '1784.00',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'sent',
      items: JSON.stringify([
        { productCode: 'PRI-630-3F', quantity: 20, price: 132.00, total: 2640.00 },
        { productCode: 'PRI-1000-3F', quantity: 15, price: 195.00, total: 2925.00 },
        { productCode: 'SPJ-100', quantity: 2000, price: 1.85, total: 3700.00 },
      ]),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
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
      totalAmount: '2895.00',
      items: JSON.stringify([
        { productCode: 'KZL100x60/3', quantity: 50, price: 15.80 },
        { productCode: 'BWSC300', quantity: 200, price: 9.50 },
        { productCode: 'ZM8x1000', quantity: 100, price: 3.80 },
        { productCode: 'KRY-100/3', quantity: 50, price: 9.50 },
        { productCode: 'SPJ-100', quantity: 150, price: 2.10 },
      ]),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      confirmedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      customerId: customers[4].id,
      emailId: emails[4].id,
      status: 'in-progress',
      totalAmount: '7436.00',
      items: JSON.stringify([
        { productCode: 'OSV-STLP-8M', quantity: 12, price: 385.00 },
        { productCode: 'OSV-SVIETIDLO-100W', quantity: 12, price: 125.00 },
        { productCode: 'OSV-PATICA', quantity: 12, price: 45.00 },
        { productCode: 'OSV-VYL-STLP', quantity: 12, price: 68.00 },
      ]),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      confirmedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      customerId: customers[6].id,
      emailId: emails[6].id,
      status: 'confirmed',
      totalAmount: '2170.00',
      items: JSON.stringify([
        { productCode: 'KZL100x60/3', quantity: 100, price: 15.80 },
        { productCode: 'BWS300', quantity: 50, price: 8.20 },
        { productCode: 'SPJ-100', quantity: 200, price: 2.10 },
        { productCode: 'KRY-100/3', quantity: 30, price: 9.50 },
      ]),
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      confirmedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      customerId: customers[1].id,
      emailId: emails[1].id,
      status: 'new',
      totalAmount: '3550.00',
      items: JSON.stringify([
        { productCode: 'KZL200x60/3', quantity: 100, price: 24.90 },
        { productCode: 'BWS450', quantity: 50, price: 10.80 },
        { productCode: 'SPJ-200', quantity: 200, price: 2.80 },
      ]),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      customerId: customers[3].id,
      emailId: emails[12].id,
      status: 'confirmed',
      totalAmount: '985.00',
      items: JSON.stringify([
        { productCode: 'KOTVA-M8x80', quantity: 500, price: 0.65 },
        { productCode: 'KOTVA-M10x100', quantity: 300, price: 0.95 },
        { productCode: 'PASKY-200', quantity: 20, price: 5.50 },
        { productCode: 'SKR-M8x20', quantity: 5, price: 12.00 },
      ]),
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      confirmedAt: new Date(Date.now() - 19 * 60 * 60 * 1000),
    },
  ];

  const orders = await db.insert(schema.orders).values(ordersData).returning();
  console.log(`✓ Inserted ${orders.length} orders`);

  // Insert dashboard stats (30 days)
  const dashboardStatsData = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    // Daily revenue (8,000 - 18,000 EUR)
    const baseRevenue = 8000 + Math.random() * 10000;
    dashboardStatsData.push({
      date,
      metric: 'daily_revenue',
      value: baseRevenue.toFixed(2),
    });
    
    // Daily inquiries (50-70)
    const inquiries = Math.floor(50 + Math.random() * 21);
    dashboardStatsData.push({
      date,
      metric: 'daily_inquiries',
      value: inquiries.toString(),
    });
    
    // Daily quotes (25-35)
    const quotes = Math.floor(25 + Math.random() * 11);
    dashboardStatsData.push({
      date,
      metric: 'daily_quotes',
      value: quotes.toString(),
    });
    
    // Daily orders (15-25)
    const ordersCount = Math.floor(15 + Math.random() * 11);
    dashboardStatsData.push({
      date,
      metric: 'daily_orders',
      value: ordersCount.toString(),
    });
    
    // Conversion rate (50-60%)
    const conversion = (50 + Math.random() * 10).toFixed(2);
    dashboardStatsData.push({
      date,
      metric: 'daily_conversion',
      value: conversion,
    });
  }

  await db.insert(schema.dashboardStats).values(dashboardStatsData);
  console.log(`✓ Inserted ${dashboardStatsData.length} dashboard stats`);

  console.log('✅ Comprehensive seed completed successfully!');
  console.log(`
📊 Summary:
- ${reps.length} sales reps
- ${customers.length} customers
- ${products.length} regular products
- ${compositeProducts.length} composite products
- ${emails.length} emails (Slovak)
- ${deliveryNotes.length} delivery notes
- ${invoices.length} invoices
- ${orders.length} orders
- ${dashboardStatsData.length} dashboard data points (30 days)
  `);
  
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
