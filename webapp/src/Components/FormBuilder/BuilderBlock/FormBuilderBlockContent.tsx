import React from 'react';

import EndAdornmentInputField from '@Components/FormBuilder/EndAdornmentInputFIeld';
import HeaderInputBlock from '@Components/FormBuilder/HeaderInputBlock';
import LongText from '@Components/FormBuilder/LongText';
import MatrixField from '@Components/FormBuilder/MatrixField';
import MultipleChoice from '@Components/FormBuilder/MultipleChoice';
import RatingField from '@Components/FormBuilder/RatingField';
import StartAdornmentInputField from '@Components/FormBuilder/StartAdornmentInputField';

import BetterInput from '@app/components/Common/input';
import { FormBuilderTagNames } from '@app/models/enums/formBuilder';
import { contentEditableClassNames } from '@app/utils/formBuilderBlockUtils';

export default function FormBuilderBlockContent({ tag, position, reference, field, id }: any) {
    const renderBlockContent = () => {
        switch (tag) {
            case FormBuilderTagNames.LAYOUT_HEADER1:
            case FormBuilderTagNames.LAYOUT_HEADER2:
            case FormBuilderTagNames.LAYOUT_HEADER3:
            case FormBuilderTagNames.LAYOUT_HEADER4:
            case FormBuilderTagNames.LAYOUT_HEADER5:
            case FormBuilderTagNames.LAYOUT_LABEL:
                return <HeaderInputBlock field={field} id={id} />;
            case FormBuilderTagNames.INPUT_SHORT_TEXT:
            case FormBuilderTagNames.INPUT_EMAIL:
            case FormBuilderTagNames.INPUT_NUMBER:
            case FormBuilderTagNames.INPUT_LINK:
            case FormBuilderTagNames.INPUT_DATE:
            case FormBuilderTagNames.INPUT_PHONE_NUMBER:
                return <EndAdornmentInputField field={field} id={id} />;
            case FormBuilderTagNames.INPUT_LONG_TEXT:
                return <LongText field={field} id={id} />;
            case FormBuilderTagNames.INPUT_CHECKBOXES:
            case FormBuilderTagNames.INPUT_MULTIPLE_CHOICE:
            case FormBuilderTagNames.INPUT_DROPDOWN:
            case FormBuilderTagNames.INPUT_RANKING:
                return <MultipleChoice field={field} id={id} />;
            case FormBuilderTagNames.INPUT_RATING:
                return <RatingField field={field} id={id} />;
            case FormBuilderTagNames.INPUT_MATRIX:
                return <MatrixField id={id} allowMultipleSelection={false} rows={[1, 2, 3]} columns={[1, 2, 3]} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full">
            <div data-position={position} data-tag={tag} ref={reference}>
                {renderBlockContent()}
            </div>
        </div>
    );
}
