<script setup lang="ts">
import vueRecaptcha from 'vue3-recaptcha2'
const locale = useStore.common().locale

useStore.common().setPageType('support')

const pageRes = await useCommonPageData({
  'populate[seo][populate]': '*',
  'populate[locales][populate]': '*',
  '[filters][slug][$eq]': 'contact',
  locale,
})
// seo 相关信息
if (pageRes) {
  usePageSeo({ title: pageRes?.title || '', ...(pageRes?.seo || {}) })
}
const localesMap = pageRes.locales.reduce((acc: any, item: any) => {
  return { ...acc, [item.key]: item.value }
}, {})
const pageInfo = reactive({
  title: localesMap.welcome_tip,
  desc: localesMap.contact_banner_desc,
  contentTitle: localesMap.contact_form,
})
interface optionItem {
  name: string
  id: string | number
  sub: object
}
const formData = reactive({
  email: {
    label: localesMap.email_address,
    value: '',
    placeholder: localesMap.email_address,
  },
  fullname: {
    label: localesMap.full_name,
    value: '',
    placeholder: localesMap.full_name,
  },
  subject: {
    label: localesMap.subject,
    value: '',
    placeholder: localesMap.subject,
  },
  productLine: {
    label: localesMap.product_tip,
    value: '',
    placeholder: localesMap.select_tip,
    options: [] as optionItem[],
  },
  problem: {
    label: localesMap.main_problem_type,
    value: '',
    placeholder: localesMap.select_tip,
    options: [] as optionItem[],
  },
  purchaseProblem: {
    label: localesMap.sub_problem_type,
    value: '',
    placeholder: localesMap.select_tip,
    options: [] as optionItem[],
  },
  message: {
    label: localesMap.message,
    value: '',
    placeholder: localesMap.describe_tip,
  },
  recaptcha: '',
})
const rules = reactive({
  'email.value': [
    {
      required: true,
      message: localesMap.required_tip || '',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: localesMap.valid_email || '',
      trigger: ['blur', 'change'],
    },
  ],
  'subject.value': [
    {
      required: true,
      message: localesMap.required_tip || '',
      trigger: ['blur', 'change'],
    },
    {
      validator: (_: any, value: string, callback: any) => {
        const forbiddenPattern = /^\s*$/
        if (forbiddenPattern.test(value)) {
          return callback(new Error(localesMap.required_tip || ''))
        }
        callback()
      },
      trigger: ['blur', 'change'],
    },
  ],
  'productLine.value': [
    {
      required: true,
      message: localesMap.required_tip || '',
      trigger: 'change',
    },
  ],
  'problem.value': [
    {
      required: true,
      message: localesMap.required_tip || '',
      trigger: 'change',
    },
  ],
  'purchaseProblem.value': [
    {
      required: true,
      message: localesMap.required_tip || '',
      trigger: 'change',
    },
  ],
  recaptcha: [
    {
      required: true,
      message: localesMap.required_tip || '',
    },
  ],
})

