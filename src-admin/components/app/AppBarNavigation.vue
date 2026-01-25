<template>
  <div
    id="appBarNavigation"
    class="d-flex align-center gap-1"
  >
    <v-btn
      v-for="link in links"
      :key="link.id"
      class="mt-3 mb-n1"
      x-small
      @click="scrollToSection(link.id)"
    >
      {{ link.label }}
    </v-btn>
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { debounce } from '@a-vue/utils/debounce'

@Component
export default class AppBarNavigation extends Vue {
  links = []

  debounceInitLinks = debounce(this.initLinks, 50) // fire immediately if !value (click clearable-x)

  mounted () {
    const mutationWatcher = new MutationObserver(mutations => {
      let changed = false

      for (const m of mutations) {
        // Neue Nodes
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue
          if (node.matches('.collapsible-section') || node.querySelector('.collapsible-section')) {
            changed = true
          }
        }

        // Entfernte Nodes
        for (const node of m.removedNodes) {
          if (!(node instanceof HTMLElement)) continue
          if (node.matches('.collapsible-section') || node.querySelector('.collapsible-section')) {
            changed = true
          }
        }
      }

      if (changed) {
        this.debounceInitLinks()
      }
    })

    mutationWatcher.observe(document.body, { childList: true, subtree: true })
  }

  initLinks () {
    const sections = document.querySelectorAll('.collapsible-section')
    const seenLabels = new Set()

    this.links = Array.from(sections)
      .filter(s => { // wenn aus versehen mehrere sections mit gleichem label bestehen, z.b. in popups
        const label = s.getAttribute('label')
        if (seenLabels.has(label)) {
          return false
        }
        seenLabels.add(label)
        return true
      })
      .map(s => {
        const label = s.getAttribute('label')
        const slug = label
          .toLowerCase()
          .replace(/[^\w]+/g, '-') // Sonderzeichen -> Bindestriche
          .replace(/^-+|-+$/g, '') // führende/trailing -
          .substring(0, 50) // Sicherheitslimit

        s.id = slug

        return {
          id: s.id,
          label,
          slug
        }
      })
  }

  scrollToSection (id) {
    const el = document.querySelector(`#${id}`)
    if (!el) return

    // Scroll-Container auswählen (kann auch this.$refs.scrollContainer sein)
    const container = document.querySelector('#v-main')
    if (!container) return

    // Abstand in Pixeln (4rem ≈ 64px)
    const offset = 140

    // Berechne die Scroll-Position relativ zum Container
    const containerTop = container.getBoundingClientRect().top
    const elementTop = el.getBoundingClientRect().top

    const scrollTarget = container.scrollTop + (elementTop - containerTop) - offset

    container.scrollTo({
      top: scrollTarget,
      behavior: 'smooth'
    })

    // // Scroll sanft zur Section
    // el.scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'start'
    // })
  }
}
</script>
