# 味ばあ（Ajibaa） - プロジェクト概要
プロジェクト基本情報
プロジェクト名: 味ばあ (Ajibaa)
リポジトリ名: ajibaa
コンセプト: 日本全国のおばあちゃんの味と郷土の食文化を次世代に残す文化継承プラットフォーム
ミッション: 失われゆく日本の家庭料理と地域の食文化を記録・保存し、おばあちゃんから孫世代へ「愛の味」をリアルタイムで継承する

## 知見管理システム
このプロジェクトでは以下のファイルで知見を体系的に管理しています：

### `.claude/context.md`
- プロジェクトの背景、目的、制約条件
- 技術スタック選定理由
- ビジネス要件や技術的制約

### `.claude/project-knowledge.md`
- 実装パターンや設計決定の知見
- アーキテクチャの選択理由
- 避けるべきパターンやアンチパターン

### `.claude/project-improvements.md`
- 過去の試行錯誤の記録
- 失敗した実装とその原因
- 改善プロセスと結果

### `.claude/common-patterns.md`
- 頻繁に使用するコマンドパターン
- 定型的な実装テンプレート

### `ARD/`（20241214追加）
- アーキテクチャ記録文書（Architecture Record Documents）
- 重要な技術決定や実装の背景を記録
- ファイル命名規則：`ARD-YYYYMMDD-brief-description.md`
- 新機能設計・既存機能変更・技術課題解決時に作成

**重要**: 新しい実装や重要な決定を行った際は、該当するファイルを更新してください。また、変更したタイミングがわかるような工夫をしてください。YYYYMMDDを表記するなど。

ユーザーから今回限りではなく常に対応が必要だと思われる指示を受けた場合：

1. 「これを標準のルールにしますか？」と質問する
2. YESの回答を得た場合、CLAUDE.mdに追加ルールとして記載する
3. 以降は標準ルールとして常に適用する

このプロセスにより、プロジェクトのルールを継続的に改善していきます。

## 🚨 重要な作業ルール 🚨（20250615更新）

### 必須のワークフロー
1. **作業開始前**: 必ずこのCLAUDE.mdを参照する
2. **新機能開発**: feature branchを作成する
3. **テスト駆動開発**: 必ずテストを先に書く（Red-Green-Refactor）
4. **作業完了後**: 必ずGit管理を行う（commit → merge → **push**）

### 🔴 絶対に忘れてはいけないこと
- **作業ごとに必ずこのドキュメントを参照する**
- **ひと段落したら必ずリモートプッシュまで行う**
- Git管理 = commit → merge → **push origin main**（リモートプッシュ必須）

## Git開発フロー標準ルール（20241206追加）

機能開発時は以下のブランチ管理フローを必ず適用する：

1. **機能開発開始時**
   - `git checkout -b feature/機能名` でブランチを作成
   - ブランチ名は機能内容が分かりやすい名前にする

2. **開発中**
   - 適切な粒度で定期的にコミット
   - コミットメッセージは変更内容が明確に分かるよう記載

3. **機能完成時**
   - `git push origin feature/機能名` でリモートにブランチをプッシュ
   - 必要に応じてプルリクエスト作成やmainブランチへのマージを検討

4. **開発完了後**
   - ローカルのfeatureブランチは削除
   - mainブランチに戻って次の開発に備える
   - **必ずmainブランチをリモートにプッシュする**

## テスト駆動開発（TDD）標準ルール（20250615追加）

当プロジェクトではTDD（Test-Driven Development）を意識した開発を必須とする：

1. **開発フロー**
   - Red: テストを先に書き、失敗することを確認
   - Green: テストを通すための最小限のコードを実装
   - Refactor: コードをリファクタリングして品質向上

2. **テストファイル構成**
   ```
   __tests__/
   ├── components/          # コンポーネントテスト
   ├── lib/                 # ユーティリティ関数テスト
   ├── convex/              # Convex関数テスト
   └── e2e/                 # E2Eテスト
   ```

3. **テスト作成ルール**
   - 新機能実装前に必ずテストを作成
   - テストファイルは対応するソースファイルと同じディレクトリ構造
   - カバレッジ80%以上を目標とする

4. **テスト実行**
   - `npm run test` でユニットテスト実行
   - `npm run test:watch` で監視モード
   - CI/CDでのテスト実行を必須とする

## プロジェクトコンテキスト（20250617追加）

### 技術スタック
- **Next.js 14.2.15**: React基盤のフルスタックフレームワーク
- **React 18**: UIライブラリ  
- **TypeScript**: 型安全性の確保
- **Tailwind CSS**: ユーティリティファーストCSSフレームワーク
- **Convex**: リアルタイムデータベース・BaaS
- **@convex-dev/auth**: 認証システム
- **Jest + Testing Library**: テストフレームワーク

