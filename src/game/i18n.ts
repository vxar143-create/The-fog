/**
 * Multi-language localization dictionary for Outpost Pioneer.
 * Supports: English (en), Ukrainian (uk), Polish (pl).
 */

export type Language = 'en' | 'uk' | 'pl';

export interface Translations {
  // Title & Game Shell
  title: string;
  subtitle: string;
  tagline: string;
  startExpedition: string;
  settings: string;
  controls: string;
  controlsHint: string;
  move: string;
  sprint: string;
  action: string;
  buildMode: string;
  pause: string;
  rotate: string;

  // Settings
  settingsTitle: string;
  languageLabel: string;
  audioSettings: string;
  muteAudio: string;
  soundVolume: string;
  graphicsSettings: string;
  shadows: string;
  screenShake: string;
  cameraDistance: string;
  camClose: string;
  camMedium: string;
  camFar: string;
  gameplaySettings: string;
  difficulty: string;
  diffPeaceful: string;
  diffNormal: string;
  diffBrutal: string;
  close: string;

  // HUD & Resources
  settlementName: string;
  colonists: string;
  structures: string;
  daylight: string;
  dusk: string;
  nightfall: string;
  dawn: string;
  waveInbound: string;
  waveInvasion: string;
  creaturesRemaining: string;
  commander: string;
  health: string;
  stamina: string;
  wood: string;
  stone: string;
  iron: string;
  gold: string;
  food: string;

  // Bottom Dock Tabs
  tabBlueprints: string;
  tabColonists: string;
  tabUpgrades: string;
  tabIntel: string;
  showControls: string;
  hideControls: string;
  placing: string;
  confirm: string;
  cancel: string;

  // Blueprints
  bpTownHallName: string;
  bpTownHallDesc: string;
  bpFarmName: string;
  bpFarmDesc: string;
  bpQuarryName: string;
  bpQuarryDesc: string;
  bpWatchtowerName: string;
  bpWatchtowerDesc: string;
  bpPalisadeName: string;
  bpPalisadeDesc: string;
  bpSpiketrapName: string;
  bpSpiketrapDesc: string;
  bpLanternName: string;
  bpLanternDesc: string;
  bpBarracksName: string;
  bpBarracksDesc: string;
  bpWindmillName: string;
  bpWindmillDesc: string;
  bpBlacksmithName: string;
  bpBlacksmithDesc: string;
  bpClinicName: string;
  bpClinicDesc: string;
  bpStoneWallName: string;
  bpStoneWallDesc: string;
  bpBallistaName: string;
  bpBallistaDesc: string;
  minimap: string;
  lootRuin: string;

  // Roles
  roleFarmer: string;
  roleMiner: string;
  roleGuard: string;
  roleBuilder: string;
  roleIdle: string;
  kills: string;
  hp: string;

  // Upgrades
  techSteelName: string;
  techSteelDesc: string;
  techIrrigationName: string;
  techIrrigationDesc: string;
  techWallsName: string;
  techWallsDesc: string;
  techArcheryName: string;
  techArcheryDesc: string;
  research: string;
  researched: string;

  // Intel
  intelMissionTitle: string;
  intelMissionDesc: string;
  intelRolesTitle: string;
  intelRolesDesc: string;
  intelControlsTitle: string;
  intelControlsDesc: string;

  // Game Over / Pause
  expeditionPaused: string;
  colonyOverrun: string;
  pausedDesc: string;
  overrunDesc: string;
  wavesSurvived: string;
  colonistsThriving: string;
  structuresBuilt: string;
  goldAmassed: string;
  resumeExpedition: string;
  restartColony: string;
  tryAgain: string;

  // In-Game Alerts
  waveSurvived: string;
  settlerJoined: string;
  relicDiscovered: string;
  notEnoughRes: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    title: 'Outpost Pioneer',
    subtitle: 'Colony Survival & Frontier Defense',
    tagline: 'Carve a thriving frontier outpost out of an untamed procedurally generated world. Gather resources, assign colonists to vital tasks, and construct impenetrable defenses to withstand the night hordes.',
    startExpedition: 'Establish Colony',
    settings: 'Settings',
    controls: 'Controls',
    controlsHint: 'WASD Move · Shift Sprint · Left Click / F Action · B Build · Esc Pause',
    move: 'Move',
    sprint: 'Sprint',
    action: 'Chop / Mine / Attack',
    buildMode: 'Build Mode',
    pause: 'Pause',
    rotate: 'Rotate',

