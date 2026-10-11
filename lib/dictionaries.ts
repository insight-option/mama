import type { Locale } from "@/lib/i18n";
import type { CheckoutError, CheckoutField } from "@/lib/checkout";
import type { ServingId } from "@/types/menu";

export type SectionId = "menu" | "delivery" | "contact";

type Dictionary = {
  skipToContent: string;
  primaryNav: string;
  nav: Record<SectionId, string>;
  languageSwitcher: { label: string; target: string };
  hero: {
    eyebrow: string;
    title: string;
    intro: string;
    orderNow: string;
    whatsapp: string;
    deliveryChip: string;
    pickupChip: string;
    photoAlt: string;
  };
  logo: { homeAlt: string };
  menu: {
    title: string;
    filterLabel: string;
    all: string;
    servingLegend: string;
    serving: Record<ServingId, string>;
    unavailable: string;
    photoPending: string;
    pdfLink: string;
  };
  delivery: {
    title: string;
    intro: string;
    deliveryLabel: string;
    deliveryNote: string;
    pickupLabel: string;
    pickupNote: string;
    free: string;
    perOrder: string;
    stepsTitle: string;
    steps: string[];
  };
  contact: {
    title: string;
    intro: string;
    whatsappLabel: string;
    whatsappNote: string;
    whatsappCta: string;
    phoneLabel: string;
    phoneNote: string;
    phoneCta: string;
    menuLabel: string;
    menuNote: string;
    menuCta: string;
  };
  cart: {
    open: string;
    label: string;
    title: string;
    close: string;
    add: string;
    added: string;
    addedAnnouncement: string;
    empty: string;
    browseMenu: string;
    serving: string;
    each: string;
    decrease: string;
    increase: string;
    quantity: string;
    remove: string;
    fulfillmentLegend: string;
    delivery: string;
    pickup: string;
    pickupNote: string;
    subtotal: string;
    deliveryFee: string;
    pickupFee: string;
    total: string;
    free: string;
    viewCart: string;
    itemCount: (count: number) => string;
  };
  checkout: {
    proceed: string;
    title: string;
    back: string;
    customerLegend: string;
    addressLegend: string;
    optional: string;
    labels: Record<CheckoutField, string>;
    hints: Partial<Record<CheckoutField, string>>;
    errors: Record<CheckoutError, string>;
    errorSummary: string;
    whatsappNote: string;
    submit: string;
    sentTitle: string;
    sentBody: string;
    sentConfirmNote: string;
    openAgain: string;
    backToCart: string;
  };
  whatsapp: {
    heading: string;
    items: string;
    subtotal: string;
    fulfillment: string;
    delivery: string;
    pickup: string;
    deliveryFee: string;
    pickupFee: string;
    free: string;
    total: string;
    customer: string;
    name: string;
    phone: string;
    address: string;
    area: string;
    street: string;
    building: string;
    unit: string;
    landmark: string;
    notes: string;
  };
  footer: { navLabel: string; rights: string };
};

