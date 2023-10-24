import * as SelectPrimitive from "@radix-ui/react-select";
import classnames from "classnames";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";

type RadixSelectProps = {
  title: string;
  defaultValue: string;
  options: { label: string; value: string }[];
  onChange?: (value: string) => void;
  register?: UseFormRegisterReturn;
  error?: string;
};

export const Select = ({
  defaultValue,
  options,
  title,
  register,
  error,
}: RadixSelectProps) => {
  return (
    <div className="mb-5">
      <SelectPrimitive.Root
        defaultValue={defaultValue}
        name={register?.name}
        onValueChange={(value) => {
          register?.onChange({ target: { name: register.name, value } });
        }}
        {...register}
      >
        <p className="mb-1.5 text-sm font-medium text-gray-700">{title} </p>
        <SelectPrimitive.Trigger asChild aria-label={title} placeholder={title}>
          <button
            className={`block flex w-full w-full items-center justify-between rounded rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm   ${
              error ? "border-red-500" : ""
            }
          `}
          >
            <SelectPrimitive.Value />
            <SelectPrimitive.Icon>
              <ChevronDownIcon size={"15px"} />
            </SelectPrimitive.Icon>
          </button>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Content>
          <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
            <ChevronUpIcon />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800">
            <SelectPrimitive.Group>
              {options.map((f, i) => (
                <SelectPrimitive.Item
                  disabled={f === options[0]}
                  key={`${f.label}-${i}`}
                  value={f.value}
                  className={classnames(
                    "relative flex items-center rounded-md px-8 py-2 text-sm font-medium text-gray-700 focus:bg-gray-100 dark:text-gray-300 dark:focus:bg-gray-900",
                    "radix-disabled:opacity-50",
                    "select-none focus:outline-none",
                  )}
                >
                  <SelectPrimitive.ItemText>{f.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <CheckIcon />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Group>
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
            <ChevronDownIcon />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Root>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};
