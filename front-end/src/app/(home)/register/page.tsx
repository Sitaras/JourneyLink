import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Shut up and take my money</CardDescription>
        </CardHeader>
        <CardFooter>
          <form
            action={async () => {
              "use server";
            }}
            className="w-full"
          >
            <Button className="w-full">Register</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
