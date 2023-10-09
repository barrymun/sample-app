import sgMail, { type MailDataRequired } from "@sendgrid/mail";

const initialiseSendgrid = async () => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
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
