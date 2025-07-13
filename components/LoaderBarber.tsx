import React from 'react'
import { Scissors, Sparkles } from 'lucide-react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

// Scissor loading animation
export const ScissorLoader: React.FC<LoaderProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} text-primary-500 animate-scissor-cut`}>
        <Scissors className="w-full h-full" />
      </div>
      {text && (
        <p className="text-sm text-secondary-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

// Razor loading animation (using a custom razor shape)
export const RazorLoader: React.FC<LoaderProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} text-primary-500 animate-razor-glide`}>
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12h18M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {text && (
        <p className="text-sm text-secondary-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

// Sparkles loading animation
export const SparklesLoader: React.FC<LoaderProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} text-gold-500 animate-bounce-gentle`}>
        <Sparkles className="w-full h-full" />
      </div>
      {text && (
        <p className="text-sm text-secondary-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

// Towel fold loading animation
export const TowelLoader: React.FC<LoaderProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-16 h-12',
    md: 'w-20 h-16',
    lg: 'w-28 h-20'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} relative overflow-hidden`}>
        <div className="w-full h-full bg-gradient-to-r from-primary-200 to-primary-300 rounded-lg animate-pulse">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-r from-primary-300 to-primary-400 animate-bounce-gentle" />
          <div className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-r from-primary-400 to-primary-500 animate-bounce-gentle" style={{ animationDelay: '0.1s' }} />
          <div className="absolute top-2/3 left-0 w-full h-1/3 bg-gradient-to-r from-primary-500 to-primary-600 animate-bounce-gentle" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
      {text && (
        <p className="text-sm text-secondary-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

// Comb loading animation
export const CombLoader: React.FC<LoaderProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-8 h-16',
    md: 'w-10 h-20',
    lg: 'w-12 h-24'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="w-full h-4 bg-secondary-400 rounded-t-lg" />
        <div className="w-full h-full bg-secondary-300 relative">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-secondary-500 animate-bounce-gentle"
              style={{
                left: `${12.5 * i}%`,
                top: 0,
                height: '100%',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
      {text && (
        <p className="text-sm text-secondary-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

// Soap bubbles loading animation
export const BubblesLoader: React.FC<LoaderProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} relative`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-200 opacity-70 animate-bounce-gentle"
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${Math.random() * 2 + 1}s`
            }}
          />
        ))}
      </div>
      {text && (
        <p className="text-sm text-secondary-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

// Main barber loader component
export const BarberLoader: React.FC<LoaderProps & { type?: 'scissor' | 'razor' | 'sparkles' | 'towel' | 'comb' | 'bubbles' }> = ({ 
  type = 'scissor', 
  size = 'md', 
  text = 'جاري التحميل...' 
}) => {
  switch (type) {
    case 'razor':
      return <RazorLoader size={size} text={text} />
    case 'sparkles':
      return <SparklesLoader size={size} text={text} />
    case 'towel':
      return <TowelLoader size={size} text={text} />
    case 'comb':
      return <CombLoader size={size} text={text} />
    case 'bubbles':
      return <BubblesLoader size={size} text={text} />
    default:
      return <ScissorLoader size={size} text={text} />
  }
}

// Page loading overlay
export const PageLoader: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <BarberLoader type="scissor" size="lg" />
        <div className="mt-4 text-lg font-medium text-secondary-700">
          جاري تحميل الصفحة...
        </div>
      </div>
    </div>
  )
}

// Button loading state
export const ButtonLoader: React.FC<{ isLoading: boolean; children: React.ReactNode }> = ({ isLoading, children }) => {
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>جاري التحميل...</span>
        </div>
      ) : (
        children
      )}
    </>
  )
}

// Skeleton loader for content
export const SkeletonLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-secondary-200 rounded ${className}`} />
  )
}

// Service card skeleton
export const ServiceCardSkeleton: React.FC = () => {
  return (
    <div className="card">
      <div className="flex items-center space-x-4 mb-4">
        <SkeletonLoader className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <SkeletonLoader className="h-4 mb-2" />
          <SkeletonLoader className="h-3 w-3/4" />
        </div>
      </div>
      <SkeletonLoader className="h-3 mb-2" />
      <SkeletonLoader className="h-3 mb-2" />
      <SkeletonLoader className="h-3 w-1/2" />
      <div className="flex justify-between items-center mt-4">
        <SkeletonLoader className="h-8 w-20" />
        <SkeletonLoader className="h-8 w-24" />
      </div>
    </div>
  )
}

export default BarberLoader 