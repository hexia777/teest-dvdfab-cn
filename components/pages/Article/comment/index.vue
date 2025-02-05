<!-- eslint-disable max-len -->
<script setup lang="ts">
// 设置头部信息
useHead({
  script: [
    {
      src: `https://challenges.cloudflare.com/turnstile/v0/api.js`,
      async: true,
      defer: true,
      tagPriority: 9999,
    },
  ],
})
const $t = useI18n().value
const formData = reactive({
  name: {
    label: $t.article.comments_form_label_1,
    value: '',
    placeholder: $t.article.comments_form_label_1,
  },
  email: {
    label: $t.article.comments_form_label_2,
    value: '',
    placeholder: $t.article.comments_form_label_2,
  },
  content: {
    label: $t.article.comments_form_label_3,
    value: '',
    placeholder: $t.article.comments_form_placeholder_3,
  },
})
const localesMap = {
  required_tip: $t.common.field_required,
  valid_email: $t.common.invalid_email,
  respond_tip: $t.common.submit_success,
  fail: $t.common.submit_failed,
  submit: $t.common.submit,
}
const rules = reactive({
  'name.value': [
    {
      required: true,
      message: localesMap.required_tip || '',
      trigger: 'blur',
    },
  ],
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
  'content.value': [
    {
      required: true,
      message: localesMap.required_tip || '',
      trigger: 'blur',
    },
  ],
  recaptcha: [
    {
      required: true,
      message: localesMap.required_tip || '',
    },
  ],
})

const formRef = ref(null) as any
const recaptureErrTips = ref('') // 验证码错误提示
const submitResult = ref({ status: 0, msg: '' }) // 提交结果

const formatEmailInput = (value: string) => {
  if (value) {
    formData.email.value = value.replace(/(^\s*)|(\s*$)/g, '')
  }
}
const recaptchaExpired = () => {
  window.turnstile.reset()
}

const submitForm = () => {
  formRef.value?.validate((valid: boolean) => {
    const turnstile = (window as any).turnstile
    // 提交成功后刷新验证码
    if (valid) {
      if (turnstile.getResponse() === undefined) {
        recaptureErrTips.value = localesMap.required_tip
        // 定时循环检测验证码是否校验成功
        const intervalRecapture = setInterval(() => {
          if (turnstile.getResponse()) {
            recaptureErrTips.value = ''
            clearInterval(intervalRecapture)
          }
        }, 1000)
        return
      } else {
        recaptureErrTips.value = ''
      }
      const fdata = {
        locale: useStore.common().locale,
        url: window.location.pathname,
        email: formData.email.value,
        name: formData.name.value,
        content: formData.content.value,
        recaptcha: turnstile.getResponse(),
      } as any

      useApi()
        .apiComment.addCommentData(fdata)
        .then((response: any) => {
          recaptchaExpired()
          const result = response.data?.value || {}
          if (Number(result.cscode) === 200) {
            submitResult.value = { status: 1, msg: $t.article.comments_success }
            // 清空表单
            formData.name.value = ''
            formData.email.value = ''
            formData.content.value = ''
          } else if (Number(result.cscode) === 10010) {
            // 验证码失效
            recaptureErrTips.value = $t.common.recaptcha_error
          } else {
            submitResult.value = { status: 0, msg: $t.common.submit_failed }
          }
          setTimeout(() => {
            submitResult.value = { status: 0, msg: '' } // 10秒后清空提示
          }, 1000 * 10)
          return result
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e)
        })
        .finally(() => {
          recaptchaExpired()
        })
    } else {
      return false
    }
  })
}
// 获取评论列表
const commentList = ref([])
const getCommentData = () => {
  useApi()
    .apiComment.getCommentData({
      locale: useStore.common().locale,
      '[filters][url][$eq]': window.location.pathname,
      '[filters][isChecked][$eq]': true,
    })
    .then((response: any) => {
      const result = response.data?.value || []
      if (result.data && result.data.length) {
        commentList.value = result.data || []
      }
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e)
    })
}

onMounted(() => {
  nextTick(() => {
    getCommentData()
  })
})
// emoji 暂时不上线
// interface emojiModel {
//   emoji: string
//   title: string
//   num: number
// }
// const emojiData: emojiModel[] = [
//   {
//     emoji: '👍',
//     title: 'Upvote',
//     num: 0,
//   },
//   {
//     emoji: '😝',
//     num: 0,
//     title: 'Funny',
//   },
//   {
//     emoji: '😍',
//     num: 0,
//     title: 'Love',
//   },
//   {
//     emoji: '😲',
//     num: 0,
//     title: 'Surprised',
//   },
//   {
//     emoji: '😤',
//     num: 0,
//     title: 'Angry',
//   },
//   {
//     emoji: '😥',
//     num: 0,
//     title: 'Sad',
//   },
// ]
</script>

