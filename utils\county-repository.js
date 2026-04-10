const { PLACE_DATA } = require("./place-data");
const { JOB_DATA } = require("./job-data");

const CLOUD_COLLECTION = "countyProfiles";

const CITY_INFRA = {
  拉萨市: {
    urbanCenter: "拉萨主城区",
    airport: "拉萨贡嘎国际机场",
    network: "青藏铁路、拉林铁路与拉萨都市圈公路网",
    description: "航空和铁路条件最成熟，适合作为藏中通达性的基准面。"
  },
  日喀则市: {
    urbanCenter: "桑珠孜主城区",
    airport: "日喀则和平机场",
    network: "拉日铁路、318国道与机场公路",
    description: "东部县区与主城区联系更强，西部边境县通常更依赖长距离公路。"
  },
  山南市: {
    urbanCenter: "乃东主城区",
    airport: "拉萨贡嘎国际机场",
    network: "拉林铁路、泽贡高等级公路与山南干线",
    description: "沿雅鲁藏布江谷地的县区通达性更好，南部边境县距离拉长。"
  },
  林芝市: {
    urbanCenter: "八一主城区",
    airport: "林芝米林机场",
    network: "拉林铁路、拉林高等级公路与318国道林芝段",
    description: "整体海拔较低，谷地县区与机场联系较顺，边境山区县受地形影响更明显。"
  },
  昌都市: {
    urbanCenter: "卡若主城区",
    airport: "昌都邦达机场",
    network: "317、318国道与横向山谷公路",
    description: "航空门户明确，但多数县仍以长距离公路换乘为主。"
  },
  那曲市: {
    urbanCenter: "色尼主城区",
    airport: "航空多经拉萨中转",
    network: "青藏铁路、青藏公路与109国道",
    description: "铁路和国道是核心走廊，羌塘腹地县区与主城区距离普遍较长。"
  },
  阿里地区: {
    urbanCenter: "狮泉河城区",
    airport: "阿里昆莎机场",
    network: "219国道、阿里机场通道与跨县长距离公路",
    description: "机场对噶尔县支撑明显，其他县通常需要较长时间公路接驳。"
  }
};

const CITY_ACCESS_OVERRIDES = {
  巴宜区: "县城就在林芝八一主城区，可视为市区内通勤。",
  米林市: "县城位于林芝东南走廊，前往八一主城区通常在 1 小时级别内。",
  工布江达县: "位于拉林交通轴线上，向林芝或拉萨方向出行都相对顺直。",
  城关区: "县级范围即拉萨核心城区，行政和商业资源最集中。",
  堆龙德庆区: "与拉萨主城区连片发展，进出市区便捷。",
  达孜区: "处于拉萨东向外缘，通勤距离短，公路联系紧密。",
  曲水县: "位于拉萨近郊通道，进出主城区较方便。",
  贡嘎县: "位于山南北部走廊，连接拉萨和山南都比较直接。",
  乃东区: "即山南主城区，核心公共服务最集中。",
  桑珠孜区: "即日喀则主城区，综合交通条件在本市最强。",
  卡若区: "即昌都主城区，但对各县辐射仍主要依赖公路。",
  色尼区: "即那曲主城区，是青藏铁路和公路主轴的重要节点。",
  噶尔县: "狮泉河城区就在县域内，是阿里地区综合保障最强的区域。"
};

