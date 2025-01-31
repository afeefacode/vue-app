<template>
  <a-row gap="4">
    <v-btn
      v-if="back"
      fab
      x-small
      color="#F4F4F4"
      title="Zurück"
      class="mr-n2"
      @click="goToLastNamedRoute()"
    >
      <v-icon>
        $arrowLeftIcon
      </v-icon>
    </v-btn>

    <v-icon
      :color="icon.color"
      size="3.5rem"
      v-text="icon.icon"
    />

    <div class="titleContainer ml-n1">
      <h3 v-if="subtitle">
        {{ subtitle }}
      </h3>
      <h2>{{ title }}</h2>
      <h3 v-if="detail">
        {{ detail }}
      </h3>
    </div>
  </a-row>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { routeConfigPlugin } from '@a-vue/plugins/route-config/RouteConfigPlugin'

@Component({
  props: ['back', 'icon', 'title', 'subtitle', 'detail']
})
export default class appBarTitle extends Vue {
  mounted () {
    const section = this.getButtonBar()
    section.appendChild(this.$el)
  }

  destroyed () {
    const section = this.getButtonBar()
    if (!section) { // already destroyed, test: navigate to not found view
      return
    }
    if (section.contains(this.$el)) {
      section.removeChild(this.$el)
    }
  }

  getButtonBar () {
    return document.getElementById('appBarTitleContainer')
  }

  goToLastNamedRoute () {
    const currentRouteName = this.$route.name
    const historyStack = routeConfigPlugin.getRouteHistory()

    // Durchlaufe die Historie rückwärts, um die letzte benannte Route zu finden, die sich vom aktuellen Namen unterscheidet
    for (let i = historyStack.length - 2; i >= 0; i--) {
      const route = historyStack[i]
      if (route.name && route.name !== currentRouteName) {
        this.$router.push({ name: route.name })
        routeConfigPlugin.removeFromRouteHistoryAfterIndex(i)
        return
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.titleContainer {
  overflow: hidden;
  margin-top: -.2rem;
}

h3 {
  font-size: .9rem;
  font-weight: normal;
  margin-bottom: .1rem;
  line-height: 1rem;
  color: #999999;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

h2 {
  font-size: 1.5rem;
  line-height: 1.7rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

h2 + h3 {
  color: #666666;
  font-size: 1rem;
}
</style>
