import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  props: ['id', 'action', 'fields']
})
export default class ModelViewMixin extends Vue {
  model = null
  isLoading = false

  created () {
    this.load()
  }

  @Watch('id')
  idChanged () {
    this.load()
  }

  async load () {
    this.model = null
    this.isLoading = true

    const result = await this.action.request()
      .params({
        id: this.id
      })
      .fields(this.fields)
      .send()

    this.model = result.data

    this.isLoading = false

    this.$emit('update:model', this.model)
  }
}
