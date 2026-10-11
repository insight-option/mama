import type { MenuCategory, MenuImage, MenuItem } from "@/types/menu";

/** Menu PDF supplied by the restaurant (public/Mama Food Menu V-2.pdf). */
export const menuPdfPath = "/Mama%20Food%20Menu%20V-2.pdf";

export const categories: MenuCategory[] = [
  { id: "specials", name: { ar: "طبخات ماما", en: "Mama’s Specials" } },
  { id: "healthy", name: { ar: "الأطباق الصحية", en: "Healthy Meals" } },
  {
    id: "salads",
    name: { ar: "السلطات الطازجة", en: "Fresh Salads" },
    shortName: { ar: "السلطات", en: "Salads" },
  },
  { id: "pasta", name: { ar: "الباستا", en: "Pasta" } },
];

// Dish photos. Pasta, salads and healthy meals follow the owner-approved
// official menu (Mama Food Menu V-2.pdf): each dish uses the photo printed
// beside it there. Where the same photo exists as a supplied individual file
// (828 px wide), that higher-resolution file is used; otherwise the photo is
// extracted from the PDF into /images/menu/. Dishes without an approved
// photo show the neutral placeholder.
function photo(file: string, height: number, alt: MenuImage["alt"]): MenuImage {
  return { src: `/${file}`, width: 828, height, alt };
}

function pdfPhoto(
  file: string,
  width: number,
  height: number,
  alt: MenuImage["alt"],
): MenuImage {
  return { src: `/images/menu/${file}`, width, height, alt };
}

const IMG = "WhatsApp Image 2026-10-10 at";

