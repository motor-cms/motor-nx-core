
import {UseFetchOptions} from "#app";
import {sha256} from "ohash";

export default function useApi(useRpc: boolean = false) {
  const baseUrl = useRpc ? import.meta.env.VITE_PUBLIC_API_BASE_URL + import.meta.env.VITE_PUBLIC_API_RPC_SLUG : import.meta.env.VITE_PUBLIC_API_BASE_URL + import.meta.env.VITE_PUBLIC_API_SLUG;
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
    const key = sha256(path);
    // We need to assign "params" to a new object because it is a reactive which cannot be processed by useFetch, cause useFetch expects a normal object
    const options: UseFetchOptions<Record<string, any>> = Object.assign({key, params: Object.assign({}, params)}, requestOptions, opts)
    return useFetch(path, options)
  }

  const post = async (path: string, body: Record<string, any>, opts? : UseFetchOptions<Record<string, any>>,withoutAuth: boolean = false) => {
    if (!withoutAuth) addBearerToken();
    const options: UseFetchOptions<Record<string, any>> = Object.assign({}, requestOptions, opts)
    options.method = 'POST';
    options.body = body;
    return useFetch(path, options)
  }

  const put = async (path: string, body: Record<string, any>, opts? : UseFetchOptions<Record<string, any>>,withoutAuth: boolean = false) => {
    if (!withoutAuth) addBearerToken();
    const options: UseFetchOptions<Record<string, any>> = Object.assign({}, requestOptions, opts)
    options.method = 'PUT';
    options.body = body;
    return useFetch(path, options)
  }

  const destroy = async (path: string, opts?: UseFetchOptions<Record<string, any>>, withoutAuth: boolean = false) => {
    if (!withoutAuth) addBearerToken();
    const options: UseFetchOptions<Record<string, any>> = Object.assign({}, requestOptions, opts)
    options.method = 'DELETE';
    return useFetch(path, options)
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
