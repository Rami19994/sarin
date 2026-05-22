const imageBase = "assets/images";
const storageKeys = {
  categories: "restaurantMenuCategories",
  meals: "restaurantMenuMeals",
  auth: "restaurantAdminAuthenticated",
  settings: "restaurantMenuSettings",
  translations: "restaurantTranslationCache",
  pendingSync: "restaurantMenuPendingSync",
  updatedAt: "restaurantMenuUpdatedAt",
};
const adminUser = "admin";
const adminPasswordHash = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";
const defaultSettings = {
  name: "Sareen Restaurant",
  nameAr: "مطعم سارين",
  nameKu: "ڕێستورانتی سارین",
  logo: `${imageBase}/logo.svg`,
};
const defaultMealImage = `${imageBase}/foods/placeholder.svg`;
const emptyImage = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const defaultCategories = [
  { id: "main-dishes", name: "Main Dishes", nameAr: "الأطباق الرئيسية", nameKu: "خواردنی سەرەکی", icon: `${imageBase}/categories/main-dishes.svg`, displayOrder: 1 },
  { id: "desserts", name: "Desserts", nameAr: "حلويات", nameKu: "شیرینی", icon: `${imageBase}/categories/desserts.svg`, displayOrder: 2 },
  { id: "drinks", name: "Drinks", nameAr: "مشروبات", nameKu: "خواردنەوە", icon: `${imageBase}/categories/drinks.svg`, displayOrder: 3 },
  { id: "sandwiches", name: "Sandwiches", nameAr: "ساندويتشات", nameKu: "ساندویچ", icon: `${imageBase}/categories/sandwiches.svg`, displayOrder: 4 },
  { id: "appetizers", name: "Appetizers", nameAr: "مقبلات", nameKu: "پێشخواردن", icon: `${imageBase}/categories/appetizers.svg`, displayOrder: 5 },
  { id: "cold-appetizers", name: "Cold Salads and Appetizers", nameAr: "السلطات والمقبلات الباردة", nameKu: "زەڵاتە و پێشخواردنی سارد", icon: `${imageBase}/categories/appetizers.svg`, displayOrder: 6 },
  { id: "hot-appetizers", name: "Hot Appetizers", nameAr: "المقبلات الحارة", nameKu: "پێشخواردنی گەرم", icon: `${imageBase}/categories/appetizers.svg`, displayOrder: 7 },
];

