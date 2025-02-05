<script lang="tsx" setup>
const props = defineProps({
  content: {
    type: String,
    default: '',
    required: true,
  },
  blocks: {
    type: Array,
    default: () => [],
    required: true,
  },
  slug: {
    type: String,
    default: '',
  },
})

interface ComponentMap {
  [k: string]: { component: any; props?: Record<string, any>; innerText?: string }
}

const componentMap: ComponentMap = {}

const componentList: any[] = [
  {
    component: resolveComponent('BlocksArticlesProductPriceGrid'),
    __component: 'articles.product-price-grid',
    props: {},
  },
  {
    component: resolveComponent('BlocksArticlesTechCard'),
    __component: 'articles.tech-card',
    props: {},
  },
]

const getComponentMap = () => {
  props.blocks.forEach((block: any) => {
    const hitData = componentList.find((item) => item.__component === block.__component)
    if (hitData) {
      componentMap[block.uuid] = deepCopy(hitData)
      componentMap[block.uuid].props = { ...componentMap[block.uuid].props, blockData: block }
    }
  })
}

const SafeHtml = ({ html }: { html: string }) => {
  return h('div', { innerHTML: html })
}

const ContentView = defineComponent({
  setup() {
    getComponentMap()

    // 使用正则表达式匹配所有占位符
    const placeholders = /<(\w+)\b[^>]*>({{([^}]+)}})<\/\1>/g
    // const placeholders = /\{\{([^}]+)\}\}/g
    let match
    const parts: any[] = []
    let lastIndex = 0

    // 遍历所有匹配的占位符
    while ((match = placeholders.exec(props.content)) !== null) {
      const placeholder = match[2]
      const Component = componentMap[placeholder] ? componentMap[placeholder].component : null

      // 添加占位符前的文本部分
      if (lastIndex < match.index) {
        parts.push(<SafeHtml html={props.content.substring(lastIndex, match.index)} />)
      }

      // 添加占位符对应的组件（如果有的话）
      if (Component) {
        const componentProps = componentMap[placeholder].props || {}
        const text = componentMap[placeholder].innerText
        // 使用 JSX 的展开语法传递 props
        parts.push(<Component {...componentProps}>{text || ''}</Component>)
      } else {
        // 如果没有找到对应的组件，可以默认渲染文本或做其他处理
        parts.push(<span>{`${placeholder}`}</span>)
      }

      // 更新 lastIndex
      lastIndex = placeholders.lastIndex
    }

    // 添加最后的文本部分（如果有的话）
    if (lastIndex < props.content.length) {
      parts.push(<SafeHtml html={props.content.substring(lastIndex)} />)
    }

    // parts.forEach((part) => {
    // if (part?.props?.html) {
    // part.props.html = replaceImgWithTag(part.props.html, 'img')
    //  }
    // })

    return () => (
      <div class={`content-strapi pt20 cms_${props.slug}`}>
        {/* 使用 Fragment 来包裹多个子元素 */}
        <>{parts}</>
      </div>
    )
  },
})
</script>

<template>
  <ContentView />
</template>

<style lang="less">
.content-strapi {
  font-size: 18px;

  // padding: 40px 0 30px 0;
  h1 {
    margin-bottom: 35px;
    font-size: 24px;
    color: #333;
  }
  h2 {
    font-size: 22px;
    margin-bottom: 15px;
    line-height: 1.5;
    color: #333;
  }
  h3 {
    font-size: 20px;
    margin-bottom: 15px;
    line-height: 1.5;
    color: #333;
  }

  h4,
  h5 {
    font-size: 18px;
    margin-bottom: 10px;
    line-height: 1.5;
    color: #333;
  }
  p {
    font-size: 18px;
    line-height: 1.8;
    margin-bottom: 40px;
  }
  img {
    width: 100%;
    max-width: 100%;
    height: auto;
  }
  a {
    color: @primary-color;
    &:hover {
      text-decoration: underline;
    }
  }

  .tc {
    text-align: center;
  }

  .privacy {
    a {
      display: inline-block;
      margin-bottom: 20px;
    }
  }
  .refund_policy {
    h2 {
      line-height: 1.5;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    li,
    p {
      line-height: 1.8;
      color: #3b5159;
      margin-bottom: 10px;
    }
    .ul_1,
    .ul_2 {
      padding-left: 22px;
      li {
        list-style-type: disc;
        padding-left: 2px;
      }
    }
    .ul_2 {
      li {
        list-style-type: decimal;
      }
    }
  }
  .webmasterBox {
    h2 {
      line-height: 1.5;

      margin-bottom: 15px;
    }

    p {
      line-height: 1.8;
    }
    .subpage-text-link {
      margin-bottom: 10px;
      word-break: break-word;
    }

    .tab_con {
      ul {
        li {
          line-height: 2;
        }
      }
    }
  }
  .cinavia_p {
    b {
      color: #ff2e50;
      font-weight: 100;
    }
  }

  .popular-articles-box {
    padding-top: 65px;
    h3 {
      font-weight: normal;
    }

    .popular-articles {
      padding: 20px;
      margin-top: 20px;
      background: #fdfefe;
    }
  }
  .videotoolbox-tablebox {
    overflow-x: auto;
  }
  .videotoolbox-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 50px;
    box-sizing: border-box;
    th,
    td {
      color: #9fa3bc;
      font-size: 14px;
      border: 1px solid #9fa3bc;
      padding: 10px;
      line-height: 25px;
    }
  }
}

