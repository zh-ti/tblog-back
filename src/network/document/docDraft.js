import { common } from "../request";

function getUnpublishedDocList() {
  return common({
    url: "/article/getUnpublishedArticleList",
  });
}

export default {
  getUnpublishedDocList,
};
