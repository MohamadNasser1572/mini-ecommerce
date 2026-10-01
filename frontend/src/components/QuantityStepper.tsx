type QuantityStepperProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function QuantityStepper({ value, max, onChange, disabled = false }: QuantityStepperProps) {
  const buttonClass = "h-10 w-10 text-lg text-slate-700 hover:bg-slate-50 disabled:text-slate-300 disabled:hover:bg-transparent";

  return (
    <div className="inline-flex w-fit items-center rounded-md border border-slate-300 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= 1}
        className={buttonClass}
      >
        &minus;
      </button>
      <span className="w-10 text-center text-sm font-medium text-slate-900" aria-live="polite" aria-label="Quantity">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        className={buttonClass}
      >
        +
      </button>
    </div>
  );
}
