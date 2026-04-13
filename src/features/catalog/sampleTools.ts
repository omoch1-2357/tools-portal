import type { ToolCatalogItem } from "./types";

export const sampleTools: ToolCatalogItem[] = [
  {
    id: "sample-countdown",
    name: "Countdown Helper",
    description: "リリース日やイベント日までの残り時間を確認する小型ツール",
    url: "#",
    repo: "example/sample-countdown",
    tags: ["time", "sample"],
    visible: true,
    sortOrder: 100,
  },
  {
    id: "sample-text-cleaner",
    name: "Text Cleaner",
    description: "入力文字列の整形と簡易変換を行うテキスト補助ツール",
    url: "#",
    repo: "example/sample-text-cleaner",
    tags: ["text", "sample"],
    visible: true,
    sortOrder: 200,
  },
];