const defaultMeals = [
  { id: 1, name: "American Fillet Steak", nameAr: "ستيك لحم فيليه أمريكي", nameKu: "ستێکی فیلێی ئەمریکی", price: "25,000 IQD", category: "main-dishes", image: `${imageBase}/foods/steak.svg`, description: "Grilled fillet with vegetables and sauce", descriptionAr: "فيليه مشوي مع خضار وصوص خاص", descriptionKu: "فیلێی برژاو لەگەڵ سەوزە و سۆسی تایبەت", isAvailable: true },
  { id: 2, name: "Lamb Chops", nameAr: "شرائح لحم الضأن", nameKu: "پارچە گۆشتی بەرخ", price: "28,000 IQD", category: "main-dishes", image: `${imageBase}/foods/lamb-chops.svg`, description: "Charcoal grilled lamb with potatoes", descriptionAr: "لحم ضأن مشوي على الفحم مع بطاطا", descriptionKu: "گۆشتی بەرخی برژاو لەگەڵ پەتاتە", isAvailable: true },
  { id: 3, name: "Grilled Salmon Fillet", nameAr: "فيليه سلمون مشوي", nameKu: "فیلێی سالمۆنی برژاو", price: "24,000 IQD", category: "main-dishes", image: `${imageBase}/foods/salmon.svg`, description: "Salmon with rice and lemon butter", descriptionAr: "سلمون مع أرز وصوص الليمون", descriptionKu: "سالمۆن لەگەڵ برنج و سۆسی لیمۆ", isAvailable: true },
  { id: 4, name: "Grilled Prawns", nameAr: "روبيان مشوي", nameKu: "ڕۆبیانی برژاو", price: "32,000 IQD", category: "main-dishes", image: `${imageBase}/foods/prawns.svg`, description: "Prawns with herbs and citrus", descriptionAr: "روبيان بالأعشاب والليمون", descriptionKu: "ڕۆبیان بە گیای بۆنخۆش و لیمۆ", isAvailable: true },
  { id: 5, name: "Cheesecake", nameAr: "تشيز كيك", nameKu: "چیزکێک", price: "9,000 IQD", category: "desserts", image: `${imageBase}/foods/cheesecake.svg`, description: "Creamy cheesecake with berry sauce", descriptionAr: "تشيز كيك كريمي مع صوص التوت", descriptionKu: "چیزکێکی کرێمی لەگەڵ سۆسی توت", isAvailable: true },
  { id: 6, name: "Chocolate Cake", nameAr: "كيك الشوكولاتة", nameKu: "کێکی چۆکڵاتە", price: "8,000 IQD", category: "desserts", image: `${imageBase}/foods/chocolate-cake.svg`, description: "Dark chocolate layered cake", descriptionAr: "طبقات كيك الشوكولاتة الداكنة", descriptionKu: "چینەکانی کێکی چۆکڵاتەی ڕەش", isAvailable: true },
  { id: 7, name: "Lemon Mint", nameAr: "ليمون بالنعناع", nameKu: "لیمۆ و نەعنا", price: "6,000 IQD", category: "drinks", image: `${imageBase}/foods/lemon-mint.svg`, description: "Fresh lemon and mint over ice", descriptionAr: "ليمون ونعناع طازج مع الثلج", descriptionKu: "لیمۆ و نەعنای تازە لەگەڵ بەفر", isAvailable: true },
  { id: 8, name: "Iced Coffee", nameAr: "قهوة مثلجة", nameKu: "قاوەی سارد", price: "7,000 IQD", category: "drinks", image: `${imageBase}/foods/iced-coffee.svg`, description: "Espresso, milk, and ice", descriptionAr: "إسبريسو وحليب وثلج", descriptionKu: "ئیسپرێسۆ و شیر و بەفر", isAvailable: true },
  { id: 9, name: "Chicken Shawarma", nameAr: "شاورما دجاج", nameKu: "شاورمای مریشک", price: "8,000 IQD", category: "sandwiches", image: `${imageBase}/foods/shawarma.svg`, description: "Garlic sauce, pickles, and fries", descriptionAr: "ثوم ومخلل وبطاطا", descriptionKu: "سیر و ترشی و پەتاتە", isAvailable: true },
  { id: 10, name: "Beef Burger", nameAr: "برجر لحم", nameKu: "بەرگەر گۆشت", price: "12,000 IQD", category: "sandwiches", image: `${imageBase}/foods/burger.svg`, description: "Cheese, lettuce, and house sauce", descriptionAr: "جبن وخس وصوص خاص", descriptionKu: "پەنیر و کاهوو و سۆسی تایبەت", isAvailable: true },
  { id: 11, name: "Hummus Plate", nameAr: "طبق حمص", nameKu: "دەوری حەموس", price: "7,000 IQD", category: "appetizers", image: `${imageBase}/foods/hummus.svg`, description: "Olive oil, paprika, and bread", descriptionAr: "زيت زيتون وبابريكا وخبز", descriptionKu: "زەیتی زەیتون و پاپریکا و نان", isAvailable: true },
  { id: 12, name: "Caesar Salad", nameAr: "سلطة سيزر", nameKu: "زەڵاتەی سیزەر", price: "11,000 IQD", category: "appetizers", image: `${imageBase}/foods/caesar.svg`, description: "Romaine, parmesan, and croutons", descriptionAr: "خس روماني وبارميزان وخبز محمص", descriptionKu: "کاهوو و پارمیزان و نانی برژاو", isAvailable: true },
  { id: 1001, name: "Caesar", nameAr: "سيزر", nameKu: "سیزەر", price: "10,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1002, name: "Tabbouleh", nameAr: "تبولة", nameKu: "تەبوولە", price: "7,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1003, name: "Fattoush", nameAr: "فتوش", nameKu: "فەتووش", price: "7,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1004, name: "Greek Salad", nameAr: "يونانية", nameKu: "یۆنانی", price: "8,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1005, name: "Arugula Salad", nameAr: "جرجير", nameKu: "جەرجیر", price: "8,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1006, name: "Shrimp Salad", nameAr: "سلطة روبيان", nameKu: "زەڵاتەی ڕۆبیان", price: "15,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1007, name: "Steak Salad", nameAr: "ستيك سلط", nameKu: "زەڵاتەی ستێک", price: "15,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1008, name: "Crab Salad", nameAr: "كراب سلط", nameKu: "زەڵاتەی کراب", price: "15,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1009, name: "Barmania", nameAr: "برمانية", nameKu: "برمانیە", price: "7,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1010, name: "Sareen Salad", nameAr: "سلطة سارين", nameKu: "زەڵاتەی سارین", price: "15,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1011, name: "Hummus with Tahini", nameAr: "حمص بالطحينة", nameKu: "حەموس بە تەحینە", price: "5,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1012, name: "Mutabbal", nameAr: "متبل", nameKu: "موتەبەل", price: "5,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1013, name: "Eggplant Dip", nameAr: "باذنجانية", nameKu: "باینجانیە", price: "5,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1014, name: "Muhammara", nameAr: "محمرة", nameKu: "موحەمەرە", price: "5,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1015, name: "Labneh", nameAr: "لبنة", nameKu: "لەبنە", price: "5,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1016, name: "Baba Ghanoush", nameAr: "بابا غنوج", nameKu: "بابا غەنوج", price: "5,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1017, name: "Cacik", nameAr: "جاجيك", nameKu: "جاجیک", price: "5,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1018, name: "Olive Dip", nameAr: "زيتونية", nameKu: "زەیتوونیە", price: "5,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1019, name: "VIP Cheese Board", nameAr: "دفة اجبان vip", nameKu: "تەختەی پەنیر VIP", price: "20,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1020, name: "Feta Cheese and Olive Plate", nameAr: "صحن جبنة فيتا وزيتون", nameKu: "پڵێتی پەنیری فێتا و زەیتون", price: "8,000 IQD", category: "cold-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1101, name: "Dynamite Shrimp", nameAr: "ديناميت شرامب", nameKu: "دینامایت شرەمپ", price: "12,000 IQD", category: "hot-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1102, name: "Finger", nameAr: "فنكر", nameKu: "فینگەر", price: "5,000 IQD", category: "hot-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1103, name: "Spicy Potatoes", nameAr: "بطاطا حارة", nameKu: "پەتاتەی تیژ", price: "7,000 IQD", category: "hot-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1104, name: "Provencal Potatoes", nameAr: "بطاطا بروفنسال", nameKu: "پەتاتەی پرۆڤنسال", price: "7,000 IQD", category: "hot-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1105, name: "Chicken Liver", nameAr: "كبدة دجاج", nameKu: "جەرگی مریشک", price: "10,000 IQD", category: "hot-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1106, name: "Hummus with Meat", nameAr: "حمص باللحمة", nameKu: "حەموس بە گۆشت", price: "9,000 IQD", category: "hot-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1107, name: "Toast Bread with Albino Sauce", nameAr: "خبز توست بصوص البينو", nameKu: "نانی تۆست بە سۆسی ئەلبینۆ", price: "9,000 IQD", category: "hot-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1108, name: "Buffalo Wings", nameAr: "اجنحة بافالو", nameKu: "باڵی بافالۆ", price: "10,000 IQD", category: "hot-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1109, name: "Barbecue Wings", nameAr: "اجنحه باربيكيو", nameKu: "باڵی باربیکیۆ", price: "10,000 IQD", category: "hot-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
  { id: 1110, name: "Tanboura", nameAr: "طنبورة", nameKu: "تەنبورە", price: "18,000 IQD", category: "hot-appetizers", image: `${imageBase}/foods/placeholder.svg`, description: "", descriptionAr: "", descriptionKu: "", isAvailable: true },
];

const translations = {
  en: {
    eyebrow: "Admin Dashboard",
    title: "Menu Management",
    viewMenu: "View Menu",
    logout: "Logout",
    loginEyebrow: "Secure Admin",
    loginTitle: "Admin Login",
    username: "Username",
    password: "Password",
    loginButton: "Login",
    loginFailed: "Wrong username or password",
    settingsTitle: "Website Settings",
    restaurantName: "Restaurant Name",
    restaurantNameAr: "Restaurant Name Arabic",
    restaurantNameKu: "Restaurant Name Kurdish",
    restaurantLogo: "Restaurant Logo",
    saveSettings: "Save Website Settings",
    mealFormTitle: "Add New Meal",
    editMealTitle: "Edit Meal",
    categoryFormTitle: "Manage Categories",
    clear: "Clear",
    mealName: "Meal Name Arabic",
    price: "Price",
    category: "Category",
    availability: "Availability",
    available: "Available",
    notAvailable: "Not Available",
    description: "Description Arabic optional",
    foodImage: "Food Image",
    removeImage: "Delete image only",
    removeLogo: "Delete logo only",
    saveMeal: "Save Meal",
    categoryName: "Category Name Arabic",
    categorySlug: "Slug / ID",
    displayOrder: "Display Order",
    categoryIcon: "Category Icon",
    saveCategory: "Save Category",
    allMeals: "All Meals",
    allCategories: "All Categories",
    image: "Image",
    actions: "Actions",
    sortName: "Sort by name",
    sortPrice: "Sort by price",
    sortCategory: "Sort by category",
    all: "All Categories",
    edit: "Edit",
    delete: "Delete",
    saved: "Saved successfully",
    deleted: "Deleted successfully",
    imageDeleted: "Image deleted",
    logoDeleted: "Logo deleted",
    required: "Please fill the required fields",
    confirmMealDelete: "Delete this meal?",
    confirmCategoryDelete: "Delete this category and its meals?",
  },
  ar: {
    eyebrow: "لوحة التحكم",
    title: "إدارة المنيو",
    viewMenu: "عرض المنيو",
    logout: "تسجيل الخروج",
    loginEyebrow: "دخول آمن",
    loginTitle: "تسجيل دخول الأدمن",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    loginButton: "دخول",
    loginFailed: "اسم المستخدم أو كلمة المرور غير صحيحة",
    settingsTitle: "إعدادات الموقع",
    restaurantName: "اسم المطعم",
    restaurantNameAr: "اسم المطعم بالعربي",
    restaurantNameKu: "اسم المطعم بالكردي",
    restaurantLogo: "شعار المطعم",
    saveSettings: "حفظ إعدادات الموقع",
    mealFormTitle: "إضافة وجبة جديدة",
    editMealTitle: "تعديل الوجبة",
    categoryFormTitle: "إدارة الفئات",
    clear: "مسح",
    mealName: "اسم الوجبة بالعربي",
    price: "السعر",
    category: "الفئة",
    availability: "الحالة",
    available: "متوفر",
    notAvailable: "غير متوفر",
    description: "الوصف بالعربي اختياري",
    foodImage: "صورة الوجبة",
    removeImage: "حذف الصورة فقط",
    removeLogo: "حذف اللوغو فقط",
    saveMeal: "حفظ الوجبة",
    categoryName: "اسم الفئة بالعربي",
    categorySlug: "المعرف",
    displayOrder: "ترتيب العرض",
    categoryIcon: "أيقونة الفئة",
    saveCategory: "حفظ الفئة",
    allMeals: "كل الوجبات",
    allCategories: "كل الفئات",
    image: "الصورة",
    actions: "إجراءات",
    sortName: "ترتيب حسب الاسم",
    sortPrice: "ترتيب حسب السعر",
    sortCategory: "ترتيب حسب الفئة",
    all: "كل الفئات",
    edit: "تعديل",
    delete: "حذف",
    saved: "تم الحفظ بنجاح",
    deleted: "تم الحذف بنجاح",
    imageDeleted: "تم حذف الصورة",
    logoDeleted: "تم حذف اللوغو",
    required: "يرجى تعبئة الحقول المطلوبة",
    confirmMealDelete: "هل تريد حذف هذه الوجبة؟",
    confirmCategoryDelete: "هل تريد حذف هذه الفئة وكل وجباتها؟",
  },
  ku: {
    eyebrow: "داشبۆردی ئەدمین",
    title: "بەڕێوەبردنی مینیو",
    viewMenu: "بینینی مینیو",
    logout: "چوونەدەرەوە",
    loginEyebrow: "چوونەژوورەوەی پارێزراو",
    loginTitle: "چوونەژوورەوەی ئەدمین",
    username: "ناوی بەکارهێنەر",
    password: "وشەی نهێنی",
    loginButton: "چوونەژوورەوە",
    loginFailed: "ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە",
    settingsTitle: "ڕێکخستنەکانی ماڵپەڕ",
    restaurantName: "ناوی ڕێستورانت",
    restaurantNameAr: "ناوی ڕێستورانت بە عەرەبی",
    restaurantNameKu: "ناوی ڕێستورانت بە کوردی",
    restaurantLogo: "لۆگۆی ڕێستورانت",
    saveSettings: "پاشەکەوتکردنی ڕێکخستنەکان",
    mealFormTitle: "زیادکردنی خواردنی نوێ",
    editMealTitle: "دەستکاریکردنی خواردن",
    categoryFormTitle: "بەڕێوەبردنی پۆلەکان",
    clear: "پاککردنەوە",
    mealName: "ناوی خواردن بە عەرەبی",
    price: "نرخ",
    category: "پۆل",
    availability: "دۆخ",
    available: "بەردەستە",
    notAvailable: "بەردەست نییە",
    description: "وەسف بە عەرەبی ئارەزوومەندانە",
    foodImage: "وێنەی خواردن",
    removeImage: "تەنها وێنە بسڕەوە",
    removeLogo: "تەنها لۆگۆ بسڕەوە",
    saveMeal: "پاشەکەوتکردنی خواردن",
    categoryName: "ناوی پۆل بە عەرەبی",
    categorySlug: "ناسنامە",
    displayOrder: "ڕیزبەندی پیشاندان",
    categoryIcon: "ئایکۆنی پۆل",
    saveCategory: "پاشەکەوتکردنی پۆل",
    allMeals: "هەموو خواردنەکان",
    allCategories: "هەموو پۆلەکان",
    image: "وێنە",
    actions: "کردارەکان",
    sortName: "ڕیزکردن بە ناو",
    sortPrice: "ڕیزکردن بە نرخ",
    sortCategory: "ڕیزکردن بە پۆل",
    all: "هەموو پۆلەکان",
    edit: "دەستکاری",
    delete: "سڕینەوە",
    saved: "بە سەرکەوتوویی پاشەکەوت کرا",
    deleted: "بە سەرکەوتوویی سڕایەوە",
    imageDeleted: "وێنەکە سڕایەوە",
    logoDeleted: "لۆگۆکە سڕایەوە",
    required: "تکایە خانە پێویستەکان پڕ بکەرەوە",
    confirmMealDelete: "ئەم خواردنە بسڕدرێتەوە؟",
    confirmCategoryDelete: "ئەم پۆلە و خواردنەکانی بسڕدرێنەوە؟",
  },
};

let categories = readData(storageKeys.categories, defaultCategories);
let meals = readData(storageKeys.meals, defaultMeals);
let settings = { ...defaultSettings, ...readData(storageKeys.settings, defaultSettings) };
let currentLanguage = "ku";
let mealImageValue = defaultMealImage;
let categoryIconValue = "assets/images/categories/main-dishes.svg";
let restaurantLogoValue = settings.logo;
let toastTimer;
let serverSyncRunning = false;

const mealForm = document.querySelector("#meal-form");
const categoryForm = document.querySelector("#category-form");
const mealsTable = document.querySelector("#meals-table");
const categoryList = document.querySelector("#category-list");
const mealCategory = document.querySelector("#meal-category");
const filterCategory = document.querySelector("#filter-category");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const mealPreview = document.querySelector("#meal-preview");
const categoryPreview = document.querySelector("#category-preview");
const toast = document.querySelector("#toast");
const loginForm = document.querySelector("#login-form");
const loginError = document.querySelector("#login-error");
const settingsForm = document.querySelector("#settings-form");
const restaurantLogoPreview = document.querySelector("#restaurant-logo-preview");
const adminLanguageButtons = document.querySelectorAll("[data-admin-lang]");

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hashBuffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function serverLogin(username, passwordHash) {
  try {
    const response = await fetch("api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, passwordHash }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function serverLogout() {
  try {
    await fetch("api/logout.php", { method: "POST" });
  } catch {
    // Direct file opening still uses sessionStorage fallback.
  }
}

function isAuthenticated() {
  return sessionStorage.getItem(storageKeys.auth) === "true";
}

function setAuthenticated(value) {
  if (value) {
    sessionStorage.setItem(storageKeys.auth, "true");
    document.body.classList.remove("auth-locked");
  } else {
    sessionStorage.removeItem(storageKeys.auth);
    document.body.classList.add("auth-locked");
  }
}

function readData(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function hasPendingLocalChanges() {
  return localStorage.getItem(storageKeys.pendingSync) === "true";
}

async function saveData(sync = true) {
  localStorage.setItem(storageKeys.categories, JSON.stringify(categories));
  localStorage.setItem(storageKeys.meals, JSON.stringify(meals));
  localStorage.setItem(storageKeys.settings, JSON.stringify(settings));
  localStorage.setItem(storageKeys.updatedAt, String(Date.now()));
  if (!sync) return true;
  localStorage.setItem(storageKeys.pendingSync, "true");
  const synced = await syncServerData();
  if (synced) localStorage.setItem(storageKeys.pendingSync, "false");
  return synced;
}

async function loadServerData() {
  if (hasPendingLocalChanges()) return false;

  try {
    const response = await fetch("api/menu.php", { cache: "no-store" });
    if (!response.ok) return false;
    const data = await response.json();

    if (data.settings) settings = { ...defaultSettings, ...data.settings };
    if (Array.isArray(data.categories) && data.categories.length) categories = data.categories;
    if (Array.isArray(data.meals) && data.meals.length) meals = data.meals;
    return true;
  } catch {
    return false;
  }
}

async function syncServerData() {
  if (serverSyncRunning) return false;
  serverSyncRunning = true;

  try {
    const response = await fetch("api/admin-sync.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings, categories, meals }),
    });

    if (!response.ok) return false;
    const data = await response.json();
    if (!data.menu) return false;

    settings = { ...defaultSettings, ...data.menu.settings };
    categories = data.menu.categories || [];
    meals = data.menu.meals || [];
    localStorage.setItem(storageKeys.categories, JSON.stringify(categories));
    localStorage.setItem(storageKeys.meals, JSON.stringify(meals));
    localStorage.setItem(storageKeys.settings, JSON.stringify(settings));
    localStorage.setItem(storageKeys.updatedAt, String(Date.now()));
    return true;
  } catch {
    // Direct file opening still works with localStorage fallback.
    return false;
  } finally {
    serverSyncRunning = false;
  }
}

function sortedCategories() {
  return categories
    .map((category) => ({ ...(defaultCategories.find((item) => item.id === category.id) || {}), ...category }))
    .slice()
    .sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));
}

function slugify(value) {
  const arabicMap = {
    ا: "a",
    أ: "a",
    إ: "i",
    آ: "a",
    ب: "b",
    پ: "p",
    ت: "t",
    ث: "th",
    ج: "j",
    چ: "ch",
    ح: "h",
    خ: "kh",
    د: "d",
    ذ: "dh",
    ر: "r",
    ز: "z",
    ژ: "zh",
    س: "s",
    ش: "sh",
    ص: "s",
    ض: "d",
    ط: "t",
    ظ: "z",
    ع: "a",
    غ: "gh",
    ف: "f",
    ڤ: "v",
    ق: "q",
    ك: "k",
    ک: "k",
    گ: "g",
    ل: "l",
    م: "m",
    ن: "n",
    ه: "h",
    ة: "h",
    و: "w",
   ؤ: "w",
    ي: "y",
    ى: "a",
    ئ: "y",
    ء: "",
    ە: "e",
    ێ: "e",
    ی: "y",
    ڕ: "r",
    ڵ: "l",
    وو: "w",
  };
  const transliterated = value
    .trim()
    .split("")
    .map((char) => arabicMap[char] ?? char)
    .join("");

  return transliterated
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function uniqueCategoryId(baseId, originalId = "") {
  const fallbackId = baseId || makeId("category");
  let id = fallbackId;
  let counter = 2;

  while (categories.some((category) => category.id === id && category.id !== originalId)) {
    id = `${fallbackId}-${counter}`;
    counter += 1;
  }

  return id;
}

function moneyNumber(price) {
  return Number(String(price).replace(/[^0-9.]/g, "")) || 0;
}

function formatPrice(price) {
  const raw = String(price).trim();
  if (!raw) return "";
  if (/iqd|دينار|د\.ع/i.test(raw)) return raw;
  const number = moneyNumber(raw);
  return number ? `${number.toLocaleString("en-US")} IQD` : raw;
}

function categoryName(id) {
  const category = categories.find((item) => item.id === id);
  return category ? localizedText(category, "name") : id;
}

function localizedText(item, key) {
  const localized = currentLanguage === "ku" ? item[`${key}Ku`] : currentLanguage === "ar" ? item[`${key}Ar`] : item[key];
  return localized || item[`${key}Ar`] || item[`${key}Ku`] || item[key] || "";
}

const exactTranslations = {
  "الأطباق الرئيسية": { en: "Main Dishes", ku: "خواردنی سەرەکی" },
  "حلويات": { en: "Desserts", ku: "شیرینی" },
  "مشروبات": { en: "Drinks", ku: "خواردنەوە" },
  "ساندويتشات": { en: "Sandwiches", ku: "ساندویچ" },
  "مقبلات": { en: "Appetizers", ku: "پێشخواردن" },
  "السلطات والمقبلات الباردة": { en: "Cold Salads and Appetizers", ku: "زەڵاتە و پێشخواردنی سارد" },
  "ستيك لحم فيليه أمريكي": { en: "American Fillet Steak", ku: "ستێکی فیلێی ئەمریکی" },
  "شرائح لحم الضأن": { en: "Lamb Chops", ku: "پارچە گۆشتی بەرخ" },
  "فيليه سلمون مشوي": { en: "Grilled Salmon Fillet", ku: "فیلێی سالمۆنی برژاو" },
  "روبيان مشوي": { en: "Grilled Prawns", ku: "ڕۆبیانی برژاو" },
  "تشيز كيك": { en: "Cheesecake", ku: "چیزکێک" },
  "كيك الشوكولاتة": { en: "Chocolate Cake", ku: "کێکی چۆکڵاتە" },
  "ليمون بالنعناع": { en: "Lemon Mint", ku: "لیمۆ و نەعنا" },
  "قهوة مثلجة": { en: "Iced Coffee", ku: "قاوەی سارد" },
  "شاورما دجاج": { en: "Chicken Shawarma", ku: "شاورمای مریشک" },
  "برجر لحم": { en: "Beef Burger", ku: "بەرگەر گۆشت" },
  "طبق حمص": { en: "Hummus Plate", ku: "دەوری حەموس" },
  "سلطة سيزر": { en: "Caesar Salad", ku: "زەڵاتەی سیزەر" },
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
  return readData(storageKeys.translations, {});
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
    // If online translation is unavailable, keep Arabic so the item never disappears.
  }

  cache[cacheKey] = clean;
  saveTranslationCache(cache);
  return clean;
}

function hasArabic(text) {
  return /[\u0600-\u06FF]/.test(text || "");
}

async function translateExistingData() {
  let changed = false;

  for (const category of categories) {
    const nameAr = category.nameAr || (hasArabic(category.name) ? category.name : "");
    if (!nameAr) continue;

    category.nameAr = nameAr;
    category.name = await translateArabic(nameAr, "en");
    category.nameKu = await translateArabic(nameAr, "ku");
    changed = true;
  }

  for (const meal of meals) {
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

  if (changed) saveData(false);
}

function getMessage(key) {
  return translations[currentLanguage][key];
}

function renderCategoryOptions() {
  const options = sortedCategories().map((category) => `<option value="${category.id}">${localizedText(category, "name")}</option>`).join("");
  mealCategory.innerHTML = options;
  filterCategory.innerHTML = `<option value="all">${getMessage("all")}</option>${options}`;
}

function renderMealsTable() {
  const search = searchInput.value.trim().toLowerCase();
  const filter = filterCategory.value;
  const sort = sortSelect.value;
  let visibleMeals = meals.slice();

  if (search) {
    visibleMeals = visibleMeals.filter((meal) => [meal.nameAr, meal.nameKu, meal.name].some((name) => String(name || "").toLowerCase().includes(search)));
  }

  if (filter && filter !== "all") {
    visibleMeals = visibleMeals.filter((meal) => meal.category === filter);
  }

  visibleMeals.sort((a, b) => {
    if (sort === "price") return moneyNumber(a.price) - moneyNumber(b.price);
    if (sort === "category") return categoryName(a.category).localeCompare(categoryName(b.category));
    return localizedText(a, "name").localeCompare(localizedText(b, "name"));
  });

  mealsTable.innerHTML = visibleMeals
    .map(
      (meal) => `
        <tr>
          <td><img src="${meal.image}" alt="${localizedText(meal, "name")}"></td>
          <td>${localizedText(meal, "name")}</td>
          <td>${categoryName(meal.category)}</td>
          <td>${formatPrice(meal.price)}</td>
          <td><span class="status ${meal.isAvailable ? "" : "off"}">${meal.isAvailable ? getMessage("available") : getMessage("notAvailable")}</span></td>
          <td>
            <div class="row-actions">
              <button type="button" data-edit-meal="${meal.id}">${getMessage("edit")}</button>
              <button class="delete" type="button" data-delete-meal="${meal.id}">${getMessage("delete")}</button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("");
}

function renderCategoriesList() {
  categoryList.innerHTML = sortedCategories()
    .map(
      (category) => `
        <article class="category-item">
          <img src="${category.icon}" alt="${localizedText(category, "name")}">
          <div>
            <strong>${localizedText(category, "name")}</strong>
            <small>${category.id} · #${category.displayOrder}</small>
          </div>
          <div class="row-actions">
            <button type="button" data-edit-category="${category.id}">${getMessage("edit")}</button>
            <button class="delete" type="button" data-delete-category="${category.id}">${getMessage("delete")}</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function resetMealForm() {
  mealForm.reset();
  document.querySelector("#meal-id").value = "";
  mealImageValue = defaultMealImage;
  mealPreview.src = mealImageValue;
  document.querySelector("#meal-form-title").textContent = getMessage("mealFormTitle");
}

function resetCategoryForm() {
  categoryForm.reset();
  document.querySelector("#category-original-id").value = "";
  document.querySelector("#category-order").value = String(categories.length + 1);
  categoryIconValue = "assets/images/categories/main-dishes.svg";
  categoryPreview.src = categoryIconValue;
}

function setRestaurantLogoPreview(value) {
  restaurantLogoPreview.src = value || emptyImage;
  restaurantLogoPreview.classList.toggle("empty-preview", !value);
}

function renderAll() {
  document.querySelector("#restaurant-name").value = settings.name;
  document.querySelector("#restaurant-name-ar").value = settings.nameAr || "";
  document.querySelector("#restaurant-name-ku").value = settings.nameKu || "";
  restaurantLogoValue = settings.logo || "";
  setRestaurantLogoPreview(restaurantLogoValue);
  renderCategoryOptions();
  renderMealsTable();
  renderCategoriesList();
}

function fileToDataUrl(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(file);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 1800);
}

function ensureImageDeleteButton(id, preview, translationKey, wrapperClass) {
  let button = document.querySelector(`#${id}`);
  if (!button && preview?.parentElement) {
    button = document.createElement("button");
    button.className = "image-delete-button";
    button.id = id;
    button.type = "button";
    button.dataset.i18n = translationKey;
    button.textContent = getMessage(translationKey);
    preview.parentElement.appendChild(button);
  }
  preview?.parentElement?.classList.add(wrapperClass);
  return button;
}

function forceEnglishLogin() {
  const loginScreen = document.querySelector("#login-screen");
  const loginCard = document.querySelector("#login-form");
  if (!loginScreen || !loginCard) return;

  loginScreen.lang = "en";
  loginScreen.dir = "ltr";
  loginCard.dir = "ltr";

  loginCard.querySelector("p")?.replaceChildren(document.createTextNode("Secure Admin"));
  loginCard.querySelector("h1")?.replaceChildren(document.createTextNode("Admin Login"));
  document.querySelector("label[for='login-username'] span")?.replaceChildren(document.createTextNode("Username"));

  const labels = loginCard.querySelectorAll("label span");
  if (labels[0]) labels[0].textContent = "Username";
  if (labels[1]) labels[1].textContent = "Password";

  const button = loginCard.querySelector("button[type='submit']");
  if (button) button.textContent = "Login";
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.body.classList.toggle("rtl", currentLanguage === "ar" || currentLanguage === "ku");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = getMessage(element.dataset.i18n);
  });
  forceEnglishLogin();
  adminLanguageButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.adminLang === currentLanguage);
  });
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.querySelector("#login-username").value.trim();
  const password = document.querySelector("#login-password").value;
  const passwordHash = await sha256(password);

  if (username === adminUser && passwordHash === adminPasswordHash) {
    await serverLogin(username, passwordHash);
    loginError.textContent = "";
    loginForm.reset();
    setAuthenticated(true);
    showToast(getMessage("saved"));
    return;
  }

  loginError.textContent = translations.en.loginFailed;
});

