import { AttachmentDef, ProbConfig, StyleDef, TankDef } from '@/types/loot';

// 전차 풀 정의
export const HIGH_TANK_POOL: TankDef[] = [
  { id: 'bzt-70', name: 'BZT-70', tier: 'X', valueGold: 22500, category: 'HIGH' },
  { id: 'coccodrillo-louis', name: 'Coccodrillo', tier: 'X', valueGold: 22500, category: 'HIGH' },
  { id: 'projet-louis', name: 'Projet Louis', tier: 'IX', valueGold: 8850, category: 'HIGH' },
  { id: 'tbt', name: 'TBT', tier: 'IX', valueGold: 11050, category: 'HIGH' },
  { id: 'jagdpanzer-e90', name: 'Jagdpanzer E 90', tier: 'IX', valueGold: 10350, category: 'HIGH' },
  { id: 'stridsyxa', name: 'Stridsyxa', tier: 'VIII', valueGold: 6750, category: 'HIGH' },
];

export const LOW_TANK_POOL: TankDef[] = [
  {
    id: 'cromwell-applique',
    name: 'Cromwell Applique',
    tier: 'V',
    valueGold: 1500,
    category: 'LOW',
  },
  { id: 't115', name: 'T115', tier: 'IV', valueGold: 1300, category: 'LOW' },
  { id: 'skoda-t15a', name: 'Škoda T 15A', tier: 'III', valueGold: 950, category: 'LOW' },
  {
    id: 'begleitwagen-rheinmetall',
    name: 'Begleitwagen Rheinmetall',
    tier: 'II',
    valueGold: 500,
    category: 'LOW',
  },
  {
    id: 'renault-r35-fcm36',
    name: 'Renault R35/FCM 36',
    tier: 'II',
    valueGold: 500,
    category: 'LOW',
  },
];

export const GUARANTEED_GOLD_PER_BOX = 250;

export const STYLE_POOL: StyleDef[] = [
  { id: 'bazyliszek', name: '바질리셰크', nameEn: 'Bazyliszek', forTank: 'CS-63' },
  { id: 'coastguard', name: '코스트가드', nameEn: 'Coastguard', forTank: 'BZ-75' },
  {
    id: 'special-delivery',
    name: '스페셜 딜리버리',
    nameEn: 'Special Delivery',
    forTank: 'Char Futur 4',
  },
  {
    id: 'law-of-the-jungle',
    name: '정글의 법칙',
    nameEn: 'Law of the Jungle',
    forTank: 'Rheinmetall Panzerwagen',
  },
  { id: 'polar-storm', name: '폴라 스톰', nameEn: 'Polar Storm', forTank: 'Kunze Panzer' },
  { id: 'quintessence', name: '퀸테센스', nameEn: 'Quintessence', forTank: 'Vz. 55' },
  { id: 'the-rod', name: '더 로드', nameEn: 'The Rod', forTank: 'Grille 15' },
  { id: 'the-tortoise', name: '더 토터스', nameEn: 'The Tortoise', forTank: 'Tortoise' },
  { id: 'orlik', name: '올릭', nameEn: 'Orlík', forTank: 'Škoda T 50' },
  { id: 'amphibious', name: '앰피비어스', nameEn: 'Amphibious', forTank: 'M53/M55' },
];

