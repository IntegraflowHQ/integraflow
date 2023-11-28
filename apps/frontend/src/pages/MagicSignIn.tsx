import PublicRoute from "@/layout/PublicRoute";
import CompleteMagicSignIn from "@/modules/auth/components/CompleteMagicSignIn";

export function MagicSignIn() {
    return (
        <PublicRoute>
            <CompleteMagicSignIn />
        </PublicRoute>
    );
}
