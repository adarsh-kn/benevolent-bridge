"use client"

import Link from "next/link"
import { ArrowRight, HeartHandshake } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppLogo } from "@/components/shared/app-logo"

export function LoginCard() {
  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <AppLogo />
        </div>
        <CardTitle className="font-headline text-3xl text-primary">
          Welcome to Benevolent Bridge
        </CardTitle>
        <CardDescription>
          Connecting donors and recipients with trust and transparency. Please select your role to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Link href="/donors" passHref>
          <Button variant="outline" className="w-full h-14 text-lg" asChild>
            <div className="flex justify-between items-center w-full">
              <div>
                <HeartHandshake className="inline-block mr-2" />
                Login as Donor
              </div>
              <ArrowRight />
            </div>
          </Button>
        </Link>
        <Link href="/recipients" passHref>
          <Button variant="outline" className="w-full h-14 text-lg" asChild>
            <div className="flex justify-between items-center w-full">
               <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2"><path d="M12 12v-2a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-2"/><path d="m16 5 3-3 3 3"/><path d="M19 2v12"/></svg>
                Login as Recipient
              </div>
              <ArrowRight />
            </div>
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
