import React from 'react';
import { Sparkles, Droplets, Zap, Hammer, User } from 'lucide-react';
import { ServiceCategory } from '../types';

interface WorkerAvatarProps {
  name: string;
  category?: ServiceCategory;
  initials?: string;
  badgeColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const WorkerAvatar: React.FC<WorkerAvatarProps> = ({
  name,
  category,
  initials,
  badgeColor,
  size = 'md',
  className = '',
}) => {
  // Generate 2-letter initials if not supplied
  const displayInitials =
    initials ||
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('') ||
    'PRO';

  // Category-specific fallback themes
  const categoryStyles: Record<
    ServiceCategory,
    { bg: string; text: string; iconBg: string; border: string }
  > = {
    cleaning: {
      bg: 'bg-emerald-600',
      text: 'text-white',
      iconBg: 'bg-emerald-700',
      border: 'border-emerald-200',
    },
    plumbing: {
      bg: 'bg-blue-600',
      text: 'text-white',
      iconBg: 'bg-blue-700',
      border: 'border-blue-200',
    },
    electrical: {
      bg: 'bg-amber-600',
      text: 'text-white',
      iconBg: 'bg-amber-700',
      border: 'border-amber-200',
    },
    carpentry: {
      bg: 'bg-indigo-600',
      text: 'text-white',
      iconBg: 'bg-indigo-700',
      border: 'border-indigo-200',
    },
  };

  const defaultTheme = category ? categoryStyles[category] : {
    bg: 'bg-slate-700',
    text: 'text-white',
    iconBg: 'bg-slate-800',
    border: 'border-slate-300',
  };

  const finalBg = badgeColor || defaultTheme.bg;

  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px] rounded-lg',
    sm: 'w-9 h-9 text-xs rounded-xl',
    md: 'w-12 h-12 text-sm rounded-2xl',
    lg: 'w-16 h-16 text-lg rounded-2xl',
    xl: 'w-20 h-20 text-2xl rounded-3xl',
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
  };

  const renderIcon = () => {
    switch (category) {
      case 'cleaning':
        return <Sparkles className={iconSizes[size]} />;
      case 'plumbing':
        return <Droplets className={iconSizes[size]} />;
      case 'electrical':
        return <Zap className={iconSizes[size]} />;
      case 'carpentry':
        return <Hammer className={iconSizes[size]} />;
      default:
        return <User className={iconSizes[size]} />;
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center font-black tracking-wider flex-shrink-0 shadow-sm border select-none ${sizeClasses[size]} ${finalBg} ${defaultTheme.text} ${defaultTheme.border} ${className}`}
      title={`${name} - ${category || 'Verified Professional'}`}
    >
      <span>{displayInitials}</span>

      {/* Trade badge indicator corner */}
      {category && (size === 'md' || size === 'lg' || size === 'xl') && (
        <span
          className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white ring-2 ring-white shadow-xs ${defaultTheme.iconBg}`}
        >
          {renderIcon()}
        </span>
      )}
    </div>
  );
};
