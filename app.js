"use strict";

const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzO4CfsnrS4AMsv249rYuoMY6lMuZH0mQ5cnaxws1IBpdkPVOOtc8GPEKgCuxn6n-9p/exec";

const screens = document.querySelectorAll(".screen");
const dataStatus = document.querySelector("#data-status");
const normalForm = document.querySelector("#normal-form");
const customForm = document.querySelector("#custom-form");
const hintForm = document.querySelector("#hint-form");
const submitWordForm = document.querySelector("#submit-word-form");
const normalError = document.querySelector("#normal-error");
const customError = document.querySelector("#custom-error");
const hintError = document.querySelector("#hint-error");
const submitError = document.querySelector("#submit-error");
const submitStatus = document.querySelector("#submit-status");
const countdown = document.querySelector("#countdown");
const wordOutput = document.querySelector("#word-output");
const hintOutput = document.querySelector("#hint-output");
const customWord = document.querySelector("#custom-word");
const hintText = document.querySelector("#hint-text");
const submitWordText = document.querySelector("#submit-word-text");
const submitCategory = document.querySelector("#submit-category");
const submitDifficulty = document.querySelector("#submit-difficulty");
const submitMemo = document.querySelector("#submit-memo");
const deleteWordText = document.querySelector("#delete-word-text");
const deleteReason = document.querySelector("#delete-reason");
const addFields = document.querySelector("#add-fields");
const deleteFields = document.querySelector("#delete-fields");
const submitWordButton = document.querySelector("#submit-word-button");
const categorySelect = document.querySelector("#category-select");
const difficultySelect = document.querySelector("#difficulty-select");

const fallbackWords = [
  { word: "コーヒー", category: "食べ物・飲み物", difficulty: "簡単" },
  { word: "富士山", category: "自然・天気", difficulty: "簡単" },
  { word: "サッカー", category: "スポーツ・遊び", difficulty: "簡単" },
  { word: "図書館", category: "建物・場所", difficulty: "中級" },
  { word: "宇宙飛行士", category: "職業・人物", difficulty: "難しい" },
  { word: "新幹線", category: "乗り物", difficulty: "簡単" },
  { word: "カンガルー", category: "動物・生き物", difficulty: "中級" },
  { word: "映画館", category: "文化・娯楽", difficulty: "簡単" }
];

let words = fallbackWords;
let countdownTimer = null;

function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === screenId);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function clearErrors() {
  [normalError, customError, hintError, submitError].forEach((element) => {
    element.hidden = true;
    element.textContent = "";
  });
}

function setError(element, message) {
  element.textContent = message;
  element.hidden = false;
}

function resetSubmissionForm() {
  submitWordForm.reset();
  addFields.hidden = false;
  deleteFields.hidden = true;
  submitStatus.textContent = "";
  submitWordButton.disabled = false;
  submitWordButton.textContent = "投稿する";
}

function updateSubmissionFields() {
  const type = new FormData(submitWordForm).get("submission-type");
  addFields.hidden = type !== "add";
  deleteFields.hidden = type !== "delete";
  submitStatus.textContent = "";
  clearErrors();
}

function buildSubmissionPayload() {
  const type = new FormData(submitWordForm).get("submission-type");

  if (type === "add") {
    return {
      type: "add",
      word: submitWordText.value.trim(),
      category: submitCategory.value,
      difficulty: submitDifficulty.value,
      reason: "",
      memo: submitMemo.value.trim(),
      userAgent: navigator.userAgent
    };
  }

  return {
    type: "delete",
    word: deleteWordText.value.trim(),
    category: "",
    difficulty: "",
    reason: deleteReason.value.trim(),
    memo: "",
    userAgent: navigator.userAgent
  };
}

