import { ComponentChildren, FunctionComponent, h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { calculateTextColor, cn, hexToRgba } from '../utils';

interface ButtonProps {
  children?: ComponentChildren;
  onClick?: () => void;
  type?: 'submit' | 'button' | 'reset';
  size?: 'md' | 'sm' | 'full';
  isActive?: boolean;
  classname?: string;
  color?: string;
  position?: 'left' | 'right' | 'center';
  variant?: 'default' | 'surveyInput' | 'rounded';
  disabled?: boolean;
}

export const Button: FunctionComponent<ButtonProps> = ({
  type = 'submit',
  isActive = false,
  color = '#050505',
  size = 'md',
  position = 'left',
  variant = 'default',
  disabled = false,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const fontColor = useMemo(() => {
    if (variant === 'default') {
      return calculateTextColor(color);
    }
    return color;
  }, [variant, color]);

  const backgroundColor = useMemo(() => {
    if (variant === 'default') {
      if (disabled) {
        return hexToRgba(color, 0.7);
      }
      return color;
    }

    if (isActive || isHovered) {
      return hexToRgba(color, 0.2);
    }

    return variant === 'surveyInput' ? hexToRgba(color, 0.1) : undefined;
  }, [variant, color, isActive, disabled, isHovered]);

  let widthClasses = 'w-auto';
  if (size === 'md') {
    widthClasses = 'w-32';
  } else if (size === 'sm') {
    widthClasses = 'w-fit';
  } else if (size === 'full') {
    widthClasses = 'w-full';
  }

  const buttonPositionClasses =
    position === 'center' ? 'mx-auto' : position === 'right' ? 'ml-auto' : '';

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={props.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor,
        color: fontColor,
      }}
      className={cn(
        `min-h-[40px]`,
        variant === 'rounded' ? 'rounded-full' : 'rounded-lg',
        widthClasses,
        buttonPositionClasses,
        variant === 'default'
          ? 'text-sm font-semibold px-4 leading-[1.15]'
          : '',
        props.classname ?? ''
      )}
    >
      {props.children}
    </button>
  );
};
