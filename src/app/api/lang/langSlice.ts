import type { RootState } from "src/app/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SupportedLocales } from "src/theme/core/locale";

import { createSlice } from "@reduxjs/toolkit";

type LangProps = {
    value: string;
    label: string;
    icon: string;
    locale: SupportedLocales,
}

const initialState: LangProps = {
    value: 'vi',
    label: 'Vietnamese',
    icon: '/assets/icons/ic_flag_vi.svg',
    locale: 'viVN',
}

const langSlice = createSlice({
    name: 'lang',
    initialState,
    reducers: {
        changeLang: (state, action: PayloadAction<LangProps>) => action.payload
    },
});

export const {
    changeLang
} = langSlice.actions;

export default langSlice.reducer;

export const selectCurrentLang = (state: RootState) => state.lang;