// Importing neccessry modules and interfaces

import { AxiosResponse } from "axios";
import { ApiSuccessResponse } from "../interfaces/api";
import { ChatListItemInterface } from "../interfaces/chat";
import { UserInterface } from "../interfaces/user";

// A utility function to concatenate CSS class names with proper spacing
export const classNames = (...className: string[]) => {
  // Filter out any empty class names and join them with a space
  return className.filter(Boolean).join(" ");
};

// Check if the code is running in a browser environment
export const isBrowser = typeof window !== "undefined";

// A utility function for handling API requests with loading, success, and errror handling
export const requestHandler = async (
  api: () => Promise<AxiosResponse<ApiSuccessResponse, any>>,
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: ApiSuccessResponse) => void,
  onError: (error: string) => void
) => {
  // Show loading state if setLoading function is provided
  setLoading && setLoading(true);
  try {
    // Make the API request
    const response = await api();
    const { data } = response;
    if (data?.success) {
      // Call the onSuccess callback with the response data
      onSuccess(data);
    }
  } catch (error: any) {
    // Handle error cases, including unauthorized and forbidden cases

    if ([401, 403].includes(error?.response.data?.statusCode)) {
      // Clear local storage on authentication issues
      localStorage.clear();
      // Redirect to login page
      if (isBrowser) window.location.href = "/login";
    }
    onError(error?.response.data?.message || "Something went wrong");
  } finally {
    // Hide loading state if setLoading function is provided
    setLoading && setLoading(false);
  }
};

export const getChatObjectMetadata = (
  // The chat item for which we want to get the metadata
  chat: ChatListItemInterface,

  // The current logged in user details
  loggedInUser: UserInterface
) => {
  // Determine the content of the last message, if any,
  // If the last message contains only attachments, indicate their count
  const lastMessage = chat.lastMessage?.content
    ? chat.lastMessage?.content
    : chat.lastMessage
    ? `${chat.lastMessage?.attachments?.length} attachmet${
        chat.lastMessage.attachments.length > 1 ? "s" : ""
      }`
    : "No message yet"; // Placeholder text if there are no messages

  if (chat.isGoupChat) {
    // Case: Group chat
    // Return metadata for group chats
    return {
      // Default avatar for group chats
      avatar: "https://vai.placeholder.com/100x100.png",
      title: chat.name, // Group name serves as the title.
      description: `${chat.participants.length}membersin the chat,`, // Description indicates the number of members in the chat
      lastMessage: chat.lastMessage
        ? chat.lastMessage?.sender?.username + ": " + lastMessage
        : lastMessage,
    };
  } else {
    // Case: Individual chat
    // Identify the participant other than the logged-in user
    const participant = chat.participants.find(
      (p) => p._id !== loggedInUser._id
    );
    // Return metadata for individual chats
    return {
      avatar: participant?.avatar?.url, // participant's avatar URL
      title: participant?.username, // participant's username serves as the title
      description: participant?.email, // participant's email serves as the description
      lastMessage,
    };
  }
};

// A class that provides utility functions for working with local storge

export class LocalStorage {
  // Get the value from the local storage by key

  static get(key: string) {
    if (!isBrowser) return;

    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        return null;
      }
    }

    return null;
  }

  // Set the value in the local storage by key
  static set(key: string, value: any) {
    if (!isBrowser) return;

    localStorage.setItem(key, JSON.stringify(value));
  }

  // Remove the value from the local storage by key
  static remove(key: string) {
    if (!isBrowser) return;

    localStorage.removeItem(key);
  }

  // Clear the local storage
  static clear() {
    if (!isBrowser) return;

    localStorage.clear();
  }
}
