import { useEffect, useState, type SyntheticEvent } from "react";
import { FORM_IDS, MODAL_TARGETS } from "@/config/modal.config";
import { Modal } from "@/components/common/Modal";
import { FormTextInput } from "@/components/common/FormInput";
import type { Prospect, ProspectStatus, Subscription } from "@/types";
import { formatSpeed } from "@/helpers/formatters.helpers";
import { hideModal, onModalShown } from "@/helpers/modal.helpers";

export interface ProspectFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  subscriptionId: string;
  status: ProspectStatus;
}

interface ProspectFormModalProps {
  isSubmitting: boolean;
  item: Prospect | null;
  subscriptions: Subscription[];
  onSubmit: (values: ProspectFormValues) => Promise<boolean>;
}

const STATUS_OPTIONS: ProspectStatus[] = ["Pending", "Completed"];

export function ProspectFormModal({
  isSubmitting,
  item: prospect,
  subscriptions,
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
    const initializeValues = () => {
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
    };

    return onModalShown(MODAL_TARGETS.PROSPECT_FORM, initializeValues);
  }, [prospect, subscriptions]);

  const handleValueChange = <K extends keyof ProspectFormValues>(
    field: K,
    value: ProspectFormValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) {
      hideModal(MODAL_TARGETS.PROSPECT_FORM);
    }
  };

  const isEditing = Boolean(prospect);

  return (
    <Modal
      target={MODAL_TARGETS.PROSPECT_FORM}
      title={isEditing ? "Edit Prospect" : "Add Prospect"}

      footer={
        <>
          <button
            type="button"
            className="btn btn-light"
            disabled={isSubmitting}
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="submit"
            form={FORM_IDS.PROSPECT}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Add Prospect"}
          </button>
        </>
      }
    >
      <form id={FORM_IDS.PROSPECT} onSubmit={handleSubmit}>
        <FormTextInput
          id="prospect-name"
          label="Name"
          placeholder="Enter name"
          className="form-control"
          value={values.name}
          minLength={3}
          required
          disabled={isSubmitting}
          onChange={(event) => handleValueChange("name", event.target.value)}
        />
        <FormTextInput
          id="prospect-email"
          label="Email"
          placeholder="Enter email"
          type="email"
          className="form-control"
          value={values.email}
          required
          disabled={isSubmitting}
          onChange={(event) => handleValueChange("email", event.target.value)}
        />
        <FormTextInput
          id="prospect-phone"
          label="Phone number"
          placeholder="Enter phone number"
          type="tel"
          className="form-control"
          value={values.phoneNumber}
          pattern="(?=.*\S)[0-9+() -]{8,}"
          title="Enter a valid phone number, not just spaces."
          required
          disabled={isSubmitting}
          onChange={(event) => handleValueChange("phoneNumber", event.target.value)}
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
              handleValueChange("subscriptionId", event.target.value)
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
              handleValueChange("status", event.target.value as ProspectStatus)
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
