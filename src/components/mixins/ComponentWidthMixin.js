import { Component, Vue } from '@a-vue'

@Component({
  props: ['maxWidth', 'width', 'popupWidth']
})
export class ComponentWidthMixin extends Vue {
  cwm_maxWidth_ = null
  cwm_width_ = null
  cwm_popupWidth_ = null

  get cwm_width () {
    return this.cwm_toPixel_(this.width || this.cwm_width_)
  }

  get cwm_maxWidth () {
    return this.cwm_toPixel_(this.maxWidth || this.cwm_maxWidth_)
  }

  get cwm_widthStyle () {
    return this.cwm_getWidthStyle_(
      this.width || this.cwm_width_,
      this.maxWidth || this.cwm_maxWidth_
    )
  }

  get cwm_popupWidthStyle () {
    return this.cwm_getWidthStyle_(this.popupWidth || this.cwm_popupWidth_ || this.width || this.cwm_width_)
  }

  cwm_toPixel_ (value) {
    if (value && !isNaN(value)) {
      return value + 'px'
    }
    return value
  }

  cwm_getWidthStyle_ (width, maxWidth) {
    const styles = []

    if (width) {
      styles.push(`width: ${this.cwm_toPixel_(width)};`)
    }

    if (maxWidth) {
      styles.push(`max-width: ${this.cwm_toPixel_(maxWidth)}; background: yellow`)
    }

    return styles.join(' ')
  }
}
