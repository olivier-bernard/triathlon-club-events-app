import RegisterForm from "./RegisterForm";
import { getTranslations } from "@/app/lib/i18n";
import { headers } from "next/headers";


const allTranslations = {
  fr: getTranslations("fr"),
  en: getTranslations("en"),
};

export default async function RegisterPage() {
  // Detect language from browser headers (SSR)
  const headerObj = await headers();
  const acceptLang = headerObj.get("accept-language") || "fr";
  const browserLang = acceptLang.split(",")[0].split("-")[0];
  const lang = ["en", "fr"].includes(browserLang) ? browserLang : "fr";

  return (
    <RegisterForm initialLang={lang} translations={allTranslations} />
  );
}