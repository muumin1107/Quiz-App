import { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

// ==============================================================================
// 定数（バックエンドの AppConfig と同期）
// ==============================================================================

const CATEGORIES = {
  "共通テスト": ["現代文", "英語", "政治経済"],
  "資格":       ["英検", "ニュース検定", "TOEIC"],
};

const LEVEL_REQUIREMENTS = {
  "英検":        ["1級", "準1級", "2級", "準2級", "3級", "4級", "5級"],
  "ニュース検定": ["1級", "2級", "準2級", "3級", "4級", "5級"],
  "TOEIC":      ["500点", "600点", "700点", "800点", "900点", "990点"],
};

const LISTENING_SUBJECTS = new Set(["英語", "英検", "TOEIC"]);

// ==============================================================================
// AudioPlayer コンポーネント
// ==============================================================================

function AudioPlayer({ url }) {
  const audioRef                        = useRef(null);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [playCount,    setPlayCount]    = useState(0);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
    setIsPlaying(true);
    setPlayCount(c => c + 1);
  };

  const handleSeek = e => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };

  const formatTime = sec => {
    if (!isFinite(sec)) return "0:00";
    return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
  };

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => { setIsPlaying(false); setPlayCount(c => c + 1); }}
      />

      <div className="audio-instruction">
        <span className="audio-icon">🎧</span>
        <p>音声を聞いて問いに答えてください。何度でも再生できます。</p>
      </div>

      <div className="audio-controls">
        <button
          className="audio-btn audio-btn-play"
          onClick={togglePlay}
          aria-label={isPlaying ? "停止" : "再生"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <div className="audio-progress-wrap">
          <input
            type="range"
            className="audio-seek"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="再生位置"
          />
          <div className="audio-time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <button
          className="audio-btn audio-btn-replay"
          onClick={handleReplay}
          aria-label="最初から再生"
        >
          ↺
        </button>
      </div>

      {playCount > 0 && (
        <p className="audio-play-count">{playCount} 回再生済み</p>
      )}
    </div>
  );
}

// ==============================================================================
// App コンポーネント
// ==============================================================================

