import { useEffect, useRef } from 'react';

import { allowedInputTags, allowedLayoutTags, allowedQuestionAndAnswerTags } from '@Components/FormBuilder/BuilderBlock/FormBuilderTagSelector';
import { Autocomplete, Paper, TextField, darken, lighten, styled, useTheme } from '@mui/material';

import { useModal } from '@app/components/modal-views/context';
import { BlockTypes, FormBuilderTagNames } from '@app/models/enums/formBuilder';
import { addFieldNewImplementation } from '@app/store/form-builder/slice';
import { useAppDispatch } from '@app/store/hooks';

const Fields = [
    {
        title: 'Elements with Label',
        items: allowedQuestionAndAnswerTags
    },
    {
        title: 'Layouts',
        items: allowedLayoutTags
    },
    {
        title: 'Elements without Label',
        items: allowedInputTags
    }
];

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: 'white',
    backgroundColor: darken(theme.palette.primary.contrastText, 0.7)
}));

const GroupItems = styled('ul')(({ theme }) => ({
    padding: 0,
    color: theme.palette.text.primary,
    backgroundColor: lighten(theme.palette.secondary.contrastText, 0.8)
}));

interface IField {
    id: FormBuilderTagNames;
    type: FormBuilderTagNames;
    label: string;
    icon: JSX.Element;
    blockType: BlockTypes;
}

const defaultFields = [...allowedLayoutTags, ...allowedInputTags, ...allowedQuestionAndAnswerTags];

export default function FormBuilderSpotlightModal({ index }: { index?: number }) {
    const { closeModal, modalProps } = useModal();

    const inputRef = useRef<HTMLInputElement>(null);

    const theme = useTheme();

    const dispatch = useAppDispatch();

    const handleFieldSelected = (selected: IField | null) => {
        if (!selected) return;
        dispatch(addFieldNewImplementation({ type: selected.type, position: index }));
        closeModal();
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div className="px-5 py-3 md:px-10 md:py-6 bg-black-800 text-white relative rounded-[4px] w-full md:max-w-[500px] min-h-52 flex flex-col justify-between">
            <Autocomplete
                id="search-fields"
                options={defaultFields}
                groupBy={(option) => option.blockType}
                getOptionLabel={(option) => option.label}
                sx={{
                    minWidth: 300,
                    maxWidth: '100%'
                }}
                PaperComponent={({ children }) => <Paper style={{ background: darken(theme.palette.primary.contrastText, 0.7) }}>{children}</Paper>}
                size="medium"
                fullWidth
                disablePortal
                onChange={(_, value) => handleFieldSelected(value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        inputMode="text"
                        InputProps={{
                            ...params.InputProps,
                            sx: {
                                paddingLeft: 0,
                                paddingRight: 0,
                                paddingTop: 0,
                                paddingBottom: 0,
                                height: 40,
                                fontSize: 16,
                                fontWeight: 400,
                                color: 'white',
                                content: 'none',
                                borderColor: 'white'
                            }
                        }}
                        inputRef={inputRef}
                        placeholder="What field would you like to add?"
                        fullWidth
                    />
                )}
                renderGroup={(params) => (
                    <li key={params.key} className="">
                        <GroupHeader>{params.group}</GroupHeader>
                        <GroupItems>{params.children}</GroupItems>
                    </li>
                )}
            />
            <div className="text-neutral-300 mt-4 text-xs flex flex-col items-start justify-start gap-3">
                <span className="bg-indigo-500 rounded-3xl px-2 py-1 font-semibold uppercase leading-none">Tips</span>
                <ol className="flex flex-col gap-2 list-inside list-decimal">
                    <li className="">
                        Enter the type of the field you want to add, select it with your arrow keys (&#8597;), and press <strong>Enter</strong> to see the magic.
                    </li>
                    <li className="">
                        Press <strong>Esc</strong> to close the builder spotlight.
                    </li>
                </ol>
            </div>
        </div>
    );
}
