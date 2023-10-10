import sgMail, { type MailDataRequired } from "@sendgrid/mail";

import { config } from "utils/config";

const initialiseSendgrid = async () => {
  sgMail.setApiKey(config.sendgrid.apiKey);
};

const sendMail = async (msg: MailDataRequired): Promise<boolean> => {
  let r = false;
  try {
    await sgMail.send(msg);
    r = true;
  } catch (err) {
    console.log(err);
  }
  return r;
};

export { initialiseSendgrid, sendMail };
