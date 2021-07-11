import './table.css';

const Table = ({ columnNames, rows }) => {
  return (
    <table>
      <TableHeader columnNames={columnNames} />
      <tbody>
        {rows.map((row, idx) => <TableRow key={idx} values={row} />)}
      </tbody>
    </table>
  );
}

const TableHeader = ({ columnNames }) => {

  return (
    <thead>
      <tr>
        {columnNames.map((name, idx) => <th key={idx}>{name}</th>)}
      </tr>
    </thead>
  );
}

const TableRow = ({ values }) => {
  return (
    <tr>
      {values.map((val, idx) => <td key={idx}>{val}</td>)}
    </tr>
  );
}

export default Table;