### 技術選定理由
- **Convex選定**: リアルタイム交流機能実現、型安全性、認証システム統合
- **Next.js選定**: SEO対応、パフォーマンス最適化、開発体験向上
- **TypeScript必須**: 型安全性確保、開発効率向上

### プロジェクト制約
- 日本の郷土料理・家庭料理に特化
- おばあちゃん世代のユーザビリティ最優先
- 文化継承の観点から「温かみ」のあるUI/UX
- 無料利用基本、プライバシー保護最優先

### 対象ユーザー
- **メイン**: 60代以上のおばあちゃん世代
- **セカンダリ**: 20-40代の孫世代
- **UI要件**: 大きなフォント、シンプルなUI

## プロジェクト知見管理（20250617追加）

### 実装パターン
- **TDD実装パターン**: テスト先行 → 最小実装 → リファクタリング
- **Convex統合パターン**: queries.ts/mutations.ts → React hooks → UI component
- **認証パターン**: @convex-dev/auth利用、セッション管理統合
- **コンポーネント設計**: 単一責任、props型定義、テスタビリティ重視

### アーキテクチャ選択理由
- **App Router採用**: SEO最適化、パフォーマンス向上
- **Convex採用**: リアルタイム機能、型安全性、認証統合
- **TailwindCSS採用**: 高速開発、一貫性保持、レスポンシブ対応

### 避けるべきパターン
- **直接DB操作**: Convex mutations/queries以外でのデータ操作
- **型定義省略**: any型使用、型アサーション乱用
- **テスト後回し**: 実装後のテスト追加（TDD違反）
- **コンポーネント肥大化**: 単一コンポーネントでの多機能実装

## プロジェクト改善履歴（20250617追加）

### 過去の改善事例
- **認証システム簡素化** (20250615): 複雑な認証フローを@convex-dev/authで統合
- **リアルタイム交流機能** (20250615): TDD導入でバグ削減、品質向上
- **都道府県分類機能** (20250615): TDD実践により初回実装成功
- **レシピ投稿機能** (20250615): データベース統合でパフォーマンス改善

### 学習した教訓
- **TDD効果**: 事前テスト作成により実装品質大幅向上
- **Convex統合**: 型安全性とリアルタイム機能の両立が可能
- **UI/UX重視**: ユーザー中心設計が機能採用率向上に直結
- **Git管理**: feature branch利用で安全な開発フロー確立

### 継続的改善項目
- テストカバレッジ80%以上維持
- ユーザビリティテスト定期実施
- パフォーマンス監視とボトルネック特定
- セキュリティ監査の定期実施

## 共通パターン集（20250617追加）

### 開発コマンドパターン
```bash
# 新機能開発開始
git checkout -b feature/機能名
npm run test:watch

# 実装完了時
npm run test
npm run lint
npm run typecheck
npm run build

# マージ・プッシュ
git checkout main
git merge feature/機能名
git push origin main
```

### テスト実装パターン
```typescript
// コンポーネントテスト基本形
import { render, screen } from '@testing-library/react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProvider } from 'convex/react'

const TestWrapper = ({ children }) => (
  <ConvexProvider client={new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)}>
    {children}
  </ConvexProvider>
)

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />, { wrapper: TestWrapper })
    expect(screen.getByText('expected text')).toBeInTheDocument()
  })
})
```

### Convex統合パターン
```typescript
// queries.ts
export const getRecipes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("recipes").collect()
  }
})

// コンポーネント側
const recipes = useQuery(api.queries.getRecipes)
```

## デバッグログ管理（20250617追加）

### 重要なデバッグ記録
本セクションでは、重要な問題解決プロセスや技術的課題の解決履歴を記録します。

### 問題解決テンプレート
問題が発生した際は、以下の形式で記録してください：

```markdown
#### [YYYYMMDD] 問題タイトル
**問題**: 発生した問題の詳細
**原因**: 根本原因の分析
**解決**: 実装した解決策
**学習**: 今後に活かす教訓
**影響**: 他の機能への影響範囲
```

### 技術的課題解決履歴
- **TDD導入時の課題**: テスト環境構築とConvexモック化の実現
- **認証システム統合**: @convex-dev/authとNext.jsの連携最適化
- **リアルタイム機能**: WebSocketとConvexリアルタイム機能の活用

### デバッグ時の注意点
- 問題発生時は必ずログを記録
- 解決後は知見をプロジェクト知見に反映
- 類似問題の再発防止策を検討
