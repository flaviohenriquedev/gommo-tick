import {useState} from "react";
import {View} from "react-native";

import {AppDateInput} from "../app-date-input/AppDateInput";
import {FieldShell, type PickerInputProps} from "../shared/InputPrimitives";

export type AppDateRangeValue = {
    end: Date | null;
    start: Date | null;
};

export type AppDateRangeInputProps = PickerInputProps & {
    onChange?: (value: AppDateRangeValue) => void;
    value?: AppDateRangeValue;
};

export function AppDateRangeInput({onChange, value, ...props}: AppDateRangeInputProps) {
    const [range, setRange] = useState<AppDateRangeValue>(value ?? {end: null, start: null});

    const updateRange = (field: keyof AppDateRangeValue, nextValue: Date) => {
        const nextRange = {...range, [field]: nextValue};
        setRange(nextRange);
        onChange?.(nextRange);
    };

    return (
        <FieldShell {...props}>
            <View className="gap-3">
                <AppDateInput placeholder="Data inicial" value={range.start} onChange={(nextValue) => updateRange("start", nextValue)}/>
                <AppDateInput placeholder="Data final" value={range.end} onChange={(nextValue) => updateRange("end", nextValue)}/>
            </View>
        </FieldShell>
    );
}
