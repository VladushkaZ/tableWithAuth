import { useEffect, useState } from "react";
import useStore from "../store";
import { Input, InputNumber, Modal, notification } from "antd";

export const AddItemModal = () => {
  const { openModal, setOpenModal, addItem } = useStore();
  const [name, setName] = useState("");
  const [coast, setCoast] = useState<number | null>(null);
  const [vendor, setVendor] = useState<string | number | string[]>("");
  const [art, setArt] = useState<string | number | string[]>("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const clear = () => {
    setName("");
    setArt("");
    setCoast(null);
    setVendor("");
  };

  useEffect(() => {
    setTimeout(() => {
      if (openModal?.item) {
        setName(openModal?.item?.title);
        setArt(openModal?.item?.sku);
        setCoast(openModal?.item?.price);
        setVendor(openModal?.item?.brand);
      } else clear();
    }, 100);
  }, [openModal.item]);

  const handleOk = () => {
    if (!openModal.item) addProd();
    setConfirmLoading(true);
    setTimeout(() => {
      openNotification();
      setConfirmLoading(false);
      setOpenModal({ open: false });
    }, 1000);
  };

  const openNotification = () => {
    api["success"]({
      title: "Успех",
      description: "Данные успешно сохранены",
    });
  };

  const handleCancel = () => {
    setOpenModal({ open: false });
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

  return (
    <>
      {contextHolder}
      <Modal
        title={openModal.item ? "Изменить продукт" : "Добавить продукт"}
        open={openModal.open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
        okButtonProps={{
          disabled:
            !(name.length > 0) && !(art.toString().length > 0) && coast == null,
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
