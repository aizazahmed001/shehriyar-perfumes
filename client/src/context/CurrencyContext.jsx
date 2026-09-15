import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

const currencies = {
    PKR: { label: 'PKR', rate: 1, locale: 'en-PK' },
    INR: { label: 'INR', rate: 0.299, locale: 'en-IN' },
    USD: { label: 'USD', rate: 0.00358, locale: 'en-US' },
    EUR: { label: 'EUR', rate: 0.00331, locale: 'de-DE' },
    GBP: { label: 'GBP', rate: 0.00279, locale: 'en-GB' },
    AED: { label: 'AED', rate: 0.01315, locale: 'en-AE' },
    SAR: { label: 'SAR', rate: 0.01343, locale: 'ar-SA' }
};

const parseAmount = (value) => {
    if (typeof value === 'string') {
        return Number(value.replace(/[^0-9.]/g, '')) || 0;
    }
    return Number(value) || 0;
};

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'PKR');

    const changeCurrency = (nextCurrency) => {
        if (!currencies[nextCurrency]) return;
        localStorage.setItem('currency', nextCurrency);
        setCurrency(nextCurrency);
    };

    const formatPrice = (amountInInr) => {
        const selected = currencies[currency];
        const amount = parseAmount(amountInInr) * selected.rate;
        return new Intl.NumberFormat(selected.locale, {
            style: 'currency',
            currency,
            maximumFractionDigits: currency === 'PKR' || currency === 'INR' ? 0 : 2
        }).format(amount);
    };

    return (
        <CurrencyContext.Provider value={{ currency, currencies, changeCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
