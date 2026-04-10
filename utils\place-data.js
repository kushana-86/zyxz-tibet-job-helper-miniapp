const PLACE_DATA = [
  { name: "拉萨市", aliases: ["拉萨市", "拉萨"], elevation: 3650, transport: 5 },
  { name: "城关区", aliases: ["城关区"], elevation: 3650, transport: 5 },
  { name: "堆龙德庆区", aliases: ["堆龙德庆区", "堆龙德庆"], elevation: 3700, transport: 4 },
  { name: "达孜区", aliases: ["达孜区", "达孜"], elevation: 3700, transport: 3 },
  { name: "墨竹工卡县", aliases: ["墨竹工卡县", "墨竹工卡"], elevation: 3830, transport: 2 },
  { name: "林周县", aliases: ["林周县", "林周"], elevation: 3900, transport: 2 },
  { name: "尼木县", aliases: ["尼木县", "尼木"], elevation: 3800, transport: 2 },
  { name: "当雄县", aliases: ["当雄县", "当雄"], elevation: 4300, transport: 2 },
  { name: "曲水县", aliases: ["曲水县", "曲水"], elevation: 3600, transport: 3 },

  { name: "日喀则市", aliases: ["日喀则市", "日喀则"], elevation: 3840, transport: 4 },
  { name: "桑珠孜区", aliases: ["桑珠孜区", "桑珠孜"], elevation: 3840, transport: 4 },
  { name: "江孜县", aliases: ["江孜县", "江孜"], elevation: 4040, transport: 2 },
  { name: "定日县", aliases: ["定日县", "定日"], elevation: 4300, transport: 1 },
  { name: "萨迦县", aliases: ["萨迦县", "萨迦"], elevation: 4300, transport: 1 },
  { name: "拉孜县", aliases: ["拉孜县", "拉孜"], elevation: 4010, transport: 2 },
  { name: "白朗县", aliases: ["白朗县", "白朗"], elevation: 3890, transport: 2 },
  { name: "仁布县", aliases: ["仁布县", "仁布"], elevation: 3900, transport: 2 },
  { name: "康马县", aliases: ["康马县", "康马"], elevation: 4300, transport: 1 },
  { name: "亚东县", aliases: ["亚东县", "亚东"], elevation: 2900, transport: 2 },
  { name: "吉隆县", aliases: ["吉隆县", "吉隆"], elevation: 4200, transport: 1 },
  { name: "聂拉木县", aliases: ["聂拉木县", "聂拉木"], elevation: 3800, transport: 1 },

  { name: "山南市", aliases: ["山南市", "山南"], elevation: 3550, transport: 3 },
  { name: "乃东区", aliases: ["乃东区", "乃东"], elevation: 3550, transport: 3 },
  { name: "扎囊县", aliases: ["扎囊县", "扎囊"], elevation: 3600, transport: 2 },
  { name: "贡嘎县", aliases: ["贡嘎县", "贡嘎"], elevation: 3600, transport: 4 },
  { name: "桑日县", aliases: ["桑日县", "桑日"], elevation: 3600, transport: 2 },
  { name: "琼结县", aliases: ["琼结县", "琼结"], elevation: 3700, transport: 2 },
  { name: "浪卡子县", aliases: ["浪卡子县", "浪卡子"], elevation: 4450, transport: 1 },
  { name: "错那市", aliases: ["错那市", "错那"], elevation: 4300, transport: 1 },
  { name: "隆子县", aliases: ["隆子县", "隆子"], elevation: 3900, transport: 1 },

  { name: "林芝市", aliases: ["林芝市", "林芝"], elevation: 3000, transport: 4 },
  { name: "巴宜区", aliases: ["巴宜区", "巴宜"], elevation: 3000, transport: 4 },
  { name: "工布江达县", aliases: ["工布江达县", "工布江达"], elevation: 3440, transport: 2 },
  { name: "米林市", aliases: ["米林市", "米林"], elevation: 2950, transport: 4 },
  { name: "墨脱县", aliases: ["墨脱县", "墨脱"], elevation: 1200, transport: 1 },
  { name: "波密县", aliases: ["波密县", "波密"], elevation: 2720, transport: 2 },
  { name: "察隅县", aliases: ["察隅县", "察隅"], elevation: 2300, transport: 1 },
  { name: "朗县", aliases: ["朗县"], elevation: 3200, transport: 2 },

  { name: "昌都市", aliases: ["昌都市", "昌都"], elevation: 3200, transport: 3 },
  { name: "卡若区", aliases: ["卡若区", "卡若"], elevation: 3200, transport: 3 },
  { name: "江达县", aliases: ["江达县", "江达"], elevation: 3600, transport: 1 },
  { name: "贡觉县", aliases: ["贡觉县", "贡觉"], elevation: 3400, transport: 1 },
  { name: "类乌齐县", aliases: ["类乌齐县", "类乌齐"], elevation: 3900, transport: 1 },
  { name: "丁青县", aliases: ["丁青县", "丁青"], elevation: 3870, transport: 1 },
  { name: "察雅县", aliases: ["察雅县", "察雅"], elevation: 3600, transport: 1 },
  { name: "八宿县", aliases: ["八宿县", "八宿"], elevation: 3260, transport: 2 },
  { name: "左贡县", aliases: ["左贡县", "左贡"], elevation: 3780, transport: 2 },
  { name: "芒康县", aliases: ["芒康县", "芒康"], elevation: 3870, transport: 1 },
  { name: "洛隆县", aliases: ["洛隆县", "洛隆"], elevation: 3640, transport: 1 },
  { name: "边坝县", aliases: ["边坝县", "边坝"], elevation: 3800, transport: 1 },

  { name: "那曲市", aliases: ["那曲市", "那曲"], elevation: 4500, transport: 2 },
  { name: "色尼区", aliases: ["色尼区", "色尼"], elevation: 4500, transport: 2 },
  { name: "嘉黎县", aliases: ["嘉黎县", "嘉黎"], elevation: 4500, transport: 1 },
  { name: "比如县", aliases: ["比如县", "比如"], elevation: 4000, transport: 1 },
  { name: "聂荣县", aliases: ["聂荣县", "聂荣"], elevation: 4700, transport: 1 },
  { name: "安多县", aliases: ["安多县", "安多"], elevation: 4800, transport: 1 },
  { name: "申扎县", aliases: ["申扎县", "申扎"], elevation: 4700, transport: 1 },
  { name: "索县", aliases: ["索县"], elevation: 4000, transport: 1 },
  { name: "班戈县", aliases: ["班戈县", "班戈"], elevation: 4700, transport: 1 },
  { name: "巴青县", aliases: ["巴青县", "巴青"], elevation: 4200, transport: 1 },
  { name: "尼玛县", aliases: ["尼玛县", "尼玛"], elevation: 4600, transport: 1 },
  { name: "双湖县", aliases: ["双湖县", "双湖"], elevation: 4900, transport: 1 },

  { name: "阿里地区", aliases: ["阿里地区", "阿里"], elevation: 4300, transport: 1 },
  { name: "噶尔县", aliases: ["噶尔县", "噶尔"], elevation: 4300, transport: 2 },
  { name: "普兰县", aliases: ["普兰县", "普兰"], elevation: 3900, transport: 1 },
  { name: "札达县", aliases: ["札达县", "札达"], elevation: 3700, transport: 1 },
  { name: "日土县", aliases: ["日土县", "日土"], elevation: 4300, transport: 1 },
  { name: "革吉县", aliases: ["革吉县", "革吉"], elevation: 4400, transport: 1 },
  { name: "改则县", aliases: ["改则县", "改则"], elevation: 4500, transport: 1 },
  { name: "措勤县", aliases: ["措勤县", "措勤"], elevation: 4700, transport: 1 }
];

