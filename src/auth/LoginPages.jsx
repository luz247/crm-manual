import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Row, Col } from 'antd';
import Swal from 'sweetalert2';
import { useAuthStore } from '../hooks/useAuthStore';
import { useForm } from '../hooks/useForm';

const inicial = {
    loginrut: '',
    loginPassword: '',
};

export const LoginPages = () => {
    const { startLogin, errorMessage, startRegister } = useAuthStore();
    const { formState, onInputChange } = useForm(inicial);
    const [selectedCompany, setSelectedCompany] = useState('');

    const handleCheckboxChange = (e) => {
        console.log(e.target.name);
        setSelectedCompany(e.target.name);
    };

    const loginSubmit = (event) => {
        event.preventDefault();
        startLogin({ rut: formState.loginrut, company: selectedCompany });
    };

    useEffect(() => {
        if (errorMessage) {
            Swal.fire('Error en la autenticación', errorMessage, 'error');
        }
    }, [errorMessage]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '20px'
        }}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onSubmitCapture={loginSubmit}
                onFinishFailed={(errorInfo) => {
                    console.log('Failed:', errorInfo);
                }}
                autoComplete="off"
                style={{ maxWidth: 600, width: '100%' }}
            >
                <Form.Item
                    label="RUT"
                    name="loginrut"
                    rules={[{ required: true, message: 'Please input your RUT!' }]}
                >
                    <Input name='loginrut' onChange={onInputChange} />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="loginPassword"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password name='loginPassword' onChange={onInputChange} />
                </Form.Item>

                <Form.Item
                    label="Companies"
                    wrapperCol={{ offset: 8, span: 16 }}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8}><Checkbox name="avo" checked={selectedCompany === 'avo'} onChange={handleCheckboxChange}>AVO</Checkbox></Col>
                        <Col xs={24} sm={12} md={8}><Checkbox name="acsa" checked={selectedCompany === 'acsa'} onChange={handleCheckboxChange}>ACSA</Checkbox></Col>
                        <Col xs={24} sm={12} md={8}><Checkbox name="global" checked={selectedCompany === 'global'} onChange={handleCheckboxChange}>GLOBAL</Checkbox></Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8}><Checkbox name="svia" checked={selectedCompany === 'svia'} onChange={handleCheckboxChange}>SVIA</Checkbox></Col>
                    </Row>
                </Form.Item>

                <Form.Item
                    wrapperCol={{ offset: 8, span: 16 }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
