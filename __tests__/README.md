# テストディレクトリ構成

このディレクトリはTDD（Test-Driven Development）に基づくテストファイルを格納します。

## ディレクトリ構成

- `components/` - Reactコンポーネントのテスト
- `lib/` - ユーティリティ関数のテスト  
- `convex/` - Convex関数（queries/mutations）のテスト
- `e2e/` - エンドツーエンドテスト

## テスト命名規則

- テストファイル: `{対象ファイル名}.test.ts` または `{対象ファイル名}.test.tsx`
- テストスイート: `describe('対象の機能名', () => {})`
- テストケース: `it('should 期待する動作', () => {})`

## 実行コマンド

```bash
npm run test          # 全テスト実行
npm run test:watch    # 監視モード
npm run test:coverage # カバレッジ測定
```