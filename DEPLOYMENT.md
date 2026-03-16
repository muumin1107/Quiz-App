# デプロイ手順

## 前提条件

- GitHubアカウント
- AWSアカウント
- バックエンドのLambda関数とAPI Gatewayが設定済み

## 1. GitHubリポジトリの作成

```bash
# プロジェクトディレクトリに移動
cd quiz-app

# Gitの初期化
git init

# ファイルを追加
git add .

# コミット
git commit -m "Initial commit"

# GitHubリポジトリを作成後、リモートを追加
git remote add origin https://github.com/your-username/quiz-app.git

# プッシュ
git branch -M main
git push -u origin main
```

## 2. AWS Amplifyでのデプロイ

### 2-1. Amplify Consoleにアクセス

1. AWS Management Consoleにログイン
2. Amplifyサービスを検索して開く
3. 「新しいアプリ」→「Webアプリをホスト」をクリック

### 2-2. リポジトリの接続

1. GitHubを選択
2. 認証後、作成したリポジトリを選択
3. ブランチは `main` を選択

### 2-3. ビルド設定

- `amplify.yml` が自動検出されます
- 特に変更は不要です

### 2-4. 環境変数の設定

「環境変数」セクションで以下を追加:

```
VITE_API_URL = https://your-api-gateway-url.amazonaws.com/prod
```

**重要**: API GatewayのURLを正確に入力してください

### 2-5. デプロイ

1. 「保存してデプロイ」をクリック
2. ビルドとデプロイが自動的に開始されます（5-10分程度）
3. 完了すると、AmplifyのURLが発行されます
   - 例: `https://main.d3uygiiddgwiws.amplifyapp.com`

## 3. バックエンドのCORS設定

Lambda関数の環境変数 `ALLOWED_ORIGINS` に、Amplifyで発行されたURLを追加してください。

### Lambda環境変数の例

```
ALLOWED_ORIGINS=https://main.d3uygiiddgwiws.amplifyapp.com,https://dev.d3uygiiddgwiws.amplifyapp.com
```

## 4. 動作確認

1. AmplifyのURLにアクセス
2. カテゴリーと分野を選択
3. クイズが正常に生成されることを確認
4. 回答・解説が表示されることを確認
5. 「再出題」「ホームに戻る」が正常に動作することを確認

## 5. カスタムドメインの設定（オプション）

1. Amplify Consoleで「ドメイン管理」を選択
2. カスタムドメインを追加
3. DNS設定を更新
4. SSL証明書が自動発行されます

## トラブルシューティング

### ビルドエラーが発生する場合

- `amplify.yml` の設定を確認
- `package.json` に必要な依存関係が含まれているか確認

### APIに接続できない場合

- 環境変数 `VITE_API_URL` が正しく設定されているか確認
- API GatewayのURLが正確か確認
- Lambda関数のCORS設定を確認

### 画面が表示されない場合

- ビルドログを確認
- ブラウザの開発者ツールでエラーを確認
- Amplifyのログを確認

## 継続的デプロイ

GitHubリポジトリにプッシュすると、自動的にAmplifyでビルド・デプロイが実行されます。

```bash
# 変更をコミット
git add .
git commit -m "Update feature"

# プッシュ（自動デプロイが開始される）
git push origin main
```
