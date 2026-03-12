import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Alert,
  type CheckboxProps,
  Spin,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { useNavigate } from "react-router-dom";
import useStore from "../store";
import logo from "/logo-icon.png";

interface LoginValues {
  username?: string;
  password?: string;
  remember?: boolean;
}

export const Login: React.FC = () => {
  const { isAuth, login, setRemember, token, error, loading } = useStore();
  const navigate = useNavigate();
  const onFinish = (values: LoginValues) => {
    login(values);
  };

  useEffect(() => {
    if (isAuth && token) navigate("/");
  }, [isAuth]);

  const onChange: CheckboxProps["onChange"] = (e) => {
    setRemember(e.target.checked);
  };

  return (
    <div className="login-form">
      <Card style={{ width: 527 }}>
        <div className="text-center">
          <img src={logo} className="logo" alt="logo" />

          <h1>Добро пожаловать!</h1>
          <p className="grey-title">Пожалуйста, авторизуйтесь</p>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <label>Логин</label>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Пожалуйста, введите логин!" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Логин" />
          </Form.Item>

          <label>Пароль</label>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Пожалуйста, введите пароль!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>
          {error && <Alert title={error} type="error" />}
          {loading ? (
            <div className="spin">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox onChange={onChange}>Запомнить данные</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="submit-btn">
                  Войти
                </Button>
              </Form.Item>
            </>
          )}
          <div className="text-center">
            <div className="separator">
              <span>или</span>
            </div>
            <span className="grey">Нет аккаунта</span>{" "}
            <a href="https://dummyjson.com/docs/users" target="_blank">
              Создать?
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
};
