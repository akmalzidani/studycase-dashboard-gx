import {
  ChangePasswordForm,
  type ChangePasswordFormValues,
} from "@/components/Forms/ChangePasswordForm";
import { Badge } from "@/components/common/Badge";

import {
  ProfileForm,
  type ProfileFormValues,
} from "@/components/Forms/ProfileForm";

import { OVERLAY_TARGETS } from "@/config/overlay.config";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { hasPermission } from "@/config/permission.helpers";

import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "@/components/Overlay";
import { getRoles } from "@/services/role.service";
import { useCallback, useState } from "react";
import {
  BsEnvelope,
  BsKey,
  BsPencilSquare,
  BsPersonCircle,
} from "react-icons/bs";

export default function ProfilePage() {
  const user = useAuthStore((store) => store.user);
  const checkSession = useAuthStore((store) => store.checkSession);
  const permissions = useAuthStore((store) => store.permissions);
  const canUpdateProfile = hasPermission(
    permissions,
    PERMISSION_KEYS.PROFILE.UPDATE,
  );
  const roleName =
    getRoles().find((role) => role.id === user?.roleId)?.name ?? "-";

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
        toast.success("Profile updated successfully.");
        return true;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update profile.",
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
        toast.error("New password confirmation does not match.");
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
        toast.success("Password changed successfully.");
        return true;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to change password.",
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
    <>
      <section className="card">
        <div className="card-header bg-transparent py-3">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <h1 className="h5 mb-0">Profile</h1>
            {canUpdateProfile && (
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#${OVERLAY_TARGETS.CHANGE_PASSWORD}`}
                >
                  <BsKey className="me-2" />
                  Change Password
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#${OVERLAY_TARGETS.PROFILE_FORM}`}
                >
                  <BsPencilSquare className="me-2" />
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <BsPersonCircle className="display-5 text-primary" />
            <div>
              <p className="h4 mb-1">{user.name}</p>
              <Badge variant="primary">{roleName}</Badge>
            </div>
          </div>
          <dl className="row mb-0">
            <dt className="col-sm-3 text-muted fw-normal">Email</dt>
            <dd className="col-sm-9 d-flex align-items-center gap-2">
              <BsEnvelope className="text-muted" />
              {user.email}
            </dd>
            <dt className="col-sm-3 text-muted fw-normal">Role</dt>
            <dd className="col-sm-9">{roleName}</dd>
          </dl>
        </div>
      </section>

      <ProfileForm
        isSubmitting={isSubmitting}
        item={user}
        onSubmit={handleSubmit}
      />

      <ChangePasswordForm
        isSubmitting={isSubmitting}
        item={user}
        onSubmit={handleChangePassword}
      />
    </>
  );
}
