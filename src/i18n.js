import { createI18n } from "vue-i18n";

function loadLocaleMessages() {
  const locales = require.context(
    "./locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([a-z0-9-_]+)\/([a-z0-9-_]+)\.json$/i);
    if (matched && matched.length > 2) {
      const locale = matched[1];
      const file = matched[2];
      messages[locale] = messages[locale] || {};
      messages[locale][file] = locales(key);
    }
  });
  return messages;
}

export default createI18n({
  locale: localStorage.getItem("language") || "en",
  fallbackLocale: "en",
  messages: loadLocaleMessages(),
});
