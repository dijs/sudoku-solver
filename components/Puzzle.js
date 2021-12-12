function Block({ puzzle, x = 0, y = 0 }) {
  const cell = (dx, dy) => puzzle[y * 3 + dy][x * 3 + dx] || '';
  return (
    <table className="block">
      <tbody>
        <tr>
          <td>{cell(0, 0)}</td>
          <td>{cell(1, 0)}</td>
          <td>{cell(2, 0)}</td>
        </tr>
        <tr>
          <td>{cell(0, 1)}</td>
          <td>{cell(1, 1)}</td>
          <td>{cell(2, 1)}</td>
        </tr>
        <tr>
          <td>{cell(0, 2)}</td>
          <td>{cell(1, 2)}</td>
          <td>{cell(2, 2)}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default function Puzzle({ puzzle = [] }) {
  return (
    <table className="grid">
      <tbody>
        <tr>
          <td>
            <Block puzzle={puzzle} x={0} y={0} />
          </td>
          <td>
            <Block puzzle={puzzle} x={1} y={0} />
          </td>
          <td>
            <Block puzzle={puzzle} x={2} y={0} />
          </td>
        </tr>
        <tr>
          <td>
            <Block puzzle={puzzle} x={0} y={1} />
          </td>
          <td>
            <Block puzzle={puzzle} x={1} y={1} />
          </td>
          <td>
            <Block puzzle={puzzle} x={2} y={1} />
          </td>
        </tr>
        <tr>
          <td>
            <Block puzzle={puzzle} x={0} y={2} />
          </td>
          <td>
            <Block puzzle={puzzle} x={1} y={2} />
          </td>
          <td>
            <Block puzzle={puzzle} x={2} y={2} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
