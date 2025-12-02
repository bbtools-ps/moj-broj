type InputProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  showStepper?: boolean;
} & (
  | {
      min?: undefined;
      max?: undefined;
      allowedValues: number[];
    }
  | {
      min?: number;
      max?: number;
      allowedValues?: undefined;
    }
);

export default function Input({
  allowedValues,
  min = 1,
  max,
  onChange,
  showStepper = true,
  ...rest
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty string
    if (inputValue === '') {
      onChange?.(inputValue);
      return;
    }

    // Only allow integers (digits only)
    if (!/^\d+$/.test(inputValue)) {
      return;
    }

    const numValue = parseInt(inputValue, 10);

    // If allowedValues are provided, validate against them
    if (allowedValues) {
      onChange?.(inputValue);
      return;
    }

    // If min/max are provided, validate range
    if (min !== undefined || max !== undefined) {
      const minVal = min ?? -Infinity;
      const maxVal = max ?? Infinity;

      // Allow typing if the value is within range or could lead to a valid value
      if (numValue < minVal || numValue > maxVal) {
        return;
      }
      onChange?.(inputValue);
      return;
    }
  };

  const cycleValue = (direction: 'up' | 'down') => {
    // Handle allowedValues cycling
    if (allowedValues && allowedValues.length > 0) {
      const sortedValues = [...allowedValues].sort((a, b) => a - b);

      // If empty or invalid, start from first value when going up, last when going down
      if (!rest.value || rest.value === '') {
        onChange?.(
          direction === 'up'
            ? sortedValues[0].toString()
            : sortedValues[sortedValues.length - 1].toString()
        );
        return;
      }

      const currentValue = parseInt(rest.value, 10);
      const currentIndex = sortedValues.indexOf(currentValue);

      let newIndex: number;
      if (direction === 'up') {
        newIndex =
          currentIndex === -1 || currentIndex === sortedValues.length - 1
            ? 0
            : currentIndex + 1;
      } else {
        newIndex =
          currentIndex === -1 || currentIndex === 0
            ? sortedValues.length - 1
            : currentIndex - 1;
      }

      onChange?.(sortedValues[newIndex].toString());
      return;
    }

    // Handle min/max range stepping
    if (min !== undefined && max !== undefined) {
      // If empty or invalid, start from min when going up, max when going down
      if (!rest.value || rest.value === '') {
        onChange?.((direction === 'up' ? min : max).toString());
        return;
      }

      const currentValue = parseInt(rest.value, 10);
      let newValue: number;

      if (direction === 'up') {
        newValue = currentValue >= max ? min : currentValue + 1;
      } else {
        newValue = currentValue <= min ? max : currentValue - 1;
      }

      onChange?.(newValue.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!allowedValues && (!min || !max)) return;

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      cycleValue(e.key === 'ArrowUp' ? 'up' : 'down');
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    if (!allowedValues && (!min || !max)) return;
    if (document.activeElement !== e.currentTarget) return;

    e.preventDefault();
    cycleValue(e.deltaY < 0 ? 'up' : 'down');
  };

  const handleBlur = () => {
    if (rest.value === '' || rest.value === undefined) {
      // If allowedValues exists, use the first value
      if (allowedValues && allowedValues.length > 0) {
        onChange?.(allowedValues[0].toString());
      }
      // Otherwise, use the min value
      else if (min !== undefined) {
        onChange?.(min.toString());
      }
      return;
    }

    // Validate against allowedValues and find closest match
    if (allowedValues && allowedValues.length > 0) {
      const numValue = parseInt(rest.value, 10);

      // Check if the value is already in allowedValues
      if (allowedValues.includes(numValue)) {
        return;
      }

      // Find the closest value
      const closest = allowedValues.reduce((prev, curr) => {
        return Math.abs(curr - numValue) < Math.abs(prev - numValue)
          ? curr
          : prev;
      });

      onChange?.(closest.toString());
    }
  };

  return (
    <div className="relative inline-block">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        {...rest}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        onBlur={handleBlur}
        className="w-3xs rounded-md border-2 border-[#9d9fa5] bg-[#031572] p-3 text-center text-2xl font-medium text-white outline-2 outline-[#031572] focus:outline"
      />
      {showStepper && (
        <div className="absolute top-0 right-0 flex h-full flex-col">
          <button
            type="button"
            onClick={() => cycleValue('up')}
            className="flex h-1/2 items-center justify-center border-2 border-l-0 border-[#9d9fa5] bg-[#031572] px-2 text-white hover:bg-[#042080]"
            style={{ borderTopRightRadius: '0.375rem' }}
          >
            ▲
          </button>
          <button
            type="button"
            onClick={() => cycleValue('down')}
            className="flex h-1/2 items-center justify-center border-2 border-t-0 border-l-0 border-[#9d9fa5] bg-[#031572] px-2 text-white hover:bg-[#042080]"
            style={{ borderBottomRightRadius: '0.375rem' }}
          >
            ▼
          </button>
        </div>
      )}
    </div>
  );
}
