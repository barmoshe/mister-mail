import { storageService } from "./async-storage.service.js";
import { utilService } from "./util.service.js";

export const emailService = {
  query,
  getById,
  remove,
  save,
  createEmail,
  getEmptyEmail,
  getDefaultFilter,
};
const STORAGE_KEY = "emails";
_createEmails();

function query(filterBy) {
  const emails = storageService.query(STORAGE_KEY);
  if (filterBy) {
    var { subject, isRead, isStarred } = filterBy;
    emails = emails.filter(
      (email) =>
        email.subject.toLowerCase().includes(subject.toLowerCase()) &&
        email.isRead === isRead &&
        email.isStarred === isStarred
    );
  }
  return emails;
}
function getById(id) {
  return storageService.get(STORAGE_KEY, id);
}

function remove(id) {
  return storageService.remove(STORAGE_KEY, id);
}

function save(emailToSave) {
  if (emailToSave.id) {
    return storageService.put(STORAGE_KEY, emailToSave);
  } else {
    emailToSave.isRead = false;
    emailToSave.isStarred = false;
    emailToSave.sentAt = Date.now();
    return storageService.post(STORAGE_KEY, emailToSave);
  }
}

function createEmail(subject = "", body = "", from = "", to = "") {
  return {
    subject,
    body,
    from,
    to,
  };
}

function getEmptyEmail() {
  return {
    subject: "",
    body: "",
    from: "",
    to: "",
  };
}

function _createEmails() {
  let emails = utilService.loadFromStorage(STORAGE_KEY);
  if (!emails || !emails.length) {
    emails = [
      {
        id: "e101",
        subject: "Miss you!",
        body: "Would love to catch up sometimes",
        isRead: false,
        isStarred: false,
        sentAt: 1551133930594,
        from: "user@appsus.com",
        to: "autoMail2@gmail.com",
      },
      {
        id: "e102",
        subject: "Hello!",
        body: "I am here",
        isRead: false,
        isStarred: false,
        sentAt: 1551133930594,
        from: "autoMail3@gmail.com",
        to: "user@appsus.com",
      },
      {
        id: "e103",
        subject: "Hi!",
        body: "I am here too",
        isRead: false,
        isStarred: false,
        sentAt: 1551133930594,
        from: "user@appsus.com",
        to: "autoMail3@gmail.com",
      },
    ];
    utilService.saveToStorage(STORAGE_KEY, emails);
  }
}

function getDefaultFilter() {
  return {
    subject: "",
  };
}
