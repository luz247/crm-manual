import { useDispatch, useSelector } from "react-redux";
import crmApi from "../Api/crmApi";
import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
  onChooseWallet,
} from "../Store/auth/authSlice";
import { onSetAllInfo } from "../Store/crmSlice";

export const useAuthStore = () => {
  const { status, user, errorMessage, validator } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const startLogin = async ({ rut, company }) => {
    dispatch(onChecking());

    try {
      const data = await (await crmApi.get(`/user/${rut}/`)).data;
      if (data[0].rut === rut) {
        
        dispatch(onLogin({ name: data[0].nombre, rut: data[0].rut, rol:data[0].idroles }));
        dispatch(onSetAllInfo({ company }));
        dispatch(onChooseWallet("Escoja Cartera"));
      } else {
        throw new Error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error.message);
      dispatch(onLogout("Credenciales incorrectas")); // Notificar que el login falló
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const startRegister = async ({ email, password, name }) => {
    dispatch(onChecking());
    try {
      const { data } = await crmApi.post("/auth/new", {
        email,
        password,
        name,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      dispatch(onLogout(error.response.data?.msg || "--"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };
  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onLogout());

    try {
      const { data } = await calendarApi.get("auth/renew");
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout());
    }
  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogoutCalendar());
    dispatch(onLogout());
  };

  return {
    //* Propiedades
    errorMessage,
    status,
    user,
    validator,

    //* Métodos
    checkAuthToken,
    startLogin,
    startLogout,
    startRegister,
  };
};
