import { BsSearch } from "react-icons/bs";

interface TableSearchProps {
  value: string;
  actions: {
    handleChange: (value: string) => void;
  };
  placeholder?: string;
}

export function TableSearch({
  value,
  actions,
  placeholder = "Search...",
}: TableSearchProps) {
  return (
    <div className="input-group input-group-sm">
      <span className="input-group-text border-end-0">
        <BsSearch className="text-muted" />
      </span>
      <input
        type="search"
        className="form-control border-start-0"
        placeholder={placeholder}
        value={value}
        onChange={(event) => actions.handleChange(event.target.value)}
      />
    </div>
  );
}
