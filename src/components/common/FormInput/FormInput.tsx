import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const NON_WHITESPACE_PATTERN = ".*\\S.*";

const whitespaceValidationMessage = (label: string) =>
  `${label} tidak boleh hanya berisi spasi.`;

const setWhitespaceValidity = (
  input: HTMLInputElement | HTMLTextAreaElement,
  label: string,
) => {
  input.setCustomValidity(
    input.value && !input.value.trim() ? whitespaceValidationMessage(label) : "",
  );
};

interface FormTextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  validationLabel?: string;
  onChange: InputHTMLAttributes<HTMLInputElement>["onChange"];
}

export function FormTextInput({
  id,
  label,
  validationLabel = label,
  onChange,
  ...inputProps
}: FormTextInputProps) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        {...inputProps}
        id={id}
        pattern={inputProps.pattern ?? NON_WHITESPACE_PATTERN}
        title={inputProps.title ?? whitespaceValidationMessage(validationLabel)}
        onChange={(event) => {
          setWhitespaceValidity(event.currentTarget, validationLabel);
          onChange?.(event);
        }}
      />
    </div>
  );
}

interface FormTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label: string;
  validationLabel?: string;
  onChange: TextareaHTMLAttributes<HTMLTextAreaElement>["onChange"];
}

export function FormTextarea({
  id,
  label,
  validationLabel = label,
  onChange,
  ...textareaProps
}: FormTextareaProps) {
  return (
    <div className="mb-4">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        {...textareaProps}
        id={id}
        title={textareaProps.title ?? whitespaceValidationMessage(validationLabel)}
        onChange={(event) => {
          setWhitespaceValidity(event.currentTarget, validationLabel);
          onChange?.(event);
        }}
      />
    </div>
  );
}
