export type MealItem = {
  name: string;
  portion: string;
  kcal: number;
};

export type MealEntry = {
  id: string;
  title: string;
  time: string;
  items: MealItem[];
  kcal: number;
};

export type HistoryDay = {
  date: string;
  meals: MealEntry[];
};

export const TODAY_MEALS: MealEntry[] = [
  {
    id: "breakfast",
    title: "早餐",
    time: "08:12",
    kcal: 420,
    items: [
      { name: "全麦吐司", portion: "2 片", kcal: 180 },
      { name: "牛奶", portion: "250 ml", kcal: 120 },
      { name: "水煮蛋", portion: "1 个", kcal: 120 }
    ]
  },
  {
    id: "lunch",
    title: "午餐",
    time: "12:48",
    kcal: 680,
    items: [
      { name: "番茄炒蛋", portion: "1 份", kcal: 260 },
      { name: "清炒西兰花", portion: "1 份", kcal: 120 },
      { name: "米饭", portion: "1 碗", kcal: 300 }
    ]
  }
];

export const HISTORY_DAYS: HistoryDay[] = [
  {
    date: "12/29",
    meals: [
      ...TODAY_MEALS,
      {
        id: "dinner",
        title: "晚餐",
        time: "19:06",
        kcal: 520,
        items: [
          { name: "鸡胸肉沙拉", portion: "1 份", kcal: 260 },
          { name: "玉米", portion: "1 根", kcal: 180 },
          { name: "酸奶", portion: "1 杯", kcal: 80 }
        ]
      }
    ]
  },
  {
    date: "12/28",
    meals: [
      {
        id: "12-28-lunch",
        title: "午餐",
        time: "12:31",
        kcal: 610,
        items: [
          { name: "牛肉面", portion: "1 碗", kcal: 540 },
          { name: "凉拌黄瓜", portion: "1 份", kcal: 70 }
        ]
      },
      {
        id: "12-28-dinner",
        title: "晚餐",
        time: "19:20",
        kcal: 530,
        items: [
          { name: "烤鱼", portion: "1 份", kcal: 320 },
          { name: "小米粥", portion: "1 碗", kcal: 210 }
        ]
      }
    ]
  }
];

export const NUTRITION_SUMMARY = {
  kcal: 1680,
  protein_g: 82,
  fat_g: 58,
  carb_g: 205,
  fiber_g: 23,
  sugar_g: 34,
  sodium_mg: 1850
};

export const RECOGNIZED_ITEMS: MealItem[] = [
  { name: "番茄炒蛋", portion: "1 份", kcal: 260 },
  { name: "清炒西兰花", portion: "1 份", kcal: 120 },
  { name: "米饭", portion: "1 碗", kcal: 300 }
];
