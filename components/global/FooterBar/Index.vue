<script setup lang="ts">
defineOptions({ name: 'FooterBar' })
const locale = useStore.common().locale
const showLangPanel = ref<boolean>(false)
const email = ref<string>('')
const errShow = ref<boolean>(false)
const errText = ref<string>('')
const subSucces = ref<boolean>(false)

const { data: footerBarRes } = useNuxtData('footerBar')

const footerBarData = getStrapiData(footerBarRes?.value?.data) || {}

const serverList = footerBarData.serverList || []

const menuList = footerBarData.menuList || []

const linkList = footerBarData.linkList || []

const labelList: { [k: string]: string } = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  ja: '日本語',
  zh: '繁體中文',
}

const langList: any = []
for (const lang in labelList) {
  langList.push({
    link: `https://${useAppConfig()?.web_domain[lang]}`,
    lang,
    label: labelList[lang],
  })
}

// 订阅新闻信
const clickSub = () => {
  const emailVal = email.value
  const { $trace } = useNuxtApp() as any

  const params = {
    email: emailVal,
    lang: useStore.common().locale,
    check_url: `${window?.location?.origin}/newsletter.htm?a=subscribe&t=check&h=`,
  }

  if (validateForm(emailVal)) {
    useApi()
      .apiCommon.subNewsletter(params)
      .then((res = {}) => {
        const resData = res?.data?.value || {}
        if (resData.cscode === 0) {
          subSucces.value = true
          errShow.value = true
          // 订阅成功
          errText.value = footerBarData.subscribeError4

          setTimeout(() => {
            email.value = ''
            subSucces.value = false
            errShow.value = false
          }, 3000)
        } else {
          subSucces.value = false
          // 订阅失败
          errText.value = footerBarData.subscribeError3
          const resStr = JSON.stringify(res)

          const elkData = {
            event: 'error',
            event_label: emailVal,
            xargs_event_category: 'subscribe_newsletters',
            event_value: resStr,
          }
          $trace.traceCustomEvent(elkData)
        }
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e)
      })
  }
}

