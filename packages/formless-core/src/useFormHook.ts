import * as React from "react"
import { toFormState, toResult, validateForm } from "./forms"
import { FormState, FormSchema } from "."
import { F1, F0 } from "@formless/utils/types"
import { Result } from "@formless/utils/validators"

export type FormViewProps<T> = {
    setState: F1<FormState<T>>
    state: FormState<T>
    schema: FormSchema<T>
}

export type FormHookProps<T> = {
    initialValue?: Partial<T>
    schema: FormSchema<T>
    onSubmit?: F1<T>
}

export type FormHookResult<T> = {
    formViewProps: FormViewProps<T>
    onSubmitClick: F0
    onSubmitClickReset: F0
    result: Result<T, T>
    resetState: F0
}

export const useFormHook = <T>({ schema, ...p }: FormHookProps<T>): FormHookResult<T> => {
    const [state, setState] = React.useState(toFormState<T>(schema, (p.initialValue || {}) as any))
    const onSubmitClick = () => {
        const res = toResult(schema, state)
        if (res.type === "Err") setState(validateForm(schema, state))
        else if (p.onSubmit) p.onSubmit(res.value)
    }
    const resetState = () => setState(toFormState(schema, p.initialValue as any))
    return {
        onSubmitClick,
        onSubmitClickReset: () => {
            onSubmitClick()
            resetState()
        },
        result: toResult(schema, state),
        formViewProps: { state, setState, schema },
        resetState
    }
}
