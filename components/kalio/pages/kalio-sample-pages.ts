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
 *
 * Each sentence or paragraph is its own key, in the visitor's language; the
 * pages call these functions at render time, so a language change follows.
 */

import { t } from "../i18n/kalio-i18n";

export interface Section {
  title: string;
  text: string[];
}

export function termsSample(shop: string): { short: string[]; sections: Section[] } {
  return {
    short: [
      t("senso.sample.terms.short.ships", "{shop} sells and ships every product itself.", { shop }),
      t("senso.sample.terms.short.pay", "You pay at checkout, or on delivery where offered."),
      t("sample.terms.short.report", "Report a damaged or wrong item within 7 days."),
      t("senso.sample.terms.short.thread", "Every order has a message thread with the shop."),
    ],
    sections: [
      {
        title: t("sample.terms.who.title", "Who we are"),
        text: [t("senso.sample.terms.who.p1", "{shop} is an online electronics shop. We choose, stock, pack and send every product you see here.", { shop })],
      },
      {
        title: t("sample.terms.account.title", "Your account"),
        text: [
          t("sample.terms.account.p1", "You need an account, or a guest checkout where the shop offers one, to order. Keep your sign-in details to yourself and tell us if you think someone else has used them."),
          t("sample.terms.account.p2", "Sample paragraph: a fuller explanation would go here, written in plain words, with examples of what this means for an order."),
        ],
      },
      {
        title: t("sample.terms.orders.title", "Orders and prices"),
        text: [
          t("senso.sample.terms.orders.p1", "Prices are shown with taxes as stated at checkout. A deal's saving is shown on the product and taken off in the cart. An order is placed when you confirm it, and accepted when we confirm it."),
        ],
      },
      {
        title: t("sample.terms.payment.title", "Payment"),
        text: [
          t("senso.sample.terms.payment.p1", "You pay at checkout, or on delivery where cash on delivery is offered. Card payments are handled by the payment provider and are not stored by {shop}.", { shop }),
        ],
      },
      {
        title: t("senso.sample.terms.delivery.title", "Shipping and delivery"),
        text: [t("senso.sample.terms.delivery.p1", "Delivery times and costs are shown before you pay. You can follow the order and message us from your account or the order page.")],
      },
      {
        title: t("sample.terms.returns.title", "Returns and refunds"),
        text: [
          t("senso.sample.terms.returns.p1", "If something arrives damaged, faulty or wrong, tell us from the order page within 7 days. Unopened items can be returned within 30 days (example)."),
        ],
      },
      {
        title: t("senso.sample.terms.warranty.title", "Warranty"),
        text: [t("senso.sample.terms.warranty.p1", "Products carry the maker's warranty where one is stated on the product page. Keep your order page: it is your receipt.")],
      },
      {
        title: t("sample.terms.changes.title", "Changes to these terms"),
        text: [t("sample.terms.changes.p1", "We may update these terms. The date at the top shows the latest version.")],
      },
    ],
  };
}

export function privacySample(shop: string): { short: string[]; sections: Section[] } {
  return {
    short: [
      t("sample.privacy.short.use", "We use your details to take and deliver orders."),
      t("senso.sample.privacy.short.couriers", "Couriers see only what they need to deliver."),
      t("sample.privacy.short.sell", "We do not sell your data."),
      t("sample.privacy.short.cookies", "You choose which optional cookies to allow."),
    ],
    sections: [
      {
        title: t("sample.privacy.collect.title", "What we collect"),
        text: [t("sample.privacy.collect.p1", "Your name, contact details and delivery address; what you order; and how you use the shop (pages viewed, searches).")],
      },
      {
        title: t("sample.privacy.why.title", "Why we use it"),
        text: [
          t("senso.sample.privacy.why.p1", "To take and deliver your orders, to answer your messages about an order, to keep the shop secure and to improve it."),
          t("sample.privacy.why.p2", "Sample paragraph: a fuller explanation would go here, written in plain words, with an example for each use."),
        ],
      },
      {
        title: t("sample.privacy.who.title", "Who sees it"),
        text: [
          t("senso.sample.privacy.who.p1", "{shop} and the courier who delivers your order see what they need for it. Payment providers handle card details. We do not sell your data.", { shop }),
        ],
      },
      {
        title: t("sample.privacy.keep.title", "How long we keep it"),
        text: [t("sample.privacy.keep.p1", "Order records for as long as the law requires; your account until you close it.")],
      },
      {
        title: t("sample.privacy.rights.title", "Your rights"),
        text: [t("sample.privacy.rights.p1", "You can see, correct, download or delete your data, and say no to marketing at any time.")],
      },
      {
        title: t("sample.privacy.cookies.title", "Cookies"),
        text: [t("senso.sample.privacy.cookies.p1", "Essential cookies keep you signed in and your cart full. Anything optional is your choice, below.")],
      },
    ],
  };
}

export function aboutSample(shop: string) {
  return {
    title: t("senso.sample.about.title", "Tech you can trust, at prices that make sense"),
    lead: t(
      "senso.sample.about.lead",
      "We started with a simple idea: the gear people use every day — laptops, headphones, cameras, storage — should be easy to compare, honestly priced and quick to arrive.",
    ),
    text: [
      t(
        "senso.sample.about.p1",
        "So {shop} keeps its range short and well chosen, shows every saving plainly, and sends every order itself from our store in Miami (example). When something goes wrong, you talk to the people who packed it.",
        { shop },
      ),
    ],
    values: [
      {
        title: t("senso.sample.about.values.prices.title", "Real prices"),
        text: t("senso.sample.about.values.prices.text", "The price you see is the one you pay. A deal shows what you save, never a made-up “was” price."),
      },
      {
        title: t("senso.sample.about.values.delivery.title", "Fast delivery from Miami"),
        text: t("senso.sample.about.values.delivery.text", "Orders leave our store quickly, and you can follow them from your order page (example)."),
      },
      {
        title: t("senso.sample.about.values.returns.title", "Easy returns"),
        text: t("senso.sample.about.values.returns.text", "Changed your mind? Ask from the order page; we make it simple."),
      },
      {
        title: t("senso.sample.about.values.help.title", "Real help"),
        text: t("senso.sample.about.values.help.text", "Every order has a message thread with the shop. People answer, not bots."),
      },
    ],
    timeline: [
      { when: "2024", text: t("senso.sample.about.timeline.first", "The first products go online. (Example.)") },
      { when: "2025", text: t("senso.sample.about.timeline.miami", "Delivery across Miami starts. (Example.)") },
      { when: t("sample.about.timeline.today.when", "Today"), text: t("senso.sample.about.timeline.today", "A full range of everyday tech, one checkout. (Example.)") },
    ],
    sign: t("sample.about.sign", "— the {shop} team", { shop }),
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
