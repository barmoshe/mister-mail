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
  createDraft,
  isEmptyDraft,
  getEmptyEmailDraft,
  getDefaultFilter,
  getFromParamsAndFolder,
  countUnreadEmails,
};
const STORAGE_KEY = "email_db";
_createEmails();

async function query(filterBy = getDefaultFilter(), sortBy = "sentAt") {
  let emails = await storageService.query(STORAGE_KEY);
  console.log(
    "drafts count",
    emails.reduce((acc, email) => {
      if (email.isDraft) {
        acc++;
      }
      return acc;
    }, 0)
  );
  emails = _filter(emails, filterBy);
  console.log("emails size after filter", emails.length);
  emails.sort((a, b) => {
    if (a[sortBy] > b[sortBy]) return -1;
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
async function createDraft(email) {
  const { to, subject, body } = email;
  return await storageService.post(STORAGE_KEY, {
    subject,
    body,
    isRead: false,
    isStarred: false,
    sentAt: false,
    from: loggedInUser.email,
    to,
    isDraft: true,
    removedAt: false,
  });
}

function getDefaultFilter(folder = "inbox") {
  return {
    folder: folder,
    txt: "",
    isRead: "all",
  };
}
function isEmptyDraft(email) {
  return (
    email.to === "" &&
    email.subject === "" &&
    email.body === "" &&
    email.id === "new"
  );
}
function getFromParamsAndFolder(searchParams, folder) {
  const filterBy = {
    folder: folder,
    txt: searchParams.get("txt") || "",
    isRead: searchParams.get("isRead") || "all",
  };
  return filterBy;
}
function getEmptyEmailDraft() {
  return {
    id: "new",
    to: "",
    from: loggedInUser.email,
    subject: "",
    body: "",
    isDraft: true,
  };
}
function _createEmails() {
  let emails = utilService.loadFromStorage(STORAGE_KEY);
  if (!emails || !emails.length) {
    const numEmails = prompt("How many demo emails would you like to create?");
    emails = _generateDemoEmails(+numEmails);

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
async function countUnreadEmails() {
  const emails = await storageService.query(STORAGE_KEY);
  return emails.filter((email) => !email.isRead).length;
}

function _filter(emails, filterBy) {
  const { folder, txt, isRead } = filterBy;
  let filteredEmails = filterByText(emails, txt);
  filteredEmails = filterByReadStatus(filteredEmails, isRead);
  let filterParams = {};
  switch (folder) {
    case "inbox":
      filterParams = {
        userEmail: loggedInUser.email,
        isSent: false,
        isStarred: false,
        isTrash: false,
        isDraft: false,
      };
      break;
    case "starred":
      filterParams = {
        userEmail: loggedInUser.email,
        isSent: false,
        isStarred: true,
        isTrash: false,
        isDraft: false,
      };
      break;
    case "sent":
      filterParams = {
        userEmail: loggedInUser.email,
        isSent: true,
        isStarred: false,
        isTrash: false,
        isDraft: false,
      };
      break;
    case "drafts":
      filterParams = {
        userEmail: loggedInUser.email,
        isSent: false,
        isStarred: false,
        isTrash: false,
        isDraft: true,
      };
      break;
    case "trash":
      filterParams = {
        userEmail: loggedInUser.email,
        isSent: false,
        isStarred: false,
        isTrash: true,
        isDraft: false,
      };
      break;
    default:
      break;
  }
  filteredEmails = filterByFolder(filteredEmails, filterParams);

  return filteredEmails;
}

function filterByText(emails, txt) {
  if (txt !== "") {
    return emails.filter((email) => isMatchToTxt(email, txt));
  }
  return emails;
}
function isMatchToTxt(email, txt) {
  return (
    email.subject.toLowerCase().includes(txt.toLowerCase()) ||
    email.body.toLowerCase().includes(txt.toLowerCase())
  );
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

function filterByFolder(filteredEmails, filterParams) {
  const { userEmail, isSent, isStarred, isTrash, isDraft } = filterParams;
  return filteredEmails.filter((email) => {
    //trashCase
    if (isTrash) {
      console.log("trash case", email.removedAt);
      return email.removedAt;
    }

    //inboxCase
    if (!isSent && !isTrash && !isDraft) {
      //starredCase
      if (isStarred) {
        return email.isStarred;
      }
      return (
        email.to === userEmail &&
        !email.isDraft &&
        !email.removedAt &&
        !email.isSent
      );
    }

    //sentCase
    if (isSent) {
      return email.from === userEmail && !email.isDraft;
    }
    //draftsCase
    if (isDraft) {
      return email.from === userEmail && email.isDraft && !email.removedAt;
    }

    // Default case: return unfiltered emails
    return true;
  });
}
