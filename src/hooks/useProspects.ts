import { useCallback, useEffect, useRef, useState } from "react";
import {
  prospectService,
  type ProspectPayload,
} from "@/services/prospect.service";
import { useProspectStore } from "@/stores/useProspectStore";
import { toast } from "@/components/Overlay";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useProspects() {
  const prospects = useProspectStore((state) => state.prospects);
  const hasLoaded = useProspectStore((state) => state.hasLoaded);
  const isLoading = useProspectStore((state) => state.isLoading);
  const setProspects = useProspectStore((state) => state.setProspects);
  const setIsLoading = useProspectStore((state) => state.setIsLoading);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetched = useRef(false);

  const fetchProspects = useCallback(async () => {
    setIsLoading(true);
    try {
      setProspects(await prospectService.getAll());
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memuat data prospect."));
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setProspects]);

  useEffect(() => {
    if (!hasLoaded && !hasFetched.current) {
      hasFetched.current = true;
      fetchProspects();
    }
  }, [fetchProspects, hasLoaded]);

  const createProspect = async (payload: ProspectPayload) => {
    setIsSubmitting(true);
    try {
      const prospect = await prospectService.create(payload);
      setProspects([...useProspectStore.getState().prospects, prospect]);
      toast.success("Prospect berhasil ditambahkan.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menambahkan prospect."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProspect = async (id: string, payload: ProspectPayload) => {
    setIsSubmitting(true);
    try {
      const prospect = await prospectService.update(id, payload);
      setProspects(
        useProspectStore
          .getState()
          .prospects.map((item) => (item.id === id ? prospect : item)),
      );
      toast.success("Prospect berhasil diperbarui.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui prospect."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProspect = async (id: string) => {
    setIsSubmitting(true);
    try {
      await prospectService.remove(id);
      setProspects(
        useProspectStore.getState().prospects.filter((item) => item.id !== id),
      );
      toast.success("Prospect berhasil dihapus.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus prospect."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetProspects = async () => {
    setIsSubmitting(true);
    try {
      setProspects(await prospectService.reset());
      toast.info("Data prospect telah dikembalikan ke data awal.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal mereset data prospect."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    prospects,
    isLoading: isLoading || !hasLoaded,
    isSubmitting,
    createProspect,
    updateProspect,
    deleteProspect,
    resetProspects,
  };
}
