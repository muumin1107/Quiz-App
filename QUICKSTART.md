# クイックスタートガイド

このガイドに従って、5〜10分でクイズアプリをデプロイできます。

## 前提条件

- [ ] AWSアカウント
- [ ] GitHubアカウント
- [ ] Lambda関数とAPI Gatewayが設定済み

## ステップ1: プロジェクトの準備（1分）

```bash
# アーカイブを展開
tar -xzf quiz-app.tar.gz
cd quiz-app

# 依存関係をインストール
npm install
```

## ステップ2: ローカルでテスト（2分）

```bash
# 環境変数を設定
echo "VITE_API_URL=https://your-api-url.amazonaws.com/prod" > .env

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173` を開いて動作確認。

## ステップ3: GitHubにプッシュ（2分）

```bash
# Gitリポジトリを初期化
git init
git add .
git commit -m "Initial commit"

# GitHubでリポジトリを作成後、リモートを追加
git remote add origin https://github.com/your-username/quiz-app.git
git branch -M main
git push -u origin main
```

## ステップ4: Amplifyでデプロイ（5分）

### 4-1. Amplify Consoleを開く

1. AWS Management Consoleにログイン
2. Amplifyサービスを検索
3. 「新しいアプリ」→「Webアプリをホスト」

### 4-2. リポジトリを接続

1. GitHubを選択
2. 作成したリポジトリを選択
3. ブランチ: `main`

### 4-3. ビルド設定

- `amplify.yml` が自動検出される
- 変更不要

### 4-4. 環境変数を設定

```
キー: API_URL
値: https://your-api-url.amazonaws.com/prod
```

### 4-5. デプロイ開始

「保存してデプロイ」をクリック → 5分程度待つ

## ステップ5: CORS設定（1分）

Lambda関数の環境変数にAmplifyのURLを追加:

```bash
aws lambda update-function-configuration \
  --function-name your-function-name \
  --environment "Variables={ALLOWED_ORIGINS=https://main.dxxxxxxxxx.amplifyapp.com}"
```

## ステップ6: 動作確認（1分）

AmplifyのURLにアクセスして以下を確認:

- [ ] カテゴリー・分野を選択できる
- [ ] クイズが生成される
- [ ] 回答できる
- [ ] 正誤判定と解説が表示される
- [ ] 再出題・ホームに戻るが動作する

## 完了！🎉

これでクイズアプリのデプロイが完了しました。

## 次のステップ

- カスタムドメインの設定
- 本番環境のBedrock統合
- カテゴリー・分野の追加

詳細は各ドキュメントを参照してください:
- `README.md`: 全体概要
- `DEPLOYMENT.md`: 詳細なデプロイ手順
- `API_TESTING.md`: API統合テスト
- `PROJECT_OVERVIEW.md`: 技術詳細

## トラブルシューティング

### ビルドエラー

```bash
# ログを確認
npm run build
```

### API接続エラー

```bash
# 環境変数を確認
echo $VITE_API_URL

# curlでテスト
curl -X POST $VITE_API_URL/generate \
  -H "Content-Type: application/json" \
  -d '{"category":"共通テスト","question_type":"現代文"}'
```

### CORSエラー

Lambda関数の環境変数 `ALLOWED_ORIGINS` を確認:

```bash
aws lambda get-function-configuration --function-name your-function-name
```

## サポート

問題が発生した場合は、以下のドキュメントを参照してください:
- `API_TESTING.md`: 詳細なトラブルシューティング
- `DEPLOYMENT.md`: デプロイの詳細手順
