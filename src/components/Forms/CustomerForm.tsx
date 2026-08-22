import { useEffect, useState, type SyntheticEvent } from "react";
import { FORM_IDS, OVERLAY_TARGETS } from "@/config/overlay.config";
import { Offcanvas } from "@/components/common/Offcanvas";
import { FormTextInput } from "@/components/common/FormInput";
import type { Customer, CustomerStatus, Subscription } from "@/types";
import { formatSpeed } from "@/helpers/formatters.helpers";
import { hideOffcanvas, onOffcanvasShown } from "@/helpers/offcanvas.helpers";

export interface CustomerFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  subscriptionId: string;
  status: CustomerStatus;
}

interface CustomerFormProps {
  isSubmitting: boolean;
  item: Customer | null;
  subscriptions: Subscription[];
  onSubmit: (values: CustomerFormValues) => Promise<boolean>;
}

const STATUS_OPTIONS: CustomerStatus[] = ["Active", "Blocked"];
const PHONE_NUMBER_PATTERN = "[0-9]{8,15}";
const PHONE_NUMBER_TITLE = "Enter a phone number containing 8 to 15 digits.";

export function CustomerForm({
  isSubmitting,
  item: customer,
  subscriptions,
  onSubmit,
}: CustomerFormProps) {
  const [values, setValues] = useState<CustomerFormValues>({
    name: "",
    email: "",
    phoneNumber: "",
    subscriptionId: "",
    status: "Active",
  });

  useEffect(() => {
    const initializeValues = () => {
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
    };

    return onOffcanvasShown(OVERLAY_TARGETS.CUSTOMER_FORM, initializeValues);
  }, [customer, subscriptions]);

  const handleValueChange = <K extends keyof CustomerFormValues>(
    field: K,
    value: CustomerFormValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) {
      hideOffcanvas(OVERLAY_TARGETS.CUSTOMER_FORM);
    }
  };

  const isEditing = Boolean(customer);

  return (
    <Offcanvas
      target={OVERLAY_TARGETS.CUSTOMER_FORM}
      title={isEditing ? "Edit Customer" : "Add Customer"}

      footer={
        <>
          <button
            type="button"
            className="btn btn-light"
            disabled={isSubmitting}
            data-bs-dismiss="offcanvas"
          >
            Cancel
          </button>
          <button
            type="submit"
            form={FORM_IDS.CUSTOMER}
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
      <form id={FORM_IDS.CUSTOMER} onSubmit={handleSubmit} className="row g-3">
        <div className="col-12">
          <FormTextInput
            id="customer-name"
            label="Name"
            className="form-control"
            placeholder="Enter name"
            value={values.name}
            minLength={3}
            required
            disabled={isSubmitting}
            onChange={(event) => handleValueChange("name", event.target.value)}
          />
        </div>
        <div className="col-12 col-md-6">
          <FormTextInput
            id="customer-email"
            label="Email"
            placeholder="Enter email"
            type="email"
            className="form-control"
            value={values.email}
            required
            disabled={isSubmitting}
            onChange={(event) => handleValueChange("email", event.target.value)}
          />
        </div>
        <div className="col-12 col-md-6">
          <FormTextInput
            id="customer-phone"
            label="Phone number"
            placeholder="Enter phone number"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            className="form-control"
            value={values.phoneNumber}
            pattern={PHONE_NUMBER_PATTERN}
            title={PHONE_NUMBER_TITLE}
            minLength={8}
            maxLength={15}
            required
            disabled={isSubmitting}
            onChange={(event) =>
              handleValueChange(
                "phoneNumber",
                event.target.value.replace(/\D/g, ""),
              )
            }
          />
        </div>
        <div className="col-12 col-md-8">
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
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="customer-status">
            Status
          </label>
          <select
            id="customer-status"
            className="form-select"
            value={values.status}
            disabled={isSubmitting}
            onChange={(event) =>
              handleValueChange("status", event.target.value as CustomerStatus)
            }
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>
      </form>
    </Offcanvas>
  );
}
