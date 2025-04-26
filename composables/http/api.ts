import {digest} from "ohash";
import {useSanctumFetch} from "#imports";
import type {UseFetchOptions} from "#app";

export default function useApi(useRpc: boolean = false) {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = String(runtimeConfig.public.backendApiBaseUrl) + String(runtimeConfig.public.backendApiSlug);
  const userStore = useUserStore();


  const requestOptions: UseFetchOptions<Record<string, any>> = reactive({
    baseURL: baseUrl,
    headers: {
      Accept: 'application/json'
    }
  })

  const get = async (path: string, params: Record<string, any> = {}, opts?: UseFetchOptions<Record<string, any>>, withoutAuth: boolean = false) => {
    if (!withoutAuth) addBearerToken();
    // Check cache if data has already been fetched
    const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    const key = digest(path);
    // We need to assign "params" to a new object because it is a reactive which cannot be processed by useFetch, cause useFetch expects a normal object
    const options: UseFetchOptions<Record<string, any>> = Object.assign({key, params: Object.assign({}, params)}, requestOptions, opts)
    return useSanctumFetch(path, options)
  }

  const post = async (path: string, body: Record<string, any>, opts? : UseFetchOptions<Record<string, any>>,withoutAuth: boolean = false) => {
    if (!withoutAuth) addBearerToken();
    const options: UseFetchOptions<Record<string, any>> = Object.assign({}, requestOptions, opts)
    options.method = 'POST';
    options.body = body;
    return useSanctumFetch(path, options)
  }

  const put = async (path: string, body: Record<string, any>, opts? : UseFetchOptions<Record<string, any>>,withoutAuth: boolean = false) => {
    if (!withoutAuth) addBearerToken();
    const options: UseFetchOptions<Record<string, any>> = Object.assign({}, requestOptions, opts)
    options.method = 'PUT';
    options.body = body;
    return useSanctumFetch(path, options)
  }

  const destroy = async (path: string, opts?: UseFetchOptions<Record<string, any>>, withoutAuth: boolean = false) => {
    if (!withoutAuth) addBearerToken();
    const options: UseFetchOptions<Record<string, any>> = Object.assign({}, requestOptions, opts)
    options.method = 'DELETE';
    return useSanctumFetch(path, options)
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
