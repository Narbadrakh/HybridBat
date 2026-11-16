// Загвар бүрийн hybrid батерейны лавлах мэдээлэл.
// Дараа нь Supabase-ийн `models` / `generations` хүснэгт рүү шилжүүлнэ.
//
// `check: true` гэсэн утгууд нь бүрэн баталгаажаагүй — нийтлэхээс өмнө
// албан ёсны засварын гарын авлага эсвэл батерейны шошготой тулгаж нягтлах.

export type Chemistry = "NiMH" | "Li-ion";

export type BatterySpec = {
  chemistry: Chemistry;
  voltage: number | null; // V (нэрлэсэн)
  modules: number | null; // модулийн тоо (Li-ion бол эсийн тоо)
  capacityAh: number | null;
  location: string;
  check?: boolean;
};

export type Generation = {
  code: string; // кузовын код
  years: string;
  batteries: { label?: string; spec: BatterySpec }[];
  notes?: string[];
};

export type Model = {
  slug: string;
  name: string;
  years: string;
  family: string; // нэг гэр бүлийн загварууд (жишээ нь бүх Prius) хоорондоо шилжинэ
  generations: Generation[];
};

export const MODELS: Model[] = [
  {
    slug: "prius-20",
    name: "Prius 20",
    years: "2003-2009",
    family: "prius",
    generations: [
      {
        code: "NHW20",
        years: "2003-2009",
        batteries: [
          {
            spec: {
              chemistry: "NiMH",
              voltage: 201.6,
              modules: 28,
              capacityAh: 6.5,
              location: "Арын суудлын ард, ачааны тасалгааны шалан доор",
            },
          },
        ],
        notes: [
          "Хамгийн хуучин үе тул ихэнх батерей насжилтын улмаас модуль сулрах, тэнцвэр алдагдах асуудалтай.",
          "Prius 30-тай ижил хүчдэлтэй (201.6V) ч савлагаа, холбогч, хяналтын хэсэг нь өөр тул блокоор нь сольж тавих боломжгүй.",
        ],
      },
    ],
  },
  {
    slug: "prius-30",
    name: "Prius 30",
    years: "2009-2015",
    family: "prius",
    generations: [
      {
        code: "ZVW30",
        years: "2009-2015",
        batteries: [
          {
            spec: {
              chemistry: "NiMH",
              voltage: 201.6,
              modules: 28,
              capacityAh: 6.5,
              location: "Арын суудлын ард, ачааны тасалгааны шалан доор",
            },
          },
        ],
        notes: [
          "Монголд хамгийн түгээмэл үе. Модуль солих, тэнцвэржүүлэх засвар хамгийн их хийгддэг.",
          "Батерейны хөргөлтийн сэнс, шүүлтүүр бөглөрөх нь батерейны насжилтыг хурдасгадаг.",
        ],
      },
    ],
  },
  {
    slug: "prius-50",
    name: "Prius 50",
    years: "2015-2022",
    family: "prius",
    generations: [
      {
        code: "ZVW50 / 51 / 55",
        years: "2015-2022",
        batteries: [
          {
            label: "NiMH хувилбар",
            spec: {
              chemistry: "NiMH",
              voltage: 201.6,
              modules: 28,
              capacityAh: 6.5,
              location: "Арын суудлын доор",
            },
          },
          {
            label: "Li-ion хувилбар",
            spec: {
              chemistry: "Li-ion",
              voltage: 207.2,
              modules: 56,
              capacityAh: 3.6,
              location: "Арын суудлын доор",
            },
          },
        ],
        notes: [
          "Зах зээл, комплектаци, 2WD / E-Four-оос хамаарч NiMH эсвэл Li-ion батерейтай ирдэг. Худалдан авахаасаа өмнө батерейны шошгыг заавал шалгаарай.",
          "NiMH ба Li-ion батерей хоорондоо сольж тавигдахгүй.",
        ],
      },
    ],
  },
  {
    slug: "aqua",
    name: "Aqua",
    years: "2011-2021",
    family: "aqua",
    generations: [
      {
        code: "NHP10",
        years: "2011-2021",
        batteries: [
          {
            spec: {
              chemistry: "NiMH",
              voltage: 144,
              modules: 20,
              capacityAh: 6.5,
              location: "Арын суудлын доор",
            },
          },
        ],
        notes: ["Prius-ээс жижиг (20 модуль) батерейтай тул Prius-ийн батерейтай сольж тавигдахгүй."],
      },
    ],
  },
  {
    slug: "camry",
    name: "Camry Hybrid",
    years: "2006-2017",
    family: "camry",
    generations: [
      {
        code: "AHV40",
        years: "2006-2011",
        batteries: [
          {
            spec: {
              chemistry: "NiMH",
              voltage: 244.8,
              modules: 34,
              capacityAh: 6.5,
              location: "Арын суудлын ард (тээшний урд хэсэг)",
            },
          },
        ],
      },
      {
        code: "AVV50",
        years: "2011-2017",
        batteries: [
          {
            spec: {
              chemistry: "NiMH",
              voltage: 244.8,
              modules: 34,
              capacityAh: 6.5,
              location: "Арын суудлын ард (тээшний урд хэсэг)",
            },
          },
        ],
        notes: ["AHV40 ба AVV50 ижил хүчдэлтэй ч савлагаа нь өөр. Кузовын кодоор нь тааруулж аваарай."],
      },
    ],
  },
  {
    slug: "alphard",
    name: "Alphard Hybrid",
    years: "2011-2015",
    family: "alphard",
    generations: [
      {
        code: "ATH20",
        years: "2011-2015",
        batteries: [
          {
            spec: {
              chemistry: "NiMH",
              voltage: null,
              modules: null,
              capacityAh: null,
              location: "Тодруулах",
              check: true,
            },
          },
        ],
      },
    ],
  },
  {
    slug: "harrier",
    name: "Harrier Hybrid",
    years: "2014-2020",
    family: "harrier",
    generations: [
      {
        code: "AVU65",
        years: "2014-2020",
        batteries: [
          {
            spec: {
              chemistry: "NiMH",
              voltage: 244.8,
              modules: 34,
              capacityAh: 6.5,
              location: "Арын суудлын доор",
              check: true,
            },
          },
        ],
      },
    ],
  },
];

export function getModel(slug: string) {
  return MODELS.find((m) => m.slug === slug);
}

export function getFamily(model: Model) {
  return MODELS.filter((m) => m.family === model.family);
}
