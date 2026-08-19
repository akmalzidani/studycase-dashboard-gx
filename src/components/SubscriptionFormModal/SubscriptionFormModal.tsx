import { useEffect, useState, type SyntheticEvent } from "react";
import { Modal, type FormModalProps } from "@/components/common/Modal";
import { FormTextInput } from "@/components/common/FormInput/FormInput";
import { MODAL_TARGETS } from "@/config/modal.config";
import type { Subscription } from "@/types";

export interface SubscriptionFormValues {
  packageName: string;
  speed: number;
  monthlyFee: number;
}

type SubscriptionFormModalProps = FormModalProps<
  Subscription,
  SubscriptionFormValues
>;

const FORM_ID = "subscription-form";
const EMPTY_VALUES: SubscriptionFormValues = {
  packageName: "",
  speed: 0,
  monthlyFee: 0,
};

const formatCurrencyInput = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value);

export function SubscriptionFormModal({
  isOpen,
  isSubmitting,
  item: subscription,
  onClose,
  onSubmit,
}: SubscriptionFormModalProps) {
  const [values, setValues] = useState<SubscriptionFormValues>(EMPTY_VALUES);

  useEffect(() => {
    if (!isOpen) return;

    setValues(
      subscription
        ? {
            packageName: subscription.packageName,
            speed: subscription.speed,
            monthlyFee: subscription.monthlyFee,
          }
        : EMPTY_VALUES,
    );
  }, [isOpen, subscription]);

  const updateValue = <K extends keyof SubscriptionFormValues>(
    field: K,
    value: SubscriptionFormValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) onClose();
  };

  const isEditing = Boolean(subscription);

  return (
    <Modal
      target={MODAL_TARGETS.SUBSCRIPTION_FORM}
      title={
        isEditing ? "Edit Paket Subscription" : "Tambah Paket Subscription"
      }
      isOpen={isOpen}
      closeDisabled={isSubmitting}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className="btn btn-light"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="submit"
            form={FORM_ID}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Menyimpan..."
              : isEditing
                ? "Simpan Perubahan"
                : "Tambah Paket"}
          </button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit}>
        <FormTextInput
          id="subscription-package-name"
          label="Nama paket"
          placeholder="Masukkan nama paket"
          className="form-control"
          value={values.packageName}
          minLength={2}
          required
          disabled={isSubmitting}
          onChange={(event) => updateValue("packageName", event.target.value)}
        />
        <div className="mb-3">
          <label className="form-label" htmlFor="subscription-speed">
            Kecepatan
          </label>
          <div className="input-group">
            <input
              id="subscription-speed"
              type="number"
              min={1}
              className="form-control"
              value={values.speed || ""}
              placeholder="Contoh: 100"
              required
              disabled={isSubmitting}
              onChange={(event) =>
                updateValue("speed", Number(event.target.value))
              }
            />
            <span className="input-group-text">Mbps</span>
          </div>
        </div>
        <div>
          <label className="form-label" htmlFor="subscription-monthly-fee">
            Biaya per bulan
          </label>
          <div className="input-group">
            <span className="input-group-text">Rp</span>
            <input
              id="subscription-monthly-fee"
              placeholder="Masukkan biaya per bulan"
              type="text"
              inputMode="numeric"
              className="form-control text-end font-monospace"
              value={
                values.monthlyFee ? formatCurrencyInput(values.monthlyFee) : ""
              }
              required
              disabled={isSubmitting}
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "");
                updateValue("monthlyFee", digits ? Number(digits) : 0);
              }}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
