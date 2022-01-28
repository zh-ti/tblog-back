import { common } from "../request";

function getUnpublishedDocList() {
  return common({
    url: "/document/getUnpublishedDocList",
  });
}

export default {
  getUnpublishedDocList,
};