export const menu: MenuItem[] = [
  // ── Mama's Specials ───────────────────────────────────────────────
  {
    id: "mansaf",
    category: "specials",
    name: { ar: "منسف", en: "Mansaf" },
    ingredients: {
      ar: ["قطع لحم خاروف", "جميد أردني", "أرز", "مكسرات"],
      en: ["Lamb", "Jordanian jameed", "Rice", "Nuts"],
    },
    pricing: {
      type: "serving",
      options: [
        { id: "one", price: 40 },
        { id: "two", price: 75 },
      ],
    },
    image: photo(`${IMG} 1.05.04 PM.jpeg`, 1084, {
      ar: "منسف بقطع لحم الخاروف والأرز واللوز مع صلصة الجميد",
      en: "Mansaf with lamb, rice and almonds, served with jameed sauce",
    }),
    available: true,
  },
  {
    id: "maqluba",
    category: "specials",
    name: { ar: "مقلوبة", en: "Maqluba" },
    ingredients: {
      ar: ["أرز", "زهرة", "باذنجان", "دجاج"],
      en: ["Rice", "Cauliflower", "Eggplant", "Chicken"],
    },
    pricing: {
      type: "serving",
      options: [
        { id: "one", price: 33 },
        { id: "two", price: 60 },
      ],
    },
    // Same photo as the one beside Maqluba in the official menu.
    image: photo(`${IMG} 1.05.05 PM (2).jpeg`, 1088, {
      ar: "مقلوبة بالدجاج والأرز مع الزهرة والباذنجان",
      en: "Maqluba with chicken, rice, cauliflower and eggplant",
    }),
    available: true,
  },
  {
    id: "qudrah",
    category: "specials",
    name: { ar: "قدرة", en: "Qudrah" },
    ingredients: {
      ar: ["أرز", "حمص", "ثوم", "لحمة"],
      en: ["Rice", "Chickpeas", "Garlic", "Meat"],
    },
    pricing: {
      type: "serving",
      options: [
        { id: "one", price: 40 },
        { id: "two", price: 70 },
      ],
    },
    // Photo extracted from the official menu PDF (no individual file).
    image: pdfPhoto("qudrah.jpg", 384, 512, {
      ar: "قدرة باللحم والأرز والحمص",
      en: "Qudrah with meat, rice and chickpeas",
    }),
    available: true,
  },
  {
    id: "chicken-kabsa",
    category: "specials",
    name: { ar: "كبسة دجاج", en: "Chicken Kabsa" },
    ingredients: {
      ar: ["أرز", "دجاج", "مكسرات", "توابل عربية"],
      en: ["Rice", "Chicken", "Nuts", "Spices"],
    },
    pricing: {
      type: "serving",
      options: [
        { id: "one", price: 28 },
        { id: "two", price: 50 },
      ],
    },
    // Photo extracted from the official menu PDF (no individual file).
    image: pdfPhoto("chicken-kabsa.jpg", 390, 512, {
      ar: "كبسة دجاج مع الأرز والمكسرات",
      en: "Chicken kabsa with rice and nuts",
    }),
    available: true,
  },
  {
    id: "kofta-tomato",
    category: "specials",
    name: { ar: "كفتة بالبندورة", en: "Kofta in Tomato Sauce" },
    ingredients: {
      ar: ["لحمة كفتة", "صلصة طماطم", "أرز أبيض"],
      en: ["Beef kofta", "Tomato sauce", "White rice"],
    },
    pricing: {
      type: "serving",
      options: [
        { id: "one", price: 28 },
        { id: "two", price: 50 },
      ],
    },
    image: photo(`${IMG} 1.05.04 PM (2).jpeg`, 824, {
      ar: "كفتة بصلصة البندورة مع أرز أبيض في علبة مقسّمة",
      en: "Beef kofta in tomato sauce with white rice in a divided box",
    }),
    available: true,
  },
  {
    id: "kofta-tahini",
    category: "specials",
    name: { ar: "كفتة بالطحينية", en: "Kofta with Tahini" },
    ingredients: {
      ar: ["لحمة كفتة", "صلصة طحينية", "أرز أبيض"],
      en: ["Beef kofta", "Tahini sauce", "White rice"],
    },
    pricing: {
      type: "serving",
      options: [
        { id: "one", price: 28 },
        { id: "two", price: 50 },
      ],
    },
    image: photo(`${IMG} 1.05.05 PM (1).jpeg`, 1078, {
      ar: "كفتة بصلصة الطحينية مع أرز أبيض في علبة مقسّمة",
      en: "Beef kofta in tahini sauce with white rice in a divided box",
    }),
    available: true,
  },
  {
    id: "white-beans",
    category: "specials",
    name: { ar: "فاصولياء بيضاء", en: "White Beans with Meat" },
    ingredients: {
      ar: ["فاصولياء بيضاء", "لحمة", "أرز أبيض"],
      en: ["White beans", "Meat", "White rice"],
    },
    pricing: {
      type: "serving",
      options: [
        { id: "one", price: 28 },
        { id: "two", price: 50 },
      ],
    },
    image: photo(`${IMG} 1.05.03 PM (4).jpeg`, 1036, {
      ar: "فاصولياء بيضاء مع اللحم وأرز أبيض في علبة مقسّمة",
      en: "White beans with meat and white rice in a divided box",
    }),
    available: true,
  },
  {
    id: "okra",
    category: "specials",
    name: { ar: "بامية", en: "Okra with Meat" },
    ingredients: {
      ar: ["بامية", "لحمة", "أرز أبيض"],
      en: ["Okra", "Meat", "White rice"],
    },
    pricing: {
      type: "serving",
      options: [
        { id: "one", price: 28 },
        { id: "two", price: 50 },
      ],
    },
    image: photo(`${IMG} 1.05.02 PM.jpeg`, 1792, {
      ar: "بامية مع اللحم وأرز أبيض في علبة مقسّمة",
      en: "Okra with meat and white rice in a divided box",
    }),
    available: true,
  },

  // ── Healthy Meals ─────────────────────────────────────────────────
  {
    id: "grilled-chicken",
    category: "healthy",
    name: { ar: "دجاج مشوي", en: "Grilled Chicken" },
    ingredients: {
      ar: ["صدور دجاج", "أرز أبيض", "خضار سوتيه"],
      en: ["Chicken breast", "White rice", "Sautéed vegetables"],
    },
    pricing: { type: "fixed", price: 28 },
    image: photo(`${IMG} 1.05.03 PM (1).jpeg`, 1018, {
      ar: "صدر دجاج مشوي مع أرز أبيض وخضار في علبة مقسّمة",
      en: "Grilled chicken breast with white rice and vegetables in a divided box",
    }),
    available: true,
  },
  {
    id: "steak-vegetables",
    category: "healthy",
    name: {
      ar: "ستيك لحمة مع خضار على البخار",
      en: "Steak with Steamed Vegetables",
    },
    pricing: { type: "fixed", price: 35 },
    image: photo(`${IMG} 1.05.03 PM (3).jpeg`, 994, {
      ar: "ستيك لحمة مع خضار على البخار في علبة مقسّمة",
      en: "Steak with steamed vegetables in a divided box",
    }),
    available: true,
  },
  {
    id: "steak-rice",
    category: "healthy",
    name: { ar: "ستيك لحمة مع أرز أبيض", en: "Steak with White Rice" },
    pricing: { type: "fixed", price: 35 },
    image: photo(`${IMG} 1.05.03 PM (5).jpeg`, 1021, {
      ar: "ستيك لحمة مع أرز أبيض في علبة مقسّمة",
      en: "Steak with white rice in a divided box",
    }),
    available: true,
  },

  // ── Fresh Salads ──────────────────────────────────────────────────
  {
    id: "arugula-salad",
    category: "salads",
    name: { ar: "سلطة الجرجير", en: "Arugula Salad" },
    ingredients: {
      ar: ["جرجير", "طماطم", "جوز", "بصل", "خيار"],
      en: ["Arugula", "Tomato", "Walnuts", "Onion", "Cucumber"],
    },
    pricing: { type: "fixed", price: 20 },
    image: photo(`${IMG} 1.05.05 PM.jpeg`, 1081, {
      ar: "سلطة جرجير مع الجوز في وعاء أبيض",
      en: "Arugula salad with walnuts in a white bowl",
    }),
    available: true,
  },
  {
    id: "mosaic-salad",
    category: "salads",
    name: { ar: "سلطة مزاييك", en: "Mosaic Salad" },
    ingredients: {
      ar: ["فلفل ألوان", "خس", "طماطم", "مكسرات", "فواكه", "جبن"],
      en: ["Mixed peppers", "Lettuce", "Tomato", "Nuts", "Fruit", "Cheese"],
    },
    pricing: { type: "fixed", price: 24 },
    // The official menu shows this photo beside Mosaic Salad.
    image: photo(`${IMG} 1.05.05 PM (3).jpeg`, 1095, {
      ar: "سلطة مزاييك بالطماطم الملونة في وعاء أبيض",
      en: "Mosaic salad with colourful tomatoes in a white bowl",
    }),
    available: true,
  },
  {
    id: "quinoa-salad",
    category: "salads",
    name: { ar: "سلطة الكينوا", en: "Quinoa Salad" },
    ingredients: {
      ar: ["كينوا", "بصل أحمر", "طماطم", "جرجير", "جوز"],
      en: ["Quinoa", "Red onion", "Tomato", "Arugula", "Walnuts"],
    },
    pricing: { type: "fixed", price: 24 },
    // Photo extracted from the official menu PDF (no individual file). Only
    // 200 x 259 px, so it is shown contained; replace with a higher-resolution
    // original when the owner supplies one.
    image: {
      ...pdfPhoto("quinoa-salad.jpg", 200, 259, {
        ar: "سلطة كينوا مع الجوز والبصل الأحمر والطماطم في وعاء أبيض",
        en: "Quinoa salad with walnuts, red onion and tomatoes in a white bowl",
      }),
      lowResolution: true,
    },
    available: true,
  },
  {
    id: "caesar-salad",
    category: "salads",
    name: { ar: "سلطة سيزر", en: "Caesar Salad" },
    ingredients: {
      ar: ["خس", "طماطم", "خبز محمّص", "بارميزان", "صدور دجاج"],
      en: ["Lettuce", "Tomato", "Croutons", "Parmesan", "Chicken"],
    },
    pricing: { type: "fixed", price: 24 },
    image: photo(`${IMG} 1.05.03 PM (2).jpeg`, 1077, {
      ar: "سلطة سيزر مع شرائح الدجاج والخبز المحمّص",
      en: "Caesar salad with sliced chicken and croutons",
    }),
    available: true,
  },
  {
    id: "russian-salad",
    category: "salads",
    name: { ar: "سلطة روسية", en: "Russian Salad" },
    ingredients: {
      ar: ["جزر", "بطاطا", "بازيلاء", "مايونيز"],
      en: ["Carrot", "Potato", "Peas", "Mayonnaise"],
    },
    pricing: { type: "fixed", price: 20 },
    image: photo(`${IMG} 1.05.05 PM (4).jpeg`, 1088, {
      ar: "سلطة روسية بالجزر والبطاطا والبازيلاء في وعاء أبيض",
      en: "Russian salad with carrot, potato and peas in a white bowl",
    }),
    available: true,
  },

  // ── Pasta ─────────────────────────────────────────────────────────
  {
    id: "penne-alfredo",
    category: "pasta",
    name: { ar: "بيني ألفريدو", en: "Penne Alfredo" },
    ingredients: {
      ar: ["صدور دجاج", "فطر", "بازيلاء", "كريمة"],
      en: ["Chicken", "Mushrooms", "Peas", "Cream"],
    },
    pricing: { type: "fixed", price: 25 },
    // Photo extracted from the official menu PDF (no individual file).
    image: pdfPhoto("penne-alfredo.jpg", 326, 461, {
      ar: "باستا ألفريدو بالدجاج والفطر في وعاء أبيض",
      en: "Alfredo pasta with chicken and mushrooms in a white bowl",
    }),
    available: true,
  },
  {
    id: "shrimp-spaghetti",
    category: "pasta",
    name: { ar: "سباغيتي بالروبيان", en: "Shrimp Spaghetti" },
    ingredients: {
      ar: ["سباغيتي", "صوص طماطم", "روبيان"],
      en: ["Spaghetti", "Tomato sauce", "Shrimp"],
    },
    pricing: { type: "fixed", price: 30 },
    image: photo(`${IMG} 1.05.04 PM (1).jpeg`, 1102, {
      ar: "سباغيتي بصلصة الطماطم والروبيان في وعاء أبيض",
      en: "Spaghetti in tomato sauce with shrimp in a white bowl",
    }),
    available: true,
  },
];
