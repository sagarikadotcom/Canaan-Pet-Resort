import styles from "./BookingCard.module.css";

export default function BookingCard({ booking, onStatusChange }) {
  const { _id, date, status, owner, dog } = booking;

  return (
    <div className={styles.card}>
      <h3>Booking ID: {_id}</h3>
      <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {status}</p>

      <div className={styles.section}>
        <h4>Owner:</h4>
        <p>{owner.name}</p>
        <p>{owner.email}</p>
      </div>

      <div className={styles.section}>
        <h4>Dog:</h4>
        <p>{dog.name}</p>
        <p>{dog.breed}</p>
      </div>

      {status === "pending" && (
        <div className={styles.actions}>
          <button onClick={() => onStatusChange(_id, "accepted")}>Accept</button>
          <button onClick={() => onStatusChange(_id, "rejected")}>Reject</button>
        </div>
      )}
    </div>
  );
}
