export const htmlInitSnippet = `<script>
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_FPmflXhukgTw36iSFGLYDZoR2ZTLSUJDhrFO6aiiGZg',{api_host:'https://app.posthog.com'})
</script>`;

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
