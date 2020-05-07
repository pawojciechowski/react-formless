import * as React from "react"
import {
    FormViewProps,
    StyledFormSchema,
    RenderOptions,
    FormSchema,
    StyledInputSchema,
    FormItemView,
    StyledInputsRenderMap
} from ".."
import { pickObject } from "../../../utils"
import { InputViewProps } from "./FormView"
import { styledInputsRenderMap } from "./PlainHtmlRenderMap"

const isKeyOf = <T extends any>(v: any, keys: string[] = []): v is keyof T =>
    typeof v === "string" && (keys.includes(v) || keys.length === 0)

export const StyledCellView = <T, T2 = any>(
    p: StyledFormViewProps<T, T2> & {
        cell: StyledInputSchema<T, T2> | keyof T
        styledInputsRenderMap: StyledInputsRenderMap<T2>
    }
) => {
    const setDelta = (key: keyof T) => (value: any) => p.setState({ ...p.state, [key]: value })
    const renderOptions: RenderOptions = pickObject(p, ["elementsRenderMap", "inputsRenderMap"])

    const getProps = <TKey extends keyof FormSchema<T>>(key: TKey, schema: FormSchema<T>[TKey]): InputViewProps => ({
        schema,
        state: p.state[key],
        setDelta: setDelta(key),
        renderOptions
    })

    if (isKeyOf<T>(p.cell)) {
        const f: keyof T = p.cell
        return <FormItemView {...getProps(f, p.schema[f])} />
    }
    const StyledFormItem = p.styledInputsRenderMap[p.cell.type]

    if (p.cell.type === "Row") {
        return (
            <StyledFormItem
                value={p.cell.value.map((f, i) => <StyledCellView {...p} key={`${i}`} cell={f} />) as any}
            />
        )
    }
    return <StyledFormItem value={p.cell.value as T2} />
}

type StyledFormViewProps<T, T2> = FormViewProps<T> & {
    styledSchema: StyledFormSchema<T, T2>
    styledInputsRenderMap?: Partial<StyledInputsRenderMap<T2>>
}
export const StyledFormView = <T extends any, T2 extends any>(p: StyledFormViewProps<T, T2>): React.ReactElement => (
    <>
        {p.styledSchema.map((e, index) => (
            <StyledCellView
                key={index}
                {...p}
                cell={e}
                styledInputsRenderMap={{ ...styledInputsRenderMap, ...(p.styledInputsRenderMap || {}) }}
            />
        ))}
    </>
)
