import { common } from "../request";

function getDocumentList() {
  return common({
    method: "get",
    url: "/document/getDocumentList",
  });
}

function addDocument(form) {
  return common({
    method: "post",
    url: "/document/addDocument",
    data: JSON.stringify(form),
  });
}

function getDocument(id) {
  return common({
    method: "get",
    url: `/document/getDocument/${id}`,
  });
}

function deleteDocument(id) {
  return common({
    methods: "get",
    url: `/document/deleteDocument/${id}`,
  });
}

function updateDocument(form) {
  return common({
    method: "post",
    url: "/document/updateDocument",
    data: JSON.stringify(form),
  });
}

function publishDocument(form) {
  return common({
    method: "post",
    url: "/document/publishDocument",
    data: JSON.stringify(form),
  });
}

function withdrawDocument(id) {
  return common({
    method: "get",
    url: `/document/withdrawDocument/${id}`,
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