const optionMap = ref<any>(null)
const getSelectOptionData = async () => {
  const dbLangs = {
    zh: 1,
    en: 2,
    ja: 3,
    fr: 4,
    de: 5,
  }
  const langID = dbLangs[locale]
  const params = { language: langID, lang: locale } as any
  // 如果是独立服务器特殊处理
  if (useStore.common().backend_host) {
    params.host = useStore.common().backend_host
  }
  const fun = [useApi().apiContact.getConditionData(params), useApi().apiContact.getConfigData(params)]
  const [res1, res2] = await Promise.all(fun).catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e)
  })
  const res1Data = res1.data?.value?.data || {}
  const optionList = res1Data.problems
  const priorityList = res1Data.priorities
  // 产品数据需要分类
  const temp = optionList?.filter((item: any) => {
    return Number(item.id) === 2
  })?.[0]
  interface Item {
    name?: string
  }

  interface Target {
    AI: Item[]
    StreamFab: Item[]
    DVDFab: Item[]
    PlayerFab: Item[]
    UniFab: Item[]
    PassKey: Item[]
    other: Item[]
    // 添加索引签名
    [key: string]: Item[] | undefined
  }

  // 确保 target 对象已经初始化
  const target: Target = {
    AI: [],
    StreamFab: [],
    DVDFab: [],
    PlayerFab: [],
    UniFab: [],
    PassKey: [],
    other: [],
  }

  if (temp && Array.isArray(temp.sub)) {
    temp.sub.forEach((item: Item) => {
      const name = item.name?.toLowerCase() || ''

      if (item.name?.endsWith('AI')) {
        target.AI.push(item)
      } else if (name.startsWith('stream')) {
        target.StreamFab.push(item)
      } else if (name.startsWith('dvdfab')) {
        target.DVDFab.push(item)
      } else if (name.startsWith('playerfab')) {
        target.PlayerFab.push(item)
      } else if (name.startsWith('unifab')) {
        target.UniFab.push(item)
      } else if (name.startsWith('passkey')) {
        target.PassKey.push(item)
      } else {
        target.other.push(item)
      }
    })
  }
  const optionTarget = []
  // 使用 Object.keys 遍历已知键
  for (const key of Object.keys(target) as Array<keyof Target>) {
    const items = target[key]
    if (items?.length) {
      optionTarget.push({
        label: key,
        options: items,
      })
    }
  }
  const res2Data = res2.data?.value?.data || {}
  formData.productLine.options = res2Data.product_line || []
  formData.problem.options = optionList || []
  formData.purchaseProblem.options = optionList?.[0]?.sub || []
  optionMap.value = {
    langID,
    // priorityList,
    priorityLevel: priorityList?.[0]?.id,
  }
}

await getSelectOptionData()

const formRef = ref(null) as any
const vueRecaptchaRef = ref(null) as any
const isSubSuccess = ref(false)
const showMessageErrTips = ref(false)
const showRecaptureErrTips = ref(false)

const submitForm = () => {
  const content = quill.value?.container?.firstChild?.innerHTML?.replace(/<\/?[^>]*>/g, '') || ''
  const contents = quill.value?.container?.firstChild?.innerHTML || ''
  if (content === '') {
    showMessageErrTips.value = true
  } else {
    showMessageErrTips.value = false
  }

  // 有二级用二级id,没有则用一级id,使用子问题分类
  const problem_id = formData.purchaseProblem.options?.length
    ? formData.purchaseProblem.value
    : formData.problem.value
  formRef.value?.validate((valid: boolean) => {
    if (!showMessageErrTips.value && valid) {
      if (!formData.recaptcha) {
        showRecaptureErrTips.value = true
        return
      } else {
        showRecaptureErrTips.value = false
      }
      const fdata = {
        email: formData.email.value,
        problem_id, // 问题id
        full_name: formData.fullname.value, // 名
        priority_id: optionMap.value.priorityLevel,
        subject: formData.subject.value,
        came_from: 2, // 来源
        token: '',
        origin_url: window.location.origin,
        language: optionMap.value.langID,
        contents,
        recaptcha: formData.recaptcha,
        product_line: formData.productLine.value,
      } as any
      // 如果是独立服务器特殊处理
      if (useStore.common().backend_host) {
        fdata.host = useStore.common().backend_host
      }
      useApi()
        .apiContact.addTicketData(fdata)
        .then((response: any) => {
          const result = response.data?.value || {}
          if (Number(result.cscode) === 0) {
            alertInfo.value = localesMap.respond_tip
            isSubSuccess.value = true
            nextTick(() => {
              messageAlert.value = true
            })
            formRef.value.resetFields()
            formData.purchaseProblem.options = formData.problem.options?.[0]?.sub || []
            quill.value?.setContents([])
          } else {
            alertInfo.value = localesMap.fail
            isSubSuccess.value = false
            nextTick(() => {
              messageAlert.value = true
            })
            formData.recaptcha = ''
          }
          return result
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e)
        })
        .finally(() => {
          vueRecaptchaRef.value.reset()
        })
    } else {
      alertInfo.value = localesMap.fail
      return false
    }
  })
}

