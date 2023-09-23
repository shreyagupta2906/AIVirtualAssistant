import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import calendarData from "../calendar.json"; // Assuming your calendar.json is in the root directory

export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [calendarEntries, setCalendarEntries] = useState([]);

  useEffect(() => {
    setCalendarEntries(calendarData);
  }, []);

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

      setResponse(data.result);
      setQuery("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Virtual Assistant with Calendar</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
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
        <div className={styles.result}>{response}</div>

        <h3>Your Calendar</h3>
        <table className={styles.calendarTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Event</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {calendarEntries.map((entry) =>
              entry.events.map((event, index) => {
                const [eventName, eventTime] = event.split(" at ");
                return (
                  <tr key={index}>
                    <td>{entry.date}</td>
                    <td>{eventName}</td>
                    <td>{eventTime}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
