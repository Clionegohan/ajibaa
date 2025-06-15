interface Recipe {
  _id: string;
  prefecture: string;
  title: string;
}

interface PrefectureFilterProps {
  recipes: Recipe[];
  selectedPrefecture: string;
  onFilterChange: (prefecture: string) => void;
}

export default function PrefectureFilter({ 
  recipes, 
  selectedPrefecture, 
  onFilterChange 
}: PrefectureFilterProps) {
  // 都道府県ごとのレシピ数を計算
  const prefectureCount = recipes.reduce((acc, recipe) => {
    acc[recipe.prefecture] = (acc[recipe.prefecture] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ユニークな都道府県リストを取得（アルファベット順）
  const uniquePrefectures = Object.keys(prefectureCount).sort();

  return (
    <div className="mb-6">
      <label htmlFor="prefecture-filter" className="block text-sm font-medium text-wa-charcoal mb-2">
        都道府県で絞り込み
      </label>
      <select
        id="prefecture-filter"
        value={selectedPrefecture}
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-full md:w-auto px-3 py-2 border border-wa-brown/30 rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-wa-orange bg-white"
        aria-label="都道府県で絞り込み"
      >
        <option value="">すべての都道府県</option>
        {uniquePrefectures.map((prefecture) => (
          <option key={prefecture} value={prefecture}>
            {prefecture} ({prefectureCount[prefecture]})
          </option>
        ))}
      </select>
    </div>
  );
}