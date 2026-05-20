const imageBase = "assets/images";
const storageKeys = {
  categories: "restaurantMenuCategories",
  meals: "restaurantMenuMeals",
  settings: "restaurantMenuSettings",
  translations: "restaurantTranslationCache",
};
const defaultSettings = {
  name: "Sareen Restaurant",
  nameAr: "مطعم سارين",
  nameKu: "ڕێستورانتی سارین",
  logo: `${imageBase}/logo.svg`,
};

// Add or edit categories here. Icons live in assets/images/categories.
const defaultCategories = [];
const defaultMenuItems = [];

function readSavedData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function getCategories() {
  const savedCategories = readSavedData(storageKeys.categories, null);
  const source = Array.isArray(savedCategories) && savedCategories.length ? savedCategories : defaultCategories;
  return source
    .slice()
    .sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));
}

function getMenuItems() {
  const savedMeals = readSavedData(storageKeys.meals, null);
  const source = Array.isArray(savedMeals) && savedMeals.length ? savedMeals : defaultMenuItems;
  return source.filter((item) => item.isAvailable !== false);
}

function getSettings() {
  return { ...defaultSettings, ...readSavedData(storageKeys.settings, defaultSettings) };
}

async function loadServerData() {
  const sources = ["api/menu.php", "menu-data.json?v=20260520-1", "database/seed.json?v=20260520-1"];

  for (const source of sources) {
    try {
      const response = await fetch(source, { cache: "no-store" });
      if (!response.ok) continue;
      const data = await response.json();

      if (!Array.isArray(data.categories) || !data.categories.length || !Array.isArray(data.meals) || !data.meals.length) continue;

      settings = { ...defaultSettings, ...(data.settings || {}) };
      categories = data.categories;
      menuItems = data.meals;
      localStorage.setItem(storageKeys.settings, JSON.stringify(settings));
      localStorage.setItem(storageKeys.categories, JSON.stringify(categories));
      localStorage.setItem(storageKeys.meals, JSON.stringify(menuItems));
      return true;
    } catch {
      // Vercel does not execute PHP, so fall back to the committed seed JSON.
    }
  }

  return false;
}

function formatPrice(price) {
  const raw = String(price).trim();
  if (!raw) return "";
  if (/iqd|دينار|د\.ع/i.test(raw)) return raw;
  const number = Number(raw.replace(/[^0-9.]/g, ""));
  return number ? `${number.toLocaleString("en-US")} IQD` : raw;
}

const exactTranslations = {
  "الأطباق الرئيسية": { en: "Main Dishes", ku: "خواردنی سەرەکی" },
  "حلويات": { en: "Desserts", ku: "شیرینی" },
  "مشروبات": { en: "Drinks", ku: "خواردنەوە" },
  "ساندويتشات": { en: "Sandwiches", ku: "ساندویچ" },
  "مقبلات": { en: "Appetizers", ku: "پێشخواردن" },
  "السلطات والمقبلات الباردة": { en: "Cold Salads and Appetizers", ku: "زەڵاتە و پێشخواردنی سارد" },
};

const wordTranslations = {
  en: {
    دجاج: "Chicken",
    لحم: "Beef",
    سمك: "Fish",
    مشوي: "Grilled",
    مقلي: "Fried",
    برجر: "Burger",
    شاورما: "Shawarma",
    سلطة: "Salad",
    السلطات: "Salads",
    مقبلات: "Appetizers",
    المقبلات: "Appetizers",
    الباردة: "Cold",
    حارة: "Hot",
    باردة: "Cold",
    كيك: "Cake",
    عصير: "Juice",
    قهوة: "Coffee",
    شاي: "Tea",
    ماء: "Water",
    بطاطا: "Potatoes",
    رز: "Rice",
    جبن: "Cheese",
  },
  ku: {
    دجاج: "مریشک",
    لحم: "گۆشت",
    سمك: "ماسی",
    مشوي: "برژاو",
    مقلي: "سوورکراوە",
    برجر: "بەرگەر",
    شاورما: "شاورما",
    سلطة: "زەڵاتە",
    السلطات: "زەڵاتەکان",
    مقبلات: "پێشخواردن",
    المقبلات: "پێشخواردن",
    الباردة: "ساردەکان",
    حارة: "گەرم",
    باردة: "سارد",
    كيك: "کێک",
    عصير: "شەربەت",
    قهوة: "قاوە",
    شاي: "چا",
    ماء: "ئاو",
    بطاطا: "پەتاتە",
    رز: "برنج",
    جبن: "پەنیر",
  },
};

