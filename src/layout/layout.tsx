import React from "react";
import { ChildContainerProps } from "@/types/types";
import { MenuCompent } from "@/components/menu";
import { IoIosCloudDone } from "react-icons/io";
import { BreadcrumbComponent } from "@/components/breadcrumb";
import { UserComponent } from "@/components/user";
import { auth } from "@/auth";
import { Session } from "next-auth";

const Layout = async ({ children }: ChildContainerProps) => {
  const session = (await auth()) as Session;
  let content = children;
  if (!session || !session.user) {
    content = (
      <div className="flex justify-center items-center h-full">
        <h3>Please Sign in</h3>
      </div>
    );
  }
  if (session && session.user && session.state !== "enable") {
    content = (
      <div className="flex justify-center items-center h-full">
        <h3>Please enable your account</h3>
      </div>
    );
  }
  return (
    <React.Fragment>
      <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
          <div className="flex flex-col gap-2">
            <div className="flex h-[60px] items-center px-6">
              <a className="flex items-center gap-2 font-semibold" href="/home">
                <IoIosCloudDone className="h-6 w-6" />
                <span className="">Ocean</span>
              </a>
            </div>
            <div className="flex-1">
              <MenuCompent />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
            <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
              <div className="mr-auto flex-1 sm:flex-initial">
                <div className="relative">
                  <BreadcrumbComponent />
                </div>
              </div>
              <div className="ml-auto flex-1 sm:flex-initial">
                <div className="relative">
                  <UserComponent />
                </div>
              </div>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            {content}
          </main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
