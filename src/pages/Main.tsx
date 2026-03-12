import CustomTable from "../components/CustomTable";
import { Button, Space } from "antd";
import Search, { type SearchProps } from "antd/es/input/Search";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import useStore from "../store";
import { AddItemModal } from "../components/AddItem";

export const Main = () => {
  const { setPage, setOpenModal, loading, error } = useStore();
  const [search, setSearch] = useState("");
  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearch(value.toLowerCase());
    setPage(1);
  };

  return (
    <>
      <div className="white">
        <div className="flex_simple">
          <h2>Товары</h2>{" "}
          {!loading && !error && (
            <div className="search">
              <Space.Compact>
                <Space.Addon>
                  <SearchOutlined />
                </Space.Addon>
                <Search
                  placeholder="Найти"
                  onSearch={onSearch}
                  allowClear
                  enterButton={""}
                />
              </Space.Compact>
            </div>
          )}
        </div>
      </div>
      <div className="white">
        <div className="flex">
          <h3>Все позиции</h3>
          {!loading && !error && (
            <Button type="primary" onClick={() => setOpenModal(true)}>
              <PlusCircleOutlined /> Добавить
            </Button>
          )}
        </div>
        <CustomTable search={search} />
      </div>
      <AddItemModal />
    </>
  );
}
