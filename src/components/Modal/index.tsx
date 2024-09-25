import React from 'react';
import ReactModal from 'react-modal';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  contentLabel: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onRequestClose, contentLabel, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)'  // Optional: sets a semi-transparent overlay background
        }
      }}
    >
      <button onClick={onRequestClose} style={{
        position: 'absolute',
        top: '30px',
        right: '30px',
        border: 'none',
        background: 'transparent',
        fontSize: '45px',
        fontWeight: 'bold',
        cursor: 'pointer',
        color: '#333'  // Ensure close button is visible in both themes
      }}>
        &times; {/* This is the "X" close button */}
      </button>
      {children}
    </ReactModal>
  );
};

export default Modal;
