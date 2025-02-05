<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  moreLinkUrl: {
    type: String,
    default: '',
  },
  moreLinkText: {
    type: String,
    default: '',
  },
  accordion: {
    type: Boolean,
    default: false,
  },
  defaultExpandFaqs: {
    type: Array,
    default: () => [],
  },
  faqs: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})

const activeFaqs = ref<any>(props.defaultExpandFaqs)
watch(
  () => props.defaultExpandFaqs,
  (newVal) => {
    activeFaqs.value = newVal
  },
)
</script>

<template>
  <div>
    <h2 v-if="title" class="background-title">
      <span v-html="title"></span>
    </h2>
    <el-collapse v-if="faqs?.length" v-model="activeFaqs" class="drawer" :accordion="accordion">
      <el-collapse-item v-for="item in faqs" :key="item.id" :name="item.id" class="item">
        <template #title>
          <div class="drawer-header font-size-18">
            <a v-if="item.route_name" class="drawer-title drawer-link" :href="`/faq/${item.route_name}.htm`">
              <span class="prefix-q-icon"></span>
              <h2 class="font-size-18 line-height-28 text-left" v-html="item.title"></h2>
            </a>
            <div v-else class="drawer-title">
              <span class="prefix-q-icon"></span>
              <h2 class="font-size-18 line-height-28 text-left" v-html="item.title"></h2>
            </div>
            <!-- <i :class="getStatus(index)"></i> -->
          </div>
        </template>
        <div class="drawer-content">
          <span class="prefix-a-icon"></span>
          <div class="drawer-desc font-size-18 line-height-28" v-html="item.content"></div>
          <a v-if="item.route_name" class="content-link" :href="`/faq/${item.route_name}.htm`"></a>
        </div>
      </el-collapse-item>
    </el-collapse>
    <a v-if="moreLinkUrl" class="faq-more" :href="moreLinkUrl" v-html="moreLinkText"></a>
  </div>
</template>

<style lang="less" scoped>
.item {
  border-top: 1px solid #eeeeee;
  padding: 20px 32px;
}
.drawer-header {
  line-height: 1;

  .drawer-title {
    display: flex;
    align-items: flex-start;
    line-height: 32px;
  }
}
.drawer-content {
  display: flex;
  align-items: flex-start;
  position: relative;
  padding-top: 16px;
  .content-link {
    display: inline-block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}
.drawer-desc {
  // font-size: 18px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
.drawer-link {
  :hover {
    color: @primary-color;
  }
}
.prefix-q-icon:before,
.prefix-a-icon:before {
  color: #fff;
  width: 32px;
  height: 32px;
  font-size: 16px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 24px;
}
.prefix-q-icon:before {
  content: 'Q';
  background: @primary-color;
}
.prefix-a-icon:before {
  background: #ff9000;
  content: 'A';
}
:deep(.el-collapse-item__arrow) {
  display: none;
}
:deep(.el-collapse) {
  padding-top: none;
}
:deep(.el-collapse-item__header) {
  border-bottom: none;
  height: auto;
}

:deep(.el-collapse-item__wrap) {
  border-bottom: none;
  .el-collapse-item__content {
    padding: 0;
  }
}
</style>
