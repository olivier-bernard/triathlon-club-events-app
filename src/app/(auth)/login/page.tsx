import LoginForm from "./LoginForm";
import { getTranslations } from "@/app/lib/i18n";
import { headers } from "next/headers";


const allTranslations = {
  fr: getTranslations("fr"),
  en: getTranslations("en"),
};

export default async function LoginPage() {
  // Detect language from browser headers (SSR)
  const headerObj = await headers();
  const acceptLang = headerObj.get("accept-language") || "fr";
  const browserLang = acceptLang.split(",")[0].split("-")[0];
  const lang = ["en", "fr"].includes(browserLang) ? browserLang : "fr";

  return (
    <div>
      <LoginForm initialLang={lang} translations={allTranslations} />
    </div>
  );
}