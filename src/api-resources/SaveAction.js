import { ApiAction } from './ApiAction'

export class SaveAction extends ApiAction {
  _minDuration = 400

  save () {
    return this.execute()
  }

  async afterRequest () {
    await super.afterRequest()

    this.alert('Die Daten wurden gespeichert.')
  }
}
