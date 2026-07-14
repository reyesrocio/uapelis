export default function FloatChatButton({ onClick }) {
  return (
    <button className="float-chat-btn" id="floatChatBtn" aria-label="Abrir CineBot" onClick={onClick}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span className="float-chat-label">CineBot</span>
    </button>
  );
}
