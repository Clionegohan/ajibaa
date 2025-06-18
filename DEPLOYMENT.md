# 味ばあ (Ajibaa) - デプロイメントガイド

## 本番環境デプロイメント手順

### 1. 前提条件

- Node.js 18.0.0以降
- npm 9.0.0以降
- Convexアカウントとプロジェクト
- Google Cloud Consoleでのアプリケーション設定
- Vercel / Netlify / AWS / GCPなどのホスティングサービス

### 2. 環境変数設定

本番環境では以下の環境変数を設定してください：

```bash
# Convex設定
NEXT_PUBLIC_CONVEX_URL=https://your-production-convex-url.convex.cloud
CONVEX_DEPLOY_KEY=your-production-convex-deploy-key

# Google OAuth設定
AUTH_GOOGLE_ID=your-production-google-client-id
AUTH_GOOGLE_SECRET=your-production-google-client-secret

# JWT設定
AUTH_SECRET=your-production-jwt-secret-256-bit-random-string

# Next.js設定
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
```

### 3. Convexデプロイメント

```bash
# Convexプロジェクトをデプロイ
npx convex deploy

# 本番環境の関数とスキーマを確認
npx convex dashboard
```

### 4. Next.jsビルドとデプロイ

```bash
# 依存関係インストール
npm ci

# ビルド実行
npm run build

# 本番サーバー起動（ローカルテスト用）
npm start
```

### 5. ホスティングサービス別設定

#### Vercel

1. Vercelプロジェクト作成
2. 環境変数設定（Vercel Dashboard）
3. 自動デプロイ設定

```bash
# Vercel CLI使用の場合
npx vercel
npx vercel --prod
```

#### Netlify

1. Netlifyサイト作成
2. 環境変数設定（Netlify Dashboard）
3. ビルド設定

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

### 6. ドメイン設定

1. カスタムドメイン設定
2. SSL証明書設定
3. Google OAuthリダイレクトURI更新

### 7. 本番環境確認項目

#### セキュリティ
- [ ] HTTPS設定完了
- [ ] セキュリティヘッダー設定
- [ ] CORS設定確認
- [ ] 環境変数セキュリティ確認

#### パフォーマンス
- [ ] 画像最適化確認
- [ ] CSS/JS圧縮確認
- [ ] CDN設定（画像配信）
- [ ] レスポンス時間測定

#### 機能確認
- [ ] ユーザー認証フロー
- [ ] レシピCRUD操作
- [ ] 画像アップロード
- [ ] リアルタイムコメント
- [ ] 検索機能

#### SEO・アクセシビリティ
- [ ] メタタグ設定
- [ ] OGP設定
- [ ] Lighthouse検査（90+スコア）
- [ ] アクセシビリティ検査

### 8. 監視・メンテナンス

#### ログ監視
- Next.jsアプリケーションログ
- Convex関数ログ
- エラートラッキング（Sentry推奨）

#### パフォーマンス監視
- Core Web Vitals
- データベースクエリパフォーマンス
- 画像最適化効果測定

#### セキュリティ監査
- 依存関係脆弱性チェック
- アクセスログ監視
- 不正利用検知

### 9. スケーリング対応

#### 水平スケーリング
- Convex自動スケーリング活用
- CDN利用による配信最適化
- データベースレプリケーション

#### 縦方向最適化
- コード分割による初期ロード高速化
- 画像遅延読み込み
- キャッシュ戦略最適化

### 10. バックアップ・復旧

#### データバックアップ
- Convexデータベース定期バックアップ
- 画像ファイルバックアップ
- 設定ファイルバックアップ

#### 災害復旧計画
- RTO（目標復旧時間）：2時間以内
- RPO（目標復旧時点）：1時間以内
- 復旧手順書整備

## トラブルシューティング

### よくある問題

1. **Convex接続エラー**
   - 環境変数確認
   - ネットワーク設定確認
   - Convexダッシュボード状態確認

2. **画像アップロードエラー**
   - ファイルサイズ制限確認
   - Convex Storage容量確認
   - ネットワークタイムアウト設定

3. **認証エラー**
   - Google OAuth設定確認
   - リダイレクトURI設定確認
   - JWTシークレット確認

### サポート連絡先

- 開発チーム: dev@ajibaa.com
- インフラチーム: infra@ajibaa.com
- 緊急連絡: emergency@ajibaa.com

---

このドキュメントは本番環境の安定運用を目的として作成されています。
定期的な更新と改善を行い、品質向上に努めてください。