    settingsTitle: 'Colony Settings',
    languageLabel: 'Language / Мова / Język',
    audioSettings: 'Sound & Audio',
    muteAudio: 'Mute All Sound',
    soundVolume: 'Master Volume',
    graphicsSettings: 'Visual & Camera',
    shadows: 'Dynamic Shadows',
    screenShake: 'Screen Shake on Impact',
    cameraDistance: 'Camera Distance',
    camClose: 'Close',
    camMedium: 'Normal',
    camFar: 'Wide',
    gameplaySettings: 'Expedition Difficulty',
    difficulty: 'Threat Level',
    diffPeaceful: 'Explorer (Peaceful)',
    diffNormal: 'Survivor (Standard)',
    diffBrutal: 'Nightmare (Brutal Waves)',
    close: 'Apply & Close',

    settlementName: 'Fort Valenwood',
    colonists: 'Colonists',
    structures: 'Structures',
    daylight: 'Daylight',
    dusk: 'Dusk Approaching',
    nightfall: 'Nightfall (Danger)',
    dawn: 'Dawn Breaking',
    waveInbound: 'Wave Inbound in:',
    waveInvasion: 'WAVE INVASION',
    creaturesRemaining: 'Creatures Remaining:',
    commander: 'Commander',
    health: 'Health',
    stamina: 'Stamina',
    wood: 'Wood',
    stone: 'Stone',
    iron: 'Iron',
    gold: 'Gold',
    food: 'Food',

    tabBlueprints: 'Blueprints',
    tabColonists: 'Colonists',
    tabUpgrades: 'Tech Upgrades',
    tabIntel: 'Frontier Intel',
    showControls: 'Show Colony Controls',
    hideControls: 'Hide Controls (Zen Mode)',
    placing: 'Placing',
    confirm: 'Confirm',
    cancel: 'Cancel',

    bpTownHallName: 'Colony Center',
    bpTownHallDesc: 'The heart of your settlement. Attracts settlers and coordinates defenses.',
    bpFarmName: 'Cultivated Farm',
    bpFarmDesc: 'Produces wheat and crops when worked by farmers to feed the colony.',
    bpQuarryName: 'Mining Quarry',
    bpQuarryDesc: 'Extracts stone and raw iron ore from the bedrock when worked by miners.',
    bpWatchtowerName: 'Archer Watchtower',
    bpWatchtowerDesc: 'Automated ballista vantage point. Shoots approaching monsters.',
    bpPalisadeName: 'Timber Palisade',
    bpPalisadeDesc: 'Sturdy sharpened wooden fortification that blocks hostile creature paths.',
    bpSpiketrapName: 'Iron Spike Trap',
    bpSpiketrapDesc: 'Concealed iron ground spikes that impale and bleed invading monsters.',
    bpLanternName: 'Ward Lantern Post',
    bpLanternDesc: 'Illuminates the perimeter, deters prowlers, and enhances guard sight.',
    bpBarracksName: 'Guards Barracks',
    bpBarracksDesc: 'Trains militia with shields and spears, boosting guard stats by +50%.',
    bpWindmillName: 'Windmill & Granary',
    bpWindmillDesc: 'Milling sails grind grain into surplus flour, boosting all food production by +75%.',
    bpBlacksmithName: 'Armory Forge',
    bpBlacksmithDesc: 'Smelts ore and produces armor. Periodically repairs damaged colony structures.',
    bpClinicName: 'Herbalist Clinic',
    bpClinicDesc: 'Apothecary brewing restorative salves that heal nearby wounded colonists and player.',
    bpStoneWallName: 'Stone Bastion Wall',
    bpStoneWallDesc: 'Heavy ashlar masonry wall with battlements. Enormous resistance against monsters.',
    bpBallistaName: 'Siege Ballista Turret',
    bpBallistaDesc: 'Heavy automated siege bolt-thrower that impales and pierces giant brutes and golems.',
    minimap: 'Minimap Radar',
    lootRuin: 'Loot Ruin',

    roleFarmer: 'Farmer',
    roleMiner: 'Miner',
    roleGuard: 'Guard',
    roleBuilder: 'Builder',
    roleIdle: 'Idle',
    kills: 'Kills',
    hp: 'HP',

