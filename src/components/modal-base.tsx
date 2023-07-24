import { useModal } from '@ebay/nice-modal-react';
import { twMerge } from 'tailwind-merge';

function ModalBase({ children, id, className, hideCloseButton }: any) {
  const modal = useModal();

  const removeModal = () => {
    modal.hide();
    setTimeout(() => {
      modal.remove();
    }, 200);
  };

  return (
    <>
      <input
        type="checkbox"
        id={id}
        className="modal-toggle"
        checked={modal.visible}
        onChange={removeModal}
      />
      <div className="modal">
        <div className={twMerge('modal-box relative', className)}>
          {!hideCloseButton && (
            <button
              className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2"
              onClick={removeModal}
            >
              ✕
            </button>
          )}

          {children}
        </div>
      </div>
    </>
  );
}

export default ModalBase;
