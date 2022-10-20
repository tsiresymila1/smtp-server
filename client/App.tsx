import React from "react";
import { Provider } from "react-redux";
import "./assets/base.css";
import "animate.css";
import "./css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { AppRouter } from "./router";
import { store } from "./app/store";
import { AuthProvider } from "./components/AuthProvider";
import { QueryClient, QueryClientProvider } from "react-query";


export const App = () => {
    const [queryClient] = React.useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  );
};