const beforeUpload = (file: any) => {
  const isLog = file.name.substr(file.name.length - 4, 4) === '.log'
  const is7z = file.name.substr(file.name.length - 3, 3) === '.7z'
  const iszip = file.name.substr(file.name.length - 4, 4) === '.zip'
  const istxt = file.name.substr(file.name.length - 4, 4) === '.txt'
  const isdoc = file.name.substr(file.name.length - 4, 4) === '.doc'
  const isdocx = file.name.substr(file.name.length - 5, 5) === '.docx'
  const israr = file.name.substr(file.name.length - 4, 4) === '.rar'
  const ispng = file.name.substr(file.name.length - 4, 4) === '.png'
  const isPNG = file.name.substr(file.name.length - 4, 4) === '.PNG'
  const isjpg = file.name.substr(file.name.length - 4, 4) === '.jpg'
  const isjpeg = file.name.substr(file.name.length - 4, 5) === '.jpeg'
  let extOK = true
  if (
    !isLog &&
    !is7z &&
    !iszip &&
    !istxt &&
    !isdoc &&
    !isdocx &&
    !israr &&
    !ispng &&
    !isPNG &&
    !isjpg &&
    !isjpeg
  ) {
    extOK = false
    alert(localesMap.file_unsupported)
  }
  const isLt1M = file.size / 1024 / 1024 < 5
  if (!isLt1M) {
    alert(localesMap.file_maxsize)
  }
  return extOK && isLt1M
}
const myUpload = ref(null)

const loading = ref(false)
const messageAlert = ref(false)
const alertInfo = ref('')

const formatEmailInput = (value: string) => {
  if (value) {
    formData.email.value = value.replace(/(^\s*)|(\s*$)/g, '')
  }
}

const handleFileSuccess = (res: any, file: any) => {
  if (Number(res.cscode) === 0) {
    const length = quill.value.getSelection().index
    quill.value.insertText(length, ' \u00A0')
    quill.value.insertText(length, file.name, 'link', res.data.file_name)
  } else {
    loading.value = false
    messageAlert.value = true
    alertInfo.value = localesMap.fail
  }
  myUpload.value.clearFiles()
}
const beforeImgUpload = (file: any) => {
  const isjpg = file.name.substr(file.name.length - 4, 4) === '.jpg'
  const ispng = file.name.substr(file.name.length - 4, 4) === '.png'
  const isgif = file.name.substr(file.name.length - 4, 4) === '.gif'
  const isJPG = file.name.substr(file.name.length - 4, 4) === '.JPG'
  const isGIF = file.name.substr(file.name.length - 4, 4) === '.GIF'
  const isjpeg = file.name.substr(file.name.length - 5, 5) === '.jpeg'
  const isJPEG = file.name.substr(file.name.length - 5, 5) === '.JPEG'
  let extOK = true
  if (!isjpg && !ispng && !isgif && !isJPG && !isGIF && !isjpeg && !isJPEG) {
    extOK = false
    alert(localesMap.file_unsupported)
  }
  const isLt1M = file.size / 1024 / 1024 < 5
  if (!isLt1M) {
    alert(localesMap.file_maxsize)
  }
  return extOK && isLt1M
}

const myImage = ref(null)
const handleImgSuccess = (res: any) => {
  if (Number(res.cscode) === 0 && quill.value) {
    const length = quill.value?.getSelection().index
    quill.value.insertEmbed(length, 'image', res.data.file_name)
    quill.value.setSelection(length + 1)
  }
  myImage.value?.clearFiles()
}

// 人机验证过期操作，现在有问题，后续再操作
const recaptchaExpired = (recaptchaRef: any) => {
  vueRecaptchaRef.value.reset()
}

