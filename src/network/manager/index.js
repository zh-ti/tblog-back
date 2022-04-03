import { common } from "../request";

function login(form) {
  return common({
    method: "post",
    url: "/manager/login",
    data: form,
  });
}

function checkLogin(managerToken) {
  return common({
    method: "post",
    url: `/manager/checkLogin`,
    data: {
      managerToken: managerToken,
    },
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
    data: {
      name: form.name,
      password: form.password,
      position: form.position,
    },
  });
}
function deleteManager(id) {
  return common({
    method: "get",
    url: `/manager/delete/${id}`,
  });
}
function updateManager(form) {
  return common({
    method: "post",
    url: "/manager/update",
    data: {
      id: form.id,
      name: form.name,
      password: form.password,
      position: form.position,
    },
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

function getManagerInfo(sessionId) {
  return common({
    method: "post",
    url: `/manager/getManagerInfo/${sessionId}`,
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
  getManagerInfo,
};
