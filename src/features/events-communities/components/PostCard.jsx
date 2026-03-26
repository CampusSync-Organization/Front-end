import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card } from "./ui/card";
import { MessageSquare, Heart, Share2 } from "lucide-react";
import { Button } from "./ui/button";

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
};

export function PostCard({ post }) {
  const initials = post.authorName.split(" ").map((n) => n[0]).join("");
  
  return (
    <Card className="p-6 border-2 border-border/50 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white mb-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 bg-primary/10">
          <AvatarFallback className="text-primary font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold text-foreground text-[15px]">{post.authorName}</p>
              <p className="text-xs text-muted-foreground font-medium">
                {timeAgo(post.createdAt)}
              </p>
            </div>
          </div>
          <p className="text-foreground text-[15px] leading-relaxed mb-4 whitespace-pre-wrap">
            {post.content}
          </p>
          <div className="flex items-center gap-2 text-muted-foreground -ml-2">
            <Button variant="ghost" size="sm" className="h-9 gap-1.5 px-3 rounded-xl hover:text-red-500 hover:bg-red-50 transition-colors">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">{post.likes || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-9 gap-1.5 px-3 rounded-xl hover:text-primary hover:bg-primary/10 transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">{post.comments || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl ml-auto hover:text-primary hover:bg-primary/10 transition-colors">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
