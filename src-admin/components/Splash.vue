<template>
  <v-app class="splash">
    <a-row
      vertical
      center
      class="content"
    >
      <div class="logo">
        <slot />
      </div>

      <a-row
        vertical
        center
        width="100%"
      >
        <v-progress-linear
          :size="45"
          :width="6"
          indeterminate
          :color="color || 'green'"
        />

        <div class="mt-4">
          {{ title || 'Lade App ...' }}
        </div>
      </a-row>
    </a-row>
  </v-app>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['title', 'color']
})
export default class Splash extends Vue {
  destroyed () {
    this.$el.parentNode.removeChild(this.$el)
  }
}
</script>

<style lang="scss" scoped>
.splash {
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
