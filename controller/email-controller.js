import { request, response } from "express";
import { emailModel } from "../db-utils/mongoose.model.js";
import { transport, mailOptions } from "../mail-service/mail.js";

export const saveSentEmails = async (request, response) => {
  try {
    const time = Date.now();
    const timeDate = new Date(time);
    const formattedTime = timeDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedDate = timeDate.toLocaleDateString(); // Display the date
    const email = new emailModel({
      ...request.body,
      time: formattedTime,
      date: formattedDate,
    });
    email.save();
    await transport
      .sendMail({
        ...mailOptions,
        subject: email.subject,
        to: email.to,
        text: email.body,
      })
      .then(() => console.log("email has been to your email"));
    response.status(200).json("email sended and saved successfully");
    console.log("email saved successfully");
  } catch (error) {
    response.status(500).json(error.message);
  }
};
export const getSendedEmails = async (request, response) => {
  try {
    const data = await emailModel.find(
      { from: request.body.email, general: true, starred: false, bin: false },
      {
        to: 1,
        subject: 1,
        body: 1,
        date: 1,
        name: 1,
        starred: 1,
        bin: 1,
        _id: 1,
        time: 1,
        general: 1,
        readed: 1,
        important: 1,
        spam: 1,
        archived: 1,
      }
    );
    if (!data) {
      response.status(204).send({ message: "There is no emails" });
      return;
    }
    response.send({ data });
    console.log("email details");
  } catch (error) {
    response.status(500).json(error.message);
  }
};
export const getStarredEmails = async (request, response) => {
  try {
    const data = await emailModel.find(
      { from: request.body.email, starred: true, bin: false },
      {
        to: 1,
        subject: 1,
        body: 1,
        date: 1,
        time: 1,
        name: 1,
        starred: 1,
        bin: 1,
        general: 1,
        readed: 1,
        important: 1,
        spam: 1,
        archived: 1,
      }
    );
    if (!data) {
      response.status(204).send({ message: "There is no emails" });
      return;
    }
    response.send({ data });
    console.log("star email details");
  } catch (error) {
    response.status(500).json(error.message);
  }
};
export const getBinnedEmails = async (request, response) => {
  try {
    const data = await emailModel.find(
      { from: request.body.email, bin: true },
      {
        to: 1,
        subject: 1,
        body: 1,
        date: 1,
        time: 1,
        name: 1,
        starred: 1,
        bin: 1,
        general: 1,
        readed: 1,
        important: 1,
        spam: 1,
        archived: 1,
      }
    );
    if (!data) {
      response.status(204).send({ message: "There is no emails" });
      return;
    }
    response.send({ data });
    console.log("bin");
  } catch (error) {
    response.status(500).json(error.message);
  }
};
export const getInboxEmails = async (request, response) => {
  try {
    const data = await emailModel.find(
      { to: request.body.email, bin: false },
      {
        to: 1,
        subject: 1,
        body: 1,
        date: 1,
        name: 1,
        time: 1,
        starred: 1,
        bin: 1,
        general: 1,
        readed: 1,
        important: 1,
        spam: 1,
        archived: 1,
      }
    );
    if (!data) {
      response.status(204).send({ message: "There is no emails" });
      return;
    }
    response.send({ data });
    console.log("sended email details");
  } catch (error) {
    response.status(500).json(error.message);
  }
};
export const getImportantEmails = async (request, response) => {
  try {
    const data = await emailModel.find(
      { to: request.body.email, important: true,bin:false },
      {
        to: 1,
        subject: 1,
        body: 1,
        date: 1,
        name: 1,
        time: 1,
        starred: 1,
        bin: 1,
        general: 1,
        readed: 1,
        important: 1,
        spam: 1,
        archived: 1,
      }
    );
    if (!data) {
      response.status(204).send({ message: "There is no emails" });
      return;
    }
    response.send({ data });
    console.log("important email details");
  } catch (error) {
    response.status(500).json(error.message);
  }
};
export const vieweEmail = async (request, response) => {
  try {
    const data = await emailModel.findOne(
      { _id: request.body._id },
      {
        to: 1,
        from: 1,
        subject: 1,
        body: 1,
        time: 1,
        data: 1,
        starred: 1,
        name: 1,
        bin: 1,
        general: 1,
        readed: 1,
        important: 1,
        spam: 1,
        archived: 1,
      }
    );
    if (!data) {
      response.status(204).send({ message: "There is no emails" });
      return;
    }
    response.send({ data });
    console.log("view email accessed successfully");
  } catch (error) {
    response.status(500).json(error.message);
  }
};

