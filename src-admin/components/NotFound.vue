<template>
  <div class="notFound">
    <a-row
      class="content"
      vertical
      align-center
    >
      <div class="logo">
        <slot />
      </div>

      <a-row
        vertical
        align-center
      >
        <div class="mt-0">
          {{ title || '404 - Not Found' }}
        </div>

        <div class="mt-4">
          <router-link :to="backlink || { path: '/'}">
            {{ backlinkTitle || 'Zurück' }}
          </router-link>
        </div>
      </a-row>
    </a-row>
  </div>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  name: 'adminNotFound',
  props: ['title', 'backlink', 'backlinkTitle']
})
export default class NotFound extends Vue {
  created () {
    this.$parent.$emit('appLoaded')
  }
}
</script>

<style lang="scss" scoped>
.notFound {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.content {
  position: absolute;
  top: 50%;
  left: 50%;
  min-height: 50vh;
  transform: translate(-50%, -50%);
}

.logo {
  margin-bottom: 2rem;
}
</style>
