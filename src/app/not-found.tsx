import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center h-screen text-center mx-auto max-w-sm">
      <div className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">404</CardTitle>
          <CardDescription>
            <Label htmlFor="terms">Not Found</Label>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative space-y-2">
              <div className="flex items-center">
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Could not find requested resource
                </p>
              </div>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Button type="button">
                <Link href="/home">Return Home</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
