import Cookie from "js-cookie";

function set(name, value, activeTime) {
  Cookie.set(name, JSON.stringify(value), {
    expires: activeTime,
  });
}

function get(name) {
  const json = Cookie.get(name);
  if (!json) return null;
  return JSON.parse(json);
}

function remove(name) {
  return Cookie.remove(name);
}

export default {
  get,
  set,
  remove,
};
