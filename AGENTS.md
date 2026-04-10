## 1. Архитектура — Feature-Sliced Design (FSD)

### Структура проекта

```
src/
├── app/                    # Инициализация приложения
│   ├── providers/          # Глобальные провайдеры (Router, Theme, etc.)
│   ├── styles/             # Глобальные стили, tailwind base
│   └── index.tsx
│
├── pages/                  # Страницы (роуты)
│   └── [page-name]/
│       ├── ui/
│       └── index.ts
│
├── widgets/                # Самодостаточные блоки страниц
│   └── [widget-name]/
│       ├── ui/
│       ├── model/
│       └── index.ts
│
├── features/               # Пользовательские сценарии / действия
│   └── [feature-name]/
│       ├── ui/
│       ├── model/
│       ├── api/
│       └── index.ts
│
├── entities/               # Бизнес-сущности
│   └── [entity-name]/
│       ├── ui/
│       ├── model/
│       ├── api/
│       ├── lib/
│       └── index.ts
│
└── shared/                 # Переиспользуемый код без бизнес-логики
    ├── api/                # Базовая конфигурация ofetch
    ├── ui/                 # Общие компоненты (shadcn + кастомные)
    ├── lib/                # Утилиты, хелперы
    ├── config/             # Константы, env-переменные
    └── types/              # Глобальные типы
```

### Правила FSD

- **Слои импортируют только вниз**: `app` → `pages` → `widgets` → `features` → `entities` → `shared`. Обратные импорты запрещены.
- Каждый слайс экспортирует **только через публичный `index.ts`** — внутренние модули не импортируются снаружи напрямую.
- Слайс — это изолированная единица: не содержит знаний о соседях на том же уровне.
- Бизнес-логика живёт в `model/`, UI — в `ui/`, запросы — в `api/`.

---

## 2. TypeScript

- `strict: true` обязателен. Никаких `any` — используй `unknown` с нарроуингом или явные дженерики.
- Все публичные интерфейсы слайса типизированы и экспортированы из `index.ts`.
- Типы данных из API описываются в `entities/[entity]/model/types.ts`.
- Используй `satisfies` и `as const` вместо явных приведений типов где возможно.
- Перечисления реализуй через `const` объекты + `typeof`:

```ts
// ✅ Правильно
export const UserRole = {
  Admin: 'admin',
  User: 'user',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ❌ Неправильно
enum UserRole { Admin = 'admin', User = 'user' }
```

---

## 3. React 19

- Используй функциональные компоненты. Классовые компоненты запрещены.
- Применяй новые возможности React 19:
  - `use()` для чтения промисов и контекстов в рендере.
  - `useOptimistic()` для оптимистичных UI-обновлений.
  - `useActionState()` / `useFormStatus()` для форм (если не используется Effector-форма).
  - `ref` как проп (без `forwardRef` — он deprecated в 19).
- `useEffect` — только для синхронизации с внешними системами, не для бизнес-логики.
- Не используй `useEffect` для загрузки данных — это задача Effector-эффектов.
- Мемоизация (`useMemo`, `useCallback`, `memo`) — только при доказанной проблеме производительности, не превентивно.

```tsx
// ✅ React 19: ref как проп
function Input({ ref, ...props }: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}
```

---

## 4. Effector — управление состоянием

### Базовые принципы

- Вся бизнес-логика в `model/` слайса: `store`, `event`, `effect` — без утечек в компоненты.
- Один файл `model/index.ts` — входная точка модели. Разбивай на `stores.ts`, `events.ts`, `effects.ts` при росте.
- Никаких сайд-эффектов в `store` и `event`. Только в `effect`.

### Структура модели