// 校验邮箱
const validateForm = (value: any) => {
  // eslint-disable-next-line no-useless-escape
  const emailReg = /^([A-Za-z0-9_\+\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

  if (value === '') {
    errShow.value = true
    // 不能为空
    errText.value = footerBarData.subscribeError2
    return false
  } else if (!emailReg.test(value)) {
    errShow.value = true
    // 邮箱格式不正确
    errText.value = footerBarData.subscribeError1
    return false
  }

  return true
}
</script>

<template>
  <footer class="footer-wrapper">
    <!-- 服务列表 -->
    <BaseContainer>
      <ul v-if="serverList?.length" class="server-list flex items-center">
        <li
          v-for="(server, serverIdx) in serverList"
          :key="`server-${serverIdx}`"
          class="server-item flex items-center flex-1 pl27"
        >
          <i v-if="server.icon" class="server-icon iconfont-sg" :class="server.icon"></i>
          <span class="color-white server-text" v-html="server.text"></span>
        </li>
      </ul>
    </BaseContainer>
    <hr class="split-line" />
    <!-- 菜单 -->
    <BaseContainer v-if="menuList?.length" class="menu-box">
      <section class="menu-left pt35 flex w75% gap20;">
        <ul v-for="level1 in menuList" :key="`menu-${level1.label}`" class="menu-list w25%">
          <li class="menu-title">
            <span class="c-white font-bold" v-html="level1.label"></span>
          </li>
          <template v-for="level2 in level1.list" :key="level2.label">
            <li
              v-if="
                level2?.link.indexOf('newsletter') === -1 ||
                (level2?.link.indexOf('newsletter') > -1 && useStore.common().mobile)
              "
            >
              <!-- 移动端显示新闻信链接 -->
              <a
                v-if="level2.noOpener && level2?.link?.includes('https')"
                v-track-label="getComponentsName(level2.eventLabel)"
                v-track:click="{
                  event: 'click',
                  event_value: level2.eventLabel,
                  event_label: level2.eventLabel?.toLowerCase()?.replace(/\s/g, '_'),
                  xargs_event_category: 'nav',
                  event_target: { position: 'main_nav_footer' },
                }"
                :href="level2.link"
                target="_blank"
                rel="noopener"
              >
                {{ level2.label }}
              </a>
              <a
                v-else
                v-track-label="getComponentsName(level2.eventLabel)"
                v-track:click="{
                  event: 'click',
                  event_value: level2.eventLabel,
                  event_label: level2.eventLabel?.toLowerCase()?.replace(/\s/g, '_'),
                  xargs_event_category: 'nav',
                  event_target: { position: 'main_nav_footer' },
                }"
                :href="level2.link"
              >
                {{ level2.label }}
              </a>
            </li>
          </template>
        </ul>
      </section>
      <!-- 右侧订阅提交 -->
      <section v-if="!useStore.common().mobile" class="menu-right pt35 pl16 w26%">
        <span
          v-if="footerBarData.subscribeNewsletter"
          class="c-white font-bold"
          v-html="footerBarData.subscribeNewsletter"
        ></span>
        <p v-if="footerBarData.subscribe" v-html="footerBarData.subscribe"></p>
        <div class="subscribe-box mt15 mb6">
          <input id="subValue" v-model="email" type="text" :placeholder="footerBarData.emailAddress" />
          <span
            v-track-label="getComponentsName('subscribe_newsletters')"
            v-track:click="{
              event: 'subscribe',
              xargs_event_category: 'subscribe_newsletters',
              email: email,
              xargs_email_source: 'sub',
              xargs_email_item: 'newsletter',
            }"
            class="gosub text-center"
            @click="clickSub"
          >
            <i class="iconfont-sg icon-arrow_line_right"></i>
          </span>
          <div v-if="errShow" class="email-err" :class="subSucces ? 'email-success' : ''">
            {{ errText }}
          </div>
        </div>
      </section>
    </BaseContainer>

    <!-- 协议 & 授权 -->
    <div class="bg-#282b2c mt40 py25">
      <BaseContainer class="footer-bottom">
        <div class="flex justify-between gap20">
          <section class="flex items-center flex-wrap gap10 gap-col-30">
            <!-- logo -->
            <a v-track-label="getComponentsName('home')" href="/" class="navbar-logo font-size-0">
              <MyImg
                :src="`${useImgPath().value}/cn/common/icon_logo_pc.png`"
                layout="responsive"
                :alt="'dvdfab logo'"
                class="w108 h36"
              />
              index
            </a>

            <p v-if="footerBarData.brand" v-html="footerBarData.brand"></p>
          </section>

          <!-- 语种切换 -->
          <section class="footer-lang-box">
            <div class="lang-select-box">
              <button class="lang-btn" @click="showLangPanel = true" @mouseenter="showLangPanel = true">
                <span
                  v-track-label="getComponentsName(labelList[locale])"
                  class="font-size-18"
                  v-html="labelList[locale]"
                ></span>
              </button>

              <!-- 选择列表遮罩层 -->
              <div
                v-show="langList?.length && showLangPanel && useStore.common().mobile"
                class="lang-list-mask"
                @click="showLangPanel = false"
              ></div>
              <!-- 选择列表 -->
              <ul
                v-show="langList?.length && showLangPanel"
                class="lang-list"
                :class="[useStore.common().mobile ? 'mobile' : '']"
                @mouseleave="showLangPanel = false"
              >
                <li
                  v-if="footerBarData.chooseLanguage"
                  class="lang-title"
                  v-html="footerBarData.chooseLanguage"
                ></li>
                <li
                  v-for="(item, index) in langList"
                  :key="item.label + index"
                  :class="[item.lang === locale ? 'active' : '']"
                  class="lang-item"
                >
                  <a
                    v-track-label="getComponentsName(item.lang)"
                    class="footer-item-link"
                    :href="item.link ? item.link : 'javascript:;'"
                    :rel="item.rel"
                    v-html="item.label"
                  ></a>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <ul v-if="linkList?.length" class="protocol-list mt20 flex gap10 gap-col-35 flex-wrap">
          <li v-for="(item, index) in linkList" :key="item.label + index" class="protocol-item">
            <a :href="item.link" :rel="item.rel" target="_blank" :class="item.class" v-html="item.label"></a>
          </li>
        </ul>

        <p v-if="footerBarData.bottom" class="mt20" v-html="footerBarData.bottom"></p>
      </BaseContainer>
    </div>
  </footer>
</template>

<style scoped lang="less">
// 整体布局
.footer-wrapper {
  position: relative;
  @apply bg-\#2f3233 c-\#797979 pt-9;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 9px;
    background-image: linear-gradient(90deg, #00a5ea, #04c1b4 50%, #7ce78d);
  }

  a {
    @apply c-\#797979;
  }
}

