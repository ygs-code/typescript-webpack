
const key = 'loginInfo';

function setLoginInfo(loginInfo: Record<string, unknown>) {
    localStorage.setItem(key, JSON.stringify(loginInfo));
}

function getLoginInfo() {
    return JSON.parse(localStorage.getItem(key));
}

function removeLoginInfo() {
    localStorage.removeItem(key);
}

export { setLoginInfo, getLoginInfo, removeLoginInfo };