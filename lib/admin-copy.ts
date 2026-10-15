import type { LoginErrorKey } from "@/lib/admin/auth-errors";
import type { Locale } from "@/lib/i18n";

type AdminCopy = {
  workspace: string;
  viewSite: string;
  signOut: string;
  signedInAs: string;
  loading: string;
  notDeployed: { title: string; body: string };
  login: {
    title: string;
    intro: string;
    email: string;
    password: string;
    show: string;
    hide: string;
    submit: string;
    submitting: string;
    forgot: string;
    backToSite: string;
    newPasswordTitle: string;
    newPasswordIntro: string;
    newPassword: string;
    confirmPassword: string;
    passwordRules: string;
    setPassword: string;
    resetTitle: string;
    resetIntro: string;
    sendCode: string;
    code: string;
    resetSubmit: string;
    resetDone: string;
    backToLogin: string;
    notAdminTitle: string;
    notAdminBody: string;
    useAnother: string;
    errors: Record<LoginErrorKey, string>;
  };
  products: {
    title: string;
    add: string;
    search: string;
    allCategories: string;
    stats: { total: string; available: string; offers: string; hidden: string };
    empty: string;
    importTitle: string;
    importBody: string;
    importButton: string;
    importing: (done: number, total: number) => string;
    imported: (count: number) => string;
    edit: string;
    delete: string;
    available: string;
    hidden: string;
    offer: string;
    featured: string;
    noResults: string;
    confirmDeleteTitle: string;
    confirmDeleteBody: (name: string) => string;
    cancel: string;
    confirmDelete: string;
    deleted: string;
    liveNote: string;
  };
  editor: {
    newTitle: string;
    editTitle: string;
    back: string;
    sections: { basics: string; description: string; pricing: string; offer: string; image: string; visibility: string };
    nameAr: string;
    nameEn: string;
    category: string;
    ingredientsAr: string;
    ingredientsEn: string;
    ingredientsHint: string;
    pricingType: string;
    fixed: string;
    serving: string;
    price: string;
    priceOne: string;
    priceTwo: string;
    offerActive: string;
    offerLabelAr: string;
    offerLabelEn: string;
    offerPrice: string;
    offerPriceOne: string;
    offerPriceTwo: string;
    offerHint: string;
    image: string;
    uploadImage: string;
    replaceImage: string;
    removeUploaded: string;
    imageHint: string;
    noImage: string;
    altAr: string;
    altEn: string;
    available: string;
    featured: string;
    sortOrder: string;
    save: string;
    saving: string;
    saved: string;
    notFound: string;
    errors: Record<"required" | "price" | "wholeNumber" | "offerPrice" | "image" | "save" | "load", string>;
  };
};

