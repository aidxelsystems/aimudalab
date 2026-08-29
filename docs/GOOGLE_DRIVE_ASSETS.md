# Google Drive素材共有

GitHubには制作知識、進捗、台本、Remotionコード、設定だけを置く。動画、画像、BGM、効果音、VOICEVOX音声、完成MP4はGoogle Driveで共有する。

## Driveの推奨構成

```text
AIMudaLabAssets/
├─ public/
│  ├─ movie/
│  ├─ image/
│  ├─ knowledge/
│  ├─ quiz/
│  ├─ BGM/
│  ├─ Effect/
│  └─ voice/
├─ charactor/
├─ episode-images/
└─ final-archive/
```

`public/` 以下はリポジトリと同じ相対パスを維持する。大文字・小文字、空白、日本語ファイル名も変更しない。

## 2台目PCへの復元

1. Google Drive for desktopで `AIMudaLabAssets` を同期する。
2. `AIMudaLabAssets/public/` の内容をリポジトリの `public/` へ同期する。
3. `charactor/` とepisode別画像も、コードが参照する相対パスへ復元する。
4. `npm run assets:manifest` を実行する。
5. `ProductionTeam/assets-manifest.json` とGit上の基準を比較する。
6. `npx tsc --noEmit` とRemotionの静止画プレビューを確認する。

Google Driveの絶対パスをコードやJSONへ保存しない。コードは常に `public/BGM/...` などのリポジトリ相対パスを参照する。

## 効果音

効果音はすべて `AIMudaLabAssets/public/Effect/` で共有する。

- ファイル名を用途が分かる日本語名にする。
- 同じ音の改訂版は上書きせず、末尾へ番号を付ける。
- 使用した作品のepisode JSONまたは制作ブリーフへ相対パスを記録する。
- ライセンス元、取得URL、利用条件がある場合は制作ブリーフへ残す。

## 完成動画

作業中は `out/` に出力する。人のQCと投稿が完了したものだけ `final-archive/<公開日>-<episode-id>/` へ保存する。

## Gitへ入らないことの確認

```powershell
git status --short
git check-ignore public/Effect/<ファイル名>.mp3
git check-ignore public/movie/<ファイル名>.mp4
```

どちらも無視対象として表示されれば正しい。
