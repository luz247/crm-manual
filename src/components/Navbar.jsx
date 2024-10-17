import React, { useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Button } from 'antd';
import { useCrmStore } from '../hooks/useCrmStore';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

export const Navbar = ({ logo, collapsed, setCollapsed }) => {
  const { allInfo, validarRutback } = useCrmStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (e, path) => {
    if (location.pathname === path) {
      
      e.preventDefault();
      console.log("Navegación bloqueada porque ya estás en esta página.");
    }
  };

  const handleBackButtonClick = () => {
    navigate(allInfo.company);

  };

  const handleLogoutButtonClick = () => {
     window.location.reload();

  };

  const menuItems = useMemo(() => [
    { key: 'avo', label: 'Vespucio Oriente', path: '/avo/' },
    { key: 'svia', label: 'Survia', path: '/svia/' },
    { key: 'global', label: 'Global', path: '/global/' },
    { key: 'acsa', label: 'Acsa', path: '/acsa/' }
  ].map(item => ({
    key: item.key,
    label: (
      <Link to={item.path} onClick={(e) => handleMenuClick(e, item.path)} style={{
        color: allInfo.company === item.key ? 'black' : '#c0c0c0',
        fontWeight: allInfo.company === item.key ? 'bold' : 'normal'
      }}>
        {item.label}
      </Link>
    ),
  })), [allInfo, location.pathname]);

  return (
    <Layout.Header style={{
      display: "flex",
      alignItems: "center",
      position: "fixed",
      justifyContent: 'space-around',
      top: 0,
      width: "100%",
      zIndex: 1000,
      padding: '0 20px',
      backgroundColor: 'white'
    }}>
      <div style={{ flex: 2, display: 'flex', alignItems: 'center' }}>
        <Button
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            border: 'none'
          }}
        />

        <div style={{ height: 50, width: 64, marginLeft: '30px' }}>
          <img src={logo} style={{ width: '100%', height: '100%' }} alt="logo" />
        </div>
      </div>
      <div style={{flex:'2'}}>
        <h3 style={{ fontFamily: '', fontWeight: 900, color: '#023535' }}>CRM Manual</h3>
      </div>

      <div  style={{ flex:'1', display:'flex', justifyContent:'space-between' }}>

        <Button
          style={{
            fontSize: '16px',
            border: 'none',
          }}
          onClick={handleBackButtonClick}
        >
          Atras
        </Button>
        <Button
          style={{
            fontSize: '16px',
            border: 'none',
            flex: 1
          }}
          onClick={handleLogoutButtonClick}
        >
          Salir
        </Button>
      </div>
    </Layout.Header>
  );
};
