import { Recipe, RecipeIngredient, RecipeStep } from '@/types/recipe';

// テスト用のレシピデータ
export const mockRecipeIngredients: RecipeIngredient[] = [
  {
    _id: "ing1",
    recipeId: "recipe1",
    name: "米",
    amount: "2",
    unit: "合",
    note: "新潟産コシヒカリがおすすめ",
    order: 1
  },
  {
    _id: "ing2",
    recipeId: "recipe1",
    name: "具材（鶏肉、人参、ごぼう、こんにゃく等）",
    amount: "適量",
    unit: "",
    note: "地域の特産品を使うと良い",
    order: 2
  },
  {
    _id: "ing3",
    recipeId: "recipe1",
    name: "醤油",
    amount: "大さじ3",
    unit: "",
    note: "地元の醤油を使用",
    order: 3
  },
  {
    _id: "ing4",
    recipeId: "recipe1",
    name: "みりん",
    amount: "大さじ2",
    unit: "",
    order: 4
  },
  {
    _id: "ing5",
    recipeId: "recipe1",
    name: "砂糖",
    amount: "大さじ1",
    unit: "",
    order: 5
  },
  {
    _id: "ing6",
    recipeId: "recipe1",
    name: "だし汁",
    amount: "適量",
    unit: "",
    note: "昆布と鰹節でとった出汁",
    order: 6
  }
];

export const mockRecipeSteps: RecipeStep[] = [
  {
    _id: "step1",
    recipeId: "recipe1",
    stepNumber: 1,
    instruction: "米をといで30分以上水に浸します。",
    tips: "水に浸すことでふっくらと炊き上がります。"
  },
  {
    _id: "step2",
    recipeId: "recipe1",
    stepNumber: 2,
    instruction: "具材を食べやすい大きさに切ります。鶏肉は一口大、野菜は薄切りにします。",
    tips: "火の通りを均一にするため、大きさを揃えましょう。"
  },
  {
    _id: "step3",
    recipeId: "recipe1",
    stepNumber: 3,
    instruction: "鍋で具材を炒め、調味料（醤油、みりん、砂糖）を加えて煮詰めます。",
    tips: "具材から出る旨味を大切にしてください。"
  },
  {
    _id: "step4",
    recipeId: "recipe1",
    stepNumber: 4,
    instruction: "炊飯器に米と煮た具材、だし汁を入れて炊きます。",
    tips: "水分量は普通の炊飯と同じくらいで大丈夫です。"
  },
  {
    _id: "step5",
    recipeId: "recipe1",
    stepNumber: 5,
    instruction: "炊き上がったら10分程度蒸らしてから、よく混ぜて完成です。",
    tips: "混ぜる時は優しく、米粒を潰さないように注意してください。"
  }
];

export const mockRecipeDetail: Recipe = {
  _id: "recipe1",
  title: "おばあちゃんの炊き込みご飯",
  description: "昔から家族に愛され続けている、心温まる炊き込みご飯のレシピです。季節の野菜と出汁の旨味が米に染み込んで、とても美味しいです。",
  story: "この炊き込みご飯は、私が子供の頃から母が作ってくれていた思い出の味です。戦後の食べ物が少ない時代に、少しでも栄養のあるものをと工夫して作られたレシピが始まりでした。今では孫たちにも受け継がれ、家族の絆を深める大切な料理となっています。",
  authorId: "user1",
  authorName: "田中花子",
  prefecture: "新潟県",
  category: "ご飯もの",
  cookingTime: 60,
  season: ["春", "秋"],
  tags: ["家庭料理", "郷土料理", "おふくろの味", "炊き込みご飯"],
  imageUrl: "/images/takikomi-gohan.jpg",
  ingredients: mockRecipeIngredients,
  steps: mockRecipeSteps,
  isPublished: true,
  viewCount: 1240,
  likeCount: 89,
  createdAt: Date.now() - 86400000 * 30, // 30日前
  updatedAt: Date.now() - 86400000 * 7   // 7日前
};

// 追加のテストデータ
export const mockRecipeDetail2: Recipe = {
  _id: "recipe2",
  title: "青森のせんべい汁",
  description: "青森県の郷土料理として親しまれているせんべい汁。南部せんべいが汁に溶け込んで、とろみのある優しい味になります。",
  story: "祖母が青森出身で、冬の寒い日によく作ってくれました。南部せんべいを割って入れるのが子供の頃の楽しみでした。",
  authorId: "user2", 
  authorName: "佐藤みち子",
  prefecture: "青森県",
  category: "汁物",
  cookingTime: 30,
  season: ["冬"],
  tags: ["郷土料理", "せんべい汁", "青森", "温まる"],
  imageUrl: "/images/senbei-jiru.jpg",
  ingredients: [],
  steps: [],
  isPublished: true,
  viewCount: 856,
  likeCount: 64,
  createdAt: Date.now() - 86400000 * 14,
  updatedAt: Date.now() - 86400000 * 3
};