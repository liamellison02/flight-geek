import React from 'react';
import { AlertCircle, Check, Info, X } from 'lucide-react';

const Alert = ({ children, variant = 'default', className = '', ...props }) => {
  const baseClasses = "relative w-full rounded-lg border p-4";
  
  const variants = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    destructive: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800"
  };

  const icons = {
    default: <Info className="h-4 w-4" />,
    destructive: <AlertCircle className="h-4 w-4" />,
    success: <Check className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />
  };

  return (
    <div
      role="alert"
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {icons[variant]}
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

const AlertTitle = ({ children, className = '', ...props }) => {
  return (
    <h5
      className={`mb-1 font-medium leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h5>
  );
};

const AlertDescription = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`text-sm [&_p]:leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Alert, AlertTitle, AlertDescription };