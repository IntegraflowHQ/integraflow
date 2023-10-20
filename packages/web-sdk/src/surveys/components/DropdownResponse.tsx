import { VNode, h } from 'preact';
import { createPortal } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Button, Header } from '../../components';
import { Question, QuestionOption, SurveyAnswer, Theme } from '../../types';
import { hexToRgba } from '../../utils';
import AnswerContainer from './AnswerContainer';

interface DropdownProps {
  question: Question;
  theme?: Theme;
  label: string;
  description?: string;
  onAnswered: (answers: SurveyAnswer[]) => void;
  submitText?: string;
}

export default function DropdownResponse({
  label,
  description,
  question,
  theme,
  onAnswered,
  submitText,
}: DropdownProps): VNode {
  const [selectedOption, setSelectedOption] = useState<QuestionOption | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<QuestionOption[]>(
    question.options as QuestionOption[]
  );
  const [positionBelow, setPositionBelow] = useState(true);
  const [dropdownWidth, setDropdownWidth] = useState(100);
  const [inputRectLeft, setInputRectLeft] = useState(0);
  const [inputRectBottom, setInputRectBottom] = useState(0);
  const [inputRectTop, setInputRectTop] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const answerColor = theme?.answer ?? '#050505';
  const backgroundColor = theme?.background ?? '#FFFFFF';
  const dropDownMaxHeight = 200;

  const handleInputChange = (
    event: h.JSX.TargetedEvent<HTMLInputElement, Event>
  ) => {
    const query = event.currentTarget.value.toLowerCase();
    const filtered = (question.options ?? []).filter((option) =>
      option.label.toLowerCase().includes(query)
    );
    setFilteredOptions(filtered);
    setIsOpen(true);
    setSelectedOption(null);
  };

  const handleOptionClick = (option: QuestionOption) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const calculatePosition = () => {
    if (!inputRef.current) return;
    const inputRect = inputRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    setDropdownWidth(inputRef.current.clientWidth);
    setInputRectLeft(inputRect.left);
    setInputRectTop(windowHeight - inputRect.top);
    setInputRectBottom(inputRect.bottom);

    if (
      windowHeight - inputRect.bottom < dropDownMaxHeight &&
      inputRect.top > dropDownMaxHeight
    ) {
      setPositionBelow(false);
    } else {
      setPositionBelow(true);
    }
  };

  useEffect(() => {
    calculatePosition();
  }, [inputRef.current?.clientWidth]);

  useEffect(() => {
    window.addEventListener('scroll', calculatePosition);
    window.addEventListener('resize', calculatePosition);
    return () => {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
  }, []);

  const dropDownPositionY: h.JSX.CSSProperties = positionBelow
    ? { top: `${inputRectBottom}px` }
    : { bottom: `${inputRectTop}px` };

  const dropdownStyle: h.JSX.CSSProperties = {
    width: `${dropdownWidth}px`,
    maxHeight: `${dropDownMaxHeight}px`,
    backgroundColor,
    position: 'fixed',
    overflowY: 'auto',
    left: inputRectLeft,
    zIndex: 2147483650,
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 5px 40px',
    ...dropDownPositionY,
  };

  const dropdownChildStyle: h.JSX.CSSProperties = {
    padding: '8px',
    color: answerColor,
    backgroundColor,
  };

  const darkenBg = (e: h.JSX.TargetedMouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = hexToRgba(answerColor, 0.1);
  };

  const resetBg = (e: h.JSX.TargetedMouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = backgroundColor;
  };

  const handleSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!selectedOption) return;
    onAnswered([{ answerId: selectedOption.id, answer: selectedOption.label }]);
  };

  return (
    <form autocomplete={'off'} onSubmit={handleSubmit}>
      <AnswerContainer className={'space-y-4'}>
        <Header
          title={label}
          description={description}
          color={theme?.question}
        />

        <input
          ref={inputRef}
          type='text'
          autocomplete={'off'}
          placeholder='Type or select an option'
          value={selectedOption?.label}
          onChange={handleInputChange}
          onClick={toggleDropdown}
          className={'w-full border rounded-md p-2'}
          style={{
            color: answerColor,
            backgroundColor: hexToRgba(answerColor, 0.1),
          }}
        />

        {isOpen &&
          createPortal(
            <AnswerContainer style={dropdownStyle}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    onMouseEnter={darkenBg}
                    onMouseLeave={resetBg}
                    style={dropdownChildStyle}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div
                  style={dropdownChildStyle}
                  onMouseEnter={darkenBg}
                  onMouseLeave={resetBg}
                >
                  No results found
                </div>
              )}
            </AnswerContainer>,
            document.body
          )}

        <Button color={theme?.button} size='full'>
          {submitText ?? 'Submit'}
        </Button>
      </AnswerContainer>
    </form>
  );
}
