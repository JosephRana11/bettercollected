import React, { ChangeEvent } from 'react';

import { a } from 'msw/lib/glossary-de6278a9';
import { useDispatch } from 'react-redux';

import BetterInput from '@app/components/Common/input';
import { AnswerDto, StandardFormQuestionDto } from '@app/models/dtos/form';
import { addAnswer, deleteAnswer } from '@app/store/fill-form/slice';

interface IShortTextProps {
    question: StandardFormQuestionDto;
    ans?: any;
    enabled?: boolean;
}

ShortText.defaultProps = {
    enabled: false
};

export default function ShortText({ ans, enabled, question }: IShortTextProps) {
    const dispatch = useDispatch();
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const answer = {} as AnswerDto;
        answer.field = { id: question.id };
        answer.text = event.target.value;
        if (question.type === 'email') {
            answer.email = event.target.value;
        }
        if (answer.text !== '') {
            dispatch(addAnswer(answer));
        } else {
            dispatch(deleteAnswer(answer));
        }
    };

    return (
        // <StyledTextField>
        <BetterInput type={question?.type === 'email' ? 'email' : 'text'} value={ans?.text || ans?.email || ans?.number || ans?.boolean || ans?.url || ans?.file_url || ans?.payment?.name} disabled={!enabled} fullWidth onChange={onChange} />
        // </StyledTextField>
    );
}
