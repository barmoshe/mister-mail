import { useState, useEffect, useRef } from "react";
import { emailService } from "../../services/email.service";
import { useSearchParams } from "react-router-dom";

export function useComposeEmail() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(emailService.getEmptyEmailDraft());
  const emailRef = useRef("new");

  useEffect(() => {
    async function loadEmail() {
      if (
        searchParams.get("compose") &&
        searchParams.get("compose") !== "new" &&
        searchParams.get("compose") !== email.id
      ) {
        try {
          const loadedEmail = await emailService.getById(
            searchParams.get("compose")
          );
          setEmail(loadedEmail);
          emailRef.current = searchParams.get("compose");
        } catch (err) {
          console.log("Error loading email:", err);
          onCloseCompose();
        }
      }
    }
    loadEmail();
  }, [searchParams.get("compose")]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmail((prevEmail) => ({ ...prevEmail, [name]: value }));
    if (emailRef.current !== "pending")
      onSaveEmail({ ...email, [name]: value });
  };

  async function onSaveEmail(email) {
    try {
      emailRef.current = "pending";
      const savedEmail = await handleSaveEmail(email, emailRef.current);
      setEmail((prevEmail) => ({ ...prevEmail, id: savedEmail.id }));
      emailRef.current = savedEmail.id;
      console.log("emailRef.current:", emailRef.current);
    } catch (error) {
      console.error("Error saving email:", error);
    }
  }

  return { email, handleInputChange, onSaveEmail };
}
