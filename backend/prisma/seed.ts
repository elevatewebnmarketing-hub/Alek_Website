import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const vid = (filename: string) => `/videos/${encodeURIComponent(filename)}`;

async function main() {
  await prisma.lead.deleteMany();
  await prisma.paymentRecord.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.resourceItem.deleteMany();
  await prisma.journalPost.deleteMany();
  await prisma.portfolioProject.deleteMany();

  await prisma.portfolioProject.createMany({
    data: [
      {
        slug: "grazia",
        eyebrow: "Portfolio · Grazia",
        title: "Grazia feature story.",
        intro:
          "An editorial collaboration with one of fashion's most recognised magazine platforms, built around silhouette, composure, and high-impact visual storytelling.",
        body: `<p>Grazia is an international fashion and lifestyle title known for sharp editorial direction and campaigns that blend luxury with cultural relevance. Features in Grazia sit alongside seasonal fashion narratives, designer spotlights, and the conversations shaping how brands show up in print and online.</p>
<p>This shoot leaned into sculptural tailoring, graphic contrast, and a calm, deliberate presence in front of the camera. The creative brief called for clarity in posture, a controlled gaze, and wardrobe that reads as confident rather than decorative, so the images would hold up as both editorial art direction and professional portfolio work.</p>
<p>Below is the full set of selects from this collaboration. Use the previous and next controls to move through each frame.</p>`,
        heroImage: "/portfolio/grazia-cover.png",
        sortOrder: 0,
        content: {
          imageSlides: [
            {
              src: "/portfolio/grazia-cover.png",
              alt: "Grazia cover feature with Alek in an editorial white and black gown",
            },
            {
              src: "/portfolio/grazia-look-1.png",
              alt: "Alek in a Grazia editorial look with circular halo set design",
            },
            {
              src: "/portfolio/grazia-look-2.png",
              alt: "Alek in Grazia editorial collaboration with another model in studio",
            },
            {
              src: "/portfolio/grazia-look-3.png",
              alt: "Alek in a black and magenta editorial dress from the Grazia shoot",
            },
          ],
          videoSlides: [],
        },
      },
      {
        slug: "vogue-africa",
        eyebrow: "Portfolio · Vogue Africa",
        title: "Cover challenge, editorial scale.",
        intro:
          "These frames are part of the Vogue Africa cover conversation: high-contrast colour, precise typography, and portraiture that reads as campaign-level from the first glance.",
        body: `<p>The Vogue Africa name signals continental fashion authority: covers that balance luxury codes with cultural specificity. Participating in cover-style challenges is a way to stress-test lighting, wardrobe narrative, and how you hold space when the layout is as loud as the clothes.</p>
<p>The first image leans into graphic contrast: saturated yellow field, magenta tailoring, and a clean masthead read. The second is a tighter editorial portrait with warm sculpting light and jewellery as the secondary story. Together they show two valid directions for the same brief: bold set piece versus intimate luxury detail.</p>
<p>Use the carousel controls below to move between both covers at full width.</p>`,
        heroImage: "/portfolio/vogue-africa-cover-yellow.png",
        sortOrder: 1,
        content: {
          imageSlides: [
            {
              src: "/portfolio/vogue-africa-cover-yellow.png",
              alt: "Editorial Vogue Africa cover concept: model in magenta tailoring and headwrap against a yellow field with masthead typography",
            },
            {
              src: "/portfolio/vogue-africa-cover-profile.png",
              alt: "Editorial Vogue Africa cover concept: profile portrait with floral and leaf statement earring in warm directional light",
            },
          ],
          videoSlides: [],
        },
      },
      {
        slug: "wonderland",
        eyebrow: "Portfolio · Wonderland",
        title: "Wonderland × Ahluwalia SS24.",
        intro:
          "Editorial frames from a Wonderland story tied to Ahluwalia's Spring–Summer 24 collection. Acknowledgements, shot on a saturated red field with the label's knit, patchwork, and tailoring signatures.",
        body: `<p><a href="https://ahluwalia.world/blogs/our-world/wonderland-magazine" target="_blank" rel="noreferrer">Ahluwalia's official write-up of its Wonderland Magazine feature</a> situates the season around "different perspectives": Creative Director Priya Ahluwalia discusses SS24 research into overlooked artists and makers, and techniques such as illusion knit, where jacquard and knit surfaces can read as a different colour depending on the angle.</p>
<p>The Wonderland set used a red seamless field so wardrobe, silhouette, and skin would read cleanly on camera. The selects below move from seated and standing full-lengths to duo framing. Each image is labelled in the carousel.</p>`,
        heroImage: "/portfolio/wonderland-01-seated.png",
        sortOrder: 2,
        content: {
          imageSlides: [
            {
              src: "/portfolio/wonderland-01-seated.png",
              alt: "Wonderland editorial: model seated on a red seamless set in Ahluwalia SS24 Calypso knit mini and Chikari patchwork boots",
            },
            {
              src: "/portfolio/wonderland-02-standing.png",
              alt: "Wonderland editorial: full-length portrait on red seamless backdrop in pink patterned mini dress and orange Chikari boots",
            },
            {
              src: "/portfolio/wonderland-03-three-quarter.png",
              alt: "Wonderland editorial: medium shot on red set in one-shoulder pink and green illusion-knit mini dress",
            },
            {
              src: "/portfolio/wonderland-04-blue-dress.png",
              alt: "Wonderland editorial: full-length portrait in pale blue one-shoulder midi and patchwork knee boots on red seamless",
            },
            {
              src: "/portfolio/wonderland-05-duo.png",
              alt: "Wonderland editorial: two models on red set in light blue satin dress and grey Akin tracksuit",
            },
          ],
          videoSlides: [],
        },
      },
      {
        slug: "runway",
        eyebrow: "Portfolio · Runway",
        title: "From training floor to show floor.",
        intro:
          "Runway work demands repeatable technique: pacing, posture, turns, and the ability to stay present when the room is watching. This section gathers standout clips from shows and practice, including Giorgio Armani.",
        body: `<p>The Giorgio Armani clip anchors this page: a luxury house where walk quality, restraint, and line matter as much as the clothes. The additional reels show how the same principles apply across different venues, from high-concept staging to more direct runway practice.</p>
<p>Each video is labelled below the player. Use the carousel controls to move between clips, or open a file directly if your browser prefers that for playback.</p>`,
        heroImage: "/portfolio/grazia-cover.png",
        sortOrder: 3,
        content: {
          imageSlides: [],
          videoSlides: [
            {
              src: vid("Giorgio Armani.mov"),
              title: "Giorgio Armani Runway",
              note: "A featured runway moment showcasing clean pacing, posture, and controlled transitions.",
            },
            {
              src: vid("Modeling on the Runway.mov"),
              title: "Modeling on the Runway",
              note: "Runway footage focused on presence, confidence, and floor command.",
            },
            {
              src: vid("Model Walking 1.mov"),
              title: "Model Walking 1",
              note: "Practice-to-performance runway progression clip.",
            },
            {
              src: vid("Model walking 2.mov"),
              title: "Model Walking 2",
              note: "Additional runway segment focused on consistency in movement.",
            },
            {
              src: vid("Model Walking 3.mov"),
              title: "Model Walking 3",
              note: "Runway clip highlighting controlled rhythm and presentation.",
            },
            {
              src: vid("Model walking.mov"),
              title: "Model Walking",
              note: "Editorial runway walk variation captured in live conditions.",
            },
          ],
        },
      },
      {
        slug: "bts",
        eyebrow: "Portfolio · BTS",
        title: "What the process looks like.",
        intro:
          "Behind-the-scenes footage shows how direction, timing, and environment shape the final image. These clips are from real set days and production moments.",
        body: `<p>BTS material matters for models learning the industry: you see pacing on set, how teams communicate, and how small adjustments in posture or timing change the frame. It is also honest proof of experience in professional environments.</p>
<p>Scroll the carousel with the previous and next controls, or open any clip in a new tab if inline playback is limited on your device.</p>`,
        heroImage: "/portfolio/grazia-cover.png",
        sortOrder: 4,
        content: {
          imageSlides: [],
          videoSlides: [
            {
              src: vid("BTS 1.mov"),
              title: "BTS 1",
              note: "Behind-the-scenes from set: preparation and direction before the final frame.",
            },
            {
              src: vid("BTS 2.mov"),
              title: "BTS 2",
              note: "Production moments that show how polished imagery comes together.",
            },
            {
              src: vid("BTS 3.mov"),
              title: "BTS 3",
              note: "On-set rhythm, styling, and the work behind the shot.",
            },
          ],
        },
      },
    ],
  });

  const pub = new Date();
  await prisma.journalPost.createMany({
    data: [
      {
        slug: "fashion-trends-models-should-watch",
        category: "Industry Trends",
        title: "Fashion Trends Models Should Watch This Season",
        excerpt:
          "The shifts in aesthetics, casting preferences, and content style that are shaping model demand right now.",
        body: "<p>Full article in progress. Expand this post from the admin when ready.</p>",
        status: "published",
        publishedAt: pub,
      },
      {
        slug: "what-agencies-look-for-now",
        category: "Industry Trends",
        title: "What Agencies and Clients Are Looking For Right Now",
        excerpt:
          "A practical breakdown of the qualities, presentation, and professionalism decision-makers are prioritising.",
        body: "<p>Full article in progress. Expand this post from the admin when ready.</p>",
        status: "published",
        publishedAt: pub,
      },
      {
        slug: "social-content-that-converts",
        category: "Industry Trends",
        title: "How Social Trends Are Reshaping Model Demand and Income",
        excerpt:
          "What is changing in platform behaviour, audience expectations, and brand casting so models can adapt early.",
        body: "<p>Full article in progress. Expand this post from the admin when ready.</p>",
        status: "published",
        publishedAt: pub,
      },
      {
        slug: "runway-casting-readiness-checklist",
        category: "Runway",
        title: "Runway and Casting Readiness: A Practical Checklist",
        excerpt:
          "A clear prep checklist models can use before castings, training sessions, and high-stakes opportunities.",
        body: "<p>Full article in progress. Expand this post from the admin when ready.</p>",
        status: "published",
        publishedAt: pub,
      },
    ],
  });

  await prisma.resourceItem.createMany({
    data: [
      {
        type: "Guide",
        title: "The Runway Walk Foundations Guide",
        description:
          "A 14-page PDF covering posture, stride, tempo and the small details castings notice.",
        sortOrder: 0,
      },
      {
        type: "Checklist",
        title: "Casting Day Preparation Checklist",
        description: "Everything to pack, prepare and rehearse the night before any casting.",
        sortOrder: 1,
      },
      {
        type: "Drills",
        title: "5-Minute Daily Walk Drills",
        description: "A short, repeatable routine to refine your walk between sessions.",
        sortOrder: 2,
      },
      {
        type: "Video",
        title: "Walk Analysis Walkthrough",
        description:
          "How to film a walk video that is actually useful for feedback: angle, light, and length.",
        sortOrder: 3,
      },
    ],
  });

  await prisma.lead.create({
    data: {
      name: "Sample Lead",
      email: "hello@example.com",
      message: "Seed entry. Delete from admin.",
      source: "contact",
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
