export default interface Repository {
  index: (params: object) => Promise<any>
  create: (payload: object) => Promise<any>
  get: (id: number) => Promise<object>
  update: (payload: object, id: number) => Promise<any>
  delete: (id: number) => Promise<object>
}