async function loadWords() {
  try {
    const response = await fetch("boardgame_words_1000.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch words");
    }
    const loadedWords = await response.json();
    if (!Array.isArray(loadedWords) || loadedWords.length === 0) {
      throw new Error("Words data is empty");
    }
    words = loadedWords.filter((item) => item && item.word && item.category && item.difficulty);
    if (words.length === 0) {
      throw new Error("Words data has no valid entries");
    }
    dataStatus.textContent = `${words.length}語のお題データを読み込みました`;
  } catch (error) {
    words = fallbackWords;
    dataStatus.textContent = "JSON読み込みに失敗したため、サンプル単語で遊べます";
  }
}

function pickRandomWord() {
  const category = categorySelect.value;
  const difficulty = difficultySelect.value;
  const candidates = words.filter((item) => {
    const categoryMatches = !category || item.category === category;
    const difficultyMatches = !difficulty || item.difficulty === difficulty;
    return categoryMatches && difficultyMatches;
  });

  if (candidates.length === 0) {
    return null;
  }

  return candidates[Math.floor(Math.random() * candidates.length)].word;
}

function startWordFlow(text) {
  clearTimeout(countdownTimer);
  wordOutput.textContent = text;
  showScreen("screen-ready");

  let current = 3;
  countdown.textContent = String(current);

  countdownTimer = setInterval(() => {
    current -= 1;
    if (current > 0) {
      countdown.textContent = String(current);
      return;
    }

    clearInterval(countdownTimer);
    countdownTimer = null;
    showScreen("screen-word");
  }, 1000);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  clearErrors();

  if (action === "title") {
    clearInterval(countdownTimer);
    countdownTimer = null;
    customWord.value = "";
    hintText.value = "";
    resetSubmissionForm();
    showScreen("screen-title");
  }

  if (action === "answer-mode") {
    showScreen("screen-answer-mode");
  }

  if (action === "normal-mode") {
    showScreen("screen-normal");
  }

  if (action === "custom-mode") {
    showScreen("screen-custom");
    customWord.focus();
  }

  if (action === "hint-mode") {
    showScreen("screen-hint-input");
    hintText.focus();
  }

  if (action === "submit-word") {
    showScreen("screen-submit-word");
    submitWordText.focus();
  }

  if (action === "rules") {
    showScreen("screen-rules");
  }

  if (action === "show-hint") {
    showScreen("screen-hint-display");
  }
});

normalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const selectedWord = pickRandomWord();
  if (!selectedWord) {
    setError(normalError, "条件に合うお題がありません。カテゴリや難易度を変更してください。");
    return;
  }

  startWordFlow(selectedWord);
});

customForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const text = customWord.value.trim();
  if (!text) {
    setError(customError, "お題を入力してください。");
    return;
  }

  startWordFlow(text);
});

hintForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const text = hintText.value.trim();
  if (!text) {
    setError(hintError, "ヒントを入力してください。");
    return;
  }

  hintOutput.textContent = text;
  showScreen("screen-hint-ready");
});

submitWordForm.addEventListener("change", (event) => {
  if (event.target.name === "submission-type") {
    updateSubmissionFields();
  }
});

submitWordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearErrors();
  submitStatus.textContent = "";

  const payload = buildSubmissionPayload();
  if (!payload.word) {
    setError(submitError, payload.type === "add" ? "お題を入力してください。" : "削除候補の単語を入力してください。");
    return;
  }

  if (!APPS_SCRIPT_WEB_APP_URL) {
    setError(submitError, "Apps ScriptのWebアプリURLが未設定です。app.jsのAPPS_SCRIPT_WEB_APP_URLを設定してください。");
    return;
  }

  submitWordButton.disabled = true;
  submitWordButton.textContent = "投稿中...";

  try {
    await fetch(APPS_SCRIPT_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    submitWordForm.reset();
    updateSubmissionFields();
    submitStatus.textContent = "投稿を送信しました。ありがとうございます。";
  } catch (error) {
    setError(submitError, "投稿に失敗しました。通信状態を確認して、もう一度お試しください。");
  } finally {
    submitWordButton.disabled = false;
    submitWordButton.textContent = "投稿する";
  }
});

loadWords();
