import axios from "axios";
import { useState, useEffect } from "react";

// 오목
function Game2() {
  var row = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  var [start, setStart] = useState(true);
  var [color, setColor] = useState(''); // 돌의 색상
  var [clickedCell, setClickedCell] = useState([]); // 클릭한 셀의 위치

  const handleCellClick = (i,j) => {
    // 클릭한 셀의 위치가 배열에 추가되도록
    setClickedCell([...clickedCell, {i,j}]);
    // 현재 클릭된 셀의 돌의 색 저장
    const newColor = color === 'black' ? 'white' : 'black';
    // 현재 클릭된 셀의 돌 색 변경
    document.getElementById(`cell-${i}-${j}`).style.backgroundColor = newColor;
    // 현재 클릭된 돌의 색 변경
    setColor(newColor);
    
    // 게임 상황
    const encodeGameBoard = () => {
      const encodedSituation = row.map(i => {
        return row.map(j => {
          const cellValue = clickedCell.some(cell => cell.i === i && cell.j === j)
            ? color === 'black' ? '1' : '2' : '0';
          return cellValue;
        }).join('');
      }).join('/');
  
      return encodedSituation;
    };

    const situationData = encodeGameBoard();

    axios.post('https://jsonplaceholder.typicode.com/posts', { // 임시 서버
      color : newColor === 'black' ? '1' : '2', // 1이면 흑, 2이면 백
      // location : { x : 14 - i, y : j}, // 왼쪽 아래 (1,1) 기준 좌표
      location : 14-i + ',' + j,
      // (13,1) => (1,1) , (13,2) => (1,2)
      // (12,1) => (2,1) , (12,2) => (2,2)
      situation : situationData // 게임 상황
    }).then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log('실패')
    })
  }

  useEffect(() => {
    let a = setTimeout(() => {
      setStart(false);
    }, 3000);
    return () => {
      clearTimeout(a);
    };
  }, []);

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
                    // 클릭된 셀의 위치값과 현재 i, j의 위치가 같으면 color
                    className = {clickedCell.some(a => a.i === i & a.j === j) ? color : ''}  
                    onClick={() => handleCellClick(i,j)}></td>;
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















