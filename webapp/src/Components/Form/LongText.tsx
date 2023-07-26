import React, { ChangeEvent } from 'react';

import { FieldRequired } from '@Components/UI/FieldRequired';
import { useDispatch } from 'react-redux';

import BetterInput from '@app/components/Common/input';
import { AnswerDto, StandardFormQuestionDto } from '@app/models/dtos/form';
import { addAnswer, deleteAnswer } from '@app/store/fill-form/slice';

interface ILongTextProps {
    field: StandardFormQuestionDto;
    ans?: any;
    enabled?: boolean;
}

LongText.defaultProps = {
    enabled: false
};

export default function LongText({ ans, enabled, field }: ILongTextProps) {
    const dispatch = useDispatch();
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const answer = {} as AnswerDto;
        answer.field = { id: field.id };
        answer.text = event.target.value;

        if (answer.text !== '') {
            dispatch(addAnswer(answer));
        } else {
            dispatch(deleteAnswer(answer));
        }
    };

    return (
        <div className="relative w-full h-full">
            {field?.validations?.required && <FieldRequired className="top-0.5 right-1" />}
            <BetterInput
                placeholder={field?.properties?.placeholder}
                multiline
                sx={{
                    padding: '16 !important'
                }}
                InputProps={{
                    style: {
                        padding: 16
                    }
                }}
                inputProps={{
                    style: {
                        fontSize: 14
                    }
                }}
                minRows={3}
                maxRows={10}
                value={ans?.text || ans?.email || ans?.number || ans?.boolean || ans?.url || ans?.file_url || ans?.payment?.name}
                disabled={!enabled}
                fullWidth
                onChange={onChange}
                className="!mb-7"
            />
        </div>
    );
}
