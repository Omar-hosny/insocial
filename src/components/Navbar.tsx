import { getCurrentUser } from "@/actions/auth.actions";
import { LogIn } from "lucide-react";
import Link from "next/link";
import UserBtn from "./UserBtn";
import ThemeBtn from "./ThemeBtn";

const Navbar = async () => {
  const user = await getCurrentUser();
  return (
    <div className="bg-gray-100  dark:bg-accent p-4 flex w-full items-center justify-between border-y-[1px] ">
      <div className="items-center justify-between flex flex-1 max-w-7xl mx-auto">
        <div>
          <Link href="/" className="text-2xl italic">
            InSocial
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeBtn />
          {!user ? (
            <Link
              href="/login"
              className="mx-4 hover:text-gray-300 cursor-pointer flex items-center gap-1"
            >
              <LogIn size={20} />
              Login
            </Link>
          ) : (
            <UserBtn
              user={{
                name: user.name ?? "",
                image: user.image,
                username: user.username,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
