import User from "@/apis/User"

const cookieName = 'currentUser'
const tokenName = 'authToken'

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=')
        return parts[0] === name ? decodeURIComponent(parts[1]) : r
    }, '')
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

function storeToken(token) {
    if (!token) return;
    localStorage.setItem(tokenName, token);
    setCookie(tokenName, token, 7);
}

function clearToken() {
    localStorage.removeItem(tokenName);
    sessionStorage.removeItem(tokenName);
    deleteCookie(tokenName);
}

export const authenticate = async ({ commit }, { email, password }) => {
    const response = await User.login(email, password);
    const authData = response.data || response;
    const user = authData.user || authData;
    if (!user || typeof user !== 'object') {
        throw new Error('Authentication returned invalid user payload')
    }

    commit('SET_USER', user)
    commit('SET_CURRENT_USER', user, { root: true })
    setCookie(cookieName, JSON.stringify(user), 7)
    storeToken(authData.token)
    return user
}

export const loadUserFromCookie = ({ commit }) => {
    const userJson = getCookie(cookieName)
    if (!userJson || userJson === 'undefined' || userJson === 'null') {
        deleteCookie(cookieName)
        return
    }

    try {
        const user = JSON.parse(userJson)
        if (user && typeof user === 'object') {
            commit('SET_USER', user)
            commit('SET_CURRENT_USER', user, { root: true })
        } else {
            deleteCookie(cookieName)
        }
    } catch (err) {
        console.error('Failed to restore user from cookie', err)
        deleteCookie(cookieName)
    }
}

export const logout = async ({ commit }) => {
    try {
        await User.logout();
    } catch (err) {
        console.warn('Logout request failed, clearing local auth state anyway', err);
    }
    commit('SET_USER', null);
    commit('SET_CURRENT_USER', null, { root: true })
    deleteCookie(cookieName);
    clearToken();
}
