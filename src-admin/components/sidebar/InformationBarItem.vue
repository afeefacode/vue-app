<template>
  <div class="informationBarItem">
    <div
      :class="['item', infoItemId, {expanded, rail}]"
      :style="{width}"
    >
      <div
        class="header"
        @click="derail"
      >
        <v-icon
          :color="icon.color"
          size="2rem"
        >
          {{ icon.icon }}
        </v-icon>

        <template v-if="!rail">
          <label class="label">{{ label }}</label>

          <v-icon class="contextButton mt-n1">
            {{ expanded ? '$caretDownIcon' : '$caretRightIcon' }}
          </v-icon>
        </template>
      </div>

      <collapse-transition>
        <div
          v-if="!rail && expanded"
          class="content"
        >
          <a-row
            vertical
            gap="6"
          >
            <slot />
          </a-row>
        </div>
      </collapse-transition>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { randomCssClass } from '@a-vue/utils/random'
import { sidebarService } from './SidebarService'
import { SidebarEvent } from '@a-admin/events'

@Component({
  props: [
    'icon',
    'label',
    {
      top: true,
      bottom: false,
      width: 'auto',
      open: false
    }
  ]
})
export default class InformationBarItem extends Vue {
  infoItemId = randomCssClass(10)
  rail = sidebarService.informationRailed
  expanded = !this.rail && this.open

  created () {
    this.$events.on(SidebarEvent.STATUS, ({payload: {informationRailed}}) => this.railChanged(informationRailed))
  }

  mounted () {
    const container = this.getSidebarContainer()
    container.appendChild(this.getContent())
  }

  destroyed () {
    const container = this.getSidebarContainer()
    const el = this.getContent()
    if (container.contains(el)) {
      container.removeChild(el)
    }
  }

  railChanged (rail) {
    if (this.rail === rail) {
      return
    }

    this.rail = rail

    if (!this.rail) {
      this.expanded = false
    }
  }

  derail () {
    const railed = this.rail

    sidebarService.setRailInformation(false)

    if (railed) {
      this.expanded = true
    } else {
      this.expanded = !this.expanded
    }
  }

  getContent () {
    return document.querySelector('.' + this.infoItemId)
  }

  getSidebarContainer () {
    return document.querySelector('#information-bar__children > .' + this.position)
  }

  get position () {
    if (this.bottom) {
      return 'bottom'
    } else {
      return 'top'
    }
  }
}
</script>


<style lang="scss" scoped>
.item {
  min-width: 100%;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  &.rail {
    margin-bottom: .5rem;
  }
}

.header {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  font-size: .8rem;
  cursor: pointer;

  > .v-icon {
    margin-right: .75rem;
  }

  .label {
    display: block;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: #666666;
    cursor: pointer;
  }

  &:hover {
    label {
      color: #333333;
    }

    .v-icon.contextButton {
      color: #333333 !important;
    }
  }
}

.content {
  border-top: 2px solid #EEEEEE;
  font-size: .9rem;

  margin: .5rem -1.5rem;
  padding: .5rem 1rem;
}
</style>
