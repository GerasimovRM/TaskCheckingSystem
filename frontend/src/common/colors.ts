import {ISolutionStatus} from "../models/ITask";
import {BsCircle, MdCheckCircle, MdRemoveCircle} from "react-icons/all";
import {IStatusTaskColor} from "../models/IStatusTaskColor";


export const getTaskStatusColorScheme = (status: ISolutionStatus | undefined | null): IStatusTaskColor => {
    switch (status) {
        case ISolutionStatus.ON_REVIEW:
            return {
                iconColor: 'yellow.500',
                progressColor: 'yellow',
                icon: MdRemoveCircle,
                textStatus: 'На проверке'
            }
        case ISolutionStatus.ERROR:
            return {
                iconColor: 'red.500',
                progressColor: 'red',
                icon: MdRemoveCircle,
                textStatus: 'Незачёт'
            }
        case ISolutionStatus.COMPLETE:
            return {
                iconColor: 'green.500',
                progressColor: 'green',
                icon: MdCheckCircle,
                textStatus: 'Зачёт'
            }
        case ISolutionStatus.COMPLETE_NOT_MAX:
            return {
                iconColor: 'green.500',
                progressColor: 'green',
                icon: MdCheckCircle,
                textStatus: 'Зачёт (неполный балл)'
            }
        default:
            return {
                iconColor: undefined,
                progressColor: 'gray',
                icon: BsCircle,
                textStatus: 'Не решена'
            }

    }
};