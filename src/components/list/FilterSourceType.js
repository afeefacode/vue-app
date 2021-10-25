export class FilterSourceType {
  // filters are synchronized with url's query string
  static QUERY_STRING = 'query_string'

  // filters are initialized from given route params (no synchronisation allowed)
  static ROUTE_PARAMS = 'route_params'

  // filters are synchronized with plain history object
  static OBJECT = 'object'
}