const AIRPORT_ACCESS_OVERRIDES = {
  巴宜区: "靠近林芝米林机场服务圈，机场接驳在林芝属于较方便水平。",
  米林市: "林芝米林机场就在本市范围内，航空可达性最强。",
  城关区: "主要使用拉萨贡嘎国际机场，机场接驳成熟。",
  堆龙德庆区: "通过拉萨快速路网前往贡嘎机场较方便。",
  达孜区: "前往拉萨贡嘎国际机场较便捷，适合以航空作为主要外联方式。",
  贡嘎县: "拉萨贡嘎国际机场位于本县，是山南北部最强航空节点。",
  乃东区: "依托贡嘎机场，航空换乘效率在山南靠前。",
  桑珠孜区: "离日喀则和平机场最近的一档，航班接驳相对直接。",
  江孜县: "前往日喀则和平机场仍属可接受接驳半径。",
  卡若区: "需经公路前往昌都邦达机场，机场位置明确但接驳距离不短。",
  噶尔县: "阿里昆莎机场是本地最直接的航空门户。",
  札达县: "前往阿里昆莎机场需明显公路接驳，适合作为补充交通而非高频通勤。",
  普兰县: "距阿里昆莎机场较远，跨县出行更多依赖长距离公路。"
};

const REMOTE_COUNTIES = new Set([
  "墨脱县",
  "察隅县",
  "洛扎县",
  "隆子县",
  "错那市",
  "吉隆县",
  "聂拉木县",
  "仲巴县",
  "萨嘎县",
  "普兰县",
  "札达县",
  "日土县",
  "革吉县",
  "措勤县",
  "双湖县",
  "尼玛县",
  "申扎县",
  "班戈县",
  "改则县"
]);

const BORDER_COUNTIES = new Set([
  "察隅县",
  "墨脱县",
  "洛扎县",
  "隆子县",
  "错那市",
  "岗巴县",
  "定日县",
  "吉隆县",
  "聂拉木县",
  "亚东县",
  "普兰县",
  "日土县",
  "札达县"
]);

const COUNTY_TO_CITY = {
  拉萨市: "拉萨市",
  城关区: "拉萨市",
  堆龙德庆区: "拉萨市",
  达孜区: "拉萨市",
  墨竹工卡县: "拉萨市",
  林周县: "拉萨市",
  尼木县: "拉萨市",
  当雄县: "拉萨市",
  曲水县: "拉萨市",
  日喀则市: "日喀则市",
  桑珠孜区: "日喀则市",
  江孜县: "日喀则市",
  定日县: "日喀则市",
  萨迦县: "日喀则市",
  拉孜县: "日喀则市",
  白朗县: "日喀则市",
  仁布县: "日喀则市",
  康马县: "日喀则市",
  亚东县: "日喀则市",
  吉隆县: "日喀则市",
  聂拉木县: "日喀则市",
  山南市: "山南市",
  乃东区: "山南市",
  扎囊县: "山南市",
  贡嘎县: "山南市",
  桑日县: "山南市",
  琼结县: "山南市",
  浪卡子县: "山南市",
  错那市: "山南市",
  隆子县: "山南市",
  林芝市: "林芝市",
  巴宜区: "林芝市",
  工布江达县: "林芝市",
  米林市: "林芝市",
  墨脱县: "林芝市",
  波密县: "林芝市",
  察隅县: "林芝市",
  朗县: "林芝市",
  昌都市: "昌都市",
  卡若区: "昌都市",
  江达县: "昌都市",
  贡觉县: "昌都市",
  类乌齐县: "昌都市",
  丁青县: "昌都市",
  察雅县: "昌都市",
  八宿县: "昌都市",
  左贡县: "昌都市",
  芒康县: "昌都市",
  洛隆县: "昌都市",
  边坝县: "昌都市",
  那曲市: "那曲市",
  色尼区: "那曲市",
  嘉黎县: "那曲市",
  比如县: "那曲市",
  聂荣县: "那曲市",
  安多县: "那曲市",
  申扎县: "那曲市",
  索县: "那曲市",
  班戈县: "那曲市",
  巴青县: "那曲市",
  尼玛县: "那曲市",
  双湖县: "那曲市",
  阿里地区: "阿里地区",
  噶尔县: "阿里地区",
  普兰县: "阿里地区",
  札达县: "阿里地区",
  日土县: "阿里地区",
  革吉县: "阿里地区",
  改则县: "阿里地区",
  措勤县: "阿里地区"
};

const PLACE_MAP = {};
const ALIAS_MAP = {};

