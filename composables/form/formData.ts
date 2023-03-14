import {useAppStore} from "@zrm/motor-nx-core/store/app";
import {useI18n} from "vue-i18n";
import {useToast} from "vue-toastification";

export function useCoreFormData() {

  const appStore = useAppStore();
  const { t } = useI18n()
  const toast = useToast()

  const getRelevantFormData = async (getData: (cached: boolean) => Promise<void>, mainProcessFunctions: Array<(cached: boolean) => Promise<void>>, backgroundFunctions: Array<(cached: boolean) => Promise<void>>, cached: boolean = true, withCacheRefresh: boolean = true) => {
    try {
      appStore.isLoading(true, true);
      await getData(false);
      for (const func of mainProcessFunctions) {
        await func(cached);
      }
    } catch (e) {
      console.log(e)
      console.log("Error fetching formdata.")
      toast.error(t('global.error_occurred'))
    } finally {
      appStore.isLoading(false, false);
      if (cached && withCacheRefresh) {
        try {
          if(backgroundFunctions.length) {
            appStore.updateInBackground(true);
            for (const func of backgroundFunctions) {
              await func(false);
            }
          }
        } catch (e) {
          console.log(e)
          console.log("Error fetching background data.");
          toast.error(t('global.error_occurred'))
        } finally {
          appStore.updateInBackground(false);
        }
      }
    }
  }

  return {
    getRelevantFormData,
  }
}
