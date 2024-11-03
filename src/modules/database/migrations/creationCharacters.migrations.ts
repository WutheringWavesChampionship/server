import { ElementEnum, RarityEnum, WeaponTypeEnum } from '@shared/constants';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1667991225370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const values = characters
      .map(
        (char) =>
          `('${char.name}', '${char.element}', '${char.rarity}', '${char.weaponType}')`,
      )
      .join(', ');
    return queryRunner.query(
      `INSERT INTO "characters" ("name", "element", "rarity", "weaponType")
      VALUES ${values};`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "characters"');
  }
}
interface Character {
  name: string;
  imagePath: string;
  element: ElementEnum;
  rarity: RarityEnum;
  weaponType: WeaponTypeEnum;
}

// 1.3 characters
const characters: Array<Character> = [
  {
    name: 'roverSpectro',
    imagePath: '/characters/rover.webp',
    element: ElementEnum.SPECTRO,
    rarity: RarityEnum.LEGENDARY,
    weaponType: WeaponTypeEnum.SWORD,
  },
  {
    name: 'roverHavoc',
    imagePath: '/characters/rover.webp',
    element: ElementEnum.HAVOC,
    rarity: RarityEnum.LEGENDARY,
    weaponType: WeaponTypeEnum.SWORD,
  },
  {
    name: 'jinhsi',
    imagePath: '/characters/jinhsi.png',
    element: ElementEnum.SPECTRO,
    rarity: RarityEnum.LEGENDARY,
    weaponType: WeaponTypeEnum.BROAD_BLADE,
  },
  {
    name: 'xiangliYao',
    imagePath: '/characters/xiangliYao.webp',
    element: ElementEnum.ELECTRO,
    rarity: RarityEnum.LEGENDARY,
    weaponType: WeaponTypeEnum.GAUNTLETS,
  },
  {
    name: 'yinlin',
    imagePath: '/characters/yinlin.webp',
    element: ElementEnum.ELECTRO,
    rarity: RarityEnum.LEGENDARY,
    weaponType: WeaponTypeEnum.RECTIFIER,
  },
  {
    name: 'changli',
    imagePath: '/characters/changli.png',
    element: ElementEnum.FUSION,
    rarity: RarityEnum.LEGENDARY,
    weaponType: WeaponTypeEnum.SWORD,
  },
  {
    name: 'zhezhi',
    imagePath: '/characters/zhezhi.webp',
    element: ElementEnum.GLACIO,
    rarity: RarityEnum.LEGENDARY,
    weaponType: WeaponTypeEnum.RECTIFIER,
  },
  {
    name: 'shorekeeper',
    imagePath: '/characters/shorekeeper.webp',
    element: ElementEnum.SPECTRO,
    rarity: RarityEnum.LEGENDARY,
    weaponType: WeaponTypeEnum.RECTIFIER,
  },
  {
    name: 'jiyan',
    imagePath: '/characters/jiyan.webp',
    element: ElementEnum.AERO,
    rarity: RarityEnum.LEGENDARY,
    weaponType: WeaponTypeEnum.BROAD_BLADE,
  },
  {
    name: 'encore',
    imagePath: '/characters/encore.webp',
    element: ElementEnum.FUSION,
    rarity: RarityEnum.LEGENDARY,
    weaponType: WeaponTypeEnum.RECTIFIER,
  },
  {
    name: 'mortefi',
    imagePath: '/characters/mortefi.webp',
    element: ElementEnum.FUSION,
    rarity: RarityEnum.EPIC,
    weaponType: WeaponTypeEnum.PISTOLS,
  },
  {
    name: 'sanhua',
    imagePath: '/characters/sanhua.webp',
    element: ElementEnum.GLACIO,
    rarity: RarityEnum.EPIC,
    weaponType: WeaponTypeEnum.SWORD,
  },
  {
    name: 'verina',
    imagePath: '/characters/verina.webp',
    element: ElementEnum.SPECTRO,
    rarity: RarityEnum.LEGENDARY,
    weaponType: WeaponTypeEnum.RECTIFIER,
  },
  {
    name: 'jianxin',
    imagePath: '/characters/jianxin.webp',
    element: ElementEnum.AERO,
    rarity: RarityEnum.LEGENDARY,
    weaponType: WeaponTypeEnum.GAUNTLETS,
  },
  {
    name: 'calcharo',
    imagePath: '/characters/calcharo.webp',
    element: ElementEnum.ELECTRO,
    rarity: RarityEnum.LEGENDARY,
    weaponType: WeaponTypeEnum.BROAD_BLADE,
  },
  {
    name: 'danjin',
    imagePath: '/characters/danjin.webp',
    element: ElementEnum.HAVOC,
    rarity: RarityEnum.EPIC,
    weaponType: WeaponTypeEnum.SWORD,
  },
  {
    name: 'baizhi',
    imagePath: '/characters/baizhi.webp',
    element: ElementEnum.GLACIO,
    rarity: RarityEnum.EPIC,
    weaponType: WeaponTypeEnum.RECTIFIER,
  },
  {
    name: 'chixia',
    imagePath: '/characters/chixia.webp',
    element: ElementEnum.FUSION,
    rarity: RarityEnum.EPIC,
    weaponType: WeaponTypeEnum.PISTOLS,
  },
  {
    name: 'lingyang',
    imagePath: '/characters/lingyang.webp',
    element: ElementEnum.GLACIO,
    rarity: RarityEnum.LEGENDARY,
    weaponType: WeaponTypeEnum.GAUNTLETS,
  },
  {
    name: 'yuanwu',
    imagePath: '/characters/yuanwu.webp',
    element: ElementEnum.ELECTRO,
    rarity: RarityEnum.EPIC,
    weaponType: WeaponTypeEnum.GAUNTLETS,
  },
  {
    name: 'aalto',
    imagePath: '/characters/aalto.webp',
    element: ElementEnum.AERO,
    rarity: RarityEnum.EPIC,
    weaponType: WeaponTypeEnum.PISTOLS,
  },
  {
    name: 'yangyang',
    imagePath: '/characters/yangyang.webp',
    element: ElementEnum.AERO,
    rarity: RarityEnum.EPIC,
    weaponType: WeaponTypeEnum.SWORD,
  },
  {
    name: 'taoqi',
    imagePath: '/characters/taoqi.webp',
    element: ElementEnum.HAVOC,
    rarity: RarityEnum.EPIC,
    weaponType: WeaponTypeEnum.BROAD_BLADE,
  },
];
