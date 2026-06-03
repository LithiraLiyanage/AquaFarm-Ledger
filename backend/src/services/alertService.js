import Alert from '../models/Alert.js';

export const createAlert = async ({ owner, title, type, severity='Medium', pond, batch, message }) => {
  return Alert.create({ owner, title, type, severity, pond, batch, message });
};

export const waterAlerts = async (log) => {
  if (log.status === 'Safe') return;
  await createAlert({
    owner: log.owner,
    title: `${log.status} water quality detected`,
    type: 'Water Quality',
    severity: log.status === 'Critical' ? 'Critical' : 'High',
    pond: log.pond,
    message: `Water score is ${log.score}. Check pH ${log.ph}, oxygen ${log.dissolvedOxygen} mg/L and temperature ${log.temperature}°C.`
  });
};
