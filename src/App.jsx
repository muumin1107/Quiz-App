import { useState } from 'react';
import axios from 'axios';
import './App.css';

// カテゴリーと分野の定義（バックエンドと同期）
const CATEGORIES = {
  "共通テスト": ["現代文", "英語", "政治経済"],
  "資格": ["英検", "ニュース検定", "TOEIC"]
};

const LEVEL_REQUIREMENTS = {
  "英検": ["1級", "準1級", "2級", "準2級", "3級", "4級", "5級"],
  "ニュース検定": ["1級", "2級", "準2級", "3級", "4級", "5級"],
  "TOEIC": ["500点", "600点", "700点", "800点", "900点", "990点"]
};

function App() {
  // フォーム入力状態
  const [category, setCategory] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [level, setLevel] = useState('');
  
  // クイズデータと状態管理
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // カテゴリー変更時の処理
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    setQuestionType('');
    setLevel('');
  };

  // 分野変更時の処理
  const handleQuestionTypeChange = (e) => {
    const newQuestionType = e.target.value;
    setQuestionType(newQuestionType);
    setLevel('');
  };

  // クイズ生成リクエスト
  const generateQuiz = async () => {
    setLoading(true);
    setError(null);
    setQuizData(null);
    setSelectedAnswer(null);
    setShowResult(false);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error('API URLが設定されていません。.envファイルまたはAmplify環境変数を確認してください。');
      }

      // リクエストペイロードの構築
      const payload = {
        category,
        question_type: questionType,
        ...(level && { level })
      };

      // API Gateway経由でLambda関数を呼び出し
      // タイムアウト設定: 30秒（本番環境でのBedrock処理を考慮）
      const response = await axios.post(`${apiUrl}/generate`, payload, {
        headers: {
          'Content-Type': 'application/json'
          // Originヘッダーはブラウザが自動的に設定
        },
        timeout: 30000 // 30秒
      });

      // 正常系: response.data には { question, choices, answer_index, explanation } が含まれる
      setQuizData(response.data);
    } catch (err) {
      console.error('クイズ生成エラー:', err);
      
      // 異常系の処理
      if (err.code === 'ECONNABORTED') {
        // タイムアウトエラー
        setError('リクエストがタイムアウトしました。もう一度お試しください。');
      } else if (err.response) {
        // サーバーからエラーレスポンスが返された場合（4xx, 5xx）
        // response.data.error にエラーメッセージが含まれる
        setError(err.response.data.error || 'サーバーエラーが発生しました。');
      } else if (err.request) {
        // リクエストは送信されたがレスポンスがない場合
        setError('サーバーに接続できませんでした。ネットワーク接続を確認してください。');
      } else {
        // リクエストの設定中にエラーが発生した場合
        setError(err.message || '予期せぬエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  // 回答チェック
  const checkAnswer = () => {
    setShowResult(true);
  };

  // ホームに戻る
  const goHome = () => {
    setQuizData(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setError(null);
  };

  // 再出題
  const regenerateQuiz = () => {
    generateQuiz();
  };

  // 利用可能な分野リスト
  const availableQuestionTypes = category ? CATEGORIES[category] : [];
  
  // レベルが必要かどうか
  const requiresLevel = questionType && LEVEL_REQUIREMENTS[questionType];
  
  // 送信ボタンの有効/無効判定
  const canSubmit = category && questionType && (!requiresLevel || level);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📚 クイズアプリ</h1>
      </header>

      <main className="main-content">
        {loading ? (
          // ローディング表示
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">問題を生成しています...</p>
          </div>
        ) : !quizData ? (
          // クイズ生成フォーム
          <div className="form-container">
            <div className="form-intro">
              <p>カテゴリーと分野を選択して、クイズに挑戦しましょう！</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="category">カテゴリー</label>
              <select
                id="category"
                value={category}
                onChange={handleCategoryChange}
                className="form-select"
              >
                <option value="">-- 選択してください --</option>
                {Object.keys(CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {category && (
              <div className="form-group">
                <label htmlFor="questionType">分野</label>
                <select
                  id="questionType"
                  value={questionType}
                  onChange={handleQuestionTypeChange}
                  className="form-select"
                >
                  <option value="">-- 選択してください --</option>
                  {availableQuestionTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}

            {requiresLevel && (
              <div className="form-group">
                <label htmlFor="level">難易度</label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="form-select"
                >
                  <option value="">-- 選択してください --</option>
                  {LEVEL_REQUIREMENTS[questionType].map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div className="error-message">
                <strong>エラー:</strong> {error}
              </div>
            )}

            <button
              onClick={generateQuiz}
              disabled={!canSubmit || loading}
              className="btn btn-primary"
            >
              {loading ? '生成中...' : 'クイズを生成'}
            </button>
          </div>
        ) : (
          // クイズ表示
          <div className="quiz-container">
            <div className="quiz-header">
              <span className="quiz-badge">{category}</span>
              <span className="quiz-badge">{questionType}</span>
              {level && <span className="quiz-badge">{level}</span>}
            </div>

            <div className="question-section">
              <h2>問題</h2>
              <p className="question-text">{quizData.question}</p>
            </div>

            <div className="choices-section">
              <h3>選択肢</h3>
              {quizData.choices.map((choice, index) => (
                <div
                  key={index}
                  className={`choice-item ${
                    selectedAnswer === index ? 'selected' : ''
                  } ${
                    showResult
                      ? index === quizData.answer_index
                        ? 'correct'
                        : selectedAnswer === index
                        ? 'incorrect'
                        : ''
                      : ''
                  }`}
                  onClick={() => !showResult && setSelectedAnswer(index)}
                >
                  <span className="choice-number">{index + 1}</span>
                  <span className="choice-text">{choice}</span>
                  {showResult && index === quizData.answer_index && (
                    <span className="choice-icon">✓</span>
                  )}
                  {showResult && selectedAnswer === index && index !== quizData.answer_index && (
                    <span className="choice-icon">✗</span>
                  )}
                </div>
              ))}
            </div>

            {!showResult ? (
              <button
                onClick={checkAnswer}
                disabled={selectedAnswer === null}
                className="btn btn-primary"
              >
                回答を確認
              </button>
            ) : (
              <div className="result-section">
                <div className="explanation-section">
                  <h3>解説</h3>
                  <p>{quizData.explanation}</p>
                </div>

                <div className="action-buttons">
                  <button onClick={regenerateQuiz} className="btn btn-primary">
                    🔄 再出題
                  </button>
                  <button onClick={goHome} className="btn btn-secondary">
                    🏠 ホームに戻る
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
