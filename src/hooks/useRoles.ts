import { toast } from "@/components/Overlay";
import { roleService, type RolePayload } from "@/services/role.service";
import { useRoleStore } from "@/stores/useRoleStore";
import { useEffect, useState } from "react";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useRoles() {
  const roles = useRoleStore((state) => state.__roles);
  const setRoles = useRoleStore((state) => state.__handleSetRoles);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadRoles() {
      setIsLoading(true);
      try {
        setRoles(await roleService.getAll());
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load roles."));
      } finally {
        setIsLoading(false);
      }
    }

    loadRoles();
  }, [setRoles]);

  const __handleCreateRole = async (payload: RolePayload) => {
    setIsSubmitting(true);
    try {
      setRoles([...roles, await roleService.create(payload)]);
      toast.success("Role added successfully.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add role."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const __handleUpdateRole = async (id: string, payload: RolePayload) => {
    setIsSubmitting(true);
    try {
      const updated = await roleService.update(id, payload);
      setRoles(roles.map((role) => (role.id === id ? updated : role)));
      toast.success("Role updated successfully.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update role."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const __handleDeleteRole = async (id: string) => {
    setIsSubmitting(true);
    try {
      await roleService.remove(id);
      setRoles(roles.filter((role) => role.id !== id));
      toast.success("Role deleted successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete role."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    __roles: roles,
    __isLoading: isLoading,
    __isSubmitting: isSubmitting,
    __handleCreateRole,
    __handleUpdateRole,
    __handleDeleteRole,
  };
}
