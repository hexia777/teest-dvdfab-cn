import { describe, test, expect } from 'vitest';
import {
  formatBlocksData,
  getStrapiData,
  convertStrapiLocalesToObject,
} from '../../utils/strapi';

describe('Test functions', () => {
  // 线上数据
  const blocks = [
    {
      id: 5428,
      __component: 'banner.h-text-btns-img',
      title:
        "DVDFab DVD CopyLe meilleur logiciel de copier DVD sans perte de qualitéCopier un DVD sur un disque vierge ou en tant qu'ISO/dossier sur le disque dur",
      desc: "Le meilleur logiciel de copier DVD sans perte de qualité<br/>Copier un DVD sur un disque vierge ou en tant qu'ISO/dossier sur le disque dur",
      type: 'dvdfab',
      textTheme: 'dark',
      anchorId: null,
      mediaAlt: 'DVDFab DVD Copy',
      buyNowTip: null,
      macLink: null,
      downloadBtn: null,
      media: {
        data: {
          id: 1383,
          attributes: {
            name: 'banner.png',
            alternativeText: null,
            caption: null,
            width: 960,
            height: 680,
            formats: {
              small: {
                ext: '.png',
                url: 'https://c1.dvdfab.cn/media/small_banner_8010be803a.png',
                hash: 'small_banner_8010be803a',
                mime: 'image/webp',
                name: 'small_banner.png',
                path: null,
                size: 66.55,
                width: 500,
                height: 354,
                sizeInBytes: 66554,
              },
              medium: {
                ext: '.png',
                url: 'https://c3.dvdfab.cn/media/medium_banner_8010be803a.png',
                hash: 'medium_banner_8010be803a',
                mime: 'image/webp',
                name: 'medium_banner.png',
                path: null,
                size: 114.32,
                width: 750,
                height: 531,
                sizeInBytes: 114318,
              },
              thumbnail: {
                ext: '.png',
                url: 'https://c2.dvdfab.cn/media/thumbnail_banner_8010be803a.png',
                hash: 'thumbnail_banner_8010be803a',
                mime: 'image/webp',
                name: 'thumbnail_banner.png',
                path: null,
                size: 23.45,
                width: 220,
                height: 156,
                sizeInBytes: 23445,
              },
            },
            hash: 'banner_8010be803a',
            ext: '.png',
            mime: 'image/webp',
            size: 18.78,
            url: 'https://c5.dvdfab.cn/media/banner_8010be803a.png',
            previewUrl: null,
            provider: 'aws-s3',
            provider_metadata: null,
            createdAt: '2024-11-03T00:55:41.853Z',
            updatedAt: '2024-11-03T00:55:41.853Z',
          },
        },
      },
      descSub: [],
      component_dir: 'Banner',
      component_file_name: 'HTextBtnsImg',
    },
    {
      id: 2770,
      __component: 'product.nav-bar',
      items: [
        {
          id: 27073,
          value: 'overview',
        },
        {
          id: 27074,
          value: 'features',
        },
        {
          id: 27075,
          value: 'features',
        },
        {
          id: 27076,
          value: 'features',
        },
        {
          id: 27077,
          value: 'guide',
        },
        {
          id: 27078,
          value: 'tech_specs',
        },
      ],
      component_dir: 'Product',
      component_file_name: 'NavBar',
    },
  ]
  test('formatBlocksData should format block data correctly', () => {

    const formattedBlocks = formatBlocksData(blocks);

    expect(formattedBlocks[0].component_dir).toEqual('Banner')
    expect(formattedBlocks[0].component_file_name).toEqual('HTextBtnsImg')
    expect(formattedBlocks[1].component_dir).toEqual('Product')
    expect(formattedBlocks[1].component_file_name).toEqual('NavBar')
  });

  test('getStrapiData should extract attributes correctly', () => {
    const data = {
      data: {
        attributes: {
          name: 'Test',
        },
      },
    };

    const attributes = getStrapiData(data);

    expect(attributes.name).toEqual('Test');
  });

  test('convertStrapiLocalesToObject should convert locales data to an object', () => {
    const data = [
      { key: 'en', value: 'English' },
      { key: 'fr', value: 'French' },
    ];

    const localesObject = convertStrapiLocalesToObject(data);

    expect(localesObject.en).toEqual('English');
    expect(localesObject.fr).toEqual('French');
  });

  test('convertStrapiLocalesToObject should handle empty data', () => {
    const data = [];

    const localesObject = convertStrapiLocalesToObject(data);

    expect(localesObject).toEqual({});
  });
});
