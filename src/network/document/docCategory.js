import { common } from "../request";

function getDocCategoryList() {
  return common({
    method: "get",
    url: "/docCategory/getCategoryList",
  });
}

function updateDocCategory(id, newName) {
  return common({
    method: "post",
    url: `/docCategory/updateCategory/${id}/${newName}`,
  });
}

function addDocCategory(name) {
  return common({
    method: "post",
    url: `/docCategory/addCategory/${name}`,
  });
}

function deleteDocCategory(id) {
  return common({
    method: "post",
    url: `/docCategory/deleteCategory/${id}`,
  });
}

function queryDocCategory(id) {
  return common({
    method: "post",
    url: `/docCategory/queryCategory/${id}`,
  });
}

export default {
  getDocCategoryList,
  updateDocCategory,
  addDocCategory,
  deleteDocCategory,
  queryDocCategory,
};
