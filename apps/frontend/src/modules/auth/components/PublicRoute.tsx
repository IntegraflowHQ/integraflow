import { GlobalSpinner } from '@/components';
import { useViewerQuery } from '@/generated/graphql';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleRedirect } from '../helper';

export default function PublicRoute({children}: {children: React.ReactNode}) {
    const navigate = useNavigate();
    const {loading} = useViewerQuery({
        onCompleted: ({viewer}) => {
            if (viewer) {
                handleRedirect(viewer, navigate)
            }
        }
    })

    if (loading) {
        return <GlobalSpinner />
    }

    return (
        <>{children}</>
    )
}
