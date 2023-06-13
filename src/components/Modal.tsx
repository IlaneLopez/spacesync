/* eslint-disable react/no-unknown-property */
import { motion } from 'framer-motion';
import React from 'react';

interface ModalProps {
  children: React.ReactNode;
  onclose: () => void;
  title: string;
}

const Modal: React.FC<ModalProps> = (props) => {
  //   const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="backdrop"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="card modal"
      >
        <button onClick={() => props.onclose()} className="close-icon">
          x
        </button>
        <div className="title flash-primary">{props.title}</div>
        <div>{props.children}</div>
      </motion.div>{' '}
    </motion.div>
  );
};

export default Modal;
