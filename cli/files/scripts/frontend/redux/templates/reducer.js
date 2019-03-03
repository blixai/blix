const name = (state = null, action) => {
  switch (action.type) {
    case 'NAME':
      return action.payload
    default:
      return state
  }
}

export default name