export interface FormModalProps<TItem, TValues> {
  isOpen: boolean;
  isSubmitting: boolean;
  item: TItem | null;
  onClose: () => void;
  onSubmit: (values: TValues) => Promise<boolean>;
}
