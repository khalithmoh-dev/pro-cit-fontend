import { useState } from 'react';
import style from './chatbot.module.css';

const ChatbotComponent = () => {
  const [showChatBox, setShowChatBox] = useState(false);

  return (
    <div className={style.container}>
      {showChatBox && (
        <div className={style.chatbotContainer}>
          <div className={style.headerContainer}>Chatbot</div>
          <div className={style.bodyContainer}>
            <div className={style.chatbotBody}></div>
          </div>
          <div className={style.searchContainer}>
            <input placeholder="Type Something" type="text" />
            <div className={style.sendIcon}>send</div>
          </div>
        </div>
      )}
      <div className={style.fabBottonContainer}>
        <div onClick={() => setShowChatBox(!showChatBox)} className={style.fabBotton}>
          o
        </div>
      </div>
    </div>
  );
};

export default ChatbotComponent;
