import { AppProviders } from "@/provider/AppProviders";
import { AppRouter } from "@/routes";
import { useDocumentTitle } from "@/hooks";

const App = () => {
  useDocumentTitle();

  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};

export default App;
