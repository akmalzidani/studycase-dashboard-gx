import {
  ChangePasswordModal,
  type ChangePasswordFormValues,
} from "@/components/ChangePasswordModal";
import { Badge } from "@/components/common/Badge";
import {
  ProfileFormModal,
  type ProfileFormValues,
} from "@/components/ProfileFormModal";
import { MODAL_TARGETS } from "@/config/modal.config";
import { useModal } from "@/hooks/useModal";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "@/components/Overlay";
import type { Role } from "@/types";
import { useCallback, useState } from "react";
import {
  BsEnvelope,
  BsKey,
  BsPencilSquare,
  BsPersonCircle,
} from "react-icons/bs";

const roleLabel: Record<Role, string> = {
  superadmin: "Super Administrator",
  user: "User",
};

export default function ProfilePage() {
  const { user, checkSession } = useAuthStore();

  const profileFormModal = useModal(MODAL_TARGETS.PROFILE_FORM);
  const changePasswordModal = useModal(MODAL_TARGETS.CHANGE_PASSWORD);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (values: ProfileFormValues) => {
      if (!user?.id) return false;

      setIsSubmitting(true);
      try {
        const updatedUser = await userService.updateProfile(user.id, {
          name: values.name,
          email: values.email,
        });
        authService.updateSessionUser(updatedUser);
        checkSession();
        toast.success("Profile berhasil diperbarui.");
        return true;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Gagal memperbarui profile.",
        );
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [checkSession, user?.id],
  );

  const handleChangePassword = useCallback(
    async (values: ChangePasswordFormValues) => {
      if (!user?.id) return false;

      if (values.newPassword !== values.confirmNewPassword) {
        toast.error("Konfirmasi password baru tidak sesuai.");
        return false;
      }

      setIsSubmitting(true);
      try {
        const updatedUser = await userService.changePassword(user.id, {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        authService.updateSessionUser(updatedUser);
        checkSession();
        toast.success("Password berhasil diubah.");
        return true;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Gagal mengubah password.",
        );
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [checkSession, user?.id],
  );

  if (!user) return null;

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3 mb-1 fw-bold">Profile</h1>
          <p className="text-muted mb-0">Pengaturan profil akun Anda.</p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={changePasswordModal.open}
          >
            <BsKey className="me-2" />
            Ubah Password
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={profileFormModal.open}
          >
            <BsPencilSquare className="me-2" />
            Edit Profile
          </button>
        </div>
      </div>

      <section className="card">
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <BsPersonCircle className="display-5 text-primary" />
            <div>
              <h2 className="h4 mb-1">{user.name}</h2>
              <Badge variant="primary">{roleLabel[user.role]}</Badge>
            </div>
          </div>
          <dl className="row mb-0">
            <dt className="col-sm-3 text-muted fw-normal">Email</dt>
            <dd className="col-sm-9 d-flex align-items-center gap-2">
              <BsEnvelope className="text-muted" />
              {user.email}
            </dd>
            <dt className="col-sm-3 text-muted fw-normal">Role</dt>
            <dd className="col-sm-9">{roleLabel[user.role]}</dd>
          </dl>
        </div>
      </section>

      <ProfileFormModal
        isOpen={profileFormModal.isOpen}
        isSubmitting={isSubmitting}
        item={user}
        onClose={profileFormModal.close}
        onSubmit={handleSubmit}
      />

      <ChangePasswordModal
        isOpen={changePasswordModal.isOpen}
        isSubmitting={isSubmitting}
        item={user}
        onClose={changePasswordModal.close}
        onSubmit={handleChangePassword}
      />
    </div>
  );
}
