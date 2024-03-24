<template>
  <div :class="['a-category', {dark: theme === 'dark'}]">
    <div
      class="border"
      :style="{background: borderColor}"
    />

    <div
      :class="['content', {hasRemove: $has.remove}]"
      :title="category.title"
    >
      <div
        v-for="parentCategory in parentCategories"
        :key="parentCategory.id"
        class="parent"
      >
        {{ parentCategory.title }}
      </div>

      <div>{{ category.title }}</div>
    </div>

    <div
      v-if="$has.remove"
      class="remove"
    >
      <a-icon
        small
        class="iconButton"
        @click="$emit('remove')"
      >
        $closeCircleIcon
      </a-icon>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['category', 'theme', 'color']
})
export default class ACategory extends Vue {
  $hasOptions = [{remove: false}]

  get borderColor () {
    return this.color || this.category.color || 'gray'
  }

  get parentCategories () {
    const parents = []
    let parent = this.category.parent
    while (parent) {
      parents.unshift(parent)
      parent = parent.parent
    }
    return parents
  }
}
</script>

<style lang="scss" scoped>
.a-category {
  background: white;
  white-space: nowrap;
  font-size: 1rem;
  display: flex;
  align-items: stretch;
  padding-right: .2rem;

  &.dark {
    background: #F6F6F6;
  }

  .border {
    flex: 0 0 5px;
  }

  .content {
    padding: .4rem .5rem;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    line-height: 1;
    color: rgba(0, 0, 0, .87);

    max-width: 200px;

    > * {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .parent {
      font-size: .8rem;
      color: #999999;
      line-height: 1;
    }

    &.hasRemove {
      padding-right: .5rem;
    }
  }

  .remove {
    align-self: center;
    margin-top: -.1rem;
    padding-right: .6rem;
  }
}
</style>
