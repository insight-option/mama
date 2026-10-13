import { restaurant } from "@/config/restaurant";
import type { Locale } from "@/lib/i18n";

/** Pages of the customer site, in navigation order. */
export const pageIds = ["home", "menu", "offers", "delivery", "contact"] as const;
export type PageId = (typeof pageIds)[number];

export function pagePath(locale: Locale, page: PageId): string {
  return page === "home" ? `/${locale}` : `/${locale}/${page}`;
}

type QuickReply = { label: string; message: string };

type SiteCopy = {
  pages: Record<PageId, string>;
  login: { label: string; aria: string };
  mobileMenu: { open: string; close: string };
  home: {
    scroll: string;
    signatureEyebrow: string;
    signatureTitle: string;
    signatureIntro: string;
    viewMenu: string;
    categoriesEyebrow: string;
    categoriesTitle: string;
    dishes: (count: number) => string;
    offersEyebrow: string;
    offersTitle: string;
    offersIntro: string;
    offersCta: string;
    stepsEyebrow: string;
    chatEyebrow: string;
    chatTitle: string;
    chatIntro: string;
  };
  menuPage: { eyebrow: string; title: string; intro: string };
  product: {
    back: string;
    ingredients: string;
    ask: string;
    askMessage: (name: string, image: string, page: string) => string;
    related: string;
    offer: string;
    regularPrice: string;
    view: string;
  };
  offersPage: { eyebrow: string; title: string; intro: string; empty: string; emptyCta: string };
  deliveryPage: { eyebrow: string };
  contactPage: { eyebrow: string; quickTitle: string; quickIntro: string };
  chat: {
    open: string;
    close: string;
    title: string;
    greeting: string;
    replies: QuickReply[];
    start: string;
  };
};

