export const PUSH_NOTIFICATION = (state, notification) => {
  state.notifications.push({
    ...notification,
    id: (Math.random().toString(36) + Date.now().toString(36)).substring(2)
  })
}

export const REMOVE_NOTIFICATION = (state, notificationData) => {
  state.notifications = state.notifications.filter(notification => notification.id !== notificationData.id)
}