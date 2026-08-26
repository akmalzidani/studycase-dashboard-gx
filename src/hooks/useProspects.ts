import { useEffect, useState } from "react";
import {
  prospectService,
  type ProspectPayload,
} from "@/services/prospect.service";
import { useProspectStore } from "@/stores/useProspectStore";
import { toast } from "@/components/Overlay";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useProspects() {
  const prospects = useProspectStore((state) => state.__prospects);
  const isLoading = useProspectStore((state) => state.__isLoading);
  const setProspects = useProspectStore((state) => state.__handleSetProspects);
  const setIsLoading = useProspectStore((state) => state.__handleSetIsLoading);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProspects() {
      setIsLoading(true);
      try {
        setProspects(await prospectService.getAll());
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load prospect data."));
      } finally {
        setIsLoading(false);
      }
    }

    fetchProspects();
  }, [setIsLoading, setProspects]);

  const __handleCreateProspect = async (payload: ProspectPayload) => {
    setIsSubmitting(true);
    try {
      const prospect = await prospectService.create(payload);
      setProspects([...useProspectStore.getState().__prospects, prospect]);
      toast.success("Prospect added successfully.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add prospect."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const __handleUpdateProspect = async (
    id: string,
    payload: ProspectPayload,
  ) => {
    setIsSubmitting(true);
    try {
      const prospect = await prospectService.update(id, payload);
      setProspects(
        useProspectStore
          .getState()
          .__prospects.map((item) => (item.id === id ? prospect : item)),
      );
      toast.success("Prospect updated successfully.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update prospect."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const __handleDeleteProspect = async (id: string) => {
    setIsSubmitting(true);
    try {
      await prospectService.remove(id);
      setProspects(
        useProspectStore
          .getState()
          .__prospects.filter((item) => item.id !== id),
      );
      toast.success("Prospect deleted successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete prospect."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const __handleResetProspects = async () => {
    setIsSubmitting(true);
    try {
      setProspects(await prospectService.reset());
      toast.info("Prospect data has been restored to its initial state.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to reset prospect data."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    __prospects: prospects,
    __isLoading: isLoading,
    __isSubmitting: isSubmitting,
    __handleCreateProspect,
    __handleUpdateProspect,
    __handleDeleteProspect,
    __handleResetProspects,
  };
}
