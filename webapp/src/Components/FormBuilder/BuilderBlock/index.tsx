import React, { FocusEvent, FormEvent } from 'react';

import FormBuilderBlockContent from '@Components/FormBuilder/BuilderBlock/FormBuilderBlockContent';
import { uuidv4 } from '@mswjs/interceptors/lib/utils/uuid';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { batch } from 'react-redux';
import { v4 } from 'uuid';

import { FormBuilderTagNames } from '@app/models/enums/formBuilder';
import { resetBuilderMenuState, setAddNewField, setBuilderState } from '@app/store/form-builder/actions';
import { selectBuilderState } from '@app/store/form-builder/selectors';
import { IFormFieldState } from '@app/store/form-builder/types';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { isContentEditableTag } from '@app/utils/formBuilderBlockUtils';
import { getLastItem } from '@app/utils/stringUtils';

import CustomContentEditable from '../ContentEditable/CustomContentEditable';
import FormBuilderActionMenu from './FormBuilderActionMenu';
import FormBuilderTagSelector from './FormBuilderTagSelector';

interface IBuilderBlockProps {
    item: IFormFieldState;
    draggableId: string | number;
    setBackspaceCount: React.Dispatch<React.SetStateAction<number>>;
}

export default function FormBuilderBlock({ item, draggableId, setBackspaceCount }: IBuilderBlockProps) {
    const dispatch = useAppDispatch();
    const builderState = useAppSelector(selectBuilderState);

    const handleTagSelection = (type: FormBuilderTagNames) => {
        batch(() => {
            const field = {
                id: uuidv4(),
                type,
                position: item.position,
                replace: true
            };
            dispatch(setAddNewField(field));
            dispatch(resetBuilderMenuState());
        });
    };

    return (
        <Draggable key={item.position} draggableId={draggableId.toString()} index={item.position}>
            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                <div
                    ref={provided.innerRef}
                    className={`relative flex w-full flex-col ${snapshot.isDragging ? 'bg-brand-100' : 'bg-transparent'}`}
                    onFocus={(event: FocusEvent<HTMLElement>) => {}}
                    onBlur={(event: FocusEvent<HTMLElement>) => {}}
                    {...provided.draggableProps}
                >
                    <div className={`builder-block px-5 min-h-[40px] flex items-center md:px-[89px]`}>
                        <FormBuilderActionMenu
                            index={item.position}
                            id={item.id}
                            provided={provided}
                            addBlock={() => {}}
                            duplicateBlock={() => {}}
                            deleteBlock={() => {}}
                            className={builderState.activeFieldIndex === item.position ? 'visible' : 'invisible'}
                        />
                        {!isContentEditableTag(item.type) ? (
                            <FormBuilderBlockContent id={`item-${item.id}`} type={item.type} position={item.position} field={item} />
                        ) : (
                            <div className="flex flex-col w-full relative">
                                <div className={`w-full px-0 flex items-center min-h-[40px]`}>
                                    <CustomContentEditable
                                        id={item.id}
                                        tagName={item.type}
                                        type={item.type}
                                        value={item?.label ?? ''}
                                        position={item.position}
                                        activeFieldIndex={builderState.activeFieldIndex}
                                        placeholder={item.properties?.placeholder ?? 'Type / to open the commands menu'}
                                        className="text-base text-black-800"
                                        onChangeCallback={(event: FormEvent<HTMLElement>) => {
                                            setBackspaceCount(0);
                                            batch(() => {
                                                // @ts-ignore
                                                if (event.nativeEvent.inputType === 'deleteContentBackward' && getLastItem(builderState.fields[builderState.activeFieldId].label ?? '') === '/') {
                                                    dispatch(
                                                        setBuilderState({
                                                            isFormDirty: true,
                                                            menus: {
                                                                ...builderState.menus,
                                                                commands: {
                                                                    isOpen: false,
                                                                    atFieldUuid: ''
                                                                }
                                                            }
                                                        })
                                                    );
                                                }
                                                dispatch(
                                                    setBuilderState({
                                                        isFormDirty: true,
                                                        fields: {
                                                            ...builderState.fields,
                                                            [item.id]: { ...item, label: event.currentTarget.innerText }
                                                        }
                                                    })
                                                );
                                            });
                                        }}
                                        onFocusCallback={(event: React.FocusEvent<HTMLElement>) => {
                                            event.preventDefault();
                                            setBackspaceCount(0);
                                            dispatch(setBuilderState({ activeFieldIndex: item.position, activeFieldId: item.id }));
                                        }}
                                    />
                                </div>
                                {!!builderState.menus?.commands?.isOpen && builderState.menus?.commands?.atFieldUuid === item.id && (
                                    <FormBuilderTagSelector
                                        className={!!builderState.menus?.commands?.isOpen && builderState.menus?.commands?.atFieldUuid === item.id ? 'visible' : 'invisible'}
                                        closeMenu={() => {}}
                                        handleSelection={handleTagSelection}
                                        searchQuery={builderState.fields[builderState.activeFieldId].label?.split('/').slice(-1)[0]}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
}
