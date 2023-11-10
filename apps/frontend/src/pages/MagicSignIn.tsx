import CompleteMagicSignIn from '@/modules/auth/components/CompleteMagicSignIn';
import PublicRoute from '@/modules/auth/components/PublicRoute';

export function MagicSignIn() {
    return (
        <PublicRoute>
            <CompleteMagicSignIn />
        </PublicRoute>
    );
}