    techSteelName: 'Steel Weapon Forging',
    techSteelDesc: 'Increases Commander & Guard attack damage by +50%.',
    techIrrigationName: 'Irrigation Canals',
    techIrrigationDesc: 'Increases Farm harvest yield by +60% per cycle.',
    techWallsName: 'Reinforced Masonry',
    techWallsDesc: 'Doubles durability of Palisades and Watchtowers.',
    techArcheryName: 'Ballista Optics',
    techArcheryDesc: 'Increases Watchtower range and firing rate by +35%.',
    research: 'Research',
    researched: 'Researched',

    intelMissionTitle: 'SURVIVAL MISSION',
    intelMissionDesc: 'Night hordes spawn from the outer wilderness edge. Construct defensive palisades around your Town Center and garrison guards in watchtowers.',
    intelRolesTitle: 'COLONY ROLES',
    intelRolesDesc: 'Farmers gather wheat to sustain food. Miners extract stone and iron. Guards actively attack monsters within range and defend town borders.',
    intelControlsTitle: 'COMMANDER CONTROLS',
    intelControlsDesc: 'WASD: Movement · Shift: Sprint · Left Click / F: Harvest / Attack · R: Rotate Building.',

    expeditionPaused: 'Expedition Paused',
    colonyOverrun: 'Colony Overrun',
    pausedDesc: 'Your settlers wait patiently for your tactical commands.',
    overrunDesc: 'The frontier outpost succumbed to the night beasts. The wilderness remembers your valiant defense.',
    wavesSurvived: 'Waves Survived',
    colonistsThriving: 'Colonists Thriving',
    structuresBuilt: 'Structures Built',
    goldAmassed: 'Gold Amassed',
    resumeExpedition: 'Resume Expedition',
    restartColony: 'Found New Colony',
    tryAgain: 'Restart Frontier',

