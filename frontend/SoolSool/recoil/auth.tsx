import { atom, RecoilState, RecoilValue, DefaultValue, AtomEffect } from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistAtom: AtomEffect<any> = ({ setSelf, onSet }) => {
  // Load initial value from AsyncStorage
  AsyncStorage.getItem('accessToken').then((savedValue) => {
    if (savedValue !== null) {
      setSelf(JSON.parse(savedValue));
    }
  });

  // Save changes to AsyncStorage
  onSet((newValue, oldValue) => {
    if (newValue !== oldValue) {
      AsyncStorage.setItem('accessToken', JSON.stringify(newValue));
    }
  });
};

export const accessTokenAtom = atom({
  key: 'accessTokenAtom',
  default: null,
  effects_UNSTABLE: [persistAtom],
});