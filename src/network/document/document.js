import { common } from "../request";

function getDocumentList() {
  return common({
    method: "get",
    url: "/article/getArticleList",
  });
}

function addDocument(form) {
  return common({
    method: "post",
    url: "/article/addArticle",
    data: form,
  });
}

function getDocument(id) {
  return common({
    method: "get",
    url: `/article/getArticle/${id}`,
  });
}

function deleteDocument(id) {
  return common({
    methods: "get",
    url: `/article/deleteArticle/${id}`,
  });
}

function updateDocument(form) {
  return common({
    method: "post",
    url: "/article/updateArticle",
    data: form,
  });
}

function publishDocument(id) {
  return common({
    method: "post",
    url: `/article/publishArticle/${id}`,
  });
}

function withdrawDocument(id) {
  return common({
    method: "get",
    url: `/article/withdrawArticle/${id}`,
  });
}

export default {
  getDocumentList,
  getDocument,
  addDocument,
  deleteDocument,
  updateDocument,
  publishDocument,
  withdrawDocument,
};
