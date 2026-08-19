import { OverlayHost } from "@/components/Overlay";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useAuthStore } from "./stores/useAuthStore";

function App() {
  useEffect(() => {
    useAuthStore.getState().checkSession();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <OverlayHost />
    </>
  );
}

export default App;
