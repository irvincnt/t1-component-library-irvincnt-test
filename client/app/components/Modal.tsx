'use client';

import { HTMLAttributes, forwardRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  showCloseButton?: boolean;
}

interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {}
interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[90vw] max-h-[90vh]',
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      size = 'md',
      closeOnOverlayClick = true,
      closeOnEsc = true,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const handleEscKey = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape' && closeOnEsc) {
          onClose();
        }
      },
      [onClose, closeOnEsc]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleEscKey);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscKey);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, handleEscKey]);

    if (!isOpen) return null;

    const modalContent = (
      <div
        className="
          fixed inset-0 z-50
          flex items-center justify-center
          p-4
        "
        role="dialog"
        aria-modal="true"
      >
        {/* Overlay */}
        <div
          className="
            absolute inset-0
            bg-black/60 backdrop-blur-sm
            animate-fade-in
          "
          onClick={closeOnOverlayClick ? onClose : undefined}
        />

        {/* Modal Content */}
        <div
          ref={ref}
          className={`
            relative
            w-full ${sizeStyles[size]}
            bg-card text-card-foreground
            rounded-[var(--radius-xl)]
            shadow-xl
            animate-scale-in
            overflow-hidden
            ${className}
          `}
          {...props}
        >
          {children}
        </div>
      </div>
    );

    if (typeof window !== 'undefined') {
      return createPortal(modalContent, document.body);
    }

    return null;
  }
);

Modal.displayName = 'Modal';

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className = '', children, onClose, showCloseButton = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          flex items-center justify-between
          px-6 py-4
          border-b border-border
          ${className}
        `}
        {...props}
      >
        <h3 className="text-lg font-semibold">{children}</h3>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="
              p-1.5 rounded-[var(--radius-md)]
              text-muted-foreground
              hover:text-foreground hover:bg-secondary
              transition-colors duration-[var(--transition-fast)]
            "
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          px-6 py-5
          max-h-[60vh] overflow-y-auto
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalBody.displayName = 'ModalBody';

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          flex items-center justify-end gap-3
          px-6 py-4
          border-t border-border
          bg-muted/30
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';

export default Modal;