.split-line {
  border: none;
  border-bottom: 1px solid #3d3e3f;
}

// 服务栏
.server-list {
  @apply pt-23 pb-20;

  @media (max-width: @screen-sm) {
    flex-wrap: wrap;

    .server-item {
      @apply w100\% flex-none pl0 min-h-auto;
      line-height: 1.2;
      i {
        transform: scale(0.7);
      }

      .server-text {
        :deep(b) {
          display: inline;
        }
      }
    }
  }
}

.server-item {
  @apply min-h-67;
  border-right: 1px solid #3d3e3f;

  &:first-child {
    border-left: 1px solid #3d3e3f;
  }

  .server-icon {
    @apply color-white font-size-34 mr-10;
  }

  .server-text {
    :deep(b) {
      display: block;
    }
  }
}

// 菜单列表
.menu-box {
  @apply flex justcontent-between;
  line-height: 1.8;

  @media (max-width: @screen-xxl) {
    @apply flex-wrap;

    .menu-left {
      @apply w100\% flex-wrap;

      .menu-list {
        @apply w-auto flex-1;
      }
    }
    .menu-right {
      @apply w100\% pl0;
    }
  }

  @media (max-width: @screen-sm) {
    .menu-left {
      .menu-list {
        @apply w50\% flex-none;
      }
    }
  }
}

.protocol-list,
.menu-list {
  li > a {
    &:hover {
      @apply c-white;
    }
  }
}

// 新闻信提交
.subscribe-box {
  position: relative;
  max-width: 282px;
  margin: 15px 0 6px;

  input {
    width: 100%;
    height: 30px;
    padding: 0 35px 0 20px;
    outline: 0;
    border-radius: 15px;
    border: 1px solid #5f6162;
    color: #8e8e8e;
    background: transparent;
    font-size: 14px;
    line-height: 20px;
  }

  input:focus {
    border: 1px solid #8d9192;
    color: #fff;
  }

  .gosub {
    position: absolute;
    width: 24px;
    height: 24px;
    right: 3px;
    top: 3px;
    background: @primary-text-color;
    color: #fff;
    border-radius: 50%;
    line-height: 24px;
    font-weight: bold;
    cursor: pointer;

    &:hover {
      background: #33c3ff;
      box-shadow: 0px 4px 8px 0px rgba(0, 169, 240, 0.5);
    }
  }

  .email-err {
    display: block;
    padding-left: 25px;
    color: red;
    text-align: left;
  }

  .email-success {
    color: #7ad27a;
  }
}

// 语种切换
.footer-lang-box {
  .footer-logo-box {
    width: 240px;
    height: 43px;
  }
}

.lang-list-mask {
  @apply position-fixed left-0 right-0 top-0 bottom-0 z-100;
}

.lang-select-box {
  position: relative;
  text-align: right;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 20px;
    top: -14px;
  }

  &:hover {
    .lang-list {
      display: block;
    }
  }

  .lang-btn {
    padding: 0 20px;
    background-color: transparent;
    border: 1px solid #a6a6a6;
    color: #fff;
    border-radius: 21px;
  }

  .lang-list {
    max-width: 464px;
    display: none;
    position: absolute;
    padding: 20px 30px 19px;
    bottom: 38px;
    right: 0;
    background: #ffffff;
    font-size: 18px;
    box-shadow: 0 0 30px 0 rgba(195, 195, 195, 0.4);

    &.mobile {
      @apply w100\% position-fixed bottom-0 left-0 max-w-full z-101;
    }

    .lang-title {
      @apply font-size-22 c-\#4d5b66 whitespace-nowrap mb20;
    }
    @media (max-width: @screen-md) {
      .lang-title {
        text-align: left;
      }
      &.mobile {
        @apply w100\% position-fixed bottom-0 left-0 max-w-full;
      }
    }

    .lang-item {
      line-height: 3;
      color: #8e8e8e;
      text-align: center;
      font-size: 18px;

      &.active,
      &:hover {
        color: @primary-text-color;

        a {
          color: @primary-text-color;
        }
      }

      a {
        color: #8e8e8e;
      }
    }
  }
}
@media (max-width: 768px) {
  .footer-bottom > .flex {
    flex-wrap: wrap;
  }
}
</style>
