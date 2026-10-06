// Toshkanov Ulug'bek AI Assistant Service
// Bu xizmat Gemini API orqali yoki to'liq offline / aqlli bilimlar bazasi orqali javob beradi.

export const PORTFOLIO_KNOWLEDGE = {
  name: "Toshkanov Ulug'bek",
  title: "Frontend Dasturchi (React & Next.js Mutaxassisi)",
  age: 19,
  location: "Toshkent, O'zbekiston",
  email: "toshkanov.4321@icloud.com",
  telegram: "@mufizm",
  telegramLink: "https://t.me/mufizm",
  linkedin: "https://www.linkedin.com/login",
  skills: [
    "HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", 
    "React", "Next.js", "Redux / Redux Toolkit", "Tailwind CSS", 
    "SCSS / SASS", "REST API", "Git / GitHub", "Responsive Design", "Clean Code"
  ],
  education: {
    institution: "Najot Ta'lim",
    period: "2025 – 2026",
    role: "Frontend Dasturchi · Bitiruvchi",
    description: "Intensiv kurs davomida zamonaviy veb texnologiyalarni chuqur o'rgandi. Amaliy loyihalar orqali real tajriba orttirdi. REST API bilan ishlash, responsive dizayn va clean code amaliyotlarini o'zlashtirdi."
  },
  projects: [
    {
      name: "Foodzy",
      description: "Taomlar buyurtma qilish va restoranlar uchun zamonaviy veb ilova. Foydalanuvchilar qulay interfeys orqali taomlarni tanlab, buyurtma bera oladilar.",
      url: "https://exam-7-delta.vercel.app/",
      tags: ["React", "Tailwind CSS", "REST API"]
    },
    {
      name: "Zoo Market",
      description: "Uy hayvonlari va ularga kerakli mahsulotlar uchun e-tijorat (online do'kon) platformasi. Mahsulotlarni filtrlash, savatcha va buyurtma funksiyalari mavjud.",
      url: "https://zoo-market-livid.vercel.app/",
      tags: ["React", "Redux", "Tailwind CSS"]
    },
    {
      name: "Sport News",
      description: "Eng so'nggi sport yangiliklari va maqolalari taqdim etiladigan portal. Figma dizayni asosida to'liq pikselligi bilan yaratilgan tezkor platforma.",
      url: "https://figmamext1.vercel.app/",
      tags: ["React", "Next.js", "Responsive Design"]
    }
  ],
  about: "Toshkanov Ulug'bek — 19 yoshli, o'z kasbining ustasi bo'lishga intilayotgan Frontend Dasturchi. Najot Ta'lim bitiruvchisi. Toza, samarali, tezkor va foydalanuvchi uchun maksimal qulay veb ilovalar yaratishga ixtisoslashgan."
};

const SYSTEM_PROMPT = `
Siz Toshkanov Ulug'bekning shaxsiy portfoliosi uchun yaratilgan aqlli "Toshkanov AI" yordamchisisiz.
Sizning vazifangiz — sayt mehmonlariga Toshkanov Ulug'bek haqida, uning ko'nikmalari, loyihalari, ta'limi va bog'lanish ma'lumotlari haqida samimiy, professional va aniq javob berish.

Ulug'bek haqidagi ma'lumotlar:
- Ismi: Toshkanov Ulug'bek
- Kasbi: Frontend Dasturchi (React, Next.js, TypeScript, Tailwind)
- Yoshi: 19 yosh
- Manzili: Toshkent, O'zbekiston
- O'qish joyi: Najot Ta'lim (2025–2026, Frontend yo'nalishi bitiruvchisi)
- Ko'nikmalari: HTML5, CSS3, JavaScript, TypeScript, React, Next.js, Redux, Tailwind CSS, SCSS, REST API, Git, Responsive Web Design
- Loyihalari:
  1. Foodzy (https://exam-7-delta.vercel.app/) - Taomlar buyurtma qilish platformasi
  2. Zoo Market (https://zoo-market-livid.vercel.app/) - Uy hayvonlari do'koni
  3. Sport News (https://figmamext1.vercel.app/) - Sport yangiliklari portali
- Bog'lanish:
  - Email: toshkanov.4321@icloud.com
  - Telegram: https://t.me/mufizm (@mufizm)
  - CV: Sayt orqali PDF shaklida yuklab olish mumkin

Qoidalar:
1. Doimo do'stona, professional va aniq javob bering.
2. O'zbek, Rus yoki Ingliz tillarida berilgan savolga shu tilda javob bering (standart til: O'zbek tili).
3. Kerak bo'lsa loyihalar havolasini yoki bog'lanish ma'lumotlarini taqdim eting.
4. Javobingizda chiroyli emoji va qulay formatlashdan foydalaning.
`;

/**
 * Gemini API orqali javob olish
 */
async function fetchGeminiResponse(userMessage, chatHistory = [], apiKey) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const contents = [
    {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }]
    },
    {
      role: "model",
      parts: [{ text: "Tushundim! Men Toshkanov Ulug'bekning AI yordamchisiman va uning portfoliosi, ko'nikmalari hamda loyihalari haqida har qanday savolga aniq va samimiy javob beraman." }]
    },
    ...chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })),
    {
      role: "user",
      parts: [{ text: userMessage }]
    }
  ];

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}

