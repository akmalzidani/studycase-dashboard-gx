import { useEffect, useState, type SyntheticEvent } from "react";
import { FORM_IDS, OVERLAY_TARGETS } from "@/config/overlay.config";
import { Offcanvas } from "@/components/common/Offcanvas";
import { FormTextInput } from "@/components/common/FormInput";
import type { Prospect, ProspectStatus, Subscription } from "@/types";
import { formatSpeed } from "@/helpers/formatters.helpers";
import { hideOffcanvas, onOffcanvasShown } from "@/helpers/offcanvas.helpers";
import { BsEnvelope, BsTelephone } from "react-icons/bs";

export interface ProspectFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  subscriptionId: string;
  status: ProspectStatus;
}

interface ProspectFormProps {
  isSubmitting: boolean;
  item: Prospect | null;
  subscriptions: Subscription[];
  onSubmit: (values: ProspectFormValues) => Promise<boolean>;
}

const STATUS_OPTIONS: ProspectStatus[] = ["Pending", "Completed"];
const PHONE_NUMBER_PATTERN = "[0-9]{8,15}";
const PHONE_NUMBER_TITLE = "Enter a phone number containing 8 to 15 digits.";

export function ProspectForm({
  isSubmitting,
  item: prospect,
  subscriptions,
  onSubmit,
}: ProspectFormProps) {
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

    return onOffcanvasShown(OVERLAY_TARGETS.PROSPECT_FORM, initializeValues);
  }, [prospect, subscriptions]);

  const handleValueChange = <K extends keyof ProspectFormValues>(
    field: K,
    value: ProspectFormValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) {
      hideOffcanvas(OVERLAY_TARGETS.PROSPECT_FORM);
    }
  };

  const isEditing = Boolean(prospect);

  return (
    <Offcanvas
      target={OVERLAY_TARGETS.PROSPECT_FORM}
      title={isEditing ? "Edit Prospect" : "Add Prospect"}

      actions={
        <>
          <button
            type="submit"
            form={FORM_IDS.PROSPECT}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Submit"}
          </button>
          <button
            type="button"
            className="btn btn-light"
            disabled={isSubmitting}
            data-bs-dismiss="offcanvas"
          >
            Cancel
          </button>
        </>
      }
    >
      <form id={FORM_IDS.PROSPECT} onSubmit={handleSubmit} className="row">
        <div className="col-6">
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
        </div>
        <div className="col-6">
          <FormTextInput
            id="prospect-email"
            label="Email"
            placeholder="Enter email"
            type="email"
            className="form-control"
            startAdornment={<BsEnvelope />}
            value={values.email}
            required
            disabled={isSubmitting}
            onChange={(event) => handleValueChange("email", event.target.value)}
          />
        </div>
        <div className="col-6">
          <FormTextInput
            id="prospect-phone"
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
              handleValueChange(
                "phoneNumber",
                event.target.value.replace(/\D/g, ""),
              )
            }
          />
        </div>
        <div className="col-6">
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
        <fieldset className="col-12">
          <label className="form-label">Status</label>
          <div className="d-flex flex-wrap gap-3">
            {STATUS_OPTIONS.map((status) => (
              <div key={status} className="form-check">
                <input
                  id={`prospect-status-${status.toLowerCase()}`}
                  className="form-check-input"
                  type="radio"
                  name="prospect-status"
                  value={status}
                  checked={values.status === status}
                  disabled={isSubmitting}
                  onChange={() => handleValueChange("status", status)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`prospect-status-${status.toLowerCase()}`}
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