const editorOption = {
  theme: 'snow',
  modules: {
    toolbar: {
      container: [
        ['upload', 'bold', 'italic'],
        ['image'], // 加粗 斜体 下划线 删除线
      ],
      handlers: {
        image(value: any) {
          if (value) {
            // 触发input框选择图片文件
            document.querySelector('.uploadImage input')?.click()
          } else {
            quill.value?.format('image', false)
          }
        },
        upload(value: any) {
          if (value) {
            document.querySelector('.uploadFile input')?.click()
          }
        },
      },
    },
  },
  placeholder: formData.message.placeholder,
}
const serverUrl = useRuntimeConfig().public.API_TICKET + '/file/upload?lang=' + locale
const quill = ref(null)
const quillLoading = ref(false)
const initQuill = () => {
  const interval = setInterval(() => {
    if (window.Quill) {
      // this.$store.commit('SET_QUILL_LOAING', true)
      quillLoading.value = true
      clearInterval(interval)
      quill.value = new window.Quill('#editor', editorOption)
      const uploadDom = document.getElementsByClassName('ql-upload')?.[0]
      if (uploadDom) uploadDom.innerHTML = `<i class="iconfont-sg icon-upload-n"></i>`
      const boldDom = document.getElementsByClassName('ql-bold')?.[0]
      if (boldDom) boldDom.innerHTML = `<i class="iconfont-sg icon-bold-n"></i>`
      const italicDom = document.getElementsByClassName('ql-italic')?.[0]
      if (italicDom) italicDom.innerHTML = `<i class="iconfont-sg icon-italic-n"></i>`
      const imageDom = document.getElementsByClassName('ql-image')?.[0]
      if (imageDom) imageDom.innerHTML = `<i class="iconfont-sg icon-image-n"></i>`
    }
  }, 1000)
}
const requireQuill = () => {
  if (quillLoading.value) {
    initQuill()
  } else {
    window.__lc = {}
    window.lc = document.createElement('script')
    window.lc.type = 'text/javascript'
    window.lc.async = true
    window.lc.src = 'https://c.dvdfab.cn/quill/vue_quill_editor.js'
    window.s = document.getElementsByTagName('script')[0]
    window.s.parentNode.appendChild(window.lc, window.s)
    initQuill()
  }
}
const getValidateCode = (value: string) => {
  showRecaptureErrTips.value = false
  formData.recaptcha = value
}
const selectProblemType = (problemId: string) => {
  const { options, value: problemValue } = formData.problem || []
  if (options.length > 0) {
    for (let i = 0; i < options.length; i++) {
      if (options[i]?.id === problemId && options[i]?.sub) {
        formData.purchaseProblem.options = options[i]?.sub
        formData.purchaseProblem.value = ''
        return true
      }
    }
  }
  formData.purchaseProblem.options = []
}

onMounted(() => {
  requireQuill()
})
const bgImg = computed(() => `url(${useImgPath().value}/cn/contact/bg_img.png) no-repeat center center`)
// 设置头部信息
useHead({
  link: [
    {
      rel: 'preload',
      href: `${useImgPath().value}/cn/contact/bg_img.png`,
      as: 'image',
    },
    { rel: 'stylesheet', href: 'https://c.dvdfab.cn/quill/vue_quill_editor.css' },
  ],
})
</script>

