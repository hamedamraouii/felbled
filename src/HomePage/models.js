// List of countries
const data ={
  countries : [
    { isActive: true, image: '/flags/Tunisie.png', title: 'Tunisie', comingSoon: '' },
    { isActive: false, image: '/flags/Lybie.png', title: 'Libye', comingSoon: 'Bientôt disponible' },
    { isActive: false, image: '/flags/Algerie.jpg', title: 'Algérie', comingSoon: 'Bientôt disponible' },
    { isActive: false, image: '/flags/Maroc.png', title: 'Maroc', comingSoon: 'Bientôt disponible' },
    { isActive: false, image: '/flags/Egypte.png', title: 'Egypte', comingSoon: 'Bientôt disponible' },
  ],

  categories : [
    [
        "EVENEMENTIEL",
        ["Salle de fête"],
        ["Location de costumes et des robes de fête"],
        ["Location de matériel de fête"],
        ["Animateurs"],
        ["Foire"],
        ["Décoration des fêtes"],
        ["Société événementielle"],
        ["Serveur"],
    ],
    [
        "SHOPPING",
        [
            "Homme",
            ["Prêt à porter"],
            ["Accessoires"],
            ["Chaussures"],
        ],
        [
            "Femme",
            ["Prêt à porter"],
            ["Accessoires"],
            ["Chaussures"],
        ],
        [
            "Enfant",
            ["Prêt à porter"],
            ["Accessoires"],
            ["Chaussures"],
        ],
        ["Jouets"],
        [
            "Maison",
            ["Cuisine"],
            ["Tapis et rideaux"],
            ["Meuble"],
        ],
        ["Centres commerciaux"],
        ["Bijouterie"],
        ["Boutique divers"],
        ["Produits cosmétiques"],
        ["Parfumerie"],
        [
            "Handmade",
            ["Importer"],
            ["Artisanat"],
        ],
    ],
    [
        "GROSSISTE - DEPOT",
        ["Agroalimentaire"],
        ["Construction"],
        ["Vêtements"],
        ["Accessoires"],
        ["Décoration"],
        ["Lumière et câble"],
        ["Maquillage"],
        ["Fournisseur médical"],
        ["Électroménager"],
        ["Article Bébé et Maman"],
        ["Plastique"],
        ["Jouets"],
        ["Informatique"],
        ["Agricole"],
        ["Meuble"],
        ["Fourniture scolaire"],
        ["Eaux minérales et boissons gazeuses"],
    ],
    [
        "BÂTIMENT",
        ["Architecte"],
        ["Ingénieur de béton"],
        ["Architecte de l'intérieur"],
        ["Génie civil"],
        ["Urbaniste"],
        ["Paysagistes"],
        ["Promotion immobilière"],
        ["Topographe"],
        ["Entrepreneur"],
        ["Location de matériel de construction"],
        ["Vente de matériel de construction"],
        ["Cuisine sur mesure"],
    ],
    [
        "MÉTIER",
        ["Maçon"],
        ["Électricien"],
        ["Bricoleur"],
        ["Plombier"],
        ["Menuisier"],
        ["Étanchéité"],
        ["Aluminium"],
        ["Artisan bijoutier"],
        ["Jardinier"],
        ["Baby-sitter"],
        ["Courtier"],
        ["Faux plafond"],
        ["Placo"],
        ["Parabole"],
        ["Soudeur"],
        ["Étanchéité"],
        ["Pâtissier"],
        ["Tapissiers"],
        ["Préparateurs radio et télévision"],
        ["Charpentier métallique"],
        ["Plongeur"],
        ["Pêche"],
        ["Fleuriste"],
    ],
    [
        "MARCHÉ",
        ["Boulangerie"],
        ["Boucherie"],
        ["Charcuterie"],
        ["Crémerie"],
        ["Épicerie"],
        ["Poissonnerie"],
        ["Vendeur fruits et légumes"],
        ["Poulailler"],
        ["Magasin"],
        ["Drug store"],
        ["Vente du miel"],
    ],
    [
        "DROIT",
        [
            "Avocats",
            ["Avocat stagiaire"],
            ["Avocat à la cour d'appel"],
            ["Avocat à la cour de cassation"],
        ],
        ["Notaire"],
        ["Huissiers"],
        ["Traducteur"],
        ["Experts"],
        ["Conseiller juridique d'entreprise"],
    ],
    [
        "SÉCURITÉ",
        ["Vente et installation des caméras et alarmes"],
        ["Agence de sécurité"],
        ["Location de matériel"],
    ],
    [
        "EDUCATION",
        [
            "Établissement privé",
            ["Garderie scolaire"],
            ["Crèche"],
            ["Jardin d'enfants"],
            ["Centre de soutien scolaire"],
            ["École"],
            ["Lycée"],
            ["Faculté"],
            ["Centre de formation"],
        ],
        ["Accompagnateur"],
        ["Enseignant"],
        ["Professeurs"],
        ["Librairie"],
        ["Club Robotique"],
        ["Coworking space"],
        ["Centre d'handicapés"],
    ],
    [
        "SPORT",
        ["Athlétisme"],
        ["Aérobic"],
        ["Baseball"],
        ["Basket-ball"],
        ["Billard"],
        ["Bowling"],
        ["Boxe"],
        ["Cyclisme"],
        ["Danse sportive"],
        ["Dames"],
        ["Échecs"],
        ["Équitation"],
        ["Escrime"],
        ["Football"],
        ["Golf"],
        ["Gymnastique"],
        ["Handball"],
        ["Ju-Jitsu"],
        ["Judo"],
        ["Jiu-jitsu"],
        ["Jet ski"],
        ["Karaté"],
        ["Kempo"],
        ["Karting"],
        ["Kayak"],
        ["Kick-boxing"],
        ["Kung fu"],
        ["Lancer de disque"],
        ["Lancer de javelot"],
        ["Lancer de marteau"],
        ["Lancer de poids"],
        ["Marche"],
        ["Moto (cross)"],
        ["Musculation"],
        ["Marathon"],
        ["Natation"],
        ["Paintball"],
        ["Parachutisme"],
        ["Parkour"],
        ["Pétanque"],
        ["Ping-Pong"],
        ["Plongée"],
        ["Polo"],
        ["Quad"],
        ["Rallye automobile"],
        ["Rugby"],
        ["Saut à la perche"],
        ["Saut en hauteur"],
        ["Saut en longueur"],
        ["Skateboard"],
        ["Spéléologie"],
        ["Surf"],
        ["Tennis"],
        ["Tir à l'arc"],
        ["Vélocross"],
        ["Voile"],
        ["Volley-ball"],
        ["Water-polo"],
        ["Yoga"],
        ["Zumba"],
        [
            "Equipe",
            ["Club"],
            ["Joueur"],
            ["Agent"],
            ["Salle"],
            ["Préparateurs physique"],
            ["Éducateur"],
            ["Entraîneur"],
            ["Vendeur d’articles de sport"],
            ["Parie / beat"],
        ],
    ],
    [
        "LOISIR",
        ["Cinéma"],
        ["Théâtre"],
        ["Festival"],
        ["Disco"],
        ["Rando et camping"],
        ["Café"],
        ["Salon de thé"],
        ["Parc de lorient"],
    ],
    [
        "GASTRONOMIE",
        ["Restaurant-à la carte"],
        ["Fast food"],
        ["Restaurant lounge"],
        ["Spécialité locale"],
        ["Pâtisserie"],
        ["Food camion"],
        ["Traiteur"],
        ["Conserve alimentaire"],
    ],
    [
        "SANTÉ",
        ["Clinique"],
        ["Pharmacie"],
        ["Cabinet médical"],
        ["Vétérinaire"],
        ["Laboratoire"],
        ["Radiologie"],
        ["Paramédical"],
        ["Nutritionniste"],
        ["Kinésithérapie"],
        ["Soins à domicile"],
        ["Psychologue"],
        ["Centre de rééducation"],
    ],
    [
        "INFORMATIQUE",
        ["Publinet"],
        ["Vente de matériel informatique"],
        ["Développeur"],
        ["Préparation portable"],
        ["Maintenance informatique"],
        ["Boite de développement"],
        ["Data analyst"],
        ["Montage vidéo"],
        ["Designer"],
        ["Cybersécurité"],
        ["Infographiste"],
        ["Centre d'appel"],
        ["Freelance"],
    ],
    [
        "TOURISME",
        ["Hôtel de charme"],
        ["Hôtel"],
        ["Agence de voyage"],
        ["Maisons d'hôtes"],
        ["Base nautique"],
    ],
]
,

  // List of governorates in Tunisia
  gouvernorats : [
        { id: 1, name: 'Ariana', image: '/gouvernorats/Ariena.jpg' },
        { id: 2, name: 'Beja', image: '/gouvernorats/beja.jpg' },
        { id: 3, name: 'Ben Arous', image: '/gouvernorats/ben-arous.jpg' },
        { id: 4, name: 'Bizerte', image: '/gouvernorats/bizerte.jpg' },
        { id: 5, name: 'Gabes', image: '/gouvernorats/gabes.jpg' },
        { id: 6, name: 'Gafsa', image: '/gouvernorats/gafsa.jpg' },
        { id: 7, name: 'Jendouba', image: '/gouvernorats/jendouba.jpg' },
        { id: 8, name: 'Kairouan', image: '/gouvernorats/kairouan.jpg' },
        { id: 9, name: 'Kasserine', image: '/gouvernorats/kasserine.jpg' },
        { id: 10, name: 'Kébili', image: '/gouvernorats/kebili.jpg' },
        { id: 11, name: 'Kef', image: '/gouvernorats/kef.jpg' },
        { id: 12, name: 'Mahdia', image: '/gouvernorats/mahdia.jpg' },
        { id: 13, name: 'Manouba', image: '/gouvernorats/manouba.jpg' },
        { id: 14, name: 'Médenine', image: '/gouvernorats/medenine.jpg' },
        { id: 15, name: 'Monastir', image: '/gouvernorats/monastir.jpg' },
        { id: 16, name: 'Nabeul', image: '/gouvernorats/nabeul.jpg' },
        { id: 17, name: 'Sfax', image: '/gouvernorats/sfax.jpg' },
        { id: 18, name: 'Sidi Bouzid', image: '/gouvernorats/sidi-bouzid.jpg' },
        { id: 19, name: 'Siliana', image: '/gouvernorats/siliana.jpg' },
        { id: 20, name: 'Sousse', image: '/gouvernorats/sousse.jpg' },
        { id: 21, name: 'Tataouine', image: '/gouvernorats/tataouine.jpg' },
        { id: 22, name: 'Tozeur', image: '/gouvernorats/tozeur.jpg' },
        { id: 23, name: 'Tunis', image: '/gouvernorats/tunis.jpg' },
        { id: 24, name: 'Zaghouan', image: '/gouvernorats/zaghouan.jpg' }
      ],

 // List of Delegations
 delegations : [
  {
    "Tunis": [
      "Hraïria",
      "El Kabaria",
      "Sidi Hassine",
      "La Marsa",
      "El Omrane supérieur",
      "Le Kram",
      "El Menzah",
      "El Omrane",
      "Ezzouhour",
      "Bab El Bhar",
      "Cité El Khadra",
      "Séjoumi",
      "El Ouardia",
      "Bab Souika",
      "Sidi El Béchir"
    ]
  },
  {
    "Ariana": [
      "Ariana Ville",
      "La Soukra",
      "Ettadhamen",
      "Raoued",
      "Mnihla"
    ]
  },
  {
    "Ben Arous": [
      "El Mourouj",
      "Fouchana",
      "Mornag",
      "Mohamedia",
      "Radès",
      "Medina Jedida",
      "Ezzahra",
      "Ben Arous"
    ]
  },
  {
    "Sfax": [
      "Sfax Ville",
      "Sfax Ouest",
      "Sfax Sud",
      "Sakiet Eddaïer",
      "Sakiet Ezzit",
      "Thyna",
      "Bir Ali Ben Khalifa",
      "Agareb",
      "Menzel Chaker",
      "El Hencha",
      "Jebiniana",
      "Mahrès",
      "Skhira",
      "El Amra"
    ]
  },
  {
    "Sousse": [
      "M'saken",
      "Sousse Riadh",
      "Sousse Jawhara",
      "Kalâa Kebira",
      "Sousse Sidi Abdelhamid",
      "Enfida",
      "Hammam Sousse",
      "Sousse Médina"
    ]
  },
  {
    "Kairouan": [
      "Kairouan Nord",
      "Kairouan Sud",
      "Bou Hajla",
      "Sbikha",
      "Haffouz",
      "Nasrallah",
      "Oueslatia",
      "Chebika",
      "Hajeb El Ayoun",
      "El Alâa"
    ]
  },
  {
    "Monastir": [
      "Monastir",
      "Moknine",
      "Jemmal",
      "Ksar Hellal",
      "Téboulba",
      "Ksibet el-Médiouni"
    ]
  },
  {
    "Médenine": [
      "Zarzis",
      "Ben Gardane",
      "Djerba - Houmt Souk",
      "Djerba - Midoun",
      "Médenine Nord",
      "Médenine Sud"
    ]
  },
  {
    "Gabès": [
      "El Hamma",
      "Gabès Sud",
      "Mareth",
      "Gabès Médina"
    ]
  },
  {
    "Nabeul": [
      "Hammamet",
      "Korba",
      "Nabeul",
      "Menzel Temime",
      "Grombalia",
      "Kélibia",
      "Béni Khiar",
      "Menzel Bouzelfa"
    ]
  },
  {
    "Bizerte": [
      "Bizerte Nord",
      "Menzel Bourguiba",
      "Ras Jebel",
      "Sejnane",
      "Joumine"
    ]
  },
  {
    "Jendouba": [
      "Jendouba Sud",
      "Ghardimaou",
      "Fernana",
      "Balta-Bou Aouane",
      "Bou Salem"
    ]
  },
  {
    "Kasserine": [
      "Sbeïtla",
      "Kasserine Nord",
      "Fériana",
      "Sbiba",
      "Thala"
    ]
  },
  {
    "Sidi Bouzid": [
      "Sidi Bouzid Ouest",
      "Sidi Bouzid Est",
      "Regueb",
      "Jilma"
    ]
  },
  {
    "Zaghouan": [
      "El Fahs",
      "Zaghouan"
    ]
  },
  {
    "Béja": [
      "Béja Nord",
      "Béja Sud",
      "Testour"
    ]
  },
  {
    "Siliana": [
      "Makthar",
      "Rouhia"
    ]
  },
  {
    "Le Kef": [
      "Kef Est",
      "Tajerouine",
      "Kef Ouest"
    ]
  },
  {
    "Gafsa": [
      "Gafsa Sud",
      "Métlaoui",
      "Sened"
    ]
  },
  {
    "Tataouine": [
      "Tataouine Nord",
      "Tataouine Sud"
    ]
  },
  {
    "Kébili": [
      "Kébili Sud"
    ]
  },
  {
    "Tozeur": [
      "Tozeur"
    ]
  }
]}
export default data;
