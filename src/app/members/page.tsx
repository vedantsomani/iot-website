"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Instagram, Github, ArrowRight } from "lucide-react";
import membersData from "@/data/members.json";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

interface Member {
  id: string;
  name: string;
  role: string;
  team: string;
  image: string;
  imagePosition?: string;
  bio: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
}

const TEAMS = ["All", "Executive", "Research", "Tech", "Management", "PR", "Social Media", "Design", "Multimedia"];

const COLORS: Record<string, string> = {
  Executive: "#f59e0b", Tech: "#06b6d4", Research: "#ef4444", Management: "#22c55e",
  PR: "#eab308", "Social Media": "#ec4899", Design: "#818cf8", Multimedia: "#f97316",
};

const DESCRIPTIONS: Record<string, string> = {
  Executive: "Club leadership", Tech: "Workshops, projects & R&D", Research: "Deep-tech research & papers",
  Management: "Operations & logistics", PR: "Sponsorships & outreach", "Social Media": "Content & digital presence",
  Design: "Branding & visual identity", Multimedia: "Video & photography",
};

function isHead(role: string) {
  return role === "President" || role === "General Secretary" || role.endsWith("Head");
}

function isSubHead(role: string) {
  return role.includes("Sub-Head");
}

function Socials({ member, size = "sm" }: { member: Member; size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const p = size === "sm" ? "p-1.5" : "p-2";
  const links = [
    { href: member.linkedin, icon: Linkedin },
    { href: member.instagram, icon: Instagram },
    { href: member.github, icon: Github },
  ].filter((l) => l.href && l.href !== "#");
  if (!links.length) return null;
  return (
    <div className="flex gap-1.5">
      {links.map((l, i) => (
        <a key={i} href={l.href!} target="_blank" rel="noopener noreferrer" className={`${p} rounded-full bg-white/5 hover:bg-white/15 text-white/40 hover:text-white transition-all`}>
          <l.icon className={s} />
        </a>
      ))}
    </div>
  );
}

function HeadCard({ member }: { member: Member }) {
  const color = COLORS[member.team] || "#06b6d4";
  const head = isHead(member.role);
  const imageStyle = member.imagePosition ? { objectPosition: member.imagePosition } : undefined;
  return (
    <motion.div className="rounded-xl overflow-hidden bg-[#111118] border border-white/[0.06] hover:border-white/[0.12] transition-colors" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div style={{ background: color, height: head ? 3 : 2 }} />
      <div className="relative aspect-[3/4]">
        <Image src={member.image} alt={member.name} fill className="object-cover object-top" style={imageStyle} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-[#111118]/40 to-transparent" />
      </div>
      <div className="p-4 -mt-14 relative z-10">
        <span className="inline-block text-[9px] font-medium uppercase tracking-widest px-2 py-0.5 rounded mb-2" style={{ background: color + "18", color }}>{member.team}</span>
        <h3 className={`font-semibold text-white ${head ? "text-lg" : "text-base"}`}>{member.name}</h3>
        <p className="text-xs text-white/40 mb-2">{member.role}</p>
        <p className="text-xs text-white/30 line-clamp-2 mb-3">{member.bio}</p>
        <Socials member={member} size="sm" />
      </div>
    </motion.div>
  );
}

function SmallCard({ member }: { member: Member }) {
  const color = COLORS[member.team] || "#06b6d4";
  const imageStyle = member.imagePosition ? { objectPosition: member.imagePosition } : undefined;
  return (
    <motion.div className="group rounded-lg overflow-hidden bg-[#111118] border border-white/[0.04] hover:border-white/[0.10] transition-colors relative" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="relative aspect-square">
        <Image src={member.image} alt={member.name} fill className="object-cover object-top" style={imageStyle} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent" />
        {/* Hover overlay shows socials */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Socials member={member} size="md" />
        </div>
      </div>
      <div className="p-2.5">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
          <span className="text-[9px] text-white/30 uppercase tracking-wider truncate">{member.team}</span>
        </div>
        <h3 className="text-sm font-medium text-white truncate">{member.name}</h3>
        <p className="text-[11px] text-white/30 truncate">{member.role}</p>
      </div>
    </motion.div>
  );
}

export default function MembersPage() {
  const [active, setActive] = useState("All");
  const members = membersData as Member[];
  const groups = useMemo(() => {
    const order = TEAMS.slice(1);
    const result: Record<string, Member[]> = {};
    for (const team of order) {
      const list = members.filter((m) => m.team === team);
      if (list.length > 0 && (active === "All" || active === team)) result[team] = list;
    }
    return result;
  }, [active, members]);

  return (
    <div className="min-h-screen">
      <Section spacing="small" className="border-b border-white/5">
        <Container>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-2">Our Team</h1>
            <p className="text-white/40 text-base">{members.length} members across {TEAMS.length - 1} teams.</p>
          </motion.div>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
            {TEAMS.map((t) => (
              <button key={t} onClick={() => setActive(t)} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${active === t ? "bg-white/10 text-white font-medium" : "text-white/35 hover:text-white/55 hover:bg-white/5"}`}>
                {t !== "All" && <span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS[t] }} />}
                {t}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          {Object.entries(groups).map(([team, list]) => {
            const heads = list.filter((m) => isHead(m.role) || isSubHead(m.role));
            const regular = list.filter((m) => !isHead(m.role) && !isSubHead(m.role));
            return (
              <section key={team} className="mb-14 last:mb-0">
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[team] }} />
                  <h2 className="text-lg font-semibold text-white">{team}</h2>
                  <span className="text-xs text-white/25">{DESCRIPTIONS[team]}</span>
                </div>
                {heads.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {heads.map((m) => <HeadCard key={m.id} member={m} />)}
                  </div>
                )}
                {regular.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {regular.map((m) => <SmallCard key={m.id} member={m} />)}
                  </div>
                )}
              </section>
            );
          })}
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="text-center py-10">
            <p className="text-white/35 mb-3">Want to join the crew?</p>
            <Link href="/join" className="text-white hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5 underline underline-offset-4">
              Apply now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
