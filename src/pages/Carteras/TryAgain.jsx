import React from 'react';
import { useCrmStore } from '../../hooks/useCrmStore';
import { Table, Space, Flex } from 'antd';

const columns = [
  {
    title: 'Rut',
    dataIndex: 'Rut',
    width: 90, // Set a specific width for fixed column
    key: 'Rut',
    fixed: 'left', // Fixing this column to the left
  },
  {
    title: 'Rut Ejecutivo',
    dataIndex: 'Ruteje',
    width: 90, // Set a specific width for fixed column
    key: 'rutejecutivo',
    fixed: 'left', // Fixing this column to the left
  },
  {
    title: 'Fecha Gestión',
    dataIndex: 'Fecha_Gestion',
    key: 'fechagestion',
    width: 190, // Width for scrollable column
  },
  {
    title: 'Fecha Agendada',
    dataIndex: 'Fecha_Agenda',
    key: 'fechaagendada',
    width: 180, // Width for scrollable column
  },
  {
    title: 'Teléfono',
    dataIndex: 'telefono',
    key: 'telefono',
    width: 150, // Width for scrollable column
  },
  {
    title: 'Monto',
    dataIndex: 'monto',
    key: 'monto',
    width: 100, // Width for scrollable column
  },
  {
    title: 'Acción',
    key: 'action',
    fixed: 'right', // Fixing this column to the right
    width: 100, // Set a specific width for fixed column
    render: (text, record) => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

export const TryAgain = () => {
  const { allCallAgain } = useCrmStore();

  // Ensure each item in the dataSource has a unique key
  const dataWithKeys = allCallAgain.map((item, index) => ({
    ...item,
    key: item.Rut || index, // Use Rut as a unique key or fallback to index
  }));

  return (
    <div style={{width:'100%', display:'flex'}} > {/* Use a class to control styling */}
      <div  style={{ width:'100%', height: '100vw', overflow: 'auto' }}>

        <Table
          columns={columns}
          dataSource={dataWithKeys}
          scroll={{
            x: 1200, // Adjust this to ensure horizontal scrolling
          }}
        />
      </div>
    </div>
  );
};
