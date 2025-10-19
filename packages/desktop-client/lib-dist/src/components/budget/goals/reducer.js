export const DEFAULT_PRIORITY = 1;
export const getInitialState = (template) => {
    const type = template?.type;
    switch (type) {
        case 'simple':
            return {
                template,
                displayType: 'simple',
            };
        case 'percentage':
            return {
                template,
                displayType: 'percentage',
            };
        case 'schedule':
            return {
                template,
                displayType: 'schedule',
            };
        case 'periodic':
            return {
                template,
                displayType: 'week',
            };
        case 'spend':
        case 'by':
            throw new Error('Goal is not yet supported');
        case 'remainder':
            throw new Error('Remainder is not yet supported');
        case 'limit':
            throw new Error('Limit is not yet supported');
        case 'average':
        case 'copy':
            return {
                template,
                displayType: 'historical',
            };
        case 'goal':
            throw new Error('Goal is not yet supported');
        case 'error':
            throw new Error('An error occurred while parsing the template');
        default:
            throw new Error(`Unknown template type: ${type}`);
    }
};
const changeType = (prevState, visualType) => {
    switch (visualType) {
        case 'simple':
            if (prevState.template.type === 'simple') {
                return prevState;
            }
            return {
                displayType: visualType,
                template: {
                    directive: 'template',
                    type: 'simple',
                    monthly: 5,
                    priority: DEFAULT_PRIORITY,
                },
            };
        case 'percentage':
            if (prevState.template.type === 'percentage') {
                return prevState;
            }
            return {
                displayType: visualType,
                template: {
                    directive: 'template',
                    type: 'percentage',
                    percent: 15,
                    previous: false,
                    category: 'total',
                    priority: DEFAULT_PRIORITY,
                },
            };
        case 'schedule':
            if (prevState.template.type === 'schedule') {
                return prevState;
            }
            return {
                displayType: visualType,
                template: {
                    directive: 'template',
                    type: 'schedule',
                    name: '',
                    priority: DEFAULT_PRIORITY,
                },
            };
        case 'week':
            if (prevState.template.type === 'periodic') {
                return prevState;
            }
            return {
                displayType: visualType,
                template: {
                    directive: 'template',
                    type: 'periodic',
                    amount: 5,
                    period: {
                        period: 'week',
                        amount: 1,
                    },
                    starting: '',
                    priority: DEFAULT_PRIORITY,
                },
            };
        case 'historical':
            if (prevState.template.type === 'copy' ||
                prevState.template.type === 'average') {
                return prevState;
            }
            return {
                displayType: visualType,
                template: {
                    directive: 'template',
                    type: 'average',
                    numMonths: 3,
                    priority: DEFAULT_PRIORITY,
                },
            };
        default:
            // Make sure we're not missing any cases
            throw new Error(`Unknown display type: ${visualType}`);
    }
};
function mapTemplateTypesForUpdate(state, template) {
    switch (state.template.type) {
        case 'average':
            switch (template.type) {
                case 'copy':
                    return {
                        ...state,
                        displayType: 'historical',
                        template: {
                            ...template,
                            directive: 'template',
                            type: 'copy',
                            lookBack: state.template.numMonths,
                            priority: state.template.priority,
                        },
                    };
                default:
                    break;
            }
            break;
        case 'copy':
            switch (template.type) {
                case 'average':
                    return {
                        ...state,
                        displayType: 'historical',
                        template: {
                            ...template,
                            directive: 'template',
                            type: 'average',
                            numMonths: state.template.lookBack,
                            priority: state.template.priority,
                        },
                    };
                default:
                    break;
            }
            break;
        default:
            break;
    }
    if (state.template.type === template.type) {
        const { type: _1, directive: _2, ...rest } = template;
        return {
            ...state,
            ...getInitialState({
                ...state.template,
                ...rest,
            }),
        };
    }
    console.error(`Template type mismatch: ${state.template.type} !== ${template.type}`);
    return state;
}
export const templateReducer = (state, action) => {
    switch (action.type) {
        case 'set-type':
            return {
                ...state,
                ...changeType(state, action.payload),
            };
        case 'set-template':
            return {
                ...state,
                ...getInitialState(action.payload),
            };
        case 'update-template':
            return mapTemplateTypesForUpdate(state, action.payload);
        default:
            return state;
    }
};
