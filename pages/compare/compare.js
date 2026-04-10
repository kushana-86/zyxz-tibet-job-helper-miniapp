const { compareCountyProfiles, getCountyProfiles, getProfilesByNames } = require("../../utils/county-repository");
const { clearCompareNames, getCompareNames, toggleCompareName } = require("../../utils/county-state");

const clampScore = (value) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Number(value.toFixed(1))));
};

const getAltitudeScore = (item) => clampScore(100 - Math.max(0, item.elevation - 2800) / 20);

const getTransportScore = (item) => {
  let score = item.transport * 18 + (item.baseScore || 0) * 4;
  if (item.transport >= 4) score += 8;
  if (item.transport <= 1) score -= 8;
  return clampScore(score);
};

const getWorkRadiusScore = (item) => {
  if (!item.jobInfo || typeof item.jobInfo.avgDistanceHours !== "number") {
    return 55;
  }

  const avgScore = 100 - item.jobInfo.avgDistanceHours * 26;
  const maxHours = typeof item.jobInfo.maxDistanceHours === "number" ? item.jobInfo.maxDistanceHours : item.jobInfo.avgDistanceHours;
  const maxScore = 100 - maxHours * 10;
  return clampScore(avgScore * 0.75 + maxScore * 0.25);
};

const getStabilityScore = (item) => {
  let score = 86;
  (item.riskFlags || []).forEach((flag) => {
    if (flag === "高海拔") score -= 18;
    if (flag === "海拔偏高") score -= 10;
    if (flag === "偏远") score -= 16;
    if (flag === "边境") score -= 12;
    if (flag === "乡镇分散") score -= 10;
    if (flag === "交通较弱") score -= 16;
  });
  return clampScore(score);
};

const buildMetrics = (item) => {
  const altitudeScore = getAltitudeScore(item);
  const transportScore = getTransportScore(item);
  const workRadiusScore = getWorkRadiusScore(item);
  const stabilityScore = getStabilityScore(item);
  const decisionScore = clampScore(
    altitudeScore * 0.28 + transportScore * 0.34 + workRadiusScore * 0.18 + stabilityScore * 0.2
  );

  return {
    altitudeScore,
    transportScore,
    workRadiusScore,
    stabilityScore,
    decisionScore
  };
};

const metricDefs = [
  { key: "decisionScore", label: "综合适宜度" },
  { key: "transportScore", label: "通达效率" },
  { key: "altitudeScore", label: "海拔友好度" },
  { key: "workRadiusScore", label: "工作半径" },
  { key: "stabilityScore", label: "稳定性" }
];

const getBestNamesByMetric = (results, key) => {
  if (!results.length) return [];
  const max = Math.max(...results.map((item) => item.metrics[key]));
  return results.filter((item) => item.metrics[key] === max).map((item) => item.name);
};

const buildDecisionTags = (metrics) => {
  const tags = [];
  if (metrics.transportScore >= 80) tags.push("通达性强");
  if (metrics.altitudeScore >= 75) tags.push("海拔更友好");
  if (metrics.workRadiusScore >= 70) tags.push("工作半径小");
  if (metrics.stabilityScore >= 70) tags.push("稳定性较好");
  if (metrics.transportScore <= 45) tags.push("通行成本高");
  if (metrics.altitudeScore <= 45) tags.push("海拔压力大");
  if (metrics.workRadiusScore <= 45) tags.push("跑点范围大");
  if (metrics.stabilityScore <= 45) tags.push("风险因素多");
  return tags.slice(0, 4);
};

const buildDecisionSummary = (metrics) => {
  const lines = [];

  if (metrics.transportScore >= 80) {
    lines.push("对外出行更省时间，多个区县之间做快选时更占优");
  } else if (metrics.transportScore <= 45) {
    lines.push("对外通达性偏弱，来回折腾的时间成本要单独算");
  }

  if (metrics.altitudeScore >= 75) {
    lines.push("海拔压力相对更小，适应门槛更低");
  } else if (metrics.altitudeScore <= 45) {
    lines.push("海拔偏高，舒适度与身体适应成本要重点关注");
  }

  if (metrics.workRadiusScore >= 70) {
    lines.push("县域内部跑点半径更友好，日常通勤更省力");
  } else if (metrics.workRadiusScore <= 45) {
    lines.push("乡镇分布更散，长期跑动的精力消耗会更明显");
  }

  if (metrics.stabilityScore <= 45) {
    lines.push("偏远或边境等因素较多，决策时不适合只看单一优点");
  }

  return lines.slice(0, 3);
};

const buildAdvice = (metrics) => {
  if (metrics.decisionScore >= 78) {
    return "建议优先保留在第一梯队。";
  }

  if (metrics.decisionScore >= 62) {
    return "整体比较均衡，适合做稳妥备选。";
  }

  return "更适合在你有明确偏好时再考虑。";
};

const decorateProfiles = (profiles) => {
  const compareNames = getCompareNames();
  return profiles.map((item) => ({
    ...item,
    isCompared: compareNames.includes(item.name)
  }));
};

