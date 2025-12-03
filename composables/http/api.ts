import {useSanctumClient} from "#imports";

export default function useApi() {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = String(runtimeConfig.public.backendApiBaseUrl) + String(runtimeConfig.public.backendApiSlug);
  const userStore = useUserStore();
  const client = useSanctumClient();

  interface RequestOptions {
    baseURL: string;
    headers: Record<string, string>;
  }

  const requestOptions: RequestOptions = reactive({
    baseURL: baseUrl,
    headers: {
      Accept: 'application/json'
    }
  })

  const get = async (path: string, params: Record<string, unknown> = {}, opts?: Record<string, unknown>, withoutAuth: boolean = false) => {
    if (!withoutAuth) addBearerToken();
    const options = Object.assign({query: Object.assign({}, params)}, requestOptions, opts)
    try {
      const data = await client(path, options)
      return { data: { value: data }, error: { value: null }, pending: ref(false), refresh: async () => {} }
    } catch (err) {
      return { data: { value: null }, error: { value: err }, pending: ref(false), refresh: async () => {} }
    }
  }

  const post = async (path: string, body: Record<string, unknown>, opts?: Record<string, unknown>, withoutAuth: boolean = false) => {
    if (!withoutAuth) addBearerToken();
    const options = Object.assign({}, requestOptions, opts)
    options.method = 'POST';
    options.body = body;
    try {
      const data = await client(path, options)
      return { data: { value: data }, error: { value: null } }
    } catch (err) {
      return { data: { value: null }, error: { value: err } }
    }
  }

  const put = async (path: string, body: Record<string, unknown>, opts?: Record<string, unknown>, withoutAuth: boolean = false) => {
    if (!withoutAuth) addBearerToken();
    const options = Object.assign({}, requestOptions, opts)
    options.method = 'PUT';
    options.body = body;
    try {
      const data = await client(path, options)
      return { data: { value: data }, error: { value: null } }
    } catch (err) {
      return { data: { value: null }, error: { value: err } }
    }
  }

  const destroy = async (path: string, opts?: Record<string, unknown>, withoutAuth: boolean = false) => {
    if (!withoutAuth) addBearerToken();
    const options = Object.assign({}, requestOptions, opts)
    options.method = 'DELETE';
    try {
      const data = await client(path, options)
      return { data: { value: data }, error: { value: null } }
    } catch (err) {
      return { data: { value: null }, error: { value: err } }
    }
  }

  const addBearerToken = () => {
    if (userStore.token) {
      requestOptions.headers.Authorization = 'Bearer ' + userStore.token;
    }
  }

  return {
    get,
    post,
    put,
    destroy
  }
}
