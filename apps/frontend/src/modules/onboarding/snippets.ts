export const htmlInitSnippet = (appKey?: string) => {
    return `<script>
    (function(w, p) {w[p] = w[p] || function() { w[p].q = w[p].q || []; w[p].q.push(arguments); };})(window, "Integraflow");

    Integraflow("init", {
        appKey: ${appKey ? `"${appKey}"` : "INTEGRAFLOW_APP_KEY"}
    });
</script>
<script src="https://unpkg.com/integraflow-js/dist/web-bundle.js" async></script>`;
};

export const esmInitSnippet = (appKey?: string) => `import Integraflow from "integraflow-js";

const integraflowClient = Integraflow.init({
    appKey: ${appKey ? appKey : "INTEGRAFLOW_APP_KEY"}
});`;

export const webInstallSnippet = `npm install integraflow-js
# OR
yarn add integraflow-js
# OR
pnpm add integraflow-js`;

export const androidInstall = `dependencies {
    implementation 'com.integraflow.android:integraflow:1.+'
}`;

export const androidConfigure = `public class SampleApp extends Application {
    private static final String POSTHOG_API_KEY = "phc_FPmflXhukgTw36iSFGLYDZoR2ZTLSUJDhrFO6aiiGZg";
    private static final String POSTHOG_HOST = "https://app.posthog.com";

    @Override
    public void onCreate() {
        // Create a PostHog client with the given context, API key and host
        PostHog posthog = new PostHog.Builder(this, POSTHOG_API_KEY, POSTHOG_HOST)
            .captureApplicationLifecycleEvents() // Record certain application events automatically!
            .recordScreenViews() // Record screen views automatically!
            .build();

        // Set the initialized instance as a globally accessible instance
        PostHog.setSingletonInstance(posthog);

        // Now any time you call PostHog.with, the custom instance will be returned
        PostHog posthog = PostHog.with(this);
}`;

export const androidSendEvent = `Integraflow.with(this).capture("test-event");`;

export const htmlIdentify = `Integraflow("identify", user.id, {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    // ...other fields
})`;

export const esmIdentify = `integraflowClient.identify(user.id, {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    // ...other fields
})`;

export const htmlTrackEvent = `Integraflow("track", "checkout", {
    subtotal: cart.subtotal,
    tax_total: cart.tax_total,
    total: cart.total,
    discount_total: cart.discount_total,
    gift_card_total: cart.gift_card_total,
    gift_card_tax_total: cart.gift_card_tax_total,
    item_total: cart.items.reduce((total, item) => {
        return total + item.quantity
    }, 0),
    // ...other fields
})`;

export const esmTrackEvent = `integraflowClient.track("checkout", {
    subtotal: cart.subtotal,
    tax_total: cart.tax_total,
    total: cart.total,
    discount_total: cart.discount_total,
    gift_card_total: cart.gift_card_total,
    gift_card_tax_total: cart.gift_card_tax_total,
    item_total: cart.items.reduce((total, item) => {
        return total + item.quantity
    }, 0),
    // ...other fields
})`;
