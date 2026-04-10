const { getCountyProfiles, getProfilesByNames } = require("../../utils/county-repository");
const {
  clearCompareNames,
  clearFavoriteNames,
  getCompareNames,
  getFavoriteNames,
  toggleCompareName,
  toggleFavoriteName
} = require("../../utils/county-state");

const decorateLists = (profiles) => {
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
    favoriteList: [],
    compareList: []
  },

  onShow() {
    this.loadLists();
  },

  async loadLists() {
    const profiles = await getCountyProfiles();
    const favoriteList = decorateLists(getProfilesByNames(profiles, getFavoriteNames()));
    const compareList = decorateLists(getProfilesByNames(profiles, getCompareNames()));
    this.setData({
      favoriteList,
      compareList
    });
  },

  toggleFavorite(event) {
    const { name } = event.currentTarget.dataset;
    toggleFavoriteName(name);
    this.loadLists();
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

    this.loadLists();
  },

  clearFavorites() {
    clearFavoriteNames();
    this.loadLists();
  },

  clearComparePool() {
    clearCompareNames();
    this.loadLists();
  }
});
