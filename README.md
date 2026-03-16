# クイズ生成アプリケーション

AWS Lambda + API Gateway + Amplifyで構築されたクイズ生成アプリケーションです。

## 機能

- カテゴリー・分野・難易度を選択してクイズを生成
- 4択問題形式
- 回答の正誤判定と解説表示
- レスポンシブデザイン対応

## 技術スタック

### フロントエンド
- React 18
- Vite
- Axios
- AWS Amplify (ホスティング)

### バックエンド
- AWS Lambda (Python)
- Amazon API Gateway
- Amazon Bedrock (本番環境)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成し、API URLを設定します:

```bash
VITE_API_URL=https://your-api-gateway-url.amazonaws.com/prod
```

### 3. ローカル開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

### 4. ビルド

```bash
npm run build
```

ビルドされたファイルは `dist` ディレクトリに出力されます。

## AWS Amplifyへのデプロイ

### 方法1: Amplify Console経由

1. AWS Amplify Consoleにログイン
2. 「新しいアプリ」→「Webアプリをホスト」を選択
3. GitHubリポジトリを連携
4. ビルド設定は `amplify.yml` が自動検出されます
5. 環境変数を設定:
   - `VITE_API_URL`: API GatewayのエンドポイントURL

### 方法2: Amplify CLI経由

```bash
# Amplify CLIのインストール
npm install -g @aws-amplify/cli

# Amplifyの初期化
amplify init

# ホスティングの追加
amplify add hosting

# デプロイ
amplify publish
```

## API仕様

### エンドポイント

```
POST /generate
```

### リクエストボディ

```json
{
  "category": "共通テスト",
  "question_type": "現代文",
  "level": "準2級"
}
```

### レスポンス

```json
{
  "question": "問題文",
  "choices": [
    "選択肢1",
    "選択肢2",
    "選択肢3",
    "選択肢4"
  ],
  "answer_index": 1,
  "explanation": "解説文"
}
```

## 対応カテゴリー・分野

### 共通テスト
- 現代文
- 英語
- 政治経済

### 資格
- 英検 (1級、準1級、2級、準2級、3級、4級、5級)
- ニュース検定 (1級、2級、準2級、3級、4級、5級)
- TOEIC (500点、600点、700点、800点、900点、990点)

## プロジェクト構造

```
quiz-app/
├── public/          # 静的ファイル
├── src/
│   ├── App.jsx      # メインコンポーネント
│   ├── App.css      # スタイル
│   ├── main.jsx     # エントリーポイント
│   └── index.css    # グローバルスタイル
├── amplify.yml      # Amplifyビルド設定
├── .env.example     # 環境変数のサンプル
├── package.json     # 依存関係
└── vite.config.js   # Vite設定
```

## トラブルシューティング

### CORS エラーが発生する場合

バックエンドのLambda関数で、AmplifyのURLが `ALLOWED_ORIGINS` 環境変数に含まれていることを確認してください。

### API URLが見つからないエラー

`.env` ファイルが正しく作成され、`VITE_API_URL` が設定されていることを確認してください。

## ライセンス

MIT
