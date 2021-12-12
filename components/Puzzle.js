function Block({ puzzle, highlight, x = 0, y = 0 }) {
  const cell = (dx, dy) => {
    const _x = x * 3 + dx;
    const _y = y * 3 + dy;
    return (
      <td
        className={highlight.x === _x && highlight.y === _y ? 'highlight' : ''}
      >
        {puzzle[_y][_x] || ''}
      </td>
    );
  };
  return (
    <table className="block">
      <tbody>
        <tr>
          {cell(0, 0)}
          {cell(1, 0)}
          {cell(2, 0)}
        </tr>
        <tr>
          {cell(0, 1)}
          {cell(1, 1)}
          {cell(2, 1)}
        </tr>
        <tr>
          {cell(0, 2)}
          {cell(1, 2)}
          {cell(2, 2)}
        </tr>
      </tbody>
    </table>
  );
}

export default function Puzzle({ puzzle = [], highlight }) {
  return (
    <table className="grid">
      <tbody>
        <tr>
          <td>
            <Block puzzle={puzzle} highlight={highlight} x={0} y={0} />
          </td>
          <td>
            <Block puzzle={puzzle} highlight={highlight} x={1} y={0} />
          </td>
          <td>
            <Block puzzle={puzzle} highlight={highlight} x={2} y={0} />
          </td>
        </tr>
        <tr>
          <td>
            <Block puzzle={puzzle} highlight={highlight} x={0} y={1} />
          </td>
          <td>
            <Block puzzle={puzzle} highlight={highlight} x={1} y={1} />
          </td>
          <td>
            <Block puzzle={puzzle} highlight={highlight} x={2} y={1} />
          </td>
        </tr>
        <tr>
          <td>
            <Block puzzle={puzzle} highlight={highlight} x={0} y={2} />
          </td>
          <td>
            <Block puzzle={puzzle} highlight={highlight} x={1} y={2} />
          </td>
          <td>
            <Block puzzle={puzzle} highlight={highlight} x={2} y={2} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
