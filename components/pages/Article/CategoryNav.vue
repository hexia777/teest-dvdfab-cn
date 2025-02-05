<script setup>
const props = defineProps({
  blockClass: {
    type: Object,
    default: () => {
      return { value: 'no-bg' }
    },
  },
  pathPrefix: {
    type: String,
    default: '/resource',
  },
  categories: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="resource-nav">
    <BaseContainer>
      <nav class="category-nav block-box" :class="blockClass.value">
        <ul class="category-list">
          <li v-for="(category, index) in categories" :key="index" class="category-item">
            <div class="flex-center gap2">
              <a :href="category.url" class="category-name">{{ category.name }}</a>
              <span class="iconfont-warp">
                <i
                  v-if="category.subcategories && category.subcategories.length > 0"
                  class="iconfont-sg icon-caret-down"
                >
                </i>
                <ul
                  v-if="category.subcategories && category.subcategories.length > 0"
                  class="subcategory-list"
                >
                  <li
                    v-for="(subcategory, subIndex) in category.subcategories"
                    :key="subIndex"
                    class="subcategory-item"
                  >
                    <a :href="subcategory.url">
                      {{ subcategory.name }}
                    </a>
                  </li>
                </ul>
              </span>
            </div>
          </li>
        </ul>
      </nav>
    </BaseContainer>
  </div>
</template>

<style lang="less" scoped>
.resource-nav {
  background: #fff;
}
.category-nav {
  padding: 24px 0;

  .category-list {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;

    .category-item {
      position: relative;
      cursor: pointer;
      font-size: @font-size;
      font-weight: 700;
      line-height: 28px;
      @subCateGap: 4px;
      .iconfont-warp {
        display: inline-block;
        height: 100%;
        font-size: 16px;
        line-height: 5px;
        &:hover {
          i {
            color: @link-text-color-h;
            transform: rotate(180deg);
          }
          .subcategory-list {
            display: flex;
          }
        }
      }
      i {
        position: relative;
        display: inline-block;
        padding: 6px;
        font-size: 10px;
        line-height: 1;
        transition: transform 0.2s ease-in-out;
        color: @base-text-color;
        &:after {
          display: inline-block;
          content: ' ';
          position: absolute;
          bottom: 100%;
          left: 0;
          width: 100%;
          height: 10px;
        }
      }
      .category-name {
        color: @base-text-color;
      }
      .category-name {
        &:hover {
          color: @link-text-color-h;
        }
      }

      .category-name {
        font-size: 1rem;
      }

      .subcategory-list {
        position: absolute;
        top: calc(100% + @subCateGap);
        left: 0;
        min-width: 180px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        display: none;
        z-index: 1;
        padding: 12px;
        font-weight: normal;
        cursor: default;
        gap: 8px;
        flex-direction: column;

        .subcategory-item {
          font-size: @font-size-sm;
          line-height: @base-line-height;
          color: @base-text-color;
          cursor: pointer;
          white-space: nowrap;
          a {
            display: block;
            width: 100%;
            height: 100%;
          }

          &:hover a {
            color: @link-text-color-h;
          }
        }
      }
    }
  }
}
</style>
