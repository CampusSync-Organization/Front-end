import {
  Bell,
  Menu,
  Search,
  Home,
  Users,
  Settings,
  Plus,
  UserCog,
  Compass,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ModernHeader({
  userName,
  userRole,
  notificationCount = 0,
  activeTab,
  onTabChange,
  onCreateClick,
  onToggleRole,
}) {
  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "explore", label: "Explore", icon: Compass },
  ];

  return (
    <header className="bg-primary border-b border-primary/20 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shadow-md">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl text-white hidden sm:block">CampusSync</span>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeTab === item.id
                        ? "bg-secondary text-primary"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-white/50" />
              <Input
                placeholder="Search..."
                className="pl-9 w-64 h-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-secondary/50"
              />
            </div>

            {onToggleRole && (
              <Button
                onClick={onToggleRole}
                variant="outline"
                className="hidden md:flex gap-2 h-9 px-4 border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                <UserCog className="h-4 w-4" />
                <span className="text-xs">{userRole === "admin" ? "Admin" : "Student"}</span>
              </Button>
            )}

            {userRole === "admin" && onCreateClick && (
              <Button
                onClick={onCreateClick}
                className="hidden md:flex bg-secondary hover:bg-secondary/90 text-primary gap-2 h-9 px-4 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Create
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 text-white hover:bg-white/10"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-primary border-2 border-primary text-xs">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="py-2 space-y-2 max-h-96 overflow-y-auto">
                  <DropdownMenuItem>
                    <p className="text-sm">New event: AI Workshop 2025</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <p className="text-sm">You joined Data Science Club</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <p className="text-sm">Reminder: Hackathon starts tomorrow</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-9 px-2 text-white hover:bg-white/10"
                >
                  <Avatar className="h-8 w-8 bg-secondary">
                    <AvatarFallback className="bg-secondary text-primary text-xs">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm hidden md:block">{userName.split(" ")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div>
                    <p className="text-sm">{userName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 text-white hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