PLACE_DATA.forEach((item) => {
  PLACE_MAP[item.name] = item;
  item.aliases.forEach((alias) => {
    ALIAS_MAP[alias] = item.name;
  });
});

const SORTED_ALIASES = Object.keys(ALIAS_MAP).sort((a, b) => b.length - a.length);

let memoryCache = null;

const splitInput = (text) =>
  String(text || "")
    .split(/[\s,，、；;]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const parseHours = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Number(value.toFixed(2));
  }

  if (typeof value !== "string") {
    return null;
  }

  if (!value || value === "0") {
    return 0;
  }

  const matched = value.match(/^(\d+):(\d{2})(?::(\d{2}))?/);
  if (!matched) {
    return null;
  }

  const hours = Number(matched[1]);
  const minutes = Number(matched[2]);
  return Number((hours + minutes / 60).toFixed(2));
};

const normalizeJobInfo = (jobInfo) => {
  if (!jobInfo) {
    return null;
  }

  const normalizedTowns = (jobInfo.towns || []).map((town) => ({
    ...town,
    travelHours: parseHours(town.distance)
  }));

  return {
    ...jobInfo,
    avgDistanceHours: parseHours(jobInfo.avgDistanceHours),
    maxDistanceHours: parseHours(jobInfo.maxDistanceHours),
    towns: normalizedTowns
  };
};

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

  const source = String(text || "");
  const occupied = new Array(source.length).fill(false);

  SORTED_ALIASES.forEach((alias) => {
    let start = 0;
    while (start < source.length) {
      const index = source.indexOf(alias, start);
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
        for (let cursor = index; cursor < end; cursor += 1) {
          occupied[cursor] = true;
        }
      }
      start = index + 1;
    }
  });

  return matched;
};

const inferCity = (name, jobInfo) => {
  if (jobInfo && jobInfo.city) {
    return jobInfo.city;
  }

  return COUNTY_TO_CITY[name] || "";
};

const inferCityAccess = (name, city, transport, jobInfo) => {
  if (CITY_ACCESS_OVERRIDES[name]) {
    return CITY_ACCESS_OVERRIDES[name];
  }

  if (jobInfo && typeof jobInfo.avgDistanceHours === "number") {
    if (jobInfo.avgDistanceHours <= 0.8) {
      return `县域内部路程普遍在 1 小时内，进出 ${city || "区域中心"} 的综合感受偏近。`;
    }

    if (jobInfo.avgDistanceHours <= 1.5) {
      return `县域内部通行多在 1 到 2 小时级别，距 ${city || "区域中心"} 不算最远，但也不是核心近郊。`;
    }

    if (jobInfo.avgDistanceHours <= 2.5) {
      return `乡镇分布较分散，前往 ${city || "区域中心"} 的整体时间成本偏高。`;
    }
  }

  if (transport >= 4) {
    return `${city || "该地区"} 主通道条件较成熟，通常能保持中等偏上的进城效率。`;
  }

  if (REMOTE_COUNTIES.has(name)) {
    return `属于远离主城区的县域，进出 ${city || "区域中心"} 主要依赖长距离公路。`;
  }

  return `相较本地核心城区不算最近，日常跨县或进城更依赖连续公路通行。`;
};

const inferAirportAccess = (name, city, transport, jobInfo) => {
  if (AIRPORT_ACCESS_OVERRIDES[name]) {
    return AIRPORT_ACCESS_OVERRIDES[name];
  }

  const infra = CITY_INFRA[city];
  if (!infra) {
    return "暂无稳定机场接驳结论。";
  }

  if (infra.airport === "航空多经拉萨中转") {
    if (name === "安多县" || name === "色尼区") {
      return "铁路和国道价值高于航空，远途飞行通常还是经拉萨换乘。";
    }
    return "本地航空依赖跨地市中转，机场便利度明显弱于藏中和林芝。";
  }

  if (REMOTE_COUNTIES.has(name)) {
    return `名义上使用${infra.airport}，但县城到机场往往仍需较长时间公路接驳。`;
  }

  if (transport >= 4) {
    return `依托 ${infra.airport}，航空出行处于本地较方便的一档。`;
  }

  return `可通过 ${infra.airport} 出入藏，但通常仍需要一定公路换乘时间。`;
};

