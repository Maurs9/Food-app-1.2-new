import { FoodCategory } from '../types';

export const FOOD_GUIDE_DATA: FoodCategory[] = [
    {
        name: "Fructe",
        icon: "🍎",
        color: "text-pink-500",
        subcategories: [
            {
                name: "Fructe de Pădure & Similare",
                tiers: [
                    {
                        name: "A",
                        foods: [
                            { name: "Afine", tier: 'A', info: "Considerate un super-aliment, bogate în antioxidanți care protejează creierul.", cons: "Pot fi scumpe.", tags: { regions: ['Europa', 'America de Nord'], benefitsForOrgans: ['Creier', 'Inimă', 'Ochi', 'Imunitate'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Fibre', 'Bogat în Antioxidanți'] } },
                            { name: "Mure", tier: 'A', info: "Foarte bogate în fibre, Vitamina C și K. Conțin antioxidanți puternici.", cons: "Pot fi acide dacă nu sunt coapte.", tags: { regions: ['Europa', 'America de Nord'], benefitsForOrgans: ['Sistem Digestiv', 'Inimă', 'Piele'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Fibre', 'Bogat în Antioxidanți'] } }
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                            { name: "Căpșuni", tier: 'B', info: "Bogate în Vitamina C și mangan. Indice glicemic scăzut.", cons: "Pot fi alergene și absorb multe pesticide.", tags: { regions: ['Global'], benefitsForOrgans: ['Inimă', 'Imunitate', 'Piele'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Antioxidanți'] } },
                            { name: "Zmeură", tier: 'B', info: "Conținut foarte mare de fibre și Vitamina C. Indice glicemic scăzut.", cons: "Foarte perisabile.", tags: { regions: ['Europa', 'America de Nord'], benefitsForOrgans: ['Sistem Digestiv', 'Inimă'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Fibre'] } },
                            { name: "Coacăze roșii", tier: 'B', info: "Bogate în Vitamina C și antioxidanți. Gust acrișor, răcoritor.", cons: "Aciditate ridicată." },
                            { name: "Coacăze negre", tier: 'B', info: "Conținut excepțional de Vitamina C și antocianine (mai mult decât afinele).", cons: "Gust intens, astringent." },
                            { name: "Agrișe", tier: 'B', info: "Sursă bună de Vitamina C și fibre. Gust unic, acrișor.", cons: "Adesea necesită îndulcire pentru a fi palatabile." },
                            { name: "Dude", tier: 'B', info: "Sursă bună de fier, Vitamina C și antioxidanți.", cons: "Foarte perisabile și pătează." },
                        ]
                    }
                ]
            },
            {
                name: "Fructe Comune & Sâmburoase",
                tiers: [
                     {
                        name: "TOP",
                        foods: [
                            { name: "Kiwi", tier: 'TOP', info: "Densitate nutritivă foarte mare. Conținut excepțional de Vitamina C și K, plus fibre și potasiu. Ajută la digestie.", cons: "Poate fi alergen pentru unele persoane. Aciditatea poate deranja.", tags: { regions: ['Asia', 'Global'], benefitsForOrgans: ['Sistem Digestiv', 'Imunitate', 'Piele'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Fibre'] } },
                        ]
                    },
                    {
                        name: "A",
                        foods: [
                            { name: "Mere", tier: 'A', info: "Sursă bună de fibre (pectină) și Vitamina C. Benefice pentru digestie și sănătatea inimii.", cons: "A se consuma cu coajă pentru maximum de beneficii. Pot conține pesticide.", tags: { regions: ['Global'], benefitsForOrgans: ['Sistem Digestiv', 'Inimă'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Fibre'] } },
                            { name: "Pere", tier: 'A', info: "Sursă bună de fibre și cupru. Mai puțin alergenice decât alte fructe. Textură fină.", cons: "Conținut caloric și de zahăr similar cu merele.", tags: { regions: ['Global'], benefitsForOrgans: ['Sistem Digestiv'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Fibre'] } },
                            { name: "Piersici", tier: 'A', info: "Sursă bună de Vitamina C și A. Hidratante și bogate în antioxidanți.", cons: "Puful de pe coajă poate fi iritant pentru unii." },
                            { name: "Nectarine", tier: 'A', info: "Similare cu piersicile, dar cu coaja netedă. Sursă bună de Vitamina C și potasiu.", cons: "Pot fi mai perisabile decât piersicile." },
                            { name: "Caise", tier: 'A', info: "Bogate în Vitamina A (beta-caroten) și potasiu. Bune pentru sănătatea ochilor și a pielii.", cons: "Cele uscate au zahăr concentrat.", tags: { regions: ['Europa', 'Asia'], benefitsForOrgans: ['Ochi', 'Piele'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: [] } },
                            { name: "Prune", tier: 'A', info: "Cunoscute pentru efectul laxativ datorită fibrelor și sorbitolului. Bogate în antioxidanți.", cons: "Prunele uscate sunt dense caloric și în zahăr." },
                            { name: "Cireșe", tier: 'A', info: "Sursă de antioxidanți și melatonină, care poate ajuta la somn. Proprietăți antiinflamatorii.", cons: "Conținut ridicat de zahăr. Disponibilitate sezonieră." },
                            { name: "Vișine", tier: 'A', info: "Concentrație foarte mare de antioxidanți, mai mare decât la cireșe. Ajută la recuperarea musculară.", cons: "Sunt acide și rar consumate crude." }
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                            { name: "Struguri", tier: 'B', info: "Conțin antioxidanți precum resveratrol (în special cei roșii). Hidratanți.", cons: "Conținut ridicat de zahăr. Ușor de consumat în exces." },
                            { name: "Gutui", tier: 'B', info: "Bogate în fibre și Vitamina C. Aroma deosebită când sunt gătite.", cons: "Nu se pot consuma crude, sunt tari și astringente." },
                        ]
                    }
                ]
            },
            {
                name: "Citrice",
                tiers: [
                    {
                        name: "A",
                        foods: [
                            { name: "Portocale", tier: 'A', info: "Bogate în Vitamina C și antioxidanți. Hidratante și benefice pentru sistemul imunitar.", cons: "Sucul de portocale este lipsit de fibre și concentrează zahărul.", tags: { regions: ['Global'], benefitsForOrgans: ['Imunitate', 'Piele'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Antioxidanți'] } },
                            { name: "Lămâi", tier: 'A', info: "Concentrație foarte mare de Vitamina C și flavonoide. Alcalinizante în organism, în ciuda acidității.", cons: "Foarte acide, consumul în exces poate dăuna smalțului dentar." },
                            { name: "Grapefruit", tier: 'A', info: "Excelentă sursă de Vitamina C și A. Poate contribui la pierderea în greutate.", cons: "Interacționează periculos cu anumite medicamente (statine, etc.)." },
                            { name: "Mandarine", tier: 'A', info: "Bogate în Vitamina C și ușor de curățat. Hidratante și dulci.", cons: "Conțin mai puțină fibră decât portocalele." },
                            { name: "Clementine", tier: 'A', info: "Similare cu mandarinele, adesea fără semințe. Foarte bogate în Vitamina C.", cons: "Conținut de zahăr similar cu mandarinele." },
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                            { name: "Pomelo", tier: 'B', info: "Cel mai mare citric. Bogat în Vitamina C, hidratant.", cons: "Membrana groasă și amară trebuie îndepărtată." },
                            { name: "Kumquat", tier: 'B', info: "Se mănâncă cu tot cu coajă, care este dulce. Bogat în fibre și Vitamina C.", cons: "Mici, poate fi nevoie de o cantitate mare." },
                            { name: "Lime", tier: 'B', info: "Similar cu lămâia, bogat în Vitamina C și antioxidanți. Gust distinct.", cons: "Foarte acid." }
                        ]
                    }
                ]
            },
            {
                name: "Fructe Tropicale & Exotice",
                tiers: [
                     {
                        name: "TOP",
                        foods: [
                            { name: "Avocado", tier: 'TOP', info: "Fruct unic, bogat în grăsimi mononesaturate sănătoase, fibre și potasiu. Benefic pentru inimă și sațietate.", cons: "Dens caloric, trebuie consumat cu moderație.", tags: { regions: ['America de Nord', 'America de Sud'], benefitsForOrgans: ['Inimă', 'Creier', 'Piele'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Grăsimi Sănătoase', 'Bogat în Fibre'] } },
                            { name: "Guava", tier: 'TOP', info: "Conținut excepțional de Vitamina C, depășind portocalele. Bogată în fibre, licopen și antioxidanți.", cons: "Semințele mici și tari pot fi neplăcute pentru unii." },
                            { name: "Papaya", tier: 'TOP', info: "Conține papaină, o enzimă digestivă puternică. Foarte bogat în Vitamina C, A și antioxidanți. Benefic pentru piele și digestie.", cons: "Gustul specific nu este pe placul tuturor. Semințele sunt necomestibile în cantități mari." },
                            { name: "Rodie", tier: 'TOP', info: "Bogată în antioxidanți puternici (punicalagine). Benefică pentru sănătatea inimii și memorie.", cons: "Consumul poate fi anevoios din cauza semințelor." },
                            { name: "Mango", tier: 'TOP', info: "Bogat în Vitamina A și C. Gust delicios și textură cremoasă.", cons: "Conținut relativ mare de zahăr." }
                        ]
                    },
                    {
                        name: "A",
                        foods: [
                            { name: "Ananas", tier: 'A', info: "Conține bromelaină, o enzimă antiinflamatoare care ajută la digestie. Bogat în Vitamina C.", cons: "Aciditatea poate deranja persoanele sensibile." },
                            { name: "Fructul Pasiunii", tier: 'A', info: "Bogat în fibre, Vitamina A și C. Conține antioxidanți.", cons: "Aciditate ridicată. Conținut mic de pulpă." },
                            { name: "Kaki (Persimmon)", tier: 'A', info: "Sursă bună de Vitamina A și C. Bogat în fibre și antioxidanți.", cons: "Varietățile astringente trebuie să fie foarte coapte." },
                            { name: "Smochine proaspete", tier: 'A', info: "Sursă bună de fibre și minerale (potasiu, calciu). Dulceață naturală.", cons: "Foarte perisabile. Cele uscate au mult zahăr." },
                            { name: "Litchi", tier: 'A', info: "Sursă bună de Vitamina C și cupru. Gust unic, floral.", cons: "Consumul pe stomacul gol a fructelor necoapte poate fi periculos." }
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                            { name: "Banane", tier: 'B', info: "Sursă excelentă de potasiu și energie rapidă. Bune pentru sportivi.", cons: "Conținut mai mare de zahăr și carbohidrați, în special cele coapte.", tags: { regions: ['America de Sud', 'Asia', 'Africa'], benefitsForOrgans: ['Mușchi', 'Inimă'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: [] } },
                            { name: "Pepene verde", tier: 'B', info: "Excelent pentru hidratare (peste 90% apă). Conține licopen (antioxidant).", cons: "Valoare nutrițională mai scăzută comparativ cu alte fructe, indice glicemic mare." },
                            { name: "Pepene galben", tier: 'B', info: "Foarte hidratant. Bogat în Vitamina A și C.", cons: "Conținut ridicat de zahăr." },
                             { name: "Carambola (Star Fruit)", tier: 'B', info: "Sărac în calorii și bogat în Vitamina C. Aspect atractiv.", cons: "Conține oxalați, periculos pentru persoanele cu probleme renale." },
                            { name: "Pitaya (Fructul Dragonului)", tier: 'B', info: "Aspect deosebit, conține fibre și magneziu. Hidratant.", cons: "Gust subtil, uneori considerat fad. Valoare nutrițională moderată." }
                        ]
                    },
                    {
                        name: "C",
                        foods: [
                            { name: "Nucă de cocos proaspătă", tier: 'C', info: "Carnea este bogată în fibre și grăsimi saturate (MCT). Apa de cocos hidratează.", cons: "Foarte densă caloric și în grăsimi saturate." },
                        ]
                    }
                ]
            },
            {
                name: "Fructe Uscate & Conservate",
                tiers: [
                     {
                        name: "C",
                        foods: [
                             { name: "Curmale proaspete", tier: 'C', info: "Sursă excelentă de energie, fibre și potasiu.", cons: "Foarte bogate în zahăr și calorii. Se consumă în cantități mici." },
                             { name: "Măsline", tier: 'C', info: "Fruct bogat în grăsimi mononesaturate sănătoase și Vitamina E.", cons: "Procesate, au un conținut foarte ridicat de sodiu.", tags: { regions: ['Europa'], benefitsForOrgans: ['Inimă'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Grăsimi Sănătoase'] } }
                        ]
                    },
                    {
                        name: "D",
                        foods: [
                            { name: "Prune uscate", tier: 'D', info: "Concentrate în fibre și sorbitol, excelente pentru digestie.", cons: "Foarte dense caloric și în zahăr. Efect laxativ puternic." },
                            { name: "Caise uscate", tier: 'D', info: "Sursă bună de potasiu și Vitamina A.", cons: "Adesea tratate cu sulfiți pentru a păstra culoarea, pot cauza reacții alergice." },
                            { name: "Banane uscate (chips)", tier: 'D', info: "Sursă de potasiu.", cons: "Adesea prăjite în ulei și îndulcite, devenind nesănătoase." }
                        ]
                    },
                    {
                        name: "E",
                        foods: [
                            { name: "Fructe la conservă în sirop greu", tier: 'E', info: "Convenabile și durată mare de viață.", cons: "Siropul este apă cu zahăr, adăugând calorii goale și crescând dramatic glicemia." },
                            { name: "Fructe confiate/glazurate", tier: 'E', info: "Folosite în cofetărie.", cons: "Mai mult zahăr decât fruct. Lipsite de valoare nutrițională, un desert pur." }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Legume",
        icon: "🥦",
        color: "text-emerald-600",
        subcategories: [
            {
                name: "Frunze Verzi Închise",
                tiers: [
                    {
                        name: "TOP",
                        foods: [
                            { name: "Spanac", tier: 'TOP', info: "Extrem de dens în nutrienți: Vitaminele K, A, C, fier, calciu și antioxidanți. Foarte scăzut în calorii.", cons: "Bogat în oxalați, poate fi o problemă pentru persoanele cu risc de pietre la rinichi.", tags: { regions: ['Global'], benefitsForOrgans: ['Ochi', 'Oase', 'Piele', 'Imunitate'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Sărac în Calorii', 'Bogat în Antioxidanți'] } },
                            { name: "Kale (Varză furajeră)", tier: 'TOP', info: "Unul dintre cele mai nutritive alimente. Încărcat cu vitaminele K, A, C și antioxidanți puternici.", cons: "Gust amărui și textură fibroasă dacă nu este preparat corect. Conține goitrogeni.", tags: { regions: ['Global'], benefitsForOrgans: ['Oase', 'Inimă', 'Ochi'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Fibre', 'Bogat în Antioxidanți'] } },
                            { name: "Sfeclă elvețiană (Swiss Chard)", tier: 'TOP', info: "Extrem de bogată în Vitamina K și A. Sursă bună de magneziu și potasiu.", cons: "Similar cu spanacul, conține oxalați." }
                        ]
                    }
                ]
            },
            {
                name: "Crucifere",
                tiers: [
                    {
                        name: "TOP",
                        foods: [
                             { name: "Broccoli", tier: 'TOP', info: "Bogat în sulforafan, un compus cu puternice proprietăți anti-cancer. Sursă excelentă de Vitamina C, K și fibre.", cons: "Poate cauza balonare la persoanele sensibile.", tags: { regions: ['Global'], benefitsForOrgans: ['Imunitate', 'Oase', 'Sistem Digestiv'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Fibre', 'Bogat în Antioxidanți'] } },
                             { name: "Conopidă", tier: 'TOP', info: "Versatilă și bogată în antioxidanți și compuși anti-cancer. Sursă bună de Vitamina C și fibre.", cons: "Gustul poate fi fad dacă nu este asezonată. Poate cauza gaze." },
                             { name: "Varza de Bruxelles", tier: 'TOP', info: "Foarte bogată în Vitamina K și C. Conține antioxidanți și compuși anti-cancer.", cons: "Gust amărui care nu e pe placul tuturor. Poate cauza gaze." }
                        ]
                    },
                     {
                        name: "A",
                        foods: [
                            { name: "Varză", tier: 'A', info: "Săracă în calorii, bogată în Vitamina K și C. Benefică pentru digestie.", cons: "Similar cu alte crucifere, poate provoca balonare." }
                        ]
                    }
                ]
            },
            {
                name: "Rădăcinoase & Tuberculi",
                tiers: [
                    {
                        name: "A",
                        foods: [
                            { name: "Morcovi", tier: 'A', info: "Sursă excelentă de beta-caroten (Vitamina A), important pentru vedere și sistemul imunitar.", cons: "Gătirea crește biodisponibilitatea beta-carotenului.", tags: { regions: ['Global'], benefitsForOrgans: ['Ochi', 'Piele', 'Imunitate'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Fibre'] } },
                             { name: "Ceapă", tier: 'A', info: "Conține antioxidanți (quercetină) și compuși sulfurați cu efecte anti-inflamatorii. Benefică pentru sănătatea inimii.", cons: "Poate cauza disconfort digestiv și respirație neplăcută." },
                             { name: "Usturoi", tier: 'A', info: "Conține alicină, cu efecte antibacteriene, antivirale puternice. Poate reduce tensiunea arterială.", cons: "Gust și miros foarte puternic. Iritant pentru stomac dacă este consumat în exces." }
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                            { name: "Cartofi dulci", tier: 'B', info: "Bogați în beta-caroten, fibre și vitamine. Indice glicemic mai mic decât cartofii albi.", cons: "Densitate calorică mai mare comparativ cu legumele verzi." },
                            { name: "Sfeclă roșie", tier: 'B', info: "Conține nitrați, care pot îmbunătăți performanța sportivă și pot scădea tensiunea arterială. Sursă bună de folați.", cons: "Poate colora urina și scaunul în roșu, un efect inofensiv." }
                        ]
                    },
                    {
                        name: "C",
                        foods: [
                             { name: "Cartofi albi", tier: 'C', info: "Sursă excelentă de potasiu și Vitamina C (dacă sunt consumați cu coajă). Sățioși.", cons: "Indice glicemic ridicat. Modul de preparare contează enorm (fiert vs. prăjit)." },
                        ]
                    }
                ]
            },
            {
                name: "Alte Legume",
                tiers: [
                    {
                        name: "A",
                        foods: [
                             { name: "Ardei gras (în special roșu)", tier: 'A', info: "Conținut excepțional de Vitamina C (mai ales cel roșu) și antioxidanți.", cons: "Pot fi greu de digerat pentru unele persoane." },
                            { name: "Roșii", tier: 'A', info: "Cea mai bună sursă de licopen, un antioxidant puternic legat de reducerea riscului de cancer de prostată și boli de inimă.", cons: "Licopenul este mai bine absorbit din roșiile gătite." },
                            { name: "Ciuperci", tier: 'A', info: "Sursă bună de vitamine B, seleniu și potasiu. Unele varietăți (expuse la UV) conțin Vitamina D.", cons: "Valoare nutritivă variabilă." },
                            { name: "Sparanghel", tier: 'A', info: "Sursă excelentă de Vitamina K și folați. Conține antioxidanți și are proprietăți diuretice.", cons: "Poate da urinei un miros specific, inofensiv." }
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                            { name: "Castraveți", tier: 'B', info: "Foarte hidratați (peste 95% apă) și săraci în calorii. Conțin antioxidanți în coajă.", cons: "Conținut redus de micronutrienți. Pot fi greu de digerat." },
                            { name: "Dovlecei (Zucchini)", tier: 'B', info: "Sursă bună de potasiu și Vitamina C. Sărac în calorii și versatil în gătit.", cons: "Valoare nutritivă moderată. Textura poate deveni apoasă la gătire." },
                            { name: "Vinete", tier: 'B', info: "Bogate în fibre și antioxidanți, în special nasunină (în coajă), care protejează celulele creierului.", cons: "Absorb mult ulei la gătire." },
                            { name: "Dovleac (Pumpkin/Squash)", tier: 'B', info: "Bogat în beta-caroten (Vitamina A) și fibre. Sățios și versatil.", cons: "Unele varietăți pot fi greu de curățat." }
                        ]
                    },
                    {
                        name: "C",
                        foods: [
                            { name: "Porumb", tier: 'C', info: "Sursă de fibre și carbohidrați. Conține antioxidanți.", cons: "Adesea considerat mai mult o cereală. Conținut mai mare de amidon." },
                            { name: "Mazăre verde", tier: 'C', info: "Sursă bună de proteine vegetale și fibre.", cons: "Conținut mai mare de carbohidrați și zaharuri decât legumele verzi." }
                        ]
                    }
                ]
            },
            {
                name: "Legume Procesate",
                tiers: [
                     {
                        name: "D",
                        foods: [
                            { name: "Legume la conservă (cu sare adăugată)", tier: 'D', info: "Convenabile și de lungă durată.", cons: "Conținut ridicat de sodiu. Procesul de conservare poate reduce conținutul de vitamine." },
                            { name: "Murături în oțet/saramură (comerciale)", tier: 'D', info: "Pot conține probiotice dacă sunt fermentate natural.", cons: "Conținut extrem de ridicat de sodiu. Cele în oțet pot avea zahăr adăugat." }
                        ]
                    },
                    {
                        name: "E",
                        foods: [
                            { name: "Cartofi prăjiți (și alte legume prăjite)", tier: 'E', info: "Gustoși.", cons: "Absorb o cantitate mare de ulei nesănătos. Formează acrilamidă, un compus potențial cancerigen, la temperaturi înalte." }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Leguminoase, Nuci & Semințe",
        icon: "🌰",
        color: "text-orange-800",
        subcategories: [
            {
                name: "Leguminoase",
                tiers: [
                    {
                        name: "TOP",
                        foods: [
                            { name: "Linte (toate tipurile)", tier: 'TOP', info: "Sursă excelentă de proteine vegetale, fibre, fier și folați. Se gătește rapid și este foarte versatilă.", cons: "Conține fitați (înmuierea ajută).", tags: { regions: ['Asia', 'Global'], benefitsForOrgans: ['Sistem Digestiv', 'Inimă'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Proteine', 'Bogat în Fibre'] } }
                        ]
                    },
                    {
                        name: "A",
                        foods: [
                            { name: "Năut", tier: 'A', info: "Profil nutritiv excelent. Bogat în proteine, fibre, mangan și folați.", cons: "Necesită înmuiere și timp de gătire mai lung. Poate cauza balonare." },
                            { name: "Fasole Neagră", tier: 'A', info: "Bogată în fibre și antioxidanți (antocianine). Benefică pentru sănătatea digestivă.", cons: "Necesită gătire adecvată pentru a elimina lectinele." },
                            { name: "Edamame", tier: 'A', info: "Boabe de soia tinere. Sursă completă de proteine. Bogate în fibre și vitamine.", cons: "Alergen comun." },
                            { name: "Fasole Roșie (Kidney)", tier: 'A', info: "Sursă bună de proteine, fibre și fier.", cons: "Crudă sau gătită insuficient este toxică. Trebuie fiartă bine." }
                        ]
                    },
                    {
                        name: "C",
                        foods: [
                            { name: "Fasole la conservă", tier: 'C', info: "Convenabilă și rapid de folosit.", cons: "Adesea are un conținut ridicat de sodiu (se recomandă clătirea)." }
                        ]
                    },
                    {
                        name: "D",
                        foods: [
                            { name: "Fasole 'baked beans' la conservă", tier: 'D', info: "Sursă de fibre și proteine.", cons: "Conține cantități mari de zahăr adăugat și sodiu." }
                        ]
                    }
                ]
            },
            {
                name: "Nuci",
                tiers: [
                    {
                        name: "TOP",
                        foods: [
                            { name: "Nuci Românești", tier: 'TOP', info: "Cea mai bună sursă vegetală de acizi grași Omega-3 (ALA). Benefice pentru sănătatea creierului.", cons: "Dense caloric.", tags: { regions: ['Europa', 'Asia'], benefitsForOrgans: ['Creier', 'Inimă'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Omega-3', 'Grăsimi Sănătoase'] } }
                        ]
                    },
                    {
                        name: "A",
                        foods: [
                            { name: "Migdale", tier: 'A', info: "Bogate în grăsimi mononesaturate, Vitamina E, fibre și magneziu.", cons: "Conțin fitați.", tags: { regions: ['Global'], benefitsForOrgans: ['Inimă', 'Piele', 'Oase'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Grăsimi Sănătoase', 'Bogat în Fibre'] } },
                            { name: "Fistic", tier: 'A', info: "Mai puține calorii și mai multe proteine decât majoritatea nucilor. Bogat în antioxidanți.", cons: "Variantele sărate au mult sodiu." }
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                            { name: "Caju", tier: 'B', info: "Sursă bună de cupru și magneziu. Textură cremoasă.", cons: "Conținut mai mare de carbohidrați." },
                            { name: "Arahide", tier: 'B', info: "Tehnic o leguminoasă. Sursă bună de proteine și biotină.", cons: "Alergen comun." }
                        ]
                    },
                    {
                        name: "D",
                        foods: [
                            { name: "Unt de arahide (cu zahăr/uleiuri adăugate)", tier: 'D', info: "Sursă de proteine și grăsimi.", cons: "Multe mărci comerciale adaugă zahăr și ulei de palmier." }
                        ]
                    },
                    {
                        name: "E",
                        foods: [
                            { name: "Nuci confiate / caramelizate", tier: 'E', info: "Folosite ca desert.", cons: "Acoperite cu un strat gros de zahăr, transformându-le într-o bomboană." }
                        ]
                    }
                ]
            },
            {
                name: "Semințe",
                tiers: [
                    {
                        name: "TOP",
                        foods: [
                            { name: "Semințe de in măcinate", tier: 'TOP', info: "Sursă excelentă de Omega-3 (ALA) și lignani. Bogate în fibre.", cons: "Trebuie măcinate pentru a beneficia de nutrienți.", tags: { regions: ['Global'], benefitsForOrgans: ['Sistem Digestiv', 'Inimă'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Omega-3', 'Bogat în Fibre'] } },
                            { name: "Semințe de chia", tier: 'TOP', info: "Extrem de bogate în fibre, Omega-3, proteine și minerale.", cons: "Trebuie consumate cu suficient lichid.", tags: { regions: ['America de Sud'], benefitsForOrgans: ['Sistem Digestiv', 'Inimă', 'Oase'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Fibre', 'Bogat în Omega-3', 'Bogat în Proteine'] } },
                            { name: "Semințe de cânepă", tier: 'TOP', info: "Sursă completă de proteine vegetale, cu un raport ideal de Omega-6 la Omega-3.", cons: "Pot fi mai scumpe." }
                        ]
                    },
                    {
                        name: "A",
                        foods: [
                            { name: "Semințe de dovleac", tier: 'A', info: "Sursă excelentă de magneziu și zinc.", cons: "Variantele prăjite și sărate pot fi bogate în sodiu." },
                            { name: "Semințe de floarea-soarelui", tier: 'A', info: "Sursă excepțională de Vitamina E și seleniu.", cons: "Bogate în Omega-6." }
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                             { name: "Semințe de susan (și Tahini)", tier: 'B', info: "Sursă bună de calciu, cupru și mangan. Tahini este baza pentru hummus.", cons: "Alergen comun." }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Cereale & Panificație",
        icon: "🍞",
        color: "text-amber-700",
        subcategories: [
            {
                name: "Cereale Integrale & Pseudocereale",
                tiers: [
                    {
                        name: "TOP",
                        foods: [
                            { name: "Quinoa", tier: 'TOP', info: "Pseudocereală, sursă completă de proteine. Bogată în fibre, magneziu, fier. Fără gluten.", cons: "Necesită clătire.", tags: { regions: ['America de Sud'], benefitsForOrgans: ['Mușchi', 'Sistem Digestiv'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Bogat în Proteine', 'Bogat în Fibre'] } },
                            { name: "Ovăz integral (fulgi)", tier: 'TOP', info: "Bogat în fibre solubile (beta-glucan), care ajută la scăderea colesterolului. Sățios.", cons: "Poate fi contaminat cu gluten.", tags: { regions: ['Global'], benefitsForOrgans: ['Inimă', 'Sistem Digestiv'], dietaryCompatibility: ['Vegetarian', 'Vegan'], nutritionalProfile: ['Bogat în Fibre'] } }
                        ]
                    },
                    {
                        name: "A",
                        foods: [
                            { name: "Orez brun / sălbatic", tier: 'A', info: "Cereală integrală, bogată în fibre, magneziu și seleniu.", cons: "Timp de gătire mai lung." },
                            { name: "Hrișcă", tier: 'A', info: "Bogată în proteine, fibre și minerale. Fără gluten.", cons: "Gust specific, pământiu." }
                        ]
                    }
                ]
            },
            {
                name: "Produse de Panificație",
                tiers: [
                    {
                        name: "A",
                        foods: [
                            { name: "Pâine integrală 100% de grâu", tier: 'A', info: "Conține întregul bob de grâu, fiind bogată în fibre, vitamine B și minerale.", cons: "Atenție la etichetă, multe produse 'integrale' conțin și făină albă." },
                            { name: "Pâine integrală 100% de secară", tier: 'A', info: "Adesea mai densă și cu un indice glicemic mai mic decât pâinea de grâu.", cons: "Gust specific, mai intens, care nu e pe placul tuturor." },
                            { name: "Pâine cu maia naturală", tier: 'A', info: "Fermentația face nutrienții mai biodisponibili și pâinea mai ușor de digerat.", cons: "Calitatea variază mult." }
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                            { name: "Paste integrale", tier: 'B', info: "Mai bogate în fibre și nutrienți decât pastele albe.", cons: "Textură mai fermă." }
                        ]
                    },
                    {
                        name: "C",
                        foods: [
                            { name: "Pâine albă", tier: 'C', info: "Sursă rapidă de carbohidrați.", cons: "Lipsită de fibre și nutrienți esențiali." },
                            { name: "Paste din făină albă", tier: 'C', info: "Similar cu pâinea albă, săracă în nutrienți.", cons: "Indice glicemic ridicat." }
                        ]
                    },
                    {
                        name: "E",
                        foods: [
                            { name: "Produse de patiserie (croissante, gogoși, etc.)", tier: 'E', info: "Apreciate pentru gust.", cons: "Bombe calorice, bogate în făină rafinată, zahăr, grăsimi nesănătoase." }
                        ]
                    }
                ]
            },
            {
                name: "Cereale Rafinate & Procesate",
                tiers: [
                     {
                        name: "B",
                        foods: [
                             { name: "Orez alb (Basmati, Jasmine)", tier: 'B', info: "Sursă rapidă de energie. Ușor de digerat.", cons: "Sărac în fibre și micronutrienți. Indice glicemic ridicat." }
                        ]
                    },
                     {
                        name: "D",
                        foods: [
                            { name: "Cereale pentru micul dejun (cu zahăr adăugat)", tier: 'D', info: "Adesea fortificate cu vitamine și minerale.", cons: "Foarte bogate în zaharuri adăugate și carbohidrați rafinați." },
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Pește & Fructe de Mare",
        icon: "🐟",
        color: "text-teal-600",
        subcategories: [
            {
                name: "Pește Gras",
                tiers: [
                    {
                        name: "TOP",
                        foods: [
                            { name: "Somon Sălbatic", tier: 'TOP', info: "Sursă excepțională de Omega-3 (EPA și DHA), proteine, Vitamina D și B12.", cons: "Poate fi scump.", tags: { regions: ['America de Nord'], benefitsForOrgans: ['Inimă', 'Creier'], dietaryCompatibility: ['Fără Gluten'], nutritionalProfile: ['Bogat în Omega-3', 'Bogat în Proteine', 'Grăsimi Sănătoase'] } },
                            { name: "Sardine", tier: 'TOP', info: "Concentrație foarte mare de Omega-3, calciu (din oase) și Vitamina D.", cons: "Gust puternic, conținut ridicat de sodiu.", tags: { regions: ['Europa'], benefitsForOrgans: ['Inimă', 'Creier', 'Oase'], dietaryCompatibility: ['Fără Gluten'], nutritionalProfile: ['Bogat în Omega-3', 'Bogat în Proteine'] } },
                            { name: "Macrou", tier: 'TOP', info: "Una dintre cele mai bogate surse de Omega-3. Pește mic, risc redus de mercur.", cons: "Gust puternic." }
                        ]
                    },
                    {
                        name: "A",
                        foods: [
                            { name: "Păstrăv", tier: 'A', info: "Sursă excelentă de Omega-3 și proteine. Conținut scăzut de mercur.", cons: "Calitatea variază (sălbatic vs. crescătorie)." }
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                             { name: "Somon de crescătorie", tier: 'B', info: "Sursă bună de Omega-3 și proteine. Mai accesibil.", cons: "Conținut mai mare de Omega-6. Riscuri legate de antibiotice." }
                        ]
                    }
                ]
            },
            {
                name: "Pește Slab",
                tiers: [
                    {
                        name: "A",
                        foods: [
                            { name: "Cod", tier: 'A', info: "Pește slab, bogat în proteine, Vitamina B12 și seleniu.", cons: "Conținut mai mic de Omega-3." },
                            { name: "Tilapia", tier: 'A', info: "Pește slab, accesibil și cu gust blând.", cons: "Profil de grăsimi nesănătos (mai mult Omega-6)." }
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                            { name: "Ton (conservă, în apă)", tier: 'B', info: "Sursă accesibilă de proteine și Omega-3.", cons: "Risc de contaminare cu mercur." }
                        ]
                    }
                ]
            },
            {
                name: "Crustacee & Moluște",
                tiers: [
                     {
                        name: "A",
                        foods: [
                            { name: "Scoici & Midii", tier: 'A', info: "Sursă excelentă de fier, zinc și Vitamina B12. Sustenabile.", cons: "Pot acumula toxine din apă." }
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                            { name: "Creveți", tier: 'B', info: "Bogați în proteine și seleniu, săraci în calorii.", cons: "Pot fi bogați în colesterol." }
                        ]
                    }
                ]
            },
            {
                name: "Produse din Pește Procesate",
                tiers: [
                     {
                        name: "D",
                        foods: [
                            { name: "Surimi (bețișoare de crab)", tier: 'D', info: "Ieftin și accesibil.", cons: "Produs ultra-procesat din resturi de pește, amidon, zahăr, sare și arome." },
                            { name: "Ton la conservă în ulei vegetal", tier: 'D', info: "Convenabil.", cons: "Uleiul este adesea de calitate slabă (bogat în Omega-6)." }
                        ]
                    },
                    {
                        name: "E",
                        foods: [
                            { name: "Pește pane congelat", tier: 'E', info: "Convenabil.", cons: "Strat gros de pesmet care absoarbe mult ulei. Cantitatea de pește este redusă." }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Carne & Ouă",
        icon: "🥩",
        color: "text-red-700",
        subcategories: [
            {
                name: "Ouă",
                tiers: [
                    {
                        name: "TOP",
                        foods: [
                            { name: "Ouă (de la găini crescute liber / Omega-3)", tier: 'TOP', info: "Aliment aproape perfect. Sursă completă de proteine, bogat în vitamine (D, B12), colină.", cons: "Alergen comun.", tags: { regions: ['Global'], benefitsForOrgans: ['Creier', 'Ochi', 'Mușchi'], dietaryCompatibility: ['Vegetarian', 'Fără Gluten'], nutritionalProfile: ['Bogat în Proteine', 'Grăsimi Sănătoase'] } }
                        ]
                    }
                ]
            },
            {
                name: "Carne de Pasăre",
                tiers: [
                     {
                        name: "A",
                        foods: [
                            { name: "Piept de pui (fără piele)", tier: 'A', info: "Sursă excelentă de proteine slabe. Versatil.", cons: "Calitatea depinde de modul de creștere.", tags: { regions: ['Global'], benefitsForOrgans: ['Mușchi'], dietaryCompatibility: ['Fără Gluten'], nutritionalProfile: ['Bogat în Proteine', 'Sărac în Calorii'] } },
                            { name: "Piept de curcan", tier: 'A', info: "Similar cu puiul, foarte bogat în proteine slabe și sărac în grăsimi.", cons: "Poate fi mai uscat." }
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                            { name: "Pulpă de pui (fără piele)", tier: 'B', info: "Carne mai suculentă și mai gustoasă. Sursă bună de fier și zinc.", cons: "Conținut mai mare de grăsimi." }
                        ]
                    }
                ]
            },
            {
                name: "Carne Roșie",
                tiers: [
                    {
                        name: "B",
                        foods: [
                            { name: "Carne de vită slabă (grass-fed)", tier: 'B', info: "Sursă excelentă de fier hemic, zinc și Vitamina B12.", cons: "Consumul excesiv este asociat cu riscuri de sănătate." }
                        ]
                    },
                    {
                        name: "C",
                        foods: [
                            { name: "Carne de porc slabă (mușchi)", tier: 'C', info: "Sursă bună de proteine și Vitamina B1 (tiamină).", cons: "Poate avea un conținut ridicat de grăsimi." }
                        ]
                    },
                    {
                        name: "D",
                        foods: [
                            { name: "Antricot / Coaste de vită", tier: 'D', info: "Gust bogat datorită grăsimii.", cons: "Conținut foarte mare de grăsimi saturate." }
                        ]
                    }
                ]
            },
            {
                name: "Carne Procesată",
                tiers: [
                     {
                        name: "D",
                        foods: [
                             { name: "Bacon", tier: 'D', info: "Apreciat pentru gust.", cons: "Foarte bogat în grăsimi saturate și sodiu. Conține nitriți." },
                             { name: "Cârnați proaspeți", tier: 'D', info: "Sursă de proteine.", cons: "De obicei, foarte bogați în grăsimi, sodiu și aditivi." }
                        ]
                    },
                    {
                        name: "E",
                        foods: [
                            { name: "Mezeluri procesate (salam, parizer, crenvurști)", tier: 'E', info: "Convenabile.", cons: "Clasificate de OMS ca fiind cancerigene (Grup 1). Foarte bogate în sodiu, grăsimi nesănătoase, conservanți." },
                            { name: "Hot-dog", tier: 'E', info: "Ieftin și rapid.", cons: "Similar cu mezelurile procesate, conținut nutrițional foarte scăzut." }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Lactate",
        icon: "🥛",
        color: "text-blue-500",
        subcategories: [
            {
                name: "Lapte & Iaurt",
                tiers: [
                    {
                        name: "TOP",
                        foods: [
                            { name: "Iaurt Grecesc (2% grăsime, simplu)", tier: 'TOP', info: "Concentrație foarte mare de proteine. Sățios. Bogat în probiotice.", cons: "Cele cu arome au mult zahăr.", tags: { regions: ['Europa'], benefitsForOrgans: ['Sistem Digestiv', 'Oase', 'Mușchi'], dietaryCompatibility: ['Vegetarian', 'Fără Gluten'], nutritionalProfile: ['Bogat în Proteine'] } },
                            { name: "Chefir", tier: 'TOP', info: "Băutură probiotică foarte puternică, cu o varietate mare de bacterii benefice.", cons: "Gust specific, acidulat." }
                        ]
                    },
                    {
                        name: "A",
                        foods: [
                            { name: "Iaurt natural (simplu)", tier: 'A', info: "Sursă bună de proteine, calciu și probiotice.", cons: "Mai puțin concentrat în proteine." },
                            { name: "Lapte integral (grass-fed)", tier: 'A', info: "Sursă de proteine, calciu, Vitamina D și K2.", cons: "Conține grăsimi saturate." }
                        ]
                    }
                ]
            },
            {
                name: "Brânzeturi",
                tiers: [
                    {
                        name: "TOP",
                        foods: [
                            { name: "Parmezan (Parmigiano Reggiano)", tier: 'TOP', info: "Extrem de bogat în calciu, fosfor, proteine. Practic fără lactoză.", cons: "Conținut ridicat de sodiu. Scump." }
                        ]
                    },
                    {
                        name: "A",
                        foods: [
                            { name: "Brânză de vaci (Cottage cheese)", tier: 'A', info: "Excelentă sursă de proteine lente (cazeină). Sățioasă.", cons: "Poate avea un conținut ridicat de sodiu." },
                            { name: "Cheddar / Gruyère (maturat)", tier: 'A', info: "Surse excelente de calciu și Vitamina K2.", cons: "Dense caloric și bogate în grăsimi saturate." }
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                            { name: "Feta", tier: 'B', info: "Gust sărat, distinct. Sursă bună de calciu și B12.", cons: "Conținut foarte ridicat de sodiu." }
                        ]
                    },
                    {
                        name: "E",
                        foods: [
                            { name: "Brânză topită (felii, triunghiuri)", tier: 'E', info: "Se topește uniform.", cons: "Produs ultra-procesat, adesea conține mai puțin de 51% brânză reală. Plin de aditivi." }
                        ]
                    }
                ]
            },
            {
                name: "Unt & Smântână",
                tiers: [
                    {
                        name: "A",
                        foods: [
                            { name: "Ghee (Unt Clarificat)", tier: 'A', info: "Fără lactoză și cazeină. Punct de fum ridicat, ideal pentru gătit.", cons: "Foarte dens caloric." }
                        ]
                    },
                    {
                        name: "B",
                        foods: [
                            { name: "Unt (grass-fed)", tier: 'B', info: "Sursă de grăsimi saturate și vitamine liposolubile (A, K2).", cons: "Bogat în calorii și grăsimi saturate." }
                        ]
                    }
                ]
            },
            {
                name: "Deserturi Lactate",
                tiers: [
                    {
                        name: "D",
                        foods: [
                            { name: "Iaurt cu fructe (din comerț)", tier: 'D', info: "Conține iaurt și fructe.", cons: "Conține cantități foarte mari de zahăr adăugat." }
                        ]
                    },
                    {
                        name: "E",
                        foods: [
                            { name: "Înghețată", tier: 'E', info: "Apreciată pentru gust.", cons: "Foarte bogată în zahăr, grăsimi de calitate slabă și aditivi." },
                            { name: "Lapte cu cacao și zahăr", tier: 'E', info: "Populară pentru copii.", cons: "O bombă de zahăr. Anulează beneficiile laptelui." }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Grăsimi, Uleiuri & Sosuri",
        icon: "🫒",
        color: "text-lime-600",
        subcategories: [
            {
                name: "Grăsimi & Uleiuri",
                tiers: [
                    {
                        name: "TOP",
                        foods: [
                            { name: "Ulei de măsline extra virgin", tier: 'TOP', info: "Bogat în grăsimi mononesaturate și antioxidanți. Proprietăți anti-inflamatorii.", cons: "Punct de fum mai scăzut.", tags: { regions: ['Europa'], benefitsForOrgans: ['Inimă', 'Creier'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Grăsimi Sănătoase', 'Bogat în Antioxidanți'] } }
                        ]
                    },
                    {
                        name: "A",
                        foods: [
                            { name: "Ulei de avocado", tier: 'A', info: "Profil similar cu uleiul de măsline. Punct de fum foarte ridicat.", cons: "Poate fi mai scump." }
                        ]
                    },
                    {
                        name: "D",
                        foods: [
                             { name: "Ulei de floarea-soarelui rafinat", tier: 'D', info: "Ieftin și accesibil.", cons: "Procesul de rafinare distruge nutrienții. Bogat în Omega-6." }
                        ]
                    },
                    {
                        name: "E",
                        foods: [
                            { name: "Margarina", tier: 'E', info: "Alternativă la unt.", cons: "Produs ultra-procesat. Variantele vechi conțineau grăsimi trans." },
                            { name: "Grăsimi trans / Uleiuri parțial hidrogenate", tier: 'E', info: "Nu există.", cons: "Cel mai periculos tip de grăsime. Evitare totală." }
                        ]
                    }
                ]
            },
            {
                name: "Sosuri & Condimente",
                tiers: [
                     {
                        name: "TOP",
                        foods: [
                             { name: "Pesto (făcut în casă)", tier: 'TOP', info: "Bogat în grăsimi sănătoase, antioxidanți din busuioc și usturoi.", cons: "Dens caloric." },
                             { name: "Hummus", tier: 'TOP', info: "Sursă de proteine vegetale, fibre și grăsimi sănătoase.", cons: "Moderat caloric." },
                             { name: "Sauerkraut / Kimchi (nepasteurizat)", tier: 'TOP', info: "Surse excelente de probiotice vii.", cons: "Pot avea un conținut ridicat de sodiu." }
                        ]
                    },
                     {
                        name: "A",
                        foods: [
                             { name: "Salsa / Pico de Gallo", tier: 'A', info: "Sărac în calorii, bogat în vitamine din roșii, ceapă, ardei.", cons: "Variantele din comerț pot avea sodiu adăugat." },
                             { name: "Oțet de mere (nefiltrat, cu 'mama')", tier: 'A', info: "Poate ajuta la scăderea glicemiei. Conține prebiotice.", cons: "Foarte acid, trebuie diluat." }
                        ]
                    },
                     {
                        name: "D",
                        foods: [
                            { name: "Maioneză (comercială)", tier: 'D', info: "Textură cremoasă.", cons: "Făcută cu ulei bogat în Omega-6, zahăr, aditivi. Densă caloric și pro-inflamatorie." },
                            { name: "Ketchup", tier: 'D', info: "Conține licopen.", cons: "Foarte bogat în zahăr și sodiu." }
                        ]
                    },
                    {
                        name: "E",
                        foods: [
                            { name: "Sos Barbecue", tier: 'E', info: "Apreciat pentru gust.", cons: "O bombă de zahăr." }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Băuturi",
        icon: "💧",
        color: "text-cyan-500",
        subcategories: [
            {
                name: "Hidratare & Stimulente Sănătoase",
                tiers: [
                    {
                        name: "TOP",
                        foods: [
                            { name: "Apă", tier: 'TOP', info: "Esențială pentru viață. Zero calorii. Cea mai bună alegere posibilă.", cons: "Nu are.", tags: { regions: ['Global'], benefitsForOrgans: ['Creier', 'Inimă', 'Ochi', 'Piele', 'Sistem Digestiv', 'Oase', 'Imunitate', 'Mușchi'], dietaryCompatibility: ['Vegetarian', 'Vegan', 'Fără Gluten'], nutritionalProfile: ['Sărac în Calorii'] } }
                        ]
                    },
                    {
                        name: "A",
                        foods: [
                            { name: "Ceai verde (neîndulcit)", tier: 'A', info: "Bogat în antioxidanți (EGCG). Poate îmbunătăți funcția cerebrală și metabolismul.", cons: "Conține cofeină. Poate reduce absorbția fierului." },
                            { name: "Ceai negru (neîndulcit)", tier: 'A', info: "Conține flavonoide benefice pentru sănătatea inimii.", cons: "Conținut mai mare de cofeină decât ceaiul verde." },
                            { name: "Ceai de plante (mușețel, mentă)", tier: 'A', info: "Fără cofeină. Oferă diverse beneficii specifice (relaxare, digestie).", cons: "Calitatea și efectele variază foarte mult." },
                            { name: "Cafea (neagră, neîndulcită)", tier: 'A', info: "Sursă majoră de antioxidanți. Poate îmbunătăți performanța fizică și mentală.", cons: "Excesul de cofeină poate cauza anxietate, insomnie." }
                        ]
                    }
                ]
            },
            {
                name: "Sucuri & Băuturi cu Zahăr",
                tiers: [
                     {
                        name: "C",
                        foods: [
                            { name: "Suc de fructe 100% natural (fresh)", tier: 'C', info: "Conține vitamine și minerale din fructe.", cons: "Lipsit de fibre. Concentrație mare de zahăr." }
                        ]
                    },
                    {
                        name: "D",
                        foods: [
                            { name: "Băuturi sportive", tier: 'D', info: "Conțin electroliți pentru efort fizic intens.", cons: "În afara contextului sportiv, sunt doar apă cu zahăr." }
                        ]
                    },
                    {
                        name: "E",
                        foods: [
                            { name: "Băuturi carbogazoase îndulcite cu zahăr", tier: 'E', info: "Nu există.", cons: "Calorii goale, fără nutrienți. Legate de obezitate, diabet tip 2, boli de inimă." },
                            { name: "Băuturi energizante", tier: 'E', info: "Efect stimulant.", cons: "Cantități extreme de zahăr și cofeină. Pot cauza probleme cardiace grave." }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Diverse",
        icon: "🥨",
        color: "text-slate-600",
        subcategories: [
            {
                name: "Gustări (Snacks)",
                tiers: [
                    {
                        name: "B",
                        foods: [
                            { name: "Ciocolată neagră (>85% cacao)", tier: 'B', info: "Bogată în antioxidanți, fier și magneziu.", cons: "Densă caloric." }
                        ]
                    },
                    {
                        name: "D",
                        foods: [
                             { name: "Batoane de cereale / granola", tier: 'D', info: "Convenabile.", cons: "Adesea pline de zahăr, siropuri și uleiuri vegetale." },
                             { name: "Popcorn (făcut la aer cald)", tier: 'D', info: "Cereală integrală, bogată în fibre.", cons: "Variantele pentru microunde sunt încărcate cu grăsimi nesănătoase." }
                        ]
                    },
                    {
                        name: "E",
                        foods: [
                            { name: "Chipsuri din cartofi (prăjite)", tier: 'E', info: "Gust satisfăcător.", cons: "Bogate în grăsimi de calitate slabă, sare și calorii. Conțin acrilamidă." },
                            { name: "Biscuiți, napolitane, prăjituri (ambalate)", tier: 'E', info: "Convenabile.", cons: "Ultra-procesate. Conțin făină albă, zahăr, ulei de palmier." },
                            { name: "Bomboane și jeleuri", tier: 'E', info: "Nu există.", cons: "Zahăr pur, coloranți și arome artificiale." }
                        ]
                    }
                ]
            },
            {
                name: "Îndulcitori",
                tiers: [
                     {
                        name: "C",
                        foods: [
                            { name: "Miere crudă", tier: 'C', info: "Conține antioxidanți și are proprietăți antibacteriene.", cons: "Este tot o formă de zahăr liber." },
                            { name: "Stevia / Monk Fruit", tier: 'C', info: "Îndulcitori naturali, fără calorii.", cons: "Pot avea un gust amărui." }
                        ]
                    },
                    {
                        name: "E",
                        foods: [
                            { name: "Zahăr alb rafinat", tier: 'E', info: "Nu există.", cons: "Calorii goale. Contribuie la inflamație, obezitate, diabet." },
                            { name: "Sirop de porumb bogat în fructoză (HFCS)", tier: 'E', info: "Ieftin, folosit pe scară largă.", cons: "Dăunător pentru ficat, contribuie la rezistența la insulină." }
                        ]
                    }
                ]
            },
            {
                name: "Alcool",
                tiers: [
                     {
                        name: "C",
                        foods: [
                            { name: "Vin roșu sec", tier: 'C', info: "Conține antioxidanți (resveratrol).", cons: "Alcoolul este o toxină. Beneficii valabile doar la consum foarte mic." }
                        ]
                    },
                    {
                        name: "D",
                        foods: [
                            { name: "Berea", tier: 'D', info: "Conține anumite vitamine B.", cons: "Bogată în carbohidrați. Alcoolul deshidratează." }
                        ]
                    },
                     {
                        name: "E",
                        foods: [
                            { name: "Cocktailuri", tier: 'E', info: "Apreciate pentru gust.", cons: "Combinație de alcool cu sucuri și siropuri. O bombă de zahăr și calorii." }
                        ]
                    }
                ]
            },
            {
                name: "Fast-Food",
                tiers: [
                     {
                        name: "D",
                        foods: [
                            { name: "Sandviș (cu pui la grătar, multe legume)", tier: 'D', info: "Poate fi o opțiune echilibrată dacă se evită sosurile grase și se alege pâine integrală.", cons: "Calitatea ingredientelor este adesea mediocră." },
                            { name: "Wrap (cu pui la grătar, multe legume)", tier: 'D', info: "Adesea perceput ca fiind mai sănătos, dar lipia poate avea mai multe calorii și carbohidrați decât pâinea.", cons: "Atenție la dimensiune și la umpluturi." }
                        ]
                    },
                     {
                        name: "E",
                        foods: [
                            { name: "Burger cu cartofi prăjiți și suc", tier: 'E', info: "Meniu clasic.", cons: "Combinație de carne procesată, pâine albă, sosuri pe bază de zahăr, cartofi prăjiți și suc." },
                            { name: "Shaorma / Kebab (cu de toate)", tier: 'E', info: "Sățios.", cons: "Carne de calitate îndoielnică, încărcat cu cartofi prăjiți și o multitudine de sosuri." },
                            { name: "Pui prăjit (crispy/strips)", tier: 'E', info: "Gustos.", cons: "Carne de calitate slabă, învelită într-un aluat care absoarbe o cantitate uriașă de ulei." }
                        ]
                    }
                ]
            }
        ]
    }
];