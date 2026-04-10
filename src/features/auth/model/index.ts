import { createEffect, createEvent, createStore, sample } from "effector";
import { authApi } from "@/features/auth/api";
import { userReceived, userReset, type User } from "@/entities/user";

export const authRequested = createEvent();

export const fetchCurrentUserFx = createEffect(() => authApi.getCurrentUser());

export const $isAuthModalOpen = createStore(false)
  .on(fetchCurrentUserFx.fail, () => true)
  .on(fetchCurrentUserFx.done, () => false);

sample({ clock: authRequested, target: fetchCurrentUserFx });

sample({
  clock: fetchCurrentUserFx.doneData,
  fn: (user: User) => user,
  target: userReceived,
});

sample({
  clock: fetchCurrentUserFx.fail,
  target: userReset,
});