<template>
  <div class="contact-page flex-center pt80 pb80">
    <BaseContainer>
      <div class="header">
        <h1 class="text-center" v-html="pageInfo.title"></h1>
        <p class="desc text-center pt20" v-html="pageInfo.desc"></p>
        <!-- 需要注意修改 -->
        <p
          v-if="localesMap.contact_holiday === 'true'"
          class="holiday-content"
          v-html="localesMap.rest_notices"
        ></p>
      </div>
      <div class="content p40">
        <div class="title mb24" v-html="pageInfo.contentTitle"></div>
        <el-form
          id="contact-form"
          ref="formRef"
          class="contact-form"
          :rules="rules"
          :label-position="'top'"
          label-width="auto"
          :size="'small'"
          :model="formData"
        >
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item prop="email.value" :label="formData.email.label">
                <el-input
                  v-model="formData.email.value"
                  :size="'small'"
                  :placeholder="formData.email.placeholder"
                  @change="formatEmailInput"
                />
              </el-form-item>
              <el-form-item class="no-required" prop="fullname.value" :label="formData.fullname.label">
                <el-input
                  v-model.trim="formData.fullname.value"
                  :placeholder="formData.fullname.placeholder"
                />
              </el-form-item>
              <el-form-item prop="subject.value" :label="formData.subject.label">
                <el-input v-model="formData.subject.value" :placeholder="formData.subject.placeholder" />
              </el-form-item>
              <!--产品线-->
              <el-form-item prop="productLine.value" :label="formData.productLine.label" class="OS">
                <el-select
                  v-model="formData.productLine.value"
                  :placeholder="formData.productLine.placeholder"
                >
                  <el-option
                    v-for="item in formData.productLine.options"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
              <!--主问题类型-->
              <el-form-item prop="problem.value" :label="formData.problem.label" class="OS">
                <el-select
                  v-model="formData.problem.value"
                  :placeholder="formData.problem.placeholder"
                  @change="selectProblemType(formData.problem.value)"
                >
                  <el-option
                    v-for="item in formData.problem.options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <!--子问题类型-->
              <el-form-item prop="purchaseProblem.value" :label="formData.purchaseProblem.label">
                <el-select
                  v-model="formData.purchaseProblem.value"
                  :placeholder="formData.purchaseProblem.placeholder"
                >
                  <el-option
                    v-for="item in formData.purchaseProblem.options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :label="formData.message.label"
                :class="{ error: showMessageErrTips }"
                class="text-editor w-full relative is-required"
              >
                <div id="editor" ref="textEditor" name="textEditor"></div>
                <div
                  v-if="showMessageErrTips"
                  class="form-item-error-tips position-initial"
                  v-html="localesMap.required_tip"
                ></div>
                <el-upload
                  ref="myImage"
                  class="uploadImage"
                  accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF"
                  :action="serverUrl"
                  :before-upload="beforeImgUpload"
                  name="file"
                  :on-success="handleImgSuccess"
                />
                <el-upload
                  ref="myUpload"
                  :show-file-list="true"
                  :on-success="handleFileSuccess"
                  :before-upload="beforeUpload"
                  name="file"
                  type="drag"
                  :action="serverUrl"
                  class="uploadFile"
                />
                <div class="w-full relative">
                  <vueRecaptcha
                    ref="vueRecaptchaRef"
                    class="w-full"
                    sitekey="6LdPc3cjAAAAAIK0OsjuzPgIsXIxUUjF-iLv5cn8"
                    @expire="recaptchaExpired"
                    @verify="(val: string) => getValidateCode(val)"
                  />
                  <!-- <div
                    v-if="showRecaptureErrTips"
                    class="form-item-error-tips"
                    v-html="localesMap.required_tip"
                  ></div> -->
                </div>
              </el-form-item>
              <el-form-item class="w-full">
                <my-button tag="div" size="medium" :label="localesMap.submit" @click="submitForm()" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="footer">
        <div class="tips-row mb24">
          <span class="icon-bg green">
            <i class="iconfont-sg icon-bell-outlined"></i>
          </span>
          <p v-html="localesMap.service_tip"></p>
        </div>
        <div class="tips-row">
          <span class="icon-bg blue">
            <i class="iconfont-sg icon-mail-outlined"></i>
          </span>
          <p v-html="localesMap.email"></p>
        </div>
        <div v-if="locale === 'en'" class="tips-row mt24">
          <span class="icon-bg green">
            <i class="iconfont-sg icon-bell-outlined"></i>
          </span>
          <p v-html="localesMap.office_tip"></p>
        </div>
      </div>
    </BaseContainer>
    <el-dialog v-model="messageAlert" style="text-align: center">
      <img
        width="60"
        height="60"
        :src="`https://images1.dvdfab.cn/images/contact/${isSubSuccess ? 'icon_success' : 'icon_fail'}.png`"
        class="contact-tip-icon"
      />
      <h5 v-html="isSubSuccess ? localesMap.sub_success : localesMap.sub_fail" class="contact-tip-title"></h5>
      <span v-html="alertInfo" class="dialog-text"></span>
    </el-dialog>
  </div>
