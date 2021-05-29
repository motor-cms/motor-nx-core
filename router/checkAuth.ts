import { RouteLocation } from 'vue-router'

export default function checkAuth(
  to: RouteLocation,
  from: RouteLocation,
  next: Function
) {
  if (!localStorage.getItem('token')) {
    next('/')
  } else {
    next()
  }
}
