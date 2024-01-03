import React, { useContext, useRef } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { ChatContext } from "@/context/ChatContext";
interface IChatInput {
  isDisabled?: boolean;
}
const ChatInput = ({ isDisabled }: IChatInput) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);
  const TextAreaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                ref={TextAreaRef}
                placeholder="Enter your Question..."
                rows={1}
                autoFocus
                onChange={handleInputChange}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                    TextAreaRef.current?.focus();
                    // handleInputChange(3)
                  }
                }}
                maxRows={4}
                className="resize-none pr-12 text-base py-3 scrollbar-thumb scrollbar-thumb-rounded scrollbar-track-lighter scrollbar-w-2 scrolling-touch "
              />
              <Button
                disabled={isLoading || isDisabled}
                aria-label="Send Message"
                onClick={(e) => {
                  e.preventDefault();
                  addMessage();
                  TextAreaRef.current?.focus();
                }}
                className="absolute bottom-1.5 right-[8px] "
              >
                <Send className="h-4 w-4 " />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
