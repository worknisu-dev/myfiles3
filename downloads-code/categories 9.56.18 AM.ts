import { DuaCategory } from "../types/duas";

// ==================== DUA CATEGORIES ====================
// To add a new category:
//   1. Add a new entry here with a unique `id`
//   2. Create the corresponding dua data file in src/data/duas/
//   3. Import & spread it into ALL_DUAS in src/data/duas/index.ts
//
// Categories are displayed in `order` ascending.
// Set `isActive: false` to hide a category without deleting it.
export const DUA_CATEGORIES: DuaCategory[] = [
  {
    id: "daily",
    nameGu: "રોજની દુઆઓ",
    nameEn: "Daily Duas",
    icon: "🤲",
    materialIcon: "hands-pray",
    color: "#7fecfa",
    order: 1,
    isActive: true,
  },
  {
    id: "ruqyah",
    nameGu: "રૂક્યાહ અને બીમારી માટેની દુઆઓ",
    nameEn: "Ruqyah & Illness Duas",
    icon: "🩺",
    materialIcon: "medical-bag",
    color: "#f6b5b5",
    order: 2,
    isActive: true,
  },
  {
    id: "morning_evening",
    nameGu: "સવાર-સાંજના અઝકાર",
    nameEn: "Morning & Evening Adhkar",
    icon: "🌅",
    materialIcon: "weather-sunset-up",
    color: "#f2f293",
    order: 3,
    isActive: true,
    displayStyle: "card",
  },
  {
    id: "before_sleep",
    nameGu: "સૂતા પહેલાંના અઝકાર",
    nameEn: "Before Sleeping Adhkar",
    icon: "🌙",
    materialIcon: "sleep",
    color: "#50617e",
    order: 4,
    isActive: true,
  },
  {
    id: "after_waking",
    nameGu: "ઊઠ્યા પછીની દુઆઓ",
    nameEn: "After Waking Up Duas",
    icon: "☀️",
    materialIcon: "weather-sunny",
    color: "#fcdc7d",
    order: 5,
    isActive: true,
  },
  {
    id: "salah",
    nameGu: "નમાઝની દુઆઓ",
    nameEn: "Salah Duas",
    icon: "🕌",
    materialIcon: "mosque",
    color: "#89f9b6f5",
    order: 6,
    isActive: true,
  },
  {
    id: "after_salah",
    nameGu: "નમાઝ પછીની દુઆઓ",
    nameEn: "After Salah Duas",
    icon: "🤲",
    materialIcon: "hands-pray",
    color: "#71f9cce6",
    order: 7,
    isActive: true,
  },
  {
    id: "quranic",
    nameGu: "કુરઆની દુઆઓ",
    nameEn: "Quranic Duas",
    icon: "📖",
    materialIcon: "book-open-variant",
    color: "#14b8a6",
    order: 8,
    isActive: true,
  },
  {
    id: "sunnah",
    nameGu: "સુન્નતથી સાબિત દુઆઓ",
    nameEn: "Sunnah Duas",
    icon: "🌙",
    materialIcon: "star-crescent",
    color: "#e2ad87",
    order: 9,
    isActive: true,
  },
  {
    id: "travel",
    nameGu: "મુસાફરીની દુઆઓ",
    nameEn: "Travel Duas",
    icon: "✈️",
    materialIcon: "airplane",
    color: "#0ea5e9",
    order: 10,
    isActive: true,
  },
  {
    id: "istighfar",
    nameGu: "તૌબા અને ઇસ્તિગફારની દુઆઓ",
    nameEn: "Forgiveness (Istighfar) Duas",
    icon: "🤲",
    materialIcon: "hand-heart",
    color: "#84f8e1",
    order: 11,
    isActive: true,
  },
  {
    id: "worship",
    nameGu: "ઇબાદતમાં પઢવાની દુઆઓ",
    nameEn: "Duas for Worship",
    icon: "🕋",
    materialIcon: "mosque",
    color: "#888afc",
    order: 12,
    isActive: true,
  },
  {
    id: "hajj_umrah",
    nameGu: "હજ અને ઉમરાહની દુઆઓ",
    nameEn: "Hajj & Umrah Duas",
    icon: "🕋",
    materialIcon: "kaaba",
    color: "#74b4c4",
    order: 13,
    isActive: true,
  },
  {
    id: "qurbani",
    nameGu: "કુર્બાનીની દુઆઓ",
    nameEn: "Qurbani Duas",
    icon: "🐐",
    materialIcon: "knife",
    color: "#976bfc",
    order: 14,
    isActive: true,
  },
  {
    id: "janazah",
    nameGu: "જનાઝાની નમાઝની દુઆઓ",
    nameEn: "Janazah Duas",
    icon: "⚰️",
    materialIcon: "grave-stone",
    color: "#6b7280",
    order: 15,
    isActive: true,
  },
];
/**
 * Get all active categories sorted by order.
 */
export const getActiveCategories = (): DuaCategory[] =>
  DUA_CATEGORIES.filter((c) => c.isActive).sort((a, b) => a.order - b.order);

/**
 * Get a single category by id.
 */
export const getCategoryById = (id: string): DuaCategory | undefined =>
  DUA_CATEGORIES.find((c) => c.id === id);
