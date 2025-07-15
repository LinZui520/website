import { ref, type Ref, type UnwrapRef } from 'vue';

export const useState = <T>(initialValue: T): [Ref<UnwrapRef<T>>, (value: T | UnwrapRef<T>) => void] => {
  const state = ref(initialValue) as Ref<UnwrapRef<T>>;
  const setState = (value: T | UnwrapRef<T>) => {
    state.value = value as UnwrapRef<T>;
  };
  return [state, setState];
};