const splitInput = (text) =>
  text
    .split(/[\s,，、；;。\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const buildAliasMap = () => {
  const aliasMap = {};
  PLACE_DATA.forEach((item) => {
    item.aliases.forEach((alias) => {
      aliasMap[alias] = item.name;
    });
  });
  return aliasMap;
};

const ALIAS_MAP = buildAliasMap();
const SORTED_ALIASES = Object.keys(ALIAS_MAP).sort((a, b) => b.length - a.length);

const extractLocations = (text) => {
  const matched = [];
  const seen = new Set();

  splitInput(text).forEach((token) => {
    const canonical = ALIAS_MAP[token];
    if (canonical && !seen.has(canonical)) {
      matched.push(canonical);
      seen.add(canonical);
    }
  });

  const occupied = new Array(text.length).fill(false);
  SORTED_ALIASES.forEach((alias) => {
    let start = 0;
    while (start < text.length) {
      const index = text.indexOf(alias, start);
      if (index === -1) {
        break;
      }

      const end = index + alias.length;
      const hasOverlap = occupied.slice(index, end).some(Boolean);
      if (!hasOverlap) {
        const canonical = ALIAS_MAP[alias];
        if (!seen.has(canonical)) {
          matched.push(canonical);
          seen.add(canonical);
        }
        for (let i = index; i < end; i += 1) {
          occupied[i] = true;
        }
      }
      start = index + 1;
    }
  });

  return matched;
};

const comparePlaces = (text) => {
  const recognized = extractLocations(text);
  const results = recognized
    .map((name) => {
      const item = PLACE_DATA.find((entry) => entry.name === name);
      if (!item) {
        return null;
      }

      const score = Number((((5000 - item.elevation) / 1000) + item.transport).toFixed(2));
      return {
        name: item.name,
        elevation: item.elevation,
        transport: item.transport,
        score
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  return {
    recognized,
    results
  };
};

module.exports = {
  PLACE_DATA,
  comparePlaces
};
