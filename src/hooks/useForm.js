import { useEffect, useState } from "react";
import moment from 'moment-timezone';

export const useForm = (initialForm = {}) => {
  const [formState, setFormState] = useState(initialForm);

  useEffect(() => {
    setFormState(initialForm);
  }, [initialForm]);

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onDateChange = (date, dateString, name) => {

    setFormState({
      ...formState,
      [name]: date,
    });
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onDateChange,
    onResetForm,
  };
};
