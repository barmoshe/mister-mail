import { storageService } from "./async-storage.service.js";
import { utilService } from "./util.service.js";

export const emailService = {
  query,
  getById,
  remove,
  save,
  createEmail,
  markAsRead,
  getDefaultFilter,
};
const STORAGE_KEY = "emails_db";
_createEmails();

async function query(filterBy) {
  let emails = await storageService.query(STORAGE_KEY);
  if (filterBy) {
    emails = _filter(emails, filterBy);
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

// function getEmptyEmail() {
//   return {
//     subject: "",
//     body: "",
//     from: "",
//     to: "",
//     isRead: false,
//     isStarred: false,
//     sentAt: 0,
//   };
// }
function getDefaultFilter() {
  return {
    text: "",
    isRead: "all",
    isStarred: "all",
  };
}
async function markAsRead(emailId) {
  try {
    const email = await getById(emailId);
    if (email) {
      email.isRead = true;
      await save(email);
      return email;
    } else {
      throw new Error("Email not found");
    }
  } catch (error) {
    console.error("Error marking email as read:", error);
    throw error;
  }
}

function _createEmails() {
  let emails = utilService.loadFromStorage(STORAGE_KEY);
  if (!emails || !emails.length) {
    emails = [
      {
        id: "e101",
        subject: "Reconnect: Let's Catch Up Over Coffee",
        body: "Hey there! It's been a while since we last spoke. I'd love to hear how you've been. How about we grab a coffee sometime soon and catch up?",
        isRead: false,
        isStarred: true,
        sentAt: 1646361600000, // March 3, 2022
        from: "user@appsus.com",
        to: "autoMail2@gmail.com",
      },
      {
        id: "e102",
        subject: "Just a Quick Check-In",
        body: "Hi there, I hope this email finds you well. I wanted to touch base and see how things are going on your end. Let me know if there's anything I can assist you with!",
        isRead: true,
        isStarred: false,
        sentAt: 1646179200000, // March 1, 2022
        from: "autoMail3@gmail.com",
        to: "user@appsus.com",
      },
      {
        id: "e103",
        subject: "Saying Hi!",
        body: "Hello! I hope you're having a fantastic day. Just wanted to drop a quick message to say hi and see how you're doing. Let's catch up soon!",
        isRead: false,
        isStarred: false,
        sentAt: 1646256000000, // March 2, 2022
        from: "barrr@appsus.com",
        to: "autoMail3@gmail.com",
      },
      {
        id: "e104",
        subject: "Breaking News: Your Weekly Digest",
        body: "Dear Subscriber, Stay updated with our weekly digest featuring the latest news, trends, and insights from around the world. Click to read more!",
        isRead: true,
        isStarred: true,
        sentAt: 1646030400000, // February 28, 2022
        from: "news@weeklydigest.com",
        to: "user@appsus.com",
      },
      {
        id: "e105",
        subject: "Invitation: Exclusive Event Invitation",
        body: "You're invited to an exclusive event happening next week! Join us for an evening filled with networking opportunities, insightful discussions, and much more.",
        isRead: false,
        isStarred: true,
        sentAt: 1646448000000, // March 4, 2022
        from: "events@exclusiveinvite.com",
        to: "user@appsus.com",
      },
      {
        id: "e106",
        subject: "Request for Feedback: Your Opinion Matters!",
        body: "Dear valued customer, We're continuously striving to improve our services, and your feedback is invaluable to us. Please take a moment to share your thoughts and suggestions.",
        isRead: true,
        isStarred: false,
        sentAt: 1646102400000, // February 28, 2022
        from: "feedback@yourcompany.com",
        to: "user@appsus.com",
      },
      {
        id: "e107",
        subject: "Reminder: Upcoming Webinar",
        body: "Don't forget to mark your calendars for our upcoming webinar on [Topic]. Gain insights from industry experts and enhance your knowledge. Register now!",
        isRead: false,
        isStarred: false,
        sentAt: 1646350800000, // March 3, 2022
        from: "webinar@eventplanner.com",
        to: "user@appsus.com",
      },
      {
        id: "e108",
        subject: "Discover Something New!",
        body: "Hello! Explore our latest collection of products/services designed to enhance your lifestyle. Discover something new today!",
        isRead: true,
        isStarred: true,
        sentAt: 1646091600000, // February 28, 2022
        from: "discover@newcollection.com",
        to: "user@appsus.com",
      },
    ];

    utilService.saveToStorage(STORAGE_KEY, emails);
  }
}

function _filter(emails, filterBy) {
  return emails.filter((email) => {
    const text = filterBy.text.toLowerCase();
    const subject = email.subject.toLowerCase();
    const from = email.from.toLowerCase();
    const to = email.to.toLowerCase();
    const body = email.body.toLowerCase();
    const isRead = filterBy.isRead;
    const isStarred = filterBy.isStarred;

    return (
      (subject.includes(text) ||
        body.includes(text) ||
        from.includes(text) ||
        to.includes(text)) &&
      (isRead === "all" || email.isRead.toString() === isRead) &&
      (isStarred === "all" || email.isStarred.toString() === isStarred)
    );
  });
}
// Check if the email matches the filter criteria