export const ATTACHMENT_POOL: AttachmentDef[] = [
  { id: 'scr-720-radar', setId: 'air-squadron', nameKo: 'SCR-720 레이더', nameEn: 'SCR-720 Radar' },
  { id: 'f24-camera', setId: 'air-squadron', nameKo: 'F24 카메라', nameEn: 'F24 Camera' },
  {
    id: 'wooden-bomb-mk1',
    setId: 'air-squadron',
    nameKo: '목제 폭탄 Mk. I',
    nameEn: 'Wooden Bomb Mk. I',
  },
  {
    id: 'b36-remote-turret',
    setId: 'air-squadron',
    nameKo: 'B-36 원격 포탑',
    nameEn: 'B-36 Remote Turret',
  },
  { id: 'propeller', setId: 'air-squadron', nameKo: '프로펠러', nameEn: 'Propeller' },
  { id: 'headlights', setId: 'fire-horse-gear', nameKo: '헤드라이트', nameEn: 'Headlights' },
  {
    id: 'motorcycle-mg',
    setId: 'fire-horse-gear',
    nameKo: '오토바이 기관총',
    nameEn: 'Motorcycle Machine Gun',
  },
  { id: 'blazing-engine', setId: 'fire-horse-gear', nameKo: '작열 엔진', nameEn: 'Blazing Engine' },
  { id: 'fire-hose', setId: 'fire-horse-gear', nameKo: '파이어 호스', nameEn: 'Fire Hose' },
  { id: 'saddlebag', setId: 'fire-horse-gear', nameKo: '안장 가방', nameEn: 'Saddlebag' },
  { id: 'celestial-banner', setId: 'celestial', nameKo: '천하기', nameEn: 'Celestial Banner' },
  { id: 'celestial-bell', setId: 'celestial', nameKo: '천로의 종', nameEn: 'Celestial Bell' },
  { id: 'celestial-cannon', setId: 'celestial', nameKo: '천군 화포', nameEn: 'Celestial Cannon' },
  { id: 'celestial-chest', setId: 'celestial', nameKo: '천보함', nameEn: 'Celestial Chest' },
  {
    id: 'celestial-xunleichong',
    setId: 'celestial',
    nameKo: '천병 신뢰총',
    nameEn: 'Celestial XunLeiChong',
  },
];

export const DEFAULT_PROB_CONFIG: ProbConfig = {
  pityEvery: 50,
  highTankChance: 0.024,
  lowTankChance: 0.1166,

  resourceDrop: {
    chance: 0.8594,
    premium: {
      totalChance: 0.4276,
      items: [
        { days: 1, chance: 0.3016 },
        { days: 3, chance: 0.0873 },
        { days: 7, chance: 0.0387 },
      ],
    },
    gold: {
      totalChance: 0.2521,
      items: [
        { amount: 250, chance: 0.1745 },
        { amount: 500, chance: 0.0582 },
        { amount: 1000, chance: 0.0194 },
      ],
    },
    credits: {
      totalChance: 0.3203,
      items: [
        { amount: 100_000, chance: 0.233 },
        { amount: 500_000, chance: 0.0873 },
      ],
    },
  },

  styles: {
    chance: 0.05,
    weights: {
      bazyliszek: 0.1,
      coastguard: 0.11,
      'special-delivery': 0.11,
      'law-of-the-jungle': 0.1,
      'polar-storm': 0.1,
      quintessence: 0.09,
      'the-rod': 0.09,
      'the-tortoise': 0.1,
      orlik: 0.1,
      amphibious: 0.1,
    },
  },

  attachments: {
    chance: 0.06,
    weights: {
      'scr-720-radar': 0.02,
      'f24-camera': 0.0583,
      'wooden-bomb-mk1': 0.085,
      'b36-remote-turret': 0.085,
      propeller: 0.085,
      headlights: 0.085,
      'motorcycle-mg': 0.085,
      'blazing-engine': 0.0583,
      'fire-hose': 0.02,
      saddlebag: 0.085,
      'celestial-banner': 0.085,
      'celestial-bell': 0.02,
      'celestial-cannon': 0.085,
      'celestial-chest': 0.0583,
      'celestial-xunleichong': 0.085,
    },
  },

  highTankWeights: {
    'bzt-70': 0.0542,
    'coccodrillo-louis': 0.0542,
    'projet-louis': 0.2083,
    tbt: 0.2083,
    'jagdpanzer-e90': 0.2083,
    stridsyxa: 0.2667,
  },

  lowTankWeights: {
    'cromwell-applique': 0.06,
    t115: 0.06,
    'skoda-t15a': 0.2453,
    'begleitwagen-rheinmetall': 0.3173,
    'renault-r35-fcm36': 0.3173,
  },
};
