import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isSameDay } from "date-fns";
import { IMessage } from "@/store/features/mwssages";


type ChatItem =
  | { type: "date"; date: string }
  | (IMessage & { type: "message" });

export function groupMessagesWithDateLabels(messages: IMessage[]): ChatItem[] {
  const result: ChatItem[] = [];

  let lastDate: Date | null = null;

  messages.forEach((msg) => {
    const msgDate = new Date(msg.createdAt);
    if (!lastDate || !isSameDay(lastDate, msgDate)) {
      result.push({
        type: "date",
        date: format(msgDate, "eeee, MMMM d") // e.g., "Monday, June 13"
      });
      lastDate = msgDate;
    }
    result.push({ ...msg, type: "message" });
  });

  return result;
}



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function getImageUrl(path: string) {
  return `${import.meta.env.VITE_BACKEND_URL}/${path}`;
}