export const dictionaries: Record<Locale, Dictionary> = {
  ar: {
    skipToContent: "انتقل إلى المحتوى",
    primaryNav: "التنقل الرئيسي",
    nav: { menu: "القائمة", delivery: "التوصيل والاستلام", contact: "تواصل معنا" },
    languageSwitcher: { label: "English", target: "Switch to English" },
    logo: { homeAlt: "mama food by AMMON، الصفحة الرئيسية" },
    hero: {
      eyebrow: "أكل بيتي على الطريقة الأردنية",
      title: "مهما جربت، أكل ماما غير",
      intro: "اختر أطباقك وأرسل طلبك مباشرة عبر واتساب، للتوصيل أو الاستلام.",
      orderNow: "اطلب الآن",
      whatsapp: "اطلب عبر واتساب",
      deliveryChip: "توصيل",
      pickupChip: "استلام مجاني",
      photoAlt: "منسف بقطع لحم الخاروف والأرز واللوز",
    },
    menu: {
      title: "القائمة",
      filterLabel: "تصفية حسب الفئة",
      all: "الكل",
      servingLegend: "اختر الحصة",
      serving: { one: "شخص واحد", two: "شخصين" },
      unavailable: "غير متوفر حالياً",
      photoPending: "صورة الطبق قريباً",
      pdfLink: "عرض القائمة بصيغة PDF",
    },
    delivery: {
      title: "التوصيل والاستلام",
      intro: "الرسوم واضحة قبل إرسال الطلب، وتظهر في السلة مع الإجمالي.",
      deliveryLabel: "التوصيل",
      deliveryNote: "رسوم ثابتة لكل طلب توصيل. أدخل عنوانك عند إتمام الطلب.",
      pickupLabel: "الاستلام من المطعم",
      pickupNote: "الاستلام مجاني — راسلنا عبر واتساب لتأكيد وقت وموقع الاستلام.",
      free: "مجاناً",
      perOrder: "لكل طلب",
      stepsTitle: "كيف تطلب؟",
      steps: [
        "اختر أطباقك والحصة المناسبة وأضفها إلى السلة.",
        "اختر التوصيل أو الاستلام وأدخل بياناتك.",
        "يفتح واتساب برسالة طلبك جاهزة، أرسلها ليؤكد المطعم طلبك.",
      ],
    },
    contact: {
      title: "تواصل معنا",
      intro: "للطلبات والاستفسارات، تواصل معنا مباشرة.",
      whatsappLabel: "واتساب",
      whatsappNote: "للطلبات والاستفسارات",
      whatsappCta: "ابدأ المحادثة",
      phoneLabel: "اتصال",
      phoneNote: "اتصل بنا مباشرة",
      phoneCta: "اتصل الآن",
      menuLabel: "القائمة الكاملة",
      menuNote: "نسخة PDF من قائمة الطعام",
      menuCta: "عرض القائمة",
    },
    cart: {
      open: "فتح السلة",
      label: "السلة",
      title: "سلتك",
      close: "إغلاق السلة",
      add: "أضف إلى السلة",
      added: "تمت الإضافة",
      addedAnnouncement: "تمت إضافة الطبق إلى السلة",
      empty: "سلتك فارغة.",
      browseMenu: "تصفّح القائمة",
      serving: "الحصة",
      each: "للواحدة",
      decrease: "إنقاص الكمية",
      increase: "زيادة الكمية",
      quantity: "الكمية",
      remove: "حذف",
      fulfillmentLegend: "طريقة الاستلام",
      delivery: "توصيل",
      pickup: "استلام من المطعم",
      pickupNote: "الاستلام مجاني — راسلنا عبر واتساب لتأكيد وقت وموقع الاستلام.",
      subtotal: "المجموع الفرعي",
      deliveryFee: "رسوم التوصيل",
      pickupFee: "رسوم الاستلام",
      total: "الإجمالي",
      free: "مجاناً",
      viewCart: "عرض السلة",
      itemCount: (n) => (n === 1 ? "طبق واحد" : n === 2 ? "طبقان" : n <= 10 ? `${n} أطباق` : `${n} طبقاً`),
    },
    checkout: {
      proceed: "متابعة الطلب",
      title: "بيانات الطلب",
      back: "العودة إلى السلة",
      customerLegend: "بياناتك",
      addressLegend: "عنوان التوصيل",
      optional: "اختياري",
      labels: {
        name: "الاسم",
        phone: "رقم الهاتف",
        area: "المنطقة",
        street: "الشارع",
        building: "رقم المبنى",
        unit: "رقم الفيلا أو الشقة",
        landmark: "أقرب معلم",
        notes: "ملاحظات الطلب",
      },
      hints: {
        phone: "مثال: 5000 0000 أو ‎+974 5000 0000",
        unit: "إن وُجد",
      },
      errors: {
        required: "هذا الحقل مطلوب.",
        phone: "أدخل رقم هاتف صحيحاً (8 أرقام على الأقل).",
        tooLong: "النص أطول من المسموح.",
      },
      errorSummary: "يرجى تصحيح الحقول المحددة قبل المتابعة.",
      whatsappNote:
        "سيفتح WhatsApp برسالة طلب جاهزة. راجع الرسالة ثم أرسلها بنفسك. يتم تأكيد الطلب من المطعم بعد استلام رسالتك.",
      submit: "متابعة إلى WhatsApp",
      sentTitle: "رسالتك جاهزة في WhatsApp",
      sentBody:
        "فتحنا WhatsApp برسالة طلبك. لم يُرسَل الطلب بعد: راجع الرسالة واضغط إرسال في WhatsApp.",
      sentConfirmNote: "سيتواصل معك المطعم عبر WhatsApp لتأكيد الطلب.",
      openAgain: "فتح WhatsApp مرة أخرى",
      backToCart: "العودة إلى السلة",
    },
    whatsapp: {
      heading: "طلب جديد",
      items: "الأصناف",
      subtotal: "المجموع الفرعي",
      fulfillment: "طريقة الاستلام",
      delivery: "توصيل",
      pickup: "استلام من المطعم",
      deliveryFee: "رسوم التوصيل",
      pickupFee: "رسوم الاستلام",
      free: "مجاناً",
      total: "الإجمالي",
      customer: "بيانات العميل",
      name: "الاسم",
      phone: "الهاتف",
      address: "عنوان التوصيل",
      area: "المنطقة",
      street: "الشارع",
      building: "المبنى",
      unit: "الفيلا / الشقة",
      landmark: "أقرب معلم",
      notes: "ملاحظات",
    },
    footer: { navLabel: "روابط سريعة", rights: "جميع الحقوق محفوظة." },
  },
  en: {
    skipToContent: "Skip to content",
    primaryNav: "Main navigation",
    nav: { menu: "Menu", delivery: "Delivery & pickup", contact: "Contact" },
    languageSwitcher: { label: "العربية", target: "التبديل إلى العربية" },
    logo: { homeAlt: "mama food by AMMON, home" },
    hero: {
      eyebrow: "Jordanian home-style cooking",
      // Temporary headline supplied by the owner; not an approved slogan.
      title: "Mama’s home-style cooking, just a WhatsApp message away.",
      intro: "Pick your dishes and send your order directly on WhatsApp, for delivery or pickup.",
      orderNow: "Order now",
      whatsapp: "WhatsApp",
      deliveryChip: "Delivery",
      pickupChip: "Free pickup",
      photoAlt: "Mansaf with lamb, rice and almonds",
    },
    menu: {
      title: "Menu",
      filterLabel: "Filter by category",
      all: "All",
      servingLegend: "Choose serving",
      serving: { one: "1 person", two: "2 people" },
      unavailable: "Currently unavailable",
      photoPending: "Dish photo coming soon",
      pdfLink: "View menu as PDF",
    },
    delivery: {
      title: "Delivery & pickup",
      intro: "Fees are shown before you send your order, together with the total in your cart.",
      deliveryLabel: "Delivery",
      deliveryNote: "Flat fee per delivery order. Enter your address at checkout.",
      pickupLabel: "Pickup",
      pickupNote: "Free pickup — Message us on WhatsApp to confirm your pickup time and location.",
      free: "Free",
      perOrder: "per order",
      stepsTitle: "How to order",
      steps: [
        "Choose your dishes and serving size, then add them to your cart.",
        "Choose delivery or pickup and enter your details.",
        "WhatsApp opens with your order ready. Send it, and the restaurant confirms your order.",
      ],
    },
    contact: {
      title: "Contact",
      intro: "For orders and questions, reach us directly.",
      whatsappLabel: "WhatsApp",
      whatsappNote: "For orders and questions",
      whatsappCta: "Start a chat",
      phoneLabel: "Call",
      phoneNote: "Call us directly",
      phoneCta: "Call now",
      menuLabel: "Full menu",
      menuNote: "PDF version of the menu",
      menuCta: "View menu",
    },
    cart: {
      open: "Open cart",
      label: "Cart",
      title: "Your cart",
      close: "Close cart",
      add: "Add to cart",
      added: "Added",
      addedAnnouncement: "Dish added to cart",
      empty: "Your cart is empty.",
      browseMenu: "Browse the menu",
      serving: "Serving",
      each: "each",
      decrease: "Decrease quantity",
      increase: "Increase quantity",
      quantity: "Quantity",
      remove: "Remove",
      fulfillmentLegend: "Delivery or pickup",
      delivery: "Delivery",
      pickup: "Pickup",
      pickupNote: "Free pickup — Message us on WhatsApp to confirm your pickup time and location.",
      subtotal: "Subtotal",
      deliveryFee: "Delivery fee",
      pickupFee: "Pickup fee",
      total: "Total",
      free: "Free",
      viewCart: "View cart",
      itemCount: (n) => (n === 1 ? "1 item" : `${n} items`),
    },
    checkout: {
      proceed: "Continue to order",
      title: "Order details",
      back: "Back to cart",
      customerLegend: "Your details",
      addressLegend: "Delivery address",
      optional: "optional",
      labels: {
        name: "Name",
        phone: "Phone number",
        area: "Area / zone",
        street: "Street",
        building: "Building number",
        unit: "Villa or apartment number",
        landmark: "Nearby landmark",
        notes: "Order notes",
      },
      hints: {
        phone: "e.g. 5000 0000 or +974 5000 0000",
        unit: "If applicable",
      },
      errors: {
        required: "This field is required.",
        phone: "Enter a valid phone number (at least 8 digits).",
        tooLong: "This text is too long.",
      },
      errorSummary: "Please correct the highlighted fields to continue.",
      whatsappNote:
        "WhatsApp will open with your order message ready. Review it and send it yourself. The restaurant confirms the order after receiving your message.",
      submit: "Continue to WhatsApp",
      sentTitle: "Your message is ready in WhatsApp",
      sentBody:
        "We opened WhatsApp with your order message. Your order has not been sent yet: review the message and tap send in WhatsApp.",
      sentConfirmNote: "The restaurant will contact you on WhatsApp to confirm your order.",
      openAgain: "Open WhatsApp again",
      backToCart: "Back to cart",
    },
    whatsapp: {
      heading: "New order",
      items: "Items",
      subtotal: "Subtotal",
      fulfillment: "Fulfillment",
      delivery: "Delivery",
      pickup: "Pickup",
      deliveryFee: "Delivery fee",
      pickupFee: "Pickup fee",
      free: "Free",
      total: "Total",
      customer: "Customer",
      name: "Name",
      phone: "Phone",
      address: "Delivery address",
      area: "Area / zone",
      street: "Street",
      building: "Building",
      unit: "Villa / apartment",
      landmark: "Landmark",
      notes: "Notes",
    },
    footer: { navLabel: "Quick links", rights: "All rights reserved." },
  },
};

export const sectionIds: SectionId[] = ["menu", "delivery", "contact"];
