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
  STATES: /\w+ (AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI) (\d{5})/,
  STATE: / [A-Z]{2} /,
};
