import { useEffect, useState, type SyntheticEvent } from "react";
import { MODAL_TARGETS } from "@/config/modal.config";
import { Modal, type FormModalProps } from "@/components/common/Modal";
import { FormTextInput } from "@/components/common/FormInput/FormInput";
import type { Customer, CustomerStatus, Subscription } from "@/types";
import { formatSpeed } from "@/helpers/formatters.helpers";

export interface CustomerFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  subscriptionId: string;
  status: CustomerStatus;
}

interface CustomerFormModalProps extends FormModalProps<
  Customer,
  CustomerFormValues
> {
  subscriptions: Subscription[];
}

const STATUS_OPTIONS: CustomerStatus[] = ["Active", "Blocked"];
const FORM_ID = "customer-form";

export function CustomerFormModal({
  isOpen,
  isSubmitting,
  item: customer,
  subscriptions,
  onClose,
  onSubmit,
}: CustomerFormModalProps) {
  const [values, setValues] = useState<CustomerFormValues>({
    name: "",
    email: "",
    phoneNumber: "",
    subscriptionId: "",
    status: "Active",
  });

  useEffect(() => {
    if (!isOpen) return;

    setValues(
      customer
        ? {
            name: customer.name,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            subscriptionId: customer.subscription.id ?? "",
            status: customer.status,
          }
        : {
            name: "",
            email: "",
            phoneNumber: "",
            subscriptionId: subscriptions[0]?.id ?? "",
            status: "Active",
          },
    );
  }, [customer, isOpen, subscriptions]);

  const updateValue = <K extends keyof CustomerFormValues>(
    field: K,
    value: CustomerFormValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) onClose();
  };

  const isEditing = Boolean(customer);

  return (
    <Modal
      target={MODAL_TARGETS.CUSTOMER_FORM}
      title={isEditing ? "Edit Customer" : "Add Customer"}
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
            Cancel
          </button>
          <button
            type="submit"
            form={FORM_ID}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Add Customer"}
          </button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit}>
        <FormTextInput
          id="customer-name"
          label="Name"
          className="form-control"
          placeholder="Enter name"
          value={values.name}
          minLength={3}
          required
          disabled={isSubmitting}
          onChange={(event) => updateValue("name", event.target.value)}
        />
        <FormTextInput
          id="customer-email"
          label="Email"
          placeholder="Enter email"
          type="email"
          className="form-control"
          value={values.email}
          required
          disabled={isSubmitting}
          onChange={(event) => updateValue("email", event.target.value)}
        />
        <FormTextInput
          id="customer-phone"
          label="Phone number"
          placeholder="Enter phone number"
          type="tel"
          className="form-control"
          value={values.phoneNumber}
          pattern="(?=.*\S)[0-9+() -]{8,}"
          title="Enter a valid phone number, not just spaces."
          required
          disabled={isSubmitting}
          onChange={(event) => updateValue("phoneNumber", event.target.value)}
        />
        <div className="mb-3">
          <label className="form-label" htmlFor="customer-subscription">
            Subscription
          </label>
          <select
            id="customer-subscription"
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
          <label className="form-label" htmlFor="customer-status">
            Status
          </label>
          <select
            id="customer-status"
            className="form-select"
            value={values.status}
            disabled={isSubmitting}
            onChange={(event) =>
              updateValue("status", event.target.value as CustomerStatus)
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
