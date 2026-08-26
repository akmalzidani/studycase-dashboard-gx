import { toast } from "@/components/Overlay";
import { userService, type UserPayload } from "@/services/user.service";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useState } from "react";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useUsers() {
  const users = useUserStore((state) => state.__users);
  const isLoading = useUserStore((state) => state.__isLoading);
  const setUsers = useUserStore((state) => state.__handleSetUsers);
  const setIsLoading = useUserStore((state) => state.__handleSetIsLoading);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true);
      try {
        setUsers(await userService.getAll());
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load user data."));
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, [setIsLoading, setUsers]);

  const __handleCreateUser = async (payload: UserPayload) => {
    setIsSubmitting(true);
    try {
      const created = await userService.create(payload);
      setUsers([...useUserStore.getState().__users, created]);
      toast.success("User added successfully.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add user."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const __handleUpdateUser = async (id: string, payload: UserPayload) => {
    setIsSubmitting(true);
    try {
      const updated = await userService.update(id, payload);
      setUsers(
        useUserStore
          .getState()
          .__users.map((user) => (user.id === id ? updated : user)),
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

  const __handleDeleteUser = async (id: string) => {
    setIsSubmitting(true);
    try {
      await userService.remove(id);
      setUsers(
        useUserStore.getState().__users.filter((user) => user.id !== id),
      );
      toast.success("User deleted successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete user."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    __users: users,
    __isLoading: isLoading,
    __isSubmitting: isSubmitting,
    __handleCreateUser,
    __handleUpdateUser,
    __handleDeleteUser,
  };
}
