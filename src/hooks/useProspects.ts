import { useCallback, useEffect, useRef, useState } from "react";
import {
  prospectService,
  type ProspectPayload,
} from "@/services/prospect.service";
import { useProspectStore } from "@/stores/useProspectStore";
import { useToastStore } from "@/stores/useToastStore";

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
  const addToast = useToastStore((state) => state.addToast);

  const fetchProspects = useCallback(async () => {
    setIsLoading(true);
    try {
      setProspects(await prospectService.getAll());
    } catch (error) {
      addToast(getErrorMessage(error, "Gagal memuat data prospect."), "danger");
    } finally {
      setIsLoading(false);
    }
  }, [addToast, setIsLoading, setProspects]);

  useEffect(() => {
    if (!hasLoaded && !hasFetched.current) {
      hasFetched.current = true;
      void fetchProspects();
    }
  }, [fetchProspects, hasLoaded]);

  const createProspect = async (payload: ProspectPayload) => {
    setIsSubmitting(true);
    try {
      const prospect = await prospectService.create(payload);
      setProspects([...useProspectStore.getState().prospects, prospect]);
      addToast("Prospect berhasil ditambahkan.", "success");
      return true;
    } catch (error) {
      addToast(getErrorMessage(error, "Gagal menambahkan prospect."), "danger");
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
      addToast("Prospect berhasil diperbarui.", "success");
      return true;
    } catch (error) {
      addToast(getErrorMessage(error, "Gagal memperbarui prospect."), "danger");
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
      addToast("Prospect berhasil dihapus.", "success");
    } catch (error) {
      addToast(getErrorMessage(error, "Gagal menghapus prospect."), "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetProspects = async () => {
    setIsSubmitting(true);
    try {
      setProspects(await prospectService.reset());
      addToast("Data prospect telah dikembalikan ke data awal.", "info");
    } catch (error) {
      addToast(
        getErrorMessage(error, "Gagal mereset data prospect."),
        "danger",
      );
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
