import { storageService } from "./async-storage.service.js";
import { utilService } from "./util.service.js";
const loggedInUser = {
  email: "barr@appsus.com",
  fullName: "Bar Moshe",
};
export const emailService = {
  query,
  getById,
  remove,
  save,
  getDefaultFilter,
};
const STORAGE_KEY = "emails_db";
_createEmails();

async function query(filterBy = getDefaultFilter(), sortBy = "sentAt") {
  let emails = await storageService.query(STORAGE_KEY);
  emails = _filter(emails, filterBy);
  emails.sort((a, b) => {
    if (a[sortBy] > b[sortBy]) return 1;
    if (a[sortBy] < b[sortBy]) return -1;
    return 0;
  });
  return emails;
}
async function getById(emailId) {
  const email = await storageService.get(STORAGE_KEY, emailId);
  return email;
}
async function remove(emailId) {
  return storageService.remove(STORAGE_KEY, emailId);
}
async function save(email) {
  if (email.id) {
    return await storageService.put(STORAGE_KEY, email);
  } else {
    return await storageService.post(STORAGE_KEY, email);
  }
}

function getDefaultFilter(folder = "inbox") {
  return {
    folder: folder,
    txt: "",
    isRead: null,
  };
}

function _createEmails() {
  let emails = utilService.loadFromStorage(STORAGE_KEY);
  if (!emails || !emails.length) {
    emails = _generateDemoEmails(10);

    utilService.saveToStorage(STORAGE_KEY, emails);
  }
}

function _getRandomElementFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function _generateDemoEmails(numEmails) {
  const emails = [];
  const subjects = [
    "Greetings from Company X",
    "Important Announcement",
    "Your Weekly Update",
    "Invitation to Event",
    "Feedback Request",
    "Breaking News",
    "Check out our New Products",
    "Webinar Reminder",
    "Just Saying Hi",
    "Coffee Date?",
    "Exclusive Offer Inside",
  ];
  const bodies = [
    "Hi there, this is a short demo email.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "This is just a brief message for testing purposes.",
    "Hello! Here's a quick update for you.",
    "Dear customer, we value your feedback.",
    "Stay tuned for exciting news!",
    "Explore our latest collection now!",
    "Don't miss our upcoming webinar.",
    "Just wanted to drop a line.",
    "Let's catch up soon!",
    "Check out our exclusive offer.",
  ];

  for (let i = 0; i < numEmails; i++) {
    const randomSubject = _getRandomElementFromArray(subjects);
    const randomBody = _getRandomElementFromArray(bodies);
    const from =
      Math.random() < 0.5 ? loggedInUser.email : "sender@example.com";
    const to =
      from === loggedInUser.email
        ? "recipient@example.com"
        : loggedInUser.email;

    const email = {
      id: "e" + (i + 1),
      subject: randomSubject,
      body: randomBody,
      isRead: Math.random() < 0.5, // Randomly assign read status
      isStarred: Math.random() < 0.45, // Randomly assign starred status
      sentAt: Date.now() - Math.floor(Math.random() * 86400000 * 30), // Random timestamp within the last 30 days
      from: from,
      to: to,
      isDraft: false,
      removedAt: false,
    };

    emails.push(email);
  }

  return emails;
}

function _filter(emails, filterBy) {
  const { folder, txt, isRead } = filterBy;

  let filteredEmails = filterByText(emails, txt);
  filteredEmails = filterByReadStatus(filteredEmails, isRead);

  switch (folder) {
    case "inbox":
      return filterByFolder(filteredEmails, loggedInUser.email, false, false);
    case "sent":
      return filterByFolder(filteredEmails, loggedInUser.email, true, false);
    case "starred":
      return filterByFolder(filteredEmails, null, false, true);
    case "drafts":
      return filterByFolder(filteredEmails, null, false, false);
    case "trash":
      return filterByFolder(filteredEmails, null, false, false, true);
    default:
      return filteredEmails;
  }
}

function filterByText(emails, txt) {
  if (txt !== "") {
    return emails.filter((email) => isMatchToTxt(email, txt));
  }
  return emails;
}

function filterByReadStatus(emails, isRead) {
  switch (isRead) {
    case "true":
      return emails.filter((email) => email.isRead);
    case "false":
      return emails.filter((email) => !email.isRead);
    default:
      return emails;
  }
}

function filterByFolder(emails, userEmail, isSent, isStarred, isTrash) {
  return emails.filter((email) => {
    if (isTrash && email.removedAt) return true;
    if (!isTrash && email.removedAt) return false;
    if (isSent && email.from === userEmail) return true;
    if (!isSent && email.to === userEmail) return true;
    if (isStarred && email.isStarred) return true;
    return false;
  });
}