```ts
// features/auth/model/effects.ts
import { createEffect } from 'effector';
import { authApi } from '../api';

export const loginFx = createEffect(authApi.login);

// features/auth/model/stores.ts
import { createStore } from 'effector';
import { loginFx } from './effects';
import type { User } from '@/entities/user';

export const $currentUser = createStore<User | null>(null)
  .on(loginFx.doneData, (_, user) => user)
  .on(logoutFx.done, () => null);

export const $isLoading = loginFx.pending;

// features/auth/model/events.ts
import { createEvent } from 'effector';
export const logout = createEvent();

// features/auth/model/index.ts
export { $currentUser, $isLoading } from './stores';
export { loginFx, logoutFx } from './effects';
export { logout } from './events';
```

### Правила Effector

- Называй сторы с префиксом `$`: `$user`, `$isLoading`, `$items`.
- Называй эффекты с суффиксом `Fx`: `fetchUserFx`, `submitFormFx`.
- Используй `combine` для деривации состояний вместо вычислений в компоненте.
- `sample` — основной инструмент связи событий, сторов и эффектов. Предпочитай его `.watch` и ручным подпискам.
- Для форм используй `@farfetched/effector` или `effector-forms`.
- Избегай `useStore(fx.pending)` — используй `createStore` деривации через `combine`.

```ts
// ✅ Правильно: sample для связи
sample({
  clock: pageLoaded,
  source: $userId,
  filter: Boolean,
  target: fetchUserFx,
});

// ❌ Неправильно: логика в компоненте
useEffect(() => {
  if (userId) fetchUser(userId);
}, [userId]);
```

### Подключение к React

```tsx
import { useUnit } from 'effector-react';
import { $currentUser, $isLoading, loginFx } from '../model';

export function LoginButton() {
  const [user, isLoading, login] = useUnit([$currentUser, $isLoading, loginFx]);

  return (
    <button onClick={() => login({ email, password })} disabled={isLoading}>
      {isLoading ? 'Загрузка...' : 'Войти'}
    </button>
  );
}
```

- Используй `useUnit` для всего — он заменяет `useStore` + `useEvent`.
- Никогда не передавай `store` или `event` как проп в дочерний компонент — подписывайся локально через `useUnit`.

---

## 5. API — ofetch

### Конфигурация в `shared/api`

```ts
// shared/api/client.ts
import { ofetch } from 'ofetch';

export const apiClient = ofetch.create({
  baseURL: import.meta.env.VITE_API_URL,
  credentials: 'include',
  onRequest({ options }) {
    const token = getToken(); // из localStorage / cookie
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  },
  onResponseError({ response }) {
    if (response.status === 401) {
      // триггер logout-события Effector
      unauthorizedEvent();
    }
  },
});
```

### API-модули слайсов

```ts
// entities/user/api/index.ts
import { apiClient } from '@/shared/api';
import type { User } from '../model/types';

export const userApi = {
  getById: (id: string) =>
    apiClient<User>(`/users/${id}`),

  update: (id: string, data: Partial<User>) =>
    apiClient<User>(`/users/${id}`, { method: 'PATCH', body: data }),
};
```

- Все API-вызовы инкапсулированы в `api/` слайса, не вызываются напрямую из компонентов.
- Типизируй ответ через дженерик `ofetch<T>()`.
- Обработка ошибок — в `onResponseError` клиента или в `effect.fail` Effector.

---

## 6. TailwindCSS

- Используй **только utility-классы Tailwind** — никаких inline-стилей и отдельных CSS-файлов для компонент.
- Для условных классов применяй библиотеку `clsx` или `cn`-хелпер из shadcn:

```ts
// shared/lib/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- Кастомные токены (цвета, шрифты, отступы) — только через `tailwind.config.ts`, не хардкодом.
- Избегай `@apply` в CSS — это нарушает утилитарную философию Tailwind.
- Используй `group`, `peer`, `has-[]` для сложных интерактивных состояний без JS.
- Responsive-дизайн через mobile-first брейкпоинты: `sm:`, `md:`, `lg:`, `xl:`.

---

## 7. shadcn/ui

- Компоненты shadcn хранятся в `shared/ui/` и могут быть модифицированы.
- Не устанавливай shadcn-компоненты напрямую в слайсы — только через `shared/ui`.
- Расширяй компоненты через `cn()` и `VariantProps` из `class-variance-authority`:

```tsx
// shared/ui/button.tsx — модификация shadcn-компонента
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

