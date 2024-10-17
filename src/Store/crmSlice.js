import { createSlice } from "@reduxjs/toolkit";

export const crmSlice = createSlice({
  name: "crm",
  initialState: {
    allInfo: [],
    clasifications: [],
    activeData: null,
    activeWallet: true,
    tickets: [],
    acsaTicket: [],
    acsappu: [],
    descuento: [],
    descuentoAvo: [],
    diary: [],
    Gestiones: [],
    allCallAgain: [],
    pageColor: {
      cnor: "linear-gradient(to bottom, #f0fff0, #d4f7d4)",
      vsur: "linear-gradient(to bottom, #f0f8ff, #d4e6f7)",
      avn: "linear-gradient(to bottom, #ffffff, #d3dcf8)",
      avo: "linear-gradient(to bottom, #e6f7ff, #ffe6cc)",
      svia: "linear-gradient(to bottom, #e6e6e6, #ffcccc)",
      global: "linear-gradient(to bottom, #f0fff0, #d4f7d9)",
      acsa: "linear-gradient(to bottom, #ffff,#FBEEE6)",
    },
    colorText: {
      cnor: "linear-gradient(to bottom, #f0fff0, #d4f7d4)",
      vsur: "linear-gradient(to bottom, #f0f8ff, #d4e6f7)",
      avn: "#005187",
      avo: "#ffa500",
      svia: "#ff6961",
      global: "#52c41a",
      acsa: "#FF9933",
    },
    changeColor: "",
    setColor: "",
    tree: true,
    changeTreeManagement: "",
    valueRut: "",
    newEmail: [],
    newPhono: [],
    patentesAvo: [],
    walletNumber: {
      acsa: 11,
      avo: 22,
      global: 1,
      svia: 29,
    },
    numeroCartera: null,
    telefonos: null,
    valueRutBack:null,
    blockButton:false
  },
  reducers: {
    onSetAllInfo: (state, { payload }) => {
      const { company } = payload;
      state.allInfo = payload;
      state.numeroCartera = state.walletNumber[company];
    },
    onSetAllPhonos: (state, { payload }) => {
      state.telefonos = payload;
    },
    onSetActiveData: (state, { payload }) => {
      state.activeData = payload;
    },
    onSetActiveClasification: (state, { payload }) => {
      state.clasifications = payload;
    },
    onSetActiveWallet: (state) => {
      state.activeWallet = !state.activeWallet;
    },
    onSetTickets: (state, { payload }) => {
      state.tickets = payload;
    },
    onSetAddEmail: (state, { payload }) => {
      state.newEmail.push(payload);
    },
    onSetAddPhone: (state, { payload }) => {
      state.newPhono.push(payload);
    },
    onGetTicketAcsa: (state, { payload }) => {
      state.acsaTicket = payload;
    },
    onGetPpu: (state, { payload }) => {
      state.acsappu = payload;
    },
    onGetDescuento: (state, { payload }) => {
      state.descuento = payload;
    },
    onGetDescuentoAvo: (state, { payload }) => {
      state.descuentoAvo = payload;
    },
    onGetGestiones: (state, { payload }) => {
      state.Gestiones = payload;
    },
    onSetPatentesAvo: (state, { payload }) => {
      state.patentesAvo = payload;
    },
    onPaintWallet: (state, { payload }) => {
      const { path } = payload;
      state.changeColor = state.pageColor[path];
      state.setColor = state.colorText[path];
    },
    onChangeTree: (state, { payload }) => {
      state.changeTreeManagement = payload;
    },
    onGetDiary: (state, { payload }) => {
      state.diary = payload;
    },
    onGetCallAgain: (state, { payload }) => {
      state.allCallAgain = payload;
    },
    onSelect: (state) => {
      state.tree = !state.tree;
    },
    onInputRut: (state, { payload }) => {
      state.valueRut = payload;
    },
    onInputRutBack: (state, { payload }) => {
      state.valueRutBack = payload;
    },
    clearPhono: (state) => {
      state.newPhono = [];
    },
    buttonBlock: (state,{payload}) => {
      state.blockButton = payload;
    },
    clearMail: (state) => {
      state.newEmail = [];
    },
    clearAllData: (state) => {
      (state.descuento = []), (state.acsappu = []);
    },
  },
});

export const {
  onSetActiveClasification,
  onSetActiveData,
  onSetTickets,
  onSetAddPhone,
  onSetAddEmail,
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
  clearMail,
  clearPhono,
  clearAllData,
  onGetDiary,
  onSetPatentesAvo,
  onGetDescuentoAvo,
  onSetAllPhonos,
  onGetCallAgain,
  onInputRutBack,
  buttonBlock
} = crmSlice.actions;
