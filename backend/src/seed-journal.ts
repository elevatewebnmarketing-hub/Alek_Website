import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    slug: "how-to-become-a-model-in-the-uk",
    category: "Career Advice",
    title: "How to Become a Model in the UK: A Complete 2025 Guide",
    excerpt:
      "Thinking about starting a modelling career in the UK? This complete guide covers everything — from what agencies look for, to building your portfolio, mastering the runway, and landing your first booking.",
    status: "published" as const,
    publishedAt: new Date("2025-03-10"),
    body: `
<p>The UK modelling industry is one of the most established and respected in the world. London in particular sits alongside New York, Paris, and Milan as a global fashion capital. But breaking into the industry takes more than a good look — it takes preparation, professionalism, and the right guidance.</p>

<p>Whether you are completely new to modelling or you have been working locally and want to level up, this guide gives you a clear, honest picture of what it takes to build a model career in the UK in 2025.</p>

<h2>Understanding the UK Modelling Industry</h2>

<p>The UK has a wide range of modelling opportunities. At the top end you have high-fashion editorial and runway work for London Fashion Week, but there is also significant demand for commercial, fitness, swimwear, plus-size, and mature models across a huge variety of brands and campaigns.</p>

<p>Knowing which part of the market suits you best is one of the first and most important things to figure out. Not every model is destined for the catwalk — and that is perfectly fine. Commercial models often earn consistently more than their editorial counterparts.</p>

<h2>What UK Agencies Look For</h2>

<p>Agencies vary widely in what they represent, but there are some qualities that almost every reputable UK agency will assess:</p>

<ul>
  <li><strong>Proportions and physicality</strong> — High-fashion agencies typically look for height (5'8" and above for women, 5'11" and above for men) and specific measurements, but commercial and curve agencies work with a much broader range of sizes and heights.</li>
  <li><strong>Versatility</strong> — Can you adapt your look for different campaigns? Agents want models who can cross between different types of work.</li>
  <li><strong>Professionalism</strong> — How you communicate, how punctual you are, and how you conduct yourself matters enormously. Agencies stake their reputation on the models they send to clients.</li>
  <li><strong>Photographs</strong> — Your portfolio is your most important tool. A small set of strong, well-shot images will always beat a large collection of inconsistent work.</li>
</ul>

<h2>Building Your Portfolio</h2>

<p>Your portfolio is the first thing an agency or client will judge you on. Start with clean, well-lit photographs that show your face, your body proportions, and your range. You do not need highly styled editorial images at the beginning — natural, clear shots often work better for initial submissions.</p>

<p>As you grow, look to work with emerging photographers, makeup artists, and stylists who are also building their books. These collaborative "TFP" (time for prints or trade for portfolio) shoots are a standard part of how new models build their books without large upfront costs.</p>

<p>Keep your portfolio focused and current. Remove images that no longer represent you well, and update it regularly as your look and skills develop.</p>

<h2>Your Comp Card</h2>

<p>A comp card (or zed card) is a printed or digital card that shows your key measurements, contact details, and a selection of your best images. It is what you leave with clients at castings and what agencies use to submit you for jobs.</p>

<p>A strong comp card should include a clear head shot, a full-length shot, and one or two additional images showing range. Your height, measurements, hair colour, and eye colour should all be clearly listed.</p>

<h2>Mastering the Runway</h2>

<p>Runway modelling is a skill in its own right. A strong runway walk is confident, purposeful, and relaxed — and it takes consistent practice to develop. The basics involve correct posture, a steady stride length, smooth turns, and understanding how to connect with the energy of a show.</p>

<p>If runway work is part of your ambition, investing in professional coaching early gives you a serious advantage over models who pick it up on the job. A trained eye can spot and correct habits — such as tension in the shoulders, an uneven stride, or dropped eye contact — that are almost impossible to self-correct without feedback.</p>

<h2>Social Media for Models</h2>

<p>Instagram and TikTok have become important tools for models in the UK. Agencies and clients regularly check your social media before deciding whether to book you. A clean, well-curated feed that reflects your look and personality works in your favour.</p>

<p>You do not need a huge following to be taken seriously — relevance and consistency matter more than numbers. Focus on posting images that represent the kind of work you want to attract, and engage genuinely with your audience.</p>

<h2>Finding the Right Agency</h2>

<p>Research agencies carefully before approaching them. Look at the models they represent, the brands they work with, and their reputation within the industry. Legitimate agencies make money by taking a commission on the work you book — they should never charge you an upfront fee to be represented.</p>

<p>Prepare a clear, professional submission: a small selection of your strongest images, your measurements, and a brief introduction. Follow their submission guidelines exactly — agencies receive hundreds of submissions and anything that deviates from the instructions tends to be ignored.</p>

<h2>Getting Your First Booking</h2>

<p>Your first paid booking is often the hardest to get, and the most important to make count. Arrive early, be easy to work with, take direction well, and say thank you. The modelling industry is built on relationships and word-of-mouth. The way you conduct yourself on a job directly influences whether you are called back.</p>

<p>Building a UK modelling career takes time. The models who last are the ones who treat it seriously, keep developing their skills, and stay professional in every room they walk into.</p>

<p>If you are serious about getting started on the right foot, working with a dedicated runway and brand coach gives you a focused path forward — rather than spending years learning by trial and error.</p>
    `.trim(),
  },
  {
    slug: "runway-walk-techniques-uk",
    category: "Runway Tips",
    title: "Runway Walk Techniques: How to Master the Catwalk Like a UK Professional",
    excerpt:
      "A strong runway walk is one of the most in-demand skills in the UK modelling industry. Learn the techniques that professional models use — from posture and stride to the perfect turnaround — and find out how to develop them with intention.",
    status: "published" as const,
    publishedAt: new Date("2025-03-24"),
    body: `
<p>The runway walk is one of the most recognisable things in fashion — and one of the most difficult to do well. What looks effortless on the catwalk is the result of hours of focused practice, professional feedback, and a deep understanding of how the body moves.</p>

<p>Whether you are preparing for your first casting or looking to sharpen a walk that has already taken you into shows, this guide breaks down the core techniques that UK models use to command a catwalk.</p>

<h2>The Foundation: Posture and Alignment</h2>

<p>Everything in a runway walk starts with posture. The spine should be tall and lengthened, the shoulders relaxed back and down, and the chin level — not tipped up or dropped toward the chest. The common mistake is holding the shoulders too high and tight, which creates tension that the audience can immediately see and feel.</p>

<p>Think of your posture not as "standing straight" but as actively lengthening through the crown of your head. This subtle distinction changes how your whole body carries itself. Your ribcage should feel open but not pushed forward — a pushed chest creates an artificial, stiff appearance on the runway.</p>

<h2>Getting Your Stride Right</h2>

<p>A runway stride is longer than a natural walking stride, but it should never look forced or mechanical. The foot should land heel-to-toe, with each step crossing slightly in front of the previous one — this creates the characteristic hip movement that reads well from the audience and the camera.</p>

<p>The pace is determined by the music and the creative direction of the show. Most runway walks sit at a moderate, confident pace — fast enough to show energy, controlled enough to let the clothes be seen. Rushing is one of the most common mistakes new models make, usually because of nerves.</p>

<p>Arms should swing naturally from the shoulders — not stiffly, and not with exaggerated movement. Some designers prefer a straighter arm position; others want a relaxed swing. Pay attention to any direction given in rehearsal and adapt accordingly.</p>

<h2>The Turnaround</h2>

<p>The turn at the end of the runway is where many models lose their composure. A clean turn is smooth, unhurried, and deliberate. Pivot on the ball of your foot, keep your head last (like a pirouette in dance — the head follows the body), and return into the walk without a visible reset moment.</p>

<p>Practice the turn separately from the walk. It is its own technique, and it will feel awkward before it feels natural. The key is consistency — the same turn, every time, at whatever pace the show demands.</p>

<h2>Facial Expression and Energy</h2>

<p>Facial expression on the runway is one of the most personal and brand-specific elements of a walk. High-fashion shows often favour a neutral, directional gaze — not a smile, but not a blank stare either. There should be intention behind the eyes: you are looking through the room, not at it.</p>

<p>Commercial and sportswear runways often want more energy and warmth. Read the brief, watch who you are walking for, and understand what emotional register the brand is operating in.</p>

<p>The biggest mistake is looking uncertain. Whatever the expression, it should read as deliberate and confident. Even if you are nervous, the audience should never see it.</p>

<h2>Timing and Music</h2>

<p>Professional models listen to the music and walk to it — not mechanically, beat-for-beat, but with an awareness of the rhythm and energy of what is playing. Music creates the emotional atmosphere of a show, and models who connect with it naturally elevate the entire presentation.</p>

<p>In rehearsal, pay close attention to where the music is when you hit key moments — your entrance, your turn, your exit. Shows are carefully choreographed, and your timing should fit the vision of the creative team.</p>

<h2>Common Mistakes to Avoid</h2>

<ul>
  <li><strong>Rushing</strong> — Almost always nerves. Slow down intentionally. The audience wants to see you and the garment.</li>
  <li><strong>Looking down</strong> — Eyes forward, always. Looking at your feet communicates insecurity.</li>
  <li><strong>Tense shoulders</strong> — The most visible sign of tension on the catwalk. Build shoulder relaxation into your warm-up routine before every walk.</li>
  <li><strong>Inconsistent stride</strong> — Uneven steps break the fluidity of the walk. Consistency is more important than any single stylistic choice.</li>
  <li><strong>Losing composure at the turn</strong> — Practise the turn until it is automatic.</li>
</ul>

<h2>Practising at Home</h2>

<p>You can develop the foundations of a runway walk without a catwalk. Practice walking in a straight line across a hallway or long room, focusing on one element at a time — posture one session, stride the next, turn the next. Film yourself from the front and side so you can see what the audience sees.</p>

<p>Wear the heels (or flat shoes) you intend to walk in for shows. The walk changes significantly with different footwear, and you want to build muscle memory specific to what you will actually wear.</p>

<h2>When to Get Professional Coaching</h2>

<p>Self-directed practice has limits. A professional coach watches you walk, identifies the specific habits that are holding you back, and gives you targeted exercises and corrections. The improvements that come from even a single session with an experienced runway coach can take months to achieve on your own.</p>

<p>In the UK modelling market, agencies and clients can tell immediately whether a model has had runway training. It is one of the clearest markers that separates models who get booked repeatedly from those who get one or two castings and are not called back.</p>

<p>If you are serious about runway work, coaching is not an optional extra — it is one of the most direct investments you can make in your career.</p>
    `.trim(),
  },
  {
    slug: "what-uk-modelling-agencies-look-for",
    category: "Industry Insights",
    title: "What UK Modelling Agencies Really Look For (2025 Edition)",
    excerpt:
      "Getting signed by a UK modelling agency is competitive — but agencies are looking for more than just measurements. Discover what really matters at submissions and castings, and how to make yourself stand out.",
    status: "published" as const,
    publishedAt: new Date("2025-04-07"),
    body: `
<p>Every year, thousands of people in the UK submit to modelling agencies hoping to be signed. A much smaller number actually make it through. Understanding what agencies are genuinely looking for — beyond the obvious — gives you a significant advantage over the majority of applicants who are guessing.</p>

<p>This is not a list of physical requirements you either meet or do not. UK agencies in 2025 are looking for a combination of factors, and many of them are entirely within your control.</p>

<h2>Physical Requirements in the UK</h2>

<p>Physical requirements vary significantly depending on the type of modelling you are pursuing. High-fashion agencies that place models in editorial work and on London Fashion Week runways typically have the most specific requirements — height, proportions, and a particular aesthetic quality that is difficult to define but instantly recognisable.</p>

<p>Commercial agencies, curve agencies, fitness agencies, and mature modelling divisions all operate with different (and often much more inclusive) criteria. The UK market for commercial modelling is enormous, covering advertising, e-commerce, catalogue, and lifestyle campaigns for brands across every sector.</p>

<p>Knowing which type of agency is right for you — and submitting to the ones that are genuinely a match — will save you considerable time and rejection.</p>

<h2>Portfolio Quality</h2>

<p>This is the area where many aspiring models lose agency interest before they have even walked through the door. A portfolio does not need to be large, but it does need to be strong.</p>

<p>Agencies are looking for images that show your face clearly, your body proportions accurately, and ideally some range — different moods, different lighting, different styling. Overly styled or heavily retouched images often work against you: agents want to see the real you, not a polished version that does not exist on a casting.</p>

<p>If your images are not yet where they need to be, invest in them before you submit. Work with photographers whose style suits the market you are targeting. A small collection of excellent images is far more powerful than a large collection of mediocre ones.</p>

<h2>Professionalism and Attitude</h2>

<p>This is consistently one of the things that agents mention first when asked what they look for — and it is consistently underestimated by new models. The modelling industry is built on reputation and relationships. Agencies stake their professional standing on every model they send to a client.</p>

<p>Professionalism includes how you write your submission email, how promptly you respond to enquiries, how you behave at a casting or go-see, and how you communicate if something goes wrong. Models who are easy to work with, reliable, and positive to be around get called back. Those who are difficult, unpunctual, or high-maintenance do not — regardless of their look.</p>

<p>This cannot be faked in person. Build genuine professional habits from the start of your career.</p>

<h2>Social Media Presence</h2>

<p>In 2025, your social media profile is part of your portfolio. Most UK agencies will look at your Instagram before or shortly after receiving your submission. A clean, well-curated feed that is consistent with your look and the type of work you want to attract will support your submission — while a chaotic or conflicting feed can undermine it.</p>

<p>You do not need tens of thousands of followers to be considered. What matters is that your presence looks intentional. Models with a genuine audience — even a modest one — are increasingly attractive to commercial clients who want to add social amplification to their campaigns.</p>

<h2>Runway and Movement Skills</h2>

<p>For models pursuing fashion, editorial, or runway opportunities, how you move matters enormously. A strong runway walk immediately communicates to an agent that you are prepared and serious about this sector of the industry. It also suggests that you are coachable, disciplined, and willing to invest in your craft.</p>

<p>Many models show up to castings for runway-based work without ever having had professional training. Those who have — even a single coaching session — carry themselves differently. Agents and clients notice.</p>

<p>If runway is part of your ambition, treat your walk as a skill to be developed, not a natural ability you either have or do not. It is learned, and it is learnable.</p>

<h2>How to Approach Agencies</h2>

<p>Follow submission guidelines exactly. Agencies publish specific instructions about how they want to be contacted, what images to include, and what measurements to provide. Deviating from these guidelines suggests that you cannot follow a brief — not a quality that recommends you to a client-facing business.</p>

<p>Be selective about who you submit to. Research agencies thoroughly before approaching them. Look at the models they represent and the brands they work with. If there is a mismatch between their roster and your look, acknowledge it and move on rather than submitting everywhere and hoping for the best.</p>

<p>If you do not hear back, do not send repeated follow-up messages. Agencies are busy and under-resourced. If they are interested, they will contact you. If they are not, move to the next one on your research list.</p>

<h2>Red Flags to Avoid</h2>

<ul>
  <li><strong>Agencies that charge upfront fees</strong> — Legitimate agencies earn commission on the work they book for you. They should never ask for payment to join their books.</li>
  <li><strong>Agencies that guarantee work</strong> — No agency can guarantee bookings. Anyone who promises otherwise is not operating legitimately.</li>
  <li><strong>Submissions via social media DMs</strong> — Most reputable agencies do not accept submissions through Instagram messages. Use the submission process listed on their official website.</li>
</ul>

<h2>The Long View</h2>

<p>Getting signed by an agency is a significant milestone, but it is not the end of the work — it is the beginning. Models who build lasting careers in the UK do so by consistently developing their skills, maintaining their professional standards, and adapting to what the market wants.</p>

<p>The models who agencies keep on their books and actively push to clients are the ones who make every booking count. They arrive prepared, they take direction, they deliver what the brief asks for, and they leave a good impression on everyone in the room.</p>

<p>If you are working toward representation or your first significant bookings, the most important investment you can make is in your own preparation — your portfolio, your walk, your professionalism, and your understanding of the industry you want to work in.</p>
    `.trim(),
  },
];

async function main() {
  for (const post of posts) {
    await prisma.journalPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
    console.log(`Seeded: ${post.slug}`);
  }
  console.log("Done — 3 posts seeded.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
