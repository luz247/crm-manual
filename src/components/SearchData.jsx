import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, Row, Col, Collapse, Card, Modal } from "antd";
import { useForm } from "../hooks/useForm";
import { useCrmStore } from "../hooks/useCrmStore";
import { collectPhoneNumbers, getChileTime, collectEmails, determinarTipoRUT, phoneValidationSchema } from "../helpers/validators";
import { PhoneOutlined, PlusOutlined, MailOutlined } from "@ant-design/icons";
import { useModalWithInput } from "../hooks/useModals";
import { useLocation } from "react-router-dom";
import { formatCurrency } from "../helpers/getInteger";
import "../assets/css/index.css"; // Importa tu archivo CSS
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from 'sweetalert2';

const data = { rut: "" };
const sendData = {
  NOMBRE: "",
  DETALLE_DOMICILIO: "",
  COMUNA: "",
  EMAIL: "",
  email1: "",
  email2: "",
  email3: "",
  fono1: "",
  fono2: "",
  Fono: "",
  movil1: "",
  movil2: "",
  movil3: "",
  fijo1: "",
  fijo2: "",
  fijo3: "",
  comuna_f: "",
  ciudad_f: "",
  ic: "",
  cc: "",
  rut: "",
  tramo: "",
  RUT: "",
  tipo_cobranza: '',
  Celular: ''
};

const initialValue = {
  lead_id: 0,
  rut: '',
  ruteje: '',
};

// Validaciones
const emailValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo electrónico es obligatorio"),
});



