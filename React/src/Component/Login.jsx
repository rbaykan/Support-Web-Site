import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { loginUser } from '../Service/UserService';


const Login = () => {


    const onFinish = values => {
        loginUser(values)
                .then((response) => {
                    const token = response.data; 
                    localStorage.setItem("userToken", token);
                    window.location.reload();
                })
                .catch((error) => {
                  if(error.status == 404){
                    setInvalidUser(true)
                  }
                });


      }
      const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      }

   const [invalidUser, setInvalidUser] = useState(false);
    
    
    return(
        <>
            {invalidUser ? (
          <h2 style={{color: "red", textAlign: "center" }}>Invaild User</h2>
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
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>


                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </>
        )
    }

export default Login;