"use client"

import { gsap } from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { Flip } from "gsap/Flip"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, CustomEase)

export { gsap, useGSAP, ScrollTrigger, SplitText, Flip, CustomEase }
