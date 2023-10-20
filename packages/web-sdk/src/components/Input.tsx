import { h } from 'preact';
import { FormField, FormFieldType, ID } from '../types';
import { hexToRgba } from '../utils';
import { JSXInternal } from 'preact/src/jsx';
import { useMemo } from 'preact/hooks';

type Props = {
  option: FormField;
  label?: string;
  color?: string;
  name: string;
  value: string;
  id: ID;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
};
export const Input = ({
  option,
  label,
  color = '#050505',
  name,
  id,
  placeholder,
  value,
  required,
  onChange,
}: Props) => {
  const inputType = useMemo(() => {
    switch (option.type) {
      case FormFieldType.EMAIL:
        return 'email';
      case FormFieldType.WEBSITE:
        return 'url';
      default:
        return 'text';
    }
  }, [option.type]);

  return (
    <div>
      <label
        style={{
          color: color,
        }}
        className={'block mb-1'}
        htmlFor={id + ''}
      >
        {label}
        {required ? <span>{'*'}</span> : null}
      </label>
      <input
        type={inputType}
        className={'w-full border rounded-md p-2'}
        style={{
          color: color,
          backgroundColor: hexToRgba(color, 0.1),
        }}
        required={required}
        name={name}
        id={id + ''}
        placeholder={placeholder}
        value={value}
        onInput={(e) => onChange(e.currentTarget.value)}
      />
    </div>
  );
};
