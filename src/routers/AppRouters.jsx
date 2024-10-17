import React, { useEffect, useRef, useState } from "react";
import { Layout, Menu, Modal } from "antd";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Navbar } from "../components/Navbar";
import cnortLogo from "../assets/imgs/cnort.png";
import svurLogo from "../assets/imgs/vsur.png";
import avnLogo from "../assets/imgs/avn.jpg";
import avoLogo from "../assets/imgs/avo.png";
import globalLogo from "../assets/imgs/global.png";
import acsaLogo from "../assets/imgs/acsa.png";
import defaultLogo from "../assets/imgs/uno.jpeg";
import svia from "../assets/imgs/sv.jpg";
import { AppAvn } from "../pages/Carteras/AppAvn";
import { AppCnor } from "../pages/Carteras/AppCnor";
import { AppSvia } from "../pages/Carteras/AppSvia";
import { AppVsur } from "../pages/Carteras/AppVsur";
import { AppAcsa } from "../pages/Carteras/AppAcsa";
import { AppGlobal } from "../pages/Carteras/AppGlobal";
import { AppAvo } from "../pages/Carteras/AppAvo";
import { AppCarteras } from "../pages/AppCarteras";
import { useCrmStore } from "../hooks/useCrmStore";
import { Agenda } from "../pages/Carteras/Agenda";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  CalendarOutlined,
  UserOutlined,
  VideoCameraOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../hooks/useAuthStore";
import { TryAgain } from "../pages/Carteras/TryAgain";

export const AppRouters = () => {
  const [logo, setLogo] = useState(defaultLogo);
  const navigate = useNavigate();
  const {
    bacgroundWallet,
    changeColor,
    setColor,
    allInfo,
    showDiary,
    diary,
    showAllCallAgain,
    startLoadingClasifications,
  } = useCrmStore();
  const { user } = useAuthStore();

  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    bacgroundWallet({ path: allInfo.company });

    if (user.rol == 7) {
      showAllCallAgain({ path: allInfo.company });
    }

    setLogo(
      {
        cnor: cnortLogo,
        vsur: svurLogo,
        avn: avnLogo,
        avo: avoLogo,
        global: globalLogo,
        acsa: acsaLogo,
        svia: svia,
      }[allInfo.company] || defaultLogo
    );
  }, [allInfo]);

  

  useEffect(() => {
    showDiary({ path: allInfo.company, rut: user.rut });
    startLoadingClasifications();
  }, []);

  // Asegúrate de que cada llamada en `diary` tenga un contador de toasts mostrado
  const toastCounter = new Map();

  const checkForUpcomingCalls = () => {
    const now = new Date();

    diary.forEach((call) => {
      const callTime = new Date(call.Fecha_Agenda);

      // Asegurarnos de que ambas fechas estén en la misma zona horaria (UTC)
      const nowUTC = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      );
      const callTimeUTC = Date.UTC(
        callTime.getFullYear(),
        callTime.getMonth(),
        callTime.getDate(),
        callTime.getHours(),
        callTime.getMinutes(),
        callTime.getSeconds()
      );

      const timeDifference = (callTimeUTC - nowUTC) / 1000 / 60; // Diferencia en minutos
      const minutesDifference = Math.floor(timeDifference); // Redondea hacia abajo

      console.log(now);
      console.log(minutesDifference); // Imprimir para verificar el valor
      console.log(call.Fecha_Agenda);

      // Obtener el conteo de toasts para esta llamada (por RUT o identificador único)
      const toastCount = toastCounter.get(call.rut || call.RUT) || 0;

      // Si falta menos de 1 minuto y más de 0 minutos, mostrar un toast y no exceder el límite de 2
      if (minutesDifference <= 1 && minutesDifference >= 0 && toastCount < 2) {
        toast.warn(
          `Tienes una llamada pendiente para el RUT: ${call.rut || call.RUT} en un minuto.`,
          {
            style: { 
              backgroundColor: setColor,  // Cambia el color de fondo
              color: 'black'               // Cambia el color del texto
            },
            position: "top-right",
            autoClose: 6000, // El toast desaparecerá después de 9 segundos
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        // Incrementar el contador de toasts para esta llamada
        toastCounter.set(call.rut || call.RUT, toastCount + 1);
      }
    });
  };


  useEffect(() => {
    const interval = setInterval(() => {
      checkForUpcomingCalls();
    }, 10000); // Verificar cada 20 segundos si hay llamadas pendientes

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, [diary]); // Re-ejecutar cuando cambie el array de llamadas (diary)

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <div style={{ display: "flex" }}>
      <Navbar logo={logo} collapsed={collapsed} setCollapsed={setCollapsed} />

      {!collapsed && (
        <Menu
          onClick={handleMenuClick}
          style={{
            marginTop: "60px",
            backgroundColor: setColor,
          }}
          items={[
            {
              key: "/agenda",
              icon: (
                <CalendarOutlined
                  style={{ color: "#ffff", fontSize: "30px" }}
                />
              ),
            },
            user && user.rol // Verificar que user exista y que rol tenga un valor
              ? {
                key: "/tryagain",
                icon: (
                  <SnippetsOutlined
                    style={{ color: "#ffff", fontSize: "30px" }}
                  />
                ),
              }
              : null, // Si no hay un rol válido, no agregar nada
          ].filter(Boolean)}
        />
      )}

      <AppCarteras backgroundGradient={changeColor} style={{height: '100vh'}}>
        <Routes>
          <Route path="/" element={<Navigate to={`/${allInfo.company}`} />} />
          <Route path="/avn/*" element={<AppAvn />} />
          <Route path="/agenda/*" element={<Agenda />} />
          <Route path="/tryagain/*" element={<TryAgain />} />
          <Route path="/cnor/*" element={<AppCnor />} />
          <Route path="/svia/*" element={<AppSvia />} />
          <Route path="/vsur/*" element={<AppVsur />} />
          <Route path="/acsa/*" element={<AppAcsa />} />
          <Route path="/global/*" element={<AppGlobal />} />
          <Route path="/avo/*" element={<AppAvo />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppCarteras>

      <ToastContainer />
    </div>
  );
};
