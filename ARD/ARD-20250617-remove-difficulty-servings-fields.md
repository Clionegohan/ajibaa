# ARD-20250617-remove-difficulty-servings-fields

## 概要
レシピデータモデルから難易度（difficulty）と人数（servings）フィールドを削除する設計変更を実施。

## 背景
- ユーザーからの明確な要求：「難易度、人数、要りません」
- おばあちゃんの味を継承するというプロジェクトコンセプトにおいて、これらのフィールドは本質的でない
- UIの簡素化により、高齢者ユーザーにとってより使いやすいインターフェースを実現

## 決定事項
1. **削除対象フィールド**
   - `difficulty: number` - 難易度（1-3の数値）
   - `servings: number` - 人数

2. **影響範囲**
   - `src/types/recipe.ts` - Recipe型定義
   - `src/components/RecipeList.tsx` - レシピカード表示
   - `src/app/recipes/[id]/page.tsx` - レシピ詳細ページ
   - `src/app/page.tsx` - サンプルデータ
   - テストファイル群

## 技術的考慮事項
- TypeScriptの型安全性を保つため、段階的に削除を実施
- 既存のConvexクエリ・ミューテーションは後方互換性を維持
- サンプルデータの整合性確保

## 実装状況
- ✅ Recipe型定義から該当フィールドを削除
- ✅ RecipeListコンポーネントから人数表示を削除
- ✅ レシピ詳細ページから難易度・人数メタデータを削除
- 🚧 サンプルデータの更新（進行中）
- ⏳ テストの更新
- ⏳ Convexスキーマの更新検討

## 今後の対応
1. 残りのサンプルデータ更新完了
2. 関連テストファイルの修正
3. 必要に応じてConvexスキーマの調整
4. 画像投稿機能の実装に移行

## 関連する今後の機能追加
- レシピサムネイル画像投稿機能
- 手順画像投稿機能
- レシピカード全体のクリッカブル化

## 承認
- 要求者: ユーザー
- 実装者: Claude
- 日付: 2025-06-17