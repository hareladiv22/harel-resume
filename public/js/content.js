/* ============================================================
   CONTENT: this is the only file you need to edit to change text.
   Each object in S is one slide. Keep the commas and quotes.
   Slide types: hero, words, stats, timeline, cards, contact
   Colors: t1..t7 (see css/styles.css). light:1 = dark text on light bg.
   d = seconds before auto-advance.
   ============================================================ */
const NAME = "Harel Adiv";
const S = [
 {type:"hero", t:"t1", d:6, lines:["Hi, I’m","<em>Harel</em>","<em>Adiv.</em>"], sub:"Product Manager. Agile, data-driven, and hands-on with AI.", cta:"Tap to explore →"},
 {type:"words", t:"t2", d:10, light:1, items:[
  {w:"Think", t:"Market research and user feedback come first."},
  {w:"Build", t:"Roadmaps shaped by data, shipped with Agile."},
  {w:"Grow", t:"Go-to-market, partnerships and ROI."}]},
 {type:"stats", t:"t3", d:8, light:1, h:"By the<br><em>numbers.</em>", items:[
  {pre:"+", n:30, dec:0, suf:"%", l:"New customer acquisition, quarter over quarter", s:"Boostapp · B2B and B2C"},
  {pre:"+", n:25, dec:0, suf:"%", l:"User satisfaction", s:"Boostapp · data-driven product pivots"},
  {pre:"", n:10, dec:0, suf:"+", l:"B2B and B2C clients managed", s:"Freelance digital marketing"},
  {pre:"", n:4, dec:0, suf:"+", l:"Years across product, marketing and operations", s:"2022 – now"}]},
 {type:"timeline", t:"t4", d:11, h:"The <em>path.</em>", items:[
  {when:"2022 – 2023", name:"Tic Tac Eilat Ltd", text:"Senior Manager. Marketing, inventory, international procurement and logistics, plus hands-on support for daily operations."},
  {when:"2023 – 2025", name:"Boostapp", text:"Product Manager. Turned research and user feedback into KPI-driven UX improvements and ran go-to-market across teams."},
  {when:"Oct 2025 – now", name:"H.A Digital Marketing", text:"Freelance. A portfolio of 10+ B2B and B2C clients, driving brand growth and ROI."},
  {when:"2025 – 2028", name:"BBA, Management Information Systems", text:"The College of Academic Studies."}]},
 {type:"cards", t:"t5", d:11, h:"Three <em>moments.</em>", items:[
  {tag:"Boostapp", title:"Growing new customers", text:"Turned market research and direct user feedback into KPI-driven UX improvements for B2B and B2C.", big:"+30% QoQ"},
  {tag:"Boostapp", title:"Raising user satisfaction", text:"Pivoted products based on data-driven insights and kept the roadmap tight with Agile.", big:"+25%"},
  {tag:"Freelance", title:"Serving many clients at once", text:"Managing a diverse B2B and B2C portfolio, focused on brand growth and ROI.", big:"10+ clients"}]},
 {type:"cards", t:"t6", d:10, light:1, h:"Always<br><em>learning.</em>", items:[
  {tag:"2025 – 2028 · Degree", title:"BBA, Management Information Systems", text:"The College of Academic Studies"},
  {tag:"Course", title:"Product Management (PM101)", text:"Give & Tech"},
  {tag:"Course", title:"Front-End Development", text:"Tapuach Organization"},
  {tag:"Course", title:"Google PPC & SEO", text:"Udemy"}]},
 {type:"cards", t:"t1", d:10, h:"What I <em>bring.</em>", items:[
  {tag:"Product", title:"Roadmaps · Agile · Scrum · PMO", text:"Boostapp, Product Manager"},
  {tag:"Data", title:"SQL · Excel · GA4 & GTM", text:"KPI-driven decisions"},
  {tag:"Growth", title:"Google Ads · PPC & SEO · CSM", text:"Freelance, 10+ clients"},
  {tag:"AI & code", title:"Claude · GPT · Python · HTML, CSS, JS", text:"Hands-on with AI tools and front-end code"}]},
 {type:"cards", t:"t7", d:8, light:1, h:"Off the clock,<br><em>still curious.</em>", items:[
  {tag:"Volunteering", title:"Teaching teens to code", text:"Course instructor at Tapuach Organization: web development (HTML, CSS, JavaScript) plus personal guidance."},
  {tag:"Languages", title:"Hebrew & English", text:"Hebrew native, English fluent."}]},
 {type:"contact", t:"t4", d:8, h:"Let’s <em>talk.</em>", sub:"Hiring, collaborating, or just curious? My inbox is open.", items:[
  {k:"Email", v:"Hareladiv@gmail.com", href:"mailto:Hareladiv@gmail.com"},
  {k:"Phone", v:"+972 52-403-4600", href:"tel:+972524034600"},
  {k:"LinkedIn", v:"linkedin.com/in/harel-adiv-054680234", href:"https://www.linkedin.com/in/harel-adiv-054680234/"}]}
];