document.querySelector("#logout-button").addEventListener("click", async () => {
  await serverLogout();
  setAuthenticated(false);
});

document.querySelector("#meal-image").addEventListener("change", (event) => {
  fileToDataUrl(event.target.files[0], (value) => {
    mealImageValue = value;
    mealPreview.src = value;
  });
});

const removeMealImageButton = ensureImageDeleteButton("remove-meal-image", mealPreview, "removeImage", "meal-image-preview");
if (removeMealImageButton) removeMealImageButton.addEventListener("click", async () => {
  const id = document.querySelector("#meal-id").value;
  mealImageValue = defaultMealImage;
  mealPreview.src = defaultMealImage;
  document.querySelector("#meal-image").value = "";

  if (id) {
    // Update only the image field for the selected meal; form edits stay untouched.
    meals = meals.map((item) => (String(item.id) === String(id) ? { ...item, image: defaultMealImage } : item));
    await saveData();
    renderMealsTable();
  }

  showToast(getMessage("imageDeleted"));
});

document.querySelector("#category-icon").addEventListener("change", (event) => {
  fileToDataUrl(event.target.files[0], (value) => {
    categoryIconValue = value;
    categoryPreview.src = value;
  });
});

document.querySelector("#restaurant-logo").addEventListener("change", (event) => {
  fileToDataUrl(event.target.files[0], (value) => {
    restaurantLogoValue = value;
    setRestaurantLogoPreview(value);
  });
});