export const SearchData = () => {
  const location = useLocation();
  const [, cartera] = location.pathname.split("/");
  const { rut, onInputChange } = useForm(data);
  const [valueRutBack, setValueRut] = useState(''); // Controlar el valor del input
  const {
    setGetData,
    activeData,
    activeWallet,
    setNewEmail,
    setNewPhono,
    newEmail = [],
    newPhono = [],
    descuento = [],
    setColor,
    allInfo,
    validarRut,
    clearMails,
    clearPhonos,
    patentesAvo = [],
    descuentoAvo = [],
    showAllPhono,
    telefonos,
    valueRut,
    Gestiones,
    showGestiones,
    BlockButtons
  } = useCrmStore();
  const [datas, setdatas] = useState(sendData);
  const [X, setX] = useState()
  const [buttonSearch, setButtonSearch] = useState(false);

  const getData = async () => {
    BlockButtons(false)
    if (valueRutBack == '') {
      Swal.fire('Ingrese un Rut')
    } else {
      setGetData({ path: allInfo.company, rut: valueRutBack });
      await showGestiones({
        path: allInfo.company,
        rut: valueRutBack,
      });
      if (cartera === 'acsa') {
        const x = determinarTipoRUT(valueRutBack)
        setX(x)
      }
      await showAllPhono(valueRutBack)
    }
    clearMails();
    clearPhonos();

  };
  /*
    useEffect(() => {
      validarRut(rut.trim() !== '');
    }, [rut, validarRut]);*/

  const initialData =
    activeData && activeData.length > 0 ? activeData[0] : datas;
  const uniquePhones = collectPhoneNumbers(initialData);
  const uniqueEmails = collectEmails(initialData);

  const discountAvo =
    descuentoAvo && descuentoAvo.length > 0 ? descuentoAvo[0] : [];

  const {
    isVisible: isPhoneModalVisible,
    showModal: showPhoneModal,
    handleCancel: handlePhoneCancel,
  } = useModalWithInput(initialValue);

  const {
    isVisible: isEmailModalVisible,
    showModal: showEmailModal,
    handleCancel: handleEmailCancel,
  } = useModalWithInput(initialValue);


  const handlePhoneOk = ({ telefono }) => {

    if (!activeData || activeData.length === 0) {
      Swal.fire("Poner Rut valido para agregar telefono");
    } else {
      const fechaLocalISO = getChileTime();
      console.log(telefono, 'soy values phpone')
      const valu = {
        ...initialValue,
        telefono,
        fecha: fechaLocalISO
      }
      showAllPhono(rut)
      setNewPhono(valu);
      handlePhoneCancel();
    }

  };
  const handleEmailOk = ({ email }) => {

    if (!activeData || activeData.length === 0) {
      Swal.fire("Tienes Que Buscar Data con Rut valido");
    } else {
      const fechaLocalISO = getChileTime();
      const valu = {
        ...initialValue,
        email,
        fecha: fechaLocalISO
      }
      console.log(valu, 'mail enviados')
      setNewEmail(valu);
      handleEmailCancel();
    }
  };

  const llamar = (e) => {
    e.preventDefault();
    console.log('estoy llamando');
  };

  const emailbase = (e, email) => {
    e.preventDefault();
    console.log(e, email);
  }

  const handleRutChange = (e) => {
    onInputChange(e);
    setValueRut(e.target.value);
    validarRut(e.target.value.trim() !== '');


    console.log(e.target.value.trim().length)

    if (e.target.value.trim().length <= 10) {
      BlockButtons(false)
      setButtonSearch(false)
    } else {
      setButtonSearch(true)
    }

  };

  useEffect(() => {
    if (valueRut && activeData != null && activeData.length > 0) {
      setValueRut(activeData[0].RUT || activeData[0].rut || activeData[0].Rut);
    }

  }, [])

  /*
  useEffect(() => {
    const verificarGestiones = () => {
      if (Gestiones && Gestiones.length > 0) {
        // Obtener la fecha de hoy
        const hoy = new Date();

        // Crear una copia del array antes de ordenarlo
        const gestionesOrdenadas = [...Gestiones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // Obtener la fecha de la gestión más reciente
        const ultimaGestion = gestionesOrdenadas[0]; // La más reciente
        const fechaGestion = new Date(ultimaGestion.fecha);

        // Calcular la diferencia en milisegundos
        const diferenciaTiempo = hoy - fechaGestion;

        // Convertir la diferencia a días
        const diferenciaDias = diferenciaTiempo / (1000 * 60 * 60 * 24);

        // Si la diferencia es menor o igual a 2 días, mostrar la alerta
        if (diferenciaDias <= 2) {
          Swal.fire({
            icon: 'warning',
            title: 'No Gestionar',
            text: `El Rut se gestionó el ${ultimaGestion.fecha}, no puede gestionarse por Ley, favor revisar gestiones.`,
            confirmButtonText: 'Aceptar'
          });
        }
      }
    };

    verificarGestiones();
  }, [Gestiones]);
*/

  return (

    <Card
      title="Informacion Deudor"
      bordered={false}
      style={{ width: "100%", textAlign: "center" }}
    >
      <Row
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <span
          className="deudor-info"
          style={{
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          Rut:
        </span>

        {activeWallet ? (
          <>
            <Input
              style={{ flex: 1, marginRight: "10px" }}
              onChange={handleRutChange}
              name="rut"
              className="deudor-info"
              value={valueRutBack}
            />
            <Button
              style={{
                backgroundColor: setColor,
                color: "#FFFFFF",
              }}
              onClick={getData}
              className="deudor-info"
              disabled={buttonSearch}
            >
              Search
            </Button>
          </>
        ) : (
          <span className="deudor-info">
            {" "}
            {initialData.rut || initialData.RUT}{" "}
          </span>
        )}
      </Row>
      <Row
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <span
          className="deudor-info"
          style={{
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          Nombre:
        </span>
        <span className="deudor-info">
          {" "}
          {initialData.nombre || initialData.NOMBRE}{" "}
        </span>
      </Row>
      <Row
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <span
          className="deudor-info"
          style={{
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          Region:
        </span>
        <span className="deudor-info">
          {" "}
          {initialData.Region || initialData.region}

        </span>
      </Row>
      <Row
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <span
          className="deudor-info"
          style={{
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          Dirección:
        </span>
        <span className="deudor-info">
          {" "}
          {initialData.direccion || initialData.ComplementoDireccion || initialData.direccion_contractual}{" "}
        </span>
      </Row>
      <Row
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <span
          className="deudor-info"
          style={{
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          Comuna:
        </span>
        <span className="deudor-info">
          {" "}
          {initialData.COMUNA || initialData.comuna}{" "}
        </span>
      </Row>

      <Row
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
          justifyContent: "space-between",
        }}
      >
        <div
          className="deudor-info"
          style={{
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          Email:
        </div>
        <div style={{ flex: '1', display: 'flex', flexWrap: 'wrap' }}>
          {Array.from(uniqueEmails).map((mail, index) => (
            <div
              key={`email-${index}`}
              className="deudor-info"
              style={{
                alignItems: "center",
                marginRight: "10px",
              }}
            >
              <MailOutlined onClick={(e) => emailbase(e, mail)} style={{ marginRight: "4px", color: setColor, cursor: 'pointer' }} />
              {mail}
            </div>
          ))}
          {newEmail && newEmail.length > 0
            && newEmail.map((email, index) => (
              <div
                key={`new-email-${index}`}
                className="deudor-info"
                style={{ marginRight: "10px" }}

              >
                <MailOutlined
                  style={{ marginRight: "4px", color: setColor }}
                />
                {email}
              </div>
            ))}
        </div>
        <Button
          type="link"

          className="deudor-info"
          onClick={showEmailModal}
          style={{
            background: setColor,
            color: "white",
            marginLeft: "10px",
          }}
        >
          <PlusOutlined /> <MailOutlined />
        </Button>
        <Modal
          title="Agregar Nuevo Email"
          open={isEmailModalVisible}
          onCancel={handleEmailCancel}
          footer={null}
        >
          <Formik
            initialValues={{ email: '' }}
            validationSchema={emailValidationSchema}
            onSubmit={handleEmailOk}
          >
            {({ handleSubmit }) => (
              <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item>
                  <Field name="email">
                    {({ field }) => (
                      <Input {...field} placeholder="Ingrese nuevo Email" />
                    )}
                  </Field>
                  <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
                </Form.Item>
                <Form.Item style={{ textAlign: "right" }}>
                  <Button type="primary" htmlType="submit">
                    OK
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Formik>
        </Modal>
      </Row>
      <Row
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div
          className="deudor-info"
          style={{
            fontWeight: "bold",
            marginRight: "10px",

          }}
        >
          Telefonos:
        </div>
        <div className="deudor-info" style={{ flex: '1', display: 'flex', flexWrap: 'wrap' }}>
          {telefonos &&
            telefonos.length > 0 &&
            telefonos.map(({ telefono }) => (
              <div
                key={`new-phone-${telefono}`}
                style={{

                  alignItems: "center",
                  marginRight: "10px",
                }}
              >
                <PhoneOutlined

                  onClick={llamar}
                  style={{ marginRight: "4px", color: setColor }}
                />
                {telefono}
              </div>
            ))}
        </div>

        <Button
          type="link"
          onClick={showPhoneModal}
          className="deudor-info"
          style={{
            background: setColor,
            color: "white",
            marginLeft: "10px",
          }}
        >
          <PlusOutlined /> <PhoneOutlined />
        </Button>
        <Modal
          title="Agregar Nuevo Teléfono"
          open={isPhoneModalVisible}
          onCancel={handlePhoneCancel}
          footer={null}
        >
          <Formik
            initialValues={{ telefono: '' }}
            validationSchema={phoneValidationSchema}
            onSubmit={handlePhoneOk}
          >
            {({ handleSubmit }) => (
              <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item>
                  <Field name="telefono">
                    {({ field }) => (
                      <Input {...field} placeholder="Ingrese nuevo teléfono" />
                    )}
                  </Field>
                  <ErrorMessage name="telefono" component="div" style={{ color: 'red' }} />
                </Form.Item>
                <Form.Item style={{ textAlign: "right" }}>
                  <Button type="primary" htmlType="submit">
                    OK
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Formik>
        </Modal>
      </Row>
      {allInfo.company === 'avo' && (
        <Row
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <span
            className="deudor-info"
            style={{
              fontWeight: "bold",
              marginRight: "10px",
              fontSize:'18px'
            }}
          >
            Repactacion:
          </span>
          <span className="deudor-info" style={{fontWeight:'bold', fontSize:'20px'}}>
            {initialData.Repactacion}
          </span>
        </Row>
      )}




      <Row style={{ marginTop: "10px", position: "relative" }}>
        <Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
          <Collapse
            style={{ width: "100%", background: '#fff' }}

            className="deudor-info"
            accordion
            items={[
              {
                key: "1",
                label: (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                    className="more-info-acsa"
                  >
                    <div>Deuda</div>
                    {discountAvo.MontoReal && (
                      <div
                        style={{
                          background: setColor,
                          color: "#fff",
                          padding: "5px 10px",
                        }}
                        className="deudor-info"
                      >
                        Monto:
                        {formatCurrency(discountAvo.MontoReal)}{" "}
                      </div>
                    )}
                    {discountAvo.descuento && (
                      <div
                        style={{
                          background: setColor,
                          color: "#fff",
                          padding: "5px 10px",
                        }}
                        className="deudor-info"
                      >
                        Descuento:
                        {formatCurrency(discountAvo.descuento)}{" "}
                      </div>
                    )}
                    {discountAvo.allPaid && (
                      <div
                        style={{
                          background: setColor,
                          color: "#fff",
                          padding: "5px 10px",
                        }}
                        className="deudor-info"
                      >
                        Total Pagar:
                        {formatCurrency(discountAvo.allPaid)}{" "}
                      </div>
                    )}
                    {initialData.monto && (
                      <div
                        style={{
                          background: setColor,
                          color: "#fff",
                          padding: "5px 10px",
                        }}
                        className="deudor-info"
                      >
                        Monto:
                        {formatCurrency(initialData.monto)}{" "}
                      </div>
                    )}
                    {initialData.dias && (
                      <div
                        style={{
                          background: setColor,
                          color: "#fff",
                          padding: "5px 10px",
                        }}
                        className="deudor-info"
                      >
                        Mora:
                        {initialData.dias}
                      </div>
                    )}
                    {initialData.ic && (
                      <div
                        style={{
                          background: setColor,
                          color: "#fff",
                          padding: "5px 10px",
                        }}
                        className="deudor-info"
                      >
                        IC:
                        {initialData.ic}
                      </div>
                    )}

                    {initialData.ic && (
                      <div
                        style={{
                          background: setColor,
                          color: "#fff",
                          padding: "5px 10px",
                        }}
                        className="deudor-info"
                      >
                        CC:
                        {initialData.cc}
                      </div>
                    )}
                    {initialData.tramo && (
                      <div
                        style={{
                          background: setColor,
                          color: "#fff",
                          padding: "5px 10px",

                        }}
                        className="deudor-info"
                      >
                        {initialData.tramo}
                      </div>
                    )}
                    {initialData.cesion && (
                      <div
                        style={{
                          background: setColor,
                          color: "#fff",
                          padding: "5px 10px",

                        }}
                        className="deudor-info"
                      >
                        Cesion:
                        {initialData.cesion}
                      </div>
                    )}
                  </div>
                ),
                children: (
                  <div style={{ textAlign: 'start', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <span className="deudor-info" style={{ marginBottom: '5px' }}>
                        {formatCurrency(
                          initialData.MONTO ||
                          initialData.DEUDA ||
                          initialData.monto
                        )}{" "}
                      </span>
                      <div className="deudor-info" >
                        {initialData.tipo_cobranza}
                      </div>
                    </div>
                    <div>
                      {descuento[0] && (descuento[0].descuento_total || descuento[0].deuda_total) && (
                        <div>
                          {descuento[0].descuento_total && (
                            <div
                              style={{
                                background: '#58D68D',
                                color: "#fff",
                                padding: "5px 10px",
                              }}
                              className="deudor-info"
                            >
                              Descuento: {formatCurrency(descuento[0].descuento_total)}
                            </div>
                          )}
                          {descuento[0].deuda_total && (
                            <div
                              style={{
                                background: '#58D68D',
                                color: "#fff",
                                padding: "5px 10px",
                              }}
                              className="deudor-info"
                            >
                              Total: {formatCurrency(descuento[0].deuda_total - descuento[0].descuento_total)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                ),
              },
            ]}
          />
        </Col>
      </Row>
      {
        X && X.trim && X.trim() !== "" ? (
          <Row style={{ marginTop: "10px", position: "relative" }}>
            <Col span={24}>
              <Collapse
                style={{ width: "100%", background: '#fff' }}
                className="deudor-info"
                accordion
                items={[
                  {
                    key: "1",
                    label: (
                      <div style={{ display: 'flex' }}>
                        <div>Tipo de Persona: </div>
                        <div style={{
                          background: 'rgb(100, 156, 152)',
                          color: "#fff",
                          marginLeft: '10px',
                          padding: '0 5px'
                        }}>
                          {X === 'Juridico' ? 'Jurídica' : 'Natural'}
                        </div>
                      </div>
                    ),
                    children: (
                      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                        {
                          X === 'Juridico' ? (
                            <table style={{ minWidth: '800px', borderCollapse: "collapse", marginTop: "10px" }}>
                              <thead>
                                <tr style={{ backgroundColor: '#f2a68d' }}>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tramo de Deuda</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Plazo convenio o Cheques</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Pie mínimo</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Deuda mínima exigida</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Deuda mínima por cuota</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Cheque al día mínimo</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Deuda mínima exigida</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Deuda mínima por cuota</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Observaciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>Hasta $10.000.000 &gt;$10.000.000</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>Hasta 24 cuotas <br /> Hasta 36 cuotas</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>17%</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>$25,000</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>$6,000</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>17%</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>$30,000</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>$30,000</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>Las cuotas se aplican según el total con descuento</td>
                                </tr>

                              </tbody>
                            </table>
                          ) : (
                            <table style={{ minWidth: '800px', borderCollapse: "collapse", marginTop: "10px" }}>
                              <thead>
                                <tr style={{ backgroundColor: '#f2a68d' }}>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tramo de Deuda</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Plazo convenio o Cheques</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Pie mínimo</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Deuda mínima exigida</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Deuda mínima por cuota</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Cheque al día mínimo</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Deuda mínima exigida</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Deuda mínima por cuota</th>
                                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Observaciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}> Hasta $1.000.000
                                    <br />
                                    &gt; $1.000.000 y &lt;=$3.000.000
                                    <br />
                                    &gt; $3.000.000</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>Hasta 12 cuotas <br /> Hasta 24 cuotas<br /> Hasta 36 cuotas</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>17%</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>$25,000</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>$6,000</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>17%</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>$30,000</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>$30,000</td>
                                  <td rowSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>en caso de tener deuda TEM Y R78, las cuotas se aplican según el total con descuento excluyendo TEM y R78</td>
                                </tr>

                              </tbody>
                            </table>
                          )
                        }
                      </div>
                    )
                  }
                ]}
              />
            </Col>
          </Row>
        ) : null

      }

      {patentesAvo.length > 0 && (
        <Row style={{ marginTop: "10px", position: "relative" }}>
          <Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
            <Collapse
              style={{ width: "100%", background: '#fff' }}
              className="deudor-info"
              accordion
              items={[
                {
                  key: "1",
                  label: (
                    <div
                      style={{ display: "flex", justifyContent: "space-between" }}
                      className="more-info-acsa"
                    >
                      <div>Patentes</div>
                    </div>
                  ),
                  children: (
                    <div style={{ textAlign: 'start', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <ul>
                          {patentesAvo.map((patente, index) => (
                            <li key={`patente-${index}`}>{patente.Patentes}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      )}

    </Card>
  );
};