- Тему shadcn настраивай через CSS-переменные в `app/styles/globals.css`.

---

## 8. Организация кода

### Именование

| Сущность | Конвенция | Пример |
|---|---|---|
| Компоненты | PascalCase | `UserCard.tsx` |
| Хуки | camelCase + `use` | `useUserProfile.ts` |
| Сторы Effector | camelCase + `$` | `$userList` |
| Эффекты Effector | camelCase + `Fx` | `fetchUserFx` |
| События Effector | camelCase | `userSelected`, `formSubmitted` |
| Утилиты | camelCase | `formatDate.ts` |
| Типы/Интерфейсы | PascalCase | `UserProfile`, `ApiResponse<T>` |
| Enum-объекты | PascalCase | `UserRole`, `OrderStatus` |

### Файловая структура компонента

```
features/user-profile/
├── ui/
│   ├── UserProfile.tsx        # Основной компонент
│   ├── UserProfileSkeleton.tsx
│   └── UserProfileForm.tsx
├── model/
│   ├── index.ts
│   ├── stores.ts
│   ├── effects.ts
│   └── events.ts
├── api/
│   └── index.ts
└── index.ts                   # Публичный API слайса
```

### Экспорты

```ts
// features/user-profile/index.ts — только публичный API
export { UserProfile } from './ui/UserProfile';
export { $userProfile, $isProfileLoading } from './model';
export type { UserProfileProps } from './ui/UserProfile';
```

---

## 9. Запрещено

- ❌ `any` — использовать `unknown` + type guards
- ❌ `useEffect` для загрузки данных
- ❌ Импорт внутренностей слайса в обход `index.ts`
- ❌ Импорт из слоя выше (entities не импортирует из features)
- ❌ Бизнес-логика в компонентах — только UI
- ❌ `default export` для всего кроме страниц и лениво-загружаемых модулей
- ❌ Мутация стора напрямую — только через события/эффекты
- ❌ `console.log` в продакшн-коде
- ❌ Хардкод URL/токенов/конфигов — только через `import.meta.env`
- ❌ `@apply` в CSS-файлах

---

## 10. Пример связки фичи целиком

```ts
// features/create-post/api/index.ts
import { apiClient } from '@/shared/api';
import type { Post, CreatePostDto } from '@/entities/post';

export const createPostApi = {
  create: (dto: CreatePostDto) =>
    apiClient<Post>('/posts', { method: 'POST', body: dto }),
};

// features/create-post/model/index.ts
import { createEffect, createEvent, createStore, sample } from 'effector';
import { createPostApi } from '../api';
import type { Post } from '@/entities/post';

export const formSubmitted = createEvent<CreatePostDto>();
export const createPostFx = createEffect(createPostApi.create);

export const $lastCreatedPost = createStore<Post | null>(null)
  .on(createPostFx.doneData, (_, post) => post);

export const $isSubmitting = createPostFx.pending;

sample({ clock: formSubmitted, target: createPostFx });

// features/create-post/ui/CreatePostForm.tsx
import { useUnit } from 'effector-react';
import { $isSubmitting, formSubmitted } from '../model';
import { Button } from '@/shared/ui';

export function CreatePostForm() {
  const [isSubmitting, submit] = useUnit([$isSubmitting, formSubmitted]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    submit({ title: data.get('title') as string, body: data.get('body') as string });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input name="title" className="rounded-md border px-3 py-2" placeholder="Заголовок" />
      <textarea name="body" className="rounded-md border px-3 py-2" rows={4} />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Публикация...' : 'Опубликовать'}
      </Button>
    </form>
  );
}
```