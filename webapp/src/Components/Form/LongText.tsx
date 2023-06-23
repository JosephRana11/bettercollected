import React, { ChangeEvent } from 'react';

import { useDispatch } from 'react-redux';

import BetterInput from '@app/components/Common/input';
import { AnswerDto, StandardFormQuestionDto } from '@app/models/dtos/form';
import { addAnswer, deleteAnswer } from '@app/store/fill-form/slice';

interface ILongTextProps {
    question: StandardFormQuestionDto;
    ans?: any;
    enabled?: boolean;
}

LongText.defaultProps = {
    enabled: false
};

export default function LongText({ ans, enabled, question }: ILongTextProps) {
    const dispatch = useDispatch();
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const answer = {} as AnswerDto;
        answer.field = { id: question.id };
        answer.text = event.target.value;

        if (answer.text !== '') {
            dispatch(addAnswer(answer));
        } else {
            dispatch(deleteAnswer(answer));
        }
    };

    return <BetterInput minRows={3} maxRows={5} multiline value={ans?.text || ans?.email || ans?.number || ans?.boolean || ans?.url || ans?.file_url || ans?.payment?.name} disabled={!enabled} fullWidth onChange={onChange} />;
}