const decorateComparisonResults = (profiles) => {
  const base = profiles
    .map((item) => ({
      ...item,
      metrics: buildMetrics(item)
    }))
    .sort((a, b) => {
      if (b.metrics.decisionScore !== a.metrics.decisionScore) {
        return b.metrics.decisionScore - a.metrics.decisionScore;
      }
      if (b.metrics.transportScore !== a.metrics.transportScore) {
        return b.metrics.transportScore - a.metrics.transportScore;
      }
      return b.baseScore - a.baseScore;
    });

  const bestByMetric = metricDefs.reduce((acc, metric) => {
    acc[metric.key] = getBestNamesByMetric(base, metric.key);
    return acc;
  }, {});

  return base.map((item, index) => {
    const highlights = [];
    if (bestByMetric.decisionScore.includes(item.name)) highlights.push("综合最优");
    if (bestByMetric.transportScore.includes(item.name)) highlights.push("通达性最佳");
    if (bestByMetric.altitudeScore.includes(item.name)) highlights.push("海拔更友好");
    if (bestByMetric.workRadiusScore.includes(item.name)) highlights.push("工作半径更小");
    if (bestByMetric.stabilityScore.includes(item.name)) highlights.push("稳定性更好");

    return {
      ...item,
      rank: index + 1,
      highlights: highlights.slice(0, 3),
      decisionTags: buildDecisionTags(item.metrics),
      decisionSummary: buildDecisionSummary(item.metrics),
      decisionAdvice: buildAdvice(item.metrics),
      scoreItems: [
        { label: "通达效率", value: item.metrics.transportScore },
        { label: "海拔友好度", value: item.metrics.altitudeScore },
        { label: "工作半径", value: item.metrics.workRadiusScore },
        { label: "稳定性", value: item.metrics.stabilityScore }
      ]
    };
  });
};

const buildSummary = (results) => {
  if (!results.length) {
    return null;
  }

  const top = results[0];
  return {
    topName: top.name,
    topAdvice: top.decisionAdvice,
    metricWinners: [
      { label: "综合适宜度", names: getBestNamesByMetric(results, "decisionScore").join("、") },
      { label: "通达效率", names: getBestNamesByMetric(results, "transportScore").join("、") },
      { label: "海拔友好度", names: getBestNamesByMetric(results, "altitudeScore").join("、") },
      { label: "工作半径", names: getBestNamesByMetric(results, "workRadiusScore").join("、") },
      { label: "稳定性", names: getBestNamesByMetric(results, "stabilityScore").join("、") }
    ],
    comparisonRows: [
      {
        label: "综合适宜度",
        values: results.map((item) => `${item.name} ${item.metrics.decisionScore}`)
      },
      {
        label: "通达效率",
        values: results.map((item) => `${item.name} ${item.metrics.transportScore}`)
      },
      {
        label: "海拔友好度",
        values: results.map((item) => `${item.name} ${item.metrics.altitudeScore}`)
      },
      {
        label: "工作半径",
        values: results.map((item) => `${item.name} ${item.metrics.workRadiusScore}`)
      },
      {
        label: "稳定性",
        values: results.map((item) => `${item.name} ${item.metrics.stabilityScore}`)
      }
    ]
  };
};

Page({
  data: {
    allProfiles: [],
    inputText: "",
    recognized: [],
    results: [],
    comparePool: [],
    summary: null,
    errorMessage: ""
  },

  onShow() {
    this.loadProfiles();
  },

  async loadProfiles() {
    const profiles = await getCountyProfiles();
    const comparePool = decorateProfiles(getProfilesByNames(profiles, getCompareNames()));
    this.setData({
      allProfiles: profiles,
      comparePool
    });
  },

  onInputChange(event) {
    this.setData({
      inputText: event.detail.value,
      errorMessage: ""
    });
  },

  fillSample() {
    this.setData({
      inputText: "米林市、巴宜区、贡嘎县"
    });
  },

  clearInput() {
    this.setData({
      inputText: "",
      recognized: [],
      results: [],
      summary: null,
      errorMessage: ""
    });
  },

  applyComparison(recognized, rawResults) {
    const results = decorateComparisonResults(decorateProfiles(rawResults));
    this.setData({
      recognized,
      results,
      summary: buildSummary(results),
      errorMessage: ""
    });
  },

  handleCompare() {
    const text = this.data.inputText.trim();
    if (!text) {
      this.setData({
        errorMessage: "请先输入至少一个区县名称。"
      });
      return;
    }

    const { recognized, results } = compareCountyProfiles(this.data.allProfiles, text);
    if (!recognized.length) {
      this.setData({
        recognized: [],
        results: [],
        summary: null,
        errorMessage: "没有识别到有效区县，请检查名称是否在当前数据中。"
      });
      return;
    }

    this.applyComparison(recognized, results);
  },

  toggleComparePool(event) {
    const { name } = event.currentTarget.dataset;
    const action = toggleCompareName(name, 3);
    if (action.action === "limit") {
      wx.showToast({
        title: "最多加入 3 个区县",
        icon: "none"
      });
      return;
    }

    this.loadProfiles().then(() => {
      if (this.data.results.length) {
        const results = decorateComparisonResults(decorateProfiles(this.data.results));
        this.setData({
          results,
          summary: buildSummary(results)
        });
      }
    });
  },

  useComparePool() {
    const compareNames = getCompareNames();
    if (!compareNames.length) {
      wx.showToast({
        title: "对比池里还没有区县",
        icon: "none"
      });
      return;
    }

    const inputText = compareNames.join("、");
    const { recognized, results } = compareCountyProfiles(this.data.allProfiles, inputText);
    this.setData({ inputText });
    this.applyComparison(recognized, results);
  },

  clearComparePool() {
    clearCompareNames();
    this.loadProfiles().then(() => {
      if (this.data.results.length) {
        const results = decorateComparisonResults(decorateProfiles(this.data.results));
        this.setData({
          results,
          summary: buildSummary(results)
        });
      }
    });
  }
});
