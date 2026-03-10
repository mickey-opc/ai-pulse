"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLanguage = (locale: string) => {
    startTransition(() => {
      document.cookie = `locale=${locale};path=/;max-age=31536000`;
      router.refresh();
    });
  };

  return (
    <div className="language-switcher">
      <button
        onClick={() => switchLanguage("en")}
        className="lang-btn"
        disabled={isPending}
      >
        EN
      </button>
      <span className="lang-separator">/</span>
      <button
        onClick={() => switchLanguage("zh")}
        className="lang-btn"
        disabled={isPending}
      >
        中文
      </button>
    </div>
  );
}
