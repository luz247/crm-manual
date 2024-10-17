import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'dayjs/locale/es';
import { Modal, DatePicker, Button } from 'antd';
import { useCrmStore } from '../../hooks/useCrmStore';
import { PhoneOutlined } from '@ant-design/icons';
import { makeCall } from '../../helpers/getCall';
import { useAuthStore } from '../../hooks/useAuthStore';

dayjs.locale('es');
const localizer = dayjsLocalizer(dayjs);

export const Agenda = () => {
  const { diary } = useCrmStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventToReschedule, setEventToReschedule] = useState(null);
  const { user } = useAuthStore();

  // Actualizar currentDate cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 10000); // 30 segundos

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, []);

  const openModal = (event) => {
    setEventToReschedule(event);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEventToReschedule(null);
    setSelectedDate(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleReschedule = () => {
    // Aquí puedes añadir la lógica para guardar la nueva fecha del evento
    console.log('Nueva fecha para el evento:', eventToReschedule, selectedDate);
    closeModal();
  };

  const events = useMemo(() => {
    return diary.map(event => ({
      ...event,  // Incluir todas las propiedades del evento original
      title: event.Estado,
      start: new Date(event.Fecha_Agenda),
      end: new Date(event.Fecha_Agenda),
    }));
  }, [diary]);

  const eventStyleGetter = (event) => {
    const isFuture = new Date(event.Fecha_Agenda) >= currentDate;
    const textColor = isFuture ? 'green' : 'red';

    const style = {
      borderRadius: '0px',
      opacity: 0.8,
      color: textColor,  // Cambiar color del texto basado en Fecha_Agenda
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  };

  const calls = async (telefono) => {
    console.log(telefono, user.rut, 'call me');
    try {
      await makeCall({ user: user.rut, phono: telefono });
    } catch (error) {
      console.error("Error en la llamada:", error);
      Swal.fire("Ocurrió un error al hacer la llamada. Por favor, intente de nuevo.");
    }
  };

  const renderAgendaEvent = ({ event }) => {
    const isFuture = new Date(event.Fecha_Agenda) >= currentDate;
    const textColor = isFuture ? 'green' : 'red';

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', color: textColor }}>
        <span>
          <strong>Rut: {event.RUT || Event.Rut || event.rut}</strong>
          <br />
          Teléfono: {event.telefono }
          <PhoneOutlined onClick={() => calls(event.telefono)} style={{ color: 'blue', cursor: 'pointer' }} />
          <br />
          Fecha : {dayjs(event.Fecha_Agenda).format('YYYY-MM-DD')}
        </span>
      </div>
    );
  };

  return (
    <>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        messages={{
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          allDay: 'Todo el día',
          week: 'Semana',
          work_week: 'Semana laboral',
          day: 'Día',
          month: 'Mes',
          previous: 'Atrás',
          next: 'Siguiente',
          yesterday: 'Ayer',
          tomorrow: 'Mañana',
          today: 'Hoy',
          agenda: 'Agenda',
          noEventsInRange: 'No hay eventos en este rango.',
          showMore: total => `+ Ver más (${total})`
        }}
        components={{
          agenda: {
            event: renderAgendaEvent,
          }
        }}
      />
      <Modal
        title="Reagendar Evento"
        open={modalIsOpen}
        onCancel={closeModal}
        onOk={handleReschedule}
      >
        <DatePicker
          onChange={handleDateChange}
          value={selectedDate}
          format="YYYY-MM-DD"
        />
      </Modal>
    </>
  );
};