//  star single email
export const starEmail = async (request, response) => {
  try {
    const payload = request.body;
    console.log(payload);
    await emailModel.updateOne(
      { _id: payload._id },
      { $set: { starred: payload.starred } }
    );
    console.log("starred email successfully");
    response.send({ message: "starred email successfully" });
  } catch (error) {
    response.status(500).json(error.message);
  }
};
//  bin single email
export const binEmail = async (request, response) => {
  try {
    const payload = request.body;
    console.log(payload);
    await emailModel.updateOne(
      { _id: payload._id },
      { $set: { bin: payload.bin } }
    );
    console.log("bin email successfully");
    response.send({ message: "bin email successfully" });
  } catch (error) {
    response.status(500).json(error.message);
  }
};
// archive single mail
export const archiveEmail = async (request, response) => {
  try {
    const payload = request.body;
    console.log(payload);
    await emailModel.updateOne(
      { _id: payload._id },
      { $set: { archived: payload.archived } }
    );
    console.log("archive email updated successfully");
    response.send({ message: "archive email updated successfully" });
  } catch (error) {
    response.status(500).json(error.message);
  }
};
////readed single email
export const readedEmail = async (request, response) => {
  try {
    const payload = request.body;
    console.log(payload);
    await emailModel.updateOne(
      { _id: payload._id },
      { $set: { readed: payload.readed } }
    );
    console.log("readed email updated successfully");
    response.send({ message: "readed email updated successfully" });
  } catch (error) {
    response.status(500).json(error.message);
  }
};
//important single email
export const importantEmail = async (request, response) => {
  try {
    const payload = request.body;
    console.log(payload);
    await emailModel.updateOne(
      { _id: payload._id },
      { $set: { important: payload.important } }
    );
    console.log("readed email updated successfully");
    response.send({ message: "readed email updated successfully" });
  } catch (error) {
    response.status(500).json(error.message);
  }
};
//spm single email
export const spamEmail = async (request, response) => {
  try {
    const payload = request.body;
    console.log(payload);
    await emailModel.updateOne(
      { _id: payload._id },
      { $set: { spam: payload.spam } }
    );
    console.log("spam email successfully");
    response.send({ message: "spam email successfully" });
  } catch (error) {
    response.status(500).json(error.message);
  }
};
// Archive multiple emails
export const archiveMultiple = async (request, response) => {
  try {
    const payload = request.body.ids;
    console.log(payload);

    for (const emailId of payload) {
      await emailModel.updateOne(
        { _id: emailId },
        { $set: { archived: true } }
      );
      console.log("Archive email updated successfully");
    }

    response.send({ message: "Archive email updated successfully" });
  } catch (error) {
    response.status(500).json(error.message);
  }
};
// spam multiple emails
export const spamMultiple = async (request, response) => {
  try {
    const payload = request.body.ids;
    console.log(payload);

    for (const emailId of payload) {
      await emailModel.updateOne({ _id: emailId }, { $set: { spam: true } });
      console.log("spam email updated successfully");
    }

    response.send({ message: "spam email updated successfully" });
  } catch (error) {
    response.status(500).json(error.message);
  }
};
// spam multiple emails
export const binMultiple = async (request, response) => {
  try {
    const payload = request.body.ids;
    console.log(payload);

    for (const emailId of payload) {
      await emailModel.updateOne({ _id: emailId }, { $set: { bin: true } });
      console.log("bin email updated successfully");
    }

    response.send({ message: "bin email updated successfully" });
  } catch (error) {
    response.status(500).json(error.message);
  }
};
// mark as readed multiple emails
export const readedMultiple = async (request, response) => {
  try {
    const payload = request.body.ids;
    console.log(payload);

    for (const emailId of payload) {
      await emailModel.updateOne({ _id: emailId }, { $set: { reded: true } });
      console.log("marek as readed email updated successfully");
    }

    response.send({ message: "mark as readed email updated successfully" });
  } catch (error) {
    response.status(500).json(error.message);
  } 
}; 
 