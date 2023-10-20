import { ComponentChildren, h } from 'preact';

interface Props extends h.JSX.HTMLAttributes<HTMLDivElement> {
  children: ComponentChildren;
  style?: h.JSX.CSSProperties;
}

function AnswerContainer({ children, ...props }: Props) {
  let style: h.JSX.CSSProperties = {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: 'normal',
  };

  if (props.style) {
    style = { ...style, ...props.style };
  }

  return (
    <div {...props} style={style}>
      {children}
    </div>
  );
}

export default AnswerContainer;
