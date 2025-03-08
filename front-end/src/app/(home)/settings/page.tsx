import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {


  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl bg-white">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="w-20 h-20 mb-4">
            <AvatarImage src="/user-avatar.png" alt="User Image" />
            <AvatarFallback>User Image</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-semibold">Account Settings</CardTitle>
          <CardDescription className="text-gray-500">
            Manage your profile and preferences
          </CardDescription>
        </CardHeader>
        <Separator className="my-4" />
        <div className="space-y-6">
          <div>
            <Label htmlFor="name" className="font-medium">Full Name</Label>
            <Input id="name" placeholder="John Doe" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="email" className="font-medium">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" className="mt-2" />
          </div>

        </div>
        <Separator className="my-4" />
        <CardFooter>
          <Button className="w-full">Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}