module.exports = [
  // {
  //   method: "GET",
  //   path: "/",
  //   handler: "aiFiller.index",
  //   config: {
  //     policies: [],
  //   },
  // },
  {
    method: "GET",
    path: "/fill-data",
    handler: "aiFiller.fillData",
    config: {
      policies: [],
    },
  },
];
