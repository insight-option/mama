import type { Locale } from "@/features/estimator/types";

export type LegalDoc = { title: string; intro: string; sections: Array<{ heading: string; body: string[] }> };

export const LEGAL_UPDATED = "2026-10-09";

/**
 * DRAFT legal copy describing how the Phase A app actually behaves. It must be
 * reviewed by qualified Qatari counsel before launch (blueprint section 16).
 */
export const PRIVACY: Record<Locale, LegalDoc> = {
  en: {
    title: "Privacy Policy",
    intro:
      "This policy explains how FONTAINE's Smart Growth AI planner handles information. We designed the planner so you can calculate an estimate without sharing any personal data.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "The planner does not require an account, name, phone number or email to calculate an estimate.",
          "Your selections (industry, objective, services and budget) are kept in your own browser session so they survive a language switch or page refresh. They are not sent to our servers.",
          "Optional details you type in the \"Send your plan\" form (name, company, start date, notes) are never stored by this website. They are only added to the WhatsApp message that you choose to send.",
        ],
      },
      {
        heading: "WhatsApp",
        body: [
          "When you press the WhatsApp button, your device opens WhatsApp with a pre-filled message. Nothing is sent until you press send in WhatsApp. Messages you send are then handled under WhatsApp's own terms and our client communication practices.",
        ],
      },
      {
        heading: "Shared plan links",
        body: ["\"Share plan\" links contain your package selections only. They never include your name, phone number, email or notes."],
      },
      {
        heading: "Analytics and cookies",
        body: [
          "We use a single preference cookie to remember your language. We do not currently run third-party advertising or analytics trackers on this planner. If we add them in future, we will ask for your consent where required and update this policy first.",
        ],
      },
      {
        heading: "Marketing messages",
        body: [
          "In line with Qatar's Law No. 13 of 2016 on the Protection of Personal Data Privacy, we will not send you electronic marketing without your prior consent. Contacting us about a plan is not consent to unrelated promotional messages.",
        ],
      },
      {
        heading: "Your rights and contact",
        body: [
          "You may ask us what personal data we hold about you, request corrections, or ask us to delete it, by replying in the WhatsApp conversation or contacting FONTAINE through its official channels.",
        ],
      },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    intro:
      "توضح هذه السياسة كيف تتعامل أداة «النمو الذكي» من فونتين مع المعلومات. صمّمنا الأداة بحيث يمكنك الحصول على تقدير دون مشاركة أي بيانات شخصية.",
    sections: [
      {
        heading: "ما الذي نجمعه",
        body: [
          "لا تتطلب الأداة إنشاء حساب أو إدخال اسم أو رقم هاتف أو بريد إلكتروني لحساب التقدير.",
          "تُحفظ اختياراتك (القطاع والهدف والخدمات والميزانية) داخل جلسة متصفحك فقط حتى لا تضيع عند تبديل اللغة أو تحديث الصفحة، ولا تُرسل إلى خوادمنا.",
          "البيانات الاختيارية التي تكتبها في نموذج «أرسل خطتك» (الاسم، الشركة، موعد البدء، الملاحظات) لا يحفظها هذا الموقع إطلاقاً، وتُضاف فقط إلى رسالة واتساب التي تختار إرسالها.",
        ],
      },
      {
        heading: "واتساب",
        body: [
          "عند الضغط على زر واتساب، يفتح جهازك تطبيق واتساب برسالة جاهزة، ولا يُرسل شيء حتى تضغط «إرسال» بنفسك. وتخضع الرسائل التي ترسلها لشروط واتساب ولممارسات تواصلنا مع العملاء.",
        ],
      },
      {
        heading: "روابط مشاركة الخطة",
        body: ["تحتوي روابط «مشاركة الخطة» على اختيارات الباقة فقط، ولا تتضمن أبداً اسمك أو رقم هاتفك أو بريدك أو ملاحظاتك."],
      },
      {
        heading: "التحليلات وملفات تعريف الارتباط",
        body: [
          "نستخدم ملف تعريف ارتباط واحداً لتذكّر لغتك المفضلة. لا نشغّل حالياً أي أدوات تتبع إعلانية أو تحليلية من أطراف ثالثة في هذه الأداة، وإذا أضفناها مستقبلاً فسنطلب موافقتك حيثما يلزم ونحدّث هذه السياسة أولاً.",
        ],
      },
      {
        heading: "الرسائل التسويقية",
        body: [
          "التزاماً بالقانون القطري رقم 13 لسنة 2016 بشأن حماية خصوصية البيانات الشخصية، لن نرسل إليك رسائل تسويقية إلكترونية دون موافقتك المسبقة. وتواصلك معنا بخصوص خطة لا يُعد موافقة على رسائل ترويجية أخرى.",
        ],
      },
      {
        heading: "حقوقك والتواصل",
        body: [
          "يمكنك أن تطلب معرفة البيانات الشخصية التي نحتفظ بها عنك، أو تصحيحها، أو حذفها، بالرد في محادثة واتساب أو بالتواصل مع فونتين عبر قنواتها الرسمية.",
        ],
      },
    ],
  },
};

