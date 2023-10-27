import { useState, useEffect } from "react";

// 오목
function Game2() {
  var row = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  var [start, setStart] = useState(true);
  var [color, setColor] = useState(''); // 돌의 색상
  var [clickedCell, setClickedCell] = useState([]); // 클릭한 셀의 위치

  useEffect(() => {
    let a = setTimeout(() => {
      setStart(false);
    }, 3000);
    return () => {
      clearTimeout(a);
    };
  }, []);

  const handleCellClick = (i,j) => {
    // 클릭한 셀의 위치가 배열에 추가되도록
    setClickedCell([...clickedCell, {i,j}]);
    // 현재 클릭된 셀의 돌의 색 저장
    const newColor = color === 'black' ? 'white' : 'black';
    // 현재 클릭된 셀의 돌 색 변경
    document.getElementById(`cell-${i}-${j}`).style.backgroundColor = newColor;
    // 현재 클릭된 돌의 색 변경
    setColor(newColor);
  }

  return (
    <div>
      {start == true ? <p>* 흑돌 먼저 시작 !</p> : <p>&nbsp;</p>}

      <table className="tb2" onClick={() => {
      }}>
        <tbody>
          {row.map(function (i) {
            return (
              <tr>
                {row.map(function (j) {
                  return <td 
                    id = {`cell-${i}-${j}`}
                    className = {clickedCell.some(a => a.i === i & a.j === j) ? color : ''} 
                    onClick={() => 
                    handleCellClick(i,j) 
                  }></td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Game2;