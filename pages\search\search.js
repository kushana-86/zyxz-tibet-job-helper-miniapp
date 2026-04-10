const { getCountyProfiles, searchCountyProfiles } = require("../../utils/county-repository");
const { getCompareNames, getFavoriteNames, toggleCompareName, toggleFavoriteName } = require("../../utils/county-state");

const decorateProfiles = (profiles) => {
  const favoriteNames = getFavoriteNames();
  const compareNames = getCompareNames();

  return profiles.map((item) => ({
    ...item,
    isFavorite: favoriteNames.includes(item.name),
    isCompared: compareNames.includes(item.name)
  }));
};

Page({
  data: {
    allProfiles: [],
    keyword: "",
    results: [],
    selected: null,
    sourceMode: "local-fallback",
    quickKeywords: ["机场", "拉萨", "林芝", "边境", "高海拔", "交通较弱"]
  },

  onShow() {
    this.loadProfiles();
  },

  async loadProfiles() {
    const profiles = await getCountyProfiles();
    const decorated = decorateProfiles(profiles);
    this.setData({
      allProfiles: decorated,
      sourceMode: decorated[0] ? decorated[0].sourceMode : "local-fallback"
    });
  },

  onKeywordChange(event) {
    const keyword = event.detail.value;
    const results = decorateProfiles(searchCountyProfiles(this.data.allProfiles, keyword));
    this.setData({
      keyword,
      results,
      selected: results.length === 1 ? results[0] : this.data.selected
    });
  },

  applyQuickKeyword(event) {
    const keyword = event.currentTarget.dataset.keyword;
    const results = decorateProfiles(searchCountyProfiles(this.data.allProfiles, keyword));
    this.setData({
      keyword,
      results,
      selected: results.length ? results[0] : null
    });
  },

  clearSearch() {
    this.setData({
      keyword: "",
      results: [],
      selected: null
    });
  },

  selectResult(event) {
    const { name } = event.currentTarget.dataset;
    const selected = this.data.results.find((item) => item.name === name) || null;
    this.setData({ selected });
  },

  toggleFavorite(event) {
    const { name } = event.currentTarget.dataset;
    toggleFavoriteName(name);
    this.loadProfiles().then(() => {
      if (this.data.keyword) {
        const results = decorateProfiles(searchCountyProfiles(this.data.allProfiles, this.data.keyword));
        const selected = results.find((item) => this.data.selected && item.name === this.data.selected.name) || this.data.selected;
        this.setData({ results, selected });
      }
    });
  },

  toggleCompare(event) {
    const { name } = event.currentTarget.dataset;
    const result = toggleCompareName(name, 3);
    if (result.action === "limit") {
      wx.showToast({
        title: "最多加入 3 个区县",
        icon: "none"
      });
      return;
    }

    this.loadProfiles().then(() => {
      if (this.data.keyword) {
        const results = decorateProfiles(searchCountyProfiles(this.data.allProfiles, this.data.keyword));
        const selected = results.find((item) => this.data.selected && item.name === this.data.selected.name) || this.data.selected;
        this.setData({ results, selected });
      }
    });
  }
});