export const TERMS: Record<Locale, LegalDoc> = {
  en: {
    title: "Terms of Use",
    intro: "By using the Smart Growth AI planner you agree to these terms.",
    sections: [
      {
        heading: "Indicative estimates only",
        body: [
          "All prices, totals and forecasts shown are indicative planning figures based on editable demonstration assumptions. They are not a binding quotation, offer or contract.",
          "A final quotation is issued only after FONTAINE confirms scope, deliverables and timelines with you in writing.",
        ],
      },
      {
        heading: "No guaranteed results",
        body: [
          "Reach, impression and enquiry ranges are illustrative scenarios. They are not predictions from Meta or any platform, and advertising outcomes depend on your offer, audience, creative, market conditions and platform delivery.",
        ],
      },
      {
        heading: "Advertising spend",
        body: ["Media spend is paid to the advertising platform. FONTAINE's service fees are shown separately and are not the same as your media budget."],
      },
      {
        heading: "Currencies",
        body: ["Quotes and billing are in Qatari riyals (QAR). Other currencies are approximate conversions for reference only."],
      },
      {
        heading: "Sample media",
        body: ["Photos and videos on this website are licensed stock footage used for illustration and do not represent FONTAINE client work."],
      },
      {
        heading: "Governing law",
        body: ["These terms are governed by the laws of the State of Qatar."],
      },
    ],
  },
  ar: {
    title: "شروط الاستخدام",
    intro: "باستخدامك أداة «النمو الذكي» فإنك توافق على هذه الشروط.",
    sections: [
      {
        heading: "تقديرات استرشادية فقط",
        body: [
          "جميع الأسعار والإجماليات والتوقعات المعروضة أرقام تخطيطية استرشادية مبنية على افتراضات تجريبية قابلة للتعديل، وليست عرض سعر مُلزماً أو عرضاً أو عقداً.",
          "لا يصدر عرض السعر النهائي إلا بعد أن تؤكد فونتين معك كتابياً نطاق العمل والمخرجات والجداول الزمنية.",
        ],
      },
      {
        heading: "لا توجد نتائج مضمونة",
        body: [
          "نطاقات الوصول ومرات الظهور والاستفسارات سيناريوهات توضيحية، وليست توقعات صادرة عن ميتا أو أي منصة، وتعتمد نتائج الإعلانات على عرضك وجمهورك والمحتوى وظروف السوق وأداء المنصة.",
        ],
      },
      {
        heading: "الميزانية الإعلانية",
        body: ["تُدفع الميزانية الإعلانية لمنصة الإعلان، وتُعرض أتعاب خدمات فونتين بشكل منفصل عنها."],
      },
      {
        heading: "العملات",
        body: ["عروض الأسعار والفوترة بالريال القطري، والعملات الأخرى تحويلات تقريبية للاسترشاد فقط."],
      },
      {
        heading: "الوسائط التوضيحية",
        body: ["الصور والفيديوهات في هذا الموقع لقطات مرخّصة لأغراض التوضيح، ولا تمثل أعمالاً لعملاء فونتين."],
      },
      {
        heading: "القانون الحاكم",
        body: ["تخضع هذه الشروط لقوانين دولة قطر."],
      },
    ],
  },
};
