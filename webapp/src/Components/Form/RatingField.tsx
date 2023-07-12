import { useState } from 'react';

import _ from 'lodash';

import { FormFieldProps } from '@Components/Form/BetterCollectedForm';
import { Star, StarBorder } from '@mui/icons-material';

import { addAnswer, selectAnswer } from '@app/store/fill-form/slice';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';

export default function RatingField({ field, ans, enabled }: FormFieldProps) {
    const dispatch = useAppDispatch();
    const [hovered, setHovered] = useState(ans?.number || -1);
    const answer = useAppSelector(selectAnswer(field.id));
    return (
        <div className="w-fit mt-3">
            {_.range(field.properties?.steps || 5).map((index) => {
                const Component = index <= hovered ? Star : StarBorder;

                return (
                    <span
                        key={index}
                        onMouseOut={() => {
                            if (enabled) setHovered((ans?.number || answer?.number || 0) - 1 || -1);
                        }}
                        onClick={() => {
                            if (enabled) {
                                const answer: any = {
                                    field: {
                                        id: field.id
                                    }
                                };
                                answer.number = index + 1;
                                dispatch(addAnswer(answer));
                            }
                        }}
                        onMouseOver={() => {
                            if (enabled) setHovered(index);
                        }}
                    >
                        <Component fontSize="large" className={`pointer-events-none ${index <= hovered ? 'cursor-pointer text-yellow-500' : 'text-gray-400'} `} />
                    </span>
                );
            })}
        </div>
    );
}