export const adminCopy: Record<Locale, AdminCopy> = {
  ar: {
    workspace: "لوحة الإدارة",
    viewSite: "عرض الموقع",
    signOut: "تسجيل الخروج",
    signedInAs: "مسجّل باسم",
    loading: "جارٍ التحميل…",
    notDeployed: {
      title: "البنية الخلفية لم تُنشر بعد",
      body: "جدول المنتجات وتخزين الصور يعملان بعد نشر هذا التحديث على Amplify.",
    },
    login: {
      title: "دخول الإدارة",
      intro: "سجّل الدخول بحساب الإدارة لإدارة القائمة والأسعار والعروض.",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      show: "إظهار",
      hide: "إخفاء",
      submit: "تسجيل الدخول",
      submitting: "جارٍ تسجيل الدخول…",
      forgot: "نسيت كلمة المرور؟",
      backToSite: "العودة إلى الموقع",
      newPasswordTitle: "اختر كلمة مرور جديدة",
      newPasswordIntro: "هذا أول دخول لهذا الحساب. اختر كلمة مرور جديدة لإكماله.",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور",
      passwordRules: "8 أحرف على الأقل، وتشمل حرفاً إنجليزياً كبيراً وحرفاً صغيراً ورقماً ورمزاً مثل ! @ # $ % & * ?",
      setPassword: "حفظ ومتابعة",
      resetTitle: "استعادة كلمة المرور",
      resetIntro: "سنرسل رمز تحقق إلى بريدك الإلكتروني.",
      sendCode: "إرسال الرمز",
      code: "رمز التحقق",
      resetSubmit: "تعيين كلمة المرور",
      resetDone: "تم تغيير كلمة المرور. سجّل الدخول الآن.",
      backToLogin: "العودة إلى تسجيل الدخول",
      notAdminTitle: "لا توجد صلاحية إدارة",
      notAdminBody: "تم تسجيل الدخول، لكن هذا الحساب ليس ضمن مجموعة ADMIN في Cognito.",
      useAnother: "الدخول بحساب آخر",
      errors: {
        credentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
        required: "يرجى تعبئة جميع الحقول.",
        email: "أدخل بريداً إلكترونياً صحيحاً.",
        mismatch: "كلمتا المرور غير متطابقتين.",
        weak: "كلمة المرور لا تستوفي الشروط.",
        code: "رمز التحقق غير صحيح.",
        expired: "انتهت صلاحية الرمز. اطلب رمزاً جديداً.",
        tooMany: "محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً.",
        notConfirmed: "الحساب غير مؤكد في Cognito.",
        network: "تعذّر الاتصال. تحقق من الإنترنت وحاول مجدداً.",
        sessionExpired: "انتهت جلسة تسجيل الدخول قبل حفظ كلمة المرور الجديدة. سجّل الدخول مجدداً بكلمة المرور المؤقتة.",
        passwordRejected: "لم يقبل النظام كلمة المرور الجديدة. سجّل الدخول مجدداً بكلمة المرور المؤقتة واختر كلمة مرور تستوفي الشروط.",
        tempExpired: "انتهت صلاحية كلمة المرور المؤقتة. اطلب من المسؤول إرسال كلمة مرور مؤقتة جديدة من Cognito.",
        unknown: "حدث خطأ غير متوقع. حاول مجدداً.",
      },
    },
    products: {
      title: "المنتجات",
      add: "إضافة منتج",
      search: "ابحث عن طبق",
      allCategories: "كل الأقسام",
      stats: { total: "كل المنتجات", available: "متاحة", offers: "عروض نشطة", hidden: "مخفية" },
      empty: "لا توجد منتجات بعد.",
      importTitle: "ابدأ بالقائمة الحالية",
      importBody: "استورد أطباق القائمة الحالية بأسمائها وأسعارها وصورها كما هي، ثم عدّلها من هنا.",
      importButton: "استيراد القائمة الحالية",
      importing: (d, t) => `جارٍ الاستيراد… ${d} من ${t}`,
      imported: (c) => `تم استيراد ${c} منتج.`,
      edit: "تعديل",
      delete: "حذف",
      available: "متاح",
      hidden: "مخفي",
      offer: "عرض",
      featured: "مميز",
      noResults: "لا توجد نتائج.",
      confirmDeleteTitle: "حذف المنتج؟",
      confirmDeleteBody: (name) => `سيُحذف «${name}» من الموقع نهائياً، مع صورته المرفوعة إن وُجدت.`,
      cancel: "إلغاء",
      confirmDelete: "حذف نهائي",
      deleted: "تم حذف المنتج.",
      liveNote: "تظهر التغييرات على الموقع خلال 30 ثانية تقريباً.",
    },
    editor: {
      newTitle: "منتج جديد",
      editTitle: "تعديل المنتج",
      back: "العودة إلى المنتجات",
      sections: {
        basics: "الأساسيات",
        description: "المكونات",
        pricing: "السعر",
        offer: "العرض",
        image: "الصورة",
        visibility: "الظهور",
      },
      nameAr: "الاسم بالعربية",
      nameEn: "الاسم بالإنجليزية",
      category: "القسم",
      ingredientsAr: "المكونات بالعربية",
      ingredientsEn: "المكونات بالإنجليزية",
      ingredientsHint: "مكوّن في كل سطر.",
      pricingType: "طريقة التسعير",
      fixed: "سعر ثابت",
      serving: "حسب الحصة (شخص واحد / شخصين)",
      price: "السعر (ر.ق)",
      priceOne: "سعر شخص واحد (ر.ق)",
      priceTwo: "سعر شخصين (ر.ق)",
      offerActive: "تفعيل عرض على هذا المنتج",
      offerLabelAr: "عنوان العرض بالعربية (اختياري)",
      offerLabelEn: "عنوان العرض بالإنجليزية (اختياري)",
      offerPrice: "سعر العرض (ر.ق)",
      offerPriceOne: "سعر العرض لشخص واحد (ر.ق)",
      offerPriceTwo: "سعر العرض لشخصين (ر.ق)",
      offerHint: "يجب أن يكون سعر العرض أقل من السعر العادي. يظهر السعر العادي مشطوباً.",
      image: "صورة المنتج",
      uploadImage: "رفع صورة",
      replaceImage: "استبدال الصورة",
      removeUploaded: "حذف الصورة المرفوعة",
      imageHint: "JPG أو PNG أو WebP. تُصغَّر تلقائياً قبل الرفع.",
      noImage: "بدون صورة",
      altAr: "وصف الصورة بالعربية",
      altEn: "وصف الصورة بالإنجليزية",
      available: "متاح للطلب",
      featured: "إظهاره ضمن الأطباق المميزة في الرئيسية",
      sortOrder: "الترتيب داخل القسم",
      save: "حفظ",
      saving: "جارٍ الحفظ…",
      saved: "تم الحفظ. يظهر التغيير على الموقع خلال 30 ثانية تقريباً.",
      notFound: "المنتج غير موجود.",
      errors: {
        required: "هذا الحقل مطلوب.",
        price: "أدخل سعراً أكبر من صفر، مثل 45 أو ٤٥ أو 82.5 (بدون فواصل للآلاف).",
        wholeNumber: "أدخل رقماً صحيحاً، مثل 1 أو 2.",
        offerPrice: "سعر العرض يجب أن يكون أكبر من صفر وأقل من السعر العادي.",
        image: "تعذّرت قراءة الصورة. استخدم JPG أو PNG أو WebP.",
        save: "تعذّر الحفظ. تحقق من الاتصال والصلاحيات وحاول مجدداً.",
        load: "تعذّر تحميل المنتجات.",
      },
    },
  },
  en: {
    workspace: "Admin workspace",
    viewSite: "View site",
    signOut: "Sign out",
    signedInAs: "Signed in as",
    loading: "Loading…",
    notDeployed: {
      title: "Backend not deployed yet",
      body: "The products table and image storage work after this update is deployed to Amplify.",
    },
    login: {
      title: "Admin login",
      intro: "Sign in with an admin account to manage the menu, prices and offers.",
      email: "Email",
      password: "Password",
      show: "Show",
      hide: "Hide",
      submit: "Sign in",
      submitting: "Signing in…",
      forgot: "Forgot password?",
      backToSite: "Back to the website",
      newPasswordTitle: "Choose a new password",
      newPasswordIntro: "This is the first sign-in for this account. Choose a new password to continue.",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      passwordRules: "At least 8 characters, with an uppercase and a lowercase English letter, a number and a symbol such as ! @ # $ % & * ?",
      setPassword: "Save and continue",
      resetTitle: "Reset password",
      resetIntro: "We will email you a verification code.",
      sendCode: "Send code",
      code: "Verification code",
      resetSubmit: "Set password",
      resetDone: "Password changed. Sign in now.",
      backToLogin: "Back to sign in",
      notAdminTitle: "No admin access",
      notAdminBody: "You are signed in, but this account is not in the ADMIN group in Cognito.",
      useAnother: "Use another account",
      errors: {
        credentials: "Incorrect email or password.",
        required: "Please fill in all fields.",
        email: "Enter a valid email address.",
        mismatch: "The passwords do not match.",
        weak: "The password does not meet the requirements.",
        code: "The verification code is incorrect.",
        expired: "The code has expired. Request a new one.",
        tooMany: "Too many attempts. Wait a moment and try again.",
        notConfirmed: "This account is not confirmed in Cognito.",
        network: "Could not connect. Check your internet and try again.",
        sessionExpired: "Your sign-in session expired before the new password was saved. Sign in again with the temporary password.",
        passwordRejected: "The new password was not accepted. Sign in again with the temporary password and choose one that meets the requirements.",
        tempExpired: "The temporary password has expired. Ask an administrator to send a new one from Cognito.",
        unknown: "Something went wrong. Please try again.",
      },
    },
    products: {
      title: "Products",
      add: "Add product",
      search: "Search dishes",
      allCategories: "All categories",
      stats: { total: "All products", available: "Available", offers: "Active offers", hidden: "Hidden" },
      empty: "No products yet.",
      importTitle: "Start from the current menu",
      importBody: "Import the current menu dishes with their names, prices and photos unchanged, then edit them here.",
      importButton: "Import current menu",
      importing: (d, t) => `Importing… ${d} of ${t}`,
      imported: (c) => `Imported ${c} products.`,
      edit: "Edit",
      delete: "Delete",
      available: "Available",
      hidden: "Hidden",
      offer: "Offer",
      featured: "Featured",
      noResults: "No results.",
      confirmDeleteTitle: "Delete product?",
      confirmDeleteBody: (name) => `“${name}” will be removed from the website permanently, with its uploaded photo if any.`,
      cancel: "Cancel",
      confirmDelete: "Delete permanently",
      deleted: "Product deleted.",
      liveNote: "Changes appear on the website within about 30 seconds.",
    },
    editor: {
      newTitle: "New product",
      editTitle: "Edit product",
      back: "Back to products",
      sections: {
        basics: "Basics",
        description: "Ingredients",
        pricing: "Price",
        offer: "Offer",
        image: "Photo",
        visibility: "Visibility",
      },
      nameAr: "Name in Arabic",
      nameEn: "Name in English",
      category: "Category",
      ingredientsAr: "Ingredients in Arabic",
      ingredientsEn: "Ingredients in English",
      ingredientsHint: "One ingredient per line.",
      pricingType: "Pricing",
      fixed: "Fixed price",
      serving: "By serving (1 person / 2 people)",
      price: "Price (QAR)",
      priceOne: "Price for 1 person (QAR)",
      priceTwo: "Price for 2 people (QAR)",
      offerActive: "Run an offer on this product",
      offerLabelAr: "Offer label in Arabic (optional)",
      offerLabelEn: "Offer label in English (optional)",
      offerPrice: "Offer price (QAR)",
      offerPriceOne: "Offer price for 1 person (QAR)",
      offerPriceTwo: "Offer price for 2 people (QAR)",
      offerHint: "The offer price must be lower than the regular price, which is shown struck through.",
      image: "Product photo",
      uploadImage: "Upload photo",
      replaceImage: "Replace photo",
      removeUploaded: "Remove uploaded photo",
      imageHint: "JPG, PNG or WebP. Resized automatically before upload.",
      noImage: "No photo",
      altAr: "Photo description in Arabic",
      altEn: "Photo description in English",
      available: "Available to order",
      featured: "Show in the featured dishes on the home page",
      sortOrder: "Order within the category",
      save: "Save",
      saving: "Saving…",
      saved: "Saved. The change appears on the website within about 30 seconds.",
      notFound: "Product not found.",
      errors: {
        required: "This field is required.",
        price: "Enter a price greater than zero, such as 45, ٤٥ or 82.5 (no thousands separators).",
        wholeNumber: "Enter a whole number, such as 1 or 2.",
        offerPrice: "The offer price must be above zero and below the regular price.",
        image: "Could not read the image. Use JPG, PNG or WebP.",
        save: "Could not save. Check your connection and permissions, then try again.",
        load: "Could not load products.",
      },
    },
  },
};
