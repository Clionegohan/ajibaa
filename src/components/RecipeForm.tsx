"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import ImageUpload from "./ImageUpload";

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  note: string;
}

interface CookingStep {
  instruction: string;
  tips: string;
}

export default function RecipeForm() {
  const createRecipe = useMutation(api.mutations.createRecipe);
  
  // フォーム状態
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [cookingTime, setCookingTime] = useState(30);
  const [servings, setServings] = useState(2);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "", unit: "", note: "" }
  ]);
  const [steps, setSteps] = useState<CookingStep[]>([
    { instruction: "", tips: "" }
  ]);
  
  // 画像状態
  const [imageStorageId, setImageStorageId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // エラー状態
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 都道府県リスト
  const prefectures = [
    "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
    "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
    "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
    "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
  ];

  // カテゴリリスト
  const categories = ["主食", "副菜", "汁物", "おやつ・デザート", "その他"];

  // 材料を追加
  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "", note: "" }]);
  };

  // 手順を追加
  const addStep = () => {
    setSteps([...steps, { instruction: "", tips: "" }]);
  };

  // 材料更新
  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // 手順更新
  const updateStep = (index: number, field: keyof CookingStep, value: string) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  // 画像アップロード処理
  const handleImageUpload = (storageId: string, url: string) => {
    setImageStorageId(storageId);
    setImageUrl(url);
  };

  // バリデーション
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "レシピ名を入力してください";
    if (!description.trim()) newErrors.description = "説明を入力してください";
    if (!prefecture) newErrors.prefecture = "都道府県を選択してください";
    if (!category) newErrors.category = "カテゴリを選択してください";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await createRecipe({
        title,
        description,
        story: story || undefined,
        prefecture,
        category,
        cookingTime,
        imageStorageId: imageStorageId || undefined,
        imageUrl: imageUrl || undefined,
        ingredients: ingredients.filter(ing => ing.name.trim()),
        steps: steps.filter(step => step.instruction.trim()),
      });
      
      alert("レシピを投稿しました！");
      
      // フォームをリセット
      setTitle("");
      setDescription("");
      setStory("");
      setPrefecture("");
      setCategory("");
      setDifficulty(1);
      setCookingTime(30);
      setServings(2);
      setIngredients([{ name: "", amount: "", unit: "", note: "" }]);
      setSteps([{ instruction: "", tips: "" }]);
      setImageStorageId(null);
      setImageUrl(null);
      setErrors({});
    } catch (error) {
      console.error("Recipe creation failed:", error);
      alert("レシピの投稿に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="wa-paper wa-border p-8">
        <h2 className="text-2xl font-bold text-wa-charcoal mb-6 text-center">
          🍽️ レシピを投稿
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <section>
            <h3 className="text-lg font-semibold text-wa-charcoal mb-4">基本情報</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-wa-charcoal mb-1">
                  レシピ名 <span className="text-wa-red">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-wa-brown/30 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                  placeholder="おばあちゃんの肉じゃが"
                />
                {errors.title && <p className="text-wa-red text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="prefecture" className="block text-sm font-medium text-wa-charcoal mb-1">
                  都道府県 <span className="text-wa-red">*</span>
                </label>
                <select
                  id="prefecture"
                  value={prefecture}
                  onChange={(e) => setPrefecture(e.target.value)}
                  className="w-full px-3 py-2 border border-wa-brown/30 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                >
                  <option value="">選択してください</option>
                  {prefectures.map((pref) => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
                {errors.prefecture && <p className="text-wa-red text-xs mt-1">{errors.prefecture}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-wa-charcoal mb-1">
                  カテゴリ <span className="text-wa-red">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-wa-brown/30 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                >
                  <option value="">選択してください</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-wa-red text-xs mt-1">{errors.category}</p>}
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-wa-charcoal mb-1">
                  難易度（1-5）
                </label>
                <input
                  type="range"
                  id="difficulty"
                  min="1"
                  max="5"
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-wa-charcoal text-sm">
                  {"★".repeat(difficulty)}{"☆".repeat(5 - difficulty)} ({difficulty})
                </div>
              </div>

              <div>
                <label htmlFor="cookingTime" className="block text-sm font-medium text-wa-charcoal mb-1">
                  調理時間（分）
                </label>
                <input
                  type="number"
                  id="cookingTime"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-wa-brown/30 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                  min="1"
                  max="600"
                />
              </div>

              <div>
                <label htmlFor="servings" className="block text-sm font-medium text-wa-charcoal mb-1">
                  人数
                </label>
                <input
                  type="number"
                  id="servings"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-wa-brown/30 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                  min="1"
                  max="20"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-wa-charcoal mb-1">
                説明 <span className="text-wa-red">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-wa-brown/30 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                placeholder="このレシピの特徴や魅力を教えてください"
              />
              {errors.description && <p className="text-wa-red text-xs mt-1">{errors.description}</p>}
            </div>

            {/* 画像アップロードセクション */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-wa-charcoal mb-1">
                📸 レシピ写真
              </label>
              <ImageUpload
                onImageUpload={handleImageUpload}
                maxSizeMB={5}
                disabled={isSubmitting}
                className="w-full"
              />
              <p className="text-xs text-wa-charcoal/60 mt-1">
                ※ おいしそうな写真があると、より多くの人に見てもらえます
              </p>
            </div>

            <div className="mt-4">
              <label htmlFor="story" className="block text-sm font-medium text-wa-charcoal mb-1">
                思い出・エピソード
              </label>
              <textarea
                id="story"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-wa-brown/30 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                placeholder="このレシピにまつわる思い出やエピソードがあれば..."
              />
            </div>
          </section>

          {/* 材料 */}
          <section>
            <h3 className="text-lg font-semibold text-wa-charcoal mb-4">材料</h3>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="材料名"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(index, "name", e.target.value)}
                  className="col-span-4 px-3 py-2 border border-wa-brown/30 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                />
                <input
                  type="text"
                  placeholder="分量"
                  value={ingredient.amount}
                  onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                  className="col-span-2 px-3 py-2 border border-wa-brown/30 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                />
                <input
                  type="text"
                  placeholder="単位"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                  className="col-span-2 px-3 py-2 border border-wa-brown/30 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                />
                <input
                  type="text"
                  placeholder="備考"
                  value={ingredient.note}
                  onChange={(e) => updateIngredient(index, "note", e.target.value)}
                  className="col-span-4 px-3 py-2 border border-wa-brown/30 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 px-4 py-2 bg-wa-green text-white rounded-md hover:bg-wa-green/80 transition-colors"
            >
              材料を追加
            </button>
          </section>

          {/* 作り方 */}
          <section>
            <h3 className="text-lg font-semibold text-wa-charcoal mb-4">作り方</h3>
            {steps.map((step, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium text-wa-charcoal mb-1">
                  手順 {index + 1}
                </label>
                <textarea
                  placeholder="手順の説明"
                  value={step.instruction}
                  onChange={(e) => updateStep(index, "instruction", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-wa-brown/30 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange mb-2"
                />
                <input
                  type="text"
                  placeholder="コツ・ポイント"
                  value={step.tips}
                  onChange={(e) => updateStep(index, "tips", e.target.value)}
                  className="w-full px-3 py-2 border border-wa-brown/30 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="mt-2 px-4 py-2 bg-wa-blue text-white rounded-md hover:bg-wa-blue/80 transition-colors"
            >
              手順を追加
            </button>
          </section>

          {/* 送信ボタン */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 wa-paper wa-border bg-wa-orange text-white font-semibold rounded-lg 
                       hover:bg-wa-orange/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? "投稿中..." : "レシピを投稿"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}