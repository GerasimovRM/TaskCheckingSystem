import React from 'react';
import PropTypes from 'prop-types';

import { Image, Flex, Box, Text } from '@chakra-ui/react';
import './TaskAttachment.css';

export default function TaskAttachment({ type, data }) {
  switch (type) {
    case 'input_output':
      return (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <th className="io_table_header io_table_border">Ввод</th>
            <th className="io_table_header io_table_border">Вывод</th>
          </thead>
          <tbody>
            <tr>
              <td className="io_table_border">
                {data.input.map((v) => (
                  <p>{v}</p>
                ))}
              </td>
              <td className="io_table_border">
                {data.output.map((v) => (
                  <p>{v}</p>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      );
    case 'image':
      return <Image src={data.url} alt={data.url} />;
    default:
      return <br />;
  }
}

TaskAttachment.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};
