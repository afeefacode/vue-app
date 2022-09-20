import { ApiAction } from './ApiAction'

export class DeleteAction extends ApiAction {
  _minDuration = 400

  delete () {
    return this.execute()
  }

  execute () {
    this.data(null)

    return super.execute()
  }

  async afterRequest () {
    await super.afterRequest()

    this.alert('Die Daten wurden gelöscht.')
  }

  processResult () {
    return true
  }
}
