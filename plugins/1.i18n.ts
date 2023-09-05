//import { createI18n } from 'vue-i18n'

// @ts-nocheck
import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n'

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
async function loadLocaleMessages(
  locales,
  isPackage = false
): LocaleMessages<VueMessageType> {
  const messages: LocaleMessages<VueMessageType> = {}
  for (const key of Object.keys(locales)) {
    let variables = {}
    // Recursively go through the languages folder and read all json files in the directories and build the messages object
    // This allows us to split the language variables in separate files
    await key.split('/').reduce(async (re, e) => {
      const module = await locales[key]
      const r = await re

      // If we find a json file in the path, read the variables from it and assign it to the object
      if (isPackage) {
        variables = e.search(/\.json/i) > 0 ? module : {}
      } else {
        variables = e.search(/\.json/i) > 0 ? module.default : {}
      }
      // Strip the .json file ending from the path fragment
      e = e.replace('.json', '')
      if (
        e !== '.' &&
        e != '..' &&
        e != 'node_modules' &&
        e != 'locales'
      ) {
        return r[e] || (r[e] = variables);
      }
      return r
    }, messages)
  }
  return messages
}

/**
 * Merge function to combine different locales from external packages
 */
const merge = (target, source) => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target)
      Object.assign(source[key], merge(target[key], source[key]))
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source)
  return target
}

const deepMerge = (target, source) => {
  // Check if the source is an object
  if (typeof source === 'object' && !Array.isArray(source)) {
    // If target is not an object, initialize it as an empty object
    if (typeof target !== 'object' || target === null) {
      target = {};
    }
    for (const key of Object.keys(source)) {
      // Recursively merge objects
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = deepMerge(target[key], source[key]);
      } else {
        // Assign non-object values directly
        target[key] = source[key];
      }
    }
  } else {
    // If source is not an object, assign it directly to target
    target = source;
  }
  return target;
};

const baseLocales = import.meta.glob('./locales/**/*.json', { eager: true })

let messages = await loadLocaleMessages(baseLocales, false)

const languageModules = []

/**
 * Motor-Media
 */
languageModules.push(
  import.meta.glob('../../motor-nx-media/locales/**/*.json', { eager: true })
)

/**
 * Motor-Admin
 */
languageModules.push(
  import.meta.glob('../../motor-nx-admin/locales/**/*.json', { eager: true })
)

/**
 * Motor-Core
 */
languageModules.push(
  import.meta.glob('../../motor-nx-core/locales/**/*.json', { eager: true })
)

/**
 * Motor-Builder
 */
languageModules.push(
  import.meta.glob('../../motor-nx-builder/locales/**/*.json', { eager: true })
)

/**
 * Motor-Scoring
 */
languageModules.push(
  import.meta.glob('../../motor-nx-scoring/locales/**/*.json', { eager: true })
)

/**
 * Motor-Assistant
 */
languageModules.push(
  import.meta.glob('../../motor-nx-assistant/locales/**/*.json', { eager: true })
)

/**
 * Motor-Assistant
 */
languageModules.push(
  import.meta.glob('../../motor-nx-content-type/locales/**/*.json', { eager: true })
)

//!forEach does not wait for asynchronous functions to finish. So the merge order would be unknown and may cause problems.
//!To force the correct order and wait for asynchronous calls, a simple for loop was used here
for (let index = 0; index < languageModules.length; index++) {
  const module = languageModules[index];
  let moduleMessages = await loadLocaleMessages(module, true)

  // Remove key 'motor-X' from messages object to fit the follwing merge algorithm with messages
  if (Object.keys(moduleMessages)[0].includes('motor-')) {
    moduleMessages = moduleMessages[Object.keys(moduleMessages)]
  }

  messages = deepMerge(messages, moduleMessages)

  // console.log("Merged_Message" + index, JSON.parse(JSON.stringify(messages)));
}

/**
 * Project specific locales
 * ! Needs to be loaded & merged lastly, so that it may overwrite any values of the packages
 */
const projectLanguageModule = import.meta.glob('../../../locales/**/*.json', { eager: true })
const projectModuleMessages = await loadLocaleMessages(projectLanguageModule, true)
messages = deepMerge(messages, projectModuleMessages)

// console.log("Result", messages);

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'de',
    fallbackLocale: 'en',
    messages: messages,
  });

  vueApp.use(i18n)
})