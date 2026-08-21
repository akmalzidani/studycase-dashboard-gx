import { useEffect, useState, type SyntheticEvent } from "react";
import { Modal } from "@/components/common/Modal";
import { FormTextInput } from "@/components/common/FormInput/FormInput";
import { FORM_IDS, MODAL_TARGETS } from "@/config/modal.config";
import { formatCurrencyInput } from "@/helpers/formatters.helpers";
import { hideModal, onModalShown } from "@/helpers/modal.helpers";
import type { Subscription } from "@/types";

export interface SubscriptionFormValues {
  packageName: string;
  speed: number;
  monthlyFee: number;
}

interface SubscriptionFormModalProps {
  isSubmitting: boolean;
  item: Subscription | null;
  onSubmit: (values: SubscriptionFormValues) => Promise<boolean>;
}


const EMPTY_VALUES: SubscriptionFormValues = {
  packageName: "",
  speed: 0,
  monthlyFee: 0,
};

export function SubscriptionFormModal({
  isSubmitting,
  item: subscription,
  onSubmit,
}: SubscriptionFormModalProps) {
  const [values, setValues] = useState<SubscriptionFormValues>(EMPTY_VALUES);

  useEffect(() => {
    const initializeValues = () => {
      setValues(
        subscription
          ? {
              packageName: subscription.packageName,
              speed: subscription.speed,
              monthlyFee: subscription.monthlyFee,
            }
          : EMPTY_VALUES,
      );
    };

    return onModalShown(MODAL_TARGETS.SUBSCRIPTION_FORM, initializeValues);
  }, [subscription]);

  const updateValue = <K extends keyof SubscriptionFormValues>(
    field: K,
    value: SubscriptionFormValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) {
      hideModal(MODAL_TARGETS.SUBSCRIPTION_FORM);
    }
  };

  const isEditing = Boolean(subscription);

  return (
    <Modal
      target={MODAL_TARGETS.SUBSCRIPTION_FORM}
      title={
        isEditing ? "Edit Subscription Package" : "Add Subscription Package"
      }

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
            form={FORM_IDS.SUBSCRIPTION}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Add Package"}
          </button>
        </>
      }
    >
      <form id={FORM_IDS.SUBSCRIPTION} onSubmit={handleSubmit}>
        <FormTextInput
          id="subscription-package-name"
          label="Package name"
          placeholder="Enter package name"
          className="form-control"
          value={values.packageName}
          minLength={2}
          required
          disabled={isSubmitting}
          onChange={(event) => updateValue("packageName", event.target.value)}
        />
        <div className="mb-3">
          <label className="form-label" htmlFor="subscription-speed">
            Speed
          </label>
          <div className="input-group">
            <input
              id="subscription-speed"
              type="number"
              min={1}
              className="form-control"
              value={values.speed || ""}
              placeholder="Example: 100"
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
            Monthly fee
          </label>
          <div className="input-group">
            <span className="input-group-text">Rp</span>
            <input
              id="subscription-monthly-fee"
              placeholder="Enter monthly fee"
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