</template>
<style lang="less">
.contact-form {
  @border-color: #c4e1eb;
  @border-color-error: #ff5d5d;
  .ql-snow {
    width: 100%;
    &.ql-toolbar {
      border: 1px solid @border-color;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    &.ql-container {
      border: 1px solid @border-color;
      border-top: 0;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
  .error .ql-snow {
    &.ql-toolbar {
      border-color: @border-color-error;
      border-bottom-color: @border-color;
    }
    &.ql-container {
      border-color: @border-color-error;
    }
  }
  .ql-container {
    height: 88px;
  }
  .ql-snow.ql-toolbar .ql-upload,
  .ql-snow.ql-toolbar .ql-bold,
  .ql-snow.ql-toolbar .ql-italic,
  .ql-snow.ql-toolbar .ql-italic {
    width: 34px;
  }
  .ql-editor {
    padding: 8px 12px;
    &.ql-blank::before {
      left: 12px;
      font-style: normal;
      color: @text-gray-color;
    }
    p {
      font-size: @font-size-sm;
      color: @base-text-color;
    }
  }

  .download_link {
    text-decoration: underline;
    margin: 2px;
    padding: 2px;
    background: #f1f1f1;
    border: 1px solid #faeded;
    border-radius: 4px;
  }
  .ql-toolbar.ql-snow {
    padding-left: 5px;
    .ql-formats {
      margin-right: 0;
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #808897;
        &:hover {
          color: @btn-primary-color;
        }
      }
    }
  }
  /* 整体滚动条 */
  ::-webkit-scrollbar {
    width: 6px; /* 滚动条宽度 */
  }

  /* 滚动条轨道 */
  ::-webkit-scrollbar-track {
    background: #f1f1f1; /* 轨道背景颜色 */
    border-radius: 4px;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    background: @text-gray-color; /* 滑块背景颜色 */
    border-radius: 3px; /* 圆角 */
    cursor: pointer;
  }

  /* 鼠标悬停在滑块上 */
  ::-webkit-scrollbar-thumb:hover {
    background: #555; /* 悬停时滑块背景颜色 */
  }

  /* 滚动条角落，即两个滚动条相交的地方 */
  ::-webkit-scrollbar-corner {
    background: #f1f1f1; /* 角落背景颜色 */
  }
}
</style>

<style lang="less" scoped>
@error-tips-top: 2px;
:deep(.el-form) {
  .el-row .el-col {
    display: flex;
    gap: 24px;
    width: 100%;
    flex-wrap: wrap;
    .el-form-item {
      flex-shrink: 0;
      width: calc((100% - 24px) / 2);
      margin-bottom: 0;
      &.w-full {
        width: 100%;
      }
    }
  }
  .el-form-item.is-error {
    .el-input__wrapper,
    .el-select__wrapper {
      box-shadow: 0 0 0 1px #ff5d5d;
      &:hover {
        box-shadow: 0 0 0 1px #ff5d5d;
      }
    }
  }
  .el-select__wrapper,
  .el-input__wrapper {
    box-shadow: 0 0 0 1px #c4e1eb;
  }
  .el-input__wrapper {
    &:hover,
    &.is-focused {
      box-shadow: 0 0 0 0.0625rem @primary-color;
    }
  }
  .el-select__wrapper {
    &:hover,
    &.is-focused {
      box-shadow: 0 0 0 0.0625rem @primary-color;
    }
    &.is-hovering:not(.is-focused) {
      box-shadow: 0 0 0 0.0625rem @primary-color;
    }
  }
  .el-form-item__error {
    padding-top: @error-tips-top;
    line-height: @base-line-height;
  }
}
:deep(.el-popper) {
  .el-scrollbar {
    box-shadow: 0px 6px 20px 0px rgba(13, 53, 68, 0.1);
    border-radius: 8px;
  }
}

.form-item-error-tips {
  position: absolute;
  left: 0;
  top: 100%;
  padding-top: @error-tips-top;
  color: var(--el-color-danger);
  font-size: 12px;
  line-height: @base-line-height;
  &.position-initial {
    position: initial;
  }
}
.contact-page {
  background-color: @bg-base-color;
  background: v-bind(bgImg);
  background-size: cover;
  overflow: hidden;
  .header {
    margin: 0 auto;
    width: 860px;
  }
  .desc {
    font-size: @font-size-md-s;
    line-height: @base-line-height;
  }
  .holiday-content {
    margin-top: 40px;
    padding: 40px;
    font-size: 18px;
    line-height: 1.8;
    background: #ffffff;
    border-radius: 12px;
  }
  .content {
    margin: 0 auto;
    margin-top: 40px;
    width: 860px;
    background: #ffffff;
    border-radius: 12px;
    .title {
      font-size: 24px;
      font-weight: bold;
      line-height: 32px;
    }
    :deep(.text-editor) {
      .el-form-item__content {
        display: block;
        line-height: 0;
      }
      .uploadImage,
      .uploadFile {
        font-size: 0;
      }
      .el-upload-list {
        margin: 12px 0;
        .el-upload-list__item-info {
          margin: 10px 0;
          width: 100%;
        }
        .el-upload-list__item .el-progress__text {
          top: -15px;
          width: fit-content;
          min-width: auto;
        }
      }
    }
  }
  .footer {
    margin: 0 auto;
    margin-top: 40px;
    width: 860px;
    .tips-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .icon-bg {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      &.green {
        background: rgba(75, 193, 98, 0.1);
        i {
          color: #4bc162;
        }
      }
      &.blue {
        background: rgba(0, 169, 240, 0.1);
        i {
          color: @primary-color;
        }
      }
      i {
        font-size: 20px;
      }
    }
    p {
      color: @text-gray-color;
    }
  }
  .contact-tip-icon {
    width: 60px;
    height: 60px;
    margin: auto;
  }
  .contact-tip-title {
    font-size: 24px;
    font-family: Quicksand;
    font-weight: bold;
    color: #3b5159;
    margin-top: 30px;
    margin-bottom: 15px;
  }
  :deep(#contact-form) {
    @formItemHeight: 40px;
    .el-input {
      --el-input-height: @formItemHeight;
      .el-input__wrapper {
        padding-left: 12px;
        padding-right: 12px;
      }
    }
    .el-select__wrapper {
      min-height: @formItemHeight;
      line-height: @formItemHeight;
      padding-left: 12px;
      padding-right: 12px;
    }
    .el-form-item__label {
      margin-bottom: 10px;
      font-size: @font-size-xs;
      color: @text-gray-color;
      line-height: 20px;
    }
  }
}

@media (max-width: 1200px) {
  .container {
    max-width: 100%;
    .header,
    .footer {
      width: 100%;
    }
    .content {
      padding: 20px;
      width: 100%;
      :deep(.el-form) .el-col {
        flex-direction: column;
        .el-form-item {
          width: 100%;
        }
      }
    }
  }
}
@media (max-width: 640px) {
  .contact-page :deep(.el-dialog) {
    width: 90%;
  }
}
</style>
<style lang="less">
.contact-page {
  .el-dialog {
    border-radius: 10px !important;
    width: 597px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__headerbtn {
    top: 6px;
    right: 10px;
    .el-dialog__close {
      font-size: 18px;
    }
  }
  .el-dialog__headerbtn .el-dialog__close:hover {
    color: #ff5353;
  }
  .el-dialog__body {
    padding: 60px 48px 60px 48px;
    color: #333;
  }

  .el-form-item.is-error {
    .el-input__wrapper .el-form-item__label:before {
      content: '*';
      color: #ff5d5d;
      margin-right: 4px;
    }
    &.no-required .el-input__wrapper .el-form-item__label:before {
      content: '';
    }
  }
  .el-select__caret.el-select__icon {
    svg {
      display: none;
    }
    position: relative;
    width: 9px; /* 容器宽度 */
    height: 5px; /* 容器高度 */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      border-left: 4.8px solid transparent; /* 左边透明 */
      border-right: 4.8px solid transparent; /* 右边透明 */
      border-top: 5.6px solid #808897; /* 上边为黑色，形成三角形 */
      border-radius: 2px; /* 圆角半径 */
      transform: perspective(10px) rotateX(5deg); /* 调整以更好地显示圆角 */
    }
  }
  .dialog-text {
    word-break: break-word;
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 30px;
    a {
      color: #00a9f0;
    }
  }
}

@media (min-width: 960px) {
  .contact-page {
    .content {
      .sub-con-inner {
        margin-left: 0;
      }
    }
  }
}
</style>
