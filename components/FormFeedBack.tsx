import { FormEvent, useState } from "react";

export default function FormFeedBack() {
  const [body, setBody] = useState<string>("");
  const [response, setResponse] = useState<any>();

  const sendFeedback = (e: FormEvent) => {
    e.preventDefault();
    if (body) {
      fetch("/api/create", {
        method: "POST",
        body: JSON.stringify({
          date: new Date(),
          content: body,
        }),
      })
        .then((res) => res.json())
        .then((data) => setResponse(data));
    }
  };

  return (
    <>
      {(response && <div>Отзыв успешно отправлен</div>) || (
        <form onSubmit={sendFeedback}>
          <input
            type="text"
            placeholder="Опишите проблему..."
            required
            style={{ width: "100%" }}
            onChange={(event) => setBody(event.target.value)}
          />
          <input type="submit" />
        </form>
      )}
    </>
  );
}
