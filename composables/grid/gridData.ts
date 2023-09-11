import {ref} from "vue";

import {useI18n} from "vue-i18n";
import {useToast} from "vue-toastification";

export function useGridData() {

  const appStore = useAppStore();
  const {t} = useI18n()
  const toast = useToast();

  const refreshGridData = async (main: Array<(params: any, id: string, cached?: boolean) => Promise<void>>, after: Array<(params: any, id: string, cached?: boolean) => Promise<void>>, params: any, id: string = '', cached: boolean = true, withCacheRefresh: boolean = true) => {
    try {
      appStore.isLoading(true);
      for (const func of main) {
        if (id.length) {
          await func(params, id, cached);
        } else {
          await func(params,'', cached);
        }
      }
    } catch (e) {
      console.error(e)
      console.log("Error fetching formdata.")
      toast.error(t('global.error_occurred'))
    } finally {
      appStore.isLoading(false);
      if (cached && withCacheRefresh) {
        try {
          if (after.length) {
            appStore.updateInBackground(true);
            for (const func of after) {
              if (id.length) {
                await func(params, id, false);
              } else {
                await func(params,'', false);
              }
            }
          }
        } catch (e) {
          console.log(e)
          console.error("Error fetching background data.");
          toast.error(t('global.error_occurred'))
        } finally {
          appStore.updateInBackground(false);
        }
      }
    }
  }

  return {refreshGridData}
}
