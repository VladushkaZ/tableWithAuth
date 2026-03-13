import useStore from "../store";
import { Modal, notification } from "antd";

export const RemoveItemModal = () => {
  const { openRemoveModal, setOpenRemoveModal } = useStore();

  const [api, contextHolder] = notification.useNotification();

  const handleOk = () => {
    setTimeout(() => {
      openNotification();
      setOpenRemoveModal({open: false});
    }, 1000);
  };

  const openNotification = () => {
    api["success"]({
      title: "Успех",
      description: "Данные успешно удалены",
    });
  };

  const handleCancel = () => {
    setOpenRemoveModal({open: false});
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={"Вы уверены, что хотите удалить продукт?"}
        open={openRemoveModal.open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Удалить"
        cancelText="Отмена"
      >
        Вы уверены, что хотите удалить продукт {openRemoveModal.item?.title}?
      </Modal>
    </>
  );
};
