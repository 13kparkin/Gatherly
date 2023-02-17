import React from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import './Navigation.css';

function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onItemClick) onItemClick();
  };

  return (
    <Link className='login signup' onClick={onClick}>{itemText}</Link>
  );
}

export default OpenModalMenuItem;