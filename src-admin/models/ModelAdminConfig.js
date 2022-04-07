export class ModelAdminConfig {
  icon = null
  selectedListConfig = null
  selectableListConfig = null

  setIcon (icon) {
    this.icon = icon
    return this
  }

  setSelectedListConfig (selectedListConfig) {
    this.selectedListConfig = selectedListConfig
    return this
  }

  setSelectableListConfig (selectableListConfig) {
    this.selectableListConfig = selectableListConfig
    return this
  }
}
