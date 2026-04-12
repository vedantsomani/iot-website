"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, ChevronDown, ExternalLink } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

import ScrollReveal from "@/components/ScrollReveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

import eventsData from "@/data/events.json";
import projectsData from "@/data/projects.json";
import membersData from "@/data/members.json";

const getUpcomingEvent = () => {
  const upcoming = eventsData.filter((event) => event.type === "upcoming");
  const sorted = [...upcoming].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return sorted[0] || null;
};

const upcomingEvent = getUpcomingEvent();

const featuredProjects = projectsData
  .filter(
    (project) =>
      project.featured &&
      project.image &&
      !project.image.toLowerCase().includes("placeholder")
  )
  .slice(0, 6);

const heroStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const marqueeItems = [
  "Hexacopter v2 in progress",
  "SIH 2020 Finalists",
  "GTR 2026 Registrations Open",
  `${membersData.length}+ active members`,
  `${projectsData.length} projects documented`,
  "Research Division Launched",
  "Fixed Wing Plane Trials",
  "Humanoid Build Sprint",
];

export default function HomePage() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 420], [1, 0.18]);
  const heroScale = useTransform(scrollY, [0, 420], [1, 0.94]);
  const heroY = useTransform(scrollY, [0, 420], [0, 36]);

  return (
    <div className="min-h-screen bg-[#060608]">
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-screen overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#060608]" />
          <div className="absolute -left-[18%] -top-[15%] h-[46rem] w-[46rem] rounded-full bg-cyan-500/[0.07] blur-[150px]" />
          <div className="absolute -right-[14%] top-[12%] h-[38rem] w-[38rem] rounded-full bg-blue-500/[0.07] blur-[150px]" />
          <div className="absolute bottom-[-28%] left-[24%] h-[34rem] w-[34rem] rounded-full bg-cyan-400/[0.06] blur-[150px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.85) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <Container className="relative z-10 flex min-h-screen items-center justify-center py-24">
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-5xl text-center"
          >
            <motion.p
              variants={heroItem}
              className="mx-auto inline-flex rounded-full border border-white/[0.10] px-4 py-1 text-xs font-mono uppercase tracking-[0.28em] text-white/40"
            >
              Bennett University
            </motion.p>

            <motion.h1
              variants={heroItem}
              className="mt-6 text-[clamp(3rem,11vw,8.5rem)] font-orbitron font-bold leading-[0.9] tracking-tight text-white"
            >
              <span className="block">IoT &amp;</span>
              <span className="block bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-500 bg-clip-text text-transparent">
                Robotics
              </span>
              <span className="block">Club</span>
            </motion.h1>

            <motion.p
              variants={heroItem}
              className="mx-auto mt-6 max-w-3xl text-base text-white/50 md:text-lg"
            >
              {membersData.length}+ members at Bennett University building drones,
              robots, and real projects that ship beyond the classroom.
            </motion.p>

            <motion.div
              variants={heroItem}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <Button asChild size="lg" className="rounded-full">
                <Link href="/projects">
                  See our work <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/5"
              >
                <Link href="/join">
                  Join the club <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </Container>

        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-5 w-5 text-white/25" />
        </motion.div>
      </motion.section>

      <div className="relative overflow-hidden border-y border-white/[0.04] bg-[#08080c]">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#08080c] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#08080c] to-transparent" />
        <div className="flex w-max animate-marquee whitespace-nowrap py-3">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={`${item}-${i}`} className="mx-8 text-sm font-mono text-white/30">
              {item}
            </span>
          ))}
        </div>
      </div>

      <Section spacing="large">
        <Container>
          <ScrollReveal>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-2 text-sm font-mono uppercase tracking-widest text-white/30">
                  What we&apos;ve built
                </p>
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  Featured Projects
                </h2>
              </div>
              <Link
                href="/projects"
                className="hidden items-center gap-1 text-sm text-white/40 transition-colors hover:text-white md:flex"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, i) => (
              <ScrollReveal key={project.slug} delay={i * 0.08}>
                <Link href={`/projects/${project.slug}`} className="block">
                  <motion.article
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-white/[0.06] bg-[#111118] transition-colors hover:border-white/[0.12]"
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute left-3 right-3 top-3 flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-black/45 px-2 py-0.5 text-[10px] text-white/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-white/50">
                        {project.shortDesc}
                      </p>
                    </div>
                  </motion.article>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <Link
            href="/projects"
            className="mt-6 flex items-center gap-1 text-sm text-white/40 transition-colors hover:text-white md:hidden"
          >
            View all projects <ArrowRight className="h-3 w-3" />
          </Link>
        </Container>
      </Section>

      {upcomingEvent && (
        <Section className="bg-[#0a0a0f]">
          <Container>
            <ScrollReveal>
              <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111118]">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-64 min-h-[280px] md:h-auto">
                    <Image
                      src={upcomingEvent.image}
                      alt={upcomingEvent.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8 md:p-10">
                    <div className="mb-4 inline-flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                      <span className="text-xs font-mono uppercase tracking-widest text-orange-400">
                        Upcoming Event
                      </span>
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">
                      {upcomingEvent.title}
                    </h3>
                    <div className="mb-4 flex items-center gap-2 text-sm text-white/40">
                      <Calendar className="h-4 w-4" />
                      {new Date(upcomingEvent.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <p className="mb-6 text-white/50">{upcomingEvent.description}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      {upcomingEvent.registrationLink?.startsWith("http") ? (
                        <Button asChild size="lg" className="rounded-full">
                          <a
                            href={upcomingEvent.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Register Now <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      ) : (
                        <Button asChild size="lg" className="rounded-full">
                          <Link href={upcomingEvent.registrationLink || "/events"}>
                            Register Now <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="ghost">
                        <Link href="/events">All Events</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </Container>
        </Section>
      )}

      <Section className="border-t border-white/5 bg-[#0a0a0f]" spacing="large">
        <Container size="small">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                We build things that move, fly, and think.
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-white/50">
                We are students at Bennett University who prototype drones, assemble
                robots, and ship systems that actually work outside demos. From
                embedded control to field testing, this club is about building real
                projects with real constraints.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 transition-colors hover:text-white"
              >
                More about us <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-14 text-center">
              <h3 className="mb-3 text-3xl font-bold text-white">Want in?</h3>
              <p className="mb-6 text-white/40">We recruit every semester.</p>
              <Button asChild size="lg" className="rounded-full">
                <Link href="/join">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </Section>
    </div>
  );
}