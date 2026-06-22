export const SET_USER = (state, user) => {
  state.currentUser = user || null
}

export const LOGIN_SUCCESS = (state, userDetails) => {
  console.log(userDetails)
}