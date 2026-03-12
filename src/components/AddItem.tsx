import { useState } from "react";
import useStore from "../store";
import { Input, InputNumber, Modal, notification } from "antd";

export const AddItemModal = () => {
  const [name, setName] = useState("");
  const [coast, setCoast] = useState<number | null>(null);
  const [vendor, setVendor] = useState("");
  const [art, setArt] = useState("");
  const { openModal, setOpenModal, addItem } = useStore();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleOk = () => {
    addProd();
    setConfirmLoading(true);
    setTimeout(() => {
      setOpenModal(false);
      openNotification();
      setConfirmLoading(false);
    }, 1000);
  };

  const openNotification = () => {
    api["success"]({
      title: "Успех",
      description: "Ваш продукт успешно добавлен",
    });
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  const addProd = () => {
    addItem({
      title: name,
      id: 0,
      key: 0,
      price: coast !== null ? coast : 0,
      brand: vendor,
      sku: art,
    });
    clear();
  };

  const clear = () => {
    setName("");
    setArt("");
    setCoast(null);
    setVendor("");
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Добавить продукт"
        open={openModal}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
        okButtonProps={{
          disabled: !(name.length > 0) && !(art.length > 0) && coast == null,
        }}
      >
        <label>Наименование</label>
        <Input
          placeholder="Укажите наименование продукта"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <label>Цена</label>
        <InputNumber
          style={{ width: "100%" }}
          placeholder="Укажите цену продукта, ₽"
          min={1}
          value={coast}
          onChange={(e) => setCoast(e)}
        />
        <label>Вендор</label>
        <Input
          placeholder="Укажите вендора продукта"
          onChange={(e) => setVendor(e.target.value)}
          value={vendor}
        />
        <label>Артикул</label>
        <Input
          placeholder="Укажите артикул продукта"
          onChange={(e) => setArt(e.target.value)}
          value={art}
        />
      </Modal>
    </>
  );
};
