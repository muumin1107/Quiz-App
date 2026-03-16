# デザインガイドライン

このドキュメントでは、クイズアプリの洗練されたデザインシステムについて説明します。

## デザイン理念

### 1. 自然で洗練された印象
- AIが作成した感をなくす
- 過度なグラデーションや派手な色使いを避ける
- 微妙な陰影と奥行きで質感を表現

### 2. モダンで実用的
- 読みやすいタイポグラフィ
- 適切な余白とスペーシング
- スムーズで自然なアニメーション

### 3. アクセシブル
- 十分なコントラスト比
- タッチフレンドリーなサイズ
- ダークモード対応

## カラーパレット

### プライマリカラー
```css
--color-primary: #2563eb        /* ブルー - メインアクション */
--color-primary-dark: #1e40af   /* ダークブルー - ホバー時 */
--color-primary-light: #3b82f6  /* ライトブルー - アクセント */
```

### セマンティックカラー
```css
--color-success: #10b981        /* グリーン - 正解 */
--color-success-light: #d1fae5  /* ライトグリーン - 正解背景 */
--color-error: #ef4444          /* レッド - 不正解 */
--color-error-light: #fee2e2    /* ライトレッド - 不正解背景 */
```

### テキストカラー
```css
--color-text-primary: #0f172a   /* メインテキスト */
--color-text-secondary: #475569 /* セカンダリテキスト */
--color-text-muted: #64748b     /* 補足テキスト */
```

### 背景カラー
```css
--color-bg-gradient-start: #f8fafc  /* グラデーション開始 */
--color-bg-gradient-end: #e0f2fe    /* グラデーション終了 */
```

## タイポグラフィ

### フォントファミリー
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

- **Inter**: モダンで読みやすいサンセリフフォント（Google Fonts経由）
- システムフォントをフォールバックとして使用

### フォントサイズ
| 要素 | サイズ | 用途 |
|------|--------|------|
| h1 | 1.875rem (30px) | アプリタイトル |
| h2 | 1.125rem (18px) | 問題タイトル |
| h3 | 1rem (16px) | セクションタイトル |
| body | 0.9375rem (15px) | 本文、選択肢 |
| small | 0.875rem (14px) | ラベル、補足 |
| badge | 0.8125rem (13px) | バッジ |

### フォントウェイト
- **400**: 本文
- **500**: 選択肢、補足
- **600**: ラベル、見出し
- **700**: タイトル、強調

## スペーシング

### 余白システム
```css
0.5rem = 8px    /* 小 */
0.75rem = 12px  /* 中小 */
1rem = 16px     /* 中 */
1.5rem = 24px   /* 中大 */
2rem = 32px     /* 大 */
3rem = 48px     /* 特大 */
```

### パディング
- **コンテナ**: 2rem (モバイル) → 2.5rem (タブレット) → 3rem (デスクトップ)
- **ボタン**: 0.875rem × 1.5rem
- **選択肢**: 1rem × 1.125rem

## 角丸（Border Radius）

```css
--radius-sm: 8px    /* 小要素 */
--radius-md: 12px   /* ボタン、選択肢 */
--radius-lg: 16px   /* バッジ */
--radius-xl: 20px   /* コンテナ */
```

## シャドウ（Box Shadow）

### レベル別シャドウ
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

### 使用例
- **カード**: shadow-lg
- **ボタン**: shadow-sm → shadow-md (ホバー時)
- **選択肢**: shadow-md (ホバー時)

## アニメーション

### トランジション速度
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

### アニメーション効果

#### スピンアニメーション（ローディング）
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### スライドイン（クイズ表示）
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### 正解パルス
```css
@keyframes correctPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
```

#### 不正解シェイク
```css
@keyframes incorrectShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
```

## インタラクション

### ホバー効果
- **ボタン**: 
  - 背景色を暗く
  - シャドウを強調
  - 1px上に移動

- **選択肢**:
  - ボーダー色を変更
  - 背景色を変更
  - デスクトップでは1px上に移動

### アクティブ効果
- **ボタン**: 元の位置に戻る（押下感）
- **選択肢**: わずかに縮小（0.99倍）

### フォーカス効果
```css
outline: 2px solid #3b82f6;
outline-offset: 2px;
```

## レスポンシブデザイン

### ブレークポイント
```css
モバイル: < 640px
タブレット: 640px - 1023px
デスクトップ: ≥ 1024px
```

### 適応的レイアウト
- **モバイル**: シングルカラム、コンパクト
- **タブレット**: やや余裕のあるパディング
- **デスクトップ**: 最大幅、ホバー効果強化

## ダークモード

### 自動切り替え
システムの設定（`prefers-color-scheme: dark`）に基づいて自動的にダークモードに切り替わります。

### ダークモードカラー
```css
--color-bg-gradient-start: #0f172a
--color-bg-gradient-end: #1e293b
--color-text-primary: #f1f5f9
--color-text-secondary: #cbd5e1
--color-border: #334155
```

### コンテナ背景
- ライトモード: `white`
- ダークモード: `#1e293b`

## アクセシビリティ

### コントラスト比
- **テキスト**: 最低 4.5:1 (WCAG AA)
- **大きいテキスト**: 最低 3:1

### タッチターゲット
- **最小サイズ**: 44px × 44px
- **選択肢**: 最低 64px の高さ

### 動きの低減
```css
@media (prefers-reduced-motion: reduce) {
  /* アニメーションを最小化 */
}
```

## コンポーネント別ガイドライン

### ローディングスピナー
- サイズ: 48px × 48px
- 色: プライマリカラー
- アニメーション: 0.8秒で1回転

### フォームコントロール
- ボーダー: 1.5px solid
- パディング: 0.75rem × 1rem
- フォーカス時: ボーダー色変更 + ボックスシャドウ

### 選択肢
- 最小高さ: 64px
- ボーダー: 1.5px solid
- アニメーション:
  - 正解: 0.4秒のパルス
  - 不正解: 0.4秒のシェイク

### ボタン
- パディング: 0.875rem × 1.5rem
- トランジション: 200ms
- ホバー: 1px上昇 + シャドウ強調

## ベストプラクティス

### DO（推奨）
✅ 一貫したスペーシングを使用する
✅ CSS変数を活用する
✅ セマンティックな色名を使う
✅ アクセシビリティを考慮する
✅ モバイルファーストで設計する

### DON'T（非推奨）
❌ インラインスタイルを多用しない
❌ 固定値を直接記述しない
❌ 過度なアニメーションを避ける
❌ 小さすぎるタッチターゲット
❌ 低コントラストの配色

## 今後の拡張

将来的に追加を検討できる要素:
- カスタムテーマ選択
- ライト/ダークモードの手動切り替え
- アニメーション速度のカスタマイズ
- カラーブラインドモード

## リファレンス

このデザインシステムは以下のデザイン原則に基づいています:
- **Tailwind CSS**: カラーパレットとスペーシングシステム
- **Material Design**: インタラクションパターン
- **Human Interface Guidelines**: アクセシビリティとタッチターゲット
