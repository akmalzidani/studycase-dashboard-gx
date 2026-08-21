import { toast } from "@/components/Overlay";
import { userService, type UserPayload } from "@/services/user.service";
import { useUserStore } from "@/stores/useUserStore";
import { useCallback, useEffect, useRef, useState } from "react";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useUsers() {
  const { users, hasLoaded, isLoading, setUsers, setIsLoading } =
    useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetched = useRef(false);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      setUsers(await userService.getAll());
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load user data."));
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setUsers]);

  useEffect(() => {
    if (hasLoaded || hasFetched.current) return;
    hasFetched.current = true;
    void loadUsers();
  }, [hasLoaded, loadUsers]);

  const createUser = async (payload: UserPayload) => {
    setIsSubmitting(true);
    try {
      const created = await userService.create(payload);
      setUsers([...useUserStore.getState().users, created]);
      toast.success("User added successfully.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add user."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUser = async (id: string, payload: UserPayload) => {
    setIsSubmitting(true);
    try {
      const updated = await userService.update(id, payload);
      setUsers(
        useUserStore
          .getState()
          .users.map((user) => (user.id === id ? updated : user)),
      );
      toast.success("User updated successfully.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update user."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteUser = async (id: string) => {
    setIsSubmitting(true);
    try {
      await userService.remove(id);
      setUsers(useUserStore.getState().users.filter((user) => user.id !== id));
      toast.success("User deleted successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete user."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    users,
    isLoading,
    isSubmitting,
    createUser,
    updateUser,
    deleteUser,
  };
}