function App() {
  // フォーム入力
  const [category,     setCategory]     = useState('');
  const [questionType, setQuestionType] = useState('');
  const [level,        setLevel]        = useState('');
  const [isListening,  setIsListening]  = useState(false);

  // クイズ表示
  const [quizData,       setQuizData]       = useState(null);
  const [audioUrl,       setAudioUrl]       = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult,     setShowResult]     = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState(null);

  // ---------- フォーム操作 ----------

  const handleCategoryChange = e => {
    setCategory(e.target.value);
    setQuestionType('');
    setLevel('');
    setIsListening(false);
  };

  const handleQuestionTypeChange = e => {
    const newType = e.target.value;
    setQuestionType(newType);
    setLevel('');
    if (!LISTENING_SUBJECTS.has(newType)) setIsListening(false);
  };

  // ---------- クイズ生成 ----------

  const generateQuiz = async () => {
    setLoading(true);
    setError(null);
    setQuizData(null);
    setAudioUrl(null);
    setSelectedAnswer(null);
    setShowResult(false);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) throw new Error('VITE_API_URL が設定されていません。');

      const payload = {
        category,
        question_type: questionType,
        ...(level       && { level }),
        ...(isListening && { is_listening: true }),
      };

      const response = await axios.post(`${apiUrl}/generate`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: isListening ? 45000 : 30000,
      });

      setQuizData(response.data);
      if (response.data.audio_url) setAudioUrl(response.data.audio_url);

    } catch (err) {
      console.error('クイズ生成エラー:', err);
      if (err.code === 'ECONNABORTED') {
        setError('リクエストがタイムアウトしました。もう一度お試しください。');
      } else if (err.response) {
        setError(err.response.data?.error ?? 'サーバーエラーが発生しました。');
      } else if (err.request) {
        setError('サーバーに接続できませんでした。ネットワーク接続を確認してください。');
      } else {
        setError(err.message ?? '予期せぬエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------- クイズ操作 ----------

  const goHome = () => {
    setQuizData(null);
    setAudioUrl(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setError(null);
  };

  // ---------- 派生値 ----------

  const availableQuestionTypes  = category ? CATEGORIES[category] : [];
  const requiresLevel           = questionType && LEVEL_REQUIREMENTS[questionType];
  const showListeningCheckbox   = questionType && LISTENING_SUBJECTS.has(questionType);
  const canSubmit               = category && questionType && (!requiresLevel || level);

  // ---------- 選択肢のスタイルクラスを導出 ----------

  const choiceClass = (index) => [
    'choice-item',
    selectedAnswer === index                                       && 'selected',
    showResult && index === quizData?.answer_index                && 'correct',
    showResult && selectedAnswer === index
      && index !== quizData?.answer_index                         && 'incorrect',
  ].filter(Boolean).join(' ');

  // ==============================================================================
  // レンダリング
  // ==============================================================================

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📚 クイズアプリ</h1>
      </header>

      <main className="main-content">

        {/* ローディング */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading-text">
              {isListening ? '音声問題を生成しています...' : '問題を生成しています...'}
            </p>
          </div>
        )}

        {/* クイズ生成フォーム */}
        {!loading && !quizData && (
          <div className="form-container">
            <div className="form-intro">
              <p>カテゴリーと分野を選択して、クイズに挑戦しましょう！</p>
            </div>

            <div className="form-group">
              <label htmlFor="category">カテゴリー</label>
              <select id="category" value={category} onChange={handleCategoryChange} className="form-select">
                <option value="">-- 選択してください --</option>
                {Object.keys(CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {category && (
              <div className="form-group">
                <label htmlFor="questionType">分野</label>
                <select id="questionType" value={questionType} onChange={handleQuestionTypeChange} className="form-select">
                  <option value="">-- 選択してください --</option>
                  {availableQuestionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}

            {requiresLevel && (
              <div className="form-group">
                <label htmlFor="level">難易度</label>
                <select id="level" value={level} onChange={e => setLevel(e.target.value)} className="form-select">
                  <option value="">-- 選択してください --</option>
                  {LEVEL_REQUIREMENTS[questionType].map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>
            )}

            {showListeningCheckbox && (
              <div className="form-group checkbox-group">
                <label className="checkbox-label" htmlFor="isListening">
                  <input
                    type="checkbox"
                    id="isListening"
                    checked={isListening}
                    onChange={e => setIsListening(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom" />
                  <span className="checkbox-text">🎧 リスニング問題</span>
                </label>
                <p className="checkbox-hint">音声を聞いて答える問題を出題します</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <strong>エラー:</strong> {error}
              </div>
            )}

            <button onClick={generateQuiz} disabled={!canSubmit || loading} className="btn btn-primary">
              クイズを生成
            </button>
          </div>
        )}

        {/* クイズ表示 */}
        {!loading && quizData && (
          <div className="quiz-container">
            <div className="quiz-header">
              <span className="quiz-badge">{category}</span>
              <span className="quiz-badge">{questionType}</span>
              {level    && <span className="quiz-badge">{level}</span>}
              {audioUrl && <span className="quiz-badge quiz-badge-listening">🎧 リスニング</span>}
            </div>

            {audioUrl && <AudioPlayer url={audioUrl} />}

            <div className="question-section">
              <h2>問題</h2>
              <p className="question-text">{quizData.question}</p>
            </div>

            <div className="choices-section">
              <h3>選択肢</h3>
              {quizData.choices.map((choice, index) => (
                <div
                  key={index}
                  className={choiceClass(index)}
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
                onClick={() => setShowResult(true)}
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
                  <button onClick={generateQuiz} className="btn btn-primary">🔄 再出題</button>
                  <button onClick={goHome}        className="btn btn-secondary">🏠 ホームに戻る</button>
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
