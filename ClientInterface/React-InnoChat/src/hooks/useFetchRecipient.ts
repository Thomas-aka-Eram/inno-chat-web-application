import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

interface RecipientUser {
  name: string;
  _id: string;
  email: string;
  pfUrl: string;
  // Add other properties if necessary
}

interface RecipientGroupMembers {
  members: RecipientUser[];
}

interface UseFetchRecipientResult {
  recipientUser: RecipientUser | null;
  recipientGroupMembers: RecipientGroupMembers | null;
  error: string | null;
}

export const useFetchRecipient = (chat: any, user: any): UseFetchRecipientResult => {
  const [recipientUser, setRecipientUser] = useState<RecipientUser | null>(null);
  const [recipientGroupMembers, setRecipientGroupMembers] = useState<RecipientGroupMembers | null>(null);
  const [othersId, setOthersId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipientUser = async () => {
      try {
        if (!chat || !user) return;

        if (chat.isGroupChat) {
          const memberDetails: RecipientUser[] = await Promise.all(
            chat.members.map(async (memberId: string) => {
              if (memberId === user?._id) return null; // Skip the current user
              const response = await getRequest(`${baseUrl}/find/${memberId}`);
              if (response.error) {
                throw new Error(response.error);
              }
              return response;
            })
          ).then(results => results.filter(result => result !== null)); // Filter out null values

          setRecipientGroupMembers({ members: memberDetails });
          setRecipientUser({ name: chat.groupName || "Unnamed Group", _id: othersId, email: "", pfUrl: "" });
        } else {
          // For one-on-one chats, find the recipient user ID
          const recipientUserID = chat.members.find((_id: string) => _id !== user?._id);
          if (!recipientUserID) {
            setError("Recipient user not found");
            return;
          }
          setOthersId(recipientUserID);
          const response = await getRequest(`${baseUrl}/find/${recipientUserID}`);

          if (response.error) {
            setError(response.error);
          } else {
            setRecipientUser(response);
          }
        }
      } catch (error) {
        console.error("Failed to fetch recipient:", error);
        setError("Failed to fetch recipient");
      }
    };

    fetchRecipientUser();
  }, [chat, user]);

  return { recipientUser, recipientGroupMembers, error };
};
