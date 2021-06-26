<template>
  <v-app>
    <v-container
      fill-height
      fluid
      pb-0
      d-flex
      align-center
      justify-center
    >
      <div>
        <div class="logo">
          <slot />
        </div>

        <v-row
          align="center"
          justify="center"
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
        </v-row>
      </div>
    </v-container>
  </v-app>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

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
.logo {
  margin-bottom: 2rem;
}

.container {
  transform: translateY(-10%);
}
</style>
