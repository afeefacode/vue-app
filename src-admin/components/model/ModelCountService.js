class ModelCountService {
  requests = {}

  addAction (action) {
    const actionName = action.getFullName()
    if (!this.requests[actionName]) {
      const request = action.batchRequest()
      this.requests[actionName] = request
    }
    return this.createCountRequest(this.requests[actionName])
  }

  loadCounts () {

  }

  createCountRequest (request) {
    return {
      async get (field) {
        const result = await request
          .addField(field, true)
          .send()
        request.fields({})
        return result.data[field]
      }
    }
  }
}

export const modelCountService = new ModelCountService()
