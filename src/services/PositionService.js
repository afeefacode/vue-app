import EventEmitter from 'events'

import Vue from 'vue'

import { Positions } from './position/PositionConfig'

export { Positions, PositionConfig } from './position/PositionConfig'

class PositionElementWatcher extends EventEmitter {
  node = null
  query = null
  rootEl = null
  el = null
  lastDomRect = null

  mutationWatcher = null
  sizeWatcher = null

  constructor (node, query) {
    super()

    this.node = node
    this.query = query
  }

  watch () {
    this.checkRootElMounted()
  }

  checkRootElMounted () {
    if (this.node instanceof Vue) {
      if (this.node.$el && this.node.$el.nodeType === 1) {
        this.rootEl = this.node.$el
        this.checkElementsMounted()
      } else {
        this.node.$on('hook:mounted', this.vueUpdated)
        this.node.$on('hook:updated', this.vueUpdated)
      }
    } else {
      this.rootEl = this.node
      this.checkElementsMounted()
    }
  }

  vueUpdated = () => {
    if (this.node.$el && this.node.$el.nodeType === 1) {
      this.node.$off('hook:mounted', this.vueUpdated)
      this.node.$off('hook:updated', this.vueUpdated)
      this.rootEl = this.node.$el
      this.checkElementsMounted()
    }
  }

  getEl () {
    if (this.rootEl) {
      if (this.query) {
        return this.rootEl.querySelector(this.query)
      }
      return this.rootEl
    }
  }

  checkElementsMounted () {
    if (!this.rootEl) {
      return
    }

    this.el = this.getEl()

    if (this.el) {
      this.watchSize()
    } else {
      this.mutationWatcher = new MutationObserver(this.domChanged)
      this.mutationWatcher.observe(this.rootEl, { childList: true, subtree: true })
    }
  }

  domChanged = () => {
    // console.log('dom changed')
    const oldEl = this.el
    this.el = this.getEl()

    if (this.el) {
      this.watchSize()
    } else {
      this.unwatchSize(oldEl)
    }
  }

  watchSize () {
    if (!this.sizeWatcher) {
      this.sizeWatcher = new ResizeObserver(this.sizeChanged)
      this.sizeWatcher.observe(this.el)
    }

    this.sizeChanged()
  }

  checkSizeChanged (rect1, rect2) {
    if (!rect1) {
      return true
    }
    return ['x', 'y', 'width', 'height'].some(prop => {
      return rect1[prop] !== rect2[prop]
    })
  }

  sizeChanged = () => {
    // console.log('sizeChanged')
    const rect = this.el.getBoundingClientRect()

    if (!this.checkSizeChanged(this.lastDomRect, rect)) {
      return
    }

    this.lastDomRect = rect

    this.emit('resize', this.el)
  }

  unwatch () {
    if (this.node instanceof Vue) {
      this.node.$off('hook:mounted', this.vueUpdated)
      this.node.$off('hook:updated', this.vueUpdated)
    }

    this.unwatchSize()
    this.unwatchDom()
  }

  unwatchSize (el) {
    el = el || this.el // if given
    if (this.sizeWatcher) {
      this.sizeWatcher.unobserve(el)
      this.sizeWatcher = null
      this.lastDomRect = null
    }
  }

  unwatchDom () {
    if (this.mutationWatcher) {
      this.mutationWatcher.disconnect()
      this.mutationWatcher = null
    }
  }
}

class PositionElementsWatcher extends EventEmitter {
  anchorWatcher = null
  targetWatcher = null

  anchorEl = null
  targetEl = null

  constructor (anchor, anchorQuery, target, targetQuery) {
    super()

    this.anchorWatcher = new PositionElementWatcher(anchor, anchorQuery)
    this.anchorWatcher.on('resize', this.anchorResized)

    this.targetWatcher = new PositionElementWatcher(target, targetQuery)
    this.targetWatcher.on('resize', this.targetResized)
  }

  update () {
    // console.log('update')
    this.emitResize()
  }

  watch () {
    this.anchorWatcher.watch()
    this.targetWatcher.watch()
  }

  anchorResized = el => {
    if (!this.anchorEl) {
      this.emit('anchor', el)
    }
    this.anchorEl = el
    this.emitResize()
  }

  targetResized = el => {
    if (!this.targetEl) {
      this.emit('target', el)
    }
    this.targetEl = el
    this.emitResize()
  }

  unwatch () {
    this.anchorWatcher.unwatch()
    this.anchorWatcher.off('resize', this.anchorResized)

    this.targetWatcher.unwatch()
    this.targetWatcher.off('resize', this.targetResized)
  }

