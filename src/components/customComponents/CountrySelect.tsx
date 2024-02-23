import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { COUNTRIES, CountryType } from '../../constants/WorldCountries';

export default function CountrySelect(props:{onChange:any, required:boolean, margin?:string|number}) {
    const [selectedCountry, setSelectedCountry] = useState(null);

    const changeCountry = (value:string) => {
        props.onChange(value);
        setSelectedCountry(value);
    }

    return (
        <Autocomplete
            style={{margin:`${props.margin}`}}
            value={selectedCountry}
            onChange={(event:React.SyntheticEvent<Element, Event>, newValue:string|null) => {changeCountry(newValue)}}
            id="country-select"
            fullWidth
            options={COUNTRIES}
            autoHighlight
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <img
                loading="lazy"
                width="20"
                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                alt=""
            />
            {option.label} ({option.code}) +{option.phone}
            </Box>
            )}
            renderInput={(params) => (
                <TextField
                required={props.required}
                {...params}
                label="País"
                inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password',
                }}
                />
            )}
        />
    );
}