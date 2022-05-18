import { isBrowser } from "../utils"

const getUser = () =>
  isBrowser && window.localStorage.getItem("netlify-cms-user")
    ? JSON.parse(window.localStorage.getItem("netlify-cms-user"))
    : {}

export const isUserAdmin = adminUsername => {
  const { login } = getUser()
  if (login === adminUsername) {
    return true
  }

  return false
}
