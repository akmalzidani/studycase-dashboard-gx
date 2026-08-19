import { toast } from "@/components/Overlay";
import { roleService, type RolePayload } from "@/services/role.service";
import { useRoleStore } from "@/stores/useRoleStore";
import { useCallback, useEffect, useRef, useState } from "react";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useRoles() {
  const { roles, setRoles } = useRoleStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasLoaded = useRef(false);

  const loadRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      setRoles(await roleService.getAll());
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memuat role."));
    } finally {
      setIsLoading(false);
    }
  }, [setRoles]);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    void loadRoles();
  }, [loadRoles]);

  const createRole = async (payload: RolePayload) => {
    setIsSubmitting(true);
    try {
      setRoles([...roles, await roleService.create(payload)]);
      toast.success("Role berhasil ditambahkan.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menambahkan role."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateRole = async (id: string, payload: RolePayload) => {
    setIsSubmitting(true);
    try {
      const updated = await roleService.update(id, payload);
      setRoles(roles.map((role) => (role.id === id ? updated : role)));
      toast.success("Role berhasil diperbarui.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui role."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteRole = async (id: string) => {
    setIsSubmitting(true);
    try {
      await roleService.remove(id);
      setRoles(roles.filter((role) => role.id !== id));
      toast.success("Role berhasil dihapus.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus role."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { roles, isLoading, isSubmitting, createRole, updateRole, deleteRole };
}
