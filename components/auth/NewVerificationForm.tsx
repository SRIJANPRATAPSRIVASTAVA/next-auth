"use client"

import CardWrapper from '@/components/auth/card-wrapper';
import { BeatLoader } from "react-spinners"
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { newVerification } from '@/actions/new-verification';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';

const NewVerificationFrom = () => {
    const searchParams = useSearchParams()
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const token = searchParams.get("token")
    console.log(searchParams);

    const onSubmit = useCallback(() => {
        if (success || error) {
            return;
        }
        if (!token) {
            setError("Missing Token!!");
            return;
        };
        newVerification(token)
            .then(data => {
                setSuccess(data.success)
                setError(data.error)
            })
            .catch(() => {
                setError("something went wrong!! :[")
            })
    }, [token, success, error])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <div className="flex items-center w-full justify-center">
                {
                    !success && !error && (<BeatLoader />)
                }
                <FormSuccess message={success} />
                {
                    !success && (
                        <FormError message={error} />
                    )
                }
            </div>
        </CardWrapper>
    )
}

export default NewVerificationFrom
