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
    }
  }
}

export const adminConfig = new AdminConfig()
