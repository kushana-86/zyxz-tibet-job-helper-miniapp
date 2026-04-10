const FAVORITES_KEY = "countyFavorites";
const COMPARE_KEY = "countyComparePool";

const readList = (key) => {
  try {
    const value = wx.getStorageSync(key);
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
};

const writeList = (key, list) => {
  wx.setStorageSync(key, list);
};

const toggleListItem = (key, name, limit) => {
  const current = readList(key);
  if (current.includes(name)) {
    const next = current.filter((item) => item !== name);
    writeList(key, next);
    return {
      changed: true,
      list: next,
      action: "removed"
    };
  }

  if (typeof limit === "number" && current.length >= limit) {
    return {
      changed: false,
      list: current,
      action: "limit"
    };
  }

  const next = current.concat(name);
  writeList(key, next);
  return {
    changed: true,
    list: next,
    action: "added"
  };
};

const getFavoriteNames = () => readList(FAVORITES_KEY);
const getCompareNames = () => readList(COMPARE_KEY);

const toggleFavoriteName = (name) => toggleListItem(FAVORITES_KEY, name);
const toggleCompareName = (name, limit = 3) => toggleListItem(COMPARE_KEY, name, limit);

const setCompareNames = (names) => writeList(COMPARE_KEY, names);
const clearCompareNames = () => writeList(COMPARE_KEY, []);
const clearFavoriteNames = () => writeList(FAVORITES_KEY, []);

module.exports = {
  clearCompareNames,
  clearFavoriteNames,
  getCompareNames,
  getFavoriteNames,
  setCompareNames,
  toggleCompareName,
  toggleFavoriteName
};
