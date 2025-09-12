import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Read env variable -- In future we can fetch in backend
const fileName = import.meta.env.VITE_I18N_FILE || "en-sample";

// Load the json file
async function loadResource() {
  const data = await import(`./translate-json/${fileName}.json`);
  return data.default;
}

(async () => {
  const translations = await loadResource();

  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          [fileName]: translations,
        },
      },
      lng: "en",
      fallbackLng: "en",
      ns: [fileName],
      defaultNS: fileName,
      interpolation: {
        escapeValue: false,
      },
    });
})();

export default i18n;
