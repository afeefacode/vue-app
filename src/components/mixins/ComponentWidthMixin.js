import { Component, Vue } from '@a-vue'

@Component({
  props: ['maxWidth', 'width']
})
export class ComponentWidthMixin extends Vue {
  cwm_maxWidth_ = null
  cwm_width_ = null

  get cwm_width () {
    let width = this.width || this.cwm_width_

    if (width) {
      if (!isNaN(width)) {
        width = width + 'px'
      }
      return width
    }
  }

  get cwm_maxWidth () {
    let maxWidth = this.maxWidth || this.cwm_maxWidth_

    if (maxWidth) {
      if (!isNaN(maxWidth)) {
        maxWidth = maxWidth + 'px'
      }
      return maxWidth
    }
  }

  get cwm_widthStyle () {
    const styles = []

    let width = this.width || this.cwm_width_

    if (width) {
      if (!isNaN(width)) {
        width = width + 'px'
      }
      styles.push(`width: ${width};`)
    }

    let maxWidth = this.maxWidth || this.cwm_maxWidth_

    if (maxWidth) {
      if (!isNaN(maxWidth)) {
        maxWidth = maxWidth + 'px'
      }
      styles.push(`max-width: ${maxWidth};`)
    }

    return styles.join(' ')
  }
}
