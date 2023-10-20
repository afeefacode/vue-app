class AdminConfig {
  authService = null

  app = {
    logo: null,
    title: null,
    loaderColor: null,
    rootRouteName: null,
    appLoaderMinDuration: null,
    saveLoaderMinDuration: null,

    components: {
      Splash: null,
      SidebarMenu: null
    },

    icons: {}
  }

  config = {}
}

export const adminConfig = new AdminConfig()
