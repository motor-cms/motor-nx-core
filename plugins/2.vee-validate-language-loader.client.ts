import { configure } from 'vee-validate';
import { localize } from '@vee-validate/i18n';
import en from '@vee-validate/i18n/dist/locale/en.json';
import de from '@vee-validate/i18n/dist/locale/de.json';
import fr from '@vee-validate/i18n/dist/locale/fr.json';
import { setLocale } from '@vee-validate/i18n';

export default defineNuxtPlugin(({ vueApp }) => {
  console.log("Configuring vee-validate translations...")
  localize({ de });
  setLocale('de')
  // Configure localized error messages
  configure({
    generateMessage: localize({
      de
    }),
  });

})
