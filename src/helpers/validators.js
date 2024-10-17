import * as Yup from "yup";

export const collectPhoneNumbers = (data) => {
  const fields = [
    "fono1",
    "fono2",
    "Fono",
    "movil1",
    "movil2",
    "movil3",
    "fijo1",
    "fijo2",
    "fijo3",
    "Celular",
  ];
  const uniquePhones = new Set(); // Crea un Set para almacenar números únicos

  fields.forEach((field) => {
    if (data[field]) {
      uniquePhones.add(data[field]); // Añade el número al Set, asegurándote de quitar espacios
    }
  });

  // Convertir el Set a un array de elementos React
  return uniquePhones;
};

export const collectEmails = (data) => {
  const fields = ["Email", "email1", "email2", "email3", "EMAIL", "email"];
  const uniqueEmail = new Set(); // Crea un Set para almacenar números únicos

  fields.forEach((field) => {
    if (data[field]) {
      uniqueEmail.add(data[field]); // Añade el número al Set, asegurándote de quitar espacios
    }
  });

  // Convertir el Set a un array de elementos React
  return uniqueEmail;
};

export const validationSchema = Yup.object().shape({
  telefono: Yup.string()
    .matches(
      /^[1-9]\d{8}$/,
      "Teléfono inválido, no puede comenzar con '0' y debe tener 9 dígitos"
    )
    .required("Fono Gestión es obligatorio"),
  glosa: Yup.string().required("Glosa es obligatorio"),
  selectedStatus: Yup.string()
    .required("Debe seleccionar un estado")
    .nullable(),
});

export const emailValidationSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Email es obligatorio"),
});

export const phoneValidationSchema = Yup.object().shape({
  telefono: Yup.string()
    .matches(
      /^[1-9]\d{8}$/,
      "Teléfono inválido, no puede comenzar con '0' y debe tener 9 dígitos"
    )
    .required("El teléfono es obligatorio"),
});

export const getChileTime = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find((part) => part.type === "year").value;
  const month = parts.find((part) => part.type === "month").value;
  const day = parts.find((part) => part.type === "day").value;
  const hour = parts.find((part) => part.type === "hour").value;
  const minute = parts.find((part) => part.type === "minute").value;
  const second = parts.find((part) => part.type === "second").value;

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
};

export function determinarTipoRUT(rut) {
  // Remover los puntos, guiones y dígito verificador
  let rutSinFormato = rut.replace(/\./g, "").replace(/-/g, "").slice(0, -1);

  // Convertir a número entero
  let numeroRut = parseInt(rutSinFormato, 10);

  // Determinar si es persona o empresa
  if (numeroRut < 50000000) {
    return "Natural";
  } else {
    return "Juridico";
  }
}

export const replaceSectorDeuda = (sector) => {
  if (!sector) return "Sector Desconocido"; // O cualquier valor por defecto que prefieras

  switch (sector) {
    case "AC":
      return "Autopista Central";
    case "IN":
      return "Infractor ACSA";
    case "90":
      return "Rutas del Pacifico (Ruta 68)";
    case "91":
      return "Autopista Los Libertadores (Ruta 57)";
    case "92":
      return "Autopista El Sol (Ruta 78)";
    case "94":
      return "Túnel el Melón (TEM)";
    case "95":
      return "Infractor TEM";
    default:
      return sector;
  }
};
