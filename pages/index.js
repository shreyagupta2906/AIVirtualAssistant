import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [query, setQuery] = useState("");
  const [queries, setQueries] = useState([]);
  const [responses, setResponses] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const apiResponse = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await apiResponse.json();
      if (apiResponse.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${apiResponse.status}`)
        );
      }

      console.log("Received response:", data.result);
      setQueries((prevQueries) => [...prevQueries, query]);
      setResponses((prevResponses) => [...prevResponses, data.result]);
      setQuery("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  function clearChat() {
    setQueries([]);
    setResponses([]);
  }

  return (
    <div>
      <Head>
        <title>Simple Chatbot</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Ask the Virtual Assistant</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="query"
            placeholder="Ask something"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input type="submit" value="Ask" />
        </form>

        <button
          className={styles.clearButton}
          type="button"
          onClick={clearChat}
        >
          Clear Chat
        </button>

        <div className={styles.chatBox}>
          {queries.map((q, idx) => (
            <div key={idx}>
              <div className={styles.userQuery}>{q}</div>
              <div className={styles.chatbotResponse}>{responses[idx]}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
