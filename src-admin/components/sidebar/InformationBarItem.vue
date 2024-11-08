<template>
  <div class="informationBarItem">
    <div
      :class="['item', infoItemId, {expanded, rail}]"
      :style="{width}"
    >
      <div class="headerContainer">
        <div class="header">
          <v-icon
            v-if="icon"
            :color="icon.color"
            size="2rem"
            :title="label"
            @click="derail"
          >
            {{ icon.icon }}
          </v-icon>

          <div
            v-else
            class="iconPlaceholder"
          />

          <template v-if="!rail">
            <div
              class="labelContainer"
              @click="derail"
            >
              <div class="label">
                {{ label }}
              </div>
            </div>

            <v-icon
              class="contextButton expand mt-n1"
              @click="derail"
            >
              {{ expanded ? '$caretDownIcon' : '$caretRightIcon' }}
            </v-icon>

            <div v-if="expanded">
              <slot name="actionButton" />
            </div>
          </template>
        </div>
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
      width: '100%',
      open: false,
      prepend: false
    }
  ]
})
export default class InformationBarItem extends Vue {
  infoItemId = randomCssClass(10)
  rail = sidebarService.informationRailed
  expanded = !this.rail && this.open
  isCreated = false

  created () {
    this.$events.on(SidebarEvent.STATUS, this.railChanged)
  }

  mounted () {
    const container = this.getSidebarContainer()
    if (this.prepend) {
      container.prepend(this.getContent())
    } else {
      container.append(this.getContent())
    }
  }

  destroyed () {
    const container = this.getSidebarContainer()
    const el = this.getContent()
    if (container.contains(el)) {
      container.removeChild(el)
    }

    this.$events.off(SidebarEvent.STATUS, this.railChanged)
  }

  railChanged ({payload: {informationRailed}}) {
    if (this.rail === informationRailed) {
      return
    }

    this.rail = informationRailed

    if (!this.rail) { // derailed
      if (!this.isCreated) { // open only the first time not after subsequent derailing
        this.expanded = this.open
      }
    }

    this.isCreated = true
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

.headerContainer {
  width: 100%;
  line-height: 0; // kill inline-flex space
}

.header {
  display: inline-flex;
  align-items: center;
  font-size: .8rem;
  line-height: 1.5; // end kill inline-flex space
  max-width: 100%;

  > .v-icon {
    margin-right: .75rem;
    cursor: pointer;
  }

  .labelContainer {
    overflow: hidden;
    cursor: pointer;
  }

  .label {
    display: block;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: #666666;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    .label {
      color: #333333;
    }

    .v-icon.expand {
      color: #333333 !important;
    }
  }
}

.content {
  border-top: 2px solid #EEEEEE;
  font-size: .9rem;

  margin: .25rem -1.5rem;
  padding: 1rem 1.5rem;
}
</style>
