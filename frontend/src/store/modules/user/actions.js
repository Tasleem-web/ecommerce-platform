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
    console.log('Attempting to authenticate user:', { email, password });
    const response = await User.login(email, password);
    const authData = response.data || response;
    const profile = authData.user || authData.profile || authData;
    if (!profile || typeof profile !== 'object') {
        throw new Error('Authentication returned invalid user payload')
    }

    commit('SET_USER', profile)
    setCookie(cookieName, JSON.stringify(profile), 7)
    storeToken(authData.token)
    return profile
}

export const loadUserFromCookie = ({ commit }) => {
    const userJson = getCookie(cookieName)
    if (!userJson || userJson === 'undefined' || userJson === 'null') {
        deleteCookie(cookieName)
        return
    }

    try {
        const profile = JSON.parse(userJson)
        if (profile && typeof profile === 'object') {
            commit('SET_USER', profile)
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
    deleteCookie(cookieName);
    clearToken();
}
