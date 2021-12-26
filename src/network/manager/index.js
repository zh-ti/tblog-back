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

export default {
  login,
  checkLogin,
};
