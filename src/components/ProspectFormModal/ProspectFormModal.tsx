import { useEffect, useState, type SyntheticEvent } from "react";
import { MODAL_TARGETS } from "@/config/modal.config";
import { Modal, type FormModalProps } from "@/components/common/Modal";
import { FormTextInput } from "@/components/common/FormInput/FormInput";
import type { Prospect, ProspectStatus, Subscription } from "@/types";
import { formatSpeed } from "@/helpers/formatters.helpers";

export interface ProspectFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  subscriptionId: string;
  status: ProspectStatus;
}

interface ProspectFormModalProps extends FormModalProps<
  Prospect,
  ProspectFormValues
> {
  subscriptions: Subscription[];
}

const STATUS_OPTIONS: ProspectStatus[] = ["Pending", "Completed"];
const FORM_ID = "prospect-form";

export function ProspectFormModal({
  isOpen,
  isSubmitting,
  item: prospect,
  subscriptions,
  onClose,
  onSubmit,
}: ProspectFormModalProps) {
  const [values, setValues] = useState<ProspectFormValues>({
    name: "",
    email: "",
    phoneNumber: "",
    subscriptionId: "",
    status: "Pending",
  });

  useEffect(() => {
    if (!isOpen) return;

    setValues(
      prospect
        ? {
            name: prospect.name,
            email: prospect.email,
            phoneNumber: prospect.phoneNumber,
            subscriptionId: prospect.subscription.id ?? "",
            status: prospect.status,
          }
        : {
            name: "",
            email: "",
            phoneNumber: "",
            subscriptionId: subscriptions[0]?.id ?? "",
            status: "Pending",
          },
    );
  }, [isOpen, prospect, subscriptions]);

  const updateValue = <K extends keyof ProspectFormValues>(
    field: K,
    value: ProspectFormValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) onClose();
  };

  const isEditing = Boolean(prospect);

  return (
    <Modal
      target={MODAL_TARGETS.PROSPECT_FORM}
      title={isEditing ? "Edit Prospect" : "Tambah Prospect"}
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
                : "Tambah Prospect"}
          </button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit}>
        <FormTextInput
          id="prospect-name"
          label="Nama"
          placeholder="Masukkan nama"
          className="form-control"
          value={values.name}
          minLength={3}
          required
          disabled={isSubmitting}
          onChange={(event) => updateValue("name", event.target.value)}
        />
        <FormTextInput
          id="prospect-email"
          label="Email"
          placeholder="Masukkan email"
          type="email"
          className="form-control"
          value={values.email}
          required
          disabled={isSubmitting}
          onChange={(event) => updateValue("email", event.target.value)}
        />
        <FormTextInput
          id="prospect-phone"
          label="Nomor telepon"
          placeholder="Masukkan nomor telepon"
          type="tel"
          className="form-control"
          value={values.phoneNumber}
          pattern="(?=.*\S)[0-9+() -]{8,}"
          title="Masukkan nomor telepon yang valid, bukan hanya spasi."
          required
          disabled={isSubmitting}
          onChange={(event) => updateValue("phoneNumber", event.target.value)}
        />
        <div className="mb-3">
          <label className="form-label" htmlFor="prospect-subscription">
            Subscription
          </label>
          <select
            id="prospect-subscription"
            className="form-select"
            value={values.subscriptionId}
            required
            disabled={isSubmitting}
            onChange={(event) =>
              updateValue("subscriptionId", event.target.value)
            }
          >
            {subscriptions.map((subscription) => (
              <option key={subscription.id} value={subscription.id}>
                {subscription.packageName} — {formatSpeed(subscription.speed)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="prospect-status">
            Status
          </label>
          <select
            id="prospect-status"
            className="form-select"
            value={values.status}
            disabled={isSubmitting}
            onChange={(event) =>
              updateValue("status", event.target.value as ProspectStatus)
            }
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  );
}
