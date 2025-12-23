import { Product, Brand } from './types';

export const CATEGORIES = {
  ar: ["شوكولاتة داكنة", "شوكولاتة بالحليب", "شوكولاتة بيضاء", "نكهات فواكه", "عروض خاصة"],
  en: ["Dark Chocolate", "Milk Chocolate", "White Chocolate", "Fruit Flavors", "Special Offers"],
};

const PRODUCT_IMAGE_URL = 'https://storage.googleapis.com/aymand/products/pic1.jpeg';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: {
      ar: "علبة سوبريم كاكاو – ٥ قطع",
      en: "Supreme Cocoa Bomb Box – 5 Pieces"
    },
    category: {
      ar: "عروض خاصة",
      en: "Special Offers"
    },
    price: 58.99,
    imageUrl: PRODUCT_IMAGE_URL,
    description: {
      ar: "علبة فاخرة تحتوي على 5 قطع من قنابل الشوكولاتة الساخنة المصنوعة من أجود أنواع الكاكاو والمارشميلو.",
      en: "A premium pack of 5 rich chocolate bombs filled with mini marshmallows. Perfect for gifting or cozy nights."
    },
    featured: true,
  },
  {
    id: 2,
    name: {
      ar: "علبة سوبريم كاكاو العائلية – ١٠ قطع",
      en: "Supreme Cocoa Family Box – 10 Pieces"
    },
    category: {
      ar: "عروض خاصة",
      en: "Special Offers"
    },
    price: 99.99,
    imageUrl: PRODUCT_IMAGE_URL,
    description: {
      ar: "علبة عائلية مميزة تضم 10 قطع من قنابل الشوكولاتة الغنية، مناسبة للمشاركة والجلسات العائلية.",
      en: "A family-size box of 10 handcrafted cocoa bombs. Great for sharing and gatherings."
    },
    featured: true,
  },
  {
    id: 3,
    name: {
      ar: "علبة بارتي شوكوبوم – ٢٠ قطعة (توصيل مجاني)",
      en: "Choco Bomb Party Box – 20 Pieces (Free Delivery)"
    },
    category: {
      ar: "عروض خاصة",
      en: "Special Offers"
    },
    price: 179.99,
    imageUrl: PRODUCT_IMAGE_URL,
    description: {
      ar: "أكبر باقة لدينا، تضم 20 قطعة من قنابل الشوكولاتة الساخنة، مثالية للحفلات والتجمعات — مع توصيل مجاني.",
      en: "A large party box of 20 chocolate bombs. Ideal for events, offices, and bulk gifting — with free delivery."
    },
    featured: true,
  },
  {
    id: 4,
    name: {
      ar: "علبة بارتي شوكوبوم p2 – ٢٤ قطعة (توصيل مجاني)",
      en: "Choco Bomb Party Box p2 – 24 Pieces (Free Delivery)"
    },
    category: {
      ar: "عروض خاصة",
      en: "Special Offers"
    },
    price: 199.99,
    imageUrl: PRODUCT_IMAGE_URL,
    description: {
      ar: "علبة بارتي كبيرة تضم 24 قطعة من قنابل الشوكولاتة الساخنة، مثالية للمناسبات والمكاتب والهدايا الكبيرة — مع توصيل مجاني.",
      en: "A large party box of 24 chocolate bombs. Ideal for events, offices, and bulk gifting — with free delivery."
    },
    featured: true,
  },
  {
    id: 5,
    name: {
      ar: "قنبلة الشوكولاتة الكلاسيكية",
      en: "Classic Milk Chocolate Bomb"
    },
    category: {
      ar: "شوكولاتة بالحليب",
      en: "Milk Chocolate"
    },
    price: 15.00,
    imageUrl: PRODUCT_IMAGE_URL,
    description: {
      ar: "قنبلة شوكولاتة كلاسيكية بالحليب تذوب لتكشف عن المارشميلو اللذيذ.",
      en: "Our signature milk chocolate shell that melts away to reveal a heart of fluffy marshmallows."
    }
  },
  {
    id: 6,
    name: {
      ar: "سحر الشوكولاتة الداكنة",
      en: "Dark Chocolate Magic"
    },
    category: {
      ar: "شوكولاتة داكنة",
      en: "Dark Chocolate"
    },
    price: 18.00,
    imageUrl: PRODUCT_IMAGE_URL,
    description: {
      ar: "لعشاق الشوكولاتة الداكنة، نكهة غنية ومركزة تمنحك الدفء.",
      en: "A rich 70% dark chocolate shell for those who appreciate a deeper, more sophisticated cocoa experience."
    }
  },
  {
    id: 7,
    name: {
      ar: "أحلام الفانيليا البيضاء",
      en: "White Vanilla Dream"
    },
    category: {
      ar: "شوكولاتة بيضاء",
      en: "White Chocolate"
    },
    price: 16.00,
    imageUrl: PRODUCT_IMAGE_URL,
    description: {
      ar: "شوكولاتة بيضاء ناعمة وكريمية مع لمسة من الفانيليا الفاخرة.",
      en: "Creamy white chocolate infused with premium vanilla bean, perfect for a lighter sweet treat."
    }
  },
  {
    id: 8,
    name: {
      ar: "مفاجأة الكراميل المملح",
      en: "Salted Caramel Surprise"
    },
    category: {
      ar: "نكهات فواكه",
      en: "Fruit Flavors"
    },
    price: 20.00,
    imageUrl: PRODUCT_IMAGE_URL,
    description: {
      ar: "مزيج مذهل من الشوكولاتة والكراميل المملح الذي يذوب في فمك.",
      en: "A perfect balance of sweet and salty, featuring our house-made caramel center."
    }
  }
];

export const MOCK_BRANDS: Brand[] = [
  {
    name: "Swiss Cocoa",
    logoUrl: "https://www.vectorlogo.zone/logos/google/google-icon.svg"
  },
  {
    name: "Belgian Delights",
    logoUrl: "https://www.vectorlogo.zone/logos/apple/apple-icon.svg"
  },
  {
    name: "Pure Dark",
    logoUrl: "https://www.vectorlogo.zone/logos/facebook/facebook-official.svg"
  },
  {
    name: "Velvet Milk",
    logoUrl: "https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg"
  },
  {
    name: "Artisan Sweet",
    logoUrl: "https://www.vectorlogo.zone/logos/netflix/netflix-icon.svg"
  }
];
