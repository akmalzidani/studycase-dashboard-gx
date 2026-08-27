import { useEffect, useState, type SyntheticEvent } from "react";
import { FORM_IDS, OVERLAY_TARGETS } from "@/config/overlay.config";
import { Offcanvas } from "@/components/common/Offcanvas";
import { FormTextInput } from "@/components/common/FormInput";
import type { Customer, CustomerStatus, Subscription } from "@/types";
import { formatSpeed } from "@/helpers/formatters.helpers";
import { hideOffcanvas, onOffcanvasShown } from "@/helpers/offcanvas.helpers";
import { BsEnvelope, BsTelephone } from "react-icons/bs";

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
  actions: {
    handleSubmit: (values: CustomerFormValues) => Promise<boolean>;
  };
}

const STATUS_OPTIONS: CustomerStatus[] = ["Active", "Blocked"];
const PHONE_NUMBER_PATTERN = "[0-9]{8,15}";
const PHONE_NUMBER_TITLE = "Enter a phone number containing 8 to 15 digits.";

export function CustomerForm({
  isSubmitting,
  item: customer,
  subscriptions,
  actions,
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

  const _handleValueChange = <K extends keyof CustomerFormValues>(
    field: K,
    value: CustomerFormValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const _handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await actions.handleSubmit(values)) {
      hideOffcanvas(OVERLAY_TARGETS.CUSTOMER_FORM);
    }
  };

  const isEditing = Boolean(customer);

  return (
    <Offcanvas
      target={OVERLAY_TARGETS.CUSTOMER_FORM}
      title={isEditing ? "Edit Customer" : "Add Customer"}

      actions={
        <>
          <button
            type="submit"
            form={FORM_IDS.CUSTOMER}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Submit"}
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={isSubmitting}
            data-bs-dismiss="offcanvas"
          >
            Cancel
          </button>
        </>
      }
    >
      <form id={FORM_IDS.CUSTOMER} onSubmit={_handleSubmit} className="row">
        <div className="col-12 col-md-6">
          <FormTextInput
            id="customer-name"
            label="Name"
            className="form-control"
            placeholder="Enter name"
            value={values.name}
            minLength={3}
            required
            disabled={isSubmitting}
            onChange={(event) => _handleValueChange("name", event.target.value)}
          />
        </div>
        <div className="col-12 col-md-6">
          <FormTextInput
            id="customer-email"
            label="Email"
            placeholder="Enter email"
            type="email"
            className="form-control"
            startAdornment={<BsEnvelope />}
            value={values.email}
            required
            disabled={isSubmitting}
            onChange={(event) =>
              _handleValueChange("email", event.target.value)
            }
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
            startAdornment={<BsTelephone />}
            value={values.phoneNumber}
            pattern={PHONE_NUMBER_PATTERN}
            title={PHONE_NUMBER_TITLE}
            minLength={8}
            maxLength={15}
            required
            disabled={isSubmitting}
            onChange={(event) =>
              _handleValueChange(
                "phoneNumber",
                event.target.value.replace(/\D/g, ""),
              )
            }
          />
        </div>
        <div className="col-12 col-md-6">
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
              _handleValueChange("subscriptionId", event.target.value)
            }
          >
            {subscriptions.map((subscription) => (
              <option key={subscription.id} value={subscription.id}>
                {subscription.packageName} — {formatSpeed(subscription.speed)}
              </option>
            ))}
          </select>
        </div>
        <fieldset className="col-12 col-md-6">
          <label className="form-label mb-2">Status</label>
          <div className="d-flex flex-wrap gap-3">
            {STATUS_OPTIONS.map((status) => (
              <div key={status} className="form-check">
                <input
                  id={`customer-status-${status.toLowerCase()}`}
                  className="form-check-input"
                  type="radio"
                  name="customer-status"
                  value={status}
                  checked={values.status === status}
                  disabled={isSubmitting}
                  onChange={() => _handleValueChange("status", status)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`customer-status-${status.toLowerCase()}`}
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </form>
    </Offcanvas>
  );
}
