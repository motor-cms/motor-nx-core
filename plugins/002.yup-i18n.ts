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

  const currentLocale = nuxtApp.vueApp.config.globalProperties.$i18n.locale;
  setLocale({
    // use constant translation keys for messages without values
    mixed: {
      default: ({label}) => (validationTranslations[currentLocale].messages._default.replace('{field}', label)),
      required: ({label}) => (validationTranslations[currentLocale].messages.required.replace('{field}', label)),
      notType: ({label}) => (validationTranslations[currentLocale].messages.one_of.replace('{field}', label))
    },
    // use functions to generate an error object that includes the value from the schema
    number: {
      min: ({ min, label }) => (validationTranslations[currentLocale].messages.min_value.replace('{field}', label).replace('{min}', min)),
      max: ({ max, label }) => (validationTranslations[currentLocale].messages.max_value.replace('{field}', label).replace('{max}', max)),
      integer: ({ label }) => (validationTranslations[currentLocale].messages.integer.replace('{field}', label)),
    },
    string: {
      min: ({ min, label }) => (validationTranslations[currentLocale].messages.min.replace('{field}', label).replace('{length}', min)),
      max: ({ max, label }) => (validationTranslations[currentLocale].messages.max.replace('{field}', label).replace('{length}', max)),
      email: ({label}) => (validationTranslations[currentLocale].messages.email.replace('{field}', label)),
    },
    array: {
      min: ({ min, label }) => (validationTranslations[currentLocale].messages.required.replace('{field}', label)),
      max: ({ max, label }) => (validationTranslations[currentLocale].messages.required.replace('{field}', label)),
    },
    date: {

    },
    boolean: {

    },
    object: {

    }
  });

})
