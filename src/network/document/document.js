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

function uploadImage(formdata, type = 0, id = null) {
  return common({
    url: `/upload/uploadImage/${type}/${id}`,
    method: "post",
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

function deleteImage(url) {
  return common({
    url: `${url}/del`,
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
  uploadImage,
  deleteImage,
};
