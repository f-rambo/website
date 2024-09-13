"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PageComponent } from "@/components/pagination";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  DotsHorizontalIcon,
  CheckIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User } from "@/types/types";
import { UserService } from "@/services/user/v1alpha1/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { user } from "@nextui-org/react";

export default function UserPage() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState<User[]>([]);
  const [userSearchName, setUserSearchName] = React.useState("");
  const [searchByEmail, setSearchByEmail] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(0);
  const [currentUser, setCurrentUser] = React.useState<User>();

  const updateCurrentUser = (change: any) => {
    setCurrentUser((prevState) => {
      return {
        id: prevState?.id || 0,
        ...prevState,
        ...change,
      };
    });
  };

  const getUsers = React.useCallback(() => {
    let username = "";
    let email = "";
    if (searchByEmail) {
      email = userSearchName;
    }
    if (!searchByEmail) {
      username = userSearchName;
    }
    UserService.getUsers(username, email, page, 10).then((resource) => {
      if (resource instanceof Error) {
        toast({
          title: "users get fail",
          variant: "destructive",
          description: resource.message,
        });
        return;
      }
      const users = resource.users as User[];
      setUsers(users);
      setPageCount(Math.ceil(resource.total_count / 10));
    });
  }, [toast, userSearchName, searchByEmail, page]);

  React.useEffect(() => {
    getUsers();
  }, [getUsers]);

  const saveUser = (userParms: any) => {
    if (!currentUser && !userParms) {
      return;
    }
    let userData: User = currentUser ? currentUser : (userParms as User);
    if (!userData) {
      return;
    }
    UserService.saveUser(userData).then((resource) => {
      if (resource instanceof Error) {
        toast({
          title: "user fail",
          variant: "destructive",
          description: resource.message,
        });
        return;
      }
      toast({
        title: "user success",
        description: "User has been saved successfully.",
      });
      getUsers();
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex flex-1 space-x-2 items-center">
          <Input
            className="bg-white dark:bg-gray-950 max-w-sm mr-3"
            placeholder={
              searchByEmail ? "Search email..." : "Search username..."
            }
            type="search"
            value={userSearchName}
            onChange={(e) => setUserSearchName(e.target.value)}
          />
          <Switch id="airplane-mode" onCheckedChange={setSearchByEmail} />
          <Label htmlFor="airplane-mode">search email</Label>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">New</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New User</DialogTitle>
              <DialogDescription>
                After a user is added, the user permission is automatically
                assigned.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <Input
                  value={currentUser?.email}
                  placeholder="Email"
                  className="col-span-3"
                  onChange={(e) => {
                    updateCurrentUser({
                      email: e.target.value,
                      state: "ENABLE",
                    });
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={() => saveUser(null)}>Save</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>A list of your services.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Account type</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Last login time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.sign_type}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div>{user.state}</div>
                  <div className="ml-2">
                    {user.state === "ENABLE" ? (
                      <CheckIcon className="h-6 w-6 text-green-500" />
                    ) : (
                      <Cross2Icon className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.updated_at}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(user.id)}
                    >
                      Copy project ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.state === "ENABLE" ? (
                      <DropdownMenuItem
                        onClick={() => {
                          saveUser({
                            id: user.id,
                            email: user.email,
                            state: "DISABLE",
                          });
                        }}
                      >
                        Disable
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => {
                          saveUser({
                            id: user.id,
                            email: user.email,
                            state: "ENABLE",
                          });
                        }}
                      >
                        Enable
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={user.state === "ENABLE"}
                      onClick={() => {
                        UserService.deleteUser(user.id).then((resource) => {
                          if (resource instanceof Error) {
                            toast({
                              title: "user delete fail",
                              variant: "destructive",
                              description: resource.message,
                            });
                            return;
                          }
                          toast({
                            title: "user delete success",
                            description: "User has been deleted successfully.",
                          });
                          getUsers();
                        });
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow></TableRow>
        </TableFooter>
      </Table>
      <div className="mt-3">
        <PageComponent
          totalPages={pageCount}
          pageRange={3}
          onPageChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}
