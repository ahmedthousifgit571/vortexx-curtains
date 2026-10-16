/**
 * Decides before first paint whether the landing intro plays, so the overlay never
 * flashes for reduced-motion users or anyone without JS. Plays on every full load
 * of "/" (including refresh); client-side navigation back home doesn't replay it,
 * because this script only runs on hard loads.
 */
export const introScript = `(function(){try{if(location.pathname!=="/"||matchMedia("(prefers-reduced-motion: reduce)").matches)return;document.documentElement.setAttribute("data-intro","active")}catch(e){}})()`
