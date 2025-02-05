<script setup lang="ts">
// import { postJson } from '@/static/script/api'
const props = defineProps({
  articleId: { type: String, default: '' },
})

const isMobile = useStore.common().mobile
const formData = reactive({
  id: '',
  email: '',
  type: 'resource',
  lang: useStore.common().locale,
})

const show = ref(false)
const articleSubscribe = useCookie('article_subscribe', { maxAge: 30 * 60 * 60 * 24 })
const placeholder = useI18n().value.common.email_placeholder
const subscribe = useI18n().value.common.subscribe
const noEmail = useI18n().value.resource.subscribe_fail
const subscribeFail = useI18n().value.resource.subscribe_fail
const subscribeSuccess = useI18n().value.resource.subscribe_success

const status = ref(0)

onMounted(() => {
  handleShowSubscribe()
  window.addEventListener('scroll', handleShowSubscribe)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleShowSubscribe)
})
const handleShowSubscribe = () => {
  if (articleSubscribe.value || !isMobile) {
    show.value = false
    return
  }
  const totalH = document.body.scrollHeight || document.documentElement.scrollHeight
  // 可视高
  const clientH = window.innerHeight || document.documentElement.clientHeight
  // 计算有效高
  const validH = totalH - clientH
  // 滚动条卷去高度
  const scrollH = document.body.scrollTop || document.documentElement.scrollTop
  // 百分比
  const result = Number(((scrollH / validH) * 100).toFixed(0))
  show.value = result >= 2
}

const submit = async (evt: any) => {
  // eslint-disable-next-line no-useless-escape
  const re = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  if (!formData.email && !re.test(formData.email)) {
    status.value = 3
    return
  }

  const { $trace } = useNuxtApp() as any
  $trace.traceCustomEvent({
    event: 'click',
    xargs_email: formData.email,
    xargs_event_category: 'popup',
    xargs_o_email_source: 'sub',
    xargs_o_email_item: 'mobile_download',
  })

  const params = formData
  if (props.articleId) {
    params.id = props.articleId
  }

  try {
    const { data: res } = await useApi().apiArticle.subscribeNewsletter(params)
    if ((res.value as any).cscode === 0) {
      status.value = 1
      articleSubscribe.value = 'hide'
    } else {
      status.value = 2
    }
  } catch (err) {
    status.value = 2
    console.error(err)
  }
}
const close = (type: number) => {
  status.value = 0
  if (type === 1) {
    show.value = false
  }
}
</script>

<template>
  <div>
    <div v-show="show" class="subscribe-con sub-con-non-amp">
      <div class="input-box">
        <input v-model="formData.email" class="email" type="text" name="email" :placeholder="placeholder" />
        <span
          v-track:click="{
            event: 'submit',
            xargs_event_category: 'get_email',
            email: formData.email,
            xargs_email_source: 'sub',
            xargs_email_item: 'mobile_download',
          }"
          class="submit text-center font-700"
          @click="submit"
          v-html="subscribe"
        ></span>
      </div>
      <div v-if="status" class="modal-status">
        <div v-if="status == 1" class="modal-body success-info">
          <div class="modal-content">
            <div class="box">
              <i class="iconfont-sg icon-c-success"></i>
              <p>{{ subscribeSuccess }}</p>
            </div>
            <i class="iconfont-sg icon-close-line" @click="close(1)"></i>
          </div>
        </div>
        <div v-if="status == 2" class="modal-body error-info">
          <div class="modal-content">
            <div class="box">
              <i class="iconfont-sg icon-c-notice"></i>
              <p>{{ subscribeFail }}</p>
            </div>
            <i class="iconfont-sg icon-close-line" @click="close(2)"></i>
          </div>
        </div>
        <div v-if="status == 3" class="modal-body error-info">
          <div class="modal-content">
            <div class="box">
              <i class="iconfont-sg icon-c-notice"></i>
              <p>{{ noEmail }}</p>
            </div>
            <i class="iconfont-sg icon-close-line" @click="close(3)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<style lang="less">
.m-wrap .con-ft .item3 {
  padding-bottom: 80px;
}
.subscribe-con {
  padding: 10px;
  background: #fff;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  border-top: 2px solid #e3e9eb;
  z-index: 11;
  .input-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .email {
    width: 65%;
    height: 45px;
    border: 2px solid @primary-color;
    border-radius: 100px;
    padding: 0 10px;
    background: #eefaff;

    &:focus {
      background: #fff;
    }

    &::placeholder {
      font-size: 14px;
    }
  }

  .submit {
    width: 32%;
    height: 45px;
    line-height: 45px;
    border-radius: 100px;
    background: @primary-color;
    color: #fff;
    font-size: 18px;
    border: 0;
    margin-left: 10px;
  }

  .modal-body {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 92;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    .modal-content {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 90%;
      transform: translate(-50%, -50%);
      border-radius: 10px;
      padding: 30px;
      background-color: rgb(255, 255, 255);
      color: @base-text-color;
      font-size: 20px;
      .box {
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          margin-right: 20px;
          min-width: 3.07142857rem;
        }
      }
      .error-info {
        color: @base-text-color;
      }
      .icon-close-line {
        position: absolute;
        bottom: -50%;
        left: 50%;
        transform: translateX(-50%);
        color: #fff;
      }
    }
    .iconfont-sg {
      font-size: 30px;
    }
    .icon-c-success {
      color: green;
    }
    .icon-c-notice {
      color: red;
    }
  }
}

.sub-con-non-amp {
}
</style>
