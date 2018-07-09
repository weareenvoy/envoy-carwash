const currentUser = JSON.parse(localStorage.getItem('user'))

const initial = {
  currentUser
}

export default function carousel(state = initial, action) {
  switch (action.type) {
    case 'SET_USER':
      const user = JSON.parse(localStorage.getItem('user'))

      return {
        ...state,
        currentUser: user
      }
    case 'CLEAR_USER':
      return {
        ...state,
        currentUser: null
      }
    default:
      return state
  }
}
