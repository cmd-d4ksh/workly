import { Profile, Role } from "@/lib/types";
import { createRng, daysAgoIso, makeId } from "./rng";
import { OPERATOR_BRANDS } from "./operators";

const FIRST_NAMES = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Ishaan", "Kabir", "Rohan",
  "Ananya", "Diya", "Saanvi", "Myra", "Priya", "Neha", "Kavya", "Ritu",
  "Rahul", "Karan", "Sanjay", "Nikhil", "Meera", "Pooja", "Tanvi", "Yash",
];
const LAST_NAMES = [
  "Sharma", "Verma", "Iyer", "Nair", "Mehta", "Gupta", "Reddy", "Kapoor",
  "Chopra", "Rao", "Singh", "Patel", "Bhatia", "Menon", "Joshi", "Desai",
];

const JOB_TITLES = [
  "Operations Manager", "Head of People", "Founder", "Workplace Lead",
  "Office Manager", "COO", "HR Business Partner", "VP Operations", "Founder & CEO",
];

const SEEKER_COMPANIES = [
  "Lumen Analytics", "Northstar Labs", "Veridian Health", "Cascade Robotics",
  "Brightline Media", "Pinnacle Finserv", "Orbitly", "Fieldnote",
  "Hearth & Co", "Quantum Logix", "Everpeak Ventures", "Solace Design",
  "Ridgeline Partners", "Loopback Systems", "Harvest Analytics",
];

function fullName(rng: ReturnType<typeof createRng>): string {
  return `${rng.pick(FIRST_NAMES)} ${rng.pick(LAST_NAMES)}`;
}

export interface GeneratedUsers {
  admin: Profile;
  operatorProfiles: Profile[];
  seekerProfiles: Profile[];
  all: Profile[];
}

export function generateUsers(seed: number): GeneratedUsers {
  const rng = createRng(seed);

  const admin: Profile = {
    id: makeId("user"),
    role: "admin",
    fullName: "Admin User",
    email: "admin@workly.example.com",
    createdAt: daysAgoIso(500),
  };

  const operatorProfiles: Profile[] = OPERATOR_BRANDS.map((brand) => {
    const name = fullName(rng);
    const slug = brand.toLowerCase().replace(/[^a-z]+/g, "");
    return {
      id: makeId("user"),
      role: "operator" as Role,
      fullName: name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@${slug}.example.com`,
      phone: `+91 ${rng.int(70000, 99999)}${rng.int(10000, 99999)}`,
      jobTitle: rng.pick(JOB_TITLES),
      company: `${brand} Workspaces`,
      createdAt: daysAgoIso(rng.int(60, 500)),
    };
  });

  const seekerProfiles: Profile[] = Array.from({ length: 9 }, () => {
    const name = fullName(rng);
    const company = rng.pick(SEEKER_COMPANIES);
    return {
      id: makeId("user"),
      role: "seeker" as Role,
      fullName: name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@${company.toLowerCase().replace(/[^a-z]+/g, "")}.example.com`,
      phone: `+91 ${rng.int(70000, 99999)}${rng.int(10000, 99999)}`,
      jobTitle: rng.pick(JOB_TITLES),
      company,
      createdAt: daysAgoIso(rng.int(5, 400)),
    };
  });

  return {
    admin,
    operatorProfiles,
    seekerProfiles,
    all: [admin, ...operatorProfiles, ...seekerProfiles],
  };
}

export { SEEKER_COMPANIES, FIRST_NAMES, LAST_NAMES };
