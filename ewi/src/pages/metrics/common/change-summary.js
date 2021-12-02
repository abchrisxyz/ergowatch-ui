import { useState, useEffect } from "react";

import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

import { API_ROOT } from "../../../config";

import './change-summary.css';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';


const ChangeSummary = ({ id, keys, headers, fields, labels, toFixed = 0, units = "" }) => {
  const [data, setData] = useState(undefined)

  function formatDiff(rawValue, addSign = false) {
    if (rawValue === null) return 'N/A'
    const sign = Math.sign(rawValue);
    const signString = sign === 0 || addSign === false ? '' : sign === 1 ? '+ ' : '- ';
    const value = Number(Math.abs(rawValue).toFixed(toFixed))
    return signString + value.toLocaleString('en') + units
  }

  useEffect(() => {
    const qry = API_ROOT + `/metrics/${id}/summary`;
    fetch(qry)
      .then(res => res.json())
      .then(res => {
        // Map each row to its own label so we can pick the ones we need
        const d = Object.assign({}, ...res.map((r) => ({ [r.col]: r })));
        setData(d);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (data === undefined) return null;

  return (
    <div className='change-summary'>
      <Table>
        <Thead>
          <Tr>
            {headers.map(h => <Th key={h}>{h}</Th>)}
          </Tr>
        </Thead>
        <Tbody>
          {keys.map((k) =>
            <Tr key={k}>
              <Td>{labels[k]}</Td>
              {fields.map((f, i) => <Td key={f}>{formatDiff(data[k][f], i !== 0)}</Td>)}
            </Tr>
          )}
        </Tbody>
      </Table>
    </div>
  );
}

export default ChangeSummary;
