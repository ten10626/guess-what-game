# Guess What?

ヒントでお題当てを遊ぶための、スマホ向け静的ブラウザアプリです。ジャストワン風に、回答者がお題を見ず、ヒント係のヒントからお題を当てます。

## 公開URL

GitHub Pages URL: 公開後に追記

## フォルダ構成

```text
guess-what-game/
├── index.html
├── style.css
├── app.js
├── boardgame_words_1000.json
├── README.md
└── .nojekyll
```

## 起動方法

GitHub Pagesに公開すると、ブラウザでURLを開くだけで遊べます。HTML、CSS、JavaScriptのみで動作し、サーバー、アカウント、リアルタイム通信は不要です。

## ローカル確認方法

ローカルで確認する場合は、VSCode Live Serverなどの簡易ローカルサーバーで `index.html` を開くことを推奨します。

`index.html` をファイルとして直接開いた場合、ブラウザの制限により `boardgame_words_1000.json` の読み込みが失敗することがあります。その場合でも、アプリ内のサンプル単語にフォールバックして動作します。

## 推奨ブラウザ

- iPhone Safari
- Chrome

## 主な機能

- 通常モード: `boardgame_words_1000.json` からカテゴリと難易度でお題を抽選
- カスタムモード: 自由入力したお題を表示
- ヒント係モード: 入力したヒントを大きく表示
- 3秒カウントダウン
- 横向き案内
- スマホ向けレスポンシブUI
