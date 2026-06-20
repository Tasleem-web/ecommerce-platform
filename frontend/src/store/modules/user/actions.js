import User from "@/apis/User"

export const authenticate = async ({ commit }, { email, password }) => {
    const response = await User.login(email, password)
    commit('LOGIN_SUCCESS', response.data);
    // try {

    //     dispatch("addAuthenticationNotification", {
    //         type: "info",
    //         message: `logging...`,
    //         timeout: 3000
    //     }, { root: true });

    //     await User.login(email, password);
    //     commit('LOGIN_SUCCESS');

    //     dispatch("successAuthenticationNotification", {
    //         type: "success",
    //         message: `User logged in successfully.`,
    //         timeout: 3000
    //     }, { root: true });

    // } catch (error) {
    //     dispatch("failedAuthenticationNotification", {
    //         type: "danger",
    //         message: `User authentication failed`,
    //         timeout: 3000
    //     }, { root: true });
    // }
}