const inferTransportLevel = (name, transport, jobInfo) => {
  let score = transport * 20;

  if (jobInfo && typeof jobInfo.avgDistanceHours === "number") {
    score += Math.max(0, 24 - jobInfo.avgDistanceHours * 8);
  }

  if (jobInfo && jobInfo.tags && jobInfo.tags.includes("机场")) {
    score += 6;
  }

  if (name === "贡嘎县" || name === "米林市") {
    score += 8;
  }

  if (REMOTE_COUNTIES.has(name)) {
    score -= 18;
  }

  if (BORDER_COUNTIES.has(name)) {
    score -= 8;
  }

  if (score >= 82) {
    return "高";
  }

  if (score >= 62) {
    return "较高";
  }

  if (score >= 42) {
    return "中等";
  }

  return "偏弱";
};

const buildRiskFlags = (name, elevation, transport, jobInfo) => {
  const flags = [];

  if (elevation >= 4300) {
    flags.push("高海拔");
  } else if (elevation >= 3900) {
    flags.push("海拔偏高");
  }

  if (REMOTE_COUNTIES.has(name)) {
    flags.push("偏远");
  }

  if (BORDER_COUNTIES.has(name)) {
    flags.push("边境");
  }

  if (jobInfo && typeof jobInfo.maxDistanceHours === "number" && jobInfo.maxDistanceHours >= 4) {
    flags.push("乡镇分散");
  }

  if (transport <= 1) {
    flags.push("交通较弱");
  }

  return flags;
};

const buildTransportSummary = (name, city, transportLevel, infra) => {
  const cityName = city || "所在区域";
  const network = infra ? infra.network : "公路网络";
  return `${name}在${cityName}的综合交通便利度评估为${transportLevel}，主要依托${network}。`;
};

const buildProfile = (name) => {
  const place = PLACE_MAP[name];
  if (!place) {
    return null;
  }

  const jobInfo = normalizeJobInfo(JOB_DATA[name] || null);
  const city = inferCity(name, jobInfo);
  const infra = CITY_INFRA[city] || null;
  const baseScore = Number((((5000 - place.elevation) / 1000) + place.transport).toFixed(2));
  const transportLevel = inferTransportLevel(name, place.transport, jobInfo);
  const cityAccess = inferCityAccess(name, city, place.transport, jobInfo);
  const airportAccess = inferAirportAccess(name, city, place.transport, jobInfo);
  const riskFlags = buildRiskFlags(name, place.elevation, place.transport, jobInfo);

  return {
    _id: name,
    name,
    aliases: place.aliases,
    city,
    elevation: place.elevation,
    transport: place.transport,
    baseScore,
    convenienceLevel: transportLevel,
    nearestAirport: infra ? infra.airport : "暂无",
    cityCenter: infra ? infra.urbanCenter : "",
    cityAccess,
    airportAccess,
    transportSummary: buildTransportSummary(name, city, transportLevel, infra),
    transportNetwork: infra ? infra.network : "",
    transportContext: infra ? infra.description : "",
    jobInfo,
    riskFlags,
    sourceMode: "local-fallback"
  };
};

const buildLocalProfiles = () =>
  PLACE_DATA.map((item) => buildProfile(item.name))
    .filter(Boolean)
    .sort((a, b) => {
      if (a.city !== b.city) {
        return String(a.city).localeCompare(String(b.city), "zh-Hans-CN");
      }
      return b.baseScore - a.baseScore;
    });

const getLocalProfiles = () => {
  if (!memoryCache) {
    memoryCache = buildLocalProfiles();
  }
  return memoryCache.slice();
};

