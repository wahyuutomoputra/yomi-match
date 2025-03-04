export interface Character {
  id: string;
  romaji: string;
  hiragana: string;
  katakana: string;
}

export const INITIAL_CHARACTERS: Character[] = [
  // Vowels
  { id: "a", romaji: "a", hiragana: "あ", katakana: "ア" },
  { id: "i", romaji: "i", hiragana: "い", katakana: "イ" },
  { id: "u", romaji: "u", hiragana: "う", katakana: "ウ" },
  { id: "e", romaji: "e", hiragana: "え", katakana: "エ" },
  { id: "o", romaji: "o", hiragana: "お", katakana: "オ" },

  // K-series
  { id: "ka", romaji: "ka", hiragana: "か", katakana: "カ" },
  { id: "ki", romaji: "ki", hiragana: "き", katakana: "キ" },
  { id: "ku", romaji: "ku", hiragana: "く", katakana: "ク" },
  { id: "ke", romaji: "ke", hiragana: "け", katakana: "ケ" },
  { id: "ko", romaji: "ko", hiragana: "こ", katakana: "コ" },

  // S-series
  { id: "sa", romaji: "sa", hiragana: "さ", katakana: "サ" },
  { id: "shi", romaji: "shi", hiragana: "し", katakana: "シ" },
  { id: "su", romaji: "su", hiragana: "す", katakana: "ス" },
  { id: "se", romaji: "se", hiragana: "せ", katakana: "セ" },
  { id: "so", romaji: "so", hiragana: "そ", katakana: "ソ" },

  // T-series
  { id: "ta", romaji: "ta", hiragana: "た", katakana: "タ" },
  { id: "chi", romaji: "chi", hiragana: "ち", katakana: "チ" },
  { id: "tsu", romaji: "tsu", hiragana: "つ", katakana: "ツ" },
  { id: "te", romaji: "te", hiragana: "て", katakana: "テ" },
  { id: "to", romaji: "to", hiragana: "と", katakana: "ト" },

  // N-series
  { id: "na", romaji: "na", hiragana: "な", katakana: "ナ" },
  { id: "ni", romaji: "ni", hiragana: "に", katakana: "ニ" },
  { id: "nu", romaji: "nu", hiragana: "ぬ", katakana: "ヌ" },
  { id: "ne", romaji: "ne", hiragana: "ね", katakana: "ネ" },
  { id: "no", romaji: "no", hiragana: "の", katakana: "ノ" },

  // H-series
  { id: "ha", romaji: "ha", hiragana: "は", katakana: "ハ" },
  { id: "hi", romaji: "hi", hiragana: "ひ", katakana: "ヒ" },
  { id: "fu", romaji: "fu", hiragana: "ふ", katakana: "フ" },
  { id: "he", romaji: "he", hiragana: "へ", katakana: "ヘ" },
  { id: "ho", romaji: "ho", hiragana: "ほ", katakana: "ホ" },

  // M-series
  { id: "ma", romaji: "ma", hiragana: "ま", katakana: "マ" },
  { id: "mi", romaji: "mi", hiragana: "み", katakana: "ミ" },
  { id: "mu", romaji: "mu", hiragana: "む", katakana: "ム" },
  { id: "me", romaji: "me", hiragana: "め", katakana: "メ" },
  { id: "mo", romaji: "mo", hiragana: "も", katakana: "モ" },

  // Y-series
  { id: "ya", romaji: "ya", hiragana: "や", katakana: "ヤ" },
  { id: "yu", romaji: "yu", hiragana: "ゆ", katakana: "ユ" },
  { id: "yo", romaji: "yo", hiragana: "よ", katakana: "ヨ" },

  // R-series
  { id: "ra", romaji: "ra", hiragana: "ら", katakana: "ラ" },
  { id: "ri", romaji: "ri", hiragana: "り", katakana: "リ" },
  { id: "ru", romaji: "ru", hiragana: "る", katakana: "ル" },
  { id: "re", romaji: "re", hiragana: "れ", katakana: "レ" },
  { id: "ro", romaji: "ro", hiragana: "ろ", katakana: "ロ" },

  // W-series
  { id: "wa", romaji: "wa", hiragana: "わ", katakana: "ワ" },
  { id: "wo", romaji: "wo", hiragana: "を", katakana: "ヲ" },

  // N
  { id: "n", romaji: "n", hiragana: "ん", katakana: "ン" },
];

export const DAKUON_CHARACTERS: Character[] = [
  // G-series (voiced K-series)
  { id: "ga", romaji: "ga", hiragana: "が", katakana: "ガ" },
  { id: "gi", romaji: "gi", hiragana: "ぎ", katakana: "ギ" },
  { id: "gu", romaji: "gu", hiragana: "ぐ", katakana: "グ" },
  { id: "ge", romaji: "ge", hiragana: "げ", katakana: "ゲ" },
  { id: "go", romaji: "go", hiragana: "ご", katakana: "ゴ" },

  // Z-series (voiced S-series)
  { id: "za", romaji: "za", hiragana: "ざ", katakana: "ザ" },
  { id: "ji", romaji: "ji", hiragana: "じ", katakana: "ジ" },
  { id: "zu", romaji: "zu", hiragana: "ず", katakana: "ズ" },
  { id: "ze", romaji: "ze", hiragana: "ぜ", katakana: "ゼ" },
  { id: "zo", romaji: "zo", hiragana: "ぞ", katakana: "ゾ" },

  // D-series (voiced T-series)
  { id: "da", romaji: "da", hiragana: "だ", katakana: "ダ" },
  { id: "ji", romaji: "ji", hiragana: "ぢ", katakana: "ヂ" },
  { id: "zu", romaji: "zu", hiragana: "づ", katakana: "ヅ" },
  { id: "de", romaji: "de", hiragana: "で", katakana: "デ" },
  { id: "do", romaji: "do", hiragana: "ど", katakana: "ド" },

  // B-series (voiced H-series)
  { id: "ba", romaji: "ba", hiragana: "ば", katakana: "バ" },
  { id: "bi", romaji: "bi", hiragana: "び", katakana: "ビ" },
  { id: "bu", romaji: "bu", hiragana: "ぶ", katakana: "ブ" },
  { id: "be", romaji: "be", hiragana: "べ", katakana: "ベ" },
  { id: "bo", romaji: "bo", hiragana: "ぼ", katakana: "ボ" },

  // P-series (H-series with handakuten)
  { id: "pa", romaji: "pa", hiragana: "ぱ", katakana: "パ" },
  { id: "pi", romaji: "pi", hiragana: "ぴ", katakana: "ピ" },
  { id: "pu", romaji: "pu", hiragana: "ぷ", katakana: "プ" },
  { id: "pe", romaji: "pe", hiragana: "ぺ", katakana: "ペ" },
  { id: "po", romaji: "po", hiragana: "ぽ", katakana: "ポ" },
]; 