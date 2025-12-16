// @ts-nocheck
import { createI18n } from 'vue-i18n'
import type { LocaleMessages, VueMessageType } from 'vue-i18n'

/**
 * Deep merge utility to recursively combine locale objects
 * Later sources override earlier sources (maintaining priority)
 */
function deepMerge(target: any, source: any): any {
  if (typeof source === 'object' && source !== null && !Array.isArray(source)) {
    if (typeof target !== 'object' || target === null) {
      target = {}
    }

    for (const key of Object.keys(source)) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = deepMerge(target[key] || {}, source[key])
      } else {
        target[key] = source[key]
      }
    }
    return target
  }

  return source
}

/**
 * Load and structure locale messages from glob imports
 * Builds nested structure based on folder/file paths (e.g., de/components.json)
 */
async function loadLocaleMessages(
  locales: Record<string, any>,
  isPackage = false
): Promise<LocaleMessages<VueMessageType>> {
  const messages: LocaleMessages<VueMessageType> = {}

  for (const [key, moduleLoader] of Object.entries(locales)) {
    const pathParts = key.split('/')

    // Build nested structure based on path
    await pathParts.reduce(async (promiseAcc, part) => {
      const acc = await promiseAcc
      const module = await moduleLoader

      // Skip non-meaningful parts
      if (['.', '..', 'node_modules', 'locales'].includes(part)) {
        return acc
      }

      // Extract JSON content when we hit a .json file
      if (part.endsWith('.json')) {
        const content = isPackage ? module : module.default
        const cleanPart = part.replace('.json', '')
        acc[cleanPart] = content
        return acc
      }

      // Create nested object for directory parts
      acc[part] = acc[part] || {}
      return acc[part]
    }, Promise.resolve(messages))
  }

  return messages
}

/**
 * Normalize package messages by removing wrapper keys (e.g., 'motor-nx-core')
 */
function normalizePackageMessages(messages: LocaleMessages<VueMessageType>): LocaleMessages<VueMessageType> {
  const firstKey = Object.keys(messages)[0]

  // If the first key looks like a package name, unwrap it
  if (firstKey?.includes('motor-') || firstKey?.includes('-components')) {
    return messages[firstKey] || messages
  }

  return messages
}

/**
 * Helper to merge package locales into main messages object
 */
async function mergePackageLocales(
  messages: LocaleMessages<VueMessageType>,
  packageLocales: Record<string, any>
): Promise<LocaleMessages<VueMessageType>> {
  if (Object.keys(packageLocales).length === 0) return messages

  let packageMessages = await loadLocaleMessages(packageLocales, true)
  packageMessages = normalizePackageMessages(packageMessages)
  return deepMerge(messages, packageMessages)
}

/**
 * Load and merge all translations
 * Priority: Base → Packages (in order) → Project (highest priority)
 *
 * Note: import.meta.glob requires literal strings (not variables) for Vite to
 * statically analyze and bundle the correct files at build time
 */
async function loadAllTranslations(): Promise<LocaleMessages<VueMessageType>> {
  let messages: LocaleMessages<VueMessageType> = {}

  // 1. Load base motor-nx-core locales
  const baseLocales = import.meta.glob('./locales/**/*.json', { eager: true })
  messages = await loadLocaleMessages(baseLocales, false)

  // 2. Load and merge package locales (in order of priority)
  messages = await mergePackageLocales(messages, import.meta.glob('../../motor-nx-media/locales/**/*.json', { eager: true }))
  messages = await mergePackageLocales(messages, import.meta.glob('../../motor-nx-admin/locales/**/*.json', { eager: true }))
  messages = await mergePackageLocales(messages, import.meta.glob('../../motor-nx-core/locales/**/*.json', { eager: true }))
  messages = await mergePackageLocales(messages, import.meta.glob('../../motor-nx-builder/locales/**/*.json', { eager: true }))
  messages = await mergePackageLocales(messages, import.meta.glob('../../motor-nx-scoring/locales/**/*.json', { eager: true }))
  messages = await mergePackageLocales(messages, import.meta.glob('../../motor-nx-assistant/locales/**/*.json', { eager: true }))
  messages = await mergePackageLocales(messages, import.meta.glob('../../motor-nx-content-type/locales/**/*.json', { eager: true }))
  messages = await mergePackageLocales(messages, import.meta.glob('../../energis-components/locales/**/*.json', { eager: true }))
  messages = await mergePackageLocales(messages, import.meta.glob('../../base-components/locales/**/*.json', { eager: true }))

  // 3. Load project-specific locales (highest priority - overwrites all)
  const projectLocales = import.meta.glob('../../../locales/**/*.json', { eager: true })
  const projectMessages = await loadLocaleMessages(projectLocales, true)
  messages = deepMerge(messages, projectMessages)

  return messages
}

// Load all translations
const messages = await loadAllTranslations()

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'de',
    fallbackLocale: 'en',
    messages,
  })

  vueApp.use(i18n)
})
