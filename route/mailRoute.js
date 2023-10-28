import express from "express";
import {
    archiveEmail,
    archiveMultiple,
    binEmail,
  binMultiple,
  getBinnedEmails,
  getImportantEmails,
  getInboxEmails,
  getSendedEmails,
  getStarredEmails,
  importantEmail,
  readedEmail,
  readedMultiple,
  saveSentEmails,
  spamEmail,
  spamMultiple,
  starEmail,
  vieweEmail,
} from "../controller/email-controller.js";

const mailRouter = express.Router();
mailRouter.post("/save", saveSentEmails);
mailRouter.post("/normal", getSendedEmails);
mailRouter.post("/starredemails", getStarredEmails);
mailRouter.post("/binned", getBinnedEmails);
mailRouter.post("/inbox", getInboxEmails);
mailRouter.post("/allmails", getSendedEmails);
mailRouter.post("/importantEmails",getImportantEmails)

//routes for singla email details update
mailRouter.post("/viewemail", vieweEmail);

mailRouter.post("/starred", starEmail);
mailRouter.post("/bin",binEmail);
mailRouter.post("/archived",archiveEmail);
mailRouter.post("/readed",readedEmail);
mailRouter.post("/important",importantEmail);
mailRouter.post("/spam",spamEmail)
export default mailRouter;


//routed for multiple email details update
mailRouter.post("/archiveemails",archiveMultiple)
mailRouter.post("/spamemails",spamMultiple);
mailRouter.post("/binemails",binMultiple);
mailRouter.post("/readedemails",readedMultiple);