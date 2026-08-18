import { Link } from "react-router-dom";
import { APP_PATHS } from "@/config/paths.config";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function NotFoundPage() {
  usePageTitle();
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <h2 className="h4 mb-3">Halaman Tidak Ditemukan</h2>
      <p className="text-muted mb-4">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Link to={APP_PATHS.DASHBOARD.INDEX} className="btn btn-primary">
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
