const columns = {
  global: [
    {
      title: "Número de Documento",
      dataIndex: "numerocomprobantefiscal",
      key: "global-numerodocumento",
    },
    {
      title: "Tipo",
      dataIndex: "tipocomprobantefiscal",
      key: "global-tipocomprobantefiscal",
    },
    {
      title: "Fecha de Emisión",
      dataIndex: "fecha_emi",
      key: "global-fecha_emi",
    },
    {
      title: "Fecha de Vencimiento",
      dataIndex: "fecha_venc",
      key: "global-fecha_venc",
    },
    {
      title: "Monto",
      dataIndex: "totalcomprobante",
      key: "global-totalcomprobante",
    },
    {
      title: "Mora",
      dataIndex: "morosidad",
      key: "global-morosidad",
    },
  ],

  acsa: [
    {
      title: "CC",
      dataIndex: "cc",
      key: "acsa-cc",
    },
    {
      title: "Folio",
      dataIndex: "folio",
      key: "acsa-folio",
    },
    {
      title: "Monto",
      dataIndex: "monto",
      key: "acsa-monto",
    },
    {
      title: "Fecha de Documento",
      dataIndex: "fecha_doc",
      key: "acsa-fecha_doc",
    },
    {
      title: "Fecha de Vencimiento",
      dataIndex: "fecha_venc",
      key: "acsa-fecha_venc",
    },
    {
      title: "Castigo Patente",
      dataIndex: "ppu",
      key: "acsa-ppu",
    },
    {
      title: "Sector Deuda",
      dataIndex: "sector_deuda",
      key: "acsa-sector_deuda",
    },
  ],

  avo: [
    {
      title: "Contrato",
      dataIndex: "contrato",
      key: "avo-contrato",
    },
    {
      title: "Folio",
      dataIndex: "folio",
      key: "avo-Folio",
    },
    {
      title: "Monto",
      dataIndex: "monto",
      key: "avo-Monto",
    },
    {
      title: "Fecha Facturacion",
      dataIndex: "fechafacturacion",
      key: "avo-Fecha_Facturacion",
    },
    {
      title: "Fecha Vence",
      dataIndex: "fechavencimiento",
      key: "avo-FechaVencimiento",
    },
    {
      title: "Mora",
      dataIndex: "mora",
      key: "avo-Mora",
    }
  ],

  avn: [
    {
      title: "Folio",
      dataIndex: "folio",
      key: "avn-Folio",
    },
    {
      title: "Tipo",
      dataIndex: "tipo_doc",
      key: "avn-Tipo_doc",
    },
    {
      title: "Fecha de Emision",
      dataIndex: "fec_emi",
      key: "avn-Fec_Emi",
    },
    {
      title: "Fecha de VCTO",
      dataIndex: "fec_vcto",
      key: "avn-fec_vcto",
    },

    {
      title: "Monto",
      dataIndex: "deuda",
      key: "avn-Deuda",
    },
    {
      title: "Mora",
      dataIndex: "dias_mora",
      key: "avn-Dias_Mora",
    },
  ],

  svia: [
    {
      title: "Folio",
      dataIndex: "folio",
      key: "svia-Folio",
    },
    {
      title: "Tipo",
      dataIndex: "tipo_doc",
      key: "svia-Tipo_doc",
    },
    {
      title: "Fecha de Emisión",
      dataIndex: "fec_emi",
      key: "svia-fecha_emi",
    },
    {
      title: "Fecha de Vencimiento",
      dataIndex: "fec_vcto",
      key: "svia-fecha_venc",
    },
    {
      title: "monto",
      dataIndex: "monto",
      key: "svia-Monto",
    },
    {
      title: "Mora",
      dataIndex: "dias_mora",
      key: "svia-Dias_Mora",
    },
    
  ],
  gestiones: [
    {
      title: "Nombre Ejecutivo",
      dataIndex: "ruteje",
      key: "ruteje",
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "Tipo",
    },
    {
      title: "Telefono",
      dataIndex: "telefono",
      key: "Telefono",
    },
    {
      title: "Fecha Compromiso",
      dataIndex: "feccomp",
      key: "feccomp",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
    },
    {
      title: "Glosa",
      dataIndex: "glosa",
      key: "glosa",
    },
    {
      title: "Respuesta",
      dataIndex: "respuesta",
      key: "respuesta",
    },
    
  ],
};

export const getColumns = (typeWallet) => {
  return columns[typeWallet] || [];
};
