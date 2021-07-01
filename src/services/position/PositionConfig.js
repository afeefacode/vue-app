export class Positions {
  static START = 'start'
  static END = 'end'
  static CENTER = 'center'

  static AUTO_CORRECT_TYPE_FIT_INTO_TO_VIEW = 'fitIntoToView'
  static AUTO_CORRECT_TYPE_SCROLL_INTO_VIEW = 'scrollIntoView'
}

export class PositionConfig {
  anchor = null
  anchorElementQuery = null
  anchorX = Positions.CENTER
  anchorY = Positions.CENTER

  target = null
  targetElementQuery = null
  targetX = Positions.CENTER
  targetY = Positions.CENTER

  targetDiffX = 0
  targetDiffY = 0
  targetMargin = '1rem'

  alternativePositionX = null
  alternativePositionXTreshold = 0
  alternativePositionY = null
  alternativePositionYTreshold = 0
  autoCorrectType = Positions.AUTO_CORRECT_TYPE_FIT_INTO_TO_VIEW
  scrollIntoViewContentHeight = 0

  onPositionCallback = () => {}
  onAnchorElCallback = () => {}
  onTargetElCallback = () => {}

  setAnchor (anchor, query) {
    this.anchor = anchor
    this.anchorElementQuery = query
    return this
  }

  setAnchorIfNotExists (anchor, query) {
    if (!this.anchor) {
      this.anchor = anchor
      this.anchorElementQuery = query
    }
    return this
  }

  anchorLeft () {
    this.anchorX = Positions.START
    return this
  }

  anchorRight () {
    this.anchorX = Positions.END
    return this
  }

  anchorCenter () {
    this.anchorX = Positions.CENTER
    return this
  }

  anchorTop () {
    this.anchorY = Positions.START
    return this
  }

  anchorBottom () {
    this.anchorY = Positions.END
    return this
  }

  anchorMiddle () {
    this.anchorY = Positions.CENTER
    return this
  }

  setTarget (target, query) {
    this.target = target
    this.targetElementQuery = query
    return this
  }

  targetLeft () {
    this.targetX = Positions.START
    return this
  }

  targetRight () {
    this.targetX = Positions.END
    return this
  }

  targetCenter () {
    this.targetX = Positions.CENTER
    return this
  }

  targetTop () {
    this.targetY = Positions.START
    return this
  }

  targetBottom () {
    this.targetY = Positions.END
    return this
  }

  targetMiddle () {
    this.targetY = Positions.CENTER
    return this
  }

  diffX (diffX) {
    this.targetDiffX = diffX
    return this
  }

  diffY (diffY) {
    this.targetDiffY = diffY
    return this
  }

  margin (margin) {
    this.targetMargin = margin
    return this
  }

  alternativeX (callback, treshold = 0) {
    const p = this.clone()
    callback(p)
    this.alternativePositionX = p
    this.alternativePositionXTreshold = treshold
    return this
  }

  alternativeY (callback, treshold = 0) {
    const p = this.clone()
    callback(p)
    this.alternativePositionY = p
    this.alternativePositionYTreshold = treshold
    return this
  }

  autoCorrect (autoCorrectType, scrollIntoViewContentHeight = 0) {
    this.autoCorrectType = autoCorrectType
    this.scrollIntoViewContentHeight = scrollIntoViewContentHeight
    return this
  }

  onPosition (callback) {
    this.onPositionCallback = callback
    return this
  }

  onAnchorEl (callback) {
    this.onAnchorElCallback = callback
    return this
  }

  onTargetEl (callback) {
    this.onTargetElCallback = callback
    return this
  }

  clone () {
    const p = new PositionConfig()

    const cloneKeys = [
      'anchor',
      'anchorElementQuery',
      'anchorX',
      'anchorY',

      'target',
      'targetElementQuery',
      'targetX',
      'targetY',

      'targetMargin',

      'onPositionCallback',
      'onAnchorElCallback',
      'onTargetElCallback'
    ]

    for (const key of cloneKeys) {
      p[key] = this[key]
    }

    return p
  }

  update (position) {
    const updateKeys = [
      'anchorX',
      'anchorY',

      'targetX',
      'targetY',

      'targetDiffX',
      'targetDiffY',
      'targetMargin'
    ]

    for (const key of updateKeys) {
      this[key] = position[key]
    }
  }
}
