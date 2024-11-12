


export const formatMessageDate = (timestamp: any) => {
    const date = new Date(timestamp);
    const now = new Date();
  
    const isToday = now.toDateString() === date.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };
  