import { useEffect, useState } from "react";
import useStore from "../store";
import {
  Alert,
  Button,
  Dropdown,
  Progress,
  Spin,
  Table,
  type MenuProps,
  type TableColumnsType,
  type TableProps,
} from "antd";
import type { TableRowSelection } from "antd/es/table/interface";
import { DeleteOutlined, EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import LoadedImage from "./LoadedImage";

interface Item {
  key: string | number;
  id: number;
  title: string;
  price: number;
  [key: string]: string | number | string[];
}

interface Props {
  search: string;
}

const CustomTable: React.FC<Props> = ({ search }: Props) => {
  const {
    cache,
    loading,
    error,
    percent,
    total,
    getItems,
    currentPage,
    setPage,
    searchString,
    sortParams,
    setSortParams,
    setOpenModal,
    setOpenRemoveModal
  } = useStore();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [current, setCurrent] = useState<Item>();
  const pageSize = 20;

  useEffect(() => {
    getItems(currentPage, pageSize, search, sortParams);
    setTimeout(() => {
      setSelectedRowKeys([]);
    }, 500);
  }, [
    currentPage,
    search,
    searchString,
    sortParams?.sortOrder,
    sortParams?.sortField,
  ]);

  const currentData = cache[searchString];
  const totalCount = total[searchString];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<Item> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <Button onClick={() => current && setOpenModal({open: true, item:current})}>
        Изменить
      </Button>
    ),
  },
  {
    key: '2',
    label: (
      <Button onClick={() => current && setOpenRemoveModal({open: true, item:current})}>
        <DeleteOutlined />
        Удалить
      </Button>
    ),
  },
];

  const dataSource = currentData?.map<Item>((item, i) => ({
    key: i,
    id: item.id,
    title: item.title,
    brand: item.brand,
    sku: item.sku,
    rating: item.rating,
    price: item.price,
    images: item.images,
    category: item.category,
  }));

  const columns: TableColumnsType<Item> = [
    {
      title: "Наименование",
      width: 300,
      dataIndex: "title",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
      render: (_, item) => (
        <div className="flex_simple">
          {typeof item.images == "object" && (
            <LoadedImage url={item.images[0]} />
          )}
          <div>
            <b>{item.title}</b>
            <p className="grey">{item.category}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Вендор",
      width: 150,
      align: "center",
      dataIndex: "brand",
      sorter: true,
      render: (_, item) => <b>{item.brand}</b>,
    },
    {
      title: "Артикул",
      width: 150,
      align: "center",
      dataIndex: "sku",
      sorter: true,
    },
    {
      title: "Оценка",
      width: 150,
      sorter: true,
      align: "center",
      dataIndex: "rating",
      render: (_, item) => (
        <>
          {item.rating && (
            <p>
              <span className={+item.rating < 3 ? "red" : ""}>
                {item.rating}
              </span>
              /5
            </p>
          )}
        </>
      ),
    },
    {
      title: "Цена, ₽",
      width: 150,
      align: "center",
      dataIndex: "price",
      sorter: true,
      render: (_, item) => (
        <p className="price">
          {Math.trunc(item.price).toLocaleString("ru-RU")}
          <span className="grey">
            ,{Math.trunc((item.price - Math.trunc(item.price)) * 100)}
          </span>
        </p>
      ),
    },
    {
      title: "",
      key: "key",
      width: 20,
      render: (_, item) => (
        <div className="flex_simple">
          <Button type="primary">
            <PlusOutlined />
          </Button>
          <Dropdown menu={{ items }} placement="bottomLeft" onOpenChange={()=>setCurrent(item)}>
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];
  const onChange: TableProps<Item>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra,
  ) => {
    console.log("params", pagination, filters, sorter, extra);
    setSortParams({
      sortOrder:
        Array.isArray(sorter) || Object.keys(sorter).length == 0
          ? sortParams.sortOrder
          : sorter.order == "ascend"
            ? "asc"
            : "desc",
      sortField:
        Array.isArray(sorter) || Object.keys(sorter).length == 0
          ? sortParams.sortField
          : sorter.field,
    });
  };
  return (
    <div className="">
      {loading && (
        <Progress
          percent={percent}
          status={percent === 100 ? "success" : "active"}
        />
      )}
      {loading ? (
        <div className="spin">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert title={error} type="error" />
      ) : (
        <>
          <Table<Item>
            columns={columns}
            dataSource={dataSource}
            rowSelection={rowSelection}
            showSorterTooltip={{ target: "sorter-icon" }}
            onChange={onChange}
            pagination={{
              pageSize,
              total: totalCount,
              current: currentPage,
              hideOnSinglePage: true,
              showSizeChanger: false,
              onChange: (value) => setPage(value),
            }}
          />
          <div className="counter">
            <span className="grey">Показано</span>{" "}
            {currentPage * pageSize - pageSize + 1}-{currentPage * pageSize}{" "}
            <span className="grey">из</span> {totalCount}
          </div>
        </>
      )}
    </div>
  );
};
export default CustomTable;
