import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";

interface INavBar {}
const Navbar = () => {
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full  bg-popover/75 backdrop-blur-lg transition-all ">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-border">
          <Link className="flex z-40 font-semibold" href={"/"}>
            {" "}
            Quill.
          </Link>
          {/* Todo: Add mobile Navbar */}
          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
                href={"/dashboard"}
              >
                Dashboard
              </Link>
              <Link
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
                href={"/pricing"}
              >
                Pricing
              </Link>
              <LoginLink
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Sign In
              </LoginLink>
              <RegisterLink
                className={buttonVariants({
                  size: "sm",
                  className: "flex items-center gap-1 justify-center",
                })}
              >
                Get Started <ArrowRight size={14} />
              </RegisterLink>
            </>
          </div>
        </div>
        {/* <h1>helo</h1> */}
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
