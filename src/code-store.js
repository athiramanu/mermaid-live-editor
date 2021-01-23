import { writable, get } from 'svelte/store';
import { Base64 } from 'js-base64';
import { replace } from 'svelte-spa-router';
const isDarkMode =
  window.matchMedia('(prefers-color-scheme: dark)').matches && false;
const defaultState = {
  code: `graph TD
A[Christmas] -->|Get money| B(Go shopping)
B --> C{Let me think}
C -->|One| D[Laptop]
C -->|Two| E[iPhone]
C -->|Three| F[fa:fa-car Car]
  `,
  mermaid: { theme: isDarkMode ? 'dark' : 'default' },
};
export const codeStore = writable(defaultState);
export const fromUrl = (data) => {
  let state;
  try {
    const stateStr = Base64.decode(data);
    console.log('state from url', stateStr);
    state = JSON.parse(stateStr);
  } catch (e) {
    console.error('Init error', e);
    state = defaultState;
  }
  codeStore.set({...state, updateEditor: true});
};
export const updateCodeStore = (newState) => {
  codeStore.set(newState);
};
export const updateCode = (code, updateEditor) => {
  const state = get(codeStore);
  state.code = code;
  state.updateEditor = updateEditor;
  codeStore.set(state);
};
export const updateConfig = (config) => {
  const state = get(codeStore);
  state.mermaid = config;
  codeStore.set(state);
};

const unsubscribe = codeStore.subscribe((state) => {
  replace('/edit/' + Base64.encodeURI(JSON.stringify(state)));
});
