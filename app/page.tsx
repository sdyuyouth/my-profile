"use client"

import { PageProgress } from "@/components/PageProgress"
import { Hero } from "@/sections/Hero"
import { Work } from "@/sections/Work"
import { Journey } from "@/sections/Journey"
import { Contact } from "@/sections/Contact"

export default function HomePage() {
  return (
    <>
      <PageProgress />
      <main>
        <Hero />
        <Work />
        <Journey />
        <Contact />
      </main>
    </>
  )
}
