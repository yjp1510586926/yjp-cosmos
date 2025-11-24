/**
 * 通用输入框组件
 * 统一的表单输入框样式
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export default function Input({ label, helperText, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm text-gray-700 dark:text-gray-300 block font-semibold">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
          focus:ring-2 focus:ring-gray-900 focus:border-transparent
          dark:bg-gray-800 dark:text-gray-200
          ${className}
        `}
        {...props}
      />
      {helperText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

