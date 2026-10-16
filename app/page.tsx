import { StripeDivider } from "@/components/layout/StripeDivider"
import { Intro } from "@/components/scenes/Intro"
import { Hero } from "@/components/sections/home/Hero"
import { LetsTalk } from "@/components/sections/home/LetsTalk"
import { RoomsShowcase } from "@/components/sections/home/RoomsShowcase"
import { Testimonials } from "@/components/sections/home/Testimonials"
import {
  AreasServed,
  CurtainCall,
  LightStatement,
  ProductsTeaser,
  ServicesPreview,
} from "@/components/sections/home/HomeSections"

export default function HomePage() {
  return (
    <>
      <Intro />
      <Hero />
      <StripeDivider />
      <RoomsShowcase />
      <ProductsTeaser />
      <LightStatement />
      <ServicesPreview />
      <AreasServed />
      <Testimonials />
      <CurtainCall />
      <LetsTalk />
    </>
  )
}