export const siteCopy: Record<Locale, SiteCopy> = {
  ar: {
    pages: {
      home: "الرئيسية",
      menu: "القائمة",
      offers: "العروض",
      delivery: "التوصيل والاستلام",
      contact: "تواصل معنا",
    },
    login: { label: "دخول", aria: "دخول لوحة الإدارة" },
    mobileMenu: { open: "فتح القائمة", close: "إغلاق القائمة" },
    home: {
      scroll: "اكتشف القائمة",
      signatureEyebrow: "من مطبخ ماما",
      signatureTitle: "أطباق تُطبخ كما في البيت",
      signatureIntro: "طبخات ماما الأردنية، أطباق صحية، سلطات طازجة وباستا. اختر طبقك ونجهّزه لك.",
      viewMenu: "تصفّح القائمة كاملة",
      categoriesEyebrow: "ماذا تشتهي اليوم؟",
      categoriesTitle: "اختر من أقسام القائمة",
      dishes: (n) => (n === 1 ? "طبق واحد" : n === 2 ? "طبقان" : n <= 10 ? `${n} أطباق` : `${n} طبقاً`),
      offersEyebrow: "عروض ماما",
      offersTitle: "عروض متاحة الآن",
      offersIntro: "أسعار خاصة على أطباق مختارة لفترة محدودة.",
      offersCta: "كل العروض",
      stepsEyebrow: "خطوات بسيطة",
      chatEyebrow: "نحن هنا لك",
      chatTitle: "عندك سؤال أو طلب خاص؟",
      chatIntro: "اكتب لنا على واتساب: عن الأطباق، أو الكميات، أو أي شيء تحتاجه.",
    },
    menuPage: {
      eyebrow: "قائمة ماما فود",
      title: "القائمة",
      intro: "كل الأطباق بأسعارها. اختر الحصة المناسبة وأضفها إلى السلة.",
    },
    product: {
      back: "العودة إلى القائمة",
      ingredients: "المكونات",
      ask: "اسأل عن هذا الطبق",
      askMessage: (name, image, page) =>
        `مرحباً ماما فود، عندي سؤال عن طبق ${name}.\nالصورة: ${image}\nالرابط: ${page}`,
      related: "قد يعجبك أيضاً",
      offer: "عرض خاص",
      regularPrice: "السعر قبل العرض",
      view: "عرض الطبق",
    },
    offersPage: {
      eyebrow: "عروض ماما",
      title: "العروض",
      intro: "أطباق بأسعار خاصة لفترة محدودة.",
      empty: "لا توجد عروض حالياً. تابعنا، فالعروض تتجدد.",
      emptyCta: "تصفّح القائمة",
    },
    deliveryPage: { eyebrow: "نوصل لك أو تستلم بنفسك" },
    contactPage: {
      eyebrow: "يسعدنا تواصلك",
      quickTitle: "اسألنا مباشرة",
      quickIntro: "اختر سؤالاً وسيفتح واتساب برسالة جاهزة.",
    },
    chat: {
      open: "تحدث معنا",
      close: "إغلاق المحادثة",
      title: "ماما فود",
      greeting: "أهلاً بك! كيف نقدر نساعدك اليوم؟",
      replies: [
        { label: "أريد أن أطلب", message: "مرحباً ماما فود، أريد أن أطلب." },
        { label: "هل الطبق متوفر اليوم؟", message: "مرحباً، هل الطبق متوفر اليوم؟" },
        { label: "سؤال عن التوصيل", message: "مرحباً، عندي سؤال عن التوصيل." },
        { label: "طلب خاص أو كمية كبيرة", message: "مرحباً، عندي طلب خاص / كمية كبيرة." },
      ],
      start: "ابدأ المحادثة",
    },
  },
  en: {
    pages: {
      home: "Home",
      menu: "Menu",
      offers: "Offers",
      delivery: "Delivery & pickup",
      contact: "Contact",
    },
    login: { label: "Login", aria: "Admin login" },
    mobileMenu: { open: "Open menu", close: "Close menu" },
    home: {
      scroll: "Explore the menu",
      signatureEyebrow: "From Mama’s kitchen",
      signatureTitle: "Cooked the way it is at home",
      signatureIntro: "Jordanian home-style specials, healthy meals, fresh salads and pasta. Pick your dish and we will prepare it for you.",
      viewMenu: "See the full menu",
      categoriesEyebrow: "What are you craving?",
      categoriesTitle: "Browse by category",
      dishes: (n) => (n === 1 ? "1 dish" : `${n} dishes`),
      offersEyebrow: "Mama’s offers",
      offersTitle: "Offers available now",
      offersIntro: "Special prices on selected dishes for a limited time.",
      offersCta: "All offers",
      stepsEyebrow: "Simple steps",
      chatEyebrow: "We are here for you",
      chatTitle: "A question or a special request?",
      chatIntro: "Message us on WhatsApp about dishes, quantities or anything you need.",
    },
    menuPage: {
      eyebrow: "The Mama Food menu",
      title: "Menu",
      intro: "Every dish with its price. Choose your serving and add it to your cart.",
    },
    product: {
      back: "Back to the menu",
      ingredients: "Ingredients",
      ask: "Ask about this dish",
      askMessage: (name, image, page) =>
        `Hello Mama Food, I have a question about ${name}.\nPhoto: ${image}\nLink: ${page}`,
      related: "You may also like",
      offer: "Special offer",
      regularPrice: "Price before the offer",
      view: "View dish",
    },
    offersPage: {
      eyebrow: "Mama’s offers",
      title: "Offers",
      intro: "Dishes at special prices for a limited time.",
      empty: "No offers right now. Check back soon, offers change regularly.",
      emptyCta: "Browse the menu",
    },
    deliveryPage: { eyebrow: "We deliver, or you pick up" },
    contactPage: {
      eyebrow: "We would love to hear from you",
      quickTitle: "Ask us directly",
      quickIntro: "Pick a question and WhatsApp opens with a ready message.",
    },
    chat: {
      open: "Chat with us",
      close: "Close chat",
      title: "Mama Food",
      greeting: "Welcome! How can we help you today?",
      replies: [
        { label: "I want to order", message: "Hello Mama Food, I would like to order." },
        { label: "Is a dish available today?", message: "Hello, is the dish available today?" },
        { label: "Question about delivery", message: "Hello, I have a question about delivery." },
        { label: "Special request or large quantity", message: "Hello, I have a special request / large quantity." },
      ],
      start: "Start the chat",
    },
  },
};

/** wa.me link to the restaurant, optionally with a prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${restaurant.whatsapp.number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
