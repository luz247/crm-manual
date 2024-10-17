import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, Collapse, Table } from "antd";
import { useCrmStore } from "../hooks/useCrmStore";
import { getColumns } from "../hooks/useTable.js";
import { v4 as uuidv4 } from 'uuid';
import '../assets/css/index.css';
import { replaceSectorDeuda } from "../helpers/validators.js";

export const MasInfo = () => {
  const [columns, setColumns] = useState([]);
  const [columnsGestion, setColumnsGestion] = useState([]);
  const { tickets, allInfo, acsaTicket, setColor, Gestiones } = useCrmStore();




  const createColumns = (company) => {


    let newColumns = getColumns(company);

    if (company === 'global') {
      newColumns = newColumns.map(column => {
        if (column.dataIndex === 'numerocomprobantefiscal') {
          return {
            ...column,
            render: (_, record) => (
              <a
                href={`https://www.autoviasantiagolampa.cl/oficina-virtual/consultar-boleta/descarga/${record.tipocomprobantefiscal}/${record.numerocomprobantefiscal}/${record.fecha_emi}/${record.totalcomprobante}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {record.numerocomprobantefiscal}
              </a>
            )
          };
        }
        return column;
      });
    }

    return newColumns;
  };

  useEffect(() => {
    setColumns(createColumns(allInfo.company));

  }, [allInfo]);

  useEffect(() => {
    setColumnsGestion(getColumns('gestiones'));
  }, [Gestiones]);

  const getDateField = (company) => {
    switch (company) {
      case 'global':
        return 'fecha_emi';
      case 'acsa':
        return 'fecha_doc';
      case 'avo':
        return 'fechafacturacion';
      case 'avn':
        return 'fec_emi';
      case 'svia':
        return 'fec_emi';
      default:
        return 'fecha';
    }
  };

  const sortTicketsByDate = (tickets, dateField) => {
    return tickets.slice().sort((a, b) => new Date(a[dateField]) - new Date(b[dateField]));
  };

  const dataSource = useMemo(() => {
    const dateField = getDateField(allInfo.company);
    if (tickets && tickets.length > 0) {
      const sortedTickets = sortTicketsByDate(tickets, dateField);
      return sortedTickets.map(item => ({ ...item, key: uuidv4() }));
    } else if (acsaTicket && acsaTicket.length > 0) {
      return acsaTicket.map(ticket => ({
        ...ticket,
        sector_deuda: replaceSectorDeuda(ticket.sector_deuda),
        key: uuidv4() // Asegurarte de incluir la clave única aquí también
      }));
    } else {
      return [];
    }
  }, [tickets, acsaTicket, allInfo]);

  const dataSource2 = useMemo(() => {
    if (Gestiones && Gestiones.length > 0) {
      return Gestiones.map(item => ({ ...item, key: uuidv4() }));
    } else {
      return [];
    }
  }, [Gestiones]);

  const count2 = dataSource2.length;
  const count = dataSource.length;
  const [activeKey, setActiveKey] = useState(null);

  const handleCollapseChange = (key) => {
    setActiveKey(prevKey => (prevKey === key ? null : key));
  };

  return (
    <Row gutter={[16, 16]} style={{ padding: "10px 0" }}>
      <Col flex={activeKey === "2" ? 3 : 1}>
        <Collapse
          className="custom-collapse"
          accordion
          activeKey={activeKey}
          onChange={handleCollapseChange}
          style={{ background: 'white' }}
          items={[
            {
              key: "2",
              label: (
                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                  <div className="deudor-info">Boletas</div>
                  <div className="deudor-info" style={{ background: setColor, color: '#ffffff', padding: '0 5px' }}>Cantidad: {count}</div>
                </div>
              ),
              children: (
                <div style={{ overflowX: "auto" }}>
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey={(record) => record.key}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 800 }}
                  />
                </div>
              ),
            },
          ]}
        />
      </Col>
      <Col flex={activeKey === "3" ? 3 : 1}>
        <Collapse
          className="custom-collapse"
          accordion
          activeKey={activeKey}
          onChange={handleCollapseChange}
          style={{ background: 'white' }}
          items={[
            {
              key: "3",
              label: (
                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                  <div className="deudor-info">Gestiones</div>
                  <div className="deudor-info" style={{ background: setColor, color: '#ffffff', padding: '0 5px' }}>Cantidad: {count2}</div>
                </div>
              ),
              children: (
                <div style={{ overflowX: "auto" }}>
                  <Table
                    columns={columnsGestion}
                    dataSource={dataSource2}
                    rowKey={(record) => record.key}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 800 }}
                  />
                </div>
              ),
            }
          ]}
        />
      </Col>
    </Row>
  );
};