const fetchFromCloud = () =>
  new Promise((resolve, reject) => {
    if (typeof wx === "undefined" || !wx.cloud || !wx.cloud.database) {
      reject(new Error("cloud unavailable"));
      return;
    }

    const db = wx.cloud.database();
    db.collection(CLOUD_COLLECTION)
      .limit(100)
      .get()
      .then(({ data }) => {
        if (!Array.isArray(data) || !data.length) {
          reject(new Error("empty cloud collection"));
          return;
        }

        resolve(
          data.map((item) => ({
            ...item,
            sourceMode: "cloud"
          }))
        );
      })
      .catch(reject);
  });

const getCountyProfiles = async (forceRefresh = false) => {
  if (!forceRefresh && memoryCache) {
    return getLocalProfiles();
  }

  try {
    const cloudData = await fetchFromCloud();
    memoryCache = cloudData;
    return cloudData.slice();
  } catch (error) {
    memoryCache = buildLocalProfiles();
    return memoryCache.slice();
  }
};

const buildSearchHaystack = (profile) => {
  const fields = [
    profile.name,
    ...(profile.aliases || []),
    profile.city,
    profile.cityCenter,
    profile.nearestAirport,
    profile.cityAccess,
    profile.airportAccess,
    profile.transportSummary,
    profile.transportNetwork,
    profile.transportContext,
    ...(profile.riskFlags || [])
  ];

  if (profile.jobInfo) {
    fields.push(profile.jobInfo.seat || "");
    fields.push(profile.jobInfo.intro || "");
    (profile.jobInfo.tags || []).forEach((tag) => fields.push(tag));
    (profile.jobInfo.towns || []).forEach((town) => {
      fields.push(town.name || "");
      fields.push(town.position || "");
      fields.push(town.note || "");
      fields.push(town.description || "");
    });
  }

  return fields.join(" ").toLowerCase();
};

const searchCountyProfiles = (profiles, keyword) => {
  const query = String(keyword || "").trim().toLowerCase();
  if (!query) {
    return [];
  }

  return profiles
    .map((profile) => {
      const haystack = buildSearchHaystack(profile);
      if (!haystack.includes(query)) {
        return null;
      }

      let rank = 0;
      if (profile.name.toLowerCase() === query) rank += 120;
      if ((profile.aliases || []).some((alias) => alias.toLowerCase() === query)) rank += 100;
      if (profile.name.toLowerCase().includes(query)) rank += 60;
      if ((profile.city || "").toLowerCase().includes(query)) rank += 24;
      if ((profile.nearestAirport || "").toLowerCase().includes(query)) rank += 18;
      if ((profile.transportSummary || "").toLowerCase().includes(query)) rank += 12;

      return {
        ...profile,
        rank
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.rank !== a.rank) {
        return b.rank - a.rank;
      }
      return b.baseScore - a.baseScore;
    })
    .slice(0, 12);
};

const recognizeCountyNames = (text) => extractLocations(text);

const compareCountyProfiles = (profiles, text) => {
  const recognized = recognizeCountyNames(text);
  const resultMap = {};

  profiles.forEach((profile) => {
    resultMap[profile.name] = profile;
  });

  const results = recognized
    .map((name) => resultMap[name] || null)
    .filter(Boolean)
    .sort((a, b) => {
      const weight = { 高: 4, 较高: 3, 中等: 2, 偏弱: 1 };
      if (weight[b.convenienceLevel] !== weight[a.convenienceLevel]) {
        return weight[b.convenienceLevel] - weight[a.convenienceLevel];
      }
      return b.baseScore - a.baseScore;
    });

  return {
    recognized,
    results
  };
};

const getProfilesByNames = (profiles, names) => {
  const nameSet = new Set(names);
  return profiles.filter((profile) => nameSet.has(profile.name));
};

module.exports = {
  CLOUD_COLLECTION,
  compareCountyProfiles,
  getCountyProfiles,
  getLocalProfiles,
  getProfilesByNames,
  recognizeCountyNames,
  searchCountyProfiles
};
