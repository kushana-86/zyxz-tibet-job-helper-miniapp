App({
  onLaunch() {
    if (!wx.cloud) {
      return;
    }

    try {
      wx.cloud.init({
        traceUser: true
      });
    } catch (error) {
      console.warn("cloud init failed", error);
    }
  }
});