    waveSurvived: 'WAVE SURVIVED!',
    settlerJoined: 'joined the colony!',
    relicDiscovered: 'ANCIENT RELIC DISCOVERED!',
    notEnoughRes: 'Not enough resources!',
  },

  uk: {
    title: 'Outpost Pioneer',
    subtitle: 'Виживання поселення та оборона рубежів',
    tagline: 'Побудуйте процвітаючий форпост у дикому процедурно згенерованому світі. Збирайте деревину й камінь, призначайте поселенців на життєво важливі роботи та зводьте неприступний частокіл, щоб стримати нічну орду.',
    startExpedition: 'Заснувати колонію',
    settings: 'Налаштування',
    controls: 'Керування',
    controlsHint: 'WASD Рух · Shift Біг · Лівий клік / F Дія · B Будівництво · Esc Пауза',
    move: 'Рух',
    sprint: 'Спринт',
    action: 'Рубати / Добувати / Атакувати',
    buildMode: 'Режим будівництва',
    pause: 'Пауза',
    rotate: 'Обертати',

    settingsTitle: 'Налаштування поселення',
    languageLabel: 'Мова / Language / Język',
    audioSettings: 'Звук та аудіо',
    muteAudio: 'Вимкнути всі звуки',
    soundVolume: 'Загальна гучність',
    graphicsSettings: 'Графіка та камера',
    shadows: 'Динамічні тіні',
    screenShake: 'Трясіння камери при ударах',
    cameraDistance: 'Відстань камери',
    camClose: 'Близько',
    camMedium: 'Стандарт',
    camFar: 'Далеко',
    gameplaySettings: 'Складність експедиції',
    difficulty: 'Рівень загрози',
    diffPeaceful: 'Дослідник (Мирний)',
    diffNormal: 'Вцілілий (Стандарт)',
    diffBrutal: 'Кошмар (Жорстокі хвилі)',
    close: 'Застосувати та закрити',

    settlementName: 'Форт Вейленвуд',
    colonists: 'Поселенці',
    structures: 'Споруди',
    daylight: 'День',
    dusk: 'Наближаються сутінки',
    nightfall: 'Ніч (Небезпека)',
    dawn: 'Світанок',
    waveInbound: 'Хвиля наближається через:',
    waveInvasion: 'НАПАД ХВИЛІ',
    creaturesRemaining: 'Залишилося потвор:',
    commander: 'Командир',
    health: 'Здоровʼя',
    stamina: 'Витривалість',
    wood: 'Деревина',
    stone: 'Камінь',
    iron: 'Залізо',
    gold: 'Золото',
    food: 'Їжа',

    tabBlueprints: 'Креслення',
    tabColonists: 'Поселенці',
    tabUpgrades: 'Технології',
    tabIntel: 'Розвідка рубежу',
    showControls: 'Панель керування',
    hideControls: 'Режим споглядання (Zen)',
    placing: 'Розміщення',
    confirm: 'Підтвердити',
    cancel: 'Скасувати',

    bpTownHallName: 'Центр колонії',
    bpTownHallDesc: 'Серце поселення. Приваблює поселенців і координує оборону.',
    bpFarmName: 'Оброблена ферма',
    bpFarmDesc: 'Вирощує пшеницю та овочі завдяки праці фермерів для харчування поселення.',
    bpQuarryName: 'Каменоломня',
    bpQuarryDesc: 'Добуває камінь та залізну руду з надр завдяки шахтарям.',
    bpWatchtowerName: 'Вартова вежа лучників',
    bpWatchtowerDesc: 'Автоматизований балістичний пост. Розстрілює монстрів на підступах.',
    bpPalisadeName: 'Деревʼяний частокіл',
    bpPalisadeDesc: 'Міцне укріплення із загострених колод, що перешкоджає руху ворогів.',
    bpSpiketrapName: 'Залізна пастка-шипи',
    bpSpiketrapDesc: 'Приховані залізні шипи, що пронизують та сповільнюють нападників.',
    bpLanternName: 'Захисний ліхтар',
    bpLanternDesc: 'Освітлює периметр, відлякує нічних звірів і збільшує огляд варти.',
    bpBarracksName: 'Казарми варти',
    bpBarracksDesc: 'Тренує ополченців зі щитами та списами, посилюючи характеристики варти на +50%.',
    bpWindmillName: 'Вітряк та зерносховище',
    bpWindmillDesc: 'Крила млина перетирають зерно на борошно, збільшуючи виробництво їжі на +75%.',
    bpBlacksmithName: 'Кузня та зброярня',
    bpBlacksmithDesc: 'Плавить руду та кує обладунки. Періодично ремонтує пошкоджені споруди навколо.',
    bpClinicName: 'Хатина травника',
    bpClinicDesc: 'Аптека, що виготовляє цілющі мазі, відновлюючи здоровʼя командира та поселенців.',
    bpStoneWallName: 'Камʼяний бастіон',
    bpStoneWallDesc: 'Важка кладка з бійницями. Має надзвичайно високу стійкість до штурмів монстрів.',
    bpBallistaName: 'Облогова баліста',
    bpBallistaDesc: 'Важка автоматизована баліста, що пронизує наскрізь велетнів та големів.',
    minimap: 'Радар мінікарти',
    lootRuin: 'Руїна зі здобиччю',

    roleFarmer: 'Фермер',
    roleMiner: 'Шахтар',
    roleGuard: 'Вартовий',
    roleBuilder: 'Будівельник',
    roleIdle: 'Вільний',
    kills: 'Знищено',
    hp: 'ОЗ',

    techSteelName: 'Кування сталевої зброї',
    techSteelDesc: 'Збільшує шкоду від атак командира та варти на +50%.',
    techIrrigationName: 'Іригаційні канали',
    techIrrigationDesc: 'Збільшує врожайність ферм на +60% за цикл.',
    techWallsName: 'Посилена кладка',
    techWallsDesc: 'Подвоює запас міцності частоколу та вартових веж.',
    techArcheryName: 'Оптика баліст',
    techArcheryDesc: 'Збільшує дальність та швидкість стрільби веж на +35%.',
    research: 'Дослідити',
    researched: 'Досліджено',

    intelMissionTitle: 'МІСІЯ ВИЖИВАННЯ',
    intelMissionDesc: 'Нічні зграї виходять із глибин дикої природи. Збудуйте захисний частокіл навколо Ратуші та розмістіть вартових у вежах.',
    intelRolesTitle: 'ПРОФЕСІЇ ПОСЕЛЕННЯ',
    intelRolesDesc: 'Фермери вирощують пшеницю. Шахтарі видобувають камінь та залізо. Вартові активно патрулюють і захищають колоністів від монстрів.',
    intelControlsTitle: 'КЕРУВАННЯ КОМАНДИРОМ',
    intelControlsDesc: 'WASD: Рух · Shift: Біг · Лівий клік / F: Збір / Атака · R: Обертати споруду.',

    expeditionPaused: 'Експедиція на паузі',
    colonyOverrun: 'Колонію захоплено',
    pausedDesc: 'Ваші поселенці чекають на наступні накази.',
    overrunDesc: 'Форпост не витримав навали нічних істот. Рубежі памʼятатимуть ваш героїзм.',
    wavesSurvived: 'Хвиль відбито',
    colonistsThriving: 'Живих поселенців',
    structuresBuilt: 'Зведено споруд',
    goldAmassed: 'Накопичено золота',
    resumeExpedition: 'Продовжити експедицію',
    restartColony: 'Заснувати нове поселення',
    tryAgain: 'Почати заново',

    waveSurvived: 'ХВИЛЮ ВІДБИТО!',
    settlerJoined: 'приєднався до колонії!',
    relicDiscovered: 'ЗНАЙДЕНО СТАРОДАВНЮ РЕЛІКВІЮ!',
    notEnoughRes: 'Недостатньо ресурсів!',
  },

  pl: {
    title: 'Outpost Pioneer',
    subtitle: 'Przetrwanie osady i obrona rubieży',
    tagline: 'Zbuduj dobrze prosperujący posterunek w dzikim, proceduralnie generowanym świecie. Zbieraj drewno i kamień, przydzielaj osadników do zadań i wznoś palisady, by odeprzeć nocne hordy.',
    startExpedition: 'Załóż kolonię',
    settings: 'Ustawienia',
    controls: 'Sterowanie',
    controlsHint: 'WASD Ruch · Shift Sprint · Lewy przycisk / F Akcja · B Budowanie · Esc Pauza',
    move: 'Ruch',
    sprint: 'Sprint',
    action: 'Rąb / Wydobywaj / Atakuj',
    buildMode: 'Tryb budowy',
    pause: 'Pauza',
    rotate: 'Obróć',

    settingsTitle: 'Ustawienia kolonii',
    languageLabel: 'Język / Language / Мова',
    audioSettings: 'Dźwięk i audio',
    muteAudio: 'Wycisz wszystkie dźwięki',
    soundVolume: 'Głośność główna',
    graphicsSettings: 'Grafika i kamera',
    shadows: 'Dynamiczne cienie',
    screenShake: 'Wstrząsy kamery przy trafieniach',
    cameraDistance: 'Odległość kamery',
    camClose: 'Blisko',
    camMedium: 'Normalna',
    camFar: 'Daleko',
    gameplaySettings: 'Poziom trudności ekspedycji',
    difficulty: 'Poziom zagrożenia',
    diffPeaceful: 'Odkrywca (Spokojny)',
    diffNormal: 'Ocalały (Standard)',
    diffBrutal: 'Koszmar (Okrutne fale)',
    close: 'Zastosuj i zamknij',

    settlementName: 'Fort Valenwood',
    colonists: 'Osadnicy',
    structures: 'Struktury',
    daylight: 'Światło dnia',
    dusk: 'Nadchodzi zmierzch',
    nightfall: 'Noc (Niebezpieczeństwo)',
    dawn: 'Świt',
    waveInbound: 'Fala nadejdzie za:',
    waveInvasion: 'INWAZJA FALI',
    creaturesRemaining: 'Pozostałe potwory:',
    commander: 'Dowódca',
    health: 'Zdrowie',
    stamina: 'Kondycja',
    wood: 'Drewno',
    stone: 'Kamień',
    iron: 'Żelazo',
    gold: 'Złoto',
    food: 'Jedzenie',

    tabBlueprints: 'Plany budowy',
    tabColonists: 'Osadnicy',
    tabUpgrades: 'Technologie',
    tabIntel: 'Raport z rubieży',
    showControls: 'Pokaż panel sterowania',
    hideControls: 'Tryb kontemplacji (Zen)',
    placing: 'Stawianie',
    confirm: 'Potwierdź',
    cancel: 'Anuluj',

    bpTownHallName: 'Centrum kolonii',
    bpTownHallDesc: 'Serce Twojej osady. Przyciąga nowych osadników i koordynuje obronę.',
    bpFarmName: 'Gospodarstwo rolne',
    bpFarmDesc: 'Produkuje pszenicę i plony dzięki pracy rolników, karmiąc kolonię.',
    bpQuarryName: 'Kamieniołom',
    bpQuarryDesc: 'Wydobywa kamień i rudę żelaza z podłoża dzięki górnikom.',
    bpWatchtowerName: 'Wieża strażnicza',
    bpWatchtowerDesc: 'Zautomatyzowane stanowisko z balistą. Ostrzeliwuje zbliżające się bestie.',
    bpPalisadeName: 'Drewniana palisada',
    bpPalisadeDesc: 'Solidne zaostrzone pnie drewna, które blokują ruch wrogich stworzeń.',
    bpSpiketrapName: 'Żelazne kolce',
    bpSpiketrapDesc: 'Ukryte w ziemi stalowe kolce raniące i spowalniające najeźdźców.',
    bpLanternName: 'Latarnia ochronna',
    bpLanternDesc: 'Oświetla obwód, odstrasza drapieżniki i zwiększa zasięg widzenia straży.',
    bpBarracksName: 'Koszary straży',
    bpBarracksDesc: 'Szkolą milicję z tarczami i włóczniami, zwiększając statystyki straży o +50%.',
    bpWindmillName: 'Wiatrak i spichlerz',
    bpWindmillDesc: 'Skrzydła mielą zboże na mąkę, zwiększając całą produkcję żywności o +75%.',
    bpBlacksmithName: 'Kuźnia zbrojna',
    bpBlacksmithDesc: 'Wytapia rudę i kuje pancerze. Okresowo naprawia uszkodzone pobliskie budowle.',
    bpClinicName: 'Chata zielarza',
    bpClinicDesc: 'Apteka przygotowująca lecznicze maści, które leczą dowódcę i pobliskich osadników.',
    bpStoneWallName: 'Kamienny bastion',
    bpStoneWallDesc: 'Ciężki mur z ciosanego kamienia z blankami. Ogromna odporność na ataki bestii.',
    bpBallistaName: 'Wieża z balistą oblężniczą',
    bpBallistaDesc: 'Ciężka automatyczna balista przebijająca potężne bestie i golemy.',
    minimap: 'Radar minimapy',
    lootRuin: 'Ruiny ze skarbem',

    roleFarmer: 'Rolnik',
    roleMiner: 'Górnik',
    roleGuard: 'Strażnik',
    roleBuilder: 'Budowniczy',
    roleIdle: 'Bezczynny',
    kills: 'Zabójstwa',
    hp: 'PŻ',

    techSteelName: 'Kucie broni stalowej',
    techSteelDesc: 'Zwiększa obrażenia zadawane przez dowódcę i strażników o +50%.',
    techIrrigationName: 'Kanały irygacyjne',
    techIrrigationDesc: 'Zwiększa plony z farm o +60% na cykl.',
    techWallsName: 'Wzmocniona konstrukcja',
    techWallsDesc: 'Podwaja wytrzymałość palisad i wież strażniczych.',
    techArcheryName: 'Optyka balist',
    techArcheryDesc: 'Zwiększa zasięg i szybkostrzelność wież o +35%.',
    research: 'Opracuj',
    researched: 'Opracowano',

    intelMissionTitle: 'MISJA PRZETRWANIA',
    intelMissionDesc: 'Nocne hordy nacierają z rubieży dziczy. Wznoś palisady ochronne wokół Centrum i obsadzaj wieże strażnikami.',
    intelRolesTitle: 'ROLA OSADNIKÓW',
    intelRolesDesc: 'Rolnicy produkują żywność. Górnicy wydobywają kamień i żelazo. Strażnicy patrolują obwód i walczą z bestiami.',
    intelControlsTitle: 'STEROWANIE DOWÓDCĄ',
    intelControlsDesc: 'WASD: Ruch · Shift: Sprint · Lewy przycisk / F: Zbieraj / Atakuj · R: Obrót budowli.',

    expeditionPaused: 'Wyprawa wstrzymana',
    colonyOverrun: 'Kolonia zdobyta',
    pausedDesc: 'Twoi osadnicy cierpliwie czekają na dalsze rozkazy.',
    overrunDesc: 'Fort uległ nocnym bestiom. Dzicz zapamięta Wasz heroiczny opór.',
    wavesSurvived: 'Odparte fale',
    colonistsThriving: 'Żywi osadnicy',
    structuresBuilt: 'Wzniesione budowle',
    goldAmassed: 'Zgromadzone złoto',
    resumeExpedition: 'Wznów ekspedycję',
    restartColony: 'Załóż nową osadę',
    tryAgain: 'Zacznij od nowa',

    waveSurvived: 'FALA ODPARTA!',
    settlerJoined: 'dołącza do kolonii!',
    relicDiscovered: 'ODNALEZIONO STAROŻYTNY RELIKT!',
    notEnoughRes: 'Niewystarczająca ilość surowców!',
  },
};
