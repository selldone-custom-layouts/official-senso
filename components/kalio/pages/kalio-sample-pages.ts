/*
 * Senso — the sample texts of the shop's own pages.
 *
 * About us, Terms of use and Privacy come from the shop's profiles in the
 * Selldone dashboard. Until the shop writes them, each page shows general
 * text under KalioSampleNote ("Sample text — the shop writes its own"), as
 * the owner asked: full pages, clearly marked as a test, never a promise.
 * The text suits a single shop that sells everything itself (no sellers).
 *
 * Nothing here is a promise: the terms do not form an agreement and the
 * policy is not the shop's policy. Dates, numbers and names are examples.
 */

export interface Section {
  title: string;
  text: string[];
}

export function termsSample(shop: string): { short: string[]; sections: Section[] } {
  return {
    short: [
      `${shop} sells and ships every product itself.`,
      "You pay at checkout, or on delivery where offered.",
      "Report a damaged or wrong item within 7 days.",
      "Every order has a message thread with the shop.",
    ],
    sections: [
      {
        title: "Who we are",
        text: [`${shop} is an online electronics shop. We choose, stock, pack and send every product you see here.`],
      },
      {
        title: "Your account",
        text: [
          "You need an account, or a guest checkout where the shop offers one, to order. Keep your sign-in details to yourself and tell us if you think someone else has used them.",
          "Sample paragraph: a fuller explanation would go here, written in plain words, with examples of what this means for an order.",
        ],
      },
      {
        title: "Orders and prices",
        text: [
          "Prices are shown with taxes as stated at checkout. A deal's saving is shown on the product and taken off in the cart. An order is placed when you confirm it, and accepted when we confirm it.",
        ],
      },
      {
        title: "Payment",
        text: [`You pay at checkout, or on delivery where cash on delivery is offered. Card payments are handled by the payment provider and are not stored by ${shop}.`],
      },
      {
        title: "Shipping and delivery",
        text: ["Delivery times and costs are shown before you pay. You can follow the order and message us from your account or the order page."],
      },
      {
        title: "Returns and refunds",
        text: [
          "If something arrives damaged, faulty or wrong, tell us from the order page within 7 days. Unopened items can be returned within 30 days (example).",
        ],
      },
      {
        title: "Warranty",
        text: ["Products carry the maker's warranty where one is stated on the product page. Keep your order page: it is your receipt."],
      },
      {
        title: "Changes to these terms",
        text: ["We may update these terms. The date at the top shows the latest version."],
      },
    ],
  };
}

export function privacySample(shop: string): { short: string[]; sections: Section[] } {
  return {
    short: [
      "We use your details to take and deliver orders.",
      "Couriers see only what they need to deliver.",
      "We do not sell your data.",
      "You choose which optional cookies to allow.",
    ],
    sections: [
      {
        title: "What we collect",
        text: ["Your name, contact details and delivery address; what you order; and how you use the shop (pages viewed, searches)."],
      },
      {
        title: "Why we use it",
        text: [
          "To take and deliver your orders, to answer your messages about an order, to keep the shop secure and to improve it.",
          "Sample paragraph: a fuller explanation would go here, written in plain words, with an example for each use.",
        ],
      },
      {
        title: "Who sees it",
        text: [`${shop} and the courier who delivers your order see what they need for it. Payment providers handle card details. We do not sell your data.`],
      },
      {
        title: "How long we keep it",
        text: ["Order records for as long as the law requires; your account until you close it."],
      },
      {
        title: "Your rights",
        text: ["You can see, correct, download or delete your data, and say no to marketing at any time."],
      },
      {
        title: "Cookies",
        text: ["Essential cookies keep you signed in and your cart full. Anything optional is your choice, below."],
      },
    ],
  };
}

export function aboutSample(shop: string) {
  return {
    title: "Tech you can trust, at prices that make sense",
    lead: "We started with a simple idea: the gear people use every day — laptops, headphones, cameras, storage — should be easy to compare, honestly priced and quick to arrive.",
    text: [
      `So ${shop} keeps its range short and well chosen, shows every saving plainly, and sends every order itself from our store in Miami (example). When something goes wrong, you talk to the people who packed it.`,
    ],
    values: [
      { title: "Real prices", text: "The price you see is the one you pay. A deal shows what you save, never a made-up “was” price." },
      { title: "Fast delivery from Miami", text: "Orders leave our store quickly, and you can follow them from your order page (example)." },
      { title: "Easy returns", text: "Changed your mind? Ask from the order page; we make it simple." },
      { title: "Real help", text: "Every order has a message thread with the shop. People answer, not bots." },
    ],
    timeline: [
      { when: "2024", text: "The first products go online. (Example.)" },
      { when: "2025", text: "Delivery across Miami starts. (Example.)" },
      { when: "Today", text: "A full range of everyday tech, one checkout. (Example.)" },
    ],
    sign: `— the ${shop} team`,
  };
}

/** A shop page's text with its markup taken out, for "is it empty?". */
export function plainText(html: string | null | undefined): string {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
