# 地獄炊き：生成プロンプト

## Flow共通設定

- 9:16 vertical
- 8 seconds per clip
- Use the same black cast-iron pot, thin ivory Goto udon, long wooden chopsticks, dark wooden counter, and simple Japanese kitchen in both clips.
- Generate clean footage only. Add text, narration, BGM, and effects later in Remotion.

## Clip 1 — 緊張

```text
Create an 8-second vertical 9:16 ultra-realistic cinematic Japanese food commercial shot. In a dim traditional Japanese kitchen, an old matte-black cast-iron pot sits on a stove, filled with violently rolling boiling water. Thick white steam curls upward through cold blue-gray low-key lighting. Start with an extreme macro close-up of the bubbling surface and slowly push the camera toward the pot. At around 3 seconds, a neat bundle of authentic very thin, round, ivory-colored dried Goto udon noodles is lowered toward the water by long plain wooden chopsticks, with no hands visible. At around 4.5 seconds, the noodles strike the boiling water, creating a sudden powerful surge of steam, splashing bubbles, and a sharp dramatic camera jolt. The noodles sink and swirl naturally in the same pot as the camera moves to a slightly higher angle, ending on the turbulent boiling noodles. Make the tension serious and cinematic but completely realistic: no demons, no skulls, no fantasy fire, no supernatural effects. Physically accurate water, steam, noodles, and cookware. No people, no faces, no hands, no text, no captions, no logos, no labels, no watermark, no dialogue, no music, and no generated sound effects.
```

## Clip 2 — 緩和・食欲

```text
Create an 8-second vertical 9:16 ultra-realistic premium Japanese food commercial that continues seamlessly from the previous shot. Use the exact same matte-black cast-iron pot, very thin round ivory Goto udon noodles, long plain wooden chopsticks, dark wooden counter, and simple Japanese kitchen. Begin on the same pot with the noodles gently boiling, but shift immediately from cold ominous lighting to warm golden appetizing light. The chopsticks lift a silky bundle of cooked Goto udon from the steaming pot; the noodles move naturally, glisten with hot water, and remain thin, smooth, and unbroken. Follow the noodles in a slow macro tracking shot as they are lowered into a small pale ceramic bowl containing glossy beaten egg seasoned with soy sauce, chopped green onion, and a small amount of bonito flakes. Show the noodles coating beautifully in the golden egg sauce, then lift them once more for a final irresistible hero shot with soft steam, shallow depth of field, and warm highlights. Keep ingredients anatomically and physically accurate. No extra dishes, no egg shells, no deformed chopsticks, no people, no faces, no hands, no text, no captions, no logos, no labels, no watermark, no dialogue, no music, and no generated sound effects.
```

## Suno — 緊張から緩和への一曲

Instrumental mode: ON

```text
Instrumental soundtrack for a 28–32 second Japanese comedy food Short, built around an extreme tension-to-relief contrast. 0:00–0:03: dark cinematic suspense, very sparse low taiko heartbeat, deep bowed bass drone, isolated low shamisen plucks, slow rising pressure, serious and ominous but not horror. At exactly 0:03, create a clean half-second musical stop with empty space for an external impact sound. From 0:03.5 onward, switch abruptly into a bright, playful, appetizing Japanese comedy groove at about 118 BPM, with light shamisen, pizzicato strings, warm marimba, bamboo flute accents, brushed percussion, and cheerful small taiko. The second half should feel like hot noodles, steam, comfort, and a clever reveal. Add a tiny comedic pause near the ending, then finish with one crisp upbeat cadence for the punchline and subscribe screen. Strong contrast, clean arrangement, catchy but not busy, narration-friendly midrange, no vocals, no chanting, no spoken words, no screams, no horror effects, no built-in impact sound, no long intro, no fade-out.
```

## Remotionで後付けする核

- フック：`この麺、地獄に落とします。`
- 動作の頂点：麺が湯へ入る瞬間に画面振動・色変化・強い効果音
- 正体：`長崎・五島列島　地獄炊き`
- オチ：`地獄なのに、つるつる天国！`
- CTAはオチを読ませた後に別画面で表示する。

## 事実確認元

- 農林水産省「地獄炊き（五島うどん／島原そうめん） 長崎県」
  https://www.maff.go.jp/j/keikaku/syokubunka/k_ryouri/search_menu/menu/46_12_nagasaki.html

## 受領素材と編集メモ

- 緊張カット：`public/movie/Noodles_boiling_in_pot_1080p_202608212303.mp4`
  - 8.0秒、1080×1920、24fps
  - 約4.0秒で乾麺が画面へ入り、約5.1秒で着水と湯跳ねが最大になる。
  - 5.1秒を画面振動・色変化・強い効果音の同期点にする。
- BGM：`public/BGM/Udonswitch.mp3`
  - 154.656秒、48kHzステレオ
  - 曲全体の約101秒付近に暗部から明部への明確な転換がある。
  - Remotionでは原曲96.0秒付近から使い、映像5.1秒の着水直後に明部へ切り替える。
  - 素材区間は約−12.8 LUFS／0.0 dBTPのため、ナレーション下では十分に下げ、完成後に全体を正規化する。
- 緩和カット初稿：`public/movie/Cooking_Japanese_udon_noodles_1080p_202608212315.mp4`
  - 10.0秒、1080×1920、24fps
  - 湯気、卵だれ、ねぎ、かつお節は食欲映像として良好。
  - 麺が一般的な太いうどんになり、1カット目の細丸麺および五島うどんの特徴と連続しないため不採用。
  - 同じ構図を保ち、直径約2mmの細い丸麺を強く指定して再生成する。
- 緩和カット採用版：`public/movie/Chopsticks_lifting_noodles_from_pot_202608212322.mp4`
  - 10.0秒、1080×1920、24fps
  - 細い丸麺、黒い鍋、木の箸が1カット目から連続している。
  - 鍋から麺を上げ、卵・醤油・青ねぎ・かつお節のつけ汁へ運ぶ流れが明瞭。
  - 温かい照明と湯気が緩和・食欲パートに適しているため採用。

## 追加参考リンク

- Wikipedia「五島うどん」
  https://ja.wikipedia.org/wiki/%E4%BA%94%E5%B3%B6%E3%81%86%E3%81%A9%E3%82%93
