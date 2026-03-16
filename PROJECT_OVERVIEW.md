# クイズアプリケーション - プロジェクト概要

## アプリケーションの特徴

このアプリケーションは、**完全にステートレス**で**シンプルな機能のみ**を持つモバイルファーストのクイズアプリです。

### 主要機能

1. **カテゴリー・分野・難易度の選択**
   - 共通テスト（現代文、英語、政治経済）
   - 資格（英検、ニュース検定、TOEIC）
   - 一部の分野では難易度選択が可能

2. **4択クイズの出題**
   - 1問ずつ出題される
   - 選択肢をタップして回答

3. **正誤判定と解説**
   - 回答後、即座に正誤が表示される
   - 詳しい解説が表示される

4. **シンプルな動線**
   - 🔄 **再出題**: 同じ条件で新しい問題を生成
   - 🏠 **ホームに戻る**: 最初の選択画面に戻る

### 非機能

- ユーザー登録・ログイン機能なし
- 履歴・スコア記録なし
- 問題のお気に入り機能なし
- 完全ステートレス設計

## 技術構成

### フロントエンド

- **React 18**: UIフレームワーク
- **Vite**: ビルドツール
- **Axios**: HTTP通信
- **CSS3**: モバイルファーストのレスポンシブデザイン

### バックエンド

- **AWS Lambda**: サーバーレス関数（Python）
- **Amazon API Gateway**: RESTful API
- **Amazon Bedrock**: AI による問題生成（本番環境）

### インフラ

- **AWS Amplify**: ホスティング・CI/CD
- **GitHub**: ソースコード管理

## UIの特徴

### モバイルファースト設計

- タッチ操作に最適化されたボタンサイズ（最小 60px）
- スワイプやタップに即座に反応する UI
- viewport 設定により、モバイルで最適表示

### レスポンシブ対応

- スマートフォン（320px〜）: 基本デザイン
- タブレット（768px〜）: やや大きな表示
- デスクトップ（1024px〜）: 最大幅でゆったり表示

### デザインシステム

- **カラースキーム**: 紫系のグラデーション（#667eea → #764ba2）
- **フォント**: システムフォント（-apple-system, Roboto 等）
- **角丸**: 12px〜16px の柔らかい印象
- **影**: レイヤー感を出すソフトシャドウ

## ファイル構成

```
quiz-app/
├── public/              # 静的ファイル
│   └── favicon.svg
├── src/
│   ├── App.jsx         # メインコンポーネント（全ロジック）
│   ├── App.css         # スタイルシート
│   ├── main.jsx        # エントリーポイント
│   └── index.css       # グローバルスタイル
├── index.html          # HTML テンプレート
├── package.json        # 依存関係
├── vite.config.js      # Vite 設定
├── amplify.yml         # Amplify ビルド設定
├── .env.example        # 環境変数サンプル
├── README.md           # プロジェクト説明
└── DEPLOYMENT.md       # デプロイ手順
```

## 状態管理

React の `useState` を使用したシンプルな状態管理:

```javascript
// フォーム入力
const [category, setCategory] = useState('');
const [questionType, setQuestionType] = useState('');
const [level, setLevel] = useState('');

// クイズデータ
const [quizData, setQuizData] = useState(null);
const [selectedAnswer, setSelectedAnswer] = useState(null);
const [showResult, setShowResult] = useState(false);

// UI 状態
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

## API 通信

### リクエスト例

```javascript
POST /generate
Content-Type: application/json

{
  "category": "資格",
  "question_type": "英検",
  "level": "2級"
}
```

### レスポンス例

```javascript
{
  "question": "次の英文の空欄に入る最も適切な語を選びなさい。",
  "choices": [
    "before",
    "during", 
    "after",
    "while"
  ],
  "answer_index": 2,
  "explanation": "文脈から「〜の後」を意味する after が適切です。"
}
```

## ユーザーフロー

```
[ホーム画面]
    ↓ カテゴリー選択
[分野選択表示]
    ↓ 分野選択
[難易度選択表示]（必要な場合）
    ↓ 難易度選択
[クイズ生成ボタン]
    ↓ タップ
[問題表示]
    ↓ 選択肢タップ
[回答確認ボタン]
    ↓ タップ
[正誤判定・解説表示]
    ↓
[再出題] or [ホームに戻る]
```

## セキュリティ

- **CORS**: バックエンドで許可されたオリジンのみアクセス可能
- **入力検証**: バックエンドで厳密なバリデーション
- **環境変数**: 機密情報は環境変数で管理

## パフォーマンス

- **軽量**: JavaScript バンドルサイズ約 195KB（gzip: 62KB）
- **高速**: Vite による最適化されたビルド
- **CDN**: Amplify の CloudFront 配信で高速配信

## 今後の拡張性

現在はシンプルな機能のみですが、必要に応じて以下の拡張が可能:

- ユーザー認証（AWS Cognito）
- 履歴・スコア記録（DynamoDB）
- ソーシャル共有機能
- 問題のブックマーク
- カテゴリー・分野の追加

## 開発者向け情報

### ローカル開発

```bash
npm install
npm run dev
```

### 環境変数

`.env` ファイルに以下を設定:

```
VITE_API_URL=https://your-api-url.amazonaws.com/prod
```

### ビルド

```bash
npm run build
```

### プレビュー

```bash
npm run preview
```
