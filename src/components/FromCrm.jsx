import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  DatePicker,
  Checkbox,
  Form,
  ConfigProvider,
} from "antd";
import { useCrmStore } from "../hooks/useCrmStore";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { cupCall, dispoCall, makeCall } from "../helpers/getCall";
import { useAuthStore } from "../hooks/useAuthStore";
import { Formik, Field, ErrorMessage } from "formik";
import { getChileTime, validationSchema } from "../helpers/validators";
import { ArbolGestion } from "./ArbolGestion";
import { PhoneOutlined, PhoneTwoTone } from "@ant-design/icons";
// Importa el idioma español para dayjs
import dayjs from "dayjs";
import esES from "antd/es/locale/es_ES"; // Importa el locale español para Ant Design

const sendManagement = {
  lead_id: 0,
  telefono: "",
  glosa: "",
  numdoc: 0,
  monto: 0,
  feccomp: null,
  estcomp: "Pendiente",
  tipocomp: 0,
  abono: "",
  modo: "MANUAL",
  uniqueid: 0,
  selectedStatus: null,
  callagain: null,
};

export const FromCrm = () => {
  const location = useLocation();
  const [, cartera] = location.pathname.split("/");
  const {
    setColor,
    tree,
    insertDataRegister,
    activeData,
    setChangeTree,
    valueRut,
    showGestiones,
    allInfo,
    ClearAllDatas,
    showDiary,
    showAllPhono,
    blockButton,
    BlockButtons

  } = useCrmStore();
  const { user } = useAuthStore();
  const [resetFlag, setResetFlag] = useState(false);
  const [checkedValue, setCheckedValue] = useState(false);

  const think = async (formattedValues, resetForm, status) => {

    setChangeTree("");
    await insertDataRegister(formattedValues);
    BlockButtons(true)

    showGestiones({
      path: allInfo.company,
      rut: activeData[0].RUT || activeData[0].rut,
    });

    await showAllPhono(activeData[0].RUT || activeData[0].rut);
    showDiary({ path: allInfo.company, rut: user.rut });
    Swal.fire({
      title: 'Registro guardado exitosamente',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        // Acción que deseas realizar cuando se presiona "OK"
        console.log('El usuario presionó OK');
        BlockButtons(false)
       
      }
    });
    

    ClearAllDatas();

    await dispoCall({ user: user.rut, status });

    resetForm();
    setResetFlag(true);
    setTimeout(() => setResetFlag(false), 0);
  };

 


  const formSubmit = async (values, { resetForm }) => {



    if (!valueRut) {
      Swal.fire("Ingresa Rut Cliente");
    } else if (!activeData || activeData.length === 0) {
      Swal.fire("Tienes Que Buscar Data con Rut valido");
    } else {
      try {
        const fechaLocalISO = getChileTime();
        let status = "VALL";

        if (checkedValue) {
          const formattedValues = {
            ...values,
            idrespuesta: 5,
            fecha: fechaLocalISO,
            prefix: cartera,
          };

          if (formattedValues.callagain === null) {
            Swal.fire("Volver a llamar requiere una fecha");
          } else {
            think(formattedValues, resetForm, status);
          }
        } else {
          if (!tree) {
            Swal.fire("Elija una tipificación");
          } else if (!values.idrespuesta) {
            Swal.fire("Elija una tipificación");
          } else {
            const [id, status] = values.idrespuesta.split("_");

            const formattedValues = {
              ...values,
              idrespuesta: id,
              fecha: fechaLocalISO,
              prefix: cartera,
            };

            if (id == 5) {
              if (formattedValues.callagain === null) {
                Swal.fire("Volver a llamar requiere una fecha");
              } else {
                think(formattedValues, resetForm, status);
              }
            } else {
              think(formattedValues, resetForm, status);
            }
          }
        }
      } catch (error) {
        console.error("Error en el proceso de llamada:", error);
        Swal.fire("Ocurrió un error. Por favor, intente de nuevo.");
      }
    }
  };

  const calls = async (telefono) => {
    try {
      await makeCall({ user: user.rut, phono: telefono });
    } catch (error) {
      console.error("Error en la llamada:", error);
      Swal.fire(
        "Ocurrió un error al hacer la llamada. Por favor, intente de nuevo."
      );
    }
  };

  const endCall = async () => {
    await cupCall({ user: user.rut });
    Swal.fire("Llamada terminada");
  };

  const handleDateChange = (date, setFieldValue) => {
    if (date) {
      const formattedDate = date.format("YYYY-MM-DD");
      setFieldValue("feccomp", formattedDate);
    } else {
      setFieldValue("feccomp", null);
    }
  };

  const handleDateChangeTwo = (date, setFieldValue) => {
    if (date) {
      setFieldValue("callagain", date.format("YYYY-MM-DDTHH:mm:ss[Z]"));
    } else {
      setFieldValue("callagain", null);
    }
  };

  const handleDateChangeCheckbox = (checked, setFieldValue) => {
    //setFieldValue('againCall', checked);
    // setCheckedValue(checked);
    setCheckedValue(checked);
  };

  const getNextFiveBusinessDays = () => {
    const businessDays = [];
    let date = dayjs();
    while (businessDays.length < 5) {
      if (date.day() !== 0 && date.day() !== 6) {
        // Skip Sunday (0) and Saturday (6)
        businessDays.push(date);
      }
      date = date.add(1, "day");
    }
    return businessDays;
  };

  return (
    <Formik
      initialValues={sendManagement}
      validationSchema={validationSchema}
      onSubmit={formSubmit}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <Form
          style={{ maxWidth: "600px", margin: "0 auto" }}
          onFinish={handleSubmit}
        >
          <ErrorMessage
            name="idrespuesta"
            component="div"
            style={{ color: "red", textAlign: "center" }}
          />
          {!checkedValue && (
            <ArbolGestion
              setSelectedStatus={(value) => {
                setFieldValue("idrespuesta", value);
              }}
              resetFlag={resetFlag}
              setResetFlag={setResetFlag}
            />
          )}
          <Row style={{ display: "flex", marginBottom: "16px" }}>
            <div style={{ marginRight: "8px" }}>Fono Gestión:</div>
            <Form.Item style={{ marginBottom: 0, flex: 1 }}>
              <Field name="telefono">
                {({ field }) => (
                  <Input
                    {...field}
                    suffix={
                      <PhoneOutlined
                        onClick={() => calls(values.telefono)}
                        style={{ color: setColor, cursor: "pointer" }}
                      />
                    }
                  />
                )}
              </Field>
              <ErrorMessage
                name="telefono"
                component="div"
                style={{ color: "red" }}
              />
            </Form.Item>
            <Form.Item
              label="Volver a LLamar"
              style={{ marginBottom: 0, flex: 1 }}
            >
              <Field name="chebox">
                {({ field }) => (
                  <Checkbox
                    onChange={(e) =>
                      handleDateChangeCheckbox(e.target.checked, setFieldValue)
                    }
                    style={{ marginRight: "8px" }}
                  />
                )}
              </Field>
            </Form.Item>
            <Form.Item>
              <ConfigProvider locale={esES}>
                <DatePicker
                  value={
                    values.callagain
                      ? dayjs(values.callagain, "YYYY-MM-DD HH:mm:ss")
                      : null
                  }
                  onChange={(date) => handleDateChangeTwo(date, setFieldValue)}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={{ format: "HH:mm:ss" }}
                  style={{ width: "100%" }}
                  disabledDate={(current) => {
                    const today = dayjs().startOf("day");
                    const businessDays = getNextFiveBusinessDays();
                    return (
                      current &&
                      (current.isBefore(today) ||
                        !businessDays.some((day) => current.isSame(day, "day")))
                    );
                  }}
                />
              </ConfigProvider>
            </Form.Item>
          </Row>
          {!checkedValue && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Fecha Compromiso">
                  <ConfigProvider locale={esES}>
                    <DatePicker
                      value={
                        values.feccomp
                          ? dayjs(values.feccomp, "YYYY-MM-DD")
                          : null
                      }
                      onChange={(date) => handleDateChange(date, setFieldValue)}
                      format="DD-MM-YYYY"
                      style={{ width: "100%" }}
                      disabledDate={(current) => {
                        const today = dayjs().startOf("day");
                        const businessDays = getNextFiveBusinessDays();
                        return (
                          current &&
                          (current.isBefore(today) ||
                            !businessDays.some((day) =>
                              current.isSame(day, "day")
                            ))
                        );
                      }}
                    />
                  </ConfigProvider>

                  <ErrorMessage
                    name="feccomp"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Monto Compromiso">
                  <Field name="abono">
                    {({ field }) => <Input {...field} />}
                  </Field>
                  <ErrorMessage
                    name="abono"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Form.Item label="Glosa">
            <Field name="glosa">
              {({ field }) => <Input.TextArea {...field} rows={4} />}
            </Field>
            <ErrorMessage
              name="glosa"
              component="div"
              style={{ color: "red" }}
            />
          </Form.Item>
          <Row style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item style={{ textAlign: "right" }}>
              <PhoneTwoTone
                onClick={endCall}
                style={{ fontSize: "24px", cursor: "pointer", color: setColor }}
              />
              Finalizar
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ background: setColor, color: "#ffff" }}
                disabled={blockButton}
              >
                GUARDAR
              </Button>
            </Form.Item>
          </Row>
        </Form>
      )}
    </Formik>
  );
};
