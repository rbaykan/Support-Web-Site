import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { creataUser } from "../Service/UserService";

const SignUp = () => {

    const [messageApi, contextHolder] = message.useMessage();

    const info = () => {
        messageApi.info('Registered successfully');
      };


    const [sameUser, setSameUser] = useState(false);

    const [hideButton, setHideButton] = useState(false)
    
  
    const onFinish = (values) => {
      creataUser(values)
        .then((response) => {
            
            setHideButton(true)
            info();
            setTimeout(() => window.location.reload(), 1500);

        })
        .catch((error) => {
          if(error.status == 500){
            setSameUser(true)
          }
        });
    };
  
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
  
    return (
      <>
        {sameUser ? (
          <h2 style={{color: "red", textAlign: "center" }}>The same username is registered</h2>
        ) : (
          <div></div>
        )}
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="First Name"
            name="firstname"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
  
          <Form.Item
            label="Last Name"
            name="lastname"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
  
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
  
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
  
          <Form.Item
            label="Repassword"
            name="repassword"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
  
          <Form.Item label={null}>
            {contextHolder}
            <Button type="primary" htmlType="submit" style={{ display: hideButton ? "none" : "inline-block" }}>
              Signup
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  };
  

export default SignUp;