.content-strapi.cms_metainfo,
.content-strapi.cms_exactread,
.content-strapi.cms_miniso {
  .subpage-text-link {
    margin-bottom: 40px;
  }
  p {
    line-height: 1.8;
    margin-bottom: 0;
  }
}
.content-strapi.cms_how-to-register {
  .howtoregister-selector .howtoregister-tabslist span {
    cursor: pointer;
    &[selected] {
      color: #fff;
      background: #059bc1;
      border-radius: 24px;
    }
  }

  .step-list {
    li {
      line-height: 24px;
      margin-bottom: 15px;
      color: #3b5159;
      .arial {
        display: inline-block;
        width: 24px;
        height: 24px;
        background: #798990;
        border-radius: 50%;
        color: #f7f7f7;
        text-align: center;
        line-height: 25px;
        font-size: 16px;
        margin-right: 10px;
      }
    }
  }

  h3 {
    padding-top: 40px;
    padding-bottom: 17px;
  }

  h6 {
    line-height: 1.5;

    font-size: 20px;
    margin-bottom: 15px;
  }

  p {
    line-height: 27px;
    margin-bottom: 0;
  }

  .pb33 {
    // padding-bottom: 33px;
  }

  .subpage-text-link {
    margin-bottom: 40px;
  }

  .howtoregister-selector {
    .howtoregister-tabslist {
      border-radius: 24px;
      margin-bottom: 17px;
      background: -webkit-linear-gradient(to right, #00a5ea, #04c1b4, #7ce78d);
      background: linear-gradient(to right, #00a5ea, #04c1b4, #7ce78d);
      overflow: hidden;
      span {
        height: 48px;
        line-height: 48px;
        position: relative;
        float: left;
        width: 25%;
        text-align: center;
        font-size: 20px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.8);
        box-sizing: border-box;
      }
      span:hover {
        color: #fff;
        border-radius: 24px;
      }
    }
    @media screen and(max-width: 768px) {
      .howtoregister-tabslist {
        padding: 6px;
        span {
          width: 50%;
        }
      }
    }
    .faqlist {
      li {
        h4 {
          padding-bottom: 17px;
          // padding-top: 34px;
        }
        p {
          line-height: 30px;
          color: #3b5159;
        }
      }
    }
  }
}
.content-strapi.cms_4k-uhd-drives {
  h1 {
    margin-bottom: 0;
  }
  h2 {
    margin-bottom: 35px;
  }

  h3 {
    line-height: 1.5;

    margin-bottom: 15px;
  }

  p {
    color: #3b5159;
    line-height: 1.8;
    margin-bottom: 0;
  }

  .mb40 {
    margin-bottom: 40px;
  }

  .mb20 {
    margin-bottom: 20px;
    margin-top: 50px;
  }

  .spanleft {
    display: inline-block;
    width: 300px;
  }
}
.content-strapi.cms_cloud-decryption {
  .color-white {
    color: #333;
  }
}

.content-strapi.cms_multimedia-culture {
  a {
    color: #4d5b66;
    &:hover {
      color: @primary-color;
    }
  }
}
.content-strapi.cms_awards-and-reviews,
.content-strapi.cms_opensource {
  p {
    margin-bottom: 0;
  }
  .mb40 {
    margin-bottom: 40px;
  }

  .mb20 {
    margin-bottom: 20px;
  }
  .subpage-text-link {
    margin-bottom: 40px;
  }
}
.content-strapi.cms_intel-quick-sync {
  .intel_quick_sync-tablebox {
    overflow-x: auto;
  }
  .intel_quick_sync-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 50px;
    box-sizing: border-box;
    th,
    td {
      color: #9fa3bc;
      font-size: 14px;
      border: 1px solid #9fa3bc;
      padding: 10px;
      line-height: 25px;
    }
  }
}
.content-strapi.cms_bdshrink,
.content-strapi.cms_about-4k,
.content-strapi.cms_intel-quick-sync,
.content-strapi.cms_how-to-register,
.content-strapi.cms_videotoolbox,
.content-strapi.cms_lightning-recoding {
  img {
    width: 100% !important;
    max-width: 100% !important;
  }
}
</style>
