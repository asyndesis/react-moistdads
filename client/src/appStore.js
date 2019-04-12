import { store } from 'react-easy-state';

// store the central data and logic of the application in a global app store
// use 'appStore' instead of 'this' in the store methods to make them passable as callbacks
const appStore = store({
  photos: [],
  setUserName(name){
    appStore.userName = name;
    localStorage.setItem('userName',appStore.userName);
  },
  setUserColor(color){
    appStore.userColor = color;
    localStorage.setItem('userColor',appStore.userColor);
  }
})

export default appStore