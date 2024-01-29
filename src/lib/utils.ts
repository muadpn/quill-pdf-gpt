import { type ClassValue, clsx } from "clsx";
import { url } from "inspector";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.DOMAIN}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}
export function constructMetadata({
  title = "Quill - The PDF Chat ",
  description = "Quill is a open-source software to make chatting to your pdf file easy and smooth",
  image = "/thumbnail.png",
  icons = "/favicons.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    robots:{
      
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@MuadPn",
    },
    icons,
    metadataBase: new URL(`https://${process.env.DOMAIN}`),
    applicationName: "Quill GPT",
    creator: "Muad Pn",
    verification: {
      google: "UBwky1Rm6wOZAv6AJZDnHmSScAzhEzlTT4ajCidB07k",
      yandex: "8538e75e1c3ac283",
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
// <meta name="msvalidate.01" content="B4D559C6149D163D09C3EFF70A541897" />
// model Blog {
//   BlogId    String @id @default(cuid())
//   BannerImg String
//   author    String
//   title     String
//   shortDes  String
//   banner    String
//   content   String     @db.Text()
//   tags      Json
//   draft     BlogStatus
//   createdAt DateTime   @default(now())
//   updatedAt DateTime   @updatedAt
// }

// enum BlogStatus {
//   DRAFT
//   PUBLISHED
// }
