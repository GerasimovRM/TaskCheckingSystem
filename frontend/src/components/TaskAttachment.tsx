// @ts-ignore
// @ts-ignore

import React from 'react';

import {Image, Table, Tbody, Td, Th, Thead, Tr, Text, VStack} from '@chakra-ui/react';
import './TaskAttachment.css';
import {IAttachmentTask, IAttachmentTaskTypeName} from "../models/IAttachmentTask";
import {baseApi} from "../api/api";

export const TaskAttachment: (props: IAttachmentTask) => JSX.Element = (props: IAttachmentTask) => {
    console.log(props)
    switch (props.attachment_type) {
        case IAttachmentTaskTypeName.INPUT_OUTPUT:
            return (
                <Table
                    width="100%"
                    marginBottom="2vh"
                >
                    <Thead>
                        <Tr>
                            <Th className="io_table_header io_table_border">Ввод</Th>
                            <Th className="io_table_header io_table_border">Вывод</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr >
                            <Td className="io_table_border">
                                <VStack spacing={1} alignItems={"flex-start"}>
                                    {props.data.input.map((v, index) => (
                                        <Text whiteSpace={"pre-line"}>{v ? v : '\n'}</Text>
                                    ))}
                                </VStack>
                            </Td>
                            <Td className="io_table_border">
                                <VStack spacing={1} alignItems={"flex-start"}>
                                    {props.data.output.map((v, index) => (
                                        <Text whiteSpace={"pre-line"}>{v ? v : '\n'}</Text>
                                    ))}
                                </VStack>
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            );
        case IAttachmentTaskTypeName.IMAGE:
            return <Image src={`${baseApi}/task/load_image?image_id=${props.data.url}`} alt="Ошибка при загрузке изображения" />;
        default:
            return <br />;
    }
}