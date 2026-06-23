"use client"

import { PageProgress } from "@/components/PageProgress"
import { SmoothCursor } from "@/components/SmoothCursor"
import { Notifications } from "@/components/Notifications"
import { Hero } from "@/sections/Hero"
import { Work } from "@/sections/Work"
import { Journey } from "@/sections/Journey"
import { Method } from "@/sections/Method"
import { Contact } from "@/sections/Contact"

export default function HomePage() {
  return (
    <>
      <PageProgress />
      <SmoothCursor />
      <Notifications />
      <main>
        <Hero />
        <Work />
        <Journey />
        <Method />
        <Contact />
      </main>
    </>
  )
}
