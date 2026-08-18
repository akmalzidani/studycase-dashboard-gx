import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ToastContainer } from "./components/common/ToastContainer";
import { ConfirmationDialog } from "./components/common/ConfirmationDialog";
import { useAuthStore } from "./stores/useAuthStore";

function App() {
  useEffect(() => {
    useAuthStore.getState().checkSession();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
      <ConfirmationDialog />
    </>
  );
}

export default App;
