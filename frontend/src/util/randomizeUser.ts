import { SignUpCredentials } from "../network/users_api";

export function randomizeUser(): SignUpCredentials {

    // const firstNamesMale: string[] = [
    //     "James",
    //     "Michael",
    //     "Robert",
    //     "John",
    //     "David",
    //     "Richard",
    //     "Joseph",
    //     "Thomas",
    //     "Christopher",
    //     "Charles",
    //     "Daniel",
    //     "Matthew",
    //     "Anthony",
    //     "Mark",
    //     "Donald",
    //     "Steven",
    //     "Andrew",
    // ];

    // const firstNamesFemale: string[] = [
    //     "Mary",
    //     "Patricia",
    //     "Jennifer",
    //     "Linda",
    //     "Elizabeth",
    //     "Barbara",
    //     "Susan",
    //     "Jessica",
    //     "Karen",
    //     "Sarah",
    //     "Lisa",
    //     "Nancy",
    //     "Sandra",
    //     "Betty",
    // ];

    // const lastNames: string[] = [
    //     "Smith",
    //     "Johnson",
    //     "Williams",
    //     "Brown",
    //     "Jones",
    //     "Garcia",
    //     "Davis",
    //     "Wilson",
    //     "Anderson",
    //     "Thomas",
    //     "Taylor",
    //     "Moore",
    //     "Jackson",
    //     "Martin",
    //     "Lee",
    //     "Perez",
    //     "Thompson",
    //     "White",
    //     "Harris",
    //     "Clark",
    //     "Lewis",
    //     "Robinson",
    //     "Walker",
    // ];

    const adjectives: string[] = [
        "Bold",
        "Brave",
        "Clever",
        "Creative",
        "Daring",
        "Dynamic",
        "Energetic",
        "Fearless",
        "Innovative",
        "Luminous",
        "Maverick",
        "Nimble",
        "Original",
        "Passionate",
        "Quirky",
        "Radiant",
        "Tenacious",
        "Unique",
        "Vigilant",
        "Wise",
        "Bold",
        "Fiery",
        "Razor",
        "Sharp",
        "Savage",
        "Neon",
        "Cyber",
        "Pulse",
        "Flux",
        "Nova",
        "Melodic",
        "Harmonic",
        "Rhythmic",
        "Sonic",
        "Cadence",
        "Adorable",
        "Sweet",
        "Cuddly",
        "Playful",
        "Charming",
        "Tough",
        "Fierce",
        "Strong",
        "Powerful",
        "Dominant",
        "Iconic",
        "Cosmic",
    ];

    const nouns: string[] = [
        "Ace",
        "Blaze",
        "Bolt",
        "Clutch",
        "Code",
        "Dash",
        "Divisor",
        "Domain",
        "Flux",
        "Fusion",
        "Glide",
        "Haven",
        "Havoc",
        "Ignite",
        "Jolt",
        "Kaleidoscope",
        "Lumina",
        "Nexus",
        "Oasis",
        "Phoenix",
        "Polaris",
        "Pulse",
        "Quest",
        "Rise",
        "Spark",
        "Strike",
        "Surge",
        "Torrent",
        "Velocity",
        "Viper",
        "Vortex",
        "Wave",
    ];

    const separators = [
        "",
        "-",
        "_",
    ];

    const secondLevelDomains = [
        "gmail",
        "yahoo",
        "hotmail",
        "mail",
        "fastmail",
        "mailbox",
        "outlook",
    ];

    const topLevelDomains = [
        "com",
        "org",
        "edu",
        "net",
    ];

    function getRandomIndex(max: number) {
        return Math.floor(Math.random() * max);
    }

    const sep = separators[getRandomIndex(separators.length)];
    const adj1 = adjectives[getRandomIndex(adjectives.length)];
    const adj2 = adjectives[getRandomIndex(adjectives.length)];
    const noun = nouns[getRandomIndex(nouns.length)];
    const sld = secondLevelDomains[getRandomIndex(secondLevelDomains.length)];
    const tld = topLevelDomains[getRandomIndex(topLevelDomains.length)];

    const username = `${adj1}${sep}${adj2}${sep}${noun}`;
    const email = `${username}@${sld}.${tld}`;
    const password = username;

    const newRandomUser: SignUpCredentials = {
        username: username,
        email: email,
        password: password,
        autoLogin: false,
    };

    return newRandomUser;
}