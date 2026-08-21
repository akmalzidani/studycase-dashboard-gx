export function LoaderPage() {
  return (
    <main
      className="d-flex flex-grow-1 justify-content-center align-items-center py-5"
      aria-busy="true"
      aria-label="Memuat halaman"
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Memuat halaman...</span>
      </div>
    </main>
  );
}