  emitResize () {
    if (this.anchorEl && this.targetEl) {
      this.emit('resize', {
        anchor: this.anchorEl,
        target: this.targetEl
      })
    }
  }
}

class PositionService {
  watchers = []

  register (position) {
    // console.log('register', position.anchorElementQuery, position.targetElementQuery)
    const watcher = new PositionElementsWatcher(
      position.anchor || document.documentElement,
      position.anchorElementQuery,
      position.target,
      position.targetElementQuery
    )

    watcher.on('resize', ({anchor, target}) => {
      // console.log('RESIZE', anchor, target)
      const {alternativePositionX = false, alternativePositionY = false} = this.setPosition(position, anchor, target) || {}
      position.onPositionCallback({alternativePositionX, alternativePositionY})
    })

    watcher.on('anchor', anchor => {
      position.onAnchorElCallback(anchor)
    })

    watcher.on('target', target => {
      position.onTargetElCallback(target)
    })

    this.watchers.push(watcher)

    watcher.watch()

    return watcher
  }

  unregister (watcher) {
    watcher.unwatch()
    this.watchers = this.watchers.filter(w => w !== watcher)
  }

  shouldFlipVertically (position, anchorRect) {
    if (!position.alternativePositionY) {
      return false
    }

    if (!position.alternativePositionYTreshold) {
      return true
    }

    let anchorFractionY = 0
    switch (position.anchorY) {
      case Positions.START:
        anchorFractionY = anchorRect.top
        break
      case Positions.CENTER:
        anchorFractionY = anchorRect.top + (anchorRect.bottom - anchorRect.top) / 2
        break
      case Positions.END:
        anchorFractionY = anchorRect.bottom
        break
    }
    anchorFractionY /= document.documentElement.clientHeight

    if (position.alternativePositionYTreshold > 0) { // flip, if anchor positioned below alternativePositionYTreshold
      if (anchorFractionY > position.alternativePositionYTreshold) {
        return true
      }
    } else { // flip, if anchor positioned above alternativePositionYTreshold
      const absTreshold = Math.abs(position.alternativePositionYTreshold)
      if (anchorFractionY < absTreshold) {
        return true
      }
    }

    return false
  }

  setAlternativePositionX (position, anchor, target) {
    this.setPosition(position, anchor, target)
    return {
      alternativePositionX: true
    }
  }

  setAlternativePositionY (position, anchor, target) {
    this.setPosition(position, anchor, target)
    return {
      alternativePositionY: true
    }
  }

  setPosition (position, anchor, target) {
    let anchorRect
    if (anchor && anchor !== document.documentElement) {
      anchorRect = anchor.getBoundingClientRect()
    } else {
      anchorRect = new DOMRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight)
    }

    const targetRect = target.getBoundingClientRect()
    const targetParentRect = (target.offsetParent || document.documentElement).getBoundingClientRect()

    const targetViewPortRect = this.getViewportRect(target)
    const targetMargin = this.cssMeasureToPx(position.targetMargin, target)

    // if (target.classList.contains('selectPopup')) {
    //   console.log('anchor', anchor)
    //   console.log('anchorRect', anchorRect)
    //   // this.drawElementRect((target.offsetParent || document.documentElement), 'red', 'offset')
    //   // this.drawElementRect(this.getScrollParent(target), 'green', 'scroll')
    //   // this.drawElementRect(anchor || document.documentElement, 'blue', 'anchor')
    //   this.drawElementRect(target, 'yellow', 'target')
    // }

    // const targetStyle = getComputedStyle(target)
    // console.log('targetStyle', targetStyle.top, targetStyle.left, targetStyle.width, targetStyle.height)

    // console.log('position', position)
    // const rectTargetParent = this.drawRect(targetParentRect, 'red')
    // const rectTargetViewPort = this.drawRect(targetViewPortRect, 'green')
    // const rectTarget = this.drawRect(targetRect, 'yellow')
    // const rectAnchor = this.drawRect(anchorRect, 'blue')

    // top

    let top = 0

    switch (position.anchorY) {
      case Positions.START:
        top = anchorRect.top
        break
      case Positions.CENTER:
        top = anchorRect.top + (anchorRect.bottom - anchorRect.top) / 2
        break
      case Positions.END:
        top = anchorRect.bottom
        break
    }

    switch (position.targetY) {
      case Positions.CENTER:
        top -= ((targetRect.bottom - targetRect.top) / 2)
        break
      case Positions.END:
        top -= (targetRect.bottom - targetRect.top)
        break
    }

    top += this.cssMeasureToPx(position.targetDiffY)

