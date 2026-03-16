# API統合テストガイド

このガイドでは、フロントエンドとバックエンドのAPI統合をテストする方法を説明します。

## 1. 事前準備

### 1-1. Lambda関数のデプロイ確認

Lambda関数が正しくデプロイされていることを確認します。

```bash
# AWS CLIでLambda関数を確認
aws lambda get-function --function-name your-function-name
```

### 1-2. API Gatewayのエンドポイント確認

API GatewayのエンドポイントURLを取得します。

```bash
# AWS CLIでAPI Gatewayを確認
aws apigateway get-rest-apis
```

エンドポイントの形式:
```
https://{api-id}.execute-api.{region}.amazonaws.com/{stage}
```

例:
```
https://abc123xyz.execute-api.ap-northeast-1.amazonaws.com/prod
```

### 1-3. CORS設定の確認

Lambda関数の環境変数 `ALLOWED_ORIGINS` を確認します。

```bash
aws lambda get-function-configuration --function-name your-function-name
```

必要なオリジン:
- ローカル開発: `http://localhost:5173`
- Amplify本番: `https://main.d3uygiiddgwiws.amplifyapp.com`
- Amplify開発: `https://dev.d3uygiiddgwiws.amplifyapp.com`

## 2. curlでのテスト

### 2-1. 正常系テスト

#### 共通テスト（レベル不要）

```bash
curl -X POST https://your-api-url.amazonaws.com/prod/generate \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "category": "共通テスト",
    "question_type": "現代文"
  }'
```

**期待されるレスポンス**:
```json
{
  "question": "これはテスト用のダミー問題です。指定されたカテゴリーは「共通テスト」、分野は「現代文」です。正しい選択肢を選んでください。",
  "choices": [
    "不正解の選択肢A",
    "正解の選択肢",
    "不正解の選択肢B",
    "不正解の選択肢C"
  ],
  "answer_index": 1,
  "explanation": "フロントエンドとの結合テスト用の仮の解説文です。UIの描画や状態管理が正常に機能しているかを確認してください。"
}
```

#### 資格（レベル必須）

```bash
curl -X POST https://your-api-url.amazonaws.com/prod/generate \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "category": "資格",
    "question_type": "英検",
    "level": "2級"
  }'
```

**期待されるレスポンス**:
```json
{
  "question": "これはテスト用のダミー問題です。指定されたカテゴリーは「資格」、分野は「英検」（2級）です。正しい選択肢を選んでください。",
  "choices": [
    "不正解の選択肢A",
    "正解の選択肢",
    "不正解の選択肢B",
    "不正解の選択肢C"
  ],
  "answer_index": 1,
  "explanation": "フロントエンドとの結合テスト用の仮の解説文です。UIの描画や状態管理が正常に機能しているかを確認してください。"
}
```

### 2-2. 異常系テスト

#### ケース1: カテゴリー未指定

```bash
curl -X POST https://your-api-url.amazonaws.com/prod/generate \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "question_type": "現代文"
  }'
```

**期待されるレスポンス** (400):
```json
{
  "error": "categoryおよびquestion_typeは必須パラメーターです。"
}
```

#### ケース2: 未定義のカテゴリー

```bash
curl -X POST https://your-api-url.amazonaws.com/prod/generate \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "category": "大学入試",
    "question_type": "数学"
  }'
```

**期待されるレスポンス** (400):
```json
{
  "error": "未定義のカテゴリーです: 大学入試"
}
```

#### ケース3: カテゴリーと分野の不一致

```bash
curl -X POST https://your-api-url.amazonaws.com/prod/generate \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "category": "資格",
    "question_type": "現代文"
  }'
```

**期待されるレスポンス** (400):
```json
{
  "error": "カテゴリー '資格' に分野 '現代文' は許可されていません。"
}
```

#### ケース4: レベル未指定（必須の場合）

```bash
curl -X POST https://your-api-url.amazonaws.com/prod/generate \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "category": "資格",
    "question_type": "英検"
  }'
```

**期待されるレスポンス** (400):
```json
{
  "error": "分野 '英検' では難易度（level）の指定が必須です。"
}
```

#### ケース5: 無効なレベル

```bash
curl -X POST https://your-api-url.amazonaws.com/prod/generate \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "category": "資格",
    "question_type": "英検",
    "level": "10級"
  }'
```

**期待されるレスポンス** (400):
```json
{
  "error": "無効なレベルです。許可されている値: 1級, 準1級, 2級, 準2級, 3級, 4級, 5級"
}
```

#### ケース6: 不要なレベル指定

```bash
curl -X POST https://your-api-url.amazonaws.com/prod/generate \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "category": "共通テスト",
    "question_type": "現代文",
    "level": "2級"
  }'
```

