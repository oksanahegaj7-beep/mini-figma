import { useState, useEffect } from 'react';

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  style: React.CSSProperties;
};

export const TextInput = ({ value, onChange, style }: TextInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  if (!isEditing) {
    return (
      <div
        style={style}
        onDoubleClick={() => setIsEditing(true)}
        className="whitespace-pre-wrap break-words"
      >
        {value || 'Нажмите дважды для редактирования'}
      </div>
    );
  }

  return (
    <textarea
      autoFocus
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={() => {
        onChange(editValue);
        setIsEditing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          onChange(editValue);
          setIsEditing(false);
        }
        if (e.key === 'Escape') {
          setIsEditing(false);
        }
      }}
      style={{
        ...style,
        background: 'white',
        border: '1px solid #3b82f6',
        outline: 'none',
        resize: 'none',
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
      }}
      className="whitespace-pre-wrap break-words"
    />
  );
};