import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";
import React, { forwardRef } from "react";
import { Icons } from "../Icons";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
interface IMessage {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}
const Message = forwardRef<HTMLDivElement, IMessage>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex h-6 w-6 aspect-square items-center justify-center",
            {
              "order-2 bg-primary rounded-sm": message.isUserMessage,
              "order-1 bg-background rounded-sm": !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            }
          )}
        >
          {message.isUserMessage ? (
            <Icons.user className="fill-secondary-foreground text-secondary-foreground h-3/4 w-3/4" />
          ) : (
            <Icons.logo className="fill-secondary-foreground h-3/4 w-3/4" />
          )}
        </div>
        <div
          className={cn("flex flex-col space-y-2 text-base max-w-md mx-2 ", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn("px-4 py-2 rounded-lg inline-block ", {
              "bg-primary/75 text-white": message.isUserMessage,
              "text-white bg-secondary": !message.isUserMessage,
              "rounded-br-none":
                !isNextMessageSamePerson && message.isUserMessage,
              "rounded-bl-none":
                !isNextMessageSamePerson && !message.isUserMessage,
            })}
          >
            {typeof message.text === "string" ? (
              <ReactMarkdown
                className={cn("prose text-white", {
                  "text-white": message.isUserMessage,
                })}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              <p className="text-white">{message.text}</p>
            )}
            {message.id !== "loading-message" ? (
              <div
                className={cn("text-xs select-none mt-2 w-full text-right", {
                  "text-muted-foreground": !message.isUserMessage,
                  "text-primary": message.isUserMessage,
                })}
              >
                {format(new Date(message.createdAt), "HH:MM")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

Message.displayName = "Message";

export default Message;
