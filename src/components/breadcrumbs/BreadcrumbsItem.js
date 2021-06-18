import VBreadcrumbsItem from 'vuetify/lib/components/VBreadcrumbs/VBreadcrumbsItem'

export default {
  mixins: [VBreadcrumbsItem],

  props: ['exactPath'],

  created () {
    // monkey patch item to enable v-routers 'exact-path' option
    const generateRouteLink = this.generateRouteLink
    this.generateRouteLink = () => {
      const link = generateRouteLink()
      link.data.props.exactPath = this.$props.exactPath || false
      return link
    }
  }
}
