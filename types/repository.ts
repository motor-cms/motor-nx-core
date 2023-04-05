export default interface Repository {
  index?: (params: object, cached: boolean) => Promise<any>
  create?: (payload: object) => Promise<any>
  get?: (id: number, cached: boolean) => Promise<object>
  update?: (payload: object, id: number) => Promise<any>
  delete?: (id: number) => Promise<object>
}
