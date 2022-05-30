import { ApiAction } from './ApiAction'

export class DeleteAction extends ApiAction {
  _minDuration = 400

  delete () {
    this.data(null)

    return this.execute()
  }

  async afterRequest () {
    await super.afterRequest()

    this.alert('Die Daten wurden gelöscht.')
  }

  processResult () {
    return true
  }
}
