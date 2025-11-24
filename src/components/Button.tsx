/**
 * 通用按钮组件
 * 提供多种样式变体的按钮
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient' | 'success';
  children: React.ReactNode;
}

// 按钮样式变体映射
const buttonStyles = {
  primary: 'bg-black hover:bg-gray-900 text-white',
  secondary: 'bg-gray-800 hover:bg-gray-700 text-white',
  gradient: 'bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white border border-gray-700',
  success: 'bg-black hover:bg-gray-900 text-white border border-red-600',
};

export default function Button({ 
  variant = 'primary', 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={`
        px-6 py-3 rounded-lg transition-all font-semibold
        disabled:opacity-50 disabled:cursor-not-allowed
        ${buttonStyles[variant]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

