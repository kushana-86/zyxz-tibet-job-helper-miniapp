const { getCountyProfiles } = require("../../utils/county-repository");
const { getCompareNames, getFavoriteNames } = require("../../utils/county-state");

Page({
  data: {
    loading: true,
    sourceMode: "local-fallback",
    stats: null,
    featured: [],
    remoteFeatured: [],
    errorMessage: ""
  },

  onShow() {
    this.loadPage();
  },

  async loadPage() {
    try {
      const profiles = await getCountyProfiles();
      const favorites = getFavoriteNames();
      const compareNames = getCompareNames();
      const featured = profiles
        .filter((item) => item.convenienceLevel === "高" || item.convenienceLevel === "较高")
        .slice(0, 6)
        .map((item) => ({
          ...item,
          isFavorite: favorites.includes(item.name),
          isCompared: compareNames.includes(item.name)
        }));
      const remoteFeatured = profiles
        .filter((item) => item.riskFlags.includes("偏远") || item.riskFlags.includes("边境"))
        .slice(0, 4);

      this.setData({
        loading: false,
        sourceMode: profiles[0] ? profiles[0].sourceMode : "local-fallback",
        errorMessage: "",
        featured,
        remoteFeatured,
        stats: {
          countyCount: profiles.length,
          cityCount: Array.from(new Set(profiles.map((item) => item.city).filter(Boolean))).length,
          favoriteCount: favorites.length,
          compareCount: compareNames.length
        }
      });
    } catch (error) {
      this.setData({
        loading: false,
        errorMessage: "数据加载失败，请稍后重试。"
      });
    }
  }
});