function readTranslationCache() {
  return readSavedData(storageKeys.translations, {});
}

function saveTranslationCache(cache) {
  localStorage.setItem(storageKeys.translations, JSON.stringify(cache));
}

function translateArabicLocal(text, language) {
  const clean = text.trim();
  if (!clean) return "";
  if (exactTranslations[clean]) return exactTranslations[clean][language];
  const translated = clean
    .split(/\s+/)
    .map((word) => wordTranslations[language][word] || word)
    .join(" ");
  return translated === clean ? clean : translated;
}

async function translateArabic(text, language) {
  const clean = text.trim();
  if (!clean) return "";
  const cacheKey = `${language}:${clean}`;
  const cache = readTranslationCache();

  if (cache[cacheKey]) return cache[cacheKey];

  const localTranslation = translateArabicLocal(clean, language);
  if (localTranslation !== clean) {
    cache[cacheKey] = localTranslation;
    saveTranslationCache(cache);
    return localTranslation;
  }

  try {
    const targetLanguage = language === "ku" ? "ckb" : language;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(clean)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Translation failed");
    const data = await response.json();
    const translated = data?.[0]?.map((part) => part?.[0] || "").join("").trim();

    if (translated) {
      cache[cacheKey] = translated;
      saveTranslationCache(cache);
      return translated;
    }
  } catch {
    // Keep Arabic if online translation is unavailable.
  }

  cache[cacheKey] = clean;
  saveTranslationCache(cache);
  return clean;
}

function hasArabic(text) {
  return /[\u0600-\u06FF]/.test(text || "");
}

async function translateExistingData() {
  const savedCategories = readSavedData(storageKeys.categories, null);
  const savedMeals = readSavedData(storageKeys.meals, null);
  let changed = false;

  if (savedCategories) {
    for (const category of savedCategories) {
      const nameAr = category.nameAr || (hasArabic(category.name) ? category.name : "");
      if (!nameAr) continue;
      category.nameAr = nameAr;
      category.name = await translateArabic(nameAr, "en");
      category.nameKu = await translateArabic(nameAr, "ku");
      changed = true;
    }
    if (changed) localStorage.setItem(storageKeys.categories, JSON.stringify(savedCategories));
  }

  changed = false;
  if (savedMeals) {
    for (const meal of savedMeals) {
      const nameAr = meal.nameAr || (hasArabic(meal.name) ? meal.name : "");
      const descriptionAr = meal.descriptionAr || (hasArabic(meal.description) ? meal.description : "");

      if (nameAr) {
        meal.nameAr = nameAr;
        meal.name = await translateArabic(nameAr, "en");
        meal.nameKu = await translateArabic(nameAr, "ku");
        changed = true;
      }

      if (descriptionAr) {
        meal.descriptionAr = descriptionAr;
        meal.description = await translateArabic(descriptionAr, "en");
        meal.descriptionKu = await translateArabic(descriptionAr, "ku");
        changed = true;
      }
    }
    if (changed) localStorage.setItem(storageKeys.meals, JSON.stringify(savedMeals));
  }
}

const translations = {
  en: {
    eyebrow: "Digital Restaurant Menu",
    heroCopy: "Premium grilled dishes, desserts, drinks, and fresh appetizers.",
    poweredBy: "Powered by",
    add: "Add",
    added: "Added to order",
  },
  ar: {
    eyebrow: "منيو المطعم الرقمي",
    heroCopy: "أطباق رئيسية فاخرة، حلويات، مشروبات، ومقبلات طازجة.",
    poweredBy: "مشغل بواسطة",
    add: "إضافة",
    added: "تمت الإضافة إلى الطلب",
  },
  ku: {
    eyebrow: "مینیوی ڕێستورانت",
    heroCopy: "خواردنی سەرەکی، شیرینی، خواردنەوە و پێشخواردنی تازە.",
    poweredBy: "پشتگیری کراوە لەلایەن",
    add: "زیادکردن",
    added: "زیادکرا بۆ داواکاری",
  },
};

