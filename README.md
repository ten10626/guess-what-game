# Guess What?

ヒントでお題当てを遊ぶための、スマホ向け静的ブラウザアプリです。ジャストワン風に、回答者がお題を見ず、ヒント係のヒントからお題を当てます。

## 公開URL

GitHub Pages URL: https://ten10626.github.io/guess-what-game/

## フォルダ構成

```text
guess-what-game/
├── index.html
├── style.css
├── app.js
├── boardgame_words_1000.json
├── Code.gs
├── README.md
├── robots.txt
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
- お題投稿: お題候補と削除候補をApps Script Webアプリへ送信
- 3秒カウントダウン
- 横向き案内
- スマホ向けレスポンシブUI

## お題投稿の設定

`Code.gs` をGoogle Apps Scriptに貼り付け、Webアプリとしてデプロイしてください。デプロイ後に発行されたWebアプリURLを `app.js` の `APPS_SCRIPT_WEB_APP_URL` に設定すると、投稿フォームから以下の列でスプレッドシートに追記できます。

```text
timestamp, type, word, category, difficulty, reason, memo, userAgent
```

WebアプリURLが未設定の場合、投稿画面は表示されますが送信時に設定案内を表示します。
