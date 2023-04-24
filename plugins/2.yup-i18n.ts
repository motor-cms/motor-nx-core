import en from '@zrm/motor-nx-core/locales/en/formvalidation.json';
import de from '@zrm/motor-nx-core/locales/de/formvalidation.json';
import fr from '@zrm/motor-nx-core/locales/fr/formvalidation.json';
import { setLocale } from 'yup';
import {defineNuxtPlugin} from "#app";

export default defineNuxtPlugin((nuxtApp) => {

  const validationTranslations = {
    de,
    en,
    fr
  }

  console.log("Defining validation rules...")
  setLocale({
    // use constant translation keys for messages without values
    mixed: {
      default: ({label}) => (validationTranslations[nuxtApp.vueApp.__VUE_I18N__.global.locale.value].messages._default.replace('{field}', label)),
      required: ({label}) => (validationTranslations[nuxtApp.vueApp.__VUE_I18N__.global.locale.value].messages.required.replace('{field}', label))
    },
    // use functions to generate an error object that includes the value from the schema
    number: {
      min: ({ min, label }) => (validationTranslations[nuxtApp.vueApp.__VUE_I18N__.global.locale.value].messages.min_value.replace('{field}', label).replace('{min}', min)),
      max: ({ max, label }) => (validationTranslations[nuxtApp.vueApp.__VUE_I18N__.global.locale.value].messages.max_value.replace('{field}', label).replace('{max}', max)),
    },
    string: {
      min: ({ min, label }) => (validationTranslations[nuxtApp.vueApp.__VUE_I18N__.global.locale.value].messages.min.replace('{field}', label).replace('{length}', min)),
      max: ({ max, label }) => (validationTranslations[nuxtApp.vueApp.__VUE_I18N__.global.locale.value].messages.max.replace('{field}', label).replace('{length}', max)),
    },
    date: {

    },
    boolean: {

    },
    object: {

    },
    array: {

    }
  });

})