const tabsContainer = document.querySelector("#category-tabs");
const categoryCardsContainer = document.querySelector("#category-cards");
const menuSectionsContainer = document.querySelector("#menu-sections");
const languageButtons = document.querySelectorAll("[data-lang]");
const toast = document.querySelector("#toast");
let currentLanguage = "ku";
let toastTimer;
let categories = getCategories();
let menuItems = getMenuItems();
let settings = getSettings();

function getText(item, key) {
  const localized = currentLanguage === "ku" ? item[`${key}Ku`] : currentLanguage === "ar" ? item[`${key}Ar`] : item[key];
  return localized || item[`${key}Ar`] || item[`${key}Ku`] || item[key] || "";
}

function renderTabs() {
  tabsContainer.innerHTML = categories
    .map(
      (category, index) => `
        <button class="tab ${index === 0 ? "active" : ""}" type="button" data-target="${category.id}">
          <img src="${category.icon}" alt="" aria-hidden="true">
          <span>${getText(category, "name")}</span>
        </button>
      `,
    )
    .join("");
}

function renderCategoryCards() {
  categoryCardsContainer.innerHTML = categories
    .map(
      (category) => `
        <button class="category-card" type="button" data-target="${category.id}">
          <img src="${category.icon}" alt="" aria-hidden="true">
          <strong>${getText(category, "name")}</strong>
        </button>
      `,
    )
    .join("");
}

function renderMenuSections() {
  menuSectionsContainer.innerHTML = categories
    .map((category) => {
      const items = menuItems.filter((item) => item.category === category.id);

      return `
        <section class="menu-section" id="${category.id}" data-section="${category.id}">
          <div class="section-heading">
            <h2>${getText(category, "name")}</h2>
          </div>
          <div class="product-grid">
            ${items.map(renderFoodCard).join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderFoodCard(item) {
  const name = getText(item, "name");
  const description = getText(item, "description");

  return `
    <article class="food-card">
      <img src="${item.image}" alt="${name}" loading="lazy">
      <div class="food-info">
        <div class="food-copy">
          <h3>${name}</h3>
          <p>${description}</p>
          <span class="price">${formatPrice(item.price)}</span>
        </div>
      </div>
    </article>
  `;
}

function bindNavigation() {
  document.querySelectorAll("[data-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const section = document.querySelector(`#${button.dataset.target}`);
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveTab(button.dataset.target);
    });
  });
}

function bindAddButtons() {
}

function setActiveTab(categoryId) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.target === categoryId);
  });
}

function observeSections() {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActiveTab(visible.target.dataset.section);
      }
    },
    { rootMargin: "-18% 0px -60% 0px", threshold: [0.1, 0.3, 0.6] },
  );

  document.querySelectorAll(".menu-section").forEach((section) => observer.observe(section));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 1800);
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.body.classList.toggle("rtl", currentLanguage === "ar" || currentLanguage === "ku");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translations[currentLanguage][element.dataset.i18n] || element.textContent;
  });
  const restaurantName = currentLanguage === "ku" ? (settings.nameKu || settings.name) : currentLanguage === "ar" ? (settings.nameAr || settings.name) : settings.name;
  const siteName = document.querySelector("#site-name");
  const footerPowered = document.querySelector("#footer-powered");
  if (siteName) siteName.textContent = restaurantName;
  if (footerPowered) footerPowered.textContent = `${translations[currentLanguage].poweredBy} ${restaurantName}`;
  languageButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === currentLanguage);
  });
}

function renderApp() {
  categories = categories.length ? categories.slice().sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0)) : getCategories();
  menuItems = menuItems.length ? menuItems.filter((item) => item.isAvailable !== false) : getMenuItems();
  settings = { ...defaultSettings, ...getSettings(), ...settings };
  applyLanguage();
  renderTabs();
  renderCategoryCards();
  renderMenuSections();
  bindNavigation();
  bindAddButtons();
  observeSections();
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentLanguage = button.dataset.lang;
    renderApp();
  });
});

async function initializeMenu() {
  await loadServerData();
  await translateExistingData();
  renderApp();
}

initializeMenu();