    if (position.autoCorrectType === Positions.AUTO_CORRECT_TYPE_FIT_INTO_TO_VIEW) {
      const minTop = targetViewPortRect.top + targetMargin
      if (top < minTop) {
        if (this.shouldFlipVertically(position, anchorRect)) {
          return this.setAlternativePositionY(position.alternativePositionY, anchor, target)
        }
        top = minTop
      }

      const maxTop = targetViewPortRect.bottom - targetMargin - targetRect.height
      if (top > maxTop) {
        if (this.shouldFlipVertically(position, anchorRect)) {
          return this.setAlternativePositionY(position.alternativePositionY, anchor, target)
        }
        top = maxTop
      }
    }

    top -= targetParentRect.top

    // left

    let left = 0

    switch (position.anchorX) {
      case Positions.START:
        left = anchorRect.left
        break
      case Positions.CENTER:
        left = anchorRect.left + (anchorRect.right - anchorRect.left) / 2
        break
      case Positions.END:
        left = anchorRect.right
        break
    }

    switch (position.targetX) {
      case Positions.CENTER:
        left -= ((targetRect.right - targetRect.left) / 2)
        break
      case Positions.END:
        left -= (targetRect.right - targetRect.left)
        break
    }

    left += this.cssMeasureToPx(position.targetDiffX)

    const minLeft = targetViewPortRect.left + targetMargin
    if (left < minLeft) {
      if (position.alternativePositionX) {
        return this.setAlternativePositionX(position.alternativePositionX, anchor, target)
      }
      left = minLeft
    }

    const maxLeft = targetViewPortRect.right - targetMargin - targetRect.width
    if (left > maxLeft) {
      if (position.alternativePositionX) {
        return this.setAlternativePositionX(position.alternativePositionX, anchor, target)
      }
      left = maxLeft
    }

    left -= targetParentRect.left

    // set new position

    target.style.left = left + 'px'
    target.style.top = top + 'px'

    // console.log('SET1', anchor.getBoundingClientRect(), anchor)
    // console.log('SET2', target.getBoundingClientRect(), target)

    // console.log('--- rectTargetParent', rectTargetParent)
    // console.log('--- rectTargetViewPort', rectTargetViewPort)
    // console.log('--- rectAnchor', rectAnchor)
    // console.log('--- rectTarget', rectTarget)

    // if (target.classList.contains('selectPopup')) {
    //   // this.drawElementRect((target.offsetParent || document.documentElement), 'red', 'offset')
    //   // this.drawElementRect(this.getScrollParent(target), 'green', 'scroll')
    //   this.drawElementRect(anchor || document.documentElement, 'blue', 'anchor')
    //   this.drawElementRect(target, 'green', 'target')
    // }

    // scroll into view

