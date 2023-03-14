export default defineAppConfig({
  myProject: {
    name: 'motor-nx-core'
  }
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    myProject?: {
      /** Project name */
      name?: string
    }
  }
}