**期待されるレスポンス** (400):
```json
{
  "error": "分野 '現代文' では難易度（level）の指定は不要です。"
}
```

## 3. ブラウザでのテスト

### 3-1. ローカル開発環境での確認

```bash
# .envファイルを作成
echo "VITE_API_URL=https://your-api-url.amazonaws.com/prod" > .env

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173` を開き、以下を確認:

1. **カテゴリー選択**
   - [ ] 「共通テスト」と「資格」が表示される
   - [ ] カテゴリーを選択すると分野が表示される

2. **分野選択**
   - [ ] 共通テスト → 現代文、英語、政治経済
   - [ ] 資格 → 英検、ニュース検定、TOEIC

3. **難易度選択**
   - [ ] 英検 → 1級〜5級が表示される
   - [ ] ニュース検定 → 1級〜5級が表示される
   - [ ] TOEIC → 500点〜990点が表示される
   - [ ] 現代文など → 難易度選択が表示されない

4. **クイズ生成**
   - [ ] ボタンが有効化される（必須項目が揃った時）
   - [ ] クリックするとローディング表示
   - [ ] 問題と4つの選択肢が表示される

5. **回答機能**
   - [ ] 選択肢をクリックすると選択状態になる
   - [ ] 「回答を確認」ボタンが有効化される
   - [ ] クリックすると正誤判定と解説が表示される

6. **結果画面**
   - [ ] 正解/不正解のバナーが表示される
   - [ ] 解説が表示される
   - [ ] 「🔄 再出題」ボタンが表示される
   - [ ] 「🏠 ホームに戻る」ボタンが表示される

7. **再出題機能**
   - [ ] 再出題ボタンで新しい問題が表示される
   - [ ] カテゴリー・分野・難易度は保持される

8. **ホームに戻る機能**
   - [ ] ホームボタンで初期画面に戻る
   - [ ] 選択内容がクリアされる

### 3-2. エラーハンドリングの確認

ブラウザの開発者ツールを開き、以下を確認:

1. **ネットワークタブ**
   - [ ] POSTリクエストが `/generate` に送信される
   - [ ] レスポンスが200で返る（正常系）
   - [ ] レスポンスが400で返る（異常系）

2. **コンソールタブ**
   - [ ] エラーメッセージが適切に表示される
   - [ ] 予期しないエラーがないか確認

3. **意図的なエラー発生**
   - Lambda関数を停止してネットワークエラーを確認
   - 環境変数を削除してAPIエラーを確認

## 4. Amplifyデプロイ後のテスト

### 4-1. 環境変数の確認

Amplify Console で環境変数が正しく設定されているか確認:

```
API_URL = https://your-api-url.amazonaws.com/prod
```

### 4-2. ビルドログの確認

ビルドログで環境変数が正しく読み込まれているか確認:

```
Environment variables:
  API_URL=https://your-api-url.amazonaws.com/prod
  VITE_API_URL=https://your-api-url.amazonaws.com/prod
```

### 4-3. CORSエラーの確認

ブラウザの開発者ツールで CORS エラーが発生していないか確認:

```
Access to XMLHttpRequest at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

もし発生している場合:
- Lambda関数の `ALLOWED_ORIGINS` にAmplifyのURLを追加
- API GatewayのCORS設定を確認

## 5. トラブルシューティング

### 問題: 「API URLが設定されていません」エラー

**原因**: 環境変数が設定されていない

**解決方法**:
- ローカル: `.env` ファイルを作成
- Amplify: 環境変数 `API_URL` を設定

### 問題: CORSエラー

**原因**: Lambda関数の `ALLOWED_ORIGINS` に許可されていない

**解決方法**:
```bash
aws lambda update-function-configuration \
  --function-name your-function-name \
  --environment "Variables={ALLOWED_ORIGINS=https://your-amplify-url.amplifyapp.com}"
```

### 問題: 500エラーが返る

**原因**: Lambda関数の実行エラー

**解決方法**:
```bash
# CloudWatch Logsを確認
aws logs tail /aws/lambda/your-function-name --follow
```

### 問題: タイムアウトエラー

**原因**: Lambda関数のタイムアウト設定が短い

**解決方法**:
```bash
aws lambda update-function-configuration \
  --function-name your-function-name \
  --timeout 30
```

## 6. チェックリスト

デプロイ前に以下を確認:

- [ ] Lambda関数がデプロイされている
- [ ] API Gatewayのエンドポイントが取得できる
- [ ] curlでのテストが成功する
- [ ] ローカル環境でアプリが動作する
- [ ] 全てのカテゴリー・分野・難易度の組み合わせが動作する
- [ ] エラーハンドリングが適切に動作する
- [ ] Amplifyに環境変数が設定されている
- [ ] Lambda関数のCORS設定が正しい
- [ ] ビルドが成功する
- [ ] デプロイ後のアプリが動作する
