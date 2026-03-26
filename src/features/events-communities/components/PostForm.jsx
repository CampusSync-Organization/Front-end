import { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Image, Paperclip } from "lucide-react";

export function PostForm({ currentUser, onSubmit }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initials = currentUser?.name?.split(" ").map((n) => n[0]).join("") || "U";

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    await onSubmit(content);
    setContent("");
    setIsSubmitting(false);
  };

  return (
    <Card className="p-6 border-2 border-primary/20 shadow-md rounded-2xl bg-white mb-8">
      <div className="flex gap-4">
        <Avatar className="h-12 w-12 bg-primary">
          <AvatarFallback className="text-white font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an update, ask a question, or start a discussion..."
            className="w-full bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground min-h-[80px] text-[15px]"
          />
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex gap-1 text-muted-foreground -ml-2">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted text-muted-foreground">
                <Image className="h-[18px] w-[18px]" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted text-muted-foreground">
                <Paperclip className="h-[18px] w-[18px]" />
              </Button>
            </div>
            <Button 
              disabled={!content.trim() || isSubmitting} 
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 font-medium shadow-sm transition-all"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
