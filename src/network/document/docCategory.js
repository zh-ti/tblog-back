import { common } from "../request";

function getDocCategoryList() {
  return common({
    method: "get",
    url: "/articleCategory/getCategoryList",
  });
}

function updateDocCategory(id, newName) {
  return common({
    method: "post",
    url: `/articleCategory/updateCategory/${id}/${newName}`,
  });
}

function addDocCategory(name) {
  return common({
    method: "post",
    url: `/articleCategory/addCategory/${name}`,
  });
}

function deleteDocCategory(id) {
  return common({
    method: "post",
    url: `/articleCategory/deleteCategory/${id}`,
  });
}

function queryDocCategory(id) {
  return common({
    method: "post",
    url: `/articleCategory/queryCategory/${id}`,
  });
}

export {
  getDocCategoryList,
  updateDocCategory,
  addDocCategory,
  deleteDocCategory,
  queryDocCategory,
};
