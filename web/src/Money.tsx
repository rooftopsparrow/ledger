import React from 'react'
import { IsoCurrencyCode } from "./PlaidApi";

type MoneyProps = {
    value: number,
    // isoCode: IsoCurrencyCode,
    inverted?: boolean
    colorized?: boolean
}

export function Money (props: MoneyProps) {
    const isNegative = props.inverted ? props.value > 0 : props.value < 0
    const amount = Math.abs(props.value)
    const local = 'en-US'
    const formatOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: IsoCurrencyCode.USD
    }
    const classNames = props.colorized
        ? isNegative
            ? 'text-pink-500'
            : 'text-green-600'
        : ''
    return (
        <span className={classNames}>
            {isNegative ? '-' : ''}
            {amount.toLocaleString(local, formatOptions)}
        </span>
    )
}