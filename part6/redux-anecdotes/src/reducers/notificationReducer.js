import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        displayNotification(state, action){
            return action.payload
        },
        clearNotification(){
            return ''
        },
    },
})

export const { displayNotification, clearNotification } = notificationSlice.actions

let timeoutId

export const setNotification = (message, seconds = 5) => {
  return dispatch => {
    dispatch(displayNotification(message))

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer