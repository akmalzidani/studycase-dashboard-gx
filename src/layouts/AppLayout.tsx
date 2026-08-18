import { Outlet } from "react-router-dom";
import { Header } from "@/layouts/AppLayout/Header";
import Sidebar from "@/layouts/AppLayout/Sidebar";

function AppLayout() {
  return (
    <div className="d-flex min-vh-100 bg-body-tertiary">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Header />
        <main className="p-4 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
