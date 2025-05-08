import { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [apiResponse, setApiResponse] = useState(null);

  return (
    <ChatContext.Provider value={{ apiResponse, setApiResponse }}>
      {children}
    </ChatContext.Provider>
  );
};
