import { useDispatch, useSelector } from "react-redux";
import crmApi from "../Api/crmApi";
import {
  onSetActiveClasification,
  onSetActiveData,
  onSetTickets,
  onSetAddEmail,
  onSetAddPhone,
  onSetActiveWallet,
  onSetAllInfo,
  onGetTicketAcsa,
  onGetPpu,
  onPaintWallet,
  onGetDescuento,
  onGetGestiones,
  onChangeTree,
  onSelect,
  onInputRut,
  clearPhono,
  clearMail,
  clearAllData,
  onGetDiary,
  onSetPatentesAvo,
  onGetDescuentoAvo,
  onSetAllPhonos,
  onGetCallAgain,
  onInputRutBack,
  buttonBlock,
} from "../Store/crmSlice";

export const useCrmStore = () => {
  const {
    clasifications,
    activeWallet,
    allInfo,
    activeData,
    tickets,
    newEmail,
    newPhono,
    acsaTicket,
    changeColor,
    setColor,
    descuento,
    Gestiones,
    active,
    tree,
    changeTreeManagement,
    valueRut,
    diary,
    patentesAvo,
    descuentoAvo,
    numeroCartera,
    telefonos,
    allCallAgain,
    blockButton,
  } = useSelector((state) => state.crm);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const startLoadingClasifications = async () => {
    try {
      const data = (await crmApi.get("/tipificaciones-report/")).data;
      dispatch(onSetActiveClasification(data));
    } catch (error) {
      console.error("Error loading classifications:", error);
    }
  };

  const setGetData = async ({ path, rut }) => {
    try {
      const data = await (
        await crmApi.get(`/consulta-rut-${path}/${rut}/`)
      ).data;

      dispatch(onSetActiveData(data));

      if (path === "acsa") {
        const boletas = await (
          await crmApi.get(`/boleta-${path}/${rut}/`)
        ).data;
        console.log(boletas, "boletas-acsa");
        dispatch(onGetTicketAcsa(boletas));

        const ppu = await (await crmApi.get(`/ppu-${path}/${rut}/`)).data;

        dispatch(onGetPpu(ppu));

        const descuento = await (
          await crmApi.get(`/descuento-${path}/${rut}/`)
        ).data;

        dispatch(onGetDescuento(descuento));
      } else if (path === "avo") {
        const patenteAvo = await (
          await crmApi.get(`/patente-${path}/${rut}/`)
        ).data;
        console.log(patenteAvo, "en el useCrmAvo");

        dispatch(onSetPatentesAvo(patenteAvo));

        const descuentoAvo = await (
          await crmApi.get(`/descuento-${path}/${rut}/`)
        ).data;
        dispatch(onGetDescuentoAvo(descuentoAvo));
      }

      const gestiones = await (
        await crmApi.get(`/listar-gestiones/${path}/${rut}/`)
      ).data;
      dispatch(onGetGestiones(gestiones));

      if (path != "acsa") {
        const ticket = await (
          await crmApi.get(`/cartera-${path}/${rut}/`)
        ).data;
        dispatch(onSetTickets(ticket));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const insertDataRegister = async (formState) => {
    console.log(formState, "llegaaa");
    const combinedData = {
      ...formState,
      ruteje: user.rut,
      rut: activeData[0].rut || activeData[0].RUT,
      monto: activeData[0].monto || activeData[0].MONTO,
    };
    const datacallAgain = {
      Ruteje: user.rut,
      Rut: activeData[0].rut || activeData[0].RUT,
      monto: activeData[0].monto || activeData[0].MONTO,
      Fecha_Gestion: combinedData.fecha,
      Fecha_Agenda: combinedData.callagain,
      Prefix: combinedData.prefix,
      telefono: combinedData.telefono,
      glosa: combinedData.glosa,
    };

    if (formState.idrespuesta == 5) {
      const data = await (
        await crmApi.post(`/insert-callAgain/`, datacallAgain)
      ).data;

      console.log(data, "es 5 cincooo");
    }
    const data = await (
      await crmApi.post(
        `/insertar-registro-contacto-${allInfo.company}/`,
        combinedData
      )
    ).data;

    console.log("insertado", data);
  };

  const setNewEmail = async (dataEmail) => {
    try {
      console.log(dataEmail, "es mail");
      const newEmail = {
        ...dataEmail,
        rut: activeData[0].rut || activeData[0].RUT,
        ruteje: user.rut,
      };
      const email = await (
        await crmApi.post(`/insertar-NewEmail-${allInfo.company}/`, newEmail)
      ).data;
      console.log(email, allInfo.company);
      dispatch(onSetAddEmail(dataEmail["email"]));
    } catch (error) {
      console.log(error);
    }
  };

  const setNewPhono = async (dataPhono) => {
    try {
      const newphono = {
        ...dataPhono,
        rut: activeData[0].rut || activeData[0].RUT,
        ruteje: user.rut,
      };
      const phono = await (
        await crmApi.post(`/insertar-NewPhono-${allInfo.company}/`, newphono)
      ).data;
      console.log(phono, allInfo.company);
      dispatch(onSetAddPhone(dataPhono["telefono"]));
    } catch (error) {
      console.log(error);
    }
  };

  const setActiveManual = () => {
    try {
      dispatch(onSetActiveWallet());
    } catch (error) {
      console.log(error);
    }
  };

  const setInfoAll = (tp) => {
    try {
      dispatch(onSetAllInfo(tp));
    } catch (error) {
      console.log(error);
    }
  };

  const BlockButtons = (btn) => {
    try {
      dispatch(buttonBlock(btn));
    } catch (error) {
      console.log(error);
    }
  };

  const showGestiones = async ({ path, rut }) => {
    const gestion = await (
      await crmApi.get(`/listar-gestiones/${path}/${rut}/`)
    ).data;
    dispatch(onGetGestiones(gestion));
  };

  const showAllCallAgain = async ({ path }) => {
    const callAgain = await (
      await crmApi.get(`/getCallAgainAll/${path}/`)
    ).data;
    dispatch(onGetCallAgain(callAgain));
  };

  const showAllPhono = async (rut) => {
    console.log({ rut, numeroCartera }, "soy los telefonos");
    console.log(allInfo.company);
    const allPhono = await (
      await crmApi.get(
        `/Allcombinedphones/?idclient=${numeroCartera}&rut=${rut}&database_name=${allInfo.company}`
      )
    ).data;
    console.log(
      allPhono,
      "soy las telefonossssssssssssssssssssssssssssssssssss"
    );
    dispatch(onSetAllPhonos(allPhono));
  };

  const showDiary = async ({ path, rut }) => {
    console.log({ numeroCartera }, "soy el wallet avo");
    const diary = await (
      await crmApi.get(`/listar-diary/${path}/${rut}/${numeroCartera}/`)
    ).data;
    console.log(diary, "soy las diat de recargado", path);
    dispatch(onGetDiary(diary));
  };

  const bacgroundWallet = (path) => {
    console.log("souel backgro", path);
    try {
      dispatch(onPaintWallet(path));
    } catch (error) {
      console.log(error);
    }
  };

  const setChangeTree = (change) => {
    dispatch(onChangeTree(change));
  };

  const setSelectActive = () => {
    dispatch(onSelect());
  };

  const validarRut = (value) => {
    dispatch(onInputRut(value));
  };
  const validarRutback = () => {
    console.log(valueRut);
    dispatch(onInputRutBack(valueRut));
  };
  const clearPhonos = () => {
    dispatch(clearMail());
  };

  const clearMails = () => {
    dispatch(clearPhono());
  };

  const ClearAllDatas = () => {
    dispatch(clearAllData());
  };

  return {
    clasifications,
    activeData,
    tickets,
    newEmail,
    newPhono,
    activeWallet,
    acsaTicket,
    changeColor,
    setColor,
    allInfo,
    descuento,
    Gestiones,
    active,
    tree,
    valueRut,
    diary,
    patentesAvo,
    descuentoAvo,
    telefonos,
    allCallAgain,
    blockButton,

    setGetData,
    setNewEmail,
    setNewPhono,
    startLoadingClasifications,
    setActiveManual,
    setInfoAll,
    bacgroundWallet,
    insertDataRegister,
    setChangeTree,
    setSelectActive,
    changeTreeManagement,
    validarRut,
    clearPhonos,
    clearMails,
    showGestiones,
    ClearAllDatas,
    showDiary,
    showAllPhono,
    showAllCallAgain,
    validarRutback,
    BlockButtons,
  };
};
