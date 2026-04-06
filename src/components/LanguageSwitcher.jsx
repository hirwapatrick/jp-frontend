const changeLanguage = (lang) => {
  const select = document.querySelector(".goog-te-combo");
  if (!select) return;

  select.value = lang;
  select.dispatchEvent(new Event("change"));
};

const LanguageSwitcher = () => {
  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <button
        onClick={() => changeLanguage("en")}
        className="hover:text-blue-500 transition"
      >
        EN
      </button>

      <span className="text-gray-400">|</span>

      <button
        onClick={() => changeLanguage("rw")}
        className="hover:text-blue-500 transition"
      >
        RW 🇷🇼
      </button>
    </div>
  );
};

export default LanguageSwitcher;