const removeRestaurantLogoButton = ensureImageDeleteButton("remove-restaurant-logo", restaurantLogoPreview, "removeLogo", "logo-image-preview");
if (removeRestaurantLogoButton) removeRestaurantLogoButton.addEventListener("click", async () => {
  restaurantLogoValue = "";
  settings = { ...settings, logo: "" };
  setRestaurantLogoPreview(restaurantLogoValue);
  document.querySelector("#restaurant-logo").value = "";
  await saveData();
  showToast(getMessage("logoDeleted"));
});

settingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.querySelector("#restaurant-name").value.trim();

  if (!name) {
    showToast(getMessage("required"));
    return;
  }

  settings = {
    ...settings,
    name,
    nameAr: document.querySelector("#restaurant-name-ar").value.trim(),
    nameKu: document.querySelector("#restaurant-name-ku").value.trim(),
    logo: restaurantLogoValue,
  };
  await saveData();
  renderAll();
  showToast(getMessage("saved"));
});

document.querySelector("#category-name").addEventListener("input", (event) => {
  const slugInput = document.querySelector("#category-id");
  const originalId = document.querySelector("#category-original-id").value;
  slugInput.value = uniqueCategoryId(slugify(event.target.value), originalId);
});

mealForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = document.querySelector("#meal-id").value;
  const nameAr = document.querySelector("#meal-name").value.trim();
  const descriptionAr = document.querySelector("#meal-description").value.trim();
  const price = document.querySelector("#meal-price").value.trim();
  const category = mealCategory.value;

  if (!nameAr || !price || !category) {
    showToast(getMessage("required"));
    return;
  }

  const meal = {
    id: id || String(Date.now()),
    name: await translateArabic(nameAr, "en"),
    nameAr,
    nameKu: await translateArabic(nameAr, "ku"),
    price: formatPrice(price),
    category,
    image: mealImageValue,
    description: await translateArabic(descriptionAr, "en"),
    descriptionAr,
    descriptionKu: await translateArabic(descriptionAr, "ku"),
    isAvailable: document.querySelector("#meal-availability").value === "true",
  };

  meals = id ? meals.map((item) => (String(item.id) === String(id) ? meal : item)) : [meal, ...meals];
  await saveData();
  resetMealForm();
  renderAll();
  showToast(getMessage("saved"));
});

categoryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const originalId = document.querySelector("#category-original-id").value;
  const nameAr = document.querySelector("#category-name").value.trim();
  const id = uniqueCategoryId(slugify(nameAr), originalId);
  const displayOrder = Number(document.querySelector("#category-order").value) || categories.length + 1;

  if (!nameAr || !id) {
    showToast(getMessage("required"));
    return;
  }

  const category = { id, name: await translateArabic(nameAr, "en"), nameAr, nameKu: await translateArabic(nameAr, "ku"), icon: categoryIconValue, displayOrder };
  categories = originalId ? categories.map((item) => (item.id === originalId ? category : item)) : [...categories, category];

  if (originalId && originalId !== id) {
    meals = meals.map((meal) => (meal.category === originalId ? { ...meal, category: id } : meal));
  }

  await saveData();
  resetCategoryForm();
  renderAll();
  showToast(getMessage("saved"));
});

document.addEventListener("click", async (event) => {
  const editMealButton = event.target.closest("[data-edit-meal]");
  const deleteMealButton = event.target.closest("[data-delete-meal]");
  const editCategoryButton = event.target.closest("[data-edit-category]");
  const deleteCategoryButton = event.target.closest("[data-delete-category]");

  if (editMealButton) {
    const mealId = editMealButton.dataset.editMeal;
    const meal = meals.find((item) => String(item.id) === String(mealId));
    if (!meal) return;
    document.querySelector("#meal-id").value = meal.id;
    document.querySelector("#meal-name").value = meal.nameAr || meal.nameKu || meal.name || "";
    document.querySelector("#meal-price").value = meal.price;
    document.querySelector("#meal-description").value = meal.descriptionAr || meal.descriptionKu || meal.description || "";
    document.querySelector("#meal-availability").value = String(meal.isAvailable !== false);
    mealCategory.value = meal.category;
    mealImageValue = meal.image || defaultMealImage;
    mealPreview.src = mealImageValue;
    document.querySelector("#meal-form-title").textContent = getMessage("editMealTitle");
    mealForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (deleteMealButton && confirm(getMessage("confirmMealDelete"))) {
    meals = meals.filter((item) => String(item.id) !== String(deleteMealButton.dataset.deleteMeal));
    await saveData();
    renderAll();
    showToast(getMessage("deleted"));
  }

  if (editCategoryButton) {
    const category = categories.find((item) => item.id === editCategoryButton.dataset.editCategory);
    if (!category) return;
    document.querySelector("#category-original-id").value = category.id;
    document.querySelector("#category-name").value = category.nameAr || category.nameKu || category.name;
    document.querySelector("#category-id").value = category.id;
    document.querySelector("#category-order").value = category.displayOrder || 1;
    categoryIconValue = category.icon;
    categoryPreview.src = category.icon;
    categoryForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (deleteCategoryButton && confirm(getMessage("confirmCategoryDelete"))) {
    const id = deleteCategoryButton.dataset.deleteCategory;
    categories = categories.filter((category) => category.id !== id);
    meals = meals.filter((meal) => meal.category !== id);
    await saveData();
    resetCategoryForm();
    renderAll();
    showToast(getMessage("deleted"));
  }
});

[searchInput, filterCategory, sortSelect].forEach((control) => {
  control.addEventListener("input", renderMealsTable);
  control.addEventListener("change", renderMealsTable);
});

document.querySelector("#reset-meal-form").addEventListener("click", resetMealForm);
document.querySelector("#reset-category-form").addEventListener("click", resetCategoryForm);
adminLanguageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentLanguage = button.dataset.adminLang;
    applyLanguage();
    renderAll();
  });
});

async function initializeAdmin() {
  applyLanguage();
  forceEnglishLogin();
  setAuthenticated(isAuthenticated());
  await loadServerData();
  await translateExistingData();
  renderAll();
  resetCategoryForm();
}

initializeAdmin();