/**
 * Mahalliy aqlli javob berish (Built-in Knowledge Engine)
 * API kalit bo'lmasa yoki tarmoq xatosi yuz berganda ishlaydi.
 */
function getLocalSmartResponse(input) {
  const query = input.toLowerCase().trim();

  // Salomlashish
  if (/^(salom|assalomu|qalaysiz|qale|privet|hi|hello|hey|xayrli)/i.test(query)) {
    return {
      text: "Assalomu alaykum! Men Toshkanov Ulug'bekning AI yordamchisiman 🚀.\n\nSizga Ulug'bekning loyihalari, ko'nikmalari, ta'limi yoki bog'lanish ma'lumotlari haqida qanday yordam bera olaman?",
      action: null,
      suggestions: ["Ko'nikmalari qanday?", "Loyihalar haqida ma'lumot", "CV yuklash", "Bog'lanish"]
    };
  }

  // Kim bu / Ulug'bek haqida
  if (query.includes("kim") || query.includes("haqida") || query.includes("about") || query.includes("yosh") || query.includes("bio") || query.includes("o'zi")) {
    return {
      text: `👋 **Toshkanov Ulug'bek** — 19 yoshli iqtidorli Frontend Dasturchi (React & Next.js mutaxassisi).\n\n📍 **Manzil:** Toshkent, O'zbekiston\n🎓 **Ta'lim:** Najot Ta'lim bitiruvchisi\n💻 **Ixtisosligi:** Zamonaviy, tez va foydalanuvchiga qulay veb ilovalar, SPA va interfeyslar yaratish.`,
      action: "scroll-about",
      actionText: "Men haqimda bo'limi",
      suggestions: ["Ko'nikmalari qanday?", "Loyihalarni ko'rish", "Bog'lanish"]
    };
  }

  // Ko'nikmalar / Skills / Texnologiyalar
  if (query.includes("skill") || query.includes("texnologiya") || query.includes("ko'nikma") || query.includes("biladi") || query.includes("stack") || query.includes("bilasan") || query.includes("qaysi tillar")) {
    return {
      text: `🛠 **Ulug'bek egallagan texnologiyalar va ko'nikmalar:**\n\n` +
        `• **Asosiy:** React.js, Next.js, JavaScript (ES6+), TypeScript\n` +
        `• **Styling:** Tailwind CSS, SCSS/SASS, CSS3, Responsive Design\n` +
        `• **State Management & Tools:** Redux Toolkit, Context API, Git, GitHub, REST API\n` +
        `• **Metodologiya:** Clean Code, Component-Driven Development`,
      action: "scroll-about",
      suggestions: ["Qanday loyihalar qilgan?", "Ta'limi qayerda?", "CV yuklab olish"]
    };
  }

  // Loyihalar / Portfolio
  if (query.includes("loyiha") || query.includes("project") || query.includes("portfolio") || query.includes("foodzy") || query.includes("zoo") || query.includes("sport") || query.includes("ishlari")) {
    return {
      text: `💼 **Ulug'bekning asosiy loyihalari:**\n\n` +
        `1. 🍔 **[Foodzy](https://exam-7-delta.vercel.app/)** — Taomlar buyurtma qilish uchun veb ilova (React, Tailwind, REST API).\n` +
        `2. 🐾 **[Zoo Market](https://zoo-market-livid.vercel.app/)** — Uy hayvonlari do'koni platformasi (React, Redux, Tailwind).\n` +
        `3. ⚽ **[Sport News](https://figmamext1.vercel.app/)** — Sport yangiliklari va maqolalari portali (React, Next.js).\n\nLoyiha nomini bosing yoki to'liq ko'rish uchun quyidagi bo'limga o'ting:`,
      action: "scroll-portfolio",
      actionText: "Loyihalar bo'limiga o'tish",
      suggestions: ["Foodzy nima?", "Zoo Market haqida", "CV yuklash", "Bog'lanish"]
    };
  }

  // Foodzy haqida alohida
  if (query.includes("foodzy")) {
    return {
      text: `🍔 **Foodzy Loyihasi**:\n\nBu restoranlar va taom buyurtma qilish tizimi. Foydalanuvchilar qulay interfeys orqali taomlarni menyudan tanlashlari va buyurtma berishlari mumkin.\n\n🔗 Havola: [Foodzy Saytini Ochish](https://exam-7-delta.vercel.app/)`,
      suggestions: ["Zoo Market loyihasi", "Sport News", "Bog'lanish"]
    };
  }

  // Zoo market haqida
  if (query.includes("zoo")) {
    return {
      text: `🐾 **Zoo Market Loyihasi**:\n\nUy hayvonlari va ularga kerakli mahsulotlar uchun onlayn do'kon. Qidiruv, toifalar bo'yicha saralash va savatcha tizimi to'liq ishlab chiqilgan.\n\n🔗 Havola: [Zoo Market Saytini Ochish](https://zoo-market-livid.vercel.app/)`,
      suggestions: ["Foodzy loyihasi", "Sport News", "Bog'lanish"]
    };
  }

  // Ta'lim / Najot Ta'lim
  if (query.includes("ta'lim") || query.includes("o'qish") || query.includes("najot") || query.includes("kurs") || query.includes("univer") || query.includes("diplom") || query.includes("talim")) {
    return {
      text: `🎓 **Ta'lim va O'quv Markazi:**\n\nUlug'bek O'zbekistonning yetakchi IT akademiyasi — **Najot Ta'lim**da Frontend Dasturlash kursini muvaffaqiyatli tamomlagan (2025–2026).\n\nKurs davomida real amaliy keyslar, jamoaviy ishlash va xalqaro andozadagi Clean Code qoidalarini puxta o'rgangan.`,
      action: "scroll-education",
      actionText: "Ta'lim bo'limiga o'tish",
      suggestions: ["Ko'nikmalari", "Loyihalari", "Bog'lanish"]
    };
  }

  // Bog'lanish / Kontaktlar / Telegram / Email / Telefon
  if (query.includes("bog'lan") || query.includes("kontakt") || query.includes("aloqa") || query.includes("telefon") || query.includes("telegram") || query.includes("email") || query.includes("pochta") || query.includes("yozish") || query.includes("contact")) {
    return {
      text: `📬 **Ulug'bek bilan bog'lanish usullari:**\n\n` +
        `• ✈️ **Telegram:** [@mufizm](https://t.me/mufizm)\n` +
        `• ✉️ **Email:** toshkanov.4321@icloud.com\n` +
        `• 💼 **LinkedIn:** [Profil](https://www.linkedin.com/login)\n` +
        `• 📍 **Manzil:** Toshkent, O'zbekiston\n\nSaytdagi forma orqali ham to'g'ridan-to'g'ri xabar qoldirishingiz mumkin!`,
      action: "scroll-contact",
      actionText: "Bog'lanish formasiga o'tish",
      suggestions: ["CV yuklab olish", "Loyihalarni ko'rish"]
    };
  }

  // CV / Rezyume
  if (query.includes("cv") || query.includes("rezyume") || query.includes("resume") || query.includes("pdf") || query.includes("yukla")) {
    return {
      text: `📄 **Toshkanov Ulug'bekning CV (Rezyume)si:**\n\nSiz sahifaning yuqori qismidagi yoki pastdagi tugmani bosish orqali to'liq professional PDF formatdagi CV-ni yuklab olishingiz mumkin.`,
      action: "trigger-cv",
      actionText: "📥 CV-ni PDF yuklab olish",
      suggestions: ["Ko'nikmalari", "Bog'lanish", "Loyihalar"]
    };
  }

  // Narx / Xizmatlar / Hamkorlik
  if (query.includes("narx") || query.includes("buyurtma") || query.includes("sayt yarat") || query.includes("xizmat") || query.includes("ish") || query.includes("vakansiya") || query.includes("freelance")) {
    return {
      text: `🤝 **Hamkorlik va Buyurtmalar:**\n\nUlug'bek zamonaviy veb saytlar, landing page-lar, korporativ portallar va murakkab Frontend ilovalarini ishlab chiqishga tayyor.\n\nLoyiha talablari va narxlarni muhokama qilish uchun to'g'ridan-to'g'ri Telegram orqali [@mufizm](https://t.me/mufizm) ga yozishingiz yoki bog'lanish bo'limidan xabar yuborishingiz mumkin.`,
      action: "scroll-contact",
      actionText: "Xabar yuborish",
      suggestions: ["Telegramga yozish", "Loyihalarni ko'rish", "CV yuklash"]
    };
  }

  // Umumiy / Default aqlli javob
  return {
    text: `Savolingiz uchun rahmat! 😊\n\nMen Toshkanov Ulug'bek haqidagi ma'lumotlar bo'yicha yordam bera olaman. Quyidagi mavzulardan birini tanlashingiz yoki aniq savol berishingiz mumkin:`,
    suggestions: [
      "Ulug'bek kim?",
      "Qaysi texnologiyalarni biladi?",
      "Loyihalarini ko'rsat",
      "Najot Ta'limda o'qishi",
      "Bog'lanish ma'lumotlari",
      "CV yuklash"
    ]
  };
}

/**
 * Asosiy so'rov yuborish funksiyasi
 */
export async function sendChatMessage(userMessage, chatHistory = []) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_AI_API_KEY;

  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY') {
    try {
      const responseText = await fetchGeminiResponse(userMessage, chatHistory, apiKey);
      if (responseText) {
        return {
          text: responseText,
          action: null,
          suggestions: ["Boshqa savol berish", "Loyihalar", "Bog'lanish"]
        };
      }
    } catch (err) {
      console.warn("Gemini API chaqiruvida xatolik, mahalliy AI ishga tushdi:", err);
    }
  }

  // Fallback - aqlli mahalliy javob
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getLocalSmartResponse(userMessage));
    }, 450); // Tabiiy yozish effekti uchun qisqa kechikish
  });
}
