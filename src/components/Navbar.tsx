import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import UserAccountNav from "./UserAccountNav";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import ClientComponent from "./ClientComponent";
import MobileNav from "./MobileNav";
// import MobileNav from "./Footer";

interface INavBar {}
const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full  bg-popover/75 backdrop-blur-lg transition-all ">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-border">
          <Link className="flex z-40 font-semibold" href={"/"}>
            {" "}
            Quill.
          </Link>
          {/* <ClientComponent /> */}
          <MobileNav isAuth={user?.id ? true : false} />
          <div className="hidden items-center space-x-4 sm:flex">
            {!user?.id ? (
              <>
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
            ) : (
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
                <UserAccountNav
                  subscriptionPlan={subscriptionPlan}
                  email={user.email ?? ""}
                  imageUrl={user.picture ?? ""}
                  name={
                    !user.given_name || !user.family_name
                      ? "your Account"
                      : `${user.given_name} ${user.family_name}`
                  }
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
