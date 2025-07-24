import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function temp() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-6 bg-[#f9f9fb] min-h-screen">
      {/* Sidebar */}
      <div className="col-span-1 space-y-6">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">Courtney Henry</h2>
            <span className="text-xs text-green-500">Online</span>
          </div>
        </div>
        <nav className="space-y-2">
          {['Home', 'My tasks', 'Inbox', 'Calendar', 'Reports'].map(item => (
            <Button key={item} variant="ghost" className="w-full justify-start">
              {item}
            </Button>
          ))}
        </nav>
        <div>
          <h3 className="text-sm font-medium">My Projects</h3>
          <div className="space-y-1 mt-2">
            {['Product launch', 'Team brainstorm', 'Branding launch'].map(p => (
              <Button key={p} variant="link" className="pl-0 text-sm">
                ● {p}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-3 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hello, Courtney</h1>
          <div className="flex gap-2">
            <Button variant="outline">Get tasks updates</Button>
            <Button variant="outline">Create workspace</Button>
            <Button variant="outline">Connect apps</Button>
          </div>
        </div>

        {/* Task Section */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">My Tasks</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>One-on-One Meeting</span>
                <span className="text-red-500">Today</span>
              </div>
              <div className="flex justify-between">
                <span>Send summary email to stakeholders</span>
                <span className="text-gray-500">3 days left</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects & Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Projects</h3>
              <div className="space-y-1">
                <Button variant="link" className="pl-0">Create new project</Button>
                <Button variant="link" className="pl-0">Product launch</Button>
                <Button variant="link" className="pl-0">Team brainstorm</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Calendar</h3>
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}