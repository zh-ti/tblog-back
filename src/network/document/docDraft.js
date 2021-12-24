import { common } from "../request";

const getUnpublishedDocList = function () {
  return common({
    url: "/document/getUnpublishedDocList",
  });
};

export default {
  getUnpublishedDocList,
};