    if (position.autoCorrectType === Positions.AUTO_CORRECT_TYPE_SCROLL_INTO_VIEW) {
      const targetRect = target.getBoundingClientRect()
      const anchorViewPortRect = this.getViewportRect(anchor)
      const anchorScrollParent = this.getScrollParent(anchor)
      const anchorInScrollableDiv = anchorScrollParent !== document.documentElement

      // scroll up

      if (anchorInScrollableDiv) {
        const minTop = anchorViewPortRect.top
        if (anchorRect.top < minTop) {
          const diff = minTop - anchorRect.top
          this.scrollTo({
            element: anchorScrollParent,
            top: anchorScrollParent.scrollTop - diff
          })
          target.style.top = (top + diff) + 'px'
          return
        }
      } else {
        const minTop = anchorViewPortRect.top + targetMargin
        if (targetRect.top < minTop) {
          const diff = minTop - targetRect.top
          this.scrollTo({
            element: anchorScrollParent,
            top: anchorScrollParent.scrollTop - diff
          })
          return
        }
      }

      // scroll down

      const anchorHeight = position.scrollIntoViewContentHeight || anchorRect.height

      if (anchorInScrollableDiv) {
        const maxBottom = anchorViewPortRect.bottom
        if (anchorRect.top + anchorHeight > maxBottom) {
          const maxTop = maxBottom - anchorHeight
          const diff = anchorRect.top - maxTop
          this.scrollTo({
            element: anchorScrollParent,
            top: anchorScrollParent.scrollTop + diff
          })
          target.style.top = (top - diff) + 'px'
        }
      } else {
        let elementTop = 0
        let maxTop = 0
        const maxBottom = anchorViewPortRect.bottom - targetMargin
        if (anchorRect.top + anchorHeight > targetRect.bottom) { // anchor > target -> scroll for anchor
          elementTop = anchorRect.top
          maxTop = maxBottom - anchorHeight
        } else { // target > anchor -> scroll for target
          elementTop = targetRect.top
          maxTop = maxBottom - targetRect.height
        }

        if (elementTop > maxTop) {
          const diff = elementTop - maxTop
          this.scrollTo({
            element: anchorScrollParent,
            top: anchorScrollParent.scrollTop + diff
          })
          target.style['margin-bottom'] = targetMargin + 'px'
        }
      }
    }
  }

  scrollTo ({element, top}) {
    element.scrollTo({
      top,
      behavior: 'smooth'
    })
  }

  scrollIntoView (element, margin = '1rem') {
    const elementRect = element.getBoundingClientRect()
    const elementViewPortRect = this.getViewportRect(element)
    const elementScrollParent = this.getScrollParent(element)
    margin = this.cssMeasureToPx(margin)

    // scroll up

    const minTop = elementViewPortRect.top + margin
    if (elementRect.top < minTop) {
      const diff = minTop - elementRect.top
      this.scrollTo({
        element: elementScrollParent,
        top: elementScrollParent.scrollTop - diff
      })
      return
    }

    // scroll down

    const maxTop = elementViewPortRect.bottom - margin - elementRect.height
    if (elementRect.top > maxTop) {
      const diff = elementRect.top - maxTop
      this.scrollTo({
        element: elementScrollParent,
        top: elementScrollParent.scrollTop + diff
      })
    }
  }

  drawViewport (target) {
    const vp = this.getViewportRect(target)
    this.drawRect(vp)
  }

  hasClickListener = false

  drawRect (rect, color = 'blue') {
    const el = document.createElement('div')
    document.body.appendChild(el)

    let margin = 0
    if (color === 'blue') {
      margin = 2
    }
    if (color === 'green') {
      margin = 4
    }

    el.className = 'viewport'
    el.style.position = 'fixed'
    el.style.pointerEvents = 'none'
    el.style.top = rect.top + margin + 'px'
    el.style.left = rect.left + margin + 'px'
    el.style.width = (rect.width - 2 * margin - 2) + 'px'
    el.style.height = (rect.height - 2 * margin - 2) + 'px'

    const borderStyle = color === 'green' ? 'dotted' : 'solid'
    el.style.border = `2px ${borderStyle} ${color}`
    el.style.zIndex = 1005

    // setTimeout(() => {
    //   const el = document.querySelector('.viewport')
    //   if (el) {
    //     document.body.removeChild(el)
    //   }
    // }, 5000)

    if (!this.hasClickListener) {
      window.addEventListener('mousedown', () => {
        const elements = document.querySelectorAll('.viewport')
        for (const el of elements) {
          document.body.removeChild(el)
        }
      })
      this.hasClickListener = true
    }

    return el
  }

  drawElementRect (el, color = 'blue', text) {
    function getHtml (element) {
      const htmlText = element.outerHTML
      const start = htmlText.search(/</)
      const end = htmlText.search(/>/)
      return htmlText.substr(start, end + 1)
    }

    const textEl = document.createElement('div')
    textEl.innerText = text + ' ' + getHtml(el)
    textEl.style.background = 'white'
    textEl.style.fontSize = '10px'
    textEl.style.whiteSpace = 'nowrap'
    textEl.style.display = 'inline-block'

    const rectEl = this.drawRect(el.getBoundingClientRect(), color)
    rectEl.appendChild(textEl)
  }

  getViewportRect (target) {
    const scrollable = this.getScrollParent(target)
    if (scrollable === document.documentElement) {
      return new DOMRect(
        0,
        0,
        document.documentElement.clientWidth, // size without scrollbars
        document.documentElement.clientHeight
      )
    }
    const rect = scrollable.getBoundingClientRect()
    rect.width = scrollable.clientWidth // subtract scrollbars
    rect.height = scrollable.clientHeight
    return rect
  }

  getScrollParent (target, includeTarget = false) {
    const targetStyle = getComputedStyle(target)
    if (targetStyle.position === 'fixed') {
      return document.documentElement
    }

    const overflowRegex = /(auto|scroll)/

    let parent = includeTarget ? target : target.parentElement
    while (parent) {
      const parentStyle = getComputedStyle(parent)
      if (overflowRegex.test(parentStyle.overflowY)) {
        return parent
      }
      parent = parent.parentElement
    }

    return document.documentElement
  }

  cssMeasureToPx (margin, anchor) {
    const marginNum = parseFloat(margin)
    if (typeof margin === 'string') {
      if (margin.match(/rem/)) {
        return marginNum * parseFloat(getComputedStyle(document.body).fontSize)
      }
      if (margin.match(/em/)) {
        return marginNum * parseFloat(getComputedStyle(anchor).fontSize)
      }
    }
    return marginNum // px
  }
}

export const positionService = new PositionService()
