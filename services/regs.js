module.exports = regs = {
  GENDER: /[MF]{1}/,
  DATE: /[0-9]{8}/,
  DATE2: /[0-9]{6}/,
  ID: /[0-9]{3}[ ][0-9]{3}[ ][0-9]{3}[ ]/,
  WEIGHT: /[ ][0-9]{3}[ ]/,
  CLASS: /[A-Z]{1}/,
  DD: /[0-9A-Z]{14,25}/,
  NAME: /[A-Z]/,
  GLOBAL: /[-]/,
  STATES: /[ ][A-Z]{2}[ ][0-9]/,
};
