import { AppProviders } from "@/app/providers/AppProviders";
import { AppRouter } from "@/app/providers/AppRouter";

export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
