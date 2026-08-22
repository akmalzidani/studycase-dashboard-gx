import { Spinner } from "@/components/common/Spinner";
import { usePageTitle } from "@/hooks/usePageTitle";
import { authService } from "@/services/auth.service";
import { getRoles } from "@/services/role.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "@/components/Overlay";
import { useEffect, useState, type SyntheticEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const demoAccounts = authService.getDemoAccounts();
  const login = useAuthStore((store) => store.login);
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

  const navigate = useNavigate();
  usePageTitle();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      const session = await authService.login(email, password);
      login(session);
      toast.success(`Welcome back, ${session.user.name}!`);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccountSelection = (account: {
    email: string;
    password?: string;
  }) => {
    setEmail(account.email);
    setPassword(account.password ?? "");
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary">
      <div
        className="card shadow-sm"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="card-body p-4 p-sm-5">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold mb-1">Welcome Back</h1>
            <p className="text-muted small">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold d-flex justify-content-center align-items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span role="status">Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-4 pt-3 border-top text-center">
            <p className="small text-muted mb-2">Demo Accounts:</p>
            <div className="d-flex justify-content-center gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.id ?? account.email}
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDemoAccountSelection(account)}
                >
                  {getRoles().find((role) => role.id === account.roleId)
                    ?.name ?? "User"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
