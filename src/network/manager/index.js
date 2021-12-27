import { common } from "../request";

function login(form) {
  return common({
    method: "post",
    url: "/manager/login",
    data: form,
  });
}

function checkLogin(account) {
  return common({
    method: "post",
    url: `/manager/checkLogin`,
    data: account,
  });
}

function getManagerList() {
  return common({
    method: "get",
    url: "/manager/getManagerList",
  });
}

function getManager(id) {
  return common({
    method: "get",
    url: `/manager/getManager/${id}`,
  });
}

function registerManager(form) {
  return common({
    method: "post",
    url: "/manager/register",
    data: JSON.stringify(form),
  });
}
function deleteManager(id) {
  return common({
    method: "get",
    url: `/manager/delete/${id}`,
  });
}
function updateManager(form) {
  console.log(form);
  return common({
    method: "post",
    url: "/manager/update",
    data: form,
  });
}

function verifyPassword(id, password) {
  return common({
    method: "post",
    url: "/manager/verifyPassword",
    data: {
      id,
      password,
    },
  });
}

export default {
  login,
  checkLogin,
  getManagerList,
  registerManager,
  deleteManager,
  updateManager,
  verifyPassword,
  getManager,
};
