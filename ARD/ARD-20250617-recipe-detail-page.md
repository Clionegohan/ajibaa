# ARD-20250617-recipe-detail-page

## 決定事項
レシピ詳細ページの設計・実装完了

## 状況
- ハイドレーションエラー修正後、レシピ詳細ページ機能を新規実装
- TDD (Test-Driven Development) アプローチを採用
- 完全なレシピ情報表示機能が必要

## 決定内容

### 1. アーキテクチャ選択
- **コンポーネント設計**: `RecipeDetail` メインコンポーネント + 動的ルーティング
- **状態管理**: Convex queries による一元的データ取得
- **ページ構成**: `/recipes/[id]` 動的ルート
- **テスト戦略**: コンポーネント単位でのテスト先行実装

### 2. 実装詳細

#### コンポーネント構造
```
/recipes/[id]/page.tsx (ページコンポーネント)
└── RecipeDetail.tsx (メインUIコンポーネント)
    ├── ヘッダー部分 (タイトル、説明、メタデータ)
    ├── ストーリー部分 (おばあちゃんの思い出)
    ├── 材料リスト
    ├── 作り方ステップ
    ├── タグ表示
    └── 季節情報
```

#### データフロー
```
Convex DB → getRecipeById query → page.tsx → RecipeDetail component
```

#### テストデータ
- `mockRecipeDetail`: 完全なレシピデータ
- `mockRecipeIngredients`: 6種類の材料データ
- `mockRecipeSteps`: 5ステップの調理手順
- エッジケース対応: 空データ、欠損データのテスト

### 3. UI/UX設計原則
- **おばあちゃん世代対応**: 大きなフォント、明確な情報区分
- **視覚的階層**: 絵文字活用による直感的なセクション識別
- **温かみのあるデザイン**: wa-テーマカラー使用
- **レスポンシブ対応**: グリッドレイアウトによる画面サイズ対応

### 4. データベース統合
- **recipes** テーブル: 基本レシピ情報
- **recipeIngredients** テーブル: 材料詳細、順序管理
- **recipeSteps** テーブル: 調理手順、ステップ番号管理
- **リレーションシップ**: recipeId による関連付け

## 考慮事項

### 技術的制約
- Convex ID型の適切な処理
- Next.js App Router との統合
- TypeScript型安全性の維持

### パフォーマンス
- 単一クエリでの関連データ取得
- 適切なローディング状態表示
- エラーハンドリング（404対応）

### 拡張性
- 画像表示機能の将来対応
- コメント・評価機能の拡張可能性
- ソーシャル共有機能の追加余地

## 結果
- テスト12項目全てパス
- ハイドレーションエラー完全解決
- TDDによる品質保証達成
- おばあちゃん世代向けUI/UX実現

## 影響範囲
- **新規ファイル**: 
  - `src/app/recipes/[id]/page.tsx`
  - `src/components/RecipeDetail.tsx`
  - `src/lib/testData.ts`
  - `src/components/__tests__/RecipeDetail.test.tsx`
- **変更ファイル**: 
  - `convex/queries.ts` (getRecipeById実装)
  - `src/components/RecipeList.tsx` (ハイドレーションエラー修正)
  - `src/components/LikeButton.tsx` (イベント伝播修正)

## 学習事項
- TDD実践により初回実装成功率向上
- Convex queries の型安全性が開発効率向上に寄与
- ハイドレーションエラーは早期発見・修正が重要
- おばあちゃん世代向けUI設計の具体的ガイドライン確立