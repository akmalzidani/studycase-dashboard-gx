import { LoaderPage } from "@/components/common/LoaderPage";
import { Header } from "@/layouts/AppLayout/Header";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/layouts/AppLayout/Sidebar";

function AppLayout() {
  return (
    <div className="d-flex vh-100 overflow-hidden bg-body-tertiary">
      <Sidebar />
      <div className="d-flex min-w-0 flex-grow-1 flex-column">
        <Header />
        <main className="flex-grow-1 overflow-y-auto p-4">
          <Suspense fallback={<LoaderPage />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
