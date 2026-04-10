const { compareCountyProfiles, getCountyProfiles, getProfilesByNames } = require("../../utils/county-repository");
const { clearCompareNames, getCompareNames, setCompareNames, toggleCompareName } = require("../../utils/county-state");

const decorateProfiles = (profiles) => {
  const compareNames = getCompareNames();
  return profiles.map((item) => ({
    ...item,
    isCompared: compareNames.includes(item.name)
  }));
};

Page({
  data: {
    allProfiles: [],
    inputText: "",
    recognized: [],
    results: [],
    comparePool: [],
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
      inputText: "米林市、巴宜区、贡嘎县、桑珠孜区"
    });
  },

  clearInput() {
    this.setData({
      inputText: "",
      recognized: [],
      results: [],
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
        errorMessage: "没有识别到有效区县，请检查名称是否在当前数据中。"
      });
      return;
    }

    this.setData({
      recognized,
      results: decorateProfiles(results),
      errorMessage: ""
    });
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
        this.setData({
          results: decorateProfiles(this.data.results)
        });
      }
    });
  },

  useComparePool() {
    const compareNames = getCompareNames();
    if (!compareNames.length) {
      wx.showToast({
        title: "对比池还没有区县",
        icon: "none"
      });
      return;
    }

    const inputText = compareNames.join("、");
    const { recognized, results } = compareCountyProfiles(this.data.allProfiles, inputText);
    this.setData({
      inputText,
      recognized,
      results: decorateProfiles(results),
      errorMessage: ""
    });
  },

  clearComparePool() {
    clearCompareNames();
    this.loadProfiles();
  }
});
