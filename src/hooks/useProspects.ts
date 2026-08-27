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

  const _handleCreateProspect = async (payload: ProspectPayload) => {
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

  const _handleUpdateProspect = async (
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

  const _handleDeleteProspect = async (id: string) => {
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

  const _handleResetProspects = async () => {
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

  return {
    __prospects: prospects,
    __isLoading: isLoading,
    __isSubmitting: isSubmitting,
    __handleCreateProspect: _handleCreateProspect,
    __handleUpdateProspect: _handleUpdateProspect,
    __handleDeleteProspect: _handleDeleteProspect,
    __handleResetProspects: _handleResetProspects,
  };
}
