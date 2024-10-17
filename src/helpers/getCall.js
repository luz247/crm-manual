import axios from 'axios';

export const cupCall = async ({ user }) => {
  //const url = '/agc/api.php'; // Ajuste de la URL base
  const params = {
    source: 'CRM_Manual',
    user: 'apiuser',
    pass: 'SR27DKVP0SipPKOFvn2T',
    agent_user: user,
    function: 'external_hangup',
    value: '1'
  };

  try {
   // console.log(url)
    const response = await axios.get('https://apirest.k-3.cl:3000/k3/proxy/', { params });
    console.log(response)

    return response.data;
  } catch (error) {
    console.error("Error en cupCall:", error);
    throw error;
  }
};

export const dispoCall = async ({ user, status }) => {
  //const url = '/agc/api.php'; // Ajuste de la URL base
  const params = {
    source: 'CRM_Manual',
    user: 'apiuser',
    pass: 'SR27DKVP0SipPKOFvn2T',
    agent_user: user,
    function: 'external_status',
    value: status
  };

  try {
    console.log({user, status})
    const response = await axios.get('https://apirest.k-3.cl:3000/k3/proxy/', { params });
    console.log(response,'soy el ultimo')
    return response.data;
  } catch (error) {
    console.error("Error en dispoCall:", error);
    throw error;
  }
};

export const makeCall = async ({ user, phono }) => {
  const params = {
    source: 'CRM',
    user: 'apiuser',
    pass: 'SR27DKVP0SipPKOFvn2T',
    agent_user: user,
    function: 'external_dial',
    value: phono,
    phone_code: '1',
    search: 'NO',
    preview: 'NO',
    focus: 'NO'
  };

  try {
    
    const response = await axios.get('https://apirest.k-3.cl:3000/k3/proxy/', { params });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error en makeCall:", error);
    throw error;
  }
};



export const sendNotification = async ({ user, notificationText }) => {
  
  const params = {
    source: 'CRM_Manual',
    user: 'apiuser',
    pass: 'SR27DKVP0SipPKOFvn2T',
    agent_user: user,
    function: 'send_notification',
    recipient: user,
    recipient_type: 'USER',
    notification_text: encodeURIComponent(notificationText)
  };

  try {
    const response = await axios.get('https://apirest.k-3.cl:3000/k3/proxy/', { params });
    return response.data;
  } catch (error) {
    console.error("Error en sendNotification:", error);
    throw error;
  }
};
