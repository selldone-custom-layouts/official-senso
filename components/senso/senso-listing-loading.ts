/*
 * Senso — the listing tells the page when it starts a read.
 *
 * Selldone's SProductsListing reads its products in fetchData(withParent,
 * more). Senso's listing page (StorefrontPageProducts) shows its own loading
 * states — skeleton cards on the first read, the current cards dimmed with
 * an "Updating results…" pill on a new filter, sort or search, skeletons
 * appended on "load more" — so it needs to know when a read starts and
 * whether it is a "more". fetchData is wrapped once, before the first
 * listing is created, to emit "sn-fetch" (more: boolean); the page hears it
 * as @sn-fetch. The read itself is untouched.
 */
import SProductsListing from "@selldone/components-vue/storefront/products/listing/SProductsListing.vue";

const listing: any = SProductsListing;

if (listing.methods?.fetchData && !listing.__sensoLoading) {
  listing.__sensoLoading = true;
  const original = listing.methods.fetchData;
  listing.methods.fetchData = function (this: any, withParent = true, more = false) {
    if (!this.prevent_refetch) this.$emit("sn-fetch", !!more);
    return original.call(this, withParent, more);
  };
}