<template>
  <div class="comment-block mt20">
    <!-- emoji-block 先不上线 -->
    <!-- <div class="emoji-block">
      <div v-for="(item, index) in emojiData" :key="'emoji' + index" class="emoji-item">
        <div class="emoji pos-relative w-72">
          <div v-html="item.emoji"></div>
        </div>
        <div class="emoji-num">{{ item.num }}</div>
        <div class="emoji-title" v-html="item.title"></div>
      </div>
    </div> -->
    <div class="header-form text-center">
      <div class="title" v-html="$t.article.comments_title"></div>
      <div class="desc" v-html="$t.article.comments_desc"></div>
    </div>
    <div class="comment-form-block">
      <el-form
        id="comment-form"
        ref="formRef"
        class="comment-form"
        :rules="rules"
        :label-position="'top'"
        label-width="auto"
        :size="'small'"
        :model="formData"
      >
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item prop="name.value" :label="formData.name.label">
              <el-input v-model="formData.name.value" :placeholder="formData.name.placeholder" />
            </el-form-item>
            <el-form-item prop="email.value" :label="formData.email.label">
              <el-input
                v-model.trim="formData.email.value"
                :size="'small'"
                :placeholder="formData.email.placeholder"
                @change="formatEmailInput"
              />
            </el-form-item>
            <el-form-item class="w-full" prop="content.value" :label="formData.content.label">
              <el-input
                v-model="formData.content.value"
                type="textarea"
                :rows="3"
                :placeholder="formData.content.placeholder"
              />
            </el-form-item>
            <el-form-item>
              <div class="w-full">
                <div
                  class="cf-turnstile"
                  data-sitekey="0x4AAAAAAA5icpxUllrMLnmE"
                  data-expired-callback="recaptchaExpired"
                  data-response-field-nam="recaptcha"
                ></div>
                <div
                  v-if="recaptureErrTips"
                  class="el-form-item__error"
                  style="position: relative; top: 0"
                  v-html="recaptureErrTips"
                ></div>
              </div>
            </el-form-item>
            <el-form-item v-if="submitResult.msg" class="w-full submit-result-item">
              <div
                class="submit-result"
                :class="{ error: submitResult.status === 0, success: submitResult.status === 1 }"
                v-html="submitResult.msg"
              ></div>
            </el-form-item>
            <el-form-item class="w-full btn-block">
              <my-button
                tag="div"
                size="medium"
                :show-icon="false"
                :label="localesMap.submit"
                @click="submitForm()"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
  <div v-if="commentList.length" class="mt20">
    <PagesArticleCommentList :comment-list="commentList" />
  </div>
</template>
<style lang="less" scoped>
// .emoji-block 先不上线
// .emoji-block {
//   position: relative;
//   display: flex;
//   justify-content: center;
//   gap: 60px;
//   text-align: center;
//   .emoji-item {
//     display: flex;
//     flex-direction: column;
//   }
//   .emoji {
//     position: relative;
//     width: 42px;
//     height: 54px;
//     cursor: pointer;
//     & > div {
//       font-size: 42px;
//       position: absolute;
//       top: 50%;
//       left: 50%;
//       transform: translateX(-50%) translateY(-50%);
//     }
//   }
// }

@error-tips-top: 2px;
:deep(.el-form) {
  .el-row .el-col {
    display: flex;
    gap: 20px;
    width: 100%;
    flex-wrap: wrap;
    .el-form-item {
      flex-shrink: 0;
      width: calc((100% - 20px) / 2);
      margin-bottom: 0;
      &.w-full {
        width: 100%;
      }
    }
  }
  .el-form-item.is-error {
    .el-input__wrapper {
      box-shadow: 0 0 0 1px #ff5d5d;
      &:hover {
        box-shadow: 0 0 0 1px #ff5d5d;
      }
    }
  }
  .el-input__wrapper {
    padding-top: 8px;
    padding-bottom: 8px;
    box-shadow: 0 0 0 1px #c4e1eb;
  }
  .el-input__inner {
    height: 24px;
    line-height: 24px;
  }
  .el-input__wrapper {
    &:hover,
    &.is-focused {
      box-shadow: 0 0 0 0.0625rem @primary-color;
    }
  }
  .el-form-item__error {
    padding-top: @error-tips-top;
    line-height: @base-line-height;
  }
  .el-textarea__inner {
    padding: 12px;
  }
  .el-form-item .el-form-item__label {
    margin-bottom: 10px;
    font-size: @font-size-xs;
    color: @text-gray-color;
    line-height: 20px;
  }
  .btn-block .el-form-item__content {
    justify-content: center;
    padding-bottom: 10px;
  }

  .submit-result-item .el-form-item__content {
    justify-content: center;
  }
}
.submit-result {
  font-size: @font-size-sm;
}

.comment-block {
  padding: 20px;
  background: #fff;
  .header-form {
    .title {
      font-size: @font-size;
    }
    .desc {
      margin-top: 8px;
      color: @text-gray-color;
    }
  }
  .comment-form-block {
    margin: 30px auto 0;
  }
}
</style